// MsgHealth · "The ducks" · story-hook vertical ad (1080 × 1920, 30 fps), built on src/kit.js + story-kit.js + soft-kit.js.
// Real story: in 1992 a container ship lost about 28,000 bath toys (mostly rubber ducks) into the Pacific. Years later they kept
// washing up in Alaska, Hawaii, Australia and even through Arctic ice, and scientists used them to map ocean currents.
// INVENTED (the absurd part): not one duck said it was leaving.
// Pivot: your customers drift away quietly too. MsgHealth scores every customer's health (visits, replies, bookings) so you spot
// who is drifting. Retention-minded format: the story never cuts to a logo screen; the product is a phone over the story's art.
// Client names, scores and statuses are illustrative. Voiceover: assets/audio/ducks/vo-NN.wav (src/ducks-vo.js).
'use strict';
const word = (l, k) => VO_AT[l] + VO_CLIPS[l].chunks[k][1];
const T = {
  fell: word(0, 1), track: VO_AT[1], alaska: word(2, 1), hawaii: VO_AT[3], arctic: word(3, 1), sci: VO_AT[4], maps: word(4, 1), notone: VO_AT[5], leaving: word(5, 1),
  pivot: VO_AT[6], drift: word(6, 1), brand: VO_AT[7], health: word(7, 1), spot: VO_AT[8], wash: word(8, 1), offer: VO_AT[9], url: VO_AT[10],
};
const DURATION = +(T.url + 2.2).toFixed(2);
window.CUES = T; window.SFX = []; const cue = (t, kind, gain) => window.SFX.push({ t, kind, gain });
window.MUSIC = { bpm: 108, root: 48, brandAt: 999, mood: 'bouncy' };

