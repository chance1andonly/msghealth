// MsgHealth reel — 15.7 s, 1080×1920 (9:16), cut to the track's beat grid (src/reel-timing.js).
// Story: one regular is drifting away → MsgHealth flags her → texts her → she rebooks → every client, every day
// → the features → the ball draws the logo. The hook is fully on screen from the first frame (it's also the cover).
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

// ── headlines ────────────────────────────────────────────────────────────────
// Two lines, top-left, in the same place in every scene. Segments let one word take a colour.
const HL = { x: 76, y: 318, lh: 100, size: 88, maxW: 900 };
function headline(lines, t, tIn = -1, tOut = 1e9) {
  const full = (l) => l.map((s) => s[0]).join('');
  let size = HL.size; for (const l of lines) size = Math.min(size, HL.size * HL.maxW / tw(full(l), HL.size, 800, -HL.size * 0.045));
  const ls = -size * 0.045;
  lines.forEach((l, i) => {
    const pin = tIn < 0 ? 1 : P(t, tIn + i * 0.06, tIn + i * 0.06 + 0.42), pout = P(t, tOut + i * 0.03, tOut + i * 0.03 + 0.18);
    if (pin <= 0 || pout >= 1) return;
    const y = HL.y + i * HL.lh, width = tw(full(l), size, 800, ls);
    ctx.save(); ctx.beginPath(); ctx.rect(HL.x - 30, y - size * 1.02, width + 60, size * 1.36); ctx.clip();
    const dy = (1 - eo(pin)) * size * 1.05 - ei(pout) * size * 1.1;
    let x = HL.x;
    for (const [s, col] of l) { txt(s, x, y + dy, { size, w: 800, ls, color: col || C.ink }); x += tw(s, size, 800, ls); }
    ctx.restore();
  });
}

// ── the panel (one white card, shared by the scenes) ─────────────────────────
// Everything that matters stays inside x 70–930, y 220–1500: clear of TikTok's buttons, caption and top bar.
const PAN = { x: 70, y: 520, w: 860 };
const panel = (h, a = 1) => { ctx.save(); ctx.globalAlpha *= a; box(PAN.x, PAN.y, PAN.w, h, 40, '#fff', { shadow: 60, sa: 0.1, sy: 22 }); ctx.restore(); };

// ── 1 · Hook (0 → drop): "Your best client is about to leave." ───────────────
// Sarah's card: her days-since-visit counter climbs and her health drains as the intro builds; she tips into
// "At risk" on the last hat before the drop.
const HOOK_END = TM.hats[3];
const hookK = (t) => Math.pow(P(t, 0, HOOK_END), 1.7);
function hookCard(t) {
  const x0 = PAN.x, y0 = PAN.y, w = PAN.w;
  avatar(x0 + 112, y0 + 114, 58, 'Sarah Mitchell');
  txt('Sarah Mitchell', x0 + 196, y0 + 106, { size: 48, w: 700, ls: -1 });
  txt('Regular · books every 3 weeks', x0 + 196, y0 + 152, { size: 28, w: 500, color: C.mute });
  ctx.fillStyle = C.line; ctx.fillRect(x0 + 48, y0 + 222, w - 96, 2);
  // last visit, counting up
  const k = hookK(t), days = Math.round(lerp(21, 47, k)), score = lerp(84, 31, k);
  txt('Last visit', x0 + 52, y0 + 300, { size: 30, w: 600, color: C.mute });
  const dcol = days < 30 ? C.ink : days < 40 ? mixc(C.ink, C.risk, 0.5) : C.risk;
  txt(String(days), x0 + 46, y0 + 476, { size: 190, w: 800, ls: -9, color: dcol });
  txt('days ago', x0 + 58 + tw(String(days), 190, 800, -9), y0 + 476, { size: 44, w: 700, ls: -1, color: dcol });
  // health ring
  const rx = x0 + w - 168, ry = y0 + 392, col = scoreColor(score);
  ctx.save(); ctx.lineWidth = 22; ctx.lineCap = 'round';
  ctx.strokeStyle = C.line; ctx.beginPath(); ctx.arc(rx, ry, 102, 0, 7); ctx.stroke();
  ctx.strokeStyle = col; ctx.beginPath(); ctx.arc(rx, ry, 102, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * score / 100); ctx.stroke(); ctx.restore();
  txt(String(Math.round(score)), rx, ry + 24, { size: 70, w: 800, ls: -3, align: 'center', color: col });
  txt('Health', rx, ry + 150, { size: 24, w: 600, color: C.mute, align: 'center' });
  ctx.fillStyle = C.line; ctx.fillRect(x0 + 48, y0 + 590, w - 96, 2);
  // status, then the warning signs, one per hat
  const [h0, h1, h2, h3] = TM.hats;
  if (t < h0) chip('Healthy', x0 + 48, y0 + 664, { size: 28 });
  else if (t < h3) statusSwap('Healthy', 'Needs attention', h0, t, x0 + 48, y0 + 664, { size: 28 });
  else statusSwap('Needs attention', 'At risk', h3, t, x0 + 48, y0 + 664, { size: 28 });
  [['Missed her usual booking', h1], ['No reply to her last 2 texts', h2]].forEach(([s, ts], i) => {
    const p = eo(P(t, ts - 0.02, ts + 0.3)); if (p <= 0) return;
    ctx.save(); ctx.globalAlpha *= p; ctx.translate((1 - p) * 26, 0);
    dot(x0 + 62, y0 + 760 + i * 62, 9, C.risk); txt(s, x0 + 88, y0 + 771 + i * 62, { size: 32, w: 600 }); ctx.restore();
  });
}

