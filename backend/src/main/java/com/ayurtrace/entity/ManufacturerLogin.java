package com.ayurtrace.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "manufacturer_login")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ManufacturerLogin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "login_id")
    private Long loginId;

    @Column(name = "manufacturer_id", unique = true, nullable = false, length = 20)
    private String manufacturerId;

    @JsonIgnore
    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "registration_id", nullable = false)
    private Manufacturer registration;

    @Enumerated(EnumType.STRING)
    @Column(name = "account_status", nullable = false)
    private ManufacturerAccountStatus accountStatus = ManufacturerAccountStatus.ACTIVE;
}
