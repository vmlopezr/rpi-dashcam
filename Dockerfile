FROM arm32v7/node:12-buster-slim as base
# Uncomment the line below if building on x86
#COPY qemu-arm-static /usr/bin/qemu-arm-static
RUN apt-get update && apt-get upgrade -y \ 
    && apt-get -y install --no-install-recommends libgstreamer1.0-0 \
    gstreamer1.0-plugins-base \
    gstreamer1.0-plugins-good \
    gstreamer1.0-plugins-bad \
    gstreamer1.0-tools \
    gstreamer1.0-dev \
    python3-gi \
    libgirepository1.0-dev
WORKDIR /usr/src/app
COPY package.json /usr/src/app/package.json
COPY src /usr/src/app/src
RUN npm install
RUN npm run build

RUN mkdir /usr/src/app/data
COPY www /usr/src/app/www
COPY python /usr/src/app/python

EXPOSE 50000
EXPOSE 50003

CMD ["/bin/bash"]
