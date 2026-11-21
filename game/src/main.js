// main.js — Lantern Bay: Spot the Difference.
// Game state, input, timer, scoring, hints and rendering.
// Two near-identical panels side by side; click a difference in either
// panel to mark it found on both. Keyboard: H hint, N next, R restart,
// 1/2/3 choose a level, M mute.

import { SCENES, SCENE_W, SCENE_H } from './scenes.js';
import { playFound, playWrong, playHint, playLevelComplete, playWin, playTick, setMuted, isMuted } from './audio.js';
import { applyShotPreset } from './shots.js';

const PANEL_GAP = 40;
const PANEL_X = [20, 20 + SCENE_W + PANEL_GAP];
const PANEL_Y = 96;
const CANVAS_W = 20 + SCENE_W * 2 + PANEL_GAP + 20;
const CANVAS_H = PANEL_Y + SCENE_H + 16;

const LEVEL_TIME = 180;
const FIND_POINTS = 100;
const WRONG_PENALTY = 5;
const HINT_COST = 15;

const canvas = document.getElementById('game');
const g = canvas.getContext('2d');
canvas.width = CANVAS_W;
canvas.height = CANVAS_H;

const el = (id) => document.getElementById(id);

const state = {
  screen: 'title', // title | play | levelDone | win
  level: 0,
  found: new Set(),
  hintsUsed: 0,
  hintsLeft: 3,
  score: 0,
  timeLeft: LEVEL_TIME,
  lastTickSecond: LEVEL_TIME,
  wrongMarks: [], // {x, y, panel, until}
  hintPulse: null, // {diffId, until}
  toast: '',
  toastUntil: 0,
  totalFound: 0,
};

let lastFrame = performance.now();

function scene() { return SCENES[state.level]; }
function remaining() { return scene().diffs.length - state.found.size; }

function startLevel(i) {
  state.level = i;
  state.found = new Set();
  state.hintsLeft = 3;
  state.hintsUsed = 0;
  state.timeLeft = LEVEL_TIME;
  state.lastTickSecond = LEVEL_TIME;
  state.wrongMarks = [];
  state.hintPulse = null;
  state.screen = 'play';
  setToast(scene().name + ' — find all 7 differences!');
}

function setToast(msg) {
  state.toast = msg;
  state.toastUntil = performance.now() + 2600;
}

function markFound(diff) {
  state.found.add(diff.id);
  state.totalFound += 1;
  state.score += FIND_POINTS + Math.max(0, Math.floor(state.timeLeft / 10)) * 5;
  playFound();
  setToast('Found! ' + diff.label + '  (+' + FIND_POINTS + ')');
  if (state.found.size === scene().diffs.length) {
    const bonus = Math.floor(state.timeLeft) * 2;
    state.score += bonus;
    if (state.level === SCENES.length - 1) {
      state.screen = 'win';
      playWin();
    } else {
      state.screen = 'levelDone';
      playLevelComplete();
      setToast('Level complete! Time bonus +' + bonus);
    }
  }
}

function useHint() {
  if (state.screen !== 'play') return;
  if (state.hintsLeft <= 0) { setToast('No hints left!'); return; }
  const unfound = scene().diffs.filter((d) => !state.found.has(d.id));
  if (!unfound.length) return;
  const pick = unfound[Math.floor(Math.random() * unfound.length)];
  state.hintsLeft -= 1;
  state.hintsUsed += 1;
  state.timeLeft = Math.max(0, state.timeLeft - HINT_COST);
  state.hintPulse = { diffId: pick.id, until: performance.now() + 2400 };
  playHint();
  setToast('Hint: ' + pick.label + '  (-' + HINT_COST + 's)');
}

function panelAt(px, py) {
  for (let p = 0; p < 2; p++) {
    if (px >= PANEL_X[p] && px < PANEL_X[p] + SCENE_W && py >= PANEL_Y && py < PANEL_Y + SCENE_H) {
      return { panel: p, x: px - PANEL_X[p], y: py - PANEL_Y };
    }
  }
  return null;
}

function onClick(ev) {
  if (state.screen !== 'play') return;
  const rect = canvas.getBoundingClientRect();
  const px = (ev.clientX - rect.left) * (canvas.width / rect.width);
  const py = (ev.clientY - rect.top) * (canvas.height / rect.height);
  const hit = panelAt(px, py);
  if (!hit) return;
  for (const diff of scene().diffs) {
    if (state.found.has(diff.id)) continue;
    const dx = hit.x - diff.x;
    const dy = hit.y - diff.y;
    if (dx * dx + dy * dy <= diff.r * diff.r) {
      markFound(diff);
      return;
    }
  }
  // wrong click: red X on both panels, time penalty
  state.timeLeft = Math.max(0, state.timeLeft - WRONG_PENALTY);
  state.wrongMarks.push({ x: hit.x, y: hit.y, panel: hit.panel, until: performance.now() + 900 });
  playWrong();
  setToast('Not a difference — -' + WRONG_PENALTY + 's. Look closer!');
}

