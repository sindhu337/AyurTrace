package com.ayurtrace.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ManufacturerLoginRequest {

    @NotBlank(message = "Manufacturer ID is required")
    private String manufacturerId;

    @NotBlank(message = "Password is required")
    private String password;
}
