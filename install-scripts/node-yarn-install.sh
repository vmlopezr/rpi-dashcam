#!/bin/bash

printf "\n\nChecking for node...\n\n\n"
# Install the most recent version of NodeJS if not already installed
command -v node >/dev/null 2>&1 || {
    #installing node
    echo "Installing nodejs..."
    curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
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
