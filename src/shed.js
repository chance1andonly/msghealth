// MsgHealth · "The shed" · vertical social ad (1080 × 1920, 30 fps), built on src/kit.js.
// Real story, nudged: in 2017 a man turned his garden shed into the #1 restaurant in London on a review site, with no
// food, no customers and a pile of reviews he wrote himself. (The three-year waiting list and "three hundred guests a
// week" are the made-up absurd parts.) A real restaurant down the road has eleven reviews because nobody ever asks.
// Features shown: reviews & review requests (automatic SMS after a visit, rating and review count, local ranking).
// Voiceover: assets/audio/shed/vo-NN.wav, timed by VO_AT in src/shed-vo.js.
'use strict';

const word = (l, k) => VO_AT[l] + VO_CLIPS[l].chunks[k][1];
const T = {
  shed: VO_AT[0], one: word(0, 2), menu: VO_AT[1], chef: word(1, 1), cust: word(1, 2), rev: VO_AT[2], himself: word(2, 1), wait: VO_AT[3],
  real: VO_AT[4], three: word(4, 2), eleven: VO_AT[5], ask: VO_AT[6], brand: VO_AT[7], asks: word(7, 1), text: VO_AT[8], rq: word(8, 1), tap: VO_AT[9], roll: word(9, 1), beat: VO_AT[10], shedDrop: word(10, 1),
  end: VO_AT[11] - 0.1, url: VO_AT[11] + 0.1,
};
T.tapEnd = T.end + 1.25;
const DURATION = +(T.tapEnd + 1.0).toFixed(2);
window.CUES = T;
window.SFX = [];
const cue = (t, kind, gain) => window.SFX.push({ t, kind, gain });
window.MUSIC = { bpm: 96, root: 48, brandAt: T.brand, mood: 'quirky' };

const WOOD = '#9a6b3f';
function shedShape(x, y, s) { // feet at (x, y)
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  fillRR(-260, -330, 520, 330, 6, WOOD); for (let i = 1; i < 9; i++) { ctx.fillStyle = 'rgba(0,0,0,0.12)'; ctx.fillRect(-260 + i * 58, -330, 3, 330); }
  poly([[-300, -330], [0, -470], [300, -330]], '#5c3b24'); poly([[-300, -330], [300, -330], [300, -310], [-300, -310]], '#4a2f1b');
  fillRR(-210, -250, 150, 130, 6, '#ffd980'); ctx.strokeStyle = '#5c3b24'; ctx.lineWidth = 10; ctx.strokeRect(-210, -250, 150, 130); line(-135, -250, -135, -120, '#5c3b24', 8); line(-210, -185, -60, -185, '#5c3b24', 8);
  fillRR(40, -260, 150, 260, 6, '#6e4a2c'); circle(168, -130, 9, '#e8c36a');
  ctx.restore();
}
function lights(x0, x1, y, t) { ctx.strokeStyle = '#222'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x0, y); ctx.quadraticCurveTo((x0 + x1) / 2, y + 90, x1, y); ctx.stroke(); for (let i = 0; i <= 10; i++) { const u = i / 10, x = lerp(x0, x1, u), yy = (1 - u) * (1 - u) * y + 2 * u * (1 - u) * (y + 90) + u * u * y; circle(x, yy + 10, 9, i % 2 ? '#ffd35a' : '#ff8fb0'); glow(x, yy + 10, 40, '#ffd35a', 0.25 + 0.1 * Math.sin(t * 4 + i)); } }
function rating(x, y, r, n, col = '#f5b82e', off = 'rgba(255,255,255,0.15)') { for (let i = 0; i < 5; i++) star(x + i * r * 2.2, y, r, i < n ? col : off); }

