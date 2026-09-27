// Crisp, flat product UI for the ad (no clay texture: this is real software).
// Phone screens are laid out in iPhone points (390 × 844); the desktop app in 1600 × 1000.
'use strict';

const UIC = {
  bg: '#F4F6FB', surface: '#FFFFFF', border: '#E4E8F0', line: '#EEF1F6',
  text: '#0F172A', muted: '#64748B', faint: '#94A3B8',
  primary: BRAND.colors.primary, primaryDark: BRAND.colors.primaryDark, primarySoft: '#EEF0FF',
  cyan: '#06B6D4', navy: '#0B1024', navy2: '#141B3A',
  healthy: '#16A34A', healthySoft: '#DCFCE7', attention: '#D97706', attentionSoft: '#FEF3C7', risk: '#DC2626', riskSoft: '#FEE2E2',
};

// ── primitives ───────────────────────────────────────────────────────────────
function uRect(x, y, w, h, r, fill, o = {}) {
  const c = ctx; c.save();
  if (o.alpha != null) c.globalAlpha *= o.alpha;
  if (o.shadow) { c.shadowColor = `rgba(15,23,42,${o.shadowA ?? 0.10})`; c.shadowBlur = o.shadow * CAMZ; c.shadowOffsetY = o.shadow * 0.35 * CAMZ; }
  c.beginPath(); c.roundRect(x, y, w, h, Math.min(r, w / 2, h / 2));
  if (fill) { c.fillStyle = fill; c.fill(); }
  c.shadowColor = 'transparent';
  if (o.stroke) { c.strokeStyle = o.stroke; c.lineWidth = o.lw ?? 1; c.stroke(); }
  c.restore();
}
function uText(str, x, y, size, weight, color, o = {}) {
  const c = ctx; c.save();
  if (o.alpha != null) c.globalAlpha *= o.alpha;
  c.font = `${weight} ${size}px ${FONT.ui}`;
  c.textAlign = o.align ?? 'left'; c.textBaseline = o.base ?? 'alphabetic';
  if (o.ls) c.letterSpacing = `${o.ls}px`;
  c.fillStyle = color; c.fillText(str, x, y);
  c.__tx = x; c.__ty = y; logText(c, str, o.kind ?? 'ui');
  c.restore();
}
const uW = (str, size, weight) => { ctx.save(); ctx.font = `${weight} ${size}px ${FONT.ui}`; const w = ctx.measureText(str).width; ctx.restore(); return w; };
function uAvatar(x, y, r, initials, color) {
  const c = ctx; c.save(); c.fillStyle = color; c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill(); c.restore();
  uText(initials, x, y + r * 0.02, r * 0.78, 700, '#fff', { align: 'center', base: 'middle' });
}
function uRing(x, y, r, score, col, o = {}) {
  const c = ctx, lw = o.width ?? r * 0.2;
  c.save(); c.lineCap = 'round';
  c.strokeStyle = o.track ?? '#EDF0F5'; c.lineWidth = lw; c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.stroke();
  c.strokeStyle = col; c.beginPath(); c.arc(x, y, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * clamp(score / 100)); c.stroke();
  c.restore();
  if (o.label !== false) uText(String(Math.round(score)), x, y + r * 0.02, r * (o.fs ?? 0.72), 700, UIC.text, { align: 'center', base: 'middle' });
}
function uPill(x, y, label, bg, fg, size, o = {}) {
  const w = uW(label, size, 600) + size * 1.3 + (o.dot ? size * 0.9 : 0), h = size * 1.75;
  const x0 = o.align === 'right' ? x - w : o.align === 'center' ? x - w / 2 : x;
  uRect(x0, y - h / 2, w, h, h / 2, bg);
  if (o.dot) { ctx.save(); ctx.fillStyle = fg; ctx.beginPath(); ctx.arc(x0 + size * 0.85, y, size * 0.26, 0, 7); ctx.fill(); ctx.restore(); }
  uText(label, x0 + size * 0.65 + (o.dot ? size * 0.9 : 0), y + size * 0.02, size, 600, fg, { base: 'middle' });
  return w;
}
const scoreCol = (s) => (s >= 75 ? UIC.healthy : s >= 65 ? UIC.attention : UIC.risk);
const scoreSoft = (s) => (s >= 75 ? UIC.healthySoft : s >= 65 ? UIC.attentionSoft : UIC.riskSoft);
const scoreLbl = (s) => (s >= 75 ? 'Healthy' : s >= 65 ? 'Needs attention' : 'At risk');

