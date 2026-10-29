// MsgHealth · "Uranus" · 57 s vertical social ad (1080 × 1920, 30 fps).
// A "what if" science short in the format of the supplied reference: eight billion people aim lasers at Uranus.
// The light takes almost three hours to get there, one beam spreads to a spot twice as wide as the Sun, so almost
// all of it misses, and any light coming back would need another three hours. Six hours round trip, which is still
// faster than most businesses notice a regular has stopped coming. MsgHealth scores every customer's health, flags
// who's at risk the moment they slip, and texts them so they book again. End card: msghealth.net.
// The voiceover is assets/audio/uranus/vo-NN.wav (timed by VO_AT below); captions follow it chunk by chunk.
'use strict';

const W = 1080, H = 1920, DURATION = 57.6;
const C = BRAND.colors;
const FONT = 'Inter';

// When each voiceover clip starts (film seconds). Clip lengths and caption chunks are in src/uranus-vo.js.
const VO_AT = [0.2, 3.55, 4.45, 5.35, 6.25, 7.5, 9.85, 13.55, 15.35, 19.35, 22.9, 25.35, 27.15, 31.8, 33.65, 38.4, 42.75, 48.35, 51.25, 54.5];
const word = (line, k) => VO_AT[line] + VO_CLIPS[line].chunks[k][1]; // when a caption chunk is spoken
// Story beats, all read off the voiceover so picture and sound stay locked to it.
const T = {
  on: word(0, 1), uranus: word(0, 2), three: VO_AT[1], two: VO_AT[2], one: VO_AT[3], fire: VO_AT[4],
  space: VO_AT[5] - 0.25, shoot: word(5, 1), trip: VO_AT[6], hours: word(6, 1), reach: word(6, 2),
  spread: VO_AT[7], spreading: word(7, 1), then: VO_AT[8], spot: word(8, 1), wide: word(8, 2), sun: word(8, 3),
  diam: VO_AT[9], fifty: word(9, 1), km: word(9, 2), almost: VO_AT[10], misses: word(10, 1),
  weird: VO_AT[11], litup: VO_AT[12], back: word(12, 1), another: word(12, 2), hours3: word(12, 3),
  six: VO_AT[13], pivot: VO_AT[14], most: word(14, 1), regular: word(14, 2), stopped: word(14, 3),
  bytime: VO_AT[15], already: word(15, 1), elsewhere: word(15, 2),
  brand: VO_AT[16], every: word(16, 1), flags: word(16, 2), slip: word(16, 3), texts: VO_AT[17], again: word(17, 1),
  stop: VO_AT[18], end: VO_AT[18] - 0.1, url: VO_AT[19], tap: 56.0,
};
window.CUES = T;
window.VO = VO_AT.map((at, i) => ({ at, file: `assets/audio/uranus/vo-${String(i).padStart(2, '0')}.wav`, dur: VO_CLIPS[i].dur }));
window.SFX = []; // sample cues { t, kind, gain? }, read by scripts/uranus-audio.mjs
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
function circle(x, y, r, col) { ctx.beginPath(); ctx.arc(x, y, Math.max(0, r), 0, Math.PI * 2); ctx.fillStyle = col; ctx.fill(); }
function ring(x, y, r, col, lw = 2) { ctx.beginPath(); ctx.arc(x, y, Math.max(0, r), 0, Math.PI * 2); ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.stroke(); }
function ellipse(x, y, rx, ry, col, rot = 0) { ctx.beginPath(); ctx.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2); ctx.fillStyle = col; ctx.fill(); }
function line(x0, y0, x1, y1, col, lw = 2) { ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.stroke(); }
function glow(x, y, r, col, a) {
  if (a <= 0.003 || r <= 0) return;
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, rgba(col, a)); g.addColorStop(1, rgba(col, 0));
  ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2);
}
function check(x, y, s, col = '#fff', lw = 4) {
  ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(x - s * 0.45, y); ctx.lineTo(x - s * 0.12, y + s * 0.34); ctx.lineTo(x + s * 0.5, y - s * 0.36); ctx.stroke();
}

// ═════════════════════════════════════════════════════════════════════════════
// ACT 1 · the crowd (flat vector, night)
// ═════════════════════════════════════════════════════════════════════════════
const LASER = '#5dff8f', ACCENT = '#f5d68a'; // beam green; caption accent before the brand (pale gold, like the reference)
const SKIN = ['#f1c7a5', '#e2a87f', '#c68a62', '#a86c48', '#8a5537', '#6b3f28'];
const HAIR = ['#2a1d17', '#3b2a20', '#1b1b1f', '#5a3c26', '#7a5a3a', '#2d2522'];
const SHIRT = ['#9fb39a', '#c9c3b5', '#e6e3dc', '#8ea2b8', '#b9a98f', '#d7c9b6', '#a7b7a1', '#7f93a8', '#cfb4a8'];
const PANTS = ['#5c5f52', '#4b5060', '#6b6457', '#3d424f', '#575b4c'];
const HORIZON = 760;

