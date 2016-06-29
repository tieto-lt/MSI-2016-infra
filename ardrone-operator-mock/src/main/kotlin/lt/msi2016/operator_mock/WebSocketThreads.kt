package lt.msi2016.operator_mock

import org.springframework.web.socket.BinaryMessage
import org.springframework.web.socket.TextMessage
import org.springframework.web.socket.WebSocketSession
import java.nio.ByteBuffer


abstract class WebSocketThread(protected val session: WebSocketSession) : Runnable {

    protected var running = true;

    fun stop() {
        running = false
        session.close()
    }

    fun sleep(millis: Long = 100) {
        try {
            Thread.sleep(millis)
        } catch(e: InterruptedException) {
            println("Interupted " + javaClass)
            stop();
        }
    }
}

class VideoWsThread(
        session: WebSocketSession,
        private val bytesToStream: ByteArray) : WebSocketThread(session) {

    override fun run() {
        val binaryMessage = BinaryMessage(ByteBuffer.wrap(bytesToStream))
        while(running) {
            session.sendMessage(binaryMessage)
            sleep(1000)
        }
    }
}

class CommandWsThreads(
        session: WebSocketSession,
        private val commandPayload: String,
        private val imagePayload: String) : WebSocketThread(session) {

    override fun run() {
        val commandMessage = TextMessage(commandPayload)
        val imageMessage = TextMessage(imagePayload)
        while(running) {
            for (i in 1..10) {
                session.sendMessage(commandMessage)
                sleep()
            }
            session.sendMessage(imageMessage)
            sleep(200)
        }
    }


}