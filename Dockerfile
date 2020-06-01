FROM arm32v7/node:13.14.0-buster-slim as development
# Uncomment the line below if building on x86
# COPY qemu-arm-static /usr/bin/qemu-arm-static
WORKDIR /usr/src/app
COPY package.json ./
COPY tsconfig*.json ./

# Include static files for application
RUN apt-get update && apt-get install build-essential python python3 make -y

# Create node_modules
RUN npm install

# Get source files
COPY src /usr/src/app/src
RUN npm run build
RUN npm prune --production

# Start new image
FROM arm32v7/node:13.14.0-buster-slim
WORKDIR /usr/src/app

# Retrieve files from development image
COPY --from=development /usr/src/app/build /usr/src/app/build
COPY --from=development /usr/src/app/node_modules /usr/src/app/node_modules

# Install required software for gstreamer
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

# Remove typescript files
RUN rm node_modules/**/*.ts

# Add files that are accessed by nestjs server
COPY www /usr/src/app/www 
COPY python /usr/src/app/python
COPY internal-docker-image-script.sh /usr/src/app/

# Make script executable (Used to update timezone and run server)
RUN chmod +x internal-docker-image-script.sh

# Set default timezone if not overwritten during run command
ENV TIMEZONE="America/Chicago"
EXPOSE 50000
EXPOSE 50003

CMD sh /usr/src/app/internal-docker-image-script.sh "$TIMEZONE"