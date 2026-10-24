// MsgHealth · "Pizza index" · 38 s vertical social ad (1080 × 1920, 30 fps).
// A joke built on a real story, in the "did you know" short format: in 1990, the night before Iraq invaded Kuwait,
// late-night pizza deliveries to the Pentagon spiked, and insiders have called it the Pentagon Pizza Index ever
// since. Act 1 (0–16.6 s) plays it in flat vector and escalates it: a tower of boxes goes through the roof, a
// general eats under a spinning siren, a spy in a bush tails the delivery guy and locks on through binoculars.
// Act 2: "Your customers drop hints too. They just don't order pizza." MsgHealth reads the signs, scores every
// customer, flags who's at risk and texts them before they leave. "No binoculars required." End card: msghealth.net.
// The voiceover is assets/audio/pizza/vo-NN.wav (timed by VO_AT below); captions follow it chunk by chunk.
'use strict';

const W = 1080, H = 1920, DURATION = 37.8;
const C = BRAND.colors;
const FONT = 'Inter';

// When each voiceover clip starts (film seconds). Clip lengths and caption chunks are in src/pizza-vo.js.
const VO_AT = [0.25, 3.5, 6.55, 8.35, 10.25, 12.9, 16.75, 18.6, 20.3, 22.2, 23.45, 25.65, 29.05, 31.0, 32.4, 34.4];
const word = (line, k) => VO_AT[line] + VO_CLIPS[line].chunks[k][1]; // when a caption chunk is spoken
// Story beats, all read off the voiceover so picture and sound stay locked to it.
const T = {
  night: word(0, 1), iraq: word(0, 2), pizza: VO_AT[1], pentagon: word(1, 1), roof: word(1, 2),
  name: VO_AT[2], index: VO_AT[3], pindex: word(3, 1), late: VO_AT[4], big: word(4, 1), coming: word(4, 2),
  sonow: VO_AT[5], watch: word(5, 2), closely: word(5, 3), pivot: 16.6,
  hints: word(6, 1), dont: VO_AT[7], order: word(7, 1), less: VO_AT[8], slower: word(8, 1), gone: VO_AT[9],
  brand: VO_AT[10], reads: word(10, 1), scores: VO_AT[11], every: word(11, 1), flags: word(11, 2), risk: word(11, 3),
  texts: VO_AT[12], before: word(12, 1), again: VO_AT[13], nobino: VO_AT[14], end: 34.2, url: VO_AT[15], tap: 36.1,
};
window.CUES = T;
window.VO = VO_AT.map((at, i) => ({ at, file: `assets/audio/pizza/vo-${String(i).padStart(2, '0')}.wav`, dur: VO_CLIPS[i].dur }));
window.SFX = []; // sample cues { t, kind, gain? }, read by scripts/pizza-audio.mjs
const cue = (t, kind, gain) => window.SFX.push({ t, kind, gain });

let ctx = null, MAIN = null, LOGO = null, HAND = null;

// ── maths ────────────────────────────────────────────────────────────────────
const clamp = (v, a = 0, c = 1) => Math.max(a, Math.min(c, v));
const lerp = (a, c, t) => a + (c - a) * t;
const seg = (t, a, c) => clamp((t - a) / (c - a));
const ease = {
  out: (t) => 1 - Math.pow(1 - t, 3),
  quint: (t) => 1 - Math.pow(1 - t, 5),
  inOut: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  in: (t) => t * t * t,
  back: (t) => { const c = 1.9; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); },
};
const hash = (n) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
function rgba(hex, a) { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; }

// ── drawing primitives ───────────────────────────────────────────────────────
function rr(x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }
function fillRR(x, y, w, h, r, col) { rr(x, y, w, h, r); ctx.fillStyle = col; ctx.fill(); }
function strokeRR(x, y, w, h, r, col, lw = 2) { rr(x, y, w, h, r); ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.stroke(); }
function font(size, weight = 600, track = -0.02) { ctx.font = `${weight} ${size}px ${FONT}`; ctx.letterSpacing = `${(size * track).toFixed(2)}px`; }
function text(s, x, y, size, weight, color, align = 'left', track) {
  font(size, weight, track ?? (size >= 40 ? -0.03 : -0.005));
  ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.fillStyle = color; ctx.fillText(s, x, y);
}
function tw(s, size, weight = 600, track) { font(size, weight, track ?? (size >= 40 ? -0.03 : -0.005)); return ctx.measureText(s).width; }
function circle(x, y, r, col) { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = col; ctx.fill(); }
function ellipse(x, y, rx, ry, col, rot = 0) { ctx.beginPath(); ctx.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2); ctx.fillStyle = col; ctx.fill(); }
function poly(pts, col) { ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.fillStyle = col; ctx.fill(); }
function glow(x, y, r, col, a) {
  if (a <= 0.003) return;
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, rgba(col, a)); g.addColorStop(1, rgba(col, 0));
  ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2);
}
function check(x, y, s, col = '#fff', lw = 4) {
  ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(x - s * 0.45, y); ctx.lineTo(x - s * 0.12, y + s * 0.34); ctx.lineTo(x + s * 0.5, y - s * 0.36); ctx.stroke();
}

// ═════════════════════════════════════════════════════════════════════════════
// ACT 1 · Washington, 1990 (flat vector, night)
// ═════════════════════════════════════════════════════════════════════════════
const P = { // palette
  sky0: '#0d1730', sky1: '#2a3d68', star: '#fff6dc', moon: '#fff1c9',
  lawn: '#22402f', lawnLt: '#2c5039', road: '#3a404d', roadLine: '#c9b46a', lot: '#2f343f',
  roof: '#7d7a84', roofLt: '#8d8a94', roofGap: '#55535c', wall: '#a39d8e', wallDk: '#857f71', court: '#2f5a3c', window: '#ffd77a',
  box: '#f1e2c2', boxDk: '#d8c59f', boxRed: '#d2422f', cheese: '#ffd45e', crust: '#d9a35a', pep: '#c8432f',
  skin: '#e9b48e', skinDk: '#cf9672', red: '#d2422f', redDk: '#a8321f', green: '#4b5a3a', greenDk: '#3a4730', gold: '#e8c25a',
  bush: '#2f6b3f', bushLt: '#3f8a52', coat: '#b58a52', hat: '#3b2f2a', hud: '#7cff9b',
};
const accentA = '#ffb03b'; // caption accent in act 1 (cheese)

function nightSky(t, y0 = -2000, y1 = 1100) {
  const g = ctx.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, P.sky0); g.addColorStop(1, P.sky1);
  ctx.fillStyle = g; ctx.fillRect(-1500, y0, 4000, y1 - y0);
  for (let i = 0; i < 140; i++) {
    const x = -600 + hash(i) * 2400, y = y0 + hash(i + 70) * (y1 - y0 - 200), tw2 = 0.5 + 0.5 * Math.sin(t * 3 + i * 1.7);
    circle(x, y, 1.5 + hash(i + 3) * 2.5, rgba(P.star, 0.35 + 0.5 * tw2));
  }
}
function moon(x, y, r) { glow(x, y, r * 3.2, P.moon, 0.16); circle(x, y, r, P.moon); circle(x - r * 0.3, y - r * 0.2, r * 0.18, '#efdcad'); circle(x + r * 0.35, y + r * 0.3, r * 0.12, '#efdcad'); }
// HUD text in the style of a surveillance feed (green, tracked caps)
function hud(s, x, y, size = 24, align = 'center', a = 1) {
  ctx.save(); ctx.globalAlpha *= a; ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 6;
  text(s, x, y, size, 700, P.hud, align, 0.14); ctx.restore();
}
function typed(s, t, at, cps = 28) { return s.slice(0, Math.max(0, Math.floor((t - at) * cps))); }

