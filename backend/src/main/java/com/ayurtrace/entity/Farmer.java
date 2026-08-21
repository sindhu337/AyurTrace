package com.ayurtrace.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Entity
@Table(name = "farmer_registration")
@PrimaryKeyJoinColumn(name = "id")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class Farmer extends User {
    
    @Column(name = "farmer_id", unique = true)
    private String farmerId;

    @Column(name = "aadhar_no", unique = true)
    private String aadharNo;
    
    @Column(name = "rtc_document")
    private String rtcDocument;
    
    private String address;
    
    private String state;
    
    private String district;
    
    private String pincode;
    
    private BigDecimal latitude;
    
    private BigDecimal longitude;

    private Long supervisorId;

    @Enumerated(EnumType.STRING)
    private FarmerStatus status = FarmerStatus.PENDING;
}
