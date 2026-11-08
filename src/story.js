// MsgHealth · "Our story" · founder-story video (1080 × 1920, 30 fps), built on src/kit.js + src/story-kit.js.
// The README copy of the story is the framework, not the script: same beats (mom's chair → clients quietly vanishing → tools she
// couldn't afford → a sophomore builds it → what the name means → bigger than one salon → made for you), told with sight gags.
// Illustrative only: the people, the board and the scores on screen are not real data.
// No voiceover in the render: the founder records it. src/story-vo.js (made from scripts/vo/story.json) is kept as the timeline
// every beat hangs on; STORY-SCRIPT.md lists when to say each line. story-captions.html sets STORY_CAPTIONS for the captioned cut.
'use strict';
// Phrase starts checked by hand where the automatic alignment slipped (read off the pauses in the reference read).
VO_CLIPS[2].chunks.forEach((c, k) => (c[1] = [0, 1.36, 2.09][k]));
VO_CLIPS[24].chunks.forEach((c, k) => (c[1] = [0, 1.0, 2.26, 3.43, 4.96, 6.05][k]));
const L = (i) => VO_AT[i];
const word = (l, k) => VO_AT[l] + VO_CLIPS[l].chunks[k][1];
const END = L(26);
const DURATION = +(END + VO_CLIPS[26].dur + 1.9).toFixed(2);
const T = { brand: L(16), end: END, cta: END + 1.0 };
window.CUES = T; window.SFX = []; const cue = (t, kind, gain) => window.SFX.push({ t, kind, gain });
window.MUSIC = { bpm: 96, root: 48, brandAt: T.brand, mood: 'quirky', noVoice: true };
const SHOW_CAPS = !!window.STORY_CAPTIONS;

const MOM = SKIN[3], MOMHAIR = '#1b1b1f';
function heartS(x, y, s, col) { ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(x, y + s * 0.42); ctx.bezierCurveTo(x - s * 0.95, y - s * 0.25, x - s * 0.45, y - s * 0.95, x, y - s * 0.32); ctx.bezierCurveTo(x + s * 0.45, y - s * 0.95, x + s * 0.95, y - s * 0.25, x, y + s * 0.42); ctx.fill(); }

