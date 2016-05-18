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
    switch (command.commandType) {
      case "takeoff":
        this.client.takeoff();
        // console.log("takeoff");
        break;
      case "land":
        this.client.land();
        // console.log("land");
        break;
      // TODO: implement
    }
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
