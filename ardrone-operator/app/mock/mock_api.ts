import { OperatorState } from '../server/models/operator_state';
import { ControlApi } from './api';

const dummyOperatorId = "zerDummyId"

export class MockApi implements ControlApi {

  initializeOperator() {
    return new OperatorState("Initialized", dummyOperatorId)
  }
}
