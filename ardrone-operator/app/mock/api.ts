import { OperatorState } from '../server/models/operator_state';
import * as ds from '../server/models/drone_state';

export interface ControlApi {
  initializeOperator(): OperatorState

  onDroneStateUpdate(operatorId: string, state: ds.DroneState)
}
