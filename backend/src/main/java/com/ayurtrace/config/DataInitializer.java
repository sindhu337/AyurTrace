package com.ayurtrace.config;

import com.ayurtrace.entity.Admin;
import com.ayurtrace.entity.Manufacturer;
import com.ayurtrace.entity.ManufacturerLogin;
import com.ayurtrace.entity.ManufacturerStatus;
import com.ayurtrace.entity.ManufacturerAccountStatus;
import com.ayurtrace.repository.AdminRepository;
import com.ayurtrace.repository.ManufacturerRepository;
import com.ayurtrace.repository.ManufacturerLoginRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired AdminRepository adminRepository;
    @Autowired ManufacturerRepository manufacturerRepository;
    @Autowired ManufacturerLoginRepository manufacturerLoginRepository;
    @Autowired PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedAdmin();
        migrateExistingManufacturers();
    }

    private void seedAdmin() {
        String username = "ayurtrace";
        Optional<Admin> adminOpt = adminRepository.findByUsername(username);
        if (adminOpt.isPresent()) {
            Admin admin = adminOpt.get();
            if (!passwordEncoder.matches("ayur8055", admin.getPassword())) {
                admin.setPassword(passwordEncoder.encode("ayur8055"));
                adminRepository.save(admin);
                log.info("Admin account password updated with valid BCrypt hash.");
            } else {
                log.info("Admin account already exists with valid BCrypt hash – skipping seed.");
            }
            return;
        }

        // Password: ayur8055  –  BCrypt hashed
        Admin admin = new Admin();
        admin.setUsername(username);
        admin.setPassword(passwordEncoder.encode("ayur8055"));
        admin.setFullName("AYURTRACE Administrator");
        admin.setEmail("admin@ayurtrace.in");
        adminRepository.save(admin);

        log.info("Admin account seeded: username={}", username);
    }

    private void migrateExistingManufacturers() {
        List<Manufacturer> approvedMfgs = manufacturerRepository.findByStatus(ManufacturerStatus.APPROVED);
        for (Manufacturer mfg : approvedMfgs) {
            if (!manufacturerLoginRepository.findByRegistration(mfg).isPresent()) {
                // Generate a unique ID safely
                long seq = manufacturerLoginRepository.count() + 1;
                String mfgId = "AYM" + String.format("%06d", seq);
                while (manufacturerLoginRepository.existsByManufacturerId(mfgId)) {
                    seq++;
                    mfgId = "AYM" + String.format("%06d", seq);
                }

                ManufacturerLogin login = new ManufacturerLogin();
                login.setManufacturerId(mfgId);
                login.setRegistration(mfg);
                login.setAccountStatus(ManufacturerAccountStatus.ACTIVE);
                manufacturerLoginRepository.save(login);
                log.info("Created missing manufacturer_login for company={} with ID={}", mfg.getCompanyName(), mfgId);
            }
        }
    }
}
