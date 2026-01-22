# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A minimalist countdown timer application optimized for touchscreen displays and Raspberry Pi. Features interactive time setting via scroll/swipe gestures, preset timers, and dramatic visual alerts. Designed to run side-by-side with other applications (e.g., Todoist) on dual-app displays.

**Key Architecture Note:** This is a pure web application (HTML/CSS/JavaScript) that can run either as an Electron desktop app OR directly in a browser. No Node.js APIs are used at runtime, making it fully browser-compatible.

## Deployment Options

### Option 1: Electron Desktop App
- Full desktop integration with native window management
- **Requires ARMv7+ architecture** (not ARMHF/ARMv6)
- Build via electron-builder to produce DEB packages
- Supports: x64, ARM64 (64-bit Pi 3+), ARMv7 (32-bit Pi 3)

### Option 2: Browser-Based (ARMHF Compatible)
- Direct launch in Chromium with `--app` flag for app-like experience
- **Works on all Raspberry Pi models** including ARMv6/ARMHF (Pi Zero, Pi 1, early Pi 2)
- No build step required - just copy files
- Lower memory footprint than Electron
- Launcher script: [start-timer-browser.sh](start-timer-browser.sh)
- Auto-detection in [start-apps.sh](start-apps.sh) - tries Electron first, falls back to browser

**When to use browser mode:**
- Older Raspberry Pi models (ARMHF/ARMv6 architecture)
- Systems without Node.js/npm installed
- Lower resource environments
- Faster deployment without build step

## Development Commands

### Running the Application
```bash
npm start                # Launch Electron app in development
```

### Building for Distribution
```bash
npm run build           # Build for current platform
npm run build:linux     # Build for Linux (x64)
npm run build:arm       # Build DEB package for ARM64 (Raspberry Pi 3/4/5)
npm run build:armv7     # Build DEB package for ARMv7 (32-bit Raspberry Pi)
```

Built packages are output to the `dist/` directory.

**Note:** DEB packages do NOT support ARMHF/ARMv6. For these systems, use browser-based deployment.

### Browser-Based Deployment (No Build)
```bash
# Launch in browser (works on all architectures)
./start-timer-browser.sh

# Or manually with Chromium
chromium-browser --app=file:///path/to/index.html \
  --window-position=X,0 \
  --window-size=WIDTH,HEIGHT \
  --user-data-dir="$HOME/.config/countdown-timer"
```

## Architecture

### Application Structure
This is a pure web application with optional Electron wrapper:
- **Electron app** ([main.js](main.js)) - Optional wrapper for desktop integration, window management (1/3 screen width on right)
- **Web interface** ([index.html](index.html), [styles.css](styles.css), [script.js](script.js)) - Core timer UI and logic (browser-compatible)
- **Class-based state management** - Single `CountdownTimer` class handles all timer logic
- **Browser launchers** ([start-timer-browser.sh](start-timer-browser.sh), [start-apps.sh](start-apps.sh)) - Alternative to Electron for ARMHF/ARMv6 systems

