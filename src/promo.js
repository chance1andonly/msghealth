// MsgHealth · 44s kinetic product promo (1920 × 1080, 60 fps)
// Clean motion-graphics style: big type that snaps in word by word, product cards, one dark
// glitch beat, then the Analytics & Predictions dashboard with its numbers rising one at a time.
// Nothing pulses or drifts: things appear on the beat, hold, and scenes cut on the beat.
'use strict';

const W = 1920, H = 1080, FPS = 60;
const DURATION = 43.92;
const C = BRAND.colors;
const FONT = 'Inter';
const IND = '#5b50e8';        // dashboard chart indigo
const MUTED = '#6b6b85', FAINT = '#9a9ab0', LINE = '#ececf3';

// Beat grid of assets/audio/promo-track.m4a (65 BPM, first downbeat 0.816s). The track is the
// supplied song looped on 8-beat phrases, so this grid holds for its whole length.
const BEAT = 0.9225, B0 = 0.816;
const b = (k) => B0 + k * BEAT; // k may be fractional: .5 = half beat, .25 = quarter beat

let ctx = null, LOGO = null;

// ── maths ────────────────────────────────────────────────────────────────────
const clamp = (v, a = 0, c = 1) => Math.max(a, Math.min(c, v));
const lerp = (a, c, t) => a + (c - a) * t;
const seg = (t, a, c) => clamp((t - a) / (c - a));
const ease = {
  out: (t) => 1 - Math.pow(1 - t, 3),
  expo: (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  inOut: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
};
function rgba(hex, a) { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; }
const money = (v) => '$' + Math.round(v).toLocaleString('en-US');

// The one entrance used everywhere: a fast snap out of a blur.
const SNAP = 0.17;
const snapP = (t, at) => ease.expo(seg(t, at, at + SNAP));

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

// ── backgrounds (static: no drifting light) ──────────────────────────────────
function lightBG(tint = C.primary) {
  ctx.fillStyle = '#f7f7fa'; ctx.fillRect(0, 0, W, H);
  [[0.15, 0.2, tint, 0.09], [0.88, 0.18, '#e879f9', 0.06], [0.75, 0.92, '#38bdf8', 0.06], [0.25, 0.9, tint, 0.05]].forEach(([bx, by, col, a]) => {
    const x = bx * W, y = by * H, g = ctx.createRadialGradient(x, y, 0, x, y, 760);
    g.addColorStop(0, rgba(col, a)); g.addColorStop(1, rgba(col, 0));
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  });
}
function darkBG() {
  ctx.fillStyle = '#0a0a0f'; ctx.fillRect(0, 0, W, H);
  const g = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, 900);
  g.addColorStop(0, 'rgba(79,70,229,0.16)'); g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = 'rgba(0,0,0,0.28)';
  for (let y = 0; y < H; y += 4) ctx.fillRect(0, y, W, 2);
}

// ── 1 · hook (the song's quiet intro, before the bass drops at beat 5) ───────
// A marker stroke drawn under a word: a slightly wobbly swoosh revealed left to right.
function scribble(x0, x1, y, p, col) {
  if (p <= 0) return;
  const n = 60, pts = [];
  // one confident swoosh that bows down and lifts to the right…
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    pts.push([lerp(x0 - 18, x1 + 26, u), y + 7 * Math.sin(u * Math.PI) - 10 * u + 1.2 * Math.sin(u * 5 + 1), Math.sin(Math.min(1, u * 1.4) * Math.PI * 0.5)]);
  }
  // …then flicks back under itself, shorter and thinning out, like a marker double pass
  for (let i = 1; i <= n * 0.6; i++) {
    const u = i / n;
    pts.push([lerp(x1 + 26, x0 + 30, u / 0.6 * 0.85), y + 4 + 16 * Math.sin(Math.min(1, u * 4) * Math.PI * 0.5) - 3 * u, 1 - u / 0.6 * 0.7]);
  }
  const m = Math.max(2, Math.round(pts.length * p));
  ctx.save();
  ctx.strokeStyle = col; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (let i = 1; i < m; i++) { // tapered: width follows the pen pressure in pts[i][2]
    ctx.lineWidth = 3 + 8 * pts[i][2];
    ctx.beginPath(); ctx.moveTo(pts[i - 1][0], pts[i - 1][1]); ctx.lineTo(pts[i][0], pts[i][1]); ctx.stroke();
  }
  ctx.restore();
}
function sHook(t) {
  lightBG();
  const size = 112;
  line(t, [["I don't know how", b(-0.5)], ['salon owners', b(1)]], W / 2, H / 2 - 70, size);
  const total = line(t, [['could live without', b(2)], ['this.', b(3), C.primary]], W / 2, H / 2 + 70, size);
  // underline "this." (without the full stop) as if drawn by hand
  const thisW = tw('this', size, 700), x1 = W / 2 + total / 2 - tw('.', size, 700);
  scribble(x1 - thisW, x1, H / 2 + 70 + 74, ease.out(seg(t, b(3.5), b(3.5) + 0.32)), C.primary);
}

