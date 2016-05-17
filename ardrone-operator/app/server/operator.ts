import arDrone = require('ar-drone');

export class Operator {

  private client: any;

  connect() {
    console.log('Connecting');
    this.client = arDrone.createClient();
    console.log(this.client, 'client zzz');
    this.client.on('navdata', console.log);
  }
}
