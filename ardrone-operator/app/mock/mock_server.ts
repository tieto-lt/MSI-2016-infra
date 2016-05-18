var WebSocket = require('ws');
import * as express from 'express';
import { Server } from 'http';
import { OperatorState } from '../server/models/operator_state';
import { Command, Move, CommandType } from '../server/models/commands';
import { MockApi } from './mock_api';
import {OperatorsManager} from './operators_manager';



class ControlMock {
  private wsServer: any
  private httpServer: Server
  private mockApi = new MockApi()

  constructor(httpPort: number, private operatorsManager: OperatorsManager) {
    //HTTP
    let expressApp = express();

    expressApp.post('/rest/operators', (req, res) => {
      let operatorState = this.mockApi.initializeOperator()
      operatorsManager.registerOperator(operatorState.id)
      res.json(operatorState);
    });

    expressApp.post('/rest/operators/:operatorId/:operation', (req, res) => {
       let operatorId = req.params.operatorId;
       let operation = req.params.operation;
       let connection = this.operatorsManager.getConnection(operatorId);
       this.mockApi.sendCommand(operation, req.query, connection);
       res.sendStatus(200); // FIXME
    })

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
      this.operatorsManager.registerConnection(this.extractOperatorId(client), client);
      client.on('message', (message) => this.mockApi.onDroneStateUpdate(operatorId, message));
    }
  }

  private extractOperatorId(ws): string {
    let urlParts: string[] = ws.upgradeReq.url.split("/")
    return urlParts[urlParts.length - 1]
  }
}

export = new ControlMock(9000, new OperatorsManager());
