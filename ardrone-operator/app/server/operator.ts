import arDrone = require('ar-drone')
import { Constants } from './constants'
import * as ds from './models/drone_state'
import { OperatorState } from './models/operator_state';
import * as request from 'request'
var WebSocket = require('ws')


export class Operator {

  private client: any;
  private statews: any;
  private currentState: OperatorState;

  controlConnect(callback: (state: OperatorState) => any) {
    this.disconnectControl();
    this.client = arDrone.createClient();
    request.post(`${Constants.httpOperators()}`, (error, response, body) => {
      let state: OperatorState = JSON.parse(body)
      this.statews = new WebSocket(`${Constants.wsStatePath(state.id)}`);
      this.client.on('navdata', this.onNavData);
      callback(state)
    });
  }

  disconnectControl() {
    this.statews && this.statews.close()
  }

  private onNavData(data: ds.DroneState) {
    if (this.isWsOpen(this.statews)) {
      this.statews.send(data);
    }
  }

  private isWsOpen(ws): boolean {
    return ws && ws.readyState === 'OPEN';
  }
}
