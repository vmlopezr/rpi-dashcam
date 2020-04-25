#!/bin/bash

printf "\nStarting Access Point setup...\n\n"
#Update files for wireless RPI Access Point
sudo apt install -y dnsmasq hostapd
sudo systemctl stop dnsmasq
sudo systemctl stop hostapd

# Set wlan0 static IP and subnet

#NOTE: This did not get written in the dhcpcd.conf file during install
WAN_INTERFACE="
interface wlan0
    static ip_address=192.168.10.1/24
    nohook wpa_supplicant"

grep -F "$WAN_INTERFACE" /etc/dhcpcd.conf >/dev/null 2>&1 && {

    printf "\nSetting Static IP address for wifi...\n\n"
    sudo echo "$WAN_INTERFACE" >> /etc/dhcpcd.conf
    # When source config for dhcpcd is changed, daemon must be reloaded
    sudo systemctl daemon-reload
    sudo service dhcpcd restart
}

printf "\nSetting host...\n\n"
# Update hosts
HOST="192.168.10.1    rpicam"
grep -F "$HOST" /etc/hosts >/dev/null 2>&1 || {
    sudo echo "$HOST" >> /etc/hosts
}

printf "\nSetting dnsmasq...\n\n"
FILE=/etc/dnsmasq.conf.orig
if test -f "$FILE"; then
    echo "$FILE exists"
else
    # Update dnsmasq.conf for dns and dhcp
    sudo mv /etc/dnsmasq.conf /etc/dnsmasq.conf.orig
fi

DNSMASQ_CONFIG="
interface=wlan0      
domain-needed
bogus-priv
listen-address=127.0.0.1,192.168.10.1
expand-hosts
no-resolv
no-poll
domain=pi
server=8.8.8.8
server=8.8.4.4
local=/pi/
address=/pi/192.168.10.1
dhcp-range=192.168.10.10,192.168.10.30,255.255.255.0,24h
"

sudo echo "$DNSMASQ_CONFIG" > /etc/dnsmasq.conf
sudo systemctl restart dnsmasq

# Update resolv.conf
RESOLV_OPT="
# Generated by resolvconf
domain pi
nameserver 127.0.0.1
nameserver 192.168.10.1
"

# Check for write permission
if lsattr /etc/resolv.conf | grep i >/dev/null 2>&1
then
    sudo chattr -i /etc/resolv.conf
fi

sudo echo "$RESOLV_OPT" > /etc/resolv.conf
sudo chattr +i /etc/resolv.conf

printf "\nSetting AP configuration...\n\n"
# update hostapd configuration
# # Configuration for 5.0 GHz Wi-Fi
HOSTAPD_CONFIG="
interface=wlan0
hw_mode=a
driver=nl80211
macaddr_acl=0
channel=36
wmm_enabled=0
auth_algs=1
ignore_broadcast_ssid=0
wpa=2
wpa_key_mgmt=WPA-PSK
wpa_pairwise=TKIP
rsn_pairwise=CCMP
ssid=RPIDASHCAM
wpa_passphrase=rpiDashCam
"
# # Configuration for 2.4GHz Wi-Fi
# HOSTAPD_CONFIG="
# interface=wlan0
# driver=nl80211
# ssid=RPIDASHCAM
# hw_mode=g
# channel=7
# wmm_enabled=0
# macaddr_acl=0
# auth_algs=1
# ignore_broadcast_ssid=0
# wpa=2
# wpa_passphrase=rpiDashCam
# wpa_key_mgmt=WPA-PSK
# wpa_pairwise=TKIP
# rsn_pairwise=CCMP"

sudo echo "$HOSTAPD_CONFIG" > /etc/hostapd/hostapd.conf

HOSTAPD_DAEMON_CONFIG="DAEMON_CONF=\"/etc/hostapd/hostapd.conf\""
grep -F "$HOSTAPD_DAEMON_CONFIG" /etc/default/hostapd >/dev/null 2>&1 || {
    echo "DAEMON_CONF=\"/etc/hostapd/hostapd.conf\"" | sudo tee -a /etc/default/hostapd 
}

#unblock WiFi
sudo rfkill unblock 0

#start the hostapd service 
sudo systemctl unmask hostapd
sudo systemctl enable hostapd
sudo systemctl start hostapd