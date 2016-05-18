import * as express from 'express';
import { Operator } from './operator'

const app = express();

app.use(express.static('app/client')); //Htmls
app.use(express.static('build/client')); //Javascripts

let operator = new Operator();

app.get('/api/connect', (req, res, next) => {
  operator.connect((body) => res.json(body))
});

const server = app.listen(8000, "localhost", () => {

 const {address, port} = server.address();
 console.log('Listening on http://localhost:' + port);
});
