// MsgHealth · "Every touch" · 38s explainer ad (1920 × 1080 or 1080 × 1920, 60 fps).
// Opens on a finger tapping a phone ("You're on your phone 5 hours a day"), takes the screen apart layer by
// layer, zooms into the touch sensor's grid of see-through electrodes and shows how a capacitive
// touchscreen finds a finger: every crossing holds a small electric field, the finger pulls some of that
// charge away, the controller scans the grid and finds the drop. Then it turns: a service business spends
// about 2 hours a day on client admin (booking, reminders, rescheduling, follow-ups, review requests).
// MsgHealth does it automatically, "without lifting a finger". Captions carry the story, so it works with
// the sound off. Everything before MsgHealth is named is slate and electric cyan; the brand indigo only
// arrives with the brand (BRAND_AT).
'use strict';

// Output frame: 16:9 (screen.html) or 9:16 (screen-vertical.html sets window.FORMAT.vertical). The short
// side is 1080 in both, so every object is sized once; only where things sit changes.
const V = !!(window.FORMAT && window.FORMAT.vertical);
const W = V ? 1080 : 1920, H = V ? 1920 : 1080;
// The story is written on its own clock (STORY seconds). RETIME maps it onto the music: every cut lands on a
// beat of assets/audio/screen-track.m4a ("Timeless" instrumental from its drop, 120 BPM: a beat every 0.5 s,
// bars at 0.91 + 2k s, and the drum pattern restarts every 4 s at 0.91 + 4k). MsgHealth arrives at the top of
// a phrase (24.91 s) and the end card lands on the next-but-one (32.91 s). [music time, story time] pairs;
// time between them is stretched linearly.
const STORY = 38.0;
const RETIME = [[0, 0], [3.91, 4.0], [6.91, 7.6], [16.91, 17.0], [19.41, 19.6], [24.91, 25.3], [30.91, 31.4], [32.91, 34.2], [36.91, STORY]];
const DURATION = 36.91; // the film ends as the phrase after the end card's comes round
function remap(v, from, to) {
  for (let i = 1; i < RETIME.length; i++) {
    const a = RETIME[i - 1], b = RETIME[i];
    if (v <= b[from] || i === RETIME.length - 1) return a[to] + (b[to] - a[to]) * Math.max(0, Math.min(1, (v - a[from]) / (b[from] - a[from])));
  }
}
const storyAt = (t) => remap(t, 0, 1), filmAt = (st) => remap(st, 1, 0);
const BRAND_AT = 25.3; // MsgHealth is named here; the brand colour arrives with it
const C = BRAND.colors;
const FONT = 'Inter';
const SOFT = 'rgba(235,235,245,0.62)', MUTED = 'rgba(235,235,245,0.42)';
const IN = { hi: '#dcd9ff', mid: '#a49dff', deep: '#7268ff', glow: C.primary };
// Before the brand: electric cyan for the science, on slate.
const SCI = { hi: '#e0f7ff', mid: '#7dd3fc', deep: '#38bdf8', glow: '#0ea5e9' }, SLATE = '#5b6b80';
const AMBER = '#f2b441', SKIN = { hi: '#e2a888', mid: '#c98a68', lo: '#a36a4e', nail: '#efc6b2' };

// Layout. The object (phone, grid, card) sits right of the captions in 16:9, below them in 9:16.
const OBJ = V ? { x: 540, y: 1190 } : { x: 1340, y: 540 };
// Captions hang from a fixed first line (y) so nothing moves when a caption has more or fewer lines; the
// eyebrow sits a fixed distance above it.
const CAP = V ? { x: 540, y: 300, w: 960, size: 72, align: 'center' } : { x: 140, y: 450, w: 740, size: 68, align: 'left' };
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
const brandGrad = (x0, x1, P = IN) => { const g = ctx.createLinearGradient(x0, 0, x1, 0); g.addColorStop(0, P.hi); g.addColorStop(0.5, P.mid); g.addColorStop(1, P.deep); return g; };
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
function stage(glow = 0.16, col = SLATE) {
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  if (glow <= 0) return;
  const R = 760, g = ctx.createRadialGradient(OBJ.x, OBJ.y, 0, OBJ.x, OBJ.y, R);
  g.addColorStop(0, rgba(col, glow)); g.addColorStop(1, rgba(col, 0));
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}

