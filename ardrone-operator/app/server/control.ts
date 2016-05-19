import { Constants } from './constants'
import * as ds from './models/drone_state'
import { OperatorState } from './models/operator_state';
import { Command, CommandType, Move } from './models/commands';
import * as request from 'request'
var WebSocket = require('ws')

export class ControlAuthenticator {

  //TODO smth better like toke auth
  static connect(callback: (state: OperatorState, controlWs, videoWs) => any) {
    request.post(`${Constants.httpOperators()}`, (error, response, body) => {
      let state: OperatorState = JSON.parse(body)
      let controlWs = new WebSocket(`${Constants.wsControlPath(state.id)}`);
      let videoWs = new WebSocket(`${Constants.wsVideoPath(state.id)}`)

      callback(state, controlWs, videoWs)
    });
  }
}

export class Control {

  private controlWs: any;
  private videoWs: any

  constructor(private commandReceiveCallback: (command: Command) => any) {}

  initControl(controlWs) {
    this.closeSocket(this.controlWs)
    this.controlWs = controlWs;
    this.controlWs.on('message', this.onCommandReceive())
  }

  initVideo(videoWs) {
    this.closeSocket(this.videoWs)
    this.videoWs = videoWs;
  }

  close() {
    this.closeSocket(this.controlWs);
    this.closeSocket(this.videoWs);
  }

  sendVideoChunk(parsedVideo) {
    if (this.isWsOpen(this.videoWs)) {
      this.videoWs.send(parsedVideo, { binary: true });
    }
  }

  sendState(state: ds.NavData) {
    if (this.isWsOpen(this.controlWs)) {
      this.controlWs.send(JSON.stringify(state));
    }
  }

  private closeSocket(ws) {
    ws && ws.close();
  }

  private isWsOpen(ws): boolean {
    return ws && ws.readyState === WebSocket.OPEN;
  }

  private onCommandReceive() {
    return (commandStr: string, flags: any) => {
      let command: Command = JSON.parse(commandStr);
      this.commandReceiveCallback(command)
    }
  }
}
