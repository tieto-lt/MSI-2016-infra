package lt.msi2016.video;

import com.coremedia.iso.boxes.Container;
import lt.msi2016.video.model.RecordedVideo;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

/**
 * In memory video storage.
 *
 * In future this may eat a lot of heap memory, so consider to store this date in FS or DB.
 */
@Component
public class RecorderVideoStorage {

    private static Map<String, RecordedVideo> videoStorage = new HashMap<>();

    public void storeVideo(String missionId, String token, Container video) {
        videoStorage.put(missionId, new RecordedVideo(
                missionId, token, video));
    }

    public Container getVideo(String missionId) {
        RecordedVideo recordedVideo = videoStorage.get(missionId);
        if (recordedVideo != null) {
            return recordedVideo.videoBytes;
        }
        return null;
    }
}
