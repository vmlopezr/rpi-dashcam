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

printf "\n\nChecking for node...\n\n\n"
# Install the most recent version of NodeJS if not already installed
command -v node >/dev/null 2>&1 || {
    #installing node
    echo "Installing nodejs..."
    curl -sL https://deb.nodesource.com/setup_13.x | sudo -E bash -
    sudo apt -y install nodejs

    if command -v nodejs >/dev/null 2>&1
    then
        TEXT="alias node=nodejs"
        echo "Node is installed as nodejs."
        grep -F "$TEXT" ~/.bashrc >/dev/null 2>&1 || {
            echo "$TEXT" >> ~/.bashrc
            source ~/.bashrc
        }
    fi
}

printf "\n\nChecking for yarn...\n\n\n"
# Install Yarn if not already installed
command -v yarn >/dev/null 2>&1 ||  { 
    echo "Installing yarn..."; 
    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
    sudo apt update && sudo apt install yarn
}

printf "\n\nInstalling Repository...\n\n\n"
# install repo
yarn install --network-timeout 1000000

#Check if python3 is installed (Should be already there by default)
command -v python3 >/dev/null 2>&1 || {
    echo "Installing python3..."
    sudo apt -y install python3
}
# Verify that python 2 is installed. 
# (NOTE: node module sqlite3 errors out if no "python". This issue came up when installing
# on ubuntu server image. Need to check if aliasing python to python3 would work)
command -v python >/dev/null 2>&1 || {
    echo "Installing python3..."
    sudo apt -y install python
}

#Install v4l2-utils for USB Webcam interfacing
command -v v4l2-ctl >/dev/null 2>&1 ||  { 
    printf "\n\nInstalling V4L2 tools...\n\n\n"; 
    sudo apt -y install v4l-utils
}

# Verify if gstreamer is already installed, otherwise install necessary
# plugins
command -v gst-inspect-1.0 >/dev/null 2>&1 || {
    printf "\n\nInstalling gstreamer plugins...\n\n\n"
    # gstreamer plugins
    sudo apt -y install libgstreamer1.0-0 gstreamer1.0-plugins-base gstreamer1.0-plugins-good gstreamer1.0-plugins-bad gstreamer1.0-plugins-ugly gstreamer1.0-libav gstreamer1.0-doc gstreamer1.0-tools
    sudo apt -y install gstreamer-1.0 gstreamer1.0-dev
}

printf "\n\nInstalling python plugins for gstreamer...\n\n\n"
#Installing GI, GST for python
# https://pygobject.readthedocs.io/en/latest/getting_started.html
sudo apt -y install python3-gi python-gst-1.0 python3-gi-cairo gir1.2-gtk-3.0
sudo apt -y install libgirepository1.0-dev
sudo apt -y install libcairo2-dev gir1.2-gstreamer-1.0

#Install Access Point
sudo sh AP-install.sh

#Install necessary files for RTC
sh rtc-install.sh

echo "Installation complete. To run the application enter 'yarn start' in the installation directory".
echo "The raspberry pi will automatically look for the C920 Camera in the first 5 seconds of startup."
echo "If the camera is found, the dashcam app will automatically run. To shutdown, use the Shutdown button in the Web Application."
echo "Pulling the power on the raspberry pi may cause SD Card corruption."
echo "Shutting down to for the RTC"

sudo halt
