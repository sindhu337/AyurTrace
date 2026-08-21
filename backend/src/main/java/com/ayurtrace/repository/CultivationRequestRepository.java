package com.ayurtrace.repository;

import com.ayurtrace.entity.CultivationRequest;
import com.ayurtrace.entity.Farmer;
import com.ayurtrace.entity.Manufacturer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CultivationRequestRepository extends JpaRepository<CultivationRequest, Long> {
    List<CultivationRequest> findByFarmer(Farmer farmer);
    List<CultivationRequest> findByManufacturer(Manufacturer manufacturer);
}
