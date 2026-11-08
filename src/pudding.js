// MsgHealth · "The pudding loophole" · story-hook vertical ad (1080 × 1920, 30 fps), built on src/kit.js + src/audit.js.
// Real story: in 1999 David Phillips found a Healthy Choice promo (frequent-flyer miles per barcode), bought ~12,150 puddings for
// about $3,000, earned over a million miles, and gave the puddings to charity. Pivot: people do wild things for a reward, so give
// your regulars one. MsgHealth tracks loyalty. Offer: free retention audit, comment KEEP. Voiceover: assets/audio/pudding/vo-NN.wav.
'use strict';
const word = (l, k) => VO_AT[l] + VO_CLIPS[l].chunks[k][1];
const T = { promo: word(0, 2), bar: VO_AT[1], plane: word(1, 1), bought: VO_AT[2], thou: word(2, 2), miles: VO_AT[3], dollars: word(3, 1), charity: VO_AT[4], flew: word(4, 1), wild: VO_AT[5], reg: VO_AT[6],
  brand: VO_AT[7], earn: VO_AT[8], rew: word(8, 1), ask: VO_AT[9], cmt: VO_AT[10], end: VO_AT[11] - 0.1, url: VO_AT[11] + 0.1 };
T.loy = T.brand + 1.4; T.cta = T.end + 1.25;
const DURATION = +(T.cta + 1.0).toFixed(2);
window.CUES = T; window.SFX = []; const cue = (t, kind, gain) => window.SFX.push({ t, kind, gain });
window.MUSIC = { bpm: 108, root: 50, brandAt: T.brand, mood: 'bouncy', bed: false, fx: 0.5 };

