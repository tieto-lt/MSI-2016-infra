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
import java.util.concurrent.atomic.AtomicInteger;

@RestController
@Slf4j
public class MissionController {

    @Autowired
    ObjectMapper mapper;

    @RequestMapping(method = RequestMethod.GET, value = "/api/missions", params = "operatorToken")
    public Missions getMissions(@RequestParam String operatorToken) {
        System.out.println("Getting missions " + operatorToken);
       return Missions.builder().missions(MissionsHolder.getMissions()).build();
    }

    @RequestMapping(method = RequestMethod.POST, value = "/api/missions/{missionId}/reserve", params = "operatorToken")
    public Mission reserveMission(@PathVariable String missionId, @RequestParam String operatorToken) {
        return MissionsHolder.removeMission(missionId).get();
    }

    @RequestMapping(method = RequestMethod.POST, value = "/api/missions/{missionId}", params = "operatorToken")
    public void completeMission(
            @PathVariable String missionId,
            @RequestBody MissionResult missionResult,
            @RequestParam String operatorToken) throws IOException {
        log.info("Completing mission {} {}", missionId, missionResult);
        AtomicInteger counter = new AtomicInteger(0);
        missionResult.getImages().stream()
            .forEach(img -> base64toFile(img.getImageBase64(), String.format("/tmp/image-%d.png", counter.getAndIncrement())));
        base64toFile(missionResult.getVideoBase64(), "/tmp/video.h264");
        mapper.writeValue(new File("/tmp/response.json"), missionResult);
    }

    private void base64toFile(String base64EncodedContent, String fileName) {
        try {
            FileCopyUtils.copy(Base64Utils.decodeFromString(base64EncodedContent), new File(fileName));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
