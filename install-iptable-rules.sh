#!/bin/bash
sudo iptables -t nat -A PREROUTING -i wlan0 -p tcp --dport 80 -j DNAT --to-destination 192.168.10.1:50000
sudo iptables -t nat -A POSTROUTING -j MASQUERADE