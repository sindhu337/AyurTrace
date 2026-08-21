package com.ayurtrace.repository;

import com.ayurtrace.entity.ManufacturerLogin;
import com.ayurtrace.entity.Manufacturer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ManufacturerLoginRepository extends JpaRepository<ManufacturerLogin, Long> {

    @Query("SELECT ml FROM ManufacturerLogin ml JOIN FETCH ml.registration WHERE ml.manufacturerId = :manufacturerId")
    Optional<ManufacturerLogin> findByManufacturerId(String manufacturerId);

    @Query("SELECT ml FROM ManufacturerLogin ml JOIN FETCH ml.registration WHERE ml.registration = :registration")
    Optional<ManufacturerLogin> findByRegistration(Manufacturer registration);

    boolean existsByManufacturerId(String manufacturerId);
}
