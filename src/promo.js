// MsgHealth · 14.4s kinetic product promo (1920 × 1080)
// Clean motion-graphics style: big type revealed word by word, soft gradient light,
// product cards gliding in, one dark glitch beat. Every cut lands on the music.
'use strict';

const W = 1920, H = 1080, FPS = 24;
const DURATION = 14.4;
const C = BRAND.colors;
const FONT = 'Inter';

// Beat grid of assets/audio/promo-track.m4a (~65 BPM, first downbeat at 0.86s).
const BEAT = 0.917, B0 = 0.86;
const b = (k) => B0 + k * BEAT;

let ctx = null, LOGO = null;

// ── maths ────────────────────────────────────────────────────────────────────
const clamp = (v, a = 0, c = 1) => Math.max(a, Math.min(c, v));
const lerp = (a, c, t) => a + (c - a) * t;
const seg = (t, a, c) => clamp((t - a) / (c - a));
const ease = {
  out: (t) => 1 - Math.pow(1 - t, 3),
  expo: (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  inOut: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  back: (t) => { const s = 1.6; return 1 + (s + 1) * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2); },
};
const hash = (n) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
function rgba(hex, a) { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; }

// ── drawing primitives ───────────────────────────────────────────────────────
function rr(x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }
function card(x, y, w, h, r, o = {}) {
  ctx.save();
  ctx.shadowColor = o.shadowColor ?? 'rgba(30,27,75,0.10)';
  ctx.shadowBlur = o.shadow ?? 40; ctx.shadowOffsetY = (o.shadow ?? 40) * 0.35;
  rr(x, y, w, h, r); ctx.fillStyle = o.fill ?? '#ffffff'; ctx.fill();
  ctx.restore();
  if (o.stroke) { rr(x, y, w, h, r); ctx.strokeStyle = o.stroke; ctx.lineWidth = o.lw ?? 1.5; ctx.stroke(); }
}
function font(size, weight = 600) { ctx.font = `${weight} ${size}px ${FONT}`; ctx.letterSpacing = `${(-size * 0.03).toFixed(2)}px`; }
function text(s, x, y, size, weight, color, align = 'left') {
  font(size, weight); ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.fillStyle = color; ctx.fillText(s, x, y);
}
function tw(s, size, weight = 600) { font(size, weight); return ctx.measureText(s).width; }
function avatar(x, y, r, initials, color) {
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = rgba(color, 0.16); ctx.fill();
  text(initials, x, y + 1, r * 0.8, 700, color, 'center');
}
function pill(x, y, label, color, size = 22, align = 'left') {
  const w = tw(label, size, 600) + size * 1.3, h = size * 1.7;
  const x0 = align === 'center' ? x - w / 2 : align === 'right' ? x - w : x;
  rr(x0, y - h / 2, w, h, h / 2); ctx.fillStyle = rgba(color, 0.14); ctx.fill();
  text(label, x0 + w / 2, y + 1, size, 600, color, 'center');
  return w;
}
function logoMark(x, y, s, a = 1) {
  if (!LOGO || a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.drawImage(LOGO, x - s / 2, y - s / 2, s, s); ctx.restore();
}
// Draw `fn` with a blur / alpha / scale envelope around (cx, cy).
function fx(o, fn) {
  const { a = 1, blur = 0, s = 1, cx = W / 2, cy = H / 2, dx = 0, dy = 0 } = o;
  if (a <= 0.001) return;
  ctx.save();
  ctx.globalAlpha *= clamp(a);
  if (blur > 0.3) ctx.filter = `blur(${blur.toFixed(1)}px)`;
  ctx.translate(cx + dx, cy + dy); ctx.scale(s, s); ctx.translate(-cx, -cy);
  fn();
  ctx.restore();
}
// In/out envelope: p rises over [a, a+inD], falls over [c-outD, c].
const env = (t, a, c, inD = 0.3, outD = 0.25) => Math.min(ease.out(seg(t, a, a + inD)), 1 - ease.inOut(seg(t, c - outD, c)));

// Words revealed one by one, each sharpening out of a blur. words: [text, color?]
function words(t, list, x, y, size, t0, o = {}) {
  const weight = o.weight ?? 700, stagger = o.stagger ?? 0.12, dur = o.dur ?? 0.4, gap = size * 0.26;
  const ws = list.map(([s]) => tw(s, size, weight));
  const total = ws.reduce((p, w) => p + w, 0) + gap * (list.length - 1);
  let cx = o.align === 'left' ? x : x - total / 2;
  const out = o.out != null ? ease.inOut(seg(t, o.out, o.out + 0.25)) : 0;
  list.forEach(([s, col], i) => {
    const p = ease.out(seg(t, t0 + i * stagger, t0 + i * stagger + dur));
    const a = p * (1 - out);
    if (a > 0.001) {
      ctx.save();
      ctx.globalAlpha *= a;
      const bl = (1 - p) * 16 + out * 14;
      if (bl > 0.3) ctx.filter = `blur(${bl.toFixed(1)}px)`;
      text(s, cx, y + (1 - p) * size * 0.35 - out * size * 0.2, size, weight, col ?? C.ink);
      ctx.restore();
    }
    cx += ws[i] + gap;
  });
  return total;
}

// ── backgrounds ──────────────────────────────────────────────────────────────
function lightBG(t, tint = C.primary) {
  ctx.fillStyle = '#f7f7fa'; ctx.fillRect(0, 0, W, H);
  const blobs = [[0.18, 0.25, tint, 0.10], [0.85, 0.2, '#e879f9', 0.07], [0.7, 0.9, '#38bdf8', 0.07], [0.3, 0.85, tint, 0.06]];
  blobs.forEach(([bx, by, col, a], i) => {
    const x = (bx + 0.04 * Math.sin(t * 0.6 + i * 2)) * W, y = (by + 0.04 * Math.cos(t * 0.5 + i)) * H;
    const g = ctx.createRadialGradient(x, y, 0, x, y, 720);
    g.addColorStop(0, rgba(col, a)); g.addColorStop(1, rgba(col, 0));
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  });
}
function darkBG(t) {
  ctx.fillStyle = '#0a0a0f'; ctx.fillRect(0, 0, W, H);
  const g = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, 900);
  g.addColorStop(0, 'rgba(79,70,229,0.16)'); g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}
