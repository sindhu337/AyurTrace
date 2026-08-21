package com.ayurtrace.repository;

import com.ayurtrace.entity.Cultivation;
import com.ayurtrace.entity.Farmer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CultivationRepository extends JpaRepository<Cultivation, Long> {

    @Query("SELECT c FROM Cultivation c JOIN FETCH c.farmer WHERE c.farmer = :farmer")
    List<Cultivation> findByFarmer(Farmer farmer);

    @Query("SELECT c FROM Cultivation c JOIN FETCH c.farmer WHERE c.farmer.id = :farmerId")
    List<Cultivation> findByFarmerId(Long farmerId);

    /** Load a single cultivation with its farmer eagerly (for traceability). */
    @Query("SELECT c FROM Cultivation c JOIN FETCH c.farmer WHERE c.id = :id")
    Optional<Cultivation> findByIdWithFarmer(Long id);

    long countByFarmer(Farmer farmer);
}
