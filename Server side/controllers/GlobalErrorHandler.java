package com.miko.couponsystemfullstack.controllers;

import com.miko.couponsystemfullstack.controllers.exceptions.UnauthorizedServiceException;
import com.miko.couponsystemfullstack.services.exceptions.CouponDateException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import javax.persistence.EntityExistsException;
import javax.persistence.EntityNotFoundException;
import javax.security.auth.login.LoginException;
import java.util.concurrent.TimeoutException;


@RestControllerAdvice
public class GlobalErrorHandler {

    @ExceptionHandler({UnauthorizedServiceException.class, NullPointerException.class})
    private ResponseEntity<?> unauthorizedHandler(Exception e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized operation");
    }

    @ExceptionHandler({EmptyResultDataAccessException.class, EntityNotFoundException.class})
    private ResponseEntity<?> emptyResultHandler(RuntimeException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Missing entity");
    }

    @ExceptionHandler(EntityExistsException.class)
    private ResponseEntity<?> alreadyExistsHandler(RuntimeException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Entity already exists");
    }

    @ExceptionHandler(CouponDateException.class)
    private ResponseEntity<?> couponDatesHandler(Exception e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
    }

    @ExceptionHandler(TimeoutException.class)
    private ResponseEntity<?> timeoutHandler(RuntimeException e) {
        return ResponseEntity.status(HttpStatus.REQUEST_TIMEOUT).body("Session timeout, please re-log");
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<?> methodNotSupportHandler(Exception e) {
        return ResponseEntity.badRequest().body("Operation Not Supported");
    }

    @ExceptionHandler(LoginException.class)
    public ResponseEntity<?> loginExceptionHandler(Exception e) {
        return ResponseEntity.badRequest().body("Invalid email/password");
    }
}
