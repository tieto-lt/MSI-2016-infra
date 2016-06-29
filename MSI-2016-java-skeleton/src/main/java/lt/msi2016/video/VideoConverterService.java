package lt.msi2016.video;

import org.mp4parser.Container;
import org.mp4parser.muxer.MemoryDataSourceImpl;
import org.mp4parser.muxer.Movie;
import org.mp4parser.muxer.builder.DefaultMp4Builder;
import org.mp4parser.muxer.tracks.h264.H264TrackImpl;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.ByteBuffer;


@Component
public class VideoConverterService {

    public Container convertToMp4VideoContainer(ByteBuffer byteBuffer) {

        MemoryDataSourceImpl memoryDataSource = new MemoryDataSourceImpl(byteBuffer);
        try {
            H264TrackImpl h264Track = new H264TrackImpl(memoryDataSource);
            Movie movie = new Movie();
            movie.addTrack(h264Track);
            Container container = new DefaultMp4Builder().build(movie);
            return container;
        } catch (IOException e) {
            throw new RuntimeException("Failed to stop recording", e);
        }
    }
}
