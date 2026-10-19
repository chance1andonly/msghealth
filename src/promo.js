// MsgHealth · 50s product film (1920 × 1080, 60 fps), cut to "keep steady" (120 BPM).
// Keynote look: a black stage, large gradient type that fades up out of a soft blur, an iPhone and a
// MacBook presenting the product, and cinematic transitions on the downbeats. Nothing pulses.
'use strict';

const W = 1920, H = 1080, FPS = 60;
const DURATION = 50.4;
const C = BRAND.colors;
const FONT = 'Inter';
const IND = '#5b50e8';        // dashboard chart indigo
const MUTED = '#6b6b85', FAINT = '#9a9ab0', LINE = '#ececf3';
const SOFT = 'rgba(235,235,245,0.62)'; // secondary text on the black stage

// Beat grid of assets/audio/promo-track.m4a: 120 BPM (0.4985s a beat), first downbeat 0.348s,
// 4-beat bars, 4-bar phrases. Every entrance is snapped onto a real hit (src/promo-onsets.js).
const BEAT = 0.4985, B0 = 0.348;
function hit(t) { // nearest hit within 60 ms, else t unchanged
  let best = t, d = 0.06;
  for (const o of window.ONSETS || []) { const e = Math.abs(o - t); if (e < d) { d = e; best = o; } }
  return best;
}
const b = (k) => hit(B0 + k * BEAT); // beat k; k may be fractional
// The next n hits from `from`: for things that land one after another, each on its own hit.
function hits(from, n) {
  const O = (window.ONSETS || []).filter((o) => o >= from - 0.02);
  return Array.from({ length: n }, (_, i) => O[i] ?? from + i * 0.12);
}

let ctx = null, MAIN = null, LOGO = null;

// ── maths ────────────────────────────────────────────────────────────────────
const clamp = (v, a = 0, c = 1) => Math.max(a, Math.min(c, v));
const lerp = (a, c, t) => a + (c - a) * t;
const seg = (t, a, c) => clamp((t - a) / (c - a));
const ease = {
  out: (t) => 1 - Math.pow(1 - t, 3),
  quint: (t) => 1 - Math.pow(1 - t, 5),
  expo: (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  inOut: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
};
function rgba(hex, a) { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; }
const money = (v) => '$' + Math.round(v).toLocaleString('en-US');

// UI elements land with a short, soft settle; headlines use the slower riseIn below.
const SNAP = 0.3;
const snapP = (t, at) => ease.quint(seg(t, at, at + SNAP));

// ── drawing primitives ───────────────────────────────────────────────────────
function rr(x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }
function fillRR(x, y, w, h, r, col) { rr(x, y, w, h, r); ctx.fillStyle = col; ctx.fill(); }
function card(x, y, w, h, r, o = {}) {
  ctx.save();
  ctx.shadowColor = o.shadowColor ?? 'rgba(30,27,75,0.10)';
  ctx.shadowBlur = o.shadow ?? 40; ctx.shadowOffsetY = (o.shadow ?? 40) * 0.35;
  fillRR(x, y, w, h, r, o.fill ?? '#ffffff');
  ctx.restore();
  if (o.stroke) { rr(x, y, w, h, r); ctx.strokeStyle = o.stroke; ctx.lineWidth = o.lw ?? 1.5; ctx.stroke(); }
}
function font(size, weight = 600, track = -0.03) { ctx.font = `${weight} ${size}px ${FONT}`; ctx.letterSpacing = `${(size * track).toFixed(2)}px`; }
function text(s, x, y, size, weight, color, align = 'left', track) {
  font(size, weight, track ?? (size >= 40 ? -0.03 : -0.005));
  ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.fillStyle = color; ctx.fillText(s, x, y);
}
function tw(s, size, weight = 600, track) { font(size, weight, track ?? (size >= 40 ? -0.03 : -0.005)); return ctx.measureText(s).width; }
function avatar(x, y, r, initials, color) {
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = rgba(color, 0.16); ctx.fill();
  text(initials, x, y + 1, r * 0.8, 700, color, 'center');
}
function pill(x, y, label, color, size = 22, align = 'left') {
  const w = tw(label, size, 600) + size * 1.3, h = size * 1.7;
  const x0 = align === 'center' ? x - w / 2 : align === 'right' ? x - w : x;
  fillRR(x0, y - h / 2, w, h, h / 2, rgba(color, 0.14));
  text(label, x0 + w / 2, y + 1, size, 600, color, 'center');
  return w;
}
function check(x, y, s, col = '#fff', lw = 4) {
  ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(x - s * 0.45, y); ctx.lineTo(x - s * 0.12, y + s * 0.34); ctx.lineTo(x + s * 0.5, y - s * 0.36); ctx.stroke();
}
function logoMark(x, y, s) { if (LOGO) ctx.drawImage(LOGO, x - s / 2, y - s / 2, s, s); }

// Draw `fn` snapping in at time `at`, scaled around (cx, cy).
function snapIn(t, at, cx, cy, fn, o = {}) {
  at = hit(at);
  if (t < at) return;
  const p = snapP(t, at);
  ctx.save();
  ctx.globalAlpha *= p;
  const bl = (1 - p) * (o.blur ?? 12);
  if (bl > 0.3) ctx.filter = `blur(${bl.toFixed(1)}px)`;
  ctx.translate(cx, cy + (1 - p) * (o.dy ?? 22)); const s = lerp(o.from ?? 0.94, 1, p); ctx.scale(s, s); ctx.translate(-cx, -cy);
  fn();
  ctx.restore();
}

// A line of text whose chunks appear at their own times. chunks: [text, time, colour?]
// The whole line is laid out up front so nothing shifts when a chunk lands.
function line(t, chunks, x, y, size, o = {}) {
  const weight = o.weight ?? 700, gap = tw(' ', size, weight);
  const ws = chunks.map(([s]) => tw(s, size, weight));
  const total = ws.reduce((p, w) => p + w, 0) + gap * (chunks.length - 1);
  let cx = o.align === 'left' ? x : x - total / 2;
  chunks.forEach(([s, at, col], i) => {
    const w = ws[i], x0 = cx;
    snapIn(t, at, x0 + w / 2, y, () => text(s, x0, y, size, weight, col ?? C.ink), { dy: size * 0.3, from: 0.96 });
    cx += w + gap;
  });
  return total;
}

// ── the stage: black, with an optional soft glow behind the subject ──────────
function stage(glow = 0, col = C.primary, gy = 0.55) {
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  if (glow <= 0) return;
  const g = ctx.createRadialGradient(W / 2, H * gy, 0, W / 2, H * gy, 950);
  g.addColorStop(0, rgba(col, glow)); g.addColorStop(1, rgba(col, 0));
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}
function glass(x, y, w, h, r, o = {}) {
  fillRR(x, y, w, h, r, o.fill ?? 'rgba(255,255,255,0.065)');
  rr(x, y, w, h, r); ctx.strokeStyle = o.stroke ?? 'rgba(255,255,255,0.13)'; ctx.lineWidth = o.lw ?? 1.5; ctx.stroke();
}
const silver = (y, size) => { const g = ctx.createLinearGradient(0, y - size * 0.55, 0, y + size * 0.55); g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#b4b4c2'); return g; };
const brandGrad = (x0, x1) => { const g = ctx.createLinearGradient(x0, 0, x1, 0); g.addColorStop(0, '#c4b5fd'); g.addColorStop(0.5, '#818cf8'); g.addColorStop(1, '#38bdf8'); return g; };

// Headline entrance: fades up out of a soft blur, starting on a hit.
function riseIn(t, at, fn, o = {}) {
  at = hit(at);
  if (t < at) return;
  const p = ease.quint(seg(t, at, at + (o.d ?? 0.65)));
  ctx.save();
  ctx.globalAlpha *= p;
  const bl = (1 - p) * (o.blur ?? 16);
  if (bl > 0.3) ctx.filter = `blur(${bl.toFixed(1)}px)`;
  ctx.translate(0, (1 - p) * (o.dy ?? 40));
  fn();
  ctx.restore();
}
// A line of large type; chunks: [text, time, accent?]. Accent chunks take the brand gradient.
function headline(t, chunks, x, y, size, o = {}) {
  const weight = o.weight ?? 700, tr = -0.035;
  const gap = tw(' ', size, weight, tr), ws = chunks.map(([s]) => tw(s, size, weight, tr));
  const total = ws.reduce((p, w) => p + w, 0) + gap * (chunks.length - 1);
  let cx = o.align === 'left' ? x : x - total / 2;
  chunks.forEach(([s, at, acc], i) => {
    const x0 = cx, w = ws[i];
    riseIn(t, at, () => {
      font(size, weight, tr); ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      ctx.fillStyle = acc ? brandGrad(x0, x0 + w) : (o.color ?? silver(y, size));
      ctx.fillText(s, x0, y);
    }, { dy: size * 0.32 });
    cx += w + gap;
  });
  return total;
}
// Our own drawing in the style of the 👀 emoji: glossy eyes glancing to the side.
function eyesEmoji(x, y, s) {
  [-1, 1].forEach((side) => {
    const ex = x + side * s * 0.19;
    const g = ctx.createRadialGradient(ex - s * 0.05, y - s * 0.1, s * 0.02, ex, y, s * 0.3);
    g.addColorStop(0, '#ffffff'); g.addColorStop(0.65, '#f2f2f5'); g.addColorStop(1, '#c4c4cc');
    ctx.beginPath(); ctx.ellipse(ex, y, s * 0.165, s * 0.25, 0, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.22)'; ctx.lineWidth = s * 0.014; ctx.stroke();
    ctx.beginPath(); ctx.ellipse(ex - s * 0.07, y + s * 0.03, s * 0.085, s * 0.13, 0, 0, Math.PI * 2); ctx.fillStyle = '#17171b'; ctx.fill();
    ctx.beginPath(); ctx.arc(ex - s * 0.095, y - s * 0.035, s * 0.026, 0, Math.PI * 2); ctx.fillStyle = 'rgba(255,255,255,0.92)'; ctx.fill();
  });
}

// ── iPhone + Messages ────────────────────────────────────────────────────────
function iphone(x, y, w, h, screen) {
  const r = w * 0.17;
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.7)'; ctx.shadowBlur = 70; ctx.shadowOffsetY = 34;
  const g = ctx.createLinearGradient(x, 0, x + w, 0); // titanium band
  g.addColorStop(0, '#55555b'); g.addColorStop(0.06, '#d0d0d6'); g.addColorStop(0.5, '#8a8a92'); g.addColorStop(0.94, '#d6d6dc'); g.addColorStop(1, '#505056');
  fillRR(x, y, w, h, r, g);
  ctx.restore();
  [[y + h * 0.19, 54], [y + h * 0.27, 92], [y + h * 0.37, 92]].forEach(([by, bh]) => fillRR(x - 4, by, 6, bh, 3, '#8a8a92'));
  fillRR(x + w - 2, y + h * 0.28, 6, 140, 3, '#8a8a92');
  fillRR(x + 6, y + 6, w - 12, h - 12, r - 6, '#050506');
  const sx = x + 17, sy = y + 17, sw = w - 34, sh = h - 34;
  ctx.save(); rr(sx, sy, sw, sh, r - 17); ctx.clip(); screen(sx, sy, sw, sh); ctx.restore();
  fillRR(x + w / 2 - 64, sy + 18, 128, 38, 19, '#000'); // Dynamic Island
}
function wrapText(s, size, weight, maxW) {
  const words = s.split(' '), out = [];
  let cur = '';
  words.forEach((wd) => { const nx = cur ? cur + ' ' + wd : wd; if (tw(nx, size, weight, 0) > maxW && cur) { out.push(cur); cur = wd; } else cur = nx; });
  if (cur) out.push(cur);
  return out;
}
function sentBubble(x1, y, lines, size, tail, extra = 0) { // right-aligned blue iMessage bubble; x1 = right edge
  const lh = size * 1.28, padX = 22, padY = 13;
  const w = Math.max(...lines.map((l) => tw(l, size, 400, 0))) + extra + padX * 2, h = lines.length * lh + padY * 2;
  const x = x1 - w;
  const g = ctx.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, '#2b93ff'); g.addColorStop(1, '#0a7cff');
  fillRR(x, y, w, h, Math.min(26, h / 2), g);
  if (tail) {
    ctx.beginPath();
    ctx.moveTo(x1 - 6, y + h - 30);
    ctx.bezierCurveTo(x1 - 6, y + h - 8, x1 + 2, y + h + 1, x1 + 12, y + h + 3);
    ctx.bezierCurveTo(x1 - 6, y + h + 6, x1 - 20, y + h, x1 - 30, y + h - 8);
    ctx.closePath(); ctx.fill();
  }
  lines.forEach((l, i) => text(l, x + padX, y + padY + lh * (i + 0.5) + 1, size, 400, '#ffffff', 'left', 0));
  return { x, w, h };
}
function recvBubble(x, y, lines, size, tail, dark) { // left-aligned grey bubble
  const lh = size * 1.28, padX = 22, padY = 13;
  const w = Math.max(...lines.map((l) => tw(l, size, 400, 0))) + padX * 2, h = lines.length * lh + padY * 2;
  const col = dark ? '#26262b' : '#e9e9eb';
  fillRR(x, y, w, h, Math.min(26, h / 2), col);
  if (tail) {
    ctx.beginPath();
    ctx.moveTo(x + 6, y + h - 30);
    ctx.bezierCurveTo(x + 6, y + h - 8, x - 2, y + h + 1, x - 12, y + h + 3);
    ctx.bezierCurveTo(x + 6, y + h + 6, x + 20, y + h, x + 30, y + h - 8);
    ctx.closePath(); ctx.fillStyle = col; ctx.fill();
  }
  lines.forEach((l, i) => text(l, x + padX, y + padY + lh * (i + 0.5) + 1, size, 400, dark ? '#f2f2f7' : '#000', 'left', 0));
  return { w, h };
}

