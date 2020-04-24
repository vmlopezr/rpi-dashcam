#!/bin/bash

#run this script to remove the iptables rules added with "setup.sh"
sudo iptables -t nat -D PREROUTING -i wlan0 -p tcp --dport 80 -j DNAT --to-destination 192.168.10.1:50000
sudo iptables -t nat -D POSTROUTING -j MASQUERADE

sudo iptables-save > /etc/iptables/rules.v4