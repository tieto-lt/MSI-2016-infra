import { MissionCommand, MissionCommandType, MissionState } from './models/commands';
let arDroneConstants = require('ar-drone/lib/constants');
let autonomy = require('ardrone-autonomy');

export class MissionsExecutor {

  private isMissionInProgress: boolean = false
  private control: any

  constructor(private client: any) {
    // From the SDK.
    let navdata_options = (
        this.navdata_option_mask(arDroneConstants.options.DEMO)
      //| this.navdata_option_mask(arDroneConstants.options.VISION_DETECT)
      | this.navdata_option_mask(arDroneConstants.options.MAGNETO)
      //| this.navdata_option_mask(arDroneConstants.options.WIFI)
    );

    this.client.config('general:navdata_demo', true);
    this.client.config('general:navdata_options', navdata_options);
    this.client.config('video:video_channel', 0);
    //this.client.config('detect:detect_type', 12);
  }

  runMission(commands: Array<MissionCommand>, callback: (state: MissionState) => void) {
    if (this.isMissionInProgress) {
      return new MissionState("inProgress")
    }
    this.isMissionInProgress = true
    let mission = this.toMission(commands)

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

  private toMission(commands: Array<MissionCommand>): any {
    var mission  = this.createMission();
    commands.forEach(c => {
      let cmdFn = mission[c.commandType]
      if (cmdFn) {
        console.log(`Mission command ${c.commandType}`, cmdFn)
        mission = cmdFn.apply(mission, c.args);
      } else {
        console.log(`Mission command ${c.commandType} not found`)
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
}
