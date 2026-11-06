// MsgHealth · "The bottle" v2 · "stay in the story" vertical ad (1080 × 1920, 30 fps), built on kit.js + story-kit.js + soft-kit.js.
// Same real story as bottle.js (a message in a bottle thrown from a German ship in 1886 washed up in Western Australia in 2018 after
// 131 years; the note asked the finder to write back). INVENTED: their follow-up plan was more bottles. Format change for retention:
// no pivot line and no product section. The product is a one-line joke inside the story ("Message Health would have sent it by text
// and email, in seconds, not 131 years") with a small broadcast card popping into the scene. Only ad element: a small end tag.
// Audience size and message copy are illustrative. Voiceover: assets/audio/bottle2/vo-NN.wav.
'use strict';
const word = (l, k) => VO_AT[l] + VO_CLIPS[l].chunks[k][1];
const T = {
  aus: word(0, 1), thrown: VO_AT[1], y1886: word(1, 1), years: VO_AT[2], note: VO_AT[3], write: word(3, 1), more: VO_AT[4], morebottles: word(4, 1), gag: VO_AT[5], sendv: word(5, 1), not131: word(5, 2), still: VO_AT[6],
};
T.tag = T.still + 1.0;
const DURATION = +(VO_AT[6] + VO_CLIPS[6].dur + 2.4).toFixed(2);
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

function sceneGag(t) {
  ocean(t, 800, { sky0: '#8fd6f2', sky1: '#e6f6f2' }); bottle(CX + sine(t, 1.6, 90), 1380 + sine(t, 3, 12), 1.5, sine(t, 2, 0.3)); const sent = t > T.sendv + 0.3, p = seg(t, T.sendv + 0.3, T.sendv + 1.4);
  cameo(t, T.gag + 0.3, 999, CX, 620, 740, 420, () => { ltext('New broadcast', 36, 62, 32, 800); fillRR(36, 100, 360, 56, 28, rgba('#4f46e5', 0.14)); ltext('All customers · 214', 216, 128, 22, 800, '#4f46e5', 'center');
    [['SMS', 420], ['Email', 560]].forEach(([n, x]) => { const e = pop(t, T.gag + 0.8, 0.3); if (e > 0) { fillRR(x, 100, 130, 56, 28, rgba(LGREEN, 0.14)); lcheck(x + 30, 128, 13); ltext(n, x + 54, 129, 22, 800, LGREEN); } });
    fillRR(36, 184, 668, 110, 20, '#f6f4ef'); ltext('Saturday hours are in! Book your spot →', 56, 240, 26, 700); fillRR(36, 326, 668, 62, 31, sent ? rgba(LGREEN, 0.16) : '#4f46e5'); if (sent) { fillRR(36, 326, 668 * p, 62, 31, rgba(LGREEN, 0.3)); ltext(p >= 1 ? 'Delivered to 214' : 'Sending…', 370, 358, 26, 800, LGREEN, 'center'); } else ltext('Send', 370, 358, 28, 800, '#fff', 'center'); }, 0.02);
  const b = appear(t, T.not131, 0.35); if (b > 0) xf(CX, 1000, b, 0, () => banner('NOT 131 YEARS.', CX, 960, 90, '#0d4d63'));
}
function sceneEnd(t) { ocean(t, 800, { sky0: '#f7b267', sky1: '#fbe0a8', s0: '#2f8fb0', s1: '#0d4d6a' }); circle(780, 720, 100, '#fff1b8'); const k = ease.inOut(seg(t, T.still, T.still + 3)); bottle(lerp(CX, 760, k), lerp(1300, 900, k) + sine(t, 3, 8), lerp(1.5, 0.5, k), sine(t, 2, 0.3)); const a = appear(t, T.still + 0.3, 0.3); if (a > 0) xf(380, 1000, a, 0, () => speech(380, 560, ['Hello?'], { size: 70, tail: [CX, 1100] })); endTag(t, T.tag); }
const SCENES = [[0, T.thrown, sceneBeach], [T.thrown, T.years, sceneThrow], [T.years, T.note, sceneYears], [T.note, T.more, sceneNote], [T.more, T.gag, sceneMore], [T.gag, T.still, sceneGag], [T.still, 999, sceneEnd]];
cue(0.4, 'swish', 0.7); cue(0.5, 'punch', 0.8); cue(T.aus, 'ding', 0.9); cue(T.thrown, 'swish', 0.7); cue(T.thrown + 1.4, 'transition', 0.8); cue(T.years, 'swoosh', 0.8); cue(T.note, 'swish', 0.7); cue(T.write, 'ding', 0.8); cue(T.more, 'punch', 0.9); for (let i = 0; i < 9; i++) cue(T.more + 0.25 + i * 0.17, 'tap', 0.35);
cue(T.gag + 0.3, 'notification', 1); cue(T.gag + 0.8, 'key', 0.6); cue(T.sendv + 0.3, 'tap', 1); cue(T.sendv + 1.4, 'ding', 1); cue(T.not131, 'punch', 0.9); cue(T.still + 0.3, 'tap', 0.7); cue(T.tag, 'tap', 0.8);
boot({ duration: DURATION, scenes: SCENES, brandAt: 999 }, 'bottle2');