// ── MacBook ──────────────────────────────────────────────────────────────────
// The product UIs are drawn at 1920 × 1080 "content" size and shown on the laptop screen at LAP.s.
const LAP = { x: 300, y: 150, w: 1320, h: 742.5, s: 0.6875 };
let LIDC = null; // offscreen lid, used only while the lid is opening
function laptopShadow() {
  const by = LAP.y + LAP.h + 26;
  const g = ctx.createRadialGradient(W / 2, by + 30, 0, W / 2, by + 30, 900);
  g.addColorStop(0, 'rgba(120,110,255,0.10)'); g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g; ctx.fillRect(0, by - 200, W, 500);
  ctx.save(); ctx.scale(1, 0.08); const s = ctx.createRadialGradient(W / 2, (by + 26) / 0.08, 0, W / 2, (by + 26) / 0.08, 760);
  s.addColorStop(0, 'rgba(0,0,0,0.9)'); s.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = s; ctx.fillRect(0, (by - 40) / 0.08, W, 160 / 0.08); ctx.restore();
}
function laptopBase() {
  const { x, w } = LAP, by = LAP.y + LAP.h + 26;
  const g = ctx.createLinearGradient(0, by, 0, by + 24);
  g.addColorStop(0, '#ececf0'); g.addColorStop(0.35, '#c2c2c9'); g.addColorStop(1, '#6a6a72');
  fillRR(x - 130, by, w + 260, 24, [3, 3, 16, 16], g);
  fillRR(x + w / 2 - 120, by, 240, 10, [0, 0, 10, 10], '#a3a3ab');
}
function lid(content, zEff) { // bezel + screen, drawn in output space
  const { x, y, w, h, s } = LAP;
  fillRR(x - 18, y - 18, w + 36, h + 44, 30, '#111113');
  rr(x - 18, y - 18, w + 36, h + 44, 30); ctx.strokeStyle = '#3b3b41'; ctx.lineWidth = 2.5; ctx.stroke();
  fillRR(x + w / 2 - 72, y - 18, 144, 24, [0, 0, 12, 12], '#111113');
  ctx.save(); rr(x, y, w, h, 8); ctx.clip();
  ctx.translate(x, y); ctx.scale(s, s); content(zEff); ctx.restore();
  const sheen = ctx.createLinearGradient(x, y, x + w * 0.6, y + h); // faint glass reflection
  sheen.addColorStop(0, 'rgba(255,255,255,0.05)'); sheen.addColorStop(0.5, 'rgba(255,255,255,0)'); ctx.fillStyle = sheen; ctx.fillRect(x, y, w, h);
}
// cam: [cx, cy, z] focus point in content coordinates and zoom (1 = whole laptop in view).
function laptop(t, cam, content, o = {}) {
  const [cx, cy, z] = cam;
  const fx = LAP.x + cx * LAP.s, fy = LAP.y + cy * LAP.s;
  ctx.save();
  ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-fx, -fy + (o.lift ?? 0));
  laptopShadow(); laptopBase();
  const open = o.open ?? 1;
  if (open >= 0.999) lid(content, z * LAP.s);
  else lidOpening(open, content);
  ctx.restore();
}
// The lid swings up: drawn as horizontal strips that grow taller and wider as it opens.
function lidOpening(p, content) {
  const { x, y, w, h } = LAP, ow = w + 36, oh = h + 44;
  if (!LIDC) { LIDC = document.createElement('canvas'); LIDC.width = ow; LIDC.height = oh; }
  const prev = ctx; ctx = LIDC.getContext('2d');
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, ow, oh); ctx.translate(18 - x, 18 - y);
  lid(content, LAP.s);
  ctx.fillStyle = `rgba(0,0,0,${0.85 * (1 - p)})`; ctx.fillRect(x, y, w, h); // screen wakes as it opens
  ctx = prev;
  const hinge = y + h + 26, step = 3;
  for (let sy = 0; sy < oh; sy += step) {
    const v = sy / oh, wf = lerp(1 - 0.16 * (1 - p), 1, v);
    const dy = hinge - (oh - sy) * p, dw = ow * wf;
    ctx.drawImage(LIDC, 0, sy, ow, step, W / 2 - dw / 2, dy, dw, step * p + 0.8);
  }
}

// ── transitions (drawn at a scene's first beat) ──────────────────────────────
let BUF = [];
function buffer(i) {
  if (!BUF[i]) { const c = document.createElement('canvas'); c.width = W; c.height = H; BUF[i] = c.getContext('2d'); }
  return BUF[i];
}
function renderInto(i, fn, t) {
  const prev = ctx; ctx = buffer(i);
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.filter = 'none'; ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  fn(t);
  ctx = prev;
  return buffer(i).canvas;
}
function put(img, { a = 1, blur = 0, s = 1, dx = 0, dy = 0 } = {}) {
  if (a <= 0.002) return;
  ctx.save(); ctx.globalAlpha = a;
  if (blur > 0.3) ctx.filter = `blur(${blur.toFixed(1)}px)`;
  ctx.translate(W / 2 + dx, H / 2 + dy); ctx.scale(s, s); ctx.drawImage(img, -W / 2, -H / 2);
  ctx.restore();
}
function transition(type, p, A, B) {
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  const q = ease.inOut(p);
  if (type === 'blur') { put(A, { a: 1 - q, blur: 26 * q, s: 1 + 0.05 * q }); put(B, { a: q, blur: 26 * (1 - q), s: 1.05 - 0.05 * q }); }
  if (type === 'zoom') { put(A, { a: 1 - q, blur: 20 * q, s: 1 + 0.9 * q }); put(B, { a: q, blur: 14 * (1 - q), s: 0.86 + 0.14 * q }); }
  if (type === 'fade') { put(A, { a: 1 - clamp(q * 2) }); put(B, { a: clamp(q * 2 - 1) }); }
  if (type === 'rise') { put(A, { a: 1 - q, blur: 18 * q, dy: -H * 0.18 * q }); put(B, { a: q, blur: 18 * (1 - q), dy: H * 0.18 * (1 - q) }); }
  if (type === 'push') { put(A, { a: 1 - q, blur: 16 * q, dx: -W * 0.25 * q }); put(B, { a: q, blur: 16 * (1 - q), dx: W * 0.25 * (1 - q) }); }
  if (type === 'wipe') { // soft-edged reveal sweeping left to right
    put(A);
    const c = buffer(2); c.setTransform(1, 0, 0, 1, 0, 0); c.globalCompositeOperation = 'source-over'; c.globalAlpha = 1; c.filter = 'none';
    c.clearRect(0, 0, W, H); c.drawImage(B, 0, 0);
    const edge = lerp(-400, W + 400, q), g = c.createLinearGradient(edge - 400, 0, edge, 0);
    g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    c.globalCompositeOperation = 'destination-in'; c.fillStyle = g; c.fillRect(0, 0, W, H); c.globalCompositeOperation = 'source-over';
    ctx.drawImage(c.canvas, 0, 0);
  }
}

// ── shared product UI (rebuilt from the screen recordings) ───────────────────
function glyph(kind, x, y, col) { // small line icons
  ctx.save(); ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 3.5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  if (kind === 'alert') { ctx.beginPath(); ctx.moveTo(x, y - 14); ctx.lineTo(x + 15, y + 12); ctx.lineTo(x - 15, y + 12); ctx.closePath(); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x, y - 4); ctx.lineTo(x, y + 3); ctx.stroke(); ctx.beginPath(); ctx.arc(x, y + 8, 1.6, 0, 7); ctx.fill(); }
  if (kind === 'chat') { rr(x - 15, y - 12, 30, 20, 6); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x - 6, y + 8); ctx.lineTo(x - 10, y + 15); ctx.lineTo(x + 2, y + 8); ctx.stroke(); }
  if (kind === 'mail') { rr(x - 16, y - 11, 32, 22, 4); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x - 15, y - 9); ctx.lineTo(x, y + 2); ctx.lineTo(x + 15, y - 9); ctx.stroke(); }
  if (kind === 'cal') { rr(x - 15, y - 12, 30, 27, 5); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x - 15, y - 3); ctx.lineTo(x + 15, y - 3); ctx.moveTo(x - 7, y - 16); ctx.lineTo(x - 7, y - 9); ctx.moveTo(x + 7, y - 16); ctx.lineTo(x + 7, y - 9); ctx.stroke(); }
  if (kind === 'star') { ctx.beginPath(); for (let i = 0; i < 10; i++) { const r = i % 2 ? 7 : 16, a = -Math.PI / 2 + (i * Math.PI) / 5; ctx.lineTo(x + r * Math.cos(a), y + r * Math.sin(a)); } ctx.closePath(); ctx.stroke(); }
  if (kind === 'gift') { rr(x - 15, y - 6, 30, 21, 3); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x - 17, y - 6); ctx.lineTo(x + 17, y - 6); ctx.moveTo(x, y - 6); ctx.lineTo(x, y + 15); ctx.stroke(); ctx.beginPath(); ctx.arc(x - 6, y - 11, 5, 0, 7); ctx.arc(x + 6, y - 11, 5, 0, 7); ctx.stroke(); }
  if (kind === 'card') { rr(x - 17, y - 12, 34, 24, 4); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x - 17, y - 4); ctx.lineTo(x + 17, y - 4); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x - 10, y + 5); ctx.lineTo(x - 2, y + 5); ctx.stroke(); }
  if (kind === 'bolt') { ctx.beginPath(); ctx.moveTo(x + 3, y - 16); ctx.lineTo(x - 10, y + 2); ctx.lineTo(x, y + 2); ctx.lineTo(x - 3, y + 16); ctx.lineTo(x + 10, y - 2); ctx.lineTo(x, y - 2); ctx.closePath(); ctx.stroke(); }
  ctx.restore();
}

