package lt.msi2016.video;

import lt.msi2016.operator.OperatorsRegistry;
import org.mp4parser.Container;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.channels.FileChannel;
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

    @Autowired
    private VideoConverterService videoConverterService;

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

        saveTmpFile(byteBuffer);



        Container container = videoConverterService.convertToMp4VideoContainer(byteBuffer);
        String missionId = operatorsRegistry.getOperatorCurrentMissionId(operatorToken).get();
        videoStorage.storeVideo(
                missionId,
                operatorToken,
                container);
        recordingVideos.remove(operatorToken);
        return container;
    }


    private void saveTmpFile(ByteBuffer byteBuffer) {
        ByteBuffer duplicated = byteBuffer.duplicate();

        duplicated.flip();
        LOG.info("Capacity: {}", duplicated.capacity());
        LOG.info("Remaining: {}", duplicated.remaining());
        try (
            FileOutputStream out = new FileOutputStream("video.h264");
            FileChannel channel = out.getChannel()) {

            channel.write(duplicated);
        } catch (IOException ex) {
            LOG.error("Error wehen save tmp file", ex);
        }



//        try {
//            FileChannel out = new FileOutputStream("video.h264").getChannel();
//        } catch (FileNotFoundException e) {
//            e.printStackTrace();
//        } finally {
//            if (out != null) out.close();
//        }


    }

    private ByteBuffer concatBuffers(List<ByteBuffer> buffers) {
        int size = buffers.stream().mapToInt(b -> b.array().length).sum();
        ByteBuffer newBuffer = ByteBuffer.allocate(size);
        buffers.forEach(buffer -> newBuffer.put(buffer.array()));
        return newBuffer;
    }


}
