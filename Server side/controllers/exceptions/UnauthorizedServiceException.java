package com.miko.couponsystemfullstack.controllers.exceptions;

public class UnauthorizedServiceException extends Exception {
    public UnauthorizedServiceException() {
        super("Unauthorized operation");
    }
}
