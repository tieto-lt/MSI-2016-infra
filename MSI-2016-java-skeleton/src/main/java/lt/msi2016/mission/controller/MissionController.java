package lt.msi2016.mission.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import lt.msi2016.mission.model.Mission;
import lt.msi2016.mission.model.MissionCommand;
import lt.msi2016.mission.model.MissionResult;
import lt.msi2016.mission.model.Missions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.Base64Utils;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
@Slf4j
public class MissionController {

    @Autowired
    ObjectMapper mapper;


    private static Mission MOCK_MISSION;
    static {
        List<MissionCommand> commands = new ArrayList<>();
        commands.add(MissionCommand.builder().commandType("takeOff").build());
        commands.add(MissionCommand.builder().commandType("land").build());
        MOCK_MISSION = Mission.builder().missionId("test1").commands(commands).build();
    }

    @RequestMapping(method = RequestMethod.GET, value = "/api/missions")
    public Missions getMissions() {
        List<Mission> mockMissions = new ArrayList<>();
        mockMissions.add(MOCK_MISSION);
        return Missions.builder().missions(mockMissions).build();
    }

    @RequestMapping(method = RequestMethod.POST, value = "/api/missions/{missionId}/reserve")
    public Mission reserveMission() {
        return MOCK_MISSION;
    }

    @RequestMapping(method = RequestMethod.POST, value = "/api/missions/{missionId}")
    public void completeMission(@PathVariable String missionId, @RequestBody MissionResult missionResult) throws IOException {
        log.info("Completing mission {} {}", missionId, missionResult);
        FileCopyUtils.copy(Base64Utils.decodeFromString(missionResult.getVideoBase64()), new File("/tmp/video.h264"));
        mapper.writeValue(new File("/tmp/response.json"), missionResult);
    }
}