function scanlines(a) {
  ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = '#000';
  for (let y = 0; y < H; y += 4) ctx.fillRect(0, y, W, 2);
  ctx.restore();
}

// ── scenes ───────────────────────────────────────────────────────────────────
// 1 · 0 – 1.78 · hook
function sHook(t) {
  lightBG(t);
  const up = ease.inOut(seg(t, b(0) - 0.1, b(0) + 0.25));
  words(t, [['Your'], ['customers']], W / 2, H / 2 - up * 70, 120, 0.05, { out: b(1) - 0.25 });
  words(t, [["don't"], ['say'], ['goodbye.', C.primary]], W / 2, H / 2 + 80, 120, b(0), { out: b(1) - 0.25 });
}

// 2 · 1.78 – 3.61 · the quiet signals
const SIGNALS = [
  { n: 'Jordan Lee', i: 'JL', c: '#4f46e5', l: 'Last visit 62 days ago', x: 470, y: 330, r: -4 },
  { n: 'Priya Shah', i: 'PS', c: '#db2777', l: 'Delivered · no reply', x: 1450, y: 300, r: 3 },
  { n: 'Morgan Diaz', i: 'MD', c: '#0891b2', l: "Didn't rebook", x: 560, y: 780, r: 3 },
  { n: 'Alex Kim', i: 'AK', c: '#d97706', l: 'Cancelled twice', x: 1390, y: 800, r: -3 },
];
function signalCard(s, t, t0, k) {
  const p = ease.back(seg(t, t0, t0 + 0.4));
  const drift = Math.sin(t * 1.4 + k) * 8;
  const cw = 440, ch = 116;
  fx({ a: seg(t, t0, t0 + 0.2), s: 0.85 + 0.15 * p, cx: s.x, cy: s.y, dy: (1 - p) * 40 + drift }, () => {
    ctx.translate(s.x, s.y); ctx.rotate((s.r * Math.PI) / 180); ctx.translate(-s.x, -s.y);
    const x = s.x - cw / 2, y = s.y - ch / 2;
    card(x, y, cw, ch, 26);
    avatar(x + 62, y + ch / 2, 34, s.i, s.c);
    text(s.n, x + 116, y + 42, 30, 700, C.ink);
    text(s.l, x + 116, y + 80, 24, 500, '#8a8aa3');
    ctx.beginPath(); ctx.arc(x + cw - 34, y + 36, 8, 0, Math.PI * 2); ctx.fillStyle = C.risk; ctx.fill();
  });
}
function sSignals(t) {
  lightBG(t);
  const t0 = b(1);
  const fade = 1 - ease.inOut(seg(t, b(2) + 0.05, b(2) + 0.4)); // cards recede behind the line
  fx({ blur: (1 - fade) * 10, a: 0.35 + 0.65 * fade, s: 1 + (1 - fade) * 0.06 }, () =>
    SIGNALS.forEach((s, k) => signalCard(s, t, t0 + k * (BEAT / 4), k)));
  words(t, [['They'], ['just'], ['go'], ['quiet.', C.primary]], W / 2, H / 2, 118, b(2), { stagger: 0.1 });
}