// ── 2 · The dashboard (flags on the drop; wins back in bar 4) ────────────────
const ROWS = [
  { n: 'Sarah Mitchell', v: 'Last visit 47 days ago' },
  { n: 'Jordan Reyes', v: 'Last visit 5 days ago' },
  { n: 'Priya Shah', v: 'Last visit 38 days ago', flag: [1, 'At risk'], win: 13 },
  { n: 'Marcus Lee', v: 'Last visit 12 days ago' },
  { n: 'Ella Wright', v: 'Last visit 44 days ago', flag: [2, 'At risk'], win: 14 },
  { n: 'Theo Martin', v: 'Last visit 29 days ago', flag: [3, 'Needs attention'], win: 15 },
];
const ROW_Y0 = PAN.y + 118, ROW_H = 130, DASH_H = 118 + ROWS.length * ROW_H;
// mode 'flag': the drop — Sarah is at risk and three more tip over, one per beat.
// mode 'win': bar 4 — Sarah is already rebooked and the others come back, one per beat.
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
function dashboard(t, mode, inAt) {
  const x0 = PAN.x, y0 = PAN.y, w = PAN.w;
  const hin = inAt == null ? 1 : eo(P(t, inAt, inAt + 0.35));
  ctx.save(); ctx.globalAlpha *= hin; ctx.translate(0, (1 - hin) * 18);
  logo(x0 + 70, y0 + 60, 64, C.accent); txt('Client health', x0 + 108, y0 + 72, { size: 36, w: 700, ls: -0.8 });
  // header counter: at-risk clients while flagging, clients won back while winning back
  const flagCount = (tt) => ROWS.reduce((n, r, i) => n + (rowState(i, 'flag', tt).lab === 'At risk'), 0);
  const winCount = (tt) => ROWS.reduce((n, r, i) => n + (i === 0 || !!(r.flag && tt >= at(r.win))), 0);
  const cnt = mode === 'flag' ? flagCount : winCount, lab = mode === 'flag' ? 'At risk' : 'Won back', col = mode === 'flag' ? C.risk : C.ok;
  const now = cnt(t); let tc = -1; for (const r of ROWS) { const c = mode === 'flag' ? (r.flag && r.flag[1] === 'At risk' ? at(r.flag[0]) : -1) : (r.flag ? at(r.win) : -1); if (c >= 0 && c <= t) tc = Math.max(tc, c); }
  const prev = tc < 0 ? now : cnt(tc - 1e-3), cw = tw(lab, 24, 700) + 110, cx0 = x0 + w - 36 - cw;
  const fl = tc < 0 ? 0 : Math.sin(Math.PI * P(t, tc, tc + 0.4));
  box(cx0, y0 + 36, cw, 50, 25, mixc('#ffffff', col, 0.13 + 0.1 * fl));
  txt(lab, cx0 + 22, y0 + 70, { size: 24, w: 700, color: mixc(col, C.ink, 0.35) });
  roll(prev, now, tc, t, cx0 + cw - 22, y0 + 71, { size: 28, w: 800, color: mixc(col, C.ink, 0.35) });
  ctx.restore();
  ctx.fillStyle = C.line; ctx.fillRect(x0, y0 + 117, w, 2);
  ROWS.forEach((r, i) => {
    const y = ROW_Y0 + i * ROW_H, ti = inAt == null ? -1 : inAt + 0.05 + i * 0.045, p = ti < 0 ? 1 : eo(P(t, ti, ti + 0.4));
    if (p <= 0) return;
    const st = rowState(i, mode, t), k = st.tc < 0 ? 1 : P(t, st.tc, st.tc + 0.35);
    ctx.save(); ctx.globalAlpha *= p; ctx.translate(0, (1 - p) * 40);
    const tintOf = (l) => (l === 'At risk' ? mixc('#ffffff', C.risk, 0.07) : l === 'Needs attention' ? mixc('#ffffff', C.warn, 0.08) : '#ffffff');
    const bg = st.from ? mixc(tintOf(st.from), tintOf(st.lab), k) : tintOf(st.lab);
    if (bg !== '#ffffff') { ctx.save(); ctx.beginPath(); ctx.rect(x0, y, w, ROW_H); ctx.clip(); box(x0, y - (i ? 0 : 0), w, ROW_H + (i === ROWS.length - 1 ? 0 : 0), i === ROWS.length - 1 ? [0, 0, 40, 40] : 0, bg); ctx.restore(); }
    avatar(x0 + 82, y + 65, 34, r.n, i);
    txt(r.n, x0 + 136, y + 58, { size: 34, w: 650, ls: -0.5 });
    if (st.sub && (st.tc < 0 || k > 0)) {
      const sk = st.tc < 0 ? 1 : k;
      if (sk < 0.4) txt(r.v, x0 + 136, y + 98 - 10 * eo(sk / 0.4), { size: 24, w: 500, color: C.mute, a: 1 - sk / 0.4 }); // the old line leaves before the new one lands
      const nk = eo(P(sk, 0.35, 1));
      ctx.save(); ctx.globalAlpha *= nk; ctx.translate(0, (1 - nk) * 10); check(x0 + 146, y + 90, 16, C.ok, 3.5); txt(st.sub, x0 + 166, y + 98, { size: 24, w: 650, color: mixc(C.ok, C.ink, 0.2) }); ctx.restore();
    } else txt(r.v, x0 + 136, y + 98, { size: 24, w: 500, color: C.mute });
    statusSwap(st.from, st.lab, st.tc, t, x0 + w - 36, y + 65, { right: true, size: 24 });
    if (i < ROWS.length - 1) { ctx.fillStyle = C.line; ctx.fillRect(x0 + 36, y + ROW_H - 1, w - 72, 2); }
    ctx.restore();
  });
}

