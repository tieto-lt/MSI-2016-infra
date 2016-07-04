package lt.msi2016.mission.controller;


import lt.msi2016.mission.model.Mission;
import lt.msi2016.mission.model.MissionCommand;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

public class MissionsHolder {

    private static List<Mission> mockMissions = new ArrayList<>();

    static {
        mockMissions.add(mission("1-takeoff-land", "takeoff", "land"));
        mockMissions.add(mission("2-picture", command("wait", 1000), command("takePicture"), command("wait", 1000)));
        mockMissions.add(mission("3-wait-1min", command("wait", 60000)));
        mockMissions.add(mission("3-wait-15min", command("wait", 60000 * 15)));
        mockMissions.add(mission("4-wait-10sec", command("wait", 10000)));
        mockMissions.add(mission("5-hover-10sec", command("takeoff"), command("hover", 10000), command("land")));
        mockMissions.add(mission("6-forw-back", command("takeoff"), command("forward", 1),
                command("hover", 1000), command("backward", 1), command("land")));
        mockMissions.add(mission("7-take-2-pic", command("wait", 1000),
                command("switchVerticalCamera"), command("wait", 1000), command("takePicture"),
                command("switchHorizontalCamera"), command("wait", 1000), command("takePicture"), command("wait", 1000)));
    }

    public static Optional<Mission> removeMission(String id) {
        Optional<Mission> mission = mockMissions.stream()
                .filter(m -> m.getMissionId().equals(id))
                .findAny();
        mission.ifPresent(mockMissions::remove);
        return mission;
    }

    public static List<Mission> getMissions() {
        return mockMissions;
    }



    private static Mission mission(String missionId, String... commands) {
        List<MissionCommand> missionCommands = new ArrayList<>();
        Stream.of(commands).forEach(c -> missionCommands.add(command(c)));
        return Mission.builder()
                .missionId(missionId)
                .commands(missionCommands)
                .build();
    }

    private static Mission mission(String missionId, MissionCommand... commands) {
        return Mission.builder()
                .missionId(missionId)
                .commands(Arrays.asList(commands))
                .build();
    }

    private static MissionCommand command(String commandType) {
        return MissionCommand.builder()
                .commandType(commandType)
                .build();
    }

    private static MissionCommand command(String commandType, Object... args) {
        return MissionCommand.builder()
                .commandType(commandType)
                .args(Arrays.asList(args))
                .build();
    }
}
