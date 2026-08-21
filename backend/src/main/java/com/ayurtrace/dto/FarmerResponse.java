package com.ayurtrace.dto;

import com.ayurtrace.entity.Farmer;
import com.ayurtrace.entity.FarmerStatus;
import lombok.Data;

@Data
public class FarmerResponse {
    private Long id;
    private String farmerId;
    private String fullName;
    private String email;
    private String mobile;
    private String aadharNo;
    private String rtcDocument;
    private String address;
    private String state;
    private String district;
    private String pincode;
    private String latitude;
    private String longitude;
    private FarmerStatus status;
    private Long supervisorId;

    public static FarmerResponse from(Farmer f) {
        FarmerResponse r = new FarmerResponse();
        r.setId(f.getId());
        r.setFarmerId(f.getFarmerId());
        r.setFullName(f.getFullName());
        r.setEmail(f.getEmail());
        r.setMobile(f.getMobile());
        r.setAadharNo(f.getAadharNo());
        r.setRtcDocument(f.getRtcDocument());
        r.setAddress(f.getAddress());
        r.setState(f.getState());
        r.setDistrict(f.getDistrict());
        r.setPincode(f.getPincode());
        r.setLatitude(f.getLatitude() != null ? f.getLatitude().toString() : null);
        r.setLongitude(f.getLongitude() != null ? f.getLongitude().toString() : null);
        r.setStatus(f.getStatus());
        r.setSupervisorId(f.getSupervisorId());
        return r;
    }
}
