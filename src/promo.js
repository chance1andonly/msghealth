// MsgHealth · 36.5s kinetic product promo (1920 × 1080, 60 fps)
// Clean motion-graphics style: big type that snaps in word by word, product cards, one dark
// glitch beat, then the Analytics & Predictions dashboard with its numbers rising one at a time.
// Nothing pulses or drifts: things appear on the beat, hold, and scenes cut on the beat.
'use strict';

const W = 1920, H = 1080, FPS = 60;
const DURATION = 36.54;
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

// ── 8 · who is about to leave, and why ───────────────────────────────────────
function sChurn(t) {
  lightBG();
  line(t, [['See who’s about to leave,', b(17.5)], ['and why.', b(17.75), C.primary]], W / 2, 210, 80);
  const y = 330, h = 560, w = 680;
  const cards = [
    { x: 250, at: b(18), title: 'Top churn risks', sub: 'The clients most likely to leave',
      rows: [['Jordan Lee', 72, '72%', C.risk], ['Priya Shah', 58, '58%', C.attention], ['Morgan Diaz', 44, '44%', C.attention], ['Alex Kim', 12, '12%', C.healthy]] },
    { x: 990, at: b(18.125), title: 'Churn risk drivers', sub: 'What is pushing risk up, by clients affected',
      rows: [['Overdue 60+ days', 100, '13', IND], ['Low visit frequency', 54, '7', IND], ['No-show streak', 23, '3', IND], ['Low ratings', 15, '2', IND]] },
  ];
  cards.forEach((c) => snapIn(t, c.at, c.x + w / 2, y + h / 2, () => {
    card(c.x, y, w, h, 28);
    text(c.title, c.x + 44, y + 64, 34, 700, C.ink);
    text(c.sub, c.x + 44, y + 106, 22, 500, FAINT);
    c.rows.forEach(([n, pct, val, col], i) => {
      const ry = y + 190 + i * 92, fill = ease.out(seg(t, c.at + 0.08 + i * 0.04, c.at + 0.4 + i * 0.04));
      text(n, c.x + 44, ry, 26, 600, C.ink);
      text(val, c.x + w - 44, ry, 26, 700, col, 'right');
      fillRR(c.x + 44, ry + 26, w - 88, 12, 6, LINE);
      fillRR(c.x + 44, ry + 26, ((w - 88) * pct * fill) / 100, 12, 6, col);
    });
  }));
}

