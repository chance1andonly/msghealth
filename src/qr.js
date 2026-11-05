// MsgHealth · "QR tank" · vertical social ad (1080 × 1920, 30 fps), built on src/kit.js.
// The idea is borrowed outright from the reference ad: soldiers plaster a tank in QR codes, enemy drones scan them,
// and the code takes the drones to a website. Here the website is a booking page, so the drones book a haircut
// for Thursday at ten and are busy all week. Then the pivot: customers like booking pages too (minus the drones).
// Features shown: online booking and appointment management (client booking page, one calendar), SMS reminders,
// and the inbox. End card: msghealth.net. Voiceover: assets/audio/qr/vo-NN.wav, timed by VO_AT in src/qr-vo.js.
'use strict';

const word = (l, k) => VO_AT[l] + VO_CLIPS[l].chunks[k][1]; // when a caption chunk is spoken
const T = {
  stick0: word(0, 1), stick1: VO_AT[1], stick2: VO_AT[1] + 0.9, drones: VO_AT[2], scanning: word(2, 1),
  code: VO_AT[3], link: word(3, 1), page: VO_AT[4], booked: VO_AT[5], pickTime: word(5, 1) - 0.25, confirm: word(5, 1) + 0.25,
  busy: VO_AT[6], cust: VO_AT[7], minus: VO_AT[8], noSign: VO_AT[8] + 0.5,
  brand: VO_AT[9], book: word(9, 1), anytime: word(9, 2), cal: VO_AT[10], remind: VO_AT[11], reply: word(12, 0) + 0.15, inbox: word(12, 1), full: VO_AT[13],
  end: VO_AT[14] - 0.1, url: VO_AT[14] + 0.1,
};
T.tap = T.end + 1.25;
const DURATION = +(T.tap + 1.0).toFixed(2);
window.CUES = T;
window.SFX = [];
const cue = (t, kind, gain) => window.SFX.push({ t, kind, gain });
window.MUSIC = { bpm: 104, root: 50, brandAt: T.brand, mood: 'sneaky' };

