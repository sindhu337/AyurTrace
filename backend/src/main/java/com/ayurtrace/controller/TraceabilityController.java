package com.ayurtrace.controller;

import com.ayurtrace.entity.Batch;
import com.ayurtrace.repository.QrCodeRepository;
import com.ayurtrace.service.ManufacturerService;
import com.ayurtrace.service.TraceabilityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/traceability")
public class TraceabilityController {

    @Autowired TraceabilityService traceabilityService;
    @Autowired ManufacturerService manufacturerService;
    @Autowired QrCodeRepository qrCodeRepository;

    /**
     * Full traceability chain — used by Customer Flutter and Manufacturer React.
     * Checks new QrCode table first, falls back to legacy batch QR lookup.
     */
    @GetMapping("/{qrId}")
    public ResponseEntity<?> getTraceability(@PathVariable String qrId) {
        // Try new QR code table first
        if (qrCodeRepository.existsByQrId(qrId)) {
            try {
                return ResponseEntity.ok(manufacturerService.getTraceabilityByQrId(qrId));
            } catch (RuntimeException e) {
                return ResponseEntity.notFound().build();
            }
        }
        // Legacy fallback: batch QR field
        try {
            Batch batch = traceabilityService.getTraceabilityDetails(qrId);
            return ResponseEntity.ok(manufacturerService.buildTraceabilityFromBatch(batch));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
