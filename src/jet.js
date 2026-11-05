// MsgHealth · "Harrier" · vertical social ad (1080 × 1920, 30 fps), built on src/kit.js.
// Real story, nudged: in 1996 Pepsi's "Pepsi Stuff" ad offered a Harrier jet for 7,000,000 points, as a joke. A student
// noticed points could be bought for 10 cents each and mailed a $700,000 check. Pepsi said it was a joke; a judge agreed.
// (The "consolation prize: one point" is the made-up absurd part.) Pivot to loyalty: give regulars a reward they can
// actually get. Features shown: loyalty & retention (points, rewards, who's slipping, win-back text).
// Voiceover: assets/audio/jet/vo-NN.wav, timed by VO_AT in src/jet-vo.js.
'use strict';

const word = (l, k) => VO_AT[l] + VO_CLIPS[l].chunks[k][1];
const T = {
  ad: VO_AT[0], shirt: VO_AT[1], glasses: word(1, 1), jacket: word(1, 1) + 0.55, jet: VO_AT[2], mil: word(2, 1), joke: VO_AT[3],
  buy: VO_AT[4], cents: word(4, 2), check: VO_AT[5], sum: word(5, 2), court: VO_AT[6], gavel: word(6, 1), ruling: word(6, 2), prize: VO_AT[7], one: word(7, 1),
  regulars: VO_AT[8], haircut: VO_AT[9], notjet: word(9, 1), brand: VO_AT[10], visit: word(10, 1), point: word(10, 2), unlock: VO_AT[11], slip: VO_AT[12], slipping: word(12, 1), back: VO_AT[13],
  end: VO_AT[14] - 0.1, url: VO_AT[14] + 0.1,
};
T.tap = T.end + 1.25;
const DURATION = +(T.tap + 1.0).toFixed(2);
window.CUES = T;
window.SFX = [];
const cue = (t, kind, gain) => window.SFX.push({ t, kind, gain });
window.MUSIC = { bpm: 112, root: 53, brandAt: T.brand, mood: 'bouncy' };