function pointer(t, path, clicks, z) {
  path = path.map(([at, px, py]) => [hit(at), px, py]); clicks = clicks.map(hit);
  let [x, y] = [path[0][1], path[0][2]];
  for (let i = 1; i < path.length; i++) {
    const [at, nx, ny] = path[i], p = ease.inOut(seg(t, at - 0.38, at));
    if (p <= 0) break;
    x = lerp(x, nx, p); y = lerp(y, ny, p);
  }
  const s = 2.1 / z;
  const c = clicks.find((ct) => t >= ct && t < ct + 0.32);
  ctx.save();
  if (c != null) { // one ring per click, expanding once
    const k = (t - c) / 0.32;
    ctx.beginPath(); ctx.arc(x, y, (8 + 26 * ease.out(k)) * s, 0, Math.PI * 2);
    ctx.strokeStyle = rgba(C.primary, 0.55 * (1 - k)); ctx.lineWidth = 3 * s; ctx.stroke();
  }
  const press = c != null && t < c + 0.12 ? 0.84 : 1;
  ctx.translate(x, y); ctx.scale(s * press, s * press);
  ctx.shadowColor = 'rgba(0,0,0,0.3)'; ctx.shadowBlur = 6; ctx.shadowOffsetY = 2;
  ctx.beginPath();
  [[0, 0], [0, 25], [6.5, 19.5], [11, 29], [15, 27.2], [10.6, 18], [18.5, 18]].forEach(([px, py], i) => (i ? ctx.lineTo(px, py) : ctx.moveTo(px, py)));
  ctx.closePath();
  ctx.fillStyle = '#111118'; ctx.fill();
  ctx.shadowColor = 'transparent'; ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.6; ctx.lineJoin = 'round'; ctx.stroke();
  ctx.restore();
}
// Feature name, top left in screen space: a quiet glass label, so each demo is named.
function featureTag(t, at, label, sub, zoom = 1) {
  const a = 1 - clamp((zoom - 1) / 0.25); // steps aside while the camera is pushed in
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a;
  riseIn(t, at, () => {
    text(label, 72, 74, 30, 700, '#ffffff', 'left', -0.02);
    if (sub) text(sub, 72, 110, 20, 500, 'rgba(235,235,245,0.6)', 'left', 0);
  }, { dy: 14, blur: 8 });
  ctx.restore();
}
function withCam(t, keys, fn) {
  const [cx, cy, z] = camAt(t, keys);
  ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-cx, -cy);
  fn(z);
  ctx.restore();
}
function stars(x, y, n, size = 12) {
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    for (let k = 0; k < 10; k++) { const rr0 = k % 2 ? size * 0.42 : size, a = -Math.PI / 2 + (k * Math.PI) / 5; ctx.lineTo(x + i * size * 2.2 + rr0 * Math.cos(a), y + rr0 * Math.sin(a)); }
    ctx.closePath(); ctx.fillStyle = i < n ? '#f5b301' : '#dcdce6'; ctx.fill();
  }
}
const box = (x, y, w, h, r = 10) => { fillRR(x, y, w, h, r, '#fff'); rr(x, y, w, h, r); ctx.strokeStyle = '#e6e6ee'; ctx.lineWidth = 1.2; ctx.stroke(); };

// Home: KPI tiles, the October calendar and the Today panel.
// Sunday 18 October 2026 is "today"; 1 October 2026 falls on a Thursday.
const CAL = { x: 330, w: 1225, gx: 345, gw: 1195, top: 440, rh: 97 };
const cellOf = (d) => { const i = d + 3; return [CAL.gx + (i % 7) * (CAL.gw / 7), CAL.top + Math.floor(i / 7) * CAL.rh]; };
const BASE_EVENTS = [
  [1, '10a', 'Melissa Grant', 'Brow Shape'], [2, '2:30p', 'Isabella Rossi', 'Gel Color'], [6, '11a', 'Drew Bianchi', 'Deep Tissue'],
  [8, '10:30a', 'Jordan Ellis', 'Signature Facial'], [9, '1:30p', 'Maya Sandoval', 'Signature Facial'], [13, '12p', 'Marcus Bell', 'Signature Facial'],
  [15, '2p', 'Jordan Ellis', 'Classic Mani-Pedi'], [16, '3:30p', 'Avery Whitfield', 'Deluxe Spa Pedi'], [17, '11a', 'Simone Archer', 'Gel Color'],
  [29, '11a', 'Jordan Ellis', 'Signature Facial'],
];
function homeWorld(t, o = {}) {
  const added = (o.added ?? []).filter((e) => t >= e[4]);
  ctx.fillStyle = '#fafafc'; ctx.fillRect(0, 0, W, H);
  appSidebar(74, 'Dashboard');
  appTopBar('Home', 'Sunday, October 18, 2026 · What needs your attention right now, nothing to dig for.');
  const kx = LAYOUT.x0, kw = (1890 - kx) / 4;
  box(kx, 92, 1890 - kx, 112, 10);
  [['Booked this week', String(added.length), added.length ? `${added.length} new since this morning` : 'None today'],
    ['Revenue, last 7 days', '$1,284', 'Up 12% on the week before'], ['Avg health score', '74', 'Out of 100'], ['Revenue at risk', '$1,315', 'Down $278 over 30 days']].forEach(([l, v, sub], i) => {
    const x = kx + i * kw + 20;
    if (i) { ctx.fillStyle = '#ececf2'; ctx.fillRect(kx + i * kw, 92, 1, 112); }
    text(l, x, 118, 12, 500, '#3a3a55');
    if (i === 0 && added.length) snapIn(t, added[added.length - 1][4], x + 10, 148, () => text(v, x, 148, 24, 700, C.primary), { dy: 0, from: 0.7 });
    else text(v, x, 148, 24, 700, '#16162a');
    text(sub, x, 178, 12, 400, i === 0 && added.length ? '#1f9d5c' : MUTED);
  });
  // calendar
  box(CAL.x, 222, CAL.w, 50, 10);
  text('Calendar', CAL.x + 44, 247, 14, 600, '#16162a'); fillRR(CAL.x + 18, 239, 14, 16, 3, rgba(C.primary, 0.25));
  [['Status', 1], ['Pipeline', 0], ['Waitlist', 0], ['Scheduling', 0]].forEach(([s, on], i) => {
    const bx = CAL.x + 840 + i * 92;
    if (on) fillRR(bx, 233, 80, 28, 5, C.primary); else { rr(bx, 233, 80, 28, 5); ctx.strokeStyle = '#e3e3ec'; ctx.stroke(); }
    text(s, bx + 40, 248, 12, 600, on ? '#fff' : '#3a3a55', 'center');
  });
  box(CAL.x, 286, CAL.w, 660, 10);
  [['‹', 0], ['›', 1]].forEach(([s, i]) => { rr(CAL.x + 16 + i * 34, 302, 34, 30, 5); ctx.strokeStyle = '#e3e3ec'; ctx.stroke(); text(s, CAL.x + 33 + i * 34, 316, 16, 600, '#3a3a55', 'center'); });
  rr(CAL.x + 92, 302, 60, 30, 5); ctx.strokeStyle = '#e3e3ec'; ctx.stroke(); text('Today', CAL.x + 122, 317, 12, 500, '#55556f', 'center');
  text('October 2026', CAL.x + CAL.w / 2, 317, 17, 700, '#16162a', 'center');
  ['Month', 'Week', 'Day', 'Agenda'].forEach((s, i) => {
    const bx = CAL.x + CAL.w - 290 + i * 70;
    if (!i) fillRR(bx, 302, 66, 30, 5, C.primary);
    text(s, bx + 33, 317, 12, 600, i ? '#3a3a55' : '#fff', 'center');
  });
  const cw = CAL.gw / 7;
  ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].forEach((d, i) => text(d, CAL.gx + i * cw + cw / 2, 424, 11, 600, '#55556f', 'center'));
  ctx.strokeStyle = '#ececf2'; ctx.lineWidth = 1;
  for (let i = 0; i <= 7; i++) { ctx.beginPath(); ctx.moveTo(CAL.gx + i * cw, 408); ctx.lineTo(CAL.gx + i * cw, CAL.top + 5 * CAL.rh); ctx.stroke(); }
  for (let j = 0; j <= 5; j++) { ctx.beginPath(); ctx.moveTo(CAL.gx, CAL.top + j * CAL.rh); ctx.lineTo(CAL.gx + CAL.gw, CAL.top + j * CAL.rh); ctx.stroke(); }
  for (let i = 0; i < 35; i++) {
    const d = i - 3, x = CAL.gx + (i % 7) * cw, y = CAL.top + Math.floor(i / 7) * CAL.rh;
    const label = d < 1 ? [27, 28, 29, 30][i] : d; // Sep 27–30 lead into the month
    if (d === 18) { ctx.fillStyle = rgba(C.primary, 0.07); ctx.fillRect(x + 1, y + 1, cw - 2, CAL.rh - 2); }
    text(String(label), x + cw - 12, y + 16, 12, 600, d < 1 ? '#b5b5c8' : '#22223a', 'right');
  }
  const events = BASE_EVENTS.map((e) => [...e, -1]).concat(added);
  const perDay = {};
  events.forEach((e) => {
    const [d, tm, n, svc, at] = e, [x, y] = cellOf(d), k = (perDay[d] = (perDay[d] ?? 0) + 1) - 1;
    const draw = () => {
      ctx.save(); ctx.beginPath(); ctx.rect(x + 4, y, cw - 8, CAL.rh); ctx.clip();
      if (at > 0) fillRR(x + 5, y + 30 + k * 20, cw - 10, 19, 4, rgba(C.primary, 0.12));
      ctx.beginPath(); ctx.arc(x + 14, y + 40 + k * 20, 3.5, 0, 7); ctx.fillStyle = at > 0 ? C.primary : '#8b83ff'; ctx.fill();
      text(tm, x + 22, y + 40 + k * 20, 11, 500, '#6b6b85');
      text(`${n} · ${svc}`, x + 24 + tw(tm, 11, 500), y + 40 + k * 20, 11, at > 0 ? 600 : 500, '#22223a');
      ctx.restore();
    };
    if (at > 0) snapIn(t, at, x + cw / 2, y + 40, draw, { dy: 0, from: 0.85 }); else draw();
  });
  // Today + Needs attention
  box(1573, 222, 315, 190, 10);
  text('Today', 1591, 246, 14, 600, '#16162a'); text('Sunday, Oct 18', 1591, 266, 12, 400, MUTED);
  text('Nothing booked today', 1730, 330, 13, 600, '#16162a', 'center');
  const next = added.find((e) => e[0] === 21) ? 'Next: Wed, Oct 21 at 11:00 AM, Chloe Bergeron' : 'Next: Thu, Oct 29 at 11:00 AM, Jordan Ellis';
  text(next, 1730, 356, 11.5, 400, MUTED, 'center');
  box(1573, 426, 315, 520, 10);
  text('Needs attention', 1591, 452, 14, 600, '#16162a'); text('5 open items, most urgent first', 1591, 472, 11.5, 400, MUTED);
  [['Camille Duval', 'Invoice INV-0011 is 12 days overdue', '$75.78'], ['Melissa Grant', 'Invoice INV-0009 is 9 days overdue', '$108.25'],
    ['Jordan Marsh', 'Overdue for a repeat visit, last seen 43 days ago', ''], ['Riley Delgado', 'No booking in 69 days', '']].forEach(([n, s2, v], i) => {
    const y = 510 + i * 92;
    ctx.beginPath(); ctx.arc(1595, y, 4, 0, 7); ctx.fillStyle = i < 2 ? C.risk : '#b5b5c8'; ctx.fill();
    text(n, 1607, y, 13, 600, '#16162a'); if (v) text(v, 1872, y, 13, 600, '#16162a', 'right');
    text(s2, 1607, y + 20, 11, 400, MUTED);
    rr(1607, y + 36, 110, 26, 5); ctx.strokeStyle = '#e3e3ec'; ctx.stroke(); text(i < 2 ? 'Resend invoice' : 'Text client', 1662, y + 49, 11.5, 500, '#22223a', 'center');
  });
}

