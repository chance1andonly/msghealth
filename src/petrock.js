// MsgHealth · "The Pet Rock" · story-hook vertical ad (1080 × 1920, 30 fps), built on src/kit.js + src/story-kit.js.
// Real story: in 1975 ad man Gary Dahl sold "Pet Rocks", a rock in a little box with air holes and a training manual, for under four
// dollars each. It was the hit gift of that Christmas and sold over a million in a few months.
// INVENTED (the absurd part): not one rock ever left a review.
// Pivot: your customers won't review you either, unless you ask. MsgHealth sends the review request for you, a friendly text right after
// the visit, and every review lands in one place (Starter: reviews & review requests). Names, ratings and quotes are illustrative.
// Voiceover: assets/audio/petrock/vo-NN.wav (src/petrock-vo.js).
'use strict';
const word = (l, k) => VO_AT[l] + VO_CLIPS[l].chunks[k][1];
const T = {
  rocks: word(0, 1), adman: VO_AT[1], pet: word(1, 1), box: VO_AT[2], holes: word(2, 1), four: VO_AT[3], gift: VO_AT[4], xmas: word(4, 1), mil: VO_AT[5], few: word(5, 1), loved: VO_AT[6], alleg: word(6, 1),
  notone: VO_AT[7], review: word(7, 1), pivot: VO_AT[8], unless: word(8, 1), brand: VO_AT[9], ask: word(9, 1), friendly: VO_AT[10], visit: word(10, 1), lands: VO_AT[11], one: word(11, 1),
  offer: VO_AT[12], end: VO_AT[13] - 0.1, url: VO_AT[13] + 0.1,
};
T.cta = T.end + 1.25;
const DURATION = +(T.cta + 1.0).toFixed(2);
window.CUES = T; window.SFX = []; const cue = (t, kind, gain) => window.SFX.push({ t, kind, gain });
window.MUSIC = { bpm: 110, root: 53, brandAt: T.brand, mood: 'bouncy' };

