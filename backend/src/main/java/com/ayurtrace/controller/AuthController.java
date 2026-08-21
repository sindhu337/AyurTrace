package com.ayurtrace.controller;

import com.ayurtrace.dto.*;
import com.ayurtrace.service.AdminService;
import com.ayurtrace.service.AuthService;
import com.ayurtrace.service.ManufacturerService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired AuthService authService;
    @Autowired ManufacturerService manufacturerService;
    @Autowired AdminService adminService;

    @GetMapping("/ping")
    public ResponseEntity<String> ping() {
        return ResponseEntity.ok("Backend is reachable!");
    }

    // ─── Farmer ───────────────────────────────────────────────────────────────

    @PostMapping("/farmer/register")
    public ResponseEntity<?> registerFarmer(@Valid @RequestBody FarmerRegisterRequest req) {
        try {
            authService.registerFarmer(req);
            return ResponseEntity.ok(ApiResponse.ok("Farmer registered successfully! Waiting for admin approval."));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/farmer/login")
    public ResponseEntity<?> loginFarmer(@Valid @RequestBody FarmerLoginRequest req) {
        try {
            return ResponseEntity.ok(authService.authenticateFarmer(req));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // ─── Customer ─────────────────────────────────────────────────────────────

    @PostMapping("/customer/register")
    public ResponseEntity<?> registerCustomer(@Valid @RequestBody CustomerRegisterRequest req) {
        try {
            authService.registerCustomer(req);
            return ResponseEntity.ok(ApiResponse.ok("Customer registered successfully!"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/customer/login")
    public ResponseEntity<?> loginCustomer(@Valid @RequestBody CustomerLoginRequest req) {
        try {
            return ResponseEntity.ok(authService.authenticateCustomer(req));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // ─── Manufacturer ─────────────────────────────────────────────────────────

    @PostMapping("/manufacturer/register")
    public ResponseEntity<?> registerManufacturer(@Valid @RequestBody ManufacturerRegisterRequest req) {
        try {
            ManufacturerResponse r = manufacturerService.register(req);
            return ResponseEntity.ok(ApiResponse.ok("Registration submitted! Waiting for admin approval.", r));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/manufacturer/login")
    public ResponseEntity<?> loginManufacturer(@Valid @RequestBody ManufacturerLoginRequest req) {
        try {
            return ResponseEntity.ok(manufacturerService.login(req));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // ─── Admin ────────────────────────────────────────────────────────────────

    @PostMapping("/admin/login")
    public ResponseEntity<?> loginAdmin(@Valid @RequestBody AdminLoginRequest req) {
        try {
            return ResponseEntity.ok(adminService.login(req));
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(ApiResponse.error(e.getMessage()));
        }
    }

    // ─── Legacy endpoint (Flutter compatibility) ─────────────────────────────

    @PostMapping("/farmer/approve/{id}")
    public ResponseEntity<?> approveFarmer(@PathVariable Long id) {
        try {
            String farmerId = authService.approveFarmer(id);
            return ResponseEntity.ok(ApiResponse.ok("Farmer approved! Generated Farmer ID: " + farmerId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
