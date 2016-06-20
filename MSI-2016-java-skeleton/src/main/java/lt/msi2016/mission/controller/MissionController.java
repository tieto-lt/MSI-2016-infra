package lt.msi2016.mission.controller;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import lt.msi2016.mission.model.Mission;
import lt.msi2016.mission.model.MissionCommand;
import lt.msi2016.mission.model.MissionResult;
import lt.msi2016.mission.model.Missions;
import org.apache.tomcat.util.http.fileupload.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.Base64Utils;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Slf4j
public class MissionController {

    @Autowired
    ObjectMapper mapper;

    @RequestMapping(method = RequestMethod.GET, value = "/api/missions")
    public Missions getMissions() {
        List<Mission> mockMissions = new ArrayList<>();
        List<MissionCommand> commands = new ArrayList<>();
        commands.add(MissionCommand.builder().commandType("takeOff").build());
        commands.add(MissionCommand.builder().commandType("land").build());
        mockMissions.add(Mission.builder().missionId("test1").commands(commands).build());
        return Missions.builder().missions(mockMissions).build();
    }

    @RequestMapping(method = RequestMethod.POST, value = "/api/missions/{missionId}/data")
    public void completeMission(@PathVariable String missionId, @RequestBody MissionResult missionResult) throws IOException {
        log.info("Completing mission {} {}", missionId, missionResult);
        FileCopyUtils.copy(Base64Utils.decodeFromString(missionResult.getVideoBase64()), new File("/tmp/video.h264"));
        mapper.writeValue(new File("/tmp/response.json"), missionResult);
    }
}
