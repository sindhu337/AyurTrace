package com.ayurtrace.controller;

import com.ayurtrace.dto.ApiResponse;
import com.ayurtrace.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired AdminService adminService;

    // ─── Dashboard ────────────────────────────────────────────────────────────

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboard() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    // ─── Farmer Applications ─────────────────────────────────────────────────

    @GetMapping("/farmers/applications")
    public ResponseEntity<?> getPendingFarmers() {
        return ResponseEntity.ok(adminService.getPendingFarmerApplications());
    }

    @GetMapping("/farmers")
    public ResponseEntity<?> getAllFarmers() {
        return ResponseEntity.ok(adminService.getAllFarmers());
    }

    @GetMapping("/farmers/{id}")
    public ResponseEntity<?> getFarmerById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(adminService.getFarmerById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/farmers/{id}/approve")
    public ResponseEntity<?> approveFarmer(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(adminService.approveFarmer(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/farmers/{id}/reject")
    public ResponseEntity<?> rejectFarmer(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(adminService.rejectFarmer(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/farmers/{id}/toggle-block")
    public ResponseEntity<?> toggleFarmerBlock(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(adminService.toggleFarmerBlock(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // ─── Manufacturer Applications ───────────────────────────────────────────

    @GetMapping("/manufacturers/applications")
    public ResponseEntity<?> getPendingManufacturers() {
        return ResponseEntity.ok(adminService.getPendingManufacturerApplications());
    }

    @GetMapping("/manufacturers")
    public ResponseEntity<?> getAllManufacturers() {
        return ResponseEntity.ok(adminService.getAllManufacturers());
    }

    @GetMapping("/manufacturers/{id}")
    public ResponseEntity<?> getManufacturerById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(adminService.getManufacturerById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/manufacturers/{id}/approve")
    public ResponseEntity<?> approveManufacturer(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(adminService.approveManufacturer(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/manufacturers/{id}/reject")
    public ResponseEntity<?> rejectManufacturer(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(adminService.rejectManufacturer(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/manufacturers/login/{loginId}/toggle-block")
    public ResponseEntity<?> toggleManufacturerBlock(@PathVariable Long loginId) {
        try {
            return ResponseEntity.ok(adminService.toggleManufacturerBlock(loginId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
