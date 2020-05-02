FROM arm32v7/node:13-buster-slim as development
# Uncomment the line below if building on x86
# COPY qemu-arm-static /usr/bin/qemu-arm-static
WORKDIR /usr/src/app
COPY package.json ./
COPY tsconfig*.json ./
RUN yarn install --network-timeout 1000000

COPY src /usr/src/app/src
RUN yarn build
COPY www /usr/src/app/www

FROM arm32v7/node:13-buster-slim as production
#RUN npm install -g yarn
WORKDIR /usr/src/app
COPY package.json /usr/src/app/package.json
RUN yarn install --production --network-timeout 1000000

FROM arm32v7/node:13-buster-slim
WORKDIR /usr/src/app
COPY --from=development /usr/src/app/build ./
COPY --from=development /usr/src/app/www ./
COPY --from=production /usr/src/app/node_modules ./

RUN apt-get update && apt-get upgrade -y \ 
    && apt-get -y install --no-install-recommends libgstreamer1.0-0 \
    gstreamer1.0-plugins-base \
    gstreamer1.0-plugins-good \
    gstreamer1.0-plugins-bad \
    gstreamer1.0-tools \
    gstreamer1.0-dev \
    python3-gi \
    libgirepository1.0-dev \
    gstreamer1.0-x \
    v4l-utils \
    python

COPY python /usr/src/app/python
#COPY --from=development /usr/src/app/build /usr/src/app/build
#COPY --from=development /usr/src/app/www /usr/src/app/www

EXPOSE 50000
EXPOSE 50003

CMD ["/bin/bash"]