// One person, feet at (x, y), h tall, right arm raised with a laser pointer. Returns the pointer tip.
function person(x, y, h, s, opts = {}) {
  const w = h * 0.3, skin = SKIN[Math.floor(hash(s) * SKIN.length)], shirt = SHIRT[Math.floor(hash(s + 1) * SHIRT.length)];
  const pants = PANTS[Math.floor(hash(s + 2) * PANTS.length)], hair = HAIR[Math.floor(hash(s + 3) * HAIR.length)];
  const side = opts.side ?? (hash(s + 4) < 0.5 ? 1 : -1), lean = (hash(s + 5) - 0.5) * 0.25 * side;
  const hr = h * 0.085, hy = y - h + hr, sy = y - h * 0.74;
  // legs
  fillRR(x - w * 0.36, y - h * 0.44, w * 0.32, h * 0.44, w * 0.06, pants);
  fillRR(x + w * 0.04, y - h * 0.44, w * 0.32, h * 0.44, w * 0.06, pants);
  fillRR(x - w * 0.4, y - h * 0.035, w * 0.38, h * 0.035, h * 0.015, opts.shoe ?? '#2b2b30');
  fillRR(x + w * 0.02, y - h * 0.035, w * 0.38, h * 0.035, h * 0.015, opts.shoe ?? '#2b2b30');
  // the lowered arm, then the torso
  fillRR(x - side * w * 0.5 - w * 0.1, sy, w * 0.2, h * 0.34, w * 0.1, shirt);
  circle(x - side * w * 0.5, sy + h * 0.35, w * 0.1, skin);
  fillRR(x - w / 2, sy - h * 0.02, w, h * 0.34, w * 0.22, shirt);
  ctx.fillStyle = 'rgba(0,0,0,0.08)'; ctx.fillRect(x - w / 2 + w * 0.6, sy + h * 0.02, w * 0.4, h * 0.28);
  // the raised arm
  const shx = x + side * w * 0.38, shy = sy + h * 0.03;
  const hx = x + side * (w * 0.62 + lean * h * 0.3), hyd = y - h * 1.17;
  ctx.lineCap = 'round'; line(shx, shy, hx, hyd + h * 0.04, shirt, w * 0.2);
  line(shx + (hx - shx) * 0.45, shy + (hyd - shy) * 0.45, hx, hyd + h * 0.03, skin, w * 0.17);
  // pointer in the fist
  const px = hx + side * h * 0.004, py = hyd - h * 0.05;
  fillRR(px - w * 0.04, py, w * 0.08, h * 0.07, w * 0.03, '#2a2c33');
  circle(hx, hyd + h * 0.03, w * 0.12, skin);
  // neck, head, hair
  fillRR(x - w * 0.09, hy + hr * 0.6, w * 0.18, h * 0.06, 2, skin);
  circle(x, hy, hr, skin);
  ctx.beginPath(); ctx.arc(x, hy - hr * 0.1, hr * 1.04, Math.PI * 1.02, Math.PI * 1.98); ctx.closePath(); ctx.fillStyle = hair; ctx.fill();
  if (h > 140) { circle(x - hr * 0.38, hy + hr * 0.1, hr * 0.09, '#1b1410'); circle(x + hr * 0.38, hy + hr * 0.1, hr * 0.09, '#1b1410'); }
  if (opts.glasses || (h > 140 && hash(s + 6) < 0.22)) {
    ctx.strokeStyle = '#1b1b1f'; ctx.lineWidth = Math.max(1.5, hr * 0.08);
    ctx.strokeRect(x - hr * 0.7, hy - hr * 0.08, hr * 0.56, hr * 0.38); ctx.strokeRect(x + hr * 0.14, hy - hr * 0.08, hr * 0.56, hr * 0.38);
    line(x - hr * 0.14, hy + hr * 0.04, x + hr * 0.14, hy + hr * 0.04, '#1b1b1f', Math.max(1.5, hr * 0.08));
  }
  return { x: px, y: py };
}
// The crowd: rows receding to the horizon, built once.
const HERO = { x: 720, y: 2250, h: 1050 }; // the foreground guy the film opens on
const VP = { x: 560, y: -9000 }; // where every beam is headed (Uranus, straight up and far away)
const CROWD = (() => {
  const rows = [];
  for (let k = 13; k >= 0; k--) {
    const d = 1.7 * Math.pow(1.22, k), h = 620 / d, y = HORIZON + 1180 / d, sp = h * 0.4;
    const off = hash(k * 9) * sp, n = Math.ceil(2200 / sp);
    const ppl = [];
    for (let i = 0; i < n; i++) {
      const x = -560 + off + i * sp + (hash(k * 100 + i) - 0.5) * sp * 0.5;
      if (k === 0 && Math.abs(x - HERO.x) < 260) continue;
      ppl.push({ x, y: y + (hash(k * 50 + i) - 0.5) * h * 0.06, h: h * (0.92 + hash(k * 70 + i) * 0.16), s: k * 1000 + i, on: 0.35 + hash(k * 30 + i) * 1.6 });
    }
    rows.push(ppl);
  }
  return rows;
})();

function crowdScene(t) {
  // camera: tight on the hero's hand, then a pull back to the whole crowd; a push in on "FIRE!"
  const pull = ease.inOut(seg(t, T.on + 0.25, T.three - 0.1));
  const z = lerp(2.15, 1, pull) * (1 + 0.06 * ease.out(seg(t, T.three, T.fire)) + 0.05 * ease.out(seg(t, T.fire, T.space)));
  const fx = lerp(840, 540, pull), fy = lerp(880, 1000, pull);
  const shake = t > T.fire && t < T.fire + 0.5 ? (1 - seg(t, T.fire, T.fire + 0.5)) * 10 : 0;
  ctx.save();
  // sky and ground
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#0d1424'); g.addColorStop(0.45, '#1a2438'); g.addColorStop(1, '#232b3d');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.translate(W / 2 + Math.sin(t * 61) * shake, H / 2 + Math.cos(t * 47) * shake); ctx.scale(z, z); ctx.translate(-fx, -fy);
  for (let i = 0; i < 80; i++) circle(-400 + hash(i) * 1900, -900 + hash(i + 40) * 1300, 1.2 + hash(i + 7) * 1.8, rgba('#dfe8ff', 0.25 + 0.3 * hash(i + 3)));
  const gg = ctx.createLinearGradient(0, HORIZON - 80, 0, HORIZON + 1600); gg.addColorStop(0, '#2a3346'); gg.addColorStop(1, '#2f3445');
  ctx.fillStyle = gg; ctx.fillRect(-1500, HORIZON - 40, 4500, 3000);
  // people, far to near, each beam drawn behind the rows in front of it
  const fire = seg(t, T.fire, T.fire + 0.12), boost = 1 + 1.6 * fire * (1 - 0.5 * seg(t, T.fire + 0.4, T.space));
  const tips = [];
  CROWD.forEach((row) => {
    const rowTips = [];
    row.forEach((p) => {
      const tip = person(p.x, p.y, p.h, p.s);
      const a = seg(t, T.on + p.on, T.on + p.on + 0.25);
      if (a > 0) rowTips.push({ ...tip, a, h: p.h });
    });
    beams(rowTips, boost, t);
    tips.push(...rowTips);
  });
  const hero = person(HERO.x, HERO.y, HERO.h, 7, { side: 1, glasses: true, shoe: '#222' });
  const ha = seg(t, T.on - 0.05, T.on + 0.08);
  if (ha > 0) beams([{ ...hero, a: ha, h: HERO.h * 0.55 }], boost, t);
  ctx.restore();
  // the countdown, big and white
  [[T.three, '3'], [T.two, '2'], [T.one, '1']].forEach(([at, s], i) => {
    const nx = [T.two, T.one, T.fire][i];
    if (t < at || t >= nx) return;
    const k = ease.back(seg(t, at, at + 0.18)), out = seg(t, nx - 0.12, nx);
    ctx.save(); ctx.globalAlpha = clamp(k) * (1 - out); ctx.translate(540, 560); ctx.scale(0.6 + 0.4 * k, 0.6 + 0.4 * k);
    ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 30; text(s, 0, 0, 260, 800, '#ffffff', 'center'); ctx.restore();
  });
  // "FIRE!": a green flash
  if (t >= T.fire) {
    const f = 1 - seg(t, T.fire, T.fire + 0.45);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba(LASER, 0.35 * f); ctx.fillRect(0, 0, W, H); ctx.restore();
  }
}
function beams(tips, boost, t) {
  if (!tips.length) return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
  tips.forEach((p) => {
    const dx = VP.x - p.x, dy = VP.y - p.y, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, len = 6000;
    const lw = Math.max(1.2, p.h * 0.006) * (0.7 + 0.3 * boost), a = p.a * Math.min(1, 0.32 * boost);
    line(p.x, p.y, p.x + ux * len, p.y + uy * len, rgba(LASER, a * 0.35), lw * 3);
    line(p.x, p.y, p.x + ux * len, p.y + uy * len, rgba('#c9ffd9', a), lw);
    glow(p.x, p.y, Math.max(8, p.h * 0.05) * (0.8 + 0.2 * boost), LASER, 0.7 * p.a);
  });
  ctx.restore();
}