// ── salon set ────────────────────────────────────────────────────────────────
const FLOOR = 1180;
function salonBG(dim = 0) {
  ctx.fillStyle = vgrad(0, FLOOR, '#f7ebdd', '#ecd6c0'); ctx.fillRect(0, 0, W, FLOOR);
  ctx.fillStyle = '#dcc0a4'; ctx.fillRect(0, 930, W, FLOOR - 930); ctx.fillStyle = '#c9a98a'; ctx.fillRect(0, 920, W, 14);
  ctx.fillStyle = vgrad(FLOOR, H, '#b98f6b', '#8c6648'); ctx.fillRect(0, FLOOR, W, H - FLOOR);
  for (let i = 0; i < 7; i++) line(i * 190 - 60, FLOOR, i * 260 - 400, H, 'rgba(0,0,0,0.05)', 3);
  ctx.fillStyle = 'rgba(0,0,0,0.08)'; ctx.fillRect(0, FLOOR, W, 40);
  // mirror
  fillRR(170, 300, 740, 560, 44, '#8a6a4a'); fillRR(192, 322, 696, 516, 30, vgrad(322, 838, '#dff1fb', '#b8d9ea'));
  poly([[260, 322], [340, 322], [230, 838], [192, 838]], 'rgba(255,255,255,0.35)'); poly([[420, 322], [450, 322], [340, 838], [312, 838]], 'rgba(255,255,255,0.25)');
  if (dim) { ctx.fillStyle = `rgba(40,30,50,${dim})`; ctx.fillRect(0, 0, W, H); }
}
function chair(x, y, s, col = '#c0392b') {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  shadow(0, 0, 130); ellipse(0, -8, 98, 17, '#2b2b30'); fillRR(-12, -160, 24, 150, 6, '#9aa0aa'); fillRR(-60, -76, 120, 18, 8, '#8d939d');
  fillRR(-86, -500, 172, 290, 44, col); fillRR(-68, -560, 136, 84, 32, col); fillRR(-100, -250, 200, 76, 28, col); fillRR(-44, -188, 88, 28, 10, '#2b2b30');
  fillRR(-132, -330, 30, 100, 12, '#2b2b30'); fillRR(102, -330, 30, 100, 12, '#2b2b30'); fillRR(-136, -346, 38, 26, 10, '#3a3a42'); fillRR(98, -346, 38, 26, 10, '#3a3a42');
  ctx.restore();
}
// ── the two main characters: a front-facing rig (design units: 1000 = feet to crown) ──
// The founder is drawn from the reference photo: short textured crop with a flat fringe and faded sides, thick straight
// brows, dark brown eyes, short goatee, black tee, silver curb chain, small stud by the ear. Mom shares the rig.
const FOUNDER = { skin: '#e2b08c', skinShade: '#cf9874', hair: '#3a2a20', hairHi: '#5a4332', shirt: '#16161b', pants: '#2b3040', shoes: '#22222a', style: 'crop', beard: true, chain: true, stud: true };
const MOMLOOK = { skin: '#a86c48', skinShade: '#93593a', hair: '#1b1b1f', hairHi: '#34343c', shirt: '#7c6cf0', pants: '#2c3340', shoes: '#22222a', style: 'bun', apron: true, hoops: true };
// o: arm 'down' | 'wave' | 'think' (hand at chin) | 'heart' (hand on chest); look -1..1 (pupils left/right); mouth 'smile' | 'open' | 'flat'; wave (phase)
function hero(x, y, h, look, o = {}) {
  const L2 = { ...look, ...o }, s = h / 1000, arm = L2.arm ?? 'down', lk = clamp(L2.look ?? 0, -1, 1);
  ctx.save(); ctx.translate(x, y + (L2.bob ?? 0)); ctx.scale(s, s);
  ellipse(0, 0, 175, 20, 'rgba(0,0,0,0.22)');
  // legs + shoes
  fillRR(-96, -480, 86, 460, 26, L2.pants); fillRR(10, -480, 86, 460, 26, L2.pants); fillRR(-112, -46, 108, 46, 20, L2.shoes); fillRR(4, -46, 108, 46, 20, L2.shoes);
  // back hair (bun / long) behind everything above the shoulders
  if (L2.style === 'bun') { circle(0, -1020, 52, L2.hair); fillRR(-108, -960, 216, 150, 60, L2.hair); }
  // torso (tee) + sleeves
  fillRR(-150, -782, 300, 362, 64, L2.shirt);
  if (L2.apron) { fillRR(-120, -690, 240, 300, 26, '#3a3a46'); fillRR(-60, -560, 120, 70, 12, '#4a4a58'); line(-30, -575, -30, -520, '#d9dce1', 6); line(-14, -575, -14, -520, '#d9dce1', 4); line(-120, -690, -70, -775, '#3a3a46', 14); line(120, -690, 70, -775, '#3a3a46', 14); }
  const skin = L2.skin;
  const sleeve = (sx) => { ctx.save(); ctx.translate(sx, -705); ctx.rotate(sx < 0 ? 0.12 : -0.12); fillRR(-34, -72, 68, 140, 30, L2.shirt); ctx.restore(); };
  const limb = (pts) => { ctx.strokeStyle = skin; ctx.lineWidth = 58; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); pts.forEach(([px, py], i) => (i ? ctx.lineTo(px, py) : ctx.moveTo(px, py))); ctx.stroke(); };
  // left arm (viewer's left) always down
  limb([[-168, -650], [-176, -445]]); circle(-176, -432, 32, skin); sleeve(-158);
  if (arm === 'wave') { const a = Math.sin((L2.wave ?? 0) * 9) * 0.25; const ex = 245, ey = -820, hx = ex + Math.sin(a) * 160, hy = ey - Math.cos(a) * 160; limb([[172, -690], [ex, ey], [hx, hy]]); circle(hx, hy, 36, skin); ctx.save(); ctx.translate(160, -712); ctx.rotate(-0.95); fillRR(-34, -40, 68, 120, 30, L2.shirt); ctx.restore(); }
  else if (arm === 'think') { limb([[168, -660], [200, -560], [60, -790]]); sleeve(158); }
  else if (arm === 'heart') { limb([[168, -660], [186, -540], [40, -640]]); sleeve(158); circle(40, -640, 32, skin); }
  else { limb([[168, -650], [176, -445]]); circle(176, -432, 32, skin); sleeve(158); }
  // neck, collar, chain
  fillRR(-44, -840, 88, 90, 24, L2.skinShade); ctx.beginPath(); ctx.ellipse(0, -778, 62, 24, 0, 0, Math.PI); ctx.fillStyle = L2.skinShade; ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 8; ctx.beginPath(); ctx.ellipse(0, -780, 66, 28, 0, 0.05 * Math.PI, 0.95 * Math.PI); ctx.stroke();
  if (L2.chain) { ctx.lineCap = 'round'; ctx.strokeStyle = '#d6dae0'; ctx.lineWidth = 10; ctx.beginPath(); ctx.ellipse(0, -790, 56, 52, 0, 0.12 * Math.PI, 0.88 * Math.PI); ctx.stroke(); ctx.strokeStyle = '#8c929b'; ctx.lineWidth = 4; ctx.setLineDash([7, 7]); ctx.stroke(); ctx.setLineDash([]); }
  if (arm === 'think') circle(60, -790, 36, skin); // the hand sits in front of the neck, under the chin
  // ears (+ hoops / stud), head
  ellipse(-97, -895, 17, 29, L2.skinShade); ellipse(97, -895, 17, 29, L2.skinShade);
  if (L2.hoops) { ring(-97, -858, 13, '#e2b23c', 5); ring(97, -858, 13, '#e2b23c', 5); }
  ctx.beginPath(); ctx.moveTo(-95, -915); ctx.arc(0, -915, 95, Math.PI, 0); ctx.bezierCurveTo(95, -862, 82, -832, 46, -812); ctx.quadraticCurveTo(0, -792, -46, -812); ctx.bezierCurveTo(-82, -832, -95, -862, -95, -915); ctx.closePath(); ctx.fillStyle = skin; ctx.fill();
  if (L2.stud) circle(-93, -893, 5, '#eef0f3');
  // hair
  ctx.fillStyle = L2.hair; ctx.beginPath();
  if (L2.style === 'crop') {
    ctx.moveTo(-99, -900); ctx.lineTo(-100, -935); ctx.arc(0, -928, 101, Math.PI * 1.01, Math.PI * 1.99); ctx.lineTo(99, -900); ctx.lineTo(90, -928); ctx.lineTo(80, -958);
    for (let i = 0; i <= 16; i++) ctx.lineTo(80 - i * 10, i % 2 ? -957 : -961);
    ctx.lineTo(-90, -928); ctx.closePath(); ctx.fill();
    ellipse(-93, -918, 12, 24, rgba(L2.hair, 0.45)); ellipse(93, -918, 12, 24, rgba(L2.hair, 0.45)); // faded sides
    ctx.strokeStyle = L2.hairHi; ctx.lineWidth = 4; ctx.lineCap = 'round'; for (let i = 0; i < 9; i++) { const hx = -64 + i * 16, hy = -1004 + Math.abs(i - 4) * 5; line(hx, hy, hx + 4, hy + 12, rgba(L2.hairHi, 0.55), 3); }
  } else {
    ctx.moveTo(-100, -880); ctx.lineTo(-100, -935); ctx.arc(0, -928, 102, Math.PI * 1.01, Math.PI * 1.99); ctx.lineTo(100, -880); ctx.lineTo(86, -900); ctx.quadraticCurveTo(70, -965, 0, -968); ctx.quadraticCurveTo(-70, -965, -86, -900); ctx.closePath(); ctx.fill();
  }
  // brows, eyes
  const browY = L2.style === 'crop' ? -936 : -932, bw = L2.style === 'crop' ? 13 : 8;
  poly([[-76, browY + 4], [-22, browY - 3], [-20, browY + bw - 3], [-75, browY + bw + 2]], L2.style === 'crop' ? '#2a1d17' : '#1b1b1f');
  poly([[76, browY + 4], [22, browY - 3], [20, browY + bw - 3], [75, browY + bw + 2]], L2.style === 'crop' ? '#2a1d17' : '#1b1b1f');
  [-46, 46].forEach((ex) => {
    ellipse(ex, -909, 21, 10, '#f6efe8'); circle(ex + lk * 7, -909, 9.5, '#3b2618'); circle(ex + lk * 7, -909, 4.5, '#0e0806'); circle(ex + lk * 7 + 3, -912, 2.2, '#fff');
    ctx.strokeStyle = '#2a1d17'; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(ex, -906, 23, 12, 0, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke();
  });
  // nose
  ctx.strokeStyle = L2.skinShade; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-6, -895); ctx.quadraticCurveTo(-14, -868, -2, -862); ctx.stroke(); ellipse(0, -861, 17, 6, rgba(L2.skinShade, 0.8));
  // mouth (+ facial hair)
  const lip = L2.style === 'crop' ? '#c88473' : '#9a4f45';
  if (L2.beard) { ellipse(0, -849, 28, 5, rgba(L2.hair, 0.25)); }
  if (L2.mouth === 'open') { ellipse(0, -831, 20, 13, '#6b2a2a'); ellipse(0, -825, 12, 5, '#c0646a'); }
  else if (L2.mouth === 'smile') { ctx.strokeStyle = '#7a3a34'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-28, -838); ctx.quadraticCurveTo(0, -818, 28, -838); ctx.stroke(); ellipse(0, -826, 18, 4, rgba(lip, 0.9)); }
  else { ellipse(0, -836, 30, 7, lip); ellipse(0, -828, 25, 8, rgba(lip, 0.85)); line(-28, -834, 28, -834, '#7a3a34', 3); }
  if (L2.beard) {
    ctx.strokeStyle = rgba(L2.hair, 0.8); ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-42, -816); ctx.quadraticCurveTo(0, -790, 42, -816); ctx.stroke();
    fillRR(-6, -818, 12, 9, 4, rgba(L2.hair, 0.7)); line(-31, -829, -40, -817, rgba(L2.hair, 0.4), 4); line(31, -829, 40, -817, rgba(L2.hair, 0.4), 4);
  }
  ctx.restore();
}
function founder(x, y, h, o = {}) { hero(x, y, h, FOUNDER, o); }
function mom(x, y, h, o = {}) { hero(x, y, h, MOMLOOK, o); }
function thinkBubble(x, y, a, s = '?') { if (a <= 0) return; xf(x, y, clamp(a), 0, () => { circle(x - 70, y + 92, 12, '#fff'); circle(x - 44, y + 62, 18, '#fff'); fillRR(x - 60, y - 60, 120, 110, 50, '#fff'); text(s, x, y - 2, 72, 800, '#7c6cf0', 'center', 0); }); }
function kid(x, y, h, i) { person(x, y, h, 300 + i * 7, { skin: [SKIN[3], SKIN[2], SKIN[4]][i % 3], shirt: SHIRT[(i * 3) % SHIRT.length], pants: PANTS[i % PANTS.length], hair: HAIR[i % HAIR.length], mouth: 'open', bounce: 0 }); }

// ── 1 · mom, a chair, seven kids ─────────────────────────────────────────────
function sceneSalon(t) {
  salonBG();
  chair(310, 1240, 1.25);
  const m = pop(t, 0.2, 0.45); xf(760, 1240, clamp(m), 0, () => mom(760, 1240, 660, { arm: t < 3 ? 'wave' : 'down', wave: t, mouth: 'smile', look: -0.3 }));
  const sevenAt = L(0) + 2.0;
  for (let i = 0; i < 7; i++) {
    const h0 = 330 - i * 12, x = 118 + i * 140, grow = 1 + 0.17 * ease.out(seg(t, word(3, 2), word(3, 2) + 0.5)), k = pop(t, sevenAt + i * 0.12, 0.35);
    xf(x, 1420, clamp(k), 0, () => kid(x, 1420, h0 * grow, i));
  }
  // banners (top): 7 kids · 1 chair · zero slow weeks
  const b1 = pop(t, word(1, 0), 0.3), b2 = pop(t, word(1, 1), 0.3), b3 = pop(t, word(1, 2), 0.3);
  if (t < L(2) - 0.05) {
    if (b1 > 0) xf(300, 170, clamp(b1), 0, () => banner('7 KIDS', 300, 170, 78, '#7c6cf0', '#fff', -0.04));
    if (b2 > 0) xf(760, 170, clamp(b2), 0, () => banner('1 CHAIR', 760, 170, 78, '#c0392b', '#fff', 0.04));
    if (b3 > 0) xf(CX, 290, clamp(b3), 0, () => banner('ZERO SLOW WEEKS', CX, 290, 48, '#1b1f27', '#fff', 0));
  }
  // what the chair paid for: food · clothes · care (icons on the mirror)
  const ic = [[word(2, 0), 320, 'FOOD'], [word(2, 1), 540, 'CLOTHES'], [word(2, 2), 760, 'CARE']];
  if (t >= L(2) - 0.05 && t < L(3) + 0.3) ic.forEach(([at, x, lb], i) => {
    const k = pop(t, at, 0.35); if (k <= 0) return;
    const Y = 430, d = Y - 560;
    xf(x, Y, clamp(k), 0, () => {
      circle(x, Y, 86, '#fff'); ring(x, Y, 86, 'rgba(0,0,0,0.08)', 4);
      ctx.save(); ctx.translate(0, d);
      if (i === 0) { circle(x - 14, 566, 34, '#e0392d'); circle(x + 14, 566, 34, '#e0392d'); line(x, 530, x + 8, 502, '#5a3a1f', 6); ellipse(x + 24, 508, 20, 9, '#3da35a', -0.5); }
      if (i === 1) { poly([[x - 50, 530], [x - 20, 520], [x, 534], [x + 20, 520], [x + 50, 530], [x + 66, 566], [x + 38, 576], [x + 34, 612], [x - 34, 612], [x - 38, 576], [x - 66, 566]], '#6c8ebf'); }
      if (i === 2) heartS(x, 560, 96, '#e0527a');
      ctx.restore(); fillRR(x - 70, Y + 64, 140, 40, 20, '#1b1f27'); text(lb, x, Y + 85, 22, 800, '#fff', 'center', 0.12);
    });
  });
  // shoes joke (line 3)
  if (t >= L(3) - 0.05) {
    const a = pop(t, word(3, 0), 0.3), b = pop(t, word(3, 2), 0.3);
    if (a > 0) xf(CX, 200, clamp(a), 0, () => banner('7 PAIRS OF SHOES', CX, 200, 62, '#1b1f27', '#fff', -0.03));
    if (b > 0) xf(CX, 330, clamp(b), 0, () => banner('TOO SMALL. AGAIN.', CX, 330, 56, '#b3261e', '#fff', 0.03));
  }
}

