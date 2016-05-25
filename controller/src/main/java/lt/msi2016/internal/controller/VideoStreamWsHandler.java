package lt.msi2016.internal.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.socket.BinaryMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.BinaryWebSocketHandler;


public class VideoStreamWsHandler extends BinaryWebSocketHandler {

    private static Logger LOG = LoggerFactory.getLogger(VideoStreamWsHandler.class);

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        LOG.info("Got connection from {}", session.getUri());
    }

    @Override
    protected void handleBinaryMessage(WebSocketSession session, BinaryMessage message) throws Exception {
        LOG.info("Received video bytes: {}", message.getPayloadLength());
        super.handleBinaryMessage(session, message);
    }
}
