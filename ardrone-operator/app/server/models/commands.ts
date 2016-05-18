/**
 *  Command models
 */
export type CommandType = "takeoff" | "land" | "up" | "down" | "front" | "back" |
    "left" | "right" | "clockwise" | "counterClockwise"

export interface CommandJSON {
  commandType: CommandType
}

export class Command implements CommandJSON {
  constructor(public commandType: CommandType) {}
}

export class Move extends Command {
  constructor(public commandType: CommandType, public speed: number) {
    super(commandType);
  }
}
