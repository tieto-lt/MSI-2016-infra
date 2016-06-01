package lt.msi2016.mission.model;

import java.math.BigDecimal;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor(access = AccessLevel.PRIVATE)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class MissionNavigationData {

    public BigDecimal x;
    public BigDecimal y;
    public BigDecimal z;
    public BigDecimal altitude;
    public BigDecimal altitudeMeters;
}