// ── 2 · why repeat clients matter (bass drops here) ──────────────────────────
function sRegulars(t) {
  lightBG();
  line(t, [['Repeat clients', b(5)]], W / 2, H / 2 - 70, 120);
  line(t, [['are the', b(5.5)], ['business.', b(5.5), C.primary]], W / 2, H / 2 + 70, 120);
}

// ── 3 · a regular quietly stops booking ──────────────────────────────────────
function sStops(t) {
  lightBG();
  line(t, [['But when a regular', b(7)], ['stops booking…', b(7)]], W / 2, 280, 88);
  const months = [['Jan', b(7.5)], ['Feb', b(7.75)], ['Mar', b(8)], ['Apr', b(8.25)]];
  const cw = 300, ch = 260, gap = 40, x0 = W / 2 - (4 * cw + 3 * gap) / 2, y0 = 440;
  months.forEach(([m, at], i) => {
    const x = x0 + i * (cw + gap), empty = i === 3;
    snapIn(t, at, x + cw / 2, y0 + ch / 2, () => {
      if (empty) {
        fillRR(x, y0, cw, ch, 28, 'rgba(255,255,255,0.6)');
        ctx.setLineDash([12, 10]); rr(x, y0, cw, ch, 28); ctx.strokeStyle = rgba(C.risk, 0.7); ctx.lineWidth = 3; ctx.stroke(); ctx.setLineDash([]);
      } else card(x, y0, cw, ch, 28);
      text(m, x + 34, y0 + 52, 34, 700, empty ? C.risk : C.ink);
      if (empty) { text('No booking', x + cw / 2, y0 + 160, 30, 600, C.risk, 'center'); return; }
      fillRR(x + 30, y0 + 110, cw - 60, 104, 18, rgba(C.primary, 0.1));
      avatar(x + 76, y0 + 162, 26, 'JL', C.primary);
      text('Jordan', x + 116, y0 + 148, 26, 700, C.ink);
      text('10:00 · Cut', x + 116, y0 + 180, 22, 500, MUTED);
    });
  });
}

// ── 4 · dark glitch beat ─────────────────────────────────────────────────────
function glitchText(t, s, at, x, y, size) {
  if (t < at) return;
  const k = t - at, hit = clamp(1 - k / 0.13);
  ctx.save();
  ctx.shadowColor = 'rgba(255,255,255,0.45)'; ctx.shadowBlur = 26;
  ctx.globalCompositeOperation = 'lighter';
  const off = 16 * hit + 2.5;
  text(s, x - off, y, size, 600, 'rgba(255,40,80,0.85)', 'center');
  text(s, x + off, y, size, 600, 'rgba(40,220,255,0.85)', 'center');
  text(s, x, y, size, 600, 'rgba(255,255,255,0.92)', 'center');
  ctx.restore();
  if (hit > 0) { // slice tears on the hit frames only
    for (let i = 0; i < 6; i++) {
      const r = Math.sin(i * 91.7 + at * 13.1) * 0.5 + 0.5, sy = y - size + r * size * 2, sh = 6 + ((i * 7) % 5) * 6;
      ctx.drawImage(ctx.canvas, 0, sy, W, sh, (i % 2 ? 1 : -1) * 60 * hit, sy, W, sh);
    }
  }
}
function sGlitch(t) {
  darkBG();
  glitchText(t, "You won't see it coming", b(9.5), W / 2, H / 2 - 70, 96);
  glitchText(t, "until they're gone.", b(10), W / 2, H / 2 + 70, 96);
}