// ── the Pentagon, from above at an angle ─────────────────────────────────────
const PC = { x: 540, y: 1150, r: 420, sy: 0.56, h: 80 };
const pentPts = (r, cx = PC.x, cy = PC.y) => Array.from({ length: 5 }, (_, k) => { const a = -Math.PI / 2 + k * 2 * Math.PI / 5 + Math.PI / 5; return [cx + Math.cos(a) * r, cy + Math.sin(a) * r * PC.sy]; });
function drawPentagon(t) {
  const out = pentPts(PC.r);
  // front walls (edges facing the camera), with rows of lit windows
  for (let k = 0; k < 5; k++) {
    const a = out[k], b = out[(k + 1) % 5];
    if ((a[1] + b[1]) / 2 < PC.y) continue;
    poly([a, b, [b[0], b[1] + PC.h], [a[0], a[1] + PC.h]], k % 2 ? P.wall : P.wallDk);
    for (let row = 0; row < 3; row++) for (let i = 1; i < 18; i++) {
      const u = i / 18, x = lerp(a[0], b[0], u), y = lerp(a[1], b[1], u) + 16 + row * 21;
      const on = hash(k * 100 + row * 20 + i) < 0.55 + 0.35 * seg(t, T.pizza, T.roof);
      fillRR(x - 6, y, 12, 12, 2, on ? P.window : '#4f4b44');
      if (on) glow(x, y + 6, 18, P.window, 0.18);
    }
  }
  // roof rings and the courtyard
  [[PC.r, P.roof], [PC.r * 0.86, P.roofGap], [PC.r * 0.84, P.roofLt], [PC.r * 0.7, P.roofGap], [PC.r * 0.68, P.roof], [PC.r * 0.54, P.roofGap], [PC.r * 0.52, P.roofLt], [PC.r * 0.4, P.wallDk], [PC.r * 0.37, P.court]].forEach(([r, col]) => poly(pentPts(r), col));
  for (let k = 0; k < 5; k++) { const a = pentPts(PC.r)[k], b = pentPts(PC.r * 0.4)[k]; ctx.strokeStyle = P.roofGap; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); }
  ellipse(PC.x, PC.y, 30, 18, '#6b6458');
}
const ROADS = [[[-300, 1900], [180, 1420], [300, 1360]], [[1400, 1950], [900, 1440], [820, 1390]], [[-300, 900], [120, 1060], [170, 1090]]];
function drawGroundAerial() {
  ctx.fillStyle = P.lawn; ctx.fillRect(-1500, 700, 4000, 3000);
  for (let i = 0; i < 40; i++) ellipse(-400 + hash(i) * 1900, 760 + hash(i + 5) * 1300, 60 + hash(i + 2) * 120, 20 + hash(i + 8) * 40, P.lawnLt);
  // parking lots, full of cars at midnight
  [[-120, 1520, 330, 230], [880, 1560, 340, 220], [820, 760, 330, 180]].forEach(([x, y, w, h], j) => {
    fillRR(x, y, w, h, 10, P.lot);
    for (let i = 0; i < 18; i++) if (hash(i + j * 30) < 0.6) fillRR(x + 16 + (i % 6) * 52, y + 20 + Math.floor(i / 6) * (h / 3.2), 34, 22, 5, ['#8a3b3b', '#38506e', '#a6a6a6', '#5d6b4b'][i % 4]);
  });
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ROADS.forEach((r) => {
    ctx.strokeStyle = P.road; ctx.lineWidth = 70; ctx.beginPath(); r.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke();
    ctx.strokeStyle = P.roadLine; ctx.lineWidth = 4; ctx.setLineDash([22, 24]); ctx.beginPath(); r.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke(); ctx.setLineDash([]);
  });
}
// A delivery car from above: body, windscreen, a roof sign, headlights.
function car(x, y, ang, t) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang);
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const g = ctx.createLinearGradient(30, 0, 210, 0); g.addColorStop(0, rgba('#fff1b8', 0.45)); g.addColorStop(1, rgba('#fff1b8', 0));
  ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(28, -10); ctx.lineTo(210, -60); ctx.lineTo(210, 60); ctx.lineTo(28, 10); ctx.fill(); ctx.restore();
  fillRR(-34, -20, 68, 40, 10, '#e9e4da'); fillRR(4, -16, 16, 32, 5, '#3c4f6b'); fillRR(-26, -15, 12, 30, 4, '#3c4f6b');
  fillRR(-12, -11, 18, 22, 3, P.red); ctx.fillStyle = '#fff'; ctx.fillRect(-9, -2, 12, 4);
  ctx.restore();
}
function along(path, k) { // a point (and heading) along a polyline, k 0–1
  const lens = path.slice(1).map((p, i) => Math.hypot(p[0] - path[i][0], p[1] - path[i][1])), L = lens.reduce((a, b) => a + b, 0);
  let d = clamp(k) * L;
  for (let i = 0; i < lens.length; i++) { if (d <= lens[i] || i === lens.length - 1) { const u = clamp(d / lens[i]), a = path[i], b = path[i + 1]; return { x: lerp(a[0], b[0], u), y: lerp(a[1], b[1], u), ang: Math.atan2(b[1] - a[1], b[0] - a[0]) }; } d -= lens[i]; }
}
// A pizza box, front-on with its lid edge showing. w is its width.
function pizzaBox(x, y, w, tilt = 0, label = true) {
  const h = w * 0.18;
  ctx.save(); ctx.translate(x, y); ctx.rotate(tilt);
  poly([[-w / 2 + w * 0.06, -h - w * 0.1], [w / 2 + w * 0.06, -h - w * 0.1], [w / 2, -h], [-w / 2, -h]], P.box); // lid top
  fillRR(-w / 2, -h, w, h, 3, P.boxDk);
  if (label) { fillRR(-w * 0.16, -h * 0.78, w * 0.32, h * 0.56, 3, P.boxRed); }
  ctx.restore();
}
// How tall the box tower is (boxes): a few at first, then it goes through the roof.
const towerN = (t) => (t < T.pentagon ? 0 : Math.floor(lerp(0, 6, seg(t, T.pentagon, T.roof)) + Math.pow(seg(t, T.roof, T.name), 1.6) * 120));
function drawTower(t) {
  const n = towerN(t), bw = 150, bh = bw * 0.28;
  for (let i = 0; i < n; i++) pizzaBox(PC.x + Math.sin(i * 1.3) * 8, PC.y - 10 - i * bh, bw, Math.sin(i * 2.1) * 0.03);
  return PC.y - 10 - n * bh;
}
const CARS = [[0, 0.2, 3.3], [1, T.pentagon - 0.6, T.roof + 0.2], [2, T.pentagon - 0.3, T.roof + 0.6], [0, T.pentagon, T.roof + 0.9], [1, T.roof - 0.3, T.name], [2, T.roof, T.name + 0.2], [0, T.roof + 0.2, T.name + 0.3]];
function aerialScene(t) {
  // camera: slow push on the building, then tilt up the tower as it goes through the roof
  const top = PC.y - 10 - towerN(t) * 42;
  const push = ease.inOut(seg(t, 0, T.pentagon)), z = lerp(0.92, 1.08, push);
  const cy = t < T.roof ? lerp(1080, 1120, push) : Math.min(1120, top + 380);
  ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-540, -cy);
  nightSky(t, -6000, 760);
  drawGroundAerial();
  CARS.forEach(([r, a, b], i) => { if (t < a || t > b + 0.2) return; const p = along(ROADS[r], ease.out(seg(t, a, b))); car(p.x, p.y, p.ang, t); });
  drawPentagon(t);
  drawTower(t);
  ctx.restore();
  if (t < T.roof + 0.2) { ctx.save(); ctx.globalAlpha = 1 - seg(t, T.roof - 0.2, T.roof + 0.2); moon(900, 440, 56); ctx.restore(); }
  // the surveillance-feed HUD
  hud('WASHINGTON, D.C.', 540, 300, 24); hud('AUG 1, 1990 · 11:47 PM', 540, 340, 30);
  const k = seg(t, T.pentagon, T.roof + 0.3);
  if (k > 0) { hud('PIZZA ORDERS', 540, 420, 22, 'center', k); for (let i = 0; i < 5; i++) fillRR(440 + i * 42, 450, 32, 14, 3, rgba(P.hud, seg(t, T.pentagon + i * 0.35, T.pentagon + i * 0.35 + 0.1) * k)); }
  const r = (Math.floor(t * 2) % 2) === 0; if (r) circle(110, 302, 9, '#ff4d4d'); hud('REC', 130, 302, 20, 'left');
}
// ── "The Pentagon Pizza Index" ───────────────────────────────────────────────
function indexScene(t) {
  ctx.save(); nightSky(t, 0, H); ctx.restore();
  moon(900, 360, 50);
  // a stack of boxes in the background still going up
  for (let i = 0; i < 40; i++) pizzaBox(170 + Math.sin(i) * 6, 1900 - i * 40 - ((t - T.name) * 120 % 40), 140, 0, true);
  const k = ease.back(seg(t, T.name - 0.05, T.name + 0.35));
  ctx.save(); ctx.translate(560, 860); ctx.rotate(-0.03); ctx.scale(k, k); ctx.translate(-560, -860);
  const x0 = 140, y0 = 470, w = 840, h = 760;
  fillRR(x0 + 10, y0 + 14, w, h, 26, 'rgba(0,0,0,0.35)'); fillRR(x0, y0, w, h, 26, '#f6eedb');
  // title: blank bars until it's named, then stamped in
  const named = seg(t, T.pindex, T.pindex + 0.15);
  if (named < 1) { ctx.save(); ctx.globalAlpha *= 1 - named; fillRR(x0 + 60, y0 + 60, 520, 34, 10, '#e3d8bf'); fillRR(x0 + 60, y0 + 110, 340, 34, 10, '#e3d8bf'); ctx.restore(); }
  if (named > 0) {
    const s = 1 + 0.4 * (1 - ease.out(named));
    ctx.save(); ctx.globalAlpha *= named; ctx.translate(x0 + 60, y0 + 100); ctx.scale(s, s);
    text('THE PENTAGON', 0, -22, 40, 800, '#2b2b33', 'left', 0.02); text('PIZZA INDEX', 0, 28, 64, 800, P.red, 'left', -0.01);
    ctx.restore();
  }
  // the chart: flat for weeks, then a spike on the last night
  const cx0 = x0 + 70, cx1 = x0 + w - 70, cy0 = y0 + 230, cy1 = y0 + h - 110;
  ctx.strokeStyle = '#d8ccb0'; ctx.lineWidth = 2; for (let i = 0; i <= 4; i++) { const y = lerp(cy0, cy1, i / 4); ctx.beginPath(); ctx.moveTo(cx0, y); ctx.lineTo(cx1, y); ctx.stroke(); }
  const pts = Array.from({ length: 31 }, (_, i) => { const u = i / 30, v = u < 0.85 ? 0.12 + 0.06 * Math.sin(i * 1.9) + 0.04 * hash(i) : 0.12 + Math.pow((u - 0.85) / 0.15, 1.6) * 0.86; return [lerp(cx0, cx1, u), lerp(cy1, cy0, v)]; });
  const draw = ease.inOut(seg(t, T.name + 0.2, T.index + 0.4)), n = Math.max(1, Math.floor(draw * 30));
  ctx.strokeStyle = P.red; ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); pts.slice(0, n + 1).forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke();
  const head = pts[n];
  slice(head[0], head[1] - 6, 50, -0.3 + Math.sin(t * 8) * 0.08);
  text('JUL', cx0, cy1 + 40, 22, 700, '#9a8f78', 'left', 0.1); text('AUG 1', cx1, cy1 + 40, 22, 800, P.red, 'right', 0.1);
  ctx.restore();
}
// A pizza slice, point down, centred at (x, y).
function slice(x, y, s, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  poly([[-s * 0.55, -s * 0.45], [s * 0.55, -s * 0.45], [0, s * 0.7]], P.cheese);
  fillRR(-s * 0.62, -s * 0.62, s * 1.24, s * 0.24, s * 0.12, P.crust);
  circle(-s * 0.18, -s * 0.15, s * 0.11, P.pep); circle(s * 0.16, -s * 0.05, s * 0.1, P.pep); circle(0, s * 0.22, s * 0.08, P.pep);
  ctx.restore();
}
// ── "Late-night pizza? Something big is coming." — a general, mid-slice ───────
function generalScene(t) {
  const alarm = seg(t, T.big, T.big + 0.15), z = 1 + 0.05 * seg(t, T.late, T.sonow);
  ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2);
  // outside wall at night, a big lit window
  ctx.fillStyle = P.wallDk; ctx.fillRect(0, 0, W, H);
  for (let y = 0; y < H; y += 120) { ctx.fillStyle = 'rgba(0,0,0,0.06)'; ctx.fillRect(0, y, W, 4); }
  const wx = 90, wy = 360, ww = 900, wh = 1060;
  fillRR(wx - 24, wy - 24, ww + 48, wh + 48, 10, P.wall);
  ctx.save(); rr(wx, wy, ww, wh, 4); ctx.clip();
  ctx.fillStyle = '#f0d9a6'; ctx.fillRect(wx, wy, ww, wh);
  // the wall map with red arrows
  fillRR(wx + 120, wy + 70, 660, 360, 8, '#7a8f9e'); fillRR(wx + 140, wy + 90, 620, 320, 6, '#a9c2cf');
  poly([[wx + 220, wy + 160], [wx + 420, wy + 130], [wx + 520, wy + 210], [wx + 430, wy + 330], [wx + 260, wy + 310]], '#d9c79a');
  poly([[wx + 540, wy + 170], [wx + 690, wy + 200], [wx + 680, wy + 340], [wx + 560, wy + 300]], '#c9b98a');
  ctx.strokeStyle = P.red; ctx.lineWidth = 10; ctx.lineCap = 'round';
  [[wx + 300, wy + 250, wx + 470, wy + 220], [wx + 600, wy + 330, wx + 520, wy + 250]].forEach(([a, b, c, d]) => { ctx.beginPath(); ctx.moveTo(a, b); ctx.quadraticCurveTo((a + c) / 2, b - 70, c, d); ctx.stroke(); });
  // the general
  const gx = wx + 450, gy = wy + 640, bob = Math.sin(t * 2.4) * 3;
  fillRR(gx - 210, gy + 40 + bob, 420, 420, 80, P.green);                       // jacket
  poly([[gx - 60, gy + 40 + bob], [gx, gy + 150 + bob], [gx + 60, gy + 40 + bob]], '#e9e4da'); // shirt
  poly([[gx - 18, gy + 60 + bob], [gx + 18, gy + 60 + bob], [gx + 10, gy + 170 + bob], [gx - 10, gy + 170 + bob]], '#3a2a2a'); // tie
  fillRR(gx - 230, gy + 50 + bob, 90, 30, 10, P.gold); fillRR(gx + 140, gy + 50 + bob, 90, 30, 10, P.gold); // shoulder boards
  ['#d2422f', '#3c6bd1', '#e8c25a', '#3a9a5c', '#d2422f', '#e8c25a'].forEach((c, i) => fillRR(gx - 170 + (i % 3) * 36, gy + 120 + Math.floor(i / 3) * 24 + bob, 30, 16, 3, c)); // medals
  const hy = gy - 90 + bob;
  circle(gx, hy, 110, P.skin); ellipse(gx - 108, hy + 10, 18, 26, P.skinDk); ellipse(gx + 108, hy + 10, 18, 26, P.skinDk);
  const eye = 1 + alarm * 0.9;
  circle(gx - 40, hy - 10, 11 * eye, '#fff'); circle(gx + 40, hy - 10, 11 * eye, '#fff'); circle(gx - 40, hy - 8, 6, '#1b1410'); circle(gx + 40, hy - 8, 6, '#1b1410');
  ctx.strokeStyle = '#5a3f30'; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(gx - 62, hy - 40 - alarm * 14); ctx.lineTo(gx - 20, hy - 34 - alarm * 6); ctx.moveTo(gx + 62, hy - 40 - alarm * 14); ctx.lineTo(gx + 20, hy - 34 - alarm * 6); ctx.stroke();
  ellipse(gx, hy + 40, 54, 18, '#d8d2c8'); // moustache
  // mouth: chewing, then frozen open
  const chew = alarm > 0 ? 1 : 0.5 + 0.5 * Math.sin(t * 10);
  ellipse(gx, hy + 72, 22, 6 + chew * 12, '#6b2a22');
  // cap
  poly([[gx - 125, hy - 60], [gx + 125, hy - 60], [gx + 150, hy - 120], [gx - 150, hy - 120]], P.green);
  ellipse(gx, hy - 128, 150, 40, P.greenDk); fillRR(gx - 130, hy - 70, 260, 24, 10, '#1d1d1d');
  ctx.save(); ctx.translate(gx, hy - 100); poly([[0, -22], [8, -6], [24, -6], [11, 4], [16, 20], [0, 10], [-16, 20], [-11, 4], [-24, -6], [-8, -6]], P.gold); ctx.restore();
  // the hand with a slice; the cheese drips when the alarm goes
  const sx = gx + 170, sy = hy + 120 + bob - (alarm ? 0 : Math.max(0, Math.sin(t * 2)) * 20);
  slice(sx, sy - 70, 120, 0.5 + alarm * 0.3);
  if (alarm > 0) { const d = seg(t, T.big + 0.1, T.coming + 0.5); fillRR(sx + 10, sy - 10, 14, 30 + d * 110, 7, P.cheese); }
  circle(sx - 10, sy + 10, 32, P.skin); fillRR(sx - 50, sy + 20, 80, 200, 36, P.green);
  // the desk: a stack of boxes and a red phone
  fillRR(wx - 10, wy + 850, ww + 20, 260, 6, '#6b4428'); ctx.fillStyle = '#5a381f'; ctx.fillRect(wx - 10, wy + 850, ww + 20, 14);
  for (let i = 0; i < 6; i++) pizzaBox(wx + 170 + Math.sin(i * 2) * 6, wy + 850 - i * 34, 200, 0);
  fillRR(wx + 640, wy + 790, 140, 60, 18, P.red); fillRR(wx + 620, wy + 770, 180, 30, 14, P.redDk);
  ctx.restore();
  // the siren: a red lamp on the desk, its beam sweeping the room
  if (alarm > 0) {
    const a = (t - T.big) * 9, lx = wx + 520, ly = wy + 800;
    ctx.save(); rr(wx, wy, ww, wh, 4); ctx.clip(); ctx.globalCompositeOperation = 'lighter';
    for (const off of [0, Math.PI]) {
      const g = ctx.createRadialGradient(lx, ly, 0, lx, ly, 900); g.addColorStop(0, rgba('#ff3b30', 0.45)); g.addColorStop(1, rgba('#ff3b30', 0));
      ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(lx, ly); ctx.arc(lx, ly, 800, a + off - 0.35, a + off + 0.35); ctx.fill();
    }
    ctx.restore();
    fillRR(lx - 30, ly - 10, 60, 60, 12, '#ff3b30'); fillRR(lx - 40, ly + 44, 80, 16, 4, '#2a2a2a'); glow(lx, ly + 20, 120, '#ff3b30', 0.6);
  }
  ctx.restore();
}
// ── "So now, some people watch pizza deliveries… very closely." ──────────────
// A street at night: the pizza shop, a streetlamp, the delivery guy, and a bush that follows him.
const STREET_Y = 1250;
const courierX = (t) => lerp(170, 800, ease.inOut(seg(t, T.sonow, T.pivot + 0.4)));
const bushX = (t) => { const c = courierX(t) - 320; return Math.max(c, 120) + (Math.floor((t - T.sonow) * 2.2) % 2 ? 0 : 0); };
function drawCourier(x, y, phase) {
  const sw = Math.sin(phase) * 0.45, bob = Math.abs(Math.sin(phase)) * 6;
  ctx.save(); ctx.translate(x, y - bob);
  const leg = (a, col) => { ctx.save(); ctx.translate(0, -110); ctx.rotate(a); ctx.fillStyle = col; ctx.fillRect(-12, 0, 24, 104); fillRR(-12, 96, 40, 18, 8, '#1d1d22'); ctx.restore(); };
  leg(-sw, '#2b3242'); leg(sw, '#353d50');
  fillRR(-32, -215, 64, 112, 18, P.red);
  ctx.save(); ctx.translate(4, -245);
  circle(0, 0, 32, P.skin); circle(14, -4, 4, '#1b1410'); ellipse(28, 4, 7, 6, P.skinDk); ellipse(-22, 2, 7, 10, P.skinDk);
  ctx.fillStyle = P.red; ctx.beginPath(); ctx.arc(0, -8, 33, Math.PI, 0); ctx.fill(); fillRR(10, -14, 40, 10, 5, P.redDk);
  ctx.restore();
  // arms out front carrying the boxes
  ctx.strokeStyle = P.redDk; ctx.lineWidth = 20; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(6, -190); ctx.lineTo(56, -150); ctx.stroke();
  for (let i = 0; i < 3; i++) pizzaBox(70, -150 - i * 30, 130, 0);
  circle(56, -150, 11, P.skin);
  ctx.restore();
}
function drawBush(x, y, t, peek = 1) {
  // the spy rises out of the bush with binoculars
  const py = y - 150 - peek * 150 + Math.sin(t * 6) * 3;
  ctx.save(); ctx.translate(x, py);
  fillRR(-60, 60, 120, 120, 30, P.coat); // collar
  circle(0, 30, 52, P.skin);
  ellipse(0, -14, 86, 18, P.hat); fillRR(-50, -70, 100, 60, 16, P.hat); fillRR(-50, -30, 100, 12, 4, '#1d1714');
  // binoculars
  fillRR(-48, 12, 40, 44, 10, '#1d1d22'); fillRR(8, 12, 40, 44, 10, '#1d1d22'); fillRR(-12, 26, 24, 14, 4, '#33333a');
  circle(-28, 18, 12, '#6d8fb3'); circle(28, 18, 12, '#6d8fb3');
  ctx.restore();
  // the bush, rustling as it creeps
  const r = Math.sin(t * 14) * 4;
  [[-120, 0, 90], [-40, -50, 105], [60, -30, 100], [130, 10, 80], [0, 10, 110]].forEach(([dx, dy, rad], i) => circle(x + dx + (i % 2 ? r : -r), y + dy - 40, rad, i % 2 ? P.bushLt : P.bush));
  for (let i = 0; i < 16; i++) ellipse(x - 150 + hash(i) * 300, y - 130 + hash(i + 4) * 150, 14, 8, rgba('#7fc48a', 0.5), hash(i + 9) * 3);
}
function drawStreet(t) {
  nightSky(t, 0, STREET_Y); moon(880, 200, 46);
  // buildings behind
  [[0, 520, 260], [250, 600, 220], [460, 470, 300], [760, 560, 330]].forEach(([x, y, w], i) => {
    fillRR(x, y, w, STREET_Y - y, 4, ['#243154', '#2b3a62', '#1f2a4a', '#28365c'][i]);
    for (let j = 0; j < 20; j++) if (hash(i * 40 + j) < 0.45) fillRR(x + 24 + (j % 4) * (w / 4.4), y + 40 + Math.floor(j / 4) * 90, 30, 40, 3, rgba(P.window, 0.8));
  });
  // the pizza shop
  fillRR(-20, 820, 470, STREET_Y - 820, 6, '#7a2f26'); fillRR(30, 960, 250, STREET_Y - 960, 4, '#f3c76a'); fillRR(310, 1000, 100, STREET_Y - 1000, 4, '#3a1c18');
  const flick = 0.85 + 0.15 * Math.sin(t * 23) * Math.sin(t * 7);
  glow(210, 880, 260, '#ff5a4a', 0.35 * flick);
  ctx.save(); ctx.shadowColor = '#ff5a4a'; ctx.shadowBlur = 30; text('PIZZA', 210, 884, 92, 800, rgba('#ffd9d2', flick), 'center', 0.06); ctx.restore();
  fillRR(-20, 940, 470, 18, 4, '#f2f0ea'); for (let i = 0; i < 8; i++) fillRR(-20 + i * 60, 940, 30, 18, 0, P.red);
  // sidewalk, kerb, road
  ctx.fillStyle = '#5b5f6b'; ctx.fillRect(0, STREET_Y, W, 140); ctx.fillStyle = '#8a8e99'; ctx.fillRect(0, STREET_Y + 130, W, 16);
  ctx.fillStyle = '#2c303a'; ctx.fillRect(0, STREET_Y + 146, W, H); ctx.fillStyle = P.roadLine; for (let x = 0; x < W; x += 140) ctx.fillRect(x, STREET_Y + 360, 80, 12);
  // streetlamp
  ctx.fillStyle = '#20232b'; ctx.fillRect(800, 700, 18, STREET_Y - 700 + 40); fillRR(760, 690, 110, 26, 12, '#20232b');
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const g = ctx.createLinearGradient(0, 716, 0, STREET_Y + 140); g.addColorStop(0, rgba('#ffe7a8', 0.4)); g.addColorStop(1, rgba('#ffe7a8', 0));
  ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(780, 716); ctx.lineTo(860, 716); ctx.lineTo(1010, STREET_Y + 140); ctx.lineTo(630, STREET_Y + 140); ctx.fill(); ctx.restore();
}
function streetScene(t) {
  // framed tight on the sidewalk, tracking between the bush and the delivery guy
  const cxp = courierX(t), z = lerp(1.32, 1.4, seg(t, T.sonow, T.closely)), px = clamp((cxp + bushX(t)) / 2, 400, 700);
  ctx.save(); ctx.translate(W / 2, 1020); ctx.scale(z, z); ctx.translate(-px, -1130);
  drawStreet(t);
  const peek = ease.out(seg(t, T.sonow + 0.4, T.watch)) * (0.6 + 0.4 * ease.out(seg(t, T.watch, T.watch + 0.4)));
  drawBush(bushX(t), STREET_Y + 100, t, peek);
  drawCourier(cxp, STREET_Y + 110, (cxp - 170) / 28);
  ctx.restore();
  // "…very closely": through the binoculars, locked onto the box
  if (t >= T.closely) binoculars(t);
}
function binoculars(t) {
  const k = seg(t, T.closely, T.closely + 0.2), iris = ease.in(seg(t, T.pivot - 0.05, T.pivot + 0.55));
  const r = lerp(800, 300, ease.out(k)) + iris * 1400, L = { x: 540 - r * 0.62, y: 900 }, R = { x: 540 + r * 0.62, y: 900 };
  // inside the lenses: the box, close up, with a little handheld wobble
  const z = 3.1, fx = courierX(t) + 70 + Math.sin(t * 5) * 6, fy = STREET_Y + 110 - 190 - 40 + Math.cos(t * 4) * 6;
  lensMask(r);
  ctx.save();
  ctx.beginPath(); ctx.moveTo(L.x + r, L.y); ctx.arc(L.x, L.y, r, 0, Math.PI * 2); ctx.moveTo(R.x + r, R.y); ctx.arc(R.x, R.y, r, 0, Math.PI * 2); ctx.clip('nonzero');
  if (iris <= 0) {
    ctx.save(); ctx.translate(540, 900); ctx.scale(z, z); ctx.translate(-fx, -fy);
    drawStreet(t); drawCourier(courierX(t), STREET_Y + 110, (courierX(t) - 170) / 28);
    ctx.restore();
    ctx.fillStyle = 'rgba(40,255,120,0.10)'; ctx.fillRect(0, 0, W, H);
    for (let y = 0; y < H; y += 6) { ctx.fillStyle = 'rgba(0,0,0,0.10)'; ctx.fillRect(0, y, W, 2); }
    // lock-on brackets and readout
    const lk = ease.back(seg(t, T.closely + 0.25, T.closely + 0.5)), bx = 540, by = 880, s = lerp(320, 190, clamp(lk));
    ctx.strokeStyle = P.hud; ctx.lineWidth = 6; ctx.lineCap = 'square';
    [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([sx, sy]) => { ctx.beginPath(); ctx.moveTo(bx + sx * s, by + sy * (s - 50)); ctx.lineTo(bx + sx * s, by + sy * s); ctx.lineTo(bx + sx * (s - 50), by + sy * s); ctx.stroke(); });
    hud(typed('PEPPERONI · LARGE', t, T.closely + 0.4), 540, 1150, 30);
    if (t > T.closely + 0.85) hud('CONFIRMED', 540, 1196, 30, 'center', (Math.floor(t * 6) % 2) ? 1 : 0.4);
  }
  ctx.restore();
}

