package com.ayurtrace.repository;

import com.ayurtrace.entity.Manufacturer;
import com.ayurtrace.entity.QrCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QrCodeRepository extends JpaRepository<QrCode, Long> {

    @Query("SELECT q FROM QrCode q JOIN FETCH q.product JOIN FETCH q.batch JOIN FETCH q.manufacturer WHERE q.qrId = :qrId")
    Optional<QrCode> findByQrId(String qrId);

    @Query("SELECT q FROM QrCode q JOIN FETCH q.product JOIN FETCH q.batch JOIN FETCH q.manufacturer WHERE q.manufacturer = :manufacturer ORDER BY q.generatedAt DESC")
    List<QrCode> findByManufacturerOrderByGeneratedAtDesc(Manufacturer manufacturer);

    boolean existsByQrId(String qrId);
    long countByManufacturer(Manufacturer manufacturer);
}
