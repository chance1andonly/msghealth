// MsgHealth · "Rat tails" · story-hook vertical ad (1080 × 1920, 30 fps), built on src/kit.js.
// Real story, nudged: in 1902 Hanoi paid a bounty of a cent per rat tail; hunters cut off tails and released the rats, and some
// started breeding rats for the bounty. (The rats giving the program five stars is the absurd part.) Pivot: you get what you
// reward. MsgHealth runs your loyalty program (visits earn points, regulars unlock rewards automatically) and shows who's
// slipping before they leave. Then the 50%-off-first-month offer. Voiceover: assets/audio/rats/vo-NN.wav (src/rats-vo.js).
'use strict';
const word = (l, k) => VO_AT[l] + VO_CLIPS[l].chunks[k][1];
const T = {
  hanoi: word(0, 1), problem: word(0, 1) + 0.6, bounty: VO_AT[1], tail: word(1, 1), pour: VO_AT[2], still: word(2, 1), cut: VO_AT[3], go: word(3, 1), breed: VO_AT[4], stars: VO_AT[5], five: word(5, 1),
  reward: VO_AT[6], back: VO_AT[7], once: word(7, 1), brand: VO_AT[8], loyal: word(8, 1), visit: VO_AT[9], unlock: word(9, 1), slip: VO_AT[10], offer: VO_AT[11], end: VO_AT[12] - 0.1, url: VO_AT[12] + 0.1,
};
T.cta = T.end + 1.25;
const DURATION = +(T.cta + 1.0).toFixed(2);
window.CUES = T; window.SFX = []; const cue = (t, kind, gain) => window.SFX.push({ t, kind, gain });
window.MUSIC = { bpm: 100, root: 52, brandAt: T.brand, mood: 'sneaky' };

function shadow(x, y, rx) { ellipse(x, y, rx, rx * 0.12, 'rgba(60,40,10,0.28)'); }
const GR = 1060;
function street(t) {
  ctx.fillStyle = vgrad(0, GR, '#f6dba0', '#fbeed1'); ctx.fillRect(0, 0, W, GR);
  for (let i = 0; i < 3; i++) { const x = -20 + i * 370; fillRR(x, 420, 340, GR - 420, 2, ['#e8b84a', '#e3a63f', '#eec35a'][i]); poly([[x - 16, 430], [x + 170, 330], [x + 356, 430]], '#b5502f'); for (let k = 0; k < 2; k++) { fillRR(x + 50 + k * 170, 560, 90, 200, 4, '#3f6b4a'); line(x + 95 + k * 170, 560, x + 95 + k * 170, 760, '#2e4f36', 4); } fillRR(x + 20, 800, 300, 20, 2, 'rgba(0,0,0,0.1)'); }
  ctx.fillStyle = '#c9a26a'; ctx.fillRect(0, GR, W, H - GR); ctx.fillStyle = 'rgba(120,70,20,0.10)'; ctx.fillRect(0, GR, W, 100); ctx.fillStyle = 'rgba(255,240,200,0.10)'; ctx.fillRect(0, 1580, W, 340);
  for (let i = 0; i < 16; i++) { const y = GR + 40 + hash(i) * 800, x = hash(i + 9) * W; ellipse(x, y, 30 + (y - GR) * 0.06, 8, 'rgba(120,80,30,0.14)'); }
}
function rat(x, y, s, t, id = 0, dir = 1, run = 1, tail = true) { // feet at (x, y); about 150 px long at s = 1
  const ph = t * 16 * run + id * 1.9, bob = Math.abs(Math.sin(ph)) * 6 * run * s;
  shadow(x, y, 70 * s); ctx.save(); ctx.translate(x, y - bob); ctx.scale(dir * s, s);
  if (tail) { ctx.strokeStyle = '#e8b0b0'; ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-60, -34); ctx.quadraticCurveTo(-120, -10 + Math.sin(ph) * 14, -150, -52 + Math.sin(ph * 0.7) * 10); ctx.stroke(); } else circle(-60, -34, 7, '#d9908f');
  [-30, 20].forEach((lx, i) => { const sw = Math.sin(ph + i * Math.PI) * 14 * run; line(lx, -14, lx + sw, 0, '#6a6a72', 8); });
  ellipse(0, -40, 66, 38, '#7a7a82'); ellipse(52, -44, 34, 26, '#8a8a92'); circle(86, -42, 8, '#e88f98'); circle(60, -56, 5, '#1b1410'); ellipse(34, -72, 14, 16, '#c98a92'); ctx.restore();
}
function hunter(x, y, h, t, id, o = {}) {
  person(x, y, h, id, { skin: ['#c68a62', '#d9a27a', '#a86c48'][id % 3], shirt: ['#6a8a3a', '#9a7a3a', '#5a7a9a'][id % 3], pants: '#3d3a30', dir: o.dir ?? 1, arm: o.arm ?? 'down', wave: t, bounce: o.bounce, mouth: o.mouth, hairStyle: 'none', noShadow: o.noShadow });
  const hr = h * 0.095, hy = y - h + hr; poly([[x - hr * 2.1, hy - hr * 0.1], [x + hr * 2.1, hy - hr * 0.1], [x, hy - hr * 2.5]], '#ecd58a'); line(x - hr * 2.1, hy - hr * 0.1, x + hr * 2.1, hy - hr * 0.1, '#b79a4a', 4);
}
function tailShape(x, y, s, rot = 0) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.strokeStyle = '#e8b0b0'; ctx.lineWidth = 8 * s; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-50 * s, 0); ctx.quadraticCurveTo(-10 * s, -26 * s, 20 * s, 0); ctx.quadraticCurveTo(40 * s, 14 * s, 54 * s, -6 * s); ctx.stroke(); ctx.restore(); }

