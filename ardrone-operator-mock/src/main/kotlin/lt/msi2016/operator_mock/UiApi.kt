package lt.msi2016.operator_mock

import lt.msi2016.operator_mock.models.Control
import lt.msi2016.operator_mock.models.ErrorResponse
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*


@RestController
class UiRestApi @Autowired constructor(val controlService: ControlService) {

    companion object {
        private val LOG = LoggerFactory.getLogger(javaClass)
    }

    @RequestMapping("/control", method = arrayOf(RequestMethod.POST))
    fun newMockSession(@RequestBody control: Control): Control {
        controlService.callControl(control)
        return control
    }

    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ExceptionHandler(Exception::class)
    fun onError(ex: Exception): ErrorResponse {
        LOG.error("", ex)
        return ErrorResponse(ex.message);
    }
}