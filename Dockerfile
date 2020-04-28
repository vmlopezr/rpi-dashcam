# To run image: docker run -it --device=/dev/video0 -v /projectpath/data:/usr/src/app/data gstreamer-docker bash
FROM node:13.13.0-buster-slim as base
WORKDIR /usr/src/rpicam
COPY ./build /usr/src/rpicam 
COPY ./WWW /usr/src/rpicam
COPY ./app-scripts /usr/src/rpicam
COPY ./package*.json /usr/src/rpicam
# COPY /usr/bin/node /usr/src/rpicam

# Note The current working dir has a directory fro host mounted.
# Compile the node modules here
RUN npm install --only=production
#CMD ["node" , "test.js"]

FROM debian:buster

WORKDIR /usr/src/app

COPY --from=base /usr/src/rpicam /usr/src/app
# NOTE: TO run this image we need to mount the data folder
# -v `pwd`/data:/usr/src/app/rpicam
# This way, the application can write the videos and images to filesystem

RUN apt-get update && apt install -y --no-install-recommends build-essential \
    libgstreamer1.0-0 \
    gstreamer1.0-plugins-base \
    gstreamer1.0-plugins-good \
    gstreamer1.0-plugins-bad \
    gstreamer1.0-plugins-ugly \
    gstreamer-1.0 \
    gstreamer1.0-dev \
    python3-gi \
    python-gst-1.0 \
    #gstreamer1.0-libav \
    #gstreamer1.0-doc \
    #gstreamer1.0-tools \
    #python3-gi-cairo \
    #libgirepository1.0-dev \
    #libcairo2-dev

EXPOSE 50000/tcp

RUN gst-inspect-1.0 | grep 264
#CMD ["node", "build/main.js"]
