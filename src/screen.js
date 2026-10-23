// MsgHealth · "6 hours of this" · 63s explainer ad (1920 × 1080 or 1080 × 1920, 60 fps).
// Opens on a finger tapping a phone ("Your screen time: 6 hours a day"), takes the screen apart layer by
// layer, zooms into the touch sensor's grid of see-through electrodes and shows how a capacitive
// touchscreen finds a finger: every crossing holds a small electric field, the finger pulls some of that
// charge away, the controller scans the grid and finds the drop. Then it turns: 5 of those 6 hours go
// to reaching out to clients, booking and rescheduling. MsgHealth does those automatically, "without
// lifting a finger". Captions carry the story, so it works with the sound off.
'use strict';

// Output frame: 16:9 (screen.html) or 9:16 (screen-vertical.html sets window.FORMAT.vertical). The short
// side is 1080 in both, so every object is sized once; only where things sit changes.
const V = !!(window.FORMAT && window.FORMAT.vertical);
const W = V ? 1080 : 1920, H = V ? 1920 : 1080;
const DURATION = 63.0;
const C = BRAND.colors;
const FONT = 'Inter';
const SOFT = 'rgba(235,235,245,0.62)', MUTED = 'rgba(235,235,245,0.42)';
const IN = { hi: '#dcd9ff', mid: '#a49dff', deep: '#7268ff', glow: C.primary };
const AMBER = '#f2b441', SKIN = { hi: '#e2a888', mid: '#c98a68', lo: '#a36a4e', nail: '#efc6b2' };

// Layout. The object (phone, grid, card) sits right of the captions in 16:9, below them in 9:16.
const OBJ = V ? { x: 540, y: 1190 } : { x: 1340, y: 540 };
const CAP = V ? { x: 540, y: 340, w: 960, size: 72, align: 'center' } : { x: 140, y: 540, w: 740, size: 68, align: 'left' };
const PS = V ? 1.22 : 0.98;        // phone scale
const CS = V ? 1.3 : 1;            // card scale
const G = V ? 920 : 800;           // touch-grid size
const PW = 380, PH = 780, PR = 56; // phone screen, phone units

let ctx = null, MAIN = null, LOGO = null;
const OFF = [];
window.SFX = []; // sound cues { t, kind, gain? }, read by scripts/screen-audio.mjs

// ── maths ────────────────────────────────────────────────────────────────────
const clamp = (v, a = 0, c = 1) => Math.max(a, Math.min(c, v));
const lerp = (a, c, t) => a + (c - a) * t;
const seg = (t, a, c) => clamp((t - a) / (c - a));
const ease = {
  out: (t) => 1 - Math.pow(1 - t, 3),
  quint: (t) => 1 - Math.pow(1 - t, 5),
  inOut: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  in: (t) => t * t * t,
};
const hash = (n) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
const fract = (v) => v - Math.floor(v);
function rgba(hex, a) { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; }
function mix(h1, h2, k) {
  const a = parseInt(h1.slice(1), 16), b = parseInt(h2.slice(1), 16);
  const ch = (s) => Math.round(lerp((a >> s) & 255, (b >> s) & 255, k));
  return `#${((1 << 24) | (ch(16) << 16) | (ch(8) << 8) | ch(0)).toString(16).slice(1)}`;
}

// ── drawing primitives ───────────────────────────────────────────────────────
function rr(x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }
function fillRR(x, y, w, h, r, col) { rr(x, y, w, h, r); ctx.fillStyle = col; ctx.fill(); }
function font(size, weight = 600, track = -0.03) { ctx.font = `${weight} ${size}px ${FONT}`; ctx.letterSpacing = `${(size * track).toFixed(2)}px`; }
const trackFor = (size) => (size >= 40 ? -0.03 : -0.005);
function text(s, x, y, size, weight, color, align = 'left', track) {
  font(size, weight, track ?? trackFor(size));
  ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.fillStyle = color; ctx.fillText(s, x, y);
}
function tw(s, size, weight = 600, track) { font(size, weight, track ?? trackFor(size)); return ctx.measureText(s).width; }
const silver = (y, size) => { const g = ctx.createLinearGradient(0, y - size * 0.55, 0, y + size * 0.55); g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#b4b4c2'); return g; };
const brandGrad = (x0, x1) => { const g = ctx.createLinearGradient(x0, 0, x1, 0); g.addColorStop(0, IN.hi); g.addColorStop(0.5, IN.mid); g.addColorStop(1, IN.deep); return g; };
function glass(x, y, w, h, r, o = {}) {
  fillRR(x, y, w, h, r, o.fill ?? 'rgba(255,255,255,0.065)');
  rr(x, y, w, h, r); ctx.strokeStyle = o.stroke ?? 'rgba(255,255,255,0.13)'; ctx.lineWidth = o.lw ?? 1.5; ctx.stroke();
}
function pill(x, y, label, color, size = 22, align = 'left', solid = false) {
  const w = tw(label, size, 700) + size * 1.3, h = size * 1.75;
  const x0 = align === 'center' ? x - w / 2 : align === 'right' ? x - w : x;
  fillRR(x0, y - h / 2, w, h, h / 2, solid ? color : rgba(color, 0.16));
  text(label, x0 + w / 2, y + 1, size, 700, solid ? '#fff' : color, 'center');
  return w;
}
function check(x, y, s, col = '#fff', lw = 4) {
  ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(x - s * 0.45, y); ctx.lineTo(x - s * 0.12, y + s * 0.34); ctx.lineTo(x + s * 0.5, y - s * 0.36); ctx.stroke();
}
// Soft round glow sprites, one per colour: drawn with 'lighter' they make the charge particles.
const SPRITES = {};
function sprite(col) {
  if (SPRITES[col]) return SPRITES[col];
  const c = document.createElement('canvas'); c.width = c.height = 64;
  const g = c.getContext('2d'), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, rgba(col, 1)); gr.addColorStop(0.18, rgba(col, 0.85)); gr.addColorStop(0.45, rgba(col, 0.25)); gr.addColorStop(1, rgba(col, 0));
  g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
  return (SPRITES[col] = c);
}
function dot(x, y, size, col, a) { if (a <= 0.01) return; ctx.globalAlpha = a; ctx.drawImage(sprite(col), x - size / 2, y - size / 2, size, size); }

// The stage: black, with a soft brand glow behind the object.
function stage(glow = 0.16, col = IN.glow) {
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  if (glow <= 0) return;
  const R = 760, g = ctx.createRadialGradient(OBJ.x, OBJ.y, 0, OBJ.x, OBJ.y, R);
  g.addColorStop(0, rgba(col, glow)); g.addColorStop(1, rgba(col, 0));
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}

// ── captions ─────────────────────────────────────────────────────────────────
// Words between *stars* take the brand gradient. Each caption fades up out of a blur and leaves upward.
const CAPS = [
  { at: 0.35, out: 3.0, s: 'Your screen time: *6 hours a day.*' },
  { at: 3.15, out: 6.75, s: "That's 6 hours of *this.*" },
  { at: 7.15, out: 9.85, s: 'Ever wonder how it knows *where you touched?*' },
  { at: 10.0, out: 12.3, s: 'Your screen is a *stack of layers.*' },
  { at: 12.45, out: 14.15, s: 'The magic is in the *middle one.*' },
  { at: 14.65, out: 17.5, s: 'Under the glass: a grid of *see-through wires.*' },
  { at: 17.65, out: 20.45, s: 'A tiny current gives every crossing an *electric field.*' },
  { at: 20.6, out: 24.0, s: 'Your finger conducts electricity. It *pulls charge away.*' },
  { at: 24.15, out: 26.8, s: 'The phone scans the grid *over 100 times a second*…' },
  { at: 26.95, out: 30.45, s: "…finds where the charge dropped. *That's your touch.*" },
  { at: 30.9, out: 33.2, s: 'You do this *thousands of times* a day.' },
  { at: 33.35, out: 35.5, s: 'Run a business? Then you know *where it goes.*' },
  { at: 35.9, out: 39.75, s: 'Reaching out. Booking. *Rescheduling.*' },
  { at: 39.9, out: 44.35, s: '*5 of your 6 hours*, spent keeping clients on the books.' },
  { at: 44.6, out: 48.6, s: 'It does all that tapping *for you.*' },
  { at: 48.8, out: 52.5, s: "That's *5 hours back.* Every day." },
  { at: 53.0, out: 57.6, s: 'All without *lifting a finger.*' },
];
const EYES = [
  { at: 7.15, out: 30.45, s: 'HOW A TOUCHSCREEN WORKS' },
  { at: 35.9, out: 44.35, s: 'YOUR SCREEN TIME' },
  { at: 44.6, out: 52.5, logo: true },
];
function words(s) {
  let acc = false;
  return s.split(' ').map((w) => {
    const startsAcc = w.startsWith('*'), core = w.replace(/\*/g, '');
    if (startsAcc) acc = true;
    const out = { w: core, acc };
    if (/\*[.,?…]?$/.test(w)) acc = false;
    return out;
  });
}
function wrap(s, size, maxW) {
  const ws = words(s), sp = tw(' ', size, 700, -0.035), lines = [[]];
  let x = 0;
  ws.forEach((w) => {
    w.width = tw(w.w, size, 700, -0.035);
    if (x > 0 && x + sp + w.width > maxW) { lines.push([]); x = 0; }
    lines[lines.length - 1].push(w); x += (x > 0 ? sp : 0) + w.width;
  });
  return lines.map((l) => ({ l, width: l.reduce((p, w) => p + w.width, 0) + sp * (l.length - 1), sp }));
}
const capLines = (c) => (c.lines ??= wrap(c.s, CAP.size, CAP.w));
function lineH() { return CAP.size * 1.14; }
function fadeState(t, at, out, i = 0) {
  const pin = ease.quint(seg(t, at + i * 0.07, at + i * 0.07 + 0.6)), pout = ease.in(seg(t, out - 0.35, out));
  return { a: pin * (1 - pout), blur: (1 - pin) * 14 + pout * 10, dy: (1 - pin) * 34 - pout * 26 };
}
function drawCaptions(t) {
  CAPS.forEach((c) => {
    if (t < c.at || t > c.out) return;
    const lines = capLines(c), lh = lineH(), y0 = CAP.y - ((lines.length - 1) * lh) / 2;
    lines.forEach(({ l, width, sp }, i) => {
      const f = fadeState(t, c.at, c.out, i), y = y0 + i * lh + f.dy;
      if (f.a <= 0.001) return;
      ctx.save(); ctx.globalAlpha = f.a; if (f.blur > 0.3) ctx.filter = `blur(${f.blur.toFixed(1)}px)`;
      let x = CAP.align === 'center' ? CAP.x - width / 2 : CAP.x;
      font(CAP.size, 700, -0.035); ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      l.forEach((w) => { ctx.fillStyle = w.acc ? brandGrad(x, x + w.width) : silver(y, CAP.size); ctx.fillText(w.w, x, y); x += w.width + sp; });
      ctx.restore();
    });
  });
  EYES.forEach((e) => {
    if (t < e.at || t > e.out) return;
    const cur = CAPS.filter((c) => c.at <= t + 0.6 && c.at >= e.at - 0.01).pop() ?? CAPS.find((c) => c.at >= e.at);
    const n = capLines(cur).length, y = CAP.y - ((n - 1) * lineH()) / 2 - CAP.size * 0.62 - 44;
    const f = fadeState(t, e.at, e.out);
    ctx.save(); ctx.globalAlpha = f.a; if (f.blur > 0.3) ctx.filter = `blur(${f.blur.toFixed(1)}px)`;
    if (e.logo) {
      const ls = 64, ww = tw(BRAND.name, 40, 700, -0.03), full = ls + 12 + ww;
      const x0 = CAP.align === 'center' ? CAP.x - full / 2 : CAP.x;
      if (LOGO) ctx.drawImage(LOGO, x0, y - ls / 2 + f.dy, ls, ls);
      text(BRAND.name, x0 + ls + 12, y + f.dy + 2, 40, 700, '#fff', 'left', -0.03);
    } else text(e.s, CAP.x, y + f.dy, 22, 700, IN.mid, CAP.align, 0.14);
    ctx.restore();
  });
}

// ── the finger ───────────────────────────────────────────────────────────────
// Drawn in the local space of whatever it touches. (x, y) is the centre of the pad that touches the glass;
// the finger comes in from the bottom right. lift 0 = pressing, 1 = hovering just above.
function finger(x, y, lift = 0, o = {}) {
  const a = o.alpha ?? 1;
  if (a <= 0) return;
  ctx.save();
  ctx.translate(x, y); ctx.scale(o.scale ?? 1, o.scale ?? 1);
  // shadow: further away and softer as the finger lifts
  ctx.save();
  ctx.globalAlpha = a * (0.45 - 0.2 * lift);
  ctx.filter = `blur(${(10 + 22 * lift).toFixed(1)}px)`;
  ctx.translate(18 + 46 * lift, 24 + 60 * lift); ctx.rotate(-0.5);
  fillRR(-48, -58, 96, 640, 48, '#000');
  ctx.restore();
  ctx.translate(12 * lift, 16 * lift); const s = 1 + 0.07 * lift; ctx.scale(s, s);
  ctx.rotate(-0.5);
  ctx.globalAlpha = a;
  const g = ctx.createLinearGradient(-46, 0, 46, 0);
  g.addColorStop(0, SKIN.lo); g.addColorStop(0.28, SKIN.mid); g.addColorStop(0.55, SKIN.hi); g.addColorStop(1, SKIN.lo);
  fillRR(-46, -58, 92, 640, 46, g);
  // the tip is a touch lighter where the light catches it
  const tg = ctx.createRadialGradient(-6, -26, 4, -6, -26, 60);
  tg.addColorStop(0, 'rgba(255,224,204,0.35)'); tg.addColorStop(1, 'rgba(255,224,204,0)');
  ctx.fillStyle = tg; ctx.fillRect(-46, -58, 92, 120);
  // nail
  const ng = ctx.createLinearGradient(0, -48, 0, 40);
  ng.addColorStop(0, '#f6dccf'); ng.addColorStop(0.2, SKIN.nail); ng.addColorStop(1, '#dca891');
  fillRR(-30, -46, 60, 84, 27, ng);
  rr(-30, -46, 60, 84, 27); ctx.strokeStyle = 'rgba(120,70,50,0.35)'; ctx.lineWidth = 2; ctx.stroke();
  fillRR(-22, 20, 44, 14, 7, 'rgba(255,240,232,0.35)'); // lunula
  // knuckle creases
  ctx.strokeStyle = 'rgba(110,60,40,0.28)'; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
  [168, 184, 330, 344].forEach((cy, i) => { ctx.beginPath(); ctx.moveTo(-26 + (i % 2) * 6, cy); ctx.quadraticCurveTo(0, cy + 7, 26 - (i % 2) * 6, cy); ctx.stroke(); });
  ctx.restore();
}

// A finger performing a list of contacts: { t0, t1, x, y, x1?, y1? } (a swipe if x1/y1 are given).
// Between contacts it lifts and travels; it enters from `from` and leaves to `to`.
function gesture(t, list, from, to, enter, exit) {
  const first = list[0], last = list[list.length - 1];
  const end = (c) => [c.x1 ?? c.x, c.y1 ?? c.y];
  let x, y, press = 0;
  if (t < first.t0) {
    const k = ease.inOut(seg(t, enter, first.t0)); x = lerp(from[0], first.x, k); y = lerp(from[1], first.y, k);
  } else if (t >= last.t1) {
    const [ex, ey] = end(last), k = ease.inOut(seg(t, last.t1 + 0.04, exit)); x = lerp(ex, to[0], k); y = lerp(ey, to[1], k);
  } else {
    for (let i = 0; i < list.length; i++) {
      const c = list[i], n = list[i + 1];
      if (t >= c.t0 && t < c.t1) { const k = ease.inOut(seg(t, c.t0, c.t1)); const [ex, ey] = end(c); x = lerp(c.x, ex, k); y = lerp(c.y, ey, k); break; }
      if (n && t >= c.t1 && t < n.t0) { const k = ease.inOut(seg(t, c.t1 + 0.03, n.t0 - 0.03)); const [ex, ey] = end(c); x = lerp(ex, n.x, k); y = lerp(ey, n.y, k); break; }
    }
  }
  list.forEach((c) => { press = Math.max(press, Math.min(ease.out(seg(t, c.t0 - 0.09, c.t0)), 1 - ease.out(seg(t, c.t1, c.t1 + 0.1)))); });
  return { x, y, lift: 1 - press, visible: t >= enter && t <= exit };
}
// Touch ripples on the glass, and a short trail behind a swipe.
function ripples(t, list) {
  list.forEach((c) => {
    const k = seg(t, c.t0, c.t0 + 0.5);
    if (k > 0 && k < 1) {
      ctx.beginPath(); ctx.arc(c.x, c.y, 14 + 50 * ease.out(k), 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255,255,255,${0.5 * (1 - k)})`; ctx.lineWidth = 3; ctx.stroke();
      ctx.beginPath(); ctx.arc(c.x, c.y, 26 * (1 - k * 0.5), 0, Math.PI * 2); ctx.fillStyle = `rgba(164,157,255,${0.28 * (1 - k)})`; ctx.fill();
    }
    if (c.x1 != null && t > c.t0 && t < c.t1 + 0.35) {
      const k1 = ease.inOut(seg(t, c.t0, c.t1)), fade = 1 - seg(t, c.t1, c.t1 + 0.35);
      const x0 = lerp(c.x, c.x1, Math.max(0, k1 - 0.35)), y0 = lerp(c.y, c.y1, Math.max(0, k1 - 0.35)), xe = lerp(c.x, c.x1, k1), ye = lerp(c.y, c.y1, k1);
      const g = ctx.createLinearGradient(x0, y0, xe, ye); g.addColorStop(0, 'rgba(164,157,255,0)'); g.addColorStop(1, `rgba(164,157,255,${0.45 * fade})`);
      ctx.strokeStyle = g; ctx.lineWidth = 22; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(xe, ye); ctx.stroke();
    }
  });
}

// ── the phone ────────────────────────────────────────────────────────────────
const APPS = ['#5b55e8', '#2bb3a3', '#ec6f5a', '#f2b441', '#7c8aa5', '#3d8bf0', '#c25bd6', '#3dbb74', '#e8577f', '#5fa8d3', '#9a7cf0', '#f08a3d', '#47b8c9', '#8a93a8', '#d94f4f', '#6fbf5a'];
function appIcon(x, y, i, s = 64) {
  const col = APPS[i % APPS.length], g = ctx.createLinearGradient(0, y - s / 2, 0, y + s / 2);
  g.addColorStop(0, mix(col, '#ffffff', 0.18)); g.addColorStop(1, mix(col, '#000000', 0.12));
  fillRR(x - s / 2, y - s / 2, s, s, s * 0.24, g);
  ctx.strokeStyle = 'rgba(255,255,255,0.92)'; ctx.fillStyle = 'rgba(255,255,255,0.92)'; ctx.lineWidth = 4; ctx.lineCap = 'round';
  const k = i % 4;
  ctx.beginPath();
  if (k === 0) { ctx.arc(x, y, s * 0.2, 0, Math.PI * 2); ctx.stroke(); }
  else if (k === 1) { rr(x - s * 0.2, y - s * 0.16, s * 0.4, s * 0.32, 5); ctx.stroke(); }
  else if (k === 2) { ctx.moveTo(x - s * 0.2, y + s * 0.12); ctx.lineTo(x, y - s * 0.16); ctx.lineTo(x + s * 0.2, y + s * 0.12); ctx.stroke(); }
  else { ctx.arc(x, y, s * 0.08, 0, Math.PI * 2); ctx.fill(); }
}
function screenBg() {
  const g = ctx.createLinearGradient(0, -PH / 2, 0, PH / 2);
  g.addColorStop(0, '#221d5c'); g.addColorStop(0.55, '#110f2a'); g.addColorStop(1, '#07070d');
  ctx.fillStyle = g; ctx.fillRect(-PW / 2, -PH / 2, PW, PH);
  const r = ctx.createRadialGradient(-60, -260, 0, -60, -260, 380); r.addColorStop(0, 'rgba(114,104,255,0.35)'); r.addColorStop(1, 'rgba(114,104,255,0)');
  ctx.fillStyle = r; ctx.fillRect(-PW / 2, -PH / 2, PW, PH);
}
function statusBar(time = '9:41') {
  text(time, -PW / 2 + 40, -PH / 2 + 30, 17, 600, '#fff');
  for (let i = 0; i < 4; i++) fillRR(PW / 2 - 104 + i * 7, -PH / 2 + 34 - 4 - i * 3, 4.5, 6 + i * 3, 1.5, '#fff');
  rr(PW / 2 - 64, -PH / 2 + 22, 30, 15, 4); ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 1.5; ctx.stroke();
  fillRR(PW / 2 - 62, -PH / 2 + 24, 21, 11, 2.5, '#fff');
  fillRR(-46, -PH / 2 + 14, 92, 28, 14, '#000'); // the island
}
// Home screen with a Screen Time widget. `touches` is the counter shown in the widget.
function homeScreen(touches) {
  screenBg(); statusBar();
  glass(-166, -318, 332, 150, 28, { fill: 'rgba(255,255,255,0.09)', stroke: 'rgba(255,255,255,0.14)' });
  text('Screen Time', -142, -290, 17, 600, SOFT);
  text('6h 0m', -142, -248, 44, 800, '#fff', 'left', -0.03);
  const bars = [0.55, 0.8, 0.62, 0.9, 0.7, 0.95, 1];
  bars.forEach((v, i) => fillRR(54 + i * 14, -232 - 58 * v, 8, 58 * v, 3, i === 6 ? IN.mid : 'rgba(255,255,255,0.32)'));
  text('Touches today', -142, -198, 16, 500, SOFT);
  text(touches.toLocaleString('en-US'), 142, -198, 19, 700, '#fff', 'right');
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) appIcon(-126 + c * 84, -100 + r * 96, r * 4 + c);
  glass(-170, 262, 340, 96, 32, { fill: 'rgba(255,255,255,0.1)', stroke: 'rgba(255,255,255,0.12)' });
  for (let c = 0; c < 4; c++) appIcon(-126 + c * 84, 310, [0, 5, 7, 2][c]);
  fillRR(-60, PH / 2 - 16, 120, 5, 2.5, 'rgba(255,255,255,0.75)');
}
function phoneBody() {
  const g = ctx.createLinearGradient(-PW / 2, -PH / 2, PW / 2, PH / 2);
  g.addColorStop(0, '#3a3a46'); g.addColorStop(0.5, '#17171e'); g.addColorStop(1, '#2c2c36');
  fillRR(-PW / 2 - 15, -PH / 2 - 15, PW + 30, PH + 30, PR + 15, g);
  rr(-PW / 2 - 15, -PH / 2 - 15, PW + 30, PH + 30, PR + 15); ctx.strokeStyle = 'rgba(255,255,255,0.16)'; ctx.lineWidth = 2; ctx.stroke();
  fillRR(-PW / 2 - 4, -PH / 2 - 4, PW + 8, PH + 8, PR + 4, '#000');
}
// A front-on phone at the object position. `screen` draws the display, `over` draws on top (finger).
function phone(t, screen, over, o = {}) {
  ctx.save();
  ctx.translate(OBJ.x, OBJ.y + (o.dy ?? 0)); ctx.scale(PS * (o.s ?? 1), PS * (o.s ?? 1));
  ctx.globalAlpha *= o.alpha ?? 1;
  phoneBody();
  ctx.save(); rr(-PW / 2, -PH / 2, PW, PH, PR); ctx.clip(); screen(); ctx.restore();
  // glass sheen
  const sh = ctx.createLinearGradient(-PW / 2, -PH / 2, PW / 2, PH / 2);
  sh.addColorStop(0, 'rgba(255,255,255,0.07)'); sh.addColorStop(0.4, 'rgba(255,255,255,0)'); sh.addColorStop(1, 'rgba(255,255,255,0.02)');
  fillRR(-PW / 2, -PH / 2, PW, PH, PR, sh);
  if (over) over();
  ctx.restore();
}

// ── 1 · hook: 6 hours of this ────────────────────────────────────────────────
const TAPS1 = [
  { t0: 1.0, t1: 1.14, x: -42, y: -4 },
  { t0: 1.72, t1: 2.3, x: 70, y: 210, x1: 70, y1: -70 },
  { t0: 2.72, t1: 2.84, x: 126, y: 92 },
  { t0: 3.3, t1: 3.42, x: -126, y: -100 },
  { t0: 3.78, t1: 4.25, x: -30, y: 220, x1: -30, y1: -30 },
  { t0: 4.58, t1: 4.68, x: 42, y: -100 },
  { t0: 4.98, t1: 5.08, x: -42, y: 188 },
  { t0: 5.34, t1: 5.44, x: 126, y: -4 },
  { t0: 5.7, t1: 6.04, x: 110, y: 150, x1: -70, y1: 150 },
  { t0: 6.3, t1: 6.4, x: -126, y: 92 },
];
const touchesAt = (t) => Math.round(2617 * ease.out(seg(t, 3.2, 6.6)));
function sHook(t) {
  stage(0.16 * ease.out(seg(t, 0, 0.8)));
  const k = ease.quint(seg(t, 0, 0.7));
  const f = gesture(t, TAPS1, [330, 760], [380, 820], 0.35, 7.0);
  phone(t, () => { homeScreen(touchesAt(t)); ripples(t, TAPS1); }, () => { if (f.visible) finger(f.x, f.y, f.lift); }, { dy: (1 - k) * 60, alpha: k });
}
TAPS1.forEach((c) => window.SFX.push({ t: c.t0, kind: 'click', gain: 0.32 }));

// ── 2 · the layers ───────────────────────────────────────────────────────────
// Each layer is a plane: rotated by theta in its own plane, squashed by sy (the tilt), lifted by z.
function plane(th, sy, sc, z, fn) {
  ctx.save(); ctx.translate(OBJ.x, OBJ.y - z); ctx.scale(sc, sc * sy); ctx.rotate(th); fn(); ctx.restore();
}
function planePoint(th, sy, sc, z, u, v) { return [OBJ.x + sc * (Math.cos(th) * u - Math.sin(th) * v), OBJ.y - z + sc * sy * (Math.sin(th) * u + Math.cos(th) * v)]; }
function sensorLayer(a, hi = 0) {
  ctx.globalAlpha = a;
  fillRR(-PW / 2, -PH / 2, PW, PH, PR, rgba(C.primary, 0.1 + 0.12 * hi));
  ctx.save(); rr(-PW / 2, -PH / 2, PW, PH, PR); ctx.clip();
  ctx.lineWidth = 3;
  for (let y = -PH / 2 + 30; y < PH / 2; y += 40) { ctx.strokeStyle = rgba('#7268ff', 0.55 + 0.4 * hi); ctx.beginPath(); ctx.moveTo(-PW / 2, y); ctx.lineTo(PW / 2, y); ctx.stroke(); }
  for (let x = -PW / 2 + 30; x < PW / 2; x += 40) { ctx.strokeStyle = rgba('#dcd9ff', 0.4 + 0.4 * hi); ctx.beginPath(); ctx.moveTo(x, -PH / 2); ctx.lineTo(x, PH / 2); ctx.stroke(); }
  ctx.restore();
  rr(-PW / 2, -PH / 2, PW, PH, PR); ctx.strokeStyle = rgba('#a49dff', 0.6 + 0.4 * hi); ctx.lineWidth = 3; ctx.stroke();
}
function glassLayer(a) {
  ctx.globalAlpha = a;
  const g = ctx.createLinearGradient(-PW / 2, -PH / 2, PW / 2, PH / 2);
  g.addColorStop(0, 'rgba(255,255,255,0.22)'); g.addColorStop(0.45, 'rgba(255,255,255,0.05)'); g.addColorStop(1, 'rgba(255,255,255,0.12)');
  fillRR(-PW / 2 - 15, -PH / 2 - 15, PW + 30, PH + 30, PR + 15, g);
  rr(-PW / 2 - 15, -PH / 2 - 15, PW + 30, PH + 30, PR + 15); ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.lineWidth = 2.5; ctx.stroke();
}
function displayLayer(a) {
  ctx.globalAlpha = a;
  phoneBody();
  ctx.save(); rr(-PW / 2, -PH / 2, PW, PH, PR); ctx.clip(); homeScreen(2617); ctx.restore();
}
function sLayers(t) {
  stage(0.16);
  const tilt = ease.inOut(seg(t, 8.2, 9.8)), open = ease.inOut(seg(t, 9.8, 11.4)), focus = ease.inOut(seg(t, 12.3, 13.1));
  const th = lerp(0, 0.6, tilt), sy = lerp(1, 0.5, tilt), sc = PS * lerp(1, V ? 0.66 : 0.8, tilt), spread = 175 * open;
  const dimOthers = 1 - 0.75 * focus;
  // the display, with an edge for thickness
  ctx.save(); ctx.globalAlpha = dimOthers;
  for (let d = 18 * tilt; d > 0; d -= 3) plane(th, sy, sc, -spread - d, () => { fillRR(-PW / 2 - 15, -PH / 2 - 15, PW + 30, PH + 30, PR + 15, '#0e0e14'); });
  plane(th, sy, sc, -spread, () => displayLayer(dimOthers));
  ctx.restore();
  // the touch sensor and the cover glass appear as the layers part
  const show = seg(t, 9.8, 10.6);
  plane(th, sy, sc, 0, () => sensorLayer(show, focus));
  plane(th, sy, sc, spread, () => glassLayer(show * dimOthers));
  // labels with leader lines
  const lx = V ? 872 : OBJ.x + 330;
  [['Cover glass', spread, 10.5], ['Touch sensor', 0, 10.75], ['Display', -spread, 11.0]].forEach(([s, z, at], i) => {
    const a = ease.out(seg(t, at, at + 0.4)) * (i === 1 ? 1 : dimOthers);
    if (a <= 0) return;
    const [px, py] = planePoint(th, sy, sc, z, PW / 2 + 15, -PH / 2 + 120);
    ctx.save(); ctx.globalAlpha = a;
    ctx.strokeStyle = i === 1 ? IN.mid : 'rgba(255,255,255,0.4)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(px + 6, py); ctx.lineTo(lx - 14, py); ctx.stroke();
    ctx.beginPath(); ctx.arc(px + 6, py, 5, 0, Math.PI * 2); ctx.fillStyle = i === 1 ? IN.mid : '#fff'; ctx.fill();
    text(s, lx, py, V ? 27 : 30, 700, i === 1 && focus > 0.5 ? IN.hi : '#fff');
    ctx.restore();
  });
}

// ── 3 · the grid ─────────────────────────────────────────────────────────────
// A diamond-pattern capacitive sensor: drive electrodes run across, sense electrodes run down, and the
// two cross at small bridges. The fringe field at each crossing is drawn as charge flowing in arcs
// from drive to sense diamonds. A finger near a crossing pulls some of that charge away.
const N = 8, S = G / N, D = S * 0.39;
const CROSS = [];
for (let i = 0; i < N; i++) for (let j = 1; j < N; j++) CROSS.push({ x: -G / 2 + (i + 0.5) * S, y: -G / 2 + j * S, i, j });
const PATHS = []; // field arcs: [ax, ay, cx, cy, bx, by, crossing index]
CROSS.forEach((p, ci) => {
  [[-1, -1], [-1, 1], [1, -1], [1, 1]].forEach(([sx, sy]) => {
    const dx = sx * S / 2, sy2 = sy * S / 2; // drive diamond at (p.x+dx, p.y), sense diamond at (p.x, p.y+sy2)
    const A = [p.x + dx * 0.7, p.y + sy2 * 0.3], B = [p.x + dx * 0.3, p.y + sy2 * 0.7];
    for (let k = 0; k < 2; k++) {
      const m = [p.x + dx * 0.5, p.y + sy2 * 0.5], out = S * (0.1 + 0.12 * k);
      PATHS.push([A[0], A[1], m[0] + sx * out * 0.707, m[1] + sy * out * 0.707, B[0], B[1], ci]);
    }
  });
});
const bez = (P, u) => { const v = 1 - u; return [v * v * P[0] + 2 * v * u * P[2] + u * u * P[4], v * v * P[1] + 2 * v * u * P[3] + u * u * P[5]]; };
function diamond(x, y, d) { ctx.beginPath(); ctx.moveTo(x - d, y); ctx.lineTo(x, y - d); ctx.lineTo(x + d, y); ctx.lineTo(x, y + d); ctx.closePath(); }
// The finger over the grid: arrives, presses, then drags.
const F0 = [V ? 70 : 60, V ? 60 : 40], F1 = [-150, -130];
function fingerGrid(t) {
  const arrive = ease.inOut(seg(t, 20.2, 21.15)), drag = ease.inOut(seg(t, 28.4, 30.2));
  const x = lerp(lerp(G * 0.42, F0[0], arrive), F1[0], drag), y = lerp(lerp(G * 0.62, F0[1], arrive), F1[1], drag);
  const contact = ease.out(seg(t, 20.95, 21.2));
  return { x, y, contact, alpha: seg(t, 20.1, 20.5) };
}
window.SFX.push({ t: 21.2, kind: 'click', gain: 0.7 }, { t: 27.05, kind: 'click', gain: 0.55 });
function sGrid(t) {
  stage(0.12);
  ctx.save(); ctx.translate(OBJ.x, OBJ.y);
  const fg = fingerGrid(t), field = ease.out(seg(t, 17.7, 18.7)), current = seg(t, 15.4, 16.2);
  const R = S * 1.25;
  const pull = (x, y) => fg.contact * Math.exp(-((x - fg.x) ** 2 + (y - fg.y) ** 2) / (R * R));
  // the sheet
  fillRR(-G / 2 - 24, -G / 2 - 24, G + 48, G + 48, 30, 'rgba(79,70,229,0.06)');
  rr(-G / 2 - 24, -G / 2 - 24, G + 48, G + 48, 30); ctx.strokeStyle = 'rgba(164,157,255,0.22)'; ctx.lineWidth = 2; ctx.stroke();
  ctx.save(); rr(-G / 2 - 24, -G / 2 - 24, G + 48, G + 48, 30); ctx.clip();
  // electrodes, wiping in on a diagonal
  const wipe = (i, j) => ease.out(seg(t, 14.25 + (i + j) * 0.035, 14.25 + (i + j) * 0.035 + 0.5));
  for (let j = 0; j <= N; j++) for (let i = 0; i <= N; i++) {
    const a = wipe(i, j); if (a <= 0) continue;
    const x = -G / 2 + i * S, y = -G / 2 + j * S;
    // drive (across): pulse travelling along each row
    const pulse = current * Math.max(0, 1 - Math.abs(fract(t * 0.55 + j * 0.137) * (N + 4) - 2 - i) / 1.4);
    ctx.globalAlpha = a;
    diamond(x, y, D); ctx.fillStyle = mix('#2a2580', '#7c74ff', pulse); ctx.fill();
    ctx.strokeStyle = rgba('#a49dff', 0.35 + 0.5 * pulse); ctx.lineWidth = 1.5; ctx.stroke();
    if (i < N) { fillRR(x + D - 2, y - 4, S - 2 * D + 4, 8, 3, mix('#2a2580', '#7c74ff', pulse)); }
    // sense (down)
    if (i < N && j < N) {
      const sx = x + S / 2, sy = y + S / 2;
      diamond(sx, sy, D); ctx.fillStyle = 'rgba(220,217,255,0.07)'; ctx.fill();
      ctx.strokeStyle = 'rgba(220,217,255,0.42)'; ctx.lineWidth = 1.5; ctx.stroke();
      if (j < N - 1) { fillRR(sx - 4, sy + D - 2, 8, S - 2 * D + 4, 3, 'rgba(220,217,255,0.5)'); }
    }
  }
  ctx.globalAlpha = 1;
  // heat map: what the controller measures (only once the scan has passed)
  const scanT = t - 24.3, sweep = 0.9;
  if (scanT > 0) {
    ctx.globalCompositeOperation = 'screen';
    CROSS.forEach((p) => {
      const seen = scanT > ((p.y + G / 2) / G) * sweep;
      const w = pull(p.x, p.y);
      if (!seen || w < 0.04) return;
      ctx.globalAlpha = Math.min(1, w * 1.2) * 0.8;
      fillRR(p.x - S * 0.36, p.y - S * 0.36, S * 0.72, S * 0.72, 12, mix(AMBER, C.risk, w));
    });
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  }
  // the field: a glow at each crossing and charge flowing along the arcs
  if (field > 0) {
    ctx.globalCompositeOperation = 'lighter';
    CROSS.forEach((p) => dot(p.x, p.y, S * 1.2, '#7268ff', 0.32 * field * (1 - 0.85 * pull(p.x, p.y))));
    PATHS.forEach((P, n) => {
      const ci = P[6], p = CROSS[ci], w = pull(p.x, p.y);
      const stolen = hash(n * 3.1) < w * 1.15;
      ctx.globalAlpha = 0.22 * field * (1 - 0.8 * w);
      ctx.strokeStyle = '#a49dff'; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(P[0], P[1]); ctx.quadraticCurveTo(P[2], P[3], P[4], P[5]); ctx.stroke();
      for (let q = 0; q < 2; q++) {
        const u = fract(t * 0.6 + hash(n + q * 0.37));
        const [bx, by] = bez(P, u);
        if (stolen && q === 0) {
          // pulled up into the finger
          const v = fract(t * 0.8 + hash(n * 7.7)), jx = (hash(n * 5.3) - 0.5) * 60, jy = (hash(n * 9.1) - 0.5) * 60;
          const e = ease.inOut(v), sw = Math.sin(v * Math.PI) * 26 * (hash(n) - 0.5);
          dot(lerp(bx, fg.x + jx, e) + sw, lerp(by, fg.y + jy, e) - sw, 15, '#ffd9b8', field * Math.sin(v * Math.PI) * 0.95);
        } else dot(bx, by, 17, '#dcd9ff', field * Math.pow(Math.sin(u * Math.PI), 0.6) * (1 - 0.7 * w) * 0.9);
      }
    });
    ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
  }
  // the scan line
  if (scanT > 0 && t < 28.6) {
    const yy = -G / 2 + G * fract(scanT / sweep), a = 1 - seg(t, 28.2, 28.6);
    const g = ctx.createLinearGradient(0, yy - 70, 0, yy + 6);
    g.addColorStop(0, 'rgba(164,157,255,0)'); g.addColorStop(1, `rgba(220,217,255,${0.35 * a})`);
    ctx.fillStyle = g; ctx.fillRect(-G / 2 - 24, yy - 70, G + 48, 76);
    ctx.fillStyle = `rgba(255,255,255,${0.8 * a})`; ctx.fillRect(-G / 2 - 24, yy, G + 48, 2.5);
  }
  ctx.restore();
  // the finger, drawn see-through so the grid shows beneath it
  if (fg.alpha > 0) {
    ctx.save();
    const lift = 1 - fg.contact;
    if (lift > 0.02) ctx.filter = `blur(${(16 * lift).toFixed(1)}px)`;
    finger(fg.x, fg.y, lift, { alpha: fg.alpha * lerp(0.35, 0.52, fg.contact), scale: lerp(2.1, 1.55, fg.contact) });
    ctx.restore();
    if (fg.contact > 0) { // the contact patch
      ctx.globalCompositeOperation = 'lighter';
      dot(fg.x, fg.y, 230, '#7268ff', 0.35 * fg.contact);
      ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
    }
  }
  // stolen charge drawn again over the finger so it reads as flowing into it
  if (fg.contact > 0 && field > 0) {
    ctx.globalCompositeOperation = 'lighter';
    PATHS.forEach((P, n) => {
      const p = CROSS[P[6]], w = pull(p.x, p.y);
      if (!(hash(n * 3.1) < w * 1.15)) return;
      const [bx, by] = bez(P, hash(n + 0.37)), v = fract(t * 0.8 + hash(n * 7.7)), e = ease.inOut(v);
      const jx = (hash(n * 5.3) - 0.5) * 60, jy = (hash(n * 9.1) - 0.5) * 60, sw = Math.sin(v * Math.PI) * 26 * (hash(n) - 0.5);
      dot(lerp(bx, fg.x + jx, e) + sw, lerp(by, fg.y + jy, e) - sw, 13, '#fff1e2', 0.6 * Math.sin(v * Math.PI) * fg.contact);
    });
    ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
  }
  // the controller's answer: a crosshair on the centre of the drop
  const lock = ease.quint(seg(t, 27.05, 27.45));
  if (lock > 0) {
    let sx = 0, sy = 0, sw = 0;
    CROSS.forEach((p) => { const w = pull(p.x, p.y); if (w > 0.08) { sx += p.x * w; sy += p.y * w; sw += w; } });
    const cx = sw ? sx / sw : fg.x, cy = sw ? sy / sw : fg.y, r = lerp(120, 50, lock);
    ctx.globalAlpha = lock;
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
    [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => { ctx.beginPath(); ctx.moveTo(cx + dx * (r - 14), cy + dy * (r - 14)); ctx.lineTo(cx + dx * (r + 22), cy + dy * (r + 22)); ctx.stroke(); });
    const px = Math.round(590 + (cx / G) * 1100), py = Math.round(1278 + (cy / G) * 2300);
    const label = `Touch · x ${px.toLocaleString('en-US')}, y ${py.toLocaleString('en-US')}`;
    const lw = tw(label, 24, 700) + 36;
    const lx2 = cx + 70, ly2 = cy - 96;
    fillRR(lx2, ly2 - 24, lw, 48, 24, '#fff');
    text(label, lx2 + lw / 2, ly2 + 1, 24, 700, '#000', 'center');
    ctx.globalAlpha = 1;
  }
  // scan note
  const na = ease.out(seg(t, 24.4, 24.9)) * (1 - seg(t, 28.2, 28.6));
  if (na > 0) { ctx.globalAlpha = na; text('SCANNING · SHOWN SLOWED DOWN', G / 2, -G / 2 - 56, 20, 700, IN.mid, 'right', 0.12); ctx.globalAlpha = 1; }
  ctx.restore();
}

// ── 4 · thousands of times a day ─────────────────────────────────────────────
const TAPS2 = (() => {
  const out = [], pts = [[-42, -4], [126, 92], [-126, -100], [42, 188], [-42, 92], [126, -100], [-126, 188], [42, -4], [-42, 188], [126, -4], [42, 92]];
  let tt = 31.05;
  pts.forEach(([x, y], i) => {
    if (i % 4 === 2) { out.push({ t0: tt, t1: tt + 0.3, x, y: 220, x1: x, y1: -40 }); tt += 0.52; }
    else { out.push({ t0: tt, t1: tt + 0.09, x, y }); tt += 0.33; }
  });
  return out;
})();
function sTurn(t) {
  stage(0.16);
  const f = gesture(t, TAPS2, [330, 760], [380, 820], 30.6, 35.6);
  phone(t, () => { homeScreen(2617); ripples(t, TAPS2); }, () => { if (f.visible) finger(f.x, f.y, f.lift); });
}
TAPS2.forEach((c) => window.SFX.push({ t: c.t0, kind: 'click', gain: 0.28 }));

// ── 5 · where the hours go, and MsgHealth taking them back ───────────────────
const ROWS = [
  { label: 'Reaching out to clients', sub: 'Texts, calls and follow-ups', auto: 'Automatic SMS & email', h: 3, icon: 'bubble', at: 36.0, flip: 45.6 },
  { label: 'Booking appointments', sub: 'Back-and-forth on times', auto: 'Clients book themselves', h: 1, icon: 'cal', at: 36.9, flip: 46.4 },
  { label: 'Rescheduling & cancellations', sub: 'Moving and re-filling slots', auto: 'Handled for you', h: 1, icon: 'redo', at: 37.8, flip: 47.2 },
  { label: 'Everything else', sub: 'The rest of your day', h: 1, icon: 'dots', at: 38.6 },
];
ROWS.forEach((r) => { window.SFX.push({ t: r.at, kind: 'click', gain: 0.4 }); if (r.flip) window.SFX.push({ t: r.flip, kind: 'sent', gain: 0.75 }); });
function glyph(kind, x, y) {
  ctx.save(); ctx.translate(x, y);
  ctx.strokeStyle = '#fff'; ctx.fillStyle = '#fff'; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath();
  if (kind === 'bubble') { ctx.roundRect(-14, -12, 28, 20, 7); ctx.moveTo(-6, 8); ctx.lineTo(-10, 15); ctx.lineTo(2, 8); ctx.stroke(); }
  else if (kind === 'cal') { ctx.roundRect(-13, -11, 26, 24, 5); ctx.moveTo(-13, -3); ctx.lineTo(13, -3); ctx.moveTo(-6, -15); ctx.lineTo(-6, -8); ctx.moveTo(6, -15); ctx.lineTo(6, -8); ctx.stroke(); }
  else if (kind === 'redo') { ctx.arc(0, 0, 12, -2.6, 2.0); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-15, -14); ctx.lineTo(-10, -6); ctx.lineTo(-2, -11); ctx.stroke(); }
  else { [-9, 0, 9].forEach((dx) => { ctx.beginPath(); ctx.arc(dx, 0, 3.2, 0, Math.PI * 2); ctx.fill(); }); }
  ctx.restore();
}
const CW = 700, ROWH = 118;
function hm(min) { const m = Math.round(min / 5) * 5; return `${Math.floor(m / 60)}h ${m % 60}m`; }
function sCard(t) {
  stage(lerp(0.12, 0.2, seg(t, 44.6, 45.6)));
  const ch = 200 + ROWS.length * ROWH + 24, x0 = OBJ.x - CW / 2, y0 = OBJ.y - ch / 2;
  const cin = ease.quint(seg(t, 35.6, 36.2));
  ctx.save(); ctx.globalAlpha = cin; ctx.translate(0, (1 - cin) * 40);
  ctx.translate(OBJ.x, OBJ.y); ctx.scale(CS, CS); ctx.translate(-OBJ.x, -OBJ.y);
  glass(x0, y0, CW, ch, 36, { fill: 'rgba(255,255,255,0.06)' });
  const pad = 44;
  text('SCREEN TIME · DAILY AVERAGE', x0 + pad, y0 + 54, 19, 700, IN.mid, 'left', 0.12);
  let min = 0, cut = 0;
  ROWS.forEach((r) => { const f = r.flip ? ease.inOut(seg(t, r.flip, r.flip + 0.9)) : 0, m = r.h * 60 * ease.out(seg(t, r.at, r.at + 0.8)); min += m * (1 - f); cut += m * f; });
  text(hm(min), x0 + pad, y0 + 118, 72, 800, '#fff', 'left', -0.035);
  if (t >= 45.6) { ctx.save(); ctx.globalAlpha *= ease.out(seg(t, 45.6, 46.0)); pill(x0 + CW - pad, y0 + 118, `${hm(cut)} saved`, '#3dbb74', 24, 'right'); ctx.restore(); }
  fillRR(x0 + pad, y0 + 170, CW - 2 * pad, 1.5, 1, 'rgba(255,255,255,0.12)');
  ROWS.forEach((r, i) => {
    const ry = y0 + 196 + i * ROWH, a = ease.quint(seg(t, r.at, r.at + 0.5));
    if (a <= 0) return;
    const f = r.flip ? ease.inOut(seg(t, r.flip, r.flip + 0.6)) : 0;
    const col = r.h && r.icon !== 'dots' ? mix(AMBER, '#7268ff', f) : '#7c8aa5';
    ctx.save(); ctx.globalAlpha *= a; ctx.translate((1 - a) * 30, 0);
    ctx.beginPath(); ctx.arc(x0 + pad + 30, ry + 46, 30, 0, Math.PI * 2); ctx.fillStyle = rgba(col, 0.85); ctx.fill();
    if (f > 0.5) check(x0 + pad + 30, ry + 46, 26, '#fff', 4); else glyph(r.icon, x0 + pad + 30, ry + 46);
    const tx = x0 + pad + 80;
    text(r.label, tx, ry + 30, 27, 600, '#fff');
    ctx.save(); ctx.globalAlpha *= 1 - f; text(r.sub, tx, ry + 64, 20, 500, SOFT); ctx.restore();
    if (r.auto) { ctx.save(); ctx.globalAlpha *= f; text(r.auto, tx, ry + 64, 20, 600, IN.hi); ctx.restore(); }
    // time, or the Automatic pill
    ctx.save(); ctx.globalAlpha *= 1 - f; text(`${r.h}h`, x0 + CW - pad, ry + 30, 30, 700, '#fff', 'right'); ctx.restore();
    if (f > 0) { ctx.save(); ctx.globalAlpha *= f; pill(x0 + CW - pad, ry + 30, 'Automatic', C.primary, 18, 'right', true); ctx.restore(); }
    // bar
    const bw = CW - pad - (tx - x0) - 0, grow = ease.out(seg(t, r.at + 0.1, r.at + 0.9)), drain = r.flip ? ease.inOut(seg(t, r.flip, r.flip + 0.9)) : 0;
    fillRR(tx, ry + 92, bw, 10, 5, 'rgba(255,255,255,0.08)');
    const fw = bw * (r.h / 3) * grow * (1 - drain);
    if (fw > 1) fillRR(tx, ry + 92, fw, 10, 5, col);
    ctx.restore();
  });
  ctx.restore();
}
window.SFX.push({ t: 44.6, kind: 'snap', gain: 0.8 }, { t: 44.6, kind: 'riser', gain: 0.7 });

// ── 6 · without lifting a finger ─────────────────────────────────────────────
const NOTES = [
  { at: 53.8, s: 'Follow-ups sent to 14 clients' },
  { at: 54.5, s: 'Maya booked · Thu, 2:00 PM' },
  { at: 55.2, s: 'Leo moved to Fri, 10:30 AM' },
  { at: 55.9, s: 'Reminders sent for Saturday' },
];
NOTES.forEach((n) => window.SFX.push({ t: n.at, kind: 'sent', gain: 0.8 }));
function lockScreen(t) {
  screenBg(); statusBar('10:42');
  text('Tuesday, October 20', 0, -PH / 2 + 104, 20, 600, SOFT, 'center');
  text('10:42', 0, -PH / 2 + 172, 96, 700, '#fff', 'center', -0.03);
  NOTES.forEach((n, i) => {
    const k = ease.quint(seg(t, n.at, n.at + 0.45));
    if (k <= 0) return;
    const newer = NOTES.filter((m, j) => j > i).reduce((p, m) => p + ease.quint(seg(t, m.at, m.at + 0.45)), 0);
    const y = -PH / 2 + 262 + newer * 102 + (1 - k) * -30;
    ctx.save(); ctx.globalAlpha *= k;
    const sc = lerp(0.92, 1, k); ctx.translate(0, y + 46); ctx.scale(sc, sc); ctx.translate(0, -(y + 46));
    glass(-172, y, 344, 92, 26, { fill: 'rgba(255,255,255,0.16)', stroke: 'rgba(255,255,255,0.18)' });
    fillRR(-156, y + 18, 40, 40, 11, '#fff');
    if (LOGO) ctx.drawImage(LOGO, -152, y + 22, 32, 32);
    text('MSGHEALTH', -104, y + 30, 13, 700, SOFT, 'left', 0.08);
    text('now', 156, y + 30, 13, 500, SOFT, 'right');
    let fs = 18; while (tw(n.s, fs, 600) > 256 && fs > 14) fs -= 0.5;
    text(n.s, -104, y + 60, fs, 600, '#fff');
    ctx.restore();
  });
  fillRR(-60, PH / 2 - 16, 120, 5, 2.5, 'rgba(255,255,255,0.75)');
}
function sHands(t) {
  stage(0.18);
  const away = ease.inOut(seg(t, 52.95, 53.9));
  phone(t, () => lockScreen(t), () => {
    if (away >= 1) return;
    ctx.save(); ctx.globalAlpha = 1 - seg(t, 53.5, 53.9);
    if (away > 0.02) ctx.filter = `blur(${(14 * away).toFixed(1)}px)`;
    finger(lerp(60, 330, away), lerp(150, 760, away), Math.min(1, ease.out(seg(t, 52.95, 53.2)) + away * 0.6), { scale: 1 + 0.35 * away });
    ctx.restore();
  });
}

// ── 7 · end card ─────────────────────────────────────────────────────────────
window.SFX.push({ t: 57.8, kind: 'snap', gain: 0.9 });
function sEnd(t) {
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  const cy = H / 2 - 40, g = ctx.createRadialGradient(W / 2, cy, 0, W / 2, cy, 620);
  g.addColorStop(0, rgba(C.primary, 0.2)); g.addColorStop(1, rgba(C.primary, 0)); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const ls = V ? 130 : 150, size = V ? 110 : 132, ww = tw(BRAND.name, size, 700, -0.035), gap = -0.06 * ls, full = ls + gap + ww;
  const lx = W / 2 - full / 2 + ls / 2, tx = lx + ls / 2 + gap;
  const k = ease.quint(seg(t, 57.8, 58.1));
  ctx.save(); ctx.globalAlpha = k;
  const gl = ctx.createRadialGradient(lx, cy, 0, lx, cy, ls * 0.8); gl.addColorStop(0, 'rgba(99,102,241,0.34)'); gl.addColorStop(1, 'rgba(99,102,241,0)');
  ctx.fillStyle = gl; ctx.fillRect(lx - ls, cy - ls, ls * 2, ls * 2);
  if (LOGO) ctx.drawImage(LOGO, lx - ls / 2, cy - ls / 2, ls, ls);
  text(BRAND.name, tx, cy + size * 0.04, size, 700, '#e4e4ec', 'left', -0.035);
  ctx.restore();
  const k2 = ease.quint(seg(t, 58.5, 59.1));
  ctx.save(); ctx.globalAlpha = k2; ctx.translate(0, (1 - k2) * 24);
  font(V ? 56 : 60, 700, -0.035); const tag = 'Get your hours back.', tagW = ctx.measureText(tag).width;
  text(tag, W / 2, cy + 150, V ? 56 : 60, 700, brandGrad(W / 2 - tagW / 2, W / 2 + tagW / 2), 'center', -0.035);
  ctx.restore();
  const k3 = ease.quint(seg(t, 59.2, 59.8));
  ctx.save(); ctx.globalAlpha = k3; text(BRAND.url, W / 2, cy + 236, 38, 500, SOFT, 'center'); ctx.restore();
  const out = seg(t, DURATION - 0.8, DURATION);
  if (out > 0) { ctx.fillStyle = `rgba(0,0,0,${out})`; ctx.fillRect(0, 0, W, H); }
}

// ── the edit ─────────────────────────────────────────────────────────────────
// [start, end, scene, transition into it, its length]. No transition means a straight cut.
const SCENES = [
  [0, 7.0, sHook],
  [7.0, 14.2, sLayers],               // same phone, so a straight cut
  [14.2, 30.6, sGrid, 'zoomIn', 0.9],
  [30.6, 35.6, sTurn, 'zoomOut', 0.8],
  [35.6, 52.6, sCard, 'cross', 0.6],
  [52.6, 57.8, sHands, 'cross', 0.6],
  [57.8, DURATION + 1, sEnd],         // straight cut, with a snap
];
SCENES.forEach(([st, , , type, dur]) => { if (type) window.SFX.push({ t: st + dur / 2, kind: 'whoosh', gain: type === 'cross' ? 0.4 : 0.8 }); });
window.SFX.push({ t: 9.0, kind: 'whoosh', gain: 0.45 }, { t: 10.6, kind: 'whoosh', gain: 0.6 });

function renderInto(k, fn, t) {
  const c = OFF[k]; ctx = c.getContext('2d');
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.filter = 'none'; ctx.globalCompositeOperation = 'source-over';
  fn(t);
  return c;
}
function drawScaled(img, s, a) {
  ctx.save(); ctx.globalAlpha = a;
  ctx.translate(OBJ.x, OBJ.y); ctx.scale(s, s); ctx.translate(-OBJ.x, -OBJ.y);
  ctx.drawImage(img, 0, 0); ctx.restore();
}
function transition(type, p, A, B) {
  const e = ease.inOut(p);
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  if (type === 'zoomIn') { drawScaled(A, 1 + 0.9 * e, 1 - e); drawScaled(B, 0.7 + 0.3 * e, e); }
  else if (type === 'zoomOut') { drawScaled(A, 1 - 0.45 * e, 1 - e); drawScaled(B, 1.5 - 0.5 * e, e); }
  else { drawScaled(A, 1, 1); drawScaled(B, 1, e); }
}
function renderFrame(t) {
  ctx = MAIN;
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.filter = 'none'; ctx.globalCompositeOperation = 'source-over';
  const i = Math.max(0, SCENES.findIndex(([s, e]) => t >= s && t < e));
  const [start, , fn, type, dur] = SCENES[i];
  if (i > 0 && type && t < start + dur) {
    const A = renderInto(0, SCENES[i - 1][2], t), B = renderInto(1, fn, t);
    ctx = MAIN; transition(type, (t - start) / dur, A, B);
  } else fn(t);
  ctx = MAIN; ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.filter = 'none';
  drawCaptions(t);
}

window.DURATION = DURATION;
window.renderFrame = renderFrame;
window.ready = (async () => {
  MAIN = document.getElementById('c').getContext('2d');
  ctx = MAIN;
  for (let k = 0; k < 2; k++) { const c = document.createElement('canvas'); c.width = W; c.height = H; OFF.push(c); }
  await Promise.all(['400', '500', '600', '700', '800'].map((w) => document.fonts.load(`${w} 40px ${FONT}`)));
  LOGO = await new Promise((res) => { const im = new Image(); im.onload = () => res(im); im.onerror = () => res(null); im.src = BRAND.logoFile; });
  if (location.search.includes('render')) document.body.classList.add('render');
  renderFrame(0);
  return true;
})();

// ── player (silent preview; the soundtrack is built at render time) ──────────
(() => {
  const btn = document.getElementById('play'), seek = document.getElementById('seek'), tm = document.getElementById('time');
  let playing = false, cur = 0, t0 = 0, w0 = 0;
  const show = (t) => { cur = t; renderFrame(t); seek.value = (t / DURATION) * 1000; tm.textContent = `${t.toFixed(1)}s / ${DURATION}s`; };
  const loop = (now) => {
    if (!playing) return;
    const t = cur0() + (now - w0) / 1000;
    if (t >= DURATION) { playing = false; btn.textContent = 'Replay'; show(DURATION); return; }
    show(t); requestAnimationFrame(loop);
  };
  const cur0 = () => t0;
  btn.onclick = () => {
    if (playing) { playing = false; btn.textContent = 'Play'; return; }
    if (cur >= DURATION) cur = 0;
    t0 = cur; w0 = performance.now(); playing = true; btn.textContent = 'Pause'; requestAnimationFrame(loop);
  };
  seek.oninput = () => { playing = false; btn.textContent = 'Play'; show((seek.value / 1000) * DURATION); };
  window.ready.then(() => { const q = new URLSearchParams(location.search).get('t'); if (q) show(+q); });
})();
