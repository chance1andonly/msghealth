// The MsgHealth product, rendered as a pressed-clay interface (app units: 1600 × 1000).
'use strict';

const APP_W = 1600, APP_H = 1000;
const C = () => BRAND.colors;

// ── logo ─────────────────────────────────────────────────────────────────────
// Uses assets/logo.png when present; otherwise draws the placeholder mark + wordmark.
function drawLogo(x, y, s = 1, o = {}) {
  ctx.save(); ctx.translate(x, y);
  const press = o.press ?? 1; // clay press-in: squash then settle
  const sq = 1 + (1 - press) * 0.35;
  ctx.scale(s * (1 / sq + (sq - 1) * 0.2), s * (press < 1 ? press * 0.9 + 0.1 : 1));
  if (o.alpha != null) ctx.globalAlpha = o.alpha;
  if (LOGO) {
    const h = o.markOnly ? 150 : 130, w = (LOGO.width / LOGO.height) * h;
    ctx.drawImage(LOGO, -w / 2, -h / 2, w, h);
    ctx.restore(); return;
  }
  const ink = o.light ? '#fffaf2' : C().ink;
  const mark = (mx) => {
    // speech bubble with a heartbeat line
    clay((k) => { k.beginPath(); k.roundRect(mx - 62, -58, 124, 100, 34); k.moveTo(mx - 30, 36); k.lineTo(mx - 44, 66); k.lineTo(mx - 6, 40); k.closePath(); }, C().primary, { x: mx - 62, y: -58, w: 124, h: 124 }, { shadow: 12, gloss: 1.2 });
    ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.strokeStyle = 'rgba(0,40,35,0.25)'; ctx.lineWidth = 12;
    const beat = (dx, dy) => { ctx.beginPath(); ctx.moveTo(mx - 42 + dx, -8 + dy); ctx.lineTo(mx - 18 + dx, -8 + dy); ctx.lineTo(mx - 6 + dx, -34 + dy); ctx.lineTo(mx + 8 + dx, 16 + dy); ctx.lineTo(mx + 20 + dx, -8 + dy); ctx.lineTo(mx + 42 + dx, -8 + dy); ctx.stroke(); };
    beat(1.5, 3); ctx.strokeStyle = '#fffaf2'; ctx.lineWidth = 10; beat(0, 0); ctx.restore();
  };
  if (o.markOnly) { mark(0); ctx.restore(); return; }
  const tw = textW('Msg', 104, 900) + textW('Health', 104, 900);
  const total = 150 + tw;
  const x0 = -total / 2;
  mark(x0 + 62);
  cText('Msg', x0 + 150, 36, 104, ink, { weight: 900 });
  cText('Health', x0 + 150 + textW('Msg', 104, 900), 36, 104, C().primary, { weight: 900 });
  ctx.restore();
}