// Line icons (stroke), sized to box s centred at x,y.
function uIcon(kind, x, y, s, col, lw = s * 0.09) {
  const c = ctx; c.save(); c.translate(x, y); c.scale(s / 24, s / 24); c.lineWidth = lw * 24 / s; c.strokeStyle = col; c.fillStyle = col; c.lineCap = 'round'; c.lineJoin = 'round';
  const P2 = (d) => c.stroke(new Path2D(d));
  c.translate(-12, -12);
  switch (kind) {
    case 'health': P2('M3 12h4l2-5 4 10 2-5h6'); break;
    case 'inbox': P2('M4 5h16v14H4z'); P2('M4 13h5l1.5 2h3L15 13h5'); break;
    case 'calendar': P2('M5 6h14v14H5z'); P2('M5 10h14M9 3v4M15 3v4'); break;
    case 'star': P2('M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z'); break;
    case 'gift': P2('M4 9h16v4H4zM6 13h12v7H6zM12 9v11'); P2('M12 9c-2-4-6-3-4 0M12 9c2-4 6-3 4 0'); break;
    case 'card': P2('M3 6h18v12H3z'); P2('M3 10h18'); break;
    case 'chart': P2('M5 19V11M12 19V5M19 19v-6'); break;
    case 'bolt': P2('M13 3L5 14h6l-1 7 8-11h-6z'); break;
    case 'message': P2('M4 5h16v11H9l-5 4z'); break;
    case 'bell': P2('M6 16V11a6 6 0 0112 0v5l2 2H4zM10 20a2 2 0 004 0'); break;
    case 'check': P2('M5 12.5l4.5 4.5L19 7.5'); break;
    case 'send': P2('M4 12l16-8-6 16-2.5-6.5z'); break;
    case 'x': P2('M6 6l12 12M18 6L6 18'); break;
    case 'clock': c.beginPath(); c.arc(12, 12, 8.5, 0, 7); c.stroke(); P2('M12 7.5V12l3 2'); break;
    case 'user': c.beginPath(); c.arc(12, 8.5, 3.8, 0, 7); c.stroke(); P2('M5 20c1-4 4-5.5 7-5.5s6 1.5 7 5.5'); break;
    case 'search': c.beginPath(); c.arc(10.5, 10.5, 6, 0, 7); c.stroke(); P2('M15 15l5 5'); break;
    case 'dots': [6, 12, 18].forEach((x) => { c.beginPath(); c.arc(x, 12, 1.6, 0, 7); c.fill(); }); break;
  }
  c.restore();
}
// Official logo mark, never recoloured or distorted (placed on a white tile on dark backgrounds).
function uLogo(x, y, size, o = {}) {
  if (!LOGO) return;
  const c = ctx; c.save(); if (o.alpha != null) c.globalAlpha *= o.alpha;
  if (o.tile) { uRect(x - size * 0.62, y - size * 0.62, size * 1.24, size * 1.24, size * 0.3, '#FFFFFF', { shadow: o.tileShadow ?? 0 }); }
  const w = size * LOGO.width / LOGO.height;
  c.drawImage(LOGO, x - w / 2, y - size / 2, w, size);
  c.restore();
}

