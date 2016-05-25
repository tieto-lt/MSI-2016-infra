package lt.msi2016.internal.controller;


import lt.msi2016.internal.model.Operator;
import lt.msi2016.internal.model.OperatorState;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketSession;

import java.time.LocalTime;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class OperatorsRegistry {

    private final Map<String, Operator> operators = new ConcurrentHashMap<>();

    public void registerOperatorSession(String operatorToken, WebSocketSession session) {
        operators.put(operatorToken, new Operator(operatorToken, session, LocalTime.now()));
    }

    public Optional<WebSocketSession> getSession(String operatorToken) {
        return Optional.ofNullable(operators.get(operatorToken))
            .map(operator -> operator.session);
    }

    public void operatorHeartbeat(String operatorToken) {
        Operator operator = operators.get(operatorToken);
        operator.heartbeat();
    }

}
