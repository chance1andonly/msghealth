// ─────────────────────────────────────────────────────────────────────────────
// MsgHealth product demo — motion-graphics engine
//
// A small, deterministic 2D toolkit: every frame is a pure function of time t,
// so the browser player, stills and the final render all match exactly.
// Easing, kinetic type, the HUD frame, icons, the logo and the finishing pass.
// ─────────────────────────────────────────────────────────────────────────────
'use strict';

// a page can set window.FILM_DURATION before loading this file to host a different cut
const W = 1920, H = 1080, FPS = 60, DURATION = window.FILM_DURATION ?? 47;
let ctx = null;
let LOGO = null, LOGO_WHITE = null;

// ── palette ──────────────────────────────────────────────────────────────────
const C = {
  ink: '#0b0b14',
  night: '#14123a',      // deep indigo field
  cream: '#f2efe8',
  indigo: BRAND.colors.primary,
  indigoL: '#8b85ff',    // indigo lifted for dark backgrounds
  lime: '#d4ff3f',
  coral: '#ff5b3a',
  pink: '#ff5fa8',
  healthy: BRAND.colors.healthy,
  attention: BRAND.colors.attention,
  risk: BRAND.colors.risk,
  text: '#17162b',
  muted: '#7b7894',
  white: '#ffffff',
};
const F = { sans: 'Inter', serif: 'Instrument Serif', mono: 'JetBrains Mono' };

// ── maths & easing ───────────────────────────────────────────────────────────
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, k) => a + (b - a) * k;
const prog = (t, a, b) => clamp((t - a) / (b - a));
const ease = {
  linear: (x) => x,
  inQuad: (x) => x * x,
  outQuad: (x) => 1 - (1 - x) * (1 - x),
  inCubic: (x) => x * x * x,
  outCubic: (x) => 1 - (1 - x) ** 3,
  inOutCubic: (x) => (x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2),
  outQuart: (x) => 1 - (1 - x) ** 4,
  inOutQuart: (x) => (x < 0.5 ? 8 * x ** 4 : 1 - (-2 * x + 2) ** 4 / 2),
  outExpo: (x) => (x >= 1 ? 1 : 1 - 2 ** (-10 * x)),
  inExpo: (x) => (x <= 0 ? 0 : 2 ** (10 * x - 10)),
  inOutExpo: (x) => (x <= 0 ? 0 : x >= 1 ? 1 : x < 0.5 ? 2 ** (20 * x - 10) / 2 : (2 - 2 ** (-20 * x + 10)) / 2),
  outBack: (x, s = 1.70158) => 1 + (s + 1) * (x - 1) ** 3 + s * (x - 1) ** 2,
  inBack: (x, s = 1.70158) => (s + 1) * x ** 3 - s * x * x,
  // damped spring that settles on 1 — for pops that wobble once
  spring: (x) => (x <= 0 ? 0 : x >= 1 ? 1 : 1 - Math.exp(-6 * x) * Math.cos(x * 11)),
};
// value from a → b between t0 and t1
const tw = (t, t0, t1, a, b, e = ease.outCubic) => lerp(a, b, e(prog(t, t0, t1)));
// 0 → 1 → 0 envelope: fade in over [a,b], hold, fade out over [c,d]
const env = (t, a, b, c, d) => Math.min(prog(t, a, b), 1 - prog(t, c, d));

let SEED = 1;
const srand = (s) => { SEED = s; };
const rnd = () => ((SEED = (SEED * 16807) % 2147483647) / 2147483647);

// ── colour ───────────────────────────────────────────────────────────────────
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const rgba = (h, a = 1) => { const [r, g, b] = hex(h); return `rgba(${r},${g},${b},${a})`; };
const mix = (a, b, k) => { const x = hex(a), y = hex(b); return `rgb(${x.map((v, i) => Math.round(lerp(v, y[i], clamp(k)))).join(',')})`; };
const scoreColor = (s) => (s >= 70 ? C.healthy : s >= 50 ? C.attention : C.risk);
// smooth colour that slides through amber on the way from green to red
const scoreTint = (s) => (s >= 70 ? C.healthy : s >= 55 ? mix(C.attention, C.healthy, (s - 55) / 15) : s >= 45 ? mix(C.risk, C.attention, (s - 45) / 10) : C.risk);
const scoreStatus = (s) => (s >= 70 ? 'HEALTHY' : s >= 50 ? 'NEEDS ATTENTION' : 'AT RISK');

