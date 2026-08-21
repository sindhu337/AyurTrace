package com.ayurtrace.dto;

import com.ayurtrace.entity.Product;
import com.ayurtrace.entity.ProductStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class ProductResponse {
    private Long id;
    private String name;
    private String description;
    private String category;
    private BigDecimal price;
    private Integer stockQuantity;
    private String qualityInfo;
    private LocalDate manufacturingDate;
    private LocalDate expiryDate;
    private String imageUrl;
    private ProductStatus productStatus;
    private LocalDateTime createdAt;

    // Manufacturer info
    private Long manufacturerId;
    private String manufacturerCompanyName;
    private String manufacturerIdCode;  // AYM000001

    // Batch info
    private Long batchId;
    private String batchNumber;

    public static ProductResponse from(Product p, String manufacturerIdCode) {
        ProductResponse r = new ProductResponse();
        r.setId(p.getId());
        r.setName(p.getName());
        r.setDescription(p.getDescription());
        r.setCategory(p.getCategory());
        r.setPrice(p.getPrice());
        r.setStockQuantity(p.getStockQuantity());
        r.setQualityInfo(p.getQualityInfo());
        r.setManufacturingDate(p.getManufacturingDate());
        r.setExpiryDate(p.getExpiryDate());
        r.setImageUrl(p.getImageUrl());
        r.setProductStatus(p.getProductStatus());
        r.setCreatedAt(p.getCreatedAt());
        if (p.getManufacturer() != null) {
            r.setManufacturerId(p.getManufacturer().getId());
            r.setManufacturerCompanyName(p.getManufacturer().getCompanyName());
            r.setManufacturerIdCode(manufacturerIdCode);
        }
        if (p.getBatch() != null) {
            r.setBatchId(p.getBatch().getId());
            r.setBatchNumber(p.getBatch().getBatchNumber());
        }
        return r;
    }
}
