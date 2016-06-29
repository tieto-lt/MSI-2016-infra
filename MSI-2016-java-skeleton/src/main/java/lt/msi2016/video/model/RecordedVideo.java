package lt.msi2016.video.model;


import org.mp4parser.Container;

public class RecordedVideo {

    public final String missionId;
    public final String token;
    public final Container videoBytes;

    public RecordedVideo(String missionId, String token, Container videoBytes) {
        this.missionId = missionId;
        this.token = token;
        this.videoBytes = videoBytes;
    }
}
