## Video converter API

#### Deployment:

```
$ mvn spring-boot:run
```

#### Requirements:

  - App should run on server where `ffmpeg` util is installed.

#### Usage:

Purpose of this micro service is to convert video stream `h264` format into `mp4` file.
Service exposes only one rest endpoint for video conversion:

  `/video/mp4` - accepts `h264` format video binary as body
    
`curl` command to test this endpoint:

```
$ curl --request POST --data-binary "@/tmp/video.h264" --header "Content-Type:application/octet-stream" http://localhost:9000/video/mp4 > video.mp4
$ vlc video.mp4
```

Under the hood this app calls os `ffmpeg` util. Using this command:

```
$ ffmpeg -i pipe:0 -loglevel error -vcodec h264 -y /tmp/dest-file-name.mp4
```
