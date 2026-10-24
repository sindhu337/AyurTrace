package com.ayurtrace.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "batches")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Batch {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cultivation_id", nullable = false)
    private Cultivation cultivation;

    @Column(unique = true, nullable = false)
    private String batchNumber;

    private BigDecimal quantity;
    private String quantityUnit;

    private LocalDate harvestDate;
    private String location;
    
    private BigDecimal latitude;
    private BigDecimal longitude;

    @Column(length = 1000)
    private String notes;

    @Column(unique = true)
    private String qrCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_manufacturer_id")
    private Manufacturer assignedManufacturer;

    private java.time.LocalDateTime assignedAt;
    private java.time.LocalDateTime reviewedAt;

    @Column(length = 1000)
    private String rejectionReason;

    @Enumerated(EnumType.STRING)
    private BatchStatus status = BatchStatus.CREATED;
}