// ── 2 · the regulars board: they quietly drift away ──────────────────────────
function bust(x, y, r, seed) {
  const skin = SKIN[Math.floor(hash(seed) * SKIN.length)], hair = HAIR[Math.floor(hash(seed + 3) * HAIR.length)], sh = SHIRT[Math.floor(hash(seed + 5) * SHIRT.length)];
  ellipse(x, y + r * 1.55, r * 1.25, r * 0.95, sh); circle(x, y, r, skin);
  ctx.beginPath(); ctx.arc(x, y - r * 0.1, r * 1.05, Math.PI * 1.02, Math.PI * 1.98); ctx.closePath(); ctx.fillStyle = hair; ctx.fill();
  circle(x - r * 0.33, y + r * 0.1, r * 0.09, '#1b1410'); circle(x + r * 0.33, y + r * 0.1, r * 0.09, '#1b1410'); line(x - r * 0.25, y + r * 0.5, x + r * 0.25, y + r * 0.5, '#6b3f28', Math.max(2, r * 0.07));
}
function sceneBoard(t) {
  ctx.fillStyle = vgrad(0, 1380, '#f2e4d3', '#e4cdb4'); ctx.fillRect(0, 0, W, 1380); ctx.fillStyle = vgrad(1380, H, '#b98f6b', '#8c6648'); ctx.fillRect(0, 1380, W, H - 1380); ctx.fillStyle = 'rgba(0,0,0,0.08)'; ctx.fillRect(0, 1380, W, 34);
  const BX = 40, BY = 300, BW = 660, BH = 1000;
  fillRR(BX, BY, BW, BH, 26, '#a7794f'); fillRR(BX + 22, BY + 22, BW - 44, BH - 44, 16, '#d2a679');
  for (let i = 0; i < 70; i++) circle(BX + 40 + hash(i) * (BW - 80), BY + 40 + hash(i + 40) * (BH - 80), 2.5, 'rgba(120,80,40,0.25)');
  fillRR(BX + BW / 2 - 280, BY - 70, 560, 96, 24, '#fff'); text('MY MOM\u2019S REGULARS', BX + BW / 2, BY - 21, 40, 800, '#7c6cf0', 'center', 0.03);
  const first = word(4, 1) + 0.2;
  ctx.save(); rr(BX + 22, BY + 22, BW - 44, BH - 44, 16); ctx.clip();
  for (let i = 0; i < 12; i++) {
    const c = i % 3, r = Math.floor(i / 3), x = BX + 120 + c * 210, y = BY + 140 + r * 240, e = pop(t, 0.2 + i * 0.05 + L(4), 0.3);
    const gone = seg(t, first + i * 0.4, first + i * 0.4 + 1.0), rot = (hash(i + 9) - 0.5) * 0.1, sc = 0.82;
    if (e <= 0 || gone >= 1) continue;
    ctx.save(); ctx.globalAlpha *= (1 - ease.in(gone)) * clamp(e); ctx.translate(x + Math.sin(t * 2 + i) * 6 * gone, y - gone * 140); ctx.rotate(rot + gone * (hash(i) - 0.5) * 0.8); ctx.scale(sc * clamp(e) * (1 - 0.15 * gone), sc * clamp(e) * (1 - 0.15 * gone));
    ctx.shadowColor = 'rgba(0,0,0,0.25)'; ctx.shadowBlur = 14; ctx.shadowOffsetY = 6; fillRR(-110, -105, 220, 210, 8, '#fffdf8'); ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
    ctx.save(); rr(-95, -90, 190, 150, 4); ctx.clip(); ctx.fillStyle = ['#cfe7f3', '#f3dccf', '#d9ecd0'][i % 3]; ctx.fillRect(-95, -90, 190, 150); ctx.translate(0, -10); bust(0, -5, 38, i * 5 + 2); ctx.restore();
    text(['Regular', 'Every 3 wks', 'Loyal', 'Monthly'][i % 4], 0, 82, 24, 700, '#5a4a3a', 'center'); circle(0, -108, 10, '#e0392d');
    ctx.restore();
  }
  ctx.restore();
  // the founder notices (line 4) and stays puzzled
  const f = pop(t, L(4) + 0.1, 0.45); xf(880, 1400, clamp(f), 0, () => founder(880, 1400, 760, { arm: t > word(4, 0) + 0.3 ? 'think' : 'down', look: -1, mouth: 'flat' }));
  thinkBubble(930, 450, pop(t, word(4, 0) + 0.6, 0.35));
  const p = pop(t, L(6) - 1.2, 0.4); if (p > 0) xf(BX + BW / 2, 800, clamp(p), 0, () => postit(BX + BW / 2, 800, 360, ['she had', 'no way', 'of knowing'], -0.05, '#ffe27a', '#3a2a1a', 50));
}

// ── 3 · the chair sits empty (dust is the only booking) ──────────────────────
function sceneEmpty(t) {
  salonBG(0.1);
  chair(CX, 1330, 1.9, '#9a4a40');
  // calendar months flipping
  const months = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL'], m = Math.min(3, Math.floor((t - L(6)) / 0.7));
  fillRR(CX - 250, 120, 500, 150, 24, '#fff'); text(months[Math.max(0, m)], CX, 180, 70, 800, '#1b1f27', 'center', 0.01); text('0 appointments', CX, 240, 28, 600, '#b3261e', 'center');
  // cobweb
  ctx.strokeStyle = 'rgba(80,80,90,0.55)'; ctx.lineWidth = 2.5; for (let i = 0; i < 6; i++) { const a = (i / 5) * Math.PI / 2; line(0, 0, Math.cos(a) * 320, Math.sin(a) * 320, ctx.strokeStyle, 2.5); }
  for (let r = 1; r <= 5; r++) { ctx.beginPath(); for (let i = 0; i < 6; i++) { const a = (i / 5) * Math.PI / 2, rr2 = r * 62 - (i % 2 ? 6 : 0); i ? ctx.lineTo(Math.cos(a) * rr2, Math.sin(a) * rr2) : ctx.moveTo(Math.cos(a) * rr2, Math.sin(a) * rr2); } ctx.stroke(); }
  // tumbleweed
  const tk = seg(t, L(6) + 0.3, L(8) - 0.1), tx = lerp(1300, -300, tk), ty = 1700 - Math.abs(Math.sin(tk * Math.PI * 5)) * 70; shadow(tx, 1780, 110);
  ctx.save(); ctx.translate(tx, ty); ctx.rotate(-tx / 90); for (let i = 0; i < 26; i++) { ctx.beginPath(); ctx.ellipse(0, 0, 105, 40 + (i % 4) * 16, (i / 26) * Math.PI, 0, Math.PI * 2); ctx.strokeStyle = i % 2 ? '#8a6a3e' : '#a8875a'; ctx.lineWidth = 5; ctx.stroke(); } ctx.restore();
  // the dust bunny with an appointment
  const d = pop(t, word(7, 1) - 0.4, 0.4);
  if (d > 0) xf(CX, 1000, clamp(d), 0, () => {
    const x = CX, y = 1000; for (let i = 0; i < 14; i++) { const a = (i / 14) * Math.PI * 2; circle(x + Math.cos(a) * 54, y + Math.sin(a) * 40, 22, '#9b9ba6'); } circle(x, y, 56, '#b3b3bd');
    circle(x - 18, y - 6, 8, '#1b1410'); circle(x + 18, y - 6, 8, '#1b1410'); line(x - 14, y + 20, x + 14, y + 20, '#1b1410', 4);
    const bw = tw('Booked 10:00', 34, 800) + 110; fillRR(x + 70, y - 130, bw, 96, 28, '#fff'); poly([[x + 90, y - 40], [x + 70, y - 8], [x + 120, y - 40]], '#fff'); text('Booked', x + 98, y - 82, 34, 800, '#1b1f27', 'left'); text('10:00', x + 98 + tw('Booked ', 34, 800), y - 82, 34, 800, '#7c6cf0', 'left'); check(x + 70 + bw - 40, y - 82, 22, '#3dbb74', 6);
  });
}

