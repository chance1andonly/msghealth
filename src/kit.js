// Shared kit for the "real story, absurd twist" vertical ads (qr.html, jet.html, shed.html): 1080 × 1920, 30 fps.
// Loaded before the ad's own script (and its src/<name>-vo.js), so everything declared here is global to them.
// Provides: maths, canvas primitives, flat-vector helpers, dark product-UI helpers, captions that follow the
// voiceover (black label, white caps, accent words), the end card, and boot(), which wires up renderFrame(t),
// window.ready, the text-audit hook and the browser player.
'use strict';

const W = 1080, H = 1920, CX = 540, FONT = 'Inter';
const C = BRAND.colors;
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
const rgba = (hex, a) => { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };
const mix = (a, b, k) => { const p = parseInt(a.slice(1), 16), q = parseInt(b.slice(1), 16), f = (s) => Math.round(lerp((p >> s) & 255, (q >> s) & 255, k)); return `rgb(${f(16)},${f(8)},${f(0)})`; };
const enter = (t, a, b, f = 0.2) => seg(t, a, a + f) * (1 - seg(t, b - f, b));

// ── primitives ───────────────────────────────────────────────────────────────
function rr(x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }
function fillRR(x, y, w, h, r, col) { rr(x, y, w, h, r); ctx.fillStyle = col; ctx.fill(); }
function strokeRR(x, y, w, h, r, col, lw = 2) { rr(x, y, w, h, r); ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.stroke(); }
function font(size, weight = 600, track = -0.02) { ctx.font = `${weight} ${size}px ${FONT}`; ctx.letterSpacing = `${(size * track).toFixed(2)}px`; }
function text(s, x, y, size, weight, color, align = 'left', track) {
  font(size, weight, track ?? (size >= 40 ? -0.03 : -0.005));
  ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.fillStyle = color; ctx.fillText(s, x, y);
}
function tw(s, size, weight = 600, track) { font(size, weight, track ?? (size >= 40 ? -0.03 : -0.005)); return ctx.measureText(s).width; }
function circle(x, y, r, col) { ctx.beginPath(); ctx.arc(x, y, Math.max(0, r), 0, Math.PI * 2); ctx.fillStyle = col; ctx.fill(); }
function ring(x, y, r, col, lw = 2) { ctx.beginPath(); ctx.arc(x, y, Math.max(0, r), 0, Math.PI * 2); ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.stroke(); }
function ellipse(x, y, rx, ry, col, rot = 0) { ctx.beginPath(); ctx.ellipse(x, y, Math.max(0, rx), Math.max(0, ry), rot, 0, Math.PI * 2); ctx.fillStyle = col; ctx.fill(); }
function line(x0, y0, x1, y1, col, lw = 2, cap = 'round') { ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.lineCap = cap; ctx.stroke(); }
function poly(pts, col) { ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.fillStyle = col; ctx.fill(); }
function glow(x, y, r, col, a) {
  if (a <= 0.003 || r <= 0) return;
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, rgba(col, a)); g.addColorStop(1, rgba(col, 0));
  ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2);
}
function vgrad(y0, y1, c0, c1) { const g = ctx.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, c0); g.addColorStop(1, c1); return g; }
function check(x, y, s, col = '#fff', lw = 4) {
  ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(x - s * 0.45, y); ctx.lineTo(x - s * 0.12, y + s * 0.34); ctx.lineTo(x + s * 0.5, y - s * 0.36); ctx.stroke();
}
function star(x, y, r, col) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 5, rad = i % 2 ? r * 0.42 : r; i ? ctx.lineTo(x + Math.cos(a) * rad, y + Math.sin(a) * rad) : ctx.moveTo(x + Math.cos(a) * rad, y + Math.sin(a) * rad); }
  ctx.closePath(); ctx.fillStyle = col; ctx.fill();
}
// Run fn with the canvas transformed: scale s about (px, py), then shifted by (dx, dy).
function xf(px, py, s, dx, fn, dy = 0, rot = 0) {
  ctx.save(); ctx.translate(px + dx, py + dy); ctx.rotate(rot); ctx.scale(s, s); ctx.translate(-px, -py); fn(); ctx.restore();
}
function withFade(a, fn) { if (a <= 0.003) return; ctx.save(); ctx.globalAlpha *= clamp(a); fn(); ctx.restore(); }
const pop = (t, at, d = 0.3) => ease.back(seg(t, at, at + d)); // 0 → 1 with overshoot
const shake = (t, at, amp = 14, d = 0.35) => { const k = 1 - seg(t, at, at + d); return t < at ? 0 : Math.sin((t - at) * 70) * amp * k * k; };

