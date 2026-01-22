# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A minimalist countdown timer Electron desktop application optimized for touchscreen displays and Raspberry Pi. Features interactive time setting via scroll/swipe gestures, preset timers, and dramatic visual alerts. Designed to run side-by-side with other applications (e.g., Todoist) on dual-app displays.

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

## Architecture

### Application Structure
This is a pure JavaScript Electron application with no frameworks:
- **Electron app** ([main.js](main.js)) - Entry point, window management, positioned on right side of screen (600px wide)
- **Web interface** ([index.html](index.html), [styles.css](styles.css), [script.js](script.js)) - Timer UI and logic
- **Class-based state management** - Single `CountdownTimer` class handles all timer logic

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

### DEB Package
The Electron Builder configuration ([package.json:28-53](package.json#L28-L53)) creates installable DEB packages with:
- System dependencies declared (GTK3, NSS3, etc.)
- Desktop entry for application menu
- Icon and category metadata

### Side-by-Side Layout
Designed to work with [start-apps.sh](start-apps.sh) which launches:
1. Browser app (Todoist) on left side
2. Timer on right side
3. Unclutter to hide mouse cursor

See [RASPBERRY_PI_SETUP.md](RASPBERRY_PI_SETUP.md) for complete deployment instructions including touchscreen calibration and auto-start configuration.

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
