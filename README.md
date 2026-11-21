# Lantern Bay — Spot the Difference

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/taufan98/best-spot-the-difference-game/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/taufan98/best-spot-the-difference-game/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

Built for the make.fun bounty: https://make.fun/bounty/best-spot-the-difference-game-20261121-0451

An original spot-the-difference game for the make.fun bounty
`best-spot-the-difference-game-20261121-0451`. Two near-identical pictures
side by side, seven differences per scene, three scenes that grow harder:
Harbour at Dusk, Night Market, Lighthouse Garden. Every scene, sound and
name is original and drawn in code — no copied art, no network requests.

## Play

Open `game/index.html` in desktop Chrome (or `node serve.ts` and visit
http://localhost:8080). Click a difference in either picture to mark it
found on both. Wrong clicks cost 5 seconds; hints cost 15 seconds.

- **Mouse:** click differences · **H:** hint · **R:** restart level
- **1 / 2 / 3:** choose a level · **N:** next level · **M:** mute
- 180 seconds per level, 100 points per find plus a time bonus.

## Layout

- `game/index.html` — page, HUD and styles
- `game/src/main.js` — state, input, timer, scoring, rendering
- `game/src/scenes.js` — the three procedural scenes and their differences
- `game/src/audio.js` — synthesised WebAudio sound effects
- `game/src/shots.js` — `?shot=` presets for taking screenshots
- `main.ts` — the make.fun hand-in program (Node 22)
- `vendor/makefun-game.ts` — the kit's library, unchanged
- `screenshots/` — real renders of the game in a browser

## License

MIT — see `LICENSE`.
