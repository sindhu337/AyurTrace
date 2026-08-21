package com.ayurtrace.dto;

import com.ayurtrace.entity.Batch;
import com.ayurtrace.entity.BatchStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class BatchResponse {
    private Long id;
    private String batchNumber;
    private BigDecimal quantity;
    private String quantityUnit;
    private LocalDate harvestDate;
    private String location;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private String notes;
    private String qrCode;
    private BatchStatus status;

    // Cultivation info
    private Long cultivationId;
    private String herbName;
    private String cultivationMethod;

    // Farmer info
    private Long farmerDbId;
    private String farmerId;
    private String farmerName;
    private String farmerDistrict;
    private String farmerState;

    public static BatchResponse from(Batch b) {
        BatchResponse r = new BatchResponse();
        r.setId(b.getId());
        r.setBatchNumber(b.getBatchNumber());
        r.setQuantity(b.getQuantity());
        r.setQuantityUnit(b.getQuantityUnit());
        r.setHarvestDate(b.getHarvestDate());
        r.setLocation(b.getLocation());
        r.setLatitude(b.getLatitude());
        r.setLongitude(b.getLongitude());
        r.setNotes(b.getNotes());
        r.setQrCode(b.getQrCode());
        r.setStatus(b.getStatus());
        if (b.getCultivation() != null) {
            r.setCultivationId(b.getCultivation().getId());
            r.setHerbName(b.getCultivation().getHerbName());
            r.setCultivationMethod(b.getCultivation().getCultivationMethod());
            if (b.getCultivation().getFarmer() != null) {
                r.setFarmerDbId(b.getCultivation().getFarmer().getId());
                r.setFarmerId(b.getCultivation().getFarmer().getFarmerId());
                r.setFarmerName(b.getCultivation().getFarmer().getFullName());
                r.setFarmerDistrict(b.getCultivation().getFarmer().getDistrict());
                r.setFarmerState(b.getCultivation().getFarmer().getState());
            }
        }
        return r;
    }
}
