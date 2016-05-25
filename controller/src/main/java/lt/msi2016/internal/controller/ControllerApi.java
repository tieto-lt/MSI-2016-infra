package lt.msi2016.internal.controller;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

//TODO: remove

@RestController
public class ControllerApi {

    private static Logger LOG = LoggerFactory.getLogger(ControllerApi.class);

    @Autowired
    private OperatorsRegistry operatorsRegistry;


//    @RequestMapping(value = "/rest/operators", method = RequestMethod.POST)
//    public Operator registerOperator() {
//        String operatorId = generateId();
//        LOG.info("Connected drone operator {}", operatorId);
//        return new Operator(generateId(), OperatorState.Idle, operatorId);
//    }

    private String generateId() {
//        return UUID.randomUUID().toString();
        return "zerDummyId";
    }
}
