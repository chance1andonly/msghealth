// MsgHealth · "Fire sale" · story-hook vertical ad about price (1080 × 1920, 30 fps), built on src/kit.js.
// Real story, nudged: Crassus, the Roman tycoon, ran a private fire brigade and (per Plutarch) bought burning buildings cheap
// from owners before putting the fire out. (Charging extra for water is the absurd part.) Pivot: pricing shouldn't feel like a
// fire sale. MsgHealth shows its prices up front: Starter $50/mo (booking, client health scoring, reminders, invoicing, loyalty,
// reviews), annual billing saves 20% ($120 a year on Starter), and the first month is half price on monthly plans ($25 on
// Starter; Pro $109 → $54.50; Enterprise $279 → $139.50). Prices are from the in-app Plans screen.
// Voiceover: assets/audio/crassus/vo-NN.wav, timed by VO_AT in src/crassus-vo.js.
'use strict';
const word = (l, k) => VO_AT[l] + VO_CLIPS[l].chunks[k][1];
const T = {
  crassus: word(0, 1), brigade: word(0, 2), fire: VO_AT[1], offer: word(1, 2), sell: VO_AT[2], cheap: word(2, 1), no: VO_AT[3], burn: word(3, 1), rich: VO_AT[4], water: VO_AT[5], extra: word(5, 1),
  fireSale: VO_AT[6], brand: VO_AT[7], upfront: word(7, 1), fifty: word(7, 2), incl: VO_AT[8], yearly: VO_AT[9], twenty: word(9, 1), half: VO_AT[10], tf: VO_AT[11], offerAt: VO_AT[12], end: VO_AT[13] - 0.1, url: VO_AT[13] + 0.1,
};
T.cta = T.end + 1.25;
const DURATION = +(T.cta + 1.0).toFixed(2);
window.CUES = T; window.SFX = []; const cue = (t, kind, gain) => window.SFX.push({ t, kind, gain });
window.MUSIC = { bpm: 96, root: 50, brandAt: T.brand, mood: 'quirky' };

