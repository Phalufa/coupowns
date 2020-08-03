package com.miko.couponsystemfullstack.controllers;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class WebConfig {

    @Bean
    public Map<String, Session> sessionsMap() {
        return new HashMap<>();
    }
}
