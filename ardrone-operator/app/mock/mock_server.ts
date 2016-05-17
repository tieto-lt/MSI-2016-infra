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
  private wsServer: any
  private httpServer: Server
  private mockApi = new MockApi()
  private connections = new Map<string, Operator>();

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
    this.wsServer = new WebSocket.Server({server: this.httpServer});
    this.wsServer.on('connection', this.handleConnecion(this));
    console.log(`Mock listening ws on ${httpPort}`);
  }

  private handleConnecion(self) {
    return (client) => {
      console.log("Connected :", client.upgradeReq.url)
      let urlParts: string[] = client.upgradeReq.url.split("/")
      let operatorId: string = urlParts[urlParts.length - 1]
      client.on('message', (message) => self.mockApi.onDroneStateUpdate(operatorId, message));
    }
  }
}

export = new ControlMock(9000);
