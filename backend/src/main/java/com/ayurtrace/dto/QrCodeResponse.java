package com.ayurtrace.dto;

import com.ayurtrace.entity.QrCode;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class QrCodeResponse {
    private Long id;
    private String qrId;
    private Long productId;
    private String productName;
    private Long batchId;
    private String batchNumber;
    private Long manufacturerDbId;
    private String manufacturerIdCode;
    private String manufacturerCompanyName;
    private String qrImagePath;
    private LocalDateTime generatedAt;

    public static QrCodeResponse from(QrCode q, String manufacturerIdCode) {
        QrCodeResponse r = new QrCodeResponse();
        r.setId(q.getId());
        r.setQrId(q.getQrId());
        r.setQrImagePath(q.getQrImagePath());
        r.setGeneratedAt(q.getGeneratedAt());
        if (q.getProduct() != null) {
            r.setProductId(q.getProduct().getId());
            r.setProductName(q.getProduct().getName());
        }
        if (q.getBatch() != null) {
            r.setBatchId(q.getBatch().getId());
            r.setBatchNumber(q.getBatch().getBatchNumber());
        }
        if (q.getManufacturer() != null) {
            r.setManufacturerDbId(q.getManufacturer().getId());
            r.setManufacturerCompanyName(q.getManufacturer().getCompanyName());
            r.setManufacturerIdCode(manufacturerIdCode);
        }
        return r;
    }
}
