// MsgHealth · "The napkin" · story-hook vertical ad (1080 × 1920, 30 fps), built on src/kit.js.
// Real story, nudged: in 2010 a programmer paid 10,000 Bitcoin for two pizzas, ordered to his door by a forum stranger.
// (The napkin receipt and the dog are the made-up absurd part.) It plays as a "did you know" until the pivot to invoices:
// MsgHealth sends an invoice in seconds, takes card payments and tracks every payment. Then the 50%-off-first-month offer.
// Voiceover: assets/audio/btc/vo-NN.wav, timed by VO_AT in src/btc-vo.js.
'use strict';
const word = (l, k) => VO_AT[l] + VO_CLIPS[l].chunks[k][1];
const T = {
  coins: word(0, 2), pizzas: word(0, 3), first: VO_AT[1], door: VO_AT[2], recpt: VO_AT[3], nap: VO_AT[4], dog: VO_AT[5], fortune: word(6, 1), proof: word(6, 3),
  inv: VO_AT[7], real: word(7, 1), notNap: word(7, 2), brand: VO_AT[8], send: word(8, 1), secs: word(8, 2), pay: VO_AT[9], card: word(9, 1), tracked: word(9, 2), dogOut: VO_AT[10],
  offer: VO_AT[11], end: VO_AT[12] - 0.1, url: VO_AT[12] + 0.1,
};
T.tap = T.end + 1.25;
const DURATION = +(T.tap + 1.0).toFixed(2);
window.CUES = T; window.SFX = []; const cue = (t, kind, gain) => window.SFX.push({ t, kind, gain });
window.MUSIC = { bpm: 98, root: 50, brandAt: T.brand, mood: 'quirky' };

function shadow(x, y, rx) { ellipse(x, y, rx, rx * 0.11, 'rgba(0,0,0,0.22)'); }
function pizzaBox(x, y, w, h, lid = true) { // front-on box, bottom-centre at (x, y)
  fillRR(x - w / 2, y - h, w, h, 6, '#c9a46a'); fillRR(x - w / 2, y - h, w, h * 0.22, 6, '#dcb985');
  if (lid) { circle(x, y - h * 0.5, h * 0.2, '#e8d3a8'); circle(x, y - h * 0.5, h * 0.12, '#d9453a'); }
}
function coin(x, y, r, t = 0) { ellipse(x, y + r * 0.22, r, r * 0.38, '#b5791f'); ellipse(x, y, r, r * 0.38, '#f5b82e'); ellipse(x, y, r * 0.7, r * 0.24, '#ffd45e'); }
function pizzaTop(x, y, r, slices = 8, missing = 0) {
  circle(x, y, r, '#e3b05f'); circle(x, y, r * 0.9, '#d9453a'); circle(x, y, r * 0.84, '#f2c14e');
  for (let i = 0; i < 7; i++) circle(x + Math.cos(i * 2.1) * r * 0.5, y + Math.sin(i * 2.1) * r * 0.5, r * 0.1, '#b3261e');
  for (let i = 0; i < slices; i++) { const a = (i / slices) * 7; line(x, y, x + Math.cos(a) * r * 0.88, y + Math.sin(a) * r * 0.88, 'rgba(120,70,20,0.45)', 3); }
}