// ═════════════════════════════════════════════════════════════════════════════
// ACT 1 · space (black, schematic)
// ═════════════════════════════════════════════════════════════════════════════
const DIM = 'rgba(235,235,245,0.55)', SOFT = 'rgba(235,235,245,0.75)';
const URA = { hi: '#c9f1ef', mid: '#97d6d4', lo: '#5ea9ab' };
function space(t, seed = 1) {
  ctx.fillStyle = '#030304'; ctx.fillRect(0, 0, W, H);
  for (let i = 0; i < 120; i++) { const tw2 = 0.6 + 0.4 * Math.sin(t * 2 + i); circle(hash(i * seed) * W, hash(i * seed + 50) * H, 0.8 + hash(i + 9) * 1.4, rgba('#ffffff', (0.12 + 0.3 * hash(i + 20)) * tw2)); }
}
function earth(x, y, r, rim = 1) {
  if (r <= 0) return;
  ctx.save();
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.clip();
  const g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r); g.addColorStop(0, '#2a4a7c'); g.addColorStop(1, '#0c1a33');
  ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2);
  for (let i = 0; i < 26; i++) ellipse(x + (hash(i + 3) - 0.5) * r * 1.8, y + (hash(i + 8) - 0.5) * r * 1.8, r * (0.08 + hash(i) * 0.22), r * (0.04 + hash(i + 1) * 0.1), rgba('#36547d', 0.35), hash(i + 2) * 3);
  for (let i = 0; i < 14; i++) ellipse(x + (hash(i + 33) - 0.5) * r * 1.6, y + (hash(i + 38) - 0.5) * r * 1.6, r * (0.12 + hash(i + 30) * 0.2), r * 0.035, rgba('#c9d6ea', 0.16), -0.3 + hash(i + 31) * 0.6);
  // night side
  const n = ctx.createLinearGradient(x - r, y - r, x + r, y + r); n.addColorStop(0.35, 'rgba(0,0,0,0)'); n.addColorStop(0.75, 'rgba(0,0,0,0.55)');
  ctx.fillStyle = n; ctx.fillRect(x - r, y - r, r * 2, r * 2);
  ctx.restore();
  if (rim > 0) ring(x, y, r, rgba('#5577e6', 0.9 * rim), Math.max(1.5, r * 0.018));
}
function uranus(x, y, r, lit = 0) {
  if (r <= 0) return;
  glow(x, y, r * (1.6 + 0.8 * lit), URA.mid, 0.08 + 0.35 * lit);
  for (let i = 1; i <= 5; i++) ring(x, y, r * (1.08 + i * 0.07), rgba(URA.mid, 0.05 + 0.03 * lit), 1.5);
  ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.clip();
  const g = ctx.createRadialGradient(x - r * 0.25, y - r * 0.3, r * 0.05, x, y, r); g.addColorStop(0, URA.hi); g.addColorStop(0.7, URA.mid); g.addColorStop(1, URA.lo);
  ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2);
  for (let i = 0; i < 9; i++) { const yy = y - r + (i + 0.5) * (2 * r / 9); ctx.fillStyle = rgba(i % 2 ? '#ffffff' : '#3d8f92', 0.05); ctx.fillRect(x - r, yy - r * 0.05, r * 2, r * 0.1); }
  for (let i = 0; i < 6; i++) ellipse(x + (hash(i + 70) - 0.5) * r * 1.4, y + (hash(i + 75) - 0.5) * r * 1.4, r * 0.35, r * 0.06, rgba('#ffffff', 0.05), -0.4 + hash(i) * 0.3);
  if (lit > 0) { ctx.fillStyle = rgba('#ffffff', 0.25 * lit); ctx.fillRect(x - r, y - r, r * 2, r * 2); }
  ctx.restore();
}
function sun(x, y, r) {
  ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.clip();
  const g = ctx.createRadialGradient(x - r * 0.2, y - r * 0.2, r * 0.1, x, y, r); g.addColorStop(0, '#fbe8bb'); g.addColorStop(0.75, '#f1d397'); g.addColorStop(1, '#d9ae6a');
  ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2);
  for (let i = 0; i < 18; i++) { const yy = y - r + i * (2 * r / 18); ctx.fillStyle = rgba('#c99a55', 0.08); ctx.fillRect(x - r, yy, r * 2, r * 0.025); }
  ctx.restore();
  ring(x, y, r, rgba('#b98b4c', 0.6), 3);
}
// The schematic labels: a small tracked label top right; a big title, top left, with small lines under it.
function header(o, a = 1) {
  if (a <= 0.01) return;
  ctx.save(); ctx.globalAlpha *= a;
  if (o.label) text(o.label, 1020, 200, 17, 700, DIM, 'right', 0.22);
  if (o.kicker) text(o.kicker, 60, 216, 17, 700, DIM, 'left', 0.22);
  if (o.title) text(o.title, 60, 258, 52, 800, o.titleCol ?? '#ffffff', 'left', -0.01);
  (o.subs ?? []).forEach((s, i) => text(s, 60, 312 + i * 30, 17, 700, DIM, 'left', 0.2));
  ctx.restore();
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

// B · "Billions of beams shoot into space." — Earth, close, with a sheet of beams leaving it.
const E_FAR = { x: 230, y: 1130, r: 34 }, U_POS = { x: 760, y: 680, r: 150 };
function beamsScene(t) {
  space(t, 1);
  const out = ease.inOut(seg(t, T.trip - 0.45, T.trip + 0.15));
  const ex = lerp(420, E_FAR.x, out), ey = lerp(1060, E_FAR.y, out), er = lerp(280, E_FAR.r, out);
  // the beams: a sheet of parallel lines off the day side, growing toward the top right, light packets running along them
  const ang = -Math.PI * 0.3, ux = Math.cos(ang), uy = Math.sin(ang), nx = -uy, ny = ux;
  const grow = ease.out(seg(t, T.space + 0.05, T.shoot + 0.8)) * 1900;
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = 1 - out;
  for (let i = 0; i < 34; i++) {
    const o = (i / 33 - 0.5) * 2 * er * 0.92, sx = ex + nx * o + ux * Math.sqrt(Math.max(0, er * er - o * o)), sy = ey + ny * o + uy * Math.sqrt(Math.max(0, er * er - o * o));
    const L = grow * (0.85 + 0.15 * hash(i));
    line(sx, sy, sx + ux * L, sy + uy * L, rgba(LASER, 0.16), 4); line(sx, sy, sx + ux * L, sy + uy * L, rgba('#e6ffee', 0.4), 1.6);
    for (let k = 0; k < 3; k++) { const p = ((t - T.space) * 0.9 + hash(i * 3 + k)) % 1, d = p * L; circle(sx + ux * d, sy + uy * d, 2, rgba('#ffffff', 0.55 * (1 - p))); }
  }
  ctx.restore();
  earth(ex, ey, er);
  header({ label: '8 BILLION LASERS', subs: [] }, 1 - out);
  ctx.save(); ctx.globalAlpha = 1 - out; text('LIGHT PATH VISUALIZATION', 1020, 232, 17, 700, DIM, 'right', 0.22); ctx.restore();
}
// C · "But it could take almost three hours, just to reach Uranus."
function tripScene(t) {
  space(t, 2);
  const uin = ease.out(seg(t, T.trip - 0.2, T.trip + 0.5));
  const head = seg(t, T.hours, T.hours + 0.3);
  header({ label: 'EARTH → URANUS', title: '≈3 HOURS', subs: ['ONE WAY · DISTANCE VARIES', 'SCHEMATIC · TIME COMPRESSED'] }, 1);
  if (head < 1) { ctx.save(); ctx.fillStyle = '#030304'; ctx.globalAlpha = 1 - head; ctx.fillRect(40, 220, 400, 70); ctx.restore(); }
  // the beam: a narrow wedge that crawls from Earth to Uranus, arriving on "reach Uranus"
  const k = ease.inOut(seg(t, T.trip + 0.2, T.reach + 0.7));
  const dx = U_POS.x - E_FAR.x, dy = U_POS.y - E_FAR.y, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, nx = -uy, ny = ux;
  const tipX = E_FAR.x + ux * L * k, tipY = E_FAR.y + uy * L * k, wHalf = 4 + 34 * k;
  if (k > 0) {
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const g = ctx.createLinearGradient(E_FAR.x, E_FAR.y, tipX, tipY); g.addColorStop(0, rgba(LASER, 0.7)); g.addColorStop(1, rgba(LASER, 0.35));
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(E_FAR.x + nx * 3, E_FAR.y + ny * 3); ctx.lineTo(tipX + nx * wHalf, tipY + ny * wHalf); ctx.lineTo(tipX - nx * wHalf, tipY - ny * wHalf); ctx.lineTo(E_FAR.x - nx * 3, E_FAR.y - ny * 3); ctx.fill();
    glow(tipX, tipY, 40, LASER, 0.4);
    ctx.restore();
  }
  ctx.save(); ctx.globalAlpha = uin; uranus(U_POS.x, U_POS.y, U_POS.r * (0.9 + 0.1 * uin)); ctx.restore();
  earth(E_FAR.x, E_FAR.y, E_FAR.r);
}
// D · "And the beams keep spreading. By then, one laser could make a spot…" — one beam's cone, opening up.
function spreadScene(t) {
  space(t, 3);
  const f = enter(t, T.spread - 0.1, T.wide + 0.05, 0.3);
  withFade(f, () => {
    header({ label: 'LASER DIVERGENCE', title: 'THE FOOTPRINT EXPANDS', subs: ['EXAMPLE: 0.9 MRAD FULL ANGLE', 'SCHEMATIC · SPREAD EXAGGERATED'] }, 1);
    const src = { x: 540, y: 1300 }, topY = 640, R = 8 + 290 * ease.inOut(seg(t, T.spread + 0.3, T.wide - 0.1));
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i <= 12; i++) { const u = i / 12 - 0.5; line(src.x, src.y, src.x + u * 2 * R, topY + Math.abs(u) * 0, rgba(LASER, 0.22), 1.5); }
    ctx.fillStyle = rgba(LASER, 0.08); ctx.beginPath(); ctx.moveTo(src.x, src.y); ctx.lineTo(src.x - R, topY); ctx.lineTo(src.x + R, topY); ctx.fill();
    ctx.restore();
    circle(540, topY, R, rgba('#1f5a33', 0.55)); ring(540, topY, R, rgba(LASER, 0.45), 2);
    glow(src.x, src.y, 46, LASER, 0.7); circle(src.x, src.y, 7, '#d9ffe5');
  });
}
// E · "…twice as wide as the Sun."
function sunsScene(t) {
  space(t, 4);
  withFade(enter(t, T.wide - 0.05, T.diam + 0.05, 0.3), () => {
    header({ label: 'TWO SUNS, SIDE BY SIDE', kicker: 'ONE LASER\'S FOOTPRINT', title: '≈2 SUNS WIDE', subs: ['EXAMPLE BEAM: 0.9 MRAD'] }, 1);
    const R = 330, cy = 860;
    circle(540, cy, R, rgba('#1f5a33', 0.6)); ring(540, cy, R, rgba(LASER, 0.4), 2);
    const k1 = ease.back(seg(t, T.sun - 0.05, T.sun + 0.3)), k2 = ease.back(seg(t, T.sun + 0.15, T.sun + 0.5)), sr = R * 0.47;
    if (k1 > 0) sun(540 - sr - 4, cy, sr * clamp(k1, 0, 1.2));
    if (k2 > 0) sun(540 + sr + 4, cy, sr * clamp(k2, 0, 1.2));
  });
}
// F · "Uranus is just fifty-one thousand kilometers wide."
function diamScene(t) {
  space(t, 5);
  withFade(enter(t, T.diam - 0.05, T.almost + 0.05, 0.3), () => {
    const k = ease.out(seg(t, T.fifty - 0.4, T.km + 0.6)), n = Math.round(51118 * k);
    header({ label: 'URANUS DIAMETER' }, 1);
    text(n.toLocaleString('en-US'), 60, 258, 60, 800, '#fff', 'left', -0.01);
    text('km', 60 + tw(n.toLocaleString('en-US'), 60, 800, -0.01) + 12, 268, 26, 700, DIM, 'left');
    const r = 320, cy = 880; uranus(540, cy, r * (0.92 + 0.08 * ease.out(seg(t, T.diam, T.diam + 0.5))));
    const d = ease.inOut(seg(t, T.fifty - 0.2, T.km + 0.4)), ly = cy + r + 70;
    if (d > 0) {
      ctx.save(); ctx.globalAlpha = d; line(540 - r * d, ly, 540 + r * d, ly, 'rgba(255,255,255,0.6)', 2);
      line(540 - r * d, ly - 14, 540 - r * d, ly + 14, 'rgba(255,255,255,0.6)', 2); line(540 + r * d, ly - 14, 540 + r * d, ly + 14, 'rgba(255,255,255,0.6)', 2); ctx.restore();
    }
  });
}
// G · "So almost all that light misses." — same scale: the footprint around a speck of a planet.
// At 0.9 mrad over ~3 billion km the spot is ~2.7 million km across, about 53× Uranus.
function missScene(t) {
  space(t, 6);
  withFade(enter(t, T.almost - 0.05, T.weird + 0.05, 0.3), () => {
    header({ label: 'SAME SCALE', title: 'ALMOST ALL MISSES' }, 1);
    const z = ease.inOut(seg(t, T.misses - 0.5, T.misses + 0.5)), cy = 860;
    const R = lerp(320 * 53, 330, z), r = lerp(320, 330 / 53, z);
    if (z > 0) { circle(540, cy, Math.min(R, 3000), rgba('#1f5a33', 0.55 * z)); ring(540, cy, Math.min(R, 3000), rgba(LASER, 0.35 * z), 2); }
    uranus(540, cy, r);
    const lab = seg(t, T.misses + 0.4, T.misses + 0.7);
    if (lab > 0) { ctx.save(); ctx.globalAlpha = lab; line(552, cy, 610, cy, 'rgba(255,255,255,0.6)', 2); text('URANUS', 622, cy + 1, 17, 800, SOFT, 'left', 0.22); ctx.restore(); }
  });
}
// H · "But here's the weird part. Even if Uranus lit up, the light coming back would need another three hours."
function returnScene(t) {
  space(t, 7);
  withFade(enter(t, T.weird - 0.05, T.six + 0.05, 0.3), () => {
    header({ label: 'HYPOTHETICAL RETURN LIGHT', subs: [] }, 1);
    ctx.save(); text('LIGHT PATH · SCHEMATIC', 60, 216, 17, 700, DIM, 'left', 0.22); ctx.restore();
    const lit = ease.out(seg(t, T.litup + 0.2, T.litup + 0.9)) * (0.85 + 0.15 * Math.sin(t * 5));
    uranus(U_POS.x, U_POS.y, U_POS.r, lit);
    earth(E_FAR.x, E_FAR.y, E_FAR.r);
    const k = ease.inOut(seg(t, T.back, T.hours3 + 0.5));
    if (k > 0) {
      const sx = U_POS.x - U_POS.r * 0.7, sy = U_POS.y + U_POS.r * 0.7, x = lerp(sx, E_FAR.x + 24, k), y = lerp(sy, E_FAR.y - 24, k);
      ctx.save(); ctx.setLineDash([4, 10]); line(sx, sy, x, y, 'rgba(255,255,255,0.35)', 2); ctx.setLineDash([]); ctx.restore();
      glow(x, y, 46, '#ffffff', 0.5); circle(x, y, 6, '#ffffff');
    }
    const h = seg(t, T.another, T.another + 0.3);
    if (h > 0) { ctx.save(); ctx.globalAlpha = h; text('+≈3 HOURS', 60, 258, 52, 800, '#fff', 'left', -0.01); text('URANUS → EARTH', 60, 312, 17, 700, DIM, 'left', 0.2); ctx.restore(); }
  });
}
// I · "Six hours, round trip." — a clock spins through six hours.
const CLOCK = { x: 540, y: 880, r: 300 };
function clockFace(t, a, hourAng, minAng, col = 'rgba(255,255,255,0.7)') {
  ctx.save(); ctx.globalAlpha *= a;
  ring(CLOCK.x, CLOCK.y, CLOCK.r, col, 3);
  for (let i = 0; i < 12; i++) { const an = i * Math.PI / 6, r0 = CLOCK.r - (i % 3 ? 16 : 30); line(CLOCK.x + Math.sin(an) * r0, CLOCK.y - Math.cos(an) * r0, CLOCK.x + Math.sin(an) * (CLOCK.r - 4), CLOCK.y - Math.cos(an) * (CLOCK.r - 4), col, i % 3 ? 2 : 3); }
  ctx.lineCap = 'round';
  line(CLOCK.x, CLOCK.y, CLOCK.x + Math.sin(hourAng) * CLOCK.r * 0.5, CLOCK.y - Math.cos(hourAng) * CLOCK.r * 0.5, '#d7f5e6', 7);
  line(CLOCK.x, CLOCK.y, CLOCK.x + Math.sin(minAng) * CLOCK.r * 0.8, CLOCK.y - Math.cos(minAng) * CLOCK.r * 0.8, '#d7f5e6', 4);
  circle(CLOCK.x, CLOCK.y, 9, '#d7f5e6');
  ctx.restore();
}
function sixScene(t) {
  space(t, 8);
  withFade(enter(t, T.six - 0.05, DURATION, 0.3), () => {
    header({ label: 'OUTWARD + RETURN', title: '≈6 HOURS' }, 1);
    const k = ease.inOut(seg(t, T.six, T.pivot + 0.1)), hrs = 6 * k;
    clockFace(t, 1, hrs * Math.PI / 6, hrs * Math.PI * 2);
  });
}

