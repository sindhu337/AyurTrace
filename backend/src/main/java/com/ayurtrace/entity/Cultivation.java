package com.ayurtrace.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "cultivations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Cultivation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "farmer_id", nullable = false)
    private Farmer farmer;

    @Column(nullable = false)
    private String herbName;

    private String area;
    private String areaUnit;
    private String cultivationMethod;

    private LocalDate plantingDate;
    private LocalDate expectedHarvestDate;

    private BigDecimal expectedQuantity;
    private String quantityUnit;

    private BigDecimal price;
    private String location;
    
    private BigDecimal latitude;
    private BigDecimal longitude;

    @Column(length = 1000)
    private String notes;

    @Enumerated(EnumType.STRING)
    private CultivationStatus status;
}
