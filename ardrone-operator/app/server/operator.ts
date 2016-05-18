import { Control } from './control'
import { Drone } from './drone'
import { OperatorState } from './models/operator_state';
import { Command, CommandType, Move } from './models/commands';
import * as ds from './models/drone_state'

export class Operator {

  private control: Control
  private drone: Drone
  public isUp: boolean = false;

  constructor() {
    this.control = new Control(cmd => this.onCommandReceived(cmd))
    this.drone = new Drone(
      state => this.onDroneStateUpdate(state),
      frame => this.onDroneVideoFrame(frame))
  }

  connect(callback: (state: OperatorState) => any) {
    this.drone.connect();
    this.control.connect(state => {
      this.isUp = true
      callback(state)
    });
  }

  close() {
    this.drone.close();
    this.control.close();
    this.isUp = false;
  }

  private onCommandReceived(command: Command) {
    this.drone.sendCommand(command)
  }

  private onDroneStateUpdate(state: ds.NavData) {
    this.control.sendState(state)
  }

  private onDroneVideoFrame(frame: any) {
    this.control.sendVideoChunk(frame)
  }
}