function cup(x, y, s, col = '#7a4a2a') { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); poly([[-60, -100], [60, -100], [48, 0], [-48, 0]], col); poly([[-60, -100], [60, -100], [56, -60], [-56, -60]], 'rgba(255,255,255,0.18)'); ellipse(0, -100, 62, 12, '#d0d4dc'); ellipse(0, -100, 50, 7, '#aeb4c0'); ctx.restore(); }
function barcode(x, y, w, h) { fillRR(x - w / 2, y - h / 2, w, h, 6, '#fff'); for (let i = 0; i < 18; i++) fillRR(x - w / 2 + 14 + i * ((w - 28) / 18), y - h / 2 + 12, i % 3 ? 4 : 7, h - 34, 1, '#111'); }
function jet(x, y, s, rot = 0) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ellipse(0, 0, 150, 30, '#f2f2f5'); poly([[-20, 10], [-90, 90], [-60, 90], [30, 12]], '#c9ccd6'); poly([[-20, -10], [-90, -90], [-60, -90], [30, -12]], '#dfe2ea'); poly([[-130, -8], [-170, -62], [-148, -62], [-100, -8]], '#b3261e'); [0, 30, 60, 90].forEach((i) => circle(-20 + i * 0.9, -4, 6, '#8aa7c0')); ctx.restore(); }
function aisle(t) { ctx.fillStyle = '#e8f0f2'; ctx.fillRect(0, 0, W, H); ctx.fillStyle = '#c9d4d8'; ctx.fillRect(0, 1400, W, 520); for (let r = 0; r < 3; r++) { const y = 700 + r * 250; fillRR(0, y, W, 20, 0, '#9aa7ad'); for (let i = 0; i < 8; i++) cup(80 + i * 130 + (r % 2) * 40, y, 0.62, ['#7a4a2a', '#d99a3a', '#e8c6a0', '#7a4a2a'][(i + r) % 4]); } }
function sceneAisle(t) {
  aisle(t); text('1999', CX, 230, 160, 800, 'rgba(40,60,70,0.85)', 'center', -0.02);
  const s = pop(t, T.promo - 0.1, 0.4); if (s > 0) xf(CX, 430, clamp(s), 0, () => { fillRR(130, 360, 820, 130, 28, '#ffd84d'); strokeRR(130, 360, 820, 130, 28, '#b3261e', 6); text('1 MILE PER BARCODE', CX, 427, 64, 800, '#b3261e', 'center', 0); });
  person(300, 1500, 560, 12, { skin: '#d9a27a', shirt: '#6c8ebf', pants: '#3d424f', glasses: true, arm: 'up', wave: t * 0.8, eyes: 'wide', bounce: t * 4 }); cup(470, 960, 0.9, '#d99a3a');
}
function sceneBarcode(t) {
  ctx.fillStyle = '#e8f0f2'; ctx.fillRect(0, 0, W, H);
  const a = pop(t, T.bar, 0.35), b = pop(t, T.bar + 1.0, 0.35), c = pop(t, T.plane, 0.4);
  if (a > 0) xf(CX, 440, clamp(a), 0, () => { cup(CX, 560, 2.0, '#d99a3a'); text('PUDDING CUP', CX, 650, 36, 800, '#2a4a6a', 'center', 0.12); });
  if (b > 0) xf(CX, 880, clamp(b), 0, () => { text('↓', CX, 740, 70, 800, '#2a4a6a', 'center'); barcode(CX, 880, 420, 160); });
  if (c > 0) xf(CX, 1200, clamp(c), 0, () => { text('↓', CX, 1020, 70, 800, '#2a4a6a', 'center'); jet(CX, 1150, 1.6, -0.12); text('AIRLINE MILES', CX, 1310, 40, 800, '#2a4a6a', 'center', 0.12); });
}
function scenePile(t) {
  ctx.fillStyle = '#e8f0f2'; ctx.fillRect(0, 0, W, H); ctx.fillStyle = '#c9d4d8'; ctx.fillRect(0, 1400, W, 520);
  const k = ease.out(seg(t, T.bought + 0.5, T.thou + 1.2)), n = Math.floor(k * 54);
  fillRR(160, 1010, 760, 300, 24, '#9aa7ad'); for (let i = 0; i < n; i++) { const r = Math.floor(i / 9), c = i % 9; cup(230 + c * 80 + (r % 2) * 20, 1030 - r * 56, 0.6, ['#7a4a2a', '#d99a3a', '#e8c6a0'][(i + r) % 3]); }
  fillRR(140, 1160, 800, 150, 18, '#6c7a82'); circle(280, 1350, 44, '#1b1b20'); circle(800, 1350, 44, '#1b1b20');
  const c = Math.round(k * 12150); xf(CX, 460, 1 + 0.05 * Math.sin(t * 8), 0, () => text(c.toLocaleString('en-US'), CX, 460, 200, 800, '#2a4a6a', 'center', -0.03)); text('PUDDING CUPS', CX, 590, 38, 800, '#6c7a82', 'center', 0.2);
}
function sceneMiles(t) {
  ctx.fillStyle = vgrad(0, H, '#7fb4e0', '#dff0fb'); ctx.fillRect(0, 0, W, H); cloud(60 + (t * 30) % 300, 300, 1.2, 'rgba(255,255,255,0.9)'); cloud(700 - (t * 20) % 200, 1000, 1.0, 'rgba(255,255,255,0.8)');
  const m = pop(t, T.miles + 0.2, 0.45); xf(CX, 560, clamp(m), 0, () => { text('1,250,000', CX, 560, 170, 800, '#1b2a4a', 'center', -0.04); text('FREQUENT FLYER MILES', CX, 690, 38, 800, '#2a4a6a', 'center', 0.15); });
  jet(lerp(-200, 1300, ease.inOut(seg(t, T.miles, T.charity))), 960, 1.4, -0.08);
  const d = pop(t, T.dollars, 0.4); if (d > 0) xf(CX, 1180, clamp(d), 0, () => { fillRR(190, 1100, 700, 150, 34, '#1b2a4a'); text('cost: about $3,000', CX, 1176, 56, 800, '#fff', 'center', 0); });
}
function sceneCharity(t) {
  const f = ease.inOut(seg(t, T.flew - 0.05, T.flew + 0.2));
  ctx.fillStyle = vgrad(0, H, '#7fb4e0', '#dff0fb'); ctx.fillRect(0, 0, W, 1250); ctx.fillStyle = '#b8d6a0'; ctx.fillRect(0, 1250, W, 670);
  withFade(1 - f, () => { [[260, 1, 51, '#6c8ebf'], [820, -1, 52, '#d9468a']].forEach(([x, d, id, sh], i) => person(x, 1500, 520, id, { shirt: sh, dir: d, arm: i ? 'down' : 'up', wave: t * 2, mouth: 'open', bounce: t * 5 + i }));
    fillRR(430, 1120, 220, 160, 12, '#a07a4a'); [0, 1, 2].forEach((i) => cup(480 + i * 60, 1150, 0.4, '#7a4a2a')); const h = pop(t, T.charity + 0.3, 0.4); if (h > 0) xf(CX, 880, clamp(h), 0, () => { text('♥', CX, 880, 260, 800, '#e5484d', 'center', 0); text('CHARITY', CX, 1040, 50, 800, '#1b2a4a', 'center', 0.15); }); });
  withFade(f, () => { cloud(60 + (t * 40) % 300, 400, 1.3, 'rgba(255,255,255,0.9)'); jet(lerp(-250, 1330, seg(t, T.flew, T.wild)), 800, 1.7, -0.05); fillRR(260, 1050, 560, 180, 30, '#1b2a4a'); text('FLEW FOR YEARS', CX, 1142, 52, 800, '#fff', 'center', 0.02); });
}
function sceneWild(t) {
  ctx.fillStyle = vgrad(0, 1300, '#ffe9b0', '#ffc97a'); ctx.fillRect(0, 0, W, 1300); ctx.fillStyle = '#c9a56a'; ctx.fillRect(0, 1300, W, 620);
  const s = pop(t, T.wild + 0.2, 0.4); xf(800, 700, clamp(s), 0, () => { fillRR(786, 800, 28, 500, 4, '#6b4a34'); fillRR(570, 560, 460, 240, 22, '#b3261e'); text('REWARD!', 800, 680, 76, 800, '#ffd84d', 'center', 0); star(800, 740, 30, '#ffd84d'); });
  [0, 1, 2, 3, 4, 5].forEach((i) => { const x = lerp(-150 - i * 140, 120 + i * 105, ease.out(seg(t, T.wild + i * 0.15, T.wild + 1.8))), y = 1420 + (i % 2) * 40; person(x, y, 330 - (i % 2) * 24, 90 + i, { dir: 1, arm: 'up', wave: t * 3 + i, mouth: 'open', bounce: t * 12 + i * 2 }); });
}
function sceneStamps(t) {
  ctx.fillStyle = vgrad(0, H, '#f6ead3', '#e8d3a8'); ctx.fillRect(0, 0, W, H); fillRR(0, 1300, W, 620, 0, '#8a5f3a'); fillRR(0, 1280, W, 30, 0, '#a07852');
  const s = pop(t, T.reg, 0.4); xf(CX, 760, clamp(s), 0, () => { ctx.save(); ctx.translate(CX, 760); ctx.rotate(-0.04); fillRR(-420, -300, 840, 600, 36, '#fff8e6'); strokeRR(-420, -300, 840, 600, 36, '#b5654a', 8); text('LOYALTY CARD', 0, -230, 50, 800, '#7a4a2a', 'center', 0.1);
    for (let i = 0; i < 8; i++) { const x = -270 + (i % 4) * 180, y = -90 + Math.floor(i / 4) * 200, st = pop(t, T.reg + 0.6 + i * 0.25, 0.25); ring(x, y, 66, '#b5654a', 5); if (st > 0) xf(x, y, clamp(st), 0, () => { circle(x, y, 56, i === 7 ? '#ffd84d' : '#e5484d'); if (i === 7) text('FREE', x, y + 2, 34, 800, '#7a4a2a', 'center', 0); else check(x, y + 1, 40, '#fff', 8); }); } ctx.restore(); });
}
function sceneLoyalty(t) {
  stage(t, 0.22); eyebrow('LOYALTY & RETENTION', 290); const p = ease.out(seg(t, T.earn + 0.3, T.rew + 0.4)), v = Math.round(lerp(420, 500, p));
  card(CARD.x, 340, CARD.w, 520); avatar(CARD.x + 80, 430, 40, 'JO', C.primary); text('Jordan K.', CARD.x + 140, 418, 36, 800, '#fff', 'left'); text('Regular · 14 visits', CARD.x + 140, 462, 24, 500, SOFT, 'left');
  text(v + ' / 500 pts', CARD.x + 60, 570, 54, 800, '#fff', 'left', 0); fillRR(CARD.x + 60, 640, CARD.w - 120, 36, 18, 'rgba(255,255,255,0.1)'); fillRR(CARD.x + 60, 640, (CARD.w - 120) * (v / 500), 36, 18, v >= 500 ? GREEN : C.primary);
  const pl = pop(t, T.earn + 0.2, 0.3); if (pl > 0) xf(CX + 250, 530, clamp(pl), 0, () => tag(CARD.x + CARD.w - 50, 570, '+50 · VISIT', IN.mid, false, 24));
  const r = pop(t, T.rew + 0.5, 0.4); if (r > 0) xf(CX, 1030, clamp(r), 0, () => { fillRR(130, 930, 820, 220, 34, rgba(GREEN, 0.14)); strokeRR(130, 930, 820, 220, 34, GREEN, 4); circle(250, 1040, 50, GREEN); check(250, 1042, 50, '#fff', 8); text('Reward unlocked', 340, 1010, 46, 800, '#fff', 'left', 0); text('Free service · next visit', 340, 1070, 30, 600, '#9ff0c0', 'left', 0); });
}
const SCENES = [[0, T.bar, sceneAisle], [T.bar, T.bought, sceneBarcode], [T.bought, T.miles, scenePile], [T.miles, T.charity, sceneMiles], [T.charity, T.wild, sceneCharity], [T.wild, T.reg, sceneWild], [T.reg, T.brand, sceneStamps],
  [T.brand, T.loy, (t) => brandHit(t, T.brand, T.loy)], [T.loy, T.ask, sceneLoyalty], [T.ask, T.end, sceneAudit], [T.end, 999, (t) => auditEnd(t, T.end, T.cta, T.url)]];