// ═════════════ the desert ═════════════
const SAND = '#d9773a';
let QRS = [];
function makeQRs() { // four offscreen QR-style stickers
  QRS = [0, 1, 2, 3, 4, 5].map((v) => {
    const c = document.createElement('canvas'); c.width = c.height = 108; const g = c.getContext('2d'), n = 9, m = 12;
    g.fillStyle = '#fff'; g.fillRect(0, 0, 108, 108); g.fillStyle = '#111';
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) { const corner = (x < 3 && y < 3) || (x > 5 && y < 3) || (x < 3 && y > 5); if (!corner && hash(v * 100 + y * 9 + x) > 0.5) g.fillRect(6 + x * m - 0, 6 + y * m, m, m); }
    [[0, 0], [6, 0], [0, 6]].forEach(([cx, cy]) => { g.fillRect(6 + cx * m, 6 + cy * m, 36, 36); g.fillStyle = '#fff'; g.fillRect(6 + cx * m + 6, 6 + cy * m + 6, 24, 24); g.fillStyle = '#111'; g.fillRect(6 + cx * m + 12, 6 + cy * m + 12, 12, 12); });
    return c;
  });
}
function desertBg(t, sky = ['#79c4ee', '#cfe9f7']) {
  ctx.fillStyle = vgrad(0, 1000, sky[0], sky[1]); ctx.fillRect(0, 0, W, 1000);
  cloud(120 + ((t * 8) % 1400) - 200, 260, 1.1, 'rgba(255,255,255,0.95)'); cloud(700 - ((t * 5) % 1200) + 300, 420, 0.8, 'rgba(255,255,255,0.9)');
  poly([[-20, 1010], [90, 800], [300, 800], [420, 1010]], '#c4612b'); poly([[300, 1010], [450, 720], [660, 720], [790, 1010]], '#b9561f'); poly([[620, 1010], [760, 840], [930, 840], [1100, 1010]], '#c96a34');
  poly([[120, 1010], [210, 900], [330, 900], [380, 1010]], '#d57a3f');
  ctx.fillStyle = SAND; ctx.fillRect(0, 1000, W, H - 1000);
  ctx.fillStyle = 'rgba(0,0,0,0.05)'; ctx.fillRect(0, 1000, W, 140); ctx.fillStyle = 'rgba(255,255,255,0.05)'; ctx.fillRect(0, 1500, W, 420);
  for (let i = 0; i < 9; i++) { const x = hash(i) * W, y = 1060 + hash(i + 9) * 800, s = 12 + y / 150; ctx.fillStyle = '#5a7a35'; poly([[x, y], [x - s, y - s * 2.2], [x + s * 0.2, y - s]], '#5a7a35'); poly([[x + 4, y], [x + s * 1.2, y - s * 2], [x + s * 0.3, y - s * 0.6]], '#6f9040'); }
}
// A tank with its feet at (0, 0), ~700 wide. stickers: how many of the QR codes are stuck on so far.
function tank(stickers, t) {
  fillRR(-330, -112, 660, 112, 56, '#4b4a42');
  for (let i = 0; i < 7; i++) { circle(-240 + i * 80, -56, 38, '#6e6d60'); circle(-240 + i * 80, -56, 13, '#34332c'); }
  poly([[-310, -112], [-250, -236], [280, -236], [345, -112]], '#d6b878'); poly([[-250, -236], [280, -236], [262, -216], [-232, -216]], '#e5ca8f');
  fillRR(-120, -350, 300, 120, 34, '#cfae6d'); fillRR(168, -304, 320, 36, 10, '#b89a5e'); fillRR(480, -312, 34, 52, 8, '#9c8147');
  const list = QSTICK; const n = Math.min(list.length, Math.floor(stickers));
  for (let i = 0; i < n; i++) {
    const q = list[i], k = clamp(stickers - i), s = q.s * ease.back(k);
    ctx.save(); ctx.translate(q.x, q.y); ctx.rotate(q.r); ctx.shadowColor = 'rgba(0,0,0,0.25)'; ctx.shadowBlur = 5; ctx.drawImage(QRS[q.v], -s / 2, -s / 2, s, s); ctx.restore();
  }
}
const QSTICK = (() => {
  const L = [], zones = [[-300, 320, -225, -125, 0.5], [-105, 165, -340, -235, 0.3], [185, 470, -300, -272, 0.1], [-320, 330, -105, -20, 0.1]];
  for (let i = 0; i < 90; i++) { const z = zones[i % 4 === 3 ? 3 : i % 4 === 2 ? 2 : i % 4], big = z === zones[2] ? 30 : 50 + hash(i + 40) * 22; L.push({ x: lerp(z[0], z[1], hash(i * 3 + 1)), y: lerp(z[2], z[3], hash(i * 3 + 2)), s: big, r: (hash(i + 7) - 0.5) * 0.5, v: i % 6 }); }
  return L;
})();
function soldier(x, y, h, t, arm) { person(x, y, h, 3, { skin: '#d9a27a', shirt: '#4d6b3f', pants: '#3f4d32', hat: '#3d5230', arm, wave: t, dir: 1 }); }
function drone(x, y, s, t, id = 0) {
  ctx.save(); ctx.translate(x, y + Math.sin(t * 3 + id) * 8 * s); ctx.scale(s, s); ctx.rotate(Math.sin(t * 2 + id) * 0.04);
  [-1, 1].forEach((d) => { line(0, 0, d * 120, -24, '#9aa1a8', 12); ellipse(d * 120, -34, 78, 8 + Math.abs(Math.sin(t * 40 + id + d)) * 4, 'rgba(60,70,80,0.45)'); circle(d * 120, -30, 10, '#4a5560'); });
  fillRR(-70, -28, 140, 60, 26, '#eef0f2'); fillRR(-70, 14, 140, 18, 9, '#cfd3d7');
  [-1, 1].forEach((d) => { fillRR(d * 62 - 17, 22, 34, 44, 8, '#d94b3d'); [0, 1, 2].forEach((k) => circle(d * 62, 30 + k * 11, 4, '#7a2a22')); });
  circle(0, 40, 22, '#1d2127'); circle(0, 40, 11, '#3c5f8a'); circle(-4, 36, 4, 'rgba(255,255,255,0.6)');
  ctx.restore();
}

