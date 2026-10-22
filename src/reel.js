// MsgHealth reel — 15.7 s, 1080×1920 (9:16), cut to the track's beat grid (src/reel-timing.js).
// Story: one regular is drifting away → MsgHealth flags her → texts her → she rebooks → every client, every day
// → the features → the address is typed into a search bar and the app icon lands. The hook is fully on screen from
// the first frame (it's also the cover), and everything is centred inside TikTok's and Instagram's safe area.
// Every scene change lands on a downbeat; everything inside a scene lands on a beat or the hat between beats.
// Everything is drawn from a single time value, so renderFrame(t) is deterministic.
'use strict';

const W = 1080, H = 1920, CX = W / 2, CY = H / 2;
const QS = new URLSearchParams(location.search), DPR = +(QS.get('scale') || 1), FPS = +(QS.get('fps') || 60);
const TM = TIMING, at = TM.at, DURATION = TM.DURATION;
const K = BRAND.colors;
const C = {
  ink: K.ink, deep: '#14123a', accent: K.primary, tint: '#eeedfd', paper: '#f7f7fc', line: '#e6e4f3',
  mute: '#85839f', soft: '#b9b7d6', bubble: '#ecebf5', ok: K.healthy, warn: K.attention, risk: K.risk,
};
const STATUS = { Healthy: C.ok, 'Needs attention': C.warn, 'At risk': C.risk };
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
const mixc = (a, b, k) => { const A = rgb(a), B = rgb(b); return '#' + A.map((v, i) => Math.round(lerp(v, B[i], clamp(k))).toString(16).padStart(2, '0')).join(''); };
const scoreColor = (s) => (s >= 72 ? C.ok : s >= 55 ? mixc(C.warn, C.ok, (s - 55) / 17) : s >= 40 ? mixc(C.risk, C.warn, (s - 40) / 15) : C.risk);
const initials = (n) => n.split(' ').map((w) => w[0]).join('');