cue(T.promo, 'punch', 0.9); cue(T.bar, 'swish', 0.7); cue(T.bar + 1.0, 'tap', 0.8); cue(T.plane, 'ding', 0.9); cue(T.bought, 'swish', 0.7); for (let i = 0; i < 8; i++) cue(T.bought + 0.6 + i * 0.28, 'tap', 0.5); cue(T.thou + 1.0, 'ding', 0.9);
cue(T.miles + 0.2, 'punch', 1); cue(T.dollars, 'punch', 0.9); cue(T.charity + 0.3, 'ding', 0.9); cue(T.flew, 'swish', 0.8); cue(T.wild, 'swish', 0.8); cue(T.wild + 0.2, 'punch', 0.9); cue(T.reg, 'swish', 0.7); for (let i = 0; i < 8; i++) cue(T.reg + 0.6 + i * 0.25, 'tap', 0.6); cue(T.reg + 2.5, 'ding', 1);
cue(T.brand, 'transitionHit', 1); cue(T.earn + 0.2, 'notification', 0.9); cue(T.rew + 0.5, 'ding', 1); cue(T.ask, 'punch', 1); for (let i = 0; i < 4; i++) cue(T.cmt + 0.45 + i * 0.11, 'key', 0.6); cue(T.cmt + 1.0, 'ding', 0.9); cue(T.end, 'swish', 0.8); cue(T.cta, 'tap', 1.2);
boot({ duration: DURATION, scenes: SCENES, brandAt: T.brand, hideCaption: (t) => t >= T.end - 0.1,
  after: (t) => { const f = 1 - seg(t, T.brand, T.brand + 0.12); if (t >= T.brand && f > 0) { ctx.fillStyle = rgba('#ffffff', 0.5 * f); ctx.fillRect(0, 0, W, H); } } }, 'pudding');