// ── flat-vector helpers ──────────────────────────────────────────────────────
const SKIN = ['#f1c7a5', '#e2a87f', '#c68a62', '#a86c48', '#8a5537', '#6b3f28'];
const HAIR = ['#2a1d17', '#3b2a20', '#1b1b1f', '#5a3c26', '#7a5a3a', '#2d2522'];
const SHIRT = ['#9fb39a', '#c9c3b5', '#e6e3dc', '#8ea2b8', '#b9a98f', '#d7c9b6', '#a7b7a1', '#7f93a8', '#cfb4a8', '#e08a6d', '#6c8ebf'];
const PANTS = ['#5c5f52', '#4b5060', '#6b6457', '#3d424f', '#575b4c'];
function cloud(x, y, s, col = '#ffffff') {
  ctx.fillStyle = col; ctx.beginPath();
  ctx.arc(x, y, 46 * s, 0, 7); ctx.arc(x + 54 * s, y - 20 * s, 56 * s, 0, 7); ctx.arc(x + 118 * s, y, 44 * s, 0, 7); ctx.rect(x, y - 2 * s, 118 * s, 44 * s);
  ctx.fill();
}
// A standing person, feet at (x, y), h tall. o: { skin, shirt, pants, hair, hairStyle, arm:'down'|'up'|'phone'|'wave', glasses, bounce }
function person(x, y, h, seed, o = {}) {
  const w = h * 0.3, skin = o.skin ?? SKIN[Math.floor(hash(seed) * SKIN.length)], shirt = o.shirt ?? SHIRT[Math.floor(hash(seed + 1) * SHIRT.length)];
  const pants = o.pants ?? PANTS[Math.floor(hash(seed + 2) * PANTS.length)], hair = o.hair ?? HAIR[Math.floor(hash(seed + 3) * HAIR.length)];
  const dir = o.dir ?? 1, bob = o.bounce ? Math.sin(o.bounce) * h * 0.012 : 0;
  if (!o.noShadow) ellipse(x, y, w * 0.95, h * 0.028, 'rgba(0,0,0,0.2)');
  ctx.save(); ctx.translate(x, y + bob); ctx.scale(dir, 1); ctx.translate(-x, -y);
  const hr = h * 0.095, hy = y - h + hr, sy = y - h * 0.76;
  fillRR(x - w * 0.36, y - h * 0.46, w * 0.32, h * 0.46, w * 0.06, pants); fillRR(x + w * 0.04, y - h * 0.46, w * 0.32, h * 0.46, w * 0.06, pants);
  fillRR(x - w * 0.42, y - h * 0.035, w * 0.4, h * 0.035, h * 0.015, '#2b2b30'); fillRR(x + w * 0.02, y - h * 0.035, w * 0.4, h * 0.035, h * 0.015, '#2b2b30');
  fillRR(x - w * 0.5 - w * 0.08, sy, w * 0.18, h * 0.34, w * 0.09, shirt); circle(x - w * 0.5, sy + h * 0.35, w * 0.09, skin); // back arm
  fillRR(x - w / 2, sy - h * 0.02, w, h * 0.35, w * 0.22, shirt);
  ctx.fillStyle = 'rgba(0,0,0,0.08)'; ctx.fillRect(x - w / 2 + w * 0.6, sy + h * 0.02, w * 0.4, h * 0.28);
  const arm = o.arm ?? 'down', shx = x + w * 0.38, shy = sy + h * 0.03;
  let hx = x + w * 0.58, hyd = sy + h * 0.35;
  if (arm === 'up' || arm === 'wave') { hx = x + w * 0.75 + (arm === 'wave' ? Math.sin((o.wave ?? 0) * 9) * w * 0.14 : 0); hyd = y - h * 1.1; }
  if (arm === 'phone') { hx = x + w * 0.55; hyd = sy + h * 0.16; }
  line(shx, shy, hx, hyd, shirt, w * 0.19); line(shx + (hx - shx) * 0.5, shy + (hyd - shy) * 0.5, hx, hyd, skin, w * 0.16);
  if (arm === 'phone') { fillRR(hx - w * 0.07, hyd - h * 0.1, w * 0.17, h * 0.12, w * 0.025, '#1b1c24'); fillRR(hx - w * 0.055, hyd - h * 0.09, w * 0.14, h * 0.1, w * 0.02, '#a5a0ff'); }
  circle(hx, hyd, w * 0.11, skin);
  fillRR(x - w * 0.09, hy + hr * 0.6, w * 0.18, h * 0.06, 2, skin); circle(x, hy, hr, skin);
  if (o.hairStyle !== 'none') { ctx.beginPath(); ctx.arc(x, hy - hr * 0.1, hr * 1.05, Math.PI * 1.02, Math.PI * 1.98); ctx.closePath(); ctx.fillStyle = hair; ctx.fill(); }
  if (o.hat) { fillRR(x - hr * 1.15, hy - hr * 0.95, hr * 2.3, hr * 0.38, hr * 0.15, o.hat); fillRR(x - hr * 0.8, hy - hr * 1.5, hr * 1.6, hr * 0.7, hr * 0.3, o.hat); }
  const ex = o.eyes === 'wide' ? 1.5 : 1;
  circle(x + hr * 0.36, hy + hr * 0.08, hr * 0.1 * ex, '#1b1410'); circle(x - hr * 0.2, hy + hr * 0.08, hr * 0.1 * ex, '#1b1410');
  if (o.mouth === 'open') ellipse(x + hr * 0.08, hy + hr * 0.5, hr * 0.17, hr * 0.2, '#6b2a2a'); else line(x - hr * 0.1, hy + hr * 0.5, x + hr * 0.3, hy + hr * 0.5, '#6b3f28', Math.max(2, hr * 0.06));
  if (o.glasses) { ctx.strokeStyle = '#1b1b1f'; ctx.lineWidth = Math.max(2, hr * 0.08); ctx.strokeRect(x - hr * 0.52, hy - hr * 0.1, hr * 0.5, hr * 0.38); ctx.strokeRect(x + hr * 0.1, hy - hr * 0.1, hr * 0.5, hr * 0.38); }
  ctx.restore();
}

