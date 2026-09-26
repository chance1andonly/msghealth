// Clay rendering engine: shading, texture, stop-motion "boil", camera, grading.
'use strict';

const W = 1920, H = 1080;
const FPS = 24;       // output frame rate
const POSE_FPS = 12;  // stop-motion: characters/objects are animated "on twos"

let ctx = null;       // current drawing context (swapped for offscreen layers)
let MAIN = null;      // main canvas context
let POSE = 0;         // current stop-motion pose index
let CAMZ = 1;         // current camera zoom (for shadow scaling)
let CALL = 0;         // per-frame object counter, drives per-object boil jitter

// ── math ─────────────────────────────────────────────────────────────────────
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const seg = (t, a, b) => clamp((t - a) / (b - a));
const hash = (n) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
const ease = {
  io: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  out: (t) => 1 - Math.pow(1 - t, 3),
  in: (t) => t * t * t,
  sine: (t) => -(Math.cos(Math.PI * t) - 1) / 2,
  back: (t) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
  elastic: (t) => (t === 0 || t === 1 ? t : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * (2 * Math.PI) / 3) + 1),
};
// Stop-motion time: quantise to pose rate so motion steps like real clay.
const sm = (t) => Math.floor(t * POSE_FPS + 1e-6) / POSE_FPS;
// Squash & stretch pop: 0 → overshoot → settle.
const pop = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : ease.back(t));

// ── colour ───────────────────────────────────────────────────────────────────
function rgb(hex) {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function mix(a, b, t) {
  const A = rgb(a), B = rgb(b);
  const c = A.map((v, i) => Math.round(lerp(v, B[i], clamp(t))));
  return '#' + c.map((v) => v.toString(16).padStart(2, '0')).join('');
}
const shade = (c, amt) => (amt >= 0 ? mix(c, '#fff8ee', amt) : mix(c, '#1a0f08', -amt));
const rgba = (hex, a) => { const [r, g, b] = rgb(hex); return `rgba(${r},${g},${b},${a})`; };

// ── textures ─────────────────────────────────────────────────────────────────
let TEX = null, GRAIN = [];
function makeTextures() {
  // seeded so every render worker produces identical clay textures
  let sd = 1234567;
  const Math = Object.create(globalThis.Math);
  Math.random = () => ((sd = (sd * 16807) % 2147483647) / 2147483647);
  // Clay surface: mottled noise + fingerprint-like arcs + tool marks.
  const tc = document.createElement('canvas'); tc.width = tc.height = 512;
  const t = tc.getContext('2d');
  t.fillStyle = '#808080'; t.fillRect(0, 0, 512, 512);
  const img = t.getImageData(0, 0, 512, 512);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = 128 + (Math.random() - 0.5) * 38;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
  }
  t.putImageData(img, 0, 0);
  for (let k = 0; k < 90; k++) { // soft mottling
    const x = Math.random() * 512, y = Math.random() * 512, r = 10 + Math.random() * 50;
    const g = t.createRadialGradient(x, y, 0, x, y, r);
    const v = Math.random() < 0.5 ? 0 : 255;
    g.addColorStop(0, `rgba(${v},${v},${v},0.10)`); g.addColorStop(1, `rgba(${v},${v},${v},0)`);
    t.fillStyle = g; t.fillRect(x - r, y - r, r * 2, r * 2);
  }
  for (let k = 0; k < 14; k++) { // fingerprints
    const x = Math.random() * 512, y = Math.random() * 512, rot = Math.random() * 6.28;
    t.save(); t.translate(x, y); t.rotate(rot);
    for (let r = 3; r < 26; r += 3.2) {
      t.beginPath(); t.ellipse(0, 0, r * 1.3, r, 0, 0.3, Math.PI * 1.7);
      t.strokeStyle = 'rgba(40,40,40,0.10)'; t.lineWidth = 1.1; t.stroke();
      t.beginPath(); t.ellipse(0.8, 0.8, r * 1.3, r, 0, 0.3, Math.PI * 1.7);
      t.strokeStyle = 'rgba(255,255,255,0.08)'; t.stroke();
    }
    t.restore();
  }
  for (let k = 0; k < 40; k++) { // sculpting tool drags
    const x = Math.random() * 512, y = Math.random() * 512, a = Math.random() * 6.28, l = 20 + Math.random() * 60;
    t.beginPath(); t.moveTo(x, y); t.quadraticCurveTo(x + Math.cos(a) * l * 0.5 + 8, y + Math.sin(a) * l * 0.5, x + Math.cos(a) * l, y + Math.sin(a) * l);
    t.strokeStyle = 'rgba(30,30,30,0.07)'; t.lineWidth = 1.5; t.stroke();
  }
  TEX = tc;
  for (let k = 0; k < 4; k++) { // film grain frames
    const g = document.createElement('canvas'); g.width = 480; g.height = 270;
    const gc = g.getContext('2d'); const im = gc.createImageData(480, 270);
    for (let i = 0; i < im.data.length; i += 4) {
      const v = 128 + (Math.random() - 0.5) * 90;
      im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255;
    }
    gc.putImageData(im, 0, 0); GRAIN.push(g);
  }
}
let TEXPAT = null;

