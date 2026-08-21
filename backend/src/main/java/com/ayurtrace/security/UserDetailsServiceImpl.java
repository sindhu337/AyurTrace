package com.ayurtrace.security;

import com.ayurtrace.entity.*;
import com.ayurtrace.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.Optional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    FarmerRepository farmerRepository;

    @Autowired
    CustomerRepository customerRepository;

    @Autowired
    ManufacturerLoginRepository manufacturerLoginRepository;

    @Autowired
    AdminRepository adminRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        // 1. Try admin
        Optional<Admin> admin = adminRepository.findByUsername(username);
        if (admin.isPresent()) {
            return new org.springframework.security.core.userdetails.User(
                    admin.get().getUsername(),
                    admin.get().getPassword(),
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_ADMIN"))
            );
        }

        // 2. Try manufacturer (username stored as manufacturerId in ManufacturerLogin)
        Optional<ManufacturerLogin> mfgLogin = manufacturerLoginRepository.findByManufacturerId(username);
        if (mfgLogin.isPresent()) {
            ManufacturerLogin ml = mfgLogin.get();
            return new org.springframework.security.core.userdetails.User(
                    ml.getManufacturerId(),
                    ml.getRegistration().getPassword(),
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_MANUFACTURER"))
            );
        }

        // 3. Try farmer
        Optional<Farmer> farmer = farmerRepository.findByUsername(username);
        if (farmer.isPresent()) {
            return buildUserDetails(farmer.get());
        }

        // 4. Try customer
        Optional<Customer> customer = customerRepository.findByUsername(username);
        if (customer.isPresent()) {
            return buildUserDetails(customer.get());
        }

        throw new UsernameNotFoundException("User not found with username: " + username);
    }

    private UserDetails buildUserDetails(User user) {
        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority(user.getRole().name()))
        );
    }
}
