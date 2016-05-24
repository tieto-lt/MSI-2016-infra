package lt.msi2016.internal.model;


public class OperatorState {

    public enum State {
        Initialized, Connected, Idle
    }

    public State state;
    public String id;

    public OperatorState(State state, String id) {
        this.state = state;
        this.id = id;
    }
}