// ── small icons ──────────────────────────────────────────────────────────────
function icon(kind, x, y, s, col) {
  const k = s / 40;
  switch (kind) {
    case 'Client Health': heart(x, y, 16 * k, col); break;
    case 'Inbox': cRect(x - 18 * k, y - 14 * k, 36 * k, 26 * k, 9 * k, col, { shadow: 3 }); break;
    case 'Bookings': cRect(x - 16 * k, y - 16 * k, 32 * k, 32 * k, 6 * k, col, { shadow: 3 }); cRect(x - 16 * k, y - 16 * k, 32 * k, 9 * k, 4 * k, shade(col, -0.25), { shadow: 0 }); break;
    case 'Reviews': star(x, y, 19 * k, col, 0, { shadow: 3 }); break;
    case 'Loyalty': cEll(x, y, 17 * k, 17 * k, col, { shadow: 3 }); cEll(x, y, 7 * k, 7 * k, '#fffaf2', { shadow: 0, tex: 0 }); break;
    case 'Payments': cRect(x - 20 * k, y - 13 * k, 40 * k, 26 * k, 6 * k, col, { shadow: 3 }); cRect(x - 20 * k, y - 6 * k, 40 * k, 6 * k, 0, shade(col, -0.3), { shadow: 0 }); break;
    case 'Reports': [0, 1, 2].forEach((i) => cRect(x - 17 * k + i * 12 * k, y + 14 * k - (10 + i * 9) * k, 9 * k, (10 + i * 9) * k, 3 * k, col, { shadow: 2 })); break;
    case 'Automations': clay(P.poly([[x + 4 * k, y - 20 * k], [x - 12 * k, y + 3 * k], [x, y + 3 * k], [x - 4 * k, y + 20 * k], [x + 12 * k, y - 3 * k], [x, y - 3 * k]]), col, { x: x - 12 * k, y: y - 20 * k, w: 24 * k, h: 40 * k }, { shadow: 3 }); break;
    case 'sms': cRect(x - 18 * k, y - 14 * k, 36 * k, 24 * k, 9 * k, col, { shadow: 3 }); clay(P.poly([[x - 10 * k, y + 8 * k], [x - 14 * k, y + 18 * k], [x - 2 * k, y + 9 * k]]), col, { x: x - 14 * k, y, w: 12 * k, h: 18 * k }, { shadow: 0 }); break;
    case 'email':
      cRect(x - 20 * k, y - 14 * k, 40 * k, 28 * k, 5 * k, col, { shadow: 3 });
      ctx.save(); ctx.strokeStyle = '#fffaf2'; ctx.lineWidth = 3 * k; ctx.beginPath(); ctx.moveTo(x - 16 * k, y - 9 * k); ctx.lineTo(x, y + 3 * k); ctx.lineTo(x + 16 * k, y - 9 * k); ctx.stroke(); ctx.restore(); break;
  }
}
// Health ring with score.
function ring(x, y, r, score, o = {}) {
  const col = scoreColor(score);
  cEll(x, y, r + 8, r + 8, '#fffdf8', { shadow: 6 });
  ctx.save(); ctx.lineCap = 'round';
  ctx.strokeStyle = '#ebe5da'; ctx.lineWidth = r * 0.28; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.stroke();
  ctx.strokeStyle = shade(col, -0.25); ctx.lineWidth = r * 0.28; ctx.beginPath(); ctx.arc(x + 1, y + 2, r, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * score) / 100); ctx.stroke();
  ctx.strokeStyle = col; ctx.beginPath(); ctx.arc(x, y, r, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * score) / 100); ctx.stroke();
  ctx.restore();
  cText(String(Math.round(score)), x, y + r * 0.34, r * 0.9, C().ink, { align: 'center', weight: 900 });
  if (o.pulse) glow(x, y, r * 2.4, col, 0.35 * o.pulse);
}
const scoreColor = (s) => (s >= 70 ? C().healthy : s >= 50 ? C().attention : C().risk);
const scoreLabel = (s) => (s >= 70 ? 'Healthy' : s >= 50 ? 'Needs attention' : 'At risk');
function pill(x, y, label, col, size = 26, o = {}) {
  const w = textW(label, size, 800) + size * 1.4;
  cRect(x, y - size * 0.95, w, size * 1.7, size * 0.85, col, { shadow: 4, ...o });
  cText(label, x + w / 2, y + size * 0.28, size, o.textCol ?? '#fffdf8', { align: 'center', weight: 800, emboss: false });
  return w;
}

// ── app shell ────────────────────────────────────────────────────────────────
function app(st) {
  ctx.save();
  cRect(0, 0, APP_W, APP_H, 0, C().screen, { shadow: 0, tex: 0.5, texScale: 1.2, still: true });
  // sidebar
  cRect(18, 18, 300, APP_H - 36, 34, '#fffdf8', { shadow: 10, still: true });
  drawLogo(168, 90, 0.44);
  BRAND.nav.forEach((n, i) => {
    const y = 190 + i * 94, active = st.nav === n;
    if (active) cRect(38, y - 36, 260, 72, 24, rgba(C().primary, 1) && mix(C().primary, '#ffffff', 0.82), { shadow: 3, still: true });
    icon(n, 82, y, 34, active ? C().primary : '#9aa6ad');
    cText(n, 118, y + 10, 27, active ? C().primaryDark : '#56636b', { weight: active ? 900 : 700, emboss: false });
  });
  // top bar
  cText(st.title ?? '', 370, 102, 54, C().ink, { weight: 900 });
  cRect(1010, 52, 300, 64, 32, '#fffdf8', { shadow: 5, still: true });
  cEll(1052, 84, 12, 12, 'rgba(0,0,0,0)', { shadow: 0, flat: true });
  ctx.save(); ctx.strokeStyle = '#9aa6ad'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(1050, 82, 11, 0, 7); ctx.moveTo(1058, 90); ctx.lineTo(1066, 98); ctx.stroke(); ctx.restore();
  cText('Search clients', 1078, 94, 26, '#a2abb1', { weight: 700, emboss: false });
  // Help button
  const hp = st.helpPress ?? 0;
  const hs = 1 - hp * 0.08;
  ctx.save(); ctx.translate(1440, 84); ctx.scale(hs, hs);
  cRect(-100, -32, 200, 64, 32, st.helpHi ? C().primary : '#fffdf8', { shadow: 6 - hp * 4, still: true });
  cEll(-60, 0, 18, 18, st.helpHi ? '#fffdf8' : C().primary, { shadow: 0 });
  cText('?', -60, 10, 28, st.helpHi ? C().primary : '#fffdf8', { align: 'center', weight: 900, emboss: false });
  cText('Help', 10, 10, 28, st.helpHi ? '#fffdf8' : C().ink, { align: 'center', weight: 900, emboss: false });
  ctx.restore();

  ctx.save(); ctx.beginPath(); ctx.rect(340, 140, APP_W - 340, APP_H - 140); ctx.clip();
  ({ health: viewHealth, automation: viewAutomation, inbox: viewInbox, overview: viewOverview })[st.view]?.(st);
  ctx.restore();
  if (st.help) helpLayer(st);
  ctx.restore();
}