const AI_Q = 'Which clients haven’t booked in 60 days?';
const AI_ROWS = [
  ['Chloe Bergeron', 'Jul 29', '81'], ['Renee Calloway', 'Jul 31', '79'], ['Reese Abara', 'Aug 2', '77'], ['Lauren Kowalczyk', 'Aug 4', '75'],
  ['Hannah McAllister', 'Aug 7', '72'], ['Riley Delgado', 'Aug 10', '69'], ['Charlotte Reddick', 'Aug 11', '68'], ['Nina Petrossian', 'Aug 13', '66'], ['Dominic Ferraro', 'Aug 14', '65'],
];
const REQ_ROWS = [['Simone Archer', 'Visited yesterday'], ['Isabella Rossi', 'Visited Oct 16'], ['Danielle Whitmore', 'Last asked 63 days ago'], ['Priya Raman', 'Last asked 94 days ago'],
  ['Sofia Camacho', 'Last asked 120 days ago'], ['Grace Liu', 'Last asked 79 days ago'], ['Nina Petrossian', 'Last asked 99 days ago'], ['Blake Petrov', 'Last asked 75 days ago']];
const FEED = [
  ['Simone Archer', 5, 'Felt like a regular again. Booked my next visit before I left.', 'Oct 17, 2026'],
  ['Isabella Rossi', 5, 'So easy to rebook, and the reminder text was perfect.', 'Oct 16, 2026'],
  ['Dominic Ferraro', 5, 'They squeezed me in same-day before an event. So many compliments.', 'Oct 14, 2026'],
  ['Charlotte Reddick', 5, 'So easy to book, zero wait, and the results speak for themselves.', 'Oct 11, 2026'],
  ['Amara Diallo', 4, 'Lovely team. Will be back next month.', 'Oct 9, 2026'],
  ['Avery Whitfield', 5, 'Rating only, no comment', 'Oct 7, 2026'],
  ['Taylor Fontaine', 4, 'Great results. Parking was tricky.', 'Oct 5, 2026'],
];
function reviewsWorld(t, mode, sent) {
  ctx.fillStyle = '#fafafc'; ctx.fillRect(0, 0, W, H);
  appSidebar(74, 'Reviews');
  appTopBar('Reviews', 'Sunday, October 18, 2026 · Manage and respond to client reviews.');
  appTabs(['Feedback', 'Requests', 'Insights', 'Google'], mode === 'feed' ? 'Feedback' : 'Requests');
  const kx = LAYOUT.x0, kw = (1890 - kx) / 4;
  box(kx, 152, 1890 - kx, 98, 10);
  const fresh = mode === 'feed' && t >= REV.review;
  const kpis = mode === 'feed'
    ? [['Average rating', fresh ? '4.7' : '4.6', `from ${fresh ? 47 : 46} ratings`], ['Response rate', '100%', 'all requests answered'], ['Net promoter score', '+31', 'Good'], ['Low ratings, 30 days', '0', '1 to 3 stars']]
    : [['Requests, 30 days', String(12 + sent), 'Automatic requests are on'], ['Answered', '10', 'in the last 30 days'], ['Average rating', '4.6', 'from requested reviews'], ['Queued to send', String(sent), 'Go out within 15 minutes']];
  kpis.forEach(([l, v, sub], i) => {
    const x = kx + i * kw + 20;
    if (i) { ctx.fillStyle = '#ececf2'; ctx.fillRect(kx + i * kw, 152, 1, 98); }
    text(l, x, 176, 12, 500, '#3a3a55');
    const hot = (mode === 'feed' && i === 0 && fresh) || (mode !== 'feed' && (i === 0 || i === 3) && sent);
    text(v, x, 204, 24, 700, hot ? C.primary : '#16162a');
    text(sub, x, 230, 12, 400, MUTED);
  });
  box(kx, 268, 1003, 680, 10); box(1351, 268, 537, 680, 10);
  if (mode === 'feed') {
    text('Client feedback', kx + 20, 292, 14, 600, '#16162a'); text('Newest first', kx + 20, 311, 11.5, 400, MUTED);
    const rows = fresh ? FEED : FEED.slice(1);
    rows.forEach(([n, st, c, d], i) => {
      const y = 360 + i * 66;
      const draw = () => {
        if (i === 0 && fresh) fillRR(kx + 8, y - 26, 987, 60, 8, rgba(C.healthy, 0.08));
        stars(kx + 28, y - 6, st, 7); text(n, kx + 112, y - 6, 13, 600, '#16162a'); text(d, kx + 983, y - 6, 12, 500, '#55556f', 'right');
        text(c, kx + 20, y + 16, 12.5, 400, '#2a2a44');
      };
      if (i === 0 && fresh) snapIn(t, REV.review, kx + 500, y, draw, { dy: -16 }); else draw();
      ctx.fillStyle = '#ececf2'; ctx.fillRect(kx, y + 38, 1003, 1);
    });
    text('Rating distribution', 1370, 292, 14, 600, '#16162a');
    text(fresh ? '4.7' : '4.6', 1370, 350, 32, 700, '#16162a'); stars(1374, 384, 5, 7);
    [[5, 31], [4, 12], [3, 3], [2, 1], [1, 0]].forEach(([k, n], i) => {
      const y = 340 + i * 28, v = k === 5 && fresh ? n + 1 : n;
      text(`${k} ★`, 1470, y, 12, 500, '#3a3a55'); fillRR(1505, y - 4, 300, 8, 4, LINE); fillRR(1505, y - 4, (300 * v) / 32, 8, 4, '#f5b301'); text(String(v), 1868, y, 12, 600, '#16162a', 'right');
    });
    return;
  }
  text('Requests', kx + 20, 292, 14, 600, '#16162a'); text('Queued first, then newest', kx + 20, 311, 11.5, 400, MUTED);
  fillRR(kx + 860, 283, 125, 30, 6, C.primary); text('Send a request', kx + 922, 298, 12.5, 600, '#fff', 'center');
  FEED.slice(2).concat(FEED.slice(2, 4)).forEach(([n, st], i) => {
    const y = 360 + i * 56;
    text(n, kx + 20, y - 8, 13, 600, '#16162a'); text(`Asked ${8 + i * 3} days ago`, kx + 20, y + 10, 11.5, 400, MUTED);
    stars(kx + 860, y, st, 6); pill(kx + 985, y, 'Answered', '#1f9d5c', 11, 'right');
    ctx.fillStyle = '#ececf2'; ctx.fillRect(kx, y + 28, 1003, 1);
  });
  text('Settings', 1370, 292, 14, 600, '#16162a'); text('Applies to requests from here on', 1370, 311, 11.5, 400, MUTED);
  fillRR(1834, 282, 38, 20, 10, C.primary); ctx.beginPath(); ctx.arc(1862, 292, 7, 0, 7); ctx.fillStyle = '#fff'; ctx.fill();
  text('Wait this many minutes', 1370, 350, 12, 500, '#2a2a44'); box(1370, 362, 500, 34, 6); text('30', 1384, 379, 12.5, 500, '#16162a');
  text('Message', 1370, 424, 12, 500, '#2a2a44'); box(1370, 436, 500, 70, 6);
  text('Hi {firstName}! Thanks for visiting today. We’d love your', 1384, 458, 12, 400, '#16162a'); text('feedback, it only takes 30 seconds: {link}', 1384, 478, 12, 400, '#16162a');
}

