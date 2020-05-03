#!/bin/bash
echo 'The following script will install the necessary dependencies for the RPI Dashcam.'
echo 'NOTE: This project is intented to work for the Logitech C920 USB Camera.'

read -p "Would you like to continue? (y/N)" answer
if [ "$answer" = "n" ] || [ "$answer" = "N" ] || [ "$answer" = "" ]
then
  echo "Setup aborted"
  exit
fi

#Update RPI
sudo apt -y update

printf "\n\nSetting up iptables for site...\n\n\n"
# Make iptables rules persistent
sudo apt -y install iptables-persistent

# Redirect http traffic to static website at port 500000
sudo sh install-iptable-rules.sh
sudo iptables-save > /etc/iptables/rules.v4

# if command -v yar >/dev/null; then
#     echo "installing repository using yarn..."
#     yarn install --network-timeout 1000000
#     yarn build
#     NPMINSTALLED=true
# elif command -v npm >/dev/null; then
#     echo "installing repository with npm..."
#     npm install
#     npm run build
#     NPMINSTALLED=true
# else
#     echo "No package managers installed."
#     NPMINSTALLED=false
# fi

#Check if python3 is installed (Should be already there by default)
command -v python3 >/dev/null 2>&1 || {
    echo "Installing python3..."
    sudo apt -y install python3
}

#Install v4l2-utils for USB Webcam interfacing
command -v v4l2-ctl >/dev/null 2>&1 ||  { 
    printf "\n\nInstalling V4L2 tools...\n\n\n"; 
    sudo apt -y install v4l-utils
}

# Verify if gstreamer installation, otherwise install.
# Installing GI, GST for python
# https://pygobject.readthedocs.io/en/latest/getting_started.html
command -v gst-inspect-1.0 >/dev/null 2>&1 || {
    printf "\n\nInstalling gstreamer plugins...\n\n\n"
    # gstreamer plugins
    sudo apt -y install libgstreamer1.0-0 \
    gstreamer1.0-plugins-base \
    gstreamer1.0-plugins-good \
    gstreamer1.0-plugins-bad \
    gstreamer1.0-plugins-ugly \
    gstreamer1.0-tools \
    gstreamer1.0-dev \
    gstreamer1.0-x \
    python3-gi \
    python-gst-1.0 \
    python3-gi-cairo \
    gir1.2-gtk-3.0 \
    libgirepository1.0-dev \
    libcairo2-dev \
    gir1.2-gstreamer-1.0
}

#Install Access Point
sudo sh install-scripts/AP-install.sh

#Install necessary files for RTC
sudo sh install-scripts/ rtc-install.sh


unzip static-website.zip

echo "Installation complete. To run the application enter 'yarn start' in the installation directory".
echo "The raspberry pi will automatically look for the C920 Camera in the first 5 seconds of startup."
echo "If the camera is found, the dashcam app will automatically run. To shutdown, use the Shutdown button in the Web Application."
echo "Pulling the power on the raspberry pi may cause SD Card corruption."
echo "Shutting down to for the RTC"

if [ $NPMINSTALLED = false ] ; then
    echo "NPM or Yarn are not installed. node_modules was not set up. Please download either package manager to install node_modules."
fi
echo "Shutdown and reboot the raspberry pi to allow the changes to the wifi network and hwclock."
