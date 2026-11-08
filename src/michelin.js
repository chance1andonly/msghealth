// MsgHealth · "Free guidebook" · story-hook vertical ad (1080 × 1920, 30 fps), built on src/kit.js + src/audit.js.
// Real story: in 1900 France had very few cars; Michelin gave drivers a free guide to get them driving (and buying tires). The
// founder reportedly saw a dealer propping up a workbench with copies, so they started charging in 1920; stars arrived in 1926.
// Pivot: stars decide where people go; happy customers rarely leave a review unless asked. MsgHealth's review requests ask after
// every visit. Offer: free retention audit, comment KEEP. Voiceover: assets/audio/michelin/vo-NN.wav. Product names/numbers are illustrative.
'use strict';
const word = (l, k) => VO_AT[l] + VO_CLIPS[l].chunks[k][1];
const T = { cars: word(0, 2), book: VO_AT[1], free: word(1, 1), bench: VO_AT[2], prop: word(2, 2), charge: VO_AT[3], stars: VO_AT[4], star1: word(4, 1), single: VO_AT[5], decide: VO_AT[6], rarely: VO_AT[7],
  brand: VO_AT[8], req: VO_AT[9], five: VO_AT[10], ask: VO_AT[11], cmt: VO_AT[12], end: VO_AT[13] - 0.1, url: VO_AT[13] + 0.1 };
T.cta = T.end + 1.25;
const DURATION = +(T.cta + 1.0).toFixed(2);
window.CUES = T; window.SFX = []; const cue = (t, kind, gain) => window.SFX.push({ t, kind, gain });
window.MUSIC = { bpm: 100, root: 48, brandAt: T.brand, mood: 'quirky', bed: false, fx: 0.5 };

const GR = 1150;
function sky(t) { ctx.fillStyle = vgrad(0, GR, '#f5e6c4', '#e9c98b'); ctx.fillRect(0, 0, W, GR); cloud(80 + (t * 12) % 200, 240, 1.0, 'rgba(255,255,255,0.8)'); cloud(620 - (t * 8) % 150, 420, 0.8, 'rgba(255,255,255,0.7)');
  poly([[0, GR], [0, 880], [300, 800], [620, 900], [1080, 780], [1080, GR]], '#c9b07a'); ctx.fillStyle = '#9a7b4f'; ctx.fillRect(0, GR, W, H - GR); poly([[0, GR + 70], [W, GR + 70], [W, GR + 260], [0, GR + 260]], '#b8956a'); ctx.fillStyle = 'rgba(255,255,255,0.35)'; for (let i = 0; i < 8; i++) ctx.fillRect(i * 160 - ((t * 120) % 160), GR + 160, 80, 10); }
