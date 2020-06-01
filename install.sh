#!/bin/bash
echo 'The following script will install the necessary dependencies for the RPI Dashcam.'
echo 'NOTE: This project is intented to work for the Logitech C920 USB Camera, Microsoft Lifecam HD3000, and UVC compatible webcams.'

read -p "Would you like to continue? (y/N)" answer
if [ "$answer" = "n" ] || [ "$answer" = "N" ] || [ "$answer" = "" ]
then
  echo "Setup aborted"
  exit
fi

echo 'Installing gstreamer dependencies'
# Verify if gstreamer installation, otherwise install.
# Installing GI, GST for python
# https://pygobject.readthedocs.io/en/latest/getting_started.html
command -v gst-inspect-1.0 >/dev/null 2>&1 || {
    printf "\n\nInstalling gstreamer plugins...\n\n\n"
    # gstreamer plugins
    apt-get -y install libgstreamer1.0-0 \
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

# Install wifi network dependencies
sh rpi-network-install.sh
