/**
 *  Command models
 */
export type CommandType = "takeoff" | "land" | "stop" | "up" | "down" | "front" | "back" |
    "left" | "right" | "clockwise" | "counterClockwise" | "horizontalCamera" | "verticalCamera" |
    "disableEmergency" | "calibrate"

export class Command {
  constructor(public commandType: CommandType) {}
}

export class Move extends Command {
  constructor(public commandType: CommandType, public speed: number) {
    super(commandType);
  }
}

//TODO think about mission task
export type MissionCommandType = "takeoff" | "altitude" | "cw" | "ccw" | "hover" | "go" | "zero" | "wait"
  | "forward" | "backward" | "left" | "right" | "up" | "down"

export class MissionCommand {
  constructor(public commandType: MissionCommandType, public args: Array<any>) {
    this.args = this.args || []
  }
}

export type MissionStatus = "started" | "completed" | "inProgress" | "error"

export class MissionState {
  constructor(
    public status: MissionStatus,
    public x: number = 0,
    public y: number = 0,
    public z: number = 0) {}
}

export class MoveMissionCommand extends MissionCommand {
  constructor(public commandType: MissionCommandType, public distance: number) {
    super(commandType, [distance]);
  }
}

export class GoMissionCommand extends MissionCommand {
  constructor(
    public commandType: MissionCommandType,
    public x: number,
    public y: number,
    public z: number) {

    super(commandType, [{x: x, y: y, z: z}]);
  }
}
