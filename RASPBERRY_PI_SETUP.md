# Raspberry Pi Setup Guide

This guide will help you set up the Countdown Timer alongside Todoist on your Raspberry Pi.

## Quick Install via DEB Package (Recommended)

The easiest way to install on your Raspberry Pi is using the pre-built DEB package:

### For Pre-Built Releases
If you have a pre-built `.deb` file:

```bash
# Install the DEB package
sudo apt-get install -y ~/Downloads/countdown-timer_1.0.0_arm64.deb

# The app will appear in your applications menu and can be launched from there
```

### Build Your Own DEB Package

If you want to build the DEB package yourself on your development machine:

```bash
# Clone/navigate to the project directory
cd ~/path/to/countdown-timer

# Install dependencies
npm install

# Build for ARM64 (64-bit Raspberry Pi 3, 4, 5)
npm run build:arm

# Or for 32-bit systems (ARMv7)
npm run build:armv7

# The DEB file will be in the dist/ directory
# Transfer to your Pi and install as above
```

### After Installation
Once installed via DEB:
- The app will appear in your applications menu (Applications > Utilities > Countdown Timer)
- You can launch it from the menu or via command line: `countdown-timer`
- It will auto-update when you upgrade the package

## Prerequisites

1. Raspberry Pi (3 or newer recommended)
2. Raspberry Pi OS (formerly Raspbian) installed
3. Display connected (touchscreen supported!)
4. Internet connection

## Touchscreen Support

This app is **fully optimized for touchscreens**! Features include:
- Large touch targets (minimum 56px height)
- Touch-specific visual feedback
- No hover dependencies
- Optimized button spacing
- Instant touch response

## Installation Steps

### 1. Install Node.js and npm

```bash
# Update system
sudo apt-get update
sudo apt-get upgrade -y

# Install Node.js (using NodeSource repository for latest LTS)
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### 2. Install Required System Dependencies

```bash
# Install dependencies for Electron
sudo apt-get install -y libgtk-3-0 libnotify4 libnss3 libxss1 \
  libxtst6 xdg-utils libatspi2.0-0 libuuid1 libsecret-1-0

# Optional: Install unclutter to hide mouse cursor
sudo apt-get install -y unclutter
```

### 2b. Configure Touchscreen (If Using)

If you're using an official Raspberry Pi touchscreen or compatible display:

```bash
# The touchscreen should work automatically with modern Raspberry Pi OS

# Test the touchscreen
# Just tap anywhere on the screen to verify it's working

# Optional: Calibrate touchscreen if needed
sudo apt-get install -y xinput-calibrator
xinput_calibrator

# To rotate display (if mounted vertically), edit /boot/config.txt:
sudo nano /boot/config.txt
# Add one of these lines:
# display_rotate=0  # Normal (default)
# display_rotate=1  # 90 degrees
# display_rotate=2  # 180 degrees
# display_rotate=3  # 270 degrees

# For newer Pi models, use:
# display_lcd_rotate=0  # (or 1, 2, 3)

# Reboot after changes
sudo reboot
```

**Common Touchscreen Models:**
- Official Raspberry Pi 7" Touchscreen - Works out of the box
- Waveshare displays - Usually require specific drivers (check manufacturer)
- HDMI touchscreens - Most work with standard USB touch input

### 3. Transfer Project to Raspberry Pi

Copy the entire project folder to your Raspberry Pi:

```bash
# Option 1: Using USB drive
# Copy files to USB, then on Pi:
cp -r /media/pi/USB_NAME/Countdown\ Timer ~/

# Option 2: Using SCP from your computer
scp -r "c:\Users\snowy\Countdown Timer" pi@raspberrypi.local:~/

# Option 3: Using git (if project is in a repository)
cd ~
git clone YOUR_REPO_URL
cd Countdown\ Timer
```

### 4. Install Project Dependencies

```bash
cd ~/Countdown\ Timer
npm install
```

### 5. Test the Application

```bash
npm start
```

The timer should appear on the right side of your screen.

## Setting Up Side-by-Side with Todoist

### Option 1: Using the Startup Script

```bash
# Make the startup script executable
chmod +x ~/Countdown\ Timer/start-apps.sh

# Edit the script if needed to adjust window positions
nano ~/Countdown\ Timer/start-apps.sh

# Run the script
./start-apps.sh
```

### Option 2: Manual Launch

1. **Launch Todoist:**
   ```bash
   chromium-browser --app=https://todoist.com --window-size=1320,1080 --window-position=0,0 &
   ```

2. **Launch Countdown Timer:**
   ```bash
   cd ~/Countdown\ Timer
   npm start &
   ```

## Auto-start on Boot (Optional)

To automatically launch both apps when your Pi boots:

### Method 1: Using Autostart (Recommended)

```bash
# Create autostart directory if it doesn't exist
mkdir -p ~/.config/autostart

# Create desktop entry for the startup script
cat > ~/.config/autostart/countdown-todoist.desktop << 'EOF'
[Desktop Entry]
Type=Application
Name=Countdown & Todoist
Exec=/home/pi/Countdown Timer/start-apps.sh
Terminal=false
EOF
```

### Method 2: Using .bashrc (Alternative)

Add to the end of `~/.bashrc`:

```bash
# Auto-start apps on login
if [ -z "$DISPLAY" ]; then
  export DISPLAY=:0
fi

if [ "$(tty)" = "/dev/tty1" ]; then
  ~/Countdown\ Timer/start-apps.sh
fi
```

## Customization

### Adjust Window Positions

Edit [main.js](main.js) to change timer position:

```javascript
// For left side:
const xPosition = 0;

