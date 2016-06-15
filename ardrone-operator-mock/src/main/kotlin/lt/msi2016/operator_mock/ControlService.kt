package lt.msi2016.operator_mock

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import com.google.common.io.Resources
import lt.msi2016.operator_mock.models.Control
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.cache.annotation.Cacheable
import org.springframework.stereotype.Service
import org.springframework.util.concurrent.SuccessCallback
import java.util.*
import java.util.concurrent.Executors


@Service
class ControlService @Autowired constructor(
        private val restConnector: RestConnector,
        private val objectMapper: ObjectMapper,
        private val websocketConnector: WebsocketConnector) {

    companion object {
        private val LOG = LoggerFactory.getLogger(javaClass)
    }

    fun callControl(control: Control) {
        val hostname = control.hostName
        val token = control.token
        val executor = Executors.newFixedThreadPool(10)
        var commandWsThread: CommandWsThreads? = null;
        var videoWsThread: VideoWsThread? = null;
        val firstMission = restConnector.getFirstMission(hostname)

        websocketConnector.getCommandWsSession(hostname, token, SuccessCallback {
            commandWsThread = CommandWsThreads(it, getStateUpdateJson(token), getImageJson())
            executor.submit(commandWsThread)
        })
        websocketConnector.getVideoWsSession(hostname, token, SuccessCallback {
            videoWsThread = VideoWsThread(it, getVideoBytes())
            executor.submit(videoWsThread)
        })

        firstMission.map {
            randomDelay()
            val missionId = it.missionId
            restConnector.missionComplete(hostname, missionId, getMissionResultJson(missionId))
        }

        commandWsThread?.stop()
        videoWsThread?.stop()
        executor.shutdown();
    }

    private fun getMissionResultJson(missionId: String): JsonNode {
        val json = readFile("mission_data.json")
        val formattedJson = String.format(json, missionId)
        return objectMapper.readTree(formattedJson)
    }

    private fun getStateUpdateJson(token: String): String {
        val json = readFile("state_update.json")
        return String.format(json, token)
    }

    private fun getImageJson(): String {
        return readFile("image.json")
    }

    private fun getVideoBytes(): ByteArray {
        return readBytes("video.h264")

    }

    @Cacheable("StringFromFile")
    private fun readFile(fileName: String): String {
        val url = Resources.getResource(fileName);
        return Resources.toString(url, Charsets.UTF_8);
    }

    @Cacheable("BytesFromFile")
    private fun readBytes(fileName: String): ByteArray {
        val url = Resources.getResource(fileName);
        return Resources.toByteArray(url)
    }

    private fun randomDelay() {
        val delay = Random().nextInt(60000)
        println(delay)
        try {
            Thread.sleep(delay.toLong())
        } catch(e: InterruptedException) {
        }
    }
}


