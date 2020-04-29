# RPI Webcam Interface

<p style="text-align:justify">The project uses USB Webcams with Raspberry Pi 3b+
  and Raspberry Pi 4 to record and stream over a raspberry pi access point. The project 
  has been developed using Raspbian images (both desktop and lite).</p>
<p style="text-align:justify">The application serves a static website that allows control of the USB Webcam. The
Raspberry Pi is configured as an Access Point, so devices must be connected to the network.
Recorded videos can be watched as well as downloaded onto your devices. Supported webcams
can also be streamed to allow users to see the live feed while adjusting webcam settings.
There is initial support for Logitech C920 and Microsoft LifeCam HD3000. 
The application should be able to record with v4l2-compatible webcams. 
The live video streaming is only supported for the C920 and HD3000, until 
settings for the cameras listed in the home page are tracked down and integrated. </p>

<p style="text-align:justify">The current the repository contains the backend server using nestJS. 
Before running the server, the static files for the page must be unzipped 
in the main repository. </p>

The Application establishes the Raspberry Pi as a wireless Access Point.

<ul>
  <li>Network SSID: RPIDASHCAM</li>
  <li>Password: rpiDashCam</li>
</ul>

## Installing / Getting Started

To install the necessary dependencies use the following:

```bash
$ sudo sh install-scripts/setup.sh
```

This will install gstreamer, v4l2-utils, dnsmasq, hostapt, i2c-tools and ntpdate.

The application website can be reached on any browser using the following addresses:

- http://rpidashcam.pi
- Any http address with a domain of "pi", e.g: http://testcam.pi, http://anyaddress.pi, http://a.pi, etc.
- Any IP address, e.g: 192.168.10.2, 1.1.1.1, 2.2.2.2, etc.

Any IP address entered into the browser is redirected to the local application website.
Any http address using domain "pi" is redirected to the local application website.

The Front End repository can be found at https://github.com/vmlopezr/Dash_Cam_App.

Before running the installation script "setup.sh", verify that i2c is enabled in the Raspberry Pi.
This can be done with the following:

```bash
$ sudo raspi-config
```

The Application establishes the Raspberry Pi as a wireless Access Point.

<ul>
  <li>Network SSID: RPIDASHCAM</li>
  <li>Password: rpiDashCam</li>
</ul>

## Developing

### Built With

- Ionic Framework
- python3
- gstreamer
- sqlite3

### Prerequisites

What is needed to set up the dev environment. For instance, global dependencies or any other tools. include download links.

### Setting up Dev

### Building

The project contains a build script in package.json, use a package manager to
to build the project files.

```shell
* yarn build
* npm run build
```

The typescript files will be transpiled to javascript files in the build folder.

### Running Application

## Configuration

Here you should write what are all of the configurations a user can enter when
using the project.

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[travis-image]: https://api.travis-ci.org/nestjs/nest.svg?branch=master
[travis-url]: https://travis-ci.org/nestjs/nest
[linux-image]: https://img.shields.io/travis/nestjs/nest/master.svg?label=linux
[linux-url]: https://travis-ci.org/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="blank">Node.js</a> framework for building efficient and scalable server-side applications, heavily inspired by <a href="https://angular.io" target="blank">Angular</a>.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/dm/@nestjs/core.svg" alt="NPM Downloads" /></a>
<a href="https://travis-ci.org/nestjs/nest"><img src="https://api.travis-ci.org/nestjs/nest.svg?branch=master" alt="Travis" /></a>
<a href="https://travis-ci.org/nestjs/nest"><img src="https://img.shields.io/travis/nestjs/nest/master.svg?label=linux" alt="Linux" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#5" alt="Coverage" /></a>
<a href="https://gitter.im/nestjs/nestjs?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=body_badge"><img src="https://badges.gitter.im/nestjs/nestjs.svg" alt="Gitter" /></a>
<a href="https://opencollective.com/nest#backer"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec"><img src="https://img.shields.io/badge/Donate-PayPal-dc3d53.svg"/></a>
  <a href="https://twitter.com/nestframework"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## License

Nest is [MIT licensed](LICENSE).

![Logo of the project](./images/logo.sample.png)
