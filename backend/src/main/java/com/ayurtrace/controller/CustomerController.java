package com.ayurtrace.controller;

import com.ayurtrace.entity.*;
import com.ayurtrace.repository.CustomerRepository;
import com.ayurtrace.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/customer")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    @Autowired
    private CustomerRepository customerRepository;

    private Customer getCurrentCustomer(Principal principal) {
        return customerRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("Customer not found"));
    }

    @GetMapping("/profile")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> getProfile(Principal principal) {
        return ResponseEntity.ok(getCurrentCustomer(principal));
    }

    @GetMapping("/products")
    public ResponseEntity<?> searchProducts(@RequestParam(required = false) String query) {
        return ResponseEntity.ok(customerService.searchProducts(query));
    }

    @GetMapping("/products/{id}")
    public ResponseEntity<?> getProductDetails(@PathVariable Long id) {
        return ResponseEntity.ok(customerService.getProductDetails(id));
    }

    @PostMapping("/favourites/{productId}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> addToFavourites(@PathVariable Long productId, Principal principal) {
        customerService.addToFavourites(getCurrentCustomer(principal), productId);
        return ResponseEntity.ok("Added to favourites");
    }

    @DeleteMapping("/favourites/{productId}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> removeFromFavourites(@PathVariable Long productId, Principal principal) {
        customerService.removeFromFavourites(getCurrentCustomer(principal), productId);
        return ResponseEntity.ok("Removed from favourites");
    }

    @GetMapping("/favourites")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> getFavourites(Principal principal) {
        return ResponseEntity.ok(customerService.getFavourites(getCurrentCustomer(principal)));
    }

    @PostMapping("/cart")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> addToCart(@RequestParam Long productId, @RequestParam Integer quantity, Principal principal) {
        return ResponseEntity.ok(customerService.addToCart(getCurrentCustomer(principal), productId, quantity));
    }

    @PutMapping("/cart")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> updateCartItem(@RequestParam Long productId, @RequestParam Integer quantity, Principal principal) {
        return ResponseEntity.ok(customerService.updateCartItem(getCurrentCustomer(principal), productId, quantity));
    }

    @DeleteMapping("/cart/{productId}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> removeFromCart(@PathVariable Long productId, Principal principal) {
        customerService.removeFromCart(getCurrentCustomer(principal), productId);
        return ResponseEntity.ok("Removed from cart");
    }

    @GetMapping("/cart")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> getCart(Principal principal) {
        return ResponseEntity.ok(customerService.getCart(getCurrentCustomer(principal)));
    }

    @PostMapping("/checkout")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> checkout(@RequestParam String paymentMethod, Principal principal) {
        return ResponseEntity.ok(customerService.checkout(getCurrentCustomer(principal), paymentMethod));
    }

    @GetMapping("/orders")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> getOrders(Principal principal) {
        return ResponseEntity.ok(customerService.getOrders(getCurrentCustomer(principal)));
    }
}
