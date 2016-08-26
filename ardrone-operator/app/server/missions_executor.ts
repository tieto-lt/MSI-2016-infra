import { MissionCommand, MissionCommandType, MissionState, Image } from './models/commands';
let arDroneConstants = require('ar-drone/lib/constants');
let autonomy = require('ardrone-autonomy');
import { EventPublisher } from './event_publisher';

export type MissionEvent = "MissionPicture"

export class MissionsExecutor {

  private isMissionInProgress: boolean = false
  private control: any

  constructor(private client: any) {
    // From the SDK.
    let navdata_options = (
        this.navdata_option_mask(arDroneConstants.options.DEMO)
      | this.navdata_option_mask(arDroneConstants.options.VISION_DETECT)
      | this.navdata_option_mask(arDroneConstants.options.MAGNETO)
      | this.navdata_option_mask(arDroneConstants.options.WIFI)
    );

    this.client.config('general:navdata_demo', true);
    this.client.config('general:navdata_options', navdata_options);
    this.client.config('video:video_channel', 0);
    this.client.config('detect:detect_type', 12);
  }

  runMission(commands: Array<MissionCommand>, imageProvider: () => Image, callback: (state: MissionState) => void) {
    if (this.isMissionInProgress) {
      return new MissionState("inProgress")
    }
    this.isMissionInProgress = true
    let mission = this.toMission(commands, imageProvider)

    mission.run((err, result) => {
      try {
        if (err) {
          console.trace("Oops, something bad happened: %s", err.message);
          mission.client().stop();
          mission.client().land();
          callback(MissionState.error(err.message))
        } else {
          console.log("Mission success!");
          callback(new MissionState("completed"))
        }
      } finally {
        this.isMissionInProgress = false
        this.control.removeAllListeners('controlData');
      }
    });
    return new MissionState("started")
  }

  public getState(): any {
    let state =  this.control && this.control.state() || {}
    state.isMissionInProgress = this.isMissionInProgress
    return state
  }

  private toMission(commands: Array<MissionCommand>, imageProvider: () => Image): any {
    var mission  = this.createMission();
    commands.forEach(c => {
      if (c.commandType === "takePicture") {
        mission.taskSync(() => this.emit("MissionPicture"));
      } else if (c.commandType === "switchHorizontalCamera") {
        mission.taskSync(() => this.client.config('video:video_channel', 0));
      } else if (c.commandType === "switchVerticalCamera") {
        mission.taskSync(() => this.client.config('video:video_channel', 1));
      } else if (c.commandType === "deadlyFlip") {
        mission.taskSync(() => this.client.animate('flipLeft', 15));
        mission.wait(2000);
      } else {
        let cmdFn = mission[c.commandType]
        if (cmdFn) {
          console.log(`Mission command ${c.commandType}`, cmdFn)
          mission = cmdFn.apply(mission, c.args);
        } else {
          console.log(`Mission command ${c.commandType} not found`)
        }
      }
    })
    return mission
  }

  private createMission(): any {
    let client  = this.client;
    if (!client) {
      throw Error("Not connected to drone")
    }
    let control = new autonomy.Controller(client, {tag: false});
    let mission = new autonomy.Mission(client, control, {tag: false});
    this.control = control
    return mission;
  }

  private navdata_option_mask(c) {
    return 1 << c;
  }

  private emit(event: MissionEvent) {
    EventPublisher.emitNoData(event)
  }
}
