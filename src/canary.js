// MsgHealth · "The canary" · 36 s vertical social ad (1080 × 1920, 30 fps).
// Built like a "did you know" short: a flat-vector story with one-phrase captions, then a turn into the
// product. Act 1 (0–15 s): for 75 years coal miners took a canary to work; a deadly gas could build up with
// no smell and no colour, the canary felt it first, and when it stopped singing the miners got out. Act 2
// (15–36 s): your customers go quiet before they leave too. MsgHealth hears the silence: it scores every
// customer's health, flags who's at risk, texts them for you, and they book again. End card: msghealth.net.
// The voiceover is assets/audio/canary/vo-NN.wav (timed by VO_AT below); captions follow it chunk by chunk.
'use strict';

const W = 1080, H = 1920, DURATION = 36.0;
const C = BRAND.colors;
const FONT = 'Inter';

// When each voiceover clip starts (film seconds). Clip lengths and caption chunks are in src/canary-vo.js.
const VO_AT = [0.25, 3.95, 5.0, 9.25, 10.95, 13.95, 15.55, 17.35, 19.5, 20.75, 22.6, 26.0, 28.35, 29.7, 32.8];
const word = (line, k) => VO_AT[line] + VO_CLIPS[line].chunks[k][1]; // when a caption chunk is spoken
// Story beats, all read off the voiceover so picture and sound stay locked to it.
const T = {
  bird: word(0, 2), canary: VO_AT[1], deep: VO_AT[2], gas: word(2, 1), build: word(2, 2), smell: word(2, 3), color: word(2, 4),
  first: VO_AT[3], feels: word(3, 1), when: VO_AT[4], stop: word(4, 1), miners: word(4, 2), out: word(4, 3), late: VO_AT[5],
  pivot: 15.2, quiet: word(6, 1), booking: VO_AT[7], replying: word(7, 1), gone: VO_AT[8],
  brand: VO_AT[9], hears: word(9, 1), scores: VO_AT[10], every: word(10, 1), flags: word(10, 2), risk: word(10, 3),
  texts: VO_AT[11], foryou: word(11, 1), before: word(11, 2), again: VO_AT[12],
  guess: VO_AT[13], yourc: word(13, 1), plan: word(13, 2), end: 32.6, url: VO_AT[14], tap: 34.3,
};
window.CUES = T;
window.VO = VO_AT.map((at, i) => ({ at, file: `assets/audio/canary/vo-${String(i).padStart(2, '0')}.wav`, dur: VO_CLIPS[i].dur }));
window.SFX = []; // sample cues { t, kind, gain? }, read by scripts/canary-audio.mjs
const cue = (t, kind, gain) => window.SFX.push({ t, kind, gain });

let ctx = null, MAIN = null, LOGO = null, HAND = null;

// ── maths ────────────────────────────────────────────────────────────────────
const clamp = (v, a = 0, c = 1) => Math.max(a, Math.min(c, v));
const lerp = (a, c, t) => a + (c - a) * t;
const seg = (t, a, c) => clamp((t - a) / (c - a));
const ease = {
  out: (t) => 1 - Math.pow(1 - t, 3),
  quint: (t) => 1 - Math.pow(1 - t, 5),
  inOut: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  in: (t) => t * t * t,
  back: (t) => { const c = 1.9; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); },
};
const hash = (n) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
function rgba(hex, a) { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; }

