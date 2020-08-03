package com.miko.couponsystemfullstack.controllers.clients;

import com.miko.couponsystemfullstack.controllers.Session;
import com.miko.couponsystemfullstack.controllers.aspects.Authenticate;
import com.miko.couponsystemfullstack.models.Category;
import com.miko.couponsystemfullstack.models.Coupon;
import com.miko.couponsystemfullstack.services.CompanyService;
import com.miko.couponsystemfullstack.services.exceptions.CouponDateException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

import static com.miko.couponsystemfullstack.services.login.LoginManager.ClientType.*;

@RestController
@RequestMapping("/user/company")
@Authenticate(clientType = COMPANY)
public class CompanyController {

    private final Map<String, Session> sessionMap;

    public CompanyController(Map<String, Session> sessionMap) {
        this.sessionMap = sessionMap;
    }

    private CompanyService getService(String token) {
        return (CompanyService) sessionMap.get(token).getClientService();
    }

    @GetMapping("/coupon/{id}/{token}")
    public ResponseEntity<?> getCoupon(@PathVariable String token, @PathVariable long id) {
        return ResponseEntity.ok(getService(token).getCompanyCouponById(id));
    }

    @PostMapping("/coupon/{token}")
    public ResponseEntity<?> addCoupon(@PathVariable String token, @RequestBody Coupon coupon) throws CouponDateException {
        return ResponseEntity.ok(getService(token).addCoupon(coupon));
    }

    @PutMapping("/coupon/{token}")
    public ResponseEntity<?> updateCoupon(@PathVariable String token, @RequestBody Coupon coupon) throws CouponDateException {
        return ResponseEntity.ok(getService(token).updateCoupon(coupon));
    }

    @DeleteMapping("/coupon/{id}/{token}")
    public ResponseEntity<?> deleteCoupon(@PathVariable String token, @PathVariable long id) {
        boolean deleted = getService(token).deleteCoupon(id);
        return deleted ?
                ResponseEntity.status(409).build() : ResponseEntity.ok("Entity deleted");
    }

    @GetMapping("/{token}")
    public ResponseEntity<?> getCompanyDetails(@PathVariable String token) {
        return ResponseEntity.ok(getService(token).getCompanyDetails());
    }

    @GetMapping("/coupons/{token}")
    public ResponseEntity<?> getCompanyCoupons(@PathVariable String token) {
        return ResponseEntity.ok(getService(token).getCompanyCoupons());
    }

    @GetMapping("/coupons/category/{category}/{token}")
    public ResponseEntity<?> getCompanyCouponsByCategory(@PathVariable String token, @PathVariable Category category) {
        return ResponseEntity.ok(getService(token).getCompanyCoupons(category));
    }

    @GetMapping("/coupons/price/{maxPrice}/{token}")
    public ResponseEntity<?> getCompanyCouponsByMaxPrice(@PathVariable String token, @PathVariable long maxPrice) {
        return ResponseEntity.ok(getService(token).getCompanyCoupons(maxPrice));
    }
}
