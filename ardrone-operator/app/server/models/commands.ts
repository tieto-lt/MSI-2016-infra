/**
 *  Command models
 */
export type CommandType = "takeoff" | "land" | "stop" | "up" | "down" | "front" | "back" |
    "left" | "right" | "clockwise" | "counterClockwise" | "horizontalCamera" | "verticalCamera" |
    "disableEmergency"


export class Command {
  constructor(public commandType: CommandType) {}
}

export class Move extends Command {
  constructor(public commandType: CommandType, public speed: number) {
    super(commandType);
  }
}