function sceneOpen(t) {
  const D = TM.D;
  // a slow push-in through the intro, released on the drop
  const z = t < D ? lerp(1.0, 1.035, io(P(t, 0, D))) : lerp(1.035, 1, expo(P(t, D, D + 0.4)));
  ctx.save(); ctx.translate(CX, PAN.y + 450); ctx.scale(z, z); ctx.translate(-CX, -(PAN.y + 450));
  // the card becomes the dashboard: same white panel, it grows to fit the list
  const g = expo(P(t, D, D + 0.5));
  panel(lerp(900, DASH_H, g));
  if (t < D + 0.3) { // Sarah's card shrinks into her row and fades as the list arrives
    const q = P(t, D, D + 0.3), s = lerp(1, 0.55, eo(q));
    ctx.save(); ctx.globalAlpha *= 1 - eo(clamp(q * 1.6));
    ctx.translate(PAN.x + 60, PAN.y + 60); ctx.scale(s, s); ctx.translate(-(PAN.x + 60), -(PAN.y + 60));
    ctx.beginPath(); ctx.roundRect(PAN.x, PAN.y, PAN.w, 900, 40); ctx.clip();
    hookCard(t); ctx.restore();
  }
  if (t >= D) dashboard(t, 'flag', D);
  ctx.restore();
  headline([[['Your best client']], [['is about to '], ['leave.', C.risk]]], t, -1, D - 0.1);
  headline([[['MsgHealth', C.accent], [' spots it']], [['before you do.']]], t, D + 0.12);
}

