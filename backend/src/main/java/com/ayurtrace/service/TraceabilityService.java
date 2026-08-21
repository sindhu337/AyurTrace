package com.ayurtrace.service;

import com.ayurtrace.entity.Batch;
import com.ayurtrace.repository.BatchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TraceabilityService {

    @Autowired
    private BatchRepository batchRepository;

    public Batch getTraceabilityDetails(String qrId) {
        return batchRepository.findByQrCode(qrId)
                .orElseThrow(() -> new RuntimeException("Traceability data not found for QR ID: " + qrId));
    }
}
