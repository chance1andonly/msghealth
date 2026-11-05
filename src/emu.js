// MsgHealth · "Emu war" · story-hook vertical ad (1080 × 1920, 30 fps), built on src/kit.js.
// Real story, nudged: in 1932 the Australian army sent soldiers with machine guns against emus and gave up. (The
// one-sentence report and the emu in a general's hat are the absurd parts.) Pivot: most businesses fight problems blind;
// MsgHealth's reports show what's working (revenue, bookings, reviews, who's about to leave). Then the 50% offer.
// Voiceover: assets/audio/emu/vo-NN.wav, timed by VO_AT in src/emu-vo.js.
'use strict';
const word = (l, k) => VO_AT[l] + VO_CLIPS[l].chunks[k][1];
const T = {
  army: word(0, 1), war: word(0, 2), enemy: VO_AT[1], count: word(1, 1), guns: VO_AT[2], split: VO_AT[3], every: word(3, 1), gave: VO_AT[4], won: word(4, 2), report: VO_AT[5], sentence: word(5, 2),
  most: VO_AT[6], blind: VO_AT[7], brand: VO_AT[8], rep: word(8, 1), rev: VO_AT[9], leave: word(9, 2), stop: VO_AT[10], offer: VO_AT[11], end: VO_AT[12] - 0.1, url: VO_AT[12] + 0.1,
};
T.tap = T.end + 1.25;
const DURATION = +(T.tap + 1.0).toFixed(2);
window.CUES = T; window.SFX = []; const cue = (t, kind, gain) => window.SFX.push({ t, kind, gain });
window.MUSIC = { bpm: 108, root: 50, brandAt: T.brand, mood: 'sneaky' };

