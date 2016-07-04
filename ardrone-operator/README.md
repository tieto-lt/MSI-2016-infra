# Building

## Prerequisites

```
$ npm install -g typescript
$ npm install -g typings
```

## Installing
```
$ npm install

```

## Running
```
$ npm start
```

## Configuration

Configuration is stored in `app/config.ts` file. Before starting operator correct control url should be provided.

Config properites:
  - **serverPort** - port of ardrone-operator
  - **wsControlUrl** - control app websocket url.
  - **httpControlUrl** - control app http url
  - **operatorToken** - token issued from control app. Until not implemented in operator app `dummy` works fine.

# External Control Integration

## About

Operator can receive commands from external control source. External control host is configured using `config.ts/wsControlUrl` property.
All communication with external control is being done using Websockets. Control websockets get connected using "Control Connect" button in UI.

## HTTP

### Control app endpoints

Control application (the one which will be implemented during MSI-2016) should expose following endpoints to for operator:

 - `GET` `/api/missions` - should return list of available missions.
 - `POST` `/api/missions/{missionId}/reserve` - should reserve mission for this operator and make sure that no other operator will take it.
 - `POST` `/api/missions/{missionId}` - this is callback endpoint for mission completion when mission completed operator will post mission execution details.

### Payload examples

 - `GET` `/api/missions` endpoint should return following structure json:
 ```json
 {
   "missions": [
     {
       "missionId": "1-takeoff-land",
       "submittedBy": null,
       "state": null,
       "commands": [
         {
           "commandType": "takeoff",
           "args": null
         },
         {
           "commandType": "land",
           "args": null
         }
       ]
     },
     {
       "missionId": "2-picture",
       "submittedBy": null,
       "state": null,
       "commands": [
         {
           "commandType": "wait",
           "args": [1000]
         },
         {
           "commandType": "takePicture"
         }
       ]
     }
   ]
 }
 ```
 - `POST` `/api/missions/{missionId}/reserve` -  empty  request body. Should return reserved mission json:

 ```json
 {
   "missionId": "2-picture",
   "submittedBy": null,
   "state": null,
   "commands": [
     {
       "commandType": "wait",
       "args": [1000]
     },
     {
       "commandType": "takePicture"
     }
   ]
 }
 ```

 - `POST` `/api/missions/{missionId}` -  this endpoint received all mission data. Example payload availbale [here](https://raw.githubusercontent.com/tieto-lt/MSI-2016-infra/master/ardrone-operator-mock/src/main/resources/mission_data.json)

 It provides:
    - images taken during mission `images`
    - mission video `videoBase64`
    - drone navigation data during mission `navigationData`

More info about how mission should be constructed under [Mission Plan](##missionplan) section

### Operator workflow

Operator after startup fetches all available missions from control app. URL of control app is taken from `app/cofgig.ts`.
All available missions are shown in operator UI. When user select mission to run (presses Run button). Operator calls reservation
endpoint of control app and starts executing mission immediately after success callback. When mission is completed operator callbacks
control app with mission data. Example [here]
(https://raw.githubusercontent.com/tieto-lt/MSI-2016-infra/master/ardrone-operator-mock/src/main/resources/mission_data.json)

## Websockets

### Video socket /ws/video

- Full path: `CONTROL_HOSTNAME/ws/video/{operatorToken}`
- Payload type: Binary
- Inbound payloads: None. If you send some it will just be ignored
- Outbound payloads: Binary data that is of type H264 video stream

This is a real time video stream from the drone. It starts streaming when operator connects to drone and external control.
Keep in mind that first frame is a header from of H264 video so operator should first connect to external control and only then to drone if user wants to record the stream.

@TODO  We should fix that some day and somehow

### API socket /ws/api

- Full path: `CONTROL_HOSTNAME/ws/api/{operatorToken}`
- Payload type: JSON
- Inbound payloads: `DirectCommand`, `MissionPlan`
- Outbound payloads: `OperatorState`, `Image`

#### DirectCommand

Direct command is directly sent to drone in real time. Its primary use case is to control drone movement in real time. Most of commands do not take arguments. Movement commands needs speed specified.

Base command interface:

```
{
  "payloadType": "DirectCommand",
  "commandType": "command name from list below",
  "speed": "optional speed value"
}
```

- **stop** - stops the drone and leaves it hovering in place
- **takeoff** - starts flying
- **land** - lands the drone on the ground not matter what
- movements commands:
  - **up, down, front, back, left, right, clockwise, counterClockwise**
  - **speed** - speed at which command should be executed in interval of [0-1]
  ```
  {
    "payloadType": "DirectCommand",
    "commandType": "up",
    "speed": 0.8
  }
  ```
- Camera commands switch the channel. 2 cammeras are supported - horizontal and vertical.
  Only single camera can be streamed at once.
  - **horizontalCamera** - camera that sees at the fron of the drone
  - **verticalCamera** - vertical that sees the ground above which the drone is flying
- **disableEmergency** - allows to recover after crash (when all leds are red)
- **calibrate** - calibrates drone sensors. This should be done after each crash and before any major flight. Especially if you want to execute missions. It seems that calibration helps mission commands to be more accurate
- **takePicture** - sends picture over the API socket. Refer to `Image` payload documentation

#### MissionPlan

When operator received mission plan payload over websocket it starts executing mission. Mission plan is an array of mission commands. Mission plan api is just a wrapper over [ardrone-autonomy](https://github.com/eschnou/ardrone-autonomy) library. So all the commands that are supported by this library are available at your disposal. Mission plan example:
```
{
  payloadType: "MissionPlan"
  commands: [
    {
        "commandType" : "takeoff"
    },
    {
        "commandType" : "forward",
        "args": [1]
    },
    {
        "commandType" : "hover",
        "args": [3000]
    },
    {
        "commandType" : "takePicture"
    },
    {
        "commandType" : "backward",
        "args": [1]
    },
    {
        "commandType": "land"
    }
  ]
}
```

As you can see `commandType` maps directly to the function name from ardrone-autonomy library and `args` is an array passed to that function.

Operator custom mission commands that are not present in ardrone-autonomy library
- **takePicture** - sends picture over the API socket. Refer to `Image` payload documentation. Keep in mind that picture lags for about 3 secs so you should take that into account when planning missions and hover in place for 3 secs before taking a picture.
- **switchHorizontalCamera** - switches to drone front camera. This camera is used by default.
- **switchVerticalCamera** - switches drone bottom camera on.

**NOTE:** we cannot stream view from both cameras, so only on stream is available. Although we can switch cameras, but delay time should be considered. So to make it work correctly you should send wait command for around 1 s. between switching camera and taking picture.


#### OperatorState

Pushed current state of the operator. State includes custom operator state variables, mission state, drone state.

- **externalControlState** - indicates if operator is connected to external control API and VIDEO sockets
- **isDroneReady** - indicates if operator is connector to drone
- **missionState**
  - **isMissionInProgress** - if drone is doing a mission
  - drone coordinates in internal drone mission map
- **droneState** - internal state produced by drone. More details can be found at [SDK](http://web.mit.edu/tinali/www/ARDrone_Developer_Guide.pdf)

Example of whole state json:

```
{
  "payloadType": "OperatorState",
  "state": "Initialized",
  "operatorToken": "dummy",
  "externalControlState": {
    "isControlUp": false,
    "isVideoUp": false
  },
  "isDroneReady": true,
  "missionState": {
    "x": -0.058372878566245415,
    "y": -0.07135141400402877,
    "yaw": -2.8598092458553017,
    "z": 0,
    "vx": 0,
    "vy": 0,
    "isMissionInProgress": false
  },
  "droneState": {
    "header": 1432778632,
    "droneState": {
      "flying": 0,
      "videoEnabled": 0,
      "visionEnabled": 1,
      "controlAlgorithm": 0,
      "altitudeControlAlgorithm": 1,
      "startButtonState": 0,
      "controlCommandAck": 0,
      "cameraReady": 1,
      "travellingEnabled": 0,
      "usbReady": 0,
      "navdataDemo": 1,
      "navdataBootstrap": 0,
      "motorProblem": 0,
      "communicationLost": 0,
      "softwareFault": 0,
      "lowBattery": 0,
      "userEmergencyLanding": 0,
      "timerElapsed": 1,
      "MagnometerNeedsCalibration": 0,
      "anglesOutOfRange": 1,
      "tooMuchWind": 0,
      "ultrasonicSensorDeaf": 0,
      "cutoutDetected": 0,
      "picVersionNumberOk": 1,
      "atCodecThreadOn": 1,
      "navdataThreadOn": 1,
      "videoThreadOn": 1,
      "acquisitionThreadOn": 1,
      "controlWatchdogDelay": 0,
      "adcWatchdogDelay": 0,
      "comWatchdogProblem": 0,
      "emergencyLanding": 1
    },
    "sequenceNumber": 139821,
    "visionFlag": 0,
    "demo": {
      "controlState": "CTRL_DEFAULT",
      "flyState": "FLYING_OK",
      "batteryPercentage": 41,
      "rotation": {
        "frontBack": -0.976,
        "pitch": -0.976,
        "theta": -0.976,
        "y": -0.976,
        "leftRight": -0.735,
        "roll": -0.735,
        "phi": -0.735,
        "x": -0.735,
        "clockwise": -11.052,
        "yaw": -11.052,
        "psi": -11.052,
        "z": -11.052
      },
      "frontBackDegrees": -0.976,
      "leftRightDegrees": -0.735,
      "clockwiseDegrees": -11.052,
      "altitude": 0,
      "altitudeMeters": 0,
      "velocity": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "xVelocity": 0,
      "yVelocity": 0,
      "zVelocity": 0,
      "frameIndex": 0,
      "detection": {
        "camera": {
          "rotation": {
            "m11": 0,
            "m12": 0,
            "m13": 0,
            "m21": 0,
            "m22": 0,
            "m23": 0,
            "m31": 0,
            "m32": 0,
            "m33": 0
          },
          "translation": {
            "x": 0,
            "y": 0,
            "z": 0
          },
          "type": 12
        },
        "tagIndex": 0
      },
      "drone": {
        "camera": {
          "rotation": {
            "m11": -0.7686343789100647,
            "m12": -0.6396697759628296,
            "m13": 0.004889574367552996,
            "m21": 0.6394616365432739,
            "m22": -0.7685428857803345,
            "m23": -0.02075640857219696,
            "m31": 0.017035095021128654,
            "m32": -0.012827392667531967,
            "m33": 0.9997726082801819
          },
          "translation": {
            "x": -2.6377968788146973,
            "y": -0.16831019520759583,
            "z": 0
          }
        }
      }
    },
    "visionDetect": {
      "nbDetected": 0,
      "type": [
        0,
        0,
        0,
        0
      ],
      "xc": [
        0,
        0,
        0,
        0
      ],
      "yc": [
        0,
        0,
        0,
        0
      ],
      "width": [
        0,
        0,
        0,
        0
      ],
      "height": [
        0,
        0,
        0,
        0
      ],
      "dist": [
        0,
        0,
        0,
        0
      ],
      "orientationAngle": [
        0,
        0,
        0,
        0
      ],
      "rotation": [
        {
          "m11": 0,
          "m12": 0,
          "m13": 0,
          "m21": 0,
          "m22": 0,
          "m23": 0,
          "m31": 0,
          "m32": 0,
          "m33": 0
        },
        {
          "m11": 0,
          "m12": 0,
          "m13": 0,
          "m21": 0,
          "m22": 0,
          "m23": 0,
          "m31": 0,
          "m32": 0,
          "m33": 0
        },
        {
          "m11": 0,
          "m12": 0,
          "m13": 0,
          "m21": 0,
          "m22": 0,
          "m23": 0,
          "m31": 0,
          "m32": 0,
          "m33": 0
        },
        {
          "m11": 0,
          "m12": 0,
          "m13": 0,
          "m21": 0,
          "m22": 0,
          "m23": 0,
          "m31": 0,
          "m32": 0,
          "m33": 0
        }
      ],
      "translation": [
        {
          "x": 0,
          "y": 0,
          "z": 0
        },
        {
          "x": 0,
          "y": 0,
          "z": 0
        },
        {
          "x": 0,
          "y": 0,
          "z": 0
        },
        {
          "x": 0,
          "y": 0,
          "z": 0
        }
      ],
      "cameraSource": [
        0,
        0,
        0,
        0
      ]
    },
    "magneto": {
      "mx": -37,
      "my": -73,
      "mz": -157,
      "raw": {
        "x": 252.36328125,
        "y": 127.4765625,
        "z": 562.9921875
      },
      "rectified": {
        "x": 62.7259521484375,
        "y": 35.400230407714844,
        "z": 562.9921875
      },
      "offset": {
        "x": 189.6373291015625,
        "y": 92.07633209228516,
        "z": 0
      },
      "heading": {
        "unwrapped": 165.9954376220703,
        "gyroUnwrapped": 0,
        "fusionUnwrapped": 348.9476623535156
      },
      "ok": 1,
      "state": 2,
      "radius": 135.7593536376953,
      "error": {
        "mean": -53.823020935058594,
        "variance": 109.375244140625
      }
    },
    "wifi": {
      "linkQuality": 1
    }
  }
}
```
#### Image

Image payload is sent when requested using `DirectCommand` `takePicture` or `MissionPlan` command `takePicture`.
Image is a PNG image which payload is encoded using Base64 encoding in order to be able to pass it as JSON:

```
{
  "payloadType": "Image",
  "imageBase64": "base64string",
}
```

It is quite easy to render base64 encoded image using ``<img>`` tag:
```
<img src="data:image/png;base64,${imageBase64}" alt="Latest taken picture" height="100px">
```

Or using Javascript and JQuery
```
$("#pngStream").attr("src", "data:image/png;base64,${imageBase64}");
```