function sceneShed(t) {
  ctx.fillStyle = vgrad(0, 1300, '#3d2f6b', '#f2a65a'); ctx.fillRect(0, 0, W, 1300); ctx.fillStyle = '#3b5a2c'; ctx.fillRect(0, 1300, W, 620); ctx.fillStyle = '#2f4a23'; ctx.fillRect(0, 1300, W, 22);
  for (let i = 0; i < 40; i++) circle(hash(i) * W, hash(i + 5) * 500, 2 + hash(i + 9) * 2, 'rgba(255,255,255,0.7)');
  for (let i = 0; i < 6; i++) { const x = i * 200 - 40; fillRR(x, 700 + (i % 2) * 40, 170, 600, 6, i % 2 ? '#5a3a46' : '#6a4452'); poly([[x - 10, 700 + (i % 2) * 40], [x + 85, 620 + (i % 2) * 40], [x + 180, 700 + (i % 2) * 40]], '#2d1f2c'); for (let w = 0; w < 3; w++) fillRR(x + 30 + (w % 2) * 70, 780 + w * 130 + (i % 2) * 40, 46, 70, 4, hash(i * 3 + w) > 0.4 ? '#ffd980' : '#2d1f2c'); }
  ctx.fillStyle = '#6b4a34'; ctx.fillRect(0, 1180, W, 130); for (let i = 0; i < 14; i++) ctx.fillRect(i * 80, 1150, 16, 160);
  const z = 1 + 0.1 * seg(t, 0, T.menu), s = pop(t, T.shed - 0.1 + 0.5, 0.6);
  xf(CX, 1300, z, 0, () => { lights(220, 860, 800, t); shedShape(CX, 1300, 1.4 * clamp(s)); });
  const b = pop(t, T.one, 0.35); if (b > 0) xf(CX, 380, b, 0, () => { fillRR(190, 270, 700, 220, 28, '#fff7d6'); strokeRR(190, 270, 700, 220, 28, '#e0a526', 8); text('#1', 330, 380, 130, 800, '#c9801a', 'center', 0); text('RESTAURANT', 650, 350, 44, 800, '#1b1b1f', 'center', 0.05); text('IN LONDON', 650, 410, 44, 800, '#1b1b1f', 'center', 0.05); rating(430, 465, 17, 5); });
}
function sceneInside(t) {
  ctx.fillStyle = WOOD; ctx.fillRect(0, 0, W, H); for (let i = 0; i < 20; i++) { ctx.fillStyle = 'rgba(0,0,0,0.12)'; ctx.fillRect(i * 56, 0, 4, 1500); } ctx.fillStyle = '#5c3b24'; ctx.fillRect(0, 1250, W, 670);
  lights(60, 1020, 120, t);
  // a lawnmower, a table, a microwave
  fillRR(90, 1060, 300, 120, 18, '#d34b3a'); line(300, 1060, 380, 800, '#333', 14); circle(140, 1200, 36, '#222'); circle(340, 1200, 36, '#222');
  fillRR(560, 1010, 400, 40, 8, '#e8dcc8'); fillRR(600, 1050, 24, 220, 4, '#c9bda5'); fillRR(900, 1050, 24, 220, 4, '#c9bda5'); circle(760, 990, 22, '#ffd35a'); fillRR(745, 1000, 30, 20, 4, '#e8dcc8');
  fillRR(620, 840, 220, 150, 14, '#cfd3d7'); fillRR(640, 860, 130, 110, 8, '#2b3040'); circle(805, 880, 12, '#e9833a'); text('PING', 705, 915, 36, 800, '#9fd3f0', 'center');
  person(530, 1280, 560, 4, { skin: '#d9a27a', shirt: '#e8e2d2', pants: '#3d4a6a', hat: '#fff', arm: 'phone', bounce: t * 3 });
  [['NO MENU', T.menu, 300], ['NO CHEF', T.chef, 470], ['NO CUSTOMERS', T.cust, 640]].forEach(([s, at, y], i) => { const k = pop(t, at, 0.3); if (k > 0) xf(CX, y, k, 0, () => { ctx.save(); ctx.translate(CX, y); ctx.rotate((i - 1) * 0.04); const w = tw(s, 70, 800, 0.03) + 90; fillRR(-w / 2, -60, w, 120, 18, '#fff'); strokeRR(-w / 2, -60, w, 120, 18, RED2_, 10); text(s, 0, 4, 70, 800, RED2_, 'center', 0.03); ctx.restore(); }); });
}
const RED2_ = '#d92d3a';
function sceneReviews(t) {
  ctx.fillStyle = '#243044'; ctx.fillRect(0, 0, W, H); ctx.fillStyle = '#1a2230'; ctx.fillRect(0, 1200, W, 720);
  fillRR(120, 1020, 840, 80, 10, '#3a465c'); fillRR(190, 560, 700, 460, 18, '#2c2f38'); fillRR(210, 580, 660, 420, 8, '#cfe6f5'); text('Write a review…', 250, 640, 36, 600, '#3a465c', 'left');
  for (let i = 0; i < 3; i++) { const k = (t * 3 + i) % 1; fillRR(250, 700 + i * 80, 200 + hash(i) * 300 * clamp(seg(t, T.rev, T.rev + 1.2)), 22, 8, '#aebdd0'); }
  person(CX, 1500, 620, 4, { skin: '#d9a27a', shirt: '#e8e2d2', pants: '#3d4a6a', arm: 'up', wave: t * 1.5, mouth: 'open', bounce: t * 6 });
  const cards = [['Best meal of my life', 150, 300, -0.06], ['Cosy. Quiet. Unbeatable.', 520, 200, 0.05], ['Would sit in a shed again', 240, 160, 0.04], ['10/10 would microwave', 600, 400, -0.04]];
  cards.forEach(([s, x, y, r], i) => { const at = i < 2 ? T.rev + i * 0.5 : T.himself + (i - 2) * 0.35, k = pop(t, at, 0.3); if (k > 0) xf(x + 160, y + 50, k, 0, () => { ctx.save(); ctx.translate(x + 160, y + 50); ctx.rotate(r); fillRR(-170, -55, 340, 110, 16, '#fff'); rating(-140, -25, 14, 5); text(s, -150, 22, 24, 700, '#1b1b1f', 'left'); ctx.restore(); }); });
  const lb = pop(t, T.himself + 0.3, 0.3); if (lb > 0) xf(CX, 1200, lb, 0, () => { fillRR(190, 1170, 700, 80, 40, 'rgba(255,255,255,0.12)'); text('Written by: the owner', CX, 1211, 32, 700, '#ffd980', 'center'); });
}
function sceneQueue(t) {
  ctx.fillStyle = vgrad(0, 1300, '#3d2f6b', '#f2a65a'); ctx.fillRect(0, 0, W, 1300); ctx.fillStyle = '#3b5a2c'; ctx.fillRect(0, 1300, W, 620);
  xf(CX, 1300, 1, 0, () => { lights(220, 860, 800, t); shedShape(900, 1300, 0.9); });
  for (let i = 0; i < 9; i++) { const k = ease.out(seg(t, T.wait + i * 0.12, T.wait + 0.5 + i * 0.12)), x = lerp(-150, 760 - i * 105, k); person(x, 1330 + (i % 2) * 50, 380 + (i % 3) * 30, i * 7 + 2, { dir: 1, bounce: t * 5 + i, mouth: i % 2 ? 'open' : '' }); }
  const b = pop(t, T.wait + 0.4, 0.35); xf(CX, 450, b, 0, () => { fillRR(110, 340, 860, 240, 26, '#fff'); strokeRR(110, 340, 860, 240, 26, '#c9801a', 8); text('WAITING LIST', CX, 420, 60, 800, '#1b1b1f', 'center', 0.04); text('3 YEARS', CX, 510, 100, 800, RED2_, 'center', 0); });
}
function resto(t) {
  ctx.fillStyle = '#f1d4ad'; ctx.fillRect(0, 0, W, H); ctx.fillStyle = '#b9895c'; ctx.fillRect(0, 1150, W, 770); ctx.fillStyle = '#8a5f3a'; ctx.fillRect(0, 1150, W, 20);
  fillRR(0, 150, W, 90, 0, '#3a3a52'); text('MARCO\'S KITCHEN', CX, 196, 60, 800, '#fff', 'center', 0.08); for (let i = 0; i < 6; i++) { glow(90 + i * 180, 330, 120, '#ffd980', 0.4); fillRR(70 + i * 180, 270, 40, 60, 10, '#ffd980'); line(90 + i * 180, 240, 90 + i * 180, 270, '#222', 4); }
  [[210, 1160], [540, 1160], [870, 1160]].forEach(([x, y], i) => { fillRR(x - 130, y - 70, 260, 30, 8, '#fff'); fillRR(x - 14, y - 40, 28, 130, 4, '#6b4a34'); [-1, 1].forEach((d) => person(x + d * 100, y - 60, 330, i * 3 + (d + 1), { arm: 'up', wave: t + i + d, mouth: 'open', dir: d > 0 ? -1 : 1, bounce: t * 4 + i })); });
}
function sceneRestaurant(t) {
  resto(t);
  const b = pop(t, T.three, 0.35); if (b > 0) xf(CX, 520, b, 0, () => { fillRR(160, 420, 760, 200, 28, '#fff'); strokeRR(160, 420, 760, 200, 28, GREEN, 8); text('300', 380, 520, 130, 800, '#1b1b1f', 'center', 0); text('GUESTS', 700, 495, 50, 800, '#1b1b1f', 'center', 0.05); text('A WEEK', 700, 555, 50, 800, '#1b1b1f', 'center', 0.05); });
  const e = pop(t, T.eleven - 0.1, 0.35); if (e > 0) xf(CX, 800, e, 0, () => { fillRR(190, 700, 700, 200, 28, '#2c2f38'); rating(250, 770, 24, 5); text('4.8', 700, 775, 76, 800, '#fff', 'center', 0); text('11 reviews', 250, 850, 40, 700, '#ffd980', 'left'); });
}
function sceneNobody(t) {
  resto(t);
  const k = ease.inOut(seg(t, T.ask, T.brand)), px = lerp(300, 1250, k);
  person(px, 1500, 520, 11, { skin: '#c68a62', shirt: '#e08a6d', arm: 'wave', wave: t, mouth: 'open', dir: 1 });
  const b = pop(t, T.ask + 0.15, 0.3); xf(px, 1000, b, 0, () => { if (px < 900) { fillRR(px - 150, 920, 300, 100, 30, '#fff'); text('Loved it!', px, 972, 40, 800, '#1b1b1f', 'center'); } });
  const r = pop(t, T.ask + 0.8, 0.3); if (r > 0) xf(CX, 600, r, 0, () => { fillRR(190, 480, 700, 240, 24, '#2c2f38'); text('Write a review', 250, 540, 34, 700, '#aebdd0', 'left'); fillRR(250, 580, 580, 80, 12, '#1a1d24'); if (Math.sin(t * 8) > 0) ctx.fillRect(270, 596, 3, 48); text('…nobody asked.', CX, 760, 34, 600, '#ffd980', 'center'); });
}