// ── 4 · the money jar ────────────────────────────────────────────────────────
function sceneJar(t) {
  ctx.fillStyle = vgrad(0, H, '#fbeedb', '#e9cfaa'); ctx.fillRect(0, 0, W, H);
  fillRR(0, 1380, W, 540, 0, '#b98b5c'); fillRR(0, 1380, W, 24, 0, '#d0a574');
  const jx = CX, jy = 1380, top = jy - 760;
  shadow(jx, jy, 320); fillRR(jx - 260, top, 520, 760, 70, 'rgba(210,235,245,0.5)');
  const base = L(8), n = 14, coin = (px, py) => { ellipse(px, py, 46, 20, '#d9a21b'); ellipse(px, py - 8, 46, 20, '#f2c53d'); text('$', px, py - 8, 24, 800, '#a87908', 'center', 0); };
  const inside = [], outside = [];
  for (let i = n - 1; i >= 0; i--) {
    const out = word(8, 1) + 0.15 + i * 0.16, k = seg(t, out, out + 1.2); if (k >= 1) continue;
    const row = Math.floor(i / 4), col = i % 4, x = jx - 150 + col * 100 + (row % 2) * 40, y = jy - 40 - row * 56;
    const up = ease.inOut(seg(k, 0, 0.55)), fly = seg(k, 0.55, 1), dir = i % 2 ? 1 : -1;
    const px = lerp(x, jx + dir * 40, up) + dir * fly * 330 * (0.5 + 0.5 * hash(i)), py = lerp(y, top - 40, up) - Math.sin(fly * Math.PI) * 120 + fly * 200;
    (py > top + 10 ? inside : outside).push([px, py, 1 - ease.in(fly)]);
  }
  inside.forEach(([px, py]) => coin(px, py));
  ctx.fillStyle = 'rgba(255,255,255,0.12)'; ctx.fillRect(jx - 240, top + 30, 60, 680); strokeRR(jx - 260, top, 520, 760, 70, 'rgba(255,255,255,0.9)', 8); fillRR(jx - 236, top - 22, 472, 40, 18, 'rgba(225,240,248,0.95)');
  fillRR(jx - 190, jy - 470, 380, 180, 20, '#fffaf0'); text('OUR FAMILY', jx, jy - 410, 44, 800, '#7c6cf0', 'center', 0.06); text('MONEY', jx, jy - 352, 44, 800, '#7c6cf0', 'center', 0.06);
  outside.forEach(([px, py, a]) => withFade(a, () => coin(px, py)));
  const e = pop(t, base + 0.2, 0.4); if (e > 0) xf(CX, 220, clamp(e), 0, () => banner('COUNTING ON IT', CX, 230, 64, '#1b1f27', '#fff', -0.02));
  const e2 = pop(t, word(8, 1), 0.4); if (e2 > 0) xf(CX, 380, clamp(e2), 0, () => banner('...and it\u2019s leaving', CX, 380, 44, '#b3261e', '#fff', 0.02));
}

// ── 5 · the tools she couldn't afford, kidney included ───────────────────────
function kidney(x, y, s, rot, col = '#d9677a') {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  ctx.beginPath(); ctx.moveTo(0, -60); ctx.bezierCurveTo(78, -66, 96, 0, 62, 44); ctx.bezierCurveTo(40, 78, 4, 70, 10, 32); ctx.bezierCurveTo(14, 6, -8, 0, -34, 10); ctx.bezierCurveTo(-80, 26, -66, -54, 0, -60); ctx.closePath();
  ctx.fillStyle = col; ctx.fill(); ctx.strokeStyle = 'rgba(0,0,0,0.18)'; ctx.lineWidth = 5; ctx.stroke(); ctx.restore();
}
function kface(x, y, s, worried = true) { circle(x - 16 * s, y, 7 * s, '#fff'); circle(x + 16 * s, y, 7 * s, '#fff'); circle(x - 15 * s, y + 1, 3.5 * s, '#1b1410'); circle(x + 17 * s, y + 1, 3.5 * s, '#1b1410'); if (worried) { ctx.strokeStyle = '#6b2a2a'; ctx.lineWidth = 4 * s; ctx.beginPath(); ctx.arc(x, y + 26 * s, 12 * s, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); } else line(x - 10 * s, y + 20 * s, x + 10 * s, y + 20 * s, '#6b2a2a', 4 * s); }
function sceneSubs(t) {
  stage(t, 0.2); eyebrow('THE TOOLS THAT ALREADY EXISTED', 250);
  const names = ['Client records', 'Texting', 'Reminders', 'Reviews', 'Loyalty'], at0 = L(9) + 0.6;
  names.forEach((n, i) => {
    const e = pop(t, at0 + i * 0.4, 0.35), y = 330 + i * 180; if (e <= 0) return;
    xf(CX, y + 60, clamp(e), 0, () => { card(130, y, 820, 140, { r: 28 }); text(n, 180, y + 56, 40, 800, '#fff', 'left'); text('SUBSCRIPTION', 180, y + 102, 20, 700, MUTED, 'left', 0.16); text('$$$ / mo', 910, y + 70, 44, 800, '#ffb4a8', 'right', 0); });
  });
  const k = ease.out(seg(t, word(9, 3) - 0.1, word(9, 3) + 0.5)); if (k > 0) {
    const y = lerp(-200, 1330, k) + (k >= 1 ? Math.sin(t * 4) * 8 : 0), s = 1.8; kidney(CX, y, s, -0.3); kface(CX - 4, y - 8, s);
    withFade(seg(t, word(9, 3) + 0.4, word(9, 3) + 0.7), () => { fillRR(CX + 130, y - 100, 270, 76, 18, '#fff'); text('1 KIDNEY', CX + 265, y - 62, 40, 800, '#1b1f27', 'center'); });
  }
}
function sceneKidneys(t) {
  ctx.fillStyle = vgrad(0, H, '#f6e4e6', '#efc9cf'); ctx.fillRect(0, 0, W, H);
  const a = pop(t, L(10) + 0.1, 0.4), s = 1.9;
  xf(CX, 800, clamp(a), 0, () => {
    
    kidney(300, 880 + Math.sin(t * 3) * 6, s, -0.35); kface(292, 870 + Math.sin(t * 3) * 6, s * 1.1); kidney(780, 880 + Math.sin(t * 3 + 1) * 6, s, 0.35 + 0 * Math.PI); kface(788, 870 + Math.sin(t * 3 + 1) * 6, s * 1.1, false);
    line(400, 940, 680, 940, '#e0527a', 10); heartS(CX, 940, 90 + Math.sin(t * 6) * 6, '#e0527a');
    banner('I HAVE TWO', CX, 400, 84, '#1b1f27', '#fff', -0.03);
  });
  const b = pop(t, word(10, 1), 0.35); if (b > 0) xf(CX, 1240, clamp(b), 0, () => { ctx.save(); ctx.translate(CX, 1260); ctx.rotate(0.04); fillRR(-300, -90, 600, 180, 26, '#fff'); strokeRR(-300, -90, 600, 180, 26, '#b3261e', 8); text('NOT FOR SALE', 0, -14, 72, 800, '#b3261e', 'center', 0.01); text('(we’re attached)', 0, 54, 36, 700, '#6b6a80', 'center'); ctx.restore(); });
}
function sceneBudget(t) {
  ctx.fillStyle = vgrad(0, 1300, '#c9d6e8', '#eef2f8'); ctx.fillRect(0, 0, W, 1300); ctx.fillStyle = '#a9b3c2'; ctx.fillRect(0, 1300, W, H - 1300);
  const a = pop(t, L(11) + 0.1, 0.45);
  xf(300, 1300, clamp(a), 0, () => { fillRR(60, 420, 480, 880, 6, '#4a5a78'); for (let r = 0; r < 9; r++) for (let c = 0; c < 4; c++) fillRR(95 + c * 112, 460 + r * 92, 70, 58, 4, (r * 3 + c) % 5 === 0 ? '#ffe9a8' : '#8fa3c4'); fillRR(40, 360, 520, 74, 8, '#1b1f27'); text('MARKETING BUDGET', 300, 399, 38, 800, '#f5d68a', 'center', 0.06); shadow(300, 1300, 280); });
  [['$$$$', 150, 300, 0.2], ['$$$', 440, 250, 0.5]].forEach(([s, x, y, d], i) => { const e = pop(t, L(11) + d + 0.3, 0.3); if (e > 0) xf(x, y, clamp(e), 0, () => text(s, x, y + Math.sin(t * 2 + i) * 6, 80, 800, '#2f7d4a', 'center', 0)); });
  const c = pop(t, word(11, 2) - 0.2, 0.45);
  xf(800, 1300, clamp(c), 0, () => { chair(800, 1300, 0.95, '#c0392b'); });
  const n = pop(t, word(11, 2) + 0.3, 0.35); if (n > 0) xf(CX, 760, clamp(n), 0, () => { circle(CX + 30, 760, 80, '#b3261e'); text('≠', CX + 30, 756, 130, 800, '#fff', 'center', 0); });
  const b = pop(t, word(11, 2) + 0.5, 0.35); if (b > 0) xf(800, 600, clamp(b), 0, () => banner('A MOM + A CHAIR', 800, 610, 40, '#1b1f27', '#fff', 0.03));
}

