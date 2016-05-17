var WebSocket = require('ws');
import * as express from 'express';
import { Server } from 'http';
import { OperatorState } from '../server/models/operator_state';
import { MockApi } from './mock_api'

class Operator {

  constructor(public connection: any, public lastPing: Date) {}
}

const PING_INTERVAL = 5000;

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
    this.wsServer.on('connection', this.handleConnecion());
    console.log(`Mock listening ws on ${httpPort}`);
  }

  private handleConnecion() {
    return (client) => {
      console.log("Connected :", client.upgradeReq.url)
      let operatorId = this.extractOperatorId(client);
      client.on('message', (message) => this.mockApi.onDroneStateUpdate(operatorId, message));
      this.connections.set(operatorId, new Operator(client, new Date()));
      this.handleHeartbeat(client);
    }
  }

  private handleHeartbeat(ws) {
    ws.addEventListener('pong', (data, flags) => {
      let clientId = this.extractOperatorId(ws);
      let operator = this.connections.get(clientId);
      console.log(`${operator.lastPing}`)
      if (operator) {
          operator.lastPing = new Date();
      }
    });

    setInterval(() => ws.ping("Are you alive?"), PING_INTERVAL);
  }

  private extractOperatorId(ws): string {
    let urlParts: string[] = ws.upgradeReq.url.split("/")
    return urlParts[urlParts.length - 1]
  }
}

export = new ControlMock(9000);