// ═════════════════════════════════════════════════════════════════════════════
// ACT 2 · your business, then MsgHealth (black, a faint grid, brand indigo)
// ═════════════════════════════════════════════════════════════════════════════
const IN = { hi: '#c7c3ff', mid: '#a5a0ff', deep: '#7168ff' };
const MUTED = 'rgba(235,235,245,0.5)';
const RED = C.risk, GREEN = C.healthy, AMBER = C.attention;
const CX = 540, CARD = { x: 100, w: 880 };
function stage(t, glowA = 0.22) {
  ctx.fillStyle = '#050508'; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(255,255,255,0.035)'; ctx.lineWidth = 1;
  ctx.beginPath(); for (let x = 0; x <= W; x += 60) { ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, H); } for (let y = 0; y <= H; y += 60) { ctx.moveTo(0, y + 0.5); ctx.lineTo(W, y + 0.5); } ctx.stroke();
  glow(CX, 860, 720, C.primary, glowA);
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
  { n: 'Ava R.', i: 'AR', c: '#0ea5a4', score: 92, st: 'Healthy', sc: GREEN },
  { n: 'Marcus T.', i: 'MT', c: '#e5803b', score: 85, st: 'Healthy', sc: GREEN },
  { n: 'Priya S.', i: 'PS', c: '#d9468a', score: 61, st: 'Needs attention', sc: AMBER },
  { n: 'Jordan K.', i: 'JK', c: '#6366f1', score: 38, st: 'At risk', sc: RED },
];