// ── dark product-UI helpers ──────────────────────────────────────────────────
const IN = { hi: '#c7c3ff', mid: '#a5a0ff', deep: '#7168ff' };
const MUTED = 'rgba(235,235,245,0.5)', SOFT = 'rgba(235,235,245,0.78)', DIM = 'rgba(235,235,245,0.32)';
const RED = C.risk, GREEN = C.healthy, AMBER = C.attention;
const CARD = { x: 100, w: 880 };
const NAMES = [['Jordan', C.primary], ['Priya', '#d9468a'], ['Marcus', '#e5803b'], ['Ava', '#0ea5a4'], ['Sam K.', '#7168ff'], ['Dana', '#3dbb74'], ['Lee', '#d9468a'], ['Noor', '#e5803b'], ['Eli', '#0ea5a4'], ['Rae', C.primary]];
function stage(t, glowA = 0.22) {
  ctx.fillStyle = '#050508'; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(255,255,255,0.035)'; ctx.lineWidth = 1;
  ctx.beginPath(); for (let x = 0; x <= W; x += 60) { ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, H); } for (let y = 0; y <= H; y += 60) { ctx.moveTo(0, y + 0.5); ctx.lineTo(W, y + 0.5); } ctx.stroke();
  glow(CX, 860, 720, C.primary, glowA);
}
function eyebrow(s, y, col = MUTED) { text(s, CX, y, 22, 700, col, 'center', 0.22); }
function card(x, y, w, h, o = {}) {
  fillRR(x, y, w, h, o.r ?? 24, o.fill ?? 'rgba(255,255,255,0.045)');
  strokeRR(x, y, w, h, o.r ?? 24, o.stroke ?? 'rgba(255,255,255,0.11)', o.lw ?? 2);
}
function avatar(x, y, r, initials, col, a = 1) { ctx.save(); ctx.globalAlpha *= a; circle(x, y, r, col); text(initials, x, y + 1, r * 0.78, 700, '#fff', 'center', 0); ctx.restore(); }
function tag(x, y, label, col, solid = false, size = 20) { // right-aligned pill ending at x
  const w = tw(label, size, 800, 0.1) + size * 1.4, h = size * 1.8;
  fillRR(x - w, y - h / 2, w, h, h / 2, solid ? col : rgba(col, 0.14));
  if (!solid) strokeRR(x - w, y - h / 2, w, h, h / 2, rgba(col, 0.45), 1.5);
  text(label, x - w / 2, y + 1, size, 800, solid ? '#fff' : col, 'center', 0.1);
  return w;
}
function bubble(x, y, maxW, lines, out, a = 1) {
  if (a <= 0) return 0;
  const size = 30, lh = 40, w = Math.max(...lines.map((l) => tw(l, size, 500))) + 48, h = lines.length * lh + 30, x0 = out ? x + maxW - w : x;
  ctx.save(); ctx.globalAlpha *= a;
  fillRR(x0, y, w, h, 26, out ? C.primary : 'rgba(255,255,255,0.1)');
  lines.forEach((l, i) => text(l, x0 + 24, y + 15 + lh / 2 + i * lh, size, 500, '#fff'));
  ctx.restore();
  return h;
}
function logoLockup(x, y, size, a = 1) {
  ctx.save(); ctx.globalAlpha *= a;
  const ww = tw(BRAND.name, size, 800, -0.035), ls = size * 1.35, gap = size * 0.28, full = ls + gap + ww, x0 = x - full / 2;
  if (LOGO) ctx.drawImage(LOGO, x0, y - ls / 2, ls, ls);
  text(BRAND.name, x0 + ls + gap, y + size * 0.04, size, 800, '#fff', 'left', -0.035);
  ctx.restore();
}
// A phone: frame at (x, y), w × h, screen drawn by fn() in screen-local coordinates (0,0 = top-left of the screen).
function phone(x, y, w, h, bg, fn) {
  fillRR(x - 14, y - 14, w + 28, h + 28, 64, '#1c1c26'); strokeRR(x - 14, y - 14, w + 28, h + 28, 64, 'rgba(255,255,255,0.16)', 3);
  ctx.save(); rr(x, y, w, h, 50); ctx.clip(); ctx.fillStyle = bg; ctx.fillRect(x, y, w, h); ctx.translate(x, y); fn(); ctx.restore();
  fillRR(x + w / 2 - 70, y + 14, 140, 34, 17, '#0b0b10');
}
// The logo hit: a flash and the lockup landing (used when the narrator says "MsgHealth").
function brandHit(t, at, until) {
  const hit = seg(t, at, at + 0.5);
  stage(t, 0.12 + 0.28 * ease.out(hit));
  if (t >= at) glow(CX, 860, 800, C.primary, 0.5 * (1 - seg(t, at, at + 0.35)));
  withFade(enter(t, at - 0.02, until, 0.18), () => { const s = 1 + 0.25 * (1 - ease.quint(hit)); xf(CX, 860, s, 0, () => logoLockup(CX, 860, 92)); });
}