// ── type ─────────────────────────────────────────────────────────────────────
function font(size, weight = 400, fam = F.sans, style = 'normal') {
  ctx.font = `${style} ${weight} ${size}px "${fam}"`;
}
function style(o) {
  font(o.size ?? 32, o.weight ?? 400, o.fam ?? F.sans, o.style ?? 'normal');
  ctx.letterSpacing = `${o.ls ?? 0}px`;
  ctx.textAlign = o.align ?? 'left';
  ctx.textBaseline = o.base ?? 'alphabetic';
}
function measure(s, o = {}) {
  ctx.save(); style({ ...o, align: 'left' });
  const w = ctx.measureText(s).width - (o.ls ?? 0); // canvas adds tracking after the last glyph too
  ctx.restore();
  return w;
}
function txt(s, x, y, o = {}) {
  const a = o.alpha ?? 1;
  if (a <= 0.001) return;
  ctx.save();
  style(o);
  ctx.globalAlpha *= a;
  ctx.fillStyle = o.color ?? C.white;
  ctx.fillText(s, x, y);
  if (window.TEXT_LOG) logText(s, x, y, o);
  ctx.restore();
}
// Records where each string lands on screen, for scripts/audit-text.mjs.
function logText(s, x, y, o) {
  const m = ctx.measureText(s);
  const x0 = x - m.actualBoundingBoxLeft, x1 = x + m.actualBoundingBoxRight;
  const y0 = y - m.actualBoundingBoxAscent, y1 = y + m.actualBoundingBoxDescent;
  const T = ctx.getTransform();
  const pts = [[x0, y0], [x1, y0], [x0, y1], [x1, y1]].map(([px, py]) => [T.a * px + T.c * py + T.e, T.b * px + T.d * py + T.f]);
  window.TEXT_LOG.push({
    str: s, a: ctx.globalAlpha, layer: 'main', kind: o.kind,
    x0: Math.min(...pts.map((p) => p[0])), x1: Math.max(...pts.map((p) => p[0])),
    y0: Math.min(...pts.map((p) => p[1])), y1: Math.max(...pts.map((p) => p[1])),
  });
}
// Per-letter layout for kinetic type: calls fn(ch, i, x) with each glyph's left edge.
function eachLetter(s, x, o, fn) {
  ctx.save(); style({ ...o, align: 'left' });
  const xs = [...s].map((_, i) => ctx.measureText(s.slice(0, i)).width);
  ctx.restore();
  [...s].forEach((ch, i) => fn(ch, i, x + xs[i]));
}
// Letters rise into place from behind a baseline mask.
function riseText(s, x, y, o, t, t0, stagger = 0.04, dur = 0.6, drop = null) {
  const h = (o.size ?? 32) * 1.1;
  ctx.save();
  ctx.beginPath(); ctx.rect(-W, y - h * 1.05, W * 3, h * 1.3); ctx.clip();
  eachLetter(s, x, o, (ch, i, lx) => {
    const k = ease.outExpo(prog(t, t0 + i * stagger, t0 + i * stagger + dur));
    if (k <= 0) return;
    txt(ch, lx, y + (1 - k) * (drop ?? h), { ...o, align: 'left' });
  });
  ctx.restore();
}

// ── shapes ───────────────────────────────────────────────────────────────────
function rrect(x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, Math.max(0, Math.min(r, w / 2, h / 2))); }
function card(x, y, w, h, r, fill, o = {}) {
  ctx.save();
  if (o.shadow !== false) {
    ctx.shadowColor = o.shadowColor ?? 'rgba(30,27,75,0.13)';
    ctx.shadowBlur = o.blur ?? 48; ctx.shadowOffsetY = o.dy ?? 20;
  }
  rrect(x, y, w, h, r); ctx.fillStyle = fill; ctx.fill();
  ctx.restore();
  if (o.stroke) { ctx.save(); rrect(x, y, w, h, r); ctx.strokeStyle = o.stroke; ctx.lineWidth = o.lw ?? 1.5; ctx.stroke(); ctx.restore(); }
}
function circle(x, y, r, fill) { ctx.beginPath(); ctx.arc(x, y, Math.max(0, r), 0, Math.PI * 2); ctx.fillStyle = fill; ctx.fill(); }
function ring(x, y, r, lw, color, a0 = -Math.PI / 2, sweep = Math.PI * 2, cap = 'round') {
  if (sweep <= 0.0001) return;
  ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, a0, a0 + sweep);
  ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.lineCap = cap; ctx.stroke(); ctx.restore();
}
function line(x0, y0, x1, y1, color, lw = 2) {
  ctx.save(); ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1);
  ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.stroke(); ctx.restore();
}
function glow(x, y, r, color, a) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, rgba(color, a)); g.addColorStop(1, rgba(color, 0));
  ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2);
}
// apply a uniform scale around a point for everything drawn inside fn
function around(x, y, s, fn, rot = 0) {
  ctx.save(); ctx.translate(x, y); if (rot) ctx.rotate(rot); ctx.scale(s, s); ctx.translate(-x, -y); fn(); ctx.restore();
}
function fade(a, fn) { if (a <= 0.001) return; ctx.save(); ctx.globalAlpha *= clamp(a); fn(); ctx.restore(); }