// ── phone: lock screen with notifications (the owner's phone, before MsgHealth) ──
function phoneLock(w, h, st) {
  const c = ctx; c.save(); c.scale(w / 390, h / 844);
  const g = c.createLinearGradient(0, 0, 0, 844); g.addColorStop(0, '#2B3350'); g.addColorStop(1, '#141A2E');
  c.fillStyle = g; c.fillRect(0, 0, 390, 844);
  uText('9:41', 30, 22, 15, 600, '#fff');
  uText('12:48', 195, 196, 76, 600, '#fff', { align: 'center' });
  // notification: icon on the left, text in its own column (never under the icon)
  let y = 236;
  uRect(14, y, 362, 84, 22, 'rgba(255,255,255,0.88)');
  uRect(28, y + 22, 40, 40, 10, '#EF4444'); uIcon('calendar', 48, y + 42, 24, '#fff', 2.2);
  uText('Sarah K. canceled', 82, y + 36, 16, 600, UIC.text); uText('now', 360, y + 34, 13, 500, '#64748B', { align: 'right' });
  uText('Thursday, 2:00 PM appointment', 82, y + 60, 15, 400, '#334155');
  // regulars, directly beneath it
  y += 96;
  const cnt = st.count ?? 3, shown = Math.ceil(cnt - 1e-6);
  uRect(14, y, 362, 166, 22, 'rgba(255,255,255,0.88)');
  uRect(28, y + 22, 40, 40, 10, '#3B82F6'); uIcon('user', 48, y + 42, 24, '#fff', 2.2);
  uText('Regulars this month', 82, y + 36, 16, 600, UIC.text); uText('now', 360, y + 34, 13, 500, '#64748B', { align: 'right' });
  uText(`${shown} customer${shown === 1 ? '' : 's'}`, 82, y + 94, 36, 700, shown > 0 ? UIC.text : UIC.risk);
  [['SK', '#F97316'], ['ML', '#0EA5E9'], ['JP', '#A855F7']].forEach(([ini, col], i) => {
    const a2 = clamp(cnt - i); // each avatar fades out as the count drops past it
    if (a2 <= 0) return;
    c.save(); c.globalAlpha *= a2; uAvatar(100 + i * 42, y + 132, 17, ini, col); c.restore();
  });
  uText('No Older Notifications', 195, 700, 15, 600, 'rgba(255,255,255,0.55)', { align: 'center' });
  c.restore();
}

// ── phone: MsgHealth booking notification on the owner's lock screen ──────────
function phoneBooking(w, h, st) {
  const c = ctx; c.save(); c.scale(w / 390, h / 844);
  const g = c.createLinearGradient(0, 0, 0, 844); g.addColorStop(0, '#2B3350'); g.addColorStop(1, '#141A2E');
  c.fillStyle = g; c.fillRect(0, 0, 390, 844);
  uText('9:41', 30, 22, 15, 600, '#fff');
  uText('10:12', 195, 196, 76, 600, '#fff', { align: 'center' });
  const k = ease.out(clamp(st.k ?? 1)), y = 250 - (1 - k) * 40;
  c.save(); c.globalAlpha *= k;
  uRect(14, y, 362, 96, 22, 'rgba(255,255,255,0.92)');
  uLogo(41, y + 30, 22, { tile: true });
  uText('MSGHEALTH', 64, y + 34, 11.5, 600, '#475569', { ls: 0.4 }); uText('now', 360, y + 34, 12, 500, '#64748B', { align: 'right' });
  uText('New booking', 28, y + 60, 16, 700, UIC.text); uText('Sarah K. · Thursday, 10:00 AM', 28, y + 84, 14.5, 400, '#334155');
  c.restore();
  c.restore();
}

