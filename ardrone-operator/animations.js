var arDrone = require('ar-drone');
var client  = arDrone.createClient();

client.takeoff();

client
  .after(1000, function() {
    client.animate('phiM30Deg', 2000);
  })
  .after(2500, function() {
    client.animate('phi30Deg', 2000);
  })
  .after(2500, function() {
    client.animate('thetaM30Deg', 2000);
  })
  .after(2500, function() {
    client.animate('theta30Deg', 2000);
  })
  .after(2500, function() {
    client.animate('theta20degYaw200deg', 2000);
  })
  .after(2500, function() {
    client.animate('theta20degYawM200deg', 2000);
  })
  .after(2500, function() {
    client.animate('turnaround', 2000);
  })
  .after(2500, function() {
    client.animate('turnaroundGodown', 2000);
  })
  .after(2500, function() {
    client.animate('yawShake', 2000);
  })
  .after(2500, function() {
    client.animate('doublePhiThetaMixed', 2000);
  })
  .after(3000, function() {
    this.stop();
    this.land();
  });
