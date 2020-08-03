package com.miko.couponsystemfullstack.controllers.clients;

import com.miko.couponsystemfullstack.controllers.Session;
import com.miko.couponsystemfullstack.controllers.aspects.Authenticate;
import com.miko.couponsystemfullstack.models.Category;
import com.miko.couponsystemfullstack.models.Coupon;
import com.miko.couponsystemfullstack.services.CustomerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

import static com.miko.couponsystemfullstack.services.login.LoginManager.ClientType.*;

@RestController
@RequestMapping("user/customer")
@Authenticate(clientType = CUSTOMER)
public class CustomerController {

    private final Map<String, Session> sessionsMap;

    public CustomerController(Map<String, Session> sessionsMap) {
        this.sessionsMap = sessionsMap;
    }

    private CustomerService getService(String token) {
        return (CustomerService) sessionsMap.get(token).getClientService();
    }

    @PostMapping("/coupon/{token}")
    public ResponseEntity<?> purchaseCoupon(@PathVariable String token, @RequestBody Coupon coupon) {
        return ResponseEntity.ok(getService(token).purchaseCoupon(coupon));
    }

    @DeleteMapping("/coupon/{token}")
    public ResponseEntity<?> removeCoupon(@PathVariable String token, @RequestBody Coupon coupon) {
        boolean deleted = getService(token).removePurchasedCoupon(coupon);
        return deleted ?
                ResponseEntity.status(409).build() : ResponseEntity.ok("Entity deleted");
    }

    @GetMapping("/{token}")
    public ResponseEntity<?> getCustomerDetails(@PathVariable String token) {
        return ResponseEntity.ok(getService(token).getCustomerDetails());
    }

    @GetMapping("/coupons/{token}")
    public ResponseEntity<?> getCustomerCoupons(@PathVariable String token) {
        return ResponseEntity.ok(getService(token).getCustomerCoupons());
    }

    @GetMapping("/coupons/category/{category}/{token}")
    public ResponseEntity<?> getCustomerCouponsByCategory(@PathVariable String token, @PathVariable Category category) {
        return ResponseEntity.ok(getService(token).getCustomerCoupons(category));
    }

    @GetMapping("/coupons/price/{maxPrice}/{token}")
    public ResponseEntity<?> getCustomerCouponsByMaxPrice(@PathVariable String token, @PathVariable long maxPrice) {
        return ResponseEntity.ok(getService(token).getCustomerCoupons(maxPrice));
    }
}
