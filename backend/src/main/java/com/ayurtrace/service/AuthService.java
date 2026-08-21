package com.ayurtrace.service;

import com.ayurtrace.dto.*;
import com.ayurtrace.entity.*;
import com.ayurtrace.repository.CustomerRepository;
import com.ayurtrace.repository.FarmerRepository;
import com.ayurtrace.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Collections;

@Service
public class AuthService {

    @Autowired FarmerRepository farmerRepository;
    @Autowired CustomerRepository customerRepository;
    @Autowired PasswordEncoder encoder;
    @Autowired JwtUtils jwtUtils;

    // ─── Farmer Auth ──────────────────────────────────────────────────────────

    public AuthResponse authenticateFarmer(FarmerLoginRequest request) {
        Farmer farmer = farmerRepository.findByFarmerId(request.getFarmerId())
                .orElseThrow(() -> new RuntimeException("Error: Invalid Farmer ID or password."));

        if (farmer.getStatus() == FarmerStatus.PENDING) {
            throw new RuntimeException("Your registration is pending admin approval.");
        }
        if (farmer.getStatus() == FarmerStatus.BLOCKED) {
            throw new RuntimeException("Your account has been blocked. Please contact support.");
        }
        if (!encoder.matches(request.getPassword(), farmer.getPassword())) {
            throw new RuntimeException("Error: Invalid Farmer ID or password.");
        }

        org.springframework.security.core.userdetails.User principal =
                new org.springframework.security.core.userdetails.User(
                        farmer.getUsername(),
                        farmer.getPassword(),
                        Collections.singletonList(new SimpleGrantedAuthority(UserRole.ROLE_FARMER.name()))
                );
        Authentication auth = new UsernamePasswordAuthenticationToken(
                principal, null, principal.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(auth);

        return new AuthResponse(jwtUtils.generateJwtToken(auth), farmer.getFarmerId(),
                UserRole.ROLE_FARMER.name(), farmer.getId());
    }

    // ─── Customer Auth ────────────────────────────────────────────────────────

    public AuthResponse authenticateCustomer(CustomerLoginRequest request) {
        Customer customer = customerRepository.findByMobile(request.getMobile())
                .orElseThrow(() -> new RuntimeException("Error: Customer account not found."));

        if (!encoder.matches(request.getPassword(), customer.getPassword())) {
            throw new RuntimeException("Error: Invalid mobile number or password.");
        }

        org.springframework.security.core.userdetails.User principal =
                new org.springframework.security.core.userdetails.User(
                        customer.getUsername(),
                        customer.getPassword(),
                        Collections.singletonList(new SimpleGrantedAuthority(UserRole.ROLE_CUSTOMER.name()))
                );
        Authentication auth = new UsernamePasswordAuthenticationToken(
                principal, null, principal.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(auth);

        return new AuthResponse(jwtUtils.generateJwtToken(auth), customer.getMobile(),
                UserRole.ROLE_CUSTOMER.name(), customer.getId());
    }

    // ─── Farmer Registration ─────────────────────────────────────────────────

    @Transactional
    public void registerFarmer(FarmerRegisterRequest request) {
        if (farmerRepository.existsByEmail(request.getEmail()) ||
                customerRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already in use!");
        }
        if (farmerRepository.existsByMobile(request.getMobile()) ||
                customerRepository.existsByMobile(request.getMobile())) {
            throw new RuntimeException("Mobile number is already in use!");
        }

        Farmer farmer = new Farmer();
        farmer.setFullName(request.getFullName());
        farmer.setEmail(request.getEmail());
        farmer.setMobile(request.getMobile());
        farmer.setUsername(request.getEmail());
        farmer.setPassword(encoder.encode(request.getPassword()));
        farmer.setRole(UserRole.ROLE_FARMER);
        farmer.setAadharNo(request.getAadharNo());
        farmer.setRtcDocument(request.getRtcDocument());
        farmer.setAddress(request.getAddress());
        farmer.setState(request.getState());
        farmer.setDistrict(request.getDistrict());
        farmer.setPincode(request.getPincode());

        if (request.getGpsCoordinates() != null && request.getGpsCoordinates().contains(",")) {
            try {
                String[] coords = request.getGpsCoordinates().split(",");
                farmer.setLatitude(new BigDecimal(coords[0].trim()));
                farmer.setLongitude(new BigDecimal(coords[1].trim()));
            } catch (Exception ignored) { }
        }

        farmer.setStatus(FarmerStatus.PENDING);
        farmerRepository.save(farmer);
    }

    // ─── Customer Registration ────────────────────────────────────────────────

    @Transactional
    public void registerCustomer(CustomerRegisterRequest request) {
        if (customerRepository.existsByUsername(request.getUsername()) ||
                farmerRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username is already taken!");
        }
        if (customerRepository.existsByEmail(request.getEmail()) ||
                farmerRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already in use!");
        }
        if (customerRepository.existsByMobile(request.getMobile()) ||
                farmerRepository.existsByMobile(request.getMobile())) {
            throw new RuntimeException("Mobile number is already in use!");
        }

        Customer customer = new Customer();
        customer.setUsername(request.getUsername());
        customer.setPassword(encoder.encode(request.getPassword()));
        customer.setEmail(request.getEmail());
        customer.setFullName(request.getFullName());
        customer.setMobile(request.getMobile());
        customer.setRole(UserRole.ROLE_CUSTOMER);
        customer.setGender(request.getGender());
        customer.setDob(request.getDob());
        customer.setAddress(request.getAddress());
        customer.setState(request.getState());
        customer.setDistrict(request.getDistrict());
        customer.setPincode(request.getPincode());

        customerRepository.save(customer);
    }

    // ─── Legacy farmer approve (kept for existing Flutter compatibility) ──────

    @Transactional
    public String approveFarmer(Long id) {
        Farmer farmer = farmerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Farmer not found: " + id));
        farmer.setStatus(FarmerStatus.ACTIVE);
        String farmerId = "FARM" + String.format("%06d", farmer.getId());
        farmer.setFarmerId(farmerId);
        farmerRepository.save(farmer);
        return farmerId;
    }
}
