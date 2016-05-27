package lt.msi2016.ws;


import org.springframework.web.socket.WebSocketSession;

public class WsUtils {

    public static String getOperatorToken(WebSocketSession session) {
        String[] uriParts = session.getUri().toString().split("/");
        return uriParts[uriParts.length -1];
    }
}
