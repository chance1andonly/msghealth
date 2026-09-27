// Realistically-proportioned miniature puppets for the vertical ad.
// Units: 1 head ≈ 104. Anchor (0,0) = base of the neck, between the shoulders.
'use strict';

const PEOPLE = {
  owner: { skin: '#C98B63', skinDark: '#A86D4B', hair: '#2A1C16', hairHi: '#5A3B2A', brow: '#2A1C16', eye: '#3b2616', lip: '#a2604a', shirt: '#6F7C8C', shirtDark: '#556170', pants: '#2c3748', shoes: '#2a2320', hairStyle: 'short', stubble: true },
  sarah: { skin: '#F1C7A6', skinDark: '#DDA380', hair: '#A34B22', hairHi: '#CF7440', brow: '#7A3417', eye: '#3f5a3a', lip: '#c07466', shirt: '#86a894', shirtDark: '#6c8c79', pants: '#34405a', shoes: '#e9e3d8', hairStyle: 'long' },
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

// ── head (cut paper) ─────────────────────────────────────────────────────────
// Origin = eye line centre. Every feature is a separate flat piece of card.
function headPath(k) {
  k.beginPath();
  k.moveTo(0, 46);
  k.bezierCurveTo(20, 46, 36, 34, 39, 12);
  k.bezierCurveTo(42, -14, 36, -60, 0, -62);
  k.bezierCurveTo(-36, -60, -42, -14, -39, 12);
  k.bezierCurveTo(-36, 34, -20, 46, 0, 46);
  k.closePath();
}
function head(p, o = {}) {
  const c = ctx;
  const e = o.expr ?? EXPR.neutral;
  const turn = o.turn ?? 0;
  const [lx, ly] = o.look ?? [0, 0];
  const open = Math.max(e.open, o.talk ?? 0);
  const fx = turn * 7;
  c.save();
  cEll(-40 + turn * 4, 4, 8, 12, p.skinDark, { shadow: 4 });
  cEll(40 + turn * 4, 4, 8, 12, p.skinDark, { shadow: 4 });
  clay(headPath, p.skin, { x: -42, y: -62, w: 84, h: 108 }, { shadow: 10 });
  // cheeks: two pink paper dots
  for (const s of [-1, 1]) { c.save(); c.globalAlpha *= 0.45 + e.smile * 0.25; cEll(fx + s * 25, 17, 7.5, 5.5, '#E88E86', { shadow: 0, tex: 0.4 }); c.restore(); }
  // eyes: dark card ovals with a punched highlight; lids close as a paper strip
  const lid = clamp(e.lid * (1 - (o.blink ?? 0)), 0, 1.3);
  for (const s of [-1, 1]) {
    const ex = fx + s * 15 + lx * 2.6, ey = 0 + ly * 1.8;
    if (lid < 0.25) {
      cCap(ex - 5.5, ey + 1, ex + 5.5, ey + 1, 1.6, '#1B1410', { shadow: 0 });
    } else if (e.smile > 0.6 && lid < 0.9) { // happy squint: upturned arcs of card
      c.save(); c.strokeStyle = '#1B1410'; c.lineWidth = 3; c.lineCap = 'round';
      c.beginPath(); c.arc(ex, ey + 3, 5.5, Math.PI * 1.15, Math.PI * 1.85); c.stroke(); c.restore();
    } else {
      cEll(ex, ey, 3.9, 4.6 * clamp(lid, 0.3, 1.25), '#1B1410', { shadow: 1.5 });
      c.save(); c.fillStyle = '#FFFFFF'; c.beginPath(); c.arc(ex - 1.2, ey - 1.6, 1.2, 0, 7); c.fill(); c.restore();
    }
    // brow: a torn strip of hair-coloured card
    const inner = fx + s * 6, outer = fx + s * 23;
    const yi = -13 - e.bi * 4.5 + e.knit * 2 + (s > 0 ? -e.asym * 3 : 0);
    const yo = -14 - e.bo * 3.5 + (s > 0 ? -e.asym * 1.5 : 0);
    cCap(inner - s * e.knit * 1.5, yi, outer, yo, 2.3, p.brow ?? shade(p.hair, -0.1), { shadow: 1.5 });
  }
  // nose: one small folded piece
  clay((k) => { k.beginPath(); k.moveTo(fx - 1, 4); k.quadraticCurveTo(fx + 7, 15, fx + 5, 19); k.quadraticCurveTo(fx - 1, 21, fx - 5, 18); k.closePath(); }, p.skinDark, { x: fx - 5, y: 4, w: 12, h: 17 }, { shadow: 2 });
  mouth(p, fx, 29, e.smile, open);
  if (p.hairStyle === 'short') hairShort(p); else hairFrontLong(p, turn);
  c.restore();
}
function mouth(p, mx, my, smile, open) {
  const c = ctx;
  const w = 9 + smile * 3.5;
  if (open > 0.15) { // open mouth: dark card with a tongue
    const oh = 3 + open * 8;
    clay((k) => { k.beginPath(); k.moveTo(mx - w, my - smile * 2); k.quadraticCurveTo(mx, my + 1 - smile, mx + w, my - smile * 2); k.quadraticCurveTo(mx + w * 0.7, my + oh, mx, my + oh + 1); k.quadraticCurveTo(mx - w * 0.7, my + oh, mx - w, my - smile * 2); k.closePath(); },
      '#3A1512', { x: mx - w, y: my - 3, w: w * 2, h: oh + 4 }, { shadow: 1.5, tex: 0.3 });
    cEll(mx, my + oh - 1.5, w * 0.45, Math.max(1.5, oh * 0.28), '#D46A6A', { shadow: 0, tex: 0 });
    if (smile > 0.3) cRect(mx - w * 0.6, my - 1.5, w * 1.2, 2.6, 1, '#F6F1E8', { shadow: 0, tex: 0 });
  } else if (Math.abs(smile) < 0.12) {
    cCap(mx - w * 0.8, my, mx + w * 0.8, my, 1.5, '#5A2520', { shadow: 0 });
  } else { // smile / frown: a curved strip of card
    const lift = smile * 6;
    clay((k) => { k.beginPath(); k.moveTo(mx - w, my - lift * 0.9); k.quadraticCurveTo(mx, my + lift * 1.1, mx + w, my - lift * 0.9); k.quadraticCurveTo(mx, my + lift * 1.1 + 3.2, mx - w, my - lift * 0.9); k.closePath(); },
      '#5A2520', { x: mx - w, y: my - 6, w: w * 2, h: 12 }, { shadow: 1 });
  }
}
function hairShort(p) {
  clay((k) => {
    k.beginPath(); k.moveTo(-41, -4);
    k.bezierCurveTo(-46, -46, -24, -70, 2, -70); k.bezierCurveTo(30, -70, 46, -46, 41, -4);
    k.lineTo(36, -24); k.lineTo(28, -30); k.lineTo(18, -34); k.lineTo(8, -32); k.lineTo(-4, -38); k.lineTo(-16, -34); k.lineTo(-28, -32); k.lineTo(-36, -22); k.closePath();
  }, p.hair, { x: -46, y: -70, w: 92, h: 66 }, { shadow: 6 });
  for (const [x1, y1, x2, y2] of [[-22, -52, -8, -62], [-6, -56, 10, -64], [12, -54, 24, -60]]) cCap(x1, y1, x2, y2, 1.8, p.hairHi, { shadow: 1 }); // cut strands
}
function hairBackLong(p) {
  clay((k) => { k.beginPath(); k.moveTo(-44, -20); k.bezierCurveTo(-58, 40, -64, 120, -56, 168); k.lineTo(-30, 158); k.lineTo(-8, 170); k.lineTo(14, 160); k.lineTo(34, 170); k.lineTo(56, 164); k.bezierCurveTo(64, 120, 58, 40, 44, -20); k.bezierCurveTo(40, -72, -40, -72, -44, -20); k.closePath(); },
    p.hair, { x: -64, y: -72, w: 128, h: 242 }, { shadow: 8 });
}
function hairFrontLong(p) {
  clay((k) => {
    k.beginPath(); k.moveTo(-44, 34);
    k.bezierCurveTo(-50, -24, -36, -70, 4, -70); k.bezierCurveTo(40, -70, 50, -30, 44, 26);
    k.lineTo(38, -4); k.lineTo(30, -26); k.lineTo(14, -38); k.lineTo(-2, -30); k.lineTo(-18, -22); k.lineTo(-32, -10); k.lineTo(-37, 10); k.closePath();
  }, p.hair, { x: -50, y: -70, w: 100, h: 104 }, { shadow: 6 });
  for (const [x1, y1, x2, y2] of [[-26, -40, -12, -60], [-8, -48, 8, -64], [14, -46, 26, -58]]) cCap(x1, y1, x2, y2, 1.8, p.hairHi, { shadow: 1 }); // cut strands
}

// ── body (cut paper) ─────────────────────────────────────────────────────────
function torsoPath(k) {
  k.beginPath(); k.moveTo(-23, -16);
  k.bezierCurveTo(-34, -2, -62, 4, -82, 14); k.quadraticCurveTo(-98, 24, -96, 64);
  k.lineTo(-80, 300); k.lineTo(80, 300); k.lineTo(96, 64);
  k.quadraticCurveTo(98, 24, 82, 14); k.bezierCurveTo(62, 4, 34, -2, 23, -16);
  k.quadraticCurveTo(0, 6, -23, -16); k.closePath();
}
function torso(p) {
  clay(torsoPath, p.shirt, { x: -94, y: -16, w: 188, h: 316 }, { shadow: 14 });
  if (p.hairStyle === 'short') { // henley: placket strip + punched buttons
    for (let i = 0; i < 3; i++) cEll(0, 34 + i * 20, 3, 3, '#E8E2D6', { shadow: 1.5 });
    cRect(-60, 180, 48, 56, 6, p.shirtDark, { shadow: 3 }); // pocket
  } else { // sweater: rib collar and hem strips
    clay((k) => { k.beginPath(); k.moveTo(-26, -14); k.quadraticCurveTo(0, 10, 26, -14); k.lineTo(22, -4); k.quadraticCurveTo(0, 18, -22, -4); k.closePath(); }, p.shirtDark, { x: -26, y: -14, w: 52, h: 32 }, { shadow: 2 });
    cRect(-80, 272, 160, 28, 4, p.shirtDark, { shadow: 2 });
  }
}
function neck(p) {
  clay((k) => { k.beginPath(); k.moveTo(-21, -46); k.lineTo(21, -46); k.quadraticCurveTo(21, -20, 27, -8); k.quadraticCurveTo(0, 4, -27, -8); k.quadraticCurveTo(-21, -20, -21, -46); k.closePath(); },
    p.skinDark, { x: -27, y: -46, w: 54, h: 50 }, { shadow: 4 });
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
  cCap(cuffX, cuffY, wx, wy, 13.5, p.skin, { shadow: 6, jit: 0.1 });
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
    // camera plateau with three lenses, flash and sensor (iPhone Pro layout)
    const bx = -w / 2 + 3.5, by = -h / 2 + 3.5, bs = 22;
    cRect(bx, by, bs, bs, 6, '#2c3346', { shadow: 3, jit: 0.1 });
    for (const [lx2, ly2] of [[6.2, 6.2], [6.2, 15.8], [15.4, 11]]) {
      cEll(bx + lx2, by + ly2, 4.4, 4.4, '#141821', { shadow: 1.5, jit: 0.05 });
      cEll(bx + lx2, by + ly2, 2.7, 2.7, '#070910', { shadow: 0, jit: 0, tex: 0 });
      c.save(); c.fillStyle = 'rgba(160,180,255,0.55)'; c.beginPath(); c.arc(bx + lx2 - 0.9, by + ly2 - 0.9, 0.7, 0, 7); c.fill(); c.restore();
    }
    cEll(bx + 16.2, by + 4.2, 1.7, 1.7, '#F3EACB', { shadow: 0, jit: 0, tex: 0 }); // flash
    cEll(bx + 16.2, by + 17.8, 1.4, 1.4, '#0b0d14', { shadow: 0, jit: 0, tex: 0 }); // sensor
    for (let i = 0; i < 4; i++) { // fingers wrap around the right edge and rest on the back (camera side)
      const fy = h * 0.0 + i * 10.5, len = [17, 20, 19, 14][i];
      cCap(w / 2 + 3, fy, w / 2 - len, fy + 1.5, 5.2, p.skin, { shadow: 3, jit: 0.1 });
      c.save(); c.strokeStyle = 'rgba(70,35,20,0.35)'; c.lineWidth = 0.7; c.beginPath(); c.moveTo(w / 2 - len * 0.45, fy - 4.6); c.lineTo(w / 2 - len * 0.45, fy + 5.8); c.stroke(); c.restore(); // knuckle crease
    }
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