// 1 · the programmer at his desk, forum post on screen, coins piling up
function sceneDesk(t) {
  ctx.fillStyle = vgrad(0, 1300, '#22344a', '#31485f'); ctx.fillRect(0, 0, W, 1300);
  fillRR(90, 240, 250, 330, 10, '#0f1b2b'); fillRR(104, 254, 222, 302, 6, '#0b1220'); circle(240, 380, 44, '#f5ecc8'); circle(262, 370, 38, '#0b1220'); line(215, 254, 215, 556, '#31485f', 8); line(104, 405, 326, 405, '#31485f', 8); // window and moon
  ctx.fillStyle = '#1c2a3b'; ctx.fillRect(0, 1250, W, 670);
  person(250, 1620, 700, 6, { skin: '#d9a27a', shirt: '#4a6fa5', pants: '#2c3340', glasses: true, hair: '#2a1d17', noShadow: true, bounce: t * 2.5, mouth: t > T.pizzas ? 'open' : '' });
  // monitor on the desk
  fillRR(520, 800, 480, 330, 18, '#1b1f27'); fillRR(540, 820, 440, 290, 8, '#0f1722'); fillRR(740, 1130, 40, 120, 4, '#1b1f27'); fillRR(680, 1240, 160, 20, 8, '#1b1f27');
  text('BITCOIN FORUM', 560, 862, 28, 800, '#f7931a', 'left', 0.1);
  const k = seg(t, 0.8, 3.2); const full = 'Will pay 10,000 BTC for two pizzas.';
  text(full.slice(0, Math.floor(full.length * k)), 560, 930, 26, 600, '#e8ecf3', 'left');
  withFade(seg(t, T.pizzas - 0.1, T.pizzas + 0.2), () => { pizzaTop(640, 1030, 50); pizzaTop(780, 1030, 50); text('x2', 880, 1030, 52, 800, '#ffd980', 'left'); });
  ctx.fillStyle = '#7a5230'; ctx.fillRect(0, 1250, W, 40); ctx.fillStyle = '#5e3f24'; ctx.fillRect(0, 1290, W, 630); // desk top and front over his legs
  shadow(250, 1262, 260);
  const n = Math.min(10, Math.floor(seg(t, T.coins - 0.3, T.coins + 0.9) * 10)); for (let i = 0; i < n; i++) coin(430, 1250 - i * 22, 90); // coin stack on the desk
  const b = pop(t, T.coins, 0.35); if (b > 0) xf(430, 760, b, 0, () => { fillRR(260, 715, 340, 90, 45, '#f7931a'); text('10,000 BTC', 430, 761, 40, 800, '#1b1f27', 'center', 0); });
}
// 2 · "the first time anyone bought something real"
function sceneFirst(t) {
  ctx.fillStyle = vgrad(0, H, '#16324a', '#0e1c2b'); ctx.fillRect(0, 0, W, H);
  for (let i = 0; i < 30; i++) { const x = hash(i) * W, y = ((hash(i + 3) * 1500 + t * (60 + hash(i) * 80)) % 1500) + 100; ctx.save(); ctx.translate(x, y); ctx.rotate(t * 2 + i); fillRR(-8, -4, 16, 8, 2, ['#f7931a', '#ffd45e', '#e8ecf3', '#d9453a'][i % 4]); ctx.restore(); }
  const c = pop(t, T.first, 0.4); xf(CX, 560, c, 0, () => { fillRR(240, 330, 600, 440, 30, '#f6efe0'); fillRR(240, 330, 600, 110, 30, '#d9453a'); ctx.fillStyle = '#d9453a'; ctx.fillRect(240, 400, 600, 40); text('MAY', CX, 388, 56, 800, '#fff', 'center', 0.2); text('22', CX, 600, 220, 800, '#1b1f27', 'center', -0.05); text('2010', CX, 725, 52, 800, '#6b6a80', 'center', 0.1); });
  const s = pop(t, T.first + 0.6, 0.3); if (s > 0) xf(CX, 1000, s, 0, () => { ctx.save(); ctx.translate(CX, 1000); ctx.rotate(-0.05); const w = 760; fillRR(-w / 2, -90, w, 180, 20, '#f7931a'); text('FIRST REAL', 0, -26, 74, 800, '#1b1f27', 'center', 0.02); text('PURCHASE', 0, 46, 74, 800, '#1b1f27', 'center', 0.02); ctx.restore(); });
  const bx = pop(t, T.first + 1.1, 0.3); if (bx > 0) xf(CX, 1260, bx, 0, () => { shadow(CX, 1330, 330); pizzaBox(CX - 120, 1330, 230, 80); pizzaBox(CX + 120, 1330, 230, 80); });
}
// 3 · the delivery at the door (foreground: the delivery guy, boxes held in front of him)
function sceneDoor(t) {
  ctx.fillStyle = '#d9c3a0'; ctx.fillRect(0, 0, W, 1380); ctx.fillStyle = '#c9b18c'; for (let i = 0; i < 14; i++) ctx.fillRect(0, i * 100, W, 4);
  ctx.fillStyle = '#8c6e55'; ctx.fillRect(0, 1380, W, 540); ctx.fillStyle = '#76594a'; ctx.fillRect(0, 1380, W, 16);
  fillRR(100, 600, 380, 780, 10, '#5a3a28'); fillRR(124, 624, 332, 756, 6, '#241a14'); // open door and the dark hall
  fillRR(560, 800, 70, 70, 8, '#f6efe0'); text('42', 595, 836, 34, 800, '#1b1f27', 'center'); glow(290, 560, 160, '#ffd980', 0.5); circle(290, 570, 18, '#ffe9a8');
  const ds = ease.out(seg(t, T.door - 0.1, T.door + 0.5));
  person(290, 1380, 520, 14, { skin: '#c68a62', shirt: '#7f93a8', pants: '#3d424f', arm: 'wave', wave: t, mouth: 'open', hairStyle: 'none', noShadow: false });
  const dx = lerp(1300, 740, ds); person(dx, 1425, 560, 3, { skin: '#d9a27a', shirt: '#d9453a', pants: '#2c3340', hat: '#d9453a', dir: -1, bounce: t * 6 * (1 - ds * 0.9) });
  [0, 1].forEach((i) => pizzaBox(dx - 20, 1260 - i * 66, 270, 62)); // the boxes in his arms
  const b = pop(t, T.door + 0.8, 0.3); if (b > 0) xf(CX, 400, b, 0, () => { fillRR(190, 330, 700, 140, 30, '#fff'); text('"two pizzas, to this address"', CX, 402, 36, 700, '#1b1f27', 'center'); });
}
// 4 · the receipt: a napkin on a table
function sceneNapkin(t) {
  ctx.fillStyle = '#9a6b3f'; ctx.fillRect(0, 0, W, H); for (let i = 0; i < 12; i++) { ctx.fillStyle = 'rgba(0,0,0,0.10)'; ctx.fillRect(0, i * 170, W, 5); }
  fillRR(560, 1180, 420, 90, 12, '#c9a46a'); pizzaTop(780, 1330, 150); circle(180, 1420, 70, '#e8e2d2'); circle(180, 1420, 52, '#4a2a14'); // pizza and a cup (top-down)
  ctx.save(); ctx.translate(CX - 20, 800); ctx.rotate(-0.06); ctx.shadowColor = 'rgba(0,0,0,0.35)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 12;
  fillRR(-380, -330, 760, 660, 14, '#fbf8f0'); ctx.shadowBlur = 0; ctx.shadowOffsetY = 0; ctx.strokeStyle = 'rgba(0,0,0,0.06)'; ctx.lineWidth = 3; for (let i = 1; i < 5; i++) { ctx.beginPath(); ctx.moveTo(-380 + i * 152, -330); ctx.lineTo(-380 + i * 152, 330); ctx.stroke(); }
  if (t < T.nap) text('RECEIPT?', 0, 0, 84, 800, 'rgba(0,0,0,0.18)', 'center');
  const lines = ['RECEIPT', '2 pizzas =', '10,000 BTC', '(trust me)'], k = seg(t, T.nap + 0.2, T.nap + 2.3), total = lines.join('').length; let used = 0, pen = null;
  lines.forEach((s, i) => { const n = clamp(Math.floor(k * total - used), 0, s.length); used += s.length; if (n > 0) { text(s.slice(0, n), -300, -180 + i * 130, i === 0 ? 70 : 62, 800, '#243a8a', 'left', 0.02); pen = [-300 + tw(s.slice(0, n), 62, 800, 0.02), -180 + i * 130]; } });
  ctx.restore();
  if (pen && k < 1) { ctx.save(); ctx.translate(CX - 20, 800); ctx.rotate(-0.06); ctx.translate(pen[0] + 10, pen[1] + 10); ctx.rotate(0.7); fillRR(0, -10, 360, 20, 10, '#243a8a'); poly([[0, -10], [-40, 0], [0, 10]], '#222'); ctx.restore(); }
}
// 5 · a dog eats the napkin (foreground: the dog on the floor, napkin shrinking)
function sceneDog(t) {
  ctx.fillStyle = '#e9d6b4'; ctx.fillRect(0, 0, W, 1250); fillRR(0, 1010, W, 30, 0, '#c9b18c'); ctx.fillStyle = '#9a6b3f'; ctx.fillRect(0, 1250, W, 670); for (let i = 0; i < 6; i++) { ctx.fillStyle = 'rgba(0,0,0,0.12)'; ctx.fillRect(0, 1250 + i * 120, W, 4); }
  fillRR(100, 520, 260, 340, 10, '#c9b18c'); fillRR(116, 536, 228, 308, 6, '#8bb6d9'); // window
  const chew = Math.sin((t - T.dog) * 14), eat = seg(t, T.dog + 0.4, T.dog + 2.2), dx = 540, dy = 1790;
  shadow(dx, dy, 330);
  ctx.save(); ctx.translate(dx, dy);
  line(-190, -170, -250, -250 + Math.sin(t * 16) * 30, '#c8935a', 28); // tail wags
  [-150, -90, 90, 150].forEach((x, i) => fillRR(x - 20, -110, 40, 110, 14, i % 2 ? '#b57f48' : '#c8935a')); fillRR(-200, -230, 400, 160, 80, '#c8935a'); ellipse(0, -110, 130, 40, '#e6c291');
  const hy = -150 + (eat < 1 ? 70 + chew * 10 : 0); ctx.save(); ctx.translate(190, hy);
  circle(0, 0, 86, '#c8935a'); ellipse(80, 28, 70, 46, '#e6c291'); ellipse(130, 12, 20, 14, '#2a1d17'); circle(20, -22, 11, '#1b1410'); ellipse(-40, 20, 30, 70, '#8a5a2f', 0.3); ctx.restore();
  ctx.restore();
  const nw = 300 * (1 - eat); if (nw > 8) { ctx.save(); ctx.translate(800, 1850); ctx.rotate(0.1); fillRR(-nw / 2, -nw * 0.3, nw, nw * 0.6, 8, '#fbf8f0'); text('10,000', 0, 0, Math.max(10, nw * 0.12), 800, '#243a8a', 'center'); ctx.restore(); }
  for (let i = 0; i < 6; i++) { const e = seg(t, T.dog + 0.8 + i * 0.2, T.dog + 1.6 + i * 0.2); if (e > 0 && e < 1) circle(750 + i * 24, 1860 - e * 70 + e * e * 80, 7, '#fbf8f0'); }
  const b = pop(t, T.dog + 0.5, 0.3); if (b > 0 && t < T.dog + 2.4) xf(760, 1330, b, 0, () => { fillRR(640, 1280, 240, 80, 40, '#fff'); text('NOM', 760, 1322, 40, 800, '#1b1f27', 'center', 0.1); });
}
// 6 · "a fortune, and nobody can prove who paid what"
function sceneProof(t) {
  ctx.fillStyle = vgrad(0, 1500, '#16324a', '#2a4a66'); ctx.fillRect(0, 0, W, 1500); ctx.fillStyle = '#1d2f43'; ctx.fillRect(0, 1300, W, 620);
  const f = pop(t, T.fortune - 0.1, 0.5); glow(CX, 620, 600, '#ffd45e', 0.35 * clamp(f));
  xf(CX, 600, clamp(f), 0, () => { for (let i = 0; i < 12; i++) coin(CX - 300 + (i % 4) * 200 + (i > 7 ? 100 : 0), 760 - Math.floor(i / 4) * 60, 90); text('$$$', CX, 440, 190, 800, '#ffd45e', 'center', 0); pizzaBox(CX - 90, 880, 190, 60); pizzaBox(CX + 90, 880, 190, 60); });
  person(300, 1390, 520, 6, { skin: '#d9a27a', shirt: '#4a6fa5', pants: '#2c3340', glasses: true, dir: 1 }); person(780, 1390, 520, 14, { skin: '#c68a62', shirt: '#7f93a8', pants: '#3d424f', dir: -1, hairStyle: 'none' });
  [[300, 'programmer'], [780, 'stranger']].forEach(([x], i) => { const q = pop(t, T.proof + i * 0.25, 0.3); if (q > 0) xf(x, 900, q, 0, () => { fillRR(x - 90, 800, 180, 130, 30, '#fff'); text('?', x, 866, 100, 800, '#d9453a', 'center'); poly([[x - 20, 930], [x + 20, 930], [x, 962]], '#fff'); }); });
}
// ═════════════ the pivot and the product ═════════════
function sceneNotNapkin(t) {
  stage(t, 0.16);
  withFade(enter(t, T.inv - 0.05, T.brand, 0.2), () => {
    const nx = pop(t, T.inv, 0.35); xf(300, 860, clamp(nx), 0, () => { ctx.save(); ctx.translate(300, 860); ctx.rotate(-0.1); fillRR(-210, -250, 420, 500, 12, '#fbf8f0'); text('2 pizzas', 0, -40, 44, 800, '#243a8a', 'center'); text('10,000 BTC', 0, 40, 44, 800, '#243a8a', 'center'); text('(trust me)', 0, 120, 38, 700, '#243a8a', 'center'); ctx.restore(); });
    const x = pop(t, T.notNap, 0.25); if (x > 0) xf(300, 860, x, 0, () => { line(130, 650, 470, 1070, RED, 26); line(470, 650, 130, 1070, RED, 26); });
    const iv = ease.out(seg(t, T.real - 0.1, T.real + 0.5)); ctx.save(); ctx.translate((1 - iv) * 700, 0); ctx.globalAlpha = iv; card(560, 600, 420, 520, { r: 24 }); text('INVOICE', 590, 660, 24, 800, IN.mid, 'left', 0.2); text('#1042', 950, 660, 24, 700, MUTED, 'right'); ctx.fillStyle = 'rgba(255,255,255,0.1)'; ctx.fillRect(590, 690, 360, 2);
    [['Item', '$35.00'], ['Item', '$15.00']].forEach(([n, p], i) => { text(n, 590, 750 + i * 60, 28, 600, SOFT, 'left'); text(p, 950, 750 + i * 60, 28, 700, '#fff', 'right'); }); ctx.fillRect(590, 880, 360, 2); text('Total', 590, 940, 32, 700, '#fff', 'left'); text('$50.00', 950, 940, 40, 800, '#fff', 'right'); tag(950, 1040, 'DRAFT', MUTED, false, 18); ctx.restore();
  });
}
function invoiceCard(t, y, status, col) {
  card(CARD.x, y, CARD.w, 640); text('INVOICE #1042', CARD.x + 40, y + 60, 26, 800, IN.mid, 'left', 0.18); tag(CARD.x + CARD.w - 36, y + 60, status, col, status === 'PAID', 20);
  ctx.fillStyle = 'rgba(255,255,255,0.08)'; ctx.fillRect(CARD.x + 40, y + 100, CARD.w - 80, 2);
  avatar(CARD.x + 80, y + 170, 36, 'JK', NAMES[0][1]); text('Jordan K.', CARD.x + 136, y + 160, 32, 700, '#fff', 'left'); text('jordan@email.com', CARD.x + 136, y + 200, 24, 500, SOFT, 'left');
  [['Haircut', '$35.00'], ['Beard trim', '$15.00']].forEach(([n, p], i) => { text(n, CARD.x + 40, y + 290 + i * 66, 30, 600, SOFT, 'left'); text(p, CARD.x + CARD.w - 40, y + 290 + i * 66, 30, 700, '#fff', 'right'); });
  ctx.fillStyle = 'rgba(255,255,255,0.08)'; ctx.fillRect(CARD.x + 40, y + 430, CARD.w - 80, 2); text('Total', CARD.x + 40, y + 490, 36, 700, '#fff', 'left'); text('$50.00', CARD.x + CARD.w - 40, y + 490, 52, 800, '#fff', 'right');
}
function sceneInvoice(t) {
  stage(t, 0.22);
  withFade(enter(t, T.send - 0.1, T.pay, 0.2), () => {
    eyebrow('INVOICES', 330); const sent = t > T.secs - 0.1; invoiceCard(t, 380, sent ? 'SENT' : 'DRAFT', sent ? IN.mid : MUTED);
    const b = pop(t, T.send + 0.2, 0.35), s = pop(t, T.secs + 0.1, 0.3);
    if (b > 0 && !sent) xf(CX, 1090, b, 0, () => { fillRR(CARD.x + 40, 1060, CARD.w - 80, 100, 50, C.primary); text('Send invoice', CX, 1112, 36, 800, '#fff', 'center'); });
    if (s > 0) xf(CX, 1110, s, 0, () => { const lb = 'Sent in seconds', w = tw(lb, 34, 800) + 120; fillRR(CX - w / 2, 1060, w, 100, 50, rgba(IN.mid, 0.18)); strokeRR(CX - w / 2, 1060, w, 100, 50, IN.mid, 3); circle(CX - w / 2 + 56, 1110, 22, IN.mid); check(CX - w / 2 + 56, 1111, 22, '#fff', 4.5); text(lb, CX - w / 2 + 96, 1111, 34, 800, '#fff', 'left'); });
  });
}
function scenePay(t) {
  stage(t, 0.22);
  withFade(enter(t, T.pay - 0.05, T.offer, 0.2), () => {
    const paid = t > T.card + 0.1; eyebrow('PAYMENTS', 330); invoiceCard(t, 380, paid ? 'PAID' : 'SENT', paid ? GREEN : IN.mid);
    const k = pop(t, T.pay + 0.1, 0.35); if (k > 0 && !paid) xf(CX, 1110, k, 0, () => { fillRR(CARD.x + 40, 1060, CARD.w - 80, 100, 50, C.primary); text('Pay by card · $50.00', CX, 1112, 36, 800, '#fff', 'center'); });
    const pd = pop(t, T.card + 0.1, 0.35); if (pd > 0) xf(CX, 1110, pd, 0, () => { const lb = 'Paid · Card', w = tw(lb, 34, 800) + 120; fillRR(CX - w / 2, 1060, w, 100, 50, rgba(GREEN, 0.2)); strokeRR(CX - w / 2, 1060, w, 100, 50, GREEN, 3); circle(CX - w / 2 + 56, 1110, 22, GREEN); check(CX - w / 2 + 56, 1111, 22, '#fff', 4.5); text(lb, CX - w / 2 + 96, 1111, 34, 800, '#fff', 'left'); });
    const tr = ease.out(seg(t, T.tracked, T.tracked + 0.4)); withFade(tr, () => { text('EVERY PAYMENT, TRACKED', CX, 1230, 22, 700, MUTED, 'center', 0.22); card(CARD.x, 1260, CARD.w, 150); [['Jordan K.', '$50.00'], ['Priya S.', '$35.00']].forEach(([n, p], i) => { const y = 1300 + i * 70; text(n, CARD.x + 40, y, 28, 600, SOFT, 'left'); text(p, CARD.x + CARD.w - 150, y, 28, 700, '#fff', 'right'); tag(CARD.x + CARD.w - 36, y, 'PAID', GREEN, false, 16); }); });
    const dg = pop(t, T.dogOut + 0.1, 0.3); if (dg > 0) xf(940, 280, dg, 0, () => { const x = 940, y = 280; ellipse(x, y + 8, 46, 34, '#c8935a'); circle(x - 30, y - 18, 24, '#c8935a'); ellipse(x - 40, y - 8, 12, 20, '#8a5a2f'); circle(x - 34, y - 22, 4, '#1b1410'); ring(x, y, 78, RED, 12); line(x - 55, y - 55, x + 55, y + 55, RED, 12); });
  });
}
const SCENES = [[0, T.first, sceneDesk], [T.first, T.door, sceneFirst], [T.door, T.recpt, sceneDoor], [T.recpt, T.dog, sceneNapkin], [T.dog, T.fortune - 0.35, sceneDog], [T.fortune - 0.35, T.inv, sceneProof],
  [T.inv, T.brand, sceneNotNapkin], [T.brand, T.send, (t) => brandHit(t, T.brand, T.send)], [T.send, T.pay, sceneInvoice], [T.pay, T.offer, scenePay], [T.offer, T.end, (t) => offerCard(t, T.offer, T.end)], [T.end, 999, (t) => endCard(t, T.end, T.tap, T.url)]];
