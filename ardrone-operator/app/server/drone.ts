import arDrone = require('ar-drone')
import * as ds from './models/drone_state'
import { Command, CommandType, Move } from './models/commands';
import { PaVEParser } from './PaVEParser';

export class Drone {

  private client: any
  private videoStream: any
  private videoParser: PaVEParser

  constructor(
    private stateCalback: (state: ds.NavData) => any,
    private videoCallback: (any) => any) {}

  connect() {
    this.close();
    this.client = arDrone.createClient();
    this.videoStream = this.client.getVideoStream();
    this.client.on('navdata', this.onNavData());
    this.videoParser = new PaVEParser()
    this.videoStream.on('data', this.onVideoData())
  }

  close() {
    //Seems like nothing I can close here
  }

  sendCommand(command: Command) {
    console.log(command);
    switch (command.commandType) {
      case "stop":
        this.client.stop();
        break;
      case "takeoff":
        this.client.takeoff();
        // console.log("takeoff");
        break;
      case "land":
        this.client.land();
        // console.log("land");
        break;
      case "up":
        this.client.up(this.getSpeed(command));
        break;
      case "down":
        this.client.down(this.getSpeed(command));
        break;
      case "front":
        this.client.front(this.getSpeed(command));
        break;
      case "back":
        this.client.back(this.getSpeed(command));
        break;
      case "left":
        this.client.left(this.getSpeed(command));
        break;
      case "right":
        this.client.right(this.getSpeed(command));
        break;
      case "clockwise":
        this.client.clockwise(this.getSpeed(command));
        break;
      case "counterClockwise":
        this.client.counterClockwise(this.getSpeed(command));
        break;
    }
  }

  private getSpeed(command: Command): number {
    let moveCommand = <Move>command;
    return moveCommand.speed;
  }

  private onVideoData() {
    return (data: any) => {
      this.videoParser.write(data, (parsedData) => {
        this.videoCallback(parsedData);
      });
    }
  }

  private onNavData() {
    return (data: ds.NavData) => this.stateCalback(data);
  }
}
