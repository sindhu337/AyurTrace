package com.ayurtrace.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String username;   // farmerId / manufacturerId / admin username / customer mobile
    private String role;       // ROLE_FARMER / ROLE_MANUFACTURER / ROLE_ADMIN / ROLE_CUSTOMER
    private Long id;           // DB entity id

    // Optional — populated for manufacturer login so the dashboard can show the company name
    private String companyName;

    // Convenience constructor (keeps all existing call sites that pass 4 args)
    public AuthResponse(String token, String username, String role, Long id) {
        this.token = token;
        this.username = username;
        this.role = role;
        this.id = id;
    }
}
