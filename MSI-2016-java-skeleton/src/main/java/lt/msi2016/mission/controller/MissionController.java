package lt.msi2016.mission.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import lt.msi2016.mission.model.Mission;
import lt.msi2016.mission.model.MissionResult;
import lt.msi2016.mission.model.Missions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.Base64Utils;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.IOException;

@RestController
@Slf4j
public class MissionController {

    @Autowired
    ObjectMapper mapper;

    @RequestMapping(method = RequestMethod.GET, value = "/api/missions")
    public Missions getMissions() {
       return Missions.builder().missions(MissionsHolder.getMissions()).build();
    }

    @RequestMapping(method = RequestMethod.POST, value = "/api/missions/{missionId}/reserve")
    public Mission reserveMission(@PathVariable String missionId) {
        return MissionsHolder.removeMission(missionId).get();
    }

    @RequestMapping(method = RequestMethod.POST, value = "/api/missions/{missionId}")
    public void completeMission(@PathVariable String missionId, @RequestBody MissionResult missionResult) throws IOException {
        log.info("Completing mission {} {}", missionId, missionResult);
        FileCopyUtils.copy(Base64Utils.decodeFromString(missionResult.getVideoBase64()), new File("/tmp/video.h264"));
        mapper.writeValue(new File("/tmp/response.json"), missionResult);
    }
}
