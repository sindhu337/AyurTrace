package com.ayurtrace.dto;

import lombok.Data;

@Data
public class FarmerRegisterRequest {
    private String fullName;
    private String email;
    private String mobile;
    private String password;
    private String aadharNo;
    private String rtcDocument;
    private String address;
    private String state;
    private String district;
    private String pincode;
    private String gpsCoordinates;
}
