import arDrone = require('ar-drone')
import { Constants } from './constants'
import * as ds from './models/drone_state'
import { OperatorState } from './models/operator_state';
import { Command, CommandType, Move } from './models/commands';
import * as request from 'request'
import { PaVEParser } from './PaVEParser';
var WebSocket = require('ws')
var dronestream = require('dronestream')

export class Operator {

  private client: any
  private controlWs: any;
  private videows: any
  private currentState: OperatorState
  private videoStream: any
  private videoParser: PaVEParser

  controlConnect(callback: (state: OperatorState) => any) {
    this.disconnectControl();
    this.client = arDrone.createClient();
    this.videoStream = this.client.getVideoStream();

    request.post(`${Constants.httpOperators()}`, (error, response, body) => {
      let state: OperatorState = JSON.parse(body)
      this.controlWs = new WebSocket(`${Constants.wsControlPath(state.id)}`);
      this.controlWs.on('message', this.onCommandReceive())
      this.client.on('navdata', this.onNavData());
      this.videows = new WebSocket(`${Constants.wsVideoPath(state.id)}`)
      this.videoParser = new PaVEParser()
      this.videoStream.on('data', this.onVideoData())

      callback(state)
    });
  }

  disconnectControl() {
    this.controlWs && this.controlWs.close()
  }

  private onVideoData() {
    return (data: any) => {
      if (this.isWsOpen(this.videows)) {
        this.videoParser.write(data, (parsedData) => {
          this.videows.send(parsedData, { binary: true });
        });
      }
    }
  }

  private onNavData() {
    return (data: any) => {
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