// ── 3 · The text (bar 2) ─────────────────────────────────────────────────────
function bubble(lines, x, y, out, p) { // x: the bubble's outer edge (right for outgoing, left for replies)
  if (p <= 0) return 0;
  const size = 36, lh = 48, px = 28, py = 22, w = Math.max(...lines.map((l) => tw(l, size, 500, -0.3))) + px * 2, h = lines.length * lh + py * 2 - 8;
  const x0 = out ? x - w : x, s = lerp(0.6, 1, back(p, 1.4));
  ctx.save(); ctx.globalAlpha *= clamp(p * 3);
  ctx.translate(out ? x : x0, y + h); ctx.scale(s, s); ctx.translate(-(out ? x : x0), -(y + h));
  box(x0, y, w, h, out ? [30, 30, 8, 30] : [30, 30, 30, 8], out ? C.accent : C.bubble);
  lines.forEach((l, i) => txt(l, x0 + px, y + py + 34 + i * lh, { size, w: 500, ls: -0.3, color: out ? '#fff' : C.ink }));
  ctx.restore(); return h;
}
function sceneChat(t) {
  const x0 = PAN.x, y0 = PAN.y, w = PAN.w, b = (n) => at(n);
  panel(660);
  ctx.save(); ctx.strokeStyle = C.accent; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(x0 + 56, y0 + 48); ctx.lineTo(x0 + 40, y0 + 64); ctx.lineTo(x0 + 56, y0 + 80); ctx.stroke(); ctx.restore();
  avatar(x0 + 112, y0 + 64, 32, 'Sarah Mitchell');
  txt('Sarah Mitchell', x0 + 160, y0 + 58, { size: 32, w: 700, ls: -0.5 });
  txt('Text message', x0 + 160, y0 + 90, { size: 22, w: 500, color: C.mute });
  ctx.fillStyle = C.line; ctx.fillRect(x0, y0 + 126, w, 2);
  // the win-back text lands on beat 2, the "sent by MsgHealth" tag on beat 3, her reply on beat 4
  bubble(['Hi Sarah! It’s been a while.', 'Want your usual Thursday', '10am slot?'], x0 + w - 36, y0 + 166, true, P(t, b(5) - 0.02, b(5) + 0.34));
  const tg = eo(P(t, b(6) - 0.02, b(6) + 0.3));
  if (tg > 0) {
    const s = 'Sent automatically by MsgHealth', sw = tw(s, 22, 650);
    ctx.save(); ctx.globalAlpha *= tg; ctx.translate(0, (1 - tg) * 10);
    txt(s, x0 + w - 40, y0 + 392, { size: 22, w: 650, color: C.accent, align: 'right' });
    logo(x0 + w - 40 - sw - 22, y0 + 384, 38, C.accent); ctx.restore();
  }
  const ty = P(t, b(6) + 0.06, b(6) + 0.2) * (1 - P(t, b(7) - 0.06, b(7)));
  if (ty > 0) { // typing…
    ctx.save(); ctx.globalAlpha *= ty; box(x0 + 36, y0 + 432, 124, 72, [30, 30, 30, 8], C.bubble);
    for (let j = 0; j < 3; j++) dot(x0 + 70 + j * 28, y0 + 468 - 6 * Math.max(0, Math.sin((t - b(6)) * 11 - j * 0.9)), 8, C.soft);
    ctx.restore();
  }
  bubble(['Yes please!', 'See you Thursday'], x0 + 36, y0 + 432, false, P(t, b(7) - 0.02, b(7) + 0.34));
  headline([[['It texts them']], [['back '], ['for you.', C.accent]]], t);
}

