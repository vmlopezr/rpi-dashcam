#!/bin/bash
# Script for building default arm docker files.
# The docker images built with this are intended to run on Raspberry Pi 3b-4b

# Non-Arm architectures:
#       To build/run images on non-arm arch systems, 'qemu-arm-static'
#       needs to be available.
#       Please see: https://www.stereolabs.com/docs/docker/building-arm-container-on-x86/ for information.
#
# Arm architectures:
#       To build/run images on arm architectures, remove all the lines containing 'qemu-arm-static'.

read -r -p "Enter the name of the docker image: " DOCKERIMAGE
cp /usr/bin/qemu-arm-static "$(pwd)"

DOCKERFILE="FROM arm32v7/debian:buster-slim
COPY qemu-arm-static /usr/bin/qemu-arm-static
WORKDIR /usr/src/app
CMD [\"/bin/bash\"]
"
echo "$DOCKERFILE" > Dockerfile

# NOTE: If running on an Raspberry Pi: '--device-cgroup-rule='c 81:* rmw' allows
#       the docker image to access devices with "major device number" 81.
#       This will make the camera's accessible.
#
# For gstreamer: The hardware encoder elements are only available if hardware encoder/decoders are available.
#                Thus /dev/video10-/dev/video12 need be accessed on the docker image.

echo "buildimg:" > Makefile
echo "	docker build -t $DOCKERIMAGE ." >> Makefile
echo >> Makefile
echo "runimgdefault:" >> Makefile
echo "	docker run -it -v /usr/bin/qemu-arm-static:/usr/bin/qemu-arm-static $DOCKERIMAGE" >> Makefile
echo >> Makefile
echo "runimgbash:" >> Makefile
echo "	docker run -it --device-cgroup-rule='c 81:* rmw' -v /dev:/dev -v /usr/bin/qemu-arm-static:/usr/bin/qemu-arm-static $DOCKERIMAGE" >> Makefile
echo >> Makefile
echo "runimgvolroot:" >> Makefile
echo $"	docker run -it --device-cgroup-rule='c 81:* rmw'-v /dev:/dev -v /usr/bin/qemu-arm-static:/usr/bin/qemu-arm-static -v `pwd`:/usr/src/app/home:Z $DOCKERIMAGE" >> Makefile
echo >> Makefile
echo "exportimg:" >> Makefile
echo "	docker save $DOCKERIMAGE > $DOCKERIMAGE.tar" >> Makefile
echo >> Makefile
echo "loadimg:" >> Makefile
echo "	docker load -i $DOCKERIMAGE.tar" >> Makefile