function sceneDesert(t) { // 1 · soldiers stick codes on the tank
  desertBg(t);
  const z = 1.1 + 0.1 * ease.out(seg(t, 0, T.drones)), q = lerp(0, 22, ease.out(seg(t, T.stick0 - 0.1, T.stick1))) + lerp(0, 68, ease.inOut(seg(t, T.stick1, T.stick2 + 0.7)));
  xf(CX, 1250, z, 0, () => {
    ctx.fillStyle = 'rgba(0,0,0,0.18)'; ctx.beginPath(); ctx.ellipse(CX + 80, 1262, 400, 36, 0, 0, 7); ctx.fill();
    ctx.save(); ctx.translate(CX + 100, 1250); ctx.scale(0.86, 0.86); tank(q, t); ctx.restore();
    soldier(120, 1255, 330, t * 2, t > T.stick0 - 0.3 && t < T.drones ? 'wave' : 'down');
    // a second soldier arrives with more codes on "every inch"
    const k2 = ease.out(seg(t, T.stick1 - 0.5, T.stick1)); if (k2 > 0) soldier(lerp(-120, 990, k2), 1270, 290, t * 2, 'wave');
  });
}
function sceneDrones(t) { // 2 · enemy drones scan whatever they see
  desertBg(t);
  const k = ease.out(seg(t, T.drones - 0.1, T.drones + 0.9));
  ctx.save(); ctx.translate(CX + 160, 1330); ctx.scale(0.62, 0.62); tank(999, t); ctx.restore();
  const scan = seg(t, T.scanning - 0.2, T.scanning + 0.2) * (0.6 + 0.4 * Math.sin(t * 14));
  [[330, 560, 1.0, 0], [700, 430, 0.8, 1.7], [860, 700, 0.7, 3.1]].forEach(([x, y, s, id]) => {
    const dx = (1 - k) * (id % 2 ? 700 : -700);
    if (scan > 0) { ctx.save(); const g = ctx.createLinearGradient(0, y, 0, 1250); g.addColorStop(0, rgba('#5dff8f', 0.5 * scan)); g.addColorStop(1, rgba('#5dff8f', 0.08 * scan)); ctx.fillStyle = g; poly([[x + dx - 14, y + 40 * s], [x + dx + 14, y + 40 * s], [CX + 330 + id * 40, 1240], [CX - 160 - id * 20, 1240]], g); ctx.restore(); }
    drone(x + dx, y, s, t, id);
  });
}
// 3 · the drone's-eye view: a wall of QR codes, a lock-on, "Opening link…", then the booking page
function sceneCam(t) {
  ctx.fillStyle = '#6f6a4a'; ctx.fillRect(0, 0, W, H);
  const pan = Math.sin(t * 0.7) * 24, sc = 1 + 0.08 * seg(t, T.code, T.page);
  xf(CX, 760, sc, 0, () => { for (let r = -1; r < 6; r++) for (let c = -1; c < 5; c++) { const x = c * 270 + pan + (r % 2) * 40, y = r * 270 + 20; ctx.save(); ctx.translate(x + 135, y + 135); ctx.rotate((hash(r * 9 + c) - 0.5) * 0.3); ctx.drawImage(QRS[(r * 5 + c + 12) % 6], -105, -105, 210, 210); ctx.restore(); } });
  ctx.fillStyle = 'rgba(20,40,20,0.22)'; ctx.fillRect(0, 0, W, H);
  // HUD
  const gc = '#5dff8f', lock = ease.out(seg(t, T.code + 0.2, T.code + 0.7)), bx = CX, by = 760, bs = lerp(560, 300, lock);
  ctx.strokeStyle = gc; ctx.lineWidth = 6; ctx.lineCap = 'square';
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sy]) => { ctx.beginPath(); ctx.moveTo(bx + sx * bs / 2, by + sy * (bs / 2 - 60)); ctx.lineTo(bx + sx * bs / 2, by + sy * bs / 2); ctx.lineTo(bx + sx * (bs / 2 - 60), by + sy * bs / 2); ctx.stroke(); });
  const o = 'DRONE CAM 07', blink = Math.sin(t * 6) > 0;
  if (blink) circle(70, 90, 10, '#ff4d4d'); text('REC', 96, 91, 26, 800, gc, 'left', 0.1); text(o, W - 60, 91, 26, 800, gc, 'right', 0.12); if (t < T.page) text('ALT 42m', W - 60, 1180, 26, 800, gc, 'right', 0.12);
  if (t > T.code + 0.7) text('QR DETECTED', CX, by - bs / 2 - 36, 24, 800, gc, 'center', 0.2);
  // "Opening link…"
  const tk = ease.back(seg(t, T.link - 0.05, T.link + 0.3));
  if (tk > 0 && t < T.page + 0.05) xf(CX, 1000, tk, 0, () => { fillRR(110, 930, 860, 170, 22, 'rgba(6,16,8,0.92)'); strokeRR(110, 930, 860, 170, 22, gc, 3); text('Opening link…', 150, 985, 34, 600, gc, 'left'); text('https://msghealth.net/book', 150, 1050, 38, 700, '#fff', 'left', 0); });
  // the booking page takes over
  const pg = ease.out(seg(t, T.page - 0.05, T.page + 0.45));
  if (pg > 0) {
    ctx.save(); ctx.translate(0, (1 - pg) * 1500); ctx.fillStyle = '#f4f1ea'; fillRR(60, 200, 960, 1130, 40, '#f4f1ea');
    text('Sam\'s Studio', 110, 270, 40, 800, '#1e1b4b', 'left'); text('Book an appointment', 110, 330, 28, 500, '#6b6a80', 'left');
    fillRR(110, 380, 860, 110, 26, '#fff'); strokeRR(110, 380, 860, 110, 26, '#e3e0f7', 2); text('Haircut', 150, 420, 34, 700, '#1e1b4b', 'left'); text('30 min · $35', 150, 460, 24, 500, '#6b6a80', 'left'); circle(920, 435, 20, C.primary); check(920, 436, 18, '#fff', 4);
    text('Pick a time', 110, 560, 26, 700, '#6b6a80', 'left', 0.05);
    const slots = [['Wed', '2:00 PM'], ['Thu', '10:00 AM'], ['Fri', '4:30 PM']], pick = seg(t, T.pickTime, T.pickTime + 0.2);
    slots.forEach(([d, s], i) => { const y = 600 + i * 118, sel = i === 1 && pick > 0.5; fillRR(110, y, 860, 96, 24, sel ? C.primary : '#fff'); strokeRR(110, y, 860, 96, 24, sel ? C.primary : '#e3e0f7', 2); text(d, 150, y + 49, 32, 800, sel ? '#fff' : '#1e1b4b', 'left'); text(s, 930, y + 49, 32, 600, sel ? '#fff' : '#1e1b4b', 'right'); });
    const cf = seg(t, T.confirm, T.confirm + 0.25), done = t > T.confirm + 0.15;
    fillRR(110, 990, 860, 110, 55, done ? GREEN : C.primary); text(done ? 'Booked · Thu 10:00 AM' : 'Confirm booking', CX, 1047, 36, 800, '#fff', 'center');
    if (done) { const b = pop(t, T.confirm + 0.15, 0.35); xf(CX, 1200, b, 0, () => text('A reminder text is on its way', CX, 1200, 28, 600, '#6b6a80', 'center')); }
    ctx.restore();
  }
}
function sceneBusy(t) { // 4 · drones booked all week; the tank slinks away
  desertBg(t, ['#9fd6f2', '#e2f1f8']);
  const go = ease.in(seg(t, T.busy + 0.4, T.cust)); ctx.save(); ctx.translate(CX + 160 + go * 800, 1330); ctx.scale(0.62, 0.62); tank(999, t); ctx.restore();
  const k = pop(t, T.busy, 0.4); xf(CX, 820, k, 0, () => {
    fillRR(80, 380, 920, 640, 36, '#f4f1ea'); text('THIS WEEK', 130, 430, 24, 800, '#6b6a80', 'left', 0.2);
    ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].forEach((d, i) => {
      const x = 120 + i * 172, f = pop(t, T.busy + 0.15 + i * 0.12, 0.3); text(d, x + 70, 490, 28, 800, '#1e1b4b', 'center');
      for (let r = 0; r < 3; r++) { const a = clamp(f - r * 0.2) ; fillRR(x, 530 + r * 150, 140, 120, 18, '#e3e0f7'); if (a > 0) { xf(x + 70, 590 + r * 150, a, 0, () => { fillRR(x, 530 + r * 150, 140, 120, 18, [C.primary, '#d9468a', '#0ea5a4'][(i + r) % 3]); text('Haircut', x + 70, 575 + r * 150, 22, 800, '#fff', 'center'); text('Drone ' + (((i + r) % 3) + 1), x + 70, 610 + r * 150, 20, 600, 'rgba(255,255,255,0.85)', 'center'); }); } }
    });
  });
  [[200, 230, 0.7, 0], [540, 160, 0.9, 1.7], [880, 250, 0.7, 3.1]].forEach(([x, y, s, id]) => drone(x, y + (1 - k) * -400, s, t, id));
}
function sceneShop(t) { // 5 · "Your customers like booking pages too. Minus the drones."
  ctx.fillStyle = vgrad(0, 1200, '#bfe0f5', '#eaf5fb'); ctx.fillRect(0, 0, W, H); ctx.fillStyle = '#9aa7b0'; ctx.fillRect(0, 1380, W, 540); ctx.fillStyle = '#b8c3ca'; ctx.fillRect(0, 1380, W, 18);
  cloud(700, 220, 0.9);
  fillRR(120, 560, 840, 820, 14, '#f1d4ad'); ctx.fillStyle = '#e0bd8d'; ctx.fillRect(120, 1340, 840, 40);
  for (let i = 0; i < 10; i++) { poly([[110 + i * 86, 470], [196 + i * 86, 470], [186 + i * 86, 600], [100 + i * 86, 600]], i % 2 ? '#ffffff' : C.primary); } fillRR(110, 440, 860, 50, 10, '#3a3a52');
  text('SAM\'S STUDIO', CX, 466, 38, 800, '#fff', 'center', 0.12);
  fillRR(190, 690, 380, 520, 18, '#cfe7f3'); ctx.fillStyle = 'rgba(255,255,255,0.5)'; poly([[210, 700], [300, 700], [210, 860]], 'rgba(255,255,255,0.45)');
  fillRR(650, 700, 250, 640, 12, '#6b4a34'); fillRR(662, 712, 226, 616, 8, '#80583c'); circle(870, 1030, 12, '#e8c36a');
  const s = pop(t, T.cust + 0.2, 0.4); xf(775, 960, s, 0, () => { ctx.drawImage(QRS[2], 700, 880, 150, 150); });
  const sc = 0.5 + 0.5 * Math.sin(t * 9); if (t > T.cust + 0.8 && t < T.minus) { ctx.fillStyle = rgba('#5dff8f', 0.5 * sc); ctx.fillRect(700, 880 + ((t * 120) % 150), 150, 6); }
  person(430, 1420, 560, 9, { skin: '#c68a62', shirt: '#6c8ebf', arm: 'phone', dir: 1, bounce: t * 4, mouth: 'open' });
  const ok = pop(t, T.cust + 1.2, 0.35); xf(430, 800, ok, 0, () => { circle(430, 800, 52, GREEN); check(430, 802, 50, '#fff', 8); });
  // a drone shows up and gets the "no" sign
  const dk = ease.out(seg(t, T.minus - 0.3, T.minus + 0.3)); if (dk > 0) { drone(880 - (1 - dk) * 500, 300, 1.2, t, 2); const ns = pop(t, T.noSign, 0.25); xf(880, 340, ns, 0, () => { ring(880, 340, 150, RED, 22); line(880 - 106, 340 - 106, 880 + 106, 340 + 106, RED, 22); }); }
}

