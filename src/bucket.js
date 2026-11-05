// MsgHealth · "The bucket" · story-hook vertical ad (1080 × 1920, 30 fps), built on src/kit.js.
// Real story, nudged: in 1325 Modena and Bologna fought a war over a wooden bucket stolen from a well; Modena won and still
// keeps the bucket in its tower. (Bologna "messaging" and Modena leaving it "on read" for 700 years is the absurd part.)
// Pivot: your customers message you too; MsgHealth puts every text and email in one inbox so nothing is left on read, and
// you can reply in seconds. Then the 50%-off-first-month offer. Voiceover: assets/audio/bucket/vo-NN.wav (src/bucket-vo.js).
'use strict';
const word = (l, k) => VO_AT[l] + VO_CLIPS[l].chunks[k][1];
const T = {
  bucket: word(0, 2), stole: VO_AT[1], well: word(1, 2), asked: VO_AT[2], no: word(2, 1), fought: VO_AT[3], won: word(3, 1), still: VO_AT[4], tower: word(4, 1), msg: VO_AT[5], read: word(5, 1),
  years: VO_AT[6], cust: VO_AT[7], wait: word(7, 1), brand: VO_AT[8], inbox: word(8, 1), left: VO_AT[9], reply: VO_AT[10], offer: VO_AT[11], end: VO_AT[12] - 0.1, url: VO_AT[12] + 0.1,
};
T.cta = T.end + 1.25;
const DURATION = +(T.cta + 1.0).toFixed(2);
window.CUES = T; window.SFX = []; const cue = (t, kind, gain) => window.SFX.push({ t, kind, gain });
window.MUSIC = { bpm: 104, root: 48, brandAt: T.brand, mood: 'quirky' };

