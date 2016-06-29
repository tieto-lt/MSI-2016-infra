package lt.msi2016.operator_mock

import com.google.common.io.Resources
import org.springframework.cache.annotation.Cacheable
import org.springframework.stereotype.Component

@Component
open class CachableFileReader {

    @Cacheable("StringFromFile")
    open fun readFile(fileName: String): String {
        val url = Resources.getResource(fileName);
        return Resources.toString(url, Charsets.UTF_8);
    }

    @Cacheable("BytesFromFile")
    open fun readBytes(fileName: String): ByteArray {
        val url = Resources.getResource(fileName);
        return Resources.toByteArray(url)
    }

}