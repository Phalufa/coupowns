package com.miko.couponsystemfullstack.repositories;

import com.miko.couponsystemfullstack.models.Company;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompanyRepository extends JpaRepository<Company, Long> {

    Company findByEmailAndPassword(String email, String password);
}
