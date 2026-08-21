package com.ayurtrace.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "manufacturer_registration")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Manufacturer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "company_name", nullable = false, length = 150)
    private String companyName;

    @Column(name = "owner_name", nullable = false, length = 100)
    private String ownerName;

    @Column(unique = true, nullable = false, length = 100)
    private String email;

    @Column(nullable = false, length = 15)
    private String mobile;

    @Column(name = "ayush_license_no", unique = true, length = 50)
    private String ayushLicenseNo;

    @Column(name = "license_expiry")
    private LocalDate licenseExpiry;

    @Column(name = "license_document", length = 255)
    private String licenseDocument;

    @Column(name = "gst_number", length = 30)
    private String gstNumber;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(length = 50)
    private String state;

    @Column(length = 50)
    private String district;

    @Column(length = 10)
    private String pincode;

    @Column(nullable = false, length = 255)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ManufacturerStatus status = ManufacturerStatus.PENDING;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}
