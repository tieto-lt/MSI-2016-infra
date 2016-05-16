var arDrone = require('ar-drone');
var client = arDrone.createClient({ip: "192.168.16.1"});

client.takeoff();

client
  .after(10000, function() {
    this.stop();
    this.land();
  });