// ═════════════ the product ═════════════
function sceneBookingUI(t) {
  stage(t, 0.22);
  withFade(enter(t, T.book - 0.1, T.cal, 0.25), () => {
    eyebrow('ONLINE BOOKING', 300);
    const d = seg(t, T.book + 0.45, T.book + 0.7), s = seg(t, T.book + 1.0, T.book + 1.25), done = t > T.anytime + 0.25;
    phone(210, 340, 660, 1010, '#f4f1ea', () => {
      text('Sam\'s Studio', 40, 110, 36, 800, '#1e1b4b', 'left'); text('Book your visit', 40, 160, 26, 500, '#6b6a80', 'left');
      if (done) { const b = pop(t, T.anytime + 0.25, 0.4); xf(330, 520, b, 0, () => { circle(330, 460, 74, GREEN); check(330, 462, 66, '#fff', 11); text('You\'re booked', 330, 600, 44, 800, '#1e1b4b', 'center'); text('Thu · 10:00 AM · Haircut', 330, 656, 28, 600, '#6b6a80', 'center'); }); return; }
      ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].forEach((dd, i) => { const x = 40 + i * 118, sel = i === 3 && d > 0.5; fillRR(x, 230, 100, 120, 24, sel ? C.primary : '#fff'); strokeRR(x, 230, 100, 120, 24, sel ? C.primary : '#e3e0f7', 2); text(dd, x + 50, 272, 26, 800, sel ? '#fff' : '#6b6a80', 'center'); text(String(10 + i), x + 50, 318, 38, 800, sel ? '#fff' : '#1e1b4b', 'center'); });
      ['9:00', '10:00', '11:30', '1:00', '2:30', '4:00'].forEach((tm, i) => { const x = 40 + (i % 3) * 196, y = 410 + Math.floor(i / 3) * 112, sel = i === 1 && s > 0.5; fillRR(x, y, 180, 92, 24, sel ? C.primary : '#fff'); strokeRR(x, y, 180, 92, 24, sel ? C.primary : '#e3e0f7', 2); text(tm, x + 90, y + 47, 32, 700, sel ? '#fff' : '#1e1b4b', 'center'); });
      const cf = t > T.anytime - 0.1; fillRR(40, 700, 580, 100, 50, C.primary); text('Confirm booking', 330, 752, 34, 800, '#fff', 'center');
      if (cf) { fillRR(40, 700, 580, 100, 50, mix(C.primary, '#ffffff', 0.25)); }
      text('Open 24/7 · no phone call needed', 330, 880, 26, 500, '#6b6a80', 'center');
    });
  });
}
function sceneCal(t, from) {
  stage(t, 0.2);
  withFade(enter(t, from - 0.05, 1e9, 0.2), () => {
    eyebrow('BOOKINGS · THIS WEEK', 380);
    card(CARD.x - 20, 430, CARD.w + 40, 1010);
    ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].forEach((d, i) => text(d, CARD.x + 22 + i * 168 + 70, 490, 26, 800, SOFT, 'center'));
    let n = 0;
    for (let c = 0; c < 5; c++) for (let r = 0; r < 6; r++) {
      const x = CARD.x + 22 + c * 168, y = 540 + r * 142, idx = c * 6 + r, e = ease.back(seg(t, from + 0.1 + idx * 0.045, from + 0.4 + idx * 0.045));
      fillRR(x, y, 140, 122, 18, 'rgba(255,255,255,0.05)');
      const taken = hash(idx * 3 + 1) > 0.18 || (c + r) % 4 === 0;
      if (taken && e > 0) { n++; xf(x + 70, y + 61, clamp(e) || 0.01, 0, () => { fillRR(x, y, 140, 122, 18, NAMES[idx % 10][1]); text(NAMES[idx % 10][0], x + 70, y + 52, 26, 800, '#fff', 'center'); text(`${9 + r}:00`, x + 70, y + 88, 22, 600, 'rgba(255,255,255,0.8)', 'center'); }); }
    }
    const fl = seg(t, T.full, T.full + 0.3); if (fl > 0) { xf(CX, 320, ease.back(fl), 0, () => { const s = 'CALENDAR FULL', w = tw(s, 34, 800, 0.1) + 70; fillRR(CX - w / 2, 285, w, 70, 35, rgba(GREEN, 0.2)); strokeRR(CX - w / 2, 285, w, 70, 35, GREEN, 3); text(s, CX, 321, 34, 800, '#9ff0c0', 'center', 0.1); }); }
  });
}
function sceneInbox(t) {
  stage(t, 0.22);
  withFade(enter(t, T.remind - 0.05, T.full, 0.2), () => {
    eyebrow('REMINDERS · INBOX', 330);
    const ty = 380, th = 560; card(CARD.x, ty, CARD.w, th); avatar(CARD.x + 66, ty + 62, 30, 'JK', NAMES[0][1]); text('Jordan K.', CARD.x + 112, ty + 62, 30, 700, '#fff'); tag(CARD.x + CARD.w - 30, ty + 62, 'SMS', IN.mid, false, 20);
    ctx.fillStyle = 'rgba(255,255,255,0.07)'; ctx.fillRect(CARD.x + 30, ty + 108, CARD.w - 60, 2);
    const m1 = pop(t, T.remind + 0.1, 0.35), y1 = ty + 140 + (1 - clamp(m1)) * 26;
    const h1 = bubble(CARD.x + 40, y1, CARD.w - 80, ['Reminder: Thursday 10:00 AM,', 'haircut with Sam. See you then!'], true, clamp(m1));
    const lab = seg(t, T.remind + 0.5, T.remind + 0.8); withFade(lab, () => text('Sent automatically · Delivered', CARD.x + CARD.w - 40, y1 + h1 + 28, 21, 600, IN.mid, 'right'));
    const m2 = pop(t, T.reply, 0.3); bubble(CARD.x + 40, ty + 140 + h1 + 80 + (1 - clamp(m2)) * 26, CARD.w - 80, ['Confirmed, see you then!'], false, clamp(m2));
    // one inbox: every channel, every client
    const iy = 1010, ik = ease.out(seg(t, T.inbox - 0.1, T.inbox + 0.3));
    withFade(ik, () => {
      text('ONE INBOX', CX, iy, 22, 700, MUTED, 'center', 0.22); card(CARD.x, iy + 40, CARD.w, 360);
      [['Priya S.', 'Can I move to Friday?', 'EMAIL'], ['Marcus T.', 'Thanks, booked!', 'SMS'], ['Ava R.', 'Running 5 min late', 'SMS']].forEach(([n, m, ch], i) => {
        const y = iy + 100 + i * 112; if (i) { ctx.fillStyle = 'rgba(255,255,255,0.07)'; ctx.fillRect(CARD.x + 30, y - 48, CARD.w - 60, 2); }
        avatar(CARD.x + 68, y, 32, n.slice(0, 2).toUpperCase(), NAMES[i + 1][1]); text(n, CARD.x + 120, y - 14, 28, 700, '#fff'); text(m, CARD.x + 120, y + 22, 24, 500, SOFT); tag(CARD.x + CARD.w - 30, y, ch, ch === 'SMS' ? IN.mid : AMBER, false, 18);
      });
    });
  });
}

