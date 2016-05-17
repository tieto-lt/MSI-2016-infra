import { OperatorState } from '../server/models/operator_state';
import { ControlApi } from './api';
import * as ds from '../server/models/drone_state';

const dummyOperatorId = "zerDummyId"

export class MockApi implements ControlApi {

  initializeOperator() {
    return new OperatorState("Initialized", dummyOperatorId)
  }

  onDroneStateUpdate(operatorId: string, state: ds.DroneState) {
    console.log(state, "Updated state at ", new Date())
  }
}
