package com.ayurtrace.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class CultivationRequestDTO {
    private Long cultivationId;
    private String message;
    private BigDecimal offeredPrice;
    private BigDecimal quantity;
}
