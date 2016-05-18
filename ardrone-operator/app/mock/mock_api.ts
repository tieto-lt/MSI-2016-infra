import { OperatorState } from '../server/models/operator_state';
import { ControlApi } from './api';
import * as ds from '../server/models/drone_state';
import {CommandType, Command, Move} from '../server/models/commands';

const dummyOperatorId = "zerDummyId"

export class MockApi implements ControlApi {

  initializeOperator() {
    return new OperatorState("Initialized", dummyOperatorId)
  }

  onDroneStateUpdate(operatorId: string, state: ds.NavData) {
    //console.log(state.droneState.lowBattery, "Updated state at ", operatorId, new Date())
  }

  onVideoFrame(operatorId: string, videoData: any) {
    //console.log("Getting video", operatorId, new Date())
  }

  sendCommand(command: CommandType, params: any, wsConnection: any) {
    if (!wsConnection) return;
    console.log('api send')

    let commandJson = JSON.stringify(this.createCommand(command, params));
    console.log(commandJson)
    wsConnection.send(commandJson);
    console.log('Send to ', wsConnection.upgradeReq.url)
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