// ── 9 · win them back on autopilot ───────────────────────────────────────────
function sWinBack(t) {
  lightBG('#7c3aed');
  line(t, [['Win them back', b(19.5)], ['on autopilot.', b(19.5), C.primary]], W / 2, 190, 88);
  const nodes = [['At risk detected', C.risk, 'alert'], ['SMS sent', C.primary, 'chat'], ['Email follow-up', '#0891b2', 'mail'], ['Invite to book', C.healthy, 'cal']];
  const nw = 330, nh = 130, gap = 70, x0 = W / 2 - (4 * nw + 3 * gap) / 2, ny = 330;
  nodes.forEach(([label, col, icon], i) => {
    const x = x0 + i * (nw + gap), at = b(20) + (i * BEAT) / 8;
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
  snapIn(t, b(20.5), 640, by + 80, () => {
    avatar(470, by + 60, 30, 'S', C.primary);
    fillRR(520, by, 640, 140, 30, '#ececf4');
    text("Hi Jordan! We miss you. Want your usual", 556, by + 50, 28, 500, C.ink);
    text('Thursday at 10:00?', 556, by + 92, 28, 500, C.ink);
  });
  snapIn(t, b(20.75), 1300, by + 230, () => {
    fillRR(1060, by + 175, 400, 100, 30, C.primary);
    text('Yes please! See you then.', 1094, by + 226, 28, 600, '#fff');
    avatar(1510, by + 225, 30, 'JL', C.primary);
  });
  snapIn(t, b(21), W / 2, by + 360, () => {
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

// ── 10 · everything else a salon runs on ─────────────────────────────────────
function sToolkit(t) {
  lightBG();
  line(t, [['Everything else,', b(22)], ['in one place.', b(22), C.primary]], W / 2, 220, 88);
  const tiles = [
    ['Online booking', 'Clients book 24/7', 'cal', C.primary], ['Review requests', 'Sent after every visit', 'star', C.attention],
    ['Loyalty rewards', 'Points that bring them back', 'gift', '#db2777'], ['Payments', 'Invoices and card payments', 'card', C.healthy],
    ['Inbox', 'SMS and email in one thread', 'chat', '#0891b2'], ['Automations', 'Follow-ups that run themselves', 'bolt', '#7c3aed'],
  ];
  const tw0 = 470, th = 170, gx = 36, gy = 36, x0 = W / 2 - (3 * tw0 + 2 * gx) / 2, y0 = 360;
  tiles.forEach(([name, desc, ic, col], i) => {
    const x = x0 + (i % 3) * (tw0 + gx), y = y0 + Math.floor(i / 3) * (th + gy), at = b(22.5) + (i * BEAT) / 16;
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
  health: [b(25.5), b(26.25)],
  rebook: [b(27), b(27.75)],
  forecast: [b(28.5), b(29.25)],
  revenue: [b(30), b(30.75)],
  cohort: [b(31.75), b(32.5)],
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
function dashSidebar(t) {
  const L = LAYOUT;
  ctx.fillStyle = '#fbfbfd'; ctx.fillRect(0, 0, L.side, H);
  ctx.fillStyle = '#ececf2'; ctx.fillRect(L.side, 0, 1, H);
  logoMark(36, 34, 30); text(BRAND.name, 58, 35, 19, 700, '#1a1a33');
  const bh = Math.round(lerp(41, 88, r(t, 'cohort')));
  text('Business health', 18, 80, 13, 500, MUTED);
  text(`${bh}`, 236, 80, 13, 700, '#16162a', 'right'); text('/100', 266, 80, 13, 500, FAINT, 'right');
  fillRR(18, 94, 264, 5, 3, LINE); fillRR(18, 94, (264 * bh) / 100, 5, 3, bh > 70 ? '#22c55e' : bh > 50 ? C.attention : C.risk);
  fillRR(14, 114, 272, 34, 6, '#fff'); rr(14, 114, 272, 34, 6); ctx.strokeStyle = '#e6e6ee'; ctx.stroke();
  text('Ask AI Analyst', 46, 131, 13, 500, '#3a3a55');
  const nav = [['Dashboard', 0, 1], ['Dashboard', 1], ['Action Center', 1], ['Analytics & Predictions', 1, 2], ['At-Risk Clients', 1], ['Custom Reports', 1], ['Marketing Sources', 1],
    ['Finance', 0], ['Customers', 0], ['Messages', 0], ['Calls & Video', 0], ['Marketing', 0], ['Scheduling & Jobs', 0], ['Team & Tools', 0]];
  let y = 180;
  nav.forEach(([n, sub, on]) => {
    if (on === 2) fillRR(34, y - 13, 248, 27, 5, rgba(C.primary, 0.09));
    if (!sub) { fillRR(20, y - 7, 14, 14, 3, '#c5c5d6'); }
    text(n, sub ? 42 : 44, y + 1, 13.5, on ? 600 : 500, on === 2 ? C.primary : sub ? '#4a4a66' : '#22223a');
    y += sub ? 29 : 34;
  });
  avatar(30, H - 34, 14, 'S', '#16162a');
  text('Support', 54, H - 41, 13, 600, '#22223a'); text('Owner', 54, H - 25, 11, 500, FAINT);
}
function dashHeader() {
  const x = LAYOUT.x0;
  text('Analytics & Predictions', x, 32, 19, 700, '#16162a');
  text('Your business at a glance: health, revenue, activity and forecasts that update automatically.', x, 54, 12, 400, MUTED);
  [['AI Analyst', 1290, 100], ['Search anything…', 1404, 190], ['My Dashboard', 1608, 128]].forEach(([s, bx, bw]) => {
    rr(bx, 20, bw, 32, 6); ctx.strokeStyle = '#e3e3ec'; ctx.lineWidth = 1.2; ctx.stroke(); text(s, bx + 14, 36, 12, 500, '#3a3a55');
  });
  fillRR(1750, 20, 140, 32, 6, C.primary); text('+ Add Client', 1820, 36, 12.5, 600, '#fff', 'center');
  ['Overview', 'Revenue', 'Retention', 'Economics', 'Growth'].forEach((s, i) => {
    const tx = x + 10 + i * 86;
    text(s, tx, 114, 12.5, i === 2 ? 600 : 500, i === 2 ? '#16162a' : '#55556f');
    if (i === 2) { ctx.fillStyle = '#16162a'; ctx.fillRect(tx - 10, 131, tw(s, 12.5, 600) + 20, 2); }
  });
  ctx.fillStyle = '#ececf2'; ctx.fillRect(x, 133, 1560, 1);
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
  const at = b(24), step = BEAT / 16;
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
  [b(24), W / 2, H / 2, 1],
  [b(25), ...focus('health', 2.6)],
  [b(26.5), ...focus('rebook', 2.6)],
  [b(28), ...focus('forecast', 1.95)],
  [b(29.5), ...focus('revenue', 2.6)],
  [b(31.25), W / 2, H / 2, 1],
];
function camAt(t) {
  let c = CAM[0].slice(1);
  for (let i = 1; i < CAM.length; i++) {
    const [at, ...to] = CAM[i];
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
  line(t, [['Know your customers.', b(33)]], W / 2, H / 2 - 75, 124);
  line(t, [['Keep', b(33.75), C.primary], ['your customers.', b(33.75)]], W / 2, H / 2 + 75, 124);
}

// ── 13 · end card ────────────────────────────────────────────────────────────
function sEnd(t) {
  lightBG();
  const ls = 200, ww = tw(BRAND.name, 150, 700), gap = 40, full = ls + gap + ww;
  const lx = W / 2 - full / 2 + ls / 2, y = H / 2 - 50;
  snapIn(t, b(35), lx, y, () => logoMark(lx, y, ls), { from: 0.7 });
  snapIn(t, b(35) + BEAT / 8, lx + ls / 2 + gap + ww / 2, y, () => text(BRAND.name, lx + ls / 2 + gap, y + 6, 150, 700, C.ink), { dy: 0 });
  line(t, [[BRAND.url, b(35.5), MUTED]], W / 2, H / 2 + 100, 46, { weight: 500 });
  snapIn(t, b(36), W / 2, H / 2 + 210, () => {
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
  [b(17.5), b(19.5), sChurn],
  [b(19.5), b(22), sWinBack],
  [b(22), b(24), sToolkit],
  [b(24), b(33), sDashboard],
  [b(33), b(35), sTagline],
  [b(35), DURATION + 1, sEnd],
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
