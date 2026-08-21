package com.ayurtrace.service;

import com.ayurtrace.dto.*;
import com.ayurtrace.entity.*;
import com.ayurtrace.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ayurtrace.security.JwtUtils;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired private AdminRepository adminRepository;
    @Autowired private FarmerRepository farmerRepository;
    @Autowired private ManufacturerRepository manufacturerRepository;
    @Autowired private ManufacturerLoginRepository manufacturerLoginRepository;
    @Autowired private ProductRepository productRepository;
    @Autowired private BatchRepository batchRepository;
    @Autowired private OrderRepository orderRepository;
    @Autowired private NotificationRepository notificationRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtUtils jwtUtils;

    // ─── Login ────────────────────────────────────────────────────────────────

    public AuthResponse login(AdminLoginRequest request) {
        Admin admin = adminRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Invalid username or password."));

        if (!passwordEncoder.matches(request.getPassword(), admin.getPassword())) {
            throw new RuntimeException("Invalid username or password.");
        }

        org.springframework.security.core.userdetails.User principal =
                new org.springframework.security.core.userdetails.User(
                        admin.getUsername(),
                        admin.getPassword(),
                        Collections.singletonList(new SimpleGrantedAuthority("ROLE_ADMIN"))
                );

        Authentication auth = new UsernamePasswordAuthenticationToken(
                principal, null, principal.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(auth);

        String jwt = jwtUtils.generateJwtToken(auth);
        return new AuthResponse(jwt, admin.getUsername(), "ROLE_ADMIN", 0L);
    }

    // ─── Dashboard Stats ─────────────────────────────────────────────────────

    public AdminDashboardStats getDashboardStats() {
        return new AdminDashboardStats(
                farmerRepository.count(),
                farmerRepository.countByStatus(FarmerStatus.PENDING),
                farmerRepository.countByStatus(FarmerStatus.ACTIVE),
                farmerRepository.countByStatus(FarmerStatus.BLOCKED),
                manufacturerRepository.count(),
                manufacturerRepository.countByStatus(ManufacturerStatus.PENDING),
                manufacturerRepository.countByStatus(ManufacturerStatus.APPROVED),
                manufacturerRepository.countByStatus(ManufacturerStatus.REJECTED),
                batchRepository.count(),
                productRepository.count(),
                orderRepository.count()
        );
    }

    // ─── Farmer Applications ─────────────────────────────────────────────────

    public List<FarmerResponse> getPendingFarmerApplications() {
        return farmerRepository.findByStatus(FarmerStatus.PENDING)
                .stream().map(FarmerResponse::from).collect(Collectors.toList());
    }

    public List<FarmerResponse> getAllFarmers() {
        return farmerRepository.findAll()
                .stream().map(FarmerResponse::from).collect(Collectors.toList());
    }

    public FarmerResponse getFarmerById(Long id) {
        Farmer f = farmerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Farmer not found"));
        return FarmerResponse.from(f);
    }

    @Transactional
    public FarmerResponse approveFarmer(Long id) {
        Farmer farmer = farmerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Farmer not found with id: " + id));

        if (farmer.getStatus() != FarmerStatus.PENDING) {
            throw new RuntimeException("Farmer application is not in PENDING state.");
        }

        farmer.setStatus(FarmerStatus.ACTIVE);

        // Generate unique FARM ID using padded DB id
        String farmerId = "FARM" + String.format("%06d", farmer.getId());
        farmer.setFarmerId(farmerId);
        farmerRepository.save(farmer);

        // Notify farmer
        sendNotification(farmer.getId(), "ROLE_FARMER",
                "Congratulations! Your registration has been approved. Your Farmer ID is: " + farmerId);

        return FarmerResponse.from(farmer);
    }

    @Transactional
    public FarmerResponse rejectFarmer(Long id) {
        Farmer farmer = farmerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Farmer not found with id: " + id));

        if (farmer.getStatus() != FarmerStatus.PENDING) {
            throw new RuntimeException("Farmer application is not in PENDING state.");
        }

        farmer.setStatus(FarmerStatus.BLOCKED);
        // No Farmer ID generated on rejection
        farmerRepository.save(farmer);

        sendNotification(farmer.getId(), "ROLE_FARMER",
                "Your registration application has been rejected. Please contact support.");

        return FarmerResponse.from(farmer);
    }

    @Transactional
    public FarmerResponse toggleFarmerBlock(Long id) {
        Farmer farmer = farmerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Farmer not found"));
        if (farmer.getStatus() == FarmerStatus.ACTIVE) {
            farmer.setStatus(FarmerStatus.BLOCKED);
        } else if (farmer.getStatus() == FarmerStatus.BLOCKED) {
            farmer.setStatus(FarmerStatus.ACTIVE);
        }
        farmerRepository.save(farmer);
        return FarmerResponse.from(farmer);
    }

    // ─── Manufacturer Applications ───────────────────────────────────────────

    public List<ManufacturerResponse> getPendingManufacturerApplications() {
        return manufacturerRepository.findByStatus(ManufacturerStatus.PENDING)
                .stream().map(ManufacturerResponse::from).collect(Collectors.toList());
    }

    public List<ManufacturerResponse> getAllManufacturers() {
        return manufacturerRepository.findAll()
                .stream().map(m -> {
                    ManufacturerResponse r = ManufacturerResponse.from(m);
                    manufacturerLoginRepository.findByRegistration(m)
                            .ifPresent(ml -> r.setManufacturerId(ml.getManufacturerId()));
                    return r;
                }).collect(Collectors.toList());
    }

    public ManufacturerResponse getManufacturerById(Long id) {
        Manufacturer m = manufacturerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Manufacturer not found"));
        ManufacturerResponse r = ManufacturerResponse.from(m);
        manufacturerLoginRepository.findByRegistration(m)
                .ifPresent(ml -> r.setManufacturerId(ml.getManufacturerId()));
        return r;
    }

    @Transactional
    public synchronized ManufacturerResponse approveManufacturer(Long id) {
        Manufacturer mfg = manufacturerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Manufacturer not found with id: " + id));

        if (mfg.getStatus() != ManufacturerStatus.PENDING) {
            throw new RuntimeException("Manufacturer application is not in PENDING state.");
        }

        mfg.setStatus(ManufacturerStatus.APPROVED);
        manufacturerRepository.save(mfg);

        // Generate unique AYM ID — count existing logins to get next sequence
        long seq = manufacturerLoginRepository.count() + 1;
        String mfgId = "AYM" + String.format("%06d", seq);

        // Ensure uniqueness in concurrent scenario
        while (manufacturerLoginRepository.existsByManufacturerId(mfgId)) {
            seq++;
            mfgId = "AYM" + String.format("%06d", seq);
        }

        ManufacturerLogin login = new ManufacturerLogin();
        login.setManufacturerId(mfgId);
        login.setRegistration(mfg);
        login.setAccountStatus(ManufacturerAccountStatus.ACTIVE);
        manufacturerLoginRepository.save(login);

        ManufacturerResponse r = ManufacturerResponse.from(mfg);
        r.setManufacturerId(mfgId);
        return r;
    }

    @Transactional
    public ManufacturerResponse rejectManufacturer(Long id) {
        Manufacturer mfg = manufacturerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Manufacturer not found with id: " + id));

        if (mfg.getStatus() != ManufacturerStatus.PENDING) {
            throw new RuntimeException("Manufacturer application is not in PENDING state.");
        }

        mfg.setStatus(ManufacturerStatus.REJECTED);
        manufacturerRepository.save(mfg);
        return ManufacturerResponse.from(mfg);
    }

    @Transactional
    public ManufacturerResponse toggleManufacturerBlock(Long id) {
        ManufacturerLogin ml = manufacturerLoginRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Manufacturer login not found"));
        if (ml.getAccountStatus() == ManufacturerAccountStatus.ACTIVE) {
            ml.setAccountStatus(ManufacturerAccountStatus.BLOCKED);
            ml.getRegistration().setStatus(ManufacturerStatus.BLOCKED);
        } else {
            ml.setAccountStatus(ManufacturerAccountStatus.ACTIVE);
            ml.getRegistration().setStatus(ManufacturerStatus.APPROVED);
        }
        manufacturerLoginRepository.save(ml);
        ManufacturerResponse r = ManufacturerResponse.from(ml.getRegistration());
        r.setManufacturerId(ml.getManufacturerId());
        return r;
    }

    // ─── Notifications ────────────────────────────────────────────────────────

    private void sendNotification(Long userId, String role, String message) {
        Notification n = new Notification();
        n.setUserId(userId);
        n.setUserRole(role);
        n.setMessage(message);
        n.setRead(false);
        n.setTimestamp(java.time.LocalDateTime.now());
        notificationRepository.save(n);
    }
}
