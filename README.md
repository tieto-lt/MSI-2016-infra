# MSI-2016-infra repo

Repository for MSI-2016 infrastructure.

## Content

### ardrone-operator

Operator app written in typescript:

  - integrates with ar-drone 
  - sends drone state and video to control app via web socket
  - retrieves missions from control app and executes them
  - provides UI to test drone 


### ardrone-operator-mock

ar-drone operator mock. It acts like ar-drone-operator except it isn't connected to actual drone.
Mock provides UI where user can send mock data for particular host.

### video-converter

App provides single endpoint to convert video stream in `h264` format to `mp4` video

### MSI-2016-java-skeleton

MSI-2016 starter app a.k.a. control app.
