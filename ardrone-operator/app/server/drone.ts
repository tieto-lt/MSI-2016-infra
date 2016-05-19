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
    //Send reduced amount of NAVDATA
    this.client.config('general:navdata_demo', 'FALSE');
    //this.client.config('general:navdata_options', 777060865)
    this.videoStream = this.client.getVideoStream();
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
    let mapping = new Map<CommandType, (command: Command) => any>()
    mapping.set("stop", c => this.client.stop())
    mapping.set("takeoff", c => this.client.takeoff())
    mapping.set("land", c => this.client.land())
    mapping.set("up", c => this.client.up(this.getSpeed(c)))
    mapping.set("down", c => this.client.down(this.getSpeed(c)))
    mapping.set("front", c => this.client.front(this.getSpeed(c)))
    mapping.set("back", c => this.client.back(this.getSpeed(c)))
    mapping.set("left", c => this.client.left(this.getSpeed(c)))
    mapping.set("right", c =>this.client.right(this.getSpeed(c)))
    mapping.set("clockwise", c => this.client.clockwise(this.getSpeed(c)))
    mapping.set("counterClockwise", c => this.client.counterClockwise(this.getSpeed(c)))
    mapping.set("horizontalCamera", c => this.client.config('video:video_channel', 0))
    mapping.set("verticalCamera", c => this.client.config('video:video_channel', 3))
    mapping.set("disableEmergency", c => this.client.disableEmergency())

    let commandFunction: (command: Command) => any = mapping.get(command.commandType)
    commandFunction(command)
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
