/**
 * Native Web Audio API Procedural Synthesizer
 * Zero External Dependencies (No MP3/WAV files required)
 * Offline-first and CORS-free
 */

class AudioSynthesizer {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.initFromStorage();
  }

  initFromStorage() {
    try {
      const stored = localStorage.getItem('cuet_df_sound_enabled');
      if (stored !== null) {
        this.muted = stored === 'false';
      }
    } catch (e) {
      this.muted = false;
    }
  }

  ensureContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  isMuted() {
    return this.muted;
  }

  setMuted(muted) {
    this.muted = !!muted;
    try {
      localStorage.setItem('cuet_df_sound_enabled', String(!this.muted));
    } catch (e) {}
  }

  toggleMute() {
    this.setMuted(!this.muted);
    return this.muted;
  }

  // Positive cheerful chime: C5 (523Hz) -> E5 (659Hz) -> G5 (784Hz)
  playCorrect() {
    if (this.muted) return;
    try {
      this.ensureContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [
        { f: 523.25, start: 0, dur: 0.12 },
        { f: 659.25, start: 0.08, dur: 0.14 },
        { f: 783.99, start: 0.16, dur: 0.28 }
      ];

      notes.forEach(n => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(n.f, now + n.start);

        gain.gain.setValueAtTime(0, now + n.start);
        gain.gain.linearRampToValueAtTime(0.2, now + n.start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + n.start + n.dur);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + n.start);
        osc.stop(now + n.start + n.dur);
      });
    } catch (e) {}
  }

  // Gentle low error tone: 220Hz -> 164Hz descending buzz
  playIncorrect() {
    if (this.muted) return;
    try {
      this.ensureContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(164.81, now + 0.25);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch (e) {}
  }

  // Subtle UI tap sound
  playClick() {
    if (this.muted) return;
    try {
      this.ensureContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch (e) {}
  }

  // Victory fanfare for quiz completion
  playComplete() {
    if (this.muted) return;
    try {
      this.ensureContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const arpeggio = [
        { f: 523.25, start: 0, dur: 0.15 },
        { f: 659.25, start: 0.12, dur: 0.15 },
        { f: 783.99, start: 0.24, dur: 0.18 },
        { f: 1046.50, start: 0.38, dur: 0.45 }
      ];

      arpeggio.forEach(n => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.f, now + n.start);

        gain.gain.setValueAtTime(0, now + n.start);
        gain.gain.linearRampToValueAtTime(0.22, now + n.start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + n.start + n.dur);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + n.start);
        osc.stop(now + n.start + n.dur);
      });
    } catch (e) {}
  }
}

window.quizAudio = new AudioSynthesizer();
