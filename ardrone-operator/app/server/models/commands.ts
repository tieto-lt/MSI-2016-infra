/**
 *  Command models
 */

export type PayloadType = "DirectCommand" | "MissionPlan" | "OperatorState" | "Image" | "MissionsUpdate"

export interface ControlPayload {
  payloadType: PayloadType
}

/**
 * Image payload
 */
export class Image implements ControlPayload {
  payloadType: PayloadType = "Image"
  constructor(public imageBase64: string) {}
}

/**
 * Direct drone commands for controllign drone in real time
 */
export type CommandType = "takeoff" | "land" | "stop" | "up" | "down" | "front" | "back" |
    "left" | "right" | "clockwise" | "counterClockwise" | "horizontalCamera" | "verticalCamera" |
    "disableEmergency" | "calibrate" | "takePicture"

export class DirectCommand implements ControlPayload {

  payloadType: PayloadType = "DirectCommand"
  constructor(public commandType: CommandType) {}
}

export class Move extends DirectCommand {
  constructor(public commandType: CommandType, public speed: number) {
    super(commandType);
  }
}

/**
 * Mission commands when submitting whole mission
 */
//TODO think about mission task
export type MissionCommandType = "takeoff" | "altitude" | "cw" | "ccw" | "hover" | "go" | "zero" | "wait"
  | "forward" | "backward" | "left" | "right" | "up" | "down"
  | "takePicture" | "switchVerticalCamera" | "switchHorizontalCamera"

export class MissionPlan implements ControlPayload {
  payloadType: PayloadType = "MissionPlan"

  constructor(public missionId: string, public commands: MissionCommand[]) {}
}

export class MissionCommand {

  constructor(public commandType: MissionCommandType, public args: any[]) {
    this.args = this.args || []
  }
}

export type MissionStatus = "started" | "completed" | "inProgress" | "error"

export class MissionDroneState {
  constructor(
    public x: number = 0,
    public y: number = 0,
    public z: number = 0) {}
}

export class MissionState {
  constructor(
    public status: MissionStatus,
    public statusMessage: string = "OK",
    public droneState?: MissionDroneState) {}

  static error(error: string): MissionState {
    return new MissionState("error", error)
  }
}

export class Missions {
  constructor(public payloadType: PayloadType, public missions: Mission[]) {}
}

export class Mission {
  constructor(
    public missionId: string,
    public submittedBy: number,
    public state: string,
    public commands: MissionCommand[]) {}
}