// ── captions ─────────────────────────────────────────────────────────────────
// Words between *stars* take the brand gradient. Each caption fades up out of a blur and leaves upward.
const CAPS = [
  { at: 0.2, out: 2.05, s: "You're on your phone *5 hours a day.*" },
  { at: 2.15, out: 3.95, s: 'Ever wonder how it *knows where you touch?*' },
  { at: 4.1, out: 5.75, s: "It's a *stack of layers.*" },
  { at: 5.85, out: 7.55, s: 'The trick is the *touch sensor.*' },
  { at: 7.8, out: 10.6, s: 'A grid of invisible wires. Every crossing holds an *electric field.*' },
  { at: 10.75, out: 13.25, s: 'Your finger conducts. It *pulls charge away.*' },
  { at: 13.35, out: 15.35, s: 'The phone scans for the drop *over 100 times a second.*' },
  { at: 15.45, out: 16.95, s: "*That's your touch.*" },
  { at: 17.2, out: 19.55, s: 'Run a business? A lot of those touches are *for clients.*' },
  { at: 19.8, out: 22.55, s: 'Booking. Reminders. Rescheduling. *Follow-ups.*' },
  { at: 22.65, out: 25.2, s: '*Over 2 hours a day*, just keeping your calendar full.' },
  { at: 25.3, out: 28.2, s: 'It does all of that *for you.*' },
  { at: 28.3, out: 31.3, s: "That's *2 hours back.* Every day." },
  { at: 31.55, out: 34.05, s: 'Without *lifting a finger.*' },
];
const EYES = [
  { at: 19.8, out: 25.2, s: 'A TYPICAL DAY' },
  { at: 25.3, out: 31.3, logo: true },
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
    const lines = capLines(c), lh = lineH(), y0 = CAP.y;
    lines.forEach(({ l, width, sp }, i) => {
      const f = fadeState(t, c.at, c.out, i), y = y0 + i * lh + f.dy;
      if (f.a <= 0.001) return;
      ctx.save(); ctx.globalAlpha = f.a; if (f.blur > 0.3) ctx.filter = `blur(${f.blur.toFixed(1)}px)`;
      let x = CAP.align === 'center' ? CAP.x - width / 2 : CAP.x;
      font(CAP.size, 700, -0.035); ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      l.forEach((w) => { ctx.fillStyle = w.acc ? brandGrad(x, x + w.width, c.at >= BRAND_AT ? IN : SCI) : silver(y, CAP.size); ctx.fillText(w.w, x, y); x += w.width + sp; });
      ctx.restore();
    });
  });
  EYES.forEach((e) => {
    if (t < e.at || t > e.out) return;
    const y = CAP.y - CAP.size * 0.62 - 44;
    const f = fadeState(t, e.at, e.out);
    ctx.save(); ctx.globalAlpha = f.a; if (f.blur > 0.3) ctx.filter = `blur(${f.blur.toFixed(1)}px)`;
    if (e.logo) {
      const ls = 64, ww = tw(BRAND.name, 40, 700, -0.03), full = ls + 12 + ww;
      const x0 = CAP.align === 'center' ? CAP.x - full / 2 : CAP.x;
      if (LOGO) ctx.drawImage(LOGO, x0, y - ls / 2 + f.dy, ls, ls);
      text(BRAND.name, x0 + ls + 12, y + f.dy + 2, 40, 700, '#fff', 'left', -0.03);
    } else text(e.s, CAP.x, y + f.dy, 22, 700, SCI.mid, CAP.align, 0.14);
    ctx.restore();
  });
}

// ── the finger ───────────────────────────────────────────────────────────────
// Two cursor-style hands (assets/img): the pointing hand with its click lines while the finger is pressing, the
// middle finger while it hovers. Drawn in the local space of whatever it touches; (x, y) is the fingertip's
// pad, where it meets the glass. lift 0 = pressing, 1 = hovering just above.
const HANDS = {
  tap: { src: 'assets/img/hand-tap.png', tipX: 110.5, padY: 117, finger: 61 },     // index finger, click lines round the tip
  hover: { src: 'assets/img/hand-hover.png', tipX: 395.5, padY: 63, finger: 126 }, // middle finger
};
const FINGER_W = 70; // fingertip width on the glass, phone units
function finger(x, y, lift = 0, o = {}) {
  const a = o.alpha ?? 1, h = HANDS[lift > 0.5 ? 'hover' : 'tap'];
  if (a <= 0 || !h.img) return;
  const k = FINGER_W / h.finger, base = ctx.filter === 'none' ? '' : `${ctx.filter} `;
  const place = () => { ctx.rotate(-0.12); ctx.scale(k, k); ctx.translate(-h.tipX, -h.padY); };
  ctx.save();
  ctx.translate(x, y); ctx.scale(o.scale ?? 1, o.scale ?? 1);
  // shadow: further away and softer as the finger lifts
  ctx.save();
  ctx.globalAlpha *= a * (0.4 - 0.18 * lift);
  ctx.filter = `${base}brightness(0) blur(${(8 + 18 * lift).toFixed(1)}px)`;
  ctx.translate(14 + 40 * lift, 20 + 52 * lift); place();
  ctx.drawImage(h.img, 0, 0);
  ctx.restore();
  ctx.translate(10 * lift, 14 * lift); const s = 1 + 0.07 * lift; ctx.scale(s, s);
  ctx.globalAlpha *= a; place();
  ctx.drawImage(h.img, 0, 0);
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
      ctx.beginPath(); ctx.arc(c.x, c.y, 26 * (1 - k * 0.5), 0, Math.PI * 2); ctx.fillStyle = `rgba(125,211,252,${0.28 * (1 - k)})`; ctx.fill();
    }
    if (c.x1 != null && t > c.t0 && t < c.t1 + 0.35) {
      const k1 = ease.inOut(seg(t, c.t0, c.t1)), fade = 1 - seg(t, c.t1, c.t1 + 0.35);
      const x0 = lerp(c.x, c.x1, Math.max(0, k1 - 0.35)), y0 = lerp(c.y, c.y1, Math.max(0, k1 - 0.35)), xe = lerp(c.x, c.x1, k1), ye = lerp(c.y, c.y1, k1);
      const g = ctx.createLinearGradient(x0, y0, xe, ye); g.addColorStop(0, 'rgba(125,211,252,0)'); g.addColorStop(1, `rgba(125,211,252,${0.45 * fade})`);
      ctx.strokeStyle = g; ctx.lineWidth = 22; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(xe, ye); ctx.stroke();
    }
  });
}

