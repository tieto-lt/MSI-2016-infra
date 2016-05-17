var WebSocket = require('ws');

class ControlMock {
  private server: any;

  constructor(port: number) {
    this.server = new WebSocket.Server({port: port});

    this.server.on('connection', this.handleConnecion);

    console.log(`Mock server started under port ${port}`);
  }

  handleConnecion(ws) {
    console.log("New connection");

    ws.on('message', (message) => console.log(message));
    ws.send("Hi!");
  }
}

export = new ControlMock(9000);
