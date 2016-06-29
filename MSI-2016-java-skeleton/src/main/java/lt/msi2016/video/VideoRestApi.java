package lt.msi2016.video;


import org.mp4parser.Container;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.channels.Channels;
import java.nio.channels.WritableByteChannel;

@RestController
public class VideoRestApi {

    @Autowired
    private RecorderVideoStorage videoStorage;

    @RequestMapping(value = "/rest/video/{missionId}", method = RequestMethod.GET)
    public void downloadVideo(@PathVariable("missionId") String missionId, HttpServletResponse response) throws IOException {

        Container video = videoStorage.getVideo(missionId);
        response.setHeader("content-type", "video/mp4");
        WritableByteChannel channel = Channels.newChannel(response.getOutputStream());
        video.writeContainer(channel);
        channel.close();
    }
}
