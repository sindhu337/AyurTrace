package com.ayurtrace.repository;

import com.ayurtrace.entity.Customer;
import com.ayurtrace.entity.Favourite;
import com.ayurtrace.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavouriteRepository extends JpaRepository<Favourite, Long> {
    List<Favourite> findByCustomer(Customer customer);
    Optional<Favourite> findByCustomerAndProduct(Customer customer, Product product);
}
