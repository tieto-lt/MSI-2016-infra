package lt.msi2016.operator.model;

import org.springframework.web.socket.WebSocketSession;

import java.time.LocalTime;
import java.util.Optional;

/**
 * Model represents connected Operator
 */
public class Operator {

    public final String token;
    public final WebSocketSession session;
    private OperatorState state;
    private LocalTime lastPing;
    private Optional<String> missionId;

    public Operator(String token, WebSocketSession session, LocalTime lastPing) {
        this.token = token;
        this.session = session;
        this.lastPing = lastPing;
        this.state = OperatorState.Idle;
        this.missionId = Optional.empty();
    }

    public void heartbeat() {
        lastPing = LocalTime.now();
    }

    public void bookDrone(String missionId) {
        this.missionId = Optional.of(missionId);
        this.state = OperatorState.Busy;
    }

    public void freeDrone() {
        this.missionId = Optional.empty();
        this.state = OperatorState.Idle;
    }

    public boolean isDroneAvailable() {
        return state == OperatorState.Idle;
    }

    public Optional<String> getMissionId() {
        return missionId;
    }

}