// ── Client Health view ───────────────────────────────────────────────────────
const CLIENTS = [
  { who: 'alex', name: 'Alex R.', sub: 'Last visit 2 weeks ago', score: 92 },
  { who: 'jordan', name: 'Jordan M.', sub: 'Last visit 9 weeks ago', score: 78 },
  { who: 'morgan', name: 'Morgan T.', sub: 'Last visit 3 weeks ago', score: 84 },
  { who: 'priya', name: 'Priya S.', sub: 'Last visit 6 weeks ago', score: 61 },
];
function viewHealth(st) {
  const j = st.jordan ?? 78;
  const counts = st.counts ?? [128, 9, 2];
  const tiles = [['Healthy', C().healthy, counts[0]], ['Needs attention', C().attention, counts[1]], ['At risk', C().risk, counts[2]]];
  tiles.forEach(([l, col, n], i) => {
    const x = 370 + i * 400;
    cRect(x, 160, 370, 140, 30, '#fffdf8', { shadow: 8, still: true });
    cEll(x + 60, 230, 26, 26, col, { shadow: 4 });
    cText(String(Math.round(n)), x + 110, 250, 60, C().ink, { weight: 900 });
    cText(l, x + 110 + textW(String(Math.round(n)), 60, 900) + 16, 246, 28, '#6a767d', { weight: 800, emboss: false });
  });
  let y = 330;
  CLIENTS.forEach((cl) => {
    const isJ = cl.who === 'jordan';
    const score = isJ ? j : cl.score;
    const exp = isJ ? (st.signals ?? 0) : 0;
    const h = 120 + ease.out(exp) * 84;
    const focus = isJ ? (st.focus ?? 0) : 0;
    ctx.save();
    if (focus) { ctx.translate(900, y + h / 2); ctx.scale(1 + focus * 0.03, 1 + focus * 0.03); ctx.translate(-900, -(y + h / 2)); }
    cRect(370, y, 1190, h - 16, 28, '#fffdf8', { shadow: 6 + focus * 12, still: true });
    if (isJ && score < 50) cRect(370, y, 14, h - 16, 7, C().risk, { shadow: 0 });
    miniFace(440, y + 52, 34, cl.who);
    cText(cl.name, 500, y + 48, 34, C().ink, { weight: 900, emboss: false });
    cText(cl.sub, 500, y + 86, 25, '#7b868c', { weight: 700, emboss: false });
    ring(1100, y + 52, 36, score, { pulse: isJ ? st.pulse : 0 });
    pill(1180, y + 52, scoreLabel(score), scoreColor(score), 26);
    if (exp > 0) {
      ctx.save(); ctx.globalAlpha = clamp(exp * 2);
      cText('Signals', 500, y + 150, 24, '#7b868c', { weight: 900, emboss: false });
      const sp = (k) => pop(clamp(exp * 2 - k * 0.5));
      ctx.save(); ctx.translate(610, y + 142); ctx.scale(sp(0), sp(0));
      pill(0, 0, 'Visit overdue  ·  usually monthly', '#fbe3dc', 24, { textCol: '#b3402f' });
      ctx.restore();
      ctx.save(); ctx.translate(1110, y + 142); ctx.scale(sp(1), sp(1));
      pill(0, 0, 'No reply to last message', '#fbe3dc', 24, { textCol: '#b3402f' });
      ctx.restore();
      ctx.restore();
    }
    if (isJ && st.flag) { // red clay flag planted on the row
      const f = pop(st.flag);
      ctx.save(); ctx.translate(1370, y + 96); ctx.scale(f, f); ctx.rotate(Math.sin(POSE * 0.9) * 0.04);
      cRect(-4, -70, 8, 80, 4, '#6b4a33', { shadow: 5 });
      clay(P.poly([[4, -70], [70, -52], [4, -32]]), C().risk, { x: 4, y: -70, w: 66, h: 38 }, { shadow: 6 });
      ctx.restore();
    }
    ctx.restore();
    y += h;
  });
}

