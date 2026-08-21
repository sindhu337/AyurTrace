package com.ayurtrace.repository;

import com.ayurtrace.entity.Customer;
import com.ayurtrace.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    @Query("SELECT DISTINCT o FROM Order o JOIN FETCH o.customer JOIN FETCH o.items i JOIN FETCH i.product WHERE o.customer = :customer ORDER BY o.orderDate DESC")
    List<Order> findByCustomerOrderByOrderDateDesc(Customer customer);

    @Query("SELECT DISTINCT o FROM Order o JOIN FETCH o.customer JOIN FETCH o.items i JOIN FETCH i.product p WHERE p.manufacturer.id = :manufacturerId ORDER BY o.orderDate DESC")
    List<Order> findByManufacturerId(Long manufacturerId);

    long countByStatus(String status);
}