// J · "…which is still faster than most businesses notice a regular has stopped coming."
// The clock keeps spinning, faint, now counting weeks since Jordan's last visit. Past 6 weeks it turns red.
const weeksAt = (t) => lerp(3.4, 9, ease.inOut(seg(t, T.pivot + 0.2, T.bytime + 0.2)));
function lapsedScene(t) {
  stage(t, 0.06);
  const lost = t >= T.elsewhere - 0.05;
  withFade(enter(t, T.pivot - 0.05, T.brand, 0.3), () => {
    const wk = weeksAt(t), late = wk >= 6, wkI = Math.floor(wk), d = Math.floor((wk - wkI) * 7);
    header({ label: 'MEANWHILE, AT YOUR SHOP' }, 1);
    text(`${wkI}w ${d}d`, 60, 258, 60, 800, late ? RED : '#fff', 'left', -0.01);
    text('SINCE JORDAN\'S LAST VISIT', 60, 316, 17, 700, DIM, 'left', 0.2);
    // the clock behind, now spinning through days
    const spin = (t - T.pivot) * 9;
    clockFace(t, lost ? 0.22 : 0.35, spin / 12, spin, 'rgba(255,255,255,0.5)');
    // Jordan's card
    const cy = 760, ch = 200, k = ease.out(seg(t, T.pivot + 0.1, T.pivot + 0.45));
    ctx.save(); ctx.globalAlpha *= k * (lost ? 0.5 : 1); ctx.translate(0, (1 - k) * 30);
    fillRR(CARD.x, cy, CARD.w, ch, 26, '#14141c'); strokeRR(CARD.x, cy, CARD.w, ch, 26, late ? rgba(RED, 0.75) : 'rgba(255,255,255,0.14)', late ? 3 : 2);
    avatar(CARD.x + 80, cy + 76, 40, 'JK', PEOPLE[3].c);
    text('Jordan K.', CARD.x + 144, cy + 60, 36, 700, '#fff');
    text(`${wkI}W AGO`, CARD.x + CARD.w - 36, cy + 60, 18, 700, MUTED, 'right', 0.18);
    text('Regular · haircut every 4 weeks', CARD.x + 144, cy + 102, 25, 500, SOFT);
    if (late) { circle(CARD.x + 152, cy + 152, 7, RED); text('NOT BOOKED · NO REPLY', CARD.x + 170, cy + 153, 19, 800, RED, 'left', 0.14); }
    else { circle(CARD.x + 152, cy + 152, 7, MUTED); text('NO NEW BOOKING', CARD.x + 170, cy + 153, 19, 800, MUTED, 'left', 0.14); }
    ctx.restore();
    // "…already booked somewhere else": struck through, then stamped
    const sb = seg(t, T.elsewhere - 0.05, T.elsewhere + 0.3);
    if (sb > 0) {
      ctx.save(); ctx.globalAlpha *= sb;
      const s = '→ booked somewhere else', w = tw(s, 34, 700);
      text(s, CX, 1060, 34, 700, RED, 'center');
      const strike = ease.out(seg(t, T.elsewhere + 0.25, T.elsewhere + 0.55)); line(CX - w / 2 - 6, 1062, CX - w / 2 - 6 + (w + 12) * strike, 1058, RED, 4);
      ctx.restore();
      const st = seg(t, T.elsewhere + 0.6, T.elsewhere + 0.78);
      if (st > 0) {
        ctx.save(); ctx.translate(CX, 1180); ctx.rotate(-0.08); const z = 1 + 0.7 * (1 - ease.out(st)); ctx.scale(z, z); ctx.globalAlpha *= st;
        fillRR(-250, -52, 500, 104, 12, 'rgba(8,8,12,0.9)'); strokeRR(-250, -52, 500, 104, 12, RED, 7);
        text('CUSTOMER LOST', 0, 3, 54, 800, RED, 'center', 0.06);
        ctx.restore();
      }
    }
  });
}
// K · the brand: the logo lands on "MsgHealth…"
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
  if (t >= T.brand) glow(CX, 860, 800, C.primary, 0.5 * (1 - seg(t, T.brand, T.brand + 0.35)));
  withFade(enter(t, T.brand - 0.02, T.every + 0.1, 0.18), () => {
    const s = 1 + 0.25 * (1 - ease.quint(hit));
    ctx.save(); ctx.translate(CX, 860); ctx.scale(s, s); ctx.translate(-CX, -860);
    logoLockup(CX, 860, 92);
    ctx.restore();
  });
}
// L · Client Health: "…scores every customer's health, and flags who's at risk the moment they slip."
function healthScene(t) {
  stage(t, 0.2);
  withFade(enter(t, T.every, T.texts + 0.05), () => {
    eyebrow('CLIENT HEALTH', 500);
    const y0 = 550, rh = 128, open = ease.out(seg(t, T.slip, T.slip + 0.35)), extra = 74 * open;
    card(CARD.x, y0, CARD.w, rh * 4 + 24 + extra);
    PEOPLE.forEach((p, r) => {
      const e = ease.out(seg(t, T.every + 0.05 + r * 0.12, T.every + 0.45 + r * 0.12));
      const y = y0 + 12 + r * rh + rh / 2, jordan = r === 3, flag = jordan ? seg(t, T.flags + 0.5, T.flags + 0.75) : 0;
      ctx.save(); ctx.globalAlpha *= e; ctx.translate(0, (1 - e) * 24);
      if (r) { ctx.fillStyle = 'rgba(255,255,255,0.07)'; ctx.fillRect(CARD.x + 30, y - rh / 2, CARD.w - 60, 2); }
      if (flag > 0) {
        const pulse = 0.5 + 0.5 * Math.sin((t - T.flags) * 9);
        fillRR(CARD.x + 12, y - rh / 2 + 6, CARD.w - 24, rh - 12 + extra, 18, rgba(RED, 0.09 * flag));
        strokeRR(CARD.x + 12, y - rh / 2 + 6, CARD.w - 24, rh - 12 + extra, 18, rgba(RED, (0.5 + 0.3 * pulse) * flag), 3);
      }
      avatar(CARD.x + 72, y, 36, p.i, p.c);
      text(p.n, CARD.x + 128, y - 16, 32, 700, '#fff');
      // scores count up; Jordan's then slides from 78 down to 38 as the flag goes up
      const cnt = ease.out(seg(t, T.every + 0.2 + r * 0.08, T.every + 1.0 + r * 0.08));
      const score = jordan ? Math.round(lerp(78 * cnt, 38, ease.inOut(seg(t, T.flags, T.flags + 0.7)))) : Math.round(p.score * cnt);
      const sc = jordan ? (score <= 45 ? RED : score <= 65 ? AMBER : GREEN) : p.sc;
      const sa = seg(t, T.every + 0.8 + r * 0.08, T.every + 1.1 + r * 0.08);
      if (sa > 0) {
        ctx.save(); ctx.globalAlpha *= sa;
        if (jordan && flag > 0) { ctx.globalAlpha *= flag; tag(CARD.x + 128 + tw('AT RISK', 19, 800, 0.1) + 19 * 1.4, y + 22, 'AT RISK', RED, true, 19); }
        else { const st = jordan ? 'Healthy' : p.st; circle(CARD.x + 136, y + 22, 7, jordan ? GREEN : p.sc); text(st, CARD.x + 152, y + 23, 24, 600, SOFT); }
        ctx.restore();
      }
      const gx = CARD.x + CARD.w - 86;
      ctx.lineWidth = 9; ctx.lineCap = 'round';
      ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.beginPath(); ctx.arc(gx, y, 42, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = sc; ctx.beginPath(); ctx.arc(gx, y, 42, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (score / 100)); ctx.stroke();
      text(String(score), gx, y + 1, 32, 800, '#fff', 'center', -0.02);
      if (jordan && open > 0) {
        ctx.save(); ctx.globalAlpha *= open;
        let x = CARD.x + 128; const cy = y + rh / 2 + 20;
        ['Visit overdue · 2 weeks', 'No reply'].forEach((s) => {
          const w = tw(s, 22, 600) + 36; fillRR(x, cy - 22, w, 44, 22, 'rgba(255,255,255,0.07)'); text(s, x + w / 2, cy + 1, 22, 600, SOFT, 'center'); x += w + 12;
        });
        ctx.restore();
      }
      ctx.restore();
    });
  });
}
// M · "Then it texts them for you, so they book again."
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
  withFade(enter(t, T.texts - 0.05, T.end, 0.3), () => {
    eyebrow('AUTOMATIONS · WIN-BACK', 470);
    const ry = 520; card(CARD.x, ry, CARD.w, 96, { r: 22 });
    let x = CARD.x + 28;
    text('When', x, ry + 49, 26, 600, MUTED); x += tw('When', 26, 600) + 14;
    { const s = 'At risk', w = tw(s, 24, 700) + 36; fillRR(x, ry + 26, w, 44, 22, rgba(RED, 0.16)); text(s, x + w / 2, ry + 49, 24, 700, RED, 'center'); x += w + 18; }
    text('→', x, ry + 48, 28, 700, MUTED); x += 46;
    { const s = 'Send SMS', w = tw(s, 24, 700) + 36; fillRR(x, ry + 26, w, 44, 22, rgba(IN.mid, 0.18)); text(s, x + w / 2, ry + 49, 24, 700, IN.hi, 'center'); }
    const on = ease.out(seg(t, T.texts + 0.05, T.texts + 0.3)), sx = CARD.x + CARD.w - 104;
    fillRR(sx, ry + 28, 76, 40, 20, on > 0.5 ? C.primary : 'rgba(255,255,255,0.16)'); circle(sx + 20 + 36 * on, ry + 48, 15, '#fff');
    const ty = 650, th = 610; card(CARD.x, ty, CARD.w, th);
    avatar(CARD.x + 66, ty + 62, 30, 'JK', PEOPLE[3].c);
    text('Jordan K.', CARD.x + 112, ty + 62, 30, 700, '#fff');
    const up = ease.out(seg(t, T.again + 0.7, T.again + 1.25)), sc = Math.round(lerp(38, 86, up)), col = up > 0.5 ? GREEN : RED;
    { const s = `Health ${sc}`, w = tw(s, 22, 800, 0.04) + 34, bx = CARD.x + CARD.w - 30 - w; fillRR(bx, ty + 40, w, 44, 22, rgba(col, 0.16)); strokeRR(bx, ty + 40, w, 44, 22, rgba(col, 0.5), 1.5); text(s, bx + w / 2, ty + 63, 22, 800, col, 'center', 0.04); }
    ctx.fillStyle = 'rgba(255,255,255,0.07)'; ctx.fillRect(CARD.x + 30, ty + 118, CARD.w - 60, 2);
    const bx = CARD.x + 40, bw = CARD.w - 80;
    const m1 = ease.back(seg(t, T.texts + 0.25, T.texts + 0.6));
    let y = ty + 150 + (1 - clamp(m1)) * 30;
    const h1 = bubble(bx, y, bw, ['Hi Jordan! It\'s been a while.', 'Want your usual, Thursday at 10?'], true, clamp(m1));
    const lab = seg(t, T.texts + 0.6, T.texts + 0.9);
    if (lab > 0) { ctx.save(); ctx.globalAlpha *= lab; text(t > T.again ? 'Sent automatically · SMS · Delivered' : 'Sent automatically · SMS', bx + bw, y + h1 + 28, 21, 600, IN.mid, 'right'); ctx.restore(); }
    const m2 = ease.back(seg(t, T.again - 0.05, T.again + 0.3));
    y = ty + 150 + h1 + 70 + (1 - clamp(m2)) * 30;
    const h2 = bubble(bx, y, bw, ['Yes please! See you then.'], false, clamp(m2));
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
// N · end card: logo, the button gets a tap, the offer, msghealth.net.
function endScene(t) {
  const k = ease.quint(seg(t, T.end, T.end + 0.4));
  stage(t, 0.18 + 0.2 * k);
  if (t < T.end + 0.3) glow(CX, 860, 800, C.primary, 0.45 * (1 - seg(t, T.end, T.end + 0.3)));
  const s = 1 + 0.2 * (1 - k);
  ctx.save(); ctx.globalAlpha = k; ctx.translate(CX, 640); ctx.scale(s, s); ctx.translate(-CX, -640);
  logoLockup(CX, 600, 96);
  text(BRAND.tagline, CX, 710, 32, 500, SOFT, 'center');
  ctx.restore();
  const b = ease.back(seg(t, T.end + 0.35, T.end + 0.75));
  if (b > 0) {
    const press = t > T.tap - 0.06 && t < T.tap + 0.16 ? 0.94 : 1;
    const label = 'Try MsgHealth', bw = tw(label, 44, 800) + 160, bh = 116, by = 830;
    ctx.save(); ctx.globalAlpha = clamp(b); ctx.translate(CX, by + bh / 2); ctx.scale(b * press, b * press); ctx.translate(-CX, -(by + bh / 2));
    glow(CX, by + bh / 2, 360, C.primary, 0.45 + 0.15 * Math.sin(t * 4));
    fillRR(CX - bw / 2, by, bw, bh, bh / 2, C.primary);
    strokeRR(CX - bw / 2, by, bw, bh, bh / 2, 'rgba(255,255,255,0.25)', 2);
    text(label, CX - 30, by + bh / 2 + 2, 44, 800, '#fff', 'center');
    const ax = CX + tw(label, 44, 800) / 2 + 10; ctx.strokeStyle = '#fff'; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(ax, by + bh / 2); ctx.lineTo(ax + 40, by + bh / 2); ctx.moveTo(ax + 24, by + bh / 2 - 16); ctx.lineTo(ax + 40, by + bh / 2); ctx.lineTo(ax + 24, by + bh / 2 + 16); ctx.stroke();
    ctx.restore();
    // the offer, then the URL
    const o = ease.back(seg(t, T.end + 0.8, T.end + 1.1));
    if (o > 0) {
      ctx.save(); ctx.globalAlpha = clamp(o); const s2 = '50% OFF YOUR FIRST MONTH', w = tw(s2, 22, 800, 0.12) + 40;
      ctx.translate(CX, by + bh + 70); ctx.scale(o, o);
      fillRR(-w / 2, -24, w, 48, 10, rgba(GREEN, 0.18)); strokeRR(-w / 2, -24, w, 48, 10, rgba(GREEN, 0.6), 2); text(s2, 0, 1, 22, 800, '#9ff0c0', 'center', 0.12);
      ctx.restore();
    }
    const u = seg(t, T.url, T.url + 0.3);
    ctx.save(); ctx.globalAlpha = u; text(BRAND.url.toUpperCase(), CX, by + bh + 160, 28, 800, IN.mid, 'center', 0.18); ctx.restore();
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

// ── captions: one phrase at a time, bold white with a soft shadow, like the reference ──
// Words between *stars* take the accent: pale gold until the brand, brand indigo after.
const CAPS = [];
VO_CLIPS.forEach((clip, i) => clip.chunks.forEach(([s, off], k) => {
  const at = VO_AT[i] + off, next = k + 1 < clip.chunks.length ? VO_AT[i] + clip.chunks[k + 1][1] : VO_AT[i] + clip.dur + 0.2;
  CAPS.push({ at: at - 0.04, out: Math.min(next - 0.04, i + 1 < VO_AT.length ? VO_AT[i + 1] - 0.04 : Infinity), s, brand: VO_AT[i] >= T.brand });
}));
const CAP_Y = 1440, CAP_SIZE = 50;
function drawCaption(t) {
  const c = CAPS.find((c) => t >= c.at && t < c.out);
  if (!c || (t >= T.three && t < T.fire)) return; // the countdown numbers speak for themselves
  let acc = false;
  const words = c.s.split(' ').map((w) => { if (w.startsWith('*')) acc = true; const o = { w: w.replace(/\*/g, ''), acc }; if (/\*[.,?!…]*$/.test(w)) acc = false; return o; });
  const sp = tw(' ', CAP_SIZE, 800, -0.01);
  words.forEach((w) => (w.width = tw(w.w, CAP_SIZE, 800, -0.01)));
  const tot = words.reduce((p, w) => p + w.width, 0) + sp * (words.length - 1);
  const pop = ease.back(seg(t, c.at, c.at + 0.14)), sc = 0.88 + 0.12 * pop;
  ctx.save(); ctx.translate(CX, CAP_Y); ctx.scale(sc, sc); ctx.translate(-CX, -CAP_Y);
  ctx.shadowColor = 'rgba(0,0,0,0.85)'; ctx.shadowBlur = 18; ctx.shadowOffsetY = 3;
  let x = CX - tot / 2;
  font(CAP_SIZE, 800, -0.01); ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  words.forEach((w) => { ctx.fillStyle = w.acc ? (c.brand ? IN.mid : ACCENT) : '#ffffff'; ctx.fillText(w.w, x, CAP_Y + 2); x += w.width + sp; });
  ctx.restore();
}
// A small brand watermark, right side (hidden while the logo itself is on screen).
function watermark(t) {
  const a = 0.85 * (1 - seg(t, T.brand - 0.3, T.brand)) + 0.85 * seg(t, T.every, T.every + 0.3) * (1 - seg(t, T.end - 0.3, T.end));
  if (a <= 0.01) return;
  ctx.save(); ctx.globalAlpha = a; ctx.shadowColor = 'rgba(0,0,0,0.45)'; ctx.shadowBlur = 8;
  const s = BRAND.url.toUpperCase(), w = tw(s, 17, 800, 0.12), x1 = 1020, y = 400;
  text(s, x1, y, 17, 800, '#fff', 'right', 0.12);
  if (LOGO) ctx.drawImage(LOGO, x1 - w - 42, y - 16, 32, 32);
  ctx.restore();
}

// ── the edit ─────────────────────────────────────────────────────────────────
const SCENES = [
  [0, T.space, crowdScene],
  [T.space, T.trip, beamsScene],
  [T.trip, T.spread, tripScene],
  [T.spread, T.wide, spreadScene],
  [T.wide, T.diam, sunsScene],
  [T.diam, T.almost, diamScene],
  [T.almost, T.weird, missScene],
  [T.weird, T.six, returnScene],
  [T.six, T.pivot, sixScene],
  [T.pivot, T.brand, lapsedScene],
  [T.brand, T.every + 0.1, brandScene],
  [T.every + 0.1, T.texts, healthScene],
  [T.texts, T.end, winbackScene],
  [T.end, DURATION + 1, endScene],
];
function renderFrame(t) {
  ctx = MAIN;
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.filter = 'none'; ctx.globalCompositeOperation = 'source-over'; ctx.shadowBlur = 0; ctx.shadowColor = 'transparent';
  const s = SCENES.find(([a, b]) => t >= a && t < b) ?? SCENES.at(-1);
  s[2](t);
  // a quick white flash on the cut to space
  { const f = 1 - seg(t, T.space, T.space + 0.15); if (t >= T.space && f > 0) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = rgba('#ffffff', 0.6 * f); ctx.fillRect(0, 0, W, H); } }
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.filter = 'none'; ctx.shadowBlur = 0;
  watermark(t);
  drawCaption(t);
}

// Sound cues (sample-based effects; the score, laser zaps and clock ticks are synthesised from window.CUES).
cue(T.on, 'tap', 0.7);
cue(T.space, 'transition', 0.9);
cue(T.trip - 0.2, 'swoosh', 0.7);
cue(T.hours, 'key', 0.7);
cue(T.spread - 0.1, 'swoosh', 0.7);
cue(T.wide - 0.05, 'swish', 0.8);
cue(T.sun, 'key', 0.6); cue(T.sun + 0.15, 'key', 0.6);
cue(T.diam - 0.05, 'swoosh', 0.7);
cue(T.almost - 0.05, 'swoosh', 0.7);
cue(T.misses, 'transition', 0.7);
cue(T.weird - 0.05, 'swoosh', 0.7);
cue(T.hours3 + 0.5, 'ding', 0.6);
cue(T.six - 0.05, 'swish', 0.8);
cue(T.pivot + 0.1, 'notification', 0.7);
cue(T.elsewhere + 0.66, 'punch', 1);
cue(T.brand, 'transitionHit', 1);
[0, 1, 2, 3].forEach((r) => cue(T.every + 0.05 + r * 0.12, 'key', 0.6));
cue(T.flags + 0.5, 'ding', 0.9);
cue(T.texts + 0.1, 'tap', 0.8);
cue(T.texts + 0.35, 'swish', 0.9);
cue(T.again, 'notification', 0.9);
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