// ── 6 · the bedroom: a sophomore builds it ───────────────────────────────────
function sceneBedroom(t) {
  ctx.fillStyle = vgrad(0, 1250, '#1d2342', '#2d3560'); ctx.fillRect(0, 0, W, 1250); ctx.fillStyle = '#2a2236'; ctx.fillRect(0, 1250, W, H - 1250);
  // window + night sky
  fillRR(90, 260, 330, 400, 12, '#0f1330'); for (let i = 0; i < 14; i++) circle(110 + hash(i) * 290, 280 + hash(i + 7) * 360, 2.5 + hash(i + 3) * 2.5, `rgba(255,255,255,${0.5 + 0.5 * Math.sin(t * 2 + i)})`); circle(330, 370, 46, '#fdf3c8'); circle(348, 358, 40, '#0f1330'); strokeRR(90, 260, 330, 400, 12, '#6b5a8a', 10); line(255, 260, 255, 660, '#6b5a8a', 8);
  // framed photo of mom's chair (hearts when "from her")
  const gf = seg(t, word(12, 2), word(12, 2) + 0.5);
  fillRR(740, 280, 250, 320, 14, '#c9a06a'); fillRR(758, 298, 214, 284, 8, '#f6e9dc'); chair(865, 540, 0.42, '#c0392b');
  if (gf > 0) { glow(865, 440, 300, '#ff7aa0', 0.3 * gf); for (let i = 0; i < 4; i++) { const k = ((t - word(12, 2)) * 0.6 + i / 4) % 1; heartS(840 + Math.sin(i * 2 + t * 3) * 40, 280 - k * 180, 28, rgba('#ff5c8a', (1 - k) * gf)); } }
  // the founder behind the desk
  const churn = t >= word(14, 2), hwk = t >= word(14, 4);
  glow(500, 1000, 700, '#7c6cf0', 0.16);
  founder(430, 1560, 820, { arm: 'down', look: hwk ? -0.6 : 0.9, mouth: churn && !hwk ? 'open' : t >= word(13, 0) && t < L(14) ? 'smile' : 'flat', bob: Math.sin(t * 2.2) * 4 });
  fillRR(30, 1190, 1020, 36, 10, '#8a6a4a'); fillRR(50, 1226, 980, 700, 0, '#6b4e36'); fillRR(50, 1226, 980, 14, 0, 'rgba(0,0,0,0.18)');
  // laptop (lid seen from behind) in front of him
  fillRR(430 - 175, 1190 - 215, 350, 215, 16, '#c3c8d0'); strokeRR(430 - 175, 1190 - 215, 350, 215, 16, '#9aa0aa', 4); heartS(430, 1090, 46, C.primary); fillRR(430 - 190, 1180, 380, 14, 6, '#9aa0aa');
  // monitor facing us
  const mx = 820, my = 860, mw = 320, mh = 220;
  fillRR(mx - 18, my + mh, 36, 1190 - my - mh, 4, '#3a3a46'); fillRR(mx - 80, 1176, 160, 16, 6, '#3a3a46');
  fillRR(mx - mw / 2 - 12, my - 12, mw + 24, mh + 24, 16, '#1c1c26');
  ctx.save(); rr(mx - mw / 2, my, mw, mh, 8); ctx.clip(); ctx.fillStyle = '#0b0b10'; ctx.fillRect(mx - mw / 2, my, mw, mh);
  if (!churn) { for (let i = 0; i < 7; i++) { const w = 60 + hash(i + Math.floor(t * 3)) * 170; fillRR(mx - mw / 2 + 24, my + 24 + i * 27, w, 12, 6, i % 3 ? '#a5a0ff' : '#3dbb74'); } }
  else { text('CHURN', mx, my + 34, 30, 800, '#ffb4a8', 'center', 0.12); ctx.strokeStyle = '#ec5f4f'; ctx.lineWidth = 6; ctx.lineJoin = 'round'; ctx.beginPath(); for (let i = 0; i <= 20; i++) { const x = mx - 130 + i * 13, y = my + 80 + i * 5 + Math.sin(i * 1.3) * 10; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); }
  ctx.restore(); glow(mx, my + mh / 2, 300, '#a5a0ff', 0.18);
  // textbook ALGEBRA (shoved aside when churn shows up)
  const ab = pop(t, word(14, 0) + 0.5, 0.4); if (ab > 0) xf(165, 1190, clamp(ab), 0, () => { const k = churn ? ease.out(seg(t, word(14, 2), word(14, 2) + 0.4)) : 0; ctx.save(); ctx.translate(165 - k * 40, 1190); ctx.rotate(-k * 0.1); fillRR(-110, -66, 220, 66, 8, '#b3261e'); fillRR(-102, -58, 204, 50, 4, '#8f1d17'); text('ALGEBRA', 0, -32, 32, 800, '#fff', 'center', 0.06); ctx.restore(); });
  // banners
  const bd = pop(t, L(12) + 0.2, 0.4); if (bd > 0 && t < L(13)) xf(CX, 170, clamp(bd), 0, () => banner('I LOVE BUILDING THINGS', CX, 170, 52, '#1b1f27', '#fff', 0));
  const sb = pop(t, word(13, 1), 0.35); if (sb > 0 && t < L(14)) xf(CX, 170, clamp(sb), 0, () => banner('10TH GRADE', CX, 170, 80, '#7c6cf0', '#fff', -0.03));
  const cp = pop(t, word(14, 2), 0.3); if (cp > 0 && !hwk) xf(CX, 170, clamp(cp), 0, () => banner('CUSTOMER CHURN', CX, 170, 64, '#b3261e', '#fff', 0.02));
  const hw = pop(t, word(14, 4), 0.35); if (hw > 0) xf(560, 480, clamp(hw), 0, () => postit(580, 470, 250, ['HOMEWORK', 'STILL DUE'], 0.07, '#ffe27a', '#b3261e', 36));
}

