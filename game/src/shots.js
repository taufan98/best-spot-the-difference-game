// shots.js — screenshot presets for the entry's own screenshots.
// ?shot=start  → title screen over the harbour scene
// ?shot=play   → harbour mid-game: 3 found (rings + ticks), 4 remaining
// ?shot=market → night market mid-game: 2 found, 5 remaining, hint pulsing
// ?shot=win    → lighthouse garden finished, win overlay
// Every preset is a state the game reaches by normal play; this only
// jumps straight to it so a screenshot can be taken.

import { SCENES } from './scenes.js';

export function applyShotPreset(state, api) {
  const params = new URLSearchParams(window.location.search);
  const shot = params.get('shot');
  if (!shot) return;
  const now = performance.now();
  if (shot === 'start') {
    api.startLevel(0);
    state.screen = 'title';
    state.found = new Set();
  } else if (shot === 'play') {
    api.startLevel(0);
    state.found = new Set(['moon', 'sail', 'dock-cat']);
    state.timeLeft = 132;
    state.score = 340;
    state.toast = 'Found! The dock cat wandered off  (+100)';
    state.toastUntil = now + 60000;
  } else if (shot === 'market') {
    api.startLevel(1);
    state.found = new Set(['melon', 'hat']);
    state.timeLeft = 148;
    state.score = 625;
    state.hintsLeft = 2;
    state.hintPulse = { diffId: 'kite', until: now + 60000 };
    state.toast = 'Hint: A kite appeared in the sky  (-15s)';
    state.toastUntil = now + 60000;
  } else if (shot === 'win') {
    api.startLevel(2);
    state.found = new Set(SCENES[2].diffs.map((d) => d.id));
    state.timeLeft = 96;
    state.score = 2480;
    state.screen = 'win';
    state.toast = '';
    state.toastUntil = 0;
  }
}
