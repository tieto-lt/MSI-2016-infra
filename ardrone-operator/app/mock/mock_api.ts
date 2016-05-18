import { OperatorState } from '../server/models/operator_state';
import { ControlApi } from './api';
import * as ds from '../server/models/drone_state';
import {CommandType, Command, Move} from '../server/models/commands';

const dummyOperatorId = "zerDummyId"

export class MockApi implements ControlApi {

  initializeOperator() {
    return new OperatorState("Initialized", dummyOperatorId)
  }

  onDroneStateUpdate(operatorId: string, state: ds.DroneState) {
    console.log(state, "Updated state at ", operatorId, new Date())
  }

  sendCommand(command: CommandType, params: any, wsConnection: any) {
    if (!wsConnection) return;
    let commandJson = JSON.stringify(this.createCommand(command, params));
    wsConnection.send(commandJson);
  }

  private createCommand(commandType: CommandType, params: any): Command {
    switch(commandType) {
      case "takeoff":
      case "land":
        return new Command(commandType);
      case "up":
      case "down":
      case "front":
      case "back":
      case "left":
      case "right":
      case "clockwise":
      case "counterClockwise":
        return new Move(commandType, params.move || 0.1);
      default:
        console.log(`${commandType} not implemented`);
    }
  }
}
