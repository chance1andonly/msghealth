// Realistically-proportioned miniature puppets for the vertical ad.
// Units: 1 head ≈ 104. Anchor (0,0) = base of the neck, between the shoulders.
'use strict';

const PEOPLE = {
  owner: { skin: '#b97d58', skinDark: '#9c6546', hair: '#241812', hairHi: '#4a3326', eye: '#3b2616', lip: '#a2604a', shirt: '#6b7480', shirtDark: '#555d69', pants: '#2c3748', shoes: '#2a2320', hairStyle: 'short', stubble: true },
  sarah: { skin: '#eec3a2', skinDark: '#d9a582', hair: '#8e4424', hairHi: '#b9653a', eye: '#3f5a3a', lip: '#c07466', shirt: '#86a894', shirtDark: '#6c8c79', pants: '#34405a', shoes: '#e9e3d8', hairStyle: 'long' },
};

// Expression presets (blend between them with mixExpr).
const EXPR = {
  neutral:    { bi: 0, bo: 0, knit: 0, lid: 1, smile: 0.08, open: 0, asym: 0 },
  concerned:  { bi: 0.45, bo: 0, knit: 0.55, lid: 1, smile: -0.15, open: 0, asym: 0 },
  confused:   { bi: 0.55, bo: -0.1, knit: 0.35, lid: 1.06, smile: -0.12, open: 0.05, asym: 0.45 },
  frustrated: { bi: -0.25, bo: 0.1, knit: 1, lid: 0.82, smile: -0.35, open: 0, asym: 0 },
  realize:    { bi: 0.55, bo: 0.5, knit: 0, lid: 1.16, smile: 0, open: 0.22, asym: 0 },
  relief:     { bi: 0.25, bo: 0.1, knit: 0, lid: 0.86, smile: 0.5, open: 0, asym: 0 },
  warm:       { bi: 0.15, bo: 0.1, knit: 0, lid: 0.82, smile: 0.85, open: 0.1, asym: 0 },
  calm:       { bi: 0, bo: 0, knit: 0, lid: 0.94, smile: 0.3, open: 0, asym: 0 },
};
function mixExpr(a, b, k) {
  const A = typeof a === 'string' ? EXPR[a] : a, B = typeof b === 'string' ? EXPR[b] : b;
  const o = {}; for (const key in A) o[key] = lerp(A[key], B[key], clamp(k)); return o;
}
// Lip flap for dialogue, on the stop-motion pose grid.
const talkOpen = (on) => (on ? [0.25, 0.75, 0.45, 0.9, 0.15, 0.6, 0.35, 0.8][POSE % 8] : 0);