// ── 4 · Rebooked (bar 3) ─────────────────────────────────────────────────────
function sceneBook(t) {
  const x0 = PAN.x, y0 = PAN.y, w = PAN.w, b = (n) => at(n);
  panel(880);
  txt('Thursday', x0 + 48, y0 + 74, { size: 36, w: 700, ls: -0.8 });
  txt('Appointments', x0 + w - 48, y0 + 72, { size: 24, w: 600, color: C.mute, align: 'right' });
  ctx.fillStyle = C.line; ctx.fillRect(x0, y0 + 117, w, 2);
  const SLOTS = [['9:00', 'Jordan Reyes', 'Cut & style'], ['10:00', null], ['11:00', 'Marcus Lee', 'Beard trim'], ['12:00', 'Ella Wright', 'Colour']];
  SLOTS.forEach(([h, n, what], i) => {
    const y = y0 + 132 + i * 118, bx = x0 + 168, bw = w - 168 - 36;
    txt(h, x0 + 48, y + 58, { size: 26, w: 600, color: C.mute });
    if (n) { box(bx, y, bw, 94, 20, '#f3f2fb'); txt(n, bx + 28, y + 58, { size: 30, w: 650, ls: -0.4 }); txt(what, bx + bw - 28, y + 58, { size: 24, w: 500, color: C.mute, align: 'right' }); return; }
    // Sarah drops into the empty slot on beat 2
    box(bx, y, bw, 94, 20, null, { stroke: C.soft, lw: 2.5, dash: [10, 9] });
    const p = P(t, b(9) - 0.03, b(9) + 0.36);
    if (p > 0) {
      const s = lerp(0.82, 1, back(p, 1.6));
      ctx.save(); ctx.globalAlpha *= clamp(p * 3); ctx.translate(bx + bw / 2, y + 47); ctx.scale(s, s); ctx.translate(-(bx + bw / 2), -(y + 47));
      box(bx, y, bw, 94, 20, C.accent, { shadow: 30, sa: 0.3, sy: 10 });
      txt('Sarah Mitchell', bx + 28, y + 58, { size: 30, w: 700, ls: -0.4, color: '#fff' });
      txt('Her usual', bx + bw - 28, y + 58, { size: 24, w: 600, color: 'rgba(255,255,255,.75)', align: 'right' });
      ctx.restore();
    } else txt('Open', bx + 28, y + 58, { size: 26, w: 600, color: C.soft });
  });
  // her health comes back on the big hit (beat 3), the status follows it
  const hy = y0 + 640;
  ctx.fillStyle = C.line; ctx.fillRect(x0, hy - 24, w, 2);
  const k = io(P(t, b(10) - 0.02, b(10) + 0.5)), sc = lerp(31, 88, k), col = scoreColor(sc);
  txt('Sarah’s health', x0 + 48, hy + 40, { size: 28, w: 600, color: C.mute });
  box(x0 + 48, hy + 82, w - 280, 18, 9, C.line); box(x0 + 48, hy + 82, (w - 280) * sc / 100, 18, 9, col);
  txt(String(Math.round(sc)), x0 + w - 48, hy + 112, { size: 84, w: 800, ls: -3, color: col, align: 'right' });
  statusSwap('At risk', 'Healthy', b(10) + 0.12, t, x0 + 48, hy + 170, { size: 26 });
  // toast on beat 4
  const tp = back(P(t, b(11) - 0.03, b(11) + 0.36), 1.3);
  if (tp > 0) {
    const s = 'Won back automatically', sw = tw(s, 30, 650) + 120;
    ctx.save(); ctx.globalAlpha *= clamp(tp * 2); ctx.translate(0, (1 - tp) * 30);
    box(CX - sw / 2, 1432, sw, 80, 40, C.ink, { shadow: 30, sa: 0.3 });
    dot(CX - sw / 2 + 48, 1472, 20, C.ok); check(CX - sw / 2 + 48, 1473, 15, '#fff', 3.5);
    txt(s, CX - sw / 2 + 84, 1483, { size: 30, w: 650, color: '#fff' }); ctx.restore();
  }
  headline([[['Back on the']], [['calendar.', C.accent]]], t);
}

// ── 5 · Every client (bar 4) ─────────────────────────────────────────────────
function sceneAll(t) {
  panel(DASH_H);
  dashboard(t, 'win', null);
  headline([[['Now do that for']], [['every client.', C.accent]]], t);
}