const SCENES = [
  [0, T.drones, sceneDesert], [T.drones, T.code, sceneDrones], [T.code, T.busy, sceneCam], [T.busy, T.cust, sceneBusy], [T.cust, T.brand, sceneShop],
  [T.brand, T.book, (t) => brandHit(t, T.brand, T.book)], [T.book, T.cal, sceneBookingUI], [T.cal, T.remind, (t) => sceneCal(t, T.cal)],
  [T.remind, T.full, sceneInbox], [T.full, T.end, (t) => sceneCal(t, T.cal)], [T.end, 999, (t) => endCard(t, T.end, T.tap, T.url)],
];
// sound cues
[T.stick0, T.stick0 + 0.5, T.stick1 + 0.1, T.stick1 + 0.4, T.stick1 + 0.7].forEach((t) => cue(t, 'tap', 0.5));
cue(T.drones, 'swoosh', 0.8); cue(T.scanning, 'transition', 0.6); cue(T.code + 0.7, 'ding', 0.7); cue(T.link, 'notification', 0.8); cue(T.page, 'swish', 0.9);
cue(T.pickTime, 'tap', 0.9); cue(T.confirm, 'key', 1); cue(T.confirm + 0.2, 'ding', 0.9); cue(T.busy, 'punch', 0.8); cue(T.cust, 'swoosh', 0.6); cue(T.cust + 1.2, 'ding', 0.7);
cue(T.noSign, 'punch', 0.9); cue(T.brand, 'transitionHit', 1); cue(T.book + 0.45, 'tap', 0.8); cue(T.book + 1.0, 'tap', 0.8); cue(T.anytime + 0.2, 'ding', 0.9);
cue(T.cal, 'swish', 0.8); [0, 1, 2, 3, 4].forEach((i) => cue(T.cal + 0.2 + i * 0.3, 'key', 0.5)); cue(T.remind + 0.05, 'notification', 0.9); cue(T.reply, 'notification', 0.9); cue(T.inbox, 'swish', 0.8);
cue(T.full + 0.1, 'ding', 1); cue(T.end, 'punch', 1); cue(T.tap, 'tap', 1.2);

boot({ duration: DURATION, scenes: SCENES, brandAt: T.brand, preload: async () => makeQRs(),
  hideCaption: (t, c) => t >= T.end - 0.1,
  after: (t) => { const f = 1 - seg(t, T.brand, T.brand + 0.12); if (t >= T.brand && f > 0) { ctx.fillStyle = rgba('#ffffff', 0.5 * f); ctx.fillRect(0, 0, W, H); } } }, 'qr');