// ── 7 · it worked: the product, small and honest ─────────────────────────────
function ring2(x, y, r, v, col) { ring(x, y, r, 'rgba(255,255,255,0.12)', 9); ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(x, y, r, -Math.PI / 2, -Math.PI / 2 + (v / 100) * Math.PI * 2); ctx.stroke(); ctx.restore(); text(String(Math.round(v)), x, y + 2, r * 0.8, 800, '#fff', 'center', 0); }
function sceneWorked(t) {
  stage(t, 0.22); eyebrow('CLIENT HEALTH', 300);
  const slip = seg(t, word(15, 2), word(15, 2) + 0.8), back = seg(t, word(15, 3) + 2.2, word(15, 3) + 3.1);
  const sc = lerp(lerp(74, 29, ease.inOut(slip)), 83, ease.out(back)), col = sc > 60 ? GREEN : sc > 40 ? AMBER : RED;
  card(CARD.x, 350, CARD.w, 560, { r: 30 });
  [['Jordan', 'Last visit: 2 weeks ago', 86, 0], ['Priya', 'Last visit: 3 weeks ago', 71, 1], ['Marcus', null, sc, 2]].forEach(([n, sub, v, ci], i) => {
    const e = ease.out(seg(t, 0.4 + i * 0.15, 0.8 + i * 0.15)), y = 460 + i * 170, hl = ci === 2;
    withFade(e, () => { if (i) { ctx.fillStyle = 'rgba(255,255,255,0.07)'; ctx.fillRect(CARD.x + 30, y - 85, CARD.w - 60, 2); } avatar(CARD.x + 80, y, 42, n.slice(0, 2).toUpperCase(), NAMES[ci + 1][1]); text(n, CARD.x + 150, y - 14, 36, 800, '#fff', 'left'); text(sub ?? (back > 0.3 ? 'Booked: Thursday 10:00' : slip > 0.5 ? 'Last visit: 9 weeks ago' : 'Last visit: 4 weeks ago'), CARD.x + 150, y + 26, 24, 500, hl ? col : SOFT, 'left'); if (hl && sc < 45) tag(CARD.x + CARD.w - 160, y - 4, 'AT RISK', RED, true, 20); ring2(CARD.x + CARD.w - 74, y, 44, v, hl ? col : v > 60 ? GREEN : AMBER); });
  });
  // the message
  const m1 = pop(t, word(15, 3), 0.35), m2 = pop(t, word(15, 3) + 1.6, 0.35);
  if (m1 > 0) xf(CX, 1100, clamp(m1), 0, () => { bubble(CARD.x + 120, 960, 760, ['Hey! We miss you.', 'Thursday at 10?'], true, 1); });
  if (m2 > 0) xf(CX, 1250, clamp(m2), 0, () => { bubble(CARD.x, 1120, 760, ['Yes please! See you then.'], false, 1); });
  withFade(seg(t, word(15, 3) + 2.4, word(15, 3) + 2.8), () => { const lb = 'Booked · health back up', w = tw(lb, 30, 800) + 90; fillRR(CX - w / 2, 1260, w, 80, 40, rgba(GREEN, 0.18)); strokeRR(CX - w / 2, 1260, w, 80, 40, GREEN, 3); check(CX - w / 2 + 44, 1301, 20, '#9ff0c0', 5); text(lb, CX - w / 2 + 76, 1301, 30, 800, '#9ff0c0', 'left'); });
}

// ── 8 · the name ─────────────────────────────────────────────────────────────
function sceneName(t) {
  brandHit(t, L(16), L(17) + 0.2);
  const a = pop(t, word(16, 1), 0.35), b = pop(t, word(16, 1) + 0.25, 0.35), p = pop(t, word(16, 1) + 0.12, 0.3);
  if (a > 0) xf(CX, 1060, clamp(a), 0, () => banner('MESSAGE', 270, 1060, 64, C.primary, '#fff', 0));
  if (p > 0) xf(CX, 1060, clamp(p), 0, () => text('+', CX, 1060, 80, 800, '#fff', 'center', 0));
  if (b > 0) xf(CX, 1060, clamp(b), 0, () => banner('HEALTH', 810, 1060, 64, GREEN, '#0b0b10', 0));
}

// ── 9–11 · the pulse: healthy → fading → a message brings it back ────────────
function ecgBeat(p) {
  if (p < 0.10) return 0; if (p < 0.16) return 0.15 * Math.sin(((p - 0.10) / 0.06) * Math.PI); if (p < 0.26) return 0;
  if (p < 0.30) return -0.15 * ((p - 0.26) / 0.04); if (p < 0.34) return -0.15 + 1.15 * ((p - 0.30) / 0.04); if (p < 0.40) return 1 - 1.35 * ((p - 0.34) / 0.06);
  if (p < 0.44) return -0.35 + 0.35 * ((p - 0.40) / 0.04); if (p < 0.60) return 0; if (p < 0.72) return 0.25 * Math.sin(((p - 0.60) / 0.12) * Math.PI); return 0;
}
function drawEcg(t, amp, col, y = 560) { // amp: fn(x01) → 0..1.2
  const x0 = 100, x1 = 980, bw = 300, sp = 260; ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 8; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.shadowColor = col; ctx.shadowBlur = 24;
  ctx.beginPath(); for (let x = x0; x <= x1; x += 3) { const ph = ((((x - x0) - t * sp) % bw) + bw) % bw / bw, a = amp((x - x0) / (x1 - x0)); const yy = y - ecgBeat(ph) * 150 * a; x === x0 ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy); } ctx.stroke(); ctx.restore();
}
function pulseFrame(t, label, col, sub) {
  stage(t, 0.2); card(CARD.x, 330, CARD.w, 440, { r: 30 });
  const b = 1 + 0.12 * Math.max(0, Math.sin(t * 6.2)) ** 6 * (col === RED ? 0 : 1); xf(190, 400, b, 0, () => heartS(190, 405, 70, col));
  text(label, 260, 400, 34, 800, col, 'left', 0.1); text(sub, 260, 440, 22, 500, MUTED, 'left');
}
function scenePulse(t) {
  pulseFrame(t, 'HEALTHY', GREEN, 'Marcus · regular');
  drawEcg(t, () => 1, GREEN, 650);
  [['BOOKS', 'every few weeks', word(17, 1)], ['LAST VISIT', 'not long ago', word(17, 2)], ['REPLIES', 'still answering', word(17, 3)]].forEach(([a, b, at], i) => {
    const e = pop(t, at, 0.35); if (e <= 0) return; const y = 860 + i * 170;
    xf(CX, y + 60, clamp(e), 0, () => { card(CARD.x, y, CARD.w, 140, { r: 26 }); circle(CARD.x + 70, y + 70, 28, rgba(GREEN, 0.18)); check(CARD.x + 70, y + 71, 22, GREEN, 5); text(a, CARD.x + 130, y + 52, 36, 800, '#fff', 'left', 0.04); text(b, CARD.x + 130, y + 98, 26, 500, SOFT, 'left'); });
  });
}
function sceneFade(t) {
  const k = seg(t, word(18, 0) + 0.4, word(18, 0) + 4.2), amp = Math.max(0, 1 - ease.inOut(k)), col = k < 0.35 ? GREEN : k < 0.75 ? AMBER : RED, lb = k < 0.35 ? 'HEALTHY' : k < 0.75 ? 'SLIPPING' : 'QUIET';
  pulseFrame(t, lb, col, 'Marcus · regular');
  drawEcg(t, () => amp, col, 650);
  const s = pop(t, word(18, 2), 0.35);
  if (s > 0) withFade(1 - seg(t, word(18, 3) - 0.1, word(18, 3) + 0.15), () => xf(CX, 1050, clamp(s), 0, () => { circle(CX, 1060, 150, '#1c1c26'); strokeRR(CX - 150, 910, 300, 300, 150, 'rgba(255,255,255,0.12)', 4); poly([[CX - 70, 1040], [CX - 30, 1040], [CX + 20, 995], [CX + 20, 1125], [CX - 30, 1080], [CX - 70, 1080]], '#fff'); crossOut(CX, 1060, 110, 'rgba(236,95,79,0.95)', 16); text('NO BEEP', CX, 1290, 46, 800, '#fff', 'center', 0.1); }));
  const q = pop(t, word(18, 3), 0.4); if (q > 0) xf(CX, 1080, clamp(q), 0, () => text('just silence.', CX, 1080, 90, 800, '#ffb4a8', 'center', -0.02));
}
function sceneRevive(t) {
  const hit = word(19, 0) + 1.4, k = ease.out(seg(t, hit, hit + 0.9)), col = k > 0.2 ? GREEN : RED;
  pulseFrame(t, k > 0.2 ? 'HEALTHY' : 'QUIET', col, 'Marcus · regular');
  drawEcg(t, () => k, col, 650);
  const b = pop(t, word(19, 0) + 0.2, 0.35); if (b > 0) xf(CX, 1000, clamp(b), 0, () => { bubble(CARD.x + 160, 880, 720, ['We miss you!'], true, 1);text('Sent ✓', CARD.x + CARD.w, 970, 22, 700, MUTED, 'right'); });
  const r = pop(t, hit + 0.3, 0.35); if (r > 0) xf(CX, 1100, clamp(r), 0, () => bubble(CARD.x, 1010, 720, ['Oh! I’ll book Thursday.'], false, 1));
  const ad = pop(t, word(19, 4), 0.4); if (ad > 0) xf(CX, 1300, clamp(ad), 0, () => { ctx.save(); ctx.translate(CX, 1290); ctx.rotate(-0.05); fillRR(-250, -80, 500, 160, 22, '#fff'); text('50% OFF!!! AD', 0, -6, 60, 800, '#1b1f27', 'center', 0); text('(months later)', 0, 54, 28, 700, '#6b6a80', 'center'); line(-230, -64, 230, 64, 'rgba(236,95,79,0.95)', 12); line(230, -64, -230, 64, 'rgba(236,95,79,0.95)', 12); ctx.restore(); });
}

