var WebSocket = require('ws');
import * as express from 'express';
import { Operator } from './operator'
import { Configuration } from '../config'
import { Constants } from './constants'
var bodyParser = require('body-parser')

const WS_CONTROL_PATTERN = new RegExp("/ws/api$")
const WS_VIDEO_PATTERN = new RegExp("/ws/video$")

class Server {

  private operator: Operator

  init() {
    const app = express();

    app.use(express.static('app/client')); //Htmls
    app.use(express.static('build/client')); //Javascripts
    app.use('/node_modules', express.static('node_modules'))
    app.use('/mock/dronestream-client-custom', express.static('app/mock/dronestream-client-custom'))
    app.use(bodyParser.json())

    //TODO get this from config or smth
    this.operator = new Operator(Configuration.operatorToken);

    app.get('/api/connect/drone', (req, res, next) => {
      this.operator.droneConnect();
      res.json({ status: "ok"})
    });

    app.get('/api/connect/control', (req, res, next) => {
      this.operator.connectExternalControl((body) => res.json(body))
    });

    app.post('/api/mission', (req, res, next) => {
      this.operator.executeMission(req.body, !req.query.noReservation, (err, missionState) => {
        if (err) {
          console.log(err);
          next(err);
        } else {
          res.json(missionState);
        }
      });
    });

    const server = app.listen(Configuration.serverPort, "localhost", () => {

      const {address, port} = server.address();
      console.log(`Operator HTTP server listening on ${address}:${port}`);
    });

    //WS
    const wsServer = new WebSocket.Server({server: server});
    wsServer.on('connection', this.handleConnecion());
    console.log(`Operator WS listening on ws://localhost:${Configuration.serverPort}`);
  }

  handleConnecion() {
    return (client) => {
      let reqUrl = client.upgradeReq.url;
      console.log("Connected operator socket:", reqUrl)
      if (WS_CONTROL_PATTERN.test(reqUrl)) {
        this.operator.connectInternalControlSocket(client)
      } else if (WS_VIDEO_PATTERN.test(reqUrl)) {
        this.operator.connectInternalControlVideoSocket(client)
      } else {
        throw new Error(`Unmatched socket url ${reqUrl}`)
      }
    }
  }
}

new Server().init()
