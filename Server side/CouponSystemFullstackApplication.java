package com.miko.couponsystemfullstack;

import com.miko.couponsystemfullstack.jobs.CouponDailyJob;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;

@SpringBootApplication
public class CouponSystemFullstackApplication {

    public static void main(String[] args) {
        ConfigurableApplicationContext ctx = SpringApplication.run(CouponSystemFullstackApplication.class, args);
        CouponDailyJob cdj = ctx.getBean(CouponDailyJob.class);
        Thread thread = new Thread(cdj);
        thread.start();
    }
}
