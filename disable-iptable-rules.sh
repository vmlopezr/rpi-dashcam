#!/bin/bash

#run this script to remove the iptables rules added with "setup.sh"
sudo iptables -t nat -D PREROUTING -i wlan0 -d 0/0 -p tcp --dport 80 -j DNAT --to-destination 192.168.10.1:50000

# Write updated table for iptables persistent
sudo iptables-save > /etc/iptables/rules.v4
