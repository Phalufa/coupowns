package com.miko.couponsystemfullstack.controllers.clients;

import com.miko.couponsystemfullstack.controllers.aspects.Authenticate;
import com.miko.couponsystemfullstack.controllers.exceptions.UnauthorizedServiceException;
import com.miko.couponsystemfullstack.models.Company;
import com.miko.couponsystemfullstack.models.Customer;
import com.miko.couponsystemfullstack.services.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static com.miko.couponsystemfullstack.services.login.LoginManager.ClientType.*;

@RestController
@RequestMapping("/user/admin")
@Authenticate(clientType = ADMIN)
public class AdminController {

    private final AdminService service;

    public AdminController(AdminService service) {
        this.service = service;
    }

    @PostMapping("/company/{token}")
    public ResponseEntity<?> addCompany(@PathVariable String token,
                                        @RequestBody Company company) {
        return ResponseEntity.ok(service.addCompany(company));
    }

    @PostMapping("/customer/{token}")
    public ResponseEntity<?> addCustomer(@PathVariable String token,
                                         @RequestBody Customer customer) {
        return ResponseEntity.ok(service.addCustomer(customer));
    }

    @PutMapping("/company/{token}")
    public ResponseEntity<?> updateCompany(@PathVariable String token,
                                           @RequestBody Company company) {
        return ResponseEntity.ok(service.updateCompany(company));
    }

    @PutMapping("/customer/{token}")
    public ResponseEntity<?> updateCustomer(@PathVariable String token,
                                            @RequestBody Customer customer) {
        return ResponseEntity.ok(service.updateCustomer(customer));
    }

    @DeleteMapping("/company/{id}/{token}")
    public ResponseEntity<?> deleteCompany(@PathVariable String token,
                                           @PathVariable long id) {
        boolean deleted = service.deleteCompany(id);
        return deleted ?
                ResponseEntity.status(409).build() : ResponseEntity.ok("Entity deleted");
    }

    @DeleteMapping("/customer/{id}/{token}")
    public ResponseEntity<?> deleteCustomer(@PathVariable String token,
                                           @PathVariable long id) {
        boolean deleted = service.deleteCustomer(id);
        return deleted ?
                ResponseEntity.status(409).build() : ResponseEntity.ok("Entity deleted");
    }

    @GetMapping("/company/{id}/{token}")
    public ResponseEntity<?> getCompany(@PathVariable String token, @PathVariable long id) {
        return ResponseEntity.ok(service.getCompany(id));
    }

    @GetMapping("/customer/{id}/{token}")
    public ResponseEntity<?> getCustomer(@PathVariable String token, @PathVariable long id) {
        return ResponseEntity.ok(service.getCustomer(id));
    }

    @GetMapping("/company/{token}")
    public ResponseEntity<?> getCompanies(@PathVariable String token) {
        return ResponseEntity.ok(service.getCompanies());
    }

    @GetMapping("/customer/{token}")
    public ResponseEntity<?> getCustomers(@PathVariable String token) {
        return ResponseEntity.ok(service.getCustomers());
    }


}
