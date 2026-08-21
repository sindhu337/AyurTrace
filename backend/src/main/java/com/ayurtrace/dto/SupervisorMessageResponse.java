package com.ayurtrace.dto;

import com.ayurtrace.entity.SupervisorMessage;
import com.ayurtrace.entity.SupervisorMessageStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class SupervisorMessageResponse {
    private Long id;
    private Long manufacturerDbId;
    private String manufacturerCompanyName;
    private Long farmerDbId;
    private String farmerFarmerId;
    private String farmerName;
    private String subject;
    private String message;
    private SupervisorMessageStatus status;
    private LocalDateTime createdAt;

    public static SupervisorMessageResponse from(SupervisorMessage m) {
        SupervisorMessageResponse r = new SupervisorMessageResponse();
        r.setId(m.getId());
        r.setSubject(m.getSubject());
        r.setMessage(m.getMessage());
        r.setStatus(m.getStatus());
        r.setCreatedAt(m.getCreatedAt());
        if (m.getManufacturer() != null) {
            r.setManufacturerDbId(m.getManufacturer().getId());
            r.setManufacturerCompanyName(m.getManufacturer().getCompanyName());
        }
        if (m.getFarmer() != null) {
            r.setFarmerDbId(m.getFarmer().getId());
            r.setFarmerFarmerId(m.getFarmer().getFarmerId());
            r.setFarmerName(m.getFarmer().getFullName());
        }
        return r;
    }
}
