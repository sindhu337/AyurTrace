package com.ayurtrace.repository;

import com.ayurtrace.entity.Batch;
import com.ayurtrace.entity.BatchStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BatchRepository extends JpaRepository<Batch, Long> {

    Optional<Batch> findByBatchNumber(String batchNumber);
    Optional<Batch> findByQrCode(String qrCode);
    List<Batch> findByStatus(BatchStatus status);

    @Query("SELECT b FROM Batch b JOIN FETCH b.cultivation c JOIN FETCH c.farmer WHERE c.farmer.id = :farmerId")
    List<Batch> findByFarmerId(Long farmerId);

    @Query("SELECT b FROM Batch b JOIN FETCH b.cultivation c JOIN FETCH c.farmer f WHERE f.supervisorId = :manufacturerId")
    List<Batch> findByAssignedManufacturerId(Long manufacturerId);

    /** Full load for traceability: batch + cultivation + farmer */
    @Query("SELECT b FROM Batch b JOIN FETCH b.cultivation c JOIN FETCH c.farmer WHERE b.id = :id")
    Optional<Batch> findByIdWithFull(Long id);

    long countByStatus(BatchStatus status);
}
