var WebSocket = require('ws');
import * as express from 'express';
import { Server } from 'http';
import { OperatorState } from '../server/models/operator_state';
import { Command, Move, CommandType } from '../server/models/commands';
import { MockApi } from './mock_api';
import { OperatorsManager } from './operators_manager'


const WS_API_PATTERN = new RegExp("/ws/api/.*$")
const WS_VIDEO_PATTERN = new RegExp("/ws/video/.*$")

class ControlMock {
  private wsServer: any
  private httpServer: Server
  private mockApi = new MockApi()

  constructor(private operatorsManager: OperatorsManager, httpPort: number) {
    //HTTP
    let expressApp = express();

    expressApp.post('/rest/operators', (req, res) => {
      let operatorState = this.mockApi.initializeOperator()
      operatorsManager.registerOperator(operatorState.id)
      res.json(operatorState);
    });
    expressApp.use(express.static('app/mock')); //Htmls
    expressApp.use(express.static('build/mock')); //Javascripts
    expressApp.use('/node_modules', express.static('node_modules'))

    expressApp.post('/rest/operators/:operatorId/:operation', (req, res) => {
       let operatorId = req.params.operatorId;
       let operation = req.params.operation;
       let connection = this.operatorsManager.getConnection(operatorId);
       console.log('rest send')
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
      let reqUrl = client.upgradeReq.url;
      console.log("Connected :", reqUrl)
      let operatorId = this.extractOperatorId(client);
      if (WS_API_PATTERN.test(reqUrl)) {
        this.operatorsManager.registerConnection(this.extractOperatorId(client), client);
        client.on('message', (message) => this.mockApi.onDroneStateUpdate(operatorId, JSON.parse(message)));
      } else if (WS_VIDEO_PATTERN.test(reqUrl)) {
        client.on('message', (message) => {
          this.mockApi.onVideoFrame(operatorId, message)
          this.wsServer.clients
            .filter(c => c.upgradeReq.url.endsWith('/ws/client/video/' + operatorId))
            .forEach(videoClient => videoClient.send(message, {binary: true}));
        });
      }
    }
  }

  private extractOperatorId(ws): string {
    let urlParts: string[] = ws.upgradeReq.url.split("/")
    return urlParts[urlParts.length - 1]
  }
}

export = new ControlMock(new OperatorsManager(), 9000);