// ── paths ────────────────────────────────────────────────────────────────────
const P = {
  rr: (x, y, w, h, r) => (c) => { c.beginPath(); c.roundRect(x, y, w, h, Math.min(r, w / 2, h / 2)); },
  ell: (cx, cy, rx, ry, rot = 0) => (c) => { c.beginPath(); c.ellipse(cx, cy, Math.abs(rx), Math.abs(ry), rot, 0, Math.PI * 2); },
  circ: (cx, cy, r) => (c) => { c.beginPath(); c.arc(cx, cy, Math.abs(r), 0, Math.PI * 2); },
  // Hand-made organic blob; wobble re-seeds with each pose to "boil".
  blob: (cx, cy, rx, ry, wob = 0.06, seed = 1, n = 9, boil = true) => (c) => {
    const pts = [];
    const s = seed * 17.3 + (boil ? POSE * 0.37 : 0);
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      const k = 1 + (hash(s + i * 3.1) - 0.5) * 2 * wob;
      pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
    }
    smoothClosed(c, pts);
  },
  poly: (pts, smooth = false) => (c) => {
    if (smooth) return smoothClosed(c, pts);
    c.beginPath(); c.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]);
    c.closePath();
  },
  // Rounded capsule between two points (limbs).
  cap: (x1, y1, x2, y2, r1, r2 = r1) => (c) => {
    const a = Math.atan2(y2 - y1, x2 - x1);
    c.beginPath();
    c.arc(x1, y1, r1, a + Math.PI / 2, a - Math.PI / 2);
    c.arc(x2, y2, r2, a - Math.PI / 2, a + Math.PI / 2);
    c.closePath();
  },
};
function smoothClosed(c, pts) {
  const n = pts.length;
  c.beginPath();
  const mid = (i) => [(pts[i % n][0] + pts[(i + 1) % n][0]) / 2, (pts[i % n][1] + pts[(i + 1) % n][1]) / 2];
  const m0 = mid(0); c.moveTo(m0[0], m0[1]);
  for (let i = 1; i <= n; i++) { const m = mid(i); c.quadraticCurveTo(pts[i % n][0], pts[i % n][1], m[0], m[1]); }
  c.closePath();
}

// ── the clay material ────────────────────────────────────────────────────────
// path: fn(ctx) that builds the path. bb: {x,y,w,h} bounds for shading.
function clay(path, color, bb, o = {}) {
  const c = ctx;
  const id = CALL++;
  const j = o.still ? 0 : (o.jit ?? 0.9);
  const jx = (hash(POSE * 13.1 + id * 7.7) - 0.5) * j, jy = (hash(POSE * 5.3 + id * 3.9) - 0.5) * j;
  c.save();
  c.translate(jx, jy);
  const sh = o.shadow ?? 12;
  if (sh > 0) {
    c.shadowColor = `rgba(45,25,10,${o.shadowA ?? 0.33})`;
    c.shadowBlur = sh * CAMZ;
    c.shadowOffsetX = sh * 0.25 * CAMZ;
    c.shadowOffsetY = sh * 0.55 * CAMZ;
  }
  path(c);
  c.fillStyle = color; c.fill();
  c.shadowColor = 'transparent';
  if (o.flat) { c.restore(); return; }
  c.clip();
  const { x, y, w, h } = bb;
  const m = Math.max(w, h);
  // key light from top-left, falloff bottom-right
  const g = c.createLinearGradient(x, y, x + w * 0.55, y + h);
  g.addColorStop(0, `rgba(255,246,228,${0.30 * (o.light ?? 1)})`);
  g.addColorStop(0.45, 'rgba(255,255,255,0)');
  g.addColorStop(1, `rgba(35,18,6,${0.30 * (o.dark ?? 1)})`);
  c.fillStyle = g; c.fillRect(x - 4, y - 4, w + 8, h + 8);
  // soft specular bloom (clay is matte-ish with a waxy sheen)
  const hx = x + w * 0.3, hy = y + h * 0.24;
  const r = Math.min(w, h) * 0.55 + 2;
  const s = c.createRadialGradient(hx, hy, 0, hx, hy, r);
  s.addColorStop(0, `rgba(255,255,255,${0.22 * (o.gloss ?? 1)})`); s.addColorStop(1, 'rgba(255,255,255,0)');
  c.fillStyle = s; c.fillRect(x - 4, y - 4, w + 8, h + 8);
  // rolled edge: darken inside the silhouette border
  path(c);
  const ew = Math.max(2, Math.min(w, h) * 0.09);
  c.lineWidth = ew * 2; c.strokeStyle = 'rgba(40,20,8,0.10)'; c.stroke();
  c.lineWidth = ew; c.strokeStyle = 'rgba(40,20,8,0.08)'; c.stroke();
  // clay surface texture (fingerprints, mottling)
  if (o.tex !== 0) {
    c.globalCompositeOperation = 'soft-light';
    c.globalAlpha = o.tex ?? 0.85;
    const sc = o.texScale ?? clamp(m / 380, 0.25, 2.2);
    const ox = hash(id * 1.3) * 512, oy = hash(id * 2.9) * 512;
    TEXPAT.setTransform(new DOMMatrix().translate(x - ox * sc, y - oy * sc).scale(sc));
    c.fillStyle = TEXPAT; c.fillRect(x - 4, y - 4, w + 8, h + 8);
  }
  c.restore();
}

