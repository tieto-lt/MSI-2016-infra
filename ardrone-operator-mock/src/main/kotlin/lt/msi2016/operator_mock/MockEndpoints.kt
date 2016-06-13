package lt.msi2016.operator_mock

import lt.msi2016.operator_mock.models.MissionPlan
import lt.msi2016.operator_mock.models.MissionState
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestMethod
import org.springframework.web.bind.annotation.RestController


@RestController
class MockEndpoints {

    companion object {
        private val LOG = LoggerFactory.getLogger(javaClass)
    }

    @RequestMapping("/api/mission", method = arrayOf(RequestMethod.POST))
    fun runMission(@RequestBody missionPlan: MissionPlan): MissionState {
        LOG.info("Mission submitted: {}", missionPlan);

        return MissionState("Started")
    }
}