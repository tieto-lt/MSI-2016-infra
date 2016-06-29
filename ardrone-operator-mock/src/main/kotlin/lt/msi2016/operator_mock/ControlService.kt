package lt.msi2016.operator_mock

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import com.google.common.base.Throwables
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
        private val websocketConnector: WebsocketConnector,
        private val cachableFileReader: CachableFileReader) {

    companion object {
        private val LOG = LoggerFactory.getLogger(javaClass)
    }

    fun callControl(control: Control, delayOption: Int?) {
        val delay = delayOption ?: getRandomDelay();
        val hostname = control.hostName
        val token = control.token
        val executor = Executors.newFixedThreadPool(2)
        var commandWsThread: CommandWsThreads? = null;
        var videoWsThread: VideoWsThread? = null;

        try {
            val firstMission = restConnector.getFirstMission(hostname)
            if (!firstMission.isPresent) {
                return
            }
            val mission = restConnector.reserveMission(hostname, firstMission.get().missionId)

            websocketConnector.getCommandWsSession(hostname, token, SuccessCallback {
                commandWsThread = CommandWsThreads(it, getStateUpdateJson(token), getImageJson())
                executor.submit(commandWsThread)
            })
            websocketConnector.getVideoWsSession(hostname, token, SuccessCallback {
                videoWsThread = VideoWsThread(it, getVideoBytes())
                executor.submit(videoWsThread)
            })

            sleep(delay)
            val missionId = mission.missionId
            restConnector.missionComplete(hostname, missionId, getMissionResultJson(missionId))
        } catch (e: Exception) {
            Throwables.propagate(e);
        } finally {
            commandWsThread?.stop()
            videoWsThread?.stop()
            executor.shutdown();
        }
    }

    private fun getMissionResultJson(missionId: String): JsonNode {
        val json = cachableFileReader.readFile("mission_data.json")
        val formattedJson = String.format(json, missionId)
        return objectMapper.readTree(formattedJson)
    }

    private fun getStateUpdateJson(token: String): String {
        val json = cachableFileReader.readFile("state_update.json")
        return String.format(json, token)
    }

    private fun getImageJson(): String {
        return cachableFileReader.readFile("image.json")
    }

    private fun getVideoBytes(): ByteArray {
        return cachableFileReader.readBytes("video.h264")

    }

    private fun sleep(delay: Int) {
        try {
            Thread.sleep(delay.toLong())
        } catch(e: InterruptedException) {
        }
    }

    private fun getRandomDelay(): Int {
        return Random().nextInt(60000)
    }
}