// ── drawing primitives ───────────────────────────────────────────────────────
function rr(x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }
function fillRR(x, y, w, h, r, col) { rr(x, y, w, h, r); ctx.fillStyle = col; ctx.fill(); }
function strokeRR(x, y, w, h, r, col, lw = 2) { rr(x, y, w, h, r); ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.stroke(); }
function font(size, weight = 600, track = -0.02) { ctx.font = `${weight} ${size}px ${FONT}`; ctx.letterSpacing = `${(size * track).toFixed(2)}px`; }
function text(s, x, y, size, weight, color, align = 'left', track) {
  font(size, weight, track ?? (size >= 40 ? -0.03 : -0.005));
  ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.fillStyle = color; ctx.fillText(s, x, y);
}
function tw(s, size, weight = 600, track) { font(size, weight, track ?? (size >= 40 ? -0.03 : -0.005)); return ctx.measureText(s).width; }
function circle(x, y, r, col) { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = col; ctx.fill(); }
function ellipse(x, y, rx, ry, col, rot = 0) { ctx.beginPath(); ctx.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2); ctx.fillStyle = col; ctx.fill(); }
function poly(pts, col) { ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.fillStyle = col; ctx.fill(); }
function glow(x, y, r, col, a) {
  if (a <= 0.003) return;
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, rgba(col, a)); g.addColorStop(1, rgba(col, 0));
  ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2);
}
function check(x, y, s, col = '#fff', lw = 4) {
  ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(x - s * 0.45, y); ctx.lineTo(x - s * 0.12, y + s * 0.34); ctx.lineTo(x + s * 0.5, y - s * 0.36); ctx.stroke();
}
// A music note drawn as shapes (no font glyph needed). s = size, a = alpha.
function note(x, y, s, col, a, double = false) {
  if (a <= 0.01) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = col; ctx.strokeStyle = col; ctx.lineWidth = s * 0.14; ctx.lineCap = 'round';
  const heads = double ? [[x - s * 0.55, y + s * 0.08], [x + s * 0.55, y - s * 0.12]] : [[x, y]];
  heads.forEach(([hx, hy]) => { ctx.beginPath(); ctx.ellipse(hx, hy, s * 0.3, s * 0.22, -0.4, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.moveTo(hx + s * 0.26, hy); ctx.lineTo(hx + s * 0.26, hy - s); ctx.stroke(); });
  if (double) { ctx.lineWidth = s * 0.2; ctx.beginPath(); ctx.moveTo(heads[0][0] + s * 0.26, heads[0][1] - s); ctx.lineTo(heads[1][0] + s * 0.26, heads[1][1] - s); ctx.stroke(); }
  else { ctx.beginPath(); ctx.moveTo(x + s * 0.26, y - s); ctx.quadraticCurveTo(x + s * 0.75, y - s * 0.7, x + s * 0.6, y - s * 0.35); ctx.stroke(); }
  ctx.restore();
}

// ═════════════════════════════════════════════════════════════════════════════
// ACT 1 · the mine (flat vector, a cross-section of the ground)
// ═════════════════════════════════════════════════════════════════════════════
const SURF = 700, TUN_T = 2560, TUN_B = 2960, SHAFT = [150, 310];
const M = { // palette
  sky0: '#7cc0ec', sky1: '#cbe8f8', cloud: '#ffffff', hill0: '#9ccb6c', hill1: '#80b457', grass: '#6ea84a',
  soil: ['#c98a4b', '#b4743e', '#995c33', '#7e482a', '#663923', '#55301f', '#4a291b'],
  coal: '#2b2220', wall: '#3a271e', wallDeep: '#2a1b14', floor: '#22160f',
  wood: '#a06a3a', woodDk: '#7a4b28', lamp: '#ffcf6b', iron: '#4b4f57', ironLt: '#6d727c',
  skin: '#e9b48e', skinDk: '#cf9672', overall: '#3e5c86', overallDk: '#2f486c', shirt: '#c9573f', boot: '#2a2220', helmet: '#f2b134', helmetDk: '#d08f1d',
  bird: '#ffd23f', birdDk: '#f0b21c', beak: '#f08a24', brass: '#c9a14a', brassDk: '#9b7a30',
};
// Strata boundaries: wavy horizontal bands from the surface down past the tunnel.
const BANDS = [SURF + 34, 980, 1300, 1640, 1980, 2300, 3200, 5200];
function bandEdge(k, x) { return BANDS[k] + Math.sin(x * 0.006 + k * 1.7) * 22 + Math.sin(x * 0.017 + k) * 9; }

function drawSky() {
  const g = ctx.createLinearGradient(0, -700, 0, SURF);
  g.addColorStop(0, M.sky0); g.addColorStop(1, M.sky1);
  ctx.fillStyle = g; ctx.fillRect(-600, -1200, 3000, SURF + 1200);
  circle(1260, 120, 70, '#fff3c4'); glow(1260, 120, 260, '#fff3c4', 0.5);
  const cloud = (x, y, s) => { [[0, 0, 60], [55, -22, 52], [110, 0, 58], [-50, 8, 42], [160, 10, 40]].forEach(([dx, dy, r]) => circle(x + dx * s, y + dy * s, r * s, M.cloud)); ctx.fillRect(x - 90 * s, y, 290 * s, 50 * s); };
  cloud(240, 160, 0.9); cloud(880, 300, 0.7); cloud(1500, 60, 1);
  // rolling hills
  [[M.hill0, 560, 0.004, 70], [M.hill1, 630, 0.006, 50]].forEach(([col, y, f, a]) => {
    ctx.beginPath(); ctx.moveTo(-600, SURF + 10);
    for (let x = -600; x <= 2400; x += 40) ctx.lineTo(x, y + Math.sin(x * f + y) * a);
    ctx.lineTo(2400, SURF + 10); ctx.closePath(); ctx.fillStyle = col; ctx.fill();
  });
}
function drawHeadframe() {
  // the winding tower over the shaft, a little shed and a coal heap
  const cx = (SHAFT[0] + SHAFT[1]) / 2, top = SURF - 420;
  ctx.strokeStyle = '#5b3d30'; ctx.lineWidth = 16; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(SHAFT[0] - 30, SURF); ctx.lineTo(cx - 14, top); ctx.moveTo(SHAFT[1] + 30, SURF); ctx.lineTo(cx + 14, top);
  ctx.moveTo(cx + 14, top + 30); ctx.lineTo(SHAFT[1] + 190, SURF); ctx.stroke();
  ctx.lineWidth = 8; [0.3, 0.55, 0.8].forEach((k) => { const y = lerp(top, SURF, k), dx = lerp(14, 180 / 2 + 30, k); ctx.beginPath(); ctx.moveTo(cx - dx, y); ctx.lineTo(cx + dx, y); ctx.stroke(); });
  circle(cx, top, 46, '#5b3d30'); circle(cx, top, 30, M.sky1); circle(cx, top, 9, '#5b3d30');
  ctx.strokeStyle = '#3b2a22'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx - 30, top); ctx.lineTo(cx - 30, SURF); ctx.stroke();
  fillRR(520, SURF - 150, 220, 150, 6, '#b8553c'); poly([[505, SURF - 150], [630, SURF - 225], [755, SURF - 150]], '#8f3f2c');
  fillRR(600, SURF - 80, 50, 80, 4, '#5b2f22'); fillRR(545, SURF - 120, 36, 32, 4, '#ffe2a0'); fillRR(680, SURF - 120, 36, 32, 4, '#ffe2a0');
  poly([[900, SURF], [990, SURF - 90], [1060, SURF - 70], [1150, SURF]], M.coal); poly([[960, SURF], [1030, SURF - 50], [1100, SURF]], '#3b302c');
}
function drawGround() {
  ctx.fillStyle = M.grass; ctx.fillRect(-600, SURF - 6, 3000, 50);
  for (let k = 0; k < BANDS.length - 1; k++) {
    ctx.beginPath(); ctx.moveTo(-600, bandEdge(k, -600));
    for (let x = -600; x <= 2400; x += 30) ctx.lineTo(x, bandEdge(k, x));
    ctx.lineTo(2400, 5200); ctx.lineTo(-600, 5200); ctx.closePath(); ctx.fillStyle = M.soil[k]; ctx.fill();
  }
  // a coal seam above the tunnel, and pebbles scattered through the layers
  ctx.beginPath(); ctx.moveTo(-600, 2160);
  for (let x = -600; x <= 2400; x += 30) ctx.lineTo(x, 2160 + Math.sin(x * 0.008) * 14);
  for (let x = 2400; x >= -600; x -= 30) ctx.lineTo(x, 2215 + Math.sin(x * 0.008 + 1) * 12);
  ctx.closePath(); ctx.fillStyle = M.coal; ctx.fill();
  for (let i = 0; i < 160; i++) {
    const x = -500 + hash(i) * 2800, y = SURF + 80 + hash(i + 50) * 2500;
    if (y > TUN_T - 40 && y < TUN_B + 40 && x > 0) continue;
    const k = BANDS.findIndex((b, j) => y < bandEdge(j, x)) - 1;
    ellipse(x, y, 10 + hash(i + 9) * 18, 7 + hash(i + 3) * 10, rgba('#000000', 0.12), hash(i) * 3);
    ellipse(x - 3, y - 3, 6 + hash(i + 9) * 10, 4 + hash(i + 3) * 6, rgba('#ffffff', k < 2 ? 0.1 : 0.05), hash(i) * 3);
  }
  // the shaft
  ctx.fillStyle = M.wallDeep; ctx.fillRect(SHAFT[0], SURF - 4, SHAFT[1] - SHAFT[0], TUN_B - SURF + 4);
  ctx.fillStyle = M.woodDk; for (let y = SURF + 60; y < TUN_T; y += 160) ctx.fillRect(SHAFT[0], y, SHAFT[1] - SHAFT[0], 16);
  ctx.fillStyle = M.wood; ctx.fillRect(SHAFT[0] - 10, SURF - 4, 12, TUN_T - SURF); ctx.fillRect(SHAFT[1] - 2, SURF - 4, 12, TUN_T - SURF);
}
function drawTunnel(t) {
  // the gallery: rough ceiling and floor, timber sets, lanterns, rails
  ctx.beginPath(); ctx.moveTo(SHAFT[0], TUN_T + 10);
  for (let x = SHAFT[0]; x <= 2400; x += 40) ctx.lineTo(x, TUN_T + Math.sin(x * 0.05) * 7 + hash(Math.floor(x / 40)) * 12);
  ctx.lineTo(2400, TUN_B + 30); ctx.lineTo(SHAFT[0], TUN_B + 30); ctx.closePath();
  const g = ctx.createLinearGradient(0, TUN_T, 0, TUN_B); g.addColorStop(0, M.wallDeep); g.addColorStop(0.55, M.wall); g.addColorStop(1, '#46301f');
  ctx.fillStyle = g; ctx.fill();
  ctx.fillStyle = M.floor; ctx.fillRect(SHAFT[0], TUN_B - 8, 2400, 60);
  ctx.fillStyle = M.soil[6]; ctx.fillRect(-600, TUN_B + 52, 3000, 2400);
  for (let i = 0; i < 40; i++) { const x = SHAFT[1] + hash(i + 200) * 2000, y = TUN_T + 60 + hash(i + 300) * 280; ellipse(x, y, 14 + hash(i) * 20, 8 + hash(i + 1) * 10, rgba('#000000', 0.14)); }
  for (let x = 480; x < 2400; x += 360) {
    const lit = 0.85 + 0.15 * Math.sin(t * 9 + x);
    glow(x + 120, TUN_T + 120, 260, M.lamp, 0.18 * lit);
    ctx.fillStyle = M.woodDk; ctx.fillRect(x - 6, TUN_T, 30, TUN_B - TUN_T);
    ctx.fillStyle = M.wood; ctx.fillRect(x - 14, TUN_T, 26, TUN_B - TUN_T);
    ctx.fillRect(x - 40, TUN_T - 4, 340, 30); ctx.fillStyle = M.woodDk; ctx.fillRect(x - 40, TUN_T + 22, 340, 6);
    // a lantern hanging from the cap beam
    const lx = x + 130; ctx.strokeStyle = '#1d1410'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(lx, TUN_T + 26); ctx.lineTo(lx, TUN_T + 66); ctx.stroke();
    fillRR(lx - 15, TUN_T + 66, 30, 40, 6, rgba(M.lamp, 0.95)); ctx.fillStyle = '#1d1410'; ctx.fillRect(lx - 18, TUN_T + 62, 36, 8); ctx.fillRect(lx - 18, TUN_B - 2000, 0, 0);
    glow(lx, TUN_T + 86, 70, M.lamp, 0.5 * lit);
  }
  // rails
  ctx.fillStyle = '#3a2a20'; for (let x = SHAFT[1]; x < 2400; x += 70) ctx.fillRect(x, TUN_B - 16, 42, 12);
  ctx.fillStyle = M.ironLt; ctx.fillRect(SHAFT[0], TUN_B - 22, 2400, 6);
  // the lift cage at the bottom of the shaft
  ctx.strokeStyle = M.iron; ctx.lineWidth = 6;
  const cy = TUN_B - 300; ctx.strokeRect(SHAFT[0] + 14, cy, SHAFT[1] - SHAFT[0] - 28, 290);
  ctx.beginPath(); for (let x = SHAFT[0] + 40; x < SHAFT[1] - 20; x += 26) { ctx.moveTo(x, cy); ctx.lineTo(x, cy + 290); } ctx.lineWidth = 3; ctx.stroke();
  ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo((SHAFT[0] + SHAFT[1]) / 2 - 30, SURF); ctx.lineTo((SHAFT[0] + SHAFT[1]) / 2 - 30, cy); ctx.stroke();
}

