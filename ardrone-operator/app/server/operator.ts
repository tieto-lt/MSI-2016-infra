import { Control } from './control'
import { Constants } from './constants';
import { Drone } from './drone'
import { OperatorState } from './models/operator_state';
import { DirectCommand, CommandType, Move, MissionCommand, MissionState, ControlPayload, MissionPlan } from './models/commands';
import * as ds from './models/drone_state'
var WebSocket = require('ws')

export class Operator {

  private externalControl: Control
  private internalControl: Control
  private drone: Drone
  private operatorState: OperatorState

  constructor(private operatorToken: string) {
    this.externalControl = new Control(cmd => this.onPayloadReceived(cmd))
    this.internalControl = new Control(cmd => this.onPayloadReceived(cmd))

    this.drone = new Drone(
      state => this.onDroneStateUpdate(state),
      frame => this.onDroneVideoFrame(frame))
    this.operatorState = OperatorState.initialized(operatorToken)
  }

  droneConnect() {
    //second connect fucks up video stream TODO
    this.drone.connect(err => {
      this.updateOperatorState(state => {
        console.log(err)
        state.setError(err.message)
        state.isDroneReady = false
      })
    });
  }

  connectExternalControl(callback: (state: OperatorState) => any) {
    let controlWs = new WebSocket(`${Constants.wsControlPath(this.operatorToken)}`)
    controlWs.on('open', () => {
      let videoWs = new WebSocket(`${Constants.wsVideoPath(this.operatorToken)}`)
      this.externalControl.initControl(controlWs)
      this.externalControl.initVideo(videoWs)
      this.updateOperatorState(state => state.externalControlState.isControlUp = true)
      videoWs.on('error', err => {
        console.log("Failed to connect to external control video", err)
        this.updateOperatorState(state => {
          state.externalControlState.isVideoUp = false
          state.setError("Can't connect to external control video socket")
        })
      })
      videoWs.on('open', () => this.updateOperatorState(state => state.externalControlState.isVideoUp = true))
    })
    controlWs.on('error', err => {
      console.log("Failed to connect to external control", err)
      this.updateOperatorState( state => {
        state.externalControlState.isControlUp = false
        state.setError("Can't connect to external control socket")
      })
    })
    callback(this.operatorState);
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
    this.operatorState = OperatorState.initialized(this.operatorToken)
  }

  runMission(commands: Array<MissionCommand>): MissionState {
    let missionState = this.drone.runMission(
      commands,
      mstate => this.updateOperatorState(ostate => ostate.missionState = mstate))
    this.updateOperatorState(state => state.missionState = missionState)
    return missionState
  }

  private onPayloadReceived(payload: ControlPayload) {
    if (payload.payloadType === "DirectCommand") {
      this.drone.sendCommand(<DirectCommand>payload)
    } else if (payload.payloadType === "MissionPlan") {
      this.runMission((<MissionPlan>payload).commands)
    } else {
      this.updateOperatorState(state => state.setError("Unsupported command received"))
    }
  }

  private onDroneStateUpdate(droneState: [ds.NavData, MissionState]) {
    this.updateOperatorState(state => {
      state.droneState = droneState[0]
      state.isDroneReady = droneState[0] && true
      state.missionState = droneState[1]
    })
  }

  private onDroneVideoFrame(chunk) {
    this.externalControl.sendVideoChunk(chunk)
    this.internalControl.sendVideoChunk(chunk)
  }

  private updateOperatorState(updater: (state: OperatorState) => void) {
    let state = this.operatorState.copy()
    updater(state)
    let cp = state.copy()
    this.internalControl.sendState(cp)
    this.externalControl.sendState(cp)
    this.operatorState = state
  }
}
