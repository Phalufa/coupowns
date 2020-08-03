package com.miko.couponsystemfullstack.controllers.aspects;

import com.miko.couponsystemfullstack.controllers.Session;
import com.miko.couponsystemfullstack.controllers.exceptions.UnauthorizedServiceException;
import com.miko.couponsystemfullstack.services.AdminService;
import com.miko.couponsystemfullstack.services.ClientService;
import com.miko.couponsystemfullstack.services.CompanyService;
import com.miko.couponsystemfullstack.services.CustomerService;
import com.miko.couponsystemfullstack.services.login.LoginManager;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.TimeoutException;

import static com.miko.couponsystemfullstack.services.login.LoginManager.*;

@Aspect
@Component
public class AuthenticationAspect {

    private final Map<String, Session> sessionsMap;
    private static final long TIMEOUT = Duration.ofMinutes(30).toMillis();

    public AuthenticationAspect(Map<String, Session> sessionsMap) {
        this.sessionsMap = sessionsMap;
    }

    /**
     * Authenticates the token of the client whenever a request
     * is being sent. The request will be executed only if the
     * session time has not passed #TIME_OUT and the session's
     * client service match the service of the request.
     *
     * @param joinPoint the requested method
     * @return the response of the requested method
     * @throws TimeoutException if authenticated token session timeout
     * @throws UnauthorizedServiceException if token does not exists or unmatched the service request
     */
    @Around("@annotation(Authenticate)||@within(Authenticate)")
    private ResponseEntity<?> authenticateClient(ProceedingJoinPoint joinPoint) throws Throwable {
        String token = (String) joinPoint.getArgs()[0];
        if (sessionsMap.containsKey(token)) {       // check if token exists
            Session currentSession = sessionsMap.get(token);
            ClientService service = currentSession.getClientService();
            ClientType serviceAuthAnnotation = joinPoint.getTarget()
                    .getClass()     // the class of the method
                    .getAnnotation(Authenticate.class).clientType();

            // checks if the invoked method's class is of the token's client service type
            // if
            authenticateService(service, serviceAuthAnnotation);
            // check if 30 minutes have passed since last request
            if (System.currentTimeMillis() - currentSession.getLastSeen() < TIMEOUT) {
                ResponseEntity<?> response = (ResponseEntity<?>) joinPoint.proceed();
                if (response.getStatusCode().equals(HttpStatus.OK)) {
                    // modify the token's session duration time on successful request
                    currentSession.setLastSeen(System.currentTimeMillis());
                    sessionsMap.put(token, currentSession);
                }
                    return response;
            } else {
                throw new TimeoutException();
            }
        }
        throw new UnauthorizedServiceException();
    }

    private void authenticateService(ClientService service,
                                     ClientType serviceAuthAnnotation) throws UnauthorizedServiceException {
        switch (serviceAuthAnnotation) {
            case ADMIN:
                if (!(service instanceof AdminService))
                    throw new UnauthorizedServiceException();
                break;
            case CUSTOMER:
                if (!(service instanceof CustomerService))
                    throw new UnauthorizedServiceException();
                break;
            case COMPANY:
                if (!(service instanceof CompanyService))
                    throw new UnauthorizedServiceException();
                break;
        }
    }
}
