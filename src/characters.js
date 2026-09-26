// Clay characters: expressive, Aardman-inspired proportions (big head, small body).
'use strict';

const SKIN = { a: '#e8b48f', b: '#c98b62', c: '#8d5a3b', d: '#f1c9a5', e: '#a86d48' };

// Cast (kept consistent across every scene for continuity).
const CAST = {
  sam:    { skin: SKIN.b, hair: '#3a2519', style: 'wave', shirt: '#f3ecdf', pants: '#3f4a5c', apron: '#b5533a', shoes: '#2b211b' },
  jordan: { skin: SKIN.d, hair: '#c7792f', style: 'curly', shirt: '#4f86c6', pants: '#34405a', shoes: '#f0ece4' },
  priya:  { skin: SKIN.e, hair: '#1f1612', style: 'bun', shirt: '#9a5ab0', pants: '#2e2a3a', shoes: '#3a2a22' },
  alex:   { skin: SKIN.a, hair: '#5a3a22', style: 'short', shirt: '#e0a63a', pants: '#4b5b3f', shoes: '#2c2622' },
  morgan: { skin: SKIN.c, hair: '#141010', style: 'crop', shirt: '#d56c5e', pants: '#333b48', shoes: '#eee8de' },
  rep:    { skin: SKIN.a, hair: '#7b4a2c', style: 'bob', shirt: null, pants: '#2f3b4a', shoes: '#2a2420', headset: true },
  walker: { skin: SKIN.d, hair: '#8b5a2b', style: 'short', shirt: '#6aa38a', pants: '#3b3f4d', shoes: '#2a2420' },
};

