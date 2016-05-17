import arDrone = require('ar-drone')
import { Constants } from './constants'
import * as ds from './models/drone_state'
import { OperatorState } from './models/operator_state';
import * as request from 'request'

var WebSocket = require('ws')


export class Operator {

  private id: string = "dummy";
  private client: any;
  private controlSocket: any;
  private currentState: ds.DroneState;

  droneConnect() {
    this.client = arDrone.createClient();
    return "connected";
  }

  controlConnect(callback: (state: OperatorState) => any) {
      this.disconnectControl();
      this.droneConnect();
      request.post(`${Constants.httpOperators()}`, (error, response, body) => {
        this.controlSocket = new WebSocket(`${Constants.wsStatePath('dummy')}`);
        this.client.on('navdata', this.onNavData);
        console.log(body);
        callback(JSON.parse(body))
      });
  }

  disconnectControl() {
    this.controlSocket && this.controlSocket.close()
  }

  private onNavData(data: any) {
    if (this.isWsOpen(this.controlSocket)) {
      this.controlSocket.send(data);
    }
  }

  private isWsOpen(webSocket): boolean {
    return webSocket && webSocket.readyState === 'OPEN';
  }

  private handleHttpResponse<T>(response, callback: (T) => any) {
    var body = '';
    response.on('data', function(d) {
      body += d;
    });
    response.on('end', function() {
      // Data reception is done, do whatever with it!
      var parsed = JSON.parse(body);
      callback(parsed);
    });
  }
}