function rock(x, y, w, h, o = {}) { // grey pebble, base-centre at (x, y)
  shadow(x, y, w * 0.55); ctx.beginPath(); ctx.moveTo(x - w / 2, y); ctx.bezierCurveTo(x - w * 0.62, y - h * 0.7, x - w * 0.2, y - h * 1.1, x + w * 0.1, y - h); ctx.bezierCurveTo(x + w * 0.55, y - h * 0.95, x + w * 0.62, y - h * 0.3, x + w / 2, y); ctx.closePath(); ctx.fillStyle = o.col ?? '#8d8f94'; ctx.fill();
  ctx.save(); ctx.clip(); ctx.fillStyle = 'rgba(255,255,255,0.18)'; ctx.beginPath(); ctx.ellipse(x - w * 0.15, y - h * 0.75, w * 0.3, h * 0.2, -0.4, 0, 7); ctx.fill(); ctx.fillStyle = 'rgba(0,0,0,0.15)'; ctx.fillRect(x - w, y - h * 0.25, w * 2, h * 0.3); ctx.restore();
  for (let i = 0; i < 5; i++) ellipse(x - w * 0.25 + hash(i + (o.seed ?? 0)) * w * 0.5, y - h * 0.25 - hash(i + 9) * h * 0.5, 4, 3, 'rgba(0,0,0,0.18)');
  if (o.eyes) { circle(x - w * 0.1, y - h * 0.5, w * 0.045, '#1b1f27'); circle(x + w * 0.16, y - h * 0.5, w * 0.045, '#1b1f27'); if (o.smile) { ctx.strokeStyle = '#1b1f27'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(x + w * 0.03, y - h * 0.42, w * 0.1, 0.2, Math.PI - 0.2); ctx.stroke(); } }
}
function pbox(x, y, w, h, o = {}) { // cardboard pet-rock box, base-centre at (x, y)
  shadow(x, y, w * 0.6); fillRR(x - w / 2, y - h, w, h, 6, '#c9a26a'); fillRR(x - w / 2, y - h, w, h * 0.12, 6, '#b88a52'); for (let i = 0; i < 6; i++) ellipse(x - w * 0.36 + i * w * 0.145, y - h * 0.7, w * 0.03, w * 0.03, '#5a3a1f');
  if (o.label !== false) { fillRR(x - w * 0.3, y - h * 0.5, w * 0.6, h * 0.28, 4, '#fff7e0'); text('PET ROCK', x, y - h * 0.36, w * 0.095, 800, '#7a4a2a', 'center', 0.04); }
}
function room(t) {
  ctx.fillStyle = '#e8a63c'; ctx.fillRect(0, 0, W, 1250); for (let i = 0; i < 6; i++) fillRR(0, 180 + i * 120, W, 50, 0, ['#d9772b', '#f2c84a', '#b5551f'][i % 3]);
  ctx.fillStyle = '#6a4a34'; ctx.fillRect(0, 1250, W, 670); ctx.fillStyle = 'rgba(0,0,0,0.12)'; ctx.fillRect(0, 1250, W, 30);
}
function sceneHook(t) {
  room(t); const k = appear(t, 0.2, 0.45);
  withFade(seg(t, 0.15, 0.5), () => text('1975', CX, 150, 200, 800, '#3a1f10', 'center', -0.02));
  xf(CX, 1650, 0.7 + 0.3 * k, 0, () => { ctx.globalAlpha = k; person(260, 1650, 520, 150, { skin: '#c68a62', shirt: '#6c8ebf', pants: '#3d424f', arm: 'down', bounce: t * 3, mouth: undefined }); rock(720, 1650, 260, 170, { eyes: true, smile: true });
    ctx.strokeStyle = '#d9462d'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(330, 1360); ctx.quadraticCurveTo(520, 1700, 630, 1560); ctx.stroke(); });
  const b = appear(t, T.rocks, 0.35); if (b > 0) xf(CX, 540, b, 0, () => banner('PET ROCKS', CX, 540, 120, '#3a1f10', '#f2c84a', -0.04));
}
function sceneAdman(t) {
  room(t); ctx.fillStyle = '#e8d9b8'; fillRR(60, 300, 220, 300, 8, '#bfe0f5');
  person(540, 1590, 600, 6, { skin: '#d9a27a', shirt: '#8a2a2a', pants: '#3d424f', noShadow: true, glasses: true, mouth: 'open', arm: 'up', wave: t });
  fillRR(0, 1300, W, 620, 0, '#7a5a3a'); fillRR(0, 1300, W, 30, 0, '#a07852');
  const a = appear(t, T.adman, 0.35); if (a > 0) xf(CX, 300, a, 0, () => { fillRR(190, 230, 700, 150, 20, '#fff7e0'); strokeRR(190, 230, 700, 150, 20, '#7a4a2a', 6); text('GARY DAHL', CX, 285, 64, 800, '#3a1f10', 'center', 0.03); text('AD MAN', CX, 345, 34, 800, '#7a4a2a', 'center', 0.3); });
  const b = appear(t, T.pet, 0.4); if (b > 0) xf(CX, 760, b, 0, () => { glow(CX, 760, 260, '#fff4c0', 0.7); circle(CX, 740, 80, '#fff2a8'); fillRR(CX - 26, 810, 52, 44, 8, '#9a9aa6'); line(CX, 700, CX, 780, '#c9803a', 6); }); const c = appear(t, T.pet + 0.2, 0.4); if (c > 0) rock(CX, 1300 - 0, 220 * c, 150 * c, { col: '#8d8f94' });
}
function sceneBox(t) {
  ctx.fillStyle = vgrad(0, H, '#f2dba8', '#d9b878'); ctx.fillRect(0, 0, W, H); const k = appear(t, T.box - 0.1, 0.45);
  xf(CX, 1500, 0.6 + 0.4 * k, 0, () => { ctx.globalAlpha = k; shadow(CX, 1500, 400); for (let i = 0; i < 12; i++) line(CX - 280 + i * 50, 1130, CX - 250 + i * 50 + hash(i) * 30, 1070 - hash(i + 4) * 30, '#e6c34a', 8); rock(CX, 1180, 300, 190, { eyes: true });
    fillRR(CX - 380, 1180, 760, 320, 10, '#c9a26a'); fillRR(CX - 380, 1180, 760, 40, 10, '#b88a52'); poly([[CX - 380, 1180], [CX - 330, 1100], [CX - 270, 1100], [CX - 270, 1180]], '#b88a52'); fillRR(CX - 250, 1300, 500, 140, 10, '#fff7e0'); text('PET ROCK', CX, 1370, 90, 800, '#7a4a2a', 'center', 0.04); for (let i = 0; i < 8; i++) ellipse(CX - 300 + i * 85, 1250, 11, 11, '#5a3a1f'); });
  const a = appear(t, T.holes, 0.35); if (a > 0) xf(CX, 600, a, 0, () => { banner('AIR HOLES', CX, 600, 100, '#3a1f10', '#f2c84a'); line(CX, 700, CX - 150, 1230, '#3a1f10', 6); });
  const m = appear(t, T.holes + 0.8, 0.35); if (m > 0) xf(CX, 820, m, 0, () => { ctx.save(); ctx.translate(CX + 20, 860); ctx.rotate(0.05); fillRR(-250, -70, 500, 140, 12, '#fff'); fillRR(-250, -70, 20, 140, 6, '#d9462d'); text('TRAINING MANUAL', 10, 3, 52, 800, '#1b1f27', 'center', 0.03); ctx.restore(); });
}
function sceneFour(t) {
  ctx.fillStyle = '#efe6d2'; ctx.fillRect(0, 0, W, 1250); ctx.fillStyle = '#8a7a64'; ctx.fillRect(0, 1250, W, 670);
  for (let r = 0; r < 3; r++) { const y = 980 + r * 280; fillRR(40, y, 1000, 24, 4, '#7a5a3a'); for (let i = 0; i < 6; i++) pbox(120 + i * 165, y, 130, 150, { label: false }); }
  const k = appear(t, T.four - 0.1, 0.45); if (k > 0) xf(CX, 560, k, 0, () => { ctx.save(); ctx.translate(CX, 580); ctx.rotate(-0.05); fillRR(-400, -270, 800, 540, 40, '#fff7e0'); strokeRR(-400, -270, 800, 540, 40, '#d9462d', 12); circle(-340, -210, 18, '#7a4a2a'); text('UNDER', 0, -190, 64, 800, '#7a4a2a', 'center', 0.2); text('$4', 0, 10, 240, 800, '#d9462d', 'center', -0.04); text('EACH', 0, 200, 54, 800, '#7a4a2a', 'center', 0.3); ctx.restore(); });
}
function sceneXmas(t) {
  ctx.fillStyle = vgrad(0, 1250, '#1b2a4a', '#3a4a6a'); ctx.fillRect(0, 0, W, 1250); ctx.fillStyle = '#7a4a34'; ctx.fillRect(0, 1250, W, 670); ctx.fillStyle = 'rgba(0,0,0,0.12)'; ctx.fillRect(0, 1250, W, 30);
  for (let i = 0; i < 50; i++) { const x = (hash(i) * 1200 + t * 20 * (1 + hash(i + 3))) % 1100, y = (hash(i + 7) * 1300 + t * 90 * (0.5 + hash(i + 5))) % 1250; circle(x, y, 3 + hash(i + 2) * 5, 'rgba(255,255,255,0.8)'); }
  shadow(CX, 1450, 340); poly([[CX, 330], [CX - 300, 800], [CX + 300, 800]], '#2f8a4a'); poly([[CX, 560], [CX - 380, 1100], [CX + 380, 1100]], '#2a7a40'); poly([[CX, 800], [CX - 440, 1420], [CX + 440, 1420]], '#246a38'); fillRR(CX - 36, 1420, 72, 80, 4, '#6b4a34'); star(CX, 320, 60, '#f2c84a');
  for (let i = 0; i < 12; i++) circle(CX + (hash(i) - 0.5) * 520 * (0.3 + i / 14), 640 + i * 62, 14, ['#d9462d', '#f2c84a', '#6c8ebf'][i % 3]);
  [[120, 1650, 150], [320, 1650, 130], [760, 1650, 140], [940, 1650, 150]].forEach(([x, y, w], i) => { const e = appear(t, T.gift + i * 0.15, 0.3); if (e > 0) xf(x, y, e, 0, () => pbox(x, y, w, w * 1.05)); });
  const a = appear(t, T.gift, 0.35); if (a > 0) xf(CX, 180, a, 0, () => banner('THE MUST-HAVE GIFT', CX, 160, 76, '#d9462d'));
  const b = appear(t, T.xmas, 0.35); if (b > 0) xf(CX, 290, b, 0, () => banner('CHRISTMAS 1975', CX, 290, 60, '#2a7a40'));
}
function sceneMillion(t) {
  ctx.fillStyle = vgrad(0, H, '#f2dba8', '#d9b878'); ctx.fillRect(0, 0, W, H); const n = 35;
  for (let i = 0; i < n; i++) { const x = 100 + (i % 7) * 146, y = 820 + Math.floor(i / 7) * 150, e = appear(t, T.mil + (i / n) * 2.0, 0.3); if (e > 0) xf(x, y, e, 0, () => pbox(x, y, 110, 120, { label: false })); }
  const a = appear(t, T.mil, 0.4); xf(CX, 400, a, 0, () => { text('1,000,000+', CX, 400, 170, 800, '#7a1f2a', 'center', -0.03); }); const b = appear(t, T.few, 0.35); if (b > 0) xf(CX, 600, b, 0, () => banner('IN A FEW MONTHS', CX, 600, 70, '#3a1f10', '#f2c84a'));
}
function sceneLoved(t) {
  room(t); [[170, 480], [540, 540], [910, 480]].forEach(([x, h], i) => { person(x, 1650, h, 160 + i, { arm: 'phone', shirt: SHIRT[i + 5], skin: SKIN[i + 1], bounce: t * 3 + i, dir: x < 540 ? 1 : x > 540 ? -1 : 1 }); rock(x + (x < 540 ? 130 : x > 540 ? -130 : 150), 1650 - h * 0.4 + 0 + 40, 90, 60, { eyes: true, smile: true }); const e = appear(t, T.loved + 0.2 + i * 0.25, 0.3); if (e > 0) xf(x, 950, e, 0, () => { const hy = 1000 - ((t * 60 + i * 40) % 80); heart(x, hy, 56, '#e0392d'); }); });
  const a = appear(t, T.loved, 0.35), b = appear(t, T.alleg, 0.35); if (a > 0) xf(CX, 400, a, 0, () => banner('EVERYONE LOVED THEIR ROCK', CX, 400, 62, '#7a1f2a')); if (b > 0) xf(CX, 560, b, 0, () => banner('*allegedly', CX, 560, 90, '#3a1f10', '#f2c84a', -0.04));
}
function heart(x, y, s, col) { ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(x, y + s * 0.35); ctx.bezierCurveTo(x - s * 0.8, y - s * 0.3, x - s * 0.3, y - s * 0.8, x, y - s * 0.3); ctx.bezierCurveTo(x + s * 0.3, y - s * 0.8, x + s * 0.8, y - s * 0.3, x, y + s * 0.35); ctx.fill(); }
function sceneNone(t) {
  ctx.fillStyle = '#efe6d2'; ctx.fillRect(0, 0, W, 1250); ctx.fillStyle = '#8a7a64'; ctx.fillRect(0, 1250, W, 670);
  const k = appear(t, T.notone - 0.1, 0.4); xf(CX, 600, 0.7 + 0.3 * k, 0, () => { ctx.globalAlpha = k; fillRR(120, 260, 840, 620, 30, '#fff'); strokeRR(120, 260, 840, 620, 30, '#cbbfa8', 8); text('REVIEWS', CX, 350, 80, 800, '#3a1f10', 'center', 0.1);
    for (let i = 0; i < 5; i++) { star(210 + i * 165, 520, 66, '#e6e0d0'); } text('No reviews yet', CX, 700, 70, 800, '#9a9484', 'center', 0); const d = appear(t, T.review, 0.35); if (d > 0) xf(860, 300, d, 0, () => { circle(860, 300, 70, '#d9462d'); text('0', 860, 305, 90, 800, '#fff', 'center'); }); });
  for (let i = 0; i < 6; i++) { const e = appear(t, T.notone + i * 0.08, 0.3); if (e > 0) xf(110 + i * 170, 1650, e, 0, () => rock(110 + i * 170, 1650, 140 + (i % 3) * 30, 90 + (i % 2) * 30, { eyes: true, seed: i })); }
  const s = appear(t, T.review - 0.1, 0.3); if (s > 0) xf(CX, 1000, s, 0, () => text('…', CX, 1000, 120, 800, 'rgba(58,31,16,0.6)', 'center'));
}
function scenePivot(t) {
  ctx.fillStyle = '#e9dfd0'; ctx.fillRect(0, 0, W, 1250); ctx.fillStyle = '#9a8a74'; ctx.fillRect(0, 1250, W, 670); fillRR(0, 1180, W, 70, 0, '#cbb99d'); fillRR(790, 260, 220, 300, 8, '#cfe7f3');
  person(380, 1650, 560, 9, { skin: '#d9a27a', shirt: '#6c8ebf', pants: '#3d424f', arm: 'phone', bounce: t * 2 });
  const a = appear(t, T.pivot, 0.4); if (a > 0) xf(540, 600, a, 0, () => { thought(540, 640, 330, 170, [400, 1000]); for (let i = 0; i < 5; i++) star(340 + i * 100, 640, 40, i < 5 ? '#f2c84a' : '#e6e0d0'); });
  const b = appear(t, T.unless, 0.35); if (b > 0) xf(700, 900, b, 0, () => banner('UNLESS YOU ASK.', 700, 950, 54, '#2a3a5a'));
  const c = seg(t, T.pivot + 1.2, T.unless); if (c > 0) withFade(c, () => text('(never sent)', 540, 790, 38, 800, 'rgba(60,50,30,0.6)', 'center', 0.04));
}
// ═════════════ the product ═════════════
const REVIEWS = [['Priya S.', 5, 'Friendly and fast. Booked again!', 1], ['Marcus T.', 5, 'Best visit I\'ve had in years.', 2], ['Ava R.', 4, 'Great service, easy to book.', 3], ['Jordan K.', 5, 'Felt looked after the whole way.', 0]];
function sceneRequest(t) {
  stage(t, 0.22);
  withFade(enter(t, T.friendly - 0.05, T.lands, 0.15), () => {
    eyebrow('REVIEW REQUESTS', 300); card(CARD.x, 350, CARD.w, 360);
    const a = ease.out(seg(t, T.friendly, T.friendly + 0.3)); withFade(a, () => { circle(CARD.x + 70, 430, 24, GREEN); check(CARD.x + 70, 431, 24, '#fff', 4.5); text('Visit complete', CARD.x + 116, 430, 34, 800, '#fff', 'left'); text('Priya S. · just now', CARD.x + 116, 475, 24, 500, SOFT, 'left'); ctx.fillStyle = 'rgba(255,255,255,0.08)'; ctx.fillRect(CARD.x + 40, 520, CARD.w - 80, 2); text('Review request', CARD.x + 44, 580, 28, 800, MUTED, 'left', 0.1); tag(CARD.x + CARD.w - 44, 580, 'SENDING', IN.mid, false, 18); text('Sent automatically after the visit', CARD.x + 44, 640, 28, 600, SOFT, 'left'); });
    const b = pop(t, T.visit, 0.35); if (b > 0) xf(CX, 900, clamp(b), 0, () => { tag(CARD.x + CARD.w - 40, 790, 'SMS', IN.mid, false, 18); bubble(CARD.x + 40, 820, CARD.w - 80, ['Thanks for visiting! How did we do?'], false); fillRR(CARD.x + 40, 930, 440, 90, 45, '#fff'); for (let i = 0; i < 5; i++) star(CARD.x + 100 + i * 70, 975, 26, '#f2c84a'); text('Leave a review', CARD.x + CARD.w / 2 + 120, 1070, 28, 800, SOFT, 'center'); });
  });
}
function sceneReviews(t) {
  stage(t, 0.22);
  withFade(enter(t, T.lands - 0.05, T.offer, 0.2), () => {
    eyebrow('REVIEWS', 300); card(CARD.x, 350, CARD.w, 900);
    REVIEWS.forEach(([n, st, q, ci], i) => { const y = 460 + i * 200, e = ease.out(seg(t, T.lands + i * 0.2, T.lands + 0.35 + i * 0.2)); withFade(e, () => { if (i) { ctx.fillStyle = 'rgba(255,255,255,0.07)'; ctx.fillRect(CARD.x + 30, y - 100, CARD.w - 60, 2); } avatar(CARD.x + 76, y - 20, 36, n.slice(0, 2).toUpperCase(), NAMES[ci][1]); text(n, CARD.x + 136, y - 36, 28, 800, '#fff', 'left'); for (let s = 0; s < 5; s++) star(CARD.x + 150 + s * 36, y + 2, 14, s < st ? '#f2c84a' : 'rgba(255,255,255,0.18)'); text(q, CARD.x + 40, y + 52, 26, 500, SOFT, 'left'); }); });
    const o = pop(t, T.one, 0.35); if (o > 0) xf(CX, 1340, clamp(o), 0, () => { const lb = 'Every review, one place', ww = tw(lb, 36, 800) + 110; fillRR(CX - ww / 2, 1290, ww, 96, 48, rgba(IN.mid, 0.18)); strokeRR(CX - ww / 2, 1290, ww, 96, 48, IN.mid, 3); star(CX - ww / 2 + 54, 1338, 24, IN.mid); text(lb, CX - ww / 2 + 94, 1339, 36, 800, '#fff', 'left'); });
  });
}
const SCENES = [[0, T.adman, sceneHook], [T.adman, T.box, sceneAdman], [T.box, T.four, sceneBox], [T.four, T.gift, sceneFour], [T.gift, T.mil, sceneXmas], [T.mil, T.loved, sceneMillion], [T.loved, T.notone, sceneLoved], [T.notone, T.pivot, sceneNone], [T.pivot, T.brand, scenePivot],
  [T.brand, T.friendly, (t) => brandHit(t, T.brand, T.friendly)], [T.friendly, T.lands, sceneRequest], [T.lands, T.offer, sceneReviews], [T.offer, T.end, (t) => offerCard(t, T.offer, T.end)], [T.end, 999, (t) => endCard(t, T.end, T.cta, T.url)]];
