package com.ayurtrace.repository;

import com.ayurtrace.entity.Farmer;
import com.ayurtrace.entity.FarmerStatus;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FarmerRepository extends UserRepository<Farmer> {
    Optional<Farmer> findByFarmerId(String farmerId);
    List<Farmer> findByStatus(FarmerStatus status);
    List<Farmer> findBySupervisorId(Long supervisorId);
    long countByStatus(FarmerStatus status);
}