const BLUE = '#1f5fbf', RED2 = '#e03a3e';
function can(x, y, s, rot = 0) { // a generic cola can (no real logo)
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  fillRR(-60, -110, 120, 220, 18, RED2); fillRR(-60, -30, 120, 60, 0, '#fff'); poly([[-60, -30], [60, -30], [60, 0], [-60, 30]], BLUE); fillRR(-60, -110, 120, 22, 10, '#c9d3e6'); fillRR(-60, 88, 120, 22, 10, '#c9d3e6');
  ctx.restore();
}
function jetShape(x, y, s, rot = 0) { // flat Harrier-ish silhouette, nose to the right
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  poly([[-170, 0], [-120, -22], [60, -24], [160, -4], [170, 6], [60, 22], [-120, 24]], '#6c7a86'); poly([[-170, 0], [-190, -70], [-140, -70], [-100, -20]], '#5a6772');
  poly([[-20, 8], [30, 8], [-30, 76], [-80, 76]], '#586470'); poly([[10, -22], [60, -22], [40, -50], [-10, -48]], '#9fd3f0'); circle(-60, 30, 9, '#e9833a');
  ctx.restore();
}
function roomBg() {
  ctx.fillStyle = '#e9c9a0'; ctx.fillRect(0, 0, W, 1300); ctx.fillStyle = '#d4b080'; ctx.fillRect(0, 1180, W, 120); ctx.fillStyle = '#7a5a40'; ctx.fillRect(0, 1300, W, 620);
  fillRR(80, 180, 150, 200, 6, '#f6e7cf'); fillRR(92, 192, 126, 176, 4, '#8bb6d9'); fillRR(860, 220, 140, 180, 6, '#f6e7cf'); fillRR(872, 232, 116, 156, 4, '#d98b8b');
}
function sceneTV(t) {
  roomBg();
  const sh = shake(t, T.jet + 0.7, 10) + shake(t, T.joke, 12);
  xf(CX, 800, 1, sh, () => {
    fillRR(110, 330, 860, 700, 36, '#2b2b34'); fillRR(140, 360, 800, 640, 18, '#2a6fd6');
    ctx.save(); rr(140, 360, 800, 640, 18); ctx.clip();
    ctx.fillStyle = vgrad(360, 1000, '#2a6fd6', '#183f87'); ctx.fillRect(140, 360, 800, 640);
    text('POINTS = PRIZES', CX, 425, 46, 800, '#fff', 'center', 0.04);
    can(220, 520 + Math.abs(Math.sin(t * 5)) * -14, 0.9, Math.sin(t * 3) * 0.1);
    const rows = [['T-SHIRT', '75', T.shirt], ['SUNGLASSES', '175', T.glasses], ['LEATHER JACKET', '1,450', T.jacket], ['HARRIER JET', '7,000,000', T.jet]];
    rows.forEach(([n, p, at], i) => {
      const e = pop(t, at, 0.3), y = 530 + i * 105; if (e <= 0) return;
      const jetRow = i === 3; xf(CX + 80, y, clamp(e), 0, () => { fillRR(330, y - 40, 570, 84, 14, jetRow ? '#fff7d6' : 'rgba(255,255,255,0.14)'); text(n, 356, y + 2, 30, 800, jetRow ? '#1b1b1f' : '#fff', 'left', 0.02); text(p + ' pts', 880, y + 2, 32, 800, jetRow ? RED2 : '#ffe08a', 'right', 0.0); });
    });
    const f = seg(t, T.jet + 0.2, T.mil + 1.2); if (f > 0 && f < 1) jetShape(lerp(-200, 1100, ease.in(f)), lerp(900, 480, ease.out(f)), 1.4, -0.2);
    ctx.restore();
  });
  // the student on the couch
  fillRR(150, 1120, 780, 220, 50, '#a2463a'); fillRR(120, 1230, 840, 150, 40, '#b85246');
  person(CX, 1290, 330, 5, { skin: '#d9a27a', shirt: '#e8e2d2', pants: '#3d4a6a', eyes: 'wide', mouth: t > T.jet ? 'open' : '', glasses: true, bounce: t * 3 });
  // "JUST A JOKE"
  const st = seg(t, T.joke, T.joke + 0.18); if (st > 0) { ctx.save(); ctx.translate(CX, 700); ctx.rotate(-0.12); const z = 1 + 0.9 * (1 - ease.out(st)); ctx.scale(z, z); ctx.globalAlpha = st; fillRR(-340, -90, 680, 180, 16, 'rgba(255,255,255,0.95)'); strokeRR(-340, -90, 680, 180, 16, RED2, 12); text('JUST A JOKE', 0, 4, 98, 800, RED2, 'center', 0.0); ctx.restore(); }
  [['HA!', 230, 1000, 0.15], ['HA HA', 800, 980, 0.3], ['HA!', 860, 1130, 0.45]].forEach(([s, x, y, d]) => { const k = pop(t, T.joke + d, 0.25); if (k > 0) xf(x, y, k, 0, () => { fillRR(x - 80, y - 36, 160, 72, 36, '#fff'); text(s, x, y + 3, 40, 800, '#1b1b1f', 'center'); }); });
}
function sceneCalc(t) {
  ctx.fillStyle = '#e9c9a0'; ctx.fillRect(0, 0, W, H); ctx.fillStyle = '#7a5a40'; ctx.fillRect(0, 1250, W, 670);
  const k = pop(t, T.buy, 0.4); xf(CX, 780, k, 0, () => {
    fillRR(170, 330, 740, 880, 50, '#2d2f3a'); fillRR(210, 380, 660, 200, 24, '#c8e6b9');
    const e1 = seg(t, T.buy + 0.4, T.buy + 0.7), e2 = seg(t, T.cents - 0.1, T.cents + 0.2), e3 = seg(t, T.cents + 0.5, T.cents + 0.9);
    text('1 POINT = 10¢', CX, 435, 44, 800, '#1b3a1b', 'center'); withFade(e1, () => text('7,000,000 × $0.10', CX, 495, 40, 700, '#2c5a2c', 'center'));
    withFade(e3, () => text('= $700,000', CX, 545, 46, 800, '#b3261e', 'center'));
    for (let i = 0; i < 16; i++) { const x = 230 + (i % 4) * 160, y = 640 + Math.floor(i / 4) * 130; fillRR(x, y, 140, 108, 22, i === 15 ? '#f08a24' : '#4a4d5c'); text(['7', '8', '9', '÷', '4', '5', '6', '×', '1', '2', '3', '−', '0', '.', '=', '+'][i], x + 70, y + 56, 46, 800, '#fff', 'center'); }
  });
  const ds = pop(t, T.buy + 0.2, 0.3); xf(150, 1500, ds, 0, () => person(210, 1760, 520, 5, { skin: '#d9a27a', shirt: '#e8e2d2', pants: '#3d4a6a', glasses: true, arm: 'up', wave: t, mouth: 'open' }));
}
function sceneCheck(t) {
  ctx.fillStyle = '#cfe6f5'; ctx.fillRect(0, 0, W, H); ctx.fillStyle = '#9cb08a'; ctx.fillRect(0, 1450, W, 470);
  const k = ease.out(seg(t, T.check, T.check + 0.4)), fly = ease.in(seg(t, T.sum + 0.6, T.court)), s = lerp(1, 0.25, fly);
  xf(CX, 760, s, 0, () => {
    ctx.save(); ctx.translate(0, (1 - k) * 600 - fly * 120); fillRR(110, 470, 860, 400, 18, '#fbf6e4'); strokeRR(110, 470, 860, 400, 18, '#c9bb8d', 4);
    text('PAY TO: THE SODA COMPANY', 160, 540, 34, 800, '#3a3a4a', 'left', 0.02); text('$ 700,000.00', 900, 650, 70, 800, '#1b1b1f', 'right', 0.0);
    text('seven hundred thousand dollars', 160, 750, 32, 500, '#5a5a6a', 'left'); ctx.strokeStyle = '#1b3a8a'; ctx.lineWidth = 5; ctx.beginPath(); const sg = seg(t, T.check + 0.5, T.sum); ctx.moveTo(620, 830); for (let i = 0; i <= 40 * sg; i++) ctx.lineTo(620 + i * 7, 830 - Math.sin(i * 0.8) * 24 * (1 - i / 60)); ctx.stroke();
    ctx.restore();
  });
  // the mailbox
  fillRR(740, 1280, 100, 200, 8, '#6b4a34'); fillRR(590, 1130, 400, 190, 60, '#2a6fd6'); fillRR(780, 1196, 160, 24, 12, '#0b1d3b'); fillRR(940, 1160, 20, 110, 4, RED2);
  withFade(seg(t, T.sum + 0.6, T.sum + 0.8), () => text('SENT', 790, 1090, 50, 800, '#1b1b1f', 'center', 0.1));
}
function sceneCourt(t) {
  ctx.fillStyle = '#6b4a34'; ctx.fillRect(0, 0, W, H); ctx.fillStyle = '#8a6244'; ctx.fillRect(0, 0, W, 900);
  for (let i = 0; i < 6; i++) fillRR(60 + i * 170, 120, 120, 620, 12, '#7a5438');
  fillRR(0, 1100, W, 820, 0, '#4a3324'); fillRR(100, 960, 880, 340, 24, '#5d4130'); fillRR(100, 960, 880, 40, 20, '#7a5538');
  person(CX, 1000, 560, 8, { skin: '#c68a62', shirt: '#14141c', pants: '#14141c', hair: '#e8e8ee', arm: 'up', wave: t * 0.2, mouth: 'open' });
  const g = seg(t, T.gavel - 0.15, T.gavel + 0.05); xf(790, 800, 1, 0, () => { ctx.save(); ctx.translate(760, 760); ctx.rotate(lerp(-0.7, 0.1, g)); fillRR(-12, -150, 24, 160, 8, '#c9a36a'); fillRR(-60, -190, 120, 56, 14, '#b88a4a'); ctx.restore(); });
  const sh = shake(t, T.gavel + 0.05, 16);
  xf(CX, 800, 1, sh, () => { const b = pop(t, T.ruling - 0.1, 0.3); xf(CX, 230, b, 0, () => { fillRR(130, 130, 820, 200, 36, '#fff'); text('"IT WAS A JOKE."', CX, 232, 66, 800, '#1b1b1f', 'center', 0.0); }); });
  const st = pop(t, T.ruling + 0.7, 0.25); if (st > 0) xf(CX, 1300, st, 0, () => { ctx.save(); ctx.translate(CX, 1290); ctx.rotate(-0.1); fillRR(-300, -80, 600, 160, 14, 'rgba(255,255,255,0.96)'); strokeRR(-300, -80, 600, 160, 14, RED2, 12); text('DENIED', 0, 4, 100, 800, RED2, 'center', 0.04); ctx.restore(); });
}
function sceneConsolation(t) {
  ctx.fillStyle = '#e9c9a0'; ctx.fillRect(0, 0, W, H); ctx.fillStyle = '#7a5a40'; ctx.fillRect(0, 1180, W, 740); ctx.fillStyle = '#6a4c35'; ctx.fillRect(0, 1180, W, 30);
  const o = pop(t, T.prize, 0.4); xf(CX, 1100, o, 0, () => { fillRR(210, 900, 660, 280, 18, '#f6efe0'); poly([[210, 900], [870, 900], [540, 1070]], '#e3d6b8'); });
  const c = pop(t, T.one - 0.2, 0.35); xf(CX, 760, c, 0, () => { fillRR(CX - 120, 640, 240, 150, 14, '#fff'); strokeRR(CX - 120, 640, 240, 150, 14, BLUE, 5); text('1', CX, 700, 70, 800, BLUE, 'center'); text('POINT', CX, 760, 28, 800, BLUE, 'center', 0.2); });
  person(CX, 1900, 640, 5, { skin: '#d9a27a', shirt: '#e8e2d2', pants: '#3d4a6a', glasses: true, bounce: t * 2 });
  withFade(seg(t, T.one + 0.3, T.one + 0.6), () => text('(one jet, sold separately)', CX, 560, 32, 600, '#6a4c35', 'center'));
}
function sceneCard(t) {
  ctx.fillStyle = vgrad(0, H, '#f3e7d3', '#e3cfae'); ctx.fillRect(0, 0, W, H);
  const k = pop(t, T.regulars, 0.4); xf(CX, 760, k, 0, () => {
    ctx.save(); ctx.translate(CX, 760); ctx.rotate(-0.03); fillRR(-400, -330, 800, 660, 30, '#fffaf0'); strokeRR(-400, -330, 800, 660, 30, '#d9c7a0', 4);
    text('SAM\'S STUDIO', 0, -260, 50, 800, '#1e1b4b', 'center', 0.1); text('REGULAR CARD', 0, -205, 26, 700, '#8a8066', 'center', 0.3);
    for (let i = 0; i < 10; i++) { const x = -300 + (i % 5) * 150, y = -80 + Math.floor(i / 5) * 160, st = pop(t, T.regulars + 0.5 + i * 0.12, 0.25); circle(x + 0, y, 54, '#efe5cf'); ring(x, y, 54, '#d9c7a0', 4); if (st > 0) xf(x, y, st, 0, () => { circle(x, y, 44, C.primary); check(x, y + 2, 40, '#fff', 8); }); }
    const fl = pop(t, T.haircut, 0.35); xf(0, 250, fl, 0, () => { fillRR(-300, 215, 600, 90, 45, GREEN); text('FREE HAIRCUT', 0, 262, 48, 800, '#fff', 'center', 0.05); });
    ctx.restore();
  });
  const j = pop(t, T.notjet - 0.1, 0.3); if (j > 0) xf(CX, 1260, j, 0, () => { jetShape(CX, 1250, 1.3); ring(CX, 1250, 150, RED, 18); line(CX - 106, 1144, CX + 106, 1356, RED, 18); });
}

