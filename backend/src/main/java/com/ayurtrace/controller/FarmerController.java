package com.ayurtrace.controller;

import com.ayurtrace.dto.ApiResponse;
import com.ayurtrace.entity.*;
import com.ayurtrace.repository.FarmerRepository;
import com.ayurtrace.repository.ManufacturerRepository;
import com.ayurtrace.repository.SupervisorMessageRepository;
import com.ayurtrace.service.FarmerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/farmer")
@PreAuthorize("hasRole('FARMER')")
public class FarmerController {

    @Autowired private FarmerService farmerService;
    @Autowired private FarmerRepository farmerRepository;
    @Autowired private ManufacturerRepository manufacturerRepository;
    @Autowired private SupervisorMessageRepository supervisorMessageRepository;

    private Farmer getCurrentFarmer(Principal principal) {
        return farmerRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("Farmer not found"));
    }

    // ─── Profile ─────────────────────────────────────────────────────────────

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Principal principal) {
        return ResponseEntity.ok(getCurrentFarmer(principal));
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats(Principal principal) {
        return ResponseEntity.ok(farmerService.getDashboardStats(getCurrentFarmer(principal)));
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody Farmer details, Principal principal) {
        return ResponseEntity.ok(farmerService.updateProfile(getCurrentFarmer(principal), details));
    }

    // ─── Cultivation ─────────────────────────────────────────────────────────

    @PostMapping("/cultivation")
    public ResponseEntity<?> addCultivation(@RequestBody Cultivation cultivation, Principal principal) {
        return ResponseEntity.ok(farmerService.addCultivation(getCurrentFarmer(principal), cultivation));
    }

    @GetMapping("/cultivations")
    public ResponseEntity<?> getCultivations(Principal principal) {
        return ResponseEntity.ok(farmerService.getCultivations(getCurrentFarmer(principal)));
    }

    @PutMapping("/cultivation/{id}")
    public ResponseEntity<?> updateCultivation(@PathVariable Long id,
                                               @RequestBody Cultivation cultivation) {
        return ResponseEntity.ok(farmerService.updateCultivation(id, cultivation));
    }

    // ─── Batches ─────────────────────────────────────────────────────────────

    @PostMapping("/batch")
    public ResponseEntity<?> createBatch(@RequestParam Long cultivationId,
                                         @RequestBody Batch batch) {
        return ResponseEntity.ok(farmerService.createBatch(cultivationId, batch));
    }

    @GetMapping("/batches")
    public ResponseEntity<?> getBatches(Principal principal) {
        return ResponseEntity.ok(farmerService.getBatches(getCurrentFarmer(principal)));
    }

    // ─── Messages (farmer ↔ supervisor / other) ───────────────────────────────

    @PostMapping("/message")
    public ResponseEntity<?> sendMessage(@RequestParam Long receiverId,
                                         @RequestBody String content,
                                         Principal principal) {
        return ResponseEntity.ok(farmerService.sendMessage(getCurrentFarmer(principal), receiverId, content));
    }

    @GetMapping("/messages")
    public ResponseEntity<?> getMessages(Principal principal) {
        return ResponseEntity.ok(farmerService.getMessages(getCurrentFarmer(principal)));
    }

    @GetMapping("/supervisor")
    public ResponseEntity<?> getMySupervisor(Principal principal) {
        Farmer farmer = getCurrentFarmer(principal);
        if (farmer.getSupervisorId() == null) {
            return ResponseEntity.ok(Map.of("message", "No supervisor assigned yet"));
        }
        // In this system, supervisorId refers to a Manufacturer/Admin entity acting as supervisor
        return ResponseEntity.ok(manufacturerRepository.findById(farmer.getSupervisorId())
                .orElseThrow(() -> new RuntimeException("Supervisor not found")));
    }

    @GetMapping("/supervisor-messages")
    public ResponseEntity<?> getSupervisorMessages(Principal principal) {
        Farmer farmer = getCurrentFarmer(principal);
        return ResponseEntity.ok(
                supervisorMessageRepository.findByFarmerIdOrderByCreatedAtDesc(farmer.getId()));
    }

    // ─── Notifications ────────────────────────────────────────────────────────

    @GetMapping("/notifications")
    public ResponseEntity<?> getNotifications(Principal principal) {
        return ResponseEntity.ok(farmerService.getNotifications(getCurrentFarmer(principal)));
    }

    /**
     * Returns unread notification count as a simple JSON object.
     * Flutter app uses this for the badge counter.
     * Response: { "unreadCount": 3 }
     */
    @GetMapping("/notifications/unread-count")
    public ResponseEntity<?> getUnreadCount(Principal principal) {
        long count = farmerService.getUnreadNotificationCount(getCurrentFarmer(principal));
        return ResponseEntity.ok(Map.of("unreadCount", count));
    }

    @PostMapping("/notifications/{id}/read")
    public ResponseEntity<?> markNotificationAsRead(@PathVariable Long id) {
        farmerService.markNotificationAsRead(id);
        return ResponseEntity.ok(ApiResponse.ok("Notification marked as read."));
    }

    /**
     * Mark all notifications as read in one call — convenience for Flutter app.
     */
    @PostMapping("/notifications/read-all")
    public ResponseEntity<?> markAllRead(Principal principal) {
        farmerService.markAllNotificationsRead(getCurrentFarmer(principal));
        return ResponseEntity.ok(ApiResponse.ok("All notifications marked as read."));
    }

    // ─── Cultivation Requests ──────────────────────────────────────────────────

    @GetMapping("/requests")
    public ResponseEntity<?> getCultivationRequests(Principal principal) {
        return ResponseEntity.ok(farmerService.getCultivationRequests(getCurrentFarmer(principal)));
    }

    @PostMapping("/requests/{id}/status")
    public ResponseEntity<?> updateRequestStatus(@PathVariable Long id, @RequestParam CultivationRequestStatus status) {
        return ResponseEntity.ok(farmerService.updateRequestStatus(id, status));
    }
}