// ═════════════════════════════════════════════════════════════════════════════
// ACT 2 · MsgHealth (black, a faint grid, brand indigo)
// ═════════════════════════════════════════════════════════════════════════════
const IN = { hi: '#c7c3ff', mid: '#a5a0ff', deep: '#7168ff' };
const MUTED = 'rgba(235,235,245,0.5)', SOFT = 'rgba(235,235,245,0.72)';
const RED = C.risk, GREEN = C.healthy, AMBER = C.attention;
const CX = 540, CARD = { x: 100, w: 880 };

function stage(t, glowA = 0.22) {
  ctx.fillStyle = '#050508'; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(255,255,255,0.035)'; ctx.lineWidth = 1;
  ctx.beginPath(); for (let x = 0; x <= W; x += 60) { ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, H); } for (let y = 0; y <= H; y += 60) { ctx.moveTo(0, y + 0.5); ctx.lineTo(W, y + 0.5); } ctx.stroke();
  glow(CX, 860, 720, C.primary, glowA);
}
// A scene fades up out of a blur and leaves the same way.
function enter(t, at, out, d = 0.35) {
  const pin = ease.quint(seg(t, at, at + d)), pout = ease.in(seg(t, out - 0.25, out));
  return { a: pin * (1 - pout), blur: (1 - pin) * 10 + pout * 10, dy: (1 - pin) * 40 - pout * 30 };
}
function withFade(f, draw) {
  if (f.a <= 0.002) return;
  ctx.save(); ctx.globalAlpha *= f.a; if (f.blur > 0.3) ctx.filter = `blur(${f.blur.toFixed(1)}px)`; ctx.translate(0, f.dy); draw(); ctx.restore();
}
function eyebrow(s, y, col = MUTED) { text(s, CX, y, 22, 700, col, 'center', 0.22); }
function card(x, y, w, h, o = {}) {
  fillRR(x, y, w, h, o.r ?? 24, o.fill ?? 'rgba(255,255,255,0.045)');
  strokeRR(x, y, w, h, o.r ?? 24, o.stroke ?? 'rgba(255,255,255,0.11)', o.lw ?? 2);
}
function avatar(x, y, r, initials, col, a = 1) {
  ctx.save(); ctx.globalAlpha *= a; circle(x, y, r, col); text(initials, x, y + 1, r * 0.78, 700, '#fff', 'center', 0); ctx.restore();
}
function tag(x, y, label, col, solid = false, size = 20) {
  const w = tw(label, size, 800, 0.1) + size * 1.4, h = size * 1.8;
  fillRR(x - w, y - h / 2, w, h, h / 2, solid ? col : rgba(col, 0.14));
  if (!solid) strokeRR(x - w, y - h / 2, w, h, h / 2, rgba(col, 0.45), 1.5);
  text(label, x - w / 2, y + 1, size, 800, solid ? '#fff' : col, 'center', 0.1);
  return w;
}
const PEOPLE = [
  { n: 'Ava R.', i: 'AR', c: '#0ea5a4', score: 92, st: 'Healthy', sc: GREEN, bars: [5, 6, 5, 7, 6, 6, 7, 6, 5, 7, 6, 7] },
  { n: 'Marcus T.', i: 'MT', c: '#e5803b', score: 85, st: 'Healthy', sc: GREEN, bars: [4, 5, 5, 4, 6, 5, 5, 6, 5, 4, 6, 5] },
  { n: 'Priya S.', i: 'PS', c: '#d9468a', score: 61, st: 'Needs attention', sc: AMBER, bars: [5, 4, 5, 4, 4, 3, 4, 3, 3, 3, 2, 3] },
  { n: 'Jordan K.', i: 'JK', c: '#6366f1', score: 38, st: 'At risk', sc: RED, bars: [6, 6, 5, 6, 5, 5, 4, 3, 2, 1, 0, 0] },
];