// ── icons (line glyphs on a 100-unit grid, centred on x,y) ───────────────────
function icon(name, x, y, size, color, lw = 7) {
  ctx.save();
  ctx.translate(x, y); ctx.scale(size / 100, size / 100); ctx.translate(-50, -50);
  ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const P = new Path2D();
  switch (name) {
    case 'chat': P.roundRect(12, 18, 76, 52, 16); P.moveTo(30, 70); P.lineTo(24, 86); P.lineTo(46, 70); ctx.stroke(P);
      [34, 50, 66].forEach((cx) => { ctx.beginPath(); ctx.arc(cx, 44, 4.5, 0, 7); ctx.fill(); }); break;
    case 'calendar': P.roundRect(14, 20, 72, 66, 12); P.moveTo(14, 40); P.lineTo(86, 40); P.moveTo(34, 12); P.lineTo(34, 26); P.moveTo(66, 12); P.lineTo(66, 26);
      ctx.stroke(P); ctx.beginPath(); ctx.moveTo(36, 62); ctx.lineTo(46, 71); ctx.lineTo(65, 52); ctx.stroke(); break;
    case 'star': { ctx.beginPath(); for (let i = 0; i < 10; i++) { const r = i % 2 ? 19 : 42, a = -Math.PI / 2 + (i * Math.PI) / 5; ctx.lineTo(50 + r * Math.cos(a), 52 + r * Math.sin(a)); } ctx.closePath(); ctx.fill(); break; }
    case 'heart': ctx.beginPath(); ctx.moveTo(50, 84); ctx.bezierCurveTo(10, 58, 8, 30, 28, 22); ctx.bezierCurveTo(40, 17, 48, 26, 50, 32);
      ctx.bezierCurveTo(52, 26, 60, 17, 72, 22); ctx.bezierCurveTo(92, 30, 90, 58, 50, 84); ctx.closePath(); ctx.fill(); break;
    case 'card': P.roundRect(10, 24, 80, 54, 10); P.moveTo(10, 42); P.lineTo(90, 42); P.moveTo(24, 62); P.lineTo(42, 62); ctx.stroke(P); break;
    case 'bars': [[18, 58], [40, 40], [62, 24]].forEach(([bx, by]) => { ctx.beginPath(); ctx.roundRect(bx, by, 16, 84 - by, 4); ctx.fill(); });
      ctx.beginPath(); ctx.moveTo(12, 88); ctx.lineTo(88, 88); ctx.stroke(); break;
    case 'bolt': ctx.beginPath(); ctx.moveTo(56, 8); ctx.lineTo(22, 56); ctx.lineTo(48, 56); ctx.lineTo(42, 92); ctx.lineTo(78, 42); ctx.lineTo(52, 42); ctx.closePath(); ctx.fill(); break;
    case 'sms': P.roundRect(14, 20, 72, 50, 14); P.moveTo(32, 70); P.lineTo(30, 84); P.lineTo(48, 70); ctx.stroke(P);
      ctx.beginPath(); ctx.moveTo(30, 40); ctx.lineTo(70, 40); ctx.moveTo(30, 52); ctx.lineTo(56, 52); ctx.stroke(); break;
    case 'clock': ctx.beginPath(); ctx.arc(50, 50, 36, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.moveTo(50, 30); ctx.lineTo(50, 50); ctx.lineTo(64, 60); ctx.stroke(); break;
    case 'mail': P.roundRect(12, 24, 76, 54, 10); P.moveTo(14, 28); P.lineTo(50, 54); P.lineTo(86, 28); ctx.stroke(P); break;
    case 'check': ctx.beginPath(); ctx.moveTo(26, 52); ctx.lineTo(43, 68); ctx.lineTo(75, 34); ctx.stroke(); break;
    case 'alert': ctx.beginPath(); ctx.moveTo(50, 26); ctx.lineTo(50, 56); ctx.stroke(); ctx.beginPath(); ctx.arc(50, 74, 5, 0, 7); ctx.fill(); break;
    case 'down': ctx.beginPath(); ctx.moveTo(22, 30); ctx.lineTo(46, 54); ctx.lineTo(58, 42); ctx.lineTo(80, 66); ctx.moveTo(62, 68); ctx.lineTo(80, 68); ctx.lineTo(80, 50); ctx.stroke(); break;
    case 'arrow': ctx.beginPath(); ctx.moveTo(18, 50); ctx.lineTo(80, 50); ctx.moveTo(58, 28); ctx.lineTo(80, 50); ctx.lineTo(58, 72); ctx.stroke(); break;
  }
  ctx.restore();
}

// ── logo ─────────────────────────────────────────────────────────────────────
function makeLogos(img) {
  LOGO = img;
  const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
  const g = c.getContext('2d');
  g.drawImage(img, 0, 0); g.globalCompositeOperation = 'source-in'; g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height);
  LOGO_WHITE = c;
}
// the mark alone (the PNG has ~13% padding, so draw it a little larger than `size`)
function logoMark(x, y, size, white = true) {
  const img = white ? LOGO_WHITE : LOGO;
  if (!img) return;
  const s = size * 1.18;
  ctx.drawImage(img, x - s / 2, y - s / 2, s, s);
}
// indigo squircle tile with the white mark
function logoTile(x, y, size, a = 1, corner = 0.225) {
  fade(a, () => {
    rrect(x - size / 2, y - size / 2, size, size, size * corner);
    ctx.fillStyle = C.indigo; ctx.fill();
    logoMark(x, y, size * 0.62);
  });
}