// ── the gas: a cloud rolling in along the gallery, then nearly invisible ─────
// Seen at first in a sickly green so we know it's there; on "no smell, no color" the fill drains away
// until only a shimmering dashed outline is left.
function gasFront(t) { return lerp(2300, 700, ease.out(seg(t, T.gas - 0.3, T.first + 0.6))) - lerp(0, 520, ease.inOut(seg(t, T.out, T.late + 0.8))); }
function drawGas(t) {
  if (t < T.gas - 0.3) return;
  const fill = 0.42 * seg(t, T.gas - 0.3, T.gas + 0.4) * (1 - 0.82 * seg(t, T.smell, T.color + 0.3));
  const line = 0.75 * seg(t, T.smell - 0.2, T.smell + 0.4) * (1 - 0.35 * seg(t, T.color, T.color + 0.5));
  const x0 = gasFront(t);
  ctx.save();
  ctx.beginPath(); ctx.rect(SHAFT[1], TUN_T, 2400, TUN_B - TUN_T); ctx.clip();
  for (let i = 0; i < 26; i++) {
    const bx = x0 + hash(i + 40) * 1800 * (i / 26 + 0.1) + Math.sin(t * 1.3 + i) * 22, by = TUN_T + 60 + hash(i + 11) * 300 + Math.cos(t * 1.1 + i * 2) * 14;
    const r = 70 + hash(i + 7) * 90;
    if (fill > 0.005) { ctx.globalAlpha = fill; circle(bx, by, r, '#a6d96a'); }
    if (line > 0.01) {
      ctx.globalAlpha = line * (0.6 + 0.4 * Math.sin(t * 6 + i));
      ctx.setLineDash([14, 16]); ctx.lineDashOffset = -t * 40; ctx.lineWidth = 4; ctx.strokeStyle = '#e8f6d4';
      ctx.beginPath(); ctx.arc(bx, by, r * 0.9, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
    }
  }
  ctx.restore();
}

// ── the canary in its cage ───────────────────────────────────────────────────
// sing 0–1: beak and notes; sick 0–1: puffed up, eyes closing, swaying; the song stops at T.stop.
function canaryState(t) {
  const sing = t < T.canary - 0.2 ? 0.35 : t < T.first ? 1 : t < T.stop ? lerp(1, 0.25, seg(t, T.first, T.stop)) : t > T.late - 0.4 ? seg(t, T.late - 0.4, T.late + 0.1) : 0;
  const sick = t < T.feels ? 0 : t < T.late - 0.6 ? ease.out(seg(t, T.feels, T.stop)) : 1 - seg(t, T.late - 0.6, T.late);
  return { sing, sick };
}
function drawCage(x, y, t, s = 1) {
  const st = canaryState(t);
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  // hook and dome
  ctx.strokeStyle = M.brassDk; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(0, -78, 10, Math.PI, Math.PI * 2.6); ctx.stroke();
  ctx.fillStyle = M.brass; ctx.beginPath(); ctx.moveTo(-44, -40); ctx.quadraticCurveTo(0, -95, 44, -40); ctx.closePath(); ctx.fill();
  ctx.fillStyle = M.brassDk; ctx.fillRect(-46, -42, 92, 8);
  // the bird (behind the bars)
  const sway = Math.sin(t * 2.6) * 0.18 * st.sick, chirp = st.sing * Math.max(0, Math.sin(t * 22)) * (0.6 + 0.4 * Math.sin(t * 3.1));
  ctx.save(); ctx.translate(0, 18); ctx.rotate(sway);
  ctx.fillStyle = M.brassDk; ctx.fillRect(-30, 18, 60, 5); // perch
  const puff = 1 + st.sick * 0.16;
  poly([[16, 4], [36, 12], [34, 20], [12, 12]], M.birdDk); // tail
  ellipse(0, 0, 21 * puff, 17 * puff, M.bird, -0.2);
  ellipse(4, 2, 12 * puff, 9 * puff, M.birdDk, -0.3); // wing
  const hx = -14, hy = -16 + st.sick * 4 - chirp * 2;
  circle(hx, hy, 13 * puff, M.bird);
  // beak, opening as it sings
  const open = chirp * 0.5;
  poly([[hx - 11, hy - 2], [hx - 24, hy + 1 - open * 8], [hx - 11, hy + 2]], M.beak);
  poly([[hx - 11, hy + 2], [hx - 22, hy + 3 + open * 8], [hx - 11, hy + 5]], '#d9741a');
  // eye: closes as it sickens
  const lid = st.sick * 0.85;
  ctx.fillStyle = '#1b1410'; ctx.beginPath(); ctx.ellipse(hx - 3, hy - 3, 3.2, 3.2 * (1 - lid) + 0.6, 0, 0, Math.PI * 2); ctx.fill();
  ellipse(-8, 18, 2, 4, M.beak); ellipse(2, 18, 2, 4, M.beak); // feet
  ctx.restore();
  // bars and base
  ctx.strokeStyle = M.brass; ctx.lineWidth = 3;
  ctx.beginPath(); for (let bx = -40; bx <= 40; bx += 13.3) { ctx.moveTo(bx, -38); ctx.lineTo(bx, 50); } ctx.stroke();
  fillRR(-50, 48, 100, 14, 4, M.brassDk); fillRR(-46, 44, 92, 8, 3, M.brass);
  ctx.restore();
  // notes float up and away while it sings; in "stopped singing" the last ones fall
  for (let i = 0; i < 9; i++) {
    const born = T.canary - 0.4 + i * 0.75;
    for (let k = 0; k < 2; k++) {
      const b = born + k * 6.1 - 6.1; // keep a few in the air before the close-up too
      if (t < b || b > T.stop + 0.1) continue;
      const age = t - b, life = 2.2, stopped = t > T.stop ? t - T.stop : 0;
      if (age > life && !stopped) continue;
      const p = clamp(age / life), weak = b > T.first ? 0.6 : 1;
      let nx = x - 30 * s - p * 120 * s + Math.sin(age * 4 + i) * 12 * s, ny = y - 30 * s - p * 170 * s * weak;
      let a = Math.sin(Math.PI * p) * weak * (b > T.feels ? 0.7 : 1);
      if (stopped) { ny += stopped * stopped * 900 * s; a *= 1 - seg(stopped, 0, 0.55); }
      note(nx, ny, (22 + (i % 3) * 5) * s, i % 2 ? '#fff6cf' : '#ffe27a', a, i % 3 === 1);
    }
  }
  // a weak note as it perks back up at the surface
  if (t > T.late - 0.2) { const age = t - (T.late - 0.2), p = clamp(age / 1.4); note(x - 34 * s - p * 70 * s, y - 40 * s - p * 120 * s, 26 * s, '#ffe27a', Math.sin(Math.PI * p)); }
}

// ── the miner ────────────────────────────────────────────────────────────────
// Feet at (x, y); dir 1 faces right. phase drives the walk; pose: 'stand' | 'walk' | 'run' | 'lift'
// (holding the cage up). Returns where the cage hangs.
function drawMiner(x, y, dir, phase, pose, t) {
  ctx.save(); ctx.translate(x, y); ctx.scale(dir, 1);
  const run = pose === 'run', moving = pose === 'walk' || run;
  const sw = moving ? Math.sin(phase) * (run ? 0.75 : 0.42) : 0, bob = moving ? Math.abs(Math.sin(phase)) * (run ? 12 : 6) : Math.sin(t * 2) * 1.5;
  const lean = run ? 0.18 : 0;
  ctx.translate(0, -bob); ctx.rotate(lean);
  const leg = (a, col) => { ctx.save(); ctx.translate(0, -120); ctx.rotate(a); ctx.fillStyle = col; ctx.fillRect(-13, 0, 26, 110); fillRR(-14, 102, 44, 20, 8, M.boot); ctx.restore(); };
  leg(-sw, M.overallDk); leg(sw, M.overall);
  // back arm
  ctx.save(); ctx.translate(-4, -205); ctx.rotate(sw * 0.9 + 0.1); ctx.fillStyle = '#a9452f'; ctx.fillRect(-10, 0, 20, 80); circle(0, 84, 11, M.skinDk); ctx.restore();
  // body
  fillRR(-34, -230, 68, 120, 18, M.shirt); fillRR(-30, -175, 60, 70, 10, M.overall);
  ctx.fillStyle = M.overall; ctx.fillRect(-26, -228, 9, 60); ctx.fillRect(17, -228, 9, 60);
  // head
  ctx.save(); ctx.translate(4, -262);
  circle(0, 0, 34, M.skin); ellipse(30, 4, 8, 7, M.skinDk); // nose
  ellipse(18, 18, 16, 6, '#4a3226'); // moustache
  circle(14, -6, 4, '#1b1410');
  ellipse(-24, 2, 7, 10, M.skinDk); // ear
  // helmet with lamp
  ctx.fillStyle = M.helmet; ctx.beginPath(); ctx.arc(0, -8, 38, Math.PI, 0); ctx.fill(); fillRR(-44, -12, 92, 12, 6, M.helmetDk);
  fillRR(28, -36, 16, 18, 4, '#d9d9d9'); circle(44, -27, 6, '#fff8d6');
  ctx.restore();
  ctx.restore();
  // the lamp beam, in world space
  const hx = x + dir * 48, hy = y - bob - 289;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const g = ctx.createLinearGradient(hx, hy, hx + dir * 420, hy + 60); g.addColorStop(0, rgba('#fff3c0', 0.32)); g.addColorStop(1, rgba('#fff3c0', 0));
  ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(hx, hy - 4); ctx.lineTo(hx + dir * 440, hy - 70); ctx.lineTo(hx + dir * 440, hy + 160); ctx.lineTo(hx, hy + 6); ctx.fill();
  ctx.restore();
  // front arm, holding the cage out (or up)
  const { sx, sy, hxx, hyy } = minerHand(x, y, dir, phase, pose, t);
  ctx.save(); ctx.strokeStyle = M.shirt; ctx.lineWidth = 22; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(hxx, hyy); ctx.stroke(); ctx.restore();
  circle(hxx, hyy, 12, M.skin);
  return { x: hxx, y: hyy + 88 }; // the cage's hook sits in the hand
}
function minerHand(x, y, dir, phase, pose, t) {
  const run = pose === 'run', moving = pose === 'walk' || run;
  const sw = moving ? Math.sin(phase) * (run ? 0.75 : 0.42) : 0, bob = moving ? Math.abs(Math.sin(phase)) * (run ? 12 : 6) : Math.sin(t * 2) * 1.5;
  const sx = x + dir * 8, sy = y - bob - 205, ang = pose === 'lift' ? -2.3 : run ? -0.9 - sw * 0.2 : -0.55;
  return { sx, sy, hxx: sx + dir * Math.sin(-ang) * 86, hyy: sy + Math.cos(ang) * 86 };
}
// Where the miner is: walks in, stands with the cage, runs back to the shaft, comes up top.
function minerAt(t) {
  if (t < T.late - 0.05) {
    if (t < T.miners + 0.35) {
      const k = seg(t, 0.2, 2.5), x = lerp(330, 760, ease.inOut(k) * 0.3 + k * 0.7);
      return { x, y: TUN_B - 14, dir: 1, phase: x / 30, pose: k > 0 && k < 1 ? 'walk' : 'stand' };
    }
    const k = seg(t, T.miners + 0.35, T.late - 0.1), x = lerp(760, 200, k);
    return { x, y: TUN_B - 14, dir: -1, phase: t * 17, pose: 'run' };
  }
  const k = seg(t, T.late - 0.05, T.late + 0.4);
  return { x: lerp(330, 470, ease.out(k)), y: SURF + 8, dir: 1, phase: t * 12, pose: k < 1 ? 'walk' : 'lift' };
}

// The camera, in world space: [time, centre x, centre y, zoom]; eased between keys.
const CAM = [
  [0.0, 620, 900, 1.0], [0.9, 620, 900, 1.0], [2.15, 760, 2700, 1.0],
  [T.bird, 800, 2720, 1.05], [T.bird + 0.8, 860, 2760, 2.0], [T.canary, 870, 2770, 2.15], [T.canary + 0.35, 862, 2770, 3.3], [T.deep - 0.05, 862, 2770, 3.45],
  [T.deep + 1.0, 860, 1880, 0.72], [T.gas + 0.15, 900, 2280, 0.85], [T.build + 0.6, 1000, 2740, 1.25], [T.first - 0.1, 960, 2760, 1.35],
  [T.first + 0.35, 865, 2770, 3.2], [T.stop, 862, 2770, 3.45], [T.miners - 0.05, 862, 2770, 3.55], [T.miners + 0.3, 700, 2720, 1.35],
  [T.out + 0.2, 520, 2720, 1.3], [T.late - 0.1, 330, 2700, 1.3], [T.late + 0.3, 480, 560, 1.25], [T.late + 0.9, 540, 520, 1.45],
  [T.pivot - 0.4, 560, 520, 1.6], [T.pivot, 560, 520, 6.0],
];
function camAt(t, track) {
  let i = CAM.findIndex((k) => k[0] > t);
  if (i < 0) return { x: CAM.at(-1)[1], y: CAM.at(-1)[2], z: CAM.at(-1)[3], v: 0 };
  if (i === 0) return { x: CAM[0][1], y: CAM[0][2], z: CAM[0][3], v: 0 };
  const a = CAM[i - 1], b = CAM[i], k = ease.inOut(seg(t, a[0], b[0]));
  const z = Math.exp(lerp(Math.log(a[3]), Math.log(b[3]), k));
  return { x: lerp(a[1], b[1], k), y: lerp(a[2], b[2], k), z };
}
function mineScene(t) {
  const c0 = camAt(t), c1 = camAt(t + 1 / 30);
  // during the canary close-ups the camera follows the cage rather than a fixed point
  // In the close-ups (zoom > 2) the camera frames the cage, a little left of it for the notes, above the caption.
  const m = minerAt(t), hp = minerHand(m.x, m.y, m.dir, m.phase, m.pose, t), cage = { x: hp.hxx - 30, y: hp.hyy + 88 + 40 / c0.z };
  const f = t < T.late ? ease.inOut(clamp((c0.z - 1.6) / 1.2)) : 0;
  const cx = lerp(c0.x, cage.x, f), cy = lerp(c0.y, cage.y, f);
  const speed = Math.hypot(c1.x - c0.x, c1.y - c0.y) * c0.z + Math.abs(Math.log(c1.z / c0.z)) * 900;
  ctx.save();
  if (speed > 40) ctx.filter = `blur(${Math.min(12, (speed - 40) / 14).toFixed(1)}px)`;
  ctx.translate(W / 2, H / 2); ctx.scale(c0.z, c0.z); ctx.translate(-cx, -cy);
  drawSky(); drawHeadframe(); drawGround(); drawTunnel(t);
  drawGas(t);
  const hand = drawMiner(m.x, m.y, m.dir, m.phase, m.pose, t);
  drawCage(hand.x, hand.y, t, m.pose === 'lift' ? 1.05 : 1);
  if (m.pose === 'run') { // speed lines
    ctx.strokeStyle = 'rgba(255,240,200,0.35)'; ctx.lineWidth = 5; ctx.lineCap = 'round';
    for (let i = 0; i < 5; i++) { const ly = m.y - 60 - i * 50, lx = m.x + 70 + hash(i + Math.floor(t * 12)) * 60; ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(lx + 90, ly); ctx.stroke(); }
  }
  if (t > T.late) { // the gas fills the gallery below; a little dust as they come out
    for (let i = 0; i < 8; i++) { const p = seg(t, T.late + i * 0.03, T.late + 0.8 + i * 0.03); ellipse(330 + (i - 4) * 30 * (1 + p), SURF + 4 - p * 30, 30 * (1 + p), 14, rgba('#d9c3a3', 0.5 * (1 - p))); }
  }
  ctx.restore();
  // whiteout into the canary at the pivot
  const flash = seg(t, T.pivot - 0.25, T.pivot);
  if (flash > 0) { ctx.fillStyle = rgba('#000000', flash); ctx.fillRect(0, 0, W, H); }
}

// ═════════════════════════════════════════════════════════════════════════════
// ACT 2 · MsgHealth (black, a faint grid, brand indigo)
// ═════════════════════════════════════════════════════════════════════════════
const IN = { hi: '#c7c3ff', mid: '#a5a0ff', deep: '#7168ff' };
const MUTED = 'rgba(235,235,245,0.5)', SOFT = 'rgba(235,235,245,0.72)';
const RED = C.risk, GREEN = C.healthy, AMBER = C.attention;
const CX = 540, CARD = { x: 100, w: 880 };

function stage(t, glowA = 0.22) {
  ctx.fillStyle = '#050508'; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(255,255,255,0.035)'; ctx.lineWidth = 1;
  ctx.beginPath(); for (let x = 0; x <= W; x += 60) { ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, H); } for (let y = 0; y <= H; y += 60) { ctx.moveTo(0, y + 0.5); ctx.lineTo(W, y + 0.5); } ctx.stroke();
  glow(CX, 860, 720, C.primary, glowA);
}
// A scene fades up out of a blur and leaves the same way.
function enter(t, at, out, d = 0.35) {
  const pin = ease.quint(seg(t, at, at + d)), pout = ease.in(seg(t, out - 0.25, out));
  return { a: pin * (1 - pout), blur: (1 - pin) * 10 + pout * 10, dy: (1 - pin) * 40 - pout * 30 };
}
function withFade(f, draw) {
  if (f.a <= 0.002) return;
  ctx.save(); ctx.globalAlpha *= f.a; if (f.blur > 0.3) ctx.filter = `blur(${f.blur.toFixed(1)}px)`; ctx.translate(0, f.dy); draw(); ctx.restore();
}
function eyebrow(s, y, col = MUTED) { text(s, CX, y, 22, 700, col, 'center', 0.22); }
function card(x, y, w, h, o = {}) {
  fillRR(x, y, w, h, o.r ?? 24, o.fill ?? 'rgba(255,255,255,0.045)');
  strokeRR(x, y, w, h, o.r ?? 24, o.stroke ?? 'rgba(255,255,255,0.11)', o.lw ?? 2);
}
function avatar(x, y, r, initials, col, a = 1) {
  ctx.save(); ctx.globalAlpha *= a; circle(x, y, r, col); text(initials, x, y + 1, r * 0.78, 700, '#fff', 'center', 0); ctx.restore();
}
function tag(x, y, label, col, solid = false, size = 20) {
  const w = tw(label, size, 800, 0.1) + size * 1.4, h = size * 1.8;
  fillRR(x - w, y - h / 2, w, h, h / 2, solid ? col : rgba(col, 0.14));
  if (!solid) strokeRR(x - w, y - h / 2, w, h, h / 2, rgba(col, 0.45), 1.5);
  text(label, x - w / 2, y + 1, size, 800, solid ? '#fff' : col, 'center', 0.1);
  return w;
}
const PEOPLE = [
  { n: 'Ava R.', i: 'AR', c: '#0ea5a4', score: 92, st: 'Healthy', sc: GREEN, bars: [5, 6, 5, 7, 6, 6, 7, 6, 5, 7, 6, 7] },
  { n: 'Marcus T.', i: 'MT', c: '#e5803b', score: 85, st: 'Healthy', sc: GREEN, bars: [4, 5, 5, 4, 6, 5, 5, 6, 5, 4, 6, 5] },
  { n: 'Priya S.', i: 'PS', c: '#d9468a', score: 61, st: 'Needs attention', sc: AMBER, bars: [5, 4, 5, 4, 4, 3, 4, 3, 3, 3, 2, 3] },
  { n: 'Jordan K.', i: 'JK', c: '#6366f1', score: 38, st: 'At risk', sc: RED, bars: [6, 6, 5, 6, 5, 5, 4, 3, 0, 0, 0, 0] },
];

