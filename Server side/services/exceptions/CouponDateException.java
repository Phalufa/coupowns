package com.miko.couponsystemfullstack.services.exceptions;

public class CouponDateException extends Exception {
    public CouponDateException() {
        super("Start Date must be after today, End Date must be equal or after Start Date");
    }
}
