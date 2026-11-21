// audio.js — tiny WebAudio sound effects, synthesised in code.
// No audio files, no network: every sound is an oscillator blip.

let ctx = null;
let muted = false;

export function setMuted(m) { muted = m; }
export function isMuted() { return muted; }

function ensureCtx() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone(freq, start, dur, type, vol) {
  if (muted) return;
  const ac = ensureCtx();
  if (!ac) return;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type || 'sine';
  osc.frequency.setValueAtTime(freq, ac.currentTime + start);
  gain.gain.setValueAtTime(0.0001, ac.currentTime + start);
  gain.gain.exponentialRampToValueAtTime(vol || 0.12, ac.currentTime + start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + start + dur);
  osc.connect(gain);
  gain.connect(ac.destination);
  osc.start(ac.currentTime + start);
  osc.stop(ac.currentTime + start + dur + 0.05);
}

export function playFound() {
  tone(660, 0, 0.16, 'sine', 0.14);
  tone(880, 0.09, 0.2, 'sine', 0.14);
  tone(1320, 0.18, 0.24, 'triangle', 0.08);
}

export function playWrong() {
  tone(180, 0, 0.18, 'square', 0.06);
  tone(140, 0.1, 0.2, 'square', 0.05);
}

export function playHint() {
  tone(520, 0, 0.12, 'sine', 0.1);
  tone(780, 0.08, 0.16, 'sine', 0.1);
}

export function playLevelComplete() {
  const notes = [523, 659, 784, 1047];
  notes.forEach((n, i) => tone(n, i * 0.11, 0.22, 'triangle', 0.12));
}

export function playWin() {
  const notes = [523, 659, 784, 1047, 784, 1047, 1319];
  notes.forEach((n, i) => tone(n, i * 0.13, 0.26, 'triangle', 0.12));
}

export function playTick() {
  tone(980, 0, 0.05, 'sine', 0.05);
}
