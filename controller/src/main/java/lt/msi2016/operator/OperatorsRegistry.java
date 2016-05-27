package lt.msi2016.operator;


import lt.msi2016.operator.model.Operator;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketSession;

import java.time.LocalTime;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Available operators registry.
 *
 */
@Component
public class OperatorsRegistry {

    private final Map<String, Operator> operators = new ConcurrentHashMap<>();

    public Operator registerOperator(String operatorToken, WebSocketSession session) {
        Operator operator = new Operator(operatorToken, session, LocalTime.now());
        operators.put(operatorToken, operator);
        return operator;
    }

    public Optional<Operator> pickDroneIfAvailable() {
        return operators.values().stream()
                .filter(Operator::isDroneAvailable)
                .findAny();
    }

    public Optional<WebSocketSession> getSession(String operatorToken) {
        return Optional.ofNullable(operators.get(operatorToken))
            .map(operator -> operator.session);
    }

    public Operator getOperator(String operatorToken) {
        return operators.get(operatorToken);
    }

    public Optional<String> getOperatorCurrentMissionId(String operatorToken) {
        Operator operator = operators.get(operatorToken);
        if (operator != null) {
            return operator.getMissionId();
        }
        return Optional.empty();
    }

    public void operatorHeartbeat(String operatorToken) {
        Operator operator = operators.get(operatorToken);
        operator.heartbeat();
    }

}
