package com.ayurtrace.controller;

import com.ayurtrace.dto.*;
import com.ayurtrace.service.ManufacturerService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;

@RestController
@RequestMapping("/api/manufacturer")
@PreAuthorize("hasRole('MANUFACTURER')")
public class ManufacturerController {

    @Autowired ManufacturerService manufacturerService;

    // ─── Profile ─────────────────────────────────────────────────────────────

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Principal principal) {
        return ResponseEntity.ok(manufacturerService.getProfile(principal.getName()));
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody ManufacturerRegisterRequest req,
                                           Principal principal) {
        try {
            return ResponseEntity.ok(manufacturerService.updateProfile(principal.getName(), req));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // ─── Dashboard ────────────────────────────────────────────────────────────

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboard(Principal principal) {
        return ResponseEntity.ok(manufacturerService.getDashboardStats(principal.getName()));
    }

    // ─── Farmers / Supervisor ────────────────────────────────────────────────

    @GetMapping("/farmers/assigned")
    public ResponseEntity<?> getAssignedFarmers(Principal principal) {
        return ResponseEntity.ok(manufacturerService.getAssignedFarmers(principal.getName()));
    }

    @GetMapping("/farmers/all")
    public ResponseEntity<?> getAllActiveFarmers() {
        return ResponseEntity.ok(manufacturerService.getAllActiveFarmers());
    }

    @PostMapping("/farmers/{farmerId}/assign")
    public ResponseEntity<?> assignFarmer(@PathVariable Long farmerId, Principal principal) {
        try {
            manufacturerService.assignFarmer(principal.getName(), farmerId);
            return ResponseEntity.ok(ApiResponse.ok("Farmer assigned successfully."));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // ─── Supervisor Messages ─────────────────────────────────────────────────

    @PostMapping("/supervisor/message")
    public ResponseEntity<?> sendMessage(@Valid @RequestBody SupervisorMessageRequest req,
                                         Principal principal) {
        try {
            return ResponseEntity.ok(manufacturerService.sendMessage(principal.getName(), req));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/supervisor/messages")
    public ResponseEntity<?> getMessages(Principal principal) {
        return ResponseEntity.ok(manufacturerService.getMessages(principal.getName()));
    }

    // ─── Cultivations ────────────────────────────────────────────────────────

    @GetMapping("/cultivations")
    public ResponseEntity<?> getCultivations(Principal principal) {
        return ResponseEntity.ok(manufacturerService.getCultivationsForManufacturer(principal.getName()));
    }

    @PostMapping("/cultivations/interest")
    public ResponseEntity<?> expressInterest(@RequestBody CultivationRequestDTO dto, Principal principal) {
        try {
            manufacturerService.expressInterest(principal.getName(), dto);
            return ResponseEntity.ok(ApiResponse.ok("Interest expressed successfully."));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/requests/sent")
    public ResponseEntity<?> getSentRequests(Principal principal) {
        return ResponseEntity.ok(manufacturerService.getSentRequests(principal.getName()));
    }

    // ─── Batches ─────────────────────────────────────────────────────────────

    @GetMapping("/batches")
    public ResponseEntity<?> getBatches(Principal principal) {
        return ResponseEntity.ok(manufacturerService.getBatchesForManufacturer(principal.getName()));
    }

    @PutMapping("/batches/{batchId}/status")
    public ResponseEntity<?> updateBatchStatus(@PathVariable Long batchId,
                                               @RequestParam String status,
                                               Principal principal) {
        try {
            return ResponseEntity.ok(manufacturerService.updateBatchStatus(
                    principal.getName(), batchId, status));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // ─── Products ────────────────────────────────────────────────────────────

    @GetMapping("/products")
    public ResponseEntity<?> getProducts(Principal principal) {
        return ResponseEntity.ok(manufacturerService.getProducts(principal.getName()));
    }

    @PostMapping("/products")
    public ResponseEntity<?> createProduct(@Valid @RequestPart("product") ProductRequest req,
                                           @RequestPart(value = "image", required = false) MultipartFile image,
                                           Principal principal) {
        try {
            String imageUrl = null;
            if (image != null && !image.isEmpty()) {
                imageUrl = FileUploadController.saveFile(image, "products");
            }
            return ResponseEntity.ok(manufacturerService.createProduct(principal.getName(), req, imageUrl));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/products/json")
    public ResponseEntity<?> createProductJson(@Valid @RequestBody ProductRequest req,
                                               Principal principal) {
        try {
            return ResponseEntity.ok(manufacturerService.createProduct(principal.getName(), req, null));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/products/{productId}")
    public ResponseEntity<?> updateProduct(@PathVariable Long productId,
                                           @RequestPart("product") ProductRequest req,
                                           @RequestPart(value = "image", required = false) MultipartFile image,
                                           Principal principal) {
        try {
            String imageUrl = null;
            if (image != null && !image.isEmpty()) {
                imageUrl = FileUploadController.saveFile(image, "products");
            }
            return ResponseEntity.ok(manufacturerService.updateProduct(principal.getName(), productId, req, imageUrl));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/products/{productId}/json")
    public ResponseEntity<?> updateProductJson(@PathVariable Long productId,
                                               @RequestBody ProductRequest req,
                                               Principal principal) {
        try {
            return ResponseEntity.ok(manufacturerService.updateProduct(principal.getName(), productId, req, null));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // ─── QR Codes ────────────────────────────────────────────────────────────

    @GetMapping("/qr")
    public ResponseEntity<?> getQrCodes(Principal principal) {
        return ResponseEntity.ok(manufacturerService.getQrCodes(principal.getName()));
    }

    @PostMapping("/qr/generate/{productId}")
    public ResponseEntity<?> generateQr(@PathVariable Long productId, Principal principal) {
        try {
            return ResponseEntity.ok(manufacturerService.generateQrCode(principal.getName(), productId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // ─── Traceability ─────────────────────────────────────────────────────────

    @GetMapping("/traceability/{qrId}")
    public ResponseEntity<?> getTraceability(@PathVariable String qrId) {
        try {
            return ResponseEntity.ok(manufacturerService.getTraceabilityByQrId(qrId));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ─── Orders ──────────────────────────────────────────────────────────────

    @GetMapping("/orders")
    public ResponseEntity<?> getOrders(Principal principal) {
        return ResponseEntity.ok(manufacturerService.getOrders(principal.getName()));
    }

    @PutMapping("/orders/{orderId}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long orderId,
                                               @RequestParam String status,
                                               Principal principal) {
        try {
            return ResponseEntity.ok(manufacturerService.updateOrderStatus(principal.getName(), orderId, status));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // ─── Analytics ───────────────────────────────────────────────────────────

    @GetMapping("/analytics")
    public ResponseEntity<?> getAnalytics(Principal principal) {
        return ResponseEntity.ok(manufacturerService.getAnalytics(principal.getName()));
    }

    // ─── Notifications ────────────────────────────────────────────────────────

    @GetMapping("/notifications")
    public ResponseEntity<?> getNotifications(Principal principal) {
        return ResponseEntity.ok(manufacturerService.getNotifications(principal.getName()));
    }

    @PostMapping("/notifications/{id}/read")
    public ResponseEntity<?> markRead(@PathVariable Long id, Principal principal) {
        try {
            manufacturerService.markNotificationRead(principal.getName(), id);
            return ResponseEntity.ok(ApiResponse.ok("Notification marked as read."));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