// ── head ─────────────────────────────────────────────────────────────────────
// Origin = eye line centre. Crown y≈-60, chin y≈+46.
function headPath(k) {
  k.beginPath();
  k.moveTo(0, 47);
  k.bezierCurveTo(14, 47, 27, 40, 33, 28);
  k.bezierCurveTo(38, 17, 40, 4, 40, -8);
  k.bezierCurveTo(41, -38, 24, -61, 0, -61);
  k.bezierCurveTo(-24, -61, -41, -38, -40, -8);
  k.bezierCurveTo(-40, 4, -38, 17, -33, 28);
  k.bezierCurveTo(-27, 40, -14, 47, 0, 47);
  k.closePath();
}
function head(p, o = {}) {
  const c = ctx;
  const e = o.expr ?? EXPR.neutral;
  const turn = o.turn ?? 0;          // -1..1 (screen left / right)
  const [lx, ly] = o.look ?? [0, 0];
  const open = Math.max(e.open, o.talk ?? 0);
  c.save();
  // ears
  cEll(-41 + turn * 4, 2, 6.5, 11, p.skinDark, { shadow: 3, jit: 0.2 });
  cEll(41 + turn * 4, 2, 6.5, 11, p.skinDark, { shadow: 3, jit: 0.2 });
  clay(headPath, p.skin, { x: -41, y: -61, w: 82, h: 108 }, { shadow: 10, jit: 0.25, gloss: 0.7 });
  const fx = turn * 6; // features shift with head turn
  // soft modelling: cheekbone light, temple & jaw shade
  c.save(); headPath(c); c.clip();
  const fg = c.createRadialGradient(-10, -14, 8, 0, 0, 58); // rounded form: light falls off toward the edges
  fg.addColorStop(0, 'rgba(255,236,220,0.16)'); fg.addColorStop(0.6, 'rgba(0,0,0,0)'); fg.addColorStop(1, 'rgba(50,20,10,0.32)');
  c.fillStyle = fg; c.fillRect(-45, -65, 90, 115);
  const jg = c.createLinearGradient(0, 18, 0, 50); jg.addColorStop(0, 'rgba(60,30,20,0)'); jg.addColorStop(1, 'rgba(60,30,20,0.16)');
  c.fillStyle = jg; c.fillRect(-45, 15, 90, 40);
  if (p.stubble) { c.globalAlpha = 0.16; c.fillStyle = '#2a1a12'; c.beginPath(); c.ellipse(fx, 36, 30, 16, 0, 0, Math.PI); c.fill(); c.globalAlpha = 1; }
  for (const s of [-1, 1]) { const g = c.createRadialGradient(fx + s * 22, 14, 0, fx + s * 22, 14, 13); g.addColorStop(0, 'rgba(210,110,100,0.16)'); g.addColorStop(1, 'rgba(210,110,100,0)'); c.fillStyle = g; c.fillRect(fx + s * 22 - 14, 0, 28, 28); }
  c.restore();
  // eyes
  const lid = e.lid * (1 - (o.blink ?? 0));
  for (const s of [-1, 1]) {
    const ex = fx + s * 16, ey = 0, hw = 9.2, hh = 4.4 * clamp(lid, 0.05, 1.3);
    c.save();
    c.beginPath(); c.moveTo(ex - hw, ey); c.quadraticCurveTo(ex, ey - hh * 1.5, ex + hw, ey); c.quadraticCurveTo(ex, ey + hh * 1.05, ex - hw, ey); c.closePath();
    c.fillStyle = '#f7f3ee'; c.fill(); c.clip();
    const ix = ex + lx * 3.2 + turn * 1.5, iy = ey + ly * 1.8 - 0.4;
    c.fillStyle = p.eye; c.beginPath(); c.arc(ix, iy, 4.3, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#0d0907'; c.beginPath(); c.arc(ix, iy, 2.0, 0, Math.PI * 2); c.fill();
    c.fillStyle = 'rgba(40,20,10,0.25)'; c.fillRect(ex - hw, ey - hh * 1.6, hw * 2, hh * 0.9); // lid shadow on the eyeball
    c.fillStyle = 'rgba(255,255,255,0.9)'; c.beginPath(); c.arc(ix - 1.4, iy - 1.4, 1.1, 0, Math.PI * 2); c.fill();
    c.restore();
    // upper lid + lashes, lower lid, crease
    c.save(); c.lineCap = 'round';
    c.strokeStyle = '#1e140f'; c.lineWidth = 1.7;
    c.beginPath(); c.moveTo(ex - hw, ey); c.quadraticCurveTo(ex, ey - hh * 1.5, ex + hw, ey + 0.4); c.stroke();
    c.strokeStyle = 'rgba(60,30,20,0.28)'; c.lineWidth = 1;
    c.beginPath(); c.moveTo(ex - hw + 1.5, ey - 4.2 - hh * 0.4); c.quadraticCurveTo(ex, ey - 7.8 - hh * 0.5, ex + hw - 1, ey - 3.8 - hh * 0.4); c.stroke();
    c.beginPath(); c.moveTo(ex - hw + 2, ey + 1); c.quadraticCurveTo(ex, ey + hh * 1.2 + 1, ex + hw - 1.5, ey + 1); c.stroke();
    c.restore();
    // brows
    const inner = s * 6.5 + fx, outer = s * 25 + fx;
    const by = -11;
    const biY = by - e.bi * 4 + e.knit * 1.8 + (s > 0 ? -e.asym * 2.5 : 0);
    const boY = by - 1 - e.bo * 3 + (s > 0 ? -e.asym * 1.5 : 0);
    const ix2 = inner - s * e.knit * 1.6;
    c.save(); c.fillStyle = p.hairStyle === 'long' ? shade(p.hair, -0.25) : p.hair;
    c.beginPath(); c.moveTo(ix2, biY + 1.6); c.quadraticCurveTo((ix2 + outer) / 2, Math.min(biY, boY) - 3.2, outer, boY + 0.6);
    c.quadraticCurveTo((ix2 + outer) / 2, Math.min(biY, boY) - 0.6, ix2, biY - 1.4); c.closePath(); c.fill();
    c.restore();
  }
  if (e.knit > 0.4) { c.save(); c.strokeStyle = `rgba(80,40,25,${0.25 * e.knit})`; c.lineWidth = 0.9; c.beginPath(); c.moveTo(fx - 2, -12); c.lineTo(fx - 1.5, -6); c.moveTo(fx + 2, -12); c.lineTo(fx + 1.5, -6); c.stroke(); c.restore(); }
  // nose
  c.save();
  const ng = c.createLinearGradient(fx - 6, 0, fx + 6, 0); ng.addColorStop(0, 'rgba(90,45,25,0.18)'); ng.addColorStop(1, 'rgba(90,45,25,0)');
  c.fillStyle = ng; c.beginPath(); c.moveTo(fx - 3, -4); c.quadraticCurveTo(fx - 5, 10, fx - 6, 17); c.lineTo(fx + 1, 17); c.quadraticCurveTo(fx, 8, fx + 1, -4); c.fill();
  c.restore();
  cEll(fx + turn * 1.5, 16, 6.2, 5, shade(p.skin, 0.04), { shadow: 3, jit: 0.2, gloss: 1.2 });
  c.save(); c.fillStyle = 'rgba(60,25,15,0.55)';
  c.beginPath(); c.ellipse(fx - 3.6, 19.6, 2.1, 1.2, 0.3, 0, Math.PI * 2); c.ellipse(fx + 3.6, 19.6, 2.1, 1.2, -0.3, 0, Math.PI * 2); c.fill(); c.restore();
  // mouth
  mouth(p, fx, 30, e.smile, open);
  // hair
  if (p.hairStyle === 'short') hairShort(p); else hairFrontLong(p, turn);
  c.restore();
}
function mouth(p, mx, my, smile, open) {
  const c = ctx;
  const w = 11 + smile * 2.2, cy = -smile * 3.2;
  const oh = open * 7;
  c.save();
  if (oh > 0.6) {
    c.fillStyle = '#3b1714';
    c.beginPath(); c.moveTo(mx - w + 1, my + cy * 0.6); c.quadraticCurveTo(mx, my - 1.5, mx + w - 1, my + cy * 0.6); c.quadraticCurveTo(mx, my + oh + 2, mx - w + 1, my + cy * 0.6); c.fill();
    c.save(); c.clip(); c.fillStyle = '#f2ede6'; c.fillRect(mx - w, my - 3, w * 2, 3.2 + oh * 0.18); c.fillStyle = '#b8575a'; c.beginPath(); c.ellipse(mx, my + oh + 1, w * 0.55, 3.5, 0, 0, Math.PI * 2); c.fill(); c.restore();
  }
  // upper lip
  c.fillStyle = shade(p.lip, -0.08);
  c.beginPath(); c.moveTo(mx - w, my + cy);
  c.quadraticCurveTo(mx - w * 0.45, my - 3.2, mx - 1.2, my - 2.4); c.quadraticCurveTo(mx, my - 1.6, mx + 1.2, my - 2.4);
  c.quadraticCurveTo(mx + w * 0.45, my - 3.2, mx + w, my + cy);
  c.quadraticCurveTo(mx, my + 0.8 + (oh > 0.6 ? -0.6 : 0), mx - w, my + cy); c.fill();
  // lower lip
  const lo = oh > 0.6 ? oh : 0;
  c.fillStyle = p.lip;
  c.beginPath(); c.moveTo(mx - w + 1.5, my + cy + 0.6 + lo * 0.4);
  c.quadraticCurveTo(mx, my + 1.2 + lo, mx + w - 1.5, my + cy + 0.6 + lo * 0.4);
  c.quadraticCurveTo(mx, my + 7.2 + lo, mx - w + 1.5, my + cy + 0.6 + lo * 0.4); c.fill();
  c.fillStyle = 'rgba(255,240,230,0.25)'; c.beginPath(); c.ellipse(mx, my + 4 + lo, w * 0.35, 1.2, 0, 0, Math.PI * 2); c.fill();
  // mouth line & corners
  c.strokeStyle = 'rgba(50,20,15,0.55)'; c.lineWidth = 1.1; c.lineCap = 'round';
  if (oh <= 0.6) { c.beginPath(); c.moveTo(mx - w, my + cy); c.quadraticCurveTo(mx, my + 1.2, mx + w, my + cy); c.stroke(); }
  if (smile > 0.3) { c.strokeStyle = `rgba(80,40,25,${0.3 * smile})`; for (const s of [-1, 1]) { c.beginPath(); c.arc(mx + s * (w + 1), my + cy - 2, 4, s > 0 ? 0.2 : Math.PI - 1.2, s > 0 ? 1.2 : Math.PI - 0.2); c.stroke(); } }
  c.restore();
}
function hairShort(p) {
  clay((k) => {
    k.beginPath(); k.moveTo(-41, -6);
    k.bezierCurveTo(-45, -40, -30, -68, 0, -69); k.bezierCurveTo(30, -68, 45, -40, 41, -6);
    k.bezierCurveTo(39, -18, 36, -26, 30, -32); k.bezierCurveTo(18, -38, 6, -34, -6, -39);
    k.bezierCurveTo(-18, -35, -30, -34, -35, -24); k.bezierCurveTo(-38, -18, -40, -12, -41, -6); k.closePath();
  }, p.hair, { x: -45, y: -69, w: 90, h: 63 }, { shadow: 6, jit: 0.25, gloss: 0.6 });
  const c = ctx; c.save(); c.strokeStyle = rgba(p.hairHi, 0.55); c.lineWidth = 1.4; c.lineCap = 'round';
  for (let i = 0; i < 14; i++) { const x = -32 + i * 4.8, y = -60 + Math.abs(i - 7) * 1.6; c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + 4, y - 4, x + 7, y - 2 + (i % 3)); c.stroke(); }
  c.restore();
}
function hairBackLong(p) {
  clay((k) => { k.beginPath(); k.moveTo(-44, -20); k.bezierCurveTo(-60, 40, -66, 120, -58, 170); k.lineTo(58, 170); k.bezierCurveTo(66, 120, 60, 40, 44, -20); k.bezierCurveTo(40, -70, -40, -70, -44, -20); k.closePath(); },
    p.hair, { x: -66, y: -70, w: 132, h: 240 }, { shadow: 8, jit: 0.25 });
}
function hairFrontLong(p, turn) {
  clay((k) => {
    k.beginPath(); k.moveTo(-43, 30);
    k.bezierCurveTo(-48, -20, -38, -66, 2, -68); k.bezierCurveTo(38, -68, 50, -30, 44, 20);
    k.bezierCurveTo(40, -8, 34, -30, 20, -40); k.bezierCurveTo(8, -30, -14, -26, -32, -14);
    k.bezierCurveTo(-36, 0, -38, 14, -43, 30); k.closePath();
  }, p.hair, { x: -48, y: -68, w: 96, h: 98 }, { shadow: 6, jit: 0.25, gloss: 0.8 });
  const c = ctx; c.save(); c.strokeStyle = rgba(p.hairHi, 0.5); c.lineWidth = 1.3;
  for (let i = 0; i < 6; i++) { c.beginPath(); c.moveTo(-20 + i * 9, -60); c.quadraticCurveTo(-30 + i * 6, -40, -38 + i * 3, -10); c.stroke(); }
  c.restore();
}

