// MsgHealth · "Dancing plague" · story-hook vertical ad (1080 × 1920, 30 fps), built on src/kit.js.
// Real story, nudged: in 1518 a woman in Strasbourg started dancing and couldn't stop; hundreds joined, and the city's fix
// was more dancing (a stage and musicians) before they finally cancelled the music. (Attendance going up as "the plan
// working" is the absurd part.) Pivot: most businesses guess a fix and hope; MsgHealth reads the signals first (fewer visits,
// slower replies, a falling health score) and texts automatically. Then the 50%-off-first-month offer.
// Voiceover: assets/audio/dance/vo-NN.wav, timed by VO_AT in src/dance-vo.js.
'use strict';
const word = (l, k) => VO_AT[l] + VO_CLIPS[l].chunks[k][1];
const T = {
  dancing: word(0, 2), hundreds: word(1, 2), more: word(2, 1), stage: VO_AT[3], attend: VO_AT[4], working: word(4, 1), cancel: VO_AT[5], most: VO_AT[6], fix: word(6, 1), hope: word(6, 2),
  brand: VO_AT[7], signals: word(7, 1), few: VO_AT[8], score: word(8, 1), txt: VO_AT[9], gone: word(9, 2), nodance: VO_AT[10], offer: VO_AT[11], end: VO_AT[12] - 0.1, url: VO_AT[12] + 0.1,
};
T.cta = T.end + 1.25;
const DURATION = +(T.cta + 1.0).toFixed(2);
window.CUES = T; window.SFX = []; const cue = (t, kind, gain) => window.SFX.push({ t, kind, gain });
window.MUSIC = { bpm: 112, root: 50, brandAt: T.brand, mood: 'bouncy' };

function shadow(x, y, rx) { ellipse(x, y, rx, rx * 0.12, 'rgba(40,30,20,0.25)'); }
const GROUND = 1010;
function town(t) {
  ctx.fillStyle = vgrad(0, GROUND, '#bcd8ee', '#f6ecd2'); ctx.fillRect(0, 0, W, GROUND); cloud(120, 220, 1.0, 'rgba(255,255,255,0.9)');
  // the cathedral (tall, one spire) and half-timbered houses along the back of the square
  fillRR(640, 420, 300, 600, 6, '#b8997a'); poly([[640, 420], [790, 40], [940, 420]], '#a08466'); poly([[640, 420], [790, 40], [700, 420]], 'rgba(0,0,0,0.08)'); fillRR(745, 760, 90, 250, 45, '#6b563f'); circle(790, 600, 60, '#d9c7a0'); circle(790, 600, 44, '#7d9cb8'); for (let i = 0; i < 6; i++) line(790, 600, 790 + Math.cos(i * 1.047) * 44, 600 + Math.sin(i * 1.047) * 44, '#6b563f', 4);
  const hs = [[-20, 240, 520], [220, 220, 440], [440, 230, 480]]; hs.forEach(([x, w, top], i) => { fillRR(x, top + 220, w, GROUND - top - 220, 2, '#f0e3c8'); poly([[x - 14, top + 220], [x + w / 2, top + 100], [x + w + 14, top + 220]], '#a0522d'); ctx.fillStyle = '#5a3a28'; ctx.fillRect(x, top + 330, w, 8); ctx.fillRect(x + w / 2 - 4, top + 220, 8, GROUND - top - 220); for (let k = 0; k < 2; k++) fillRR(x + 30 + k * (w - 100), top + 380, 56, 76, 4, '#7d9cb8'); });
  ctx.fillStyle = '#948c80'; ctx.fillRect(0, GROUND, W, H - GROUND); ctx.fillStyle = 'rgba(0,0,0,0.07)'; ctx.fillRect(0, GROUND, W, 90);
  for (let r = 0; r < 12; r++) for (let c = 0; c < 10; c++) { const y = GROUND + 30 + r * r * 5 + r * 20, s = 22 + r * 5; ellipse(((c + (r % 2) * 0.5) * 120 + 30) % (W + 60), y, s * 1.8, s * 0.55, 'rgba(255,255,255,0.07)'); }
}
function dancer(x, y, h, id, t, o = {}) {
  const flip = Math.sin(t * 5 + id * 1.3) > 0 ? 1 : -1, woman = o.woman ?? id % 2 === 0, w = h * 0.3;
  person(x, y, h, id, { arm: 'up', wave: t * 1.4 + id, dir: flip, bounce: t * 9 * (o.speed ?? 1) + id, mouth: id % 3 === 0 ? 'open' : '', eyes: o.eyes, shirt: o.shirt, hair: o.hair });
  if (woman) poly([[x - w * 0.55, y - h * 0.5], [x + w * 0.55, y - h * 0.5], [x + w * 1.0, y - h * 0.1 + Math.sin(t * 9 + id) * 4], [x - w * 1.0, y - h * 0.1 - Math.sin(t * 9 + id) * 4]], ['#b5453a', '#3a6a9a', '#6a8a3a', '#9a5a8a'][id % 4]);
}
function crowd(t, n, appear = 0.12, from = 0, speed = 1) {
  const list = []; for (let i = 0; i < n; i++) list.push({ x: 90 + hash(i * 3 + 1) * 900, y: 1180 + hash(i * 7 + 2) * 520, id: i + 1, at: from + i * appear });
  list.sort((a, b) => a.y - b.y).forEach((p) => { const e = ease.out(seg(t, p.at, p.at + 0.4)); if (e <= 0) return; const h = 200 + (p.y - 1180) * 0.6; shadow(p.x, p.y, h * 0.3); ctx.save(); ctx.globalAlpha = e; dancer(p.x, p.y, h, p.id, t, { speed }); ctx.restore(); });
}
function signBoard(cx, cy, w, h, lines, col = '#f6efe0', ink = '#3a2a1a') { // a wooden-framed notice on a post, sized to the given w × h
  fillRR(cx - 12, cy + h / 2, 24, 200, 4, '#6b4a34'); fillRR(cx - w / 2, cy - h / 2, w, h, 14, '#8a5f3a'); fillRR(cx - w / 2 + 14, cy - h / 2 + 14, w - 28, h - 28, 8, col);
  lines.forEach(([s, sz, c], i) => text(s, cx, cy - h / 2 + 50 + (i + 0.5) * ((h - 80) / lines.length), sz, 800, c ?? ink, 'center', 0));
}

