# RPI Webcam Interface

The project uses USB Webcams with Raspberry Pi 3b+
and Raspberry Pi 4 to record and stream over a Raspberry Pi access point. The project
has been developed using Raspbian images (both desktop and lite).
The application serves a static website that allows control of the USB Webcam. The
Raspberry Pi is configured as an Access Point, so devices must be connected to the network.
Recorded videos can be watched as well as downloaded onto your devices.

Supported webcams
can also be streamed to allow users to see the live feed while adjusting webcam settings.
There is initial support for Logitech C920 and Microsoft LifeCam HD3000.
The application should be able to record with v4l2-compatible webcams.

The live video streaming with camera settings is only supported for the Logitect C920 and Microsoft LifeCam HD3000. The camera settings are disabled for other cameras, although the stream will be available.

The current the repository contains the backend server using nestJS.
Before running the server, the static files for the page must be unzipped
in the main repository.

The Application establishes the Raspberry Pi as a wireless Access Point.

- Network SSID: **_RPI_Webcam_Viewer_**
- Password: **_rpiCamView_**

# **Table of Contents**

- [Prerequisites](#Prerequisites)
- [Install / Getting Started](#Install-/-Getting-Started)
  - [Installs required for Docker image](#Installs-required-for-Docker-image)
  - [Full installation on Raspberry Pi](#Full-installation-on-Raspberry-Pi)
- [Building the node server](#Building-the-node-server)
- [Running the Application](#Running-the-Application)
  - [Running on the host](#Running-on-the-host)
  - [Running via the Docker image](#Running-via-the-Docker-image)
  - [Accessing the Recordings](#Accessing-the-Recordings)
- [Accessing the Application Website](#Accessing-the-Application-Website)
  - [Network Warning](#Network-Warning)
- [Docker](#Docker)
- [Real-Time Clock](#Real-Time-Clock)
- [Development](#Development)
  - [Uninstalling](#Uninstalling)
- [License](#License)

## Prerequisites

The project is developed with the following tools.

- Ionic Framework
- python3
- gstreamer
- sqlite3
- docker

Before using the install scripts, verify that the following are installed:

- Node Package Manager - yarn or npm
- Nodejs
- Python3

Before running the installation scripts, verify that i2c is enabled in the Raspberry Pi.

```bash
$ sudo raspi-config
```

To access the i2c settings enter the "Interfacing Options" menu of raspi-config.

## Install / Getting Started

The web application can be run directly on the host Raspberry Pi, or by using a docker image.  
See the [Docker](#Docker) section for more information on building the image, or pulling it from docker hub.

Before running either of the install scripts, run:

```
sudo apt-get update
```

### Installs required for Docker image

If using the docker image, the [network installation script](./rpi-network-install.sh) will still be required as it forwards http traffic to the
backend server port 50000. For this run:

```
sudo sh rpi-network-install.sh
```

**Why sudo?:** The install commands need sudo credentials to install the packages as well as update package configuration files for those packages. The script is intended to
set up the Raspberry Pi as a Wifi Access Point.
The script will:
0

- Install `v4l2-utils` - Used to interface with UVC webcams as well as update camera settings.
- Install `iptables-persistent` - Used to make the new iptables rules persistent.
- Extracts the static files for the website, located in `static-website.zip`, to the root folder.
- Update `/etc/dhcpcd.conf` to define the wireless interface as wlan0.
- Update `/etc/hosts` to add the wlan0 interface IP as "rpicam".
- Install `dnsmasq` - Used to set up a minimal DNS server as well as running dhcp. Updates configuration file `/etc/dnsmasq.conf` and saves the original as `/etc/dnsmasq.conf`.
- Update `/etc/resolv.conf` to set the DNS resolution addresses.
- Install `hostapd`- Used to set up the wireless Access Point. Writes `/etc/hostapd/hostapd.conf` to set the hostapd configuration.
- Updates `/etc/default/hostapd` to point the AP daemon to the hostapd configuration above.

- Set up the [Real-Time Clock](#Real-Time-Clock) configuration which:
  - Install `i2c-tools` - Used to set up GPIO access for the Real Time Clock.
  - Install `ntpdate` - Used to update date

Take a look at the script to make sure the above is in there.

### Full installation on Raspberry Pi

To install all the necessary dependencies into the Raspberry Pi, run the following script:

```bash
$ sudo sh install.sh
```

Like the previous script, the `install.sh` script will install the required network packages above, and additionally installs the gstreamer dependencies.

## Building the node server

The project contains a build script in package.json, use a package manager
to build the project files.

```shell
yarn build

npm run build
```

The build files are located in the build folder.

## Running the Application

### Running on the host

Once the [install.sh](./install.sh) script has been run and node_modules installed, use one of the following to run the application:

- node build/main.js
- yarn runProd
- npm run runProd

### Running via the Docker image

The application can be started by either using the Makefile listed in the repository, or using the available shell scripts:

- [run-dashcam-docker-image.sh](run-dashcam-docker-image.sh) : The script will start the docker image.  
  **Note:** When the Docker image finishes running, the next command will shutdown the Raspberry Pi. When using this application as a dashcam, schedule this script to run in the background on start up.

- [Makefile](./Makefile):

  - `make runimgvolroot`: The Docker image will run and deploy the application. The Raspberry Pi will stay on upon image finish.

  - `make runimgbash`: The Docker image will start the image bash. The user may access the image filesystem.

**ATTENTION:** Both of the scripts run the image with a default timezone of "America/Chicago". To
run with a different timezone, use the following to view available timezones on the Raspberry Pi:

```
ls /usr/share/zoneinfo
```

In the case of the default timezone, the Chicago timezone is located in the "America" directory. To use a different timezone, update the
`-e TIMEZONE="America/Chicago` option in the docker run commands located in either the [Makefile](./Makefile), or [run-dashcam-docker-image.sh](./run-dashcam-docker-image.sh)

### Accessing the Recordings

The recordings can be accessed in the [data/Recordings](./data/Recordings) directory of this repository.

## Accessing the Application Website

The Application establishes the Raspberry Pi as a wireless Access Point. To run the application use the start
script. **Note:** To access te application, the device needs to connect to the Raspberry Pi Access Point.

The application website can be reached on any browser using the following addresses:

- http://rpidashcam.pi
- Any http address with a domain of "pi", e.g:
  - http://testcam.pi
  - http://anyaddress.pi
  - http://a.pi, etc.
- Any IP address, e.g:
  - 192.168.10.2
  - 1.1.1.1
  - 2.2.2.2, etc.

Any IP address entered into the browser is redirected to the local application website.
Any http address using domain "pi" is redirected to the local application website.
The access Point information is shown below:

- Network SSID: **_RPI_Webcam_Viewer_**
- Password: **_rpiCamView_**

To change the network SSID and password, update the following settings near the end of the script ["AP-install.sh"](./install-scripts/AP-install.sh).

```
ssid=RPI-Webcam-Viewer
wpa_passphrase=rpiCamView
```

### Network Warning

The application does the following:

- The network install script, installs iptables rules to redirect all http traffic, `port 80` to the
  node server socket `192.168.10.1:50000`.
- Exposes `port 10000` for the node server to communicate with the python gstreamer process controlling the webcam.
- Exposes `port 50002` to stream the the webcam feed from the python gstreamer pipeline to the node server. [A visual of the pipeline](./data/GstreamerPipeline.png) can be seen here.
- Exposes `port 50003` to stream the webcam feed from the node server to the client.
- Gives the client access to view the videos written in the `data/Recordings` folder and to download them to host device.

This is originally intended to be used in a situation with no internet access, such as a car dashcam, and not exposed to internet. To remove the iptables rules used to redirect http traffic run:

```
sudo sh install-scripts/disable-iptable-rules.sh
```

**Note:** The ports that the client directly interacts with are `80, 50000, 50003`. Ports `10000, 50002` are used solely between the node process and python.

## Docker

The project can also be installed as a docker image. The docker hub website is:

https://hub.docker.com/r/vmlopezr/rpi-cam-gstreamer.

To pull the image from Docker Hub, use the following tag:

```
docker pull vmlopezr/rpi-cam-gstreamer

```

The Docker image can also be built using the Dockerfile provided in the repository. This can be done with:

```
make buildimg
```

**Attention:** The Docker image is intended for Raspberry Pi's (RPI3-RPI4b). The system architecture is arm, and will thus fail when built or ran on different architectures.

If building the image, it is suggested to build directly on the Raspberry Pi.

## Real-Time Clock

This project can be used as a dashcam. Due to the lack of internet connection in this use case, an Real-Time Clock is needed to track the time and date.

This project uses a ZS-042 RTC Module that uses a DS3132S RTC. This RTC Module uses I2C to communicate with the Raspberry Pi.

![Alt text](./data/GPIO-Pi4.png 'Raspberry Pi 4 Pins')
Circled in red above in the [Raspberry Pi 4 GPIO](https://www.element14.com/community/docs/DOC-92640/l/raspberry-pi-4-model-b-default-gpio-pinout-with-poe-header) image, are the pins used with the RTC.

The SDA pins must be both connected together as well as the SCL pins. Connect the ground of the RTC to the ground pin of the Raspberry Pi. For the VCC pin os the RTC use the 3.3V pin on the Raspberry Pi.

**WARNING:** Most RTC Modules use coin cells. It is important to verify whether the module has a charging line for the battery.

In the case of the ZS-042, the VCC line is connected to the battery via a resistor and diode. If the user plans to use a non-rechargeable battery, it is imperative to modify the module to disconnect the charging line.

- Remove either the resistor or diode connecting the VCC line to the battery.
- Cut the copper trace connecting the VCC line to the battery.

In either case, a multimeter can be used to verify the continuity between the VCC pin and the battery.

## Development

The project is written in Typescript and transpiled to Javascript. The build files are located in the build folder. This repository covers the back-end server using nestJS. The static files for the front-end are located in the _static-website.zip_

The Front End repository can be found at https://github.com/vmlopezr/Dash_Cam_App.

To start the back-end nestJS server in development run either of the following:

```
yarn startTS

npm run startTS
```

To start the front-end development server run either of the following:

```
Using Ionic CLI:
  $ ionic serve

Using npm:
  $ npm run start
```

Using ionic serve will start a development server at port localhost:8100.  
Using npm run start will start a development server at port localhost:4200.

**Note:** The application needs the back-end server to retrieve data saved on the sqlite db. Both the front-end and back-end development servers need to run concurrently.
When running on development, the frontend initiates the data retrieval via GET request to localhost.  
When running on production, it is expected for the application to run on a Raspberry Pi. As built on the repository, the initial data retrieval is made via GET request to 192.168.10.1, which is the address of the Raspberry Pi wlan0 interface after the Access Point install.

### Modifying Raspberry Pi wlan0 Interface IP Address

To change the IP address of the wlan0 interface for the application, there are two main modification that must be made:

1. Modify the chosen IP address found in [AP-install.sh](./install-scripts/AP-install.sh) under the **_dhcpcd.conf_** modifications.

```
# DHCPCD update
# Set wlan0 interface: static IP and subnet
WAN_INTERFACE="
interface wlan0
    static ip_address=192.168.10.1/24
    nohook wpa_supplicant"
```

2. On the [back-end server](https://github.com/vmlopezr/rpi-dashcam), the python script [dh-update.py](https://github.com/vmlopezr/rpi-dashcam/blob/master/python/db-update.py) can be used to update certain application settings. The following is the help message for the script:

```
 usage: db-update.py [-h] [-cam CAMERA] [-dev DEVICE] [-nport NODEPORT] [-ipaddr IPADDRESS] [-streamport TCPSTREAMPORT]
                    [-LiveStreamPort LIVESTREAMPORT] [-view]

optional arguments:
  -h, --help            This script is used to update the rpidashcam sqlite database. Enter the argument with the desired value to update it.

  -cam CAMERA, --camera CAMERA
                        The webcam model to be used with the application

  -dev DEVICE, --Device DEVICE
                        The linux device denoting the USB camera. Can be found in /dev/.
                        For webcams, this is usually listed as /dev/video*

  -nport NODEPORT, --NodePort NODEPORT
                        The port at which the back-end server will listen to.

  -ipaddr IPADDRESS, --IPAddress IPADDRESS
                        The IP Address of the host running the application.

  -streamport TCPSTREAMPORT, --TCPStreamPort TCPSTREAMPORT
                        The Port at which node listen to the TCP video feed from gstreamer.

  -LiveStreamPort LIVESTREAMPORT, --LiveStreamPort LIVESTREAMPORT
                        The Port at which socket.io listens to stream live camera feed to a webrowser.

  -view, --view         "View the current values of the application settings
```

Update the server IP address to the new address with the following:

```
python3 app-ipaddr-update.py -ipaddr "IP_ADDRESS"
```

where IP_ADDRESS is the intended address of the development host.

### Uninstalling

To remove the application, first run the [uninstall.sh](./install-scripts/uninstall.sh) in the install-scripts folder.

```
sh uninstall.sh
```

After the script completes, erase the repository.

## License

Nest is [MIT licensed](LICENSE).  
Gstreamer is [LGPL licensed](./python/LICENSE)
