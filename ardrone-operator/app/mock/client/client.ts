const PLUS = 187
const MINUS = 189

const UP = 38
const DOWN = 40
const RIGHT = 39
const LEFT = 37
const W_KEY =  87
const S_KEY =  83
const D_KEY =  68
const A_KEY = 65

const ESC = 27
const ENTER = 13

class ControllApi {

  constructor() {
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

    $(document).keydown(e => {
        console.log(e.which)
        switch (e.which) {
          case PLUS:
            $("#drone-speed").val(this.currentSpeed() + 0.1);
            break;
          case MINUS:
            $("#drone-speed").val(this.currentSpeed() - 0.1);
            break;
          case UP:
            this.sendCommandForDrone("up", this.currentSpeed());
            break;
          case DOWN:
            this.sendCommandForDrone("down", this.currentSpeed());
            break;
          case RIGHT:
            this.sendCommandForDrone("clockwise", this.currentSpeed());
            break;
          case LEFT:
            this.sendCommandForDrone("counterClockwise", this.currentSpeed());
            break;
          case W_KEY:
            this.sendCommandForDrone("front", this.currentSpeed());
            break;
          case S_KEY:
            this.sendCommandForDrone("back", this.currentSpeed());
            break;
          case A_KEY:
            this.sendCommandForDrone("left", this.currentSpeed());
            break;
          case D_KEY:
            this.sendCommandForDrone("right", this.currentSpeed());
            break;
          case ENTER:
            this.sendCommandForDrone("takeoff", undefined)
            break;
          case ESC:
            this.sendCommandForDrone("land", undefined)
            break;
        }
        e.preventDefault();
    });

    $(document).keyup(e => {
      switch (e.which) {
        case UP:
        case DOWN:
        case RIGHT:
        case LEFT:
        case W_KEY:
        case S_KEY:
        case A_KEY:
        case D_KEY:
          this.sendCommandForDrone("stop", undefined);
      }
    });
  }

  currentSpeed(): number {
    return $("#drone-speed").val()
  }

  sendCommandForDrone(command, speed) {
    let url = `/rest/operators/zerDummyId/${command}`;
    if (speed) {
      url += `?speed=${speed}`
    }
    $.ajax({
       url: url,
       type: 'POST',
    });
  }
}

$(document).ready(() => new ControllApi());
