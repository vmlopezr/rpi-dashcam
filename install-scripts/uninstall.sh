#!/bin/bash
sudo sh disable-iptable-rules.sh

sudo apt purge iptables-persistent \
    v4l-utils \
    libgstreamer1.0-0 \
    dnsmasq \
    hostapd \
    i2c-tools \
    ntpdate

sudo apt-get purge gstreamer1.0-plugins-base \
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
    gir1.2-gstreamer-1.0 \ 

sudo apt-get autoclean

sudo mv /etc/dhcpcd.conf.orig /etc/dhcpcd.conf