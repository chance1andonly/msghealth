// MsgHealth launch film — 33 s, 1920×1080, typographic product film.
// Device: one indigo pulse dot. It starts on a flatline, becomes the logo, rides the product
// demo, hops into the period of "Keep your customers." and finally beats again.
// Everything is drawn on one canvas from a single time value, so renderFrame(t) is deterministic.
'use strict';

const W = 1920, H = 1080, DURATION = 33;
const K = BRAND.colors;
const C = {
  ink: K.ink, deep: '#14123a', accent: K.primary, accentDark: K.primaryDark,
  tint: '#eeedfd', paper: '#fbfbff', mist: '#f3f2fb', line: '#e4e2f3', mute: '#8a88ad', soft: '#b9b7d6',
  ok: K.healthy, warn: K.attention, risk: K.risk,
};
let ctx, LOGO = null;

// ── helpers ──────────────────────────────────────────────────────────────────
const clamp = (x, a = 0, b = 1) => (x < a ? a : x > b ? b : x);
const P = (t, a, b) => clamp((t - a) / (b - a));
const lerp = (a, b, k) => a + (b - a) * k;
const eo = (x) => 1 - Math.pow(1 - x, 3);
const ei = (x) => x * x * x;
const io = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const expo = (x) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x));
const back = (x, s = 1.6) => { const y = x - 1; return 1 + (s + 1) * y * y * y + s * y * y; };
const rgb = (h) => { const n = parseInt(h.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; };
const mixc = (a, b, k) => { const A = rgb(a), B = rgb(b); return `rgb(${A.map((v, i) => Math.round(lerp(v, B[i], clamp(k)))).join(',')})`; };
const rng = (seed) => { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; };
const scoreColor = (s) => (s >= 72 ? C.ok : s >= 55 ? mixc(C.warn, C.ok, (s - 55) / 17) : s >= 40 ? mixc(C.risk, C.warn, (s - 40) / 15) : C.risk);

function txt(s, x, y, o = {}) {
  const { size = 40, w = 600, color = C.ink, align = 'left', ls = 0, a = 1 } = o;
  ctx.save(); ctx.globalAlpha *= a;
  ctx.font = `${w} ${size}px Inter`; ctx.letterSpacing = ls + 'px';
  ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = 'alphabetic';
  ctx.fillText(s, align === 'center' ? x + ls / 2 : align === 'right' ? x + ls : x, y);
  ctx.restore();
}
function tw(s, size, w = 600, ls = 0) {
  ctx.save(); ctx.font = `${w} ${size}px Inter`; ctx.letterSpacing = ls + 'px';
  const m = ctx.measureText(s).width; ctx.restore(); return m;
}
// a line of text that rises out of a mask
function rise(s, x, y, p, o = {}) {
  if (p <= 0) return;
  const size = o.size ?? 100, width = tw(s, size, o.w ?? 700, o.ls ?? 0);
  const x0 = (o.align ?? 'left') === 'center' ? x - width / 2 : x;
  ctx.save();
  ctx.beginPath(); ctx.rect(x0 - 30, y - size * 1.0, width + 60, size * 1.35); ctx.clip();
  txt(s, x, y + (1 - eo(p)) * size * 0.95, { ...o, a: (o.a ?? 1) * clamp(p * 3) });
  ctx.restore();
}
function box(x, y, w, h, r, fill, o = {}) {
  ctx.save();
  if (o.shadow) { ctx.shadowColor = `rgba(30,27,75,${o.sa ?? 0.14})`; ctx.shadowBlur = o.shadow; ctx.shadowOffsetY = o.sy ?? o.shadow * 0.35; }
  ctx.beginPath(); ctx.roundRect(x, y, Math.max(0, w), Math.max(0, h), Math.min(r, Math.max(0, w) / 2, Math.max(0, h) / 2));
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (o.stroke) { ctx.shadowColor = 'transparent'; ctx.lineWidth = o.lw ?? 2; ctx.strokeStyle = o.stroke; if (o.dash) ctx.setLineDash(o.dash); ctx.stroke(); }
  ctx.restore();
}
function dot(x, y, r, color = C.accent, a = 1) {
  if (r <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); ctx.restore();
}
function ring(x, y, r, lw, color, a) {
  ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
}
const TINT = {};
function logo(x, y, size, color, a = 1) { // centred; the glyph fills ~73% of the box
  if (!LOGO || size <= 0) return;
  if (!TINT[color]) {
    const c = document.createElement('canvas'); c.width = c.height = 512;
    const g = c.getContext('2d'); g.drawImage(LOGO, 0, 0);
    g.globalCompositeOperation = 'source-in'; g.fillStyle = color; g.fillRect(0, 0, 512, 512); TINT[color] = c;
  }
  ctx.save(); ctx.globalAlpha *= a; ctx.drawImage(TINT[color], x - size / 2, y - size / 2, size, size); ctx.restore();
}
function check(x, y, s, color, lw = 4) {
  ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(x - s * 0.5, y); ctx.lineTo(x - s * 0.12, y + s * 0.4); ctx.lineTo(x + s * 0.55, y - s * 0.42); ctx.stroke(); ctx.restore();
}

// ── the pulse line ───────────────────────────────────────────────────────────
const ECG = [[0, 0], [.1, 0], [.17, -.1], [.25, 0], [.36, 0], [.42, .16], [.5, -1], [.58, .5], [.66, 0], [.78, 0], [.86, -.22], [.95, 0], [1, 0]];
function ecg(u) {
  if (u < 0 || u > 1) return 0;
  for (let i = 1; i < ECG.length; i++) if (u <= ECG[i][0]) { const a = ECG[i - 1], b = ECG[i]; return a[1] + (b[1] - a[1]) * ((u - a[0]) / (b[0] - a[0])); }
  return 0;
}
const PULSE_BW = 300, PULSE_SP = 780;
const pulseOff = (x, t, speed) => { const ph = (((x - t * speed) % PULSE_SP) + PULSE_SP) % PULSE_SP; return ph < PULSE_BW ? ecg(ph / PULSE_BW) : 0; };
// y of the pulse line at x = 960 (where the dot sits), so the dot rides the line
const pulseDotY = (y, half, amp, t, speed = 520) => { let o = 0; for (let k = -3; k <= 3; k++) o += pulseOff(960 + k * 7, t, speed); return y + (o / 7) * amp * clamp(half / 180); };
function pulseLine(y, half, amp, t, lw = 5, speed = 480) {
  if (half <= 0) return;
  ctx.save(); ctx.lineWidth = lw; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.strokeStyle = C.accent; ctx.beginPath();
  let first = true;
  for (let x = 960 - half; x <= 960 + half + 1; x += 3) {
    const tap = clamp(Math.min(x - (960 - half), 960 + half - x) / 180);
    const yy = y + pulseOff(x, t, speed) * amp * tap;
    if (first) { ctx.moveTo(x, yy); first = false; } else ctx.lineTo(x, yy);
  }
  ctx.stroke(); ctx.restore();
}

// ── 0 · Hook (0–6 s): "Your customers / go quiet." ───────────────────────────
const NAMES = ['Jordan R.', 'Priya S.', 'Morgan E.', 'Alex C.', 'Dana O.', 'Sam P.', 'Lee N.', 'Maya T.', 'Chris B.', 'Nina K.', 'Omar F.', 'Ella W.', 'Theo M.', 'Ivy L.', 'Noah D.', 'Zoe H.', 'Ravi G.', 'Lena V.', 'Marco J.', 'Aya Q.', 'Kai U.', 'Rosa Z.'];
const PREVIEWS = ['Time to rebook?', 'We miss you!', 'Your next visit is due', 'Still need that slot?', 'Hi! Free this week?', 'Haven’t seen you lately', 'Book your next one?', 'Reminder: it’s been a while'];
const TINTS = ['#e0def9', '#e8e5fb', '#dcd9f7', '#e3e0fa'];
// An endless field: every grid cell is generated on demand from a hash, so zooming out never runs out of clients.
const hsh = (i, j, k) => { const v = Math.sin(i * 127.1 + j * 311.7 + k * 74.7) * 43758.5453; return v - Math.floor(v); };
const CELLS = new Map();
function cell(i, j) {
  const key = i * 4096 + j; let c = CELLS.get(key); if (c) return c;
  // the opening view (6×7 cells) keeps its layout; everything beyond it is scattered, with gaps,
  // mixed read states and late arrivals that keep popping in while the camera pulls back
  const inner = i >= -1 && i <= 6 && j >= -1 && j <= 7;
  c = { x: 24 + i * 312 + (((j % 2) + 2) % 2) * 20 + (inner ? 0 : (hsh(i, j, 5) - 0.5) * 70),
    y: -40 + j * 160 + (((i % 2) + 2) % 2) * 36 + (inner ? 0 : (hsh(i, j, 6) - 0.5) * 50),
    n: NAMES[Math.floor(hsh(i, j, 2) * NAMES.length)], p: PREVIEWS[Math.floor(hsh(i, j, 3) * PREVIEWS.length)],
    tint: TINTS[Math.floor(hsh(i, j, 4) * 4)],
    ta: inner ? 1.1 + 3.4 * Math.pow(hsh(i, j, 1), 1.5) : 1.1 + 4.5 * Math.pow(hsh(i, j, 1), 1.2),
    skip: !inner && hsh(i, j, 7) < 0.14, deadA: lerp(0.3, 0.75, hsh(i, j, 8)),
    nw: 90 + hsh(i, j, 9) * 70, pw: 110 + hsh(i, j, 10) * 80 };
  CELLS.set(key, c); return c;
}
function drawCard(c, t, s) {
  if (c.skip) return;
  const p = P(t, c.ta, c.ta + 0.5); if (p <= 0) return;
  const e = back(p, 1.2), dead = P(t, c.ta + 1.0, c.ta + 1.8), sc = lerp(0.9, 1, e);
  const cy = c.y - t * 8;
  ctx.save();
  const dist = Math.hypot(c.x + 146 - 960, cy + 48 - 540), quiet = lerp(1, lerp(0.12, 1, clamp((dist - 420) / 520)), P(t, 1.4, 2.0));
  ctx.globalAlpha *= clamp(p * 2) * lerp(1, c.deadA, dead) * quiet;
  ctx.translate(c.x + 146, cy + 48 + (1 - e) * 30); ctx.scale(sc, sc); ctx.translate(-146, -48);
  if (s < 0.35) { // far out: the same card, with its text drawn as bars (too small to read anyway)
    box(0, 0, 292, 96, 20, '#fff', { stroke: C.line, lw: Math.min(6, 1.2 / s) });
    dot(48, 48, 26, c.tint);
    box(88, 26, c.nw, 18, 9, '#d3d0ee'); box(88, 58, c.pw, 14, 7, '#e6e4f5');
    box(226, 18, 48, 10, 5, t > c.ta + 1.0 ? '#ecebf7' : '#dedcf1');
    ctx.restore(); return;
  }
  box(0, 0, 292, 96, 20, '#fff', s < 0.6 ? { stroke: C.line, lw: 3 } : { shadow: 24, sa: 0.1 });
  dot(48, 48, 26, c.tint);
  txt(c.n.split(' ').map((w) => w[0]).join(''), 48, 56, { size: 21, w: 700, color: C.accent, align: 'center' });
  txt(c.n, 88, 42, { size: 23, w: 700 });
  txt(c.p, 88, 72, { size: 18, w: 500, color: C.mute });
  txt(t > c.ta + 1.0 ? 'No reply' : 'Delivered', 274, 28, { size: 14, w: 600, color: t > c.ta + 1.0 ? C.soft : C.mute, align: 'right' });
  ctx.restore();
}
function drawHook(t) {
  // after "go quiet." the camera pulls back through an endless field of unanswered clients
  const zo = P(t, 4.9, 5.8), s = Math.exp(Math.log(0.07) * zo * zo * (3 - 2 * zo));
  const baseY = lerp(540, 930, io(P(t, 1.3, 2.1)));
  const amp = 110 * (1 - Math.pow(P(t, 2.2, 4.4), 1.3)) * P(t, 1.1, 1.5);
  ctx.save();
  ctx.globalAlpha = 1 - P(t, 5.55, 5.95);
  ctx.translate(960, 540); ctx.scale(s, s); ctx.translate(-960, -540);
  const xmin = 960 - 960 / s, xmax = 960 + 960 / s, ymin = 540 - 540 / s, ymax = 540 + 540 / s;
  for (let j = Math.floor((ymin + t * 8 + 40) / 160) - 2; j <= Math.ceil((ymax + t * 8 + 40) / 160) + 1; j++)
    for (let i = Math.floor((xmin - 24) / 312) - 2; i <= Math.ceil((xmax - 24) / 312) + 1; i++) drawCard(cell(i, j), t, s);
  const g = ctx.createRadialGradient(960, 540, 60, 960, 540, 860);
  g.addColorStop(0, `rgba(251,251,255,${0.97 * P(t, 1.3, 1.9)})`); g.addColorStop(1, 'rgba(251,251,255,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  // headline
  const shake = t >= 4.0 ? Math.exp(-(t - 4.0) * 7) * Math.sin((t - 4.0) * 34) * 7 : 0;
  ctx.translate(shake, -shake * 0.6);
  rise('Your customers', 960, 490, P(t, 1.5, 2.1), { size: 150, w: 700, ls: -7, align: 'center' });
  if (t >= 4.0) {
    const sl = P(t, 4.0, 4.34), z = lerp(1.22, 1, eo(sl));
    ctx.save(); ctx.translate(960, 690); ctx.scale(z, z); ctx.translate(-960, -690);
    txt('go quiet.', 960, 690, { size: 190, w: 800, ls: -9, align: 'center', a: clamp(sl * 4), color: mixc(C.ink, C.soft, io(P(t, 4.5, 5.3))) });
    ctx.restore();
  }
  // pulse line with fading heartbeat
  pulseLine(baseY, 960 * expo(P(t, 0.3, 1.2)) + 20, amp, t, 5, 520);
  ctx.restore();
  // the dot owns the frame: it rides the line (following every beat), then settles at the centre
  const wy = pulseDotY(baseY, 960 * expo(P(t, 0.3, 1.2)) + 20, amp, t);
  const dy = lerp(540 + (wy - 540) * s, 540, io(P(t, 5.6, 6.0)));
  const bump = t > 1.1 && t < 4.4 ? 1 + 0.25 * Math.max(0, Math.sin(t * Math.PI * 2 - 1.2)) * (1 - P(t, 2.2, 4.4)) : 1;
  dot(960, dy, 14 * bump * P(t, 0.0, 0.35 + 1e-6));
}

// ── 1 · Mark (6–10 s): ink flood, lockup ─────────────────────────────────────
function lockup(t, t0, o) {
  const { cx = 960, cy = 500, mark = 300, word = 190, ls = -7, c1, c2, fold = 0, scale = 1 } = o;
  const gw = tw('MsgHealth', word, 700, ls), glyph = mark * 0.73, total = glyph + 36 + gw;
  const x0 = cx - total / 2, mx = x0 + glyph / 2;
  const pop = o.markK ?? back(P(t, t0, t0 + 0.6), 1.5);
  ctx.save(); ctx.translate(cx, cy); ctx.scale(scale, scale); ctx.translate(-cx, -cy);
  const fm = lerp(mx, cx, io(fold)), ms = lerp(1, 0.14, io(fold)) * pop;
  logo(fm, cy, mark * ms, c1, (o.markA ?? 1) * (1 - P(fold, 0.7, 1)));
  const wp = io(P(t, t0 + 0.35, t0 + 0.95)) * (1 - io(clamp(fold * 1.6)));
  if (wp > 0.002) { ctx.save(); ctx.beginPath(); ctx.rect(x0 + glyph + 30, cy - word, gw * wp, word * 1.6); ctx.clip();
  txt('MsgHealth', x0 + glyph + 36, cy + word * 0.36, { size: word, w: 700, ls, color: c2 });
  ctx.restore(); }
  ctx.restore();
  return { x0, total, mx };
}
function drawMark(t) {
  const flood = 2400 * expo(P(t, 6.0, 6.7));
  ctx.fillStyle = C.paper; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.beginPath(); ctx.arc(960, 540, flood, 0, 7); ctx.clip();
  const g = ctx.createRadialGradient(960, 480, 100, 960, 540, 1300);
  g.addColorStop(0, '#2c2778'); g.addColorStop(1, C.deep); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.restore();
  if (t < 6.2) dot(960, 540, 14 + 10 * P(t, 6.0, 6.2));
  const punch = [8.0, 8.5, 9.0].reduce((a, b) => a + (t > b ? Math.exp(-(t - b) * 14) * 0.022 : 0), 0);
  if (t >= 6.1) lockup(t, 6.1, { c1: '#ffffff', c2: '#ffffff', scale: 1 + punch });
  txt('Know who’s about to leave.', 960, 690, { size: 46, w: 500, color: '#a9a6e0', align: 'center', a: eo(P(t, 7.3, 7.9)), ls: -0.5 });
}

// ── 2 · Prompt (10–14 s) ─────────────────────────────────────────────────────
const GHOST = (() => {
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d'); g.filter = 'blur(10px)';
  const r = rng(3);
  for (let i = 0; i < 9; i++) {
    const y = 90 + i * 112;
    g.fillStyle = '#fff'; g.beginPath(); g.roundRect(120, y, 1680, 88, 22); g.fill();
    g.fillStyle = '#dedbf3'; g.beginPath(); g.arc(180, y + 44, 24, 0, 7); g.fill();
    g.fillStyle = '#e6e4f6'; g.beginPath(); g.roundRect(230, y + 30, 150 + r() * 90, 14, 7); g.fill();
    g.fillStyle = '#c9c6ee'; g.beginPath(); g.roundRect(1000, y + 38, 240 + r() * 160, 12, 6); g.fill();
    g.fillStyle = i % 3 === 0 ? '#f5c9c4' : '#d4ecd9'; g.beginPath(); g.roundRect(1560, y + 28, 130, 32, 16); g.fill();
  }
  return c;
})();
const PROMPT = 'Win back clients who’ve gone quiet.';
const typeT = (i) => 11.0 + 2.0 * (i / (PROMPT.length - 1)) + 0.03 * Math.sin(i * 12.9898);
function drawPrompt(t) {
  const s = 1 + 0.1 * eo(P(t, 10, 13.6));
  ctx.save(); ctx.translate(960, 540); ctx.scale(s, s); ctx.translate(-960, -540);
  ctx.fillStyle = C.mist; ctx.fillRect(-100, -100, W + 200, H + 200);
  ctx.globalAlpha = 0.9; ctx.drawImage(GHOST, 0, 0); ctx.globalAlpha = 1;
  const bp = back(P(t, 10.15, 10.7), 1.2), press = P(t, 13.4, 13.5) * (1 - P(t, 13.52, 13.62));
  ctx.save(); ctx.globalAlpha = clamp(bp * 2); ctx.translate(960, 540 + (1 - bp) * 24);
  box(-580, -56, 1160, 112, 56, '#fff', { shadow: 60, sa: 0.18, sy: 24 });
  logo(-520, 0, 70, C.accent);
  if (t < typeT(0)) txt('Tell MsgHealth what matters…', -470, 13, { size: 36, w: 500, color: C.soft });
  let end = -470;
  ctx.font = '500 38px Inter'; ctx.letterSpacing = '-0.4px';
  for (let i = 0; i < PROMPT.length; i++) {
    const ti = typeT(i); if (t < ti) break;
    const pre = ctx.measureText(PROMPT.slice(0, i)).width;
    txt(PROMPT[i], -470 + pre, 13, { size: 38, w: 500, ls: -0.4, color: mixc(C.accent, C.ink, P(t, ti, ti + 0.45)) });
    end = -470 + ctx.measureText(PROMPT.slice(0, i + 1)).width;
  }
  if (t > 10.9 && t < 13.45 && Math.floor(t * 2) % 2 === 0) { ctx.fillStyle = C.accent; ctx.fillRect(end + 3, -24, 3, 48); }
  dot(510, 0, 40 - press * 5, C.accent);
  ctx.save(); ctx.translate(510, 0); ctx.strokeStyle = '#fff'; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(0, 14); ctx.lineTo(0, -14); ctx.moveTo(-12, -2); ctx.lineTo(0, -14); ctx.lineTo(12, -2); ctx.stroke(); ctx.restore();
  ctx.restore(); ctx.restore();
  if (t >= 13.6) { // indigo flood grows out of the send button
    const bx = 960 + (1470 - 960) * s;
    ctx.fillStyle = C.accent; ctx.beginPath(); ctx.arc(bx, 540, 2300 * expo(P(t, 13.6, 14.15)), 0, 7); ctx.fill();
  }
}

// ── 3 · Product: Client Health (14–18.5 s) ───────────────────────────────────
const CLIENTS = [
  { n: 'Jordan Reyes', v: '6 weeks ago', s: 38, up: 86, rep: 16.6 },
  { n: 'Priya Shah', v: '7 weeks ago', s: 31, up: 82, rep: 16.9 },
  { n: 'Morgan Ellis', v: '5 weeks ago', s: 44, up: 79, rep: 17.2 },
  { n: 'Alex Chen', v: '3 weeks ago', s: 58 },
  { n: 'Dana Okafor', v: '1 week ago', s: 91 },
  { n: 'Sam Patel', v: '2 days ago', s: 88 },
  { n: 'Lee Nguyen', v: '9 days ago', s: 76 },
];
const NAVICON = ['♥', '✉', '▦', '★', '◆', '$', '▤', '⚡'];
function drawApp(t) {
  ctx.fillStyle = '#e9e7f8'; ctx.fillRect(0, 0, W, H);
  box(90, 70, 1740, 940, 30, '#fff', { shadow: 80, sa: 0.2, sy: 30 });
  ctx.save(); ctx.beginPath(); ctx.roundRect(90, 70, 1740, 940, 30); ctx.clip();
  ctx.fillStyle = '#f8f7fe'; ctx.fillRect(90, 70, 300, 940);
  ctx.fillStyle = C.line; ctx.fillRect(390, 70, 2, 940);
  logo(150, 135, 78, C.accent); txt('MsgHealth', 190, 146, { size: 30, w: 700, ls: -0.8 });
  BRAND.nav.forEach((n, i) => {
    const y = 230 + i * 66, act = i === 0;
    if (act) box(116, y - 30, 250, 54, 14, C.tint);
    box(133, y - 12, 22, 22, 7, act ? C.accent : C.line);
    txt(n, 176, y + 9, { size: 25, w: act ? 700 : 500, color: act ? C.accent : C.mute });
  });
  dot(146, 944, 24, '#dedbf9'); txt('S', 146, 952, { size: 22, w: 700, color: C.accent, align: 'center' });
  txt('Sam’s Studio', 186, 950, { size: 22, w: 600 });

  // header + counters
  txt('Client health', 430, 168, { size: 46, w: 700, ls: -1.4 });
  const rep3 = (i) => eo(P(t, CLIENTS[i].rep, CLIENTS[i].rep + 0.6));
  const nReplied = rep3(0) + rep3(1) + rep3(2);
  const stats = [['Healthy', Math.round(41 + nReplied), C.ok], ['Needs attention', 12, C.warn], ['At risk', Math.round(5 - nReplied), C.risk]];
  let sx = 430;
  const sIn = eo(P(t, 14.75, 15.2));
  stats.forEach(([l, v, col]) => {
    const w = tw(l, 22, 600) + tw(String(v), 26, 700) + 84;
    ctx.save(); ctx.globalAlpha = sIn;
    box(sx, 192, w, 52, 26, '#fff', { stroke: C.line });
    dot(sx + 28, 218, 8, col); txt(l, sx + 46, 226, { size: 22, w: 600, color: C.mute });
    txt(String(v), sx + w - 20, 227, { size: 26, w: 700, align: 'right' });
    ctx.restore(); sx += w + 14;
  });
  ['Client', 'Last visit', 'Health score', 'Status', 'Outreach'].forEach((h, i) => txt(h.toUpperCase(), [430, 880, 1030, 1400, 1560][i], 292, { size: 15, w: 700, color: C.soft, ls: 1.5 }));

  CLIENTS.forEach((c, i) => {
    const y = 312 + i * 86, ti = 14.9 + i * 0.07, p = eo(P(t, ti, ti + 0.45));
    if (p <= 0) return;
    const risky = i < 3, rep = risky ? rep3(i) : 0;
    const g = eo(P(t, ti + 0.1, ti + 0.75));
    const sc = risky ? lerp(c.s, c.up, rep) * g : c.s * g;
    ctx.save(); ctx.globalAlpha = p; ctx.translate(0, (1 - p) * 22);
    box(420, y, 1360, 76, 18, risky && rep < 1 ? mixc('#ffffff', '#fdecea', clamp(P(t, 15.6, 16.0) * (1 - rep))) : '#fff', { stroke: C.line, lw: 1.5 });
    dot(468, y + 38, 24, TINTS[i % 4]); txt(c.n.split(' ').map((w) => w[0]).join(''), 468, y + 46, { size: 20, w: 700, color: C.accent, align: 'center' });
    txt(c.n, 510, y + 46, { size: 26, w: 650 });
    txt(c.v, 880, y + 46, { size: 23, w: 500, color: C.mute });
    box(1030, y + 33, 260, 10, 5, C.line); box(1030, y + 33, 260 * sc / 100, 10, 5, scoreColor(sc));
    txt(String(Math.round(sc)), 1310, y + 47, { size: 28, w: 700, color: scoreColor(sc) });
    // win-back rows flip straight from At risk to Healthy as the reply lands (no wide "Needs attention" chip under the pill)
    const lab = risky && rep > 0 ? (rep >= 0.35 ? 'Healthy' : 'At risk') : sc >= 70 ? 'Healthy' : sc >= 50 ? 'Needs attention' : 'At risk';
    const col = { Healthy: C.ok, 'Needs attention': C.warn, 'At risk': C.risk }[lab];
    box(1400, y + 19, tw(lab, 20, 700) + 40, 38, 19, mixc('#ffffff', col, 0.14));
    txt(lab, 1420, y + 45, { size: 20, w: 700, color: mixc(col, '#1e1b4b', 0.35) });
    if (risky) {
      const so = P(t, 16.0 + i * 0.2, 16.35 + i * 0.2);
      if (rep > 0.02) {
        box(1560, y + 19, 200, 38, 19, mixc('#ffffff', C.ok, 0.14)); check(1584, y + 38, 18, C.ok, 3.5);
        txt('Replied · booked', 1602, y + 45, { size: 19, w: 700, color: C.ok });
      } else if (so > 0) {
        ctx.save(); ctx.globalAlpha = so; box(1560, y + 19, 200, 38, 19, C.tint);
        txt('SMS + email sent', 1580, y + 45, { size: 19, w: 700, color: C.accent }); ctx.restore();
      }
    }
    ctx.restore();
  });
  // toast
  const tp = back(P(t, 17.4, 17.8), 1.3);
  if (tp > 0) {
    ctx.save(); ctx.globalAlpha = clamp(tp * 2); ctx.translate(0, (1 - tp) * 30);
    box(430, 926, 470, 62, 31, C.ink, { shadow: 30, sa: 0.3 });
    dot(470, 957, 16, C.ok); check(470, 958, 13, '#fff', 3);
    txt('3 clients rebooked this week', 500, 966, { size: 24, w: 600, color: '#fff' }); ctx.restore();
  }
  ctx.restore();
}
function drawProduct(t) {
  const s = 1 + 0.05 * P(t, 14.1, 18.5), out = P(t, 18.15, 18.5);
  ctx.save(); ctx.translate(960, 540); ctx.scale(s + out * 0.18, s + out * 0.18); ctx.translate(-960, -540); ctx.globalAlpha = 1 - out;
  drawApp(t); ctx.restore();
  // shutter: the indigo flood collapses to a line, which then retracts to nothing
  const hh = lerp(H, 6, io(P(t, 14.15, 14.6))), ww = lerp(W, 0, io(P(t, 14.6, 14.95)));
  if (ww > 1) { ctx.fillStyle = C.accent; ctx.beginPath(); ctx.roundRect(960 - ww / 2, 540 - hh / 2, ww, hh, Math.min(ww, hh) / 2); ctx.fill(); }
}

// ── 4 · Three features (18.5–24.5 s) ─────────────────────────────────────────
const FEATS = [
  { l: ['At-risk clients,', 'flagged early.'], t0: 18.5 },
  { l: ['Win-backs sent', 'for you.'], t0: 20.5 },
  { l: ['Bookings back', 'on the calendar.'], t0: 22.5 },
];
const NODE_X = [150, 960, 1770];
function featCard(k, tt) {
  const cx = 1020, cy = 230, cw = 700, ch = 640;
  box(cx, cy, cw, ch, 36, '#fff', { shadow: 70, sa: 0.16, sy: 28, stroke: C.line, lw: 1.5 });
  if (k === 0) {
    dot(cx + 64, cy + 64, 30, C.tint); txt('JR', cx + 64, cy + 73, { size: 22, w: 700, color: C.accent, align: 'center' });
    txt('Jordan Reyes', cx + 112, cy + 62, { size: 32, w: 700, ls: -0.6 }); txt('Regular since 2023', cx + 112, cy + 92, { size: 21, w: 500, color: C.mute });
    const s = lerp(78, 38, io(P(tt, 0.5, 1.35))), col = scoreColor(s), x = cx + cw / 2, y = cy + 290;
    ctx.save(); ctx.lineWidth = 26; ctx.lineCap = 'round';
    ctx.strokeStyle = C.line; ctx.beginPath(); ctx.arc(x, y, 130, 0, 7); ctx.stroke();
    ctx.strokeStyle = col; ctx.beginPath(); ctx.arc(x, y, 130, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * s / 100); ctx.stroke(); ctx.restore();
    txt(String(Math.round(s)), x, y + 34, { size: 96, w: 800, ls: -3, align: 'center', color: col });
    txt('Health score', x, y + 190, { size: 22, w: 600, color: C.mute, align: 'center' });
    const cp = back(P(tt, 1.25, 1.55), 1.8);
    if (cp > 0) { ctx.save(); ctx.translate(cx + cw - 64, cy + 62); ctx.scale(cp, cp); box(-84, -22, 84, 44, 22, mixc('#ffffff', C.risk, 0.14)); txt('At risk', -42, 8, { size: 21, w: 700, color: C.risk, align: 'center' }); ctx.restore(); }
    [['Visit overdue · 6 weeks', 1.3], ['No reply · 3 messages', 1.5]].forEach(([s2, ts], i) => {
      const p = eo(P(tt, ts, ts + 0.3)); ctx.save(); ctx.globalAlpha = p; ctx.translate((1 - p) * 20, 0);
      dot(cx + 70, cy + 520 + i * 56, 9, C.risk); txt(s2, cx + 96, cy + 530 + i * 56, { size: 26, w: 600 }); ctx.restore();
    });
  } else if (k === 1) {
    txt('Win-back automation', cx + 48, cy + 74, { size: 32, w: 700, ls: -0.6 });
    const on = P(tt, 1.5, 1.7); box(cx + cw - 128, cy + 42, 80, 44, 22, mixc(C.line, C.accent, on)); dot(cx + cw - 106 + 36 * eo(on), cy + 64, 17, '#fff');
    const nodes = [['When a client is at risk', 0], ['Send SMS', 1], ['Send email', 2], ['Invite to book', 3]];
    nodes.forEach(([lab, i]) => {
      const y = cy + 140 + i * 118, p = eo(P(tt, 0.3 + i * 0.22, 0.65 + i * 0.22));
      if (i > 0) { ctx.fillStyle = C.accent; ctx.fillRect(cx + 346, y - 22, 4, 22 * p); }
      ctx.save(); ctx.globalAlpha = p; ctx.translate(0, (1 - p) * 20);
      const trig = i === 0; box(cx + 60, y, 580, 84, 22, trig ? C.accent : '#fff', { stroke: trig ? null : C.line, lw: 2 });
      dot(cx + 114, y + 42, 22, trig ? 'rgba(255,255,255,.2)' : C.tint); txt(trig ? '⚡' : ['', '✉', '@', '▦'][i], cx + 114, y + 51, { size: 22, w: 700, color: trig ? '#fff' : C.accent, align: 'center' });
      txt(lab, cx + 156, y + 52, { size: 28, w: 650, color: trig ? '#fff' : C.ink }); ctx.restore();
    });
  } else {
    txt('This week', cx + 48, cy + 74, { size: 32, w: 700, ls: -0.6 });
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], gx = cx + 120, colw = 112;
    days.forEach((d, i) => txt(d, gx + i * colw + colw / 2 - 8, cy + 134, { size: 21, w: 600, color: i === 3 ? C.accent : C.mute, align: 'center' }));
    ['9:00', '10:00', '11:00', '12:00'].forEach((h, r) => { txt(h, cx + 48, cy + 214 + r * 108, { size: 17, w: 500, color: C.soft }); ctx.fillStyle = C.line; ctx.fillRect(gx - 8, cy + 190 + r * 108, colw * 5 + 8, 1.5); });
    [[0, 0], [1, 2], [2, 1], [4, 0], [4, 3], [0, 3], [2, 3]].forEach(([c, r], i) => { const p = eo(P(tt, 0.1 + i * 0.05, 0.4 + i * 0.05)); box(gx + c * colw, cy + 196 + r * 108 + (1 - p) * 10, colw - 14, 94, 14, '#f2f1fb', { }); });
    const sx = gx + 3 * colw, sy = cy + 196 + 108;
    box(sx, sy, colw - 14, 94, 14, null, { stroke: C.soft, lw: 2.5, dash: [8, 8] });
    const fp = back(P(tt, 0.9, 1.25), 1.5);
    if (fp > 0) { ctx.save(); ctx.translate(sx + 49, sy + 47); ctx.scale(fp, fp); box(-49, -47, 98, 94, 14, C.accent, { shadow: 30, sa: 0.35 });
      txt('Jordan', 0, -2, { size: 22, w: 700, color: '#fff', align: 'center' }); txt('10:00', 0, 26, { size: 18, w: 500, color: 'rgba(255,255,255,.75)', align: 'center' }); ctx.restore(); }
    const bp = back(P(tt, 1.4, 1.75), 1.3);
    if (bp > 0) { ctx.save(); ctx.globalAlpha = clamp(bp * 2); ctx.translate(0, (1 - bp) * 16);
      box(cx + 48, cy + 560, 604, 54, 27, mixc('#ffffff', C.ok, 0.13)); check(cx + 84, cy + 587, 18, C.ok, 3.5);
      txt('Booked · health score 86', cx + 112, cy + 596, { size: 25, w: 650, color: C.ok }); ctx.restore(); }
  }
}
function drawFeatures(t) {
  ctx.fillStyle = C.paper; ctx.fillRect(0, 0, W, H);
  FEATS.forEach((f, k) => {
    const tt = t - f.t0; if (tt < 0 || tt >= 2.0) return;
    const ex = k === 2 ? 0 : P(tt, 1.7, 2.0);
    ctx.save(); ctx.globalAlpha = 1 - ex; ctx.translate(-50 * ex, 0);
    txt(`0${k + 1}`, 150, 252, { size: 26, w: 700, color: C.accent, ls: 2, a: eo(P(tt, 0, 0.3)) });
    f.l.forEach((s, i) => rise(s, 150, 470 + i * 118, P(tt, 0.05 + i * 0.15, 0.6 + i * 0.15), { size: 100, w: 700, ls: -4.5 }));
    const cp = eo(P(tt, 0.1, 0.65));
    ctx.save(); ctx.globalAlpha *= cp; ctx.translate(0, (1 - cp) * 40); featCard(k, tt); ctx.restore();
    ctx.restore();
  });
  // the progress line — the dot is handed from feature to feature
  const aIn = P(t, 18.5, 18.8), aOut = 1 - P(t, 24.5, 24.5 + 1e-6);
  ctx.save(); ctx.globalAlpha = aIn * aOut;
  ctx.fillStyle = C.line; ctx.fillRect(150, 978, 1620, 4);
  const k = t < 20.5 ? 0 : t < 22.5 ? 1 : 2;
  const px = k === 0 ? 150 : lerp(NODE_X[k - 1], NODE_X[k], io(P(t, FEATS[k].t0, FEATS[k].t0 + 0.6)));
  ctx.fillStyle = C.accent; ctx.fillRect(150, 978, px - 150, 4);
  NODE_X.forEach((x, i) => dot(x, 980, 9, px >= x - 1 ? C.accent : C.line));
  dot(px, 980, 15); ctx.restore();
}

// ── 5 · Finale (24.5–33 s): "Keep your customers." ───────────────────────────
function drawEnd(t) {
  ctx.fillStyle = C.paper; ctx.fillRect(0, 0, W, H);
  const ex = P(t, 28.2, 28.7);
  // dot: from the last node to the line, then hops into the period
  const w2 = tw('customers', 200, 800, -9), total = w2 + 46, px0 = 960 - total / 2;
  const perX = px0 + w2 + 30, perY = 690 - 15;
  let d = null;
  if (t < 25.0) { const k = io(P(t, 24.5, 25.0)); d = [lerp(1770, 960, k), lerp(980, 900, k) - Math.sin(k * Math.PI) * 60]; }
  else if (t < 26.9) d = [960, pulseDotY(900, 960 * expo(P(t, 24.8, 25.6)) + 20, 100, t)];
  else if (t < 27.4) { const k = io(P(t, 26.9, 27.4)); d = [lerp(960, perX, k), lerp(pulseDotY(900, 960, 100, 26.9), perY, k) - Math.sin(k * Math.PI) * 260]; }
  else d = [perX, perY];
  if (t < 28.2) { // headline + heartbeat
    pulseLine(900, 960 * expo(P(t, 24.8, 25.6)) + 20, 100, t, 5, 520);
    rise('Keep your', 960, 480, P(t, 25.3, 25.85), { size: 200, w: 800, ls: -9, align: 'center' });
    if (t >= 26.3) {
      const sl = P(t, 26.3, 26.62), z = lerp(1.16, 1, eo(sl));
      ctx.save(); ctx.translate(960, 690); ctx.scale(z, z); ctx.translate(-960, -690);
      txt('customers', px0, 690, { size: 200, w: 800, ls: -9, a: clamp(sl * 4) }); ctx.restore();
    }
    if (t > 27.4) { const q = P(t, 27.4, 28.1); ring(perX, perY, 17 + q * 90, 3, C.accent, (1 - q) * 0.6); }
  }
  // text exits as the dot becomes the mark
  if (t >= 28.2 && t < 28.7) {
    ctx.save(); ctx.globalAlpha = 1 - ex; ctx.translate(0, -50 * ex);
    rise('Keep your', 960, 480, 1, { size: 200, w: 800, ls: -9, align: 'center' });
    txt('customers', px0, 690, { size: 200, w: 800, ls: -9 }); ctx.restore();
  }
  // the period glides to where the mark will sit, swells, and blooms into the logo
  const LK = { cy: 500, mark: 280, word: 170, ls: -6, c1: C.accent, c2: C.ink };
  const mx = 960 - (280 * 0.73 + 36 + tw('MsgHealth', 170, 700, -6)) / 2 + 280 * 0.73 / 2;
  const mk = P(t, 28.85, 29.3);
  if (t < 28.2) dot(d[0], d[1], t < 27.4 ? 15 : 17);
  else if (mk < 1) {
    const k = io(P(t, 28.2, 28.9));
    dot(lerp(perX, mx, k), lerp(perY, 500, k) - Math.sin(k * Math.PI) * 70, lerp(17, 46, k) * (1 - eo(mk)), C.accent, 1 - P(mk, 0.4, 1));
  }
  if (t >= 28.85) {
    const fold = io(P(t, 31.6, 32.3));
    lockup(t, 29.0, { ...LK, fold, markK: lerp(0.22, 1, back(mk, 1.3)), markA: clamp(mk * 2.5) });
    const up = eo(P(t, 30.4, 30.9)) * (1 - P(t, 31.5, 31.9));
    if (up > 0) {
      const u = 'msghealth.net', uw = tw(u, 50, 650, -1);
      ctx.save(); ctx.globalAlpha = up; ctx.translate(0, (1 - up) * 14);
      txt(u, 960, 700, { size: 50, w: 650, color: C.accent, align: 'center', ls: -1 });
      ctx.fillStyle = C.accent; ctx.fillRect(960 - uw / 2, 716, uw * eo(P(t, 30.6, 31.2)), 3); ctx.restore();
    }
    // bookend: the dot returns to the centre and beats once, twice
    if (t >= 32.1) {
      dot(960, 500, 14 * P(t, 32.1, 32.3));
      [32.45, 32.65].forEach((b) => { const q = P(t, b, b + 0.5); if (q > 0 && q < 1) ring(960, 500, 14 + q * 100, 3, C.accent, (1 - q) * 0.55); });
    }
  }
}

// ── frame ────────────────────────────────────────────────────────────────────
let MAIN, SCRATCH, SUB = 1;
const SHUTTER = 0.5 / 60; // 180° at 60 fps
function renderFrame(t) {
  if (SUB <= 1) { ctx = MAIN; drawScene(t); return; }
  for (let k = 0; k < SUB; k++) {
    ctx = SCRATCH; drawScene(clamp(t + ((k + 0.5) / SUB - 0.5) * SHUTTER, 0, DURATION - 1e-4));
    MAIN.setTransform(1, 0, 0, 1, 0, 0); MAIN.globalAlpha = 1 / (k + 1); MAIN.drawImage(SCRATCH.canvas, 0, 0);
  }
  MAIN.globalAlpha = 1; ctx = MAIN;
}
function drawScene(t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.filter = 'none';
  ctx.fillStyle = C.paper; ctx.fillRect(0, 0, W, H);
  if (t < 6.0) { drawHook(t); }
  else if (t < 9.4) { drawMark(t); }
  else if (t < 10.0) {
    drawMark(t);
    ctx.save(); ctx.beginPath(); ctx.arc(960, 540, 1600 * io(P(t, 9.4, 10.0)), 0, 7); ctx.clip(); drawPrompt(t); ctx.restore();
  }
  else if (t < 14.1) drawPrompt(t);
  else if (t < 18.5) drawProduct(t);
  else if (t < 24.5) drawFeatures(t);
  else drawEnd(t);
  // fade to paper from the last frame's dot is handled in drawEnd; subtle vignette for depth on light scenes
}

window.renderFrame = renderFrame;
window.DURATION = DURATION;
window.ready = (async () => {
  MAIN = ctx = document.getElementById('c').getContext('2d');
  const sc = document.createElement('canvas'); sc.width = W; sc.height = H; SCRATCH = sc.getContext('2d');
  await Promise.all(['400', '500', '600', '650', '700', '800'].map((w) => document.fonts.load(`${w} 40px Inter`)));
  LOGO = await new Promise((res) => { const im = new Image(); im.onload = () => res(im); im.onerror = () => res(null); im.src = BRAND.logoFile; });
  if (location.search.includes('render')) { document.body.classList.add('render'); SUB = 4; }
  renderFrame(0);
  // in-browser player
  const play = document.getElementById('play'), seek = document.getElementById('seek'), label = document.getElementById('time');
  let playing = false, t0 = 0, cur = 0;
  const show = (t) => { cur = t; renderFrame(t); seek.value = (t / DURATION) * 1000; label.textContent = t.toFixed(1) + 's'; };
  play.onclick = () => { playing = !playing; play.textContent = playing ? 'Pause' : 'Play'; if (playing) { t0 = performance.now() - cur * 1000; requestAnimationFrame(loop); } };
  const loop = () => { if (!playing) return; const t = (performance.now() - t0) / 1000; if (t >= DURATION) { playing = false; play.textContent = 'Play'; show(DURATION - 0.01); return; } show(t); requestAnimationFrame(loop); };
  seek.oninput = () => show((seek.value / 1000) * DURATION);
  return true;
})();