// 3 · 3.61 – 4.53 · dark glitch beat
function sGlitch(t) {
  darkBG(t);
  const k = t - b(3);
  const hit = Math.max(0, 1 - k / 0.25);                    // RGB split on the downbeat
  const jitter = hash(Math.floor(t * 24)) - 0.5;
  const line = "Then they're gone.";
  const y = H / 2;
  const reveal = ease.out(seg(k, 0, 0.35));
  ctx.save();
  ctx.globalAlpha = reveal;
  ctx.filter = `blur(${((1 - reveal) * 10).toFixed(1)}px)`;
  ctx.shadowColor = 'rgba(255,255,255,0.55)'; ctx.shadowBlur = 28;
  ctx.globalCompositeOperation = 'lighter';
  const off = 14 * hit + 3;
  text(line, W / 2 - off + jitter * 10 * hit, y, 112, 600, 'rgba(255,40,80,0.85)', 'center');
  text(line, W / 2 + off, y, 112, 600, 'rgba(40,220,255,0.85)', 'center');
  text(line, W / 2, y, 112, 600, 'rgba(255,255,255,0.9)', 'center');
  ctx.restore();
  // horizontal slice tears
  if (hit > 0 || k > 0.75) {
    const n = 5;
    for (let i = 0; i < n; i++) {
      const sy = hash(i + Math.floor(t * 24) * 7) * H, sh = 6 + hash(i * 3.1) * 26;
      const sx = (hash(i * 9.7 + t) - 0.5) * 80;
      ctx.drawImage(ctx.canvas, 0, sy, W, sh, sx, sy, W, sh);
    }
  }
  scanlines(0.28);
  // flash to white into the reveal
  const fl = seg(t, b(4) - 0.12, b(4));
  if (fl > 0) { ctx.fillStyle = `rgba(247,247,250,${fl})`; ctx.fillRect(0, 0, W, H); }
}