// F/G · "Your customers drop hints too. They just don't order pizza."
// A year of visits and replies; Jordan's tails off. Then a pizza box drops in: "NO PIZZA DETECTED".
function activityScene(t) {
  stage(t, 0.14);
  withFade(enter(t, T.pivot + 0.05, T.less + 0.05), () => {
    eyebrow('CUSTOMER ACTIVITY', 560);
    const rows = [PEOPLE[0], PEOPLE[1], PEOPLE[3]], y0 = 610, rh = 150;
    card(CARD.x, y0, CARD.w, rh * rows.length + 30);
    rows.forEach((p, r) => {
      const y = y0 + 15 + r * rh + rh / 2, jordan = r === 2, q = jordan ? seg(t, T.hints, T.hints + 0.3) : 0;
      if (r) { ctx.fillStyle = 'rgba(255,255,255,0.07)'; ctx.fillRect(CARD.x + 30, y - rh / 2, CARD.w - 60, 2); }
      avatar(CARD.x + 76, y, 38, p.i, p.c);
      text(p.n, CARD.x + 136, y - 18, 34, 700, '#fff');
      if (q < 0.5) { ctx.save(); ctx.globalAlpha *= 1 - 2 * q; text('Every 4 weeks', CARD.x + 136, y + 22, 24, 500, MUTED); ctx.restore(); }
      if (q > 0.5) { ctx.save(); ctx.globalAlpha *= 2 * q - 1; text('Tailing off', CARD.x + 136, y + 22, 24, 700, RED); ctx.restore(); }
      const bx0 = CARD.x + 470, bw = 22, gap = 9;
      p.bars.forEach((v, k) => {
        const g = ease.out(seg(t, T.pivot + 0.3 + k * 0.06 + r * 0.05, T.pivot + 0.7 + k * 0.06 + r * 0.05));
        const bx = bx0 + k * (bw + gap), h = v * 9 * g;
        if (v === 0) { circle(bx + bw / 2, y + 30, 4, rgba(jordan && q > 0 ? RED : '#ffffff', 0.35 * g)); return; }
        fillRR(bx, y + 34 - h, bw, h, 5, jordan && k > 5 ? rgba(IN.mid, 0.55 - 0.06 * (k - 5)) : rgba(IN.mid, 0.9));
      });
      if (jordan && q > 0) { strokeRR(CARD.x + 14, y - rh / 2 + 6, CARD.w - 28, rh - 12, 18, rgba(RED, 0.55 * q), 2.5); glow(bx0 + 300, y + 30, 120, RED, 0.12 * q); }
    });
    text('VISITS & REPLIES · LAST 12 MONTHS', CARD.x + CARD.w - 30, y0 + rh * 3 + 72, 18, 700, MUTED, 'right', 0.16);
    // the joke: a pizza box falls in above the card and gets stamped
    const d = seg(t, T.dont + 0.1, T.order + 0.15);
    if (d > 0) {
      const y = lerp(-200, 380, ease.out(d)) + (d >= 1 ? 0 : 0), sq = d >= 1 ? 1 + 0.08 * Math.exp(-(t - T.order - 0.15) * 10) * Math.sin((t - T.order) * 30) : 1;
      ctx.save(); ctx.translate(CX, y); ctx.scale(sq, 2 - sq); pizzaBox(0, 40, 300, 0.04); ctx.restore();
      const s = seg(t, T.order + 0.1, T.order + 0.25);
      if (s > 0) {
        ctx.save(); ctx.translate(CX + 10, 380); ctx.rotate(-0.12); const k = 1 + 0.6 * (1 - ease.out(s)); ctx.scale(k, k); ctx.globalAlpha *= s;
        fillRR(-230, -40, 460, 80, 10, 'rgba(8,8,12,0.92)'); strokeRR(-230, -40, 460, 80, 10, RED, 6); text('NO PIZZA DETECTED', 0, 2, 38, 800, RED, 'center', 0.06);
        ctx.restore();
      }
    }
  });
}
// H · "They book less. They reply slower. Then they're gone."
function signsScene(t) {
  stage(t, 0.12);
  withFade(enter(t, T.less, T.gone + 0.2, 0.3), () => {
    eyebrow('JORDAN · THE SIGNS', 560);
    const y0 = 610;
    card(CARD.x, y0, CARD.w, 160);
    avatar(CARD.x + 86, y0 + 80, 46, 'JK', PEOPLE[3].c);
    text('Jordan K.', CARD.x + 156, y0 + 62, 38, 700, '#fff');
    text('Regular · every 4 weeks', CARD.x + 156, y0 + 104, 24, 500, MUTED);
    [[T.less, 'Visits', 'EVERY 9 WEEKS'], [T.slower, 'Replies', 'AFTER 3 DAYS']].forEach(([at, label, flag], k) => {
      const e = ease.back(seg(t, at, at + 0.35)), y = y0 + 200 + k * 130;
      if (e <= 0) return;
      ctx.save(); ctx.globalAlpha *= clamp(e); ctx.translate(0, (1 - e) * 40);
      card(CARD.x, y, CARD.w, 110, { fill: rgba(RED, 0.07), stroke: rgba(RED, 0.55) });
      text(label, CARD.x + 36, y + 56, 32, 600, '#fff');
      tag(CARD.x + CARD.w - 30, y + 55, flag, RED);
      ctx.restore();
    });
  });
  const g = seg(t, T.gone - 0.1, T.gone + 0.25);
  if (g > 0) {
    const out = seg(t, T.gone + 0.5, T.brand - 0.05), y = 860, r = 130;
    ctx.save(); ctx.globalAlpha = g * (1 - out);
    avatar(CX, y, r, 'JK', PEOPLE[3].c, 1 - seg(t, T.gone + 0.05, T.gone + 0.55));
    ctx.setLineDash([16, 14]); ctx.lineWidth = 5; ctx.strokeStyle = 'rgba(235,235,245,0.55)';
    ctx.beginPath(); ctx.arc(CX, y, r, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
    text('Jordan K.', CX, y + r + 60, 36, 700, 'rgba(235,235,245,0.6)', 'center');
    ctx.restore();
  }
}
// I · the brand: "MsgHealth reads the signs for you." — the logo lands; a scan line reads the room.
function logoLockup(x, y, size, a = 1) {
  ctx.save(); ctx.globalAlpha *= a;
  const ww = tw(BRAND.name, size, 800, -0.035), ls = size * 1.35, gap = size * 0.28, full = ls + gap + ww, x0 = x - full / 2;
  if (LOGO) ctx.drawImage(LOGO, x0, y - ls / 2, ls, ls);
  text(BRAND.name, x0 + ls + gap, y + size * 0.04, size, 800, '#fff', 'left', -0.035);
  ctx.restore();
}
function brandScene(t) {
  const hit = seg(t, T.brand, T.brand + 0.5);
  stage(t, 0.12 + 0.28 * ease.out(hit));
  const flash = 1 - seg(t, T.brand, T.brand + 0.35);
  if (t >= T.brand) glow(CX, 860, 800, C.primary, 0.5 * flash);
  withFade(enter(t, T.brand - 0.02, T.scores + 0.1, 0.18), () => {
    for (let i = 0; i < 4; i++) {
      const p = ((t - T.reads) / 1.3 + i / 4);
      if (t < T.reads || p < 0) continue;
      const k = p % 1;
      ctx.strokeStyle = rgba(IN.mid, 0.4 * (1 - k)); ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(CX, 860, 160 + k * 420, 0, Math.PI * 2); ctx.stroke();
    }
    const s = 1 + 0.25 * (1 - ease.quint(hit));
    ctx.save(); ctx.translate(CX, 860); ctx.scale(s, s); ctx.translate(-CX, -860);
    logoLockup(CX, 860, 92);
    ctx.restore();
  });
}
// J · Client Health: "It scores every customer's health, and flags who's at risk."
function healthScene(t) {
  stage(t, 0.2);
  withFade(enter(t, T.scores, T.texts + 0.05), () => {
    eyebrow('CLIENT HEALTH', 500);
    const y0 = 550, rh = 128, open = ease.out(seg(t, T.risk, T.risk + 0.35)), extra = 74 * open;
    card(CARD.x, y0, CARD.w, rh * 4 + 24 + extra);
    PEOPLE.forEach((p, r) => {
      const e = ease.out(seg(t, T.scores + 0.05 + r * 0.12, T.scores + 0.45 + r * 0.12));
      const y = y0 + 12 + r * rh + rh / 2, jordan = r === 3, flag = jordan ? seg(t, T.flags, T.flags + 0.25) : 0;
      ctx.save(); ctx.globalAlpha *= e; ctx.translate(0, (1 - e) * 24);
      if (r) { ctx.fillStyle = 'rgba(255,255,255,0.07)'; ctx.fillRect(CARD.x + 30, y - rh / 2, CARD.w - 60, 2); }
      if (flag > 0) {
        const pulse = 0.5 + 0.5 * Math.sin((t - T.flags) * 9);
        fillRR(CARD.x + 12, y - rh / 2 + 6, CARD.w - 24, rh - 12 + extra, 18, rgba(RED, 0.09 * flag));
        strokeRR(CARD.x + 12, y - rh / 2 + 6, CARD.w - 24, rh - 12 + extra, 18, rgba(RED, (0.5 + 0.3 * pulse) * flag), 3);
      }
      avatar(CARD.x + 72, y, 36, p.i, p.c);
      text(p.n, CARD.x + 128, y - 16, 32, 700, '#fff');
      const cnt = ease.out(seg(t, T.every + r * 0.08, T.every + 0.9 + r * 0.08)), score = Math.round(p.score * cnt);
      const sa = seg(t, T.every + 0.7 + r * 0.08, T.every + 1.0 + r * 0.08);
      if (sa > 0) {
        ctx.save(); ctx.globalAlpha *= sa;
        if (jordan && flag > 0) { ctx.globalAlpha *= flag; tag(CARD.x + 128 + tw('AT RISK', 19, 800, 0.1) + 19 * 1.4, y + 22, 'AT RISK', RED, true, 19); }
        else { circle(CARD.x + 136, y + 22, 7, p.sc); text(p.st, CARD.x + 152, y + 23, 24, 600, SOFT); }
        ctx.restore();
      }
      const gx = CARD.x + CARD.w - 86;
      ctx.lineWidth = 9; ctx.lineCap = 'round';
      ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.beginPath(); ctx.arc(gx, y, 42, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = p.sc; ctx.beginPath(); ctx.arc(gx, y, 42, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (score / 100)); ctx.stroke();
      text(String(score), gx, y + 1, 32, 800, '#fff', 'center', -0.02);
      if (jordan && open > 0) {
        ctx.save(); ctx.globalAlpha *= open;
        let x = CARD.x + 128; const cy = y + rh / 2 + 20;
        ['Visits slowing', 'Replies slower · 3 days'].forEach((s) => {
          const w = tw(s, 22, 600) + 36; fillRR(x, cy - 22, w, 44, 22, 'rgba(255,255,255,0.07)'); text(s, x + w / 2, cy + 1, 22, 600, SOFT, 'center'); x += w + 12;
        });
        ctx.restore();
      }
      ctx.restore();
    });
  });
}
// K · "Then it texts them, before they leave. And they book again."
function bubble(x, y, maxW, lines, out, a) {
  if (a <= 0) return 0;
  const size = 30, lh = 40, w = Math.max(...lines.map((l) => tw(l, size, 500))) + 48, h = lines.length * lh + 30;
  const x0 = out ? x + maxW - w : x;
  ctx.save(); ctx.globalAlpha *= a;
  fillRR(x0, y, w, h, 26, out ? C.primary : 'rgba(255,255,255,0.1)');
  lines.forEach((l, i) => text(l, x0 + 24, y + 15 + lh / 2 + i * lh, size, 500, '#fff'));
  ctx.restore();
  return h;
}
function winbackScene(t) {
  stage(t, 0.22);
  withFade(enter(t, T.texts - 0.05, T.nobino - 0.05), () => {
    eyebrow('AUTOMATIONS · WIN-BACK', 470);
    const ry = 520; card(CARD.x, ry, CARD.w, 96, { r: 22 });
    let x = CARD.x + 28;
    text('When', x, ry + 49, 26, 600, MUTED); x += tw('When', 26, 600) + 14;
    { const s = 'At risk', w = tw(s, 24, 700) + 36; fillRR(x, ry + 26, w, 44, 22, rgba(RED, 0.16)); text(s, x + w / 2, ry + 49, 24, 700, RED, 'center'); x += w + 18; }
    text('→', x, ry + 48, 28, 700, MUTED); x += 46;
    { const s = 'Send SMS', w = tw(s, 24, 700) + 36; fillRR(x, ry + 26, w, 44, 22, rgba(IN.mid, 0.18)); text(s, x + w / 2, ry + 49, 24, 700, IN.hi, 'center'); }
    const on = ease.out(seg(t, T.texts + 0.1, T.texts + 0.35)), sx = CARD.x + CARD.w - 104;
    fillRR(sx, ry + 28, 76, 40, 20, on > 0.5 ? C.primary : 'rgba(255,255,255,0.16)'); circle(sx + 20 + 36 * on, ry + 48, 15, '#fff');
    const ty = 650, th = 610; card(CARD.x, ty, CARD.w, th);
    avatar(CARD.x + 66, ty + 62, 30, 'JK', PEOPLE[3].c);
    text('Jordan K.', CARD.x + 112, ty + 62, 30, 700, '#fff');
    const up = ease.out(seg(t, T.again + 0.75, T.again + 1.3)), sc = Math.round(lerp(38, 86, up)), col = up > 0.5 ? GREEN : RED;
    { const s = `Health ${sc}`, w = tw(s, 22, 800, 0.04) + 34, bx = CARD.x + CARD.w - 30 - w; fillRR(bx, ty + 40, w, 44, 22, rgba(col, 0.16)); strokeRR(bx, ty + 40, w, 44, 22, rgba(col, 0.5), 1.5); text(s, bx + w / 2, ty + 63, 22, 800, col, 'center', 0.04); }
    ctx.fillStyle = 'rgba(255,255,255,0.07)'; ctx.fillRect(CARD.x + 30, ty + 118, CARD.w - 60, 2);
    const bx = CARD.x + 40, bw = CARD.w - 80;
    const m1 = ease.back(seg(t, T.texts + 0.3, T.texts + 0.65));
    let y = ty + 150 + (1 - clamp(m1)) * 30;
    const h1 = bubble(bx, y, bw, ['Hi Jordan! It\'s been a while.', 'Want your usual, Thursday at 10?'], true, clamp(m1));
    const lab = seg(t, T.texts + 0.7, T.texts + 1.0);
    if (lab > 0) { ctx.save(); ctx.globalAlpha *= lab; text(t > T.before ? 'Sent automatically · SMS · Delivered' : 'Sent automatically · SMS', bx + bw, y + h1 + 28, 21, 600, IN.mid, 'right'); ctx.restore(); }
    const m2 = ease.back(seg(t, T.again - 0.05, T.again + 0.3));
    y = ty + 150 + h1 + 70 + (1 - clamp(m2)) * 30;
    const h2 = bubble(bx, y, bw, ['Yes please! See you then.'], false, clamp(m2));
    const b = ease.back(seg(t, T.again + 0.4, T.again + 0.75));
    if (b > 0) {
      const by = ty + 150 + h1 + 70 + h2 + 30, s = 'Booked · Thu 10:00 AM', w = tw(s, 28, 700) + 100, x0 = CX - w / 2;
      ctx.save(); ctx.globalAlpha *= clamp(b); ctx.translate(CX, by + 32); ctx.scale(0.85 + 0.15 * b, 0.85 + 0.15 * b); ctx.translate(-CX, -(by + 32));
      fillRR(x0, by, w, 64, 32, rgba(GREEN, 0.18)); strokeRR(x0, by, w, 64, 32, rgba(GREEN, 0.6), 2);
      circle(x0 + 38, by + 32, 15, GREEN); check(x0 + 38, by + 33, 15, '#fff', 3.5);
      text(s, x0 + 66, by + 33, 28, 700, '#fff');
      ctx.restore();
    }
  });
}
// L · "No binoculars required." — a pair of binoculars, struck out, then "Just MsgHealth."
function binoIcon(x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  fillRR(-110, -60, 90, 130, 26, '#e9e9f2'); fillRR(20, -60, 90, 130, 26, '#e9e9f2'); fillRR(-30, -30, 60, 40, 10, '#c7c7d4');
  circle(-65, 70, 44, '#e9e9f2'); circle(65, 70, 44, '#e9e9f2'); circle(-65, 70, 28, '#5b5b6b'); circle(65, 70, 28, '#5b5b6b');
  ctx.restore();
}
function noBinoScene(t) {
  stage(t, 0.16);
  withFade(enter(t, T.nobino - 0.1, T.end, 0.3), () => {
    const k = ease.back(seg(t, T.nobino, T.nobino + 0.35));
    ctx.save(); ctx.globalAlpha *= clamp(k); binoIcon(CX, 720, 1.25 * k); ctx.restore();
    const s = ease.out(seg(t, T.nobino + 0.4, T.nobino + 0.7));
    if (s > 0) {
      ctx.strokeStyle = RED; ctx.lineWidth = 22; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.arc(CX, 740, 230, 0, Math.PI * 2 * s); ctx.stroke();
      if (s > 0.6) { const u = seg(s, 0.6, 1); ctx.beginPath(); ctx.moveTo(CX - 162, 740 - 162); ctx.lineTo(CX - 162 + 324 * u, 740 - 162 + 324 * u); ctx.stroke(); }
    }
    const j = ease.out(seg(t, T.nobino + 0.85, T.nobino + 1.2));
    if (j > 0) {
      ctx.save(); ctx.globalAlpha *= j; ctx.translate(0, (1 - j) * 30);
      const w2 = tw('Just MsgHealth.', 96, 800), g = ctx.createLinearGradient(CX - w2 / 2, 0, CX + w2 / 2, 0);
      g.addColorStop(0, IN.hi); g.addColorStop(0.5, IN.mid); g.addColorStop(1, IN.deep);
      text('Just MsgHealth.', CX, 1100, 96, 800, g, 'center');
      ctx.restore();
    }
  });
}
// M · end card: logo, tagline, the button gets a tap.
function endScene(t) {
  const k = ease.quint(seg(t, T.end, T.end + 0.4));
  stage(t, 0.18 + 0.2 * k);
  if (t < T.end + 0.3) glow(CX, 860, 800, C.primary, 0.45 * (1 - seg(t, T.end, T.end + 0.3)));
  const s = 1 + 0.2 * (1 - k);
  ctx.save(); ctx.globalAlpha = k; ctx.translate(CX, 760); ctx.scale(s, s); ctx.translate(-CX, -760);
  logoLockup(CX, 720, 96);
  text(BRAND.tagline, CX, 830, 32, 500, SOFT, 'center');
  ctx.restore();
  const b = ease.back(seg(t, T.end + 0.35, T.end + 0.75));
  if (b > 0) {
    const press = t > T.tap - 0.06 && t < T.tap + 0.16 ? 0.94 : 1;
    const label = 'Try MsgHealth', bw = tw(label, 44, 800) + 160, bh = 116, by = 960;
    ctx.save(); ctx.globalAlpha = clamp(b); ctx.translate(CX, by + bh / 2); ctx.scale(b * press, b * press); ctx.translate(-CX, -(by + bh / 2));
    glow(CX, by + bh / 2, 360, C.primary, 0.45 + 0.15 * Math.sin(t * 4));
    fillRR(CX - bw / 2, by, bw, bh, bh / 2, C.primary);
    strokeRR(CX - bw / 2, by, bw, bh, bh / 2, 'rgba(255,255,255,0.25)', 2);
    text(label, CX - 30, by + bh / 2 + 2, 44, 800, '#fff', 'center');
    const ax = CX + tw(label, 44, 800) / 2 + 10; ctx.strokeStyle = '#fff'; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(ax, by + bh / 2); ctx.lineTo(ax + 40, by + bh / 2); ctx.moveTo(ax + 24, by + bh / 2 - 16); ctx.lineTo(ax + 40, by + bh / 2); ctx.lineTo(ax + 24, by + bh / 2 + 16); ctx.stroke();
    ctx.restore();
    const u = seg(t, T.tap + 0.45, T.tap + 0.8);
    ctx.save(); ctx.globalAlpha = u; text(BRAND.url.toUpperCase(), CX, by + bh + 70, 26, 800, IN.mid, 'center', 0.18); ctx.restore();
    if (HAND && t > T.tap - 0.7 && t < T.tap + 0.8) {
      const p = seg(t, T.tap - 0.7, T.tap - 0.05), q = seg(t, T.tap + 0.25, T.tap + 0.8);
      const hx = ax + 26 + (1 - ease.out(p)) * 220 + q * 160, hy = by + bh / 2 + 18 + (1 - ease.out(p)) * 300 + q * 240, k2 = 0.5;
      ctx.save(); ctx.globalAlpha = clamp(p * 3) * (1 - q);
      if (t > T.tap && t < T.tap + 0.4) { const r = seg(t, T.tap, T.tap + 0.4); ctx.strokeStyle = rgba('#ffffff', 0.7 * (1 - r)); ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(hx, hy, 20 + r * 60, 0, Math.PI * 2); ctx.stroke(); }
      ctx.translate(hx, hy); ctx.rotate(-0.12); ctx.scale(k2, k2); ctx.translate(-110.5, -117);
      ctx.drawImage(HAND, 0, 0);
      ctx.restore();
    }
  }
}

// ── captions: one phrase at a time in a black box, like the reference format ──
// Words between *stars* take the accent: cheese orange in act 1, brand indigo after.
const CAPS = [];
VO_CLIPS.forEach((clip, i) => clip.chunks.forEach(([s, off], k) => {
  const at = VO_AT[i] + off, next = k + 1 < clip.chunks.length ? VO_AT[i] + clip.chunks[k + 1][1] : VO_AT[i] + clip.dur + 0.2;
  CAPS.push({ at: at - 0.04, out: Math.min(next - 0.04, i + 1 < VO_AT.length ? VO_AT[i + 1] - 0.04 : Infinity), s, act2: VO_AT[i] >= T.pivot });
}));
const CAP_Y = 1340, CAP_SIZE = 46;
function drawCaption(t) {
  const c = CAPS.find((c) => t >= c.at && t < c.out);
  if (!c) return;
  let acc = false;
  const words = c.s.toUpperCase().split(' ').map((w) => { if (w.startsWith('*')) acc = true; const o = { w: w.replace(/\*/g, ''), acc }; if (/\*[.,?…]?$/.test(w)) acc = false; return o; });
  const sp = tw(' ', CAP_SIZE, 800, 0.01);
  words.forEach((w) => (w.width = tw(w.w, CAP_SIZE, 800, 0.01)));
  const tot = words.reduce((p, w) => p + w.width, 0) + sp * (words.length - 1), padX = 26, h = CAP_SIZE * 1.55;
  const pop = ease.back(seg(t, c.at, c.at + 0.14)), sc = 0.86 + 0.14 * pop;
  ctx.save(); ctx.translate(CX, CAP_Y); ctx.scale(sc, sc); ctx.translate(-CX, -CAP_Y);
  fillRR(CX - tot / 2 - padX, CAP_Y - h / 2, tot + padX * 2, h, 12, 'rgba(10,10,12,0.92)');
  let x = CX - tot / 2;
  font(CAP_SIZE, 800, 0.01); ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  words.forEach((w) => { ctx.fillStyle = w.acc ? (c.act2 ? IN.mid : accentA) : '#ffffff'; ctx.fillText(w.w, x, CAP_Y + 2); x += w.width + sp; });
  ctx.restore();
}
// A small brand watermark, top right (hidden while the logo itself is on screen).
function watermark(t) {
  const a = 0.85 * (1 - seg(t, T.brand - 0.3, T.brand)) + 0.85 * seg(t, T.scores, T.scores + 0.3) * (1 - seg(t, T.nobino + 0.6, T.nobino + 0.9));
  if (a <= 0.01) return;
  ctx.save(); ctx.globalAlpha = a; ctx.shadowColor = 'rgba(0,0,0,0.45)'; ctx.shadowBlur = 8;
  const s = BRAND.url.toUpperCase(), w = tw(s, 19, 800, 0.12), x1 = 1030;
  text(s, x1, 214, 19, 800, '#fff', 'right', 0.12);
  if (LOGO) ctx.drawImage(LOGO, x1 - w - 46, 196, 36, 36);
  ctx.restore();
}

// ── the edit ─────────────────────────────────────────────────────────────────
const SCENES = [
  [0, T.name, aerialScene],
  [T.name, T.late, indexScene],
  [T.late, T.sonow, generalScene],
  [T.sonow, T.pivot, streetScene],
  [T.pivot, T.less, activityScene],
  [T.less, T.brand, signsScene],
  [T.brand, T.scores + 0.1, brandScene],
  [T.scores + 0.1, T.texts, healthScene],
  [T.texts, T.nobino, winbackScene],
  [T.nobino, T.end, noBinoScene],
  [T.end, DURATION + 1, endScene],
];
function renderFrame(t) {
  ctx = MAIN;
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.filter = 'none'; ctx.globalCompositeOperation = 'source-over';
  const s = SCENES.find(([a, b]) => t >= a && t < b) ?? SCENES.at(-1);
  s[2](t);
  // the iris out of the binoculars carries over into act 2
  if (t >= T.pivot && t < T.pivot + 0.6) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; binocularMask(t); }
  // a quick white flash on the hard cuts in act 1
  [T.name, T.late, T.sonow].forEach((c) => { const f = 1 - seg(t, c, c + 0.12); if (t >= c && f > 0) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = rgba('#ffffff', 0.5 * f); ctx.fillRect(0, 0, W, H); } });
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.filter = 'none';
  watermark(t);
  drawCaption(t);
}
function binocularMask(t) {
  lensMask(300 + ease.in(seg(t, T.pivot - 0.05, T.pivot + 0.55)) * 1400);
}
// Black everywhere except the two lenses (their union, overlap included): cut out of a black layer, then laid on top.
let MASK = null;
function lensMask(r) {
  if (!MASK) { MASK = document.createElement('canvas'); MASK.width = W; MASK.height = H; }
  const m = MASK.getContext('2d');
  m.globalCompositeOperation = 'source-over'; m.fillStyle = '#000'; m.fillRect(0, 0, W, H);
  m.globalCompositeOperation = 'destination-out';
  [540 - r * 0.62, 540 + r * 0.62].forEach((x) => { m.beginPath(); m.arc(x, 900, r, 0, Math.PI * 2); m.fill(); });
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(MASK, 0, 0); ctx.restore();
}