// F · "Your customers go quiet too." — a year of visits and replies; Jordan's goes flat.
function activityScene(t) {
  stage(t, 0.14);
  withFade(enter(t, T.pivot + 0.05, T.booking + 0.05), () => {
    eyebrow('CUSTOMER ACTIVITY', 560);
    const rows = [PEOPLE[0], PEOPLE[1], PEOPLE[3]], y0 = 610, rh = 150;
    card(CARD.x, y0, CARD.w, rh * rows.length + 30);
    rows.forEach((p, r) => {
      const y = y0 + 15 + r * rh + rh / 2, jordan = r === 2, q = jordan ? seg(t, T.quiet, T.quiet + 0.3) : 0;
      if (r) { ctx.fillStyle = 'rgba(255,255,255,0.07)'; ctx.fillRect(CARD.x + 30, y - rh / 2, CARD.w - 60, 2); }
      avatar(CARD.x + 76, y, 38, p.i, p.c);
      text(p.n, CARD.x + 136, y - 18, 34, 700, '#fff');
      if (q < 0.5) { ctx.save(); ctx.globalAlpha *= 1 - 2 * q; text('Every 4 weeks', CARD.x + 136, y + 22, 24, 500, MUTED); ctx.restore(); }
      if (q > 0.5) { ctx.save(); ctx.globalAlpha *= 2 * q - 1; text('Quiet for 9 weeks', CARD.x + 136, y + 22, 24, 700, RED); ctx.restore(); }
      // bars, drawn in left to right
      const bx0 = CARD.x + 470, bw = 22, gap = 9;
      p.bars.forEach((v, k) => {
        const g = ease.out(seg(t, T.pivot + 0.2 + k * 0.06 + r * 0.05, T.pivot + 0.6 + k * 0.06 + r * 0.05));
        const bx = bx0 + k * (bw + gap), h = v * 9 * g;
        if (v === 0) { circle(bx + bw / 2, y + 30, 4, rgba(jordan && q > 0 ? RED : '#ffffff', 0.35 * g)); return; }
        fillRR(bx, y + 34 - h, bw, h, 5, jordan && k > 5 ? rgba(IN.mid, 0.55 - 0.08 * (k - 5)) : rgba(IN.mid, 0.9));
      });
      if (jordan && q > 0) { strokeRR(CARD.x + 14, y - rh / 2 + 6, CARD.w - 28, rh - 12, 18, rgba(RED, 0.55 * q), 2.5); glow(bx0 + 300, y + 30, 120, RED, 0.12 * q); }
    });
    text('VISITS & REPLIES · LAST 12 MONTHS', CARD.x + CARD.w - 30, y0 + rh * 3 + 72, 18, 700, MUTED, 'right', 0.16);
  });
}
// G/H · "They stop booking. They stop replying. Then they're gone."
function signsScene(t) {
  stage(t, 0.12);
  const fade = enter(t, T.booking, T.gone + 0.2, 0.3);
  withFade(fade, () => {
    eyebrow('JORDAN · THE SIGNS', 560);
    const y0 = 610;
    card(CARD.x, y0, CARD.w, 160);
    avatar(CARD.x + 86, y0 + 80, 46, 'JK', PEOPLE[3].c);
    text('Jordan K.', CARD.x + 156, y0 + 62, 38, 700, '#fff');
    text('Regular · every 4 weeks', CARD.x + 156, y0 + 104, 24, 500, MUTED);
    [[T.booking, 'Usual 4-week booking', 'MISSED'], [T.replying, 'Your last 2 texts', 'NO REPLY']].forEach(([at, label, flag], k) => {
      const e = ease.back(seg(t, at, at + 0.35)), y = y0 + 200 + k * 130;
      if (e <= 0) return;
      ctx.save(); ctx.globalAlpha *= clamp(e); ctx.translate(0, (1 - e) * 40);
      card(CARD.x, y, CARD.w, 110, { fill: rgba(RED, 0.07), stroke: rgba(RED, 0.55) });
      text(label, CARD.x + 36, y + 56, 32, 600, '#fff');
      tag(CARD.x + CARD.w - 30, y + 55, flag, RED);
      ctx.restore();
    });
  });
  // "Then they're gone": a big avatar left alone, fading to a dashed outline, then nothing
  const g = seg(t, T.gone - 0.1, T.gone + 0.25);
  if (g > 0) {
    const out = seg(t, T.gone + 0.45, T.brand - 0.05), y = 860, r = 130;
    ctx.save(); ctx.globalAlpha = g * (1 - out);
    avatar(CX, y, r, 'JK', PEOPLE[3].c, 1 - seg(t, T.gone + 0.05, T.gone + 0.55));
    ctx.setLineDash([16, 14]); ctx.lineWidth = 5; ctx.strokeStyle = 'rgba(235,235,245,0.55)';
    ctx.beginPath(); ctx.arc(CX, y, r, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
    text('Jordan K.', CX, y + r + 60, 36, 700, 'rgba(235,235,245,0.6)', 'center');
    ctx.restore();
  }
}
// I · the brand: "MsgHealth hears the silence." — the logo lands, rings go out listening.
function logoLockup(x, y, size, a = 1) {
  ctx.save(); ctx.globalAlpha *= a;
  const ww = tw(BRAND.name, size, 800, -0.035), ls = size * 1.35, gap = size * 0.28, full = ls + gap + ww, x0 = x - full / 2;
  if (LOGO) ctx.drawImage(LOGO, x0, y - ls / 2, ls, ls);
  text(BRAND.name, x0 + ls + gap, y + size * 0.04, size, 800, '#fff', 'left', -0.035);
  ctx.restore();
}
function brandScene(t) {
  const hit = seg(t, T.brand, T.brand + 0.5);
  stage(t, 0.12 + 0.28 * ease.out(hit));
  const flash = 1 - seg(t, T.brand, T.brand + 0.35);
  if (t >= T.brand) glow(CX, 860, 900, C.primary, 0.5 * flash);
  withFade(enter(t, T.brand - 0.02, T.scores + 0.1, 0.18), () => {
    for (let i = 0; i < 4; i++) { // listening rings
      const p = ((t - T.hears) / 1.3 + i / 4);
      if (t < T.hears || p < 0) continue;
      const k = p % 1;
      ctx.strokeStyle = rgba(IN.mid, 0.4 * (1 - k)); ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(CX, 860, 160 + k * 420, 0, Math.PI * 2); ctx.stroke();
    }
    const s = 1 + 0.25 * (1 - ease.quint(hit));
    ctx.save(); ctx.translate(CX, 860); ctx.scale(s, s); ctx.translate(-CX, -860);
    logoLockup(CX, 860, 92);
    ctx.restore();
  });
}
// J · Client Health: "It scores every customer's health, and flags who's at risk."
function healthScene(t) {
  stage(t, 0.2);
  withFade(enter(t, T.scores, T.texts + 0.05), () => {
    eyebrow('CLIENT HEALTH', 500);
    const y0 = 550, rh = 128, open = ease.out(seg(t, T.risk, T.risk + 0.35)), extra = 74 * open;
    card(CARD.x, y0, CARD.w, rh * 4 + 24 + extra);
    PEOPLE.forEach((p, r) => {
      const e = ease.out(seg(t, T.scores + 0.05 + r * 0.12, T.scores + 0.45 + r * 0.12));
      const y = y0 + 12 + r * rh + rh / 2, jordan = r === 3, flag = jordan ? seg(t, T.flags, T.flags + 0.25) : 0;
      ctx.save(); ctx.globalAlpha *= e; ctx.translate(0, (1 - e) * 24);
      if (r) { ctx.fillStyle = 'rgba(255,255,255,0.07)'; ctx.fillRect(CARD.x + 30, y - rh / 2, CARD.w - 60, 2); }
      if (flag > 0) {
        const pulse = 0.5 + 0.5 * Math.sin((t - T.flags) * 9);
        fillRR(CARD.x + 12, y - rh / 2 + 6, CARD.w - 24, rh - 12 + extra, 18, rgba(RED, 0.09 * flag));
        strokeRR(CARD.x + 12, y - rh / 2 + 6, CARD.w - 24, rh - 12 + extra, 18, rgba(RED, (0.5 + 0.3 * pulse) * flag), 3);
      }
      avatar(CARD.x + 72, y, 36, p.i, p.c);
      text(p.n, CARD.x + 128, y - 16, 32, 700, '#fff');
      // status appears once the score has counted up
      const cnt = ease.out(seg(t, T.every + r * 0.08, T.every + 0.9 + r * 0.08)), score = Math.round(p.score * cnt);
      const sa = seg(t, T.every + 0.7 + r * 0.08, T.every + 1.0 + r * 0.08);
      if (sa > 0) {
        ctx.save(); ctx.globalAlpha *= sa;
        if (jordan && flag > 0) { ctx.globalAlpha *= flag; tag(CARD.x + 128 + tw('AT RISK', 19, 800, 0.1) + 19 * 1.4, y + 22, 'AT RISK', RED, true, 19); }
        else { circle(CARD.x + 136, y + 22, 7, p.sc); text(p.st, CARD.x + 152, y + 23, 24, 600, SOFT); }
        ctx.restore();
      }
      // score with a ring gauge
      const gx = CARD.x + CARD.w - 86;
      ctx.lineWidth = 9; ctx.lineCap = 'round';
      ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.beginPath(); ctx.arc(gx, y, 42, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = p.sc; ctx.beginPath(); ctx.arc(gx, y, 42, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (score / 100)); ctx.stroke();
      text(String(score), gx, y + 1, 32, 800, '#fff', 'center', -0.02);
      if (jordan && open > 0) {
        ctx.save(); ctx.globalAlpha *= open;
        let x = CARD.x + 128; const cy = y + rh / 2 + 20;
        ['Visit overdue · 5 weeks', 'No reply · 12 days'].forEach((s) => {
          const w = tw(s, 22, 600) + 36; fillRR(x, cy - 22, w, 44, 22, 'rgba(255,255,255,0.07)'); text(s, x + w / 2, cy + 1, 22, 600, SOFT, 'center'); x += w + 12;
        });
        ctx.restore();
      }
      ctx.restore();
    });
  });
}
// K/L · "Then it texts them for you, before they leave. And they book again."
function bubble(x, y, maxW, lines, out, a) {
  if (a <= 0) return 0;
  const size = 30, lh = 40, w = Math.max(...lines.map((l) => tw(l, size, 500))) + 48, h = lines.length * lh + 30;
  const x0 = out ? x + maxW - w : x;
  ctx.save(); ctx.globalAlpha *= a;
  fillRR(x0, y, w, h, 26, out ? C.primary : 'rgba(255,255,255,0.1)');
  lines.forEach((l, i) => text(l, x0 + 24, y + 15 + lh / 2 + i * lh, size, 500, '#fff'));
  ctx.restore();
  return h;
}
function winbackScene(t) {
  stage(t, 0.22);
  withFade(enter(t, T.texts - 0.05, T.guess - 0.05), () => {
    eyebrow('AUTOMATIONS · WIN-BACK', 470);
    // the rule: When at risk → Send SMS, switched on
    const ry = 520; card(CARD.x, ry, CARD.w, 96, { r: 22 });
    let x = CARD.x + 28;
    [['When', MUTED], ['At risk', RED]].forEach(([s, col], i) => { if (i) { const w = tw(s, 24, 700) + 36; fillRR(x, ry + 26, w, 44, 22, rgba(RED, 0.16)); text(s, x + w / 2, ry + 49, 24, 700, col, 'center'); x += w + 18; } else { text(s, x, ry + 49, 26, 600, col); x += tw(s, 26, 600) + 14; } });
    text('→', x, ry + 48, 28, 700, MUTED); x += 46;
    { const s = 'Send SMS', w = tw(s, 24, 700) + 36; fillRR(x, ry + 26, w, 44, 22, rgba(IN.mid, 0.18)); text(s, x + w / 2, ry + 49, 24, 700, IN.hi, 'center'); }
    const on = ease.out(seg(t, T.texts + 0.1, T.texts + 0.35)), sx = CARD.x + CARD.w - 104;
    fillRR(sx, ry + 28, 76, 40, 20, on > 0.5 ? C.primary : 'rgba(255,255,255,0.16)'); circle(sx + 20 + 36 * on, ry + 48, 15, '#fff');
    // the conversation
    const ty = 650, th = 610; card(CARD.x, ty, CARD.w, th);
    avatar(CARD.x + 66, ty + 62, 30, 'JK', PEOPLE[3].c);
    text('Jordan K.', CARD.x + 112, ty + 62, 30, 700, '#fff');
    // health badge: 38 → 86 once booked
    const up = ease.out(seg(t, T.again + 0.75, T.again + 1.3)), sc = Math.round(lerp(38, 86, up)), col = up > 0.5 ? GREEN : RED;
    { const s = `Health ${sc}`, w = tw(s, 22, 800, 0.04) + 34, bx = CARD.x + CARD.w - 30 - w; fillRR(bx, ty + 40, w, 44, 22, rgba(col, 0.16)); strokeRR(bx, ty + 40, w, 44, 22, rgba(col, 0.5), 1.5); text(s, bx + w / 2, ty + 63, 22, 800, col, 'center', 0.04); }
    ctx.fillStyle = 'rgba(255,255,255,0.07)'; ctx.fillRect(CARD.x + 30, ty + 118, CARD.w - 60, 2);
    const bx = CARD.x + 40, bw = CARD.w - 80;
    const m1 = ease.back(seg(t, T.texts + 0.3, T.texts + 0.65));
    let y = ty + 150 + (1 - clamp(m1)) * 30;
    const h1 = bubble(bx, y, bw, ['Hi Jordan! It\'s been a while.', 'Want your usual, Thursday at 10?'], true, clamp(m1));
    const lab = seg(t, T.foryou, T.foryou + 0.3);
    if (lab > 0) { ctx.save(); ctx.globalAlpha *= lab; text(t > T.before ? 'Sent automatically · SMS · Delivered' : 'Sent automatically · SMS', bx + bw, y + h1 + 28, 21, 600, IN.mid, 'right'); ctx.restore(); }
    const m2 = ease.back(seg(t, T.again - 0.05, T.again + 0.3));
    y = ty + 150 + h1 + 70 + (1 - clamp(m2)) * 30;
    const h2 = bubble(bx, y, bw, ['Yes please! See you then.'], false, clamp(m2));
    // the booking lands
    const b = ease.back(seg(t, T.again + 0.4, T.again + 0.75));
    if (b > 0) {
      const by = ty + 150 + h1 + 70 + h2 + 30, s = 'Booked · Thu 10:00 AM', w = tw(s, 28, 700) + 100, x0 = CX - w / 2;
      ctx.save(); ctx.globalAlpha *= clamp(b); ctx.translate(CX, by + 32); ctx.scale(0.85 + 0.15 * b, 0.85 + 0.15 * b); ctx.translate(-CX, -(by + 32));
      fillRR(x0, by, w, 64, 32, rgba(GREEN, 0.18)); strokeRR(x0, by, w, 64, 32, rgba(GREEN, 0.6), 2);
      circle(x0 + 38, by + 32, 15, GREEN); check(x0 + 38, by + 33, 15, '#fff', 3.5);
      text(s, x0 + 66, by + 33, 28, 700, '#fff');
      ctx.restore();
    }
  });
}
// M · "Stop guessing when your customers are planning to leave." — big type, guessing gets struck out.
function stopScene(t) {
  stage(t, 0.16);
  withFade(enter(t, T.guess - 0.1, T.end, 0.3), () => {
    const y1 = 760, size = 112;
    const wa = tw('Stop ', size, 800), wb = tw('guessing.', size, 800), x0 = CX - (wa + wb) / 2;
    text('Stop', x0, y1, size, 800, '#fff');
    text('guessing.', x0 + wa, y1, size, 800, RED);
    const s = ease.inOut(seg(t, T.guess + 0.75, T.guess + 1.05));
    if (s > 0) { ctx.strokeStyle = '#fff'; ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x0 + wa - 6, y1 + 6); ctx.lineTo(x0 + wa - 6 + (wb + 12) * s, y1 + 2); ctx.stroke(); }
    const k = ease.out(seg(t, T.plan - 0.2, T.plan + 0.25));
    if (k > 0) {
      ctx.save(); ctx.globalAlpha *= k; ctx.translate(0, (1 - k) * 30);
      const w2 = tw('Start knowing.', size, 800), g = ctx.createLinearGradient(CX - w2 / 2, 0, CX + w2 / 2, 0);
      g.addColorStop(0, IN.hi); g.addColorStop(0.5, IN.mid); g.addColorStop(1, IN.deep);
      text('Start knowing.', CX, y1 + 150, size, 800, g, 'center');
      ctx.restore();
    }
  });
}
// N · end card: logo, tagline, the button gets a tap.
function endScene(t) {
  const k = ease.quint(seg(t, T.end, T.end + 0.4));
  stage(t, 0.18 + 0.2 * k);
  if (t < T.end + 0.3) glow(CX, 860, 900, C.primary, 0.45 * (1 - seg(t, T.end, T.end + 0.3)));
  const s = 1 + 0.2 * (1 - k);
  ctx.save(); ctx.globalAlpha = k; ctx.translate(CX, 760); ctx.scale(s, s); ctx.translate(-CX, -760);
  logoLockup(CX, 720, 96);
  text(BRAND.tagline, CX, 830, 32, 500, SOFT, 'center');
  ctx.restore();
  const b = ease.back(seg(t, T.end + 0.35, T.end + 0.75));
  if (b > 0) {
    const press = t > T.tap - 0.06 && t < T.tap + 0.16 ? 0.94 : 1;
    const label = 'Try MsgHealth', bw = tw(label, 44, 800) + 160, bh = 116, by = 960;
    ctx.save(); ctx.globalAlpha = clamp(b); ctx.translate(CX, by + bh / 2); ctx.scale(b * press, b * press); ctx.translate(-CX, -(by + bh / 2));
    glow(CX, by + bh / 2, 360, C.primary, 0.45 + 0.15 * Math.sin(t * 4));
    fillRR(CX - bw / 2, by, bw, bh, bh / 2, C.primary);
    strokeRR(CX - bw / 2, by, bw, bh, bh / 2, 'rgba(255,255,255,0.25)', 2);
    text(label, CX - 30, by + bh / 2 + 2, 44, 800, '#fff', 'center');
    // arrow
    const ax = CX + tw(label, 44, 800) / 2 + 10; ctx.strokeStyle = '#fff'; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(ax, by + bh / 2); ctx.lineTo(ax + 40, by + bh / 2); ctx.moveTo(ax + 24, by + bh / 2 - 16); ctx.lineTo(ax + 40, by + bh / 2); ctx.lineTo(ax + 24, by + bh / 2 + 16); ctx.stroke();
    ctx.restore();
    const u = seg(t, T.tap + 0.45, T.tap + 0.8);
    ctx.save(); ctx.globalAlpha = u; text(BRAND.url.toUpperCase(), CX, by + bh + 70, 26, 800, IN.mid, 'center', 0.18); ctx.restore();
    // the tap
    if (HAND && t > T.tap - 0.7 && t < T.tap + 0.8) {
      const p = seg(t, T.tap - 0.7, T.tap - 0.05), q = seg(t, T.tap + 0.25, T.tap + 0.8);
      const hx = ax + 26 + (1 - ease.out(p)) * 220 + q * 160, hy = by + bh / 2 + 18 + (1 - ease.out(p)) * 300 + q * 240, k2 = 0.5;
      ctx.save(); ctx.globalAlpha = clamp(p * 3) * (1 - q);
      if (t > T.tap && t < T.tap + 0.4) { const r = seg(t, T.tap, T.tap + 0.4); ctx.strokeStyle = rgba('#ffffff', 0.7 * (1 - r)); ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(hx, hy, 20 + r * 60, 0, Math.PI * 2); ctx.stroke(); }
      ctx.translate(hx, hy); ctx.rotate(-0.12); ctx.scale(k2, k2); ctx.translate(-110.5, -117);
      ctx.drawImage(HAND, 0, 0);
      ctx.restore();
    }
  }
}

// ── captions: one phrase at a time in a black box, like the reference format ──
// Words between *stars* take the accent: canary yellow in the mine, brand indigo after.
const CAPS = [];
VO_CLIPS.forEach((clip, i) => clip.chunks.forEach(([s, off], k) => {
  const at = VO_AT[i] + off, next = k + 1 < clip.chunks.length ? VO_AT[i] + clip.chunks[k + 1][1] : VO_AT[i] + clip.dur + 0.2;
  CAPS.push({ at: at - 0.04, out: Math.min(next - 0.04, i + 1 < VO_AT.length ? VO_AT[i + 1] - 0.04 : Infinity), s, act2: VO_AT[i] >= T.pivot });
}));
const CAP_Y = 1340, CAP_SIZE = 46;
function drawCaption(t) {
  const c = CAPS.find((c) => t >= c.at && t < c.out);
  if (!c) return;
  let acc = false;
  const words = c.s.toUpperCase().split(' ').map((w) => { if (w.startsWith('*')) acc = true; const o = { w: w.replace(/\*/g, ''), acc }; if (/\*[.,?]?$/.test(w)) acc = false; return o; });
  const sp = tw(' ', CAP_SIZE, 800, 0.01);
  words.forEach((w) => (w.width = tw(w.w, CAP_SIZE, 800, 0.01)));
  const tot = words.reduce((p, w) => p + w.width, 0) + sp * (words.length - 1), padX = 26, h = CAP_SIZE * 1.55;
  const pop = ease.back(seg(t, c.at, c.at + 0.14)), sc = 0.86 + 0.14 * pop;
  ctx.save(); ctx.translate(CX, CAP_Y); ctx.scale(sc, sc); ctx.translate(-CX, -CAP_Y);
  fillRR(CX - tot / 2 - padX, CAP_Y - h / 2, tot + padX * 2, h, 12, 'rgba(10,10,12,0.92)');
  let x = CX - tot / 2;
  font(CAP_SIZE, 800, 0.01); ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  words.forEach((w) => { ctx.fillStyle = w.acc ? (c.act2 ? IN.mid : M.bird) : '#ffffff'; ctx.fillText(w.w, x, CAP_Y + 2); x += w.width + sp; });
  ctx.restore();
}
// A small brand watermark, top right (hidden while the logo itself is on screen).
function watermark(t) {
  const a = 0.85 * (1 - seg(t, T.brand - 0.3, T.brand)) + 0.85 * seg(t, T.scores, T.scores + 0.3) * (1 - seg(t, T.end - 0.3, T.end));
  if (a <= 0.01) return;
  ctx.save(); ctx.globalAlpha = a; ctx.shadowColor = 'rgba(0,0,0,0.45)'; ctx.shadowBlur = 8;
  const s = BRAND.url.toUpperCase(), w = tw(s, 19, 800, 0.12), x1 = 1030;
  text(s, x1, 214, 19, 800, '#fff', 'right', 0.12);
  if (LOGO) ctx.drawImage(LOGO, x1 - w - 46, 196, 36, 36);
  ctx.restore();
}

// ── the edit ─────────────────────────────────────────────────────────────────
const SCENES = [
  [0, T.pivot, mineScene],
  [T.pivot, T.booking, activityScene],
  [T.booking, T.brand, signsScene],
  [T.brand, T.scores + 0.1, brandScene],
  [T.scores + 0.1, T.texts, healthScene],
  [T.texts, T.guess, winbackScene],
  [T.guess, T.end, stopScene],
  [T.end, DURATION + 1, endScene],
];
function renderFrame(t) {
  ctx = MAIN;
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.filter = 'none'; ctx.globalCompositeOperation = 'source-over';
  const s = SCENES.find(([a, b]) => t >= a && t < b) ?? SCENES.at(-1);
  s[2](t);
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.filter = 'none';
  watermark(t);
  drawCaption(t);
}

// Sound cues (sample-based effects; the music, canary song and ambience are synthesised from window.CUES).
cue(T.canary + 0.05, 'swoosh', 0.6);
cue(T.deep + 0.3, 'transition', 0.7);
cue(T.first + 0.15, 'swoosh', 0.5);
cue(T.miners + 0.1, 'swish', 0.9);
cue(T.late + 0.1, 'transition', 0.8);
cue(T.pivot - 0.05, 'swoosh', 0.9);
PEOPLE.forEach((_, r) => r !== 2 && cue(T.pivot + 0.25 + r * 0.05, 'key', 0.5));
cue(T.booking + 0.05, 'key', 0.9); cue(T.replying + 0.05, 'key', 0.9);
cue(T.brand, 'transitionHit', 1);
[0, 1, 2, 3].forEach((r) => cue(T.scores + 0.1 + r * 0.12, 'key', 0.6));
cue(T.flags + 0.02, 'ding', 0.9);
cue(T.texts + 0.12, 'tap', 0.8);
cue(T.texts + 0.4, 'swish', 0.9);
cue(T.again, 'notification', 0.9);
cue(T.guess + 0.8, 'swoosh', 0.6);
cue(T.end, 'punch', 1);
cue(T.tap, 'tap', 1.2);

window.DURATION = DURATION;
window.renderFrame = renderFrame;
// Text audit hook (scripts/audit-text.mjs): while window.TEXT_LOG is an array, every string drawn is logged with its box.
{
  const fill = CanvasRenderingContext2D.prototype.fillText;
  CanvasRenderingContext2D.prototype.fillText = function (str, x, y, ...rest) {
    if (window.TEXT_LOG) {
      const T2 = this.getTransform(), m = this.measureText(str);
      const pts = [[x - m.actualBoundingBoxLeft, y - m.actualBoundingBoxAscent], [x + m.actualBoundingBoxRight, y + m.actualBoundingBoxDescent]]
        .flatMap(([px, py], i, a) => [[px, py], [a[1 - i][0], py]]).map(([px, py]) => [T2.a * px + T2.c * py + T2.e, T2.b * px + T2.d * py + T2.f]);
      const xs = pts.map((q) => q[0]), ys = pts.map((q) => q[1]);
      window.TEXT_LOG.push({ str, x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys), a: this.globalAlpha, layer: 'main' });
    }
    return fill.call(this, str, x, y, ...rest);
  };
}
window.ready = (async () => {
  MAIN = document.getElementById('c').getContext('2d');
  ctx = MAIN;
  await Promise.all(['500', '600', '700', '800'].map((w) => document.fonts.load(`${w} 40px ${FONT}`)));
  const load = (src) => new Promise((res) => { const im = new Image(); im.onload = () => res(im); im.onerror = () => res(null); im.src = src; });
  LOGO = await load(BRAND.logoFile);
  HAND = await load('assets/img/hand-tap.png');
  if (location.search.includes('render')) document.body.classList.add('render');
  renderFrame(0);
  return true;
})();