// 4 · 4.53 – 6.36 · Meet MsgHealth
function sMeet(t) {
  lightBG(t);
  const t0 = b(4), t1 = b(5);
  // "Meet" with three bouncing dots
  const meetOut = ease.inOut(seg(t, t1 - 0.15, t1 + 0.1));
  fx({ a: 1 - meetOut, blur: meetOut * 12 }, () => {
    const mw = words(t, [['Meet']], W / 2 - 40, H / 2, 130, t0 + 0.02, { dur: 0.35 });
    for (let i = 0; i < 3; i++) {
      const p = ease.out(seg(t, t0 + 0.25 + i * 0.12, t0 + 0.45 + i * 0.12));
      const bob = Math.sin((t - t0) * 9 - i * 1.1) * 10 * p;
      ctx.beginPath(); ctx.arc(W / 2 - 40 + mw / 2 + 36 + i * 30, H / 2 + 30 - bob, 9 * p, 0, Math.PI * 2);
      ctx.fillStyle = [C.primary, '#db2777', '#0891b2'][i]; ctx.fill();
    }
  });
  // logo presses in, wordmark slides out from behind it
  const p = ease.back(seg(t, t1, t1 + 0.45));
  const slide = ease.expo(seg(t, t1 + 0.2, t1 + 0.75));
  const ww = tw(BRAND.name, 150, 700), gap = 36, ls = 170;
  const full = ls + gap + ww;
  const lx = lerp(W / 2, W / 2 - full / 2 + ls / 2, slide);
  fx({ a: seg(t, t1, t1 + 0.15), s: 0.6 + 0.4 * p, cx: lx, cy: H / 2 }, () => {
    const g = ctx.createRadialGradient(lx, H / 2, 0, lx, H / 2, 260);
    g.addColorStop(0, rgba(C.primary, 0.22 * p)); g.addColorStop(1, rgba(C.primary, 0));
    ctx.fillStyle = g; ctx.fillRect(lx - 300, H / 2 - 300, 600, 600);
    logoMark(lx, H / 2, ls);
  });
  if (slide > 0) {
    ctx.save();
    const x0 = lx + ls / 2 + gap;
    ctx.beginPath(); ctx.rect(x0 - 10, 0, W, H); ctx.clip();
    ctx.globalAlpha = slide;
    if (slide < 0.98) ctx.filter = `blur(${((1 - slide) * 10).toFixed(1)}px)`;
    text(BRAND.name, x0 - (1 - slide) * 120, H / 2 + 6, 150, 700, C.ink);
    ctx.restore();
  }
  words(t, [['Customer'], ['health,'], ['before'], ["it's"], ['too'], ['late.']], W / 2, H / 2 + 160, 40, t1 + 0.5, { weight: 500, stagger: 0.05, dur: 0.3 });
}