function shadow(x, y, rx) { ellipse(x, y, rx, rx * 0.12, 'rgba(60,30,10,0.28)'); }
const GR = 1050;
function flames(x, y, w, h, t, seed = 0) { // a flickering fire, base centred at (x, y)
  for (let i = 0; i < 5; i++) { const fx = x + (i - 2) * w * 0.22, fh = h * (0.55 + 0.45 * Math.abs(Math.sin(t * 7 + i * 1.9 + seed))) * (1 - Math.abs(i - 2) * 0.16), fw = w * 0.2;
    poly([[fx - fw, y], [fx - fw * 0.5, y - fh * 0.6], [fx, y - fh], [fx + fw * 0.5, y - fh * 0.6], [fx + fw, y]], i % 2 ? '#ff7a2a' : '#ff5a1f'); poly([[fx - fw * 0.5, y], [fx, y - fh * 0.7], [fx + fw * 0.5, y]], '#ffc03a'); }
}
function rome(t) {
  ctx.fillStyle = vgrad(0, GR, '#8fc3e8', '#f7e7c4'); ctx.fillRect(0, 0, W, GR); cloud(60, 230, 0.9, 'rgba(255,255,255,0.92)'); circle(900, 200, 70, '#fff1b8');
  // background: an arch and rows of stuccoed insulae with terracotta roofs
  [[-30, 260, 520, '#e8d3b0'], [240, 240, 440, '#dcc59c'], [480, 260, 500, '#e8d3b0'], [740, 340, 460, '#d6bd92']].forEach(([x, w, top, c], i) => { fillRR(x, top, w, GR - top, 2, c); poly([[x - 10, top], [x + w / 2, top - 70], [x + w + 10, top]], '#b5502f'); for (let k = 0; k < 2; k++) fillRR(x + 36 + k * (w - 110), top + 80, 54, 90, 26, '#6b563f'); ctx.fillStyle = 'rgba(0,0,0,0.06)'; ctx.fillRect(x, GR - 60, w, 60); });
  for (let i = 0; i < 3; i++) { fillRR(560 + i * 150, 330, 44, GR - 330, 4, '#f3ead8'); fillRR(548 + i * 150, 320, 68, 24, 4, '#ddd2bb'); } poly([[530, 320], [760, 220], [990, 320]], '#d8cdb5');
  ctx.fillStyle = '#c9b48e'; ctx.fillRect(0, GR, W, H - GR); ctx.fillStyle = 'rgba(120,80,30,0.10)'; ctx.fillRect(0, GR, W, 90); for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) ellipse(((c + (r % 2) * 0.5) * 130 + 30) % (W + 60), GR + 40 + r * r * 5 + r * 24, 40 + r * 7, 10 + r * 2, 'rgba(0,0,0,0.05)');
}
function toga(x, y, h, id, o = {}) { // a Roman: person plus a wrapped robe
  person(x, y, h, id, { skin: o.skin ?? '#d9a27a', shirt: o.robe ?? '#f4f0e6', pants: o.robe ?? '#f4f0e6', arm: o.arm ?? 'down', wave: o.wave, dir: o.dir ?? 1, mouth: o.mouth, eyes: o.eyes, bounce: o.bounce, hair: o.hair, noShadow: o.noShadow });
  const w = h * 0.3, c = o.robe ?? '#f4f0e6'; poly([[x - w * 0.5, y - h * 0.75], [x + w * 0.5, y - h * 0.75], [x + w * 0.62, y - h * 0.05], [x - w * 0.62, y - h * 0.05]], c); ctx.fillStyle = 'rgba(0,0,0,0.07)'; ctx.fillRect(x - w * 0.5, y - h * 0.5, w * 1.1, h * 0.03); fillRR(x - w * 0.5, y - h * 0.78, w, h * 0.04, 4, o.trim ?? '#9a2a3a');
  if (o.laurel) { const hy = y - h + h * 0.095; ctx.strokeStyle = '#4a8a3a'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(x, hy - h * 0.02, h * 0.1, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke(); }
}
function sceneCrassus(t) {
  rome(t); text('ROME', 220, 130, 120, 800, 'rgba(90,50,20,0.9)', 'center', 0.03);
  const k = pop(t, T.crassus - 0.2, 0.45); shadow(540, 1620, 190); xf(540, 1500, 0.65 + 0.35 * clamp(k), 0, () => toga(540, 1620, 640, 51, { laurel: true, hair: '#3a2a1a', arm: 'wave', wave: t, noShadow: true }));
  const b = ease.out(seg(t, T.brigade - 0.2, T.brigade + 0.7)); [0, 1, 2, 3].forEach((i) => { const x = lerp(-200, 120 + i * 100, b) + (i > 1 ? 560 : 0); shadow(x, 1410, 70); person(x, 1410, 330, 80 + i, { skin: '#c68a62', shirt: '#b3261e', pants: '#7a1a1a', hat: '#8a6a3a', dir: i > 1 ? -1 : 1, arm: 'phone', noShadow: true }); fillRR(x + 40, 1260, 56, 50, 8, '#8a5f3a'); }); // the brigade, buckets in hand
  const l = pop(t, T.brigade, 0.35); if (l > 0) xf(CX, 450, l, 0, () => { fillRR(160, 360, 760, 150, 40, '#fff'); text('PRIVATE FIRE BRIGADE', CX, 436, 56, 800, '#b3261e', 'center', 0.01); });
}
function sceneOffer(t) {
  rome(t); fillRR(660, 560, 340, GR - 560, 2, '#d8bd90'); poly([[640, 560], [830, 460], [1020, 560]], '#b5502f'); fillRR(740, 780, 60, 100, 30, '#6b563f'); flames(830, GR - 60, 300, 520, t, 1); glow(830, 700, 360, '#ff7a2a', 0.4);
  const ow = ease.out(seg(t, T.fire - 0.1, T.fire + 0.4)); person(900, 1480, 520, 72, { skin: '#c68a62', shirt: '#6a8a3a', pants: '#3d3a30', arm: 'up', wave: t * 3, mouth: 'open', eyes: 'wide', dir: -1, bounce: t * 9 });
  const cx = lerp(-250, 330, ease.out(seg(t, T.fire + 0.2, T.offer))); toga(cx, 1620, 600, 51, { laurel: true, hair: '#3a2a1a', arm: 'phone', bounce: t * 4 });
  const b = pop(t, T.offer, 0.35); if (b > 0) xf(CX, 760, b, 0, () => { fillRR(110, 640, 560, 190, 36, '#fff'); text('"I have an offer."', 390, 735, 54, 800, '#1b1f27', 'center'); poly([[300, 830], [360, 830], [330, 880]], '#fff'); });
}
function sceneSell(t) {
  rome(t); flames(850, GR - 40, 340, 420, t, 2); glow(850, 800, 420, '#ff7a2a', 0.35);
  const k = pop(t, T.sell, 0.4); xf(CX, 760, k, 0, () => { ctx.save(); ctx.translate(CX - 60, 780); ctx.rotate(-0.04); fillRR(-380, -300, 760, 600, 24, '#f6efe0'); strokeRR(-380, -300, 760, 600, 24, '#b99a62', 8); fillRR(-420, -320, 60, 640, 30, '#d9c28a'); fillRR(360, -320, 60, 640, 30, '#d9c28a');
    text('CONTRACT', 0, -220, 64, 800, '#3a2a1a', 'center', 0.08); text('SELL ME THE BUILDING', 0, -120, 44, 800, '#6b4a34', 'center', 0.02);
    const c = seg(t, T.cheap - 0.1, T.cheap + 0.4); text('PRICE:', -190, 20, 60, 800, '#3a2a1a', 'center'); text('CHEAP', 120, 20, 100, 800, c > 0 ? '#b3261e' : 'rgba(0,0,0,0.0)', 'center', 0.01); line(-380 + 60, 160, 380 - 60, 160, '#b99a62', 4); text('(fire not included)', 0, 240, 34, 600, '#6b4a34', 'center'); ctx.restore(); });
  toga(190, 1700, 520, 51, { laurel: true, hair: '#3a2a1a', arm: 'up', wave: t, mouth: 'open' });
}
function sceneNo(t) {
  rome(t); fillRR(660, 560, 340, GR - 560, 2, '#4a3a30'); poly([[640, 560], [830, 460], [1020, 560]], '#3a2a24'); flames(830, GR - 20, 340, 700, t, 3); glow(830, 700, 520, '#ff7a2a', 0.5);
  person(260, 1520, 540, 72, { skin: '#c68a62', shirt: '#6a8a3a', pants: '#3d3a30', arm: 'up', wave: t * 2, mouth: 'open', eyes: 'wide', bounce: t * 5 }); const n = pop(t, T.no, 0.3); if (n > 0) xf(260, 700, n, 0, () => { fillRR(110, 620, 300, 130, 40, '#fff'); text('NO!', 260, 690, 90, 800, '#b3261e', 'center'); });
  toga(720, 1660, 580, 51, { laurel: true, hair: '#3a2a1a', dir: -1, mouth: 'open', noShadow: false }); // Crassus watching with a bowl of grapes
  const g = ease.out(seg(t, T.no + 0.2, T.no + 0.8)); if (g > 0) { fillRR(600, 1480, 130, 60, 14, '#8a5f3a'); for (let i = 0; i < 8; i++) circle(620 + (i % 4) * 28, 1470 - Math.floor(i / 4) * 24, 15, '#6a2a8a'); }
  const b = pop(t, T.burn, 0.3); if (b > 0) xf(CX, 400, b, 0, () => { fillRR(210, 330, 660, 140, 40, '#fff'); text('...watched it burn.', CX, 402, 52, 800, '#1b1f27', 'center'); });
}
function sceneRich(t) {
  ctx.fillStyle = vgrad(0, H, '#6a2a3a', '#2a1218'); ctx.fillRect(0, 0, W, H); glow(CX, 900, 700, '#ffd45e', 0.4);
  const k = ease.out(seg(t, T.rich - 0.1, T.rich + 1.4)); for (let r = 0; r < 6; r++) for (let c = 0; c < 8 - r; c++) { const x = CX + (c - (7 - r) / 2) * 120, y = 1500 - r * 60; if (r * 8 + c < k * 40) { ellipse(x, y + 12, 62, 24, '#b5791f'); ellipse(x, y, 62, 24, '#f5b82e'); ellipse(x, y, 42, 14, '#ffd45e'); } }
  shadow(CX, 1230, 140); xf(CX, 1090, 0.8 + 0.2 * k, 0, () => toga(CX, 1240, 340, 51, { laurel: true, hair: '#3a2a1a', arm: 'up', wave: t * 2, mouth: 'open', noShadow: true, robe: '#f6e7a0', trim: '#9a2a3a' }));
  const b = pop(t, T.rich + 0.3, 0.4); if (b > 0) xf(CX, 540, b, 0, () => { fillRR(130, 440, 820, 200, 40, '#f5b82e'); text('RICHEST MAN IN ROME', CX, 540, 70, 800, '#3a1a0a', 'center', 0.0); });
}
function sceneWater(t) {
  rome(t);
  const k = pop(t, T.water, 0.4); xf(CX, 760, k, 0, () => { fillRR(130, 460, 820, 640, 26, '#8a5f3a'); fillRR(150, 480, 780, 600, 14, '#f6efe0'); text('TODAY\'S MENU', CX, 550, 52, 800, '#6b4a34', 'center', 0.1);
    text('Fire put out', 190, 690, 56, 800, '#3a2a1a', 'left'); text('1000', 890, 690, 56, 800, '#3a2a1a', 'right'); line(190, 730, 890, 730, '#c9b48e', 3);
    const e = pop(t, T.extra, 0.3); if (e > 0) xf(CX, 860, clamp(e), 0, () => { text('Water', 190, 860, 56, 800, '#b3261e', 'left'); text('+500', 890, 860, 64, 800, '#b3261e', 'right'); fillRR(190, 930, 700, 90, 24, rgba('#b3261e', 0.12)); text('(extra)', CX, 977, 44, 800, '#b3261e', 'center'); }); });
  toga(260, 1640, 560, 51, { laurel: true, hair: '#3a2a1a', arm: 'up', wave: t, mouth: 'open' }); const bk = ease.out(seg(t, T.extra, T.extra + 0.6)); fillRR(720, 1490, 130, 120, 12, '#8a5f3a'); ellipse(785, 1490, 65, 18, '#4aa3df');
}
// ═════════════ the product ═════════════
function sceneFireSale(t) {
  stage(t, 0.14);
  withFade(enter(t, T.fireSale - 0.05, T.brand, 0.2), () => {
    const k = pop(t, T.fireSale, 0.4); xf(CX, 640, clamp(k), 0, () => { flames(CX, 790, 640, 360, t, 4); ctx.save(); ctx.translate(CX, 620); ctx.rotate(-0.06); fillRR(-340, -170, 680, 340, 36, '#fff7e0'); strokeRR(-340, -170, 680, 340, 36, '#d9a52e', 10); circle(-290, -120, 18, '#222'); text('PRICE', 0, -90, 50, 800, '#6b4a34', 'center', 0.2); text('???', 0, 40, 170, 800, '#b3261e', 'center', 0); ctx.restore(); flames(CX - 330, 800, 260, 200, t, 7); flames(CX + 330, 800, 260, 200, t, 9); });
    [['+ SETUP FEE', 0.5], ['+ HIDDEN FEE', 0.9], ['+ SURPRISE', 1.3]].forEach(([s, d], i) => { const e = pop(t, T.fireSale + d, 0.3); if (e > 0) xf(CX, 980 + i * 100, clamp(e), 0, () => { const w = tw(s, 44, 800, 0.05) + 80; fillRR(CX - w / 2, 940 + i * 100, w, 84, 42, rgba(RED, 0.16)); strokeRR(CX - w / 2, 940 + i * 100, w, 84, 42, rgba(RED, 0.7), 3); text(s, CX, 983 + i * 100, 44, 800, '#ff8a7f', 'center', 0.05); }); });
  });
}
const FEATS = ['Booking calendar', 'Client health scoring', 'SMS & email reminders', 'Invoicing & payment links', 'Loyalty & rewards', 'Reviews & review requests'];
function planCard(t, y, name, price, o = {}) { card(CARD.x, y, CARD.w, o.h ?? 600, o.hot ? { stroke: rgba(IN.mid, 0.8), lw: 3, fill: rgba(C.primary, 0.1) } : {}); text(name, CARD.x + 40, y + 62, 40, 800, '#fff', 'left'); if (o.tag) tag(CARD.x + CARD.w - 36, y + 62, o.tag, IN.mid, false, 18); }
function sceneStarter(t) {
  stage(t, 0.22);
  withFade(enter(t, T.upfront - 0.1, T.yearly, 0.2), () => {
    eyebrow('PLANS · PRICES UP FRONT', 300); const y0 = 340; planCard(t, y0, 'Starter', '', { hot: true, h: 880, tag: 'PERFECT FOR GETTING STARTED' });
    const p = pop(t, T.fifty - 0.1, 0.4); xf(CARD.x + 200, y0 + 180, clamp(p), 0, () => { text('$50', CARD.x + 40, y0 + 180, 140, 800, '#fff', 'left', -0.03); text('/mo', CARD.x + 40 + tw('$50', 140, 800, -0.03) + 14, y0 + 205, 44, 600, MUTED, 'left'); });
    FEATS.forEach((f, i) => { const e = pop(t, T.incl + i * 0.45 - 0.1, 0.3); if (e > 0) xf(CX, y0 + 340 + i * 82, clamp(e), 0, () => { const y = y0 + 340 + i * 82; circle(CARD.x + 66, y, 18, GREEN); check(CARD.x + 66, y + 1, 18, '#fff', 4); text(f, CARD.x + 110, y + 1, 34, 700, '#fff', 'left'); }); });
  });
}
function sceneYearly(t) {
  stage(t, 0.22);
  withFade(enter(t, T.yearly - 0.05, T.offerAt, 0.2), () => {
    eyebrow('BILLING', 300); const ann = t > T.yearly + 0.7 && t < T.half - 0.2; const w = 760, x = CX - w / 2;
    fillRR(x, 360, w, 90, 45, 'rgba(255,255,255,0.08)'); fillRR(ann ? x + w / 2 : x, 360, w / 2, 90, 45, C.primary); text('Monthly', x + w / 4, 405, 32, 800, ann ? MUTED : '#fff', 'center'); text('Annual, save 20%', x + w * 3 / 4, 405, 32, 800, ann ? '#fff' : MUTED, 'center');
    card(CARD.x, 520, CARD.w, 560); text('Starter', CARD.x + 40, 600, 40, 800, '#fff', 'left');
    const pr = ann ? 40 : 50; text('$' + pr, CARD.x + 40, 760, 170, 800, ann ? '#9ff0c0' : '#fff', 'left', -0.03); text('/mo', CARD.x + 40 + tw('$' + pr, 170, 800, -0.03) + 16, 790, 48, 600, MUTED, 'left'); if (ann) { text('$50', CARD.x + 620, 700, 44, 700, MUTED, 'left'); line(CARD.x + 620, 700, CARD.x + 620 + tw('$50', 44, 700), 700, MUTED, 4); }
    const s = pop(t, T.twenty, 0.4); if (s > 0 && ann) xf(CX, 940, clamp(s), 0, () => { const lb = 'You save $120 a year', ww = tw(lb, 40, 800) + 120; fillRR(CX - ww / 2, 890, ww, 100, 50, rgba(GREEN, 0.2)); strokeRR(CX - ww / 2, 890, ww, 100, 50, GREEN, 3); circle(CX - ww / 2 + 56, 940, 22, GREEN); check(CX - ww / 2 + 56, 941, 22, '#fff', 4.5); text(lb, CX - ww / 2 + 96, 941, 40, 800, '#fff', 'left'); });
    const h = pop(t, T.half, 0.4); if (h > 0) xf(CX, 1250, clamp(h), 0, () => { card(CARD.x, 1150, CARD.w, 220, { fill: rgba(C.primary, 0.14), stroke: rgba(IN.mid, 0.8), lw: 3 }); text('FIRST MONTH', CX, 1200, 24, 800, MUTED, 'center', 0.25);
      text('$50', CX - 150, 1285, 80, 800, MUTED, 'center'); line(CX - 150 - tw('$50', 80, 800) / 2, 1285, CX - 150 + tw('$50', 80, 800) / 2, 1285, MUTED, 6); text('→', CX, 1285, 60, 700, MUTED, 'center'); const nw = pop(t, T.tf - 0.4, 0.35); xf(CX + 170, 1285, 0.6 + 0.4 * clamp(nw), 0, () => text('$25', CX + 170, 1285, 120, 800, '#9ff0c0', 'center', -0.03)); });
  });
}
const SCENES = [[0, T.fire, sceneCrassus], [T.fire, T.sell, sceneOffer], [T.sell, T.no, sceneSell], [T.no, T.rich, sceneNo], [T.rich, T.water, sceneRich], [T.water, T.fireSale, sceneWater], [T.fireSale, T.brand, sceneFireSale],
  [T.brand, T.upfront, (t) => brandHit(t, T.brand, T.upfront)], [T.upfront, T.yearly, sceneStarter], [T.yearly, T.offerAt, sceneYearly], [T.offerAt, T.end, (t) => offerCard(t, T.offerAt, T.end)], [T.end, 999, (t) => endCard(t, T.end, T.cta, T.url)]];
cue(T.crassus, 'ding', 0.8); cue(T.brigade, 'punch', 0.9); cue(T.fire, 'swoosh', 0.8); cue(T.offer, 'notification', 0.9); cue(T.sell, 'swish', 0.8); cue(T.cheap, 'punch', 1); cue(T.no, 'punch', 1); cue(T.burn, 'swoosh', 0.8); cue(T.rich, 'ding', 1);
for (let i = 0; i < 5; i++) cue(T.rich + i * 0.25, 'tap', 0.5); cue(T.water, 'swish', 0.7); cue(T.extra, 'punch', 1); cue(T.fireSale, 'punch', 1); for (let i = 0; i < 3; i++) cue(T.fireSale + 0.5 + i * 0.4, 'notification', 0.7);
cue(T.brand, 'transitionHit', 1); cue(T.fifty - 0.1, 'ding', 1); FEATS.forEach((_, i) => cue(T.incl + i * 0.45 - 0.1, 'key', 0.6)); cue(T.yearly + 0.7, 'tap', 1); cue(T.twenty, 'ding', 1); cue(T.half, 'swish', 0.8); cue(T.tf - 0.4, 'ding', 1);
cue(T.offerAt, 'punch', 1); [0, 1, 2].forEach((i) => cue(T.offerAt + 0.45 + i * 0.12, 'key', 0.6)); cue(T.end, 'swish', 0.8); cue(T.cta, 'tap', 1.2);
boot({ duration: DURATION, scenes: SCENES, brandAt: T.brand, hideCaption: (t) => t >= T.end - 0.1,
  after: (t) => { const f = 1 - seg(t, T.brand, T.brand + 0.12); if (t >= T.brand && f > 0) { ctx.fillStyle = rgba('#ffffff', 0.5 * f); ctx.fillRect(0, 0, W, H); } } }, 'crassus');
