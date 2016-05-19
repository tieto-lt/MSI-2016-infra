class Keyboard {
  public static get WS_CONTROL_URL(): string { return "ws://localhost:9000" }
  public static get HTTP_CONTROL_URL(): string { return "http://localhost:9000" }

  public static get SERVER_PORT(): number { return 8000 }
  public static get PLUS(): number { return 187 }
  public static get MINUS(): number { return 189 }

  public static get UP(): number { return 38 }
  public static get DOWN(): number { return 40 }
  public static get RIGHT(): number { return 39 }
  public static get LEFT(): number { return 37 }
  public static get W_KEY(): number { return 87 }
  public static get S_KEY(): number { return 83 }
  public static get D_KEY(): number { return 68 }
  public static get A_KEY(): number { return 65 }
  public static get PAGE_UP(): number { return 33 }
  public static get PAGE_DOWN(): number { return 34 }
  public static get ESC(): number { return 27 }
  public static get ENTER(): number { return 13 }
}

class OperatorClient {

  private ws: WebSocket;

  constructor() {
    $("#drone-connect").click(() => this.connectDrone())
    $("#drone-speed").val(0.1)
    $("#drone-disable-emergency").click(() => this.sendCommandForDrone("disableEmergency", null))
    $(document).keydown(e => this.onKeyDown(e));
    $(document).keyup(e => this.onKeyUp(e));

    this.ws = new WebSocket("ws://localhost:8000/ws/api")
    this.ws.onmessage = (ev) => {
      let droneState = JSON.parse(ev.data)
      let demo = droneState.demo || { velocity: {}}
      let gps = droneState.gps || {}

      let selectedState = {
        demo: {
          controlState: demo.controlState,
          flyState: demo.flyState,
          batteryPercentage: demo.batteryPercentage,
          altitude: demo.altitude,
          altitudeMeters: demo.altitudeMeters,
          velocity: {
            x: demo.velocity.x,
            y: demo.velocity.y,
            z: demo.velocity.z,
          },
          xVelocity: demo.xVelocity,
          yVelocity: demo.yVelocity,
          zVelocity: demo.zVelocity,
          gps: gps
        }
      }
      $("#navdata").text(JSON.stringify(selectedState, null, 2))
    }
  }

  onKeyUp(e) {
    console.log('sss')
    switch (e.which) {
      case Keyboard.UP:
      case Keyboard.DOWN:
      case Keyboard.RIGHT:
      case Keyboard.W_KEY:
      case Keyboard.LEFT:
      case Keyboard.S_KEY:
      case Keyboard.A_KEY:
      case Keyboard.D_KEY:
        this.sendCommandForDrone("stop", undefined);
    }
  }

  onKeyDown(e) {
    let speedStep = 0.1

    switch (e.which) {
      case Keyboard.PLUS:
        this.setCurrentSpeed(this.currentSpeed() + speedStep);
        break;
      case Keyboard.MINUS:
        this.setCurrentSpeed(this.currentSpeed() - speedStep);
        break;
      case Keyboard.UP:
        this.sendCommandForDrone("up", this.currentSpeed());
        break;
      case Keyboard.DOWN:
        this.sendCommandForDrone("down", this.currentSpeed());
        break;
      case Keyboard.RIGHT:
        this.sendCommandForDrone("clockwise", this.currentSpeed());
        break;
      case Keyboard.LEFT:
        this.sendCommandForDrone("counterClockwise", this.currentSpeed());
        break;
      case Keyboard.W_KEY:
        this.sendCommandForDrone("front", this.currentSpeed());
        break;
      case Keyboard.S_KEY:
        this.sendCommandForDrone("back", this.currentSpeed());
        break;
      case Keyboard.A_KEY:
        this.sendCommandForDrone("left", this.currentSpeed());
        break;
      case Keyboard.D_KEY:
        this.sendCommandForDrone("right", this.currentSpeed());
        break;
      case Keyboard.ENTER:
        this.sendCommandForDrone("takeoff", undefined)
        break;
      case Keyboard.ESC:
        this.sendCommandForDrone("land", undefined)
        break;
      case Keyboard.PAGE_UP:
        this.sendCommandForDrone("horizontalCamera", undefined)
        break;
      case Keyboard.PAGE_DOWN:
        this.sendCommandForDrone("verticalCamera", undefined)
        break;
    }
    e.preventDefault();
  }

  setCurrentSpeed(speed: number) {
    $("#drone-speed").val(Math.round(Math.abs(speed % 1) * 100) / 100)
  }

  currentSpeed(): number {
    return $("#drone-speed").val() % 1;
  }

  sendCommandForDrone(command, speed) {
    if (this.isWsOpen(this.ws)) {
      let commandObj = {
        commandType: command,
        speed: speed
      }
      this.ws.send(JSON.stringify(commandObj))
    }
  }

  connectDrone() {
    $.ajax({
       url: '/api/connect/drone',
       type: 'GET',
    });
  }

  private isWsOpen(ws: WebSocket) {
    return ws && ws.readyState === WebSocket.OPEN;
  }
}

$(document).ready(() => new OperatorClient());