function ship(t, tilt) {
  ocean(t, 700); const y = 1150; ctx.save(); ctx.translate(500, y); ctx.rotate(tilt); ctx.translate(-500, -y);
  const cols = ['#d9462d', '#2a6bd9', '#f2b441', '#2f8a54', '#8a5fd0'];
  for (let r = 0; r < 3; r++) for (let c = 0; c < 5; c++) fillRR(150 + c * 130, 880 + r * 72 - 0, 124, 68, 4, cols[(c + r * 2) % 5]);
  fillRR(800, 820, 150, 280, 6, '#e9e2d0'); fillRR(820, 850, 110, 40, 4, '#8fc3e8'); fillRR(120, 1090, 860, 40, 4, '#7a1f2a'); poly([[80, 1130], [1000, 1130], [940, 1230], [150, 1230]], '#22304a'); ctx.restore();
  ctx.fillStyle = 'rgba(47,166,196,0.55)'; ctx.fillRect(0, 1190, W, 60);
}
function sceneShip(t) {
  const k = seg(t, T.fell - 0.1, T.fell + 0.8); ship(t, -0.05 * ease.out(k));
  for (let i = 0; i < 34; i++) { const tt = t - (T.fell + hash(i) * 0.9); if (tt < 0) continue; const x0 = 280 + hash(i + 3) * 500, vx = (hash(i + 5) - 0.5) * 260, wy = 1270 + hash(i + 7) * 330; let y = 880 - 240 * tt + 700 * tt * tt, land = y >= wy; if (land) y = wy + sine(t + i, 3, 5); duck(x0 + vx * Math.min(tt, 1.6), y, 0.34 + (wy - 1270) / 1600, { dir: i % 2 ? 1 : -1 }); }
  withFade(seg(t, 0.1, 0.4), () => text('1992', CX, 210, 190, 800, '#0d4d63', 'center', -0.03));
  const b = appear(t, 1.0, 0.35); if (b > 0) xf(CX, 450, b, 0, () => banner('28,000 BATH TOYS', CX, 450, 84, '#0d4d63'));
}
function sceneDrift(t, k0 = T.track) {
  ocean(t, 700); const k = ease.out(seg(t, k0, k0 + 2.6));
  for (let i = 0; i < 46; i++) { const dx = 60 + hash(i) * 960, dy = 820 + hash(i + 9) * 880, s = 0.3 + (dy - 800) / 1700; duck(lerp(CX, dx, k), lerp(1250, dy, k) + sine(t + i, 2.5, 6), s, { dir: i % 2 ? 1 : -1 }); }
}
function sceneTrack(t) {
  sceneDrift(t); const b = appear(t, T.track, 0.35); if (b > 0) xf(CX, 420, b, 0, () => { circle(CX, 340, 80, 'rgba(255,255,255,0.0)'); ring(CX - 20, 330, 70, '#0d4d63', 14); line(CX + 32, 382, CX + 100, 450, '#0d4d63', 18); crossOut(CX - 20, 330, 110, '#e0392d', 18); banner('NOBODY TRACKING', CX, 580, 76, '#0d4d63'); });
}
function mountains() { poly([[-50, 1000], [260, 520], [560, 1000]], '#cfd9e3'); poly([[300, 1000], [660, 430], [1050, 1000]], '#dfe8ef'); poly([[660, 430], [590, 560], [660, 520], [720, 580]], '#fff'); poly([[260, 520], [210, 610], [260, 580], [310, 620]], '#fff'); }
function sceneAlaska(t) {
  backdrop(1000, '#bfe3f5', '#eef7fb', '#e8eef2', '#c9d6de'); mountains(); ctx.fillStyle = '#4a8fb0'; ctx.fillRect(0, 980, W, 120); ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.fillRect(0, 1096, W, 10);
  const k = appear(t, VO_AT[2] + 0.1, 0.5); xf(CX, 1650, 0.6 + 0.4 * k, 0, () => { ctx.globalAlpha = k; shadow(CX + 40, 1650, 280); duck(CX + 40, 1650, 3.2, {}); });
  person(190, 1650, 420, 52, { skin: '#c68a62', shirt: '#d9462d', pants: '#3d424f', hat: '#2a3a5a', arm: 'up', wave: t, mouth: 'open', eyes: 'wide' });
  const a = appear(t, T.alaska, 0.35); if (a > 0) xf(CX, 220, a, 0, () => text('ALASKA', CX, 240, 170, 800, '#1b3a52', 'center', -0.02));
  const q = appear(t, T.alaska + 0.6, 0.3); if (q > 0) xf(250, 860, q, 0, () => speech(300, 760, ['A DUCK?!'], { size: 60, tail: [200, 1190] }));
}
function panel(y0, h, t, at, label, sky, ground, art) {
  const k = ease.out(seg(t, at, at + 0.35)); ctx.save(); ctx.beginPath(); ctx.rect(0, y0, W, h); ctx.clip(); ctx.translate((1 - k) * 1100, 0);
  ctx.fillStyle = sky; ctx.fillRect(0, y0, W, h); ctx.fillStyle = ground; ctx.fillRect(0, y0 + h * 0.62, W, h * 0.38); art(y0, h); banner(label, 300, y0 + 90, 70, 'rgba(14,16,28,0.8)'); ctx.restore();
}
function sceneWorld(t) {
  ctx.fillStyle = '#0d5a7a'; ctx.fillRect(0, 0, W, H);
  panel(0, 640, t, VO_AT[3], 'HAWAII', '#f7b267', '#2fa6c4', (y0, h) => { circle(860, y0 + 160, 90, '#fff1b8'); palm(120, y0 + h * 0.66, 360, t, 0.2); duck(620, y0 + h * 0.8, 1.3, { bob: sine(t, 3, 6) }); });
  panel(640, 640, t, VO_AT[3] + 0.9, 'AUSTRALIA', '#8fd0f0', '#c9663a', (y0, h) => { circle(860, y0 + 150, 80, '#ffe28a'); poly([[-40, y0 + h * 0.62], [220, y0 + h * 0.4], [480, y0 + h * 0.62]], '#a8532e'); duck(620, y0 + h * 0.9, 1.3, {}); });
  panel(1280, 640, t, T.arctic, 'ARCTIC', '#cfe3f5', '#e9f4fb', (y0, h) => { poly([[-20, y0 + h * 0.62], [200, y0 + h * 0.3], [420, y0 + h * 0.62]], '#fff'); poly([[600, y0 + h * 0.62], [800, y0 + h * 0.36], [1060, y0 + h * 0.62]], '#f5fbff'); duck(560, y0 + h * 0.92, 1.4, {}); });
}
function sceneScience(t) {
  ctx.fillStyle = '#e9eef2'; ctx.fillRect(0, 0, W, 1250); ctx.fillStyle = '#b8c4cc'; ctx.fillRect(0, 1250, W, 670); ctx.fillStyle = 'rgba(0,0,0,0.08)'; ctx.fillRect(0, 1250, W, 30);
  fillRR(50, 250, 980, 700, 24, '#0d5a7a'); strokeRR(50, 250, 980, 700, 24, '#7a8590', 14); ctx.save(); rr(70, 270, 940, 660, 14); ctx.clip();
  for (let r = 0; r < 4; r++) { ctx.strokeStyle = `rgba(255,255,255,${0.18 + r * 0.05})`; ctx.lineWidth = 8; ctx.beginPath(); ctx.ellipse(540, 600, 120 + r * 95, 70 + r * 52, 0, 0, Math.PI * 2 * (0.7 + 0.05 * r)); ctx.stroke(); }
  const kk = seg(t, T.sci, T.notone); for (let i = 0; i < 9; i++) { const a = i / 9 * 6.28 + t * 0.5 * (i % 2 ? 1 : -1); if (kk > i / 9) duck(540 + Math.cos(a) * (200 + (i % 3) * 90), 640 + Math.sin(a) * (110 + (i % 3) * 55), 0.35, {}); } ctx.restore();
  person(900, 1650, 520, 63, { skin: '#d9a27a', shirt: '#f4f4f4', pants: '#3d424f', glasses: true, arm: 'up', wave: t * 1.5, mouth: 'open', bounce: t * 3 });
  const a = appear(t, T.sci, 0.35), b = appear(t, T.maps, 0.35); if (b > 0) xf(CX, 130, b, 0, () => banner('MAPPING CURRENTS', CX, 130, 70, '#0d4d63')); else if (a > 0) xf(CX, 130, a, 0, () => banner('SCIENTISTS!', CX, 130, 80, '#0d4d63'));
}
function sceneNoOne(t) {
  ocean(t, 800, { sky0: '#a9c7e8', sky1: '#e9eef2' }); const lt = t - T.notone, x = lerp(380, 760, ease.inOut(seg(t, T.notone, T.pivot)));
  duck(x, 1250 + sine(t, 2.2, 10), 3.0, {}); const a = appear(t, T.notone + 0.4, 0.3); if (a > 0) xf(x, 780, a, 0, () => speech(x - 40, 540, ['...'], { size: 110, tail: [x - 20, 1060] }));
  const b = appear(t, T.leaving, 0.35); if (b > 0) xf(CX, 380, b, 0, () => { banner('NO NOTICE GIVEN', CX, 360, 76, '#b3261e'); });
  const c = seg(t, T.leaving + 0.3, T.leaving + 0.6); if (c > 0) withFade(c, () => text('(just drifted)', CX, 480, 44, 800, 'rgba(30,40,60,0.7)', 'center', 0.04));
}
function shopWall() { ctx.fillStyle = '#e9dfd0'; ctx.fillRect(0, 0, W, 1250); ctx.fillStyle = '#9a8a74'; ctx.fillRect(0, 1250, W, 670); fillRR(0, 1180, W, 70, 0, '#cbb99d'); fillRR(380, 260, 220, 300, 8, '#cfe7f3'); strokeRR(380, 260, 220, 300, 8, '#8a7a64', 8); fillRR(700, 260, 220, 300, 8, '#cfe7f3'); strokeRR(700, 260, 220, 300, 8, '#8a7a64', 8); fillRR(30, 300, 250, 900, 10, '#7a5a3a'); fillRR(60, 330, 190, 870, 6, '#cfe7f3'); }
function scenePivot(t, frozen) {
  shopWall(); const k = frozen ? 1 : seg(t, T.pivot, T.brand);
  [0, 1, 2].forEach((i) => { const x = lerp(420 + i * 200, 120 - i * 40, ease.in(clamp(k * 1.3 - i * 0.12))), a = 1 - seg(k, 0.55 + i * 0.1, 0.9 + i * 0.05); if (a > 0.02) { ctx.save(); ctx.globalAlpha = a; person(x, 1640, 440 - i * 20, 70 + i, { dir: -1, bounce: t * 6 + i, shirt: SHIRT[i + 2] }); ctx.restore(); } });
  person(860, 1560, 600, 11, { skin: '#d9a27a', shirt: '#6c8ebf', pants: '#3d424f', glasses: true, arm: 'wave', wave: t, mouth: undefined, noShadow: true }); fillRR(620, 1270, 460, 650, 0, '#7a5a3a'); fillRR(620, 1270, 460, 30, 0, '#a07852');
  const b = appear(t, T.drift, 0.35); if (b > 0 && !frozen) xf(CX, 1000, b, 0, () => banner('QUIETLY.', 300, 1000, 90, '#2a3a5a'));
}
const CLIENTS = [['Priya S.', 92, 'HEALTHY', LGREEN], ['Marcus T.', 76, 'HEALTHY', LGREEN], ['Ava R.', 54, 'NEEDS ATTENTION', LAMBER], ['Jordan K.', 38, 'AT RISK', LRED], ['Dana L.', 31, 'AT RISK', LRED]];
function healthPhone(t) {
  [['2', 'Healthy', LGREEN], ['1', 'Needs attention', LAMBER], ['2', 'At risk', LRED]].forEach(([n, l, c], i) => { const e = pop(t, T.brand + 0.5 + i * 0.12, 0.3); if (e > 0) xf(110 + i * 200, 70, clamp(e), 0, () => { lcard(20 + i * 196, 24, 184, 100, 18); ltext(n, 112 + i * 196, 60, 40, 800, c, 'center'); ltext(l, 112 + i * 196, 100, 17, 700, LMUTED, 'center'); }); });
  lcard(20, 150, 580, 700, 24);
  CLIENTS.forEach(([n, s, st, c], i) => { const e = ease.out(seg(t, T.health + i * 0.16, T.health + 0.3 + i * 0.16)), y = 220 + i * 128; withFade(e, () => { if (i) { ctx.fillStyle = LLINE; ctx.fillRect(48, y - 64, 524, 2); }
    const hot = st === 'AT RISK' && t > T.spot + 0.3; if (hot) fillRR(32, y - 58, 556, 118, 18, rgba(LRED, 0.08 + 0.05 * Math.sin(t * 6)));
    circle(80, y, 32, '#ffd23f'); circle(94, y - 14, 15, '#ffd23f'); poly([[104, y - 14], [124, y - 8], [104, y - 4]], '#ff8a1f'); circle(98, y - 18, 3.5, '#1b1f27'); ellipse(74, y + 8, 18, 12, '#f2b705');
    ltext(n, 130, y - 14, 28, 800); ltext(st, 130, y + 24, 17, 800, c); ltext(String(s), 560, y, 52, 800, c, 'right'); }); });
  const r = pop(t, T.wash, 0.35); if (r > 0) xf(310, 780, clamp(r), 0, () => { fillRR(60, 748, 500, 76, 38, INK); lcheck(112, 786, 20, LGREEN); ltext('Reach out before they go', 148, 787, 26, 800, '#fff'); });
}
const SCENES = [[0, T.track, sceneShip], [T.track, VO_AT[2], sceneTrack], [VO_AT[2], T.hawaii, sceneAlaska], [T.hawaii, T.sci, sceneWorld], [T.sci, T.notone, sceneScience], [T.notone, T.pivot, sceneNoOne], [T.pivot, T.brand, (t) => scenePivot(t, false)],
  [T.brand, T.offer, (t) => { scenePivot(t, true); phoneOver(t, T.brand, T.offer, healthPhone); }], [T.offer, 999, (t) => { sceneDrift(t, 0); offerStrip(t, T.offer + 0.1); }]];
cue(0.4, 'swish', 0.7); cue(1.0, 'punch', 0.9); cue(T.fell, 'transition', 0.8); cue(T.track, 'punch', 0.9); cue(T.alaska, 'ding', 0.9); cue(T.alaska + 0.6, 'tap', 0.8); cue(T.hawaii, 'swish', 0.7); cue(VO_AT[3] + 0.9, 'swish', 0.7); cue(T.arctic, 'swish', 0.7); cue(T.sci, 'punch', 0.8); cue(T.maps, 'ding', 0.8);
cue(T.notone + 0.4, 'tap', 0.8); cue(T.leaving, 'punch', 1); cue(T.pivot, 'swish', 0.7); cue(T.drift, 'punch', 0.8); cue(T.brand, 'swoosh', 0.7); for (let i = 0; i < 5; i++) cue(T.health + i * 0.16, 'key', 0.5); cue(T.wash, 'ding', 1); cue(T.offer + 0.1, 'ding', 0.9); cue(T.url, 'tap', 0.8);
boot({ duration: DURATION, scenes: SCENES, brandAt: 999 }, 'ducks');