function sceneRats(t) {
  street(t); text('1902', CX, 190, 150, 800, 'rgba(90,50,20,0.9)', 'center', -0.02);
  const list = []; for (let i = 0; i < 14; i++) list.push({ x: ((hash(i) * 1400 + t * (120 + hash(i + 3) * 160) * (i % 2 ? -1 : 1)) % 1400 + 1400) % 1400 - 160, y: 1200 + hash(i + 5) * 560, id: i, dir: i % 2 ? -1 : 1 }); list.sort((a, b) => a.y - b.y);
  const k = ease.out(seg(t, 0.4, 1.4)); list.forEach((r) => rat(r.x, r.y, 0.45 + (r.y - 1200) / 700, t, r.id, r.dir, 1)); // rats everywhere
  shadow(540, 1640, 130); xf(540, 1640, 0.6 + 0.4 * k, 0, () => person(540, 1640, 600, 41, { skin: '#f1c7a5', shirt: '#f4f0e6', pants: '#e0dccf', hat: '#f4f0e6', arm: 'wave', wave: t, mouth: 'open', eyes: 'wide', noShadow: true }));
  const b = pop(t, T.problem, 0.35); if (b > 0) xf(CX, 560, b, 0, () => { fillRR(170, 450, 740, 200, 36, '#fff'); strokeRR(170, 450, 740, 200, 36, '#b5502f', 10); text('RAT PROBLEM', CX, 550, 108, 800, '#3a2a1a', 'center', -0.01); });
}
function sceneBounty(t) {
  street(t); const k = pop(t, T.bounty, 0.4);
  xf(CX, 760, k, 0, () => { fillRR(130, 420, 820, 440, 26, '#f6efe0'); strokeRR(130, 420, 820, 440, 26, '#8a5f3a', 12); text('BOUNTY', CX, 520, 100, 800, '#b3261e', 'center', 0.04); text('1¢', 300, 700, 190, 800, '#3a2a1a', 'center', -0.02); text('PER', 540, 670, 54, 800, '#6b4a34', 'center', 0.1); text('RAT TAIL', 720, 725, 64, 800, '#3a2a1a', 'center', 0); tailShape(790, 650, 1.6); });
  [[220, 1560, 0], [540, 1620, 1], [860, 1560, 2]].forEach(([x, y, i]) => { shadow(x, y, 90); hunter(x, y, 500 + i * 30, t, 61 + i, { noShadow: true, bounce: t * 3 + i, mouth: 'open' }); fillRR(x - 20, y - 300, 120, 100, 14, '#8a6a3a'); }); // each hunter with a basket
}
function sceneTails(t) {
  street(t);
  // the official's counter, the heap of tails growing, rats still running behind
  const k = ease.out(seg(t, T.pour, T.still + 1.4)); for (let i = 0; i < 6; i++) rat(160 + i * 170 + ((t * 80 * (i % 2 ? -1 : 1)) % 80), 1190 + (i % 3) * 60, 0.5 + (i % 3) * 0.1, t, i, i % 2 ? -1 : 1, 1);
  person(CX, 1560, 600, 41, { skin: '#f1c7a5', shirt: '#f4f0e6', pants: '#e0dccf', hat: '#f4f0e6', arm: 'up', wave: t * 2, mouth: 'open', noShadow: true });
  fillRR(0, 1290, W, 630, 0, '#8a5f3a'); fillRR(0, 1290, W, 28, 0, '#a67c52');
  const n = Math.floor(k * 46); for (let i = 0; i < n; i++) tailShape(180 + (i % 12) * 66 + hash(i) * 20, 1280 - Math.floor(i / 12) * 26 - hash(i + 4) * 10, 0.9, (hash(i + 8) - 0.5) * 1.2);
  const a = pop(t, T.pour + 0.2, 0.3), b = pop(t, T.still, 0.3);
  if (a > 0) xf(300, 620, a, 0, () => { fillRR(110, 540, 380, 170, 34, '#fff'); text('TAILS:', 300, 600, 42, 800, '#6b4a34', 'center', 0.1); text(String(Math.floor(k * 4800)), 300, 664, 84, 800, '#3dbb74', 'center', -0.02); });
  if (b > 0) xf(780, 620, b, 0, () => { fillRR(590, 540, 380, 170, 34, '#fff'); text('RATS:', 780, 600, 42, 800, '#6b4a34', 'center', 0.1); text('still here', 780, 664, 62, 800, '#b3261e', 'center', -0.01); });
}
function sceneCut(t) {
  street(t); const k = seg(t, T.cut + 0.3, T.go + 0.2), snip = Math.sin(t * 22) > 0;
  hunter(330, 1620, 620, t, 63, { arm: 'phone', mouth: 'open', noShadow: false });
  ctx.save(); ctx.translate(560, 1480); ctx.rotate(-0.3 + (snip && k < 1 ? 0.2 : 0)); line(0, 0, 90, -40, '#9aa1a8', 10); line(0, -30, 90, 10, '#9aa1a8', 10); circle(0, -15, 14, '#b3261e'); ctx.restore();
  const tx = 760, drop = ease.in(clamp(k * 1.6)), ex = lerp(760, 1200, ease.in(clamp((k - 0.5) / 0.5)));
  if (k < 0.5) rat(tx, 1620, 1.5, t, 5, 1, 0, k < 0.2); else rat(ex, 1620, 1.5, t, 5, 1, 1.5, false);
  if (k > 0.15) tailShape(700 + drop * -50, 1560 + drop * 70, 1.6, drop * 2.5);
  const b = pop(t, T.cut, 0.3); if (b > 0) xf(CX, 540, b, 0, () => { fillRR(180, 440, 720, 190, 36, '#fff'); text('SNIP.', CX, 540, 120, 800, '#b3261e', 'center', 0.02); });
  const g = pop(t, T.go, 0.3); if (g > 0) xf(CX, 800, g, 0, () => { fillRR(280, 730, 520, 130, 36, '#fff'); text('"Off you go!"', CX, 796, 56, 800, '#1b1f27', 'center'); });
}
function sceneFarm(t) {
  street(t); text('RAT FARM', CX, 270, 120, 800, 'rgba(90,50,20,0.9)', 'center', 0.02);
  for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++) { const x = 90 + c * 310, y = 640 + r * 400, e = pop(t, T.breed + 0.2 + (r * 3 + c) * 0.12, 0.3); if (e <= 0) continue; xf(x + 130, y + 150, clamp(e), 0, () => { fillRR(x, y, 260, 260, 10, '#a8a29a'); fillRR(x + 12, y + 12, 236, 236, 6, '#d9d2c4'); for (let i = 1; i < 6; i++) line(x + i * 43, y + 12, x + i * 43, y + 248, '#6b6a70', 4); rat(x + 70, y + 230, 0.6, t, r * 3 + c, 1, 0.1); rat(x + 190, y + 230, 0.5, t, r * 3 + c + 9, -1, 0.1); }); }
  hunter(300, 1700, 480, t, 64, { bounce: t * 3, mouth: 'open' }); text('"breeding season!"', 740, 1560, 44, 800, '#3a2a1a', 'center');
  const b = pop(t, T.breed + 0.5, 0.3); if (b > 0) xf(CX, 1240, b, 0, () => { fillRR(210, 1190, 660, 100, 50, '#fff'); text('for the bounty', CX, 1241, 50, 800, '#1b1f27', 'center'); });
}
function sceneStars(t) {
  street(t); const k = pop(t, T.stars, 0.4);
  rat(CX, 1560, 3.2 * clamp(k) + 0.01, t, 2, 1, 0.05);
  const c = pop(t, T.five - 0.1, 0.4); if (c > 0) xf(CX, 760, c, 0, () => { fillRR(190, 560, 700, 330, 34, '#fff'); strokeRR(190, 560, 700, 330, 34, '#b5502f', 8); text('REVIEW', 250, 620, 28, 800, '#8a7a64', 'left', 0.2); for (let i = 0; i < 5; i++) star(280 + i * 130, 730, 52, '#f5b82e'); text('"Great program."', CX, 840, 52, 800, '#1b1f27', 'center'); });
}
function sceneReward(t) {
  stage(t, 0.2);
  withFade(enter(t, T.reward - 0.05, T.back, 0.15), () => { const a = pop(t, T.reward, 0.3); xf(CX, 700, clamp(a), 0, () => { text('YOU GET', CX, 640, 130, 800, '#fff', 'center', -0.03); text('WHAT YOU', CX, 780, 130, 800, '#fff', 'center', -0.03); text('REWARD.', CX, 920, 150, 800, IN.mid, 'center', -0.03); }); });
}
function sceneCard(t) {
  ctx.fillStyle = vgrad(0, H, '#f3e7d3', '#e3cfae'); ctx.fillRect(0, 0, W, H);
  const k = pop(t, T.back, 0.4); xf(CX, 760, k, 0, () => {
    ctx.save(); ctx.translate(CX, 760); ctx.rotate(-0.03); fillRR(-400, -330, 800, 660, 30, '#fffaf0'); strokeRR(-400, -330, 800, 660, 30, '#d9c7a0', 4);
    text('SAM\'S STUDIO', 0, -260, 50, 800, '#1e1b4b', 'center', 0.1); text('REGULAR CARD', 0, -205, 26, 700, '#8a8066', 'center', 0.3);
    for (let i = 0; i < 10; i++) { const x = -300 + (i % 5) * 150, y = -80 + Math.floor(i / 5) * 160, st = pop(t, T.back + 0.4 + i * 0.12, 0.25); circle(x, y, 54, '#efe5cf'); ring(x, y, 54, '#d9c7a0', 4); if (st > 0) xf(x, y, st, 0, () => { circle(x, y, 44, C.primary); check(x, y + 2, 40, '#fff', 8); }); }
    const fl = pop(t, T.once, 0.35); xf(0, 250, fl, 0, () => { fillRR(-300, 215, 600, 90, 45, GREEN); text('FREE HAIRCUT', 0, 262, 48, 800, '#fff', 'center', 0.05); });
    ctx.restore(); });
}
// ═════════════ the product ═════════════
function scoreRing(cx, cy, r, v, col) { ctx.lineWidth = 22; ctx.lineCap = 'round'; ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.stroke(); ctx.strokeStyle = col; ctx.beginPath(); ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * v / 100); ctx.stroke(); }
function sceneLoyalty(t) {
  stage(t, 0.22);
  withFade(enter(t, T.loyal - 0.1, T.slip, 0.25), () => {
    eyebrow('LOYALTY PROGRAM', 330); card(CARD.x, 380, CARD.w, 1000);
    avatar(CARD.x + 76, 470, 40, 'JK', C.primary); text('Jordan K.', CARD.x + 140, 456, 36, 700, '#fff'); text('Regular · since 2023', CARD.x + 140, 500, 24, 500, SOFT);
    const v = seg(t, T.visit + 0.1, T.visit + 0.7), pts = Math.round(lerp(80, 100, ease.out(seg(t, T.visit + 0.6, T.unlock + 0.2)))), full = pts >= 100;
    scoreRing(CX, 800, 170, pts * ease.out(v), full ? GREEN : C.primary); text(String(Math.round(pts * ease.out(v))), CX, 790, 110, 800, '#fff', 'center', -0.03); text('POINTS', CX, 870, 24, 800, MUTED, 'center', 0.25);
    [['Visit · Haircut', '+10'], ['Referral · Priya', '+25'], ['Birthday bonus', '+15']].forEach(([n, p], i) => { const y = 1100 + i * 80, e = ease.out(seg(t, T.visit + 0.3 + i * 0.25, T.visit + 0.6 + i * 0.25)); withFade(e, () => { ctx.fillStyle = 'rgba(255,255,255,0.07)'; ctx.fillRect(CARD.x + 40, y - 40, CARD.w - 80, 2); text(n, CARD.x + 50, y, 28, 600, SOFT, 'left'); text(p + ' pts', CARD.x + CARD.w - 50, y, 30, 800, '#9ff0c0', 'right'); }); });
    const u = pop(t, T.unlock + 0.2, 0.35); if (u > 0) xf(CX, 1335, u, 0, () => { const s = 'Reward unlocked · Free haircut', w = tw(s, 34, 800) + 120; fillRR(CX - w / 2, 1285, w, 100, 50, rgba(GREEN, 0.2)); strokeRR(CX - w / 2, 1285, w, 100, 50, GREEN, 3); circle(CX - w / 2 + 56, 1335, 22, GREEN); check(CX - w / 2 + 56, 1336, 22, '#fff', 4.5); text(s, CX - w / 2 + 96, 1336, 34, 800, '#fff', 'left'); });
  });
}
function sceneSlip(t) {
  stage(t, 0.2);
  withFade(enter(t, T.slip - 0.05, T.offer, 0.2), () => {
    eyebrow('WHO\'S SLIPPING', 330); card(CARD.x, 380, CARD.w, 560);
    [['Ava R.', '9 visits', 'Healthy', GREEN, 0], ['Marcus T.', '7 visits', 'Healthy', GREEN, 1], ['Priya S.', '2 visits', 'At risk', RED, 2]].forEach(([n, v, st, col, i]) => {
      const y = 470 + i * 160, e = ease.out(seg(t, T.slip + i * 0.12, T.slip + 0.4 + i * 0.12)), prs = i === 2;
      withFade(e, () => { if (i) { ctx.fillStyle = 'rgba(255,255,255,0.07)'; ctx.fillRect(CARD.x + 30, y - 80, CARD.w - 60, 2); } if (prs) { fillRR(CARD.x + 12, y - 70, CARD.w - 24, 140, 18, rgba(col, 0.09)); strokeRR(CARD.x + 12, y - 70, CARD.w - 24, 140, 18, rgba(col, 0.5 + 0.3 * Math.sin(t * 9)), 3); } avatar(CARD.x + 72, y, 36, n.slice(0, 2).toUpperCase(), NAMES[i + 1][1]); text(n, CARD.x + 128, y - 16, 32, 700, '#fff'); text(v, CARD.x + 128, y + 24, 24, 500, SOFT); tag(CARD.x + CARD.w - 36, y, st.toUpperCase(), col, true, 20); });
    });
    const m = pop(t, T.slip + 1.0, 0.35); withFade(clamp(m), () => { text('AUTOMATIC WIN-BACK · 2× POINTS', CX, 1000, 22, 700, MUTED, 'center', 0.2); bubble(CARD.x + 40, 1040 + (1 - clamp(m)) * 26, CARD.w - 80, ['Hi Priya, we miss you! Double points', 'on your next visit this week.'], true, clamp(m)); });
  });
}
const SCENES = [[0, T.bounty, sceneRats], [T.bounty, T.pour, sceneBounty], [T.pour, T.cut, sceneTails], [T.cut, T.breed, sceneCut], [T.breed, T.stars, sceneFarm], [T.stars, T.reward, sceneStars], [T.reward, T.back, sceneReward], [T.back, T.brand, sceneCard],
  [T.brand, T.loyal, (t) => brandHit(t, T.brand, T.loyal)], [T.loyal, T.slip, sceneLoyalty], [T.slip, T.offer, sceneSlip], [T.offer, T.end, (t) => offerCard(t, T.offer, T.end)], [T.end, 999, (t) => endCard(t, T.end, T.cta, T.url)]];
