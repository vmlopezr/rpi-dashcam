# RPI Webcam Interface

<p style="text-align:justify">The project uses USB Webcams with Raspberry Pi 3b+
  and Raspberry Pi 4 to record and stream over a Raspberry Pi access point. The project 
  has been developed using Raspbian images (both desktop and lite).</p>
<p style="text-align:justify">The application serves a static website that allows control of the USB Webcam. The
Raspberry Pi is configured as an Access Point, so devices must be connected to the network.
Recorded videos can be watched as well as downloaded onto your devices.

Supported webcams
can also be streamed to allow users to see the live feed while adjusting webcam settings.
There is initial support for Logitech C920 and Microsoft LifeCam HD3000.
The application should be able to record with v4l2-compatible webcams.

The live video streaming with camera settings is only supported for the Logitect C920 and Microsoft LifeCam HD3000. The camera settings are disabled for other cameras, although the stream will be available. </p>

<p style="text-align:justify">The current the repository contains the backend server using nestJS. 
Before running the server, the static files for the page must be unzipped 
in the main repository. </p>

The Application establishes the Raspberry Pi as a wireless Access Point.

- Network SSID: **_RPI_Webcam_View_**
- Password: **_rpiCamView_**

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

Before running the installation script "setup.sh", verify that i2c is enabled in the Raspberry Pi.
This can be done with the following:

```bash
$ sudo raspi-config
```

## Installing / Getting Started

The web application can be run directly on the host Raspberry Pi, or run using a docker image. See the
[Docker](#Docker) section for more information on using docker with this project.

To install the necessary dependencies, run the following script:

```bash
$ sudo sh install.sh
```

The script installs gstreamer, v4l2-utils, dnsmasq, hostapt, i2c-tools, ntpdate as well as the [Real-Time Clock](#Real-Time-Clock).

The Raspberry Pi is set up as a Wifi Access Point. A minimal DNS server is ran using dnsmasq, and iptables is set
to redirect http traffic on the wireless AP to the application.

## Building

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
- yarn runApp
- npm run runApp

### Running via the Docker image

The application can be started by either using the Makefile listed in the repository, or using the available shell scripts:

- run-dashcam.sh : The script will start the docker image.  
  **Note:** When the Docker image finishes running, the next command will shutdown the Raspberry Pi. This script is intended for use as a dashcam.
- run-webcam-view.sh: The script will start the docker image. However, the Raspberry Pi will not shutdown when the Docker image finishes running.
- Makefile:
  - `make runimgvolroot`: The Docker image will run and deploy the application. The Raspberry Pi will stay on upon image finish.
  - `make runimgbash`: The Docker image will start the image bash. The user may access the image filesystem.

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

- Network SSID: **_RPI-Webcam-Viewer_**
- Password: **_rpiCamView_**

To change the network SSID and password, update the following settings near the end of the script ["AP-install.sh"](./install-scripts/AP-install.sh).

```
ssid=RPI-Webcam-Viewer
wpa_passphrase=rpiCamView
```

## Docker

The project can also be installed as a docker image. To pull the image from Docker Hub, use the following tag:

```
vmlopezr/rpi-cam:gstreamer
```

The Docker image can also be built using the Dockerfile provided in the repository.

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

## Developing

The project is written in Typescript and transpiled to Javascript. The build files are located in the build folder. This repository covers the back-end server using nestJS. The static files for the front-end are located in the _static-website.zip_

The Front End repository can be found at https://github.com/vmlopezr/Dash_Cam_App.

To start the back-end nestJS server in development run either of the following:

```
yarn startTS

npm run startTS
```

### Uninstalling

To remove the application, first run the [uninstall.sh](./install-scripts/uninstall.sh) in the install-scripts folder.

```
sh uninstall.sh
```

After the script completes, erase the repository.

## License

Nest is [MIT licensed](LICENSE).  
Gstreamer is [LGPL licensed](./python/LICENSE)
