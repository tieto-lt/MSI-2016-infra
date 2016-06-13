package lt.msi2016.operator_mock

import lt.msi2016.operator_mock.models.Control
import org.springframework.stereotype.Component
import java.util.*


@Component
class ControlsRegistry {

    private val controls = hashMapOf<String, Control>()

    fun addControl(accessToken: String, hostName: String): String {
        val uuid = UUID.randomUUID().toString()
        controls.put(uuid, Control(uuid, accessToken, hostName))
        return uuid
    }

    fun removeControl(controlId: String) {
        controls.remove(controlId)
    }
}
