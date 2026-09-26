// Miniature clay sets: street, salon interior, Jordan's living room, support desk.
'use strict';

const FLOOR = 860;
const TABLET = { x: 2250, y: 505, w: 300, h: 188 }; // tablet screen centre/size in salon world

// ── shared props ─────────────────────────────────────────────────────────────
function plant(x, y, s = 1, pot = '#c2703f', seed = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const leaves = [[-40, -150, 0.5], [30, -170, -0.4], [-10, -200, 0.1], [55, -120, -0.9], [-60, -110, 0.9], [5, -140, 0]];
  leaves.forEach(([lx, ly, r], i) => {
    ctx.save(); ctx.translate(lx * 0.5, -40); ctx.rotate(r + Math.sin(POSE * 0.25 + i) * 0.015);
    cEll(0, ly * 0.55, 22, 62, i % 2 ? '#4f8a4a' : '#62a05a', { seed: seed + i, shadow: 6 });
    ctx.restore();
  });
  clay(P.poly([[-52, -60], [52, -60], [40, 0], [-40, 0]]), pot, { x: -52, y: -60, w: 104, h: 60 }, { shadow: 12 });
  cRect(-58, -70, 116, 18, 8, shade(pot, 0.1), { shadow: 6 });
  ctx.restore();
}
function heart(x, y, s, color) {
  clay((k) => { k.beginPath(); k.moveTo(x, y + s * 0.9); k.bezierCurveTo(x - s * 1.4, y, x - s * 0.8, y - s * 0.9, x, y - s * 0.3); k.bezierCurveTo(x + s * 0.8, y - s * 0.9, x + s * 1.4, y, x, y + s * 0.9); k.closePath(); },
    color, { x: x - s, y: y - s, w: 2 * s, h: 2 * s }, { shadow: 4 });
}
function star(x, y, r, color, rot = 0, o = {}) {
  const pts = [];
  for (let i = 0; i < 10; i++) { const a = rot - Math.PI / 2 + (i * Math.PI) / 5; const rr = i % 2 ? r * 0.48 : r; pts.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]); }
  clay(P.poly(pts, false), color, { x: x - r, y: y - r, w: 2 * r, h: 2 * r }, { shadow: 8, gloss: 1.4, ...o });
}
function check(x, y, s, color = '#ffffff', w = 0.22) {
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = color; ctx.lineWidth = s * w;
  ctx.beginPath(); ctx.moveTo(x - s * 0.45, y); ctx.lineTo(x - s * 0.1, y + s * 0.35); ctx.lineTo(x + s * 0.5, y - s * 0.35); ctx.stroke(); ctx.restore();
}
function arrowUp(x, y, s, color) {
  clay(P.poly([[x, y - s], [x + s * 0.8, y - s * 0.1], [x + s * 0.3, y - s * 0.1], [x + s * 0.3, y + s], [x - s * 0.3, y + s], [x - s * 0.3, y - s * 0.1], [x - s * 0.8, y - s * 0.1]]), color, { x: x - s, y: y - s, w: 2 * s, h: 2 * s }, { shadow: 8 });
}
// Little clay portrait used on polaroids, app avatars, etc.
function miniFace(x, y, r, who) {
  const w = CAST[who];
  if (w.style === 'curly') for (let i = 0; i < 6; i++) { const a = Math.PI * (0.95 + i * 0.22); cEll(x + Math.cos(a) * r * 0.9, y + Math.sin(a) * r * 0.85, r * 0.36, r * 0.34, w.hair, { shadow: 2, jit: 0.3 }); }
  if (w.style === 'bun') cEll(x, y - r * 1.05, r * 0.4, r * 0.34, w.hair, { shadow: 2, jit: 0.3 });
  if (w.style === 'bob') cEll(x, y + r * 0.1, r * 1.12, r * 1.08, w.hair, { shadow: 2, jit: 0.3 });
  cEll(x, y, r, r * 1.02, w.skin, { shadow: 4, jit: 0.3 });
  if (!['curly'].includes(w.style)) clay((k) => { k.beginPath(); k.moveTo(x - r, y - r * 0.1); k.bezierCurveTo(x - r * 1.05, y - r * 1.2, x + r * 1.05, y - r * 1.2, x + r, y - r * 0.1); k.bezierCurveTo(x + r * 0.5, y - r * 0.7, x - r * 0.5, y - r * 0.7, x - r, y - r * 0.1); k.closePath(); }, w.hair, { x: x - r, y: y - r * 1.2, w: 2 * r, h: r * 1.1 }, { shadow: 2, jit: 0.3 });
  ctx.fillStyle = '#1d1410';
  ctx.beginPath(); ctx.arc(x - r * 0.34, y + r * 0.02, r * 0.1, 0, 7); ctx.arc(x + r * 0.34, y + r * 0.02, r * 0.1, 0, 7); ctx.fill();
  ctx.save(); ctx.strokeStyle = '#5a2a22'; ctx.lineWidth = Math.max(1.5, r * 0.08); ctx.lineCap = 'round';
  ctx.beginPath(); ctx.arc(x, y + r * 0.28, r * 0.28, 0.2 * Math.PI, 0.8 * Math.PI); ctx.stroke(); ctx.restore();
}