canvas.addEventListener('click', onClick);

document.addEventListener('keydown', (ev) => {
  const k = ev.key.toLowerCase();
  if (k === 'h') useHint();
  else if (k === 'm') { setMuted(!isMuted()); el('mute-btn').textContent = isMuted() ? 'Sound: off (M)' : 'Sound: on (M)'; }
  else if (k === 'r') startLevel(state.level);
  else if (k === 'n' && state.screen === 'levelDone') startLevel(state.level + 1);
  else if (k === '1' || k === '2' || k === '3') startLevel(Number(k) - 1);
  else if (k === 'enter' && state.screen === 'title') startLevel(0);
  else if (k === 'enter' && state.screen === 'win') { state.score = 0; state.totalFound = 0; startLevel(0); }
});

el('hint-btn').addEventListener('click', useHint);
el('restart-btn').addEventListener('click', () => startLevel(state.level));
el('mute-btn').addEventListener('click', () => {
  setMuted(!isMuted());
  el('mute-btn').textContent = isMuted() ? 'Sound: off (M)' : 'Sound: on (M)';
});
document.querySelectorAll('.level-btn').forEach((btn) => {
  btn.addEventListener('click', () => startLevel(Number(btn.dataset.level)));
});
el('next-btn').addEventListener('click', () => {
  if (state.screen === 'levelDone') startLevel(state.level + 1);
});
el('again-btn').addEventListener('click', () => {
  state.score = 0; state.totalFound = 0; startLevel(0);
});

// ------------------------------------------------------------- rendering
function drawPanels() {
  for (let p = 0; p < 2; p++) {
    g.save();
    g.translate(PANEL_X[p], PANEL_Y);
    g.beginPath();
    g.rect(0, 0, SCENE_W, SCENE_H);
    g.clip();
    scene().draw(g, p === 1);
    g.restore();
    // panel frame + label
    g.strokeStyle = '#2e2a33';
    g.lineWidth = 3;
    g.strokeRect(PANEL_X[p], PANEL_Y, SCENE_W, SCENE_H);
    g.fillStyle = 'rgba(30, 26, 40, 0.85)';
    g.fillRect(PANEL_X[p], PANEL_Y, 92, 26);
    g.fillStyle = '#ffe9a8';
    g.font = 'bold 14px sans-serif';
    g.textAlign = 'left';
    g.fillText(p === 0 ? 'PICTURE A' : 'PICTURE B', PANEL_X[p] + 10, PANEL_Y + 18);
  }
}

function drawFoundMarkers(now) {
  for (const diff of scene().diffs) {
    if (!state.found.has(diff.id)) continue;
    for (let p = 0; p < 2; p++) {
      const cx = PANEL_X[p] + diff.x;
      const cy = PANEL_Y + diff.y;
      g.strokeStyle = '#ffd76a';
      g.lineWidth = 4;
      g.beginPath(); g.arc(cx, cy, diff.r, 0, Math.PI * 2); g.stroke();
      g.strokeStyle = '#2e9e5b';
      g.lineWidth = 5;
      g.beginPath();
      g.moveTo(cx - 9, cy + 1); g.lineTo(cx - 2, cy + 8); g.lineTo(cx + 11, cy - 8);
      g.stroke();
    }
  }
}

function drawHintPulse(now) {
  if (!state.hintPulse || now > state.hintPulse.until) return;
  const diff = scene().diffs.find((d) => d.id === state.hintPulse.diffId);
  if (!diff) return;
  const pulse = 1 + 0.12 * Math.sin(now / 130);
  for (let p = 0; p < 2; p++) {
    const cx = PANEL_X[p] + diff.x;
    const cy = PANEL_Y + diff.y;
    g.strokeStyle = '#8ad6ff';
    g.lineWidth = 3;
    g.setLineDash([8, 6]);
    g.beginPath(); g.arc(cx, cy, diff.r * pulse + 4, 0, Math.PI * 2); g.stroke();
    g.setLineDash([]);
  }
}

function drawWrongMarks(now) {
  state.wrongMarks = state.wrongMarks.filter((m) => now < m.until);
  for (const m of state.wrongMarks) {
    const cx = PANEL_X[m.panel] + m.x;
    const cy = PANEL_Y + m.y;
    g.strokeStyle = '#ff5a4e';
    g.lineWidth = 4;
    g.beginPath();
    g.moveTo(cx - 10, cy - 10); g.lineTo(cx + 10, cy + 10);
    g.moveTo(cx + 10, cy - 10); g.lineTo(cx - 10, cy + 10);
    g.stroke();
  }
}