// ── body ─────────────────────────────────────────────────────────────────────
function torsoPath(k) {
  k.beginPath(); k.moveTo(-23, -16);
  k.bezierCurveTo(-34, -2, -62, 4, -82, 14); k.quadraticCurveTo(-98, 24, -96, 64);
  k.lineTo(-80, 300); k.lineTo(80, 300); k.lineTo(96, 64);
  k.quadraticCurveTo(98, 24, 82, 14); k.bezierCurveTo(62, 4, 34, -2, 23, -16);
  k.quadraticCurveTo(0, 6, -23, -16); k.closePath();
}
function torso(p) {
  clay(torsoPath, p.shirt, { x: -94, y: -2, w: 188, h: 302 }, { shadow: 14, jit: 0.3 });
  const c = ctx; c.save(); torsoPath(c); c.clip();
  // fabric folds
  c.strokeStyle = 'rgba(20,25,35,0.12)'; c.lineWidth = 2;
  for (const [x1, y1, x2, y2] of [[-50, 120, -30, 200], [40, 110, 55, 190], [-10, 230, 20, 280]]) { c.beginPath(); c.moveTo(x1, y1); c.quadraticCurveTo((x1 + x2) / 2 + 8, (y1 + y2) / 2, x2, y2); c.stroke(); }
  c.restore();
  if (p.hairStyle === 'short') { // henley placket & buttons
    cRect(-7, 6, 14, 62, 4, p.shirtDark, { shadow: 2, jit: 0.2 });
    for (let i = 0; i < 3; i++) cEll(0, 16 + i * 18, 2.6, 2.6, '#d9d3c8', { shadow: 1, jit: 0.1 });
  } else { // knit collar
    c.save(); c.strokeStyle = p.shirtDark; c.lineWidth = 5; c.beginPath(); c.moveTo(-24, -1); c.quadraticCurveTo(0, 16, 24, -1); c.stroke(); c.restore();
  }
}
function neck(p) {
  clay((k) => { k.beginPath(); k.moveTo(-21, -46); k.lineTo(21, -46); k.quadraticCurveTo(21, -20, 27, -8); k.quadraticCurveTo(0, 4, -27, -8); k.quadraticCurveTo(-21, -20, -21, -46); k.closePath(); },
    p.skinDark, { x: -27, y: -46, w: 54, h: 50 }, { shadow: 4, jit: 0.2 });
}
// Two-bone IK: returns elbow for shoulder S, wrist target T.
function ik(sx, sy, tx, ty, l1, l2, bend) {
  let dx = tx - sx, dy = ty - sy, d = Math.hypot(dx, dy);
  const maxd = l1 + l2 - 0.5; if (d > maxd) { tx = sx + dx / d * maxd; ty = sy + dy / d * maxd; dx = tx - sx; dy = ty - sy; d = maxd; }
  const a = Math.atan2(dy, dx), cosA = clamp((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d), -1, 1);
  const ang = a + bend * Math.acos(cosA);
  return [sx + Math.cos(ang) * l1, sy + Math.sin(ang) * l1, tx, ty];
}
// Arm: side -1 = figure's right (screen left when facing camera), wrist target in anchor space.
function arm(p, side, spec) {
  const sx = side * 76, sy = 30;
  const [ex, ey, wx, wy] = ik(sx, sy, spec.to[0], spec.to[1], spec.l1 ?? 138, spec.l2 ?? 124, spec.bend ?? (side < 0 ? 1 : -1));
  cCap(sx, sy, ex, ey, 21, p.shirt, { shadow: 8, jit: 0.3 });
  const cuffX = ex + (wx - ex) * 0.42, cuffY = ey + (wy - ey) * 0.42;
  cCap(ex, ey, cuffX, cuffY, 18, p.shirt, { shadow: 6, jit: 0.3 });
  cCap(cuffX, cuffY, wx, wy, 13.5, p.skinDark, { shadow: 6, jit: 0.3 });
  cCap(ex - (ex - cuffX) * 0.1, ey, cuffX, cuffY, 19, p.shirtDark, { shadow: 0, jit: 0.3, tex: 0.3 }); // rolled sleeve
  const ang = spec.angle ?? Math.atan2(wy - ey, wx - ex);
  if (spec.kind !== 'none') hand(p, wx, wy, ang, spec.kind ?? 'rest', side, spec);
}