// ── phone: Sarah's messages thread ───────────────────────────────────────────
const SMS_TEXT = ['Hey Sarah — we noticed we haven’t', 'seen you in a while. Everything okay?'];
const REPLY_TEXT = 'Actually, yes — I meant to reach out.';
function phoneThread(w, h, st) {
  const c = ctx; c.save(); c.scale(w / 390, h / 844);
  c.fillStyle = '#FFFFFF'; c.fillRect(0, 0, 390, 844);
  uText('9:41', 30, 22, 15, 600, UIC.text);
  uRect(0, 44, 390, 104, 0, '#F8FAFC'); c.fillStyle = UIC.border; c.fillRect(0, 147, 390, 1);
  uAvatar(195, 80, 23, 'SS', '#334155'); uText("Sam's Studio", 195, 130, 16, 600, UIC.text, { align: 'center' });
  let y = 176;
  const inK = ease.out(clamp(st.inK ?? 1));
  const IN = ['Hey Sarah \u2014 we noticed we', 'haven\u2019t seen you in a while.', 'Everything okay?'];
  if (inK > 0) {
    c.save(); c.globalAlpha *= inK; const d = (1 - inK) * 12;
    uRect(14, y + d, 300, 106, 22, '#E9ECF2');
    IN.forEach((l, i) => uText(l, 30, y + 34 + i * 26 + d, 19, 400, UIC.text));
    c.restore();
  }
  y += 124;
  const typed = st.typed ?? 0;
  const sent = st.sent ?? 0;
  const OUT = ['Actually, yes \u2014 I meant', 'to reach out.'];
  if (sent > 0) {
    const e = ease.out(clamp(sent)), d = (1 - e) * 10;
    c.save(); c.globalAlpha *= e;
    uRect(130, y + d, 246, 80, 22, '#2563EB');
    OUT.forEach((l, i) => uText(l, 146, y + 34 + i * 26 + d, 19, 400, '#fff'));
    uText('Delivered', 374, y + 100, 13, 500, UIC.faint, { align: 'right' });
    c.restore();
    y += 122;
  }
  const card = ease.out(clamp(st.card ?? 0));
  if (card > 0) {
    c.save(); c.globalAlpha *= card;
    const booked = clamp(st.booked ?? 0) > 0.5;
    uRect(14, y, 300, 128, 22, booked ? '#ECFDF5' : '#E9ECF2');
    uIcon(booked ? 'check' : 'calendar', 42, y + 36, 24, booked ? UIC.healthy : UIC.text, 2.2);
    uText(booked ? 'Booked' : 'Book your next visit', 66, y + 44, 19, 700, UIC.text);
    uText('Thursday \u00b7 10:00 AM', 30, y + 80, 18, 400, '#334155');
    uText(booked ? 'See you then!' : 'Tap to confirm', 30, y + 108, 16, 600, booked ? UIC.healthy : UIC.primary);
    c.restore();
  }
  // composer
  uRect(0, 752, 390, 92, 0, '#F8FAFC'); c.fillStyle = UIC.border; c.fillRect(0, 752, 390, 1);
  uRect(14, 766, 304, 46, 23, '#FFFFFF', { stroke: UIC.border });
  const shownText = REPLY_TEXT.slice(0, Math.floor(typed));
  if (sent <= 0 && typed > 0) {
    c.save(); c.beginPath(); c.rect(26, 768, 284, 42); c.clip();
    const tw = uW(shownText, 18, 400); const tx = Math.min(30, 304 - tw);
    uText(shownText, tx, 795, 18, 400, UIC.text);
    if (POSE % 2 === 0) { c.fillStyle = '#2563EB'; c.fillRect(tx + tw + 2, 777, 2, 24); }
    c.restore();
  } else uText('Text Message', 30, 795, 18, 400, UIC.faint);
  uRect(328, 767, 46, 46, 23, typed > 0 && sent <= 0 ? '#2563EB' : '#CBD5E1'); uIcon('send', 351, 790, 20, '#fff', 2.2);
  c.restore();
}

// ── desktop: the owner's old dashboard (unbranded, before MsgHealth) ──────────
const OLD_ROWS = [
  ['Sarah K.', 'Last visit Mar 3', 'SK', '#F97316', true], ['Marcus L.', 'Last visit Mar 10', 'ML', '#0EA5E9', true], ['Alicia M.', 'Last visit Apr 28', 'AM', '#10B981', false],
  ['Jen P.', 'Last visit Mar 21', 'JP', '#A855F7', true], ['Tom R.', 'Last visit May 2', 'TR', '#F59E0B', false], ['Dev S.', 'Last visit May 6', 'DS', '#64748B', false],
  ['Nina W.', 'Last visit Apr 30', 'NW', '#EC4899', false], ['Chris B.', 'Last visit May 1', 'CB', '#14B8A6', false],
];
function oldDashboard(st) {
  const c = ctx; c.save();
  c.fillStyle = '#F3F4F6'; c.fillRect(0, 0, 1600, 1000);
  uRect(0, 0, 1600, 96, 0, '#FFFFFF'); c.fillStyle = '#E5E7EB'; c.fillRect(0, 96, 1600, 1);
  uText('Dashboard', 110, 64, 40, 700, '#111827');
  [['Revenue this week', '$4,820'], ['Appointments', '38']].forEach(([l, v], i) => {
    const x = 110 + i * 700;
    uRect(x, 126, 670, 170, 18, '#FFFFFF', { stroke: '#E5E7EB' });
    uText(l, x + 36, 182, 32, 500, '#6B7280'); uText(v, x + 36, 262, 64, 700, '#111827');
  });
  uRect(110, 326, 1380, 660, 18, '#FFFFFF', { stroke: '#E5E7EB' });
  uText('Customers', 146, 384, 36, 700, '#111827');
  c.save(); c.beginPath(); c.rect(110, 408, 1380, 574); c.clip();
  const sc = st.scroll ?? 0;
  OLD_ROWS.forEach(([n, l, ini, col, fades], i) => {
    const y = 420 + i * 132 - sc;
    const f = fades ? clamp(st.fade ?? 0) : 0;
    c.save(); c.globalAlpha *= 1 - f * 0.55;
    c.fillStyle = '#F3F4F6'; c.fillRect(146, y + 124, 1308, 1);
    uAvatar(196, y + 62, 38, ini, f > 0.5 ? '#9CA3AF' : col);
    uText(n, 258, y + 54, 38, 600, '#111827'); uText(l, 258, y + 96, 29, 400, '#6B7280');
    const act = f < 0.5;
    uPill(1440, y + 62, act ? 'Active' : 'Inactive', act ? '#ECFDF5' : '#F3F4F6', act ? '#047857' : '#6B7280', 28, { align: 'right' });
    c.restore();
  });
  c.restore();
  c.restore();
}

