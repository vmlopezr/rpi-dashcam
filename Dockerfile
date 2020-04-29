FROM arm32v7/debian:buster-slim as base
COPY qemu-arm-static /usr/bin/qemu-arm-static
RUN apt-get update && apt-get upgrade -y \ 
    && apt-get -y install --no-install-recommends libgstreamer1.0-0 \
    gstreamer1.0-plugins-base \
    gstreamer1.0-plugins-good \
    gstreamer1.0-plugins-bad \
    gstreamer1.0-tools \
    gstreamer1.0-dev \
    python3-gi \
    libgirepository1.0-dev

RUN mkdir /usr/src/data
COPY build /usr/src/build
COPY www /usr/src/www
COPY python /usr/src/python

EXPOSE 50000

CMD ["/bin/bash"]