// 5 · 6.36 – 8.20 · Client Health dashboard, tilted then flattening into Jordan's row
const ROWS = [
  { n: 'Alex Kim', i: 'AK', c: '#d97706', s: 91, st: 'Healthy', sc: C.healthy, v: '4 days ago' },
  { n: 'Priya Shah', i: 'PS', c: '#db2777', s: 54, st: 'Needs attention', sc: C.attention, v: '3 weeks ago' },
  { n: 'Jordan Lee', i: 'JL', c: '#4f46e5', s: 38, st: 'At risk', sc: C.risk, v: '62 days ago' },
  { n: 'Casey Park', i: 'CP', c: '#0891b2', s: 86, st: 'Healthy', sc: C.healthy, v: '1 week ago' },
  { n: 'Riley Chen', i: 'RC', c: '#7c3aed', s: 79, st: 'Healthy', sc: C.healthy, v: '9 days ago' },
];
function dashboard(t, t0) {
  const x = 260, y = 150, w = 1400, h = 800;
  // glow border like a lit glass panel
  ctx.save();
  const gr = ctx.createLinearGradient(x, y, x + w, y + h);
  gr.addColorStop(0, '#e879f9'); gr.addColorStop(0.5, C.primary); gr.addColorStop(1, '#38bdf8');
  ctx.shadowColor = rgba(C.primary, 0.35); ctx.shadowBlur = 80;
  rr(x - 3, y - 3, w + 6, h + 6, 34); ctx.fillStyle = gr; ctx.fill();
  ctx.restore();
  card(x, y, w, h, 32, { shadow: 0 });
  // sidebar
  ctx.save(); rr(x, y, 300, h, 32); ctx.clip(); ctx.fillStyle = '#f3f3f8'; ctx.fillRect(x, y, 300, h); ctx.restore();
  logoMark(x + 52, y + 56, 44);
  text(BRAND.name, x + 86, y + 57, 28, 700, C.ink);
  BRAND.nav.forEach((n, i) => {
    const ny = y + 140 + i * 62, on = i === 0;
    if (on) { rr(x + 20, ny - 24, 260, 48, 14); ctx.fillStyle = rgba(C.primary, 0.12); ctx.fill(); }
    ctx.beginPath(); ctx.roundRect(x + 40, ny - 9, 18, 18, 5); ctx.fillStyle = on ? C.primary : '#c9c9d9'; ctx.fill();
    text(n, x + 74, ny + 1, 24, on ? 700 : 500, on ? C.primary : '#6b6b85');
  });
  // header
  const mx = x + 350;
  text('Client Health', mx, y + 70, 44, 700, C.ink);
  pill(x + w - 50, y + 70, '1 at risk', C.risk, 22, 'right');
  ['Client', 'Last visit', 'Health', 'Status'].forEach((hd, i) => text(hd, mx + [0, 400, 640, 820][i], y + 150, 20, 600, '#9a9ab0'));
  ROWS.forEach((r, i) => {
    const ry = y + 220 + i * 112;
    const rp = ease.out(seg(t, t0 + 0.1 + i * 0.06, t0 + 0.5 + i * 0.06));
    const jordan = i === 2;
    const dim = jordan ? 0 : 0.55 * ease.inOut(seg(t, b(7), b(7) + 0.4)); // focus on Jordan
    fx({ a: rp * (1 - dim), dy: (1 - rp) * 30 }, () => {
      const drop = ease.inOut(seg(t, t0 + 0.45, b(7)));
      const score = jordan ? Math.round(lerp(78, 38, drop)) : r.s;
      const flag = jordan ? ease.back(seg(t, b(7), b(7) + 0.35)) : 1;
      if (jordan) {
        const hl = ease.out(seg(t, b(7), b(7) + 0.3));
        rr(mx - 24, ry - 46, w - 380, 92, 18); ctx.fillStyle = rgba(C.risk, 0.07 * hl); ctx.fill();
      }
      ctx.fillStyle = '#ececf4'; ctx.fillRect(mx, ry + 56, w - 400, 2);
      avatar(mx + 30, ry, 28, r.i, r.c);
      text(r.n, mx + 76, ry + 1, 28, 600, C.ink);
      text(r.v, mx + 400, ry + 1, 24, 500, jordan ? C.risk : '#6b6b85');
      // score bar
      const col = jordan ? (score > 60 ? C.healthy : score > 45 ? C.attention : C.risk) : r.sc;
      rr(mx + 640, ry - 6, 120, 12, 6); ctx.fillStyle = '#ececf4'; ctx.fill();
      rr(mx + 640, ry - 6, 120 * score / 100, 12, 6); ctx.fillStyle = col; ctx.fill();
      text(String(score), mx + 600, ry + 1, 26, 700, col, 'right');
      if (!jordan || flag > 0) fx({ s: jordan ? flag : 1, cx: mx + 900, cy: ry, a: jordan ? clamp(flag) : 1 }, () =>
        pill(mx + 820, ry, jordan && flag <= 0 ? 'Healthy' : r.st, jordan ? C.risk : r.sc, 22));
    });
  });
}
function sDashboard(t) {
  lightBG(t);
  const t0 = b(6);
  const enter = ease.expo(seg(t, t0, t0 + 0.7));
  const flat = ease.inOut(seg(t, t0 + 0.3, b(7) + 0.1));
  const push = ease.inOut(seg(t, b(7) - 0.1, b(8)));
  ctx.save();
  // tilted glass plane (affine): rotate + skew, easing to flat while the camera pushes in on Jordan
  const tilt = 1 - flat;
  const cx = W / 2, cy = H / 2;
  const fy = 150 + 220 + 2 * 112; // Jordan's row
  const zoom = lerp(1, 1.35, push);
  ctx.translate(cx + (1 - enter) * 500, cy + (1 - enter) * 380);
  ctx.scale(zoom, zoom);
  ctx.translate(0, -(fy - cy) * push);
  ctx.transform(1, -0.16 * tilt, 0.42 * tilt, 1 - 0.12 * tilt, 0, 0);
  ctx.scale(lerp(0.8, 0.92, flat), lerp(0.8, 0.92, flat));
  ctx.translate(-cx, -cy);
  ctx.globalAlpha = seg(t, t0, t0 + 0.2);
  dashboard(t, t0);
  ctx.restore();
  // signals callout on Jordan
  const cp = ease.back(seg(t, b(7) + 0.3, b(7) + 0.65));
  if (cp > 0) fx({ a: clamp(cp), s: 0.9 + 0.1 * cp, cx: 1300, cy: 640, dy: (1 - cp) * 20 }, () => {
    card(980, 640, 640, 190, 28, { shadow: 70, shadowColor: 'rgba(30,27,75,0.22)', stroke: rgba(C.risk, 0.35), lw: 2 });
    text('Why Jordan is at risk', 1020, 692, 30, 700, C.ink);
    pill(1020, 770, 'Visit overdue', C.risk, 28);
    pill(1020 + 250, 770, 'No reply', C.attention, 28);
  });
}

