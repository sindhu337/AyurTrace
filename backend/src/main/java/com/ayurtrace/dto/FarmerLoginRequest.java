package com.ayurtrace.dto;

import lombok.Data;

@Data
public class FarmerLoginRequest {
    private String farmerId;
    private String password;
}