// ── EXTERIOR STREET ──────────────────────────────────────────────────────────
// mood: 0 = morning, 1 = dusk
function street(t, mood = 0, opts = {}) {
  const sky1 = mix('#f7c9a0', '#3b3a66', mood), sky2 = mix('#a9d3e6', '#f09a6a', mood);
  const g = ctx.createLinearGradient(0, -400, 0, 900);
  g.addColorStop(0, sky2); g.addColorStop(1, sky1);
  ctx.fillStyle = g; ctx.fillRect(-1200, -600, 4400, 1600);
  // sun / clouds
  glow(mood ? 1500 : 300, mood ? 640 : 180, 380, mood ? '#ffb070' : '#fff1c8', 0.6);
  const clouds = [[150, 90, 1], [700, 40, 1.3], [1350, 120, 0.9], [1850, 60, 1.1]];
  clouds.forEach(([x, y, s], i) => {
    const dx = ((t * 6 + i * 50) % 300);
    for (let k = 0; k < 4; k++) cBlob(x + dx + k * 50 * s, y + (k % 2) * -22 * s, 70 * s, 42 * s, mood ? '#f3c3b0' : '#fffaf2', { seed: i * 9 + k, shadow: 4, wob: 0.08, light: 1.2 });
  });
  // distant buildings (soft focus)
  withLayer(1, () => {
    [[-300, 380, 380, '#b7a6c9'], [60, 300, 300, '#c9b8a4'], [1480, 330, 330, '#a9bcc7'], [1820, 260, 420, '#c7a9a0']].forEach(([x, y, w, c], i) => {
      cRect(x, y, w, 700, 12, mix(c, '#6e6a8a', mood * 0.5), { shadow: 0 });
      for (let r = 0; r < 4; r++) for (let q = 0; q < 3; q++) cRect(x + 40 + q * (w - 80) / 3, y + 50 + r * 110, 60, 70, 6, mood ? '#ffd48a' : '#8fb0c4', { shadow: 0, tex: 0.3 });
    });
  }, { blur: 5 });

  // neighbours
  shopFacade(-460, 280, 560, '#5f9ea0', 'Café', mood, '#f5e9d6');
  shopFacade(1420, 300, 560, '#d9a441', 'Books', mood, '#fff5e0');
  // Sam's Studio (hero shop)
  shopFacade(220, 180, 1080, '#c77b62', "Sam's Studio", mood, '#fff7ea', true, opts);

  // sidewalk & road
  cRect(-1200, 880, 4400, 70, 0, '#d7cbbb', { shadow: 10 });
  cRect(-1200, 940, 4400, 24, 0, '#b5aa9c', { shadow: 6 });
  cRect(-1200, 964, 4400, 400, 0, '#5b5752', { shadow: 0 });
  for (let i = -6; i < 16; i++) cRect(i * 260, 1040, 130, 16, 8, '#e9e1cf', { shadow: 2 });
  // lamp post & tree
  lampPost(1340, 890, mood);
  tree(-80, 900);
  if (opts.after) opts.after();
}
function shopFacade(x, y, w, color, name, mood, trim, hero = false, opts = {}) {
  const h = 900 - y;
  cRect(x, y, w, h, 10, color, { shadow: 16 });
  // brick hints
  for (let r = 0; r < 6; r++) for (let q = 0; q < 6; q++) if (hash(r * 7 + q + x) > 0.6) cRect(x + 30 + q * (w / 6), y + 30 + r * 50, 60, 22, 5, shade(color, -0.08), { shadow: 0, tex: 0.5 });
  cRect(x - 16, y - 20, w + 32, 50, 10, shade(color, -0.2), { shadow: 10 }); // cornice
  // sign board
  const sw = Math.min(w - 120, 620), sx = x + (w - sw) / 2;
  cRect(sx, y + 50, sw, 96, 18, trim, { shadow: 10 });
  cText(name, sx + sw / 2, y + 116, hero ? 64 : 46, hero ? '#8a3b2a' : '#3b3a3a', { font: FONT.title, weight: 700, align: 'center' });
  // awning
  const ay = y + 170, aw = w - 40;
  for (let i = 0; i < 8; i++) {
    const c = i % 2 ? '#f5ecdc' : (hero ? '#b5533a' : shade(color, -0.25));
    clay(P.poly([[x + 20 + i * aw / 8, ay], [x + 20 + (i + 1) * aw / 8, ay], [x + 20 + (i + 1) * aw / 8 + 6, ay + 90], [x + 20 + i * aw / 8 + 6, ay + 90]]), c, { x: x + 20 + i * aw / 8, y: ay, w: aw / 8, h: 90 }, { shadow: i === 0 ? 16 : 0 });
  }
  for (let i = 0; i < 8; i++) cEll(x + 20 + (i + 0.5) * aw / 8 + 6, ay + 90, aw / 16, 18, i % 2 ? '#f5ecdc' : (hero ? '#b5533a' : shade(color, -0.25)), { shadow: 6 });
  // windows / door
  const winY = ay + 130, winH = 900 - winY - 60;
  const lit = mix('#ffe7b8', '#ffc76b', mood);
  const glassW = hero ? w * 0.56 : w * 0.5;
  cRect(x + 50, winY, glassW, winH, 12, '#f2ebe0', { shadow: 10 });
  const gx = x + 66, gy = winY + 16, gw = glassW - 32, gh = winH - 32;
  const gg = ctx.createLinearGradient(gx, gy, gx, gy + gh);
  gg.addColorStop(0, mix('#a7cbd6', lit, 0.3 + mood * 0.6)); gg.addColorStop(1, mix('#6f8f9a', '#e0a860', mood));
  ctx.fillStyle = gg; ctx.beginPath(); ctx.roundRect(gx, gy, gw, gh, 8); ctx.fill();
  if (hero) {
    // warm interior silhouettes: chair & a customer, pendant glow
    glow(gx + gw * 0.5, gy + 30, 260, '#ffd08a', 0.55 + mood * 0.3);
    ctx.save(); ctx.beginPath(); ctx.roundRect(gx, gy, gw, gh, 8); ctx.clip();
    if (opts.inside) opts.inside(gx, gy, gw, gh);
    ctx.restore();
    ctx.save(); ctx.globalAlpha = 0.25; ctx.fillStyle = '#fff'; // reflection streaks
    ctx.beginPath(); ctx.moveTo(gx + 40, gy); ctx.lineTo(gx + 110, gy); ctx.lineTo(gx + 20, gy + gh); ctx.lineTo(gx - 50, gy + gh); ctx.fill();
    ctx.beginPath(); ctx.moveTo(gx + 150, gy); ctx.lineTo(gx + 175, gy); ctx.lineTo(gx + 85, gy + gh); ctx.lineTo(gx + 60, gy + gh); ctx.fill(); ctx.restore();
    cText('OPEN', gx + gw - 110, gy + 70, 38, '#e8574a', { align: 'center', weight: 900 });
  }
  const dx = x + 50 + glassW + 50, dw = Math.min(200, x + w - dx - 40);
  if (dw > 80) {
    cRect(dx, winY - 30, dw, 900 - winY + 30, 12, shade(color, -0.35), { shadow: 10 });
    cRect(dx + 20, winY - 10, dw - 40, 180, 8, mix('#8fb0bb', lit, mood), { shadow: 0, tex: 0.3 });
    cEll(dx + dw - 30, winY + 300, 10, 10, '#e6c35a', { shadow: 4 });
  }
}
function lampPost(x, y, mood) {
  cRect(x - 10, y - 520, 20, 520, 10, '#2f3a3f', { shadow: 10 });
  cRect(x - 34, y - 580, 68, 70, 16, '#2f3a3f', { shadow: 10 });
  cRect(x - 24, y - 568, 48, 46, 10, mood > 0.4 ? '#ffe2a0' : '#dfe6e0', { shadow: 0, tex: 0.2 });
  if (mood > 0.4) glow(x, y - 545, 260, '#ffc070', 0.5 * mood);
}
function tree(x, y) {
  cRect(x - 18, y - 320, 36, 320, 14, '#6b4a33', { shadow: 10 });
  [[0, -420, 150], [-100, -360, 110], [100, -350, 120], [-40, -300, 100], [60, -470, 100]].forEach(([dx, dy, r], i) =>
    cBlob(x + dx, y + dy, r, r * 0.9, i % 2 ? '#5d9b58' : '#6fae62', { seed: 70 + i, wob: 0.1, shadow: 12 }));
}