function sceneStart(t) {
  town(t); text('1518', 250, 130, 150, 800, 'rgba(60,40,20,0.85)', 'center', -0.02);
  const k = pop(t, 0.5, 0.4); shadow(540, 1560, 200); xf(540, 1500, 0.6 + 0.4 * clamp(k), 0, () => dancer(540, 1560, 620, 4, t, { woman: true, hair: '#7a3a1a', eyes: 'wide' }));
  const b = pop(t, T.dancing - 0.2, 0.3); if (b > 0) xf(CX, 420, b, 0, () => { fillRR(190, 370, 700, 100, 50, '#fff'); text('STRASBOURG', CX, 422, 54, 800, '#3a2a1a', 'center', 0.12); });
}
function sceneCrowd(t) {
  town(t); crowd(t, 30, 0.1, VO_AT[1] - 0.2);
  const b = pop(t, T.hundreds, 0.35); if (b > 0) xf(CX, 560, b, 0, () => { fillRR(150, 450, 780, 220, 36, '#fff'); strokeRR(150, 450, 780, 220, 36, '#a0522d', 10); text('HUNDREDS', CX, 560, 120, 800, '#3a2a1a', 'center', -0.01); });
}
function sceneMore(t) {
  town(t); crowd(t, 16, 0, -1);
  const k = pop(t, T.more - 0.2, 0.35); xf(300, 760, k, 0, () => signBoard(300, 560, 480, 300, [['THE PLAN:', 44, '#6b4a34'], ['MORE', 96], ['DANCING', 76]]));
  person(760, 1400, 470, 52, { skin: '#d9a27a', shirt: '#5a2a4a', pants: '#2c2230', hat: '#2c2230', arm: 'up', wave: t, mouth: 'open', hair: '#3a2a1a' });
  const st = ease.out(seg(t, T.stage - 0.1, T.stage + 0.6)); if (st > 0) { ctx.save(); ctx.translate(0, (1 - st) * 200); ctx.globalAlpha = st; fillRR(120, 1085, 840, 90, 8, '#8a5f3a'); fillRR(120, 1085, 840, 22, 8, '#a67c52'); [[270, 'drum'], [540, 'lute'], [810, 'horn']].forEach(([x, k2], i) => { person(x, 1100, 210, 70 + i, { skin: '#d9a27a', shirt: ['#3a6a9a', '#9a5a8a', '#6a8a3a'][i], bounce: t * 6 + i, arm: 'phone', noShadow: true }); if (k2 === 'drum') { fillRR(x - 40, 1010, 80, 60, 10, '#c25a4a'); } else if (k2 === 'lute') { ellipse(x + 20, 1030, 34, 26, '#b5793f'); line(x + 20, 1030, x + 80, 990, '#6b4a34', 8); } else { line(x, 1030, x + 70, 980, '#d9a52e', 12); circle(x + 74, 976, 16, '#d9a52e'); } }); ctx.restore(); for (let i = 0; i < 4; i++) { const q = ((t * 0.7 + i / 4) % 1); text('♪', 300 + i * 160, 1000 - q * 160, 54, 800, `rgba(60,40,20,${1 - q})`, 'center'); } }
}
function sceneAttend(t) {
  town(t); crowd(t, 36, 0, -5);
  const k = pop(t, T.attend - 0.1, 0.4); xf(CX, 760, k, 0, () => { fillRR(190, 420, 700, 440, 30, '#f6efe0'); strokeRR(190, 420, 700, 440, 30, '#8a5f3a', 8); text('ATTENDANCE', CX, 480, 52, 800, '#3a2a1a', 'center', 0.1); [0, 1, 2, 3, 4].forEach((i) => { const g = ease.out(seg(t, T.attend + 0.3 + i * 0.2, T.attend + 0.8 + i * 0.2)); fillRR(260 + i * 120, 820 - (80 + i * 55) * g, 90, (80 + i * 55) * g, 8, '#3dbb74'); }); });
  const s = pop(t, T.working, 0.25); if (s > 0) xf(CX, 1000, s, 0, () => { ctx.save(); ctx.translate(CX, 1000); ctx.rotate(-0.07); fillRR(-330, -70, 660, 140, 14, 'rgba(255,255,255,0.96)'); strokeRR(-330, -70, 660, 140, 14, '#3dbb74', 10); text('PLAN: WORKING', 0, 4, 76, 800, '#2a8a54', 'center', 0.0); ctx.restore(); });
}
function sceneCancel(t) {
  town(t); crowd(t, 10, 0, -9, 0.4);
  const k = pop(t, T.cancel + 0.1, 0.35); xf(CX, 760, k, 0, () => signBoard(CX, 700, 560, 330, [['BY ORDER:', 40, '#6b4a34'], ['NO MUSIC', 100, '#b3261e']]));
  [[190, '#c25a4a'], [330, '#b5793f'], [470, '#d9a52e']].forEach(([x, c], i) => { const p = ease.out(seg(t, T.cancel + 0.3 + i * 0.2, T.cancel + 1.0 + i * 0.2)); if (p > 0) { shadow(x + 600 * p, 1500, 60); fillRR(x + 600 * p - 50, 1430, 100, 70, 10, c); } });
}
function sceneGuess(t) {
  ctx.fillStyle = '#dfe6ee'; ctx.fillRect(0, 0, W, 1380); ctx.fillStyle = '#9aa7b8'; ctx.fillRect(0, 1380, W, 540); ctx.fillStyle = '#86939f'; ctx.fillRect(0, 1380, W, 14);
  fillRR(120, 250, 840, 560, 14, '#f8fbff'); strokeRR(120, 250, 840, 560, 14, '#8a97a8', 10); fillRR(160, 810, 760, 16, 6, '#8a97a8');
  text('WHY ARE REGULARS LEAVING?', CX, 320, 44, 800, '#3a4a6a', 'center', 0.0);
  [['Discount?', T.most + 0.3], ['More ads?', T.most + 0.8], ['Dance?', T.fix]].forEach(([s, at], i) => { const k = pop(t, at, 0.3); if (k > 0) xf(CX, 450 + i * 110, k, 0, () => { text(s, CX, 450 + i * 110, 70, 800, '#2a6fd6', 'center', 0); const x = seg(t, T.hope, T.hope + 0.3 + i * 0.1); if (x > 0) line(CX - tw(s, 70, 800, 0) / 2, 450 + i * 110, CX - tw(s, 70, 800, 0) / 2 + tw(s, 70, 800, 0) * x, 450 + i * 110, '#b3261e', 10); }); });
  person(CX, 1520, 620, 9, { skin: '#d9a27a', shirt: '#6c8ebf', pants: '#3d424f', glasses: true, arm: 'wave', wave: t, mouth: 'open', eyes: 'wide' });
  const q = pop(t, T.hope, 0.3); if (q > 0) xf(800, 1000, q, 0, () => { fillRR(690, 940, 220, 100, 50, '#fff'); text('...hope?', 800, 991, 40, 800, '#1b1f27', 'center'); });
}
// ═════════════ the product ═════════════
function scoreRing(cx, cy, r, v, col) { ctx.lineWidth = 12; ctx.lineCap = 'round'; ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.stroke(); ctx.strokeStyle = col; ctx.beginPath(); ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * v / 100); ctx.stroke(); }
function sceneSignals(t) {
  stage(t, 0.22);
  withFade(enter(t, T.signals - 0.1, T.txt, 0.2), () => {
    eyebrow('CLIENT HEALTH · SIGNALS', 330); card(CARD.x, 380, CARD.w, 880);
    avatar(CARD.x + 90, 480, 46, 'PS', NAMES[1][1]); text('Priya S.', CARD.x + 160, 466, 40, 800, '#fff', 'left'); text('Regular · monthly cut', CARD.x + 160, 512, 26, 500, SOFT, 'left');
    const d = ease.inOut(seg(t, T.score - 0.1, T.score + 0.9)), sc = Math.round(lerp(78, 38, d)), col = sc <= 45 ? RED : sc <= 65 ? AMBER : GREEN;
    scoreRing(CX, 800, 150, sc, col); text(String(sc), CX, 790, 110, 800, '#fff', 'center', -0.03); text('HEALTH SCORE', CX, 880, 22, 800, MUTED, 'center', 0.22); if (sc <= 45) tag(CARD.x + CARD.w - 40, 480, 'AT RISK', RED, true, 20);
    [['Fewer visits', '4 weeks → 9 weeks', T.few], ['Slower replies', '2 hrs → 3 days', T.few + 0.9], ['No new booking', 'Nothing scheduled', T.score]].forEach(([n, v, at], i) => { const y = 1000 + i * 76, e = pop(t, at, 0.3); if (e > 0) xf(CX, y, clamp(e), 0, () => { fillRR(CARD.x + 40, y - 30, CARD.w - 80, 62, 20, 'rgba(255,255,255,0.06)'); circle(CARD.x + 76, y + 1, 9, i === 2 ? RED : AMBER); text(n, CARD.x + 104, y + 1, 26, 700, '#fff', 'left'); text(v, CARD.x + CARD.w - 64, y + 1, 24, 500, SOFT, 'right'); }); });
  });
}
function sceneAuto(t) {
  stage(t, 0.22);
  withFade(enter(t, T.txt - 0.05, T.nodance, 0.2), () => {
    eyebrow('AUTOMATIC WIN-BACK', 380); card(CARD.x, 430, CARD.w, 100, { r: 22 });
    let x = CARD.x + 28; text('When', x, 481, 26, 600, MUTED); x += tw('When', 26, 600) + 14;
    { const s = 'At risk', w = tw(s, 24, 700) + 36; fillRR(x, 456, w, 44, 22, rgba(RED, 0.16)); text(s, x + w / 2, 479, 24, 700, RED, 'center'); x += w + 18; } text('→', x, 480, 28, 700, MUTED); x += 46;
    { const s = 'Send SMS', w = tw(s, 24, 700) + 36; fillRR(x, 456, w, 44, 22, rgba(IN.mid, 0.18)); text(s, x + w / 2, 479, 24, 700, IN.hi, 'center'); }
    const on = ease.out(seg(t, T.txt + 0.05, T.txt + 0.3)), sx = CARD.x + CARD.w - 104; fillRR(sx, 458, 76, 40, 20, on > 0.5 ? C.primary : 'rgba(255,255,255,0.16)'); circle(sx + 20 + 36 * on, 478, 15, '#fff');
    const ty = 580; card(CARD.x, ty, CARD.w, 640); avatar(CARD.x + 66, ty + 62, 30, 'PS', NAMES[1][1]); text('Priya S.', CARD.x + 112, ty + 62, 30, 700, '#fff'); tag(CARD.x + CARD.w - 30, ty + 62, 'SMS', IN.mid, false, 20);
    ctx.fillStyle = 'rgba(255,255,255,0.07)'; ctx.fillRect(CARD.x + 30, ty + 108, CARD.w - 60, 2);
    const m1 = pop(t, T.txt + 0.3, 0.35), h1 = bubble(CARD.x + 40, ty + 140 + (1 - clamp(m1)) * 26, CARD.w - 80, ['Hi Priya, it\'s been a while!', 'Want your usual, Thursday at 10?'], true, clamp(m1));
    withFade(seg(t, T.txt + 0.7, T.txt + 1.0), () => text('Sent automatically · before she\'s gone', CARD.x + CARD.w - 40, ty + 140 + h1 + 28, 21, 600, IN.mid, 'right'));
    const m2 = pop(t, T.gone + 0.3, 0.3), h2 = bubble(CARD.x + 40, ty + 140 + h1 + 80 + (1 - clamp(m2)) * 26, CARD.w - 80, ['Yes please!'], false, clamp(m2));
    const b = pop(t, T.gone + 0.7, 0.35); if (b > 0) xf(CX, ty + 140 + h1 + 80 + h2 + 70, b, 0, () => { const s = 'Booked · Thu 10:00 AM', w = tw(s, 28, 700) + 100, by = ty + 140 + h1 + 80 + h2 + 36; fillRR(CX - w / 2, by, w, 64, 32, rgba(GREEN, 0.18)); strokeRR(CX - w / 2, by, w, 64, 32, rgba(GREEN, 0.6), 2); circle(CX - w / 2 + 38, by + 32, 15, GREEN); check(CX - w / 2 + 38, by + 33, 15, '#fff', 3.5); text(s, CX - w / 2 + 66, by + 33, 28, 700, '#fff', 'left'); });
  });
}
function sceneNoDance(t) {
  stage(t, 0.26);
  withFade(enter(t, T.nodance - 0.05, T.offer, 0.15), () => {
    const a = pop(t, T.nodance, 0.3);
    xf(CX, 860, clamp(a), 0, () => { ctx.save(); ctx.translate(CX, 760); ctx.fillStyle = '#fff'; circle(0, -130, 46, '#fff'); fillRR(-40, -70, 80, 150, 36, '#fff'); line(-40, -40, -130, -110, '#fff', 30); line(40, -40, 130, 30, '#fff', 30); line(-20, 70, -70, 190, '#fff', 30); line(20, 70, 110, 180, '#fff', 30); ctx.restore(); ring(CX, 790, 270, RED, 24); line(CX - 190, 600, CX + 190, 980, RED, 24); text('NO DANCING', CX, 1180, 104, 800, '#fff', 'center', -0.02); text('REQUIRED', CX, 1290, 104, 800, IN.mid, 'center', -0.02); });
  });
}
const SCENES = [[0, VO_AT[1], sceneStart], [VO_AT[1], T.more - 0.3, sceneCrowd], [T.more - 0.3, T.attend, sceneMore], [T.attend, T.cancel, sceneAttend], [T.cancel, T.most, sceneCancel], [T.most, T.brand, sceneGuess],
  [T.brand, T.signals, (t) => brandHit(t, T.brand, T.signals)], [T.signals, T.txt, sceneSignals], [T.txt, T.nodance, sceneAuto], [T.nodance, T.offer, sceneNoDance], [T.offer, T.end, (t) => offerCard(t, T.offer, T.end)], [T.end, 999, (t) => endCard(t, T.end, T.cta, T.url)]];
