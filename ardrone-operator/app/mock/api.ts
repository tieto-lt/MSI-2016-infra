import { OperatorState } from '../server/models/operator_state';
import * as ds from '../server/models/drone_state';
import {CommandType} from '../server/models/commands';

export interface ControlApi {

  initializeOperator(): OperatorState

  sendCommand(command: CommandType, params: any, wsConnection: any)
  onDroneStateUpdate(operatorId: string, state: ds.NavData)
  onVideoFrame(operatorId: string, videoData: any)
}
