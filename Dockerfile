FROM arm32v7/node:13.14.0-buster-slim as development
# Uncomment the line below if building on x86
# COPY qemu-arm-static /usr/bin/qemu-arm-static
WORKDIR /usr/src/app
COPY package.json ./
COPY tsconfig*.json ./
RUN apt-get update && apt-get install build-essential python python3 make -y
RUN npm install

COPY src /usr/src/app/src
RUN npm run build

RUN npm prune --production

FROM arm32v7/node:13.14.0-buster-slim
WORKDIR /usr/src/app

COPY --from=development /usr/src/app/build /usr/src/app/build
COPY --from=development /usr/src/app/node_modules /usr/src/app/node_modules

RUN apt-get update && apt-get upgrade -y \
    && apt-get -y install --no-install-recommends libgstreamer1.0-0 \
    gstreamer1.0-plugins-base \
    gstreamer1.0-plugins-good \
    gstreamer1.0-plugins-bad \
    gstreamer1.0-tools \
    gstreamer1.0-dev \
    python3-gi \
    python3 \
    gstreamer1.0-x \
    v4l-utils && rm -rf /var/cache/apt/* && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY www /usr/src/app/www
COPY python /usr/src/app/python

ENV NODE_ENV=production
EXPOSE 50000
EXPOSE 50003

CMD ["node", "build/main.js"]