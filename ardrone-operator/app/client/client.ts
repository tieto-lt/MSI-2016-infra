class Keyboard {
  public static get WS_CONTROL_URL(): string { return "ws://localhost:9000" }
  public static get HTTP_CONTROL_URL(): string { return "http://localhost:9000" }
  public static get SERVER_PORT(): number { return 8000 }
  public static get PLUS(): number { return 187 }
  public static get MINUS(): number { return 189 }

  public static get UP(): number { return 38 }
  public static get DOWN(): number { return 40}
  public static get RIGHT(): number { return 39}
  public static get LEFT(): number { return 37}
  public static get W_KEY(): number { return 87}
  public static get S_KEY(): number { return 83}
  public static get D_KEY(): number { return 68}
  public static get A_KEY(): number { return 65}

  public static get ESC(): number { return 27}
  public static get ENTER(): number { return 13}
}

class OperatorClient {

  private ws: WebSocket;

  constructor() {
    $("#drone-connect").click(() => this.connectDrone())
    $("#drone-speed").val(0.1)
    $("#stop-command").click(() => this.sendCommandForDrone("stop", undefined));
    $("#take-off-command").click(() => this.sendCommandForDrone("takeoff", undefined));
    $("#land-command").click(() => this.sendCommandForDrone("land", undefined));
    $("#up-command").click(() => this.sendCommandForDrone("up", this.currentSpeed()));
    $("#down-command").click(() => this.sendCommandForDrone("down", this.currentSpeed()));
    $("#front-command").click(() => this.sendCommandForDrone("front", this.currentSpeed()));
    $("#back-command").click(() => this.sendCommandForDrone("back", this.currentSpeed()));
    $("#left-command").click(() => this.sendCommandForDrone("left", this.currentSpeed()));
    $("#right-command").click(() => this.sendCommandForDrone("right", this.currentSpeed()));
    $("#clockwise-command").click(() => this.sendCommandForDrone("clockwise", this.currentSpeed()));
    $("#counterClockwise-command").click(() => this.sendCommandForDrone("counterClockwise", this.currentSpeed()));

    $(document).keydown(e => this.onKeyDown(e));
    $(document).keyup(e => this.onKeyUp(e));

    this.ws = new WebSocket("ws://localhost:8000/ws/api")
    this.ws.onmessage = (ev) => {
      let droneState = JSON.parse(ev.data)
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
    console.log(e.which)
    console.log(Keyboard.UP, 'ss')
    switch (e.which) {
      case Keyboard.PLUS:
        $("#drone-speed").val(this.currentSpeed() + 0.1);
        break;
      case Keyboard.MINUS:
        $("#drone-speed").val(this.currentSpeed() - 0.1);
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
    }
    e.preventDefault();
  }
  currentSpeed(): number {
    return $("#drone-speed").val()
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