// Sound cues (sample-based effects; the music, siren, engines and stings are synthesised from window.CUES).
cue(T.name, 'swoosh', 0.8);
cue(T.pindex + 0.05, 'punch', 0.8);
cue(T.late, 'swoosh', 0.8);
cue(T.sonow, 'swoosh', 0.8);
cue(T.closely + 0.02, 'transition', 0.8);
cue(T.closely + 0.5, 'ding', 0.6);
cue(T.pivot + 0.05, 'swish', 0.8);
[0, 1, 3].forEach((r, i) => cue(T.pivot + 0.35 + i * 0.05, 'key', 0.5));
cue(T.less + 0.05, 'key', 0.9); cue(T.slower + 0.05, 'key', 0.9);
cue(T.brand, 'transitionHit', 1);
[0, 1, 2, 3].forEach((r) => cue(T.scores + 0.1 + r * 0.12, 'key', 0.6));
cue(T.flags + 0.02, 'ding', 0.9);
cue(T.texts + 0.12, 'tap', 0.8);
cue(T.texts + 0.4, 'swish', 0.9);
cue(T.again, 'notification', 0.9);
cue(T.end, 'punch', 1);
cue(T.tap, 'tap', 1.2);

window.DURATION = DURATION;
window.renderFrame = renderFrame;
// Text audit hook (scripts/audit-text.mjs): while window.TEXT_LOG is an array, every string drawn is logged with its box.
{
  const fill = CanvasRenderingContext2D.prototype.fillText;
  CanvasRenderingContext2D.prototype.fillText = function (str, x, y, ...rest) {
    if (window.TEXT_LOG) {
      const T2 = this.getTransform(), m = this.measureText(str);
      const pts = [[x - m.actualBoundingBoxLeft, y - m.actualBoundingBoxAscent], [x + m.actualBoundingBoxRight, y + m.actualBoundingBoxDescent]]
        .flatMap(([px, py], i, a) => [[px, py], [a[1 - i][0], py]]).map(([px, py]) => [T2.a * px + T2.c * py + T2.e, T2.b * px + T2.d * py + T2.f]);
      const xs = pts.map((q) => q[0]), ys = pts.map((q) => q[1]);
      window.TEXT_LOG.push({ str, x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys), a: this.globalAlpha, layer: 'main' });
    }
    return fill.call(this, str, x, y, ...rest);
  };
}
window.ready = (async () => {
  MAIN = document.getElementById('c').getContext('2d');
  ctx = MAIN;
  await Promise.all(['500', '600', '700', '800'].map((w) => document.fonts.load(`${w} 40px ${FONT}`)));
  const load = (src) => new Promise((res) => { const im = new Image(); im.onload = () => res(im); im.onerror = () => res(null); im.src = src; });
  LOGO = await load(BRAND.logoFile);
  HAND = await load('assets/img/hand-tap.png');
  if (location.search.includes('render')) document.body.classList.add('render');
  renderFrame(0);
  return true;
})();