// 6 · 8.20 – 10.03 · automation runs itself
const STEPS = [
  ['Detecting', 'At-risk client'],
  ['Writing', 'Win-back SMS'],
  ['Sending', 'Follow-up email'],
  ['Inviting', 'Book Thursday 10:00'],
];
function sAutomation(t) {
  lightBG(t, '#7c3aed');
  const t0 = b(8);
  const cam = 1 + 0.04 * seg(t, t0, b(10));
  fx({ s: cam }, () => {
    const x = 330, y0 = 300, gapY = 120;
    const step = (i) => t0 + 0.05 + i * (BEAT / 2);
    STEPS.forEach(([verb, obj], i) => {
      const p = ease.out(seg(t, step(i) - 0.1, step(i) + 0.25));
      const active = t >= step(i) && t < step(i + 1);
      const done = t >= step(i + 1);
      const y = y0 + i * gapY;
      fx({ a: 0.25 + 0.75 * p, blur: (1 - p) * 6 }, () => {
        // status icon
        ctx.beginPath(); ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.fillStyle = done ? C.healthy : active ? C.primary : '#d4d4e2'; ctx.fill();
        if (done) { ctx.strokeStyle = '#fff'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x - 8, y); ctx.lineTo(x - 2, y + 7); ctx.lineTo(x + 9, y - 7); ctx.stroke(); }
        if (active) { const a = (t * 6) % (Math.PI * 2); ctx.strokeStyle = '#fff'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(x, y, 9, a, a + 4); ctx.stroke(); }
        text(verb, x + 48, y + 1, 52, active ? 700 : 500, active ? C.ink : '#8a8aa3');
        const vw = tw(verb, 52, active ? 700 : 500);
        const ow = tw(obj, 30, 600) + 36;
        rr(x + 48 + vw + 24, y - 26, ow, 52, 12);
        ctx.fillStyle = active ? rgba(C.primary, 0.12) : '#ececf4'; ctx.fill();
        text(obj, x + 48 + vw + 42, y + 1, 30, 600, active ? C.primary : '#9a9ab0');
        if (active) { // corner brackets on the active line
          const bx0 = x - 40, bx1 = x + 48 + vw + 24 + ow + 20, by0 = y - 44, by1 = y + 44, L = 16;
          ctx.strokeStyle = C.primary; ctx.lineWidth = 3;
          [[bx0, by0, 1, 1], [bx1, by0, -1, 1], [bx0, by1, 1, -1], [bx1, by1, -1, -1]].forEach(([cx, cy, sx, sy]) => {
            ctx.beginPath(); ctx.moveTo(cx + sx * L, cy); ctx.lineTo(cx, cy); ctx.lineTo(cx, cy + sy * L); ctx.stroke();
          });
        }
      });
    });
    // the phone receives the text and Jordan replies
    const px = 1270, py = 170, pw = 420, ph = 760;
    const pe = ease.expo(seg(t, t0 + 0.3, t0 + 0.9));
    fx({ a: pe, dy: (1 - pe) * 140, cx: px + pw / 2, cy: py + ph / 2 }, () => {
      card(px, py, pw, ph, 64, { fill: '#111118', shadow: 60, shadowColor: 'rgba(30,27,75,0.25)' });
      rr(px + 14, py + 14, pw - 28, ph - 28, 52); ctx.fillStyle = '#ffffff'; ctx.fill();
      rr(px + pw / 2 - 60, py + 30, 120, 30, 15); ctx.fillStyle = '#111118'; ctx.fill();
      text("Sam's Studio", px + pw / 2, py + 110, 26, 700, C.ink, 'center');
      text('Text message', px + pw / 2, py + 142, 18, 500, '#9a9ab0', 'center');
      const m1 = ease.back(seg(t, step(1) + 0.15, step(1) + 0.45));
      if (m1 > 0) fx({ a: clamp(m1), s: m1, cx: px + 40, cy: py + 260 }, () => {
        rr(px + 36, py + 190, 300, 150, 26); ctx.fillStyle = '#ececf4'; ctx.fill();
        ['Hi Jordan! We miss you.', 'Want your usual', 'Thursday at 10:00?'].forEach((l, i) => text(l, px + 60, py + 230 + i * 36, 22, 500, C.ink));
      });
      const typing = t > step(2) && t < step(3) + 0.1;
      if (typing) {
        rr(px + pw - 150, py + 380, 110, 54, 27); ctx.fillStyle = rgba(C.primary, 0.15); ctx.fill();
        for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(px + pw - 120 + i * 25, py + 407 - Math.abs(Math.sin(t * 8 + i)) * 6, 6, 0, Math.PI * 2); ctx.fillStyle = C.primary; ctx.fill(); }
      }
      const m2 = ease.back(seg(t, step(3) + 0.1, step(3) + 0.4));
      if (m2 > 0) fx({ a: clamp(m2), s: m2, cx: px + pw - 40, cy: py + 420 }, () => {
        rr(px + pw - 320, py + 370, 284, 112, 26); ctx.fillStyle = C.primary; ctx.fill();
        text('Yes please!', px + pw - 296, py + 408, 24, 600, '#fff');
        text('Thursday works.', px + pw - 296, py + 444, 22, 500, 'rgba(255,255,255,0.9)');
      });
    });
  });
}

