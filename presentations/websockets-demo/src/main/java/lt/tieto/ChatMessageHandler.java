package lt.tieto;

import java.io.IOException;
import java.util.Collection;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import com.fasterxml.jackson.databind.ObjectMapper;
import lt.tieto.payloads.MemberConnected;
import lt.tieto.payloads.MemberDisconnected;
import lt.tieto.payloads.MessagePosted;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

public class ChatMessageHandler extends TextWebSocketHandler {

    private static final ObjectMapper mapper = new ObjectMapper();
    private static final Logger LOG = LoggerFactory.getLogger(ChatMessageHandler.class);

    private static Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        super.afterConnectionEstablished(session);

        String username = getUsername(session);

        LOG.info("User " + username + " has connected.");
        sessions.put(username, session);
        MemberConnected mcm = new MemberConnected();
        mcm.setUsername(username);
        broadcast(mcm, sessions.values());
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        super.handleTextMessage(session, message);

        MessagePosted mp = mapper.readValue(message.getPayload(), MessagePosted.class);
        LOG.info("User " + mp.getUsername() + "sent '" + mp.getText() + "' message");
        broadcast(mp, sessions.values());
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        super.afterConnectionClosed(session, status);

        String username = getUsername(session);
        LOG.info("User " + username + " has disconnected.");

        MemberDisconnected md = new MemberDisconnected();
        md.setUsername(username);
        broadcast(md, sessions.values());
        sessions.remove(username);
    }

    private void broadcast(Object mcm, Collection<WebSocketSession> receivers) {
        try {
            TextMessage message = new TextMessage(mapper.writeValueAsBytes(mcm));
            for (WebSocketSession session: receivers) {
                session.sendMessage(message);
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

    }

    private static String getUsername(WebSocketSession session) {
        String[] uriParts = session.getUri().toString().split("/");
        return uriParts[uriParts.length -1];
    }
}
