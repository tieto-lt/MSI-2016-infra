/**
 *  Command models
 */
export type CommandType = "takeoff" | "land" | "up" | "down" | "front" | "back" |
    "left" | "right" | "clockwise" | "counterClockwise"

export class Command {
  constructor(public commandType: CommandType) {}
}

export class Move extends Command {
  constructor(public commandType: CommandType, public speed: number) {
    super(commandType);
  }
}