/*
  person(opts)
  x,y      feet position (world)          s      scale (1 ≈ 430px tall)
  who      CAST key or object             flip   mirror horizontally
  mood     smile | grin | flat | worried | o | sad | happy (closed-eye smile)
  look     [dx,dy] pupil offset (-1..1)   blink  0..1
  armL/armR {a: shoulder angle, e: elbow bend}  (radians, 0 = hanging down, + = raised outward)
  walk     walk-cycle phase (radians) or null
  lean     body lean (radians)   tilt   head tilt (radians)   bob   vertical bob px
  holdR    'scissors' | 'phone' | 'card' | 'tablet' | 'comb' | null
  seated   draw legs bent forward (sitting)
*/
function person(o) {
  const who = typeof o.who === 'string' ? CAST[o.who] : o.who;
  const s = o.s ?? 1;
  const c = ctx;
  c.save();
  c.translate(o.x, o.y);
  c.scale(o.flip ? -s : s, s);
  const bob = o.bob ?? 0;
  const walk = o.walk;
  const shirt = who.shirt ?? shade(BRAND.colors.primary, -0.05);

  if (!o.noShadow) contact(0, 6, 120, 22, 0.32);

  // ── legs ──
  const hipY = -118 + bob;
  const legs = (side) => {
    const hx = side * 26;
    let fx = hx, fy = -14, kx = hx, ky = -64 + bob;
    if (walk != null) {
      const ph = walk + (side > 0 ? Math.PI : 0);
      fx = hx + Math.sin(ph) * 34;
      fy = -14 - Math.max(0, Math.cos(ph)) * 16;
      kx = hx + Math.sin(ph) * 18 + 6;
    }
    if (o.seated) { kx = hx + 70; ky = hipY + 10; fx = hx + 78; fy = -14; }
    cCap(hx, hipY, kx, ky, 24, who.pants, { shadow: 6 });
    cCap(kx, ky, fx, fy - 10, 22, who.pants, { shadow: 6 });
    cEll(fx + 12, fy - 2, 34, 17, who.shoes, { shadow: 5, gloss: 1.4 });
  };
  legs(-1); legs(1);

  c.save();
  c.translate(0, hipY);
  c.rotate(o.lean ?? 0);
  // ── back arm (viewer's right when not flipped) ──
  const arm = (side, spec, front) => {
    const sx = side * 64, sy = -120;
    const a = (spec?.a ?? 0.12), e = (spec?.e ?? 0.15);
    const ex = sx + side * Math.sin(a) * 72, ey = sy + Math.cos(a) * 72;
    const hx = ex + side * Math.sin(a + e) * 66, hy = ey + Math.cos(a + e) * 66;
    cCap(sx, sy, ex, ey, 21, shirt, { shadow: front ? 10 : 4 });
    cCap(ex, ey, hx, hy, 18, shirt, { shadow: front ? 10 : 4 });
    cCap(ex + (hx - ex) * 0.72, ey + (hy - ey) * 0.72, hx, hy, 18.5, shade(shirt, -0.1), { shadow: 0 }); // cuff
    cBlob(hx, hy + 6, 20, 19, who.skin, { seed: side * 3 + 11, shadow: 6 });
    return [hx, hy + 6, a + e];
  };
  const handL = arm(-1, o.armL, false);

  // ── torso ──
  const torso = P.poly([[-70, -135], [70, -135], [80, -10], [60, 6], [-60, 6], [-80, -10]], true);
  clay(torso, shirt, { x: -80, y: -140, w: 160, h: 150 }, { shadow: 14 });
  if (who.apron) {
    clay(P.poly([[-52, -110], [52, -110], [64, 20], [-64, 20]], true), who.apron, { x: -64, y: -110, w: 128, h: 130 }, { shadow: 6 });
    cRect(-26, -40, 52, 28, 8, shade(who.apron, -0.15), { shadow: 3 }); // pocket
    cCap(-50, -112, -34, -150, 5, who.apron, { shadow: 2 }); cCap(50, -112, 34, -150, 5, who.apron, { shadow: 2 });
  }
  if (who.headset) { // support rep: brand polo
    cRect(-18, -132, 36, 40, 10, shade(shirt, 0.2), { shadow: 2 });
    cEll(40, -90, 13, 13, '#ffffff', { shadow: 2 }); cEll(40, -90, 7, 7, BRAND.colors.primaryDark, { shadow: 0, tex: 0 });
  }

  // ── head ──
  const hy0 = -210;
  c.save();
  c.translate(0, hy0);
  c.rotate(o.tilt ?? 0);
  cCap(0, 60, 0, 30, 24, who.skin, { shadow: 4 }); // neck
  if (['bun', 'bob', 'curly'].includes(who.style)) hairBack(who);
  cEll(-72, -2, 15, 20, who.skin, { shadow: 4 }); cEll(72, -2, 15, 20, who.skin, { shadow: 4 }); // ears
  cBlob(0, -10, 76, 78, who.skin, { seed: 5, wob: 0.025, shadow: 12 });
  face(o, who);
  hairFront(who);
  if (who.headset) {
    c.save(); c.lineWidth = 9; c.strokeStyle = '#2e3440'; c.beginPath(); c.arc(0, -8, 84, Math.PI * 1.08, Math.PI * 1.92); c.stroke(); c.restore();
    cEll(-80, 0, 16, 24, '#2e3440', { shadow: 4 }); cEll(80, 0, 16, 24, '#2e3440', { shadow: 4 });
    c.save(); c.lineWidth = 6; c.strokeStyle = '#2e3440'; c.beginPath(); c.moveTo(-82, 18); c.quadraticCurveTo(-70, 60, -26, 56); c.stroke(); c.restore();
    cEll(-22, 55, 9, 7, '#2e3440', { shadow: 2 });
  }
  c.restore();

  // ── front arm + prop ──
  const handR = arm(1, o.armR, true);
  if (o.holdR) prop(o.holdR, handR, o);
  if (o.holdL) prop(o.holdL, handL, o);
  c.restore();
  c.restore();
}

