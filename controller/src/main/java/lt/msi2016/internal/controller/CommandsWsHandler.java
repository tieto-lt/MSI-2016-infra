package lt.msi2016.internal.controller;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.socket.PongMessage;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

public class CommandsWsHandler extends TextWebSocketHandler {

    private static Logger LOG = LoggerFactory.getLogger(CommandsWsHandler.class);

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        LOG.info("Received {}", message);
        super.handleTextMessage(session, message);
    }

    @Override
    protected void handlePongMessage(WebSocketSession session, PongMessage message) throws Exception {
        LOG.info("Received pong message from {}", session.getUri());

        // TODO: refresh in controller manager
        super.handlePongMessage(session, message);
    }
}
