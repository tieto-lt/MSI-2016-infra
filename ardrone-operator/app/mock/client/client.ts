class ControllApi {

  constructor() {
    $("#take-off-command").click(() => this.sendCommandForDrone("takeoff"));
    $("#land-command").click(() => this.sendCommandForDrone("land"));
  }

  sendCommandForDrone(command) {
    $.ajax({
       url: `/rest/operators/zerDummyId/${command}`,
       type: 'POST'
    });
  }
}

$(document).ready(() => new ControllApi());