// ── 12 · bigger than one salon ───────────────────────────────────────────────
function iconPole(cx, cy, s, t) { ctx.save(); ctx.translate(cx, cy); ctx.scale(s, s); fillRR(-32, -88, 64, 176, 30, '#fff'); ctx.save(); rr(-32, -88, 64, 176, 30); ctx.clip(); for (let i = -4; i < 6; i++) { const o = ((t * 40) % 80); poly([[-40, -90 + i * 80 + o], [40, -50 + i * 80 + o], [40, -20 + i * 80 + o], [-40, -60 + i * 80 + o]], i % 2 ? '#2a4a8a' : '#e0392d'); } ctx.restore(); strokeRR(-32, -88, 64, 176, 30, 'rgba(0,0,0,0.2)', 4); fillRR(-44, -104, 88, 22, 10, '#9aa0aa'); fillRR(-44, 82, 88, 22, 10, '#9aa0aa'); ctx.restore(); }
function iconStones(cx, cy, s) { ctx.save(); ctx.translate(cx, cy); ctx.scale(s, s); ellipse(0, 50, 80, 26, '#8d8d94'); ellipse(0, 6, 58, 22, '#a9a9b0'); ellipse(0, -30, 38, 16, '#c5c5cb'); ellipse(60, -60, 40, 16, '#3da35a', -0.6); ellipse(34, -76, 36, 14, '#2f8a4a', 0.5); ctx.restore(); }
function iconDumbbell(cx, cy, s) { ctx.save(); ctx.translate(cx, cy); ctx.scale(s, s); fillRR(-90, -10, 180, 20, 8, '#9aa0aa'); [[-80, 70], [-58, 100], [58, 100], [80, 70]].forEach(([x, h], i) => fillRR(x - 10, -h / 2, 20, h, 8, i % 3 ? '#3a3a46' : '#1b1f27')); ctx.restore(); }
function iconSpray(cx, cy, s, t) { ctx.save(); ctx.translate(cx, cy); ctx.scale(s, s); fillRR(-44, -10, 88, 124, 22, '#3aa6d9'); fillRR(-16, -56, 32, 50, 6, '#e5e7eb'); fillRR(-16, -72, 80, 30, 12, '#e5e7eb'); for (let i = 0; i < 6; i++) { const k = ((t * 1.5 + i / 6) % 1); circle(80 + k * 50, -58 + (i % 3) * 14 - k * 10, 5, `rgba(120,200,240,${1 - k})`); } ctx.restore(); }
function iconPipe(cx, cy, s, t, leak) { ctx.save(); ctx.translate(cx, cy); ctx.scale(s, s); fillRR(-120, -26, 240, 52, 10, '#9aa0aa'); fillRR(-136, -38, 36, 76, 8, '#7c828c'); fillRR(100, -38, 36, 76, 8, '#7c828c'); fillRR(-18, 26, 36, 36, 6, '#7c828c'); if (leak) for (let i = 0; i < 3; i++) { const k = ((t * 1.1 + i / 3) % 1); ellipse(0, 70 + k * 80, 11 * (1 - 0.3 * k), 16, `rgba(58,166,217,${1 - k * 0.6})`); } ctx.restore(); }
function sceneIndustries(t) {
  ctx.fillStyle = vgrad(0, H, '#10101a', '#1a1a2e'); ctx.fillRect(0, 0, W, H); glow(CX, 800, 800, C.primary, 0.18);
  const tiles = [['SALONS', L(20) + 0.1, (x, y) => chair(x, y + 80, 0.42, '#c0392b')], ['BARBERS', word(21, 0), (x, y) => iconPole(x, y, 1.0, t)], ['SPAS', word(21, 0) + 0.45, (x, y) => iconStones(x, y, 1.1)],
    ['GYMS', word(21, 0) + 0.9, (x, y) => iconDumbbell(x, y, 1.15)], ['CLEANERS', word(21, 1), (x, y) => iconSpray(x, y - 20, 1.0, t)], ['PLUMBERS', word(21, 1) + 1.0, (x, y) => iconPipe(x, y - 20, 1.0, t, t > word(21, 2))]];
  tiles.forEach(([lb, at, fn], i) => {
    const e = pop(t, at, 0.4), c = i % 2, r = Math.floor(i / 2), x = 110 + c * 450, y = 300 + r * 380; if (e <= 0) return;
    xf(x + 190, y + 160, clamp(e), 0, () => { fillRR(x, y, 410, 340, 36, '#f6efe4'); ctx.save(); rr(x, y, 410, 340, 36); ctx.clip(); fn(x + 205, y + 140); ctx.restore(); text(lb, x + 205, y + 296, 34, 800, '#1b1f27', 'center', 0.1); });
  });
  const lk = pop(t, word(21, 2) + 0.2, 0.35); if (lk > 0) xf(CX, 200, clamp(lk), 0, () => banner('same leak. different pipe.', CX, 200, 50, '#3aa6d9', '#fff', -0.02));
}

// ── 13 · they don't say goodbye ──────────────────────────────────────────────
function sceneGoodbye(t) {
  ctx.fillStyle = vgrad(0, 1150, '#cfe3f3', '#f4ead9'); ctx.fillRect(0, 0, W, 1150); ctx.fillStyle = '#9aa3ad'; ctx.fillRect(0, 1150, W, H - 1150); ctx.fillStyle = '#c9ced4'; ctx.fillRect(0, 1150, W, 30);
  cloud(120, 260, 0.9); cloud(720, 400, 0.7);
  // salon front on the left
  fillRR(-40, 560, 380, 600, 6, '#e8d8c3'); fillRR(30, 760, 200, 400, 6, '#7c6cf0'); fillRR(46, 776, 168, 380, 4, '#cfe7f3'); fillRR(-40, 500, 400, 90, 4, '#c0392b'); text('SALON', 140, 548, 50, 800, '#fff', 'center', 0.1);
  const peds = [0, 1, 2, 3, 4];
  peds.forEach((i) => { const t0 = L(22) + 0.2 + i * 0.7, x = lerp(150, 1300, seg(t, t0, t0 + 4.2)), h = 340 + (i % 2) * 30, y = 1330 + (i % 2) * 50; if (x < -100 || x > 1180 || t < t0) return; shadow(x, y, h * 0.3); person(x, y, h, 520 + i * 4, { dir: 1, bounce: t * 9 + i, noShadow: true, arm: 'down' }); });
  const e = pop(t, word(22, 1), 0.4); if (e > 0 && t < word(22, 3)) xf(CX, 300, clamp(e), 0, () => banner('NO GOODBYE', CX, 330, 100, '#1b1f27', '#fff', -0.03));
  const r = pop(t, word(22, 3), 0.3); if (r > 0) xf(680, 660, clamp(r), 0, () => { ctx.save(); ctx.translate(680, 660); ctx.rotate(-0.12); strokeRR(-250, -90, 500, 180, 24, '#b3261e', 12); text('RUDE.', 0, 4, 130, 800, '#b3261e', 'center', 0.02); ctx.restore(); });
}

// ── 14 · open to everyone, 2026 ──────────────────────────────────────────────
function sceneOpen(t) {
  stage(t, 0.3); const a = pop(t, word(23, 0), 0.5), fl = 0.85 + 0.15 * Math.sin(t * 12) * (t < word(23, 1) ? 1 : 0.3);
  xf(CX, 600, clamp(a), 0, () => { text('2026', CX, 600, 330, 800, '#fff', 'center', -0.05); });
  const o = pop(t, word(23, 1), 0.4);
  if (o > 0) xf(CX, 1000, clamp(o), 0, () => { glow(CX, 1000, 600, '#ff4d6d', 0.3 * fl); fillRR(CX - 300, 900, 600, 200, 40, '#1b0a10'); strokeRR(CX - 300, 900, 600, 200, 40, `rgba(255,77,109,${fl})`, 10); ctx.save(); ctx.shadowColor = '#ff4d6d'; ctx.shadowBlur = 40 * fl; text('OPEN', CX, 1002, 150, 800, `rgba(255,120,140,${fl})`, 'center', 0.12); ctx.restore(); });
  const e = pop(t, word(23, 1) + 0.6, 0.4); if (e > 0) xf(CX, 1240, clamp(e), 0, () => banner('TO EVERYONE', CX, 1240, 70, C.primary, '#fff', 0));
}

