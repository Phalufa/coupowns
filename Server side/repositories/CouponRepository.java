package com.miko.couponsystemfullstack.repositories;

import com.miko.couponsystemfullstack.models.Company;
import com.miko.couponsystemfullstack.models.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Set;

public interface CouponRepository extends JpaRepository<Coupon, Long> {

    Set<Coupon> findAllByCompany(Company company);
}
