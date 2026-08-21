package com.ayurtrace.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class CustomerRegisterRequest {
    private String username;
    private String fullName;
    private String email;
    private String mobile;
    private String password;
    private String gender;
    private LocalDate dob;
    private String address;
    private String state;
    private String district;
    private String pincode;
}
