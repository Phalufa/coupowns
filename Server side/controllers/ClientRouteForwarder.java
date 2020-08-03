package com.miko.couponsystemfullstack.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Forwards all GET requests that did not match a RequestMapping to /index.html so that
 * client routes can be handled by client code in browser.
 *
 */
@Controller
public class ClientRouteForwarder {

    @GetMapping("/**/{[path:[^\\.]*}")
    public String forward() {
        return "forward:/";
    }
}