// ── hands ────────────────────────────────────────────────────────────────────
// Every finger is its own piece, with a hairline gap, so nothing merges.
function finger(x1, y1, x2, y2, r, col, hi) {
  cCap(x1, y1, x2, y2, r, col, { shadow: 3, jit: 0.15, gloss: 0.8 });
  ctx.save(); ctx.strokeStyle = 'rgba(70,35,20,0.35)'; ctx.lineWidth = 0.8;
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.globalAlpha = 0; ctx.stroke(); ctx.restore();
  if (hi) cEll(x2, y2, r * 0.55, r * 0.45, shade(col, 0.18), { shadow: 0, tex: 0, jit: 0.1 }); // nail
}
function hand(p, x, y, ang, kind, side, spec = {}) {
  const c = ctx; c.save(); c.translate(x, y); c.rotate(ang - Math.PI / 2); // local +y = along the forearm, away from wrist
  const col = p.skin, dk = p.skinDark;
  if (kind === 'wave') {
    c.rotate(side * 0.1);
    cBlob(0, 26, 22, 26, col, { seed: 31 + side, wob: 0.02, shadow: 6, jit: 0.2 });
    [-14, -5, 4, 13].forEach((fx, i) => finger(fx * 1.1, 34, fx * 1.5, 72 + (i === 1 || i === 2 ? 6 : 0) - (i === 3 ? 8 : 0), 5.2, col, true));
    finger(side * -20, 22, side * -40, 38, 6, col, true);
  } else if (kind === 'rest') { // relaxed, fingers gently curled toward the palm
    cBlob(0, 22, 20, 22, col, { seed: 41 + side, wob: 0.02, shadow: 6, jit: 0.2 });
    [-12, -4, 4, 12].forEach((fx) => finger(fx, 34, fx * 0.9, 50, 5, dk, false));
    finger(side * -18, 16, side * -22, 34, 5.5, col, false);
  } else if (kind === 'fist') {
    cBlob(0, 24, 21, 21, col, { seed: 43, wob: 0.02, shadow: 6, jit: 0.2 });
    [-12, -4, 4, 12].forEach((fx) => cEll(fx, 40, 5.4, 6, dk, { shadow: 2, jit: 0.1 }));
  } else if (kind === 'mouse') { // resting on a mouse, fingers on the buttons
    cEll(0, 34, 26, 16, '#23262e', { shadow: 6, jit: 0.1, gloss: 1.2 }); // mouse under palm
    cBlob(0, 24, 20, 18, col, { seed: 45, wob: 0.02, shadow: 4, jit: 0.2 });
    [-9, -1, 7].forEach((fx) => finger(fx, 30, fx, 44, 4.8, col, true));
  }
  c.restore();
}
// A phone held in one hand. view: 'back' (we see the case; fingers wrap across it)
// or 'screen' (we see the screen; thumb on the edge, fingertips peek on the far side).
function heldPhone(p, x, y, w, h, rot, view, screenFn, glow = 0) {
  // hand parts are sized in body units (a real hand), independent of the phone size
  const c = ctx; c.save(); c.translate(x, y); c.rotate(rot);
  const r = w * 0.17;
  cBlob(w / 2 + 4, h * 0.2, 17, 25, p.skin, { seed: 51, wob: 0.02, shadow: 6, jit: 0.2 }); // palm behind the phone's near edge
  if (view === 'back') {
    cRect(-w / 2, -h / 2, w, h, r, '#1c2130', { shadow: 10, jit: 0.1, gloss: 1.4 });
    cRect(-w / 2 + 5, -h / 2 + 5, 19, 19, 6, '#2a3042', { shadow: 2, jit: 0.1 });
    cEll(-w / 2 + 11, -h / 2 + 11, 3.2, 3.2, '#0b0d14', { shadow: 0, jit: 0 });
    for (let i = 0; i < 4; i++) { // fingers wrap around the far edge and rest on the back
      const fy = h * 0.02 + i * 10.5, len = [20, 23, 21, 16][i];
      cCap(-w / 2 - 3, fy, -w / 2 + len, fy + 1.5, 5.2, p.skin, { shadow: 3, jit: 0.12 });
      c.save(); c.strokeStyle = 'rgba(70,35,20,0.35)'; c.lineWidth = 0.7; c.beginPath(); c.moveTo(-w / 2 + len * 0.45, fy - 4.6); c.lineTo(-w / 2 + len * 0.45, fy + 5.8); c.stroke(); c.restore(); // knuckle crease
    }
    if (glow > 0) { c.save(); c.globalCompositeOperation = 'screen'; c.globalAlpha = glow; c.fillStyle = '#9fb7ff'; c.fillRect(-w / 2, -h / 2 - 3, w, 3); c.restore(); }
  } else {
    cRect(-w / 2, -h / 2, w, h, r, '#11141c', { shadow: 14, jit: 0.1, gloss: 1.2 });
    const b = w * 0.04;
    c.save(); c.beginPath(); c.roundRect(-w / 2 + b, -h / 2 + b, w - 2 * b, h - 2 * b, r * 0.8); c.clip();
    c.translate(-w / 2 + b, -h / 2 + b);
    screenFn?.(w - 2 * b, h - 2 * b);
    c.restore();
    for (let i = 0; i < 3; i++) cEll(-w / 2 - 1.5, h * 0.08 + i * 10.5, 4.2, 5, p.skin, { shadow: 2, jit: 0.12 }); // fingertips on the far edge
    cCap(w / 2 + 8, h * 0.42, w / 2 - 5, h * 0.27, 6, p.skin, { shadow: 5, jit: 0.12 }); // thumb over the near edge
    cEll(w / 2 - 5, h * 0.27, 4, 3.6, shade(p.skin, 0.16), { shadow: 0, tex: 0, jit: 0.1 });
  }
  c.restore();
  return [x + Math.cos(rot) * (w / 2 + 6) - Math.sin(rot) * (h * 0.2 + 22), y + Math.sin(rot) * (w / 2 + 6) + Math.cos(rot) * (h * 0.2 + 22)]; // wrist point
}