cue(0.35, 'swish', 0.7); cue(T.rocks, 'punch', 1); cue(T.adman, 'swish', 0.7); cue(T.pet, 'ding', 1); cue(T.box, 'swoosh', 0.8); cue(T.holes, 'punch', 0.9); cue(T.holes + 0.8, 'tap', 0.8); cue(T.four, 'punch', 1); cue(T.gift, 'ding', 0.9); cue(T.xmas, 'ding', 0.8);
for (let i = 0; i < 8; i++) cue(T.mil + i * 0.25, 'tap', 0.4); cue(T.mil, 'punch', 1); cue(T.few, 'ding', 0.9); cue(T.loved, 'swish', 0.7); cue(T.alleg, 'punch', 0.9); cue(T.notone, 'punch', 1); cue(T.review, 'notification', 1);
cue(T.pivot, 'swish', 0.8); cue(T.unless, 'ding', 1); cue(T.brand, 'transitionHit', 1); cue(T.friendly, 'key', 0.6); cue(T.visit, 'notification', 1); for (let i = 0; i < 4; i++) cue(T.lands + i * 0.2, 'ding', 0.5); cue(T.one, 'ding', 1);
cue(T.offer, 'punch', 1); cue(T.offer + 0.7, 'ding', 0.9); cue(T.end, 'swish', 0.8); cue(T.cta, 'tap', 1.2);
boot({ duration: DURATION, scenes: SCENES, brandAt: T.brand, hideCaption: (t) => t >= T.end - 0.1,
  after: (t) => { const f = 1 - seg(t, T.brand, T.brand + 0.12); if (t >= T.brand && f > 0) { ctx.fillStyle = rgba('#ffffff', 0.5 * f); ctx.fillRect(0, 0, W, H); } } }, 'petrock');