// ── 6 · Features (bar 5) on an indigo flood, which collapses into the ball ───
const FEATS = ['Health scores', 'Churn alerts', 'Win-back texts', 'Online booking'];
const LOGO_SIZE = 196, LKY = 900;
function penStart() { const [sx, sy] = penPoint(0); return [CX + (sx / 512 - 0.5) * LOGO_SIZE, LKY + (sy / 512 - 0.5) * LOGO_SIZE]; }
function sceneFeat(t) {
  const t0 = at(16), c0 = at(19.5), c1 = at(20);
  const [px, py] = penStart();
  ctx.save(); ctx.beginPath();
  if (t < c0) ctx.arc(CX, 1500, 2600 * expo(P(t, t0 - 0.04, t0 + 0.34)), 0, 7);
  else ctx.arc(px, py, lerp(2300, 14, ei(P(t, c0, c1))), 0, 7); // the flood drains into the ball that will draw the logo
  ctx.clip();
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#4f46e5'); g.addColorStop(1, '#3a32c4');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const fade = 1 - P(t, c0, c0 + 0.12);
  ctx.globalAlpha = fade;
  const kp = eo(P(t, t0 + 0.02, t0 + 0.4));
  txt('All in one place', 80, 560 + (1 - kp) * 16, { size: 34, w: 600, color: 'rgba(255,255,255,.72)', a: kp });
  const size = Math.min(116, 116 * 900 / Math.max(...FEATS.map((f) => tw(f, 116, 800, -5))));
  FEATS.forEach((f, i) => { // one per beat; the earlier ones step back a little
    const ti = at(16 + i), p = P(t, ti - 0.02, ti + 0.4); if (p <= 0) return;
    const y = 740 + i * 150, newer = i < 3 ? P(t, at(17 + i), at(17 + i) + 0.25) : 0;
    ctx.save(); ctx.beginPath(); ctx.rect(40, y - size * 1.02, W - 80, size * 1.36); ctx.clip();
    txt(f, 80, y + (1 - eo(p)) * size * 1.05, { size, w: 800, ls: -5, color: '#fff', a: clamp(p * 3) * lerp(1, 0.42, newer) });
    ctx.restore();
  });
  ctx.restore();
}