// Upper body (waist up) in front view.  o: {x,y,s,who,expr,look,turn,tilt,talk,blink,armL,armR,lean}
function puppet(o) {
  const p = PEOPLE[o.who];
  const c = ctx; c.save(); c.translate(o.x, o.y); c.scale(o.s ?? 1, o.s ?? 1);
  c.rotate(o.lean ?? 0);
  if (p.hairStyle === 'long') { c.save(); c.translate(0, -72); hairBackLong(p); c.restore(); }
  if (o.armsBehind) { if (o.armL) arm(p, -1, o.armL); if (o.armR) arm(p, 1, o.armR); }
  torso(p);
  neck(p);
  c.save(); c.translate(o.headDX ?? 0, -72); c.rotate(o.tilt ?? 0);
  const hp = { ...p, hairStyle: p.hairStyle };
  head(hp.hairStyle === 'long' ? { ...hp } : hp, o);
  logBox('face', -41, -61, 41, 47);
  c.restore();
  if (!o.armsBehind && !o.noArms) { if (o.armL) arm(p, -1, o.armL); if (o.armR) arm(p, 1, o.armR); }
  o.after?.();
  c.restore();
}
// Arms only, same placement as puppet(o): lets a desk sit between torso and hands.
function puppetArms(o) {
  const p = PEOPLE[o.who];
  const c = ctx; c.save(); c.translate(o.x, o.y); c.scale(o.s ?? 1, o.s ?? 1); c.rotate(o.lean ?? 0);
  if (o.armL) arm(p, -1, o.armL); if (o.armR) arm(p, 1, o.armR);
  c.restore();
}
// Back of head & shoulder for over-the-shoulder shots.
function shoulderBack(o) {
  const p = PEOPLE[o.who];
  const c = ctx; c.save(); c.translate(o.x, o.y); c.scale(o.s ?? 1, o.s ?? 1);
  clay(torsoPath, p.shirt, { x: -94, y: -2, w: 188, h: 302 }, { shadow: 14, jit: 0.2 });
  neck(p);
  c.translate(0, -72);
  if (p.hairStyle === 'long') {
    clay((k) => { k.beginPath(); k.moveTo(-44, -20); k.bezierCurveTo(-58, 40, -64, 120, -56, 190); k.lineTo(56, 190); k.bezierCurveTo(64, 120, 58, 40, 44, -20); k.bezierCurveTo(40, -72, -40, -72, -44, -20); k.closePath(); }, p.hair, { x: -64, y: -72, w: 128, h: 262 }, { shadow: 8, jit: 0.2 });
  } else {
    cEll(-41, 2, 6.5, 11, p.skinDark, { shadow: 3, jit: 0.2 }); cEll(41, 2, 6.5, 11, p.skinDark, { shadow: 3, jit: 0.2 });
    clay(headPath, p.skin, { x: -41, y: -61, w: 82, h: 108 }, { shadow: 8, jit: 0.2 });
    clay((k) => { k.beginPath(); k.moveTo(-42, 10); k.bezierCurveTo(-48, -40, -30, -69, 0, -69); k.bezierCurveTo(30, -69, 48, -40, 42, 10); k.bezierCurveTo(20, 22, -20, 22, -42, 10); k.closePath(); }, p.hair, { x: -48, y: -69, w: 96, h: 91 }, { shadow: 6, jit: 0.2 });
  }
  c.restore();
}
// Full figure standing (for the doorway), anchor = feet centre. Height ≈ 700 units.
function standing(o) {
  const p = PEOPLE[o.who];
  const c = ctx; c.save(); c.translate(o.x, o.y); c.scale(o.s ?? 1, o.s ?? 1);
  contact(0, 4, 90, 14, 0.3);
  for (const s of [-1, 1]) { // legs & shoes
    cCap(s * 30, -310, s * 26, -170, 30, p.pants, { shadow: 8, jit: 0.2 });
    cCap(s * 26, -170, s * 24, -26, 25, p.pants, { shadow: 8, jit: 0.2 });
    cEll(s * 26 + 8, -12, 34, 15, p.shoes, { shadow: 6, jit: 0.15, gloss: 1.2 });
  }
  c.restore();
  puppet({ ...o, x: o.x, y: o.y - 610 * (o.s ?? 1) });
}

// Text-audit hook for faces / important regions (screen-space box).
function logBox(kind, x0, y0, x1, y1) {
  if (!window.TEXT_LOG) return;
  const T = ctx.getTransform(); const xs = [], ys = [];
  for (const [px, py] of [[x0, y0], [x1, y0], [x0, y1], [x1, y1]]) { const q = T.transformPoint(new DOMPoint(px, py)); xs.push(q.x); ys.push(q.y); }
  window.TEXT_LOG.push({ box: kind, x0: Math.min(...xs), y0: Math.min(...ys), x1: Math.max(...xs), y1: Math.max(...ys), a: ctx.globalAlpha, layer: ctx === MAIN ? 'main' : LAYERS.indexOf(ctx) });
}
