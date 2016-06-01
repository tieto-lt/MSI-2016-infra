package lt.msi2016.mission.model;

import java.util.List;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@Builder
@NoArgsConstructor(access = AccessLevel.PRIVATE)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@ToString(exclude= { "navigationData", "images", "videoBase64" })
public class MissionResult {

    public String missionId;
    public List<MissionNavigationData> navigationData;
    public List<MissionImage> images;
    public String videoBase64;
}
