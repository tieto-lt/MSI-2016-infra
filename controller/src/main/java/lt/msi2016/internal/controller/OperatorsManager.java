package lt.msi2016.internal.controller;


import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketSession;

import java.time.LocalTime;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class OperatorsManager {

    public static class Operator {
        public final WebSocketSession session;
        public final LocalTime lastPing;

        public Operator(WebSocketSession session, LocalTime lastPing) {
            this.session = session;
            this.lastPing = lastPing;
        }
    }

    private final Map<String, Operator> operators = new ConcurrentHashMap<>();

    public void registerOperator(String uniqueId) {
        operators.put(uniqueId, new Operator(null, LocalTime.now()));
    }

    public void registerSession(String uniqueId, WebSocketSession session) {
        operators.put(uniqueId, new Operator(session, LocalTime.now()));
    }

    public Optional<WebSocketSession> getSession(String uniqueId) {
        return Optional.ofNullable(operators.get(uniqueId))
            .map(operator -> operator.session);
    }

}
