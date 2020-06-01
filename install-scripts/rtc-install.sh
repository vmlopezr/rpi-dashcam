#!/bin/bash

# User needs to have ssh and i2c enabled. 
# Can be done from raspiconfig
sudo apt -y install i2c-tools
sudo apt -y install ntpdate

RTCMODULE="rtc-ds1307"
grep -F "$RTCMODULE" /etc/modules >/dev/null 2>&1 || {
    echo "$RTCMODULE" | sudo tee -a /etc/modules

}

# Set RPI to read hwclock time on startup via rc.local
RTCSTARTUP="echo ds1307 0x68 > /sys/class/i2c-adapter/i2c-1/new_device
sudo hwclock -s
ping -q -c 1 -W 1 8.8.8.8 >/dev/null 2>&1 && {
    sudo hwclock -w
}
exit 0
"

grep -F "hwclock -s" /etc/rc.local || {
    # write before the last line
    sudo sed -i '/exit 0/d' /etc/rc.local
    echo "$RTCSTARTUP" | sudo tee -a /etc/rc.local
}