cue(T.problem, 'punch', 0.9); cue(T.bounty, 'swish', 0.8); cue(T.tail, 'ding', 0.8); cue(T.pour, 'swoosh', 0.8); for (let i = 0; i < 6; i++) cue(T.pour + 0.2 + i * 0.25, 'tap', 0.5); cue(T.still, 'notification', 0.9); cue(T.cut, 'punch', 1); cue(T.go, 'swish', 0.8);
cue(T.breed, 'swish', 0.7); for (let i = 0; i < 6; i++) cue(T.breed + 0.2 + i * 0.12, 'key', 0.45); cue(T.stars, 'swoosh', 0.7); cue(T.five, 'ding', 1); cue(T.reward, 'punch', 1); cue(T.back, 'swish', 0.7);
for (let i = 0; i < 10; i++) cue(T.back + 0.4 + i * 0.12, 'tap', 0.4); cue(T.once, 'ding', 0.9); cue(T.brand, 'transitionHit', 1); cue(T.visit + 0.1, 'swish', 0.7); cue(T.unlock + 0.2, 'ding', 1); cue(T.slip, 'swish', 0.8); cue(T.slip + 1.0, 'notification', 0.9);
cue(T.offer, 'punch', 1); cue(T.offer + 0.7, 'ding', 0.9); cue(T.end, 'swish', 0.8); cue(T.cta, 'tap', 1.2);
boot({ duration: DURATION, scenes: SCENES, brandAt: T.brand, hideCaption: (t) => t >= T.end - 0.1,
  after: (t) => { const f = 1 - seg(t, T.brand, T.brand + 0.12); if (t >= T.brand && f > 0) { ctx.fillStyle = rgba('#ffffff', 0.5 * f); ctx.fillRect(0, 0, W, H); } } }, 'rats');
