package com.miko.couponsystemfullstack.controllers.clients;

import com.miko.couponsystemfullstack.models.Category;
import com.miko.couponsystemfullstack.models.Coupon;
import com.miko.couponsystemfullstack.repositories.CouponRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityNotFoundException;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("show/coupons")
public class GuestController {

    private CouponRepository couponRepo;

    public GuestController(CouponRepository couponRepo) {
        this.couponRepo = couponRepo;
    }

    @GetMapping
    public ResponseEntity<?> getCoupons() {
        List<Coupon> coupons = couponRepo.findAll();
        return ResponseEntity.ok(coupons);
    }

    @GetMapping("/filter/{category}")
    public ResponseEntity<?> getCouponsByCategory(@PathVariable Category category) {
        List<Coupon> coupons = couponRepo.findAll()
                .stream()
                .filter(coupon -> coupon.getCategory() == category)
                .collect(Collectors.toList());
        return ResponseEntity.ok(coupons);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCoupon(@PathVariable long id) {
        return ResponseEntity.ok(couponRepo.findById(id).orElseThrow(EntityNotFoundException::new));
    }
}
