class CountdownTimer {
    constructor() {
        // DOM elements
        this.minutesDisplay = document.getElementById('minutes');
        this.secondsDisplay = document.getElementById('seconds');
        this.counterDisplay = document.getElementById('counter');
        this.startPauseBtn = document.getElementById('startPauseBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.presetButtons = document.querySelectorAll('.btn-preset');

        // Timer state
        this.currentMinutes = 0;
        this.currentSeconds = 0;
        this.totalSeconds = 0;
        this.intervalId = null;
        this.state = 'idle'; // idle, ready, running, paused, completed
        this.activePreset = null;

        // Touch scroll state
        this.touchStartY = 0;
        this.touchStartMinutes = 0;
        this.isTouching = false;

        this.initializeEventListeners();
        this.updateUI();
    }
    
    initializeEventListeners() {
        // Start/Pause button with touch support
        this.startPauseBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (this.state === 'ready' || this.state === 'paused') {
                this.startTimer();
            } else if (this.state === 'running') {
                this.pauseTimer();
            }
        });

        // Reset button with touch support
        this.resetBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.resetTimer();
        });

        // Preset buttons with touch support
        this.presetButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const minutes = parseInt(button.dataset.minutes);
                this.setPresetTime(minutes);
            });

            // Add visual feedback on touch
            button.addEventListener('touchstart', () => {
                button.style.transform = 'scale(0.92)';
            });

            button.addEventListener('touchend', () => {
                setTimeout(() => {
                    button.style.transform = '';
                }, 150);
            });
        });

        // Add touch feedback to control buttons
        [this.startPauseBtn, this.resetBtn].forEach(btn => {
            btn.addEventListener('touchstart', () => {
                if (!btn.disabled) {
                    btn.style.transform = 'scale(0.92)';
                }
            });

            btn.addEventListener('touchend', () => {
                setTimeout(() => {
                    btn.style.transform = '';
                }, 150);
            });
        });

        // Touch scroll on counter display to adjust minutes
        this.counterDisplay.addEventListener('touchstart', (e) => {
            // Only allow scrolling when not running
            if (this.state === 'running') return;

            this.isTouching = true;
            this.touchStartY = e.touches[0].clientY;
            this.touchStartMinutes = this.currentMinutes;
            this.counterDisplay.classList.add('touching');
            e.preventDefault();
        });

        this.counterDisplay.addEventListener('touchmove', (e) => {
            if (!this.isTouching || this.state === 'running') return;

            const touchY = e.touches[0].clientY;
            const deltaY = this.touchStartY - touchY;

            // Every 30 pixels of swipe = 1 minute
            const minuteChange = Math.floor(deltaY / 30);
            let newMinutes = this.touchStartMinutes + minuteChange;

            // Clamp between 1 and 999 minutes
            newMinutes = Math.max(1, Math.min(999, newMinutes));

            if (newMinutes !== this.currentMinutes) {
                this.currentMinutes = newMinutes;
                this.currentSeconds = 0;
                this.totalSeconds = newMinutes * 60;
                this.state = 'ready';
                this.activePreset = null; // Clear preset selection
                this.updateDisplay();
                this.updateUI();
                this.updatePresetButtons();
            }

            e.preventDefault();
        });

        this.counterDisplay.addEventListener('touchend', () => {
            this.isTouching = false;
            this.counterDisplay.classList.remove('touching');
        });

        this.counterDisplay.addEventListener('touchcancel', () => {
            this.isTouching = false;
            this.counterDisplay.classList.remove('touching');
        });

        // Mouse wheel support for desktop
        this.counterDisplay.addEventListener('wheel', (e) => {
            // Only allow scrolling when not running
            if (this.state === 'running') return;

            e.preventDefault();

            // Scroll up (negative deltaY) = increase, scroll down (positive) = decrease
            const direction = e.deltaY < 0 ? 1 : -1;
            let newMinutes = this.currentMinutes + direction;

            // Clamp between 1 and 999 minutes
            newMinutes = Math.max(1, Math.min(999, newMinutes));

            if (newMinutes !== this.currentMinutes) {
                this.currentMinutes = newMinutes;
                this.currentSeconds = 0;
                this.totalSeconds = newMinutes * 60;
                this.state = 'ready';
                this.activePreset = null; // Clear preset selection
                this.updateDisplay();
                this.updateUI();
                this.updatePresetButtons();
            }
        });
    }
    
    setPresetTime(minutes) {
        // Only allow setting presets when not running
        if (this.state === 'running') return;

        this.currentMinutes = minutes;
        this.currentSeconds = 0;
        this.totalSeconds = minutes * 60;
        this.state = 'ready';
        this.activePreset = minutes;

        this.updateDisplay();
        this.updateUI();
        this.updatePresetButtons();
    }
    
    startTimer() {
        if (this.totalSeconds <= 0) return;

        this.state = 'running';
        this.startPauseBtn.textContent = 'Pause';

        this.intervalId = setInterval(() => {
            this.totalSeconds--;
            this.updateTimeFromTotal();
            this.updateDisplay();

            // Add warning effect for last 10 seconds
            if (this.totalSeconds <= 10 && this.totalSeconds > 0) {
                this.counterDisplay.classList.add('warning');
            } else {
                this.counterDisplay.classList.remove('warning');
            }

            if (this.totalSeconds <= 0) {
                this.completeTimer();
            }
        }, 1000);

        this.updateUI();
    }
    
    pauseTimer() {
        this.state = 'paused';
        this.startPauseBtn.textContent = 'Start';

        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }

        // Keep warning animation if in warning zone
        if (this.totalSeconds > 10) {
            this.counterDisplay.classList.remove('warning');
        }

        this.updateUI();
    }
    
    resetTimer() {
        this.state = 'idle';
        this.currentMinutes = 0;
        this.currentSeconds = 0;
        this.totalSeconds = 0;
        this.activePreset = null;

        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }

        // Clean up any active animations
        this.counterDisplay.classList.remove('warning');
        this.counterDisplay.classList.remove('completed');
        document.body.classList.remove('timer-completed');

        this.updateDisplay();
        this.updateUI();
        this.updatePresetButtons();
    }
    
    completeTimer() {
        this.state = 'completed';
        this.currentMinutes = 0;
        this.currentSeconds = 0;
        this.totalSeconds = 0;

        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }

        // Remove warning animation
        this.counterDisplay.classList.remove('warning');

        // Trigger dramatic completion animation
        this.counterDisplay.classList.add('completed');
        document.body.classList.add('timer-completed');

        // Flash the entire background
        setTimeout(() => {
            this.counterDisplay.classList.remove('completed');
            document.body.classList.remove('timer-completed');
        }, 5000);

        this.updateUI();
    }
    
    updateTimeFromTotal() {
        this.currentMinutes = Math.floor(this.totalSeconds / 60);
        this.currentSeconds = this.totalSeconds % 60;
    }
    
    updateDisplay() {
        this.minutesDisplay.textContent = this.currentMinutes.toString().padStart(2, '0');
        this.secondsDisplay.textContent = this.currentSeconds.toString().padStart(2, '0');
    }
    
    updateUI() {
        // Update Start/Pause button
        switch (this.state) {
            case 'idle':
                this.startPauseBtn.disabled = true;
                this.startPauseBtn.textContent = 'Start';
                break;
            case 'ready':
                this.startPauseBtn.disabled = false;
                this.startPauseBtn.textContent = 'Start';
                break;
            case 'running':
                this.startPauseBtn.disabled = false;
                this.startPauseBtn.textContent = 'Pause';
                break;
            case 'paused':
                this.startPauseBtn.disabled = false;
                this.startPauseBtn.textContent = 'Start';
                break;
            case 'completed':
                this.startPauseBtn.disabled = true;
                this.startPauseBtn.textContent = 'Start';
                break;
        }

        // Reset button is always enabled (except during running, but we allow it)
        this.resetBtn.disabled = false;

        // Update preset buttons
        this.updatePresetButtons();
    }
    
    updatePresetButtons() {
        this.presetButtons.forEach(button => {
            const minutes = parseInt(button.dataset.minutes);
            
            // Disable preset buttons when timer is running
            if (this.state === 'running') {
                button.disabled = true;
                button.classList.remove('active');
            } else {
                button.disabled = false;
                
                // Highlight active preset
                if (this.activePreset === minutes && this.state !== 'idle') {
                    button.classList.add('active');
                } else {
                    button.classList.remove('active');
                }
            }
        });
    }
}

// Initialize the timer when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CountdownTimer();
});