function face(o, who) {
  const c = ctx;
  const mood = o.mood ?? 'smile';
  const [lx, ly] = o.look ?? [0, 0];
  const blink = o.blink ?? 0;
  // cheeks
  c.save(); c.globalAlpha = 0.28;
  cEll(-44, 22, 16, 10, '#e2706b', { shadow: 0, tex: 0, still: true });
  cEll(44, 22, 16, 10, '#e2706b', { shadow: 0, tex: 0, still: true });
  c.restore();
  // eyes
  for (const side of [-1, 1]) {
    const ex = side * 27, ey = -16;
    if (mood === 'happy' || blink > 0.8) {
      c.save(); c.lineWidth = 5; c.lineCap = 'round'; c.strokeStyle = '#2a1a12';
      c.beginPath(); c.arc(ex, ey + 4, 11, mood === 'happy' ? Math.PI * 1.15 : 0.15, mood === 'happy' ? Math.PI * 1.85 : Math.PI - 0.15, false); c.stroke(); c.restore();
    } else {
      const ry = 17 * (1 - blink * 0.9);
      cEll(ex, ey, 14, ry, '#fbf8f2', { shadow: 3, tex: 0.3, gloss: 0.4, jit: 0.3 });
      cEll(ex + lx * 5, ey + 2 + ly * 5, 7.5, Math.min(8.5, ry * 0.6), '#1d1410', { shadow: 0, tex: 0, gloss: 0.3, jit: 0.3 });
      cEll(ex + lx * 5 - 2.5, ey - 1 + ly * 5, 2.5, 2.5, '#ffffff', { shadow: 0, flat: true, still: true });
    }
    // brows
    let ba = 0, by = -40;
    if (mood === 'worried' || mood === 'sad') ba = side * -0.35;
    if (mood === 'o') by = -46;
    if (mood === 'grin' || mood === 'happy') by = -43;
    c.save(); c.translate(ex, by); c.rotate(ba);
    cCap(-11, 0, 11, 0, 4.5, shade(who.hair, -0.1), { shadow: 2, jit: 0.4 });
    c.restore();
  }
  // nose
  cBlob(0, 10, 11, 9, shade(who.skin, -0.06), { seed: 9, shadow: 5, wob: 0.03 });
  // mouth
  c.save(); c.lineCap = 'round'; c.strokeStyle = '#5a2a22'; c.lineWidth = 5;
  if (mood === 'smile') { c.beginPath(); c.arc(0, 26, 18, 0.25 * Math.PI, 0.75 * Math.PI); c.stroke(); }
  else if (mood === 'grin' || mood === 'happy') {
    clay((k) => { k.beginPath(); k.moveTo(-22, 32); k.quadraticCurveTo(0, 36, 22, 32); k.quadraticCurveTo(18, 58, 0, 58); k.quadraticCurveTo(-18, 58, -22, 32); k.closePath(); }, '#6b2a25', { x: -22, y: 30, w: 44, h: 28 }, { shadow: 2, tex: 0.3 });
    cEll(0, 52, 9, 5, '#e2807a', { shadow: 0, tex: 0 });
    cRect(-14, 32, 28, 7, 3, '#fbf6ee', { shadow: 0, tex: 0 });
  }
  else if (mood === 'flat') { c.beginPath(); c.moveTo(-13, 38); c.lineTo(13, 38); c.stroke(); }
  else if (mood === 'worried') { c.beginPath(); c.moveTo(-15, 40); c.quadraticCurveTo(-5, 34, 3, 38); c.quadraticCurveTo(9, 42, 15, 37); c.stroke(); }
  else if (mood === 'sad') { c.beginPath(); c.arc(0, 52, 16, 1.25 * Math.PI, 1.75 * Math.PI); c.stroke(); }
  else if (mood === 'o') { cEll(0, 40, 8, 10, '#5a2a22', { shadow: 1, tex: 0 }); }
  c.restore();
}

function hairBack(who) {
  const h = who.hair;
  if (who.style === 'bun') cBlob(0, -86, 34, 30, h, { seed: 21, wob: 0.08, shadow: 6 });
  if (who.style === 'bob') cBlob(0, 6, 92, 86, h, { seed: 22, wob: 0.04, shadow: 8 });
  if (who.style === 'curly') for (let i = 0; i < 9; i++) {
    const a = Math.PI * (0.9 + i * 0.15);
    cBlob(Math.cos(a) * 78, -12 + Math.sin(a) * 74, 30, 28, h, { seed: 40 + i, wob: 0.1, shadow: 5 });
  }
}
function hairFront(who) {
  const h = who.hair;
  switch (who.style) {
    case 'wave':
      clay((k) => { k.beginPath(); k.moveTo(-80, -12); k.bezierCurveTo(-96, -96, -30, -118, 10, -104); k.bezierCurveTo(64, -104, 96, -64, 80, -18); k.bezierCurveTo(60, -54, 30, -60, 6, -58); k.bezierCurveTo(-20, -40, -50, -52, -78, -12); k.closePath(); }, h, { x: -90, y: -108, w: 180, h: 96 }, { shadow: 8 });
      break;
    case 'short':
      clay((k) => { k.beginPath(); k.moveTo(-80, -14); k.bezierCurveTo(-86, -122, 86, -126, 80, -14); k.bezierCurveTo(50, -58, -40, -64, -80, -14); k.closePath(); }, h, { x: -80, y: -96, w: 160, h: 78 }, { shadow: 8 });
      break;
    case 'crop':
      clay((k) => { k.beginPath(); k.moveTo(-78, -26); k.bezierCurveTo(-78, -120, 78, -120, 78, -26); k.bezierCurveTo(40, -70, -40, -70, -74, -28); k.closePath(); }, h, { x: -74, y: -96, w: 148, h: 68 }, { shadow: 6, tex: 1.2 });
      break;
    case 'bun':
    case 'bob':
      clay((k) => { k.beginPath(); k.moveTo(-82, -6); k.bezierCurveTo(-92, -124, 92, -124, 82, -6); k.bezierCurveTo(60, -58, 10, -66, -6, -50); k.bezierCurveTo(-30, -62, -66, -46, -80, -6); k.closePath(); }, h, { x: -88, y: -92, w: 176, h: 86 }, { shadow: 8 });
      break;
    case 'curly':
      for (let i = 0; i < 7; i++) cBlob(-60 + i * 20, -74 + Math.abs(i - 3) * 8, 26, 24, h, { seed: 60 + i, wob: 0.12, shadow: 5 });
      break;
  }
}