// ── 5 · MsgHealth: logo lands centre, steps right, then sweeps left wiping the name in ──
function sMeet(t) {
  lightBG();
  const ls = 190, size = 160, ww = tw(BRAND.name, size, 700), gap = 40, full = ls + gap + ww;
  const lockX = W / 2 - full / 2 + ls / 2, y = H / 2 - 30;
  const right = ease.inOut(seg(t, b(11.5), b(11.5) + 0.28));
  const left = ease.inOut(seg(t, b(12), b(12) + 0.42));
  const lx = lerp(lerp(W / 2, W / 2 + 150, right), lockX, left);
  // the name is revealed by a wipe that trails the logo's right edge
  const textX = lockX + ls / 2 + gap;
  const wipeEdge = lerp(textX - 40, textX + ww + 20, ease.out(seg(t, b(12) + 0.1, b(12) + 0.55)));
  if (t >= b(12) + 0.1) {
    ctx.save();
    ctx.beginPath(); ctx.rect(Math.max(lx + ls / 2 + 6, textX - 20), 0, Math.max(0, wipeEdge - Math.max(lx + ls / 2 + 6, textX - 20)), H); ctx.clip();
    text(BRAND.name, textX, y + 6, size, 700, C.ink);
    ctx.restore();
  }
  snapIn(t, b(11), lx, y, () => logoMark(lx, y, ls), { from: 0.6, dy: 0 });
  line(t, [['Client retention', b(12.5), MUTED], ['for salons.', b(12.5), C.primary]], W / 2, H / 2 + 150, 50, { weight: 600 });
}

// ── 6 · what it does ─────────────────────────────────────────────────────────
function sWhat(t) {
  lightBG();
  line(t, [['It tells you', b(13.5)], ['who’s drifting', b(13.5), C.primary]], W / 2, 400, 104);
  line(t, [['and brings them', b(14)], ['back.', b(14), C.primary]], W / 2, 540, 104);
  const chips = [['Health scores', C.healthy], ['Churn alerts', C.risk], ['Automatic win-backs', C.primary]];
  const size = 30, ws = chips.map(([s]) => tw(s, size, 600) + size * 1.3), gap = 24;
  let x = W / 2 - (ws.reduce((a, c) => a + c, 0) + gap * 2) / 2;
  chips.forEach(([s, col], i) => {
    const x0 = x;
    snapIn(t, b(14.5) + (i * BEAT) / 16, x0 + ws[i] / 2, 700, () => { fillRR(x0, 674, ws[i], 52, 26, '#fff'); pill(x0, 700, s, col, size); });
    x += ws[i] + gap;
  });
}

// ── 7 · every client gets a health score ─────────────────────────────────────
const ROWS = [
  { n: 'Alex Kim', i: 'AK', c: '#d97706', s: 91, st: 'Healthy', sc: C.healthy, v: '4 days ago' },
  { n: 'Priya Shah', i: 'PS', c: '#db2777', s: 54, st: 'Needs attention', sc: C.attention, v: '3 weeks ago' },
  { n: 'Jordan Lee', i: 'JL', c: '#4f46e5', s: 38, st: 'At risk', sc: C.risk, v: '62 days ago' },
  { n: 'Casey Park', i: 'CP', c: '#0891b2', s: 86, st: 'Healthy', sc: C.healthy, v: '1 week ago' },
  { n: 'Riley Chen', i: 'RC', c: '#7c3aed', s: 79, st: 'Healthy', sc: C.healthy, v: '9 days ago' },
];
function sHealth(t) {
  lightBG();
  line(t, [['Every client', b(15.5)]], 150, 420, 92, { align: 'left' });
  line(t, [['gets a', b(15.5)], ['health score.', b(15.75), C.primary]], 150, 530, 92, { align: 'left' });
  const x = 1000, w = 780, rh = 116, y0 = 250;
  snapIn(t, b(16), x + w / 2, H / 2, () => card(x, y0 - 40, w, rh * 5 + 80, 32));
  ROWS.forEach((r, i) => {
    const ry = y0 + 30 + i * rh, at = b(16) + (i * BEAT) / 16, jordan = i === 2, flag = b(16.5);
    snapIn(t, at, x + w / 2, ry, () => {
      if (jordan && t >= flag) { const p = snapP(t, flag); fillRR(x + 16, ry - 50, w - 32, 100, 20, rgba(C.risk, 0.08 * p)); }
      avatar(x + 66, ry, 30, r.i, r.c);
      text(r.n, x + 114, ry - 14, 28, 600, C.ink);
      text(r.v, x + 114, ry + 20, 22, 500, jordan ? C.risk : FAINT);
      text(String(r.s), x + 470, ry + 1, 34, 700, r.sc, 'right');
      fillRR(x + 490, ry - 6, 90, 12, 6, LINE); fillRR(x + 490, ry - 6, (90 * r.s) / 100, 12, 6, r.sc);
      if (!jordan) pill(x + w - 36, ry, r.st, r.sc, 22, 'right');
      else snapIn(t, flag, x + w - 90, ry, () => pill(x + w - 36, ry, r.st, r.sc, 22, 'right'), { from: 0.6, dy: 0 });
    }, { dy: 16 });
  });
}