// ── Automations view ─────────────────────────────────────────────────────────
function viewAutomation(st) {
  const b = st.blocks ?? 4;
  cRect(370, 160, 1190, 800, 34, '#fffdf8', { shadow: 8, still: true });
  cText('Win-back automation', 420, 238, 40, C().ink, { weight: 900, emboss: false });
  // toggle
  const tg = st.toggle ?? 1;
  cRect(1370, 190, 140, 64, 32, mix('#d6d0c6', C().healthy, tg), { shadow: 4 });
  cEll(1370 + 32 + tg * 76, 222, 26, 26, '#ffffff', { shadow: 6 });
  cText(tg > 0.5 ? 'On' : 'Off', 1340, 234, 28, '#6a767d', { align: 'right', weight: 900, emboss: false });
  const steps = [
    ['WHEN', 'A client becomes At risk', null, C().risk],
    ['SEND', 'A personal SMS', 'sms', C().primary],
    ['SEND', 'A follow-up email', 'email', C().primary],
    ['INVITE', 'Them to book their next visit', 'Bookings', C().primary],
  ];
  steps.forEach(([k, label, ic, col], i) => {
    const p = pop(clamp(b - i));
    if (p <= 0) return;
    const y = 300 + i * 158;
    if (i > 0) { // clay connector tube
      const fl = clamp(b - i + 0.4);
      cCap(560, y - 44, 560, y - 44 + 44 * fl, 7, '#d9d2c6', { shadow: 2 });
    }
    ctx.save(); ctx.translate(560, y + 50); ctx.scale(p, p); ctx.translate(-560, -(y + 50));
    cRect(420, y, 1060, 104, 28, i === 0 ? '#fdeeea' : mix(C().primary, '#ffffff', 0.9), { shadow: 7 });
    cRect(446, y + 26, 128, 52, 26, col, { shadow: 3 });
    cText(k, 510, y + 62, 24, '#fffdf8', { align: 'center', weight: 900, emboss: false });
    if (ic) icon(ic, 632, y + 52, 40, col); else cEll(632, y + 52, 16, 16, col, { shadow: 3 });
    cText(label, 676, y + 64, 32, C().ink, { weight: 800, emboss: false });
    ctx.restore();
  });
}