// ═════════════ the product ═════════════
function sceneRequest(t) {
  stage(t, 0.22);
  withFade(enter(t, T.asks - 0.1, T.roll - 0.1, 0.25), () => {
    eyebrow('REVIEW REQUESTS · AUTOMATIC', 330); card(CARD.x, 380, CARD.w, 840);
    avatar(CARD.x + 66, 442, 30, 'JK', NAMES[0][1]); text('Jordan K.', CARD.x + 112, 442, 30, 700, '#fff'); tag(CARD.x + CARD.w - 30, 442, 'SMS', IN.mid, false, 20);
    ctx.fillStyle = 'rgba(255,255,255,0.07)'; ctx.fillRect(CARD.x + 30, 490, CARD.w - 60, 2);
    const m = pop(t, T.text + 0.1, 0.35), h = bubble(CARD.x + 40, 530 + (1 - clamp(m)) * 26, CARD.w - 80, ['Thanks for dining with us, Jordan!', 'Mind leaving a quick review?'], true, clamp(m));
    withFade(seg(t, T.text + 0.5, T.text + 0.8), () => text('Sent automatically after the visit', CARD.x + CARD.w - 40, 530 + h + 28, 21, 600, IN.mid, 'right'));
    const q = pop(t, T.rq, 0.35); if (q > 0) xf(CX, 880, q, 0, () => { fillRR(CARD.x + 120, 780, CARD.w - 240, 150, 30, 'rgba(255,255,255,0.08)'); const n = t > T.tap ? 5 : Math.floor(seg(t, T.tap - 0.7, T.tap) * 5); rating(CARD.x + 190, 855, 40, n, '#f5b82e', 'rgba(255,255,255,0.18)'); });
    const done = pop(t, T.tap + 0.25, 0.35); if (done > 0) xf(CX, 1090, done, 0, () => { const s = 'Thank you! Review posted', w = tw(s, 30, 800) + 110; fillRR(CX - w / 2, 1040, w, 90, 45, rgba(GREEN, 0.2)); strokeRR(CX - w / 2, 1040, w, 90, 45, GREEN, 3); circle(CX - w / 2 + 50, 1085, 20, GREEN); check(CX - w / 2 + 50, 1086, 20, '#fff', 4); text(s, CX - w / 2 + 86, 1086, 30, 800, '#fff', 'left'); });
  });
}
function sceneRoll(t) {
  stage(t, 0.2);
  withFade(enter(t, T.roll - 0.1, T.beat, 0.25), () => {
    eyebrow('REVIEWS', 330); card(CARD.x, 380, CARD.w, 300);
    const k = ease.out(seg(t, T.roll, T.beat - 0.4)), cnt = Math.round(lerp(11, 214, k));
    text(String(cnt), CARD.x + 220, 500, 130, 800, '#fff', 'center', -0.03); text('REVIEWS', CARD.x + 220, 590, 26, 800, MUTED, 'center', 0.25);
    text('4.9', CARD.x + 640, 500, 110, 800, '#fff', 'center', -0.03); rating(CARD.x + 470, 600, 24, 5);
    [['Jordan K.', 'Best haircut in town. Booked again already.'], ['Priya S.', 'Friendly, fast, and the text reminder is a lifesaver.'], ['Marcus T.', 'Great dinner, will be back Thursday.'], ['Ava R.', 'Real people, real food. Five stars.']].forEach(([n, s], i) => {
      const e = ease.out(seg(t, T.roll + 0.3 + i * 0.35, T.roll + 0.7 + i * 0.35)), y = 730 + i * 170; withFade(e, () => { card(CARD.x, y + (1 - e) * 30, CARD.w, 150, { r: 20 }); avatar(CARD.x + 60, y + 50, 30, n.slice(0, 2).toUpperCase(), NAMES[i][1]); text(n, CARD.x + 110, y + 40, 28, 700, '#fff'); rating(CARD.x + 110 + tw(n, 28, 700) + 30, y + 40, 12, 5); text(s, CARD.x + 40, y + 102, 24, 500, SOFT); });
    });
  });
}
function sceneRank(t) {
  stage(t, 0.2);
  withFade(enter(t, T.beat - 0.1, T.end, 0.2), () => {
    eyebrow('LOCAL RANKING', 330); card(CARD.x, 380, CARD.w, 640);
    const sw = ease.inOut(seg(t, T.shedDrop - 0.2, T.shedDrop + 0.6)), rows = [['Marco\'s Kitchen', '4.9 · 214 reviews', GREEN], ['The Shed', '5.0 · 0 customers', AMBER]];
    rows.forEach(([n, s, col], i) => { const rank = i === 0 ? lerp(2, 1, sw) : lerp(1, 2, sw), y = 400 + (rank - 1) * 190; const win = i === 0 && sw > 0.5;
      fillRR(CARD.x + 16, y + 16, CARD.w - 32, 160, 20, win ? rgba(GREEN, 0.1) : 'rgba(255,255,255,0.04)'); if (win) strokeRR(CARD.x + 16, y + 16, CARD.w - 32, 160, 20, rgba(GREEN, 0.6), 3);
      text('#' + Math.round(rank), CARD.x + 90, y + 96, 70, 800, win ? '#9ff0c0' : '#fff', 'center', 0); text(n, CARD.x + 180, y + 74, 40, 800, '#fff', 'left'); text(s, CARD.x + 180, y + 126, 26, 500, SOFT, 'left'); });
    const c = pop(t, T.shedDrop + 0.5, 0.35); if (c > 0) xf(CX, 1120, c, 0, () => { const s = 'REAL CUSTOMERS WIN', w = tw(s, 34, 800, 0.1) + 80; fillRR(CX - w / 2, 1085, w, 80, 40, rgba(GREEN, 0.2)); strokeRR(CX - w / 2, 1085, w, 80, 40, GREEN, 3); text(s, CX, 1126, 34, 800, '#9ff0c0', 'center', 0.1); });
  });
}
const SCENES = [
  [0, T.menu, sceneShed], [T.menu, T.rev, sceneInside], [T.rev, T.wait, sceneReviews], [T.wait, T.real, sceneQueue], [T.real, T.ask, sceneRestaurant], [T.ask, T.brand, sceneNobody],
  [T.brand, T.asks, (t) => brandHit(t, T.brand, T.asks)], [T.asks, T.roll, sceneRequest], [T.roll, T.beat, sceneRoll], [T.beat, T.end, sceneRank], [T.end, 999, (t) => endCard(t, T.end, T.tapEnd, T.url)],
];
cue(T.shed + 0.5, 'swish', 0.7); cue(T.one, 'punch', 0.9); [T.menu, T.chef, T.cust].forEach((t) => cue(t, 'punch', 0.8)); cue(T.rev, 'key', 0.7); cue(T.rev + 0.5, 'key', 0.7); cue(T.himself, 'key', 0.7); cue(T.himself + 0.35, 'key', 0.7);
cue(T.wait, 'swoosh', 0.8); cue(T.wait + 0.4, 'punch', 0.9); cue(T.real, 'swish', 0.8); cue(T.three, 'ding', 0.9); cue(T.eleven, 'notification', 0.8); cue(T.ask + 0.8, 'tap', 0.6);
cue(T.brand, 'transitionHit', 1); cue(T.text + 0.1, 'notification', 0.9); cue(T.rq, 'swish', 0.7); for (let i = 0; i < 5; i++) cue(T.tap - 0.7 + i * 0.14, 'key', 0.5); cue(T.tap + 0.25, 'ding', 0.9);
cue(T.roll + 0.3, 'swish', 0.8); [0, 1, 2, 3].forEach((i) => cue(T.roll + 0.5 + i * 0.35, 'tap', 0.5)); cue(T.beat, 'swish', 0.8); cue(T.shedDrop, 'punch', 0.9); cue(T.end, 'punch', 1); cue(T.tapEnd, 'tap', 1.2);

boot({ duration: DURATION, scenes: SCENES, brandAt: T.brand, hideCaption: (t) => t >= T.end - 0.1,
  after: (t) => { const f = 1 - seg(t, T.brand, T.brand + 0.12); if (t >= T.brand && f > 0) { ctx.fillStyle = rgba('#ffffff', 0.5 * f); ctx.fillRect(0, 0, W, H); } } }, 'shed');
