package lt.msi2016.internal.controller;

import org.springframework.stereotype.Service;

/**
 * Service responsible for managing operators token.
 *
 * Every new drone holder should generate token in this system
 *   and provide it to operator application.
 * Upon every request from drone operator system should check if this particular token exists in system.
 *
 * TODO: for now 0 security. Later this class should store and manage tokens lifecycle.
 */
@Service
public class TokenManagerService {


    public void checkToken(String operatorToken) {
        // if operatorToken not exists. throw exception
    }
}
