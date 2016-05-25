package lt.msi2016.internal.controller;


import lt.msi2016.internal.controller.ws.WsUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.socket.PongMessage;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

public class CommandsWsHandler extends TextWebSocketHandler {

    private static Logger LOG = LoggerFactory.getLogger(CommandsWsHandler.class);

    @Autowired
    private OperatorsRegistry operatorsRegistry;

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        String operatorToken = WsUtils.getOperatorToken(session);
        operatorsRegistry.registerOperatorSession(operatorToken, session);
        LOG.info("Got connection from {}", operatorToken);
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String operatorToken = WsUtils.getOperatorToken(session);
        LOG.info("Received message {}: {}", operatorToken, message);
        super.handleTextMessage(session, message);
    }

    @Override
    protected void handlePongMessage(WebSocketSession session, PongMessage message) throws Exception {
        String operatorToken = WsUtils.getOperatorToken(session);
        LOG.info("Received pong message from {}", operatorToken);
        operatorsRegistry.operatorHeartbeat(operatorToken);
        super.handlePongMessage(session, message);
    }
}
