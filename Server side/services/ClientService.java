package com.miko.couponsystemfullstack.services;

import com.miko.couponsystemfullstack.repositories.CompanyRepository;
import com.miko.couponsystemfullstack.repositories.CouponRepository;
import com.miko.couponsystemfullstack.repositories.CustomerRepository;
import org.springframework.stereotype.Service;

import javax.security.auth.login.LoginException;

@Service
public abstract class ClientService {

    protected final CouponRepository couponRepo;
    protected final CustomerRepository customerRepo;
    protected final CompanyRepository companyRepo;

    public ClientService(CouponRepository couponRepo, CustomerRepository customerRepo, CompanyRepository companyRepo) {
        this.couponRepo = couponRepo;
        this.customerRepo = customerRepo;
        this.companyRepo = companyRepo;
    }

    public abstract boolean login(String email, String password) throws LoginException;
}