// 7 · 10.03 – 10.95 · booked, score climbs back
function sResult(t) {
  lightBG(t, C.healthy);
  const t0 = b(10);
  const p = ease.back(seg(t, t0, t0 + 0.4));
  const fill = ease.inOut(seg(t, t0 + 0.15, t0 + 0.8));
  const score = Math.round(lerp(38, 86, fill));
  const col = score > 60 ? C.healthy : score > 45 ? C.attention : C.risk;
  fx({ a: clamp(p * 2), s: 0.85 + 0.15 * p }, () => {
    // health ring
    const rx = 700, ry = H / 2, R = 170;
    ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(rx, ry, R, 0, Math.PI * 2); ctx.strokeStyle = '#e6e6f0'; ctx.lineWidth = 28; ctx.stroke();
    ctx.beginPath(); ctx.arc(rx, ry, R, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * score / 100); ctx.strokeStyle = col; ctx.stroke();
    text(String(score), rx, ry - 8, 120, 800, C.ink, 'center');
    text('Health score', rx, ry + 68, 26, 600, '#8a8aa3', 'center');
    // booking card
    const cp = ease.back(seg(t, t0 + 0.2, t0 + 0.55));
    fx({ a: clamp(cp), dx: (1 - cp) * 80, cx: 1250, cy: ry }, () => {
      card(980, ry - 130, 620, 260, 30, { shadow: 50 });
      ctx.beginPath(); ctx.arc(1060, ry - 50, 34, 0, Math.PI * 2); ctx.fillStyle = C.healthy; ctx.fill();
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(1046, ry - 50); ctx.lineTo(1056, ry - 39); ctx.lineTo(1075, ry - 61); ctx.stroke();
      text('Booked', 1114, ry - 50, 44, 700, C.ink);
      avatar(1060, ry + 50, 30, 'JL', '#4f46e5');
      text('Jordan Lee', 1106, ry + 36, 28, 600, C.ink);
      text('Thursday · 10:00', 1106, ry + 72, 24, 500, '#6b6b85');
      pill(1560, ry + 50, 'Healthy', C.healthy, 22, 'right');
    });
  });
}

