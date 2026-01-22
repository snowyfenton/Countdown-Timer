#!/bin/bash
# Startup script for Raspberry Pi to launch Todoist and Countdown Timer side-by-side

# Wait for display to be ready
sleep 2

# Get script directory
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Start Todoist in Chromium (left side, 2/3 of screen width)
# For 1280x720: 853px width (2/3 of 1280)
chromium-browser --app=https://todoist.com --window-size=853,720 --window-position=0,0 &

# Wait for Todoist to start
sleep 3

# Start Countdown Timer (right side, 1/3 width - handled by main.js)
cd "$DIR"
npm start &

# Optional: Hide cursor after 5 seconds of inactivity
# sudo apt-get install unclutter
# unclutter -idle 5 &
