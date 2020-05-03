#!/bin/bash

docker run -it --rm --device-cgroup-rule='c 81:* rmw' \
    -p 50000:50000 \
    -p 50003:50003 \
    -v /dev:/dev   \
    -v `pwd`/data:/usr/src/app/data:Z \ 
    vmlopezr/rpi-cam:gstreamer
