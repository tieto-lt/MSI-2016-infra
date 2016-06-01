package lt.msi2016.video_converter

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestMethod
import org.springframework.web.bind.annotation.RestController



@RestController
class ConverterApi @Autowired constructor(val ffMpegExecutor: FFMpegExecutor) {

    val MP4_CONTENT_TYPE = MediaType("video", "mp4")

    @RequestMapping("/video/mp4", method = arrayOf(RequestMethod.POST))
    fun toMp4(@RequestBody byteArray: ByteArray): HttpEntity<ByteArray> {

        val httpHeaders = HttpHeaders();
        httpHeaders.contentType = MP4_CONTENT_TYPE;
        val videoFileBytes = ffMpegExecutor.convertToMp4(byteArray)
        return HttpEntity(videoFileBytes, httpHeaders);
    }
}