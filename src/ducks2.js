// MsgHealth · "The ducks" v2 · "stay in the story" vertical ad (1080 × 1920, 30 fps), built on kit.js + story-kit.js + soft-kit.js.
// Same real story as ducks.js (1992: about 28,000 bath toys lost in the Pacific, later washing up in Alaska, Hawaii, Australia and
// the Arctic, used by scientists to map ocean currents). INVENTED: "duck number fourteen" never said a word, it just drifted off.
// Format change for retention: no pivot line, no "your customers" voice, no product section. A numbered duck is the thing to watch,
// and the product is a one-line joke inside the story: a small MsgHealth card flags "Duck #14: at risk" (client health scoring).
// The only ad element is a small end tag after the payoff. Card text and score are illustrative. Voiceover: assets/audio/ducks2.
'use strict';
const word = (l, k) => VO_AT[l] + VO_CLIPS[l].chunks[k][1];
const T = {
  hero: word(0, 2), track: VO_AT[1], p0: word(2, 1), p1: word(2, 2), p2: word(2, 2) + 0.9, sci: VO_AT[3], maps: word(3, 1), twist: VO_AT[4], drifted: word(4, 1), flag: VO_AT[5], risk: word(5, 1), luck: VO_AT[6], bye: word(6, 1),
};
T.tag = T.luck + 0.6;
const DURATION = +(VO_AT[6] + VO_CLIPS[6].dur + 2.4).toFixed(2);
window.CUES = T; window.SFX = []; const cue = (t, kind, gain) => window.SFX.push({ t, kind, gain });
window.MUSIC = { bpm: 108, root: 48, brandAt: 999, mood: 'bouncy' };