// ── captions: one phrase at a time in a black label, like the reference ──────
const ACCENT = '#f5d68a'; // pale gold until the brand, brand indigo after
const CAP_Y = 1470, CAP_SIZE = 46;
function buildCaps(brandAt) {
  const caps = [];
  VO_CLIPS.forEach((clip, i) => clip.chunks.forEach(([s, off], k) => {
    const at = VO_AT[i] + off, next = k + 1 < clip.chunks.length ? VO_AT[i] + clip.chunks[k + 1][1] : VO_AT[i] + clip.dur + 0.25;
    caps.push({ at: at - 0.04, out: Math.min(next - 0.02, i + 1 < VO_AT.length ? VO_AT[i + 1] - 0.02 : Infinity), s, brand: VO_AT[i] >= brandAt });
  }));
  return caps;
}
function drawCaption(caps, t, hide) {
  const c = caps.find((c) => t >= c.at && t < c.out);
  if (!c || (hide && hide(t, c))) return;
  let acc = false;
  const words = c.s.split(' ').map((w) => { if (w.startsWith('*')) acc = true; const o = { w: w.replace(/\*/g, '').toUpperCase(), acc }; if (/\*[.,?!…:]*$/.test(w)) acc = false; return o; });
  const sp = tw(' ', CAP_SIZE, 800, 0);
  words.forEach((w) => (w.width = tw(w.w, CAP_SIZE, 800, 0.01)));
  const tot = words.reduce((p, w) => p + w.width, 0) + sp * (words.length - 1);
  const k = ease.back(seg(t, c.at, c.at + 0.14)), sc = 0.9 + 0.1 * k;
  ctx.save(); ctx.translate(CX, CAP_Y); ctx.scale(sc, sc); ctx.translate(-CX, -CAP_Y);
  fillRR(CX - tot / 2 - 28, CAP_Y - 40, tot + 56, 80, 12, 'rgba(8,8,10,0.92)');
  let x = CX - tot / 2;
  words.forEach((w) => { text(w.w, x, CAP_Y + 2, CAP_SIZE, 800, w.acc ? (c.brand ? IN.mid : ACCENT) : '#ffffff', 'left', 0.01); x += w.width + sp; });
  ctx.restore();
}