// ═════════════ the product ═════════════
function sceneLoyalty(t) {
  stage(t, 0.22);
  withFade(enter(t, T.visit - 0.1, T.slip, 0.25), () => {
    eyebrow('LOYALTY & RETENTION', 330); card(CARD.x, 380, CARD.w, 1000); 
    avatar(CARD.x + 76, 470, 40, 'JK', C.primary); text('Jordan K.', CARD.x + 140, 456, 36, 700, '#fff'); text('Regular · since 2023', CARD.x + 140, 500, 24, 500, SOFT);
    const v = seg(t, T.visit + 0.3, T.visit + 0.8), pts = Math.round(lerp(80, 100, ease.out(seg(t, T.point - 0.1, T.point + 0.7)))), full = pts >= 100;
    const cx = CX, cy = 800, r = 170; ctx.lineWidth = 26; ctx.lineCap = 'round'; ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.stroke();
    ctx.strokeStyle = full ? GREEN : C.primary; ctx.beginPath(); ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (pts / 100) * ease.out(v)); ctx.stroke();
    text(String(Math.round(pts * ease.out(v))), cx, cy - 10, 110, 800, '#fff', 'center', -0.03); text('POINTS', cx, cy + 70, 24, 800, MUTED, 'center', 0.25);
    [['Visit · Haircut', '+10'], ['Referral · Priya', '+25'], ['Birthday bonus', '+15']].forEach(([n, p], i) => { const y = 1100 + i * 80, e = ease.out(seg(t, T.visit + 0.6 + i * 0.25, T.visit + 0.9 + i * 0.25)); withFade(e, () => { ctx.fillStyle = 'rgba(255,255,255,0.07)'; ctx.fillRect(CARD.x + 40, y - 40, CARD.w - 80, 2); text(n, CARD.x + 50, y, 28, 600, SOFT, 'left'); text(p + ' pts', CARD.x + CARD.w - 50, y, 30, 800, '#9ff0c0', 'right'); }); });
    const u = pop(t, T.unlock, 0.35); if (u > 0) xf(CX, 1300, u, 0, () => { const s = 'Reward unlocked · Free haircut', w = tw(s, 34, 800) + 120; fillRR(CX - w / 2, 1285, w, 100, 50, rgba(GREEN, 0.2)); strokeRR(CX - w / 2, 1285, w, 100, 50, GREEN, 3); circle(CX - w / 2 + 56, 1335, 22, GREEN); check(CX - w / 2 + 56, 1336, 22, '#fff', 4.5); text(s, CX - w / 2 + 96, 1336, 34, 800, '#fff', 'left'); });
  });
}
function sceneSlip(t) {
  stage(t, 0.2);
  withFade(enter(t, T.slip - 0.05, T.end, 0.2), () => {
    eyebrow('WHO\'S SLIPPING', 330); card(CARD.x, 380, CARD.w, 560);
    [['Ava R.', '9 visits', 'Healthy', GREEN, 0], ['Marcus T.', '7 visits', 'Healthy', GREEN, 1], ['Priya S.', '2 visits', 'At risk', RED, 2]].forEach(([n, v, st, col, i]) => {
      const y = 470 + i * 160, e = ease.out(seg(t, T.slip + i * 0.12, T.slip + 0.4 + i * 0.12)); const prs = i === 2, back = t > T.back + 0.5, c2 = prs && back ? GREEN : col;
      withFade(e, () => { if (i) { ctx.fillStyle = 'rgba(255,255,255,0.07)'; ctx.fillRect(CARD.x + 30, y - 80, CARD.w - 60, 2); } if (prs) { const pl = 0.5 + 0.5 * Math.sin(t * 9); fillRR(CARD.x + 12, y - 70, CARD.w - 24, 140, 18, rgba(c2, 0.09)); strokeRR(CARD.x + 12, y - 70, CARD.w - 24, 140, 18, rgba(c2, back ? 0.5 : 0.5 + 0.3 * pl), 3); }
        avatar(CARD.x + 72, y, 36, n.slice(0, 2).toUpperCase(), NAMES[i + 1][1]); text(n, CARD.x + 128, y - 16, 32, 700, '#fff'); text(prs && back ? '6 visits' : v, CARD.x + 128, y + 24, 24, 500, SOFT); tag(CARD.x + CARD.w - 36, y, prs && back ? 'BACK' : st.toUpperCase(), c2, true, 20); });
    });
    const m = pop(t, T.slipping + 0.5, 0.35), m2 = pop(t, T.back, 0.35);
    withFade(clamp(m), () => { text('AUTOMATIC WIN-BACK · SMS', CX, 1000, 22, 700, MUTED, 'center', 0.2); bubble(CARD.x + 40, 1040 + (1 - clamp(m)) * 26, CARD.w - 80, ['Hi Priya, we miss you! Double points', 'on your next visit this week.'], true, clamp(m)); });
    withFade(clamp(m2), () => bubble(CARD.x + 40, 1230 + (1 - clamp(m2)) * 26, CARD.w - 80, ['Booking Thursday!'], false, clamp(m2)));
  });
}