function hero(x, y, s, t, o = {}) { // duck number fourteen: a numbered duck with a pulsing ring so viewers can spot it
  const d = o.dir ?? 1; if (o.ring !== false) { const p = 0.5 + 0.5 * Math.sin(t * 6); ring(x, y - 60 * s, 92 * s + p * 8, rgba('#e0392d', 0.85), 5); }
  duck(x, y, s, o); circle(x - 8 * s * d, y - 36 * s, 24 * s, '#e0392d'); text('14', x - 8 * s * d, y - 35 * s, 26 * s, 800, '#fff', 'center', 0);
}
function ship(t, tilt) {
  ocean(t, 700); const y = 1150; ctx.save(); ctx.translate(500, y); ctx.rotate(tilt); ctx.translate(-500, -y);
  const cols = ['#d9462d', '#2a6bd9', '#f2b441', '#2f8a54', '#8a5fd0'];
  for (let r = 0; r < 3; r++) for (let c = 0; c < 5; c++) fillRR(150 + c * 130, 880 + r * 72 - 0, 124, 68, 4, cols[(c + r * 2) % 5]);
  fillRR(800, 820, 150, 280, 6, '#e9e2d0'); fillRR(820, 850, 110, 40, 4, '#8fc3e8'); fillRR(120, 1090, 860, 40, 4, '#7a1f2a'); poly([[80, 1130], [1000, 1130], [940, 1230], [150, 1230]], '#22304a'); ctx.restore();
  ctx.fillStyle = 'rgba(47,166,196,0.55)'; ctx.fillRect(0, 1190, W, 60);
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

function sceneShip(t) {
  const k = seg(t, 1.0, 1.8); ship(t, -0.05 * ease.out(k));
  for (let i = 0; i < 34; i++) { const tt = t - (1.0 + hash(i) * 0.9); if (tt < 0) continue; const x0 = 280 + hash(i + 3) * 500, vx = (hash(i + 5) - 0.5) * 260, wy = 1270 + hash(i + 7) * 330; let y = 880 - 240 * tt + 700 * tt * tt; if (y >= wy) y = wy + sine(t + i, 3, 5); duck(x0 + vx * Math.min(tt, 1.6), y, 0.34 + (wy - 1270) / 1600, { dir: i % 2 ? 1 : -1 }); }
  const h = appear(t, T.hero, 0.4); if (h > 0) xf(820, 1360, h, 0, () => hero(820, 1360, 0.9, t, {}));
  withFade(seg(t, 0.1, 0.4), () => text('1992', CX, 210, 190, 800, '#0d4d63', 'center', -0.03));
  const b = appear(t, 0.8, 0.35); if (b > 0) xf(CX, 450, b, 0, () => banner('28,000 BATH TOYS', CX, 450, 84, '#0d4d63')); const c = appear(t, T.hero, 0.35); if (c > 0) xf(CX, 640, c, 0, () => banner('WATCH DUCK #14', CX, 640, 64, '#b3261e'));
}
function sceneDrift(t, k0 = T.track) {
  ocean(t, 700); const k = ease.out(seg(t, k0, k0 + 2.6));
  for (let i = 0; i < 46; i++) { const dx = 60 + hash(i) * 960, dy = 820 + hash(i + 9) * 880, s = 0.3 + (dy - 800) / 1700; duck(lerp(CX, dx, k), lerp(1250, dy, k) + sine(t + i, 2.5, 6), s, { dir: i % 2 ? 1 : -1 }); }
  hero(lerp(CX, 800, k), lerp(1250, 1360, k) + sine(t, 2.5, 6), 0.8, t);
}
function sceneTrack(t) {
  sceneDrift(t); const b = appear(t, T.track, 0.35); if (b > 0) xf(CX, 420, b, 0, () => { ring(CX - 20, 330, 70, '#0d4d63', 14); line(CX + 32, 382, CX + 100, 450, '#0d4d63', 18); crossOut(CX - 20, 330, 110, '#e0392d', 18); banner('NOBODY TRACKING', CX, 580, 76, '#0d4d63'); });
}
function sceneWorld(t) {
  ctx.fillStyle = '#0d5a7a'; ctx.fillRect(0, 0, W, H);
  panel(0, 640, t, T.p0, 'ALASKA', '#bfe3f5', '#e8eef2', (y0, h) => { poly([[-40, y0 + h * 0.62], [220, y0 + h * 0.22], [480, y0 + h * 0.62]], '#cfd9e3'); poly([[300, y0 + h * 0.62], [640, y0 + h * 0.12], [1000, y0 + h * 0.62]], '#dfe8ef'); hero(640, y0 + h * 0.92, 1.2, t, { ring: true }); });
  panel(640, 640, t, T.p1, 'HAWAII', '#f7b267', '#2fa6c4', (y0, h) => { circle(860, y0 + 160, 90, '#fff1b8'); palm(120, y0 + h * 0.66, 360, t, 0.2); hero(640, y0 + h * 0.9, 1.2, t, { bob: sine(t, 3, 6) }); });
  panel(1280, 640, t, T.p2, 'AUSTRALIA', '#8fd0f0', '#c9663a', (y0, h) => { circle(860, y0 + 150, 80, '#ffe28a'); poly([[-40, y0 + h * 0.62], [220, y0 + h * 0.4], [480, y0 + h * 0.62]], '#a8532e'); hero(640, y0 + h * 0.92, 1.2, t, {}); });
}
function sceneScience(t) {
  ctx.fillStyle = '#e9eef2'; ctx.fillRect(0, 0, W, 1250); ctx.fillStyle = '#b8c4cc'; ctx.fillRect(0, 1250, W, 670); ctx.fillStyle = 'rgba(0,0,0,0.08)'; ctx.fillRect(0, 1250, W, 30);
  fillRR(50, 250, 980, 700, 24, '#0d5a7a'); strokeRR(50, 250, 980, 700, 24, '#7a8590', 14); ctx.save(); rr(70, 270, 940, 660, 14); ctx.clip();
  for (let r = 0; r < 4; r++) { ctx.strokeStyle = `rgba(255,255,255,${0.18 + r * 0.05})`; ctx.lineWidth = 8; ctx.beginPath(); ctx.ellipse(540, 600, 120 + r * 95, 70 + r * 52, 0, 0, Math.PI * 2 * (0.7 + 0.05 * r)); ctx.stroke(); }
  const kk = seg(t, T.sci, T.twist); for (let i = 0; i < 9; i++) { const a = i / 9 * 6.28 + t * 0.5 * (i % 2 ? 1 : -1), x = 540 + Math.cos(a) * (200 + (i % 3) * 90), y = 640 + Math.sin(a) * (110 + (i % 3) * 55); if (kk > i / 9) { if (i === 4) hero(x, y + 30, 0.42, t, {}); else duck(x, y, 0.35, {}); } } ctx.restore();
  person(900, 1650, 520, 63, { skin: '#d9a27a', shirt: '#f4f4f4', pants: '#3d424f', glasses: true, arm: 'up', wave: t * 1.5, mouth: 'open', bounce: t * 3 });
  const a = appear(t, T.sci, 0.35), b = appear(t, T.maps, 0.35); if (b > 0) xf(CX, 130, b, 0, () => banner('MAPPING CURRENTS', CX, 130, 70, '#0d4d63')); else if (a > 0) xf(CX, 130, a, 0, () => banner('SCIENTISTS!', CX, 130, 80, '#0d4d63'));
}
function sceneNoOne(t) {
  ocean(t, 800, { sky0: '#a9c7e8', sky1: '#e9eef2' }); const x = lerp(380, 700, ease.inOut(seg(t, T.twist, T.flag)));
  hero(x, 1280 + sine(t, 2.2, 10), 2.8, t, { ring: false }); const a = appear(t, T.twist + 0.5, 0.3); if (a > 0) xf(x, 780, a, 0, () => speech(x - 40, 560, ['...'], { size: 110, tail: [x - 20, 1060] }));
  const b = appear(t, T.drifted, 0.35); if (b > 0) xf(CX, 380, b, 0, () => banner('NO NOTICE GIVEN', CX, 360, 76, '#b3261e'));
}
function sceneFlag(t) {
  ocean(t, 800, { sky0: '#a9c7e8', sky1: '#e9eef2' }); hero(700 + sine(t, 1.4, 20), 1400 + sine(t, 2.2, 10), 2.6, t, { ring: false });
  cameo(t, T.flag + 0.5, 999, CX, 560, 700, 250, () => { const hot = t > T.risk;
    circle(70, 125, 38, '#ffd23f'); circle(88, 108, 17, '#ffd23f'); poly([[100, 108], [124, 114], [100, 120]], '#ff8a1f'); circle(94, 104, 4, '#1b1f27'); circle(46, 140, 14, '#e0392d'); ltext('Duck #14', 130, 105, 32, 800); ltext('last seen: drifting', 130, 142, 22, 500, LMUTED);
    ltag(660, 105, hot ? 'AT RISK' : 'CHECKING…', hot ? LRED : LAMBER, 19); ltext(hot ? '31' : '--', 660, 180, 60, 800, hot ? LRED : LMUTED, 'right'); ctx.fillStyle = LLINE; ctx.fillRect(30, 200, 640, 2); ltext('Health score', 30, 226, 20, 700, LMUTED); });
}
function sceneBye(t) {
  ocean(t, 800, { sky0: '#f7b267', sky1: '#fbe0a8', s0: '#2f8fb0', s1: '#0d4d6a' }); circle(780, 760, 110, '#fff1b8'); const k = ease.inOut(seg(t, T.luck, VO_AT[6] + VO_CLIPS[6].dur + 1.4));
  hero(lerp(540, 790, k), lerp(1400, 900, k), lerp(2.4, 0.5, k), t, { ring: k < 0.7 }); endTag(t, T.tag);
}
const SCENES = [[0, T.track, sceneShip], [T.track, T.p0 - 0.6, sceneTrack], [T.p0 - 0.6, T.sci, sceneWorld], [T.sci, T.twist, sceneScience], [T.twist, T.flag, sceneNoOne], [T.flag, T.luck, sceneFlag], [T.luck, 999, sceneBye]];
cue(0.35, 'swish', 0.7); cue(0.8, 'punch', 0.9); cue(T.hero, 'ding', 1); cue(T.track, 'punch', 0.9); [T.p0, T.p1, T.p2].forEach((x) => cue(x, 'swish', 0.7)); cue(T.sci, 'punch', 0.8); cue(T.maps, 'ding', 0.8); cue(T.twist + 0.5, 'tap', 0.8); cue(T.drifted, 'punch', 1);
cue(T.flag + 0.5, 'notification', 1); cue(T.risk, 'ding', 1); cue(T.luck, 'swoosh', 0.7); cue(T.tag, 'tap', 0.8);
boot({ duration: DURATION, scenes: SCENES, brandAt: 999 }, 'ducks2');