function car(x, y, s, col = '#2a4a8a', t = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ellipse(0, 6, 190, 18, 'rgba(0,0,0,0.2)');
  fillRR(-170, -120, 340, 80, 20, col); poly([[-90, -120], [-60, -200], [90, -200], [110, -120]], col); poly([[-70, -125], [-50, -185], [30, -185], [30, -125]], '#cfe6f3'); poly([[45, -125], [45, -185], [82, -185], [98, -125]], '#cfe6f3'); fillRR(-185, -90, 40, 24, 8, '#d8d2c2');
  [-100, 100].forEach((wx) => { circle(wx, -30, 52, '#1b1b20'); circle(wx, -30, 24, '#c9c3b5'); line(wx, -30, wx + Math.cos(t * 9) * 22, -30 + Math.sin(t * 9) * 22, '#6b6a70', 4); }); ctx.restore();
}
function book(x, y, s, label = true, rot = 0) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); fillRR(-120, -160, 240, 320, 12, '#c8281e'); fillRR(-120, -160, 26, 320, 8, '#8f1b14'); if (label) { text('GUIDE', 10, -60, 52, 800, '#ffd84d', 'center', 0.04); text('MICHELIN', 10, 10, 34, 800, '#fff', 'center', 0.1); } ctx.restore(); }
function tire(x, y, r) { circle(x, y, r, '#1b1b20'); circle(x, y, r * 0.55, '#6b6a70'); circle(x, y, r * 0.22, '#c9c3b5'); }
function sceneRoad(t) {
  sky(t); text('1900', CX, 230, 160, 800, 'rgba(70,45,20,0.85)', 'center', -0.02);
  car(lerp(-300, 1500, seg(t, 0, T.book + 1.5)), GR + 150, 1.0, '#2a4a8a', t);
  const k = pop(t, T.cars - 0.1, 0.4); if (k > 0) xf(CX, 640, clamp(k), 0, () => { text('~3,000', CX, 620, 200, 800, '#fff', 'center', -0.03); text('CARS IN ALL OF FRANCE', CX, 740, 38, 800, '#fff', 'center', 0.12); });
}
function sceneGuide(t) {
  sky(t); [[170, 1130, 90], [170, 1030, 90], [170, 930, 90]].forEach(([x, y, r], i) => { const e = pop(t, T.book + 0.6 + i * 0.15, 0.3); if (e > 0) xf(x, y, clamp(e), 0, () => tire(x, y + 40, r)); });
  const b = pop(t, T.book + 0.1, 0.45); xf(CX + 60, 760, clamp(b), 0, () => { shadow2(CX + 60, 1080, 200); book(CX + 60, 760, 1.5, true, Math.sin(t * 2) * 0.03); });
  const f = pop(t, T.free, 0.3); if (f > 0) xf(CX + 250, 450, clamp(f), 0, () => { ctx.save(); ctx.translate(CX + 250, 450); ctx.rotate(0.2); fillRR(-130, -60, 260, 120, 22, '#fff'); text('FREE', 0, 4, 90, 800, '#b3261e', 'center', 0); ctx.restore(); });
  person(840, 1330, 330, 11, { skin: '#d9a27a', shirt: '#6a4a2a', pants: '#3d3a30', hat: '#2b2b30', dir: -1, arm: 'phone', noShadow: true });
}
function shadow2(x, y, rx) { ellipse(x, y, rx, rx * 0.1, 'rgba(0,0,0,0.22)'); }
function sceneBench(t) {
  ctx.fillStyle = '#d7c7a6'; ctx.fillRect(0, 0, W, 1250); ctx.fillStyle = '#8b7355'; ctx.fillRect(0, 1250, W, 670); fillRR(70, 260, 280, 220, 8, '#cfe7f3'); strokeRR(70, 260, 280, 220, 8, '#6b5a44', 10);
  // workbench: the right-hand leg is short and propped up on two guidebooks
  fillRR(330, 1000, 420, 44, 8, '#8a6a43'); fillRR(350, 1044, 40, 206, 4, '#6e5333'); fillRR(690, 1044, 40, 160, 4, '#6e5333');
  const pr = pop(t, T.prop - 0.2, 0.4); if (pr > 0) xf(710, 1226, clamp(pr), 0, () => { fillRR(640, 1204, 140, 24, 4, '#c8281e'); fillRR(646, 1228, 128, 22, 4, '#a31f17'); });
  person(170, 1500, 520, 34, { skin: '#d9a27a', shirt: '#b5654a', pants: '#3d3a30', hat: '#6b6a70', dir: 1, arm: 'wave', wave: t, mouth: 'open' });
  person(930, 1500, 560, 8, { skin: '#c68a62', shirt: '#2a4a8a', pants: '#2c3340', hat: '#2b2b30', dir: -1, eyes: 'wide', bounce: t * 4 });
  const n = pop(t, T.bench + 0.1, 0.3); if (n > 0 && t < T.prop) xf(330, 780, clamp(n), 0, () => { fillRR(130, 700, 400, 120, 34, '#fff'); text('Meh. Free book.', 330, 762, 40, 800, '#1b1f27', 'center'); });
  const q = pop(t, T.prop, 0.3); if (q > 0) xf(700, 800, clamp(q), 0, () => { fillRR(540, 720, 470, 120, 34, '#fff'); text('…a workbench?!', 775, 782, 42, 800, '#b3261e', 'center'); });
}
function sceneCharge(t) {
  sky(t); text('1920', CX, 230, 160, 800, 'rgba(70,45,20,0.85)', 'center', -0.02);
  const b = pop(t, T.charge, 0.4); xf(CX, 780, clamp(b), 0, () => { shadow2(CX, 1080, 220); book(CX, 760, 1.6); });
  const k = pop(t, T.charge + 0.6, 0.35); if (k > 0) xf(CX + 250, 520, clamp(k), 0, () => { ctx.save(); ctx.translate(CX + 270, 520); ctx.rotate(0.18); fillRR(-170, -64, 340, 128, 24, '#fff'); strokeRR(-170, -64, 340, 128, 24, '#b3261e', 6); text('NOT FREE', 0, 4, 66, 800, '#b3261e', 'center', 0); ctx.restore(); });
}
function sceneStars(t) {
  sky(t); text('1926', CX, 230, 160, 800, 'rgba(70,45,20,0.85)', 'center', -0.02); xf(CX, 760, 1, 0, () => { book(CX, 780, 1.5); });
  [0, 1, 2].forEach((i) => { const e = pop(t, T.star1 + i * 0.18, 0.35); if (e > 0) xf(CX - 190 + i * 190, 480, clamp(e), 0, () => { glow(CX - 190 + i * 190, 480, 170, '#ffd84d', 0.5); star(CX - 190 + i * 190, 480, 90, '#ffd84d'); }); });
}
function sceneRestaurant(t) {
  sky(t); fillRR(220, 560, 640, 600, 6, '#f1e3c8'); fillRR(180, 520, 720, 80, 6, '#b3261e'); for (let i = 0; i < 8; i++) poly([[180 + i * 90, 600], [270 + i * 90, 600], [225 + i * 90, 660]], i % 2 ? '#fff' : '#b3261e'); fillRR(600, 760, 190, 400, 6, '#6b4a34'); fillRR(280, 760, 260, 220, 6, '#cfe7f3'); strokeRR(280, 760, 260, 220, 6, '#8a7a64', 8);
  const s = pop(t, T.single - 0.05, 0.4); if (s > 0) xf(540, 420, clamp(s), 0, () => { glow(540, 420, 260, '#ffd84d', 0.5); star(540, 420, 120, '#ffd84d'); });
  [0, 1, 2, 3, 4].forEach((i) => { const x = lerp(1250 + i * 110, 700 + i * 90 + (i > 2 ? 40 : 0), ease.out(seg(t, T.single + 0.3 + i * 0.2, T.single + 1.1 + i * 0.2))); person(x, 1360 + (i % 2) * 40, 300 - (i % 2) * 20, 70 + i, { dir: -1, arm: i == 2 ? 'phone' : 'down', bounce: t * 6 + i }); });
}
function sceneStarsDecide(t) {
  ctx.fillStyle = vgrad(0, H, '#0f1930', '#2d4270'); ctx.fillRect(0, 0, W, H);
  phone(250, 250, 580, 1000, '#f4f1ea', () => { fillRR(0, 0, 580, 150, 0, '#fff'); text("Sam's Studio", 40, 90, 40, 800, '#1e1b4b', 'left');
    const e = pop(t, T.decide + 0.2, 0.3); [0, 1, 2, 3, 4].forEach((i) => star(60 + i * 56, 215, 24, i < 4 ? '#ffb400' : '#d6d3cc'));
    text('4.1', 400, 215, 44, 800, '#1e1b4b', 'left'); text('(12 reviews)', 480, 218, 20, 600, '#6b6a80', 'left');
    [['Waited too long', 1, 0.5], ['Rude. Never again.', 1, 1.1]].forEach(([s, n, d], i) => { const r = pop(t, T.decide + d, 0.3); if (r > 0) xf(290, 340 + i * 190, clamp(r), 0, () => { fillRR(30, 290 + i * 190, 520, 150, 20, '#fff'); [0, 1, 2, 3, 4].forEach((k) => star(70 + k * 36, 330 + i * 190, 14, k < n ? '#ffb400' : '#d6d3cc')); text(s, 50, 390 + i * 190, 30, 700, '#1e1b4b', 'left'); }); });
  });
  withFade(seg(t, T.rarely, T.rarely + 0.3), () => { [0, 1, 2, 3, 4].forEach((i) => { const x = 130 + i * 205; circle(x, 1385, 52, rgba('#ffffff', 0.12)); ctx.beginPath(); ctx.arc(x, 1392, 26, 0.15, Math.PI - 0.15); ctx.strokeStyle = '#fff'; ctx.lineWidth = 5; ctx.stroke(); circle(x - 15, 1370, 5, '#fff'); circle(x + 15, 1370, 5, '#fff'); }); text('HAPPY, AND SILENT', CX, 1305, 34, 800, ACCENT, 'center', 0.2); });
}
function sceneReview(t) {
  stage(t, 0.22); eyebrow('REVIEW REQUESTS', 290);
  const a = ease.out(seg(t, T.req, T.req + 0.35)), b = pop(t, T.req + 0.6, 0.3), c = pop(t, T.req + 1.5, 0.3), done = seg(t, T.five, T.five + 0.3);
  withFade(a * (1 - done), () => { card(CARD.x, 340, CARD.w, 160); circle(CARD.x + 76, 420, 34, rgba(GREEN, 0.25)); check(CARD.x + 76, 421, 34, GREEN, 5); text('Visit complete', CARD.x + 136, 404, 34, 800, '#fff', 'left'); text('Jordan K. · Thu 10:00', CARD.x + 136, 448, 24, 500, SOFT, 'left');
    if (b > 0) xf(CX, 620, clamp(b), 0, () => bubble(140, 560, 800, ['Thanks for coming in, Jordan!', 'Mind leaving us a review?'], false)); if (c > 0) xf(CX, 840, clamp(c), 0, () => { fillRR(190, 770, 700, 110, 55, C.primary); text('Leave a review ★', CX, 826, 40, 800, '#fff', 'center'); }); });
  withFade(done, () => { card(CARD.x, 340, CARD.w, 560); [0, 1, 2, 3, 4].forEach((i) => { const e = pop(t, T.five + 0.15 + i * 0.15, 0.3); xf(210 + i * 165, 470, clamp(e), 0, () => star(210 + i * 165, 470, 70, '#ffb400')); });
    text('Jordan K.', 160, 640, 36, 800, '#fff', 'left'); text('“Best cut in town. See you Thursday!”', 160, 710, 32, 500, SOFT, 'left'); const r = pop(t, T.five + 1.0, 0.3); if (r > 0) xf(CX, 840, clamp(r), 0, () => { const s = 'NEW 5-STAR REVIEW', w = tw(s, 28, 800, 0.1) + 80; fillRR(CX - w / 2, 800, w, 80, 40, rgba(GREEN, 0.2)); strokeRR(CX - w / 2, 800, w, 80, 40, GREEN, 3); text(s, CX, 841, 28, 800, '#9ff0c0', 'center', 0.1); }); });
}
const SCENES = [[0, T.book, sceneRoad], [T.book, T.bench, sceneGuide], [T.bench, T.charge, sceneBench], [T.charge, T.stars, sceneCharge], [T.stars, T.single, sceneStars], [T.single, T.decide, sceneRestaurant], [T.decide, T.brand, sceneStarsDecide],
  [T.brand, T.req, (t) => brandHit(t, T.brand, T.req)], [T.req, T.ask, sceneReview], [T.ask, T.end, sceneAudit], [T.end, 999, (t) => auditEnd(t, T.end, T.cta, T.url)]];
