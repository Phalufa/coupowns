package com.miko.couponsystemfullstack.controllers;

import com.miko.couponsystemfullstack.services.ClientService;
import com.miko.couponsystemfullstack.services.login.LoginManager;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.security.auth.login.LoginException;
import java.util.Base64;
import java.util.Map;
import java.util.UUID;

import static com.miko.couponsystemfullstack.services.login.LoginManager.*;

@RestController
public class LoginController {

    private final LoginManager loginManager;
    private final Map<String, Session> sessionsMap;

    public LoginController(LoginManager loginManager, Map<String, Session> sessionsMap) {
        this.loginManager = loginManager;
        this.sessionsMap = sessionsMap;
    }

    /**
     *
     * @return a string that contains token and basic encoded role
     */
    @PostMapping("/login/{email}/{password}/{clientType}")
    public String login(@PathVariable String email,
                        @PathVariable String password,
                        @PathVariable ClientType clientType) throws LoginException {
        ClientService clientService = loginManager.login(email, password, clientType);
        if (clientService != null) {
            String token = UUID.randomUUID().toString();
            String role = Base64.getEncoder().encodeToString(clientType.name().getBytes());
            String time = System.currentTimeMillis() + "";
            sessionsMap.put(token, new Session(clientService, System.currentTimeMillis()));
            return "\"{" + token + "role:" + role + "time:" + time + "}\"";
        }
        throw new LoginException();
    }

    @PostMapping("/logout/{token}")
    public void logout(@PathVariable String token) {
        sessionsMap.remove(token);
    }
}
