package com.ayurtrace.dto;

import com.ayurtrace.entity.Manufacturer;
import com.ayurtrace.entity.ManufacturerStatus;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class ManufacturerResponse {
    private Long id;
    private String manufacturerId;   // AYM000001 — null until approved
    private String companyName;
    private String ownerName;
    private String email;
    private String mobile;
    private String ayushLicenseNo;
    private LocalDate licenseExpiry;
    private String licenseDocument;
    private String gstNumber;
    private String address;
    private String state;
    private String district;
    private String pincode;
    private ManufacturerStatus status;
    private LocalDateTime createdAt;

    public static ManufacturerResponse from(Manufacturer m) {
        ManufacturerResponse r = new ManufacturerResponse();
        r.setId(m.getId());
        r.setCompanyName(m.getCompanyName());
        r.setOwnerName(m.getOwnerName());
        r.setEmail(m.getEmail());
        r.setMobile(m.getMobile());
        r.setAyushLicenseNo(m.getAyushLicenseNo());
        r.setLicenseExpiry(m.getLicenseExpiry());
        r.setLicenseDocument(m.getLicenseDocument());
        r.setGstNumber(m.getGstNumber());
        r.setAddress(m.getAddress());
        r.setState(m.getState());
        r.setDistrict(m.getDistrict());
        r.setPincode(m.getPincode());
        r.setStatus(m.getStatus());
        r.setCreatedAt(m.getCreatedAt());
        return r;
    }
}