// ── Inbox view (SMS + email in one thread) ───────────────────────────────────
function viewInbox(st) {
  cRect(370, 160, 400, 800, 30, '#fffdf8', { shadow: 8, still: true });
  [['jordan', 'Jordan M.', st.reply > 0.5 ? 'Yes please! Thursday…' : 'Hi Jordan! We miss…'], ['priya', 'Priya S.', 'Thanks, see you soon'], ['alex', 'Alex R.', 'Loved it, thank you!']].forEach(([w, n, m], i) => {
    const y = 190 + i * 120;
    if (i === 0) cRect(386, y - 8, 368, 110, 22, mix(C().primary, '#ffffff', 0.86), { shadow: 2, still: true });
    miniFace(440, y + 46, 30, w);
    cText(n, 490, y + 40, 28, C().ink, { weight: 900, emboss: false });
    cText(m, 490, y + 76, 22, '#7b868c', { weight: 700, emboss: false });
    if (i === 0 && st.reply > 0.5 && !(st.booked > 0)) cEll(730, y + 30, 10, 10, C().primary, { shadow: 2 });
  });
  // thread
  cRect(790, 160, 770, 800, 30, '#fffdf8', { shadow: 8, still: true });
  miniFace(850, 218, 32, 'jordan');
  cText('Jordan M.', 900, 230, 32, C().ink, { weight: 900, emboss: false });
  ring(1480, 214, 30, st.jordan ?? 38);
  const bub = (x, y, w, h, col, tag, lines, out, a) => {
    if (a <= 0) return;
    ctx.save(); const p = pop(clamp(a)); ctx.translate(out ? x + w : x, y + h); ctx.scale(p, p); ctx.translate(-(out ? x + w : x), -(y + h));
    cRect(x, y, w, h, 30, col, { shadow: 6 });
    lines.forEach((l, i) => cText(l, x + 30, y + 52 + i * 38, 27, out ? '#fffdf8' : C().ink, { weight: 700, emboss: false }));
    if (tag) { icon(tag, out ? x + w - 34 : x + w - 34, y + h + 26, 22, out ? C().primaryDark : '#9aa6ad'); cText(tag === 'sms' ? 'SMS' : 'Email', x + w - 56, y + h + 34, 20, '#7b868c', { align: 'right', weight: 800, emboss: false }); }
    ctx.restore();
  };
  bub(900, 280, 620, 136, C().primary, 'sms', ["Hi Jordan! We miss you at Sam's", 'Studio. Want your usual Thursday spot?'], true, st.sms ?? 1);
  bub(1000, 460, 520, 96, shade(C().primary, -0.12), 'email', ['Email: Book your next visit →'], true, st.email ?? 1);
  if ((st.typing ?? 0) > 0 && !(st.reply > 0)) {
    cRect(830, 610, 130, 70, 35, '#eee8de', { shadow: 4 });
    for (let i = 0; i < 3; i++) cEll(866 + i * 30, 645 - (POSE + i) % 3 * 5, 9, 9, '#9aa6ad', { shadow: 0 });
  }
  bub(830, 600, 560, 96, '#eee8de', null, ['Yes please! Thursday at 10 works.'], false, st.reply ?? 0);
  if ((st.booked ?? 0) > 0) {
    const p = pop(st.booked);
    ctx.save(); ctx.translate(1175, 820); ctx.scale(p, p); ctx.translate(-1175, -820);
    cRect(870, 750, 610, 140, 30, mix(C().healthy, '#ffffff', 0.84), { shadow: 10 });
    icon('Bookings', 930, 820, 46, C().healthy);
    cText('Booked · Thu 10:00', 980, 810, 34, C().ink, { weight: 900, emboss: false });
    cText('Jordan M. · Cut & style', 980, 850, 25, '#5a6a70', { weight: 700, emboss: false });
    cEll(1420, 820, 30, 30, C().healthy, { shadow: 4 }); check(1420, 820, 30, '#fff');
    ctx.restore();
  }
}

// ── Overview: who's healthy, who's at risk, what needs attention, what's being done
function viewOverview(st) {
  const f = st.feed ?? 4;
  const cols = [
    ['Healthy', C().healthy, [['alex', 92], ['jordan', 86], ['morgan', 84]]],
    ['Needs attention', C().attention, [['priya', 61]]],
    ['At risk', C().risk, [['walker', 44]]],
  ];
  cols.forEach(([t, col, list], i) => {
    const x = 370 + i * 300;
    cRect(x, 160, 280, 800, 28, '#fffdf8', { shadow: 8, still: true });
    cRect(x + 20, 180, 240, 60, 30, col, { shadow: 3 });
    cText(t, x + 140, 220, 24, '#fffdf8', { align: 'center', weight: 900, emboss: false });
    list.forEach(([w, s], k) => {
      const y = 270 + k * 120;
      cRect(x + 18, y, 244, 104, 22, '#f8f4ed', { shadow: 3, still: true });
      miniFace(x + 64, y + 52, 28, w);
      ring(x + 196, y + 52, 26, s);
    });
  });
  const x = 1290;
  cRect(x, 160, 270, 800, 28, '#fffdf8', { shadow: 8, still: true });
  cRect(x + 20, 180, 230, 60, 30, C().primary, { shadow: 3 });
  cText('Actions taken', x + 135, 220, 24, '#fffdf8', { align: 'center', weight: 900, emboss: false });
  const items = [['sms', 'Win-back SMS', 'to Priya'], ['Reviews', 'Review request', 'to Alex'], ['Payments', 'Invoice paid', 'by Morgan'], ['Bookings', 'Jordan booked', 'Thu 10:00'], ['email', 'Follow-up email', 'to Casey']];
  items.forEach(([ic, a, b], i) => {
    const p = pop(clamp(f - i));
    if (p <= 0) return;
    const y = 270 + i * 132;
    ctx.save(); ctx.translate(x + 135, y + 55); ctx.scale(p, p); ctx.translate(-(x + 135), -(y + 55));
    cRect(x + 16, y, 238, 112, 22, mix(C().primary, '#ffffff', 0.9), { shadow: 4 });
    icon(ic, x + 52, y + 40, 30, C().primary);
    cText(a, x + 78, y + 48, 22, C().ink, { weight: 900, emboss: false });
    cText(b, x + 78, y + 82, 20, '#6a767d', { weight: 700, emboss: false });
    ctx.restore();
  });
}