// ── HUD frame (corner brackets, slate, timecode, bar counter) ────────────────
function hud(t, tone, label, bar, bars, a = 1) {
  if (a <= 0) return;
  const col = tone === 'dark' ? 'rgba(242,239,232,0.6)' : 'rgba(11,11,20,0.62)';
  const m = 34, L = 26;
  ctx.save(); ctx.globalAlpha = a;
  ctx.strokeStyle = col; ctx.lineWidth = 2;
  [[m, m, 1, 1], [W - m, m, -1, 1], [m, H - m, 1, -1], [W - m, H - m, -1, -1]].forEach(([x, y, sx, sy]) => {
    ctx.beginPath(); ctx.moveTo(x, y + sy * L); ctx.lineTo(x, y); ctx.lineTo(x + sx * L, y); ctx.stroke();
  });
  const o = { size: 15, weight: 500, fam: F.mono, ls: 2, color: col, kind: 'hud' };
  circle(70, 66, 4.5, C.coral);
  txt("MSGHEALTH / PRODUCT FILM '26", 84, 71, o);
  const f = Math.floor(t * FPS + 1e-6), ss = Math.floor(f / FPS), ff = f % FPS;
  txt(`TC 00:00:${String(ss).padStart(2, '0')}:${String(ff).padStart(2, '0')}`, W - 66, 71, { ...o, align: 'right' });
  txt(label, 66, H - 56, o);
  const sq = 10, gap = 5, x1 = W - 66, x0 = x1 - bars * (sq + gap) + gap;
  for (let i = 0; i < bars; i++) {
    const x = x0 + i * (sq + gap), y = H - 56 - 11;
    ctx.beginPath(); ctx.rect(x + 0.5, y + 0.5, sq - 1, sq - 1);
    if (i < bar) { ctx.fillStyle = col; ctx.fill(); } else { ctx.strokeStyle = col; ctx.lineWidth = 1.2; ctx.stroke(); }
  }
  txt(`BAR ${String(bar).padStart(2, '0')}/${String(bars).padStart(2, '0')}`, x0 - 20, H - 56, { ...o, align: 'right' });
  ctx.restore();
}

// ── finishing: vignette + film grain ─────────────────────────────────────────
let GRAIN = [];
function makeGrain() {
  srand(77);
  GRAIN = [0, 1, 2, 3].map(() => {
    const c = document.createElement('canvas'); c.width = c.height = 256;
    const g = c.getContext('2d'), im = g.createImageData(256, 256);
    for (let i = 0; i < im.data.length; i += 4) { const v = 128 + (rnd() - 0.5) * 255; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255; }
    g.putImageData(im, 0, 0);
    return ctx.createPattern(c, 'repeat');
  });
}
function finish(t, vig) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const g = ctx.createRadialGradient(W / 2, H / 2, H * 0.32, W / 2, H / 2, H * 1.02);
  g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${vig})`);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const f = Math.floor(t * FPS + 1e-6);
  ctx.globalCompositeOperation = 'overlay'; ctx.globalAlpha = 0.07;
  ctx.translate(-((f * 97) % 256), -((f * 61) % 256));
  ctx.fillStyle = GRAIN[f % 4]; ctx.fillRect(0, 0, W + 512, H + 512);
  ctx.restore();
}