// ── end card: logo, tagline, button with a tap, msghealth.net ────────────────
function endCard(t, at, tapAt, urlAt) {
  const k = ease.quint(seg(t, at, at + 0.4));
  stage(t, 0.18 + 0.2 * k);
  if (t < at + 0.3) glow(CX, 860, 800, C.primary, 0.45 * (1 - seg(t, at, at + 0.3)));
  xf(CX, 640, 1 + 0.2 * (1 - k), 0, () => { ctx.save(); ctx.globalAlpha = k; logoLockup(CX, 600, 96); text(BRAND.tagline, CX, 710, 32, 500, SOFT, 'center'); ctx.restore(); });
  const b = ease.back(seg(t, at + 0.35, at + 0.75));
  if (b <= 0) return;
  const press = t > tapAt - 0.06 && t < tapAt + 0.16 ? 0.94 : 1, label = 'Try MsgHealth', bw = tw(label, 44, 800) + 160, bh = 116, by = 830;
  ctx.save(); ctx.globalAlpha = clamp(b); ctx.translate(CX, by + bh / 2); ctx.scale(b * press, b * press); ctx.translate(-CX, -(by + bh / 2));
  glow(CX, by + bh / 2, 360, C.primary, 0.45 + 0.15 * Math.sin(t * 4));
  fillRR(CX - bw / 2, by, bw, bh, bh / 2, C.primary); strokeRR(CX - bw / 2, by, bw, bh, bh / 2, 'rgba(255,255,255,0.25)', 2);
  text(label, CX - 30, by + bh / 2 + 2, 44, 800, '#fff', 'center');
  const ax = CX + tw(label, 44, 800) / 2 + 10; ctx.strokeStyle = '#fff'; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(ax, by + bh / 2); ctx.lineTo(ax + 40, by + bh / 2); ctx.moveTo(ax + 24, by + bh / 2 - 16); ctx.lineTo(ax + 40, by + bh / 2); ctx.lineTo(ax + 24, by + bh / 2 + 16); ctx.stroke();
  ctx.restore();
  const o = ease.back(seg(t, at + 0.8, at + 1.1));
  if (o > 0) {
    ctx.save(); ctx.globalAlpha = clamp(o); const s2 = '50% OFF YOUR FIRST MONTH · MONTHLY PLANS', w = tw(s2, 20, 800, 0.1) + 40;
    ctx.translate(CX, by + bh + 70); ctx.scale(o, o);
    fillRR(-w / 2, -24, w, 48, 10, rgba(GREEN, 0.18)); strokeRR(-w / 2, -24, w, 48, 10, rgba(GREEN, 0.6), 2); text(s2, 0, 1, 20, 800, '#9ff0c0', 'center', 0.1);
    ctx.restore();
  }
  withFade(seg(t, urlAt, urlAt + 0.3), () => text(BRAND.url.toUpperCase(), CX, by + bh + 160, 28, 800, IN.mid, 'center', 0.18));
  if (HAND && t > tapAt - 0.7 && t < tapAt + 0.8) {
    const p = seg(t, tapAt - 0.7, tapAt - 0.05), q = seg(t, tapAt + 0.25, tapAt + 0.8);
    const hx = ax + 26 + (1 - ease.out(p)) * 220 + q * 160, hy = by + bh / 2 + 18 + (1 - ease.out(p)) * 300 + q * 240;
    ctx.save(); ctx.globalAlpha = clamp(p * 3) * (1 - q);
    if (t > tapAt && t < tapAt + 0.4) { const r = seg(t, tapAt, tapAt + 0.4); ctx.strokeStyle = rgba('#ffffff', 0.7 * (1 - r)); ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(hx, hy, 20 + r * 60, 0, Math.PI * 2); ctx.stroke(); }
    ctx.translate(hx, hy); ctx.rotate(-0.12); ctx.scale(0.5, 0.5); ctx.translate(-110.5, -117); ctx.drawImage(HAND, 0, 0);
    ctx.restore();
  }
}

