package com.miko.couponsystemfullstack.services.login;

import com.miko.couponsystemfullstack.services.AdminService;
import com.miko.couponsystemfullstack.services.ClientService;
import com.miko.couponsystemfullstack.services.CompanyService;
import com.miko.couponsystemfullstack.services.CustomerService;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;

import javax.security.auth.login.LoginException;

@Service
public class LoginManager {

    private final ApplicationContext ctx;

    public LoginManager(ApplicationContext ctx) {
        this.ctx = ctx;
    }

    public ClientService login(String email, String password, ClientType clientType) throws LoginException {
        ClientService cs;
        switch (clientType) {
            case ADMIN:
                cs = ctx.getBean(AdminService.class);
                break;
            case COMPANY:
                cs = ctx.getBean(CompanyService.class);
                break;
            case CUSTOMER:
                cs = ctx.getBean(CustomerService.class);
                break;
            default:
                cs = null;
        }
        return cs.login(email, password) ? cs : null;
    }

    // Client types for login and requesting options
    public enum ClientType {

        ADMIN,
        COMPANY,
        CUSTOMER
    }
}
