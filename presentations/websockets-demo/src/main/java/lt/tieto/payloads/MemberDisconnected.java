package lt.tieto.payloads;

public class MemberDisconnected extends Payload {

    private String username;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