// ── 9 · win them back on autopilot ───────────────────────────────────────────
function sWinBack(t) {
  lightBG('#7c3aed');
  line(t, [['Win them back', b(21)], ['on autopilot.', b(21), C.primary]], W / 2, 190, 88);
  const nodes = [['At risk detected', C.risk, 'alert'], ['SMS sent', C.primary, 'chat'], ['Email follow-up', '#0891b2', 'mail'], ['Invite to book', C.healthy, 'cal']];
  const nw = 330, nh = 130, gap = 70, x0 = W / 2 - (4 * nw + 3 * gap) / 2, ny = 330;
  nodes.forEach(([label, col, icon], i) => {
    const x = x0 + i * (nw + gap), at = b(21.5) + (i * BEAT) / 8;
    if (i > 0 && t >= at) { // connector draws in with the node
      const p = snapP(t, at);
      ctx.strokeStyle = rgba(C.primary, 0.5); ctx.lineWidth = 4; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(x - gap + 10, ny + nh / 2); ctx.lineTo(x - gap + 10 + (gap - 20) * p, ny + nh / 2); ctx.stroke();
    }
    snapIn(t, at, x + nw / 2, ny + nh / 2, () => {
      card(x, ny, nw, nh, 26);
      ctx.beginPath(); ctx.arc(x + 62, ny + nh / 2, 32, 0, Math.PI * 2); ctx.fillStyle = rgba(col, 0.14); ctx.fill();
      glyph(icon, x + 62, ny + nh / 2, col);
      text(`Step ${i + 1}`, x + 112, ny + 46, 20, 600, FAINT);
      text(label, x + 112, ny + 80, 27, 700, C.ink);
    });
  });
  // the conversation it starts
  const by = 560;
  snapIn(t, b(22), 640, by + 80, () => {
    avatar(470, by + 60, 30, 'S', C.primary);
    fillRR(520, by, 640, 140, 30, '#ececf4');
    text("Hi Jordan! We miss you. Want your usual", 556, by + 50, 28, 500, C.ink);
    text('Thursday at 10:00?', 556, by + 92, 28, 500, C.ink);
  });
  snapIn(t, b(22.25), 1300, by + 230, () => {
    fillRR(1060, by + 175, 400, 100, 30, C.primary);
    text('Yes please! See you then.', 1094, by + 226, 28, 600, '#fff');
    avatar(1510, by + 225, 30, 'JL', C.primary);
  });
  snapIn(t, b(22.5), W / 2, by + 360, () => {
    fillRR(W / 2 - 230, by + 322, 460, 76, 38, rgba(C.healthy, 0.16));
    ctx.beginPath(); ctx.arc(W / 2 - 180, by + 360, 20, 0, Math.PI * 2); ctx.fillStyle = C.healthy; ctx.fill();
    check(W / 2 - 180, by + 360, 20, '#fff', 4);
    text('Booked · Thu 10:00', W / 2 - 146, by + 361, 30, 700, '#1f8a52');
  }, { from: 0.8 });
}
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