const SCENES = [
  [0, T.buy, sceneTV], [T.buy, T.check, sceneCalc], [T.check, T.court, sceneCheck], [T.court, T.prize, sceneCourt], [T.prize, T.regulars, sceneConsolation], [T.regulars, T.brand, sceneCard],
  [T.brand, T.visit, (t) => brandHit(t, T.brand, T.visit)], [T.visit, T.slip, sceneLoyalty], [T.slip, T.end, sceneSlip], [T.end, 999, (t) => endCard(t, T.end, T.tap, T.url)],
];
cue(T.ad, 'swish', 0.6); cue(T.shirt, 'key', 0.7); cue(T.glasses, 'key', 0.7); cue(T.jacket, 'key', 0.7); cue(T.jet, 'punch', 0.9); cue(T.jet + 0.2, 'swoosh', 0.9); cue(T.joke, 'punch', 1);
cue(T.buy, 'swish', 0.7); cue(T.cents, 'key', 0.8); cue(T.cents + 0.5, 'ding', 0.9); cue(T.check, 'swoosh', 0.8); cue(T.sum + 0.6, 'swoosh', 0.8);
cue(T.gavel, 'punch', 1); cue(T.ruling + 0.7, 'punch', 0.9); cue(T.prize, 'swish', 0.7); cue(T.one, 'notification', 0.8); cue(T.regulars, 'swish', 0.7);
for (let i = 0; i < 10; i++) cue(T.regulars + 0.5 + i * 0.12, 'tap', 0.45);
cue(T.haircut, 'ding', 0.9); cue(T.notjet, 'punch', 0.8); cue(T.brand, 'transitionHit', 1); cue(T.visit + 0.3, 'swish', 0.7); cue(T.point + 0.6, 'ding', 0.8); cue(T.unlock, 'notification', 0.9);
cue(T.slip, 'swish', 0.8); cue(T.slipping + 0.5, 'notification', 0.9); cue(T.back, 'notification', 0.9); cue(T.end, 'punch', 1); cue(T.tap, 'tap', 1.2);

boot({ duration: DURATION, scenes: SCENES, brandAt: T.brand, hideCaption: (t) => t >= T.end - 0.1,
  after: (t) => { const f = 1 - seg(t, T.brand, T.brand + 0.12); if (t >= T.brand && f > 0) { ctx.fillStyle = rgba('#ffffff', 0.5 * f); ctx.fillRect(0, 0, W, H); } } }, 'jet');
