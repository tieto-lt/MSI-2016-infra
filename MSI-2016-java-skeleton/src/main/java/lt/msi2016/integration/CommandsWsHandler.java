package lt.msi2016.integration;


import lt.msi2016.operator.OperatorsRegistry;
import lt.msi2016.ws.WsUtils;
import lt.msi2016.operator.model.Operator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.socket.CloseStatus;
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
        Operator operator = operatorsRegistry.registerOperator(operatorToken, session);
        // TODO: this not belongs here.
        // Operators now are controlled only by connection establishment an closing. Later User should pick drone by himself;
        operator.bookDrone("123");

        LOG.info("Got connection from {}, {}", operatorToken, session.getUri());
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        super.handleTextMessage(session, message);
    }

    @Override
    protected void handlePongMessage(WebSocketSession session, PongMessage message) throws Exception {
        String operatorToken = WsUtils.getOperatorToken(session);
        LOG.info("Received pong message from {}", operatorToken);
        operatorsRegistry.operatorHeartbeat(operatorToken);
        super.handlePongMessage(session, message);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        String operatorToken = WsUtils.getOperatorToken(session);
        super.afterConnectionClosed(session, status);
    }
}
