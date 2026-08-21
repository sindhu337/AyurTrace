package com.ayurtrace.repository;

import com.ayurtrace.entity.Manufacturer;
import com.ayurtrace.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByNameContainingIgnoreCaseOrCategoryContainingIgnoreCase(String name, String category);
    List<Product> findByManufacturer(Manufacturer manufacturer);
    List<Product> findByManufacturerOrderByCreatedAtDesc(Manufacturer manufacturer);
    long countByManufacturer(Manufacturer manufacturer);
}