// ── SALON INTERIOR ───────────────────────────────────────────────────────────
/* st: {
     light: 0..1 (1 = warm & bright; lower = dim, overcast)
     board: [8] presence 0..1 of each regular's polaroid (1 = pinned)
     clock: seconds-hand phase, door: 0..1 open, walker: 0..1 progress (competitor beat)
     tablet: fn(x,y,w,h) draws the tablet screen, phoneLit, bookOpen etc.
   } */
const BOARD_WHO = ['jordan', 'priya', 'alex', 'morgan', 'walker', 'alex', 'priya', 'morgan'];

function salonBack(t, st) {
  const L = st.light ?? 1;
  // wall
  cRect(-800, -400, 5200, FLOOR + 400, 0, mix('#b9b3ad', '#ead6bd', L), { shadow: 0, texScale: 2.2 });
  // wainscot
  cRect(-800, 610, 5200, FLOOR - 610, 0, mix('#6d7f78', '#83a896', L), { shadow: 0, texScale: 2 });
  for (let x = -760; x < 4400; x += 150) cRect(x, 640, 110, 190, 10, mix('#667872', '#789d8b', L), { shadow: 3, tex: 0.4 });
  cCap(-800, 612, 4400, 612, 12, mix('#9aa39d', '#f1e6d4', L), { shadow: 8 });
  // floor
  cRect(-800, FLOOR, 5200, 600, 0, mix('#7c6450', '#a8764c', L), { shadow: 0 });
  for (let r = 0; r < 5; r++) for (let x = -800 + (r % 2) * 180; x < 4400; x += 360)
    cRect(x, FLOOR + 6 + r * 56, 352, 50, 4, mix('#77604c', r % 2 ? '#a1704a' : '#ad7c52', L), { shadow: 2, tex: 0.6 });
  cRect(-800, FLOOR - 16, 5200, 26, 4, mix('#8f8a84', '#efe4d2', L), { shadow: 6 }); // baseboard

  // window (with the street & competitor outside)
  const wx = 60, wy = 170, ww = 640, wh = 440;
  cRect(wx - 26, wy - 26, ww + 52, wh + 52, 16, '#f6f0e6', { shadow: 16 });
  ctx.save(); ctx.beginPath(); ctx.rect(wx, wy, ww, wh); ctx.clip();
  withLayer(2, () => windowView(t, st, wx, wy, ww, wh), { blur: st.windowSharp ? 0 : 2.2 });
  ctx.restore();
  ctx.save(); ctx.globalAlpha = 0.18; ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.moveTo(wx + 80, wy); ctx.lineTo(wx + 190, wy); ctx.lineTo(wx + 60, wy + wh); ctx.lineTo(wx - 50, wy + wh); ctx.fill(); ctx.restore();
  cRect(wx + ww / 2 - 10, wy, 20, wh, 4, '#f6f0e6', { shadow: 6 });
  cRect(wx, wy + wh / 2 - 10, ww, 20, 4, '#f6f0e6', { shadow: 6 });
  cRect(wx - 40, wy + wh + 14, ww + 80, 30, 8, '#efe6d6', { shadow: 10 }); // sill
  plant(wx + 90, wy + wh + 16, 0.55, '#d2854c', 3);

  // door
  const dx = 790, dy = 230;
  cRect(dx - 22, dy - 22, 264, FLOOR - dy + 22, 12, '#f1e8da', { shadow: 12 });
  const open = st.door ?? 0;
  cRect(dx, dy, 220, FLOOR - dy, 6, mix('#e9c98f', '#fff1cf', L), { shadow: 0, tex: 0.3 }); // daylight behind door
  glow(dx + 110, dy + 300, 200, '#fff1cf', 0.4 * open);
  const dw = 220 * (1 - open * 0.85);
  cRect(dx, dy, dw, FLOOR - dy, 8, '#6a8f86', { shadow: 10 });
  if (dw > 90) {
    cRect(dx + 26 * dw / 220, dy + 30, dw - 52 * dw / 220, 200, 8, '#b8d6d6', { shadow: 0, tex: 0.3 });
    cEll(dx + dw - 26, dy + 340, 11, 11, '#e2b650', { shadow: 5 });
    // hanging OPEN sign
    const sw = Math.sin(t * 2) * 0.03;
    ctx.save(); ctx.translate(dx + dw / 2, dy + 250); ctx.rotate(sw);
    cRect(-70 * dw / 220, 0, 140 * dw / 220, 56, 8, '#fdf8ef', { shadow: 6 });
    if (dw > 150) cText('OPEN', 0, 40, 32, '#c4493a', { align: 'center', weight: 900 });
    ctx.restore();
  }

  // mirror station
  cRect(1175, 220, 450, 390, 60, '#caa25a', { shadow: 18, gloss: 1.6 });
  const mg = ctx.createLinearGradient(1195, 240, 1605, 590);
  mg.addColorStop(0, '#dfeef0'); mg.addColorStop(1, '#9fbcc2');
  ctx.fillStyle = mg; ctx.beginPath(); ctx.roundRect(1195, 240, 410, 350, 48); ctx.fill();
  ctx.save(); ctx.globalAlpha = 0.35; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.moveTo(1260, 240); ctx.lineTo(1330, 240); ctx.lineTo(1230, 590); ctx.lineTo(1195, 590); ctx.lineTo(1195, 420); ctx.fill(); ctx.restore();
  cRect(1160, 610, 480, 34, 10, '#efe3cf', { shadow: 12 }); // counter
  [[1210, '#e05d4f'], [1250, '#5aa6c9'], [1290, '#f0c046'], [1560, '#7bb68a']].forEach(([x, c], i) => {
    cRect(x - 14, 540, 28, 70, 10, c, { shadow: 6, gloss: 1.5 }); cRect(x - 6, 525, 12, 18, 4, '#f5f0e6', { shadow: 3 });
  });
  cEll(1600, 596, 34, 12, '#f4f1ea', { shadow: 5 }); // towel

  // sign above the desk
  cRect(1980, 118, 540, 116, 30, '#f7efe2', { shadow: 14 });
  cText("Sam's Studio", 2250, 196, 66, '#b5533a', { font: FONT.title, weight: 700, align: 'center' });
  // shelf with products
  cRect(1930, 318, 640, 22, 8, '#8a5a3a', { shadow: 12 });
  for (let i = 0; i < 9; i++) {
    const x = 1960 + i * 68, hh = 46 + (i % 3) * 14, c = ['#e7a3a0', '#8fbfb4', '#f1d18a', '#b9a3d9'][i % 4];
    cRect(x, 318 - hh, 40, hh, 12, c, { shadow: 6, gloss: 1.4 });
  }

  // corkboard of regulars
  const bx = 2800, by = 200;
  cRect(bx - 20, by - 20, 640, 440, 18, '#b88b5c', { shadow: 18 });
  cRect(bx, by, 600, 400, 10, '#c9a376', { shadow: 0, texScale: 0.6, tex: 1.3 });
  cRect(bx + 170, by + 18, 260, 54, 12, '#fdf6ea', { shadow: 6 });
  cText('REGULARS', bx + 285, by + 58, 32, '#6b4a33', { align: 'center', weight: 900 });
  heart(bx + 405, by + 44, 12, '#e0645a');
  const board = st.board ?? [1, 1, 1, 1, 1, 1, 1, 1];
  BOARD_WHO.forEach((who, i) => {
    const col = i % 4, row = (i / 4) | 0;
    const px = bx + 30 + col * 142, py = by + 92 + row * 150;
    const p = board[i];
    if (p <= 0.001) { cEll(px + 58, py + 8, 7, 7, '#a07650', { shadow: 2 }); return; } // empty pin
    const fall = 1 - p;
    ctx.save(); ctx.translate(px + 58, py + fall * fall * 500); ctx.rotate((hash(i) - 0.5) * 0.12 + fall * 1.2 * (i % 2 ? 1 : -1));
    ctx.globalAlpha = clamp(p * 3);
    cRect(-54, 0, 108, 128, 5, '#fbf8f1', { shadow: 8 });
    cRect(-44, 10, 88, 84, 3, ['#bcd9e0', '#f2d5c4', '#d7e6c5', '#ead7ee'][i % 4], { shadow: 0, tex: 0.4 });
    miniFace(0, 56, 26, who);
    cEll(0, 4, 8, 8, ['#e0645a', '#4f86c6', '#f0c046', '#5aa37a'][i % 4], { shadow: 3 });
    ctx.restore();
  });
  // clock
  const cx = 3560, cy = 290;
  cEll(cx, cy, 86, 86, '#2f3a3f', { shadow: 16 });
  cEll(cx, cy, 72, 72, '#fbf6ec', { shadow: 0, tex: 0.4 });
  for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; cEll(cx + Math.sin(a) * 58, cy - Math.cos(a) * 58, 4, 4, '#2f3a3f', { shadow: 0, still: true }); }
  const ck = st.clock ?? t * 0.02;
  ctx.save(); ctx.lineCap = 'round'; ctx.strokeStyle = '#2f3a3f';
  ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.sin(ck / 12) * 34, cy - Math.cos(ck / 12) * 34); ctx.stroke();
  ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.sin(ck) * 52, cy - Math.cos(ck) * 52); ctx.stroke(); ctx.restore();
  cEll(cx, cy, 8, 8, '#e0645a', { shadow: 2 });
  // waiting bench
  cRect(2850, 700, 520, 36, 14, '#6f8f86', { shadow: 12 });
  cRect(2870, 560, 480, 150, 30, '#7fa398', { shadow: 10 });
  cRect(2880, 736, 24, 124, 8, '#4c3a2c', { shadow: 6 }); cRect(3316, 736, 24, 124, 8, '#4c3a2c', { shadow: 6 });
  plant(3480, FLOOR, 0.95, '#d9d0c1', 5);

  // barber chair
  barberChair(1400);
  // pendant lamps
  [1400, 2250, 3100].forEach((x, i) => {
    const sway = Math.sin(t * 0.9 + i) * 3;
    ctx.save(); ctx.strokeStyle = '#2a2622'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x, -500); ctx.lineTo(x + sway, 40); ctx.stroke(); ctx.restore();
    clay((k) => { k.beginPath(); k.moveTo(x + sway - 90, 110); k.quadraticCurveTo(x + sway - 70, 30, x + sway, 30); k.quadraticCurveTo(x + sway + 70, 30, x + sway + 90, 110); k.closePath(); }, '#2f5a57', { x: x - 90, y: 30, w: 180, h: 80 }, { shadow: 10 });
    cEll(x + sway, 110, 34, 12, mix('#c9c0a8', '#fff3cf', L), { shadow: 0, tex: 0 });
  });
}
function barberChair(x) {
  cRect(x - 20, 730, 40, 110, 10, '#8c8f94', { shadow: 8, gloss: 2 });
  cEll(x, 850, 90, 16, '#6d7075', { shadow: 10, gloss: 2 });
  cRect(x - 110, 470, 220, 250, 50, '#b43f36', { shadow: 16, gloss: 1.3 });
  cRect(x - 130, 680, 260, 70, 30, '#a23830', { shadow: 12 });
  cRect(x - 150, 620, 50, 26, 12, '#3a3a40', { shadow: 6 }); cRect(x + 100, 620, 50, 26, 12, '#3a3a40', { shadow: 6 });
}
function salonLights(st) {
  const L = st.light ?? 1;
  [1400, 2250, 3100].forEach((x) => { glow(x, 130, 700, '#ffc98a', 0.34 * L); glow(x, 120, 120, '#fff4d6', 0.6 * L); });
}
// Desk sits in front of Sam when Sam is behind it.
function salonDesk(t, st) {
  const L = st.light ?? 1;
  // items on desk (behind the desk top edge)
  // appointment book
  clay(P.poly([[1900, 640], [2080, 640], [2070, 600], [1990, 610], [1910, 600]], true), '#f7f1e4', { x: 1900, y: 600, w: 180, h: 40 }, { shadow: 8 });
  cRect(1985, 598, 10, 44, 3, '#b5533a', { shadow: 0 });
  // phone on stand
  cRect(2112, 520, 60, 116, 12, '#262a33', { shadow: 10 });
  cRect(2118, 528, 48, 100, 8, st.phoneLit ? '#d5f3ee' : '#3d4754', { shadow: 0, tex: 0.3 });
  if (st.phoneLit) glow(2142, 578, 90, '#bff5ea', 0.5);
  // tablet on stand
  const { x: tx, y: ty, w: tw, h: th } = TABLET;
  cRect(tx - 30, ty + th / 2 - 4, 60, 70, 10, '#3a3f48', { shadow: 10 });
  cRect(tx - tw / 2 - 16, ty - th / 2 - 16, tw + 32, th + 32, 22, '#252a31', { shadow: 18, gloss: 1.5 });
  ctx.save(); ctx.beginPath(); ctx.roundRect(tx - tw / 2, ty - th / 2, tw, th, 8); ctx.clip();
  if (st.tablet) st.tablet(tx - tw / 2, ty - th / 2, tw, th); else oldScreen(tx - tw / 2, ty - th / 2, tw, th);
  ctx.restore();
  // card terminal
  cRect(2480, 560, 84, 80, 14, '#3a3f48', { shadow: 10 });
  cRect(2492, 570, 60, 34, 6, st.paid ? '#bff0c9' : '#9fb3b8', { shadow: 0, tex: 0.2 });
  if (st.paid) check(2522, 588, 26, '#2f8a4f', 0.2);
  plant(2610, 640, 0.6, '#5a8fb0', 8);
  // desk
  cRect(1840, 632, 820, 36, 12, '#8a5a3a', { shadow: 16 });
  cRect(1860, 664, 780, FLOOR - 664, 14, mix('#b5a58f', '#d9c3a3', L), { shadow: 16 });
  for (let i = 0; i < 4; i++) cRect(1890 + i * 190, 700, 150, 130, 12, mix('#aa9a84', '#cfb895', L), { shadow: 3, tex: 0.5 });
}
// The pre-MsgHealth screen: an overloaded spreadsheet.
function oldScreen(x, y, w, h) {
  ctx.fillStyle = '#e9ecef'; ctx.fillRect(x, y, w, h);
  ctx.fillStyle = '#c9ced4'; ctx.fillRect(x, y, w, 18);
  for (let r = 0; r < 12; r++) for (let q = 0; q < 6; q++) {
    ctx.fillStyle = (r + q) % 5 === 0 ? '#f6d4d0' : '#ffffff';
    ctx.fillRect(x + 6 + q * (w - 12) / 6, y + 24 + r * 13.5, (w - 12) / 6 - 2, 11);
  }
}
function windowView(t, st, x, y, w, h) {
  const g = ctx.createLinearGradient(0, y, 0, y + h);
  g.addColorStop(0, mix('#9fb2c0', '#bfe0ee', st.light ?? 1)); g.addColorStop(1, '#f6e6cf');
  ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
  // the competitor across the street
  const cx = x + 90, cy = y + 90;
  cRect(cx, cy, 460, 300, 8, '#8b6fb0', { shadow: 0 });
  cRect(cx + 256, cy + 26, 190, 60, 14, '#f8f0ff', { shadow: 4 });
  cText('NEW SALON', cx + 351, cy + 67, 30, '#6a4c96', { align: 'center', weight: 900, emboss: false });
  cRect(cx + 12, cy + 26, 190, 60, 14, '#f8f0ff', { shadow: 4 });
  cText('20% OFF', cx + 107, cy + 67, 30, '#d8657a', { align: 'center', weight: 900, emboss: false });
  for (let i = 0; i < 6; i++) cRect(cx + 20 + i * 70, cy + 100, 70, 40, 0, i % 2 ? '#f8f0ff' : '#d8657a', { shadow: 0 });
  cRect(cx + 40, cy + 170, 200, 130, 6, '#ffe3a8', { shadow: 0 });
  cRect(cx + 290, cy + 150, 110, 150, 6, '#4c3a60', { shadow: 0 });
  glow(cx + 230, cy + 50, 200, '#ffffff', 0.25 + 0.2 * Math.sin(t * 3));
  // sidewalk
  cRect(x, y + h - 60, w, 60, 0, '#d6cdbf', { shadow: 0 });
  // passer-by who walks into the competitor
  if (st.walker != null && st.walker < 1) {
    const p = st.walker;
    const px = lerp(x + w + 60, cx + 345, ease.io(clamp(p / 0.85)));
    const fade = 1 - seg(p, 0.85, 1);
    ctx.save(); ctx.globalAlpha = fade;
    person({ who: 'morgan', x: px, y: y + h - 30, s: 0.36, walk: p < 0.85 ? sm(t) * 9 : null, flip: true, look: [-1, 0], mood: 'smile', noShadow: true });
    ctx.restore();
  }
}