function shadow(x, y, rx) { ellipse(x, y, rx, rx * 0.12, 'rgba(30,40,20,0.28)'); }
const GR = 1000; // the ground line of the countryside scenes
function bucketShape(x, y, s) { // wooden bucket, bottom-centre at (x, y)
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.strokeStyle = '#6b4a34'; ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(0, -300, 130, Math.PI, 0); ctx.stroke();
  poly([[-150, -300], [150, -300], [120, 0], [-120, 0]], '#a8743f'); for (let i = -2; i <= 2; i++) line(i * 52, -300, i * 40, 0, 'rgba(0,0,0,0.15)', 4);
  [-230, -90].forEach((yy) => { const w = 150 - (-yy - 0) * 0.1; poly([[-w - 4, yy - 12], [w + 4, yy - 12], [w + 2, yy + 10], [-w - 2, yy + 10]], '#5b5f6a'); });
  ellipse(0, -300, 150, 26, '#7a5230'); ellipse(0, -300, 128, 18, '#3d2a1a');
  ctx.restore();
}
function country(t) {
  ctx.fillStyle = vgrad(0, GR, '#bfe0f5', '#f6ecd2'); ctx.fillRect(0, 0, W, GR); cloud(620, 220, 0.9, 'rgba(255,255,255,0.92)');
  // Modena (left): sandstone walls and the Ghirlandina; Bologna (right): brick with its tall leaning towers
  fillRR(-20, 640, 470, 360, 4, '#d4a373'); for (let i = 0; i < 9; i++) fillRR(-10 + i * 54, 620, 34, 36, 2, '#d4a373'); fillRR(260, 380, 110, 300, 4, '#c98f5a'); poly([[250, 380], [315, 250], [380, 380]], '#a0522d'); fillRR(110, 520, 90, 160, 4, '#c98f5a'); poly([[100, 520], [155, 440], [210, 520]], '#a0522d'); fillRR(60, 760, 70, 110, 35, '#6b4a34');
  fillRR(560, 700, 500, 300, 4, '#b5654a'); for (let i = 0; i < 9; i++) fillRR(570 + i * 54, 680, 34, 36, 2, '#b5654a'); fillRR(640, 300, 90, 400, 4, '#9a4e38'); poly([[630, 300], [685, 220], [740, 300]], '#6b3a28'); fillRR(860, 480, 100, 220, 4, '#9a4e38'); fillRR(780, 780, 70, 110, 35, '#4a2a1c');
  ctx.fillStyle = '#7fae5a'; ctx.fillRect(0, GR, W, H - GR); ctx.fillStyle = 'rgba(0,0,0,0.06)'; ctx.fillRect(0, GR, W, 100); ctx.fillStyle = 'rgba(255,255,255,0.05)'; ctx.fillRect(0, 1560, W, 360);
  poly([[440, GR], [640, GR], [1000, H], [100, H]], 'rgba(200,170,120,0.55)');
}
function flag(x, y, col, t) { line(x, y, x, y - 150, '#6b4a34', 8); poly([[x, y - 150], [x + 90 + Math.sin(t * 6) * 8, y - 128], [x, y - 100]], col); }
function sceneBucket(t) {
  country(t); text('1325', CX, 220, 150, 800, 'rgba(60,40,20,0.85)', 'center', -0.02);
  withFade(seg(t, 0.4, 0.8), () => { text('MODENA', 200, 960, 34, 800, '#fff', 'center', 0.15); text('BOLOGNA', 810, 960, 34, 800, '#fff', 'center', 0.15); });
  const b = pop(t, T.bucket, 0.45); shadow(CX, 1560, 220 * clamp(b)); xf(CX, 1550, clamp(b), 0, () => bucketShape(CX, 1550, 1.15));
}
function well(x, y, s) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); shadow(0, 0, 190); fillRR(-150, -170, 300, 170, 10, '#a8a29a'); for (let i = 0; i < 3; i++) line(-150, -130 + i * 45, 150, -130 + i * 45, 'rgba(0,0,0,0.12)', 3); ellipse(0, -170, 150, 34, '#8a847c'); ellipse(0, -170, 124, 24, '#1b1f27'); fillRR(-170, -430, 24, 270, 4, '#6b4a34'); fillRR(146, -430, 24, 270, 4, '#6b4a34'); poly([[-210, -430], [0, -520], [210, -430]], '#a0522d'); line(0, -440, 0, -250, '#6b4a34', 6); ctx.restore(); }
function sceneThief(t) {
  country(t); const k = seg(t, T.stole, T.well + 1.2); well(760, 1250, 1.0);
  const taken = k > 0.4; if (!taken) { ctx.save(); ctx.translate(760, 1250 - 170 * 1.0); bucketShape(0, 0 + 90, 0.28); ctx.restore(); }
  const x = lerp(1250, 120, ease.inOut(clamp((k - 0.15) / 0.85))), y = 1500; shadow(x, y, 120);
  person(x, y, 460, 61, { skin: '#d9a27a', shirt: '#2a4a8a', pants: '#2c3340', hat: '#7a7a82', dir: -1, bounce: t * 7, noShadow: true });
  if (taken) bucketShape(x - 460 * 0.174 * 1.0, y - 460 * 0.41 + 160 * 0.5, 0.5);
  const q = pop(t, T.well, 0.3); if (q > 0 && t < T.asked) xf(CX, 560, q, 0, () => { fillRR(210, 480, 660, 150, 40, '#fff'); text('shh. tiptoe.', CX, 556, 70, 800, '#1b1f27', 'center'); });
}
function sceneNo(t) {
  country(t); shadow(300, 1500, 130); shadow(780, 1500, 130);
  person(300, 1500, 520, 33, { skin: '#d9a27a', shirt: '#b5654a', pants: '#3d2a1c', dir: 1, arm: 'up', wave: t, mouth: 'open' }); fillRR(350, 960, 120, 160, 6, '#f6efe0'); // the scroll in Bologna's messenger's hand
  person(780, 1500, 520, 14, { skin: '#c68a62', shirt: '#2a4a8a', pants: '#2c3340', hat: '#7a7a82', dir: -1, hairStyle: 'none' });
  const a = pop(t, T.asked, 0.3), b = pop(t, T.no - 0.05, 0.25);
  if (a > 0) xf(300, 780, a, 0, () => { fillRR(60, 680, 480, 200, 36, '#fff'); text('"Bucket back,', 300, 740, 44, 800, '#1b1f27', 'center'); text('please?"', 300, 810, 44, 800, '#1b1f27', 'center'); });
  if (b > 0) xf(780, 760, b, 0, () => { fillRR(600, 690, 400, 200, 36, '#fff'); text('NO.', 800, 800, 120, 800, '#b3261e', 'center'); });
}
function sceneBattle(t) {
  country(t);
  const k = ease.inOut(seg(t, T.fought - 0.2, T.fought + 1.3)), won = seg(t, T.won, T.won + 0.8);
  for (let row = 0; row < 3; row++) for (let i = 0; i < 9; i++) {
    const y = 1260 + row * 130, side = 1, h = 220 + row * 36; const lx = lerp(-100, 270, k) - i * 0 + (i % 3) * 60 - row * 50 + (i * 28), rx = lerp(1180, 810 + won * 220, k) - (i % 3) * 60 + row * 50 - i * 28;
    const bx = Math.max(60, Math.min(500, 60 + i * 52 + row * 24)) + (k * 160), bx2 = Math.min(1020, 1020 - i * 52 - row * 24 - (k * 160) + won * 230);
    shadow(bx, y, h * 0.3); person(bx, y, h, 100 + i + row * 10, { skin: '#d9a27a', shirt: '#2a4a8a', pants: '#2c3340', hat: '#7a7a82', dir: 1, arm: 'up', wave: t + i, bounce: t * 8 + i, noShadow: true, mouth: 'open' }); line(bx + h * 0.26, y - h * 1.0, bx + h * 0.26, y - h * 1.5, '#6b4a34', 6);
    shadow(bx2, y, h * 0.3); person(bx2, y, h, 200 + i + row * 10, { skin: '#c68a62', shirt: '#b5654a', pants: '#3d2a1c', hat: '#7a7a82', dir: -1, arm: 'up', wave: t + i + 2, bounce: t * 8 + i + 3, noShadow: true, mouth: 'open' }); line(bx2 - h * 0.26, y - h * 1.0, bx2 - h * 0.26, y - h * 1.5, '#6b4a34', 6);
  }
  for (let i = 0; i < 6; i++) { const kk = ((t * 1.2 + i / 6) % 1); circle(380 + i * 60, 1480 - kk * 40, 40 + kk * 50, `rgba(214,190,150,${0.5 * (1 - kk)})`); }
  const b = pop(t, T.fought, 0.35); if (b > 0 && t < T.won - 0.02) xf(CX, 560, b, 0, () => { fillRR(160, 450, 760, 200, 36, '#fff'); text('THOUSANDS', CX, 550, 110, 800, '#1b1f27', 'center', -0.01); });
  const w = pop(t, T.won, 0.3); if (w > 0) { flag(160, 1280, '#2a4a8a', t); xf(CX, 560, w, 0, () => { fillRR(190, 450, 700, 200, 36, '#2a4a8a'); text('MODENA WINS', CX, 550, 90, 800, '#fff', 'center', 0); }); }
}
function sceneTower(t) {
  ctx.fillStyle = vgrad(0, 1300, '#6d9ed0', '#f6ecd2'); ctx.fillRect(0, 0, W, 1300); cloud(80, 260, 0.9); ctx.fillStyle = '#7fae5a'; ctx.fillRect(0, 1300, W, 160);
  ctx.fillStyle = '#c9b69a'; ctx.fillRect(0, 1450, W, 470); ctx.fillStyle = '#b5a285'; ctx.fillRect(0, 1450, W, 16); for (let r = 0; r < 4; r++) for (let c = 0; c < 8; c++) ellipse(((c + (r % 2) * 0.5) * 150 + 40), 1500 + r * 80, 60 + r * 10, 16 + r * 3, 'rgba(0,0,0,0.05)');
  fillRR(400, 340, 280, 1110, 4, '#d4a373'); for (let r = 0; r < 14; r++) line(400, 340 + r * 80, 680, 340 + r * 80, 'rgba(0,0,0,0.08)', 3); fillRR(430, 600, 40, 120, 20, '#6b4a34'); fillRR(610, 600, 40, 120, 20, '#6b4a34'); fillRR(500, 1320, 80, 130, 40, '#6b4a34');
  fillRR(380, 300, 320, 60, 6, '#c98f5a'); poly([[380, 300], [540, 120], [700, 300]], '#a0522d');
  const k = pop(t, T.tower - 0.2, 0.4); xf(540, 250, clamp(k), 0, () => { glow(540, 270, 260, '#fff4c0', 0.5); fillRR(450, 215, 180, 120, 14, 'rgba(180,225,255,0.5)'); strokeRR(450, 215, 180, 120, 14, 'rgba(255,255,255,0.9)', 4); fillRR(470, 300, 140, 28, 8, '#9a4e38'); bucketShape(540, 304, 0.2); });
  [[130, 5], [880, 6]].forEach(([x, id], i) => person(x, 1650, 360, id, { arm: 'up', wave: t + i, dir: i ? -1 : 1, mouth: 'open' })); // tourists pointing up
  const b = pop(t, T.still, 0.3); if (b > 0) xf(CX, 1070, b, 0, () => { ctx.save(); ctx.translate(CX + 240, 880); ctx.rotate(0.06); fillRR(-210, -70, 420, 140, 24, '#fff'); text('STILL THERE', 0, 4, 60, 800, '#2a4a8a', 'center', 0.02); ctx.restore(); });
}
function sceneChat(t) {
  ctx.fillStyle = '#1b2230'; ctx.fillRect(0, 0, W, H);
  const y0 = 330; fillRR(196, y0 - 14, 688, 1130, 64, '#1c1c26'); strokeRR(196, y0 - 14, 688, 1130, 64, 'rgba(255,255,255,0.16)', 3);
  ctx.save(); rr(210, y0, 660, 1100, 50); ctx.clip(); ctx.fillStyle = '#f4f1ea'; ctx.fillRect(210, y0, 660, 1100);
  fillRR(210, y0, 660, 140, 0, '#fff'); avatar(280, y0 + 90, 34, 'M', '#2a4a8a'); text('Modena', 336, y0 + 80, 34, 800, '#1e1b4b', 'left'); text('Last seen: never', 336, y0 + 118, 22, 500, '#6b6a80', 'left');
  const yrs = ['1325', '1450', '1650', '1850', '1950', '2024'];
  yrs.forEach((yr, i) => { const at = T.msg + 0.2 + i * 0.55, e = pop(t, at, 0.3); if (e <= 0) return; const y = y0 + 190 + i * 150;
    xf(540, y + 40, clamp(e), 0, () => { text(yr, 540, y - 6, 22, 800, '#6b6a80', 'center', 0.2); fillRR(310, y + 14, 530, 74, 30, C.primary); text('Bucket back, plz?', 340, y + 52, 30, 700, '#fff', 'left'); const rd = seg(t, at + 0.35, at + 0.6); withFade(rd, () => text('Read ✓✓', 840, y + 108, 22, 800, '#2a8a54', 'right')); }); });
  ctx.restore(); fillRR(540 - 70, y0 + 14, 140, 34, 17, '#0b0b10');
  const b = pop(t, T.years, 0.35); if (b > 0) xf(CX, 200, b, 0, () => { fillRR(180, 130, 720, 140, 40, '#fff'); text('700 YEARS', CX, 202, 100, 800, '#b3261e', 'center', -0.01); });
}
function sceneShop(t) {
  ctx.fillStyle = '#e9dfd0'; ctx.fillRect(0, 0, W, 1250); fillRR(0, 1180, W, 70, 0, '#cbb99d'); ctx.fillStyle = '#9a8a74'; ctx.fillRect(0, 1250, W, 670);
  fillRR(70, 330, 200, 300, 8, '#cfe7f3'); strokeRR(70, 330, 200, 300, 8, '#8a7a64', 8); fillRR(810, 330, 200, 300, 8, '#cfe7f3'); strokeRR(810, 330, 200, 300, 8, '#8a7a64', 8);
  person(420, 1560, 640, 9, { skin: '#d9a27a', shirt: '#6c8ebf', pants: '#3d424f', glasses: true, arm: 'wave', wave: t, mouth: 'open', eyes: 'wide', noShadow: true });
  fillRR(0, 1270, W, 650, 0, '#7a5a3a'); fillRR(0, 1270, W, 30, 0, '#a07852'); // counter in front of him
  fillRR(640, 1110, 260, 160, 18, '#1b1f27'); fillRR(654, 1124, 232, 132, 8, '#f4f1ea'); text('12', 770, 1190, 90, 800, '#b3261e', 'center', -0.02);
  const k = pop(t, T.cust, 0.4); if (k > 0) circle(890, 1120, 40 * clamp(k), RED), text('12', 890, 1121, 34 * clamp(k), 800, '#fff', 'center');
  [['Hello?', 120, 820, T.cust + 0.3], ['Open Saturday?', 700, 640, T.cust + 0.7], ['Can I rebook?', 150, 1040, T.cust + 1.1], ['Still there??', 760, 880, T.wait]].forEach(([s, x, y, at], i) => { const e = pop(t, at, 0.3); if (e > 0) xf(x + 120, y, clamp(e), 0, () => { const w = tw(s, 34, 800) + 56, yy = y + Math.sin(t * 2 + i) * 8; fillRR(x, yy - 38, w, 76, 36, '#fff'); text(s, x + w / 2, yy + 2, 34, 800, '#1b1f27', 'center'); }); });
}
// ═════════════ the product ═════════════
const CONV = [['Priya S.', 'Can I move to Friday?', 'EMAIL', 1], ['Marcus T.', 'Are you open Saturday?', 'SMS', 2], ['Ava R.', 'Running 5 min late', 'SMS', 3], ['Jordan K.', 'Still have my slot?', 'SMS', 0], ['Dana L.', 'Do you take cards?', 'EMAIL', 4]];
function sceneInbox(t) {
  stage(t, 0.22);
  withFade(enter(t, T.inbox - 0.1, T.offer, 0.2), () => {
    eyebrow('ONE INBOX · TEXT + EMAIL', 320); const done = (i) => seg(t, T.left + 0.2 + i * 0.35, T.left + 0.5 + i * 0.35); let unread = 0;
    card(CARD.x, 370, CARD.w, 840);
    CONV.forEach(([n, m, ch, ci], i) => { const e = ease.out(seg(t, T.inbox + i * 0.1, T.inbox + 0.4 + i * 0.1)), y = 460 + i * 150, d = done(i) > 0.5; if (!d) unread++;
      withFade(e, () => { if (i) { ctx.fillStyle = 'rgba(255,255,255,0.07)'; ctx.fillRect(CARD.x + 30, y - 75, CARD.w - 60, 2); } avatar(CARD.x + 76, y, 38, n.slice(0, 2).toUpperCase(), NAMES[ci][1]); text(n, CARD.x + 136, y - 16, 30, d ? 600 : 800, d ? SOFT : '#fff', 'left'); text(m, CARD.x + 136, y + 24, 24, 500, SOFT, 'left');
        tag(CARD.x + CARD.w - 36, y - 18, ch, ch === 'SMS' ? IN.mid : AMBER, false, 16); if (!d) circle(CARD.x + CARD.w - 56, y + 30, 11, C.primary); else { circle(CARD.x + CARD.w - 56, y + 30, 14, rgba(GREEN, 0.25)); check(CARD.x + CARD.w - 56, y + 31, 14, GREEN, 3.5); } }); });
    const bd = 'UNREAD ' + unread; const z = unread === 0; const w = tw(bd, 30, 800, 0.1) + 80; fillRR(CX - w / 2, 1250, w, 80, 40, z ? rgba(GREEN, 0.2) : rgba(C.primary, 0.2)); strokeRR(CX - w / 2, 1250, w, 80, 40, z ? GREEN : IN.mid, 3); text(z ? 'INBOX ZERO' : bd, CX, 1291, 30, 800, z ? '#9ff0c0' : IN.hi, 'center', 0.1);
    const r = pop(t, T.reply + 0.1, 0.3); if (r > 0) xf(CX, 1400, r, 0, () => { const s = 'Replied in seconds', ww = tw(s, 32, 800) + 110; fillRR(CX - ww / 2, 1360, ww, 84, 42, rgba(IN.mid, 0.18)); strokeRR(CX - ww / 2, 1360, ww, 84, 42, IN.mid, 3); circle(CX - ww / 2 + 52, 1402, 20, IN.mid); check(CX - ww / 2 + 52, 1403, 20, '#fff', 4.5); text(s, CX - ww / 2 + 90, 1403, 32, 800, '#fff', 'left'); });
  });
}
const SCENES = [[0, T.stole, sceneBucket], [T.stole, T.asked, sceneThief], [T.asked, T.fought, sceneNo], [T.fought, T.still, sceneBattle], [T.still, T.msg, sceneTower], [T.msg, T.cust, sceneChat], [T.cust, T.brand, sceneShop],
  [T.brand, T.inbox, (t) => brandHit(t, T.brand, T.inbox)], [T.inbox, T.offer, sceneInbox], [T.offer, T.end, (t) => offerCard(t, T.offer, T.end)], [T.end, 999, (t) => endCard(t, T.end, T.cta, T.url)]];
