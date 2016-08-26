var arDrone = require('ar-drone');
var client  = arDrone.createClient();

client.takeoff();

client
  .after(5000, function() {
    this.up(0.5);
  })
  .after(3000, function() {
    this.stop();
    this.animate("flipLeft", 15);
  })
  .after(8000, function() {
    this.stop();
    this.land();
  });
