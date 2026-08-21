package com.ayurtrace.repository;

import com.ayurtrace.entity.Customer;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CustomerRepository extends UserRepository<Customer> {
    Optional<Customer> findByMobile(String mobile);
}
