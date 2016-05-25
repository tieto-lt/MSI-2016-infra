
import { MissionState, ControlPayload, PayloadType } from './commands'
import { NavData } from './drone_state'

type State = "Initialized" /* Not yet connected to control and drone */
           | "Ready" /* Ready to receive commands from external control */
           | "Halted" /* Ignoring commands from external control */
           | "Mission" /* Mission in progress so ignoring external control commands */

export class ControlState {
  constructor(public isControlUp: boolean, public isVideoUp: boolean) {}
}

export class OperatorState implements ControlPayload {

  payloadType: PayloadType = "OperatorState"

  constructor(
    public state: State,
    public operatorToken: string,
    public externalControlState: ControlState,
    public isDroneReady: boolean,
    public error?: string,
    public missionState?: MissionState,
    public droneState?: NavData) {}

    static initialized(operatorToken: string): OperatorState {
      return new OperatorState("Initialized", operatorToken, new ControlState(false, false), false)
    }

    copy() {
      return new OperatorState(
        this.state,
        this.operatorToken,
        this.externalControlState,
        this.isDroneReady,
        this.error,
        this.missionState,
        this.droneState)
    }

    copyError(error: string): OperatorState {
      let copied = this.copy()
      copied.error = error
      return copied
    }
}
