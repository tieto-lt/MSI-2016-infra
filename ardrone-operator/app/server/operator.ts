import { Control } from './control'
import { Constants } from './constants';
import { Drone } from './drone'
import { OperatorState } from './models/operator_state';
import { DirectCommand, CommandType, Move, MissionCommand, MissionState, ControlPayload, MissionPlan, Image } from './models/commands';
import * as ds from './models/drone_state'
import { EventPublisher } from './event_publisher';
import { MissionCapture } from './mission_capture';

import request = require('request')
var WebSocket = require('ws')

export class Operator {

  private externalControl: Control
  private internalControl: Control
  private drone: Drone
  private operatorState: OperatorState
  private missionRetrieveInterval: NodeJS.Timer;

  constructor(private operatorToken: string) {
    this.externalControl = new Control(cmd => this.onPayloadReceived(cmd))
    this.internalControl = new Control(cmd => this.onPayloadReceived(cmd))

    this.drone = new Drone()
    this.drone.onEvent("state", state => this.onDroneStateUpdate(state))
    this.drone.onEvent("video", frame => this.onDroneVideoFrame(frame))
    this.drone.onEvent("error", err => this.updateOperatorState(state => {
      console.log("Drone ERROR", err)
      state.setError(err.message)
      state.isDroneReady = false
    }))
    EventPublisher.onEvent("MissionPicture", () => this.sendPicture())
    this.operatorState = OperatorState.initialized(operatorToken)
  }

  droneConnect() {
    //second connect fucks up video stream TODO
    this.drone.connect();
    this.operatorState.isDroneReady = true
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
        });
      });
      videoWs.on('open', () => this.updateOperatorState(state => state.externalControlState.isVideoUp = true))
    });
    controlWs.on('error', err => {
      console.log("Failed to connect to external control", err)
      this.updateOperatorState( state => {
        state.externalControlState.isControlUp = false
        state.setError("Can't connect to external control socket")
      })
    });
    this.missionRetrieveInterval = setInterval(() => {
      request.get(
        Constants.retrieveMissionsUrl(),
        {},
        (err, rest, body) => {
          let json = JSON.parse(body);
          json.payloadType = "MissionsUpdate";
          this.internalControl.sendControlPayload(json)
        });
    }, 2000);
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
    this.operatorState = OperatorState.initialized(this.operatorToken);
    clearInterval(this.missionRetrieveInterval);
  }

  executeMission(missionPlan: MissionPlan, withReservation: boolean, callback) {
    if (withReservation) {
      this.reserveMission(missionPlan, (err) => {
        if (err) {
          callback(err);
        } else {
          this.runMission(missionPlan, callback);
        }
      })
    } else {
      this.runMission(missionPlan, callback);
    }
  }

  private runMission(missionPlan: MissionPlan, callback) {
    let missionCapture = new MissionCapture(missionPlan.missionId)
    let missionState = this.drone.runMission(
      missionPlan.commands,
      mstate => {
        missionCapture.finish(() =>
          this.updateOperatorState(ostate => ostate.missionState = mstate))
      })
    this.updateOperatorState(state => state.missionState = missionState)
    callback(undefined, missionState);
  }

  private reserveMission(mission: MissionPlan, callback) {
    request.post(
      Constants.reserveMissionsUrl(mission.missionId),
      (err, rest, body) => {
        callback(err)
      });
  }

  private onPayloadReceived(payload: ControlPayload) {
    if (payload.payloadType === "DirectCommand") {
      let command = <DirectCommand>payload
      if (command.commandType === "takePicture") {
        this.sendPicture()
      } else {
        this.drone.sendCommand(<DirectCommand>payload)
      }
    } else if (payload.payloadType === "MissionPlan") {
      this.executeMission((<MissionPlan>payload), true, () => {})
    } else {
      this.updateOperatorState(state => state.setError("Unsupported command received"))
    }
  }

  private sendPicture() {
    let image = this.drone.getCurrentImage()
    this.externalControl.sendControlPayload(image)
    this.internalControl.sendControlPayload(image)
    EventPublisher.emit("PictureTaken", image)
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
    this.internalControl.sendControlPayload(cp)
    this.externalControl.sendControlPayload(cp)
    this.operatorState = state
  }
}
