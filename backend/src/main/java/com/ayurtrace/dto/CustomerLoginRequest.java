package com.ayurtrace.dto;

import lombok.Data;

@Data
public class CustomerLoginRequest {
    private String mobile;
    private String password;
}
