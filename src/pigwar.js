// MsgHealth · "The pig" · story-hook vertical ad (1080 × 1920, 30 fps), built on src/kit.js + src/story-kit.js.
// Real story: the Pig War (1859). On San Juan Island, where the US/British border was disputed, an American farmer shot a
// British neighbour's pig that was eating his potatoes. He offered ten dollars, the owner wanted a hundred; both countries sent
// soldiers and warships, the standoff lasted twelve years, and the only casualty was the pig.
// INVENTED (the absurd part): each side spent those years waiting for the other to reply first.
// Pivot: your customers are waiting on a reply too. MsgHealth puts a real person one tap away: Help → Contact a Representative.
// Names and messages in the product scenes are illustrative. Voiceover: assets/audio/pigwar/vo-NN.wav (src/pigwar-vo.js).
'use strict';
const word = (l, k) => VO_AT[l] + VO_CLIPS[l].chunks[k][1];
const T = {
  pig: word(0, 1), shot: VO_AT[1], neighbor: word(1, 1), dollars: VO_AT[2], hundred: word(2, 1), soldiers: VO_AT[3], war: word(3, 1), five: VO_AT[4], dug: word(4, 1), thousands: VO_AT[5], dead: word(5, 1),
  cas: VO_AT[6], thepig: word(6, 1), twelve: VO_AT[7], each: word(7, 1), reply: word(7, 2), pivot: VO_AT[8], wait2: word(8, 0), reply2: word(8, 1), brand: VO_AT[9], tap: VO_AT[10], rep: word(10, 1), human: VO_AT[11], standoff: word(11, 1),
  offer: VO_AT[12], end: VO_AT[13] - 0.1, url: VO_AT[13] + 0.1,
};
T.cta = T.end + 1.25;
const DURATION = +(T.cta + 1.0).toFixed(2);
window.CUES = T; window.SFX = []; const cue = (t, kind, gain) => window.SFX.push({ t, kind, gain });
window.MUSIC = { bpm: 108, root: 47, brandAt: T.brand, mood: 'bouncy' };

