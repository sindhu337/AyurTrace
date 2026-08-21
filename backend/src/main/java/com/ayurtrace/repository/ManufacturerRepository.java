package com.ayurtrace.repository;

import com.ayurtrace.entity.Manufacturer;
import com.ayurtrace.entity.ManufacturerStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ManufacturerRepository extends JpaRepository<Manufacturer, Long> {
    Optional<Manufacturer> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByMobile(String mobile);
    boolean existsByAyushLicenseNo(String ayushLicenseNo);
    boolean existsByGstNumber(String gstNumber);
    List<Manufacturer> findByStatus(ManufacturerStatus status);
    long countByStatus(ManufacturerStatus status);
}
