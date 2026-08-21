package com.ayurtrace.dto;

import com.ayurtrace.entity.CultivationRequest;
import com.ayurtrace.entity.CultivationRequestStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class CultivationRequestResponse {
    private Long id;
    private Long cultivationId;
    private String herbName;
    private Long manufacturerId;
    private String manufacturerName;
    private String message;
    private BigDecimal offeredPrice;
    private BigDecimal quantity;
    private CultivationRequestStatus status;
    private LocalDateTime createdAt;

    public static CultivationRequestResponse from(CultivationRequest req) {
        CultivationRequestResponse res = new CultivationRequestResponse();
        res.setId(req.getId());
        res.setCultivationId(req.getCultivation().getId());
        res.setHerbName(req.getCultivation().getHerbName());
        res.setManufacturerId(req.getManufacturer().getId());
        res.setManufacturerName(req.getManufacturer().getCompanyName());
        res.setMessage(req.getMessage());
        res.setOfferedPrice(req.getOfferedPrice());
        res.setQuantity(req.getQuantity());
        res.setStatus(req.getStatus());
        res.setCreatedAt(req.getCreatedAt());
        return res;
    }
}
