import * as express from 'express';
import { DummyModel } from './models/dummy';
import { Operator } from './operator'

const app = express(); // 1

let dm = new DummyModel()
dm.aField = "dummy value"
console.log('dm', dm);

app.use(express.static('app/client')); //Htmls
app.use(express.static('build/client')); //Javascripts

new Operator().connect();
app.get('/api/', (req, res) => res.send('Hi'));

app.get('/api/products', (req, res) => res.send('Got a request for products'));

app.get('/api/reviews', (req, res) => res.send('Got a request for reviews'));

const server = app.listen(8000, "localhost", () => {

   const {address, port} = server.address();
   console.log('Listening on http://localhost:' + port);
});