cue(0.5, 'swish', 0.8); cue(T.dancing, 'ding', 0.7); cue(VO_AT[1], 'swoosh', 0.8); cue(T.hundreds, 'punch', 0.9); cue(T.more, 'swish', 0.8); cue(T.stage, 'punch', 0.8); cue(T.attend + 0.3, 'key', 0.6); cue(T.attend + 0.7, 'key', 0.6); cue(T.working, 'ding', 1);
cue(T.cancel + 0.1, 'punch', 1); cue(T.most + 0.3, 'tap', 0.7); cue(T.most + 0.8, 'tap', 0.7); cue(T.fix, 'tap', 0.7); cue(T.hope, 'notification', 0.9); cue(T.brand, 'transitionHit', 1); cue(T.few, 'key', 0.7); cue(T.few + 0.9, 'key', 0.7); cue(T.score, 'ding', 0.9);
cue(T.txt + 0.1, 'tap', 0.8); cue(T.txt + 0.3, 'swish', 0.9); cue(T.gone + 0.3, 'notification', 0.9); cue(T.gone + 0.7, 'ding', 1); cue(T.nodance, 'punch', 1); cue(T.offer, 'punch', 1); cue(T.offer + 0.7, 'ding', 0.9); cue(T.end, 'swish', 0.8); cue(T.cta, 'tap', 1.2);
boot({ duration: DURATION, scenes: SCENES, brandAt: T.brand, hideCaption: (t) => t >= T.end - 0.1,
  after: (t) => { const f = 1 - seg(t, T.brand, T.brand + 0.12); if (t >= T.brand && f > 0) { ctx.fillStyle = rgba('#ffffff', 0.5 * f); ctx.fillRect(0, 0, W, H); } } }, 'dance');
