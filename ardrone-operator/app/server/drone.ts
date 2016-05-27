import arDrone = require('ar-drone')
var autonomy = require('ardrone-autonomy');
import { PaVEParser } from './PaVEParser';

import * as ds from './models/drone_state'
import { DirectCommand, CommandType, Move, MissionCommand, MissionCommandType, MissionState, Image } from './models/commands';
import { MissionsExecutor } from './missions_executor';
import { EventPublisher} from './event_publisher';
import stream = require('stream');
import fs = require('fs')
import { Configuration } from '../config'

const MISSION_COMMAND_MAPPING = new Map<MissionCommandType, (command: DirectCommand, mission: any) => any>()

export type DroneEvent = "state" | "video" | "image" | "error"

export class Drone {

  private client: any
  private videoParser: PaVEParser
  private videoStream: stream.Stream
  private pngStream: stream.Stream
  private missionsExecutor: MissionsExecutor
  private lastImage: Buffer
  private logStream: fs.WriteStream;

  connect() {
    this.close();

    if (Configuration.debug) {
      console.log('Debug mode enabled')
      this.logStream = fs.createWriteStream("./debug.log", { flags: 'a' })
    } else {
      this.logStream = fs.createWriteStream("/dev/null", { flags: 'a' })
    }
    this.client = arDrone.createClient({ log: this.logStream, frameRate: 5 });
    this.missionsExecutor = new MissionsExecutor(this.client)

    this.videoParser = new PaVEParser()
    this.videoStream = this.client.getVideoStream()
    this.videoStream.on('data', this.onVideoData());
    this.videoStream.on('error', err => {
      this.emit("error", err)
      this.videoParser = new PaVEParser()
    })

    this.client.on('navdata', this.onNavData());
    this.client.on('error', err => this.emit("error", err))

    this.pngStream = this.client.getPngStream();
    this.pngStream.on('data', this.onPngData());
  }

  close() {
    this.missionsExecutor = null
    this.client = null;
    this.logStream && this.logStream.close()
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
      return this.missionsExecutor.runMission(
        commands,
        () => this.getCurrentImage(),
        callback)
    } else {
      return MissionState.error("Client not connected")
    }
  }

  onEvent(event: DroneEvent, callback) {
    EventPublisher.onEvent(event, callback)
  }

  getCurrentImage() {
    return new Image((this.lastImage || "").toString('base64'))
  }

  private getSpeed(command: DirectCommand): number {
    let moveCommand = <Move>command;
    return moveCommand.speed;
  }

  private onVideoData() {
    return data => this.videoParser.write(
      data,
      parsedData => this.emit("video",  parsedData))
  }

  private onPngData() {
    return (image: Buffer) => {
      this.lastImage = image
      //this.emit("image", image)
    }
  }

  private onNavData() {
    return (data: ds.NavData) => {
      this.emit("state", [data, this.missionsExecutor.getState()])
    }
  }

  private emit(event: DroneEvent, data: any) {
    EventPublisher.emit(event, data)
  }
}