const GR = 1000;
function farm(t, sky0 = '#8fcdf0', sky1 = '#e9f5e8') {
  backdrop(GR, sky0, sky1, '#7fae5a', '#5f8f45'); cloud(70, 250, 0.9, 'rgba(255,255,255,0.95)'); cloud(640, 380, 0.7, 'rgba(255,255,255,0.9)');
  ctx.fillStyle = '#9ac27a'; ctx.beginPath(); ctx.moveTo(0, GR); ctx.quadraticCurveTo(250, 800, 560, GR); ctx.quadraticCurveTo(820, 840, W, GR); ctx.fill(); // far hills
  ctx.fillStyle = '#8bb86b'; ctx.fillRect(0, GR - 10, W, 20);
  for (let i = 0; i < 7; i++) line(-200 + i * 220, H, 300 + i * 90, GR + 20, 'rgba(70,50,30,0.22)', 10); // furrows
}
function pig(x, y, s, o = {}) { // feet at (x, y)
  const d = o.dir ?? 1; shadow(x, y, 150 * s);
  ctx.save(); ctx.translate(x, y); ctx.scale(d, 1); if (o.dead) { ctx.translate(0, -85 * s); ctx.rotate(Math.PI); ctx.translate(0, 85 * s); }
  [[-80, 0.9], [-40, 1], [50, 1], [90, 0.9]].forEach(([lx, a], i) => fillRR((lx - 14) * s, -50 * s, 28 * s, 50 * s, 8 * s, i % 2 ? '#e89a95' : '#d98a86'));
  ellipse(0, -90 * s, 130 * s, 78 * s, '#f4b6b0'); ellipse(20 * s, -60 * s, 100 * s, 30 * s, 'rgba(255,255,255,0.15)');
  ctx.strokeStyle = '#e89a95'; ctx.lineWidth = 9 * s; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(-138 * s, -110 * s, 18 * s, 0.5, 5); ctx.stroke();
  circle(122 * s, -100 * s, 62 * s, '#f4b6b0'); poly([[90 * s, -150 * s], [120 * s, -190 * s], [140 * s, -140 * s]], '#e89a95'); ellipse(176 * s, -88 * s, 32 * s, 25 * s, '#e89a95'); circle(168 * s, -88 * s, 5 * s, '#6b3f3a'); circle(188 * s, -88 * s, 5 * s, '#6b3f3a');
  if (o.dead) { line(100 * s, -125 * s, 124 * s, -105 * s, '#1b1f27', 6 * s); line(124 * s, -125 * s, 100 * s, -105 * s, '#1b1f27', 6 * s); } else circle(112 * s, -112 * s, 7 * s, '#1b1f27');
  ctx.restore();
}
function potatoes(x, y, n) { for (let i = 0; i < n; i++) ellipse(x + i * 46, y + (i % 2) * 14, 22, 16, '#b88a52'); }
function scenePig(t) {
  farm(t); const lt = t; text('1859', CX, 230, 190, 800, 'rgba(40,60,20,0.9)', 'center', -0.02);
  withFade(seg(t, 0.2, 0.6), () => text('SAN JUAN ISLAND', CX, 380, 36, 800, 'rgba(40,60,20,0.7)', 'center', 0.25));
  const k = appear(t, 0.4, 0.4); xf(CX, 1390, 0.6 + 0.4 * k, 0, () => { ctx.globalAlpha = k; potatoes(380, 1410, 8); pig(CX, 1390, 1.9, { dir: 1 }); });
  const b = appear(t, T.pig, 0.35); if (b > 0) xf(CX, 760, b, 0, () => banner('PIG + POTATOES', CX, 760, 76, '#7a4a2a'));
}
function sceneShot(t) {
  farm(t); const lt = t - T.shot, hit = lt > 0.5;
  person(200, 1640, 470, 71, { skin: '#d9a27a', shirt: '#2a5aa8', pants: '#4b5060', hat: '#7a5a3a', arm: 'up', wave: t * 2, mouth: 'open', eyes: 'wide', bounce: t * 3 });
  pig(600, 1640, 1.35, { dead: hit });
  if (lt > 0.5 && lt < 0.9) { ctx.save(); ctx.translate(430, 1190); ctx.rotate(0.2); poly(Array.from({ length: 16 }, (_, i) => { const a = (i / 16) * 6.28, r = i % 2 ? 90 : 160; return [Math.cos(a) * r, Math.sin(a) * r]; }), '#ffd45e'); text('BANG', 0, 0, 70, 800, '#b3261e', 'center', 0); ctx.restore(); }
  const n = appear(t, T.neighbor, 0.35); person(960, 1640, 440, 72, { skin: '#e2a87f', shirt: '#b3261e', pants: '#2c3340', hat: '#1b1b1f', dir: -1, mouth: 'open', eyes: 'wide', arm: 'up', wave: t * 3 });
  if (n > 0) xf(760, 760, n, 0, () => speech(740, 640, ['THAT\'S MY', 'PIG!'], { size: 62, tail: [930, 1190] }));
  const b = appear(t, T.shot + 0.05, 0.3); if (b > 0 && t < T.neighbor) xf(CX, 520, b, 0, () => banner('OOPS.', CX, 520, 110, '#b3261e'));
}
function sceneMoney(t) {
  farm(t); person(210, 1640, 480, 71, { skin: '#d9a27a', shirt: '#2a5aa8', pants: '#4b5060', hat: '#7a5a3a', bounce: t * 2 }); person(870, 1640, 460, 72, { skin: '#e2a87f', shirt: '#b3261e', pants: '#2c3340', hat: '#1b1b1f', dir: -1, bounce: t * 2 + 1 });
  const a = appear(t, T.dollars, 0.35), b = appear(t, T.hundred, 0.35);
  if (a > 0) xf(250, 700, a, 0, () => { speech(260, 520, ['I\'LL PAY', '$10'], { size: 80, tail: [220, 1130] }); });
  if (b > 0) xf(800, 700, b, 0, () => { speech(800, 520, ['I WANT', '$100'], { size: 80, tail: [860, 1150], bg: '#ffe0dc' }); });
}
function soldier(x, y, h, id, col, dir, t) { person(x, y, h, id, { skin: SKIN[id % 4], shirt: col, pants: '#d8d4c4', hat: col === '#2a3a6a' ? '#2a3a6a' : '#9a1f1f', dir, bounce: t * 6 + id }); }
function sceneSoldiers(t) {
  farm(t); const k = ease.out(seg(t, T.soldiers - 0.2, T.war));
  for (let row = 0; row < 3; row++) for (let i = 0; i < 4; i++) { const y = 1380 + row * 130, h = 280 + row * 60, x = lerp(-150, 100 + i * 120 + row * 40, k); soldier(x, y, h, 5 + i + row * 4, '#2a3a6a', 1, t); }
  [[740, 1400, 300], [900, 1500, 340]].forEach(([x, y, h], i) => { fillRR(x - 130, y - 230, 260, 230, 10, '#e6dfc9'); poly([[x - 150, y - 230], [x, y - 360], [x + 150, y - 230]], '#d8cfb2'); fillRR(x - 28, y - 120, 56, 120, 28, '#6b563f'); });
  const b = appear(t, T.soldiers, 0.35); if (b > 0) xf(CX, 560, b, 0, () => banner('US SOLDIERS', CX, 560, 90, '#2a3a6a'));
}
function ship(x, y, s, t, i = 0) {
  const by = y + sine(t + i, 2.4, 8); shadow(x, y + 70 * s, 250 * s, 'rgba(0,30,50,0.3)');
  line(x - 60 * s, by - 20 * s, x - 60 * s, by - 330 * s, '#4a3220', 8 * s); line(x + 80 * s, by - 20 * s, x + 80 * s, by - 280 * s, '#4a3220', 8 * s);
  poly([[x - 56 * s, by - 320 * s], [x + 70 * s, by - 300 * s], [x + 60 * s, by - 90 * s], [x - 56 * s, by - 80 * s]], '#f4efe0'); poly([[x + 84 * s, by - 270 * s], [x + 190 * s, by - 250 * s], [x + 180 * s, by - 80 * s], [x + 84 * s, by - 70 * s]], '#ebe3cf');
  poly([[x - 60 * s, by - 340 * s], [x - 60 * s, by - 370 * s], [x - 10 * s, by - 355 * s]], '#b3261e');
  poly([[x - 240 * s, by - 30 * s], [x + 250 * s, by - 30 * s], [x + 190 * s, by + 60 * s], [x - 180 * s, by + 60 * s]], '#3a2a1a'); fillRR(x - 240 * s, by - 40 * s, 490 * s, 16 * s, 4, '#b3261e');
  for (let j = 0; j < 5; j++) circle(x - 130 * s + j * 62 * s, by + 8 * s, 8 * s, '#111');
}
function sceneShips(t) {
  backdrop(820, '#9fd3ee', '#e9f4f1', '#2f8fb0', '#0f5a7a'); circle(180, 280, 80, '#fff1b8'); cloud(640, 250, 0.8);
  for (let i = 0; i < 12; i++) ellipse(((i * 300 + t * 30) % 1400) - 150, 900 + i * 85, 120 + i * 8, 8, 'rgba(255,255,255,0.22)');
  [[260, 1000, 0.55], [740, 1040, 0.6], [140, 1230, 0.75], [560, 1300, 0.85], [900, 1250, 0.7]].forEach(([x, y, s], i) => { const e = ease.out(seg(t, T.five + 0.15 + i * 0.28, T.five + 0.6 + i * 0.28)); if (e > 0) { ctx.save(); ctx.globalAlpha = e; ship(lerp(x + 300, x, e), y, s, t, i); ctx.restore(); } });
  const b = appear(t, T.five, 0.35); if (b > 0) xf(CX, 560, b, 0, () => banner('5 BRITISH WARSHIPS', CX, 560, 70, '#9a1f1f'));
  const d = appear(t, T.dug, 0.3); if (d > 0) xf(CX, 1700, d, 0, () => { fillRR(60, 1560, 960, 280, 20, '#6a5a3a'); for (let i = 0; i < 9; i++) ellipse(100 + i * 110, 1575, 58, 30, '#8a7448'); text('(Americans: dug in)', CX, 1720, 56, 800, '#fff', 'center', 0); });
}
function sceneThousands(t) {
  farm(t); const f = appear(t, T.thousands - 0.1, 0.3);
  for (let row = 0; row < 4; row++) for (let i = 0; i < 6; i++) { const y = 1230 + row * 110, h = 170 + row * 34; const lx = 60 + i * 70 + row * 18, rx = 1020 - i * 70 - row * 18; if (f > 0) { soldier(lx, y, h, 20 + i + row * 7, '#2a3a6a', 1, t); soldier(rx, y, h, 60 + i + row * 7, '#9a1f1f', -1, t); } }
  pig(CX, 1560, 1.0, { dead: true });
  const b = appear(t, T.thousands, 0.35); if (b > 0 && t < T.dead) xf(CX, 560, b, 0, () => banner('THOUSANDS OF MEN', CX, 560, 80, '#1b1f27'));
  const d = appear(t, T.dead, 0.35); if (d > 0) xf(CX, 560, d, 0, () => { fillRR(CX - 400, 470, 800, 180, 40, '#fff'); text('1 DEAD PIG', CX, 562, 100, 800, '#b3261e', 'center', -0.01); });
}
function sceneCasualty(t) {
  backdrop(1000, '#cfe3f5', '#fdf6e3', '#8bbd6a', '#6a9a4a'); glow(CX, 700, 700, '#fff4c0', 0.5); const k = appear(t, T.cas - 0.1, 0.45), y = 1360 + sine(t, 2.5, 18);
  shadow(CX, 1650, 220 * (1 - 0.1 * Math.sin(t * 2.5))); xf(CX, y, 0.7 + 0.3 * k, 0, () => { ctx.globalAlpha = clamp(k); const s = 1.9; ctx.save(); ctx.translate(0, 0); poly([[CX - 160, y - 160], [CX - 330, y - 280], [CX - 280, y - 90]], '#fff'); poly([[CX + 60, y - 160], [CX + 250, y - 290], [CX + 220, y - 90]], '#fff'); ctx.restore(); pig(CX, y + 60, 1.8, {}); ellipse(CX + 220, y - 330, 110, 24, '#ffd45e'); ctx.strokeStyle = '#fff2a8'; ctx.lineWidth = 8; ctx.beginPath(); ctx.ellipse(CX + 220, y - 330, 100, 20, 0, 0, 7); ctx.stroke(); });
  const b = appear(t, T.thepig, 0.35); xf(CX, 300, appear(t, T.cas, 0.3), 0, () => banner('CASUALTIES: 1', CX, 300, 100, '#1b1f27')); if (b > 0) xf(CX, 560, b, 0, () => banner('THE PIG', CX, 560, 120, '#e07a8a'));
}
function sceneTwelve(t) {
  farm(t, '#b6c3d6', '#f0e9dc'); const yr = Math.min(12, Math.floor(seg(t, T.twelve + 0.3, T.pivot - 0.3) * 13));
  person(210, 1640, 480, 71, { skin: '#d9a27a', shirt: '#2a5aa8', pants: '#4b5060', hat: '#7a5a3a', arm: 'phone', bounce: t }); person(870, 1640, 460, 72, { skin: '#e2a87f', shirt: '#b3261e', pants: '#2c3340', hat: '#1b1b1f', dir: -1, arm: 'phone', bounce: t + 1 });
  const a = appear(t, T.each, 0.3), b = appear(t, T.reply, 0.3);
  if (a > 0) xf(240, 760, a, 0, () => speech(250, 600, ['YOU REPLY', 'FIRST.'], { size: 58, tail: [215, 1160] })); if (b > 0) xf(820, 760, b, 0, () => speech(820, 600, ['NO. YOU.'], { size: 58, tail: [880, 1180], bg: '#ffe0dc' }));
  const k = appear(t, T.twelve, 0.35); if (k > 0) xf(CX, 330, k, 0, () => { fillRR(220, 220, 640, 220, 36, '#1b1f27'); text('YEAR', CX - 150, 330, 60, 800, '#fff', 'center', 0.05); text(String(Math.max(1, yr)), CX + 130, 335, 140, 800, '#f5d68a', 'center', -0.03); });
  withFade(seg(t, T.twelve + 0.5, T.twelve + 1), () => { [[420, '…'], [650, '…']].forEach(([x, s], i) => { const dots = Math.floor(t * 3 + i) % 4; text('typing' + '.'.repeat(dots), x + (i ? 0 : 0), 1010, 34, 700, 'rgba(60,50,30,0.7)', 'center', 0); }); });
}
function scenePivot(t) {
  backdrop(1050, '#d7e3ef', '#f4f1ea', '#b9b3a6', '#8f897c'); fillRR(0, 560, W, 490, 0, '#c9c2b3'); for (let i = 0; i < 4; i++) fillRR(60 + i * 260, 640, 200, 300, 8, '#cfe7f3');
  person(540, 1650, 560, 9, { skin: '#d9a27a', shirt: '#6c8ebf', pants: '#3d424f', arm: 'phone', glasses: true, mouth: 'flat', bounce: t });
  [['Can I move my booking?', 300, T.pivot + 0.2], ['Hello?', 800, T.wait2 + 0.9], ['Anyone there??', 300, T.reply2 + 0.2]].forEach(([s, x, at], i) => { const e = appear(t, at, 0.3); if (e > 0) xf(x, 380 + i * 170, e, 0, () => speech(x, 280 + i * 190, [s], { size: 42 })); });
  const c = appear(t, T.wait2, 0.35); if (c > 0) xf(880, 1000, c, 0, () => { circle(880, 1000, 54, RED); text('3', 880, 1002, 64, 800, '#fff', 'center'); });
}
// ═════════════ the product ═════════════
function sceneHelp(t) {
  stage(t, 0.22);
  withFade(enter(t, T.tap - 0.1, T.human, 0.2), () => {
    eyebrow('HELP', 300); card(CARD.x, 350, CARD.w, 360); text('Help', CARD.x + 44, 420, 40, 800, '#fff', 'left'); circle(CARD.x + CARD.w - 70, 420, 26, rgba(IN.mid, 0.3)); text('?', CARD.x + CARD.w - 70, 421, 34, 800, '#fff', 'center');
    ['Guides', 'Keyboard shortcuts'].forEach((s, i) => { const e = ease.out(seg(t, T.tap + 0.2 + i * 0.15, T.tap + 0.5 + i * 0.15)); withFade(e, () => text(s, CARD.x + 44, 500 + i * 70, 32, 500, SOFT, 'left')); });
    const h = pop(t, T.rep - 0.2, 0.35), press = t > T.rep + 0.4 && t < T.rep + 0.6 ? 0.96 : 1; if (h > 0) xf(CX, 810, clamp(h) * press, 0, () => { fillRR(CARD.x, 740, CARD.w, 130, 30, C.primary); strokeRR(CARD.x, 740, CARD.w, 130, 30, 'rgba(255,255,255,0.3)', 2); circle(CARD.x + 80, 805, 30, 'rgba(255,255,255,0.2)'); text('☺', CARD.x + 80, 806, 36, 800, '#fff', 'center'); text('Contact a Representative', CARD.x + 140, 806, 38, 800, '#fff', 'left'); });
    const g = pop(t, T.rep + 0.7, 0.35); if (g > 0) xf(CX, 1000, clamp(g), 0, () => { const lb = 'A real person, one tap away', ww = tw(lb, 34, 800) + 110; fillRR(CX - ww / 2, 950, ww, 90, 45, rgba(GREEN, 0.18)); strokeRR(CX - ww / 2, 950, ww, 90, 45, GREEN, 3); circle(CX - ww / 2 + 52, 995, 20, GREEN); check(CX - ww / 2 + 52, 996, 20, '#fff', 4.5); text(lb, CX - ww / 2 + 90, 996, 34, 800, '#fff', 'left'); });
  });
}
function sceneChat(t) {
  stage(t, 0.22);
  withFade(enter(t, T.human - 0.1, T.offer, 0.2), () => {
    eyebrow('CONTACT A REPRESENTATIVE', 300); card(CARD.x, 350, CARD.w, 820); avatar(CARD.x + 76, 430, 38, 'DA', '#3dbb74'); text('Dana · Representative', CARD.x + 136, 420, 32, 800, '#fff', 'left'); circle(CARD.x + 146, 462, 8, GREEN); text('Online', CARD.x + 164, 463, 22, 600, '#9ff0c0', 'left');
    ctx.fillStyle = 'rgba(255,255,255,0.08)'; ctx.fillRect(CARD.x + 30, 500, CARD.w - 60, 2);
    const a = ease.out(seg(t, T.human - 0.05, T.human + 0.25)); withFade(a, () => bubble(CARD.x + 40, 540, CARD.w - 80, ['Can you help me move a', 'booking to Friday?'], true));
    const b = pop(t, T.human + 0.7, 0.3); if (b > 0) xf(CX, 760, clamp(b), 0, () => bubble(CARD.x + 40, 710, CARD.w - 80, ['Hi! Of course. I\'m on it.'], false));
    const c = pop(t, T.human + 1.5, 0.3); if (c > 0) xf(CX, 900, clamp(c), 0, () => bubble(CARD.x + 40, 840, CARD.w - 80, ['All set. Friday at 10:00 ✓'], false));
    const s = pop(t, T.standoff, 0.35); if (s > 0) xf(CX, 1300, clamp(s), 0, () => { const lb = 'STANDOFF', ww = tw(lb, 44, 800, 0.1) + 120; fillRR(CX - ww / 2, 1250, ww, 100, 50, rgba(RED, 0.15)); strokeRR(CX - ww / 2, 1250, ww, 100, 50, RED, 3); text(lb, CX, 1301, 44, 800, '#ff8a7f', 'center', 0.1); const k = seg(t, T.standoff + 0.3, T.standoff + 0.6); line(CX - ww / 2 + 30, 1301, CX - ww / 2 + 30 + (ww - 60) * k, 1301, '#fff', 6); });
  });
}
const SCENES = [[0, T.shot, scenePig], [T.shot, T.dollars, sceneShot], [T.dollars, T.soldiers, sceneMoney], [T.soldiers, T.five, sceneSoldiers], [T.five, T.thousands, sceneShips], [T.thousands, T.cas, sceneThousands], [T.cas, T.twelve, sceneCasualty], [T.twelve, T.pivot, sceneTwelve], [T.pivot, T.brand, scenePivot],
  [T.brand, T.tap, (t) => brandHit(t, T.brand, T.tap)], [T.tap, T.human, sceneHelp], [T.human, T.offer, sceneChat], [T.offer, T.end, (t) => offerCard(t, T.offer, T.end)], [T.end, 999, (t) => endCard(t, T.end, T.cta, T.url)]];