// 8 · 10.95 – 12.78 · tagline
function sTagline(t) {
  lightBG(t);
  const [l1, l2] = BRAND.tagline.split('. ').map((s, i) => (i === 0 ? s + '.' : s));
  const t0 = b(11), t1 = b(12);
  const lift = ease.inOut(seg(t, t1 - 0.1, t1 + 0.25));
  fx({ a: 1 - 0.55 * lift, blur: lift * 3 }, () =>
    words(t, l1.split(' ').map((w) => [w]), W / 2, H / 2 - lift * 80, 124, t0 + 0.02));
  words(t, l2.split(' ').map((w, i) => [w, i === 0 ? C.primary : C.ink]), W / 2, H / 2 + 80, 124, t1);
}

// 9 · 12.78 – 14.4 · end card
function sEnd(t) {
  lightBG(t);
  const t0 = b(13);
  const p = ease.back(seg(t, t0, t0 + 0.45));
  const zoom = 1 + 0.03 * seg(t, t0, DURATION);
  fx({ s: zoom }, () => {
    const ls = 200, ww = tw(BRAND.name, 140, 700), gap = 40, full = ls + gap + ww;
    const lx = W / 2 - full / 2 + ls / 2;
    fx({ a: clamp(p * 2), s: 0.7 + 0.3 * p, cx: lx, cy: H / 2 - 40 }, () => logoMark(lx, H / 2 - 40, ls));
    const q = ease.out(seg(t, t0 + 0.12, t0 + 0.5));
    fx({ a: q, blur: (1 - q) * 12, dx: (1 - q) * -40 }, () => text(BRAND.name, lx + ls / 2 + gap, H / 2 - 34, 140, 700, C.ink));
    words(t, [[BRAND.url, '#6b6b85']], W / 2, H / 2 + 120, 44, t0 + 0.46, { weight: 500 });
  });
  const out = seg(t, DURATION - 0.3, DURATION);
  if (out > 0) { ctx.fillStyle = `rgba(247,247,250,${out})`; ctx.fillRect(0, 0, W, H); }
}

const SCENES = [
  [0, b(1), sHook],
  [b(1), b(3), sSignals],
  [b(3), b(4), sGlitch],
  [b(4), b(6), sMeet],
  [b(6), b(8), sDashboard],
  [b(8), b(10), sAutomation],
  [b(10), b(11), sResult],
  [b(11), b(13), sTagline],
  [b(13), DURATION + 1, sEnd],
];

function renderFrame(t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = 1; ctx.filter = 'none'; ctx.globalCompositeOperation = 'source-over';
  const [a, , fn] = SCENES.find(([s, e]) => t >= s && t < e) ?? SCENES[SCENES.length - 1];
  // every cut lands with a short punch-in out of a blur
  const k = ease.out(seg(t, a, a + 0.22));
  ctx.save();
  if (a > 0 && k < 1) {
    ctx.translate(W / 2, H / 2); ctx.scale(1.05 - 0.05 * k, 1.05 - 0.05 * k); ctx.translate(-W / 2, -H / 2);
  }
  fn(t);
  ctx.restore();
  if (a > 0 && k < 1) { // smear the incoming frame for the first few frames
    ctx.save(); ctx.globalAlpha = 1 - k; ctx.filter = `blur(${(10 * (1 - k)).toFixed(1)}px)`;
    ctx.drawImage(ctx.canvas, 0, 0); ctx.restore();
  }
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
    show(Math.floor(t * FPS) / FPS);
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