// ── Analytics & Predictions ──────────────────────────────────────────────────
const RISE = { // beat-locked: the camera arrives on a card, then it climbs
  health: [b(81.5), b(83)],
  rebook: [b(84), b(85.5)],
  forecast: [b(86.5), b(88)],
  revenue: [b(89), b(90.5)],
  cohort: [b(90.75), b(91.75)],
};
const r = (t, k) => ease.inOut(seg(t, RISE[k][0], RISE[k][1]));
const LAYOUT = { // world coordinates of the dashboard page (1920 × 1080)
  side: 300, x0: 330, colW: 506, gap: 20, row1: 288, row1h: 312, row2: 668, row2h: 386,
};
const cardBox = {
  health: [LAYOUT.x0, LAYOUT.row1, LAYOUT.colW, LAYOUT.row1h],
  rebook: [LAYOUT.x0 + LAYOUT.colW + LAYOUT.gap, LAYOUT.row1, LAYOUT.colW, LAYOUT.row1h],
  revenue: [LAYOUT.x0 + 2 * (LAYOUT.colW + LAYOUT.gap), LAYOUT.row1, LAYOUT.colW, LAYOUT.row1h],
  forecast: [LAYOUT.x0, LAYOUT.row2, 900, LAYOUT.row2h],
  cohort: [LAYOUT.x0 + 920, LAYOUT.row2, 1890 - LAYOUT.x0 - 920, LAYOUT.row2h],
};
function dcard(key, title, sub) {
  const [x, y, w, h] = cardBox[key];
  fillRR(x, y, w, h, 12, '#fff'); rr(x, y, w, h, 12); ctx.strokeStyle = '#e6e6ee'; ctx.lineWidth = 1.2; ctx.stroke();
  text(title, x + 20, y + 30, 15, 600, '#16162a');
  text(sub, x + 20, y + 51, 12, 400, MUTED);
  for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(x + w - 36 + i * 6, y + 30, 1.6, 0, 7); ctx.fillStyle = '#55556a'; ctx.fill(); }
  return [x, y, w, h];
}
function delta(t, key, x, y, label) { // "+46 pts" tag snaps in as the rise finishes
  snapIn(t, RISE[key][1] - 0.05, x, y, () => pill(x, y, label, '#1f9d5c', 12, 'left'), { from: 0.7, dy: 0, blur: 6 });
}
// The product chrome, shared by every screen rebuilt from the recordings.
function appSidebar(bh, active) {
  const L = LAYOUT;
  ctx.fillStyle = '#fbfbfd'; ctx.fillRect(0, 0, L.side, H);
  ctx.fillStyle = '#ececf2'; ctx.fillRect(L.side, 0, 1, H);
  logoMark(36, 34, 30); text(BRAND.name, 52, 35, 19, 700, '#1a1a33');
  text('Business health', 18, 80, 13, 500, MUTED);
  text(`${bh}`, 236, 80, 13, 700, '#16162a', 'right'); text('/100', 266, 80, 13, 500, FAINT, 'right');
  fillRR(18, 94, 264, 5, 3, LINE); fillRR(18, 94, (264 * bh) / 100, 5, 3, bh > 70 ? '#22c55e' : bh > 50 ? C.attention : C.risk);
  fillRR(14, 114, 272, 34, 6, '#fff'); rr(14, 114, 272, 34, 6); ctx.strokeStyle = '#e6e6ee'; ctx.lineWidth = 1.2; ctx.stroke();
  text('Ask AI Analyst', 46, 131, 13, 500, '#3a3a55');
  const nav = [['Dashboard', 0], ['Dashboard', 1], ['Action Center', 1], ['Analytics & Predictions', 1], ['At-Risk Clients', 1], ['Custom Reports', 1],
    ['Finance', 0], ['Customers', 0], ['Messages', 0], ['Calls & Video', 0], ['Marketing', 0], ['Reviews', 1], ['Campaigns', 1], ['Scheduling & Jobs', 0], ['Team & Tools', 0]];
  let y = 180;
  nav.forEach(([n, sub], i) => {
    const on = sub && n === active && !(n === 'Dashboard' && i === 0);
    if (on) fillRR(34, y - 13, 248, 27, 5, rgba(C.primary, 0.09));
    if (!sub) fillRR(20, y - 7, 14, 14, 3, '#c5c5d6');
    text(n, sub ? 42 : 44, y + 1, 13.5, on || !sub ? 600 : 500, on ? C.primary : sub ? '#4a4a66' : '#22223a');
    y += sub ? 29 : 34;
  });
  avatar(30, H - 34, 14, 'S', '#16162a');
  text('Support', 54, H - 41, 13, 600, '#22223a'); text('Owner', 54, H - 25, 11, 500, FAINT);
}
function appTopBar(title, sub) {
  const x = LAYOUT.x0;
  text(title, x, 32, 19, 700, '#16162a');
  text(sub, x, 54, 12, 400, MUTED);
  [['AI Analyst', 1290, 100], ['Search anything…', 1404, 190], ['My Dashboard', 1608, 128]].forEach(([s, bx, bw]) => {
    rr(bx, 20, bw, 32, 6); ctx.strokeStyle = '#e3e3ec'; ctx.lineWidth = 1.2; ctx.stroke(); text(s, bx + 14, 36, 12, 500, '#3a3a55');
  });
  fillRR(1750, 20, 140, 32, 6, C.primary); text('+ Add Client', 1820, 36, 12.5, 600, '#fff', 'center');
}
function appTabs(tabs, active, y = 114) {
  const x = LAYOUT.x0;
  let tx = x + 10;
  tabs.forEach((s) => {
    const on = s === active, w = tw(s, 12.5, on ? 600 : 500);
    text(s, tx, y, 12.5, on ? 600 : 500, on ? '#16162a' : '#55556f');
    if (on) { ctx.fillStyle = '#16162a'; ctx.fillRect(tx - 10, y + 17, w + 20, 2); }
    tx += w + 50;
  });
  ctx.fillStyle = '#ececf2'; ctx.fillRect(x, y + 19, 1560, 1);
}
function dashSidebar(t) { appSidebar(Math.round(lerp(41, 88, r(t, 'cohort'))), 'Analytics & Predictions'); }
function dashHeader() {
  const x = LAYOUT.x0;
  appTopBar('Analytics & Predictions', 'Sunday, October 18, 2026 · Your business at a glance: health, revenue, activity and forecasts that update automatically.');
  appTabs(['Overview', 'Revenue', 'Retention', 'Economics', 'Growth'], 'Retention');
  text('Where clients stand', x, 252, 14.5, 600, '#16162a'); text('Risk and health across your whole client list today', x, 271, 12, 400, MUTED);
  text('Forecast and engagement', x, 632, 14.5, 600, '#16162a'); text('Where retention is heading, and how each month’s clients stick', x, 651, 12, 400, MUTED);
}
function cardHealth(t) {
  const [x, y] = dcard('health', 'Client health', 'Clients by health score band');
  const k = r(t, 'health');
  const vals = [lerp(31, 84, k), lerp(52, 13, k), lerp(17, 3, k)], cols = ['#22c55e', '#f59e0b', '#ef4444'];
  const cx = x + 100, cy = y + 170, R = 62;
  let a0 = -Math.PI / 2;
  vals.forEach((v, i) => { const a1 = a0 + (v / 100) * Math.PI * 2; ctx.beginPath(); ctx.arc(cx, cy, R, a0 + 0.03, a1 - 0.03); ctx.strokeStyle = cols[i]; ctx.lineWidth = 16; ctx.lineCap = 'butt'; ctx.stroke(); a0 = a1; });
  text(`${Math.round(vals[0])}%`, cx, cy - 6, 24, 700, '#16162a', 'center');
  text('Healthy', cx, cy + 18, 11, 500, MUTED, 'center');
  ['Healthy', 'At risk', 'Critical'].forEach((n, i) => {
    const ly = y + 128 + i * 28;
    ctx.beginPath(); ctx.arc(x + 210, ly, 4.5, 0, 7); ctx.fillStyle = cols[i]; ctx.fill();
    text(n, x + 224, ly + 1, 13, 500, '#2a2a44');
    text(`${Math.round(vals[i] * 0.4)}`, x + 420, ly + 1, 13, 600, '#16162a', 'right');
    text(`${Math.round(vals[i])}%`, x + 468, ly + 1, 12, 500, FAINT, 'right');
  });
  ctx.fillStyle = LINE; ctx.fillRect(x + 210, y + 212, 270, 1);
  text(`Average health score ${Math.round(lerp(46, 86, k))} out of 100`, x + 210, y + 232, 12, 500, MUTED);
  delta(t, 'health', x + 210, y + 270, '+53 pts healthy');
}
function cardRebook(t) {
  const [x, y, w] = dcard('rebook', 'Repeat booking rate', 'Clients who rebook within 60 days');
  const k = r(t, 'rebook');
  const v = lerp(38, 79, k);
  text(`${Math.round(v)}%`, x + 20, y + 102, 40, 700, v > 60 ? '#16162a' : C.risk, 'left', -0.03);
  text('of clients came back', x + 22, y + 136, 12, 500, MUTED);
  const lo = [44, 41, 39, 37, 38, 38], hi = [44, 47, 55, 63, 71, 79];
  const pts = lo.map((p, i) => lerp(p, hi[i], k));
  const gx = x + 20, gw = w - 40, gy = y + 160, gh = 120;
  const px = (i) => gx + (i * gw) / 5, py = (v) => gy + gh - ((v - 20) / 70) * gh;
  ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(px(i), py(p)) : ctx.moveTo(px(i), py(p))));
  ctx.lineTo(px(5), gy + gh); ctx.lineTo(px(0), gy + gh); ctx.closePath();
  const g = ctx.createLinearGradient(0, gy, 0, gy + gh); g.addColorStop(0, rgba(IND, 0.22)); g.addColorStop(1, rgba(IND, 0)); ctx.fillStyle = g; ctx.fill();
  ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(px(i), py(p)) : ctx.moveTo(px(i), py(p)))); ctx.strokeStyle = IND; ctx.lineWidth = 2.5; ctx.lineJoin = 'round'; ctx.stroke();
  ctx.beginPath(); ctx.arc(px(5), py(pts[5]), 4.5, 0, 7); ctx.fillStyle = IND; ctx.fill();
  ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'].forEach((m, i) => text(m, px(i), gy + gh + 16, 11, 500, FAINT, 'center'));
  delta(t, 'rebook', x + 150, y + 102, '+41%');
}
function cardRevenue(t) {
  const [x, y] = dcard('revenue', 'Revenue won back', 'From at-risk clients who rebooked');
  const k = r(t, 'revenue');
  text(money(lerp(0, 4436, k)), x + 20, y + 104, 40, 700, '#16162a', 'left', -0.03);
  text(`${Math.round(lerp(0, 23, k))} clients won back this quarter`, x + 22, y + 138, 12, 500, MUTED);
  ctx.fillStyle = LINE; ctx.fillRect(x + 20, y + 168, 466, 1);
  text('Could still be lost', x + 20, y + 196, 12, 500, MUTED);
  text(money(lerp(5750, 1315, k)), x + 20, y + 226, 22, 700, k > 0.5 ? '#16162a' : C.risk);
  text('Rebook rate after win-back', x + 260, y + 196, 12, 500, MUTED);
  text(`${Math.round(lerp(0, 64, k))}%`, x + 260, y + 226, 22, 700, '#16162a');
  delta(t, 'revenue', x + 20, y + 270, `+${money(4436)} recovered`);
}
function cardForecast(t) {
  const [x, y, w, h] = dcard('forecast', 'Retention forecast', 'Active clients projected over the next 6 months');
  const k = r(t, 'forecast');
  text(`${Math.round(lerp(21, 68, k))}%`, x + 20, y + 92, 26, 700, '#16162a', 'left', -0.02);
  text('retained at 6 months', x + 82, y + 94, 12.5, 500, MUTED);
  const lo = [40, 27, 19, 14, 11, 9, 8], hi = [40, 38, 36, 33, 31, 29, 27];
  const gx = x + 60, gw = w - 90, gy = y + 130, gh = h - 180;
  [0, 10, 20, 30, 40].forEach((v) => { const yy = gy + gh - (v / 40) * gh; ctx.fillStyle = '#f0f0f5'; ctx.fillRect(gx, yy, gw, 1); text(String(v), gx - 14, yy, 11, 500, FAINT, 'right'); });
  ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'].forEach((m, i) => {
    const v = lerp(lo[i], hi[i], k), bw = 46, bx = gx + (i + 0.5) * (gw / 7) - bw / 2, bh = (v / 40) * gh;
    fillRR(bx, gy + gh - bh, bw, bh, [3, 3, 0, 0], i === 0 ? '#cfd3dd' : IND);
    text(String(Math.round(v)), bx + bw / 2, gy + gh - bh - 12, 11, 500, '#55556f', 'center');
    text(m, bx + bw / 2, gy + gh + 16, 11, 500, FAINT, 'center');
  });
  const tag = k > 0.5 ? ['High confidence', '#1f9d5c'] : ['Declining', C.risk];
  pill(x + w - 60, y + 30, tag[0], tag[1], 11, 'right');
  delta(t, 'forecast', x + 220, y + 93, '+47 pts');
}
function cardCohort(t) {
  const [x, y, w] = dcard('cohort', 'Cohort retention', 'Share of each month’s new clients still booking');
  const k = r(t, 'cohort');
  const lo = [[100, 100, 75, 50, 25], [100, 89, 56, 33], [100, 71, 43], [100, 50], [100]];
  const hi = [[100, 100, 100, 92, 88], [100, 100, 94, 90], [100, 100, 93], [100, 96], [100]];
  const months = ['May', 'Jun', 'Jul', 'Aug', 'Sep'];
  const cx0 = x + 70, cw = (w - 90) / 5, ch = 46, cy0 = y + 100;
  ['M0', 'M1', 'M2', 'M3', 'M4'].forEach((m, j) => text(m, cx0 + j * cw + cw / 2, cy0 - 18, 11, 500, FAINT, 'center'));
  months.forEach((m, i) => {
    text(m, x + 20, cy0 + i * (ch + 4) + ch / 2, 12, 600, '#2a2a44');
    for (let j = 0; j < 5; j++) {
      const bx = cx0 + j * cw, by = cy0 + i * (ch + 4);
      if (j >= lo[i].length) { text('–', bx + cw / 2, by + ch / 2, 12, 500, '#c5c5d6', 'center'); continue; }
      const v = lerp(lo[i][j], hi[i][j], k);
      ctx.fillStyle = rgba('#3b2fc9', 0.12 + 0.86 * Math.pow(v / 100, 1.6)); ctx.fillRect(bx + 1, by, cw - 2, ch);
      text(`${Math.round(v)}%`, bx + cw / 2, by + ch / 2 + 1, 12, 600, v > 55 ? '#fff' : '#2a2a55', 'center');
    }
  });
}
function dashboardWorld(t) {
  const at = b(80), cardAt = hits(b(80) + 0.05, 5);
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#fafafc'; ctx.fillRect(LAYOUT.side, 0, W - LAYOUT.side, H);
  snapIn(t, at, 150, H / 2, () => dashSidebar(t), { dy: 0, from: 0.98 });
  snapIn(t, at, W / 2, 80, () => dashHeader(), { dy: 0, from: 0.98 });
  [['health', cardHealth], ['rebook', cardRebook], ['revenue', cardRevenue], ['forecast', cardForecast], ['cohort', cardCohort]].forEach(([k, fn], i) => {
    const [x, y, w, h] = cardBox[k];
    snapIn(t, cardAt[i], x + w / 2, y + h / 2, () => fn(t), { dy: 18 });
  });
}
// Camera keys: [time, centre x, centre y, zoom]. Moves start on a beat and settle in 0.4s.
const focus = (k, z) => { const [x, y, w, h] = cardBox[k]; return [x + w / 2, y + h / 2, z]; };
const CAM = [
  [b(80), W / 2, H / 2, 1],
  [b(81), ...focus('health', 2.4)],
  [b(83.5), ...focus('rebook', 2.4)],
  [b(86), ...focus('forecast', 1.8)],
  [b(88.5), ...focus('revenue', 2.4)],
  [b(90.5), W / 2, H / 2, 1],
];
function camAt(t, keys = CAM) {
  let c = keys[0].slice(1);
  for (let i = 1; i < keys.length; i++) {
    const [at, ...to] = keys[i];
    const p = ease.inOut(seg(t, at, at + 0.42));
    if (p <= 0) break;
    // interpolate in log-zoom so the push feels even
    c = [lerp(c[0], to[0], p), lerp(c[1], to[1], p), Math.exp(lerp(Math.log(c[2]), Math.log(to[2]), p))];
  }
  return c;
}
// ═════════════════════════════════════════════════════════════════════════════
// The film. Phrases are 4 bars (16 beats, ~8s); scenes start on downbeats.
// ═════════════════════════════════════════════════════════════════════════════

