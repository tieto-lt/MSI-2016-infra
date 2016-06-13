package lt.msi2016.video_converter

import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component
import java.io.File
import java.io.InputStream
import java.util.UUID
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors

@Component
class FFMpegExecutor {

    companion object {
        private val LOG = LoggerFactory.getLogger(javaClass)
    }

    val converterSettings: ConverterSettings
    val executorService: ExecutorService

    @Autowired
    constructor(converterSettings: ConverterSettings) {
        this.converterSettings = converterSettings;
        this.executorService = Executors.newFixedThreadPool(4);
    }

    fun convertToMp4(video: ByteArray): ByteArray {

        val uuid = UUID.randomUUID().toString()
        val fileName = "${converterSettings.tmpFolder}/$uuid.mp4"
        val runtime = Runtime.getRuntime();
        val osCommand = converterSettings.ffmpegCommand.format(fileName)
        LOG.info("Executing {}", osCommand)
        val process = runtime.exec(osCommand)
        process.outputStream.use {
            it.write(video)
        }
        executorService.submit(streamLogger(process.inputStream, { LOG.info(it) }))
        executorService.submit(streamLogger(process.errorStream, { LOG.info(it) }))
        process.waitFor()
        LOG.info("Video conversion completed")

        val bytes = readFile(fileName);
        File(fileName).delete();
        return bytes;
    }

    private fun readFile(fileName: String): ByteArray {
        val fileContent = File(fileName).readBytes();
        return fileContent;
    }

    fun streamLogger(inputStream: InputStream, consumer: (String) -> Unit): Runnable {
        return Runnable {
            inputStream.bufferedReader().use {
                it.lines().forEach {
                    consumer(it)
                }
            }
        }
    }
}