// ── boot: renderFrame, ready, text audit hook and the browser player ─────────
// cfg: { duration, scenes: [[from, to, fn(t)]], brandAt, hideCaption(t, cap), after(t) (drawn over everything, under captions),
//        noVoice (no voiceover clips: the timeline in *-vo.js still drives the captions), finish(t) (over everything, captions included) }
function boot(cfg, voDir) {
  const caps = buildCaps(cfg.brandAt);
  window.DURATION = cfg.duration;
  window.VO = cfg.noVoice ? [] : VO_AT.map((at, i) => ({ at, file: `assets/audio/${voDir}/vo-${String(i).padStart(2, '0')}.wav`, dur: VO_CLIPS[i].dur }));
  window.renderFrame = (t) => {
    ctx = MAIN;
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.filter = 'none'; ctx.globalCompositeOperation = 'source-over'; ctx.shadowBlur = 0; ctx.shadowColor = 'transparent'; ctx.lineCap = 'butt'; ctx.lineJoin = 'miter';
    (cfg.scenes.find(([a, b]) => t >= a && t < b) ?? cfg.scenes.at(-1))[2](t);
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.filter = 'none'; ctx.shadowBlur = 0;
    if (cfg.after) cfg.after(t);
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1;
    drawCaption(caps, t, cfg.hideCaption);
    if (cfg.finish) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; cfg.finish(t); }
  };
  {
    const fill = CanvasRenderingContext2D.prototype.fillText; // text audit hook (scripts/audit-text.mjs)
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
    MAIN = document.getElementById('c').getContext('2d'); ctx = MAIN;
    await Promise.all(['500', '600', '700', '800'].map((w) => document.fonts.load(`${w} 40px ${FONT}`)));
    const load = (src) => new Promise((res) => { const im = new Image(); im.onload = () => res(im); im.onerror = () => res(null); im.src = src; });
    LOGO = await load(BRAND.logoFile); HAND = await load('assets/img/hand-tap.png');
    if (cfg.preload) await cfg.preload();
    if (location.search.includes('render')) document.body.classList.add('render');
    window.renderFrame(0);
    return true;
  })();
  (() => { // player: plays the voiceover clips in sync (the full mix is only in the render)
    const btn = document.getElementById('play'), seek = document.getElementById('seek'), tm = document.getElementById('time');
    if (!btn) return;
    const clips = window.VO.map((v) => Object.assign(new Audio(v.file), { preload: 'auto' }));
    let playing = false, cur = 0, t0 = 0; const started = new Set();
    const show = (t) => { cur = t; window.renderFrame(t); seek.value = (t / cfg.duration) * 1000; tm.textContent = `${t.toFixed(1)}s / ${cfg.duration.toFixed(1)}s`; };
    const stopAll = () => { clips.forEach((c) => c.pause()); started.clear(); };
    const loop = () => {
      if (!playing) return;
      const t = (performance.now() - t0) / 1000;
      if (t >= cfg.duration) { playing = false; stopAll(); btn.textContent = 'Replay'; show(cfg.duration); return; }
      window.VO.forEach((v, i) => { if (t >= v.at && t < v.at + v.dur && !started.has(i)) { started.add(i); clips[i].currentTime = t - v.at; clips[i].play(); } });
      show(t); requestAnimationFrame(loop);
    };
    btn.onclick = () => {
      if (playing) { playing = false; stopAll(); btn.textContent = 'Play'; return; }
      if (cur >= cfg.duration) cur = 0;
      t0 = performance.now() - cur * 1000; playing = true; btn.textContent = 'Pause'; requestAnimationFrame(loop);
    };
    seek.oninput = () => { playing = false; stopAll(); btn.textContent = 'Play'; show((seek.value / 1000) * cfg.duration); };
    window.ready.then(() => { const q = new URLSearchParams(location.search).get('t'); if (q) show(+q); });
  })();
}

// ── the offer: a big "50% OFF" card (direct-response ads), then the logo and the button ──
function offerCard(t, at, until) {
  const k = ease.back(seg(t, at, at + 0.4)), pulse = 0.5 + 0.5 * Math.sin((t - at) * 5);
  stage(t, 0.3 + 0.12 * pulse);
  glow(CX, 560, 900, C.primary, 0.35 * (1 - seg(t, at, at + 0.5)));
  withFade(enter(t, at - 0.02, until, 0.15), () => {
    eyebrow('LIMITED TIME OFFER', 330, IN.mid);
    xf(CX, 520, 0.6 + 0.4 * clamp(k), 0, () => { ctx.save(); ctx.globalAlpha = clamp(k * 1.5); ctx.shadowColor = rgba(C.primary, 0.9); ctx.shadowBlur = 60; text('50%', CX, 500, 290, 800, '#fff', 'center', -0.05); ctx.restore(); });
    withFade(seg(t, at + 0.2, at + 0.5), () => text('OFF YOUR FIRST MONTH', CX, 690, 56, 800, '#fff', 'center', 0.0));
    // the real monthly prices: first month at half price
    [['Starter', '$50', '$25'], ['Pro', '$109', '$54.50'], ['Enterprise', '$279', '$139.50']].forEach(([n, was, now], i) => {
      const e = pop(t, at + 0.45 + i * 0.12, 0.3), y = 780 + i * 96; if (e <= 0) return;
      xf(CX, y + 36, clamp(e), 0, () => { fillRR(130, y, 820, 80, 22, 'rgba(255,255,255,0.06)'); strokeRR(130, y, 820, 80, 22, 'rgba(255,255,255,0.14)', 2); text(n, 170, y + 41, 32, 800, '#fff', 'left', 0);
        text(was + '/mo', 600, y + 42, 30, 600, MUTED, 'right', 0); line(600 - tw(was + '/mo', 30, 600, 0), y + 42, 600, y + 42, MUTED, 3); text('→', 650, y + 41, 30, 700, MUTED, 'center'); text(now, 920, y + 42, 42, 800, '#9ff0c0', 'right', -0.01); });
    });
    withFade(seg(t, at + 0.9, at + 1.2), () => text('Monthly plans only · Pay-Per-Use Wallet not included', CX, 1100, 22, 600, MUTED, 'center', 0.02));
    withFade(seg(t, at + 0.8, at + 1.1), () => { logoLockup(CX, 1200, 60); });
    const b = pop(t, at + 0.9, 0.35); if (b > 0) xf(CX, 1320, b, 0, () => { const lb = 'Claim 50% off · ' + BRAND.url, w = tw(lb, 34, 800) + 120; fillRR(CX - w / 2, 1270, w, 100, 50, C.primary); strokeRR(CX - w / 2, 1270, w, 100, 50, 'rgba(255,255,255,0.25)', 2); text(lb, CX, 1322, 34, 800, '#fff', 'center'); });
  });
}