function drawOverlay(title, lines, buttons) {
  g.fillStyle = 'rgba(20, 16, 32, 0.72)';
  g.fillRect(0, 0, CANVAS_W, CANVAS_H);
  g.fillStyle = '#fff3d6';
  g.textAlign = 'center';
  g.font = 'bold 44px Georgia, serif';
  g.fillText(title, CANVAS_W / 2, 190);
  g.font = '19px Georgia, serif';
  g.fillStyle = '#ffe9a8';
  lines.forEach((line, i) => g.fillText(line, CANVAS_W / 2, 240 + i * 32));
  g.font = '16px sans-serif';
  g.fillStyle = '#c9c2d6';
  buttons.forEach((b, i) => g.fillText(b, CANVAS_W / 2, 400 + i * 28));
}

function draw(now) {
  g.clearRect(0, 0, CANVAS_W, CANVAS_H);
  // backdrop
  g.fillStyle = '#1d1830';
  g.fillRect(0, 0, CANVAS_W, CANVAS_H);
  drawPanels();
  drawFoundMarkers(now);
  drawHintPulse(now);
  drawWrongMarks(now);
  if (state.screen === 'title') {
    drawOverlay('LANTERN BAY', [
      'Spot the Difference',
      'Two pictures, seven differences. Click a difference in either picture.',
      'Three scenes grow harder — harbour, night market, lighthouse garden.',
    ], ['Press ENTER or click a level below to play', 'H = hint (-15s)   •   R = restart   •   M = sound']);
  } else if (state.screen === 'levelDone') {
    drawOverlay(scene().name + ' — complete!', [
      'All 7 differences found. Score: ' + state.score,
      'Next: ' + SCENES[state.level + 1].name + ' — ' + SCENES[state.level + 1].hint,
    ], ['Press N or the Next button to continue']);
  } else if (state.screen === 'win') {
    drawOverlay('You found them all!', [
      '21 differences across three scenes.',
      'Final score: ' + state.score + '   •   Hints used: ' + state.hintsUsed,
      'Lantern Bay thanks its sharpest-eyed visitor.',
    ], ['Press ENTER to play again']);
  }
  // toast
  if (now < state.toastUntil) {
    g.font = 'bold 17px sans-serif';
    const w = g.measureText(state.toast).width + 28;
    g.fillStyle = 'rgba(30, 26, 40, 0.88)';
    g.beginPath();
    g.roundRect((CANVAS_W - w) / 2, CANVAS_H - 52, w, 34, 8);
    g.fill();
    g.fillStyle = '#ffe9a8';
    g.textAlign = 'center';
    g.fillText(state.toast, CANVAS_W / 2, CANVAS_H - 29);
  }
}

function updateHud() {
  el('level-name').textContent = 'Level ' + (state.level + 1) + ' of 3 — ' + scene().name;
  el('found-count').textContent = 'Found ' + state.found.size + ' of 7  •  ' + remaining() + ' remaining';
  const t = Math.max(0, Math.ceil(state.timeLeft));
  el('timer').textContent = 'Time ' + Math.floor(t / 60) + ':' + String(t % 60).padStart(2, '0');
  el('timer').classList.toggle('low', t <= 30 && state.screen === 'play');
  el('score').textContent = 'Score ' + state.score;
  el('hint-btn').textContent = 'Hint (H) — ' + state.hintsLeft + ' left';
  el('hint-btn').disabled = state.screen !== 'play' || state.hintsLeft <= 0;
  el('next-btn').style.display = state.screen === 'levelDone' ? '' : 'none';
  el('again-btn').style.display = state.screen === 'win' ? '' : 'none';
  el('level-bar').style.display = state.screen === 'title' ? '' : 'none';
}

function frame(now) {
  const dt = Math.min(0.1, (now - lastFrame) / 1000);
  lastFrame = now;
  if (state.screen === 'play') {
    state.timeLeft -= dt;
    const sec = Math.ceil(state.timeLeft);
    if (sec !== state.lastTickSecond) {
      state.lastTickSecond = sec;
      if (sec <= 10 && sec > 0) playTick();
    }
    if (state.timeLeft <= 0) {
      startLevel(state.level);
      setToast("Time's up! The level restarted — find all 7 before the clock runs out.");
    }
  }
  updateHud();
  draw(now);
  requestAnimationFrame(frame);
}

// Screenshot presets (?shot=start|play|market|win) — real game states,
// used only to take the entry's screenshots.
applyShotPreset(state, { startLevel, markFound, setToast });

// Exposed for automated play-testing (click tests read the live state).
window.__lanternBay = state;

requestAnimationFrame(frame);
