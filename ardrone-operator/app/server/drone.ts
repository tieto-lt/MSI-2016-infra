import arDrone = require('ar-drone')
var autonomy = require('ardrone-autonomy');
import * as ds from './models/drone_state'
import { DirectCommand, CommandType, Move, MissionCommand, MissionCommandType, MissionState } from './models/commands';
import { PaVEParser } from './PaVEParser';
import { MissionsExecutor } from './missions_executor';

const MISSION_COMMAND_MAPPING = new Map<MissionCommandType, (command: DirectCommand, mission: any) => any>()

export class Drone {

  private client: any
  private videoStream: any
  private videoParser: PaVEParser
  private missionsExecutor: MissionsExecutor

  constructor(
    private stateCalback: (state: [ds.NavData, MissionState]) => any,
    private videoCallback: (any) => any) {}

  connect(onErrorCallback: (err: any) => void) {
    this.close();
    this.client = arDrone.createClient();
    this.missionsExecutor = new MissionsExecutor(this.client)
    this.videoStream = this.client.getVideoStream();
    this.videoStream.on('error', err => {
      if (err) {
        this.videoParser = new PaVEParser()
        onErrorCallback(err)
      }
    })
    this.client.on('navdata', this.onNavData());
    this.client.on('error', onErrorCallback)
    this.videoParser = new PaVEParser()
    this.videoStream.on('data', this.onVideoData())
  }

  close() {
    //Seems like nothing I can close here
    this.missionsExecutor = null
    this.client = null;
  }

  sendCommand(command: DirectCommand) {
    if (!this.client) return
    console.log(command);
    let mapping = new Map<CommandType, (command: DirectCommand) => any>()
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
    mapping.set("verticalCamera", c => this.client.config('video:video_channel', 1))
    mapping.set("disableEmergency", c => this.client.disableEmergency())
    mapping.set("calibrate", c => this.client.calibrate(0))

    let commandFunction: (command: DirectCommand) => any = mapping.get(command.commandType)
    commandFunction(command)
  }

  runMission(
    commands: Array<MissionCommand>,
     callback: (state: MissionState) => void): MissionState {

    if (this.missionsExecutor) {
      return this.missionsExecutor.runMission(commands, callback)
    } else {
      return MissionState.error("Client not connected")
    }
  }

  private getSpeed(command: DirectCommand): number {
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
    return (data: ds.NavData) => {
      this.stateCalback([data, this.missionsExecutor.getState()]);
    }
  }
}
