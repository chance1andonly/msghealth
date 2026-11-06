// MsgHealth · "The bottle" · story-hook vertical ad (1080 × 1920, 30 fps), built on src/kit.js + story-kit.js + soft-kit.js.
// Real story: in 2018 a message in a bottle thrown from a German ship in 1886 washed up on a beach in Western Australia after
// 131 years at sea; the note asked whoever found it to write back.
// INVENTED (the absurd part): the sender's follow-up plan was more bottles.
// Pivot: your customers won't find your news in a bottle. MsgHealth sends one message to everyone who should get it, by text and
// email (SMS marketing and email broadcasts), in seconds. The product is a phone over the story's art, light UI.
// Audience size and message copy are illustrative. Voiceover: assets/audio/bottle/vo-NN.wav (src/bottle-vo.js).
'use strict';
const word = (l, k) => VO_AT[l] + VO_CLIPS[l].chunks[k][1];
const T = {
  aus: word(0, 1), thrown: VO_AT[1], y1886: word(1, 1), years: VO_AT[2], note: VO_AT[3], write: word(3, 1), more: VO_AT[4], morebottles: word(4, 1), pivot: VO_AT[5], bottle2: word(5, 1),
  brand: VO_AT[6], should: word(6, 1), text: VO_AT[7], secs: word(7, 1), not131: VO_AT[8], offer: VO_AT[9], url: VO_AT[10],
};
const DURATION = +(T.url + 2.2).toFixed(2);
window.CUES = T; window.SFX = []; const cue = (t, kind, gain) => window.SFX.push({ t, kind, gain });
window.MUSIC = { bpm: 100, root: 52, brandAt: 999, mood: 'quirky' };

