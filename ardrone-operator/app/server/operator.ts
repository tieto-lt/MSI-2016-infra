import { Control, ControlAuthenticator } from './control'
import { Drone } from './drone'
import { OperatorState } from './models/operator_state';
import { Command, CommandType, Move, MissionCommand, MissionState } from './models/commands';
import * as ds from './models/drone_state'

export class Operator {

  private externalControl: Control
  private internalControl: Control
  private drone: Drone

  constructor() {
    this.externalControl = new Control(cmd => this.onCommandReceived(cmd))
    this.internalControl = new Control(cmd => this.onCommandReceived(cmd))

    this.drone = new Drone(
      state => this.onDroneStateUpdate(state),
      frame => this.onDroneVideoFrame(frame))
  }

  droneConnect() {
    //second connect fucks up video stream TODO
    this.drone.connect();
  }

  connectExternalControl(callback: (state: OperatorState) => any) {
    ControlAuthenticator.connect((state, controlWs, videoWs) => {
      this.externalControl.initControl(controlWs);
      this.externalControl.initVideo(videoWs)
      callback(state)
    })
  }

  connectInternalControlSocket(controlWs) {
    this.internalControl.initControl(controlWs)
  }

  connectInternalControlVideoSocket(videoWs) {
    this.internalControl.initVideo(videoWs)
  }

  close() {
    this.drone.close();
    this.externalControl.close();
    this.internalControl.close();
  }

  runMission(commands: Array<MissionCommand>): MissionState {
    return this.drone.runMission(commands)
  }

  private onCommandReceived(command: Command) {
    this.drone.sendCommand(command)
  }

  private onDroneStateUpdate(state: ds.NavData) {
    this.externalControl.sendState(state)
    this.internalControl.sendState(state)
  }

  private onDroneVideoFrame(chunk) {
    this.externalControl.sendVideoChunk(chunk)
    this.internalControl.sendVideoChunk(chunk)
  }
}