const HORIZON = 980;
function shadow(x, y, rx) { ellipse(x, y, rx, rx * 0.12, 'rgba(60,30,10,0.25)'); }
function outback(t, sky = ['#f3d79a', '#fbeccf']) {
  ctx.fillStyle = vgrad(0, HORIZON, sky[0], sky[1]); ctx.fillRect(0, 0, W, HORIZON);
  circle(820, 300, 90, '#fff4cf'); glow(820, 300, 360, '#fff1b8', 0.5);
  poly([[-50, HORIZON], [200, 860], [480, 900], [700, HORIZON]], '#d9a06a'); poly([[500, HORIZON], [780, 840], [1000, 880], [1150, HORIZON]], '#cf9460');
  ctx.fillStyle = '#d6a15f'; ctx.fillRect(0, HORIZON, W, H - HORIZON); ctx.fillStyle = 'rgba(150,70,30,0.10)'; ctx.fillRect(0, HORIZON, W, 120); ctx.fillStyle = 'rgba(255,240,200,0.10)'; ctx.fillRect(0, 1500, W, 420);
  for (let i = 0; i < 14; i++) { const y = HORIZON + 30 + hash(i) * 880, x = hash(i + 9) * W, s = 0.4 + (y - HORIZON) / 700; ellipse(x, y, 40 * s, 12 * s, '#7a8a4a'); ellipse(x + 20 * s, y - 8 * s, 28 * s, 10 * s, '#8a9a58'); }
}
const dep = (y) => 0.32 + (y - HORIZON) / 760; // scale by ground depth
function emu(x, y, s, t, id = 0, dir = 1, run = 1, hat = false) { // feet at (x, y); s scales a ~330 px emu
  const ph = t * 14 * run + id * 1.7, bob = Math.abs(Math.sin(ph)) * 10 * run;
  shadow(x, y, 80 * s);
  ctx.save(); ctx.translate(x, y - bob * s); ctx.scale(dir * s, s);
  [-1, 1].forEach((d) => { const sw = Math.sin(ph + (d > 0 ? Math.PI : 0)) * 30 * run; line(d * 18, -110, d * 18 + sw, -8, '#8a7561', 10); line(d * 18 + sw, -8, d * 18 + sw + 24, -4, '#8a7561', 9); });
  ellipse(-4, -150, 82, 58, '#6b5845'); ellipse(-26, -160, 60, 40, '#7d6a56'); for (let i = 0; i < 6; i++) line(-70 + i * 20, -118, -78 + i * 20, -96, '#5a4838', 6); poly([[-78, -170], [-125, -150], [-80, -128]], '#5a4838');
  ctx.strokeStyle = '#8a7561'; ctx.lineWidth = 18; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(48, -176); ctx.quadraticCurveTo(76, -240, 62, -300); ctx.stroke();
  circle(66, -312, 22, '#8a7561'); poly([[84, -318], [122, -308], [84, -302]], '#3d3126'); circle(72, -318, 5, '#1b1410');
  if (hat) { poly([[30, -330], [100, -330], [118, -352], [60, -392], [12, -352]], '#1c2b4a'); fillRR(22, -338, 90, 12, 4, '#d9a52e'); circle(60, -380, 8, '#d9a52e'); }
  ctx.restore();
}
function soldier(x, y, h, t, o = {}) { person(x, y, h, o.seed ?? 2, { skin: '#d9a27a', shirt: '#7a7248', pants: '#5c5a3a', hat: '#6b6035', dir: o.dir ?? 1, arm: o.arm ?? 'down', bounce: o.bounce, mouth: o.mouth, eyes: o.eyes }); }
function gun(x, y, s, t, firing) { // tripod machine gun, base on the ground at (x, y), pointing right
  shadow(x, y, 120 * s); ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  line(0, -120, -70, 0, '#2b2d33', 14); line(0, -120, 70, 0, '#2b2d33', 14); line(0, -120, 0, 0, '#2b2d33', 12);
  fillRR(-60, -170, 180, 60, 12, '#3a3d46'); fillRR(120, -154, 220, 24, 8, '#2b2d33'); fillRR(-20, -210, 90, 40, 8, '#4a4d58');
  if (firing) { const fl = 0.7 + Math.sin(t * 90) * 0.3; poly([[340, -142], [430, -170 * fl], [400, -142], [430, -112 * fl]], '#ffd45e'); }
  ctx.restore();
}
function dust(x, y, t, n = 5) { for (let i = 0; i < n; i++) { const k = ((t * 0.9 + i / n) % 1), r = 20 + k * 60; circle(x - k * 140 - i * 10, y - k * 40, r, `rgba(214,170,110,${0.5 * (1 - k)})`); } }

