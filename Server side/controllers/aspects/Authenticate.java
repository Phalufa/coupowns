package com.miko.couponsystemfullstack.controllers.aspects;

import com.miko.couponsystemfullstack.services.login.LoginManager;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.METHOD, ElementType.TYPE})
public @interface Authenticate {

    LoginManager.ClientType clientType();
}
