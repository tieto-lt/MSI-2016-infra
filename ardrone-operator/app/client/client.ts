class Keyboard {

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
  private keyDowned = false;
  private missions = [];

  constructor() {
    $("#drone-connect").click(() => this.connectDrone())
    $("#control-connect").click(() => this.connectControl())
    $("#drone-speed").val(0.1)
    $("#drone-disable-emergency").click(() => this.sendCommandForDrone("disableEmergency", null))
    $("#drone-calibrate").click(() => this.sendCommandForDrone("calibrate", null))
    $("#drone-take-picture").click(() => this.sendCommandForDrone("takePicture", null))
    $(document).keydown(e => this.onKeyDown(e));
    $(document).keyup(e => this.onKeyUp(e));

    this.ws = new WebSocket("ws://localhost:8000/ws/api")
    this.ws.onmessage = (ev) => {
      let dataObj = JSON.parse(ev.data)
      if (dataObj.payloadType === "OperatorState") {
        this.onOperatorStateUpdate(dataObj)
      } else if (dataObj.payloadType === "Image") {
        this.onImageUpdate(dataObj)
      } else if (dataObj.payloadType === "MissionsUpdate") {
        console.log(dataObj);
        this.onMissionsUpdate(dataObj)
      }
    }
    this.showSuccess();
  }

  onImageUpdate(image) {
    let imageBase64 = image.imageBase64
    $("#pngStream").attr("src", `data:image/png;base64,${imageBase64}`);
  }

  onOperatorStateUpdate(operatorState) {
    let droneState = operatorState.droneState && operatorState.droneState.droneState || {}
    let demo = operatorState.droneState && operatorState.droneState.demo || { velocity: {}}

    let droneStateSummary = {
      state: operatorState.state,
      token: operatorState.operatorToken,
      externalCtrl: operatorState.externalControlState,
      isDroneReady: operatorState.isDroneReady,
      missionState: operatorState.missionState,
      battery: demo.batteryPercentage,
      altitude: demo.altitude,
      ctrlState: demo.controlState,
      flyState: demo.flyState,
      emergency: droneState.emergencyLanding
    }
    if (operatorState.error) {
      this.showError(operatorState.error);
    }

    $("#summary_navdata").text(JSON.stringify(droneStateSummary, null, 2))
    $("#navdata").text(JSON.stringify(operatorState, null, 2))
  }

  onMissionsUpdate(missions) {
    let html = missions.missions.map((mission, index) => {
      return `<tr>
        <td>${mission.missionId}</td>
        <td>${mission.submittedBy}</td>
        <td>${mission.state}</td>
        <td>${mission.commands.length}</td>
        <td><button class="btn btn-success" onclick="runMission('${index}')">Run</button></td>
      </tr>`
    }).join('');
    $("#missions-table-rows").html(html);
    this.missions = missions.missions;
  }

  onKeyUp(e) {
    this.keyDowned = false;
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
        e.preventDefault();
        return false;
    }
  }

  onKeyDown(e) {
    if (this.keyDowned) {
      e.preventDefault(); //So that page will not scroll
      return
    }
    this.keyDowned = true
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
    return false;
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
        payloadType: "DirectCommand",
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

  connectControl() {
    $.ajax({
       url: '/api/connect/control',
       type: 'GET',
    });
  }

  runMission(missionIndex) {
    let mission = this.missions[missionIndex]
    let missionId = mission.missionId;
    $.ajax({
       url: '/api/mission/',
       type: 'POST',
       data: JSON.stringify(mission),
       contentType: 'application/json',
       success: () => this.showSuccess("Mission submitted"),
       error: () => this.showSuccess("Mission submission failed!")
    });
  }

  private showError(text: string) {
    $('#error-placeholder').text(text)
    $('#error-placeholder').show()
    $('#ok-placeholder').hide()
  }

  private showSuccess(text: string = "Everything seems OK") {
    $('#error-placeholder').hide()
    $('#ok-placeholder').text(text)
    $('#ok-placeholder').show()
  }

  private isWsOpen(ws: WebSocket) {
    return ws && ws.readyState === WebSocket.OPEN;
  }
}

$(document).ready(
  () => {
    let operatorClient = new OperatorClient();
    window['runMission'] = operatorClient.runMission.bind(operatorClient);
  });
