package lt.msi2016.operator_mock

import com.fasterxml.jackson.databind.JsonNode
import lt.msi2016.operator_mock.models.ErrorResponse
import lt.msi2016.operator_mock.models.MissionPlan
import lt.msi2016.operator_mock.models.MissionsResponse
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Component
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.client.RestTemplate
import java.util.*
import javax.servlet.http.HttpServletRequest


@Component
class RestConnector @Autowired constructor(private val restTemplate: RestTemplate) {

    companion object {
        private val LOG = LoggerFactory.getLogger(javaClass)
    }

    fun getFirstMission(hostname: String, token: String): Optional<MissionPlan> {
        val uri = "http://$hostname/api/missions?operatorToken=$token"
        val response = restTemplate.getForObject(uri, MissionsResponse::class.java);
        return Optional.ofNullable(response.missions.firstOrNull());
    }

    fun reserveMission(hostname: String, missionId: String, token: String): MissionPlan {
        val uri = "http://$hostname/api/missions/$missionId/reserve?operatorToken=$token"
        val response = restTemplate.postForObject(uri, null, MissionPlan::class.java);
        return response;
    }

    fun missionComplete(hostname: String, missionId: String, json: JsonNode, token: String) {
        val uri = "http://$hostname/api/missions/$missionId?operatorToken=$token"
        restTemplate.postForObject(uri, json, Void::class.java)
    }
}