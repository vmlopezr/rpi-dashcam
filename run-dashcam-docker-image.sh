#!/bin/bash
docker run -it --rm --name rpi-dashcam --device-cgroup-rule='c 81:* rmw' \
    -e TIMEZONE="America/Chicago" \
    -p 50000:50000 \
    -p 50003:50003  \
    -v /dev:/dev \
    -v `pwd`/data:/usr/src/app/data:Z \
    vmlopezr/rpi-cam-gstreamer:latest && sudo shutdown -h now