cue(T.coins, 'ding', 0.8); cue(T.pizzas, 'tap', 0.8); cue(T.first, 'punch', 0.9); cue(T.first + 0.6, 'swish', 0.8); cue(T.door, 'swoosh', 0.8); cue(T.door + 0.8, 'notification', 0.7); cue(T.recpt, 'swish', 0.6); cue(T.nap + 0.2, 'key', 0.7);
for (let i = 0; i < 4; i++) cue(T.nap + 0.4 + i * 0.5, 'key', 0.4); cue(T.dog + 0.4, 'punch', 0.8); cue(T.dog + 0.8, 'tap', 0.6); cue(T.dog + 1.2, 'tap', 0.6); cue(T.fortune - 0.1, 'ding', 1); cue(T.proof, 'notification', 0.8);
cue(T.inv, 'swish', 0.8); cue(T.real, 'swoosh', 0.9); cue(T.notNap, 'punch', 0.9); cue(T.brand, 'transitionHit', 1); cue(T.send + 0.2, 'tap', 0.9); cue(T.secs + 0.1, 'swish', 1); cue(T.pay + 0.1, 'swish', 0.7); cue(T.card + 0.1, 'ding', 1); cue(T.tracked, 'swish', 0.8); cue(T.dogOut + 0.1, 'punch', 0.9);
cue(T.offer, 'punch', 1); cue(T.offer + 0.7, 'ding', 0.9); cue(T.end, 'swish', 0.8); cue(T.tap, 'tap', 1.2);
boot({ duration: DURATION, scenes: SCENES, brandAt: T.brand, hideCaption: (t) => t >= T.end - 0.1,
  after: (t) => { const f = 1 - seg(t, T.brand, T.brand + 0.12); if (t >= T.brand && f > 0) { ctx.fillStyle = rgba('#ffffff', 0.5 * f); ctx.fillRect(0, 0, W, H); } } }, 'btc');
