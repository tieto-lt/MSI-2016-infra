var WebSocket = require('ws');
import * as express from 'express';
import { Server } from 'http';
import { OperatorState } from '../server/models/operator_state';
import { MockApi } from './mock_api'



class ControlMock {
  private wsServer: any;
  private httpServer: Server;
  private mockApi = new MockApi()

  constructor(port: number, httpPort: number) {
    //WS
    this.wsServer = new WebSocket.Server({port: port});
    this.wsServer.on('connection', this.handleConnecion);
    console.log(`Mock listening ws on ${port}`);

    //HTTP
    let expressApp = express();

    expressApp.post('/rest/operators', (req, res) => {
      res.json(this.mockApi.initializeOperator())
    });

    const httpServer = expressApp.listen(httpPort, "localhost", () => {
       const {address, port} = httpServer.address();
       console.log('Mock Listening http on http://localhost:' + port);
    });
    this.httpServer = httpServer

  }

  handleConnecion(ws) {
    console.log("New connection");

    ws.on('message', (message) => console.log(message));
    ws.send("Hi!");
  }
}

export = new ControlMock(9000, 9001);
