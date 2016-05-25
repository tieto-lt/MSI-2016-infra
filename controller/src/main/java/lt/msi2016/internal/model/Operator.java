package lt.msi2016.internal.model;

import org.springframework.web.socket.WebSocketSession;

import java.time.LocalTime;

/**
 * Model represents connected Operator
 */
public class Operator {

    public final String token;
    public final WebSocketSession session;
    public final OperatorState state;
    private LocalTime lastPing;

    public Operator(String token, WebSocketSession session, LocalTime lastPing) {
        this.token = token;
        this.session = session;
        this.lastPing = lastPing;
        this.state = OperatorState.Idle;
    }

    public void heartbeat() {
        lastPing = LocalTime.now();
    }

}
