package lt.msi2016.internal.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.io.File;
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

    private static Logger LOG = LoggerFactory.getLogger(VideoStreamRegistry.class);

    private Map<String, List<ByteBuffer>> recordingVideos = new ConcurrentHashMap<>();


    public void startRecording(String operatorToken) {
        recordingVideos.put(operatorToken, new ArrayList<>());
    }

    public void record(String operatorToken, ByteBuffer newBytes) {
        if (recordingVideos.containsKey(operatorToken)) {
            List<ByteBuffer> byteBuffers = recordingVideos.get(operatorToken);
            byteBuffers.add(newBytes);
            LOG.info("Got {} buffers", byteBuffers.size());
        }
    }

    public void dump(String operatorToken) {
        List<ByteBuffer> byteBuffersList = recordingVideos.get(operatorToken);
        ByteBuffer[] byteBuffers = byteBuffersList.toArray(new ByteBuffer[byteBuffersList.size()]);
        File file = new File("video.h264");
        LOG.info("Saving file!");
        boolean append = false;
        try (FileChannel channel = new FileOutputStream(file, append).getChannel()) {
            channel.write(byteBuffers);
        } catch (IOException ex) {
            LOG.error("Failed to write video ", ex);
        } finally {
            recordingVideos.remove(operatorToken);
        }
    }

    private ByteBuffer flip(ByteBuffer buffer) {
        return (ByteBuffer) buffer.flip();
    }


}
