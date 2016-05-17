
export class DroneState {
  public flying: number
  public videoEnabled: number
  public visionEnabled: number
  public controlAlgorithm: number
  public altitudeControlAlgorithm: number
  public startButtonState: number
  public controlCommandAck: number
  public cameraReady: number
  public travellingEnabled: number
  public usbReady: number
  public navdataDemo: number
  public navdataBootstrap: number
  public motorProblem: number
  public communicationLost: number
  public softwareFault: number
  public lowBattery: number
  public userEmergencyLanding: number
  public timerElapsed: number
  public MagnometerNeedsCalibration: number
  public anglesOutOfRange: number
  public tooMuchWind: number
  public ultrasonicSensorDeaf: number
  public cutoutDetected: number
  public picVersionNumberOk: number
  public atCodecThreadOn: number
  public navdataThreadOn: number
  public videoThreadOn: number
  public acquisitionThreadOn: number
  public controlWatchdogDelay: number
  public adcWatchdogDelay: number
  public comWatchdogProblem: number
  public emergencyLanding: number
}

export class DroneDemoState {
  public controlState: string //TODO enum
  public flyState: string //TODO enum
  public batteryPercentage: number
  public rotation: Rotation
  public frontBackDegrees: number
  public leftRightDegrees: number
  public clockwiseDegrees: number
  public altitude: number
  public altitudeMeters: number
  public velocity: Velocity
  public xVelocity: number
  public yVelocity: number
  public zVelocity: number
  public frameIndex: number
}

export class Rotation {
  public frontBack: number
  public pitch: number
  public theta: number
  public y: number
  public leftRight: number
  public roll: number
  public phi: number
  public x: number
  public clockwise: number
  public yaw: number
  public psi: number
  public z: number
}

export class Velocity {
  public x: number
  public y: number
  public z: number
}
