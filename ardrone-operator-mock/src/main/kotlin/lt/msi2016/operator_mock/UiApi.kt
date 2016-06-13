package lt.msi2016.operator_mock

import lt.msi2016.operator_mock.models.TokenRequest
import lt.msi2016.operator_mock.models.TokenResponse
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestMethod
import org.springframework.web.bind.annotation.RestController
import java.util.*


@RestController
class UiApi @Autowired constructor(val controlsRegistry: ControlsRegistry) {

    @RequestMapping("/token", method = arrayOf(RequestMethod.POST))
    fun newMockSession(@RequestBody token: TokenRequest): TokenResponse {
        val uuid = controlsRegistry.addControl(token.accessToken, token.controlHostname);

        // schedule missions retriever
        return TokenResponse(uuid);
    }
}