// Convenience wrappers ----------------------------------------------------------
function cRect(x, y, w, h, r, color, o) { clay(P.rr(x, y, w, h, r), color, { x, y, w, h }, o); }
function cEll(cx, cy, rx, ry, color, o) { clay(P.ell(cx, cy, rx, ry), color, { x: cx - rx, y: cy - ry, w: rx * 2, h: ry * 2 }, o); }
function cBlob(cx, cy, rx, ry, color, o = {}) {
  clay(P.blob(cx, cy, rx, ry, o.wob ?? 0.05, o.seed ?? 1, o.n ?? 9, o.boil ?? true), color, { x: cx - rx, y: cy - ry, w: rx * 2, h: ry * 2 }, o);
}
function cCap(x1, y1, x2, y2, r, color, o) {
  clay(P.cap(x1, y1, x2, y2, r), color, { x: Math.min(x1, x2) - r, y: Math.min(y1, y2) - r, w: Math.abs(x2 - x1) + 2 * r, h: Math.abs(y2 - y1) + 2 * r }, o);
}

// Embossed clay lettering.
const FONT = { ui: 'Nunito', title: 'Fraunces' };
function cText(str, x, y, size, color, o = {}) {
  const c = ctx;
  c.save();
  c.font = `${o.weight ?? 800} ${size}px ${o.font ?? FONT.ui}`;
  c.textAlign = o.align ?? 'left';
  c.textBaseline = o.base ?? 'alphabetic';
  if (o.alpha != null) c.globalAlpha = o.alpha;
  if (o.emboss !== false) {
    c.fillStyle = 'rgba(40,20,8,0.22)'; c.fillText(str, x + size * 0.03, y + size * 0.05);
    c.fillStyle = 'rgba(255,250,240,0.35)'; c.fillText(str, x - size * 0.015, y - size * 0.02);
  }
  c.fillStyle = color; c.fillText(str, x, y);
  c.restore();
}
function textW(str, size, weight = 800, font = FONT.ui) {
  ctx.save(); ctx.font = `${weight} ${size}px ${font}`; const w = ctx.measureText(str).width; ctx.restore(); return w;
}

// Warm light pool / glow (additive).
function glow(x, y, r, color, a = 0.5) {
  const c = ctx; c.save(); c.globalCompositeOperation = 'screen';
  const g = c.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, rgba(color, a)); g.addColorStop(1, rgba(color, 0));
  c.fillStyle = g; c.fillRect(x - r, y - r, r * 2, r * 2); c.restore();
}
// Soft contact shadow on a surface.
function contact(x, y, rx, ry, a = 0.28) {
  const c = ctx; c.save();
  const g = c.createRadialGradient(x, y, 0, x, y, rx);
  g.addColorStop(0, `rgba(40,20,5,${a})`); g.addColorStop(1, 'rgba(40,20,5,0)');
  c.translate(x, y); c.scale(1, ry / rx); c.translate(-x, -y);
  c.fillStyle = g; c.fillRect(x - rx, y - rx, rx * 2, rx * 2); c.restore();
}

// ── camera ───────────────────────────────────────────────────────────────────
// Camera centres world point (x,y) on screen at zoom z, with optional roll.
function camera(x, y, z, roll = 0) {
  CAMZ = z;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.translate(W / 2, H / 2);
  ctx.rotate(roll);
  ctx.scale(z, z);
  ctx.translate(-x, -y);
}
function screenSpace() { CAMZ = 1; ctx.setTransform(1, 0, 0, 1, 0, 0); }
// Interpolate between camera keys [{t,x,y,z}] with easing.
function camPath(keys, t) {
  if (t <= keys[0].t) return keys[0];
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i], b = keys[i + 1];
    if (t <= b.t) {
      const k = (b.e ?? ease.io)((t - a.t) / (b.t - a.t));
      // zoom interpolated in log space so push-ins feel linear
      return { x: lerp(a.x, b.x, k), y: lerp(a.y, b.y, k), z: Math.exp(lerp(Math.log(a.z), Math.log(b.z), k)), r: lerp(a.r ?? 0, b.r ?? 0, k) };
    }
  }
  return keys[keys.length - 1];
}

// ── layers (depth of field) ──────────────────────────────────────────────────
const LAYERS = [];
function layer(i) {
  if (!LAYERS[i]) { const cv = document.createElement('canvas'); cv.width = W; cv.height = H; LAYERS[i] = cv.getContext('2d'); }
  return LAYERS[i];
}
// Draw fn into an offscreen layer then composite with blur/alpha.
function withLayer(i, fn, { blur = 0, alpha = 1, op = 'source-over' } = {}) {
  const L = layer(i);
  L.setTransform(1, 0, 0, 1, 0, 0); L.clearRect(0, 0, W, H);
  const prev = ctx; const tr = prev.getTransform();
  ctx = L; ctx.setTransform(tr);
  fn();
  ctx = prev;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (blur > 0.3) ctx.filter = `blur(${blur}px)`;
  ctx.globalAlpha = alpha; ctx.globalCompositeOperation = op;
  ctx.drawImage(L.canvas, 0, 0);
  ctx.restore();
}

// ── finishing ────────────────────────────────────────────────────────────────
function grade({ warm = 0.1, cool = 0, dark = 0, vignette = 0.45 } = {}) {
  const c = ctx; screenSpace();
  c.save();
  if (warm > 0) { c.globalCompositeOperation = 'soft-light'; c.fillStyle = `rgba(255,170,90,${warm})`; c.fillRect(0, 0, W, H); }
  if (cool > 0) { c.globalCompositeOperation = 'soft-light'; c.fillStyle = `rgba(60,110,190,${cool})`; c.fillRect(0, 0, W, H); }
  if (dark > 0) { c.globalCompositeOperation = 'multiply'; c.fillStyle = `rgba(90,95,120,${dark})`; c.fillRect(0, 0, W, H); }
  c.globalCompositeOperation = 'multiply';
  const g = c.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, H * 1.05);
  g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(1, `rgba(40,25,15,${vignette})`);
  c.fillStyle = g; c.fillRect(0, 0, W, H);
  // film grain
  c.globalCompositeOperation = 'overlay'; c.globalAlpha = 0.07;
  c.imageSmoothingEnabled = true;
  c.drawImage(GRAIN[POSE % GRAIN.length], 0, 0, W, H);
  c.restore();
}
function letterbox(a = 1) {
  screenSpace(); const bar = 62 * a;
  ctx.fillStyle = '#0b0906'; ctx.fillRect(0, 0, W, bar); ctx.fillRect(0, H - bar, W, bar);
}
function fadeBlack(a) { if (a <= 0) return; screenSpace(); ctx.fillStyle = `rgba(10,8,6,${clamp(a)})`; ctx.fillRect(0, 0, W, H); }

// Story caption (lower third).
function caption(str, t, a, b, { y = H - 150, size = 46, sub = null } = {}) {
  const k = Math.min(seg(t, a, a + 0.5), 1 - seg(t, b - 0.5, b));
  if (k <= 0) return;
  screenSpace();
  const c = ctx; c.save();
  c.globalAlpha = ease.out(k) * 0.55;
  const sg = c.createLinearGradient(0, y - size * 2.2, 0, y + size * (sub ? 2.6 : 1.8));
  sg.addColorStop(0, 'rgba(12,8,5,0)'); sg.addColorStop(0.5, 'rgba(12,8,5,0.75)'); sg.addColorStop(1, 'rgba(12,8,5,0)');
  c.fillStyle = sg; c.fillRect(0, y - size * 2.2, W, size * (sub ? 4.8 : 4));
  c.globalAlpha = ease.out(k);
  const dy = (1 - ease.out(k)) * 14;
  c.font = `800 ${size}px ${FONT.ui}`; c.textAlign = 'center'; c.textBaseline = 'middle';
  c.shadowColor = 'rgba(0,0,0,0.55)'; c.shadowBlur = 24; c.shadowOffsetY = 3;
  c.fillStyle = '#fffaf2'; c.fillText(str, W / 2, y + dy);
  if (sub) { c.font = `700 ${size * 0.62}px ${FONT.ui}`; c.fillStyle = 'rgba(255,245,230,0.9)'; c.fillText(sub, W / 2, y + dy + size * 1.05); }
  c.restore();
}