// ── desktop: MsgHealth ───────────────────────────────────────────────────────
const MH_NAV = [['health', 'Client Health'], ['inbox', 'Inbox'], ['calendar', 'Bookings'], ['star', 'Reviews'], ['gift', 'Loyalty'], ['card', 'Payments'], ['chart', 'Reports'], ['bolt', 'Automations']];
function mhShell(active) {
  const c = ctx;
  c.fillStyle = UIC.bg; c.fillRect(0, 0, 1600, 1000);
  uRect(0, 0, 300, 1000, 0, UIC.navy);
  uLogo(52, 58, 34, { tile: true });
  uText('MsgHealth', 88, 70, 30, 700, '#FFFFFF');
  MH_NAV.forEach(([ic, n], i) => {
    const y = 150 + i * 70, on = n === active;
    if (on) uRect(20, y - 28, 260, 56, 14, 'rgba(79,70,229,0.28)');
    uIcon(ic, 58, y, 26, on ? '#FFFFFF' : '#8B93B8', 2.2);
    uText(n, 90, y + 9, 25, on ? 600 : 500, on ? '#FFFFFF' : '#AEB4D0');
  });
}
const MH_CLIENTS = [
  ['Alicia M.', 'AM', '#10B981', 92], ['Sarah K.', 'SK', '#F97316', 84], ['Tom R.', 'TR', '#F59E0B', 88],
  ['Marcus L.', 'ML', '#0EA5E9', 58], ['Nina W.', 'NW', '#EC4899', 90], ['Jen P.', 'JP', '#A855F7', 61],
];
// Client Health list + Sarah's profile panel. st: {score, badge, pulse, select, scroll, composer...}
function mhHealth(st) {
  const c = ctx; c.save();
  mhShell('Client Health');
  uText('Client Health', 340, 70, 34, 700, UIC.text);
  // list
  uRect(340, 110, 640, 860, 18, '#FFFFFF', { stroke: UIC.border });
  uText('CUSTOMER', 372, 152, 15, 600, UIC.faint, { ls: 1 }); uText('HEALTH', 944, 152, 15, 600, UIC.faint, { align: 'right', ls: 1 });
  MH_CLIENTS.forEach(([n, ini, col, s0], i) => {
    const y = 176 + i * 122, sarah = n === 'Sarah K.';
    const sc = sarah ? (st.score ?? s0) : s0;
    if (sarah && (st.select ?? 0) > 0) uRect(350, y + 4, 620, 112, 14, st.score < 65 ? '#FFF5F5' : UIC.primarySoft, { alpha: st.select });
    if (sarah && st.score < 65) uRect(350, y + 4, 6, 112, 3, UIC.risk);
    uAvatar(410, y + 60, 30, ini, col);
    uText(n, 458, y + 54, 26, 600, UIC.text); uText(scoreLbl(sc), 458, y + 86, 20, 500, scoreCol(sc));
    uRing(920, y + 60, 30, sc, scoreCol(sc), { width: 7, fs: 0.62 });
    c.fillStyle = UIC.line; c.fillRect(372, y + 120, 576, 1);
  });
  // profile panel
  mhProfile(1004, 110, 556, 860, st);
  c.restore();
}
function mhProfile(x, y, w, h, st) {
  const c = ctx; c.save();
  uRect(x, y, w, h, 18, '#FFFFFF', { stroke: UIC.border, shadow: 10 });
  c.beginPath(); c.roundRect(x, y, w, h, 18); c.clip();
  c.translate(x, y - (st.scroll ?? 0));
  const sc = st.score ?? 84;
  uAvatar(64, 72, 36, 'SK', '#F97316');
  uText('Sarah K.', 116, 66, 32, 700, UIC.text); uText('Regular · visits every 4 weeks', 116, 98, 20, 400, UIC.muted);
  // health block
  uRect(24, 140, w - 48, 250, 16, scoreSoft(sc));
  uText('Customer Health', 52, 186, 22, 600, UIC.muted);
  uRing(118, 282, 58, sc, scoreCol(sc), { width: 12, fs: 0.66 });
  if (st.pulse > 0) { c.save(); c.globalAlpha *= st.pulse * 0.6; c.strokeStyle = UIC.risk; c.lineWidth = 3; c.beginPath(); c.arc(118, 282, 58 + 26 * (1 - st.pulse), 0, 7); c.stroke(); c.restore(); }
  const b = ease.back(clamp(st.badge ?? 0));
  if (b > 0) {
    c.save(); c.translate(206, 282); c.scale(b, b);
    uPill(0, 0, scoreLbl(sc), scoreCol(sc), '#FFFFFF', 26, { dot: true });
    c.restore();
  }
  // signals
  uText('Why', 24, 446, 22, 600, UIC.text);
  [['calendar', 'Canceled Thursday, 2:00 PM'], ['clock', 'Last visit 9 weeks ago'], ['user', 'Usually books every 4 weeks']].forEach(([ic, l], i) => {
    const yy = 486 + i * 62, a = clamp((st.why ?? 1) * 3 - i);
    c.save(); c.globalAlpha *= a;
    uRect(24, yy - 26, w - 48, 52, 12, '#F8FAFC');
    uIcon(ic, 54, yy, 24, UIC.muted, 2.2); uText(l, 84, yy + 8, 22, 500, UIC.text);
    c.restore();
  });
  // suggested step + composer
  const cy = 900;
  uText('Suggested next step', 24, cy, 22, 600, UIC.text);
  uRect(24, cy + 20, w - 48, 330, 16, '#FFFFFF', { stroke: UIC.border });
  uPill(44, cy + 60, 'SMS', UIC.primarySoft, UIC.primary, 18);
  uText('To Sarah K.', 120, cy + 67, 20, 500, UIC.muted);
  const msg = SMS_TEXT.join(' ');
  const typed = Math.floor(st.typed ?? msg.length);
  const lines = wrapText(msg.slice(0, typed), w - 96, 25, 500);
  lines.forEach((l, i) => uText(l, 48, cy + 124 + i * 36, 25, 500, UIC.text));
  uText('Personalized from Sarah’s visit history', 48, cy + 250, 18, 500, UIC.faint);
  const sent = clamp(st.sent ?? 0), press = st.press ?? 0;
  c.save(); c.translate(w - 44 - 105, cy + 300); c.scale(1 - press * 0.06, 1 - press * 0.06);
  uRect(-105, -28, 210, 56, 28, sent > 0 ? UIC.healthy : UIC.primary);
  uIcon(sent > 0 ? 'check' : 'send', -64, 0, 22, '#fff', 2.4);
  uText(sent > 0 ? 'Sent' : 'Send SMS', -40, 8, 22, 600, '#fff');
  c.restore();
  if (st.cursor) { // pointer
    const [px, py] = st.cursor;
    c.save(); c.translate(px, py); c.scale(1.6, 1.6);
    c.fillStyle = '#0F172A'; c.strokeStyle = '#FFFFFF'; c.lineWidth = 1.6; c.lineJoin = 'round';
    const a = new Path2D('M0 0 L0 17 L4.5 13 L7.5 20 L10 19 L7 12 L13 12 Z'); c.fill(a); c.stroke(a);
    c.restore();
  }
  c.restore();
}
function wrapText(str, maxW, size, weight) {
  const words = str.split(' '), out = []; let line = '';
  for (const wd of words) { const t = line ? line + ' ' + wd : wd; if (uW(t, size, weight) > maxW && line) { out.push(line); line = wd; } else line = t; }
  if (line) out.push(line); return out;
}