// ── Help → Contact a Representative ──────────────────────────────────────────
function helpLayer(st) {
  const m = st.help;
  if (m > 0 && !(st.chat > 0)) {
    const p = pop(clamp(m));
    ctx.save(); ctx.translate(1440, 130); ctx.scale(p, p);
    cRect(-240, 0, 360, 110, 26, '#fffdf8', { shadow: 16 });
    cRect(-224, 16, 328, 78, 20, st.repHi ? mix(C().primary, '#ffffff', 0.8) : '#f6f2ea', { shadow: 2 });
    miniFace(-180, 55, 24, 'rep');
    cText('Contact a Representative', -140, 64, 23, C().ink, { weight: 900, emboss: false });
    ctx.restore();
  }
  if (st.chat > 0) {
    const p = ease.out(clamp(st.chat));
    const x = lerp(APP_W + 20, 1000, p);
    cRect(x, 150, 580, 820, 34, '#fffdf8', { shadow: 24 });
    cRect(x, 150, 580, 120, 34, C().primary, { shadow: 0 });
    miniFace(x + 70, 210, 36, 'rep');
    cText('Dana', x + 124, 204, 32, '#fffdf8', { weight: 900, emboss: false });
    cText('MsgHealth Representative', x + 124, 240, 22, '#e3f6f2', { weight: 700, emboss: false });
    cEll(x + 530, 210, 10, 10, '#7cf0a8', { shadow: 0 });
    const msgs = st.msgs ?? [];
    const lines = [
      ['Q', ['How do I change when my', 'reminder texts go out?']],
      ['A', ['Hi Sam! Happy to help.', "I'll walk you through it —", 'it takes about a minute.']],
      ['Q', ['Perfect, thank you!']],
    ];
    let y = 300;
    lines.forEach(([who, ls], i) => {
      const a = msgs[i] ?? 0;
      const h = 40 + ls.length * 36;
      if (a > 0) {
        const me = who === 'Q';
        const w = 440, bx = me ? x + 110 : x + 30;
        ctx.save(); const pp = pop(clamp(a)); ctx.translate(bx + (me ? w : 0), y + h); ctx.scale(pp, pp); ctx.translate(-(bx + (me ? w : 0)), -(y + h));
        cRect(bx, y, w, h, 26, me ? '#eee8de' : mix(C().primary, '#ffffff', 0.82), { shadow: 5 });
        ls.forEach((l, k) => cText(l, bx + 26, y + 46 + k * 36, 25, C().ink, { weight: 700, emboss: false }));
        ctx.restore();
      }
      y += h + 26;
    });
    if (st.repTyping && !(msgs[1] > 0)) {
      cRect(x + 30, y - 190 + 0, 120, 64, 32, mix(C().primary, '#ffffff', 0.82), { shadow: 4 });
      for (let i = 0; i < 3; i++) cEll(x + 62 + i * 28, y - 158 - (POSE + i) % 3 * 5, 8, 8, C().primary, { shadow: 0 });
    }
  }
}

// Draw the app into a world-space rect (used for the tablet on Sam's desk).
function appInRect(st, x, y, w, h) {
  ctx.save(); ctx.translate(x, y); ctx.scale(w / APP_W, h / APP_H);
  const z = CAMZ; CAMZ = z * (w / APP_W);
  app(st);
  CAMZ = z; ctx.restore();
}
