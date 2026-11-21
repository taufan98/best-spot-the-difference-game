// scenes.js — the three original scenes of Lantern Bay.
// Each scene is drawn procedurally on a canvas, twice: once as the
// original (variant=false, left panel) and once with its differences
// applied (variant=true, right panel). All art is drawn here in code;
// no image files, no network. Scene space is 560 x 420 per panel.

export const SCENE_W = 560;
export const SCENE_H = 420;

function rr(g, x, y, w, h, r) {
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}

function star(g, x, y, r) {
  g.beginPath();
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    const rad = i % 2 === 0 ? r : r * 0.45;
    const px = x + Math.cos(a) * rad;
    const py = y + Math.sin(a) * rad;
    if (i === 0) g.moveTo(px, py);
    else g.lineTo(px, py);
  }
  g.closePath();
}

function gull(g, x, y, s) {
  g.beginPath();
  g.moveTo(x - 10 * s, y);
  g.quadraticCurveTo(x - 4 * s, y - 8 * s, x, y);
  g.quadraticCurveTo(x + 4 * s, y - 8 * s, x + 10 * s, y);
  g.stroke();
}

function lantern(g, x, y, color) {
  g.fillStyle = '#5a3a1a';
  g.fillRect(x - 2, y - 16, 4, 4);
  g.fillStyle = color;
  g.beginPath();
  g.ellipse(x, y, 11, 14, 0, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = '#ffe9a8';
  g.beginPath();
  g.ellipse(x, y, 5, 9, 0, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = '#5a3a1a';
  g.fillRect(x - 2, y + 13, 4, 4);
  g.fillStyle = 'rgba(255, 210, 110, 0.18)';
  g.beginPath();
  g.arc(x, y, 26, 0, Math.PI * 2);
  g.fill();
}

function cat(g, x, y, color) {
  g.fillStyle = color;
  g.beginPath();
  g.ellipse(x, y, 16, 11, 0, 0, Math.PI * 2); // body
  g.fill();
  g.beginPath();
  g.arc(x + 14, y - 10, 9, 0, Math.PI * 2); // head
  g.fill();
  g.beginPath(); // ears
  g.moveTo(x + 7, y - 15); g.lineTo(x + 9, y - 24); g.lineTo(x + 13, y - 16);
  g.moveTo(x + 15, y - 17); g.lineTo(x + 19, y - 25); g.lineTo(x + 21, y - 16);
  g.fill();
  g.beginPath(); // tail
  g.moveTo(x - 14, y + 2);
  g.quadraticCurveTo(x - 26, y - 6, x - 22, y - 18);
  g.lineWidth = 4; g.strokeStyle = color; g.stroke();
  g.lineWidth = 1;
  g.fillStyle = '#ffe9a8'; // eye
  g.beginPath(); g.arc(x + 17, y - 11, 1.8, 0, Math.PI * 2); g.fill();
}

// ---------------------------------------------------------------- scene 1
function drawHarbour(g, v) {
  // dusk sky
  const sky = g.createLinearGradient(0, 0, 0, 300);
  sky.addColorStop(0, '#2b2350');
  sky.addColorStop(0.6, '#7a4a7d');
  sky.addColorStop(1, '#e8836b');
  g.fillStyle = sky;
  g.fillRect(0, 0, SCENE_W, 300);
  // stars
  g.fillStyle = '#fff8d6';
  const stars = [[40, 40], [110, 24], [180, 55], [250, 30], [330, 48], [90, 90], [300, 90], [210, 75], [430, 30]];
  for (const [x, y] of stars) { star(g, x, y, 3); g.fill(); }
  // moon: crescent (left) vs full (right) — difference 1
  g.fillStyle = '#ffeec2';
  g.beginPath(); g.arc(470, 62, 26, 0, Math.PI * 2); g.fill();
  if (!v) {
    g.fillStyle = '#7a4a7d';
    g.beginPath(); g.arc(480, 56, 23, 0, Math.PI * 2); g.fill();
  }
  // distant hills
  g.fillStyle = '#4a3560';
  g.beginPath();
  g.moveTo(0, 250); g.quadraticCurveTo(120, 190, 260, 245);
  g.quadraticCurveTo(400, 285, 560, 235); g.lineTo(560, 300); g.lineTo(0, 300);
  g.fill();
  // house on the left cliff
  g.fillStyle = '#3a2a4d';
  g.fillRect(28, 180, 92, 70);
  g.fillStyle = '#6b3a4d';
  g.beginPath(); g.moveTo(20, 182); g.lineTo(74, 148); g.lineTo(128, 182); g.closePath(); g.fill();
  // window: lit warm (left) vs dark (right) — difference 2
  g.fillStyle = v ? '#241a33' : '#ffd76a';
  g.fillRect(58, 200, 18, 22);
  g.fillStyle = v ? '#241a33' : '#ffd76a';
  g.fillRect(88, 200, 14, 14);
  // sea
  const sea = g.createLinearGradient(0, 300, 0, SCENE_H);
  sea.addColorStop(0, '#3a5a8c'); sea.addColorStop(1, '#22355c');
  g.fillStyle = sea;
  g.fillRect(0, 300, SCENE_W, 120);
  g.strokeStyle = 'rgba(255, 220, 150, 0.5)';
  g.lineWidth = 2;
  for (let i = 0; i < 5; i++) {
    g.beginPath();
    g.moveTo(60 + i * 30, 330 + i * 16);
    g.lineTo(180 + i * 40, 330 + i * 16);
    g.stroke();
  }
  // moon reflection
  g.fillStyle = 'rgba(255, 238, 194, 0.35)';
  for (let i = 0; i < 4; i++) g.fillRect(448 - i * 6, 312 + i * 22, 44 + i * 12, 5);
  // buoy: striped (left) vs plain red (right) — difference 3
  g.fillStyle = '#d64545';
  g.beginPath(); g.arc(150, 352, 13, 0, Math.PI * 2); g.fill();
  g.fillRect(144, 330, 12, 12);
  if (!v) { g.fillStyle = '#fff3d6'; g.fillRect(137, 348, 26, 7); }
  // boat with sail: red sail (left) vs teal sail (right) — difference 4
  g.fillStyle = '#5a3a28';
  g.beginPath(); g.moveTo(300, 350); g.lineTo(420, 350); g.lineTo(400, 372); g.lineTo(320, 372); g.closePath(); g.fill();
  g.fillStyle = '#6b4a30';
  g.fillRect(356, 280, 5, 72);
  g.fillStyle = v ? '#2a9d8f' : '#e05a4e';
  g.beginPath(); g.moveTo(361, 284); g.lineTo(361, 344); g.lineTo(412, 344); g.closePath(); g.fill();
  g.fillStyle = v ? '#2a9d8f' : '#e05a4e';
  g.globalAlpha = 0.85;
  g.beginPath(); g.moveTo(356, 292); g.lineTo(356, 344); g.lineTo(318, 344); g.closePath(); g.fill();
  g.globalAlpha = 1;
  // pier
  g.fillStyle = '#4a3220';
  g.fillRect(0, 268, 210, 12);
  for (let x = 16; x < 210; x += 34) g.fillRect(x, 280, 8, 26);
  // pier lantern: present (left) vs missing (right) — difference 5
  if (!v) {
    g.fillStyle = '#3a2818';
    g.fillRect(188, 232, 5, 38);
    lantern(g, 190, 224, '#ff5a4e');
  }
  // cat on the dock: present (left) vs absent (right) — difference 6
  if (!v) cat(g, 96, 258, '#2e2a33');
  // gulls: two (left) vs three (right) — difference 7
  g.strokeStyle = '#2e2a33';
  g.lineWidth = 2;
  gull(g, 250, 110, 1);
  gull(g, 300, 88, 0.8);
  if (v) gull(g, 350, 118, 0.9);
  g.lineWidth = 1;
}

// ---------------------------------------------------------------- scene 2
function drawMarket(g, v) {
  // night sky + string lights
  const sky = g.createLinearGradient(0, 0, 0, 200);
  sky.addColorStop(0, '#1d2440'); sky.addColorStop(1, '#4a3a6b');
  g.fillStyle = sky; g.fillRect(0, 0, SCENE_W, 200);
  g.strokeStyle = '#8a7a5a'; g.lineWidth = 2;
  g.beginPath(); g.moveTo(0, 40); g.quadraticCurveTo(280, 90, 560, 36); g.stroke();
  const bulbColors = ['#ffd76a', '#ff8a7a', '#8ad6ff', '#b8ff9a'];
  for (let i = 0; i < 9; i++) {
    const t = i / 8;
    const x = 20 + t * 520;
    const y = 40 + Math.sin(t * Math.PI) * 22 + (t < 0.5 ? t * 20 : (1 - t) * 20) * 0.4;
    g.fillStyle = bulbColors[i % 4];
    g.beginPath(); g.arc(x, y + 8, 6, 0, Math.PI * 2); g.fill();
  }
  // kite: absent (left) vs flying (right) — difference 1
  if (v) {
    g.strokeStyle = '#e8e0ff'; g.lineWidth = 1.5;
    g.beginPath(); g.moveTo(470, 130); g.lineTo(430, 190); g.stroke();
    g.fillStyle = '#ff6b9d';
    g.beginPath(); g.moveTo(470, 108); g.lineTo(492, 128); g.lineTo(470, 146); g.lineTo(450, 128); g.closePath(); g.fill();
  }
  // ground
  g.fillStyle = '#6b4a34'; g.fillRect(0, 300, SCENE_W, 120);
  g.fillStyle = '#7d5a40';
  for (let i = 0; i < 8; i++) g.fillRect(0, 306 + i * 14, SCENE_W, 2);
  // stall 1 (left): awning stripes red/cream (left) vs teal/cream (right) — difference 2
  g.fillStyle = '#3a2a20';
  g.fillRect(30, 210, 170, 95);
  for (let i = 0; i < 6; i++) {
    g.fillStyle = i % 2 === 0 ? (v ? '#2a9d8f' : '#d64545') : '#fff3d6';
    g.beginPath(); g.moveTo(30 + i * 29, 210); g.lineTo(30 + i * 29 + 14, 178); g.lineTo(30 + i * 29 + 29, 178); g.lineTo(30 + i * 29 + 15, 210); g.closePath(); g.fill();
  }
  g.fillStyle = '#8a6a4a'; g.fillRect(30, 268, 170, 10);
  // melons on the counter: three (left) vs four (right) — difference 3
  g.fillStyle = '#3f9e4d';
  for (const [x, y] of [[70, 252], [105, 252], [140, 252]]) { g.beginPath(); g.arc(x, y, 13, 0, Math.PI * 2); g.fill(); }
  if (v) { g.beginPath(); g.arc(172, 252, 13, 0, Math.PI * 2); g.fill(); }
  g.fillStyle = '#2a6b35';
  g.fillRect(66, 236, 3, 6); g.fillRect(101, 236, 3, 6); g.fillRect(136, 236, 3, 6);
  // sign: "TEA" (left) vs "TEA!" (right) — difference 4
  g.fillStyle = '#fff3d6';
  rr(g, 60, 218, 110, 26, 6); g.fill();
  g.fillStyle = '#3a2a20';
  g.font = 'bold 17px sans-serif';
  g.textAlign = 'center';
  g.fillText(v ? 'TEA !' : 'TEA', 115, 237);
  // stall 2 (right)
  g.fillStyle = '#2e2438';
  g.fillRect(330, 210, 190, 95);
  for (let i = 0; i < 6; i++) {
    g.fillStyle = i % 2 === 0 ? '#e8a13a' : '#fff3d6';
    g.beginPath(); g.moveTo(330 + i * 32, 210); g.lineTo(330 + i * 32 + 16, 178); g.lineTo(330 + i * 32 + 32, 178); g.lineTo(330 + i * 32 + 16, 210); g.closePath(); g.fill();
  }
  g.fillStyle = '#8a6a4a'; g.fillRect(330, 268, 190, 10);
  // hanging lanterns: red (left) vs gold (right) — difference 5
  lantern(g, 360, 226, v ? '#ffd76a' : '#ff5a4e');
  lantern(g, 420, 226, v ? '#ffd76a' : '#ff5a4e');
  lantern(g, 480, 226, v ? '#ffd76a' : '#ff5a4e');
  // vendor: hat red (left) vs blue (right) — difference 6
  g.fillStyle = '#e8b88a';
  g.beginPath(); g.arc(430, 292, 13, 0, Math.PI * 2); g.fill();
  g.fillStyle = v ? '#3a6bd6' : '#d64545';
  g.beginPath(); g.moveTo(414, 288); g.lineTo(446, 288); g.lineTo(430, 268); g.closePath(); g.fill();
  g.fillStyle = '#4a6b8a';
  g.fillRect(412, 304, 36, 22);
  // crates: two stacked (left) vs one (right) — difference 7
  g.fillStyle = '#8a6a3a';
  g.fillRect(240, 280, 46, 26);
  g.fillRect(246, 306, 34, 14);
  if (!v) { g.fillRect(244, 254, 38, 24); g.strokeStyle = '#5a4020'; g.strokeRect(244, 254, 38, 24); }
  g.strokeStyle = '#5a4020'; g.lineWidth = 2;
  g.strokeRect(240, 280, 46, 26);
  g.lineWidth = 1;
  // sleeping cat on a crate
  cat(g, 505, 296, '#c98a4a');
  g.fillStyle = '#fff3d6';
  g.font = '13px sans-serif'; g.textAlign = 'left';
  g.fillText('Lantern Market — find 7 differences', 30, 400);
}

// ---------------------------------------------------------------- scene 3
function drawGarden(g, v) {
  // sky
  const sky = g.createLinearGradient(0, 0, 0, 260);
  sky.addColorStop(0, '#8ec8e8'); sky.addColorStop(1, '#ffe9b8');
  g.fillStyle = sky; g.fillRect(0, 0, SCENE_W, 260);
  g.fillStyle = '#fff8d6';
  for (const [x, y] of [[60, 50], [150, 80], [260, 40], [400, 60], [500, 45]]) { star(g, x, y, 4); g.fill(); }
  // sun
  g.fillStyle = '#ffd76a';
  g.beginPath(); g.arc(490, 60, 24, 0, Math.PI * 2); g.fill();
  // clouds
  g.fillStyle = 'rgba(255,255,255,0.9)';
  for (const [x, y] of [[110, 70], [330, 95]]) {
    g.beginPath(); g.ellipse(x, y, 42, 14, 0, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.ellipse(x + 22, y - 6, 26, 11, 0, 0, Math.PI * 2); g.fill();
  }
  // lighthouse
  g.fillStyle = '#e8e0d0';
  g.beginPath(); g.moveTo(120, 300); g.lineTo(140, 130); g.lineTo(180, 130); g.lineTo(200, 300); g.closePath(); g.fill();
  g.fillStyle = '#d64545';
  g.fillRect(128, 250, 64, 18);
  g.fillRect(136, 200, 48, 18);
  g.fillRect(142, 155, 36, 16);
  g.fillStyle = '#3a3a4a';
  g.fillRect(136, 104, 48, 28);
  g.fillStyle = '#ffd76a';
  g.fillRect(146, 110, 28, 16);
  // beam: shining (left) vs off (right) — difference 1
  if (!v) {
    g.fillStyle = 'rgba(255, 215, 106, 0.35)';
    g.beginPath(); g.moveTo(160, 118); g.lineTo(420, 60); g.lineTo(420, 150); g.lineTo(160, 128); g.closePath(); g.fill();
  }
  // bird on the lighthouse roof: present (left) vs absent (right) — difference 2
  if (!v) {
    g.strokeStyle = '#2e2a33'; g.lineWidth = 2;
    gull(g, 160, 98, 0.7);
    g.lineWidth = 1;
  }
  // garden ground
  g.fillStyle = '#5a9e4d'; g.fillRect(0, 300, SCENE_W, 120);
  g.fillStyle = '#4a8a42'; g.fillRect(0, 300, SCENE_W, 8);
  // path: stones, extra stone (right) — difference 3
  g.fillStyle = '#d8cbb0';
  for (const [x, y] of [[250, 320], [270, 350], [250, 380], [290, 395]]) {
    g.beginPath(); g.ellipse(x, y, 22, 10, 0, 0, Math.PI * 2); g.fill();
  }
  if (v) { g.beginPath(); g.ellipse(310, 330, 22, 10, 0, 0, Math.PI * 2); g.fill(); }
  // fence: full (left) vs one post missing (right) — difference 4
  g.fillStyle = '#8a6a4a';
  g.fillRect(0, 316, 120, 6);
  for (let i = 0; i < 5; i++) {
    if (v && i === 2) continue;
    g.fillRect(8 + i * 24, 296, 7, 34);
    g.beginPath(); g.moveTo(8 + i * 24, 296); g.lineTo(11 + i * 24, 288); g.lineTo(15 + i * 24, 296); g.closePath(); g.fill();
  }
  // flowers: red tulips (left) vs purple (right) — difference 5
  for (const [x, y] of [[350, 350], [390, 370], [430, 348], [470, 372], [510, 352]]) {
    g.strokeStyle = '#3a7a34'; g.lineWidth = 3;
    g.beginPath(); g.moveTo(x, y); g.lineTo(x, y - 22); g.stroke();
    g.fillStyle = v ? '#9d6bd6' : '#e05a4e';
    g.beginPath(); g.arc(x, y - 26, 9, 0, Math.PI * 2); g.fill();
    g.lineWidth = 1;
  }
  // butterfly: absent (left) vs present (right) — difference 6
  if (v) {
    g.fillStyle = '#ff8ad6';
    g.beginPath(); g.ellipse(420, 210, 10, 7, -0.5, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.ellipse(434, 210, 10, 7, 0.5, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#3a2a20'; g.fillRect(425, 204, 3, 14);
  }
  // cottage window: round (left) vs square (right) — difference 7
  g.fillStyle = '#f0e0c0';
  g.fillRect(440, 300, 90, 60);
  g.fillStyle = '#8a3a3a';
  g.beginPath(); g.moveTo(432, 302); g.lineTo(485, 268); g.lineTo(538, 302); g.closePath(); g.fill();
  g.fillStyle = '#7ab8e8';
  if (v) { g.fillRect(468, 318, 26, 26); } else { g.beginPath(); g.arc(481, 331, 13, 0, Math.PI * 2); g.fill(); }
  g.fillStyle = '#5a3a28';
  g.fillRect(492, 330, 20, 30);
  g.fillStyle = '#fff3d6';
  g.font = '13px sans-serif'; g.textAlign = 'left';
  g.fillText('Lighthouse Garden — find 7 differences', 30, 400);
}

export const SCENES = [
  {
    id: 'harbour',
    name: 'Harbour at Dusk',
    hint: 'Look at the sky, the sea and the pier.',
    draw: drawHarbour,
    diffs: [
      { id: 'moon', x: 470, y: 62, r: 30, label: 'The moon changed shape' },
      { id: 'window', x: 67, y: 211, r: 20, label: 'A house window went dark' },
      { id: 'buoy', x: 150, y: 348, r: 22, label: 'The buoy lost its stripe' },
      { id: 'sail', x: 380, y: 315, r: 34, label: 'The sail changed colour' },
      { id: 'pier-lantern', x: 190, y: 224, r: 24, label: 'The pier lantern vanished' },
      { id: 'dock-cat', x: 96, y: 252, r: 24, label: 'The dock cat wandered off' },
      { id: 'gull', x: 350, y: 118, r: 20, label: 'A third gull joined the sky' },
    ],
  },
  {
    id: 'market',
    name: 'Night Market',
    hint: 'Count the fruit, check the signs and the hats.',
    draw: drawMarket,
    diffs: [
      { id: 'kite', x: 470, y: 128, r: 26, label: 'A kite appeared in the sky' },
      { id: 'awning', x: 115, y: 192, r: 30, label: 'The awning changed colour' },
      { id: 'melon', x: 172, y: 252, r: 20, label: 'A fourth melon appeared' },
      { id: 'sign', x: 115, y: 231, r: 22, label: 'The sign gained a mark' },
      { id: 'lanterns', x: 420, y: 226, r: 26, label: 'The lanterns turned gold' },
      { id: 'hat', x: 430, y: 278, r: 22, label: 'The vendor changed hats' },
      { id: 'crate', x: 263, y: 266, r: 24, label: 'A crate went missing' },
    ],
  },
  {
    id: 'garden',
    name: 'Lighthouse Garden',
    hint: 'Watch the beam, the fence and the flowers.',
    draw: drawGarden,
    diffs: [
      { id: 'beam', x: 300, y: 105, r: 30, label: 'The lighthouse beam went out' },
      { id: 'bird', x: 160, y: 98, r: 18, label: 'The bird flew off the roof' },
      { id: 'stone', x: 310, y: 330, r: 22, label: 'A new stepping stone appeared' },
      { id: 'fence', x: 56, y: 312, r: 20, label: 'A fence post went missing' },
      { id: 'flowers', x: 430, y: 348, r: 28, label: 'The tulips changed colour' },
      { id: 'butterfly', x: 427, y: 210, r: 22, label: 'A butterfly fluttered in' },
      { id: 'cottage-window', x: 481, y: 331, r: 22, label: 'The cottage window changed shape' },
    ],
  },
];