function prop(kind, [x, y, a], o) {
  const c = ctx;
  c.save(); c.translate(x, y);
  if (o.flip && ['chart', 'photo', 'card'].includes(kind)) c.scale(-1, 1); // keep printed props readable
  if (kind === 'scissors') {
    const open = o.snip ?? 0.3;
    c.rotate(-0.4);
    for (const s of [-1, 1]) {
      c.save(); c.rotate(s * open * 0.5);
      cRect(-4, -78, 9, 72, 4, '#c9cfd6', { shadow: 5, gloss: 2 });
      c.restore();
    }
    cEll(-12, 12, 12, 10, '#d44f3f', { shadow: 4 }); cEll(12, 12, 12, 10, '#d44f3f', { shadow: 4 });
  } else if (kind === 'phone') {
    c.rotate(o.phoneRot ?? -0.2);
    cRect(-24, -64, 48, 90, 10, '#262a33', { shadow: 8 });
    cRect(-19, -58, 38, 74, 6, o.phoneLit ? '#dcd9fb' : '#44505e', { shadow: 0, tex: 0.3 });
  } else if (kind === 'card') {
    c.rotate(-0.3);
    cRect(-34, -30, 68, 44, 7, '#2f6fb0', { shadow: 6 });
    cRect(-24, -16, 16, 12, 3, '#e8c35a', { shadow: 0 });
  } else if (kind === 'comb') {
    c.rotate(-0.5);
    cRect(-8, -70, 14, 70, 4, '#2e2e36', { shadow: 5 });
  } else if (kind === 'photo') {
    c.rotate(0.15);
    cRect(-40, -120, 80, 96, 4, '#fbf8f1', { shadow: 6 });
    cRect(-32, -112, 64, 60, 3, '#d7e6c5', { shadow: 0 });
    miniFace(0, -84, 18, 'alex');
  } else if (kind === 'chart') {
    c.rotate(-0.08);
    cRect(-110, -200, 200, 230, 8, '#fbf8f1', { shadow: 10 });
    cText('Revenue', -10, -162, 26, '#5b4a3a', { align: 'center', weight: 900 });
    [120, 108, 92, 74, 55].forEach((h, i) => cRect(-86 + i * 34, 10 - h, 24, h, 4, i < 3 ? '#8fbfb4' : '#e58a7d', { shadow: 3 }));
    c.save(); c.strokeStyle = '#c4493a'; c.lineWidth = 6; c.lineCap = 'round';
    c.beginPath(); c.moveTo(-80, -110); c.lineTo(60, -50); c.stroke();
    c.beginPath(); c.moveTo(40, -72); c.lineTo(62, -48); c.lineTo(32, -42); c.stroke(); c.restore();
  } else if (kind === 'tablet') {
    c.rotate(-0.1);
    cRect(-70, -110, 140, 100, 14, '#2a2e36', { shadow: 10 });
    cRect(-60, -100, 120, 80, 8, BRAND.colors.screen, { shadow: 0, tex: 0.3 });
    cRect(-60, -100, 22, 80, 6, BRAND.colors.primary, { shadow: 0, tex: 0.3 });
  }
  c.restore();
}

// Floating clay "?" for confusion beats.
function qmark(x, y, s, a = 1, seed = 1) {
  if (a <= 0) return;
  const c = ctx; c.save(); c.globalAlpha = a; c.translate(x, y); c.scale(s, s);
  c.rotate((hash(seed + POSE * 0.2) - 0.5) * 0.25);
  cText('?', 0, 0, 120, '#f6efe3', { font: FONT.title, weight: 700, align: 'center', base: 'middle' });
  c.restore();
}
