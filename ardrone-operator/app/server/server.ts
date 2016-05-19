var WebSocket = require('ws');
import * as express from 'express';
import { Operator } from './operator'
import { Constants } from './constants'

const WS_CONTROL_PATTERN = new RegExp("/ws/control$")
const WS_VIDEO_PATTERN = new RegExp("/ws/video$")

class Server {

  private operator: Operator

  init() {
    const app = express();

    app.use(express.static('app/client')); //Htmls
    app.use(express.static('build/client')); //Javascripts

    this.operator = new Operator();

    app.get('/api/connect', (req, res, next) => {
      this.operator.connectExternalControl((body) => res.json(body))
    });

    const server = app.listen(Constants.SERVER_PORT, "localhost", () => {

     const {address, port} = server.address();
     console.log(`Operator HTTP server listening on ${address}:${port}`);
    });

    //WS
    const wsServer = new WebSocket.Server({server: server});
    wsServer.on('connection', this.handleConnecion());
    console.log(`Operator WS listening on ws://localhost:${Constants.SERVER_PORT}`);
  }

  handleConnecion() {
    return (client) => {
      let reqUrl = client.upgradeReq.url;
      console.log("Connected operator socket:", reqUrl)
      if (WS_CONTROL_PATTERN.test(reqUrl)) {
        this.operator.connectInternalControlSocket(client)
      } else if (WS_VIDEO_PATTERN.test(reqUrl)) {
        this.operator.connectInternalControlVideoSocket(client)
      }
    }
  }
}

new Server().init()