// ── player: plays the voiceover clips in sync (the full mix is only in the render) ──
(() => {
  const btn = document.getElementById('play'), seek = document.getElementById('seek'), tm = document.getElementById('time');
  if (!btn) return;
  const clips = window.VO.map((v) => Object.assign(new Audio(v.file), { preload: 'auto' }));
  let playing = false, cur = 0, t0 = 0, started = new Set();
  const show = (t) => { cur = t; renderFrame(t); seek.value = (t / DURATION) * 1000; tm.textContent = `${t.toFixed(1)}s / ${DURATION}s`; };
  const stopAll = () => { clips.forEach((c) => c.pause()); started.clear(); };
  const loop = () => {
    if (!playing) return;
    const t = (performance.now() - t0) / 1000;
    if (t >= DURATION) { playing = false; stopAll(); btn.textContent = 'Replay'; show(DURATION); return; }
    window.VO.forEach((v, i) => { if (t >= v.at && t < v.at + v.dur && !started.has(i)) { started.add(i); clips[i].currentTime = t - v.at; clips[i].play(); } });
    show(t); requestAnimationFrame(loop);
  };
  btn.onclick = () => {
    if (playing) { playing = false; stopAll(); btn.textContent = 'Play'; return; }
    if (cur >= DURATION) cur = 0;
    t0 = performance.now() - cur * 1000; playing = true; btn.textContent = 'Pause'; requestAnimationFrame(loop);
  };
  seek.oninput = () => { playing = false; stopAll(); btn.textContent = 'Play'; show((seek.value / 1000) * DURATION); };
  window.ready.then(() => { const q = new URLSearchParams(location.search).get('t'); if (q) show(+q); });
})();
