/**
 * Web Audio API Engine: Minimal, Ultra-Clean, Non-Intrusive UI Sound Design
 * Zero external asset downloads, zero harsh frequencies, zero ear fatigue.
 * 
 * Design Philosophy:
 * - Extremely gentle, whisper-soft acoustic profile (gain < 0.045).
 * - Zero continuous scrolling hum or drone (silenced).
 * - Zero machine-gun typing clicks (clean visual typewriter).
 * - Single, subtle, satisfying tactile click on actual button press.
 * - Soft, organic micro-tone on interactive hover.
 */

let audioCtx = null;
let soundEnabled = true;
let masterGain = null;

let lastHoverTime = 0;
let lastClickTime = 0;

/**
 * Initialize or resume AudioContext safely upon first user interaction
 */
export const initAudioContext = () => {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
      masterGain = audioCtx.createGain();
      // Soft, gentle master volume (0.75 max)
      masterGain.gain.setValueAtTime(soundEnabled ? 0.75 : 0.0, audioCtx.currentTime);
      masterGain.connect(audioCtx.destination);
    }
  }

  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
};

export const setSoundEnabled = (enabled) => {
  soundEnabled = enabled;
  initAudioContext();
  if (masterGain && audioCtx) {
    masterGain.gain.setTargetAtTime(enabled ? 0.75 : 0.0, audioCtx.currentTime, 0.05);
  }
};

export const isSoundEnabled = () => soundEnabled;

/**
 * Clean, subtle, soft tactile click (40ms, warm, non-fatiguing)
 * Single gentle micro-switch snap.
 */
export const playClickSound = () => {
  if (!soundEnabled) return;
  initAudioContext();
  if (!audioCtx || audioCtx.state !== 'running') return;

  const now = performance.now();
  if (now - lastClickTime < 60) return; // Debounce rapid click spam
  lastClickTime = now;

  try {
    const t = audioCtx.currentTime;

    // Warm, gentle tactile click (600Hz -> 180Hz, soft decay)
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(650, t);
    osc.frequency.exponentialRampToValueAtTime(180, t + 0.038);

    // Warm lowpass filter to remove any harsh clicks or pops
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, t);

    // Gentle, soft gain envelope
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.linearRampToValueAtTime(0.045, t + 0.001);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.04);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);

    osc.start(t);
    osc.stop(t + 0.042);
  } catch {
    // Graceful silence
  }
};

// Aliases for compatibility
export const playButtonDownSound = () => playClickSound();
export const playButtonUpSound = () => {}; // Silenced so there is no double-click clatter

/**
 * Soft, whisper-quiet micro-hover tone (50ms)
 * Gentle warm organic blip, low volume, throttled to prevent audio clutter.
 */
export const playHoverSound = () => {
  if (!soundEnabled) return;
  initAudioContext();
  if (!audioCtx || audioCtx.state !== 'running') return;

  const now = performance.now();
  // Generous throttle (80ms) so fast cursor movements don't create audio barrage
  if (now - lastHoverTime < 80) return;
  lastHoverTime = now;

  try {
    const t = audioCtx.currentTime;

    // Soft warm droplet sine (1250Hz -> 850Hz)
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1250, t);
    osc.frequency.exponentialRampToValueAtTime(850, t + 0.045);

    // Lowpass filter keeps it warm and smooth
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1800, t);

    // Whisper-quiet volume (0.016)
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.linearRampToValueAtTime(0.016, t + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);

    osc.start(t);
    osc.stop(t + 0.052);
  } catch {
    // Graceful silence
  }
};

/**
 * Continuous scroll sound silenced to protect against ear fatigue
 */
export const updateScrollSound = () => {
  // Completely silent on scroll as requested by user
};

/**
 * Typing sound silenced to prevent machine-gun audio spam
 */
export const playTypingSound = () => {
  // Silent to ensure clean visual typography without buzzing
};

/**
 * Form Submit / Success Chime (250ms clean finish)
 * Gentle warm two-note harmonic chime (E5 -> A5).
 */
export const playSuccessSound = () => {
  if (!soundEnabled) return;
  initAudioContext();
  if (!audioCtx || audioCtx.state !== 'running') return;

  try {
    const t = audioCtx.currentTime;

    const notes = [
      { freq: 659.25, timeOffset: 0.0, dur: 0.14 },
      { freq: 880.00, timeOffset: 0.09, dur: 0.22 }
    ];

    notes.forEach((n) => {
      const startTime = t + n.timeOffset;

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(n.freq, startTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2200, startTime);

      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(0.055, startTime + 0.003);
      gain.gain.exponentialRampToValueAtTime(0.0005, startTime + n.dur);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);

      osc.start(startTime);
      osc.stop(startTime + n.dur);
    });
  } catch {
    // Graceful silence
  }
};
