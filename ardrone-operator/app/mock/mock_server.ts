var WebSocket = require('ws');
import * as express from 'express';
import { Server } from 'http';
import { OperatorState } from '../server/models/operator_state';
import { MockApi } from './mock_api'

class Operator {
  clientId: string;
  connection: any;
  lastPing: Date;
}

class ControlMock {
  private wsServer: any;
  private httpServer: Server;
  private mockApi = new MockApi();
  private connections: Map<string, Operator> = new Map<string, Operator>();

  constructor(httpPort: number) {
    //HTTP
    let expressApp = express();

    expressApp.post('/rest/operators', (req, res) => {
      res.json(this.mockApi.initializeOperator());
    });

    const httpServer = expressApp.listen(httpPort, "localhost", () => {
       const {address, port} = httpServer.address();
       console.log(`Mock Listening http on http://localhost: ${port}`);
    });
    this.httpServer = httpServer;


    //WS
    this.wsServer = new WebSocket.Server({server: this.httpServer, path: '/ws/api'});
    this.wsServer.on('connection', this.handleConnecion);
    console.log(`Mock listening ws on ${httpPort}`);
  }

  handleConnecion(ws) {
    console.log("New connection");

    ws.on('message', (message) => console.log(message));
    ws.send("Hi!");
  }
}

export = new ControlMock(9000);
