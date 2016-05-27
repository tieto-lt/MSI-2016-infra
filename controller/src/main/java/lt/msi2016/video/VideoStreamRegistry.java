package lt.msi2016.video;

import com.coremedia.iso.boxes.Container;
import com.googlecode.mp4parser.MemoryDataSourceImpl;
import com.googlecode.mp4parser.authoring.Movie;
import com.googlecode.mp4parser.authoring.builder.DefaultMp4Builder;
import com.googlecode.mp4parser.authoring.tracks.h264.H264TrackImpl;
import lt.msi2016.operator.OperatorsRegistry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.ByteBuffer;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class VideoStreamRegistry {

    @Autowired
    private RecorderVideoStorage videoStorage;

    @Autowired
    private OperatorsRegistry operatorsRegistry;

    private static Logger LOG = LoggerFactory.getLogger(VideoStreamRegistry.class);

    private Map<String, List<ByteBuffer>> recordingVideos = new ConcurrentHashMap<>();


    public void startRecording(String operatorToken) {
        recordingVideos.put(operatorToken, new ArrayList<>());
    }

    public void record(String operatorToken, ByteBuffer newBytes) {
        // if operator token not exists in map then we are not interested in this particular operator - just dropping his video bytes.
        if (recordingVideos.containsKey(operatorToken)) {
            List<ByteBuffer> byteBuffers = recordingVideos.get(operatorToken);
            byteBuffers.add(newBytes);
            LOG.debug("Got {} buffers", byteBuffers.size());
        }
    }

    public Container stopRecording(String operatorToken) {
        List<ByteBuffer> byteBuffersList = recordingVideos.get(operatorToken);

        ByteBuffer byteBuffer = concatBuffers(byteBuffersList);
        MemoryDataSourceImpl memoryDataSource = new MemoryDataSourceImpl(byteBuffer);
        try {
            H264TrackImpl h264Track = new H264TrackImpl(memoryDataSource);
            Movie movie = new Movie();
            movie.addTrack(h264Track);
            Container container = new DefaultMp4Builder().build(movie);
            String missionId = operatorsRegistry.getOperatorCurrentMissionId(operatorToken).get();
            videoStorage.storeVideo(
                    missionId,
                    operatorToken,
                    container);
            recordingVideos.remove(operatorToken);
            return container;
        } catch (IOException e) {
            throw new RuntimeException("Failed to stop recording", e);
        }
    }

    private ByteBuffer concatBuffers(List<ByteBuffer> buffers) {
        int size = buffers.stream().mapToInt(b -> b.array().length).sum();
        ByteBuffer newBuffer = ByteBuffer.allocate(size);
        buffers.forEach(buffer -> newBuffer.put(buffer.array()));
        return newBuffer;
    }


}