// ── 7 · The logo: the ball draws the mark, slides right, then left uncovering the wordmark ──
// The mark is revealed by flowing through its own pixels (a geodesic distance from its far end), so the reveal
// always follows the real strokes; the ball rides the centre of the moving front.
const DRAW_SEEDS = [[110, 392], [250, 318]];   // left bar foot, right diagonal foot (logo 512 px space)
const DRAW_CUTS = [[[126, 318], [194, 388]], [[366, 318], [388, 398]]];
let LDRAW = null;
function buildLogoDraw() {
  const N = 512, c = document.createElement('canvas'); c.width = c.height = N;
  const g = c.getContext('2d', { willReadFrequently: true }); g.drawImage(tinted(C.accent), 0, 0);
  const img = g.getImageData(0, 0, N, N), base = new Uint8ClampedArray(img.data);
  const inMask = (i) => base[i * 4 + 3] > 0;
  const blocked = new Uint8Array(N * N);
  for (const [[ax, ay], [bx, by]] of DRAW_CUTS) { const L = Math.hypot(bx - ax, by - ay);
    for (let k = 0; k <= L * 2; k++) { const x = ax + (bx - ax) * k / (L * 2), y = ay + (by - ay) * k / (L * 2);
      for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) blocked[Math.round(y + dy) * N + Math.round(x + dx)] = 1; } }
  const geo = (sx, sy) => { // Dial's algorithm, steps of 10 (straight) and 14 (diagonal)
    const dist = new Int32Array(N * N).fill(-1), buckets = [];
    const push = (i, d) => { (buckets[d] || (buckets[d] = [])).push(i); };
    for (let y = sy - 26; y <= sy + 26; y++) for (let x = sx - 26; x <= sx + 26; x++) { const i = y * N + x; if (Math.hypot(x - sx, y - sy) <= 26 && inMask(i) && !blocked[i]) { dist[i] = 0; push(i, 0); } }
    const done = new Uint8Array(N * N);
    for (let d = 0; d < buckets.length; d++) { const B = buckets[d]; if (!B) continue;
      for (const i of B) { if (done[i] || dist[i] !== d) continue; done[i] = 1; const x = i % N, y = (i / N) | 0;
        for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { if (!dx && !dy) continue; const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= N || ny >= N) continue;
          const j = ny * N + nx; if (!inMask(j) || blocked[j] || done[j]) continue; const nd = d + (dx && dy ? 14 : 10); if (dist[j] < 0 || nd < dist[j]) { dist[j] = nd; push(j, nd); } } } }
    return dist; };
  const dA = geo(...DRAW_SEEDS[0]), dB = geo(...DRAW_SEEDS[1]);
  let mA = 0, mB = 0; for (let i = 0; i < N * N; i++) { if (dA[i] > mA) mA = dA[i]; if (dB[i] > mB) mB = dB[i]; }
  const GAP = 600, TOTAL = mA + GAP + mB, par = new Float32Array(N * N).fill(-1);
  for (let i = 0; i < N * N; i++) { if (!inMask(i)) continue; if (dA[i] >= 0) par[i] = dA[i] / TOTAL; else if (dB[i] >= 0) par[i] = (mA + GAP + dB[i]) / TOTAL; }
  for (let pass = 0; pass < 8; pass++) for (let i = 0; i < N * N; i++) { // pixels on the cut take their neighbours' (later) value
    if (!inMask(i) || par[i] >= 0) continue; let v = -1; const x = i % N, y = (i / N) | 0;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const j = (y + dy) * N + x + dx; if (j >= 0 && j < N * N && par[j] > v) v = par[j]; }
    if (v >= 0) par[i] = v; }
  for (let i = 0; i < N * N; i++) if (inMask(i) && par[i] < 0) par[i] = 1;
  const BINS = 600, sx = new Float64Array(BINS), sy = new Float64Array(BINS), n = new Float64Array(BINS);
  for (let i = 0; i < N * N; i++) { if (base[i * 4 + 3] < 200) continue; const b = Math.min(BINS - 1, (par[i] * BINS) | 0); sx[b] += i % N; sy[b] += (i / N) | 0; n[b]++; }
  const pts = []; for (let b = 0; b < BINS; b++) pts.push(n[b] ? [sx[b] / n[b], sy[b] / n[b]] : null);
  for (let b = 0; b < BINS; b++) if (!pts[b]) { let lo = b, hi = b; while (lo >= 0 && !pts[lo]) lo--; while (hi < BINS && !pts[hi]) hi++;
    const A = pts[lo] || pts[hi], Bp = pts[hi] || pts[lo], u = lo < 0 || hi >= BINS ? 0 : (b - lo) / (hi - lo); pts[b] = [lerp(A[0], Bp[0], u), lerp(A[1], Bp[1], u)]; }
  const pen = pts.map((_, b) => { let x = 0, y = 0, k = 0; for (let j = Math.max(0, b - 6); j <= Math.min(BINS - 1, b + 6); j++) { x += pts[j][0]; y += pts[j][1]; k++; } return [x / k, y / k]; });
  LDRAW = { c, g, img, base, par, pen };
}
function penPoint(p) {
  if (!LDRAW) return [256, 256];
  const P_ = LDRAW.pen, f = clamp(p) * (P_.length - 1), i = Math.min(P_.length - 2, f | 0), u = f - i;
  return [lerp(P_[i][0], P_[i + 1][0], u), lerp(P_[i][1], P_[i + 1][1], u)];
}
function drawLogoProgress(x, y, size, p) {
  const { c, g, img, base, par } = LDRAW, d = img.data, soft = 0.012;
  for (let i = 0, j = 3; i < par.length; i++, j += 4) { const a = base[j]; d[j] = a ? a * clamp((p - par[i]) / soft) : 0; }
  g.putImageData(img, 0, 0); ctx.drawImage(c, x - size / 2, y - size / 2, size, size);
}
function sceneEnd(t) {
  const size = LOGO_SIZE, word = 124, ls = -4.5, glyph = size * 0.73, gw = tw('MsgHealth', word, 700, ls);
  const x0 = CX - (glyph + 28 + gw) / 2, mx = x0 + glyph / 2, textX = x0 + glyph + 28, textR = textX + gw;
  const rightC = textR - glyph / 2;
  const d0 = at(20), d1 = at(22), r1 = at(22.5), l1 = at(23.5);
  let mc = null;
  if (!LDRAW) return;
  if (t < d1) { // the ball traces the mark into existence
    const u = P(t, d0, d1), p = (1 - Math.cos(Math.PI * u)) / 2;
    drawLogoProgress(CX, LKY, size, p);
    const [px, py] = penPoint(p);
    dot(CX + (px / 512 - 0.5) * size, LKY + (py / 512 - 0.5) * size, 14 * (1 - P(u, 0.9, 1)));
  } else if (t < r1) mc = lerp(CX, rightC, io(P(t, d1, r1)));
  else { // sliding back left, it uncovers the wordmark behind it
    mc = lerp(rightC, mx, io(P(t, r1, l1)));
    const edge = mc + glyph / 2 + 8;
    if (edge < textR) {
      ctx.save(); ctx.beginPath(); ctx.rect(edge, LKY - word, textR - edge + 20, word * 1.6); ctx.clip();
      txt('MsgHealth', textX, LKY + word * 0.36, { size: word, w: 700, ls, color: C.ink }); ctx.restore();
    }
  }
  if (mc != null) logo(mc, LKY, size, C.accent);
  // the address lands on bar 7's downbeat; the hook's promise answers underneath it
  const up = eo(P(t, at(24) - 0.02, at(24) + 0.4));
  if (up > 0) {
    const u = 'msghealth.net', uw = tw(u, 50, 650, -1);
    ctx.save(); ctx.globalAlpha *= up; ctx.translate(0, (1 - up) * 14);
    txt(u, CX, LKY + 150, { size: 50, w: 650, color: C.accent, align: 'center', ls: -1 });
    ctx.fillStyle = C.accent; ctx.fillRect(CX - uw / 2, LKY + 168, uw * eo(P(t, at(24) + 0.1, at(24) + 0.5)), 3); ctx.restore();
  }
  const tg = eo(P(t, at(25) - 0.02, at(25) + 0.4));
  if (tg > 0) txt('Know who’s about to leave.', CX, LKY + 250 + (1 - tg) * 12, { size: 36, w: 500, color: C.mute, align: 'center', a: tg });
}

