import * as express from 'express';
import { DummyModel } from './models/dummy';
import { Operator } from './operator'

const app = express(); // 1

let dm = new DummyModel()
dm.aField = "dummy value"
console.log('dm', dm);

app.use(express.static('app/client')); //Htmls
app.use(express.static('build/client')); //Javascripts

let operator = new Operator();

app.get('/api/connect/control', (req, res, next) => {
  operator.controlConnect((body) => res.json(body))
});

const server = app.listen(8000, "localhost", () => {

 const {address, port} = server.address();
 console.log('Listening on http://localhost:' + port);
});
