import { OperatorState } from '../server/models/operator_state';
import * as ds from '../server/models/drone_state';
import {CommandType} from '../server/models/commands';

export interface ControlApi {
  initializeOperator(): OperatorState

  onDroneStateUpdate(operatorId: string, state: ds.DroneState)

  sendCommand(command: CommandType, params: any, wsConnection: any)
}
