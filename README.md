# Countdown Timer

A sleek, dark mode countdown timer application optimized for both desktop and touchscreen displays, with dramatic visual alerts and flexible time controls.

## Features

### Core Functionality
- **Preset Timers**: Quick access to 5, 15, 25, and 50-minute timers
- **Interactive Time Setting**: Scroll/swipe on the timer display to set any custom duration (1-999 minutes)
  - **Mouse**: Hover and scroll wheel up/down to adjust minutes
  - **Touch**: Swipe up/down on the display to adjust minutes
- **Full Control**: Start, pause, and reset functionality
- **Visual Alerts**: Dramatic 5-second flashing completion animation
- **Warning Indicator**: Yellow pulsing effect during final 10 seconds

### Design & Interface
- **Dark Theme**: Minimalist design with dark background and neon emerald green accents
- **Touchscreen Optimized**:
  - Large touch targets (56-60px minimum)
  - Touch-specific visual feedback
  - No hover dependencies
  - Optimized button spacing
- **Responsive Design**: Works seamlessly on desktop, mobile, and Raspberry Pi displays
- **Accessibility**: Keyboard navigation and proper focus states

### Standalone Desktop App
- **Electron-based**: Runs as a native desktop application (Windows, Mac, Linux)
- **Side-by-side Mode**: Optimized for dual-app displays (e.g., with Todoist)
- **Raspberry Pi Ready**: Full touchscreen support with setup guide included

## Quick Start

### Web Version
1. Open `index.html` in a modern web browser
2. Set time using preset buttons OR scroll/swipe on the timer display
3. Click "Start" to begin countdown
4. Timer will flash dramatically when complete

### Desktop App (Electron)
```bash
npm install
npm start
```

### Browser Version (All Platforms, No Build Required)
For older Raspberry Pi models (ARMHF/ARMv6) or any system without Electron support:

```bash
# Open directly in browser (cross-platform)
chromium-browser --app=file:///path/to/index.html

# Or use the included launcher script (Linux/Raspberry Pi)
chmod +x start-timer-browser.sh
./start-timer-browser.sh
```

**Advantages:**
- Works on **all** Raspberry Pi models including ARMv6 (Pi Zero, Pi 1)
- Lower memory footprint than Electron
- No build step or compilation required
- Same functionality and touchscreen support

### Raspberry Pi Setup
See [RASPBERRY_PI_SETUP.md](RASPBERRY_PI_SETUP.md) for detailed installation and touchscreen configuration.

**Note:** ARMHF/ARMv6 users (Pi Zero, Pi 1, early Pi 2) should use the browser-based installation method described in the setup guide.

## Usage

### Setting the Timer

**Method 1: Preset Buttons**
- Click **5 min**, **15 min**, **25 min**, or **50 min** buttons

**Method 2: Interactive Scrolling**
- **Desktop**: Hover over the timer display and scroll mouse wheel
  - Scroll up = increase minutes
  - Scroll down = decrease minutes
- **Touchscreen**: Touch the timer display and swipe
  - Swipe up = increase minutes
  - Swipe down = decrease minutes
  - Every 30 pixels = 1 minute
- Range: 1-999 minutes

### Controls
- **Start/Pause**: Begin or pause the countdown
- **Reset**: Return to 00:00 and clear the timer

### Visual Feedback

**During Countdown:**
- Last 10 seconds: Numbers pulse yellow with glow effect

**On Completion:**
- 5-second dramatic animation with:
  - Numbers flash and scale up 3 times
  - Bright green glow effect
  - Entire background flashes green
  - Very noticeable in peripheral vision

## Timer States

| State | Display | Start/Pause | Reset | Presets | Scroll |
|-------|---------|-------------|-------|---------|--------|
| Idle | 00:00 | Disabled | Enabled | Enabled | Enabled |
| Ready | Set time | Enabled (Start) | Enabled | Enabled | Enabled |
| Running | Counting | Enabled (Pause) | Enabled | Disabled | Disabled |
| Paused | Stopped | Enabled (Start) | Enabled | Enabled | Enabled |
| Completed | 00:00 (flashing) | Disabled | Enabled | Enabled | Disabled |

## Technical Details

### Technology Stack
- Pure HTML, CSS, and JavaScript (no frameworks)
- ES6+ JavaScript with class-based architecture
- Electron for desktop app packaging (optional - can also run in browser)
- CSS Grid and Flexbox for responsive layout
- CSS animations for visual alerts

### Browser Compatibility
- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge
- Any modern browser supporting ES6+

### File Structure

```
countdown-timer/
├── index.html                  # Main HTML structure
├── styles.css                  # Dark theme and responsive styles
├── script.js                   # Timer logic and state management
├── main.js                     # Electron entry point
├── package.json                # Node.js dependencies
├── start-apps.sh              # Raspberry Pi startup script (auto-detects Electron/browser)
├── start-timer-browser.sh     # Browser-based launcher (ARMHF compatible)
├── autostart-countdown-todoist.desktop  # Autostart desktop file template
├── README.md                   # This file
├── RASPBERRY_PI_SETUP.md      # Raspberry Pi installation guide
└── countdown-timer-prd.md     # Product requirements document
```

## Design Specifications

### Colors
- **Background**: Dark gray/black (#0a0a0a)
- **Background Flash**: Dark green (#1a2f1a)
- **Text**: White (#ffffff) and light gray (#e5e5e5)
- **Accent**: Neon emerald green (#10b981)
- **Warning**: Yellow/amber (#fbbf24)
- **Error**: Red (#ef4444)

### Typography
- **Font**: Inter (with fallbacks to system fonts)
- **Counter Display**: 4-8rem (responsive)
- **Buttons**: 1.1rem
- **Labels**: 0.95rem

### Touch Targets
- **Buttons**: Minimum 56px height (60px on touch devices)
- **Input Fields**: Minimum 56px height
- **Counter Display**: Full padding for easy interaction

## Raspberry Pi Setup

The timer is fully optimized for Raspberry Pi with touchscreen displays:

- **Touchscreen Support**: Official 7" display and most HDMI touchscreens
- **Auto-start**: Configure to launch on boot (see setup guide)
- **Side-by-side Layout**: Run alongside Todoist or other apps (2/3 and 1/3 split)
- **Performance Optimized**: Hardware acceleration enabled

See [RASPBERRY_PI_SETUP.md](RASPBERRY_PI_SETUP.md) for complete setup instructions.

## Development

### Local Development
```bash
# Clone the repository
git clone https://github.com/yourusername/countdown-timer.git
cd countdown-timer

# Install dependencies
npm install

# Run the Electron app
npm start
```

### Building for Distribution
```bash
# Install electron-builder (optional, for creating installers)
npm install --save-dev electron-builder

# Build for current platform
npm run build
```

## License

ISC

## Contributing

Contributions welcome! Please feel free to submit a Pull Request.

## Acknowledgments

Built with a focus on simplicity, usability, and visual feedback for productive time management.
