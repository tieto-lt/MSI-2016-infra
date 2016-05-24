package lt.msi2016.internal.controller;


import lt.msi2016.internal.model.OperatorState;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
public class ControllerApi {

    private static Logger LOG = LoggerFactory.getLogger(ControllerApi.class);

    @Autowired
    private OperatorsManager operatorsManager;


    @RequestMapping(value = "/rest/operators", method = RequestMethod.POST)
    public OperatorState registerOperator() {
        String operatorId = generateId();
        operatorsManager.registerOperator(operatorId);
        LOG.info("Connected drone operator {}", operatorId);
        return new OperatorState(OperatorState.State.Initialized, operatorId);
    }

    private String generateId() {
//        return UUID.randomUUID().toString();
        return "zerDummyId";
    }
}
