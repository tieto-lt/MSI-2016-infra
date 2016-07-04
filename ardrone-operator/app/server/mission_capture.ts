import { Image } from './models/commands';
import { NavData, MissionState, MissionResult } from './models/drone_state';
import { EventPublisher } from './event_publisher';
import { Constants } from './constants';
import request = require('request')

export class MissionCapture {

  private images: Array<Image> = []
  private navigationData: Array<MissionState> = []
  private videoFrames: Array<Buffer> = []

  //TODO video frames collected here?
  private stateCallback = (state: [NavData, any]) => this.addNavData(state[0], state[1])
  private imageCallback = (image: Image) => this.addImage(image)
  private videoCallback = (frame: Buffer) => this.addVideoFrame(frame)

  constructor(private missionId: string) {
      EventPublisher.onEvent('state', this.stateCallback)
      EventPublisher.onEvent('PictureTaken', this.imageCallback)
      EventPublisher.onEvent('video', this.videoCallback)
  }

  finish(callback) {
    EventPublisher.unsubscribe('state', this.stateCallback)
    EventPublisher.unsubscribe('PictureTaken', this.imageCallback)
    EventPublisher.unsubscribe('video', this.videoCallback)

    console.log(`Mission stats:
      ${this.images.length} pictures,
      ${this.navigationData.length} navData,
      ${this.videoFrames.length} video frames`)
    console.log(`Started sending mission data to control at ${new Date().toTimeString()}`)

    request.post(
      Constants.missionFinishedUrl(this.missionId),
      {
        body: this.getResult(),
        json: true
      },
      (err, rest, body) => {
        if (err) {
          console.log(`Error when sending mission data to control ${err}`)
        }
        console.log(`Finished sending mission data to control at ${new Date().toTimeString()}`)
        callback()
      })
  }

  addImage(image: Image) {
    this.images.push(image)
  }

  addNavData(droneState: NavData, missionState: any) {
    let missionStateMapped = new MissionState()
    missionStateMapped.x = missionState.x
    missionStateMapped.y = missionState.y
    missionStateMapped.z = missionState.z
    if (droneState && droneState.demo) {
      missionStateMapped.altitude = droneState.demo.altitude
      missionStateMapped.altitudeMeters = droneState.demo.altitudeMeters
    }
    this.navigationData.push(missionStateMapped)
  }

  addVideoFrame(frame: Buffer) {
    this.videoFrames.push(frame)
  }

  getResult(): MissionResult {
    let res = new MissionResult()
    res.missionId = this.missionId;
    res.navigationData = this.navigationData;
    res.images = this.images;
    res.videoBase64 = Buffer.concat(this.videoFrames).toString('base64')
    return res;
  }
}