// ── product demos, rebuilt from the screen recordings ────────────────────────
// A large pointer so viewers can always see where it is. path: [[arrive time, x, y], …] in
// world space; each move takes 0.38s and lands on its time. clicks: times of presses.
function pointer(t, path, clicks, z) {
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
// Feature name, top left in screen space, so each demo is labelled.
function featureTag(t, at, label) {
  snapIn(t, at, 160, 70, () => {
    const w = tw(label, 26, 600) + 64;
    fillRR(48, 42, w, 56, 28, 'rgba(17,17,28,0.88)');
    ctx.beginPath(); ctx.arc(80, 70, 7, 0, 7); ctx.fillStyle = '#8b83ff'; ctx.fill();
    text(label, 98, 71, 26, 600, '#fff');
  }, { dy: 0 });
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

// AI Business Analyst · "which clients haven't booked in 60 days?"
const AI_Q = 'Which clients haven’t booked in 60 days?';
const AI_ROWS = [
  ['Chloe Bergeron', 'Jul 29', '81'], ['Renee Calloway', 'Jul 31', '79'], ['Reese Abara', 'Aug 2', '77'], ['Lauren Kowalczyk', 'Aug 4', '75'],
  ['Hannah McAllister', 'Aug 7', '72'], ['Riley Delgado', 'Aug 10', '69'], ['Charlotte Reddick', 'Aug 11', '68'], ['Nina Petrossian', 'Aug 13', '66'], ['Dominic Ferraro', 'Aug 14', '65'],
];
function sAnalyst(t) {
  const t0 = b(17.5), ans = b(19.25), send = b(20.25);
  const keys = [[t0, 960, 300, 1.6], [ans, 960, 455, 1.32]];
  withCam(t, keys, (z) => {
    homeWorld(t);
    ctx.fillStyle = 'rgba(10,10,22,0.55)'; ctx.fillRect(0, 0, W, H);
    const x = 530, w = 860, y = 120;
    snapIn(t, t0, x + w / 2, y + 40, () => {
      const h = t >= ans ? 690 : 80;
      fillRR(x, y, w, h, 12, '#12121c'); rr(x, y, w, h, 12); ctx.strokeStyle = 'rgba(139,131,255,0.35)'; ctx.lineWidth = 1.5; ctx.stroke();
      glyph('bolt', x + 28, y + 28, '#a59cff');
      const n = Math.floor(AI_Q.length * seg(t, b(18), b(18.875)));
      const typed = AI_Q.slice(0, n);
      text(typed || 'Ask anything about your business…', x + 54, y + 28, 15, 500, typed ? '#f1f1f7' : '#6b6b85');
      if (t >= b(17.75) && t < b(19)) { ctx.fillStyle = '#a59cff'; ctx.fillRect(x + 56 + tw(typed, 15, 500), y + 18, 2, 21); }
      fillRR(x + w - 74, y + 13, 58, 30, 6, C.primary); text('Run', x + w - 45, y + 28, 13, 600, '#fff', 'center');
      ctx.fillStyle = 'rgba(255,255,255,0.08)'; ctx.fillRect(x, y + 56, w, 1);
      text('Navigates the dashboard or answers from your data', x + 18, y + 68, 11, 400, '#6b6b85');
      if (t < ans) return;
      snapIn(t, ans, x + w / 2, y + 380, () => {
        text('Here’s what I found', x + 20, y + 104, 16, 700, '#f1f1f7');
        rr(x + 18, y + 124, w - 36, 470, 10); ctx.strokeStyle = 'rgba(139,131,255,0.7)'; ctx.lineWidth = 1.5; ctx.stroke();
        fillRR(x + 19, y + 125, w - 38, 468, 10, 'rgba(91,80,232,0.08)');
        text('AI GENERATED', x + 40, y + 148, 10.5, 700, '#a59cff', 'left', 0.08);
        text('Based on today’s date, these clients haven’t booked in 60+ days, the ones most worth reaching out to:', x + 40, y + 176, 13.5, 500, '#e4e4ee');
        AI_ROWS.forEach(([n, d, days], i) => {
          const ry = y + 210 + i * 34;
          snapIn(t, ans + (i * BEAT) / 16, x + 200, ry, () => {
            ctx.beginPath(); ctx.arc(x + 48, ry, 2.5, 0, 7); ctx.fillStyle = '#e4e4ee'; ctx.fill();
            text(n, x + 60, ry, 14, 700, '#ffffff');
            text(`· last booked ${d} (${days} days ago)`, x + 66 + tw(n, 14, 700), ry, 14, 400, '#c9c9d9');
          }, { dy: 8, blur: 6 });
        });
        text('The top 3 haven’t been in for over 11 weeks. Great candidates for a win-back offer.', x + 40, y + 530, 13.5, 500, '#e4e4ee');
        const bw = 330, bx = x + 20, by = y + 618;
        if (t < send) { fillRR(bx, by, bw, 40, 8, C.primary); text('Send win-back offer to all 9', bx + bw / 2, by + 20, 14, 600, '#fff', 'center'); }
        else snapIn(t, send, bx + bw / 2, by + 20, () => { fillRR(bx, by, bw, 40, 8, '#16a34a'); check(bx + 30, by + 20, 14, '#fff', 3); text('Win-back sent to 9 clients', bx + bw / 2 + 14, by + 20, 14, 600, '#fff', 'center'); }, { dy: 0, from: 0.9, blur: 4 });
      }, { dy: 14 });
    }, { dy: 20 });
    pointer(t, [[t0, 1210, 560], [b(17.75), 980, 152], [b(19), 1345, 150], [send, 560, 760]], [b(17.75), b(19), send], z);
  });
  featureTag(t, t0, 'AI Business Analyst');
}

// Booking calendar · October, in use
const CAL_ADDED = [
  [21, '11a', 'Chloe Bergeron', 'Signature Facial', b(25.25)],
  [22, '2:30p', 'Renee Calloway', 'Gel Color', b(25.75)],
  [23, '10a', 'Reese Abara', 'Brow Shape', b(26)],
  [20, '4p', 'Hannah McAllister', 'Deluxe Spa Pedi', b(26.25)],
  [24, '1p', 'Lauren Kowalczyk', 'Deep Tissue', b(26.5)],
];
function sCalendar(t) {
  const t0 = b(23.5), open = b(24.5), book = b(25.25);
  const keys = [[t0, 960, 540, 1], [b(24.25), 960, 700, 1.75], [b(25.5), 1010, 610, 1.32]];
  withCam(t, keys, (z) => {
    snapIn(t, t0, W / 2, H / 2, () => homeWorld(t, { added: CAL_ADDED }), { dy: 0, from: 0.97 });
    // the booking popover on Wed 21
    if (t >= open && t < book + 0.12) {
      const out = ease.out(seg(t, book, book + 0.12));
      ctx.save(); ctx.globalAlpha = 1 - out;
      snapIn(t, open, 1000, 620, () => {
        const x = 850, y = 506, w = 340, h = 214;
        card(x, y, w, h, 12, { shadow: 30, shadowColor: 'rgba(20,20,50,0.22)' });
        text('New appointment', x + 18, y + 26, 15, 700, '#16162a');
        [['Client', 'Chloe Bergeron'], ['Service', 'Signature Facial · 60 min'], ['When', 'Wed, Oct 21 · 11:00 AM']].forEach(([l, v], i) => {
          text(l, x + 18, y + 60 + i * 30, 12, 500, MUTED); text(v, x + 92, y + 60 + i * 30, 12.5, 600, '#16162a');
        });
        fillRR(x + 18, y + 142, 14, 14, 3, C.primary); check(x + 25, y + 149, 9, '#fff', 2); text('Send SMS reminder the day before', x + 40, y + 149, 12, 500, '#2a2a44');
        fillRR(x + 18, y + 170, w - 36, 32, 7, C.primary); text('Book appointment', x + w / 2, y + 186, 13, 600, '#fff', 'center');
      }, { dy: 10 });
      ctx.restore();
    }
    // toast for each online booking
    const last = CAL_ADDED.filter((e) => e[0] !== 21 && t >= e[4]).pop();
    if (last) snapIn(t, last[4], 1730, 900, () => {
      card(1580, 858, 300, 78, 12, { shadow: 30, shadowColor: 'rgba(20,20,50,0.2)' });
      ctx.beginPath(); ctx.arc(1608, 897, 13, 0, 7); ctx.fillStyle = C.healthy; ctx.fill(); check(1608, 897, 11, '#fff', 2.5);
      text('Booked online', 1630, 884, 13, 700, '#16162a');
      text(`${last[2]} · ${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][(last[0] + 3) % 7]} ${last[1]}`, 1630, 904, 11.5, 500, MUTED);
      text('Reminder scheduled', 1630, 922, 11, 500, '#1f9d5c');
    }, { dy: 12 });
    pointer(t, [[t0, 1320, 300], [open, 950, 800], [book, 1030, 690], [b(26), 1330, 610]], [open, book], z);
  });
  featureTag(t, t0, 'Booking calendar');
}

// Review requests · send, then the review lands
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
  const fresh = mode === 'feed' && t >= b(29.75);
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
      if (i === 0 && fresh) snapIn(t, b(29.75), kx + 500, y, draw, { dy: -16 }); else draw();
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
function sReviews(t) {
  const t0 = b(27.5), openAt = b(28), s1 = b(28.5), s2 = b(29), feed = b(29.5);
  const sent = (t >= s1) + (t >= s2);
  const isFeed = t >= feed;
  const keys = isFeed ? [[feed, 800, 420, 1.55]] : [[t0, 960, 540, 1], [openAt, 955, 470, 1.45]];
  withCam(t, keys, (z) => {
    if (isFeed) { snapIn(t, feed, W / 2, H / 2, () => reviewsWorld(t, 'feed', 2), { dy: 0, from: 0.97 }); return; }
    snapIn(t, t0, W / 2, H / 2, () => reviewsWorld(t, 'req', sent), { dy: 0, from: 0.97 });
    if (t >= openAt) {
      ctx.fillStyle = 'rgba(30,30,45,0.45)'; ctx.fillRect(0, 0, W, H);
      snapIn(t, openAt, 955, 477, () => {
        const x = 731, y = 127, w = 448;
        card(x, y, w, 700, 12, { shadow: 40, shadowColor: 'rgba(20,20,50,0.25)' });
        text('Send a review request', x + 20, y + 28, 15, 700, '#16162a');
        text('The client gets the same text as an automatic request,', x + 20, y + 52, 12, 400, MUTED);
        text('within about 15 minutes.', x + 20, y + 70, 12, 400, MUTED);
        ctx.fillStyle = '#ececf2'; ctx.fillRect(x, y + 98, w, 1);
        box(x + 20, y + 115, w - 40, 32, 6); text('Search clients by name or phone', x + 46, y + 131, 12, 400, FAINT);
        REQ_ROWS.forEach(([n, sub], i) => {
          const ry = y + 180 + i * 58, isSent = (i === 0 && t >= s1) || (i === 1 && t >= s2), at = i === 0 ? s1 : s2;
          text(n, x + 20, ry - 8, 13, 600, '#16162a'); text(sub, x + 20, ry + 10, 11.5, 400, MUTED);
          if (!isSent) { rr(x + w - 66, ry - 14, 46, 28, 5); ctx.strokeStyle = '#e3e3ec'; ctx.stroke(); text('Send', x + w - 43, ry, 11.5, 500, '#3a3a55', 'center'); }
          else snapIn(t, at, x + w - 48, ry, () => { fillRR(x + w - 92, ry - 14, 72, 28, 14, rgba(C.healthy, 0.16)); check(x + w - 76, ry, 10, '#1f9d5c', 2.2); text('Sent', x + w - 50, ry, 11.5, 600, '#1f9d5c', 'center'); }, { dy: 0, from: 0.8, blur: 4 });
          ctx.fillStyle = '#ececf2'; ctx.fillRect(x, ry + 28, w, 1);
        });
        rr(x + w - 80, y + 655, 60, 30, 6); ctx.strokeStyle = '#e3e3ec'; ctx.stroke(); text('Done', x + w - 50, y + 670, 12.5, 500, '#16162a', 'center');
      }, { dy: 14 });
    }
    pointer(t, [[t0, 900, 640], [openAt, 1258, 300], [s1, 1137, 309], [s2, 1137, 367]], [openAt, s1, s2], z);
  });
  featureTag(t, t0, 'Review requests');
}

// ── 10 · everything else a salon runs on ─────────────────────────────────────
function sToolkit(t) {
  lightBG();
  line(t, [['Everything else,', b(31)], ['in one place.', b(31), C.primary]], W / 2, 220, 88);
  const tiles = [
    ['Online booking', 'Clients book 24/7', 'cal', C.primary], ['Review requests', 'Sent after every visit', 'star', C.attention],
    ['Loyalty rewards', 'Points that bring them back', 'gift', '#db2777'], ['Payments', 'Invoices and card payments', 'card', C.healthy],
    ['Inbox', 'SMS and email in one thread', 'chat', '#0891b2'], ['Automations', 'Follow-ups that run themselves', 'bolt', '#7c3aed'],
  ];
  const tw0 = 470, th = 170, gx = 36, gy = 36, x0 = W / 2 - (3 * tw0 + 2 * gx) / 2, y0 = 360;
  tiles.forEach(([name, desc, ic, col], i) => {
    const x = x0 + (i % 3) * (tw0 + gx), y = y0 + Math.floor(i / 3) * (th + gy), at = b(31.5) + (i * BEAT) / 16;
    snapIn(t, at, x + tw0 / 2, y + th / 2, () => {
      card(x, y, tw0, th, 28);
      fillRR(x + 34, y + th / 2 - 38, 76, 76, 20, rgba(col, 0.13));
      glyph(ic, x + 72, y + th / 2, col);
      text(name, x + 136, y + th / 2 - 18, 32, 700, C.ink);
      text(desc, x + 136, y + th / 2 + 22, 22, 500, MUTED);
    });
  });
}

// ── 11 · Analytics & Predictions (rebuilt from the product) ──────────────────
// Rises happen one at a time; the camera moves onto each card on the beat before it climbs.
const RISE = {
  health: [b(34.5), b(35.25)],
  rebook: [b(36), b(36.75)],
  forecast: [b(37.5), b(38.25)],
  revenue: [b(39), b(39.75)],
  cohort: [b(40.75), b(41.5)],
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
  logoMark(36, 34, 30); text(BRAND.name, 58, 35, 19, 700, '#1a1a33');
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
  const at = b(33), step = BEAT / 16;
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#fafafc'; ctx.fillRect(LAYOUT.side, 0, W - LAYOUT.side, H);
  snapIn(t, at, 150, H / 2, () => dashSidebar(t), { dy: 0, from: 0.98 });
  snapIn(t, at, W / 2, 80, () => dashHeader(), { dy: 0, from: 0.98 });
  [['health', cardHealth], ['rebook', cardRebook], ['revenue', cardRevenue], ['forecast', cardForecast], ['cohort', cardCohort]].forEach(([k, fn], i) => {
    const [x, y, w, h] = cardBox[k];
    snapIn(t, at + step * (i + 1), x + w / 2, y + h / 2, () => fn(t), { dy: 18 });
  });
}
// Camera keys: [time, centre x, centre y, zoom]. Moves start on a beat and settle in 0.4s.
const focus = (k, z) => { const [x, y, w, h] = cardBox[k]; return [x + w / 2, y + h / 2, z]; };
const CAM = [
  [b(33), W / 2, H / 2, 1],
  [b(34), ...focus('health', 2.6)],
  [b(35.5), ...focus('rebook', 2.6)],
  [b(37), ...focus('forecast', 1.95)],
  [b(38.5), ...focus('revenue', 2.6)],
  [b(40.25), W / 2, H / 2, 1],
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
function sDashboard(t) {
  const [cx, cy, z] = camAt(t);
  ctx.save();
  ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-cx, -cy);
  dashboardWorld(t);
  ctx.restore();
}

// ── 12 · tagline ─────────────────────────────────────────────────────────────
function sTagline(t) {
  lightBG();
  line(t, [['Know your customers.', b(42)]], W / 2, H / 2 - 75, 124);
  line(t, [['Keep', b(42.75), C.primary], ['your customers.', b(42.75)]], W / 2, H / 2 + 75, 124);
}

// ── 13 · end card ────────────────────────────────────────────────────────────
function sEnd(t) {
  lightBG();
  const ls = 200, ww = tw(BRAND.name, 150, 700), gap = 40, full = ls + gap + ww;
  const lx = W / 2 - full / 2 + ls / 2, y = H / 2 - 50;
  snapIn(t, b(44), lx, y, () => logoMark(lx, y, ls), { from: 0.7 });
  snapIn(t, b(44) + BEAT / 8, lx + ls / 2 + gap + ww / 2, y, () => text(BRAND.name, lx + ls / 2 + gap, y + 6, 150, 700, C.ink), { dy: 0 });
  line(t, [[BRAND.url, b(44.5), MUTED]], W / 2, H / 2 + 100, 46, { weight: 500 });
  snapIn(t, b(45), W / 2, H / 2 + 210, () => {
    const s = 'Start now · 50% off your first month', w = tw(s, 30, 600) + 64;
    fillRR(W / 2 - w / 2, H / 2 + 178, w, 64, 32, C.primary);
    text(s, W / 2, H / 2 + 211, 30, 600, '#fff', 'center');
  });
  const out = seg(t, DURATION - 0.45, DURATION);
  if (out > 0) { ctx.fillStyle = `rgba(247,247,250,${out})`; ctx.fillRect(0, 0, W, H); }
}

const SCENES = [
  [0, b(5), sHook],            // intro: slower, before the bass comes in
  [b(5), b(7), sRegulars],
  [b(7), b(9.5), sStops],
  [b(9.5), b(11), sGlitch],
  [b(11), b(13.5), sMeet],
  [b(13.5), b(15.5), sWhat],
  [b(15.5), b(17.5), sHealth],
  [b(17.5), b(21), sAnalyst],     // recording: AI Business Analyst
  [b(21), b(23.5), sWinBack],
  [b(23.5), b(27.5), sCalendar],  // recording: booking calendar (October)
  [b(27.5), b(31), sReviews],     // recording: review requests
  [b(31), b(33), sToolkit],
  [b(33), b(42), sDashboard],
  [b(42), b(44), sTagline],
  [b(44), DURATION + 1, sEnd],
];

function renderFrame(t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = 1; ctx.filter = 'none'; ctx.globalCompositeOperation = 'source-over';
  const [a, , fn] = SCENES.find(([s, e]) => t >= s && t < e) ?? SCENES[SCENES.length - 1];
  // hard cut on the beat with a short punch-in
  const k = ease.expo(seg(t, a, a + 0.16));
  ctx.save();
  if (a > 0 && k < 1) { const s = 1.035 - 0.035 * k; ctx.translate(W / 2, H / 2); ctx.scale(s, s); ctx.translate(-W / 2, -H / 2); }
  fn(t);
  ctx.restore();
}

window.DURATION = DURATION;
window.renderFrame = renderFrame;
window.ready = (async () => {
  ctx = document.getElementById('c').getContext('2d');
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
