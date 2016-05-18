import arDrone = require('ar-drone')
import { Constants } from './constants'
import * as ds from './models/drone_state'
import { OperatorState } from './models/operator_state';
import { CommandJSON, Command, CommandType, Move } from './models/commands';
import * as request from 'request'
var WebSocket = require('ws')


export class Operator {

  private client: any;
  private controlWs: any;
  private currentState: OperatorState;

  controlConnect(callback: (state: OperatorState) => any) {
    this.disconnectControl();
    this.client = arDrone.createClient();
    request.post(`${Constants.httpOperators()}`, (error, response, body) => {
      let state: OperatorState = JSON.parse(body)
      this.controlWs = new WebSocket(`${Constants.wsControlPath(state.id)}`);
      this.controlWs.on('message', this.onCommandReceive())
      this.client.on('navdata', this.onNavData());
      callback(state)
    });
  }

  disconnectControl() {
    this.controlWs && this.controlWs.close()
  }

  private onNavData() {
    return (data: ds.DroneState) => {
      if (this.isWsOpen(this.controlWs)) {
        this.controlWs.send(JSON.stringify(data));
      }
    }
  }

  private isWsOpen(ws): boolean {
    return ws && ws.readyState === WebSocket.OPEN;
  }

  private onCommandReceive() {
    return (commandStr: string, flags: any) => {
      let command: Command = JSON.parse(commandStr);
      switch (command.commandType) {
        case "takeoff":
          this.client.takeoff();
          // console.log("takeoff");
          break;
        case "land":
          this.client.land();
          // console.log("land");
          break;
        // TODO: implement
      }
    }
  }
}
