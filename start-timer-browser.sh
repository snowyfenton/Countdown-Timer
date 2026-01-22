#!/bin/bash
# Browser-based launcher for Countdown Timer
# Works on all Raspberry Pi architectures including ARMHF/ARMv6 (Pi Zero, Pi 1, early Pi 2)
# This is an alternative to the Electron version for systems where Electron is not available

# Get script directory
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Get screen dimensions for positioning
# Default to 1280x720 if xrandr is not available or returns empty
if command -v xrandr &> /dev/null; then
    SCREEN_WIDTH=$(xrandr | grep '*' | awk '{print $1}' | cut -d 'x' -f1 | head -1)
    SCREEN_HEIGHT=$(xrandr | grep '*' | awk '{print $1}' | cut -d 'x' -f2 | head -1)
fi

# Fallback to default if detection failed or returned empty/zero
if [ -z "$SCREEN_WIDTH" ] || [ "$SCREEN_WIDTH" -eq 0 ] 2>/dev/null; then
    SCREEN_WIDTH=1280
fi
if [ -z "$SCREEN_HEIGHT" ] || [ "$SCREEN_HEIGHT" -eq 0 ] 2>/dev/null; then
    SCREEN_HEIGHT=720
fi

# Calculate window size (1/3 of screen width for timer)
TIMER_WIDTH=$((SCREEN_WIDTH / 3))
X_POSITION=$((SCREEN_WIDTH - TIMER_WIDTH))

echo "Starting Countdown Timer in browser mode..."
echo "Screen: ${SCREEN_WIDTH}x${SCREEN_HEIGHT}"
echo "Timer window: ${TIMER_WIDTH}x${SCREEN_HEIGHT} at position ${X_POSITION},0"

# Launch timer in Chromium app mode
# --app flag removes browser chrome (address bar, tabs, bookmarks bar)
# --window-position and --window-size for precise placement
# --user-data-dir isolates timer's browser data from main browser profile
# Suppress Chromium internal warnings (GCM, Vulkan, etc.) by redirecting stderr
chromium --app="file://$DIR/index.html" \
  --window-position="$X_POSITION,0" \
  --window-size="$TIMER_WIDTH,$SCREEN_HEIGHT" \
  --user-data-dir="$HOME/.config/countdown-timer" \
  2>/dev/null &

echo "Countdown Timer launched (PID: $!)"
