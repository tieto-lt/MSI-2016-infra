package lt.msi2016.operator_mock

import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.RequestMapping

@Controller
class PageController {

    @RequestMapping("/")
    fun index(): String {
        return "index.html";
    }
}