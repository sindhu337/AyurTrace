package com.ayurtrace.repository;

import com.ayurtrace.entity.Farmer;
import com.ayurtrace.entity.Manufacturer;
import com.ayurtrace.entity.SupervisorMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SupervisorMessageRepository extends JpaRepository<SupervisorMessage, Long> {

    @Query("SELECT m FROM SupervisorMessage m JOIN FETCH m.manufacturer JOIN FETCH m.farmer WHERE m.manufacturer = :manufacturer ORDER BY m.createdAt DESC")
    List<SupervisorMessage> findByManufacturerOrderByCreatedAtDesc(Manufacturer manufacturer);

    @Query("SELECT m FROM SupervisorMessage m JOIN FETCH m.manufacturer JOIN FETCH m.farmer WHERE m.farmer = :farmer ORDER BY m.createdAt DESC")
    List<SupervisorMessage> findByFarmerOrderByCreatedAtDesc(Farmer farmer);

    @Query("SELECT m FROM SupervisorMessage m JOIN FETCH m.manufacturer JOIN FETCH m.farmer WHERE m.farmer.id = :farmerId ORDER BY m.createdAt DESC")
    List<SupervisorMessage> findByFarmerIdOrderByCreatedAtDesc(Long farmerId);
}