### Timer State Machine
The timer operates in 5 distinct states ([script.js:16](script.js#L16)):
- `idle` - Default state, 00:00 displayed, Start disabled
- `ready` - Time is set, Start enabled
- `running` - Countdown active, Pause enabled
- `paused` - Countdown stopped, Start enabled to resume
- `completed` - Timer finished, triggers 5-second flash animation

State transitions control UI element availability (see [script.js:273-303](script.js#L273-L303)).

### Interactive Time Input
The counter display ([index.html:15-17](index.html#L15-L17)) serves dual purpose:
1. **Display** - Shows current time in MM:SS format
2. **Input** - Touch/scroll to adjust minutes (1-999 range)

Implementation details:
- **Touch** ([script.js:81-127](script.js#L81-L127)) - Vertical swipe (30px = 1 minute)
- **Mouse wheel** ([script.js:130-153](script.js#L130-L153)) - Scroll up/down to increment/decrement
- Only enabled when not in `running` state

### Visual Feedback System
Three distinct animation states:
1. **Warning** ([styles.css:69-125](styles.css#L69-L125)) - Yellow pulsing, final 10 seconds
2. **Completion** ([styles.css:65-114](styles.css#L65-L114)) - 5-second flash animation on timer and background
3. **Touch feedback** ([styles.css:60-63](styles.css#L60-L63)) - Visual response during interaction

### Electron Configuration
Window positioning ([main.js:4-36](main.js#L4-L36)):
- Calculates primary display dimensions
- Positions window on right side (change `xPosition` for left side)
- Default: 600px width, full screen height
- Designed for side-by-side app layouts

## Key Technical Decisions

### No Framework Approach
Pure JavaScript/CSS for:
- Minimal dependencies
- Optimal Raspberry Pi performance
- Simple maintenance and customization
- Direct DOM manipulation without virtual DOM overhead

### Touch-First Design
All interactive elements meet touch standards:
- Minimum 56px touch targets ([styles.css:160](styles.css#L160))
- 60px on touch devices ([styles.css:253](styles.css#L253))
- No hover dependencies for core functionality
- Explicit touch event handling with visual feedback
- `-webkit-tap-highlight-color: transparent` prevents default highlights

### Preset Button State Management
Preset buttons ([script.js:305-324](script.js#L305-L324)):
- Disabled during `running` state
- `.active` class highlights selected preset
- Cleared when manually adjusting via scroll/swipe

## Important Implementation Details

### Time Storage
Timer maintains three representations:
- `currentMinutes` / `currentSeconds` - Display values
- `totalSeconds` - Countdown tracking (decrements every second)
- Always sync via `updateTimeFromTotal()` ([script.js:263-266](script.js#L263-L266))

### Event Listener Setup
All event listeners initialized in constructor ([script.js:28-154](script.js#L28-L154)):
- Touch events use `preventDefault()` to avoid scrolling
- Both touch and mouse events supported simultaneously
- Control buttons get touch-specific scale transforms

### Animation Cleanup
Critical to remove CSS classes after animations:
- Warning class removed when exiting last 10 seconds ([script.js:207-209](script.js#L207-L209))
- Completion classes removed after 5 seconds ([script.js:255-258](script.js#L255-L258))
- Prevents animation state conflicts

## Raspberry Pi Specific

### Architecture Support Matrix

| Architecture | Model Examples | Electron DEB | Browser Mode |
|--------------|----------------|--------------|--------------|
| ARMv6 (ARMHF) | Pi Zero, Pi 1, early Pi 2 | ❌ Not supported | ✅ Works |
| ARMv7 | Pi 2, Pi 3 (32-bit OS) | ✅ `build:armv7` | ✅ Works |
| ARM64 | Pi 3+, Pi 4, Pi 5 (64-bit OS) | ✅ `build:arm` | ✅ Works |

**Important:** For ARMHF/ARMv6 systems, browser mode is the ONLY option. Electron doesn't support ARMv6.

### DEB Package (ARMv7+ only)
The Electron Builder configuration ([package.json:28-53](package.json#L28-L53)) creates installable DEB packages with:
- System dependencies declared (GTK3, NSS3, etc.)
- Desktop entry for application menu
- Icon and category metadata
- **Does NOT support ARMHF/ARMv6**

### Browser-Based Deployment (All architectures)
The [start-timer-browser.sh](start-timer-browser.sh) script:
- Auto-detects screen resolution via `xrandr`
- Calculates 1/3 screen width for timer window
- Launches Chromium in `--app` mode (no browser chrome)
- Uses isolated user data directory
- **Works on ANY Raspberry Pi model**

### Side-by-Side Layout
[start-apps.sh](start-apps.sh) intelligently launches both apps:
1. Todoist in Chromium (left 2/3 of screen)
2. Timer (right 1/3 of screen) - auto-detects Electron vs browser mode:
   - If `npm` and `electron` available → Electron version
   - Otherwise → Browser version via [start-timer-browser.sh](start-timer-browser.sh)
3. Optional: Unclutter to hide mouse cursor

See [RASPBERRY_PI_SETUP.md](RASPBERRY_PI_SETUP.md) for complete deployment instructions including:
- ARMHF/ARMv6 browser-based installation
- Architecture detection (`uname -m`)
- Touchscreen calibration
- Auto-start configuration

## Common Modifications

### Changing Window Position
Edit [main.js:12](main.js#L12):
```javascript
const xPosition = 0;  // Left side
const xPosition = screenWidth - windowWidth;  // Right side (default)
```

### Adjusting Timer Range
Modify clamping in scroll handlers:
- [script.js:103](script.js#L103) - Touch scroll range
- [script.js:141](script.js#L141) - Mouse wheel range

### Customizing Presets
Edit preset button data attributes in [index.html:27-30](index.html#L27-L30):
```html
<button class="btn btn-preset" data-minutes="5">5 min</button>
```

### Modifying Colors
Key color variables in [styles.css](styles.css):
- Background: `#0a0a0a` (line 10)
- Accent green: `#10b981` (line 33)
- Warning yellow: `#fbbf24` (line 122)