// ── A · beats 0–16 · the text ────────────────────────────────────────────────
const HOOK = [["I don't know how", 2], ['salon owners could live', 6], ['without this', 10, true]];
window.SFX = HOOK.map(([, k]) => ({ t: b(k), kind: 'sent' })); // iPhone "sent" sound, peaking on each bubble
const PHONE = { w: 500, h: 1010 };
function messages(t, sx, sy, sw, sh) {
  ctx.fillStyle = '#ffffff'; ctx.fillRect(sx, sy, sw, sh);
  ctx.fillStyle = 'rgba(247,247,248,0.96)'; ctx.fillRect(sx, sy, sw, 190);
  text('9:41', sx + 74, sy + 38, 22, 600, '#000', 'center', 0);
  [0, 1, 2, 3].forEach((i) => fillRR(sx + sw - 128 + i * 7, sy + 42 - i * 3, 5, 6 + i * 3, 1.5, '#000'));
  rr(sx + sw - 88, sy + 29, 44, 20, 6); ctx.strokeStyle = 'rgba(0,0,0,0.45)'; ctx.lineWidth = 2; ctx.stroke(); fillRR(sx + sw - 85, sy + 32, 34, 14, 4, '#000');
  ctx.fillStyle = 'rgba(0,0,0,0.12)'; ctx.fillRect(sx, sy + 190, sw, 1);
  text('‹', sx + 28, sy + 104, 52, 400, '#0a7cff', 'left', 0);
  const ag = ctx.createLinearGradient(0, sy + 70, 0, sy + 140); ag.addColorStop(0, '#a6a6b0'); ag.addColorStop(1, '#6e6e78');
  ctx.beginPath(); ctx.arc(sx + sw / 2, sy + 108, 34, 0, 7); ctx.fillStyle = ag; ctx.fill();
  text('JR', sx + sw / 2, sy + 109, 26, 600, '#fff', 'center', 0);
  text('Jess ›', sx + sw / 2, sy + 166, 17, 500, '#000', 'center', 0);
  text('iMessage', sx + sw / 2, sy + 232, 15, 600, '#8e8e93', 'center', 0);
  text('Today 9:41 AM', sx + sw / 2, sy + 254, 15, 400, '#8e8e93', 'center', 0);
  const size = 28, maxW = sw * 0.72, x1 = sx + sw - 22;
  let y = sy + 286;
  const shown = HOOK.filter(([, k]) => t >= b(k));
  shown.forEach(([s, k, eyes], i) => {
    const lines = wrapText(s, size, 400, maxW), last = i === shown.length - 1, es = 54;
    const lh = size * 1.28, h = lines.length * lh + 26;
    const y0 = y;
    snapIn(t, b(k), x1 - 40, y0 + h, () => {
      const bb = sentBubble(x1, y0, lines, size, last, eyes ? tw(' ', size, 400, 0) + es * 0.72 : 0);
      if (eyes) eyesEmoji(bb.x + bb.w - 22 - es * 0.36, y0 + h / 2 + 1, es); // "this 👀"

    }, { from: 0.55, dy: 70, blur: 0 });
    y += h + 8;
  });
  if (t >= b(11) && shown.length === 3) riseIn(t, b(11), () => text('Delivered', x1, y + 10, 15, 500, '#8e8e93', 'right', 0), { dy: 6, blur: 0, d: 0.3 });
  ctx.fillStyle = 'rgba(247,247,248,0.96)'; ctx.fillRect(sx, sy + sh - 120, sw, 120);
  ctx.beginPath(); ctx.arc(sx + 42, sy + sh - 76, 20, 0, 7); ctx.fillStyle = '#e5e5ea'; ctx.fill(); text('+', sx + 42, sy + sh - 77, 30, 400, '#6e6e73', 'center', 0);
  rr(sx + 74, sy + sh - 98, sw - 100, 44, 22); ctx.strokeStyle = '#d1d1d6'; ctx.lineWidth = 1.5; ctx.stroke();
  text('iMessage', sx + 94, sy + sh - 76, 18, 400, '#a0a0a6', 'left', 0);
  fillRR(sx + sw / 2 - 70, sy + sh - 18, 140, 6, 3, '#000');
}
function sHook(t) {
  stage(0.2, C.primary, 0.5);
  const enter = ease.quint(seg(t, b(0), b(0) + 1.3));
  const push = ease.inOut(seg(t, b(12), b(16)));
  const z = (0.95 + 0.05 * enter) * (1 + 0.28 * push);
  const x = W / 2 - PHONE.w / 2, y = (H - PHONE.h) / 2;
  ctx.save();
  ctx.globalAlpha = enter;
  if (enter < 0.99) ctx.filter = `blur(${(18 * (1 - enter)).toFixed(1)}px)`;
  ctx.translate(W / 2, H / 2 + (1 - enter) * 140 - push * 140); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2);
  iphone(x, y, PHONE.w, PHONE.h, (sx, sy, sw, sh) => messages(t, sx, sy, sw, sh));
  ctx.restore();
}

// ── B · beats 16–32 · the problem ────────────────────────────────────────────
function sRegulars(t) {
  stage();
  headline(t, [['Repeat clients', b(16)]], W / 2, H / 2 - 72, 128);
  headline(t, [['are the', b(17)], ['business.', b(17), true]], W / 2, H / 2 + 72, 128);
}
function sStops(t) {
  stage();
  const focus = ease.inOut(seg(t, b(24), b(25)));
  ctx.save();
  const fx = 1385, fy = 600, z = 1 + 0.22 * focus;
  ctx.translate(lerp(W / 2, fx, focus * 0.6), lerp(H / 2, fy, focus * 0.6)); ctx.scale(z, z); ctx.translate(-lerp(W / 2, fx, focus * 0.6), -lerp(H / 2, fy, focus * 0.6));
  headline(t, [['But when a regular', b(20)], ['stops booking…', b(20.5)]], W / 2, 270, 84);
  const months = ['Jan', 'Feb', 'Mar', 'Apr'], cw = 300, ch = 270, gap = 40, x0 = W / 2 - (4 * cw + 3 * gap) / 2, y0 = 440;
  months.forEach((m, i) => {
    const x = x0 + i * (cw + gap), empty = i === 3;
    ctx.save(); if (!empty) ctx.globalAlpha = 1 - 0.65 * focus;
    snapIn(t, b(21 + i * 0.5), x + cw / 2, y0 + ch / 2, () => {
      if (empty) {
        fillRR(x, y0, cw, ch, 30, 'rgba(236,95,79,0.06)');
        ctx.setLineDash([12, 10]); rr(x, y0, cw, ch, 30); ctx.strokeStyle = 'rgba(236,95,79,0.75)'; ctx.lineWidth = 2.5; ctx.stroke(); ctx.setLineDash([]);
        text(m, x + 34, y0 + 54, 34, 700, '#ff8a7a');
        text('No booking', x + cw / 2, y0 + 165, 30, 600, '#ff8a7a', 'center');
        return;
      }
      glass(x, y0, cw, ch, 30);
      text(m, x + 34, y0 + 54, 34, 700, '#ffffff');
      fillRR(x + 26, y0 + 112, cw - 52, 110, 20, 'rgba(129,140,248,0.18)');
      ctx.beginPath(); ctx.arc(x + 76, y0 + 167, 26, 0, 7); ctx.fillStyle = 'rgba(165,156,255,0.3)'; ctx.fill();
      text('JL', x + 76, y0 + 168, 20, 700, '#d9d6ff', 'center');
      text('Jordan', x + 116, y0 + 152, 26, 700, '#ffffff');
      text('10:00 · Cut', x + 116, y0 + 184, 21, 500, SOFT);
    }, { dy: 26, blur: 10 });
    ctx.restore();
  });
  ctx.restore();
  headline(t, [['No reply.', b(25)], ['No warning.', b(25.5)]], W / 2, 900, 46, { color: SOFT, weight: 600 });
}
window.MUFFLE = [b(28), b(32)]; // the music goes underwater for this bar, then the logo lands
function sDark(t) {
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  headline(t, [["You won't see it coming", b(28)]], W / 2, H / 2 - 70, 100, { color: '#ffffff' });
  headline(t, [["until they're gone.", b(30)]], W / 2, H / 2 + 70, 100, { color: '#ffffff' });
}

// ── C · beats 32–48 · MsgHealth ──────────────────────────────────────────────
// The logo lands in the middle, steps right, then sweeps left as the name wipes in behind it.
function lockup(t, at, y, ls, size, o = {}) {
  const ww = tw(BRAND.name, size, 700, -0.035), gap = -0.06 * ls, full = ls + gap + ww;
  const lockX = W / 2 - full / 2 + ls / 2, textX = lockX + ls / 2 + gap;
  const right = o.static ? 1 : ease.inOut(seg(t, at + BEAT, at + BEAT + 0.4));
  const left = o.static ? 1 : ease.inOut(seg(t, at + 2 * BEAT, at + 2 * BEAT + 0.5));
  const lx = lerp(lerp(W / 2, W / 2 + 150, right), lockX, left);
  const wipeAt = o.static ? at + 0.1 : at + 2 * BEAT + 0.08;
  const wipe = lerp(textX - 40, textX + ww + 30, ease.out(seg(t, wipeAt, wipeAt + 0.5)));
  if (t >= wipeAt) {
    ctx.save();
    const edge = o.static ? textX - 40 : Math.max(lx + ls * 0.34, textX - 24); // trails the logo's visible edge
    ctx.beginPath(); ctx.rect(edge, 0, Math.max(0, wipe - edge), H); ctx.clip();
    font(size, 700, -0.035); ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    const sweep = seg(t, at + 3 * BEAT, at + 3 * BEAT + 0.9); // one soft light sweep across the name
    const g = ctx.createLinearGradient(textX, 0, textX + ww, 0);
    const c0 = lerp(-0.3, 1.3, sweep);
    g.addColorStop(0, '#c9c9d4'); g.addColorStop(clamp(c0 - 0.15), '#c9c9d4'); g.addColorStop(clamp(c0), sweep > 0 && sweep < 1 ? '#ffffff' : '#c9c9d4'); g.addColorStop(clamp(c0 + 0.15), '#c9c9d4'); g.addColorStop(1, '#c9c9d4');
    ctx.fillStyle = g; ctx.fillText(BRAND.name, textX, y + size * 0.04);
    ctx.restore();
  }
  riseIn(t, at, () => {
    const gl = ctx.createRadialGradient(lx, y, 0, lx, y, ls * 1.4);
    gl.addColorStop(0, 'rgba(99,102,241,0.35)'); gl.addColorStop(1, 'rgba(99,102,241,0)');
    ctx.fillStyle = gl; ctx.fillRect(lx - ls * 1.5, y - ls * 1.5, ls * 3, ls * 3);
    logoMark(lx, y, ls);
  }, { dy: 0, d: 0.8, blur: 20 });
}
function sMeet(t) {
  stage(0.16 * ease.quint(seg(t, b(32), b(33))), C.primary, 0.48);
  lockup(t, b(32), H / 2 - 30, 200, 164);
  headline(t, [['Client retention for salons.', b(35)]], W / 2, H / 2 + 150, 46, { color: SOFT, weight: 600 });
}
function sReimagined(t) {
  stage();
  headline(t, [['Client retention,', b(36)]], W / 2, H / 2 - 72, 120);
  headline(t, [['reimagined', b(37), true], ['for salons.', b(37)]], W / 2, H / 2 + 72, 120);
}
function sWhat(t) {
  stage();
  headline(t, [['It tells you', b(40)], ['who’s drifting', b(40.5), true]], W / 2, 400, 104);
  headline(t, [['and brings them', b(42)], ['back.', b(42), true]], W / 2, 540, 104);
  const chips = ['Health scores', 'Churn alerts', 'Automatic win-backs'], size = 28;
  const ws = chips.map((s) => tw(s, size, 600) + 56), gap = 20, at = hits(b(43), 3);
  let x = W / 2 - (ws.reduce((a, c) => a + c, 0) + gap * 2) / 2;
  chips.forEach((s, i) => { const x0 = x; snapIn(t, at[i], x0 + ws[i] / 2, 700, () => { glass(x0, 672, ws[i], 56, 28); text(s, x0 + ws[i] / 2, 701, size, 600, '#fff', 'center'); }, { dy: 14 }); x += ws[i] + gap; });
}
function sReveal(t) { // the MacBook opens on the product
  stage(0.12, C.primary, 0.6);
  const open = ease.inOut(seg(t, b(44), b(44) + 1.1)), lift = (1 - ease.quint(seg(t, b(44), b(44) + 1.4))) * 90;
  const z = 1 + 0.06 * ease.inOut(seg(t, b(45), b(48)));
  laptop(t, [960, 560, z], () => homeWorld(t), { open, lift });
  headline(t, [['Every client, every visit, in one calm view.', b(46)]], W / 2, 1010, 34, { color: SOFT, weight: 600 });
}