// ── frame ────────────────────────────────────────────────────────────────────
const SCENES = [sceneOpen, sceneChat, sceneBook, sceneAll, sceneFeat, sceneEnd];
function drawScene(t) {
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0); ctx.globalAlpha = 1; ctx.filter = 'none';
  ctx.fillStyle = C.paper; ctx.fillRect(0, 0, W, H);
  let i = 0; while (i + 1 < TM.scene.length && t >= TM.scene[i + 1]) i++;
  const t0 = TM.scene[i];
  if (i >= 1 && i <= 3 && t < t0 + TM.PUSH) { // bars 2–4 arrive on the downbeat: the last one lifts away as the next rises in
    const k = io(P(t, t0, t0 + TM.PUSH)), d = H * 0.4;
    ctx.save(); ctx.globalAlpha = 1 - P(k, 0.1, 0.5); ctx.translate(0, -d * k); SCENES[i - 1](t); ctx.restore();
    ctx.save(); ctx.globalAlpha = P(k, 0.4, 0.8); ctx.translate(0, d * (1 - k)); SCENES[i](t); ctx.restore();
  } else if (i === 4 && t < t0 + 0.4) { SCENES[3](t); SCENES[4](t); } // the flood covers the list
  else SCENES[i](t);
}
let MAIN, SCRATCH, SUB = 1;
const SHUTTER = 0.5 / FPS; // 180° shutter at the render frame rate
// the scene changes move ~4,000 px/s at their peak, so those frames take more samples to blur smoothly
const fast = (t) => TM.scene.slice(1, 4).some((t0) => t > t0 - 0.02 && t < t0 + TM.PUSH + 0.02) || (t > at(19.5) - 0.02 && t < at(20) + 0.02);
function renderFrame(t) {
  if (SUB <= 1) { ctx = MAIN; drawScene(t); return; }
  const n = fast(t) ? SUB * 3 : SUB;
  for (let k = 0; k < n; k++) {
    ctx = SCRATCH; drawScene(clamp(t + ((k + 0.5) / n - 0.5) * SHUTTER, 0, DURATION - 1e-4));
    MAIN.setTransform(1, 0, 0, 1, 0, 0); MAIN.globalAlpha = 1 / (k + 1); MAIN.drawImage(SCRATCH.canvas, 0, 0);
  }
  MAIN.globalAlpha = 1; ctx = MAIN;
}

window.renderFrame = renderFrame;
window.DURATION = DURATION;
window.ready = (async () => {
  const el = document.getElementById('c'); el.width = Math.round(W * DPR); el.height = Math.round(H * DPR);
  MAIN = ctx = el.getContext('2d');
  const sc = document.createElement('canvas'); sc.width = Math.round(W * DPR); sc.height = Math.round(H * DPR); SCRATCH = sc.getContext('2d');
  await Promise.all(['400', '500', '600', '650', '700', '800'].map((w) => document.fonts.load(`${w} 40px Inter`)));
  LOGO = await new Promise((res) => { const im = new Image(); im.onload = () => res(im); im.onerror = () => res(null); im.src = BRAND.logoFile; });
  if (LOGO) buildLogoDraw();
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
