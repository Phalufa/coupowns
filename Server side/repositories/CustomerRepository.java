package com.miko.couponsystemfullstack.repositories;

import com.miko.couponsystemfullstack.models.Customer;
import org.springframework.data.jpa.repository.JpaRepository;


public interface CustomerRepository extends JpaRepository<Customer, Long> {

    Customer findByEmailAndPassword(String email, String password);
}