// ── D · beats 48–64 · how it works (the song's breakdown) ────────────────────
function sHealth(t) {
  stage(0.12);
  headline(t, [['Every client', b(48)]], 150, 440, 92, { align: 'left' });
  headline(t, [['gets a', b(48.5)], ['health score.', b(48.5), true]], 150, 550, 92, { align: 'left' });
  const x = 1010, w = 770, rh = 112, y0 = 250, flag = b(50.5), at = hits(b(49), 5);
  snapIn(t, b(49), x + w / 2, H / 2, () => glass(x, y0 - 40, w, rh * 5 + 80, 34), { dy: 20 });
  ROWS.forEach((r, i) => {
    const ry = y0 + 30 + i * rh, jordan = i === 2;
    snapIn(t, at[i], x + w / 2, ry, () => {
      if (jordan && t >= flag) fillRR(x + 14, ry - 48, w - 28, 96, 20, `rgba(236,95,79,${0.13 * snapP(t, flag)})`);
      ctx.beginPath(); ctx.arc(x + 62, ry, 28, 0, 7); ctx.fillStyle = rgba(r.c, 0.28); ctx.fill();
      text(r.i, x + 62, ry + 1, 21, 700, '#ffffff', 'center');
      text(r.n, x + 108, ry - 13, 27, 600, '#ffffff');
      text(r.v, x + 108, ry + 19, 20, 500, jordan ? '#ff8a7a' : SOFT);
      text(String(r.s), x + 460, ry + 1, 32, 700, r.sc, 'right');
      fillRR(x + 478, ry - 5, 90, 10, 5, 'rgba(255,255,255,0.12)'); fillRR(x + 478, ry - 5, (90 * r.s) / 100, 10, 5, r.sc);
      if (!jordan) pill(x + w - 30, ry, r.st, r.sc, 20, 'right');
      else snapIn(t, flag, x + w - 90, ry, () => pill(x + w - 30, ry, r.st, r.sc, 20, 'right'), { from: 0.6, dy: 0 });
    }, { dy: 16 });
  });
}
const ROWS = [
  { n: 'Alex Kim', i: 'AK', c: '#d97706', s: 91, st: 'Healthy', sc: '#4ade80', v: '4 days ago' },
  { n: 'Priya Shah', i: 'PS', c: '#db2777', s: 54, st: 'Needs attention', sc: '#fbbf24', v: '3 weeks ago' },
  { n: 'Jordan Lee', i: 'JL', c: '#6366f1', s: 38, st: 'At risk', sc: '#ff7a6b', v: '62 days ago' },
  { n: 'Casey Park', i: 'CP', c: '#0891b2', s: 86, st: 'Healthy', sc: '#4ade80', v: '1 week ago' },
  { n: 'Riley Chen', i: 'RC', c: '#7c3aed', s: 79, st: 'Healthy', sc: '#4ade80', v: '9 days ago' },
];

// AI Business Analyst on the MacBook
const AI = { open: b(52.5), click: b(53), typeA: b(53), typeB: b(54), run: b(54.5), ans: b(55), send: b(56.5) };
function analystWorld(t, z) {
  homeWorld(t);
  if (t >= AI.open) { ctx.fillStyle = `rgba(10,10,22,${0.55 * snapP(t, AI.open)})`; ctx.fillRect(0, 0, W, H); }
  const x = 530, w = 860, y = 120, { ans, send } = AI;
  snapIn(t, AI.open, x + w / 2, y + 40, () => {
    const h = t >= ans ? 690 : 80;
    fillRR(x, y, w, h, 14, '#12121c'); rr(x, y, w, h, 14); ctx.strokeStyle = 'rgba(139,131,255,0.35)'; ctx.lineWidth = 1.5; ctx.stroke();
    glyph('bolt', x + 28, y + 28, '#a59cff');
    const typed = AI_Q.slice(0, Math.floor(AI_Q.length * seg(t, AI.typeA, AI.typeB)));
    text(typed || 'Ask anything about your business…', x + 54, y + 28, 15, 500, typed ? '#f1f1f7' : '#6b6b85');
    if (t >= AI.click && t < AI.run) { ctx.fillStyle = '#a59cff'; ctx.fillRect(x + 56 + tw(typed, 15, 500), y + 18, 2, 21); }
    fillRR(x + w - 74, y + 13, 58, 30, 7, C.primary); text('Run', x + w - 45, y + 28, 13, 600, '#fff', 'center');
    ctx.fillStyle = 'rgba(255,255,255,0.08)'; ctx.fillRect(x, y + 56, w, 1);
    text('Navigates the dashboard or answers from your data', x + 18, y + 68, 11, 400, '#6b6b85');
    if (t < ans) return;
    snapIn(t, ans, x + w / 2, y + 380, () => {
      text('Here’s what I found', x + 20, y + 104, 16, 700, '#f1f1f7');
      rr(x + 18, y + 124, w - 36, 470, 10); ctx.strokeStyle = 'rgba(139,131,255,0.7)'; ctx.lineWidth = 1.5; ctx.stroke();
      fillRR(x + 19, y + 125, w - 38, 468, 10, 'rgba(91,80,232,0.08)');
      text('AI GENERATED', x + 40, y + 148, 10.5, 700, '#a59cff', 'left', 0.08);
      text('Based on today’s date, these clients haven’t booked in 60+ days, the ones most worth reaching out to:', x + 40, y + 176, 13.5, 500, '#e4e4ee');
      const at = hits(ans, 3); // three rows land on each hit
      AI_ROWS.forEach(([n, d, days], i) => {
        const ry = y + 210 + i * 34;
        snapIn(t, at[Math.floor(i / 3)], x + 200, ry, () => {
          ctx.beginPath(); ctx.arc(x + 48, ry, 2.5, 0, 7); ctx.fillStyle = '#e4e4ee'; ctx.fill();
          text(n, x + 60, ry, 14, 700, '#ffffff');
          text(`· last booked ${d} (${days} days ago)`, x + 66 + tw(n, 14, 700), ry, 14, 400, '#c9c9d9');
        }, { dy: 8, blur: 6 });
      });
      text('The top 3 haven’t been in for over 11 weeks. Great candidates for a win-back offer.', x + 40, y + 530, 13.5, 500, '#e4e4ee');
      const bw = 330, bx = x + 20, by = y + 618;
      if (t < send) { fillRR(bx, by, bw, 40, 9, C.primary); text('Send win-back offer to all 9', bx + bw / 2, by + 20, 14, 600, '#fff', 'center'); }
      else snapIn(t, send, bx + bw / 2, by + 20, () => { fillRR(bx, by, bw, 40, 9, '#16a34a'); check(bx + 30, by + 20, 14, '#fff', 3); text('Win-back sent to 9 clients', bx + bw / 2 + 14, by + 20, 14, 600, '#fff', 'center'); }, { dy: 0, from: 0.92, blur: 4 });
    }, { dy: 14 });
  }, { dy: 20 });
  pointer(t, [[b(52), 1210, 620], [AI.click, 980, 152], [AI.run, 1345, 150], [send, 560, 760]], [AI.click, AI.run, send], z);
}
function sAnalyst(t) {
  stage(0.1);
  const cam = camAt(t, [[b(52), 960, 540, 1], [AI.open, 960, 300, 2.0], [AI.ans, 960, 470, 1.6]]);
  laptop(t, cam, (z) => analystWorld(t, z));
  featureTag(t, b(52), 'AI Business Analyst', 'Ask in plain words. Get an answer from your data.', cam[2]);
}

// Win them back
function sWinBack(t) {
  stage(0.14, '#7c3aed');
  headline(t, [['Win them back', b(58)], ['on autopilot.', b(58.5), true]], W / 2, 170, 84);
  const nodes = [['At risk detected', '#ff7a6b', 'alert'], ['Text sent', '#818cf8', 'chat'], ['Email follow-up', '#38bdf8', 'mail'], ['Invite to book', '#4ade80', 'cal']];
  const nw = 330, nh = 120, gap = 66, x0 = W / 2 - (4 * nw + 3 * gap) / 2, ny = 290, at = hits(b(59), 4);
  nodes.forEach(([label, col, icon], i) => {
    const x = x0 + i * (nw + gap);
    if (i > 0 && t >= at[i]) {
      const p = snapP(t, at[i]); ctx.strokeStyle = 'rgba(165,156,255,0.5)'; ctx.lineWidth = 3; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(x - gap + 10, ny + nh / 2); ctx.lineTo(x - gap + 10 + (gap - 20) * p, ny + nh / 2); ctx.stroke();
    }
    snapIn(t, at[i], x + nw / 2, ny + nh / 2, () => {
      glass(x, ny, nw, nh, 26);
      ctx.beginPath(); ctx.arc(x + 58, ny + nh / 2, 30, 0, 7); ctx.fillStyle = rgba(col, 0.18); ctx.fill();
      glyph(icon, x + 58, ny + nh / 2, col);
      text(`Step ${i + 1}`, x + 104, ny + 42, 19, 600, SOFT);
      text(label, x + 104, ny + 76, 26, 700, '#fff');
    }, { dy: 18 });
  });
  const size = 30;
  snapIn(t, b(60.5), 1200, 560, () => { sentBubble(1450, 500, ['Hi Jordan! We miss you. Want your', 'usual Thursday at 10:00?'], size, true); text('Delivered', 1450, 618, 17, 500, 'rgba(235,235,245,0.45)', 'right', 0); }, { from: 0.6, dy: 50, blur: 0 });
  snapIn(t, b(61.5), 600, 690, () => recvBubble(470, 650, ['Yes please! See you then.'], size, true, true), { from: 0.6, dy: 30, blur: 0 });
  snapIn(t, b(62.5), W / 2, 860, () => {
    glass(W / 2 - 230, 822, 460, 76, 38, { fill: 'rgba(74,222,128,0.12)', stroke: 'rgba(74,222,128,0.4)' });
    ctx.beginPath(); ctx.arc(W / 2 - 180, 860, 19, 0, 7); ctx.fillStyle = '#4ade80'; ctx.fill(); check(W / 2 - 180, 860, 19, '#0b2e17', 4);
    text('Booked · Thu 10:00', W / 2 - 146, 861, 30, 700, '#bbf7d0');
  }, { from: 0.85 });
}

