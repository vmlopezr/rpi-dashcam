#!/bin/bash
# Remove the current local timezone link in /etc/
rm -rf /etc/localtime

# Update the timezone from the argument.
ln -s /usr/share/zoneinfo/"$1" /etc/localtime

# Run the node process with production environment and exit after it completes.
NODE_ENV=production node build/main.js && exit