function txt(s, x, y, o = {}) {
  const { size = 40, w = 600, color = C.ink, align = 'left', ls = 0, a = 1 } = o;
  if (a <= 0) return;
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
function box(x, y, w, h, r, fill, o = {}) {
  ctx.save();
  if (o.shadow) { ctx.shadowColor = `rgba(30,27,75,${o.sa ?? 0.12})`; ctx.shadowBlur = o.shadow * DPR; ctx.shadowOffsetY = (o.sy ?? o.shadow * 0.35) * DPR; }
  ctx.beginPath(); ctx.roundRect(x, y, Math.max(0, w), Math.max(0, h), Array.isArray(r) ? r : Math.min(r, Math.max(0, w) / 2, Math.max(0, h) / 2));
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (o.stroke) { ctx.shadowColor = 'transparent'; ctx.lineWidth = o.lw ?? 2; ctx.strokeStyle = o.stroke; if (o.dash) ctx.setLineDash(o.dash); ctx.stroke(); }
  ctx.restore();
}
function dot(x, y, r, color = C.accent, a = 1) {
  if (r <= 0 || a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); ctx.restore();
}
function check(x, y, s, color, lw = 4) {
  ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(x - s * 0.5, y); ctx.lineTo(x - s * 0.12, y + s * 0.4); ctx.lineTo(x + s * 0.55, y - s * 0.42); ctx.stroke(); ctx.restore();
}
const TINT = {};
function tinted(color) {
  if (!TINT[color]) {
    const c = document.createElement('canvas'); c.width = c.height = 512;
    const g = c.getContext('2d'); g.drawImage(LOGO, 0, 0);
    g.globalCompositeOperation = 'source-in'; g.fillStyle = color; g.fillRect(0, 0, 512, 512); TINT[color] = c;
  }
  return TINT[color];
}
function logo(x, y, size, color, a = 1) { // centred; the glyph fills ~73% of the box
  if (!LOGO || size <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.drawImage(tinted(color), x - size / 2, y - size / 2, size, size); ctx.restore();
}
function avatar(x, y, r, name, k = 0) {
  dot(x, y, r, ['#e0def9', '#e8e5fb', '#dcd9f7', '#e3e0fa'][k % 4]);
  txt(initials(name), x, y + r * 0.36, { size: r * 0.72, w: 700, color: C.accent, align: 'center' });
}
// a status pill; x is its left edge (or right edge with o.right), y its centre
function chip(lab, x, y, o = {}) {
  const size = o.size ?? 24, h = size * 2, col = STATUS[lab] ?? o.col, w = tw(lab, size, 700) + size * 2.4;
  const x0 = o.right ? x - w : x, s = o.s ?? 1;
  ctx.save(); ctx.globalAlpha *= o.a ?? 1;
  ctx.translate(x0 + w / 2, y); ctx.scale(s, s); ctx.translate(-(x0 + w / 2), -y);
  box(x0, y - h / 2, w, h, h / 2, mixc('#ffffff', col, 0.15));
  dot(x0 + size * 0.9, y, size * 0.28, col);
  txt(lab, x0 + size * 1.5, y + size * 0.36, { size, w: 700, color: mixc(col, C.ink, 0.35) });
  ctx.restore(); return w;
}
// a pill that swaps from one status to another at time tc (old one shrinks away, new one pops in)
function statusSwap(from, to, tc, t, x, y, o = {}) {
  const k = P(t, tc, tc + 0.32);
  if (k < 1 && from) chip(from, x, y, { ...o, a: 1 - clamp(k * 3), s: lerp(1, 0.8, k) });
  if (k > 0 || !from) chip(to, x, y, { ...o, a: from ? clamp(k * 3) : 1, s: from ? lerp(0.7, 1, back(k, 2)) : 1 });
}
// a number that rolls from `a` to `b` at time tc inside a small window
function roll(a, b, tc, t, x, y, o) {
  const k = eo(P(t, tc, tc + 0.3)), size = o.size;
  ctx.save(); ctx.beginPath(); ctx.rect(x - size * 2, y - size * 1.1, size * 2.2, size * 1.5); ctx.clip();
  if (k < 1) txt(String(a), x, y - size * k, { ...o, align: 'right', a: 1 - k });
  txt(String(b), x, y + size * (1 - k), { ...o, align: 'right', a: k });
  ctx.restore();
}

// ── layout: centred, inside the area TikTok and Instagram Reels leave clear ──
// Both apps cover the top ~220 px (tabs / "Reels"), the bottom ~620 px (caption, audio, profile) and a right-hand
// rail of buttons from about x 940 down. Everything that matters is centred on x 540 and sits within
// x 140–940, y 240–1300.
const SAFE = { x0: 140, x1: 940, y0: 240, y1: 1300 };
function background() {
  ctx.fillStyle = C.paper; ctx.fillRect(0, 0, W, H);
  // two soft, still light pools (a frosted-glass backdrop): indigo low left, sky blue low right
  for (const [x, y, r, col] of [[160, 1720, 1000, 'rgba(165,160,255,0.30)'], [1000, 1500, 900, 'rgba(160,214,255,0.32)'], [540, -200, 900, 'rgba(214,211,255,0.30)']]) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, col); g.addColorStop(1, 'rgba(247,247,252,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  }
}

// ── headlines ────────────────────────────────────────────────────────────────
// Centred, two lines, the same place in every scene. Words blur into focus one after another (and blur away).
const HL = { y: 318, lh: 94, size: 82, maxW: 860 };
function headline(lines, t, tIn = -1, tOut = 1e9) {
  const full = (l) => l.map((s) => s[0]).join('');
  let size = HL.size; for (const l of lines) size = Math.min(size, HL.size * HL.maxW / tw(full(l), HL.size, 800, -HL.size * 0.045));
  const ls = -size * 0.045;
  let wi = 0;
  lines.forEach((l, li) => {
    const words = []; for (const [s, col] of l) for (const w of s.split(/(?<= )/)) words.push([w, col]);
    let x = CX - tw(full(l).trimEnd(), size, 800, ls) / 2;
    const y = HL.y + li * HL.lh;
    for (const [w, col] of words) {
      const p = tIn < 0 ? 1 : P(t, tIn + wi * 0.055, tIn + wi * 0.055 + 0.42), q = P(t, tOut + wi * 0.025, tOut + wi * 0.025 + 0.26);
      const a = clamp(p * 1.6) * (1 - q), blur = (1 - eo(p)) * 18 + eo(q) * 18;
      if (a > 0.003) {
        ctx.save(); if (blur > 0.3) ctx.filter = `blur(${blur * DPR}px)`;
        txt(w, x, y + (1 - eo(p)) * 26 - eo(q) * 22, { size, w: 800, ls, color: col || C.ink, a });
        ctx.restore();
      }
      x += tw(w, size, 800, ls); wi++;
    }
  });
}
// a single centred line that blurs in
function blurLine(s, y, p, o = {}) {
  if (p <= 0) return;
  ctx.save(); const b = (1 - eo(p)) * (o.blur ?? 16); if (b > 0.3) ctx.filter = `blur(${b * DPR}px)`;
  txt(s, CX, y + (1 - eo(p)) * (o.dy ?? 20), { ...o, align: 'center', a: (o.a ?? 1) * clamp(p * 1.6) });
  ctx.restore();
}

// ── the panel (one white card, shared by the scenes) ─────────────────────────
const PAN = { x: 140, y: 470, w: 800 };
const panel = (h, a = 1) => { ctx.save(); ctx.globalAlpha *= a; box(PAN.x, PAN.y, PAN.w, h, 40, 'rgba(255,255,255,0.94)', { shadow: 70, sa: 0.12, sy: 26, stroke: 'rgba(255,255,255,1)', lw: 2 }); ctx.restore(); };

// the pointer (macOS style), tip at x, y
function cursor(x, y, s = 1, a = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(1.7 * s, 1.7 * s);
  ctx.shadowColor = 'rgba(20,18,58,0.3)'; ctx.shadowBlur = 8 * DPR; ctx.shadowOffsetY = 3 * DPR;
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 30); ctx.lineTo(7.5, 23); ctx.lineTo(12.5, 34.5); ctx.lineTo(18, 32); ctx.lineTo(13, 21); ctx.lineTo(23, 21); ctx.closePath();
  ctx.fillStyle = '#111'; ctx.strokeStyle = '#fff'; ctx.lineWidth = 2.2; ctx.lineJoin = 'round'; ctx.stroke(); ctx.fill(); ctx.restore();
}

// ── 1 · Hook (0 → drop): "Your best client is about to leave." ───────────────
// Sarah's card: her days-since-visit counter climbs and her health drains as the intro builds; she tips into
// "At risk" on the last hat before the drop.
const HOOK_END = TM.hats[3], HOOK_H = 790;
const hookK = (t) => Math.pow(P(t, 0, HOOK_END), 1.7);
function hookCard(t) {
  const x0 = PAN.x, y0 = PAN.y, w = PAN.w;
  avatar(x0 + 100, y0 + 104, 54, 'Sarah Mitchell');
  txt('Sarah Mitchell', x0 + 178, y0 + 98, { size: 44, w: 700, ls: -1 });
  txt('Regular · books every 3 weeks', x0 + 178, y0 + 142, { size: 26, w: 500, color: C.mute });
  ctx.fillStyle = C.line; ctx.fillRect(x0 + 44, y0 + 200, w - 88, 2);
  const k = hookK(t), days = Math.round(lerp(21, 47, k)), score = lerp(84, 31, k);
  txt('Last visit', x0 + 48, y0 + 272, { size: 28, w: 600, color: C.mute });
  const dcol = days < 30 ? C.ink : days < 40 ? mixc(C.ink, C.risk, 0.5) : C.risk;
  txt(String(days), x0 + 42, y0 + 436, { size: 176, w: 800, ls: -8, color: dcol });
  txt('days ago', x0 + 54 + tw(String(days), 176, 800, -8), y0 + 436, { size: 40, w: 700, ls: -1, color: dcol });
  const rx = x0 + w - 150, ry = y0 + 356, col = scoreColor(score);
  ctx.save(); ctx.lineWidth = 20; ctx.lineCap = 'round';
  ctx.strokeStyle = C.line; ctx.beginPath(); ctx.arc(rx, ry, 92, 0, 7); ctx.stroke();
  ctx.strokeStyle = col; ctx.beginPath(); ctx.arc(rx, ry, 92, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * score / 100); ctx.stroke(); ctx.restore();
  txt(String(Math.round(score)), rx, ry + 22, { size: 62, w: 800, ls: -3, align: 'center', color: col });
  txt('Health', rx, ry + 136, { size: 22, w: 600, color: C.mute, align: 'center' });
  ctx.fillStyle = C.line; ctx.fillRect(x0 + 44, y0 + 540, w - 88, 2);
  const [h0, h1, h2, h3] = TM.hats;
  if (t < h0) chip('Healthy', x0 + 44, y0 + 606, { size: 28 });
  else if (t < h3) statusSwap('Healthy', 'Needs attention', h0, t, x0 + 44, y0 + 606, { size: 28 });
  else statusSwap('Needs attention', 'At risk', h3, t, x0 + 44, y0 + 606, { size: 28 });
  [['Missed her usual booking', h1], ['No reply to her last 2 texts', h2]].forEach(([s, ts], i) => {
    const p = eo(P(t, ts - 0.02, ts + 0.3)); if (p <= 0) return;
    ctx.save(); ctx.globalAlpha *= p; ctx.translate((1 - p) * 26, 0);
    dot(x0 + 58, y0 + 686 + i * 56, 8, C.risk); txt(s, x0 + 82, y0 + 696 + i * 56, { size: 30, w: 600 }); ctx.restore();
  });
}

// ── 2 · The dashboard (flags on the drop; wins back in bar 4) ────────────────
const ROWS = [
  { n: 'Sarah Mitchell', v: 'Last visit 47 days ago' },
  { n: 'Jordan Reyes', v: 'Last visit 5 days ago' },
  { n: 'Priya Shah', v: 'Last visit 38 days ago', flag: [1, 'At risk'], win: 13 },
  { n: 'Ella Wright', v: 'Last visit 44 days ago', flag: [2, 'At risk'], win: 14 },
  { n: 'Theo Martin', v: 'Last visit 29 days ago', flag: [3, 'Needs attention'], win: 15 },
];
const HEAD_H = 108, ROW_H = 118, ROW_Y0 = PAN.y + HEAD_H, DASH_H = HEAD_H + ROWS.length * ROW_H;
function rowState(i, mode, t) {
  const r = ROWS[i];
  if (mode === 'flag') {
    if (i === 0) return { from: null, lab: 'At risk', tc: -1 };
    if (r.flag) return t >= at(r.flag[0]) ? { from: 'Healthy', lab: r.flag[1], tc: at(r.flag[0]) } : { from: null, lab: 'Healthy', tc: -1 };
    return { from: null, lab: 'Healthy', tc: -1 };
  }
  if (i === 0) return { from: null, lab: 'Healthy', tc: -1, sub: 'Rebooked · Thu 10:00' };
  if (r.flag) return t >= at(r.win) ? { from: r.flag[1], lab: 'Healthy', tc: at(r.win), sub: 'Replied · booked' } : { from: null, lab: r.flag[1], tc: -1 };
  return { from: null, lab: 'Healthy', tc: -1 };
}
const tintOf = (l) => (l === 'At risk' ? mixc('#ffffff', C.risk, 0.07) : l === 'Needs attention' ? mixc('#ffffff', C.warn, 0.08) : '#ffffff');
function dashboard(t, mode, inAt) {
  const x0 = PAN.x, y0 = PAN.y, w = PAN.w;
  const hin = inAt == null ? 1 : eo(P(t, inAt, inAt + 0.35));
  ctx.save(); ctx.globalAlpha *= hin; ctx.translate(0, (1 - hin) * 18);
  logo(x0 + 64, y0 + 55, 60, C.accent);
  if (mode === 'flag') {
    txt('Client health', x0 + 100, y0 + 67, { size: 34, w: 700, ls: -0.8 });
    const cnt = (tt) => ROWS.reduce((n, r, i) => n + (rowState(i, 'flag', tt).lab === 'At risk'), 0);
    const now = cnt(t); let tc = -1; for (const r of ROWS) if (r.flag && r.flag[1] === 'At risk' && at(r.flag[0]) <= t) tc = Math.max(tc, at(r.flag[0]));
    const prev = tc < 0 ? now : cnt(tc - 1e-3), cw = tw('At risk', 24, 700) + 104, cx0 = x0 + w - 32 - cw;
    box(cx0, y0 + 30, cw, 50, 25, mixc('#ffffff', C.risk, 0.13 + 0.1 * (tc < 0 ? 0 : Math.sin(Math.PI * P(t, tc, tc + 0.4)))));
    txt('At risk', cx0 + 22, y0 + 64, { size: 24, w: 700, color: mixc(C.risk, C.ink, 0.35) });
    roll(prev, now, tc, t, cx0 + cw - 22, y0 + 65, { size: 28, w: 800, color: mixc(C.risk, C.ink, 0.35) });
  } else { // the switch the cursor turns on
    txt('Auto win-backs', x0 + 100, y0 + 67, { size: 34, w: 700, ls: -0.8 });
    const on = io(P(t, TM.click, TM.click + 0.22)), sx = x0 + w - 32 - 92;
    box(sx, y0 + 31, 92, 50, 25, mixc('#dcdaf0', C.accent, on));
    dot(sx + 25 + 42 * on, y0 + 56, 20, '#fff');
  }
  ctx.restore();
  ctx.fillStyle = C.line; ctx.fillRect(x0, y0 + HEAD_H - 1, w, 2);
  ROWS.forEach((r, i) => {
    const y = ROW_Y0 + i * ROW_H, ti = inAt == null ? -1 : inAt + 0.05 + i * 0.05, p = ti < 0 ? 1 : eo(P(t, ti, ti + 0.4));
    if (p <= 0) return;
    const st = rowState(i, mode, t), k = st.tc < 0 ? 1 : P(t, st.tc, st.tc + 0.35);
    ctx.save(); ctx.globalAlpha *= p; ctx.translate(0, (1 - p) * 36);
    const bg = st.from ? mixc(tintOf(st.from), tintOf(st.lab), k) : tintOf(st.lab);
    if (bg !== '#ffffff') box(x0, y, w, ROW_H, i === ROWS.length - 1 ? [0, 0, 40, 40] : 0, bg);
    avatar(x0 + 76, y + 59, 32, r.n, i);
    txt(r.n, x0 + 126, y + 54, { size: 32, w: 650, ls: -0.5 });
    if (st.sub) {
      const sk = st.tc < 0 ? 1 : k;
      if (sk < 0.4) txt(r.v, x0 + 126, y + 90 - 10 * eo(sk / 0.4), { size: 23, w: 500, color: C.mute, a: 1 - sk / 0.4 }); // the old line leaves before the new one lands
      const nk = eo(P(sk, 0.35, 1));
      ctx.save(); ctx.globalAlpha *= nk; ctx.translate(0, (1 - nk) * 10); check(x0 + 136, y + 83, 15, C.ok, 3.5);
      txt(st.sub, x0 + 154, y + 90, { size: 23, w: 650, color: mixc(C.ok, C.ink, 0.2) }); ctx.restore();
    } else txt(r.v, x0 + 126, y + 90, { size: 23, w: 500, color: C.mute });
    statusSwap(st.from, st.lab, st.tc, t, x0 + w - 32, y + 59, { right: true, size: 23 });
    if (i < ROWS.length - 1) { ctx.fillStyle = C.line; ctx.fillRect(x0 + 32, y + ROW_H - 1, w - 64, 2); }
    ctx.restore();
  });
}

function sceneOpen(t) {
  const D = TM.D;
  // a slow push-in through the intro, released on the drop
  const z = t < D ? lerp(1.0, 1.03, io(P(t, 0, D))) : lerp(1.03, 1, expo(P(t, D, D + 0.4)));
  ctx.save(); ctx.translate(CX, PAN.y + 400); ctx.scale(z, z); ctx.translate(-CX, -(PAN.y + 400));
  const g = expo(P(t, D, D + 0.5));
  panel(lerp(HOOK_H, DASH_H, g)); // the card becomes the dashboard: same white panel, resized to the list
  if (t < D + 0.3) { // Sarah's card shrinks into her row and blurs away as the list arrives
    const q = P(t, D, D + 0.3), s = lerp(1, 0.55, eo(q));
    ctx.save(); ctx.globalAlpha *= 1 - eo(clamp(q * 1.6)); if (q > 0) ctx.filter = `blur(${eo(q) * 12 * DPR}px)`;
    ctx.translate(PAN.x + 60, PAN.y + 60); ctx.scale(s, s); ctx.translate(-(PAN.x + 60), -(PAN.y + 60));
    ctx.beginPath(); ctx.roundRect(PAN.x, PAN.y, PAN.w, HOOK_H, 40); ctx.clip();
    hookCard(t); ctx.restore();
  }
  if (t >= D) dashboard(t, 'flag', D);
  ctx.restore();
  headline([[['Your best client']], [['is about to '], ['leave.', C.risk]]], t, -1, D - 0.12);
  headline([[['MsgHealth', C.accent], [' spots it']], [['before you do.']]], t, D + 0.1);
}

// ── 3 · The text (bar 2) ─────────────────────────────────────────────────────
function bubble(lines, x, y, out, p) { // x: the bubble's outer edge (right for outgoing, left for replies)
  if (p <= 0) return 0;
  const size = 34, lh = 46, px = 28, py = 22, w = Math.max(...lines.map((l) => tw(l, size, 500, -0.3))) + px * 2, h = lines.length * lh + py * 2 - 8;
  const x0 = out ? x - w : x, s = lerp(0.6, 1, back(p, 1.4));
  ctx.save(); ctx.globalAlpha *= clamp(p * 3);
  ctx.translate(out ? x : x0, y + h); ctx.scale(s, s); ctx.translate(-(out ? x : x0), -(y + h));
  box(x0, y, w, h, out ? [30, 30, 8, 30] : [30, 30, 30, 8], out ? C.accent : C.bubble);
  lines.forEach((l, i) => txt(l, x0 + px, y + py + 32 + i * lh, { size, w: 500, ls: -0.3, color: out ? '#fff' : C.ink }));
  ctx.restore(); return h;
}
function sceneChat(t) {
  const x0 = PAN.x, y0 = PAN.y, w = PAN.w, b = (n) => at(n);
  panel(640);
  ctx.save(); ctx.strokeStyle = C.accent; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(x0 + 54, y0 + 46); ctx.lineTo(x0 + 38, y0 + 62); ctx.lineTo(x0 + 54, y0 + 78); ctx.stroke(); ctx.restore();
  avatar(x0 + 108, y0 + 62, 30, 'Sarah Mitchell');
  txt('Sarah Mitchell', x0 + 152, y0 + 56, { size: 30, w: 700, ls: -0.5 });
  txt('Text message', x0 + 152, y0 + 88, { size: 21, w: 500, color: C.mute });
  ctx.fillStyle = C.line; ctx.fillRect(x0, y0 + 122, w, 2);
  // the win-back text lands on beat 2, the "sent by MsgHealth" tag on beat 3, her reply on beat 4
  bubble(['Hi Sarah! It’s been a while.', 'Want your usual Thursday', '10am slot?'], x0 + w - 32, y0 + 160, true, P(t, b(5) - 0.02, b(5) + 0.34));
  const tg = eo(P(t, b(6) - 0.02, b(6) + 0.3));
  if (tg > 0) {
    const s = 'Sent automatically by MsgHealth', sw = tw(s, 21, 650);
    ctx.save(); ctx.globalAlpha *= tg; ctx.translate(0, (1 - tg) * 10);
    txt(s, x0 + w - 36, y0 + 380, { size: 21, w: 650, color: C.accent, align: 'right' });
    logo(x0 + w - 36 - sw - 22, y0 + 373, 36, C.accent); ctx.restore();
  }
  const ty = P(t, b(6) + 0.06, b(6) + 0.2) * (1 - P(t, b(7) - 0.06, b(7)));
  if (ty > 0) { // typing…
    ctx.save(); ctx.globalAlpha *= ty; box(x0 + 32, y0 + 420, 120, 68, [30, 30, 30, 8], C.bubble);
    for (let j = 0; j < 3; j++) dot(x0 + 64 + j * 28, y0 + 454 - 6 * Math.max(0, Math.sin((t - b(6)) * 11 - j * 0.9)), 8, C.soft);
    ctx.restore();
  }
  bubble(['Yes please!', 'See you Thursday'], x0 + 32, y0 + 420, false, P(t, b(7) - 0.02, b(7) + 0.34));
  headline([[['It texts them']], [['back '], ['for you.', C.accent]]], t);
}

// ── 4 · Rebooked (bar 3) ─────────────────────────────────────────────────────
function sceneBook(t) {
  const x0 = PAN.x, y0 = PAN.y, w = PAN.w, b = (n) => at(n);
  panel(790);
  txt('Thursday', x0 + 44, y0 + 68, { size: 34, w: 700, ls: -0.8 });
  txt('Appointments', x0 + w - 44, y0 + 66, { size: 23, w: 600, color: C.mute, align: 'right' });
  ctx.fillStyle = C.line; ctx.fillRect(x0, y0 + 107, w, 2);
  const SLOTS = [['9:00', 'Jordan Reyes', 'Cut & style'], ['10:00', null], ['11:00', 'Marcus Lee', 'Beard trim'], ['12:00', 'Ella Wright', 'Colour']];
  SLOTS.forEach(([h, n, what], i) => {
    const y = y0 + 124 + i * 106, bx = x0 + 146, bw = w - 146 - 32;
    txt(h, x0 + 44, y + 54, { size: 25, w: 600, color: C.mute });
    if (n) { box(bx, y, bw, 88, 20, '#f3f2fb'); txt(n, bx + 26, y + 55, { size: 28, w: 650, ls: -0.4 }); txt(what, bx + bw - 26, y + 55, { size: 23, w: 500, color: C.mute, align: 'right' }); return; }
    // Sarah drops into the empty slot on beat 2
    box(bx, y, bw, 88, 20, null, { stroke: C.soft, lw: 2.5, dash: [10, 9] });
    const p = P(t, b(9) - 0.03, b(9) + 0.36);
    if (p > 0) {
      const s = lerp(0.82, 1, back(p, 1.6));
      ctx.save(); ctx.globalAlpha *= clamp(p * 3); ctx.translate(bx + bw / 2, y + 44); ctx.scale(s, s); ctx.translate(-(bx + bw / 2), -(y + 44));
      box(bx, y, bw, 88, 20, C.accent, { shadow: 30, sa: 0.3, sy: 10 });
      txt('Sarah Mitchell', bx + 26, y + 55, { size: 28, w: 700, ls: -0.4, color: '#fff' });
      txt('Her usual', bx + bw - 26, y + 55, { size: 23, w: 600, color: 'rgba(255,255,255,.75)', align: 'right' });
      ctx.restore();
    } else txt('Open', bx + 26, y + 55, { size: 25, w: 600, color: C.soft });
  });
  // her health comes back on the big hit (beat 3); "won back automatically" on beat 4
  const hy = y0 + 572;
  ctx.fillStyle = C.line; ctx.fillRect(x0, hy - 24, w, 2);
  const k = io(P(t, b(10) - 0.02, b(10) + 0.5)), sc = lerp(31, 88, k), col = scoreColor(sc);
  txt('Sarah’s health', x0 + 44, hy + 34, { size: 26, w: 600, color: C.mute });
  box(x0 + 44, hy + 72, w - 250, 16, 8, C.line); box(x0 + 44, hy + 72, (w - 250) * sc / 100, 16, 8, col);
  txt(String(Math.round(sc)), x0 + w - 44, hy + 100, { size: 78, w: 800, ls: -3, color: col, align: 'right' });
  statusSwap('At risk', 'Healthy', b(10) + 0.12, t, x0 + 44, hy + 158, { size: 25 });
  const tp = eo(P(t, b(11) - 0.03, b(11) + 0.35));
  if (tp > 0) {
    const xx = x0 + 44 + tw('Healthy', 25, 700) + 25 * 2.4 + 22;
    ctx.save(); ctx.globalAlpha *= tp; ctx.translate((1 - tp) * 20, 0);
    check(xx + 10, hy + 157, 16, C.ok, 3.5); txt('Won back automatically', xx + 30, hy + 166, { size: 25, w: 650, color: mixc(C.ok, C.ink, 0.2) }); ctx.restore();
  }
  headline([[['Back on the']], [['calendar.', C.accent]]], t);
}

// ── 5 · Every client (bar 4): the cursor switches on auto win-backs, then they come back one per beat ──
function sceneAll(t) {
  panel(DASH_H);
  dashboard(t, 'win', null);
  const tx = PAN.x + PAN.w - 32 - 46, ty = PAN.y + 58; // the switch
  const t0 = at(12) + 0.2, c = TM.click;
  if (t < c + 0.9) {
    const m = io(P(t, t0, c - 0.04)), x = lerp(860, tx, m), y = lerp(1180, ty, m);
    const press = P(t, c - 0.06, c) * (1 - P(t, c + 0.02, c + 0.14));
    const away = io(P(t, c + 0.25, c + 0.9));
    cursor(x + away * 120, y + away * 260, 1 - 0.14 * press, clamp(P(t, t0 - 0.05, t0 + 0.15)) * (1 - away));
    if (t > c) { const q = P(t, c, c + 0.45); ctx.save(); ctx.globalAlpha = (1 - q) * 0.5; ctx.strokeStyle = C.accent; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(tx, ty, 20 + q * 40, 0, 7); ctx.stroke(); ctx.restore(); }
  }
  headline([[['Now do that for']], [['every client.', C.accent]]], t);
}

// ── 6 · Features (bar 5) on an indigo flood ──────────────────────────────────
const FEATS = ['Health scores', 'Churn alerts', 'Win-back texts', 'Online booking'];
function indigo(a = 1) {
  ctx.save(); ctx.globalAlpha *= a;
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#5148ea'); g.addColorStop(1, '#3a32c4');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const r = ctx.createRadialGradient(CX, 860, 0, CX, 860, 760); r.addColorStop(0, 'rgba(140,150,255,0.35)'); r.addColorStop(1, 'rgba(140,150,255,0)');
  ctx.fillStyle = r; ctx.fillRect(0, 0, W, H); ctx.restore();
}
function sceneFeat(t) {
  const t0 = at(16);
  ctx.save(); ctx.beginPath(); ctx.arc(CX, 860, 2400 * expo(P(t, t0 - 0.04, t0 + 0.4)), 0, 7); ctx.clip();
  indigo(); ctx.restore();
  const kp = P(t, t0 + 0.02, t0 + 0.4);
  blurLine('All in one place', 600, kp, { size: 34, w: 600, color: 'rgba(255,255,255,.72)' });
  const size = Math.min(104, 104 * 800 / Math.max(...FEATS.map((f) => tw(f, 104, 800, -4.5))));
  FEATS.forEach((f, i) => { // one per beat; the earlier ones step back
    const ti = at(16 + i), p = P(t, ti - 0.02, ti + 0.4); if (p <= 0) return;
    const newer = i < 3 ? P(t, at(17 + i), at(17 + i) + 0.25) : 0;
    blurLine(f, 760 + i * 132, p, { size, w: 800, ls: -4.5, color: '#fff', a: lerp(1, 0.42, newer) });
  });
}

// ── 7 · End card: the address is typed into a search bar, Enter, the app icon lands ──
const URL_ = 'msghealth.net';
function endBg(t) {
  ctx.fillStyle = '#100e2e'; ctx.fillRect(0, 0, W, H);
  const glow = 0.55 + 0.45 * eo(P(t, TM.icon, TM.icon + 0.6)); // the room lights up when the icon lands
  const g = ctx.createRadialGradient(CX, 900, 0, CX, 900, 900); g.addColorStop(0, `rgba(79,70,229,${0.55 * glow})`); g.addColorStop(1, 'rgba(79,70,229,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const g2 = ctx.createRadialGradient(CX, 1900, 0, CX, 1900, 900); g2.addColorStop(0, 'rgba(120,190,255,0.22)'); g2.addColorStop(1, 'rgba(120,190,255,0)');
  ctx.fillStyle = g2; ctx.fillRect(0, 0, W, H);
}
function appIcon(x, y, s, a) {
  if (a <= 0 || s <= 0) return;
  const S = 210 * s;
  ctx.save(); ctx.globalAlpha *= a;
  ctx.shadowColor = 'rgba(124,116,255,0.75)'; ctx.shadowBlur = 70 * DPR * s;
  const g = ctx.createLinearGradient(x, y - S / 2, x, y + S / 2); g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#ecebff');
  ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(x - S / 2, y - S / 2, S, S, S * 0.25); ctx.fill(); ctx.restore();
  logo(x, y + 2 * s, S * 0.86, C.accent, a);
}
function sceneEnd(t) {
  const t0 = TM.scene[5], T = TM.type;
  endBg(t);
  // the features blur away as the indigo deepens into the end card
  if (t < at(20) + 0.1) {
    const k = P(t, t0, at(20));
    ctx.save(); ctx.globalAlpha = 1 - eo(k); indigo(); ctx.restore();
    ctx.save(); ctx.filter = `blur(${eo(k) * 22 * DPR}px)`; ctx.globalAlpha = 1 - eo(clamp(k * 1.4));
    blurLine('All in one place', 600, 1, { size: 34, w: 600, color: 'rgba(255,255,255,.72)' });
    const size = Math.min(104, 104 * 800 / Math.max(...FEATS.map((f) => tw(f, 104, 800, -4.5))));
    FEATS.forEach((f, i) => blurLine(f, 760 + i * 132, 1, { size, w: 800, ls: -4.5, color: '#fff', a: i < 3 ? 0.42 : 1 }));
    ctx.restore();
  }
  // the search bar: blurs in on bar 6, the address types itself, Enter on the "and" of beat 2
  const bin = P(t, at(20) - 0.05, at(20) + 0.35), ent = P(t, T.enter, T.enter + 0.4), m = io(ent);
  const n = Math.max(0, Math.min(13, Math.floor((t - T.t0) / T.step) + 1));
  const typed = URL_.slice(0, t < T.t0 ? 0 : n);
  const size = lerp(46, 42, m), tW = tw(URL_, size, 600, -0.5);
  const bw = lerp(720, tW + 96, m), bh = lerp(112, 88, m), by = lerp(960, 1084, m);
  if (bin > 0) {
    ctx.save(); ctx.globalAlpha *= clamp(bin * 1.5); const b = (1 - eo(bin)) * 18; if (b > 0.3) ctx.filter = `blur(${b * DPR}px)`;
    ctx.translate(CX, by); const sc = lerp(1.08, 1, eo(bin)); ctx.scale(sc, sc); ctx.translate(-CX, -by);
    const press = P(t, T.enter - 0.06, T.enter) * (1 - P(t, T.enter + 0.02, T.enter + 0.2));
    box(CX - bw / 2, by - bh / 2, bw, bh, bh / 2, `rgba(255,255,255,${0.09 + 0.1 * press + 0.05 * m})`, { stroke: 'rgba(255,255,255,0.32)', lw: 2 });
    // magnifier (fades as the bar becomes the address pill)
    ctx.save(); ctx.globalAlpha *= 1 - m; ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 4.5; ctx.lineCap = 'round';
    const mx = CX - bw / 2 + 58; ctx.beginPath(); ctx.arc(mx, by - 4, 15, 0, 7); ctx.moveTo(mx + 11, by + 7); ctx.lineTo(mx + 22, by + 18); ctx.stroke(); ctx.restore();
    const tx = lerp(CX - bw / 2 + 100, CX - tW / 2, m);
    if (!typed) txt('Search', tx, by + 16, { size, w: 500, color: 'rgba(255,255,255,0.4)' });
    txt(typed, tx, by + size * 0.35, { size, w: 600, ls: -0.5, color: '#fff' });
    if (t < T.enter && t > at(20) + 0.1 && Math.floor((t - at(20)) / 0.24) % 2 === 0) { // caret (blinks on the eighths)
      ctx.fillStyle = '#8f88ff'; ctx.fillRect(tx + tw(typed, size, 600, -0.5) + 4, by - 26, 3.5, 52);
    }
    ctx.restore();
  }
  // the app icon lands on beat 3, the name blurs in under it, the line on bar 7
  const ip = P(t, TM.icon - 0.03, TM.icon + 0.45);
  appIcon(CX, 690 + (1 - eo(ip)) * 30, lerp(0.6, 1, back(ip, 1.5)), clamp(ip * 2.5));
  blurLine('MsgHealth', 950, P(t, TM.icon + 0.1, TM.icon + 0.5), { size: 96, w: 800, ls: -4, color: '#fff' });
  blurLine('Know who’s about to leave.', 1210, P(t, TM.tag - 0.02, TM.tag + 0.4), { size: 36, w: 500, color: 'rgba(255,255,255,0.68)' });
}

// ── frame ────────────────────────────────────────────────────────────────────
let LAYER = null;
// draw one scene on its own layer, then composite it blurred / faded / scaled (the scene transitions)
function layered(fn, t, a, blur, s) {
  if (a <= 0.003) return;
  const main = ctx; ctx = LAYER;
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, LAYER.canvas.width, LAYER.canvas.height);
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0); ctx.globalAlpha = 1; ctx.filter = 'none';
  fn(t); ctx = main;
  main.save(); main.setTransform(1, 0, 0, 1, 0, 0); main.globalAlpha = a;
  if (blur > 0.3) main.filter = `blur(${blur * DPR}px)`;
  main.translate(CX * DPR, 820 * DPR); main.scale(s, s); main.translate(-CX * DPR, -820 * DPR);
  main.drawImage(LAYER.canvas, 0, 0); main.restore();
}
const SCENES = [sceneOpen, sceneChat, sceneBook, sceneAll, sceneFeat, sceneEnd];
function drawScene(t) {
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0); ctx.globalAlpha = 1; ctx.filter = 'none';
  background();
  let i = 0; while (i + 1 < TM.scene.length && t >= TM.scene[i + 1]) i++;
  const t0 = TM.scene[i];
  if (i >= 1 && i <= 3 && t < t0 + TM.PUSH) { // bars 2–4 arrive on the downbeat: the last scene blurs back, the next blurs into focus
    const k = P(t, t0, t0 + TM.PUSH), ki = P(k, 0.3, 1);
    layered(SCENES[i - 1], t, 1 - eo(P(k, 0, 0.55)), 22 * eo(P(k, 0, 0.6)), 1 - 0.06 * io(k));
    layered(SCENES[i], t, eo(P(k, 0.3, 0.8)), 22 * (1 - eo(ki)), 1.06 - 0.06 * eo(ki));
  } else if (i === 4 && t < t0 + 0.45) { SCENES[3](t); SCENES[4](t); } // the flood covers the list
  else SCENES[i](t);
}
let MAIN, SCRATCH, SUB = 1;
const SHUTTER = 0.5 / FPS; // 180° shutter at the render frame rate
function renderFrame(t) {
  if (SUB <= 1) { ctx = MAIN; drawScene(t); return; }
  for (let k = 0; k < SUB; k++) {
    ctx = SCRATCH; drawScene(clamp(t + ((k + 0.5) / SUB - 0.5) * SHUTTER, 0, DURATION - 1e-4));
    MAIN.setTransform(1, 0, 0, 1, 0, 0); MAIN.globalAlpha = 1 / (k + 1); MAIN.drawImage(SCRATCH.canvas, 0, 0);
  }
  MAIN.globalAlpha = 1; ctx = MAIN;
}