cue(0.35, 'swish', 0.7); cue(T.pig, 'punch', 0.9); cue(T.shot, 'punch', 1); cue(T.shot + 0.5, 'transition', 0.8); cue(T.neighbor, 'notification', 0.9); cue(T.dollars, 'tap', 0.9); cue(T.hundred, 'punch', 1); cue(T.soldiers, 'swish', 0.8);
cue(T.five, 'swoosh', 0.8); for (let i = 0; i < 5; i++) cue(T.five + 0.15 + i * 0.28, 'tap', 0.5); cue(T.dug, 'punch', 0.9); cue(T.thousands, 'transition', 0.8); cue(T.dead, 'punch', 1); cue(T.cas, 'ding', 0.9); cue(T.thepig, 'punch', 1);
cue(T.twelve, 'swish', 0.8); cue(T.each, 'notification', 0.8); cue(T.reply, 'notification', 0.8); cue(T.pivot + 0.2, 'notification', 0.9); cue(T.wait2 + 0.9, 'notification', 0.9); cue(T.reply2 + 0.2, 'notification', 1); cue(T.brand, 'transitionHit', 1);
cue(T.tap + 0.2, 'key', 0.6); cue(T.rep - 0.2, 'swish', 0.8); cue(T.rep + 0.4, 'tap', 1); cue(T.rep + 0.7, 'ding', 1); cue(T.human, 'notification', 0.8); cue(T.human + 0.7, 'notification', 0.9); cue(T.human + 1.5, 'ding', 0.9); cue(T.standoff, 'punch', 0.9);
cue(T.offer, 'punch', 1); cue(T.offer + 0.7, 'ding', 0.9); cue(T.end, 'swish', 0.8); cue(T.cta, 'tap', 1.2);
boot({ duration: DURATION, scenes: SCENES, brandAt: T.brand, hideCaption: (t) => t >= T.end - 0.1,
  after: (t) => { const f = 1 - seg(t, T.brand, T.brand + 0.12); if (t >= T.brand && f > 0) { ctx.fillStyle = rgba('#ffffff', 0.5 * f); ctx.fillRect(0, 0, W, H); } } }, 'pigwar');
