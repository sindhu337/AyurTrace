package com.ayurtrace.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class TraceabilityResponse {

    // QR
    private String qrId;
    private LocalDateTime qrGeneratedAt;

    // Product
    private Long productId;
    private String productName;
    private String productDescription;
    private BigDecimal productPrice;
    private LocalDate manufacturingDate;
    private LocalDate expiryDate;
    private String productImageUrl;

    // Manufacturer
    private Long manufacturerDbId;
    private String manufacturerIdCode;
    private String manufacturerCompanyName;
    private String manufacturerOwnerName;
    private String manufacturerState;
    private String manufacturerDistrict;

    // Batch
    private Long batchId;
    private String batchNumber;
    private BigDecimal batchQuantity;
    private String batchQuantityUnit;
    private LocalDate harvestDate;
    private String batchLocation;

    // Cultivation
    private Long cultivationId;
    private String herbName;
    private String cultivationMethod;
    private LocalDate plantingDate;
    private LocalDate expectedHarvestDate;
    private String cultivationLocation;
    private BigDecimal cultivationLatitude;
    private BigDecimal cultivationLongitude;

    // Farmer
    private Long farmerDbId;
    private String farmerId;
    private String farmerName;
    private String farmerState;
    private String farmerDistrict;
    private BigDecimal farmerLatitude;
    private BigDecimal farmerLongitude;
}