// ── JORDAN'S LIVING ROOM ─────────────────────────────────────────────────────
function livingRoom(t) {
  cRect(-800, -400, 3600, 1300, 0, '#cfdfe2', { shadow: 0, texScale: 2.2 });
  for (let x = -760; x < 2800; x += 90) cRect(x, -400, 40, 1300, 0, '#c6d8dc', { shadow: 0, tex: 0.3 });
  cRect(-800, 880, 3600, 600, 0, '#b58c64', { shadow: 0 });
  cRect(-800, 866, 3600, 24, 4, '#f3ece0', { shadow: 6 });
  // window w/ curtains
  cRect(1180, 160, 460, 400, 12, '#f6f0e6', { shadow: 14 });
  const g = ctx.createLinearGradient(0, 180, 0, 540); g.addColorStop(0, '#bfe3f3'); g.addColorStop(1, '#f7e5c8');
  ctx.fillStyle = g; ctx.fillRect(1200, 180, 420, 360);
  cBlob(1330, 330, 70, 50, '#fffaf2', { seed: 3, shadow: 0 }); cBlob(1480, 290, 60, 40, '#fffaf2', { seed: 4, shadow: 0 });
  cRect(1140, 130, 90, 480, 30, '#e8a15c', { shadow: 10 }); cRect(1590, 130, 90, 480, 30, '#e8a15c', { shadow: 10 });
  // picture frames
  cRect(200, 190, 220, 170, 10, '#6b4a33', { shadow: 12 }); cRect(218, 208, 184, 134, 4, '#f0c987', { shadow: 0 });
  cBlob(310, 290, 60, 36, '#6fae62', { seed: 5, shadow: 0 });
  cRect(20, 250, 130, 130, 65, '#6b4a33', { shadow: 12 }); cEll(85, 315, 50, 50, '#e3746a', { shadow: 0 });
  cRect(880, 230, 170, 130, 10, '#6b4a33', { shadow: 12 }); cRect(896, 246, 138, 98, 4, '#a9cfe0', { shadow: 0 });
  cBlob(965, 310, 50, 22, '#f3e3c3', { seed: 6, shadow: 0 });
  // lamp
  cRect(1790, 440, 16, 440, 8, '#3a3a40', { shadow: 8 });
  clay(P.poly([[1720, 450], [1876, 450], [1846, 330], [1750, 330]]), '#f4d9a8', { x: 1720, y: 330, w: 156, h: 120 }, { shadow: 12 });
  glow(1798, 420, 300, '#ffd79a', 0.35);
  cEll(1798, 880, 80, 16, '#3a3a40', { shadow: 6 });
  // couch
  cRect(160, 560, 900, 220, 70, '#df8b57', { shadow: 18 });
  cRect(200, 700, 820, 120, 40, '#e99a66', { shadow: 12 });
  cRect(110, 620, 150, 240, 60, '#d27d4b', { shadow: 14 }); cRect(960, 620, 150, 240, 60, '#d27d4b', { shadow: 14 });
  cRect(280, 590, 170, 140, 40, '#f3d9a8', { shadow: 8 }); // cushion
  cRect(200, 820, 30, 60, 8, '#4c3a2c', { shadow: 4 }); cRect(990, 820, 30, 60, 8, '#4c3a2c', { shadow: 4 });
  plant(1150, 880, 0.9, '#c2703f', 12);
}

// ── SUPPORT DESK (representative) ────────────────────────────────────────────
function supportDesk(t) {
  cRect(-800, -400, 3600, 1300, 0, '#e3ece6', { shadow: 0, texScale: 2.2 });
  cRect(-800, 880, 3600, 600, 0, '#9f8a74', { shadow: 0 });
  // wall: brand plaque & plant shelf
  cRect(560, 160, 520, 150, 28, '#fbfaf6', { shadow: 14 });
  drawLogo(820, 235, 0.72, { plaque: true });
  cRect(1260, 330, 360, 20, 8, '#8a6a4a', { shadow: 10 });
  plant(1340, 330, 0.5, '#e7a3a0', 21); plant(1520, 330, 0.45, '#8fbfb4', 22);
  cRect(160, 200, 260, 200, 12, '#f7f3ea', { shadow: 12 });
  for (let i = 0; i < 4; i++) cRect(190, 230 + i * 40, 200 - i * 30, 18, 8, [BRAND.colors.healthy, BRAND.colors.primary, BRAND.colors.attention, '#c8c2b6'][i], { shadow: 2 });
}