cue(T.cars, 'punch', 0.9); cue(T.book, 'swish', 0.7); cue(T.free, 'ding', 0.8); cue(T.bench, 'swish', 0.7); cue(T.prop, 'punch', 1); cue(T.charge, 'punch', 0.9); cue(T.charge + 0.6, 'ding', 0.8); cue(T.star1, 'ding', 0.9); cue(T.star1 + 0.18, 'ding', 0.8); cue(T.star1 + 0.36, 'ding', 0.8);
cue(T.single - 0.05, 'ding', 1); cue(T.decide, 'swish', 0.7); cue(T.decide + 0.5, 'notification', 0.7); cue(T.decide + 1.1, 'notification', 0.7); cue(T.rarely, 'transition', 0.7);
cue(T.brand, 'transitionHit', 1); cue(T.req + 0.6, 'notification', 0.9); cue(T.req + 1.5, 'tap', 0.8); for (let i = 0; i < 5; i++) cue(T.five + 0.15 + i * 0.15, 'ding', 0.6); cue(T.five + 1.0, 'notification', 0.9);
cue(T.ask, 'punch', 1); for (let i = 0; i < 4; i++) cue(T.cmt + 0.45 + i * 0.11, 'key', 0.6); cue(T.cmt + 1.0, 'ding', 0.9); cue(T.end, 'swish', 0.8); cue(T.cta, 'tap', 1.2);
boot({ duration: DURATION, scenes: SCENES, brandAt: T.brand, hideCaption: (t) => t >= T.end - 0.1,
  after: (t) => { const f = 1 - seg(t, T.brand, T.brand + 0.12); if (t >= T.brand && f > 0) { ctx.fillStyle = rgba('#ffffff', 0.5 * f); ctx.fillRect(0, 0, W, H); } } }, 'michelin');