function bottle(x, y, s, rot = 0, o = {}) { // glass bottle lying/standing, base-centre at (x, y)
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  fillRR(-46, -230, 92, 230, 30, 'rgba(120,200,160,0.85)'); fillRR(-18, -330, 36, 120, 10, 'rgba(120,200,160,0.85)'); fillRR(-24, -352, 48, 34, 8, '#a8743f'); fillRR(-30, -150, 60, 110, 6, '#f4efe0'); line(-18, -130, 18, -130, '#b8a87a', 3); line(-18, -108, 18, -108, '#b8a87a', 3); line(-18, -86, 10, -86, '#b8a87a', 3);
  fillRR(-36, -215, 14, 170, 7, 'rgba(255,255,255,0.35)'); ctx.restore();
}
function beach(t) { backdrop(1000, '#8fd6f2', '#f6f0d8', '#ecd9a0', '#d3b878'); ctx.fillStyle = '#2fa6c4'; ctx.fillRect(0, 700, W, 300); ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.fillRect(0, 990, W, 14); for (let i = 0; i < 5; i++) ellipse(((i * 260 + t * 30) % 1300) - 100, 760 + i * 50, 100, 7, 'rgba(255,255,255,0.3)'); cloud(80, 230, 0.9, 'rgba(255,255,255,0.95)'); }
function sceneBeach(t) {
  beach(t); const k = appear(t, 0.3, 0.45); withFade(seg(t, 0.1, 0.4), () => text('2018', CX, 190, 190, 800, '#0d4d63', 'center', -0.03));
  xf(820, 1650, 0.6 + 0.4 * k, 0, () => { ctx.globalAlpha = k; shadow(780, 1650, 150); bottle(840, 1650, 2.0, -1.3); });
  person(250, 1650, 520, 44, { skin: '#d9a27a', shirt: '#f2c84a', pants: '#3d424f', hat: '#e0b84a', arm: 'down', mouth: 'open', eyes: 'wide', bounce: t * 2 });
  const a = appear(t, T.aus, 0.35); if (a > 0) xf(CX, 400, a, 0, () => banner('AUSTRALIA', CX, 410, 96, '#0d4d63'));
}
function sailingShip(x, y, s, t) {
  const by = y + sine(t, 2, 8); shadow(x, y + 60 * s, 280 * s, 'rgba(0,30,50,0.3)'); [-110, 40, 190].forEach((mx, i) => { line(x + mx * s, by - 20 * s, x + mx * s, by - (420 - i * 40) * s, '#4a3220', 9 * s); const h = (330 - i * 40) * s; poly([[x + mx * s - 8 * s, by - (410 - i * 40) * s], [x + mx * s + 110 * s, by - (360 - i * 40) * s], [x + mx * s + 100 * s, by - (110) * s], [x + mx * s - 8 * s, by - 100 * s]], '#f4efe0'); });
  poly([[x - 300 * s, by - 40 * s], [x + 320 * s, by - 40 * s], [x + 240 * s, by + 70 * s], [x - 230 * s, by + 70 * s]], '#4a3220'); fillRR(x - 300 * s, by - 50 * s, 620 * s, 18 * s, 4, '#b3261e');
}
function sceneThrow(t) {
  ocean(t, 800, { sky0: '#b9c9d9', sky1: '#efe6d2', s0: '#3a8aa8', s1: '#154a66' }); const lt = t - T.thrown; sailingShip(380, 1300, 1.1, t);
  withFade(seg(t, T.thrown, T.thrown + 0.3), () => text('1886', CX, 190, 190, 800, '#3a2a1a', 'center', -0.03));
  const k = seg(t, T.thrown + 0.3, T.thrown + 1.6); if (k > 0) { const x = lerp(640, 840, k), y = 1180 - Math.sin(k * Math.PI) * 340 + (k > 0.98 ? 0 : 0) + (k * k) * 220; if (k < 1) bottle(x, y, 0.7, k * 9); else { bottle(840, 1380 + sine(t, 3, 8), 0.8, 1.4); } }
  const a = appear(t, T.y1886, 0.35); if (a > 0) xf(CX, 400, a, 0, () => banner('GERMAN SHIP', CX, 410, 80, '#3a2a1a', '#f2c84a'));
}
function sceneYears(t) {
  const lt = t - T.years, p = ease.inOut(seg(t, T.years, T.note - 0.2)), n = Math.round(p * 131); ocean(t, 800, { sky0: '#6a88b0', sky1: '#d9e6ee' });
  const nightA = 0.5 * (0.5 + 0.5 * Math.sin(lt * 5)); ctx.fillStyle = `rgba(10,16,40,${nightA})`; ctx.fillRect(0, 0, W, H);
  bottle(CX + sine(t, 1.6, 120), 1360 + sine(t, 3, 14), 1.9, sine(t, 2, 0.35));
  text(String(n), CX, 360, 300, 800, '#fff', 'center', -0.04); banner('YEARS AT SEA', CX, 520, 60, 'rgba(14,16,28,0.8)', '#f2c84a');
}
function sceneNote(t) {
  ctx.fillStyle = vgrad(0, H, '#7a5a3a', '#4a3320'); ctx.fillRect(0, 0, W, H); const k = appear(t, T.note - 0.1, 0.45);
  xf(CX, 800, 0.7 + 0.3 * k, 0, () => { ctx.globalAlpha = k; ctx.save(); ctx.translate(CX, 800); ctx.rotate(-0.03); ctx.shadowColor = 'rgba(0,0,0,0.4)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 18; fillRR(-400, -420, 800, 840, 14, '#efe2c0'); ctx.shadowColor = 'transparent';
    text('PLEASE WRITE BACK', 0, -300, 72, 800, '#4a3320', 'center', 0.04); for (let i = 0; i < 8; i++) { const w = 560 - (i % 3) * 110, show = seg(t, T.note + 0.3 + i * 0.12, T.note + 0.5 + i * 0.12); line(-290, -180 + i * 62, -290 + w * show, -180 + i * 62, '#7a6a4a', 8); } ctx.restore(); });
  const w = appear(t, T.write, 0.35); if (w > 0) xf(CX, 1200, w, 0, () => { fillRR(300, 1120, 480, 250, 14, '#fff'); poly([[300, 1120], [540, 1280], [780, 1120]], '#e6dcc0'); });
}
function sceneMore(t) {
  ctx.fillStyle = vgrad(0, 1250, '#d9c9a0', '#b8a47a'); ctx.fillRect(0, 0, W, 1250); ctx.fillStyle = '#6a5238'; ctx.fillRect(0, 1250, W, 670); ctx.fillStyle = 'rgba(0,0,0,0.12)'; ctx.fillRect(0, 1250, W, 30);
  fillRR(40, 1100, 1000, 40, 6, '#5a4228'); for (let i = 0; i < 9; i++) { const e = appear(t, T.more + 0.25 + i * 0.17, 0.3); if (e > 0) xf(110 + i * 108, 1100, e, 0, () => bottle(110 + i * 108, 1100, 0.7)); }
  fillRR(40, 650, 1000, 40, 6, '#5a4228'); for (let i = 0; i < 9; i++) { const e = appear(t, T.more + 0.35 + i * 0.17, 0.3); if (e > 0) xf(110 + i * 108, 650, e, 0, () => bottle(110 + i * 108, 650, 0.7)); }
  person(300, 1650, 520, 77, { skin: '#d9a27a', shirt: '#2a3a5a', pants: '#3d424f', hat: '#2a3a5a', arm: 'up', wave: t * 1.5, mouth: 'open', hair: '#cfcfcf' });
  const a = appear(t, T.morebottles, 0.35); if (a > 0) xf(CX, 280, a, 0, () => banner('MORE BOTTLES.', CX, 300, 110, '#3a2a1a', '#f2c84a', -0.03));
}
function scenePivot(t, frozen) {
  backdrop(1150, '#d7e3ef', '#f4f1ea', '#b9b3a6', '#8f897c'); fillRR(0, 560, W, 590, 0, '#c9c2b3'); for (let i = 0; i < 4; i++) fillRR(60 + i * 260, 640, 200, 300, 8, '#cfe7f3'); fillRR(60, 400, 560, 120, 18, '#2a3a5a'); text('OPEN SATURDAY', 340, 462, 48, 800, '#f2c84a', 'center', 0.06);
  [[780, 1, 0], [330, -1, 1], [610, 1, 2]].forEach(([x, d, i]) => { const px = frozen ? x : lerp(x - d * 200, x + d * 500, (t * 0.12 + i * 0.3) % 1); person(((px % 1400) + 1400) % 1400 - 160, 1650, 440 + i * 20, 90 + i, { dir: d, shirt: SHIRT[i + 3], arm: i === 2 ? 'phone' : 'down', bounce: t * 5 + i }); });
  bottle(110, 1540, 1.1, -1.2); const a = appear(t, T.bottle2, 0.35); if (a > 0 && !frozen) xf(CX, 330, a, 0, () => banner('NEWS IN A BOTTLE', CX, 300, 78, '#2a3a5a'));
}
function bPhone(t) {
  const c = pop(t, T.brand + 0.4, 0.3); if (c > 0) xf(310, 70, clamp(c), 0, () => ltext('New broadcast', 30, 60, 38, 800));
  const sent = t > T.secs + 0.5, press = t > T.secs && t < T.secs + 0.2 ? 0.95 : 1;
  const a = pop(t, T.should - 0.2, 0.3); if (a > 0) xf(310, 150, clamp(a), 0, () => { lcard(20, 120, 580, 90, 22); ltext('To', 46, 165, 22, 700, LMUTED); fillRR(100, 140, 270, 50, 25, rgba('#4f46e5', 0.14)); ltext('All customers · 214', 235, 166, 22, 800, '#4f46e5', 'center'); });
  const ch = pop(t, T.text, 0.3); if (ch > 0) xf(310, 270, clamp(ch), 0, () => { [['SMS', 30], ['Email', 200]].forEach(([n, x]) => { fillRR(x, 232, 150, 62, 31, rgba(LGREEN, 0.14)); lcheck(x + 34, 263, 14); ltext(n, x + 60, 264, 24, 800, LGREEN); }); });
  const m = pop(t, T.brand + 0.9, 0.3); if (m > 0) xf(310, 450, clamp(m), 0, () => { lcard(20, 320, 580, 330, 24); ltext('Saturday hours are in!', 50, 375, 30, 800); ltext('We\'re open 9 to 5 this week.', 50, 425, 26, 500, LMUTED); ltext('Book your spot →', 50, 475, 26, 800, '#4f46e5'); ctx.fillStyle = LLINE; for (let i = 0; i < 3; i++) ctx.fillRect(50, 520 + i * 32, 400 - i * 90, 10); });
  xf(310, 760, press, 0, () => { fillRR(20, 690, 580, 100, 50, sent ? rgba(LGREEN, 0.16) : '#4f46e5'); if (sent) { lcheck(120, 740, 22); ltext('Sent to 214 · delivered', 160, 741, 30, 800, LGREEN); } else ltext('Send', 310, 741, 36, 800, '#fff', 'center'); });
  if (sent) { const s = seg(t, T.secs + 0.5, T.secs + 1.4); fillRR(20, 820, 580, 16, 8, LLINE); fillRR(20, 820, 580 * s, 16, 8, LGREEN); }
}
function sceneSea(t) { ocean(t, 800, { sky0: '#8fd6f2', sky1: '#e6f6f2' }); bottle(CX + sine(t, 1.6, 90), 1180 + sine(t, 3, 12), 1.5, sine(t, 2, 0.3)); const a = appear(t, T.not131, 0.35); if (a > 0) xf(CX, 400, a, 0, () => banner('NOT 131 YEARS.', CX, 400, 96, '#0d4d63')); }
const SCENES = [[0, T.thrown, sceneBeach], [T.thrown, T.years, sceneThrow], [T.years, T.note, sceneYears], [T.note, T.more, sceneNote], [T.more, T.pivot, sceneMore], [T.pivot, T.brand, (t) => scenePivot(t, false)],
  [T.brand, T.offer, (t) => { scenePivot(t, true); phoneOver(t, T.brand, T.offer, bPhone); }], [T.offer, 999, (t) => { sceneSea(t); offerStrip(t, T.offer + 0.1); }]];
cue(0.4, 'swish', 0.7); cue(0.5, 'punch', 0.8); cue(T.aus, 'ding', 0.9); cue(T.thrown, 'swish', 0.7); cue(T.thrown + 1.4, 'transition', 0.8); cue(T.years, 'swoosh', 0.8); cue(T.note, 'swish', 0.7); cue(T.write, 'ding', 0.8); cue(T.more, 'punch', 0.9); for (let i = 0; i < 9; i++) cue(T.more + 0.25 + i * 0.17, 'tap', 0.35);
cue(T.pivot, 'swish', 0.7); cue(T.bottle2, 'punch', 0.9); cue(T.brand, 'swoosh', 0.7); cue(T.should, 'key', 0.6); cue(T.text, 'key', 0.6); cue(T.secs, 'tap', 1); cue(T.secs + 0.5, 'ding', 1); cue(T.not131, 'punch', 0.9); cue(T.offer + 0.1, 'ding', 0.9); cue(T.url, 'tap', 0.8);
boot({ duration: DURATION, scenes: SCENES, brandAt: 999 }, 'bottle');
