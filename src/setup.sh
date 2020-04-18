#!/bin/bash
echo 'The following script will install the necessary dependencies for the RPI Dashcam.'
echo 'NOTE: This project is intented to work for the Logitech C920 USB Camera.'

read -p "Would you like to continue? (y/N)" answer
if [ "$answer" = "n" ] || [ "$answer" = "N" ] || [ "$answer" = "" ]
then
  echo "Setup aborted"
  exit
fi
# redirect traffic to DashCam Page
# iptables -t nat -A PREROUTING -p tcp --dport 443 -j DNAT --to-destination 192.168.10.1:50000
# iptables -t nat -A PREROUTING -p tcp --dport 80 -j DNAT --to-destination 192.168.10.1:50000

# Redirect traffic, option 2
# iptables -t nat -A PREROUTING -p tcp -m tcp -s 192.168.10.0/24 --dport 443 -j DNAT --to-destination 192.168.10.1:50000
# iptables -t nat -A PREROUTING -p tcp -m tcp -s 192.168.10.0/24 --dport 80 -j DNAT --to-destination 192.168.10.1:50000


#Update RPI
sudo apt-get update -y

#Check if python3 is installed (Should be already there by default)
command -v python3 >/dev/null 2>&1 || {
    echo "Installing python3..."
    sudo apt-get install python3
}

#Install v4l2-utils
command -v v4l2-ctl >/dev/null 2>&1 ||  { 
    echo "Installing V4L2 tools..."; 
    sudo dnf install v4l-utils
}

#check if git is installed, install otherwise
command -v git >/dev/null 2>&1 ||  { 
    echo "Installing git..."; 
    sudo apt-get install git
}

#NOTE: Need to check if it is already installed

command -v gst-inspect-1.0 >/dev/null 2>&1 || {
    echo "Installing gstreamer plugins"
    # gstreamer plugins
    sudo apt-get install libgstreamer1.0-0 gstreamer1.0-plugins-base gstreamer1.0-plugins-good gstreamer1.0-plugins-bad gstreamer1.0-plugins-ugly gstreamer1.0-libav gstreamer1.0-doc gstreamer1.0-tools gstreamer-1.0 gstreamer1.0-dev

    #Installing GI, GST for python
    # https://pygobject.readthedocs.io/en/latest/getting_started.html
    sudo apt-get install python3-gi python-gst-1.0 python3-gi-cairo gir1.2-gtk-3.0
    sudo apt-get install libgirepository1.0-dev
    sudo apt-get install libcairo2-dev gir1.2-gstreamer-1.0
}

command -v node >/dev/null 2>&1 || {
    #installing node
    echo "Installing nodejs..."
    curl -sL https://deb.nodesource.com/setup_13.x | sudo -E bash -
    sudo apt-get install -y nodejs

    if command -v nodejs >/dev/null 2>&1
    then
        TEXT="alias node=nodejs"
        echo "Node is installed as nodejs."
        grep -F "$TEXT" ~/.bashrc >/dev/null 2>&1
        echo "$TEXT" >> ~/.bashrc
        source ~/.bashrc
    fi
}

command -v yarn >/dev/null 2>&1 ||  { 
    echo "Installing yarn..."; 
    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
    sudo apt update && sudo apt install yarn
}


#Install necessary files for RTC

#Update files for wireless RPI Access Point
sudo apt install -y dnsmasq hostapd
sudo systemctl stop dnsmasq
sudo systemctl stop hostapd

WAN_INTERFACE="interface wlan0
    static ip_address=192.168.10.1/24
    nohook wpa_supplicant"

sudo echo "$WAN_INTERFACE" >> /etc/dhcpcd.conf
sudo service dhcpcd restart

sudo mv /etc/dnsmasq.conf /etc/dnsmasq.conf.orig

DNSMASQ_CONFIG="interface=wlan0      # Use the require wireless interface - usually wlan0
dhcp-range=192.168.10.2,192.168.10.50,255.255.255.0,24h"

sudo echo "$DNSMASQ_CONFIG" > /etc/dnsmasq.conf

HOSTAPD_CONFIG="
interface=wlan0
driver=nl80211
ssid=RPIDASHCAM
hw_mode=g
channel=7
wmm_enabled=0
macaddr_acl=0
auth_algs=1
ignore_broadcast_ssid=0
wpa=2
wpa_passphrase=rpiDashCam
wpa_key_mgmt=WPA-PSK
wpa_pairwise=TKIP
rsn_pairwise=CCMP"

sudo echo "$HOSTAPD_CONFIG" >> /etc/hostapd/hostapd.conf

sudo echo "DAEMON_CONF=\"/etc/hostapd/hostapd.conf\"" >> /etc/default/hostapd 

sudo systemctl unmask hostapd
sudo systemctl enable hostapd
sudo systemctl start hostapd
#Install Dashcam Server
# yarn install

echo "Installation complete. To run the application enter 'yarn start' in the installation directory".
echo "The raspberry pi will automatically look for the C920 Camera in the first 5 seconds of startup."
echo "If the camera is found, the dashcam app will automatically run. To shutdown, use the Shutdown button in the Web Application."
echo "Pulling the power on the raspberry pi may cause SD Card corruption."