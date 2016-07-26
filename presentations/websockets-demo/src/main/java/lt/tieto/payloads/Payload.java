package lt.tieto.payloads;

public abstract class Payload {

    public String getPayloadType() {
        return this.getClass().getSimpleName();
    }
}