cue(T.bucket, 'punch', 0.9); cue(T.stole, 'swish', 0.7); cue(T.well, 'tap', 0.8); cue(T.asked, 'swish', 0.7); cue(T.no, 'punch', 1); cue(T.fought, 'transition', 0.8); cue(T.won, 'ding', 1); cue(T.still, 'swish', 0.7); cue(T.tower, 'ding', 0.8);
for (let i = 0; i < 6; i++) { cue(T.msg + 0.2 + i * 0.55, 'notification', 0.6); cue(T.msg + 0.55 + i * 0.55, 'tap', 0.5); } cue(T.years, 'punch', 1); cue(T.cust, 'notification', 1); cue(T.cust + 0.7, 'notification', 0.8); cue(T.wait, 'notification', 0.9);
cue(T.brand, 'transitionHit', 1); for (let i = 0; i < 5; i++) cue(T.inbox + i * 0.1, 'key', 0.5); for (let i = 0; i < 5; i++) cue(T.left + 0.3 + i * 0.35, 'ding', 0.5); cue(T.reply + 0.1, 'swish', 1);
cue(T.offer, 'punch', 1); cue(T.offer + 0.7, 'ding', 0.9); cue(T.end, 'swish', 0.8); cue(T.cta, 'tap', 1.2);
boot({ duration: DURATION, scenes: SCENES, brandAt: T.brand, hideCaption: (t) => t >= T.end - 0.1,
  after: (t) => { const f = 1 - seg(t, T.brand, T.brand + 0.12); if (t >= T.brand && f > 0) { ctx.fillStyle = rgba('#ffffff', 0.5 * f); ctx.fillRect(0, 0, W, H); } } }, 'bucket');
