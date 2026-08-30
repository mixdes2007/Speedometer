// Web Audio API sound synthesizer for automotive speed alerts

class SpeedSoundAlarm {
  private audioCtx: AudioContext | null = null;
  private isMuted: boolean = false;
  private currentMode: 'none' | 'warning' | 'overspeed' = 'none';
  private intervalId: number | null = null;

  private initContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopAlarm();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public playTone(freq: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.4) {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      // Smooth attack and release to avoid audio click
      const now = this.audioCtx.currentTime;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(volume, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch {
      // Ignore audio failure if not interacted yet
    }
  }

  public setAlarmState(state: 'normal' | 'warning' | 'overspeed') {
    if (this.isMuted || state === 'normal') {
      this.stopAlarm();
      this.currentMode = 'none';
      return;
    }

    if (state === this.currentMode && this.intervalId !== null) {
      return; // Already playing this pattern
    }

    this.stopAlarm();
    this.currentMode = state;
    this.initContext();

    if (state === 'warning') {
      // Pulsing yellow warning beep (2 short beeps every 800ms)
      const playWarningPulse = () => {
        this.playTone(880, 0.12, 'square', 0.25); // A5 note
        setTimeout(() => {
          if (this.currentMode === 'warning') {
            this.playTone(880, 0.12, 'square', 0.25);
          }
        }, 150);
      };
      playWarningPulse();
      this.intervalId = window.setInterval(playWarningPulse, 750);
    } else if (state === 'overspeed') {
      // Urgent siren pattern (rapid high pitched alternating beeps)
      let high = true;
      const playOverspeedPulse = () => {
        const freq = high ? 1200 : 950;
        this.playTone(freq, 0.15, 'sawtooth', 0.35);
        high = !high;
      };
      playOverspeedPulse();
      this.intervalId = window.setInterval(playOverspeedPulse, 240);
    }
  }

  public stopAlarm() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.currentMode = 'none';
  }

  public playClick() {
    this.playTone(600, 0.04, 'sine', 0.15);
  }
}

export const soundAlarm = new SpeedSoundAlarm();