// ── player: plays the voiceover clips in sync (the full mix is only in the render) ──
(() => {
  const btn = document.getElementById('play'), seek = document.getElementById('seek'), tm = document.getElementById('time');
  if (!btn) return;
  const clips = window.VO.map((v) => Object.assign(new Audio(v.file), { preload: 'auto' }));
  let playing = false, cur = 0, t0 = 0, started = new Set();
  const show = (t) => { cur = t; renderFrame(t); seek.value = (t / DURATION) * 1000; tm.textContent = `${t.toFixed(1)}s / ${DURATION}s`; };
  const stopAll = () => { clips.forEach((c) => c.pause()); started.clear(); };
  const loop = () => {
    if (!playing) return;
    const t = (performance.now() - t0) / 1000;
    if (t >= DURATION) { playing = false; stopAll(); btn.textContent = 'Replay'; show(DURATION); return; }
    window.VO.forEach((v, i) => { if (t >= v.at && t < v.at + v.dur && !started.has(i)) { started.add(i); clips[i].currentTime = t - v.at; clips[i].play(); } });
    show(t); requestAnimationFrame(loop);
  };
  btn.onclick = () => {
    if (playing) { playing = false; stopAll(); btn.textContent = 'Play'; return; }
    if (cur >= DURATION) cur = 0;
    t0 = performance.now() - cur * 1000; playing = true; btn.textContent = 'Pause'; requestAnimationFrame(loop);
  };
  seek.oninput = () => { playing = false; stopAll(); btn.textContent = 'Play'; show((seek.value / 1000) * DURATION); };
  window.ready.then(() => { const q = new URLSearchParams(location.search).get('t'); if (q) show(+q); });
})();
