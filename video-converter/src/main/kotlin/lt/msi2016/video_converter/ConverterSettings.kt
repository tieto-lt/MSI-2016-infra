package lt.msi2016.video_converter

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.stereotype.Component

@Component
@ConfigurationProperties(prefix="converter")
class ConverterSettings {

    var tmpFolder: String = "";

    var ffmpegCommand: String = "";
}