// ── the phone ────────────────────────────────────────────────────────────────
const APPS = ['#5a6b85', '#2bb3a3', '#ec6f5a', '#f2b441', '#7c8aa5', '#3d8bf0', '#c25bd6', '#3dbb74', '#e8577f', '#5fa8d3', '#4fb3a0', '#f08a3d', '#47b8c9', '#8a93a8', '#d94f4f', '#6fbf5a'];
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
function screenBg(brand = false) {
  const g = ctx.createLinearGradient(0, -PH / 2, 0, PH / 2);
  if (brand) { g.addColorStop(0, '#221d5c'); g.addColorStop(0.55, '#110f2a'); g.addColorStop(1, '#07070d'); }
  else { g.addColorStop(0, '#2c3540'); g.addColorStop(0.55, '#14181e'); g.addColorStop(1, '#08090b'); }
  ctx.fillStyle = g; ctx.fillRect(-PW / 2, -PH / 2, PW, PH);
  const gc = brand ? '114,104,255' : '125,211,252';
  const r = ctx.createRadialGradient(-60, -260, 0, -60, -260, 380); r.addColorStop(0, `rgba(${gc},${brand ? 0.35 : 0.16})`); r.addColorStop(1, `rgba(${gc},0)`);
  ctx.fillStyle = r; ctx.fillRect(-PW / 2, -PH / 2, PW, PH);
}
function statusBar(time = '9:41') {
  text(time, -PW / 2 + 40, -PH / 2 + 30, 17, 600, '#fff');
  for (let i = 0; i < 4; i++) fillRR(PW / 2 - 104 + i * 7, -PH / 2 + 34 - 4 - i * 3, 4.5, 6 + i * 3, 1.5, '#fff');
  rr(PW / 2 - 64, -PH / 2 + 22, 30, 15, 4); ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 1.5; ctx.stroke();
  fillRR(PW / 2 - 62, -PH / 2 + 24, 21, 11, 2.5, '#fff');
  fillRR(-46, -PH / 2 + 14, 92, 28, 14, '#000'); // the island
}
// Home screen with a Screen Time widget. `pickups` is the counter shown in the widget.
function homeScreen(pickups) {
  screenBg(); statusBar();
  glass(-166, -318, 332, 150, 28, { fill: 'rgba(255,255,255,0.09)', stroke: 'rgba(255,255,255,0.14)' });
  text('Screen Time', -142, -290, 17, 600, SOFT);
  text('5h 1m', -142, -248, 44, 800, '#fff', 'left', -0.03);
  const bars = [0.55, 0.8, 0.62, 0.9, 0.7, 0.95, 1];
  bars.forEach((v, i) => fillRR(54 + i * 14, -232 - 58 * v, 8, 58 * v, 3, i === 6 ? SCI.mid : 'rgba(255,255,255,0.32)'));
  text('Pickups today', -142, -198, 16, 500, SOFT);
  text(pickups.toLocaleString('en-US'), 142, -198, 19, 700, '#fff', 'right');
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

// ── 1 · hook: 5 hours a day ───────────────────────────────────────────────
const TAPS1 = [
  { t0: 0.45, t1: 0.55, x: -42, y: -4 },
  { t0: 0.82, t1: 1.15, x: 70, y: 210, x1: 70, y1: -70 },
  { t0: 1.4, t1: 1.48, x: 126, y: 92 },
  { t0: 1.7, t1: 1.78, x: -126, y: -100 },
  { t0: 2.0, t1: 2.3, x: -30, y: 220, x1: -30, y1: -30 },
  { t0: 2.55, t1: 2.63, x: 42, y: -100 },
  { t0: 2.83, t1: 2.91, x: -42, y: 188 },
  { t0: 3.1, t1: 3.18, x: 126, y: -4 },
  { t0: 3.36, t1: 3.44, x: -126, y: 92 },
];
const PICKUPS = 186; // average checks a day, Reviews.org 2025
const pickupsAt = (t) => Math.round(PICKUPS * ease.out(seg(t, 0.3, 3.5)));
function sHook(t) {
  stage(0.16 * ease.out(seg(t, 0, 0.5)));
  const k = ease.quint(seg(t, 0, 0.4));
  const f = gesture(t, TAPS1, [330, 760], [380, 820], 0.12, 3.95);
  phone(t, () => { homeScreen(pickupsAt(t)); ripples(t, TAPS1); }, () => { if (f.visible) finger(f.x, f.y, f.lift); }, { dy: (1 - k) * 60, alpha: k });
}
TAPS1.forEach((c) => window.SFX.push({ t: c.t0, kind: 'tap', gain: 1.6 }));

// ── 2 · the layers ───────────────────────────────────────────────────────────
// Each layer is a plane: rotated by theta in its own plane, squashed by sy (the tilt), lifted by z.
function plane(th, sy, sc, z, fn) {
  ctx.save(); ctx.translate(OBJ.x, OBJ.y - z); ctx.scale(sc, sc * sy); ctx.rotate(th); fn(); ctx.restore();
}
function planePoint(th, sy, sc, z, u, v) { return [OBJ.x + sc * (Math.cos(th) * u - Math.sin(th) * v), OBJ.y - z + sc * sy * (Math.sin(th) * u + Math.cos(th) * v)]; }
function sensorLayer(a, hi = 0) {
  ctx.globalAlpha = a;
  fillRR(-PW / 2, -PH / 2, PW, PH, PR, rgba(SCI.glow, 0.1 + 0.12 * hi));
  ctx.save(); rr(-PW / 2, -PH / 2, PW, PH, PR); ctx.clip();
  ctx.lineWidth = 3;
  for (let y = -PH / 2 + 30; y < PH / 2; y += 40) { ctx.strokeStyle = rgba(SCI.deep, 0.55 + 0.4 * hi); ctx.beginPath(); ctx.moveTo(-PW / 2, y); ctx.lineTo(PW / 2, y); ctx.stroke(); }
  for (let x = -PW / 2 + 30; x < PW / 2; x += 40) { ctx.strokeStyle = rgba(SCI.hi, 0.4 + 0.4 * hi); ctx.beginPath(); ctx.moveTo(x, -PH / 2); ctx.lineTo(x, PH / 2); ctx.stroke(); }
  ctx.restore();
  rr(-PW / 2, -PH / 2, PW, PH, PR); ctx.strokeStyle = rgba(SCI.mid, 0.6 + 0.4 * hi); ctx.lineWidth = 3; ctx.stroke();
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
  ctx.save(); rr(-PW / 2, -PH / 2, PW, PH, PR); ctx.clip(); homeScreen(PICKUPS); ctx.restore();
}
function sLayers(t) {
  stage(0.16);
  const tilt = ease.inOut(seg(t, 4.0, 4.75)), open = ease.inOut(seg(t, 4.75, 5.45)), focus = ease.inOut(seg(t, 5.85, 6.35));
  const th = lerp(0, 0.6, tilt), sy = lerp(1, 0.5, tilt), sc = PS * lerp(1, V ? 0.66 : 0.8, tilt), spread = 175 * open;
  const dimOthers = 1 - 0.75 * focus;
  // the display, with an edge for thickness
  ctx.save(); ctx.globalAlpha = dimOthers;
  for (let d = 18 * tilt; d > 0; d -= 3) plane(th, sy, sc, -spread - d, () => { fillRR(-PW / 2 - 15, -PH / 2 - 15, PW + 30, PH + 30, PR + 15, '#0e0e14'); });
  plane(th, sy, sc, -spread, () => displayLayer(dimOthers));
  ctx.restore();
  // the touch sensor and the cover glass appear as the layers part
  const show = seg(t, 4.75, 5.2);
  plane(th, sy, sc, 0, () => sensorLayer(show, focus));
  plane(th, sy, sc, spread, () => glassLayer(show * dimOthers));
  // labels with leader lines
  const lx = V ? 872 : OBJ.x + 330;
  [['Cover glass', spread, 5.1], ['Touch sensor', 0, 5.22], ['Display', -spread, 5.34]].forEach(([s, z, at], i) => {
    const a = ease.out(seg(t, at, at + 0.3)) * (i === 1 ? 1 : dimOthers) * (1 - seg(t, 7.25, 7.5)); // gone before the zoom
    if (a <= 0) return;
    const [px, py] = planePoint(th, sy, sc, z, PW / 2 + 15, -PH / 2 + 120);
    ctx.save(); ctx.globalAlpha = a;
    ctx.strokeStyle = i === 1 ? SCI.mid : 'rgba(255,255,255,0.4)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(px + 6, py); ctx.lineTo(lx - 14, py); ctx.stroke();
    ctx.beginPath(); ctx.arc(px + 6, py, 5, 0, Math.PI * 2); ctx.fillStyle = i === 1 ? SCI.mid : '#fff'; ctx.fill();
    text(s, lx, py, V ? 27 : 30, 700, i === 1 && focus > 0.5 ? SCI.hi : '#fff');
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
  const arrive = ease.inOut(seg(t, 10.25, 10.95)), drag = ease.inOut(seg(t, 15.4, 16.6));
  const x = lerp(lerp(G * 0.42, F0[0], arrive), F1[0], drag), y = lerp(lerp(G * 0.62, F0[1], arrive), F1[1], drag);
  const contact = ease.out(seg(t, 10.8, 11.0));
  return { x, y, contact, alpha: seg(t, 10.15, 10.45) };
}
window.SFX.push({ t: 11.0, kind: 'tap', gain: 1.8 }, { t: 14.6, kind: 'ding', gain: 0.6 }); // finger down; the touch is pinned
function sGrid(t) {
  stage(0.12);
  ctx.save(); ctx.translate(OBJ.x, OBJ.y);
  const fg = fingerGrid(t), field = ease.out(seg(t, 8.3, 9.0)), current = seg(t, 7.9, 8.3);
  const R = S * 1.25;
  const pull = (x, y) => fg.contact * Math.exp(-((x - fg.x) ** 2 + (y - fg.y) ** 2) / (R * R));
  // the sheet
  fillRR(-G / 2 - 24, -G / 2 - 24, G + 48, G + 48, 30, 'rgba(14,165,233,0.05)');
  rr(-G / 2 - 24, -G / 2 - 24, G + 48, G + 48, 30); ctx.strokeStyle = 'rgba(125,211,252,0.22)'; ctx.lineWidth = 2; ctx.stroke();
  ctx.save(); rr(-G / 2 - 24, -G / 2 - 24, G + 48, G + 48, 30); ctx.clip();
  // electrodes, wiping in on a diagonal
  const wipe = (i, j) => ease.out(seg(t, 7.6 + (i + j) * 0.025, 7.6 + (i + j) * 0.025 + 0.35));
  for (let j = 0; j <= N; j++) for (let i = 0; i <= N; i++) {
    const a = wipe(i, j); if (a <= 0) continue;
    const x = -G / 2 + i * S, y = -G / 2 + j * S;
    // drive (across): pulse travelling along each row
    const pulse = current * Math.max(0, 1 - Math.abs(fract(t * 0.55 + j * 0.137) * (N + 4) - 2 - i) / 1.4);
    ctx.globalAlpha = a;
    diamond(x, y, D); ctx.fillStyle = mix('#0c3a4a', '#4cc9f0', pulse); ctx.fill();
    ctx.strokeStyle = rgba(SCI.mid, 0.35 + 0.5 * pulse); ctx.lineWidth = 1.5; ctx.stroke();
    if (i < N) { fillRR(x + D - 2, y - 4, S - 2 * D + 4, 8, 3, mix('#0c3a4a', '#4cc9f0', pulse)); }
    // sense (down)
    if (i < N && j < N) {
      const sx = x + S / 2, sy = y + S / 2;
      diamond(sx, sy, D); ctx.fillStyle = 'rgba(224,247,255,0.07)'; ctx.fill();
      ctx.strokeStyle = 'rgba(224,247,255,0.42)'; ctx.lineWidth = 1.5; ctx.stroke();
      if (j < N - 1) { fillRR(sx - 4, sy + D - 2, 8, S - 2 * D + 4, 3, 'rgba(224,247,255,0.5)'); }
    }
  }
  ctx.globalAlpha = 1;
  // heat map: what the controller measures (only once the scan has passed)
  const scanT = t - 13.3, sweep = 0.6;
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
    CROSS.forEach((p) => dot(p.x, p.y, S * 1.2, SCI.deep, 0.32 * field * (1 - 0.85 * pull(p.x, p.y))));
    PATHS.forEach((P, n) => {
      const ci = P[6], p = CROSS[ci], w = pull(p.x, p.y);
      const stolen = hash(n * 3.1) < w * 1.15;
      ctx.globalAlpha = 0.22 * field * (1 - 0.8 * w);
      ctx.strokeStyle = SCI.mid; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(P[0], P[1]); ctx.quadraticCurveTo(P[2], P[3], P[4], P[5]); ctx.stroke();
      for (let q = 0; q < 2; q++) {
        const u = fract(t * 0.6 + hash(n + q * 0.37));
        const [bx, by] = bez(P, u);
        if (stolen && q === 0) {
          // pulled up into the finger
          const v = fract(t * 0.8 + hash(n * 7.7)), jx = (hash(n * 5.3) - 0.5) * 60, jy = (hash(n * 9.1) - 0.5) * 60;
          const e = ease.inOut(v), sw = Math.sin(v * Math.PI) * 26 * (hash(n) - 0.5);
          dot(lerp(bx, fg.x + jx, e) + sw, lerp(by, fg.y + jy, e) - sw, 15, '#ffd9b8', field * Math.sin(v * Math.PI) * 0.95);
        } else dot(bx, by, 17, SCI.hi, field * Math.pow(Math.sin(u * Math.PI), 0.6) * (1 - 0.7 * w) * 0.9);
      }
    });
    ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
  }
  // the scan line
  if (scanT > 0 && t < 15.3) {
    const yy = -G / 2 + G * fract(scanT / sweep), a = 1 - seg(t, 14.95, 15.3);
    const g = ctx.createLinearGradient(0, yy - 70, 0, yy + 6);
    g.addColorStop(0, 'rgba(125,211,252,0)'); g.addColorStop(1, `rgba(224,247,255,${0.35 * a})`);
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
      dot(fg.x, fg.y, 230, SCI.deep, 0.35 * fg.contact);
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
  const lock = ease.quint(seg(t, 14.6, 14.9)) * (1 - seg(t, 16.6, 16.9)); // gone before the zoom out
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
  const na = ease.out(seg(t, 13.3, 13.65)) * (1 - seg(t, 14.95, 15.3));
  if (na > 0) { ctx.globalAlpha = na; text('SCANNING · SHOWN SLOWED DOWN', G / 2, -G / 2 - 56, 20, 700, SCI.mid, 'right', 0.12); ctx.globalAlpha = 1; }
  ctx.restore();
}

// ── 4 · a lot of those touches are for clients ───────────────────────────
const TAPS2 = (() => {
  const out = [], pts = [[-42, -4], [126, 92], [-126, -100], [42, 188], [-42, 92], [126, -100], [-126, 188], [42, -4]];
  let tt = 17.3;
  pts.forEach(([x, y], i) => {
    if (i % 4 === 2) { out.push({ t0: tt, t1: tt + 0.25, x, y: 220, x1: x, y1: -40 }); tt += 0.4; }
    else { out.push({ t0: tt, t1: tt + 0.08, x, y }); tt += 0.24; }
  });
  return out;
})();
function sTurn(t) {
  stage(0.16);
  const f = gesture(t, TAPS2, [330, 760], [380, 820], 17.0, 19.6);
  phone(t, () => { homeScreen(PICKUPS); ripples(t, TAPS2); }, () => { if (f.visible) finger(f.x, f.y, f.lift); });
}
TAPS2.forEach((c) => window.SFX.push({ t: c.t0, kind: 'tap', gain: 1.5 }));

// ── 5 · where the hours go, and MsgHealth taking them back ───────────────────
// A service business's client admin on a typical day, in minutes. Estimates, built from published
// benchmarks (see README): about 7 hours a week on scheduling, ~45 minutes a day on reminder calls,
// most cancellations arriving with under 24 hours' notice.
const ROWS = [
  { label: 'Booking appointments', sub: 'Back-and-forth on times', auto: 'Clients book themselves', m: 45, icon: 'cal', at: 20.0, flip: 26.85 },
  { label: 'Reminders & confirmations', sub: 'Texting before every visit', auto: 'Sent automatically', m: 30, icon: 'bubble', at: 20.35, flip: 27.2 },
  { label: 'Rescheduling & cancellations', sub: 'Moving and re-filling slots', auto: 'Handled for you', m: 25, icon: 'redo', at: 20.7, flip: 27.55 },
  { label: 'Follow-ups & rebooking', sub: "Chasing clients who haven't been back", auto: 'Automatic SMS & email', m: 20, icon: 'bubble', at: 21.05, flip: 27.9 },
  { label: 'Review requests', sub: 'Asking happy clients for reviews', auto: 'Sent after every visit', m: 10, icon: 'star', at: 21.4, flip: 28.25 },
];
const MAXM = 45;
ROWS.forEach((r) => window.SFX.push({ t: r.at, kind: 'key', gain: 1.4 }, { t: r.flip, kind: 'key', gain: 1.3 }));
// (the clip carries its own sound here)
function glyph(kind, x, y) {
  ctx.save(); ctx.translate(x, y);
  ctx.strokeStyle = '#fff'; ctx.fillStyle = '#fff'; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath();
  if (kind === 'bubble') { ctx.roundRect(-14, -12, 28, 20, 7); ctx.moveTo(-6, 8); ctx.lineTo(-10, 15); ctx.lineTo(2, 8); ctx.stroke(); }
  else if (kind === 'cal') { ctx.roundRect(-13, -11, 26, 24, 5); ctx.moveTo(-13, -3); ctx.lineTo(13, -3); ctx.moveTo(-6, -15); ctx.lineTo(-6, -8); ctx.moveTo(6, -15); ctx.lineTo(6, -8); ctx.stroke(); }
  else if (kind === 'star') { for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + k * Math.PI / 5, r = k % 2 ? 6 : 14; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r + 1); } ctx.closePath(); ctx.stroke(); }
  else if (kind === 'redo') { ctx.arc(0, 0, 12, -2.6, 2.0); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-15, -14); ctx.lineTo(-10, -6); ctx.lineTo(-2, -11); ctx.stroke(); }
  else { [-9, 0, 9].forEach((dx) => { ctx.beginPath(); ctx.arc(dx, 0, 3.2, 0, Math.PI * 2); ctx.fill(); }); }
  ctx.restore();
}
const CW = 700, ROWH = 104;
function hm(min) { const m = Math.round(min / 5) * 5; return m < 60 ? `${m}m` : `${Math.floor(m / 60)}h ${m % 60}m`; }
// The supplied clip (assets/video/peace: 34 frames at 25 fps, plus its sound) plays as a 50% overlay on the card from
// the MsgHealth hit (on the beat at 24.91 s), before the rows turn automatic and the time drops. Its sound sits
// muffled under the music. Frames are numbered from 1.
const CLIP = { at: 24.91, fps: 25, count: 34, frames: [], audio: 'assets/video/peace/audio.wav', opacity: 0.5 };
CLIP.dur = CLIP.count / CLIP.fps;
function clipOverlay(ft) {
  const local = ft - CLIP.at;
  if (local < 0 || local >= CLIP.dur || !CLIP.frames.length) return;
  const img = CLIP.frames[clamp(Math.floor(local * CLIP.fps), 0, CLIP.frames.length - 1)];
  const k = ease.out(seg(local, 0, 0.12)) * (1 - ease.in(seg(local, CLIP.dur - 0.1, CLIP.dur)));
  const w = V ? 760 : 560, hh = w * img.height / img.width, x0 = OBJ.x - w / 2, y0 = OBJ.y - hh / 2;
  ctx.save();
  ctx.translate(OBJ.x, OBJ.y); const sc = lerp(0.85, 1, k); ctx.scale(sc, sc); ctx.translate(-OBJ.x, -OBJ.y);
  ctx.globalAlpha = k * CLIP.opacity;
  rr(x0, y0, w, hh, 32); ctx.save(); ctx.clip(); ctx.drawImage(img, x0, y0, w, hh); ctx.restore();
  rr(x0, y0, w, hh, 32); ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 2; ctx.stroke();
  ctx.restore();
}
function sCard(t) {
  const brand = ease.out(seg(t, BRAND_AT, BRAND_AT + 0.7));
  stage(lerp(0.12, 0.2, brand), mix(SLATE, C.primary, brand));
  const ch = 200 + ROWS.length * ROWH + 20, x0 = OBJ.x - CW / 2, y0 = OBJ.y - ch / 2;
  const cin = ease.quint(seg(t, 19.6, 20.1));
  ctx.save(); ctx.globalAlpha = cin; ctx.translate(0, (1 - cin) * 40);
  ctx.translate(OBJ.x, OBJ.y); ctx.scale(CS, CS); ctx.translate(-OBJ.x, -OBJ.y);
  glass(x0, y0, CW, ch, 36, { fill: 'rgba(255,255,255,0.06)' });
  const pad = 44;
  text('CLIENT ADMIN · PER DAY', x0 + pad, y0 + 54, 19, 700, brand > 0.5 ? IN.mid : SOFT, 'left', 0.12);
  let min = 0, cut = 0;
  ROWS.forEach((r) => { const f = ease.inOut(seg(t, r.flip, r.flip + 0.6)), m = r.m * ease.out(seg(t, r.at, r.at + 0.6)); min += m * (1 - f); cut += m * f; });
  text(hm(min), x0 + pad, y0 + 118, 72, 800, '#fff', 'left', -0.035);
  if (t >= ROWS[0].flip) { ctx.save(); ctx.globalAlpha *= ease.out(seg(t, ROWS[0].flip, ROWS[0].flip + 0.3)); pill(x0 + CW - pad, y0 + 118, `${hm(cut)} back`, '#3dbb74', 24, 'right'); ctx.restore(); }
  fillRR(x0 + pad, y0 + 170, CW - 2 * pad, 1.5, 1, 'rgba(255,255,255,0.12)');
  ROWS.forEach((r, i) => {
    const ry = y0 + 190 + i * ROWH, a = ease.quint(seg(t, r.at, r.at + 0.4));
    if (a <= 0) return;
    const f = ease.inOut(seg(t, r.flip, r.flip + 0.45));
    const col = mix(AMBER, '#7268ff', f);
    ctx.save(); ctx.globalAlpha *= a; ctx.translate((1 - a) * 30, 0);
    ctx.beginPath(); ctx.arc(x0 + pad + 28, ry + 40, 28, 0, Math.PI * 2); ctx.fillStyle = rgba(col, 0.85); ctx.fill();
    if (f > 0.5) check(x0 + pad + 28, ry + 40, 24, '#fff', 4); else glyph(r.icon, x0 + pad + 28, ry + 40);
    const tx = x0 + pad + 76;
    text(r.label, tx, ry + 24, 26, 600, '#fff');
    // the old text leaves before the new arrives, so the two never sit on top of each other
    const was = 1 - seg(f, 0, 0.5), now = seg(f, 0.5, 1);
    ctx.save(); ctx.globalAlpha *= was; text(r.sub, tx, ry + 56, 19, 500, SOFT); ctx.restore();
    ctx.save(); ctx.globalAlpha *= now; text(r.auto, tx, ry + 56, 19, 600, IN.hi); ctx.restore();
    // time, or the Automatic pill
    ctx.save(); ctx.globalAlpha *= was; text(`${r.m}m`, x0 + CW - pad, ry + 24, 28, 700, '#fff', 'right'); ctx.restore();
    if (now > 0) { ctx.save(); ctx.globalAlpha *= now; pill(x0 + CW - pad, ry + 24, 'Automatic', C.primary, 17, 'right', true); ctx.restore(); }
    // bar
    const bw = CW - pad - (tx - x0), grow = ease.out(seg(t, r.at + 0.05, r.at + 0.6)), drain = ease.inOut(seg(t, r.flip, r.flip + 0.6));
    fillRR(tx, ry + 78, bw, 9, 4.5, 'rgba(255,255,255,0.08)');
    const fw = bw * (r.m / MAXM) * grow * (1 - drain);
    if (fw > 1) fillRR(tx, ry + 78, fw, 9, 4.5, col);
    ctx.restore();
  });
  ctx.restore();
}
window.SFX.push({ t: BRAND_AT, kind: 'transitionHit', gain: 0.7 }); // a whoosh that builds into a hit as MsgHealth lands

