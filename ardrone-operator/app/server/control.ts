import { Constants } from './constants'
import * as ds from './models/drone_state'
import { OperatorState } from './models/operator_state';
import { CommandJSON, Command, CommandType, Move } from './models/commands';
import * as request from 'request'
var WebSocket = require('ws')

export class Control {

  private controlWs: any;
  private videows: any

  constructor(private commandReceiveCallback: (command: Command) => any) {}

  connect(callback: (state: OperatorState) => any) {
    this.close();

    request.post(`${Constants.httpOperators()}`, (error, response, body) => {
      let state: OperatorState = JSON.parse(body)
      this.controlWs = new WebSocket(`${Constants.wsControlPath(state.id)}`);
      this.controlWs.on('message', this.onCommandReceive())
      this.videows = new WebSocket(`${Constants.wsVideoPath(state.id)}`)

      callback(state)
    });
  }

  close() {
    this.controlWs && this.controlWs.close();
    this.videows && this.videows.close();
  }

  sendVideoChunk(parsedVideo) {
    if (this.isWsOpen(this.videows)) {
      this.videows.send(parsedVideo, { binary: true });
    }
  }

  sendState(state: ds.NavData) {
    if (this.isWsOpen(this.controlWs)) {
      this.controlWs.send(JSON.stringify(state));
    }
  }

  private isWsOpen(ws): boolean {
    return ws && ws.readyState === WebSocket.OPEN;
  }

  private onCommandReceive() {
    console.log('init')
    return (commandStr: string, flags: any) => {
      console.log('control command')
      let command: Command = JSON.parse(commandStr);
      this.commandReceiveCallback(command)
    }
  }
}