// ── 15 · built for her ───────────────────────────────────────────────────────
function sceneHer(t) {
  salonBG(0.05); glow(CX, 900, 900, '#ffd9e6', 0.45); chair(150, 1250, 1.1, '#c0392b');
  const m = pop(t, L(24), 0.5); xf(480, 1420, clamp(m), 0, () => mom(480, 1420, 840, { mouth: 'smile', look: 0.4, bob: Math.sin(t * 2) * 4 }));
  const f = pop(t, word(24, 2), 0.5); xf(800, 1420, clamp(f), 0, () => founder(800, 1420, 860, { mouth: 'smile', look: -0.6, arm: t > word(24, 5) - 0.2 ? 'heart' : 'down', bob: Math.sin(t * 2 + 1) * 4 }));
  [[word(24, 1), 160, 'BUILT FOR HER', '#7c6cf0', -0.03, 64], [word(24, 3), 280, 'NO TIME TO SPARE', '#1b1f27', 0.03, 50], [word(24, 5) - 0.2, 395, 'EVERY CLIENT COUNTS', '#c0392b', -0.02, 46]].forEach(([at, y, s, bg, rot, sz]) => {
    const e = pop(t, at, 0.35); if (e > 0) xf(CX, y, clamp(e), 0, () => banner(s, CX, y, sz, bg, '#fff', rot));
  });
  for (let i = 0; i < 4; i++) { const k = ((t * 0.35 + i / 4) % 1); heartS([60, 1020, 40, 1040][i], 1150 - k * 420, 34, rgba('#ff5c8a', Math.sin(k * Math.PI))); }
}

// ── 16 · made for you too  /  end ────────────────────────────────────────────
function sceneYou(t) {
  stage(t, 0.32); const a = pop(t, L(25), 0.4);
  xf(CX, 560, clamp(a), 0, () => { logoLockup(CX, 560, 96); text(BRAND.tagline, CX, 670, 32, 500, SOFT, 'center'); });
  const row = [(x, y) => chair(x, y + 70, 0.3, '#c0392b'), (x, y) => iconPole(x, y, 0.62, t), (x, y) => iconStones(x, y, 0.66), (x, y) => iconDumbbell(x, y, 0.7), (x, y) => iconSpray(x, y - 12, 0.62, t), (x, y) => iconPipe(x, y - 12, 0.6, t, false)];
  row.forEach((fn, i) => { const e = pop(t, L(25) + 0.4 + i * 0.12, 0.35); if (e <= 0) return; const x = 200 + (i % 3) * 340, y = 870 + Math.floor(i / 3) * 265; xf(x, y, clamp(e), 0, () => { fillRR(x - 150, y - 120, 300, 240, 30, '#f6efe4'); ctx.save(); rr(x - 150, y - 120, 300, 240, 30); ctx.clip(); fn(x, y); ctx.restore(); }); });
  const y2 = pop(t, word(25, 2), 0.4); if (y2 > 0) xf(CX, 1345, clamp(y2), 0, () => banner('YES, EVEN THE PLUMBERS.', CX, 1345, 52, C.primary, '#fff', 0));
}
function sceneEnd(t) {
  const k = ease.quint(seg(t, END, END + 0.5)); stage(t, 0.2 + 0.22 * k); if (t < END + 0.3) glow(CX, 860, 800, C.primary, 0.45 * (1 - seg(t, END, END + 0.3)));
  xf(CX, 700, 1 + 0.2 * (1 - k), 0, () => { ctx.save(); ctx.globalAlpha = k; logoLockup(CX, 700, 110); text(BRAND.tagline, CX, 820, 34, 500, SOFT, 'center'); ctx.restore(); });
  const u = pop(t, END + 0.5, 0.4); if (u > 0) xf(CX, 1010, clamp(u), 0, () => { const lb = 'Try MsgHealth', bw = tw(lb, 44, 800) + 120; fillRR(CX - bw / 2, 940, bw, 116, 58, C.primary); strokeRR(CX - bw / 2, 940, bw, 116, 58, 'rgba(255,255,255,0.25)', 2); text(lb, CX, 999, 44, 800, '#fff', 'center'); });
  withFade(seg(t, END + 0.9, END + 1.2), () => text(BRAND.url.toUpperCase(), CX, 1170, 30, 800, IN.mid, 'center', 0.18));
}

const SCENES = [[0, L(4), sceneSalon], [L(4), L(6), sceneBoard], [L(6), L(8), sceneEmpty], [L(8), L(9), sceneJar], [L(9), L(10), sceneSubs], [L(10), L(11), sceneKidneys], [L(11), L(12), sceneBudget], [L(12), L(15), sceneBedroom],
  [L(15), L(16), sceneWorked], [L(16), L(17), sceneName], [L(17), L(18), scenePulse], [L(18), L(19), sceneFade], [L(19), L(20), sceneRevive], [L(20), L(22), sceneIndustries], [L(22), L(23), sceneGoodbye],
  [L(23), L(24), sceneOpen], [L(24), L(25), sceneHer], [L(25), END, sceneYou], [END, 999, sceneEnd]];
// sound effects: a pop per beat, kept light so the voice sits on top
[word(0, 1) + 1, L(1), word(1, 0), word(1, 1), word(1, 2)].forEach((x, i) => cue(x, i ? 'punch' : 'swish', 0.7));
for (let i = 0; i < 7; i++) cue(L(0) + 2.0 + i * 0.12, 'tap', 0.4);
[word(2, 0), word(2, 1), word(2, 2)].forEach((x) => cue(x, 'ding', 0.5)); cue(word(3, 2), 'swish', 0.7);
cue(L(4), 'swish', 0.7); for (let i = 0; i < 12; i++) cue(word(4, 1) + 0.2 + i * 0.4, 'swoosh', 0.2); cue(word(4, 0) + 0.6, 'tap', 0.6); cue(L(6) - 1.2, 'tap', 0.8);
cue(L(6), 'transition', 0.6); cue(word(7, 1) - 0.4, 'ding', 0.8); cue(L(8), 'swish', 0.7); for (let i = 0; i < 14; i += 2) cue(word(8, 1) + 0.15 + i * 0.16, 'key', 0.4);
for (let i = 0; i < 5; i++) cue(L(9) + 0.6 + i * 0.4, 'notification', 0.4); cue(word(9, 3) - 0.1, 'punch', 1); cue(L(10) + 0.1, 'swish', 0.7); cue(word(10, 1), 'punch', 0.9); cue(L(11) + 0.1, 'swish', 0.7); cue(word(11, 2) + 0.3, 'punch', 0.9);
cue(L(12) + 0.2, 'swish', 0.6); cue(word(12, 2), 'ding', 0.8); cue(word(13, 1), 'punch', 0.8); cue(word(14, 0) + 0.5, 'tap', 0.8); cue(word(14, 2), 'punch', 0.8); cue(word(14, 4), 'punch', 0.9);
cue(word(15, 2), 'notification', 0.7); cue(word(15, 3), 'swish', 0.8); cue(word(15, 3) + 1.6, 'notification', 0.8); cue(word(15, 3) + 2.4, 'ding', 1);
cue(T.brand, 'transitionHit', 1); cue(word(16, 1), 'punch', 0.8); for (let i = 1; i < 4; i++) cue(word(17, i), 'ding', 0.6); cue(word(18, 2), 'punch', 0.9); cue(word(18, 3), 'transition', 0.7);
cue(word(19, 0) + 0.2, 'swish', 0.9); cue(word(19, 0) + 1.4, 'ding', 1); cue(word(19, 4), 'punch', 0.8);
cue(L(20) + 0.1, 'tap', 0.8); for (const x of [word(21, 0), word(21, 0) + 0.45, word(21, 0) + 0.9, word(21, 1), word(21, 1) + 1.0]) cue(x, 'tap', 0.8); cue(word(21, 2) + 0.2, 'punch', 0.8);
cue(word(22, 1), 'punch', 0.8); cue(word(22, 3), 'punch', 1); cue(word(23, 0), 'punch', 1); cue(word(23, 1), 'ding', 0.9); cue(word(24, 1), 'swish', 0.8); cue(word(24, 2), 'swish', 0.6); cue(word(24, 3), 'tap', 0.6); cue(word(24, 5) - 0.2, 'tap', 0.6);
cue(L(25), 'transition', 0.8); cue(word(25, 2), 'punch', 0.9); cue(END, 'swish', 0.8); cue(T.cta - 0.2, 'tap', 1.0);
boot({ duration: DURATION, scenes: SCENES, brandAt: T.brand, noVoice: true, hideCaption: (t) => !SHOW_CAPS || t >= END - 0.1,
  after: (t) => { const f = 1 - seg(t, T.brand, T.brand + 0.12); if (t >= T.brand && f > 0) { ctx.fillStyle = rgba('#ffffff', 0.5 * f); ctx.fillRect(0, 0, W, H); } } }, 'story');
