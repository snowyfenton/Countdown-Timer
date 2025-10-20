#!/bin/bash
# Startup script for Raspberry Pi to launch Todoist and Countdown Timer side-by-side

# Wait for display to be ready
sleep 2

# Get script directory
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Start Todoist in Chromium (left side, taking remaining space)
# Adjust window size based on your display resolution
# Example for 1920x1080: 1320x1080 (leaves 600px for timer)
chromium-browser --app=https://todoist.com --window-size=1320,1080 --window-position=0,0 &

# Wait for Todoist to start
sleep 3

# Start Countdown Timer (right side, 600px width)
cd "$DIR"
npm start &

# Optional: Hide cursor after 5 seconds of inactivity
# sudo apt-get install unclutter
# unclutter -idle 5 &