// For right side (default):
const xPosition = screenWidth - windowWidth;

// For custom position:
const xPosition = 100; // pixels from left
```

### Adjust Window Sizes

Edit [start-apps.sh](start-apps.sh):

```bash
# Adjust Todoist window size for your display
# For 1920x1080 display (leaving 600px for timer):
--window-size=1320,1080

# For 1280x720 display (leaving 600px for timer):
--window-size=680,720
```

### Common Display Resolutions

| Resolution | Todoist Size | Timer Size | Timer Position |
|------------|--------------|------------|----------------|
| 1920x1080  | 1320x1080    | 600x1080   | Right (1320,0) |
| 1280x720   | 680x720      | 600x720    | Right (680,0)  |
| 1024x600   | 424x600      | 600x600    | Right (424,0)  |

## Touchscreen Tips

### Improving Touch Experience

1. **Enable Virtual Keyboard (Optional):**
   ```bash
   sudo apt-get install -y matchbox-keyboard
   # Launch with: matchbox-keyboard
   ```

2. **Disable Screen Blanking:**
   ```bash
   # Add to /etc/lightdm/lightdm.conf under [Seat:*]
   xserver-command=X -s 0 -dpms
   ```

3. **Hide Mouse Cursor on Touch:**
   ```bash
   # Already included in start-apps.sh
   unclutter -idle 5 &
   ```

4. **Prevent Accidental Touches:**
   - The app already prevents double-tap zoom
   - Touch targets are properly sized
   - Visual feedback confirms touches

### Touchscreen Troubleshooting

**Touch Not Working:**
```bash
# Check if touch device is detected
ls /dev/input/event*

# Check input devices
xinput list

# Test touch events
sudo apt-get install -y evtest
sudo evtest
# Select your touch device and test by touching
```

**Inverted Touch Coordinates:**
```bash
# Create/edit touch calibration
sudo nano /usr/share/X11/xorg.conf.d/40-libinput.conf

# Add for your touch device:
Section "InputClass"
    Identifier "calibration"
    MatchProduct "YOUR_TOUCH_DEVICE_NAME"
    Option "TransformationMatrix" "1 0 0 0 1 0 0 0 1"
EndSection
```

**Touch Offset Issues:**
- Run `xinput_calibrator` and follow on-screen instructions
- Copy the output to the configuration file it suggests

## Troubleshooting

### Display/Graphics Issues

If you encounter graphics issues:

```bash
# Increase GPU memory
sudo raspi-config
# Navigate to: Performance Options > GPU Memory
# Set to at least 128MB
```

### Electron Performance Issues

For older Raspberry Pi models (Pi 3 or earlier):

1. Edit [main.js](main.js) and add these options:

```javascript
webPreferences: {
  nodeIntegration: false,
  contextIsolation: true,
  enableBlinkFeatures: '',
  disableBlinkFeatures: 'Accelerated2dCanvas'
}
```

2. Use hardware acceleration:

```bash
# Add to /boot/config.txt
sudo nano /boot/config.txt

# Add these lines:
dtoverlay=vc4-kms-v3d
max_framebuffers=2
```

### Memory Issues

```bash
# Check available memory
free -h

# If low, increase swap size
sudo dphys-swapfile swapoff
sudo nano /etc/dphys-swapfile
# Change CONF_SWAPSIZE=100 to CONF_SWAPSIZE=1024
sudo dphys-swapfile setup
sudo dphys-swapfile swapon
```

## Performance Tips

1. **Disable Unnecessary Services:**
   ```bash
   sudo systemctl disable bluetooth
   sudo systemctl disable cups
   ```

2. **Use Lite Desktop Environment:**
   - Consider using LXDE instead of full Raspberry Pi Desktop

3. **Overclock (if needed):**
   ```bash
   sudo raspi-config
   # Navigate to: Performance Options > Overclock
   ```

## Remote Access

To manage the Pi remotely:

```bash
# Enable SSH
sudo raspi-config
# Navigate to: Interface Options > SSH > Enable

# Enable VNC (for remote desktop)
sudo raspi-config
# Navigate to: Interface Options > VNC > Enable
```

## Building & Distributing the DEB Package

If you want to distribute the app to others or set it up as a proper Linux package:

### Prerequisites for Building

```bash
# On your development machine (Linux, Mac, or Windows with WSL)
npm install -g electron-builder

# Or add to devDependencies
npm install --save-dev electron-builder
```

### Build Process

```bash
# For 64-bit Raspberry Pi (Pi 3, 4, 5)
npm run build:arm

# For 32-bit Raspberry Pi systems
npm run build:armv7

# The build outputs will be in the dist/ directory
ls -la dist/
```

### What's Inside the DEB Package

The DEB package includes:
- The Electron app binary
- All dependencies bundled
- Desktop entry file (registers in application menu)
- Proper permissions and installation scripts
- Automatic menu registration

### Distributing Your Build

Once built, you can:
1. **Share the .deb file** - Others can install with `sudo apt install ./countdown-timer_1.0.0_arm64.deb`
2. **Host on GitHub Releases** - Upload to a GitHub release for easy downloading
3. **Create a PPA** - Advanced: host your own Ubuntu/Debian repository
4. **Share via USB** - Copy the .deb file to a USB drive

## Notes

- The timer will appear on the **right side** by default (600px wide)
- Todoist will take up the remaining left side
- Both apps will use the full screen height
- You can resize the timer window manually if needed
- To change which side the timer appears on, edit the `xPosition` in [main.js](main.js)

## Support

For issues specific to:
- Electron on Raspberry Pi: https://github.com/electron/electron/issues
- Raspberry Pi OS: https://forums.raspberrypi.com/