function sceneMarch(t) {
  outback(t);
  text('1932', CX, 330, 190, 800, 'rgba(90,50,20,0.9)', 'center', -0.02);
  const k = ease.out(seg(t, 0, 1.2)); for (let i = 0; i < 4; i++) { const x = lerp(-250, 160 + i * 230, k) + Math.sin(t * 3) * 3, y = 1380 + (i % 2) * 40; dust(x - 50, y, t + i, 3); soldier(x, y, 380, t, { bounce: t * 8 + i, seed: 20 + i }); line(x + 30, y - 280, x + 120, y - 420, '#2b2d33', 10); }
}
function sceneFlock(t) {
  outback(t);
  const list = []; for (let i = 0; i < 30; i++) list.push({ x: 60 + hash(i) * 960, y: 1060 + hash(i + 7) * 680, id: i }); list.sort((a, b) => a.y - b.y);
  const k = ease.out(seg(t, T.enemy, T.enemy + 1.0)); list.forEach((e) => emu(lerp(e.x + 800, e.x, k) + Math.sin(t * 2 + e.id) * 6, e.y, dep(e.y), t, e.id, -1, 0.0));
  const b = pop(t, T.count, 0.35); if (b > 0) xf(CX, 460, b, 0, () => { fillRR(140, 340, 800, 240, 36, '#fff'); strokeRR(140, 340, 800, 240, 36, '#8a5f3a', 10); text('20,000', CX, 440, 140, 800, '#1b1f27', 'center', -0.02); text('EMUS', CX, 540, 60, 800, '#8a5f3a', 'center', 0.2); });
}
function sceneGuns(t) {
  outback(t);
  [0, 1, 2, 3, 4, 5, 6, 7].forEach((i) => emu(1000 - ((t * 120 + i * 130) % 1100) + 100, 1120 + (i % 3) * 36, dep(1120 + (i % 3) * 36), t, i, -1, 1));
  const fire = t > T.guns + 0.4; soldier(250, 1620, 560, t, { arm: 'up', mouth: 'open', eyes: 'wide', seed: 31 }); gun(430, 1640, 1.45, t, fire);
  if (fire) { const s = 0.9 + 0.1 * Math.sin(t * 40); xf(760, 760, s, 0, () => text('RAT-A-TAT', 760, 760, 84, 800, '#b3261e', 'center', 0.02)); }
}
function sceneScatter(t) {
  outback(t);
  const k = seg(t, T.split - 0.2, T.split + 2.2), list = []; for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2, d = ease.out(k) * (260 + hash(i) * 300); list.push({ x: CX + Math.cos(a) * d * 1.6, y: 1280 + Math.sin(a) * d * 0.7 + (hash(i + 4) - 0.5) * 80, a, id: i }); }
  list.sort((a, b) => a.y - b.y).forEach((e) => { const y = clamp(e.y, 1050, 1760); emu(e.x, y, dep(y), t, e.id, Math.cos(e.a) >= 0 ? 1 : -1, k > 0 && k < 1 ? 1.2 : 0.2); });
  soldier(CX, 1790, 470, t, { eyes: 'wide', arm: 'wave', seed: 41 }); const q = pop(t, T.every, 0.3); if (q > 0) xf(CX, 1260, q, 0, () => { fillRR(CX - 80, 1190, 160, 120, 30, '#fff'); text('?!', CX, 1252, 80, 800, '#b3261e', 'center'); });
}
function sceneLeave(t) {
  outback(t);
  ctx.fillStyle = '#b98a58'; ctx.fillRect(0, 1450, W, 150);
  const x = lerp(250, 1500, ease.in(seg(t, T.gave, T.gave + 2.2))); dust(x - 160, 1580, t, 6); shadow(x, 1600, 260);
  ctx.save(); ctx.translate(x, 1600); fillRR(-240, -150, 300, 110, 12, '#7a7248'); fillRR(60, -200, 150, 160, 16, '#6b6035'); fillRR(100, -180, 80, 60, 6, '#9fd3f0'); fillRR(-240, -60, 450, 30, 8, '#3a3d46'); [-160, 130].forEach((wx) => { circle(wx, -30, 50, '#1b1b1f'); circle(wx, -30, 20, '#9aa1a8'); }); ctx.restore();
  const hill = pop(t, T.won - 0.3, 0.4); poly([[560, 1450], [800, 1180], [1080, 1450]], '#c99356'); emu(830, 1230, 1.15 * clamp(hill), t, 3, -1, 0.1, true);
  const b = pop(t, T.won, 0.35); if (b > 0) xf(CX, 560, b, 0, () => { fillRR(150, 440, 780, 220, 30, '#fff'); text('EMUS 1 · ARMY 0', CX, 550, 78, 800, '#1b1f27', 'center', -0.01); });
}
function sceneReport(t) {
  ctx.fillStyle = '#5a3a24'; ctx.fillRect(0, 0, W, H); for (let i = 0; i < 12; i++) { ctx.fillStyle = 'rgba(0,0,0,0.12)'; ctx.fillRect(0, i * 170, W, 5); }
  ctx.save(); ctx.translate(CX, 840); ctx.rotate(-0.03); ctx.shadowColor = 'rgba(0,0,0,0.4)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 14; fillRR(-370, -540, 740, 1080, 8, '#f6efe0'); ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
  text('OFFICIAL REPORT', 0, -450, 52, 800, '#3a3a4a', 'center', 0.1); ctx.fillStyle = '#c9bda5'; for (let i = 0; i < 5; i++) ctx.fillRect(-300, -350 + i * 46, 600 - (i === 4 ? 260 : 0), 14);
  const q = seg(t, T.report + 1.0, T.sentence + 1.4), s1 = '"We did not see', s2 = 'this coming."'; const all = s1.length + s2.length, n = Math.floor(q * all);
  text(s1.slice(0, Math.min(s1.length, n)), -300, 0, 66, 800, '#1b1f27', 'left', 0); if (n > s1.length) text(s2.slice(0, n - s1.length), -300, 90, 66, 800, '#b3261e', 'left', 0);
  ctx.restore();
  fillRR(110, 1390, 160, 110, 14, '#f6efe0'); ellipse(190, 1390, 80, 20, '#d9c9a5'); ellipse(190, 1390, 62, 12, '#8a5f3a'); for (let i = 0; i < 3; i++) { const k = (t * 0.6 + i / 3) % 1; ctx.strokeStyle = `rgba(255,255,255,${0.5 * (1 - k)})`; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(160 + i * 30, 1360 - k * 100); ctx.quadraticCurveTo(170 + i * 30, 1330 - k * 100, 160 + i * 30, 1300 - k * 100); ctx.stroke(); }
  ctx.save(); ctx.translate(800, 1440); ctx.rotate(-0.2); fillRR(-90, -10, 330, 18, 9, '#243a8a'); poly([[-90, -10], [-130, -1], [-90, 8]], '#222'); ctx.restore();
}
function sceneBlind(t) {
  ctx.fillStyle = vgrad(0, 1300, '#cfe6f5', '#eaf5fb'); ctx.fillRect(0, 0, W, 1300); ctx.fillStyle = '#b9a07a'; ctx.fillRect(0, 1300, W, 620); ctx.fillStyle = '#a58c66'; ctx.fillRect(0, 1300, W, 14);
  fillRR(0, 560, W, 30, 0, '#9aa7b0'); ctx.fillStyle = '#e8dcc8'; ctx.fillRect(0, 590, W, 710);
  const sw = Math.sin(t * 5) * 0.9; person(380, 1620, 760, 12, { skin: '#d9a27a', shirt: '#4a6fa5', pants: '#2c3340', arm: 'up', wave: t * 0.6, hairStyle: 'none' });
  fillRR(330, 920, 150, 36, 10, '#16161c'); // blindfold across the eyes
  ctx.save(); ctx.translate(560, 1010); ctx.rotate(-0.9 + sw); fillRR(0, -12, 340, 24, 12, '#8a5f3a'); fillRR(250, -22, 120, 44, 14, '#6b4a34'); ctx.restore();
  [[840, 1350, 0], [700, 1450, 1.4], [930, 1520, 2.6]].forEach(([x, y, id]) => { const dodge = Math.max(0, Math.sin(t * 5 + id)) * 40; emu(x, y - dodge * 0.3, 0.55, t, id, -1, 0.15); });
  const b = pop(t, T.blind, 0.3); if (b > 0) xf(CX, 460, b, 0, () => text('BLIND.', CX, 460, 190, 800, '#b3261e', 'center', -0.02));
}
// ═════════════ the product ═════════════
function sceneBoard(t) {
  stage(t, 0.2);
  withFade(enter(t, T.rep - 0.1, T.stop, 0.2), () => {
    eyebrow('REPORTS', 330);
    const tiles = [['REVENUE', '$12.4k', GREEN, T.rep], ['BOOKINGS', '186', IN.mid, T.rev], ['REVIEWS', '4.9 ★', AMBER, T.rev + 0.55], ['AT RISK', '3', RED, T.leave]];
    tiles.forEach(([n, v, col, at], i) => { const c = i % 2, r = Math.floor(i / 2), x = CARD.x + c * 450, y = 380 + r * 210, k = pop(t, at, 0.3), on = k > 0.1;
      fillRR(x, y, 430, 190, 26, on ? rgba(col, 0.12) : 'rgba(255,255,255,0.04)'); strokeRR(x, y, 430, 190, 26, on ? rgba(col, 0.7) : 'rgba(255,255,255,0.1)', on ? 3 : 2); text(n, x + 30, y + 50, 22, 800, on ? col : MUTED, 'left', 0.16); xf(x + 30, y + 124, 0.8 + 0.2 * clamp(k), 0, () => text(on ? v : '—', x + 30, y + 122, 66, 800, '#fff', 'left', -0.02)); });
    card(CARD.x, 820, CARD.w, 520); text('THIS MONTH', CARD.x + 40, 880, 22, 800, MUTED, 'left', 0.2);
    const g = ease.out(seg(t, T.rep + 0.2, T.rev + 0.8)); ctx.strokeStyle = GREEN; ctx.lineWidth = 8; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.beginPath();
    for (let i = 0; i <= 12 * g; i++) { const x = CARD.x + 50 + i * 64, y = 1280 - i * 22 - Math.sin(i * 1.7) * 36; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke();
    const em = pop(t, T.stop + 0.2, 0.35); if (em > 0) xf(930, 1230, em, 0, () => emu(930, 1330, 0.5, t, 2, -1, 0, true)); const by = pop(t, T.stop + 0.5, 0.3); if (by > 0) xf(800, 1010, by, 0, () => { fillRR(720, 970, 160, 64, 32, '#fff'); text('Bye!', 800, 1003, 34, 800, '#1b1f27', 'center'); });
  });
}
const SCENES = [[0, T.enemy, sceneMarch], [T.enemy, T.guns, sceneFlock], [T.guns, T.split, sceneGuns], [T.split, T.gave, sceneScatter], [T.gave, T.report, sceneLeave], [T.report, T.most, sceneReport], [T.most, T.brand, sceneBlind],
  [T.brand, T.rep, (t) => brandHit(t, T.brand, T.rep)], [T.rep, T.offer, sceneBoard], [T.offer, T.end, (t) => offerCard(t, T.offer, T.end)], [T.end, 999, (t) => endCard(t, T.end, T.tap, T.url)]];
cue(0.2, 'swoosh', 0.7); cue(T.enemy, 'swish', 0.8); cue(T.count, 'punch', 0.9); cue(T.guns, 'swoosh', 0.8); for (let i = 0; i < 6; i++) cue(T.guns + 0.4 + i * 0.22, 'tap', 0.7); cue(T.split, 'swish', 0.8); cue(T.every, 'notification', 0.8); cue(T.gave, 'swoosh', 0.8); cue(T.won, 'punch', 1);
cue(T.report, 'swish', 0.7); for (let i = 0; i < 6; i++) cue(T.report + 1.0 + i * 0.3, 'key', 0.45); cue(T.most, 'swish', 0.7); cue(T.blind, 'punch', 1); cue(T.brand, 'transitionHit', 1); cue(T.rep, 'key', 0.8); cue(T.rev, 'key', 0.8); cue(T.rev + 0.55, 'key', 0.8); cue(T.leave, 'ding', 0.9); cue(T.stop + 0.2, 'swish', 0.8);
cue(T.offer, 'punch', 1); cue(T.offer + 0.7, 'ding', 0.9); cue(T.end, 'swish', 0.8); cue(T.tap, 'tap', 1.2);
boot({ duration: DURATION, scenes: SCENES, brandAt: T.brand, hideCaption: (t) => t >= T.end - 0.1,
  after: (t) => { const f = 1 - seg(t, T.brand, T.brand + 0.12); if (t >= T.brand && f > 0) { ctx.fillStyle = rgba('#ffffff', 0.5 * f); ctx.fillRect(0, 0, W, H); } } }, 'emu');