// ── E · beats 64–80 · booking and reviews ────────────────────────────────────
const CALT = { open: b(66), book: b(67.5) };
const CAL_ADDED = [
  [21, '11a', 'Chloe Bergeron', 'Signature Facial', b(67.5)],
  [22, '2:30p', 'Renee Calloway', 'Gel Color', b(68.5)],
  [23, '10a', 'Reese Abara', 'Brow Shape', b(69)],
  [20, '4p', 'Hannah McAllister', 'Deluxe Spa Pedi', b(69.5)],
  [24, '1p', 'Lauren Kowalczyk', 'Deep Tissue', b(70)],
];
function calendarWorld(t, z) {
  homeWorld(t, { added: CAL_ADDED });
  const { open, book } = CALT;
  if (t >= open && t < book + 0.15) {
    ctx.save(); ctx.globalAlpha = 1 - ease.out(seg(t, book, book + 0.15));
    snapIn(t, open, 1000, 620, () => {
      const x = 850, y = 506, w = 340, h = 214;
      card(x, y, w, h, 14, { shadow: 30, shadowColor: 'rgba(20,20,50,0.22)' });
      text('New appointment', x + 18, y + 26, 15, 700, '#16162a');
      [['Client', 'Chloe Bergeron'], ['Service', 'Signature Facial · 60 min'], ['When', 'Wed, Oct 21 · 11:00 AM']].forEach(([l, v], i) => {
        text(l, x + 18, y + 60 + i * 30, 12, 500, MUTED); text(v, x + 92, y + 60 + i * 30, 12.5, 600, '#16162a');
      });
      fillRR(x + 18, y + 142, 14, 14, 3, C.primary); check(x + 25, y + 149, 9, '#fff', 2); text('Send SMS reminder the day before', x + 40, y + 149, 12, 500, '#2a2a44');
      fillRR(x + 18, y + 170, w - 36, 32, 8, C.primary); text('Book appointment', x + w / 2, y + 186, 13, 600, '#fff', 'center');
    }, { dy: 10 });
    ctx.restore();
  }
  const last = CAL_ADDED.filter((e) => e[0] !== 21 && t >= e[4]).pop();
  if (last) snapIn(t, last[4], 1730, 900, () => {
    card(1580, 858, 300, 78, 14, { shadow: 30, shadowColor: 'rgba(20,20,50,0.2)' });
    ctx.beginPath(); ctx.arc(1608, 897, 13, 0, 7); ctx.fillStyle = C.healthy; ctx.fill(); check(1608, 897, 11, '#fff', 2.5);
    text('Booked online', 1630, 884, 13, 700, '#16162a');
    text(`${last[2]} · ${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][(last[0] + 3) % 7]} ${last[1]}`, 1630, 904, 11.5, 500, MUTED);
    text('Reminder scheduled', 1630, 922, 11, 500, '#1f9d5c');
  }, { dy: 12 });
  pointer(t, [[b(64), 1320, 300], [open, 950, 800], [book, 1030, 690], [b(68.5), 1330, 610]], [open, book], z);
}
function sCalendar(t) {
  stage(0.1);
  const cam = camAt(t, [[b(64), 960, 540, 1], [b(65.5), 960, 700, 1.9], [b(68), 1010, 610, 1.3]]);
  laptop(t, cam, (z) => calendarWorld(t, z));
  featureTag(t, b(64), 'Booking calendar', 'Clients book themselves. Reminders go out on their own.', cam[2]);
}
const REV = { open: b(73.5), s1: b(74.5), s2: b(75.5), feed: b(76.5), review: b(77.5) };
function reviewsContent(t, z) {
  const { open, s1, s2, feed } = REV;
  if (t >= feed) reviewsWorld(t, 'feed', 2);
  else {
    const sent = (t >= s1) + (t >= s2);
    reviewsWorld(t, 'req', sent);
    if (t >= open) {
      ctx.fillStyle = `rgba(30,30,45,${0.45 * snapP(t, open)})`; ctx.fillRect(0, 0, W, H);
      snapIn(t, open, 955, 477, () => {
        const x = 731, y = 127, w = 448;
        card(x, y, w, 700, 14, { shadow: 40, shadowColor: 'rgba(20,20,50,0.25)' });
        text('Send a review request', x + 20, y + 28, 15, 700, '#16162a');
        text('The client gets the same text as an automatic request,', x + 20, y + 52, 12, 400, MUTED);
        text('within about 15 minutes.', x + 20, y + 70, 12, 400, MUTED);
        ctx.fillStyle = '#ececf2'; ctx.fillRect(x, y + 98, w, 1);
        box(x + 20, y + 115, w - 40, 32, 6); text('Search clients by name or phone', x + 46, y + 131, 12, 400, FAINT);
        REQ_ROWS.forEach(([n, sub], i) => {
          const ry = y + 180 + i * 58, isSent = (i === 0 && t >= s1) || (i === 1 && t >= s2), at = i === 0 ? s1 : s2;
          text(n, x + 20, ry - 8, 13, 600, '#16162a'); text(sub, x + 20, ry + 10, 11.5, 400, MUTED);
          if (!isSent) { rr(x + w - 66, ry - 14, 46, 28, 6); ctx.strokeStyle = '#e3e3ec'; ctx.stroke(); text('Send', x + w - 43, ry, 11.5, 500, '#3a3a55', 'center'); }
          else snapIn(t, at, x + w - 48, ry, () => { fillRR(x + w - 92, ry - 14, 72, 28, 14, rgba(C.healthy, 0.16)); check(x + w - 76, ry, 10, '#1f9d5c', 2.2); text('Sent', x + w - 50, ry, 11.5, 600, '#1f9d5c', 'center'); }, { dy: 0, from: 0.8, blur: 4 });
          ctx.fillStyle = '#ececf2'; ctx.fillRect(x, ry + 28, w, 1);
        });
        rr(x + w - 80, y + 655, 60, 30, 6); ctx.strokeStyle = '#e3e3ec'; ctx.stroke(); text('Done', x + w - 50, y + 670, 12.5, 500, '#16162a', 'center');
      }, { dy: 14 });
    }
  }
  pointer(t, [[b(72), 900, 640], [open, 1258, 300], [s1, 1137, 309], [s2, 1137, 367], [feed, 352, 118], [b(78), 1240, 560]], [open, s1, s2, feed], z);
}
function sReviews(t) {
  stage(0.1);
  const cam = camAt(t, [[b(72), 960, 540, 1], [REV.open, 955, 470, 1.5], [REV.feed, 800, 420, 1.6]]);
  laptop(t, cam, (z) => reviewsContent(t, z));
  featureTag(t, b(72), 'Review requests', 'Every visit ends with a request. Five stars follow.', cam[2]);
}

// ── F · beats 80–100 · results and close ─────────────────────────────────────
function sDashboard(t) {
  stage(0.1);
  const cam = camAt(t);
  laptop(t, cam, () => dashboardWorld(t));
  featureTag(t, b(80), 'Analytics & Predictions', 'Watch retention climb, one number at a time.', cam[2]);
}
function sTagline(t) {
  stage(0.1);
  headline(t, [['Know your customers.', b(92)]], W / 2, H / 2 - 76, 124);
  headline(t, [['Keep', b(94), true], ['your customers.', b(94)]], W / 2, H / 2 + 76, 124);
}
function sEnd(t) {
  stage(0.18, C.primary, 0.45);
  lockup(t, b(96), H / 2 - 70, 190, 150, { static: true });
  headline(t, [[BRAND.url, b(97)]], W / 2, H / 2 + 80, 44, { color: SOFT, weight: 500 });
  riseIn(t, b(98), () => {
    const s = 'Start now · 50% off your first month', w = tw(s, 28, 600) + 72;
    fillRR(W / 2 - w / 2, H / 2 + 160, w, 66, 33, '#ffffff');
    text(s, W / 2, H / 2 + 194, 28, 600, '#000', 'center');
  }, { dy: 20 });
  const out = seg(t, DURATION - 0.7, DURATION);
  if (out > 0) { ctx.fillStyle = `rgba(0,0,0,${out})`; ctx.fillRect(0, 0, W, H); }
}

// [start, end, scene, transition into it, transition length]
const SCENES = [
  [0, b(16), sHook],
  [b(16), b(20), sRegulars, 'zoom', 0.6],
  [b(20), b(28), sStops, 'blur', 0.5],
  [b(28), b(32), sDark, 'fade', 0.4],
  [b(32), b(36), sMeet, 'fade', 0.3],
  [b(36), b(40), sReimagined, 'blur', 0.55],
  [b(40), b(44), sWhat, 'rise', 0.5],
  [b(44), b(48), sReveal, 'blur', 0.5],
  [b(48), b(52), sHealth, 'wipe', 0.6],
  [b(52), b(58), sAnalyst, 'zoom', 0.6],
  [b(58), b(64), sWinBack, 'rise', 0.5],
  [b(64), b(72), sCalendar, 'blur', 0.55],
  [b(72), b(80), sReviews, 'push', 0.6],
  [b(80), b(92), sDashboard, 'wipe', 0.6],
  [b(92), b(96), sTagline, 'blur', 0.6],
  [b(96), DURATION + 1, sEnd, 'fade', 0.5],
];

function renderFrame(t) {
  ctx = MAIN;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = 1; ctx.filter = 'none'; ctx.globalCompositeOperation = 'source-over';
  const i = Math.max(0, SCENES.findIndex(([s, e]) => t >= s && t < e));
  const [start, , fn, type, dur] = SCENES[i];
  if (i > 0 && type && t < start + dur) {
    const A = renderInto(0, SCENES[i - 1][2], t), B = renderInto(1, fn, t);
    ctx = MAIN; transition(type, (t - start) / dur, A, B);
  } else fn(t);
}

window.DURATION = DURATION;
window.renderFrame = renderFrame;
window.ready = (async () => {
  MAIN = document.getElementById('c').getContext('2d');
  ctx = MAIN;
  await Promise.all(['400', '500', '600', '700', '800'].map((w) => document.fonts.load(`${w} 40px ${FONT}`)));
  LOGO = await new Promise((res) => { const im = new Image(); im.onload = () => res(im); im.onerror = () => res(null); im.src = BRAND.logoFile; });
  if (location.search.includes('render')) document.body.classList.add('render');
  renderFrame(0);
  return true;
})();

// ── player (plays the track in sync) ─────────────────────────────────────────
(() => {
  const btn = document.getElementById('play'), seek = document.getElementById('seek'), tm = document.getElementById('time'), au = document.getElementById('track');
  let playing = false, cur = 0;
  const show = (t) => { cur = t; renderFrame(t); seek.value = (t / DURATION) * 1000; tm.textContent = `${t.toFixed(1)}s / ${DURATION}s`; };
  const loop = () => {
    if (!playing) return;
    const t = au.currentTime;
    if (t >= DURATION || au.ended) { playing = false; btn.textContent = 'Replay'; show(DURATION); return; }
    show(t);
    requestAnimationFrame(loop);
  };
  btn.onclick = () => {
    if (playing) { playing = false; au.pause(); btn.textContent = 'Play'; return; }
    if (cur >= DURATION) cur = 0;
    au.currentTime = cur; au.play(); playing = true; btn.textContent = 'Pause'; requestAnimationFrame(loop);
  };
  seek.oninput = () => { playing = false; au.pause(); btn.textContent = 'Play'; show((seek.value / 1000) * DURATION); };
  window.ready.then(() => { const q = new URLSearchParams(location.search).get('t'); if (q) show(+q); });
})();
