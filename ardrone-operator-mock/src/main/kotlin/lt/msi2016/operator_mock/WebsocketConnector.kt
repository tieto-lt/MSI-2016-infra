package lt.msi2016.operator_mock

import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component
import org.springframework.util.concurrent.FailureCallback
import org.springframework.util.concurrent.SuccessCallback
import org.springframework.web.socket.TextMessage
import org.springframework.web.socket.WebSocketSession
import org.springframework.web.socket.client.standard.StandardWebSocketClient
import org.springframework.web.socket.handler.TextWebSocketHandler


@Component
class WebsocketConnector () {

    companion object {
        private val LOG = LoggerFactory.getLogger(javaClass)
    }

    fun getCommandWsSession(hostname: String, token: String, successCallback: SuccessCallback<WebSocketSession>) {
        val uri = "ws://$hostname/ws/api/$token"
        getSession(uri, successCallback)
    }

    fun getVideoWsSession(hostname: String, token: String, successCallback: SuccessCallback<WebSocketSession>) {
        val uri = "ws://$hostname/ws/video/$token"
        getSession(uri, successCallback)
    }

    private fun getSession(uri: String, successCallback: SuccessCallback<WebSocketSession>) {
        val standardWebSocketClient = StandardWebSocketClient()
        standardWebSocketClient.doHandshake(WSHandler(), uri)
                .addCallback(successCallback, errorCallback)
    }

    private val errorCallback = FailureCallback { ex: Throwable -> LOG.error("Failed to connect to {}. ", ex) }

}

class WSHandler : TextWebSocketHandler() {

    companion object {
        private val LOG = LoggerFactory.getLogger(javaClass)
    }

    override fun handleTextMessage(session: WebSocketSession?, message: TextMessage?) {
        LOG.info("Received from server: {}", message?.payload)
        super.handleTextMessage(session, message)
    }

    override fun afterConnectionEstablished(session: WebSocketSession?) {
        LOG.info("Connected to server");
        super.afterConnectionEstablished(session)
    }
}