// ── desktop: MsgHealth home — the business at a glance (3 columns × 2 rows) ───
function mhHome(st) {
  const c = ctx; c.save();
  const on = (i) => !st.cols || st.cols.includes(i);
  if (st.shell !== false) mhShell('Client Health'); else { c.fillStyle = UIC.bg; c.fillRect(-2000, -2000, 6000, 6000); }
  if (on(0)) uText('Today', 340, 70, 34, 700, UIC.text);
  const col = (i) => 340 + i * 420, W3 = 400;
  // A1 · health overview
  if (on(0)) card(col(0), 110, W3, 420, 'Client Health', 'health', () => {
    [['Healthy', '128', UIC.healthy], ['Needs attention', '9', UIC.attention], ['At risk', '3', UIC.risk]].forEach(([l, n, cc], i) => {
      const y = 110 + i * 56; uRect(0, y - 30, W3 - 48, 48, 12, '#F8FAFC');
      c.fillStyle = cc; c.beginPath(); c.arc(22, y - 6, 7, 0, 7); c.fill();
      uText(l, 42, y + 2, 20, 500, UIC.text); uText(n, W3 - 64, y + 2, 22, 700, UIC.text, { align: 'right' });
    });
    uText('At risk now', 0, 300, 18, 600, UIC.muted);
    [['ML', '#0EA5E9', 'Marcus L.'], ['JP', '#A855F7', 'Jen P.']].forEach(([ini, cc, n], i) => {
      const y = 342 + i * 52; uAvatar(18, y, 16, ini, cc); uText(n, 44, y + 7, 19, 600, UIC.text);
      const a = clamp((st.a1 ?? 1) * 2 - i);
      if (a > 0) { c.save(); c.globalAlpha *= a; uPill(W3 - 50, y, 'Check-in sent', UIC.primarySoft, UIC.primary, 15, { align: 'right' }); c.restore(); }
    });
  });
  // A2 · inbox
  if (on(0)) card(col(0), 550, W3, 420, 'Inbox', 'inbox', () => {
    [['SK', '#F97316', 'Sarah K.', 'Actually, yes — I meant to…'], ['ML', '#0EA5E9', 'Marcus L.', 'Thanks! Can I do Friday?'], ['NW', '#EC4899', 'Nina W.', 'See you Saturday!']].forEach(([ini, cc, n, m], i) => {
      const y = 96 + i * 96; uAvatar(22, y, 22, ini, cc); uText(n, 58, y - 4, 20, 600, UIC.text); uText(m, 58, y + 22, 17, 400, UIC.muted);
      const a = clamp((st.a2 ?? 1) * 3 - i);
      if (a > 0) { c.save(); c.globalAlpha *= a; uPill(W3 - 50, y - 10, 'Replied', UIC.healthySoft, UIC.healthy, 14, { align: 'right' }); c.restore(); }
    });
  });
  // B1 · bookings
  if (on(1)) card(col(1), 110, W3, 420, 'Bookings · Thursday', 'calendar', () => {
    [['9:00', 'Alicia M.'], ['10:00', 'Sarah K.'], ['11:30', 'Marcus L.'], ['1:00', 'Tom R.'], ['2:30', 'Nina W.']].forEach(([tm, n], i) => {
      const y = 86 + i * 62, a = clamp((st.b1 ?? 1) * 5 - i);
      uText(tm, 0, y + 6, 18, 500, UIC.faint);
      c.save(); c.globalAlpha *= a; uRect(70, y - 22, W3 - 118, 46, 10, UIC.primarySoft); c.fillStyle = UIC.primary; c.fillRect(70, y - 22, 5, 46);
      uText(n, 88, y + 6, 19, 600, UIC.text); uIcon('check', W3 - 70, y, 18, UIC.healthy, 2.4); c.restore();
    });
  });
  // B2 · payments
  if (on(1)) card(col(1), 550, W3, 420, 'Payments', 'card', () => {
    [['Sarah K.', 'Cut & color', '$85'], ['Alicia M.', 'Blowout', '$45'], ['Tom R.', 'Cut', '$40']].forEach(([n, s2, amt], i) => {
      const y = 96 + i * 96; uText(n, 0, y - 4, 20, 600, UIC.text); uText(s2, 0, y + 22, 17, 400, UIC.muted);
      uText(amt, W3 - 150, y + 6, 20, 700, UIC.text, { align: 'right' });
      const a = clamp((st.b2 ?? 1) * 3 - i);
      if (a > 0) { c.save(); c.globalAlpha *= a; uPill(W3 - 50, y, 'Paid', UIC.healthySoft, UIC.healthy, 15, { align: 'right' }); c.restore(); }
    });
  });
  // C1 · reviews
  if (on(2)) card(col(2), 110, W3, 420, 'Reviews', 'star', () => {
    uRect(0, 60, W3 - 48, 64, 12, '#F8FAFC'); uIcon('send', 26, 92, 22, UIC.primary, 2.2);
    uText('Review request sent to Alicia M.', 50, 99, 17.5, 500, UIC.text);
    const a = clamp((st.c1 ?? 1));
    c.save(); c.globalAlpha *= a;
    uRect(0, 146, W3 - 48, 150, 12, '#FFFBEB');
    for (let i = 0; i < 5; i++) { const k = clamp(a * 5 - i); c.save(); c.translate(30 + i * 34, 186); c.scale(k, k); c.fillStyle = '#F59E0B'; c.fill(new Path2D('M0 -13 L3.8 -4.2 13 -3.4 6 2.6 8 12 0 7 -8 12 -6 2.6 -13 -3.4 -3.8 -4.2Z')); c.restore(); }
    uText('“Always the best cut in town.”', 18, 238, 18, 500, UIC.text); uText('Alicia M. · new review', 18, 270, 16, 400, UIC.muted);
    c.restore();
  });
  // C2 · reports
  if (on(2)) card(col(2), 550, W3, 420, 'Returning customers', 'chart', () => {
    const k = ease.out(clamp(st.c2 ?? 1));
    const pts = [0.35, 0.42, 0.4, 0.5, 0.58, 0.63, 0.72].map((v, i) => [i * (W3 - 60) / 6, 300 - v * 230 * (i === 6 ? lerp(0.85, 1, k) : 1)]);
    c.save(); c.strokeStyle = UIC.border; c.lineWidth = 1; for (let g = 0; g < 4; g++) { c.beginPath(); c.moveTo(0, 90 + g * 70); c.lineTo(W3 - 48, 90 + g * 70); c.stroke(); } c.restore();
    c.save(); c.beginPath(); c.rect(-4, 0, (W3 - 40) * k + 4, 320); c.clip();
    const gg = c.createLinearGradient(0, 80, 0, 300); gg.addColorStop(0, 'rgba(79,70,229,0.22)'); gg.addColorStop(1, 'rgba(79,70,229,0)');
    c.fillStyle = gg; c.beginPath(); c.moveTo(0, 300); pts.forEach(([x, y]) => c.lineTo(x, y)); c.lineTo(pts[6][0], 300); c.fill();
    c.strokeStyle = UIC.primary; c.lineWidth = 4; c.lineJoin = 'round'; c.beginPath(); pts.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y))); c.stroke();
    c.restore();
    ['Jan', 'Mar', 'May'].forEach((m, i) => uText(m, i * (W3 - 60) / 2, 336, 15, 500, UIC.faint, { align: i === 0 ? 'left' : i === 2 ? 'right' : 'center' }));
  });
  c.restore();
}
function card(x, y, w, h, title, icon, body) {
  const c = ctx; uRect(x, y, w, h, 18, '#FFFFFF', { stroke: UIC.border });
  uIcon(icon, x + 38, y + 44, 24, UIC.primary, 2.2); uText(title, x + 62, y + 52, 22, 700, UIC.text);
  c.save(); c.translate(x + 24, y + 30); body(); c.restore();
}

