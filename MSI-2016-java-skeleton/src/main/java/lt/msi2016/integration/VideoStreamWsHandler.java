package lt.msi2016.integration;

import lt.msi2016.video.VideoStreamRegistry;
import lt.msi2016.ws.WsUtils;
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
        videoRegistry.startRecording(WsUtils.getOperatorToken(session)); // TODO: this should be on mission start
    }

    @Override
    protected void handleBinaryMessage(WebSocketSession session, BinaryMessage message) throws Exception {
        LOG.info("Received video bytes: {}", message.getPayloadLength());

        super.handleBinaryMessage(session, message);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        super.afterConnectionClosed(session, status);
    }
}
