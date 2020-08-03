package com.miko.couponsystemfullstack.jobs;

import com.miko.couponsystemfullstack.models.Customer;
import com.miko.couponsystemfullstack.repositories.CouponRepository;
import com.miko.couponsystemfullstack.repositories.CustomerRepository;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.Calendar;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class CouponDailyJob implements Runnable {

    private final CouponRepository couponRepo;
    private final CustomerRepository customerRepo;
    private boolean quit = false;

    public CouponDailyJob(CouponRepository couponsRepository, CustomerRepository customersRepo) {
        this.couponRepo = couponsRepository;
        this.customerRepo = customersRepo;
    }

    public void stop() {
        this.quit = true;
    }

    @Override
    public void run() {
        while (!quit) {
            // Delete expired coupons from database
            couponRepo.findAll()
                    .stream()
                    .filter(c -> c.getEndDate().before(Calendar.getInstance().getTime()))   // filter expired coupons
                    .forEach(coupon -> {
                        List<Customer> customers = customerRepo.findAll()      // get only the customers who bought the coupon
                                .stream()
                                .filter(customer -> customer.getCoupons().contains(coupon))
                                .collect(Collectors.toList());
                        customers.forEach(customer -> customer.getCoupons().remove(coupon)); // removes the coupon before the deletion
                        customerRepo.saveAll(customers);
                        couponRepo.delete(coupon);
                    });
            try {
                Thread.sleep(Duration.ofHours(24).toMillis());
            } catch (InterruptedException e) {
                System.out.println("An error occurred: " + e.getMessage());
            }
        }
    }
}