// Physical monitor with a desktop screen (16:10), centred at x,y, width w.
function monitor(x, y, w, drawScreen, o = {}) {
  const h = w * 0.625, b = w * 0.018;
  const c = ctx;
  cRect(x - w * 0.04, y + h / 2 + b, w * 0.08, w * 0.12, w * 0.01, '#2B2F38', { shadow: 10, jit: 0.1 }); // neck
  cRect(x - w * 0.16, y + h / 2 + b + w * 0.115, w * 0.32, w * 0.03, w * 0.012, '#2B2F38', { shadow: 12, jit: 0.1 });
  cRect(x - w / 2 - b, y - h / 2 - b, w + 2 * b, h + 2 * b, w * 0.014, '#15171D', { shadow: 18, jit: 0.1, gloss: 0.8 });
  c.save(); c.beginPath(); c.rect(x - w / 2, y - h / 2, w, h); c.clip();
  c.translate(x - w / 2, y - h / 2); c.scale(w / 1600, w / 1600);
  const z = CAMZ; CAMZ = z * (w / 1600);
  drawScreen();
  CAMZ = z;
  c.restore();
  if (o.glare !== false) { c.save(); c.globalCompositeOperation = 'screen'; const g = c.createLinearGradient(x - w / 2, y - h / 2, x + w / 2, y + h / 2); g.addColorStop(0, 'rgba(255,255,255,0.06)'); g.addColorStop(0.5, 'rgba(255,255,255,0)'); c.fillStyle = g; c.fillRect(x - w / 2, y - h / 2, w, h); c.restore(); }
}