// ── 6 · without lifting a finger ─────────────────────────────────────────────
const NOTES = [
  { at: 32.1, s: 'Reminders sent for tomorrow' },
  { at: 32.55, s: 'Maya booked · Thu, 2:00 PM' },
  { at: 33.0, s: 'Leo moved to Fri, 10:30 AM' },
  { at: 33.45, s: 'Review request sent to Sam' },
];
NOTES.forEach((n, i) => window.SFX.push({ t: n.at, kind: 'notification', gain: i ? 0.6 : 1.4 }));
function lockScreen(t) {
  screenBg(true); statusBar('10:42');
  text('Tuesday, October 20', 0, -PH / 2 + 104, 20, 600, SOFT, 'center');
  text('10:42', 0, -PH / 2 + 172, 96, 700, '#fff', 'center', -0.03);
  NOTES.forEach((n, i) => {
    const k = ease.quint(seg(t, n.at, n.at + 0.35));
    if (k <= 0) return;
    const newer = NOTES.filter((m, j) => j > i).reduce((p, m) => p + ease.quint(seg(t, m.at, m.at + 0.35)), 0);
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
  stage(0.18, IN.glow);
  const away = ease.inOut(seg(t, 31.5, 32.2));
  phone(t, () => lockScreen(t), () => {
    if (away >= 1) return;
    ctx.save(); ctx.globalAlpha = 1 - seg(t, 31.9, 32.2);
    if (away > 0.02) ctx.filter = `blur(${(14 * away).toFixed(1)}px)`;
    finger(lerp(60, 330, away), lerp(150, 760, away), Math.min(1, ease.out(seg(t, 31.5, 31.7)) + away * 0.6), { scale: 1 + 0.35 * away });
    ctx.restore();
  });
}

// ── 7 · end card ─────────────────────────────────────────────────────────────
window.SFX.push({ t: 34.2, kind: 'punch', gain: 0.5 });
function sEnd(t) {
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  const cy = H / 2 - 40, g = ctx.createRadialGradient(W / 2, cy, 0, W / 2, cy, 620);
  g.addColorStop(0, rgba(C.primary, 0.2)); g.addColorStop(1, rgba(C.primary, 0)); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const ls = V ? 130 : 150, size = V ? 110 : 132, ww = tw(BRAND.name, size, 700, -0.035), gap = -0.06 * ls, full = ls + gap + ww;
  const lx = W / 2 - full / 2 + ls / 2, tx = lx + ls / 2 + gap;
  const k = ease.quint(seg(t, 34.2, 34.5));
  ctx.save(); ctx.globalAlpha = k;
  const gl = ctx.createRadialGradient(lx, cy, 0, lx, cy, ls * 0.8); gl.addColorStop(0, 'rgba(99,102,241,0.34)'); gl.addColorStop(1, 'rgba(99,102,241,0)');
  ctx.fillStyle = gl; ctx.fillRect(lx - ls, cy - ls, ls * 2, ls * 2);
  if (LOGO) ctx.drawImage(LOGO, lx - ls / 2, cy - ls / 2, ls, ls);
  text(BRAND.name, tx, cy + size * 0.04, size, 700, '#e4e4ec', 'left', -0.035);
  ctx.restore();
  const k2 = ease.quint(seg(t, 34.7, 35.2));
  ctx.save(); ctx.globalAlpha = k2; ctx.translate(0, (1 - k2) * 24);
  font(V ? 56 : 60, 700, -0.035); const tag = 'Get your hours back.', tagW = ctx.measureText(tag).width;
  text(tag, W / 2, cy + 150, V ? 56 : 60, 700, brandGrad(W / 2 - tagW / 2, W / 2 + tagW / 2), 'center', -0.035);
  ctx.restore();
  const k3 = ease.quint(seg(t, 35.2, 35.7));
  ctx.save(); ctx.globalAlpha = k3; text(BRAND.url, W / 2, cy + 236, 38, 500, SOFT, 'center'); ctx.restore();
  const out = seg(t, STORY - 0.6, STORY);
  if (out > 0) { ctx.fillStyle = `rgba(0,0,0,${out})`; ctx.fillRect(0, 0, W, H); }
}

// ── the edit ─────────────────────────────────────────────────────────────────
// [start, end, scene, transition into it, its length]. No transition means a straight cut.
const SCENES = [
  [0, 4.0, sHook],
  [4.0, 7.6, sLayers],                // same phone, so a straight cut
  [7.6, 17.0, sGrid, 'zoomIn', 0.6],
  [17.0, 19.6, sTurn, 'zoomOut', 0.5],
  [19.6, 31.4, sCard, 'cross', 0.4],
  [31.4, 34.2, sHands, 'cross', 0.4],
  [34.2, STORY + 1, sEnd],         // straight cut, with a snap
];
SCENES.forEach(([st, , , type, dur]) => { if (type) window.SFX.push(type === 'cross' ? { t: st + dur / 2, kind: 'swoosh', gain: 0.6 } : { t: st + dur / 2, kind: 'transition', gain: 0.6 }); });
window.SFX.push({ t: 4.4, kind: 'swish', gain: 0.35 }); // the phone tips back

function renderInto(k, fn, t) {
  const c = OFF[k]; ctx = c.getContext('2d');
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.filter = 'none'; ctx.globalCompositeOperation = 'source-over';
  fn(t);
  return c;
}
function drawScaled(img, s, a) {
  img._map = { s, a };
  ctx.save(); ctx.globalAlpha = a;
  ctx.translate(OBJ.x, OBJ.y); ctx.scale(s, s); ctx.translate(-OBJ.x, -OBJ.y);
  ctx.drawImage(img, 0, 0); ctx.restore();
}
function transition(type, p, A, B) {
  const e = ease.inOut(p), out = 1 - ease.out(seg(e, 0, 0.55)), inn = ease.out(seg(e, 0.45, 1));
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  if (type === 'zoomIn') { drawScaled(A, 1 + 0.9 * e, out); drawScaled(B, 0.7 + 0.3 * e, inn); }
  else if (type === 'zoomOut') { drawScaled(A, 1 - 0.45 * e, out); drawScaled(B, 1.5 - 0.5 * e, inn); }
  else { drawScaled(A, 1, out); drawScaled(B, 1, inn); }
}
function renderFrame(ft) {
  const t = storyAt(ft);
  ctx = MAIN;
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.filter = 'none'; ctx.globalCompositeOperation = 'source-over';
  const i = Math.max(0, SCENES.findIndex(([s, e]) => t >= s && t < e));
  const [start, , fn, type, dur] = SCENES[i];
  if (i > 0 && type && t < start + dur) {
    const A = renderInto(0, SCENES[i - 1][2], t), B = renderInto(1, fn, t);
    ctx = MAIN; transition(type, (t - start) / dur, A, B);
    if (window.TEXT_LOG) window.TEXT_LOG.forEach((b) => { // place text drawn off screen where the transition put it
      const m = b.layer === 'main' ? null : OFF[b.layer]._map;
      if (!m) return;
      const X = (v) => OBJ.x + (v - OBJ.x) * m.s, Y = (v) => OBJ.y + (v - OBJ.y) * m.s;
      Object.assign(b, { x0: X(b.x0), x1: X(b.x1), y0: Y(b.y0), y1: Y(b.y1), a: b.a * m.a, layer: 'main' });
    });
  } else fn(t);
  ctx = MAIN; ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.filter = 'none';
  clipOverlay(ft);
  drawCaptions(t);
}

// Sound cues are written in story time; the soundtrack wants film time.
window.SFX = window.SFX.map((c) => ({ ...c, t: filmAt(c.t) }));
window.CLIP_AUDIO = { file: CLIP.audio, at: CLIP.at, dur: CLIP.dur };
window.DURATION = DURATION;
window.renderFrame = renderFrame;
// Text audit hook (scripts/audit-text.mjs): while window.TEXT_LOG is an array, every string drawn is logged with
// its on-screen box.
{
  const fill = CanvasRenderingContext2D.prototype.fillText;
  CanvasRenderingContext2D.prototype.fillText = function (str, x, y, ...rest) {
    const T = this.getTransform();
    if (window.TEXT_LOG && Math.abs(T.b) < 1e-6) { // rotated text is texture on a tilted layer, not copy
      const m = this.measureText(str);
      const pts = [[x - m.actualBoundingBoxLeft, y - m.actualBoundingBoxAscent], [x + m.actualBoundingBoxRight, y + m.actualBoundingBoxDescent]]
        .flatMap(([px, py], i, a) => [[px, py], [a[1 - i][0], py]]).map(([px, py]) => [T.a * px + T.c * py + T.e, T.b * px + T.d * py + T.f]);
      const xs = pts.map((q) => q[0]), ys = pts.map((q) => q[1]);
      window.TEXT_LOG.push({ str, x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys), a: this.globalAlpha, layer: this.canvas === MAIN.canvas ? 'main' : OFF.indexOf(this.canvas) });
    }
    return fill.call(this, str, x, y, ...rest);
  };
}
window.ready = (async () => {
  MAIN = document.getElementById('c').getContext('2d');
  ctx = MAIN;
  for (let k = 0; k < 2; k++) { const c = document.createElement('canvas'); c.width = W; c.height = H; OFF.push(c); }
  await Promise.all(['400', '500', '600', '700', '800'].map((w) => document.fonts.load(`${w} 40px ${FONT}`)));
  const load = (src) => new Promise((res) => { const im = new Image(); im.onload = () => res(im); im.onerror = () => res(null); im.src = src; });
  LOGO = await load(BRAND.logoFile);
  for (const h of Object.values(HANDS)) h.img = await load(h.src);
  CLIP.frames = (await Promise.all(Array.from({ length: CLIP.count }, (_, i) => load(`assets/video/peace/f${String(i + 1).padStart(3, '0')}.jpg`)))).filter(Boolean);
  if (location.search.includes('render')) document.body.classList.add('render');
  renderFrame(0);
  return true;
})();

// ── player (plays the track in sync, with the clip's sound muffled under it) ─
(() => {
  const btn = document.getElementById('play'), seek = document.getElementById('seek'), tm = document.getElementById('time'), au = document.getElementById('track');
  const clipAu = new Audio(CLIP.audio);
  let playing = false, cur = 0, wired = false, clipOn = false;
  const muffle = () => { // route the clip through a low-pass filter, like the render
    if (wired) return; wired = true;
    const ac = new AudioContext(), src = ac.createMediaElementSource(clipAu), lp = ac.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.value = 500; src.connect(lp).connect(ac.destination);
  };
  const show = (t) => { cur = t; renderFrame(t); seek.value = (t / DURATION) * 1000; tm.textContent = `${t.toFixed(1)}s / ${DURATION}s`; };
  const loop = () => {
    if (!playing) return;
    const t = au.currentTime;
    if (t >= DURATION || au.ended) { playing = false; au.pause(); clipAu.pause(); btn.textContent = 'Replay'; show(DURATION); return; }
    const on = t >= CLIP.at && t < CLIP.at + CLIP.dur;
    if (on && !clipOn) { clipAu.currentTime = t - CLIP.at; clipAu.play(); }
    if (!on && clipOn) clipAu.pause();
    clipOn = on;
    show(t); requestAnimationFrame(loop);
  };
  btn.onclick = () => {
    muffle();
    if (playing) { playing = false; au.pause(); clipAu.pause(); clipOn = false; btn.textContent = 'Play'; return; }
    if (cur >= DURATION) cur = 0;
    au.currentTime = cur; au.play(); playing = true; btn.textContent = 'Pause'; requestAnimationFrame(loop);
  };
  seek.oninput = () => { playing = false; au.pause(); clipAu.pause(); clipOn = false; btn.textContent = 'Play'; show((seek.value / 1000) * DURATION); };
  window.ready.then(() => { const q = new URLSearchParams(location.search).get('t'); if (q) show(+q); });
})();
