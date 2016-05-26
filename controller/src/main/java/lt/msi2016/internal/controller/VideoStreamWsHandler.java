package lt.msi2016.internal.controller;

import lt.msi2016.internal.controller.ws.WsUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.socket.BinaryMessage;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.BinaryWebSocketHandler;


public class VideoStreamWsHandler extends BinaryWebSocketHandler {

    private static Logger LOG = LoggerFactory.getLogger(VideoStreamWsHandler.class);

    @Autowired
    private VideoStreamRegistry videoRegistry;

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        session.setBinaryMessageSizeLimit(1000000);
        LOG.info("Got connection from {}", session.getUri());
        videoRegistry.startRecording(WsUtils.getOperatorToken(session));
    }

    @Override
    protected void handleBinaryMessage(WebSocketSession session, BinaryMessage message) throws Exception {
        LOG.info("Received video bytes: {}", message.getPayloadLength());
        LOG.info("Received video bytes: {}", message.getPayload().capacity());

        videoRegistry.record(WsUtils.getOperatorToken(session), message.getPayload());

        super.handleBinaryMessage(session, message);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        videoRegistry.dump(WsUtils.getOperatorToken(session));
        super.afterConnectionClosed(session, status);
    }
}
