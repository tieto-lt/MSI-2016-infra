import { Constants } from './constants'
import * as ds from './models/drone_state'
import { OperatorState } from './models/operator_state';
import { DirectCommand, CommandType, Move, MissionState, ControlPayload } from './models/commands';
import * as request from 'request'
var WebSocket = require('ws')

export class Control {

  private controlWs: any;
  private videoWs: any

  constructor(private commandReceiveCallback: (command: ControlPayload) => any) {}

  initControl(controlWs) {
    this.closeSocket(this.controlWs)
    this.controlWs = controlWs

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

  sendControlPayload(payload: ControlPayload) {
    if (this.isWsOpen(this.controlWs)) {
      this.controlWs.send(JSON.stringify(payload));
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
      let command: ControlPayload = JSON.parse(commandStr);
      this.commandReceiveCallback(command)
    }
  }
}