window.renderFrame = renderFrame;
window.DURATION = DURATION;
window.ready = (async () => {
  const el = document.getElementById('c'); el.width = Math.round(W * DPR); el.height = Math.round(H * DPR);
  MAIN = ctx = el.getContext('2d');
  const mk = () => { const c = document.createElement('canvas'); c.width = Math.round(W * DPR); c.height = Math.round(H * DPR); return c.getContext('2d'); };
  SCRATCH = mk(); LAYER = mk();
  await Promise.all(['400', '500', '600', '650', '700', '800'].map((w) => document.fonts.load(`${w} 40px Inter`)));
  LOGO = await new Promise((res) => { const im = new Image(); im.onload = () => res(im); im.onerror = () => res(null); im.src = BRAND.logoFile; });
  if (location.search.includes('render')) { document.body.classList.add('render'); SUB = +(QS.get('sub') || 6); } // motion-blur samples per frame
  renderFrame(0);
  // in-browser player (with the soundtrack when dist/reel-score.wav has been rendered)
  const play = document.getElementById('play'), seek = document.getElementById('seek'), label = document.getElementById('time');
  if (!play) return true;
  const audio = new Audio('dist/reel-score.wav');
  let playing = false, t0 = 0, cur = 0;
  const show = (t) => { cur = t; renderFrame(t); seek.value = (t / DURATION) * 1000; label.textContent = t.toFixed(2) + 's'; };
  play.onclick = () => { playing = !playing; play.textContent = playing ? 'Pause' : 'Play';
    if (playing) { if (cur >= DURATION - 0.02) cur = 0; t0 = performance.now() - cur * 1000; audio.currentTime = cur; audio.play().catch(() => {}); requestAnimationFrame(loop); } else audio.pause(); };
  const loop = () => { if (!playing) return; const t = (performance.now() - t0) / 1000; if (t >= DURATION) { playing = false; audio.pause(); play.textContent = 'Play'; show(DURATION - 0.01); return; } show(t); requestAnimationFrame(loop); };
  seek.oninput = () => { show((seek.value / 1000) * DURATION); audio.currentTime = cur; };
  return true;
})();
