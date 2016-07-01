## Ardrone operetor mock

#### Deployment:

```
$ mvn spring-boot:run
```

#### Usage:

  - Open browser under port: 8081
  - Enter control application hostname:port.
    - Hostname should be valid ip address like: 192.10.10.50:8080
  - Enter token
  - Enter delay in seconds. It shows how many time data is streamed to control app. If delay is 0 random delay between 1 - 60 seconds will be picked up.

Then mock will call control application. This includes:
  - Missions retrieval from `/api/missions`
  - Subimt mission execution result after delay to `/api/missions/{missionId}/data`
  - Stream mock drone state to `/ws/api/{token}` webSocket
  - Stream mock drone video to `/ws/video/{token}` websocket
