// The film: shot list, blocking and timing.
'use strict';

const DURATION = 94;

const blinkAt = (t, seed = 0) => ((sm(t) + hash(seed) * 3) % 3.7 < 0.1 ? 1 : 0);
const appToWorld = (ax, ay) => [TABLET.x - TABLET.w / 2 + (ax * TABLET.w) / APP_W, TABLET.y - TABLET.h / 2 + (ay * TABLET.h) / APP_H];
const TAB_Z = 5.05; // zoom at which the tablet fills the frame

// ── generic shot helpers ─────────────────────────────────────────────────────
function salonShot(t, cam, st, cast = {}) {
  camera(cam.x, cam.y, cam.z, cam.r ?? 0);
  salonBack(t, st);
  cast.back?.();
  salonDesk(t, st);
  cast.front?.();
  salonLights(st);
}
// Full-frame product shot: the tablet in focus, the studio melting into bokeh.
function tabletShot(t, appState, cam = null, st = {}) {
  const c = cam ?? { x: TABLET.x, y: TABLET.y, z: TAB_Z };
  camera(c.x, c.y, c.z);
  withLayer(0, () => { salonBack(t, st); salonDesk(t, { ...st, tablet: () => {} }); salonLights(st); }, { blur: 10 });
  camera(c.x, c.y, c.z);
  const { x, y, w, h } = TABLET;
  cRect(x - w / 2 - 16, y - h / 2 - 16, w + 32, h + 32, 22, '#252a31', { shadow: 18, gloss: 1.5, still: true });
  ctx.save(); ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, 8); ctx.clip();
  appInRect(appState, x - w / 2, y - h / 2, w, h);
  // glass sheen
  ctx.globalCompositeOperation = 'screen';
  const g = ctx.createLinearGradient(x - w / 2, y - h / 2, x + w / 2, y + h / 2);
  g.addColorStop(0, 'rgba(255,255,255,0.10)'); g.addColorStop(0.4, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(255,255,255,0.04)');
  ctx.fillStyle = g; ctx.fillRect(x - w / 2, y - h / 2, w, h);
  ctx.restore();
}
function crossfade(t, a, b, drawA, drawB) {
  const k = seg(t, a, b);
  if (k <= 0) return drawA();
  if (k >= 1) return drawB();
  drawA();
  screenSpace();
  withLayer(4, () => { screenSpace(); ctx.fillStyle = '#0b0906'; ctx.fillRect(0, 0, W, H); drawB(); }, { alpha: ease.sine(k) });
}
// Whip pan: A streaks off left, B streaks in from right, with directional smear.
function whip(t, a, b, drawA, drawB) {
  const k = seg(t, a, b);
  if (k <= 0) return drawA();
  if (k >= 1) return drawB();
  const e = ease.io(k);
  const off = e * W;
  const smear = Math.sin(k * Math.PI) * 140;
  const L = layer(5);
  const render = (fn) => { const prev = ctx; ctx = L; L.setTransform(1, 0, 0, 1, 0, 0); L.fillStyle = '#0b0906'; L.fillRect(0, 0, W, H); fn(); ctx = prev; };
  screenSpace();
  for (const [fn, base] of [[drawA, -off], [drawB, W - off]]) {
    render(fn);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    for (let i = 0; i < 7; i++) { ctx.globalAlpha = i === 0 ? 1 : 0.22; ctx.drawImage(L.canvas, base + (i / 6 - 0.5) * smear, 0); }
    ctx.restore();
  }
}

// ── A · Opening: the street at sunrise ───────────────────────────────────────
function shotOpening(t) {
  const cam = camPath([{ t: 0, x: 760, y: 470, z: 0.74 }, { t: 6.2, x: 540, y: 640, z: 1.75, e: ease.io }], t);
  camera(cam.x, cam.y, cam.z);
  street(t, 0, {
    inside: (gx, gy, gw, gh) => {
      barberChairMini(gx + gw * 0.42, gy + gh);
      person({ who: 'alex', x: gx + gw * 0.42, y: gy + gh - 22, s: 0.42, seated: true, mood: 'smile', noShadow: true });
      person({ who: 'sam', x: gx + gw * 0.62, y: gy + gh + 6, s: 0.44, flip: true, armR: { a: 1.9 + Math.sin(sm(t) * 12) * 0.1, e: 0.6 }, holdR: 'scissors', snip: Math.abs(Math.sin(sm(t) * 14)), look: [-1, -0.3], noShadow: true });
    },
  });
}
function barberChairMini(x, y) {
  ctx.save(); ctx.translate(x, y); ctx.scale(0.42, 0.42); ctx.translate(-1400, -FLOOR);
  barberChair(1400); ctx.restore();
}

// ── B · The hustle ───────────────────────────────────────────────────────────
function samMontage(t) {
  if (t < 9.2) {
    return { layer: 'front', o: { who: 'sam', x: 1625, y: 872, flip: true, armR: { a: 1.9 + Math.sin(sm(t) * 12) * 0.08, e: 0.6 }, armL: { a: 0.9, e: 1.1 }, holdR: 'scissors', holdL: 'comb', snip: Math.abs(Math.sin(sm(t) * 14)), look: [-1, -0.4], mood: 'smile', blink: blinkAt(t, 1) } };
  }
  if (t < 10.4) {
    const k = seg(t, 9.2, 10.4);
    return { layer: k < 0.45 ? 'front' : 'back', o: { who: 'sam', x: lerp(1625, 2060, ease.io(k)), y: lerp(872, 790, ease.io(clamp(k * 1.6))), walk: sm(t) * 11, bob: Math.abs(Math.sin(sm(t) * 11)) * -8, look: [1, 0], mood: 'smile', armL: { a: 0.3 + Math.sin(sm(t) * 11) * 0.3, e: 0.2 }, armR: { a: 0.3 - Math.sin(sm(t) * 11) * 0.3, e: 0.2 } } };
  }
  if (t < 12.4) {
    const onPhone = t < 11.5;
    return { layer: 'back', o: { who: 'sam', x: 2060, y: 790, armR: onPhone ? { a: 0.7, e: 2.0 } : { a: 0.3, e: 0.3 }, holdR: onPhone ? 'phone' : null, phoneLit: true, look: onPhone ? [0.4, 0.2] : [1, 0], mood: onPhone ? 'smile' : 'grin', armL: onPhone ? { a: 0.2, e: 0.2 } : { a: 2.2 + Math.sin(sm(t) * 14) * 0.25, e: -0.3 } } };
  }
  const k = seg(t, 12.4, 13.6);
  if (k < 1) return { layer: k < 0.3 ? 'back' : 'front', o: { who: 'sam', x: lerp(2060, 3180, ease.io(k)), y: lerp(790, 880, ease.io(clamp(k * 2.5))), walk: sm(t) * 11, bob: Math.abs(Math.sin(sm(t) * 11)) * -8, look: [1, 0], mood: 'smile', armL: { a: 0.3 + Math.sin(sm(t) * 11) * 0.3, e: 0.2 }, armR: { a: 0.3 - Math.sin(sm(t) * 11) * 0.3, e: 0.2 } } };
  return { layer: 'front', o: { who: 'sam', x: 3180, y: 880, flip: true, armL: { a: 0.55, e: -1.9 }, armR: { a: 0.55, e: -1.9 }, look: [-0.8, -0.6], mood: seg(t, 14, 14.3) ? 'happy' : 'smile', tilt: -0.05 } };
}
function shotMontage(t) {
  const cam = camPath([
    { t: 6.0, x: 1500, y: 560, z: 1.32 },
    { t: 9.0, x: 1540, y: 560, z: 1.36 },
    { t: 10.4, x: 2180, y: 540, z: 1.3 },
    { t: 12.2, x: 2300, y: 540, z: 1.26 },
    { t: 13.8, x: 3160, y: 480, z: 1.12 },
    { t: 16.0, x: 3200, y: 470, z: 1.2 },
  ], t);
  const sam = samMontage(t);
  const phone = t > 10.3 && t < 11.6;
  const st = { light: 1, clock: t * 2.4, phoneLit: phone, paid: t > 12.0 };
  salonShot(t, cam, st, {
    back: () => {
      person({ who: 'alex', x: 1400, y: 826, s: 0.95, seated: true, mood: t > 8 ? 'grin' : 'smile', look: [0.6, -0.2], blink: blinkAt(t, 4) });
      hairBits(t, 1430, 520);
      if (sam.layer === 'back') person(sam.o);
    },
    front: () => {
      // Priya pays at the desk
      if (t > 10.2 && t < 13.4) {
        const k = seg(t, 10.2, 11.2);
        const tap = t > 11.5;
        person({ who: 'priya', x: lerp(2950, 2720, ease.out(k)), y: 884, flip: true, walk: k < 1 ? sm(t) * 11 : null, armR: tap ? { a: 1.55, e: 0.35 } : { a: 0.2, e: 0.2 }, holdR: tap ? 'card' : null, mood: t > 12 ? 'grin' : 'smile', look: [-1, -0.2], blink: blinkAt(t, 7) });
      }
      if (sam.layer === 'front') person(sam.o);
      // messages answered: clay bubbles lifting off the phone
      if (phone) for (let i = 0; i < 3; i++) {
        const k = seg(t, 10.5 + i * 0.3, 11.5 + i * 0.3);
        if (k <= 0 || k >= 1) continue;
        const x = 2140 + i * 40 + Math.sin(k * 5 + i) * 20, y = 500 - ease.out(k) * 240;
        ctx.save(); ctx.globalAlpha = 1 - seg(k, 0.7, 1); ctx.translate(x, y); ctx.scale(pop(k * 3), pop(k * 3));
        cRect(-46, -30, 92, 60, 26, i === 1 ? '#fffdf8' : '#dcd9fb', { shadow: 8 });
        check(0, 0, 30, BRAND.colors.primaryDark);
        ctx.restore();
      }
    },
  });
  grade({ warm: 0.14 });
  caption("Sam's day is full.", t, 6.4, 9.2);
  caption('Clients, messages, payments — Sam handles it all.', t, 9.6, 12.8);
  caption('Regulars keep coming back. Business feels healthy.', t, 13.2, 16.0);
}
function hairBits(t, x, y) {
  for (let i = 0; i < 5; i++) {
    const p = ((sm(t) * 0.9 + i * 0.2) % 1);
    cEll(x + (hash(i) - 0.5) * 60 + Math.sin(p * 6 + i) * 10, y + p * 170, 6, 3, CAST.alex.hair, { shadow: 2, jit: 0.3 });
  }
}

// ── C · The quiet leak ───────────────────────────────────────────────────────
const leakLight = (t) => 1 - 0.45 * seg(t, 16, 30);

// C1 · A regular doesn't rebook (calendar insert)
function shotCalendar(t) {
  const L = leakLight(t);
  const cam = camPath([{ t: 16, x: 960, y: 540, z: 1.0 }, { t: 19.6, x: 1020, y: 560, z: 1.1 }], t);
  camera(cam.x, cam.y, cam.z);
  // wall behind the desk, close-up
  cRect(-200, -200, 2400, 1500, 0, mix('#b9b3ad', '#ead6bd', L), { shadow: 0, texScale: 2 });
  const months = ['JAN', 'FEB', 'MAR', 'APR'];
  months.forEach((m, i) => {
    const x = 170 + i * 420, y = 200 + (i % 2) * 18;
    const drop = pop(seg(t, 16.1 + i * 0.35, 16.6 + i * 0.35));
    if (drop <= 0) return;
    ctx.save(); ctx.translate(x + 180, y); ctx.rotate((hash(i + 3) - 0.5) * 0.08); ctx.scale(drop, drop); ctx.translate(-(x + 180), -y);
    cRect(x, y, 360, 520, 18, '#fbf8f1', { shadow: 16 });
    cRect(x, y, 360, 96, 18, i === 3 ? '#c9c2b8' : '#b5533a', { shadow: 0 });
    cText(m, x + 180, y + 66, 50, '#fffaf2', { align: 'center', weight: 900 });
    cEll(x + 180, y - 4, 12, 12, '#6b4a33', { shadow: 4 });
    for (let r = 0; r < 4; r++) for (let q = 0; q < 5; q++) cRect(x + 24 + q * 64, y + 120 + r * 64, 52, 50, 8, '#f1ebdf', { shadow: 0, tex: 0.3 });
    const sx = x + 24 + 3 * 64, sy = y + 120 + 64;
    if (i < 3) {
      cRect(x + 30, y + 400, 300, 88, 20, '#8fbfb4', { shadow: 6 });
      miniFace(x + 84, y + 444, 26, 'jordan');
      cText('Jordan · 10:00', x + 122, y + 456, 30, '#16303f', { weight: 900 });
      cEll(sx + 26, sy + 25, 18, 18, '#8fbfb4', { shadow: 3 });
    } else {
      const k = seg(t, 17.6, 18.4);
      ctx.save(); ctx.setLineDash([14, 12]); ctx.lineWidth = 5; ctx.strokeStyle = rgba('#c4493a', 0.35 + 0.4 * k);
      ctx.beginPath(); ctx.roundRect(x + 30, y + 400, 300, 88, 20); ctx.stroke(); ctx.restore();
      cText('— empty —', x + 180, y + 456, 30, rgba('#9a8f82', 1), { align: 'center', weight: 800, alpha: k });
      if (k > 0) qmark(x + 330, y + 380, 0.6, k, 3);
    }
    ctx.restore();
  });
  grade({ warm: 0.08, cool: 0.08 * (1 - L), dark: 0.2 * (1 - L) });
  caption("A regular doesn't rebook.", t, 16.6, 19.6);
}

// C2 · Another stops replying (phone insert)
function shotPhone(t) {
  const L = leakLight(t);
  camera(TABLET.x, 520, 1.6);
  withLayer(0, () => { salonBack(t, { light: L }); salonDesk(t, { light: L }); salonLights({ light: L }); }, { blur: 14 });
  screenSpace();
  const bob = Math.sin(sm(t) * 2) * 4;
  ctx.save(); ctx.translate(W / 2 + 40, 560 + bob); ctx.rotate(-0.05);
  // hand + phone
  cBlob(150, 300, 120, 90, CAST.sam.skin, { seed: 31, shadow: 18 });
  cRect(-230, -440, 460, 880, 60, '#23272f', { shadow: 30, gloss: 1.4 });
  cRect(-206, -414, 412, 828, 44, '#f6f3ee', { shadow: 0, tex: 0.25 });
  cRect(-206, -414, 412, 120, 44, '#ffffff', { shadow: 0, tex: 0 });
  miniFace(-130, -350, 32, 'priya');
  cText('Priya S.', -80, -338, 36, '#16303f', { weight: 900, emboss: false });
  const b1 = pop(seg(t, 19.8, 20.3));
  ctx.save(); ctx.translate(180, -120); ctx.scale(b1, b1);
  cRect(-340, -100, 340, 140, 30, '#4f86c6', { shadow: 6 });
  cText('Hi Priya! Ready for', -316, -48, 30, '#fff', { weight: 700, emboss: false });
  cText('your next touch-up?', -316, -8, 30, '#fff', { weight: 700, emboss: false });
  ctx.restore();
  if (b1 > 0.9) cText('Delivered', 170, 60, 24, '#8a949a', { align: 'right', weight: 800, emboss: false });
  const typing = t > 20.8 && t < 21.9;
  if (typing) {
    cRect(-180, 110, 130, 70, 35, '#e6e1d8', { shadow: 4 });
    for (let i = 0; i < 3; i++) cEll(-146 + i * 30, 145 - ((POSE + i) % 3) * 5, 9, 9, '#9aa6ad', { shadow: 0 });
  }
  const later = seg(t, 22.1, 22.5);
  if (later > 0) cText('3 days later…', 0, 330, 32, '#b3a89a', { align: 'center', weight: 800, emboss: false, alpha: later });
  ctx.restore();
  grade({ warm: 0.06, cool: 0.1 * (1 - L), dark: 0.2 * (1 - L) });
  caption('Another stops replying.', t, 20.0, 23.0);
}

// C3 · One quietly goes elsewhere (through the window)
function shotWindow(t) {
  const L = leakLight(t);
  const cam = camPath([{ t: 23, x: 400, y: 400, z: 1.6 }, { t: 26.4, x: 360, y: 410, z: 1.8 }], t);
  salonShot(t, cam, { light: L, windowSharp: true, walker: seg(t, 23.2, 26.2) });
  grade({ warm: 0.05, cool: 0.12 * (1 - L), dark: 0.22 * (1 - L) });
  caption('One quietly goes somewhere else.', t, 23.3, 26.4);
}

// C4 · Faces fall from the Regulars board
function shotBoard(t) {
  const L = leakLight(t);
  const cam = camPath([{ t: 26.4, x: 3100, y: 400, z: 1.45 }, { t: 28.6, x: 3100, y: 410, z: 1.55 }], t);
  const board = [1, 1, 1, 1, 1, 1, 1, 1];
  board[0] = 1 - seg(t, 26.7, 27.3); board[1] = 1 - seg(t, 27.1, 27.7); board[3] = 1 - seg(t, 27.5, 28.1);
  salonShot(t, cam, { light: L, board, clock: 26.4 + t * 0.2 });
  grade({ warm: 0.04, cool: 0.13 * (1 - L), dark: 0.24 * (1 - L) });
}

// C5 · Sam sees revenue slipping, but not why
function shotConfused(t) {
  const L = leakLight(t);
  const cam = camPath([{ t: 28.6, x: 1990, y: 440, z: 1.7 }, { t: 32.4, x: 1990, y: 450, z: 1.95 }], t);
  const scratch = t > 30.2;
  salonShot(t, cam, { light: L, board: [0, 0, 1, 0, 1, 1, 1, 1] }, {
    back: () => person({
      who: 'sam', x: 2030, y: 790, flip: true,
      armR: { a: 0.85, e: 1.5 }, holdR: 'chart',
      armL: scratch ? { a: 2.75 + Math.sin(sm(t) * 16) * 0.08, e: 1.25 } : { a: 0.2, e: 0.2 },
      mood: 'worried', look: scratch ? [0, -0.8] : [0.6, 0.4], tilt: scratch ? -0.1 : -0.03, blink: blinkAt(t, 2),
    }),
    front: () => {
      qmark(1880, 250, 0.8, seg(t, 30.4, 30.8), 1);
      qmark(2100, 220, 0.6, seg(t, 30.8, 31.2), 2);
    },
  });
  grade({ warm: 0.02, cool: 0.14, dark: 0.26 });
  caption("Revenue is slipping — and Sam can't see why.", t, 28.8, 32.4, { sub: 'No warning. Just empty chairs.' });
}

// ── D · MsgHealth arrives ────────────────────────────────────────────────────
function splash(x, y, w, h, t) {
  const k = seg(t, 32.6, 33.3);
  ctx.fillStyle = mix('#e9ecef', BRAND.colors.screen, k); ctx.fillRect(x, y, w, h);
  if (k < 1) { ctx.save(); ctx.globalAlpha = 1 - k; oldScreen(x, y, w, h); ctx.restore(); }
  const press = seg(t, 33.0, 33.9);
  if (press > 0) {
    ctx.save(); ctx.translate(x + w / 2, y + h / 2);
    const z = CAMZ; CAMZ = z * 0.2;
    drawLogo(0, 0, 0.2 * pop(press), { press: ease.elastic(press) });
    CAMZ = z; ctx.restore();
  }
}
function shotArrive(t) {
  const L = lerp(leakLight(t), 1, seg(t, 32.6, 36));
  const cam = camPath([
    { t: 32.4, x: 2150, y: 480, z: 1.55 },
    { t: 34.4, x: 2180, y: 490, z: 1.75 },
    { t: 36.6, x: TABLET.x, y: TABLET.y, z: TAB_Z, e: ease.in },
  ], t);
  const toApp = seg(t, 35.6, 36.4);
  salonShot(t, cam, {
    light: L, board: [0, 0, 1, 0, 1, 1, 1, 1],
    tablet: (x, y, w, h) => {
      splash(x, y, w, h, t);
      if (toApp > 0) { ctx.save(); ctx.globalAlpha = toApp; appInRect({ view: 'health', nav: 'Client Health', title: 'Client Health' }, x, y, w, h); ctx.restore(); }
    },
  }, {
    back: () => {
      const seen = t > 33.2;
      person({ who: 'sam', x: 2010, y: 790, armR: { a: 0.3, e: 0.3 }, armL: { a: 0.2, e: 0.2 }, mood: seen ? (t > 34 ? 'grin' : 'o') : 'worried', look: [1, 0.2], tilt: seen ? -0.06 : 0.03, blink: blinkAt(t, 5) });
    },
  });
  const gl = seg(t, 32.6, 33.6) * (1 - seg(t, 35.6, 36.6));
  if (gl > 0) { camera(cam.x, cam.y, cam.z); glow(TABLET.x, TABLET.y, 420, BRAND.colors.primary, 0.45 * gl); }
  grade({ warm: lerp(0.02, 0.12, seg(t, 33, 36)), cool: 0.14 * (1 - seg(t, 32.6, 35)), dark: 0.26 * (1 - seg(t, 32.6, 35.5)) });
  caption('Then Sam found MsgHealth.', t, 33.2, 35.8);
}

// ── E · Client health & churn risk ───────────────────────────────────────────
function shotHealth(t) {
  const drop = ease.io(seg(t, 38.4, 40.0));
  const j = lerp(78, 38, drop);
  const [jx, jy] = appToWorld(880, 500);
  const cam = camPath([
    { t: 36.6, x: TABLET.x, y: TABLET.y, z: TAB_Z },
    { t: 38.0, x: TABLET.x + 2, y: TABLET.y + 1, z: TAB_Z * 1.03 },
    { t: 40.4, x: jx, y: jy, z: TAB_Z * 1.42 },
    { t: 45, x: jx + 4, y: jy + 2, z: TAB_Z * 1.5 },
  ], t);
  tabletShot(t, {
    view: 'health', nav: 'Client Health', title: 'Client Health',
    jordan: j, counts: [lerp(128, 127, drop), 9, lerp(2, 3, drop)],
    pulse: Math.sin(seg(t, 39.2, 41.6) * Math.PI), flag: seg(t, 40.2, 40.8), signals: seg(t, 40.8, 41.8), focus: seg(t, 40.2, 41),
  }, cam);
  grade({ warm: 0.08, vignette: 0.4 });
  caption('MsgHealth scores the health of every client.', t, 37.0, 40.2);
  caption("…and flags who's at risk — before they're gone.", t, 40.6, 45.0);
}

// ── F · Automatic outreach → reply → rebooked ────────────────────────────────
function shotAutomation(t) {
  const cam = camPath([{ t: 45, x: TABLET.x, y: TABLET.y, z: TAB_Z }, { t: 48.8, x: TABLET.x + 6, y: TABLET.y, z: TAB_Z * 1.08 }], t);
  tabletShot(t, { view: 'automation', nav: 'Automations', title: 'Automations', blocks: seg(t, 45.3, 47.3) * 4, toggle: ease.out(seg(t, 47.4, 47.8)) }, cam);
  grade({ warm: 0.08, vignette: 0.4 });
  // a real message leaves the screen
  const k = seg(t, 48.0, 49.0);
  if (k > 0) {
    screenSpace();
    const s = lerp(0.4, 1.25, ease.out(k));
    ctx.save(); ctx.translate(lerp(820, 1300, ease.in(k)), lerp(600, 520, k)); ctx.scale(s, s); ctx.rotate(-0.05);
    smsBubble(0, 0, ["Hi Jordan! We miss you", "at Sam's Studio. Want your", 'usual Thursday spot?']);
    ctx.restore();
  }
  caption('Automations reach out for Sam — by SMS and email.', t, 45.4, 48.6);
}
function smsBubble(x, y, lines, col = BRAND.colors.primary, txt = '#fffdf8', w = 560) {
  const h = 50 + lines.length * 46;
  cRect(x - w / 2, y - h / 2, w, h, 40, col, { shadow: 22, gloss: 1.2 });
  clay(P.poly([[x - w / 2 + 70, y + h / 2 - 10], [x - w / 2 + 40, y + h / 2 + 40], [x - w / 2 + 120, y + h / 2 - 10]]), col, { x: x - w / 2 + 40, y: y + h / 2 - 10, w: 80, h: 50 }, { shadow: 8 });
  lines.forEach((l, i) => cText(l, x - w / 2 + 40, y - h / 2 + 62 + i * 46, 34, txt, { weight: 800, emboss: false }));
}
function shotJordan(t) {
  const cam = camPath([{ t: 49.2, x: 700, y: 470, z: 1.35 }, { t: 53.4, x: 660, y: 480, z: 1.5 }], t);
  camera(cam.x, cam.y, cam.z);
  livingRoom(t);
  const buzz = t > 49.9 && t < 50.6;
  const read = t > 50.2;
  const reply = t > 51.3;
  person({
    who: 'jordan', x: 620, y: 830, seated: true,
    armR: { a: 0.6, e: 2.0 + (reply ? Math.sin(sm(t) * 18) * 0.05 : 0) }, holdR: 'phone', phoneLit: read || buzz, phoneRot: buzz ? Math.sin(POSE * 2.1) * 0.25 : -0.2,
    armL: t > 52.2 ? { a: 2.5, e: -0.2 } : { a: 0.4, e: 0.6 },
    mood: reply ? 'grin' : read ? (t > 50.9 ? 'smile' : 'o') : 'flat', look: read ? [0.6, 0.6] : [0.3, 0], tilt: read ? 0.08 : 0, blink: blinkAt(t, 9),
  });
  if (buzz) { ctx.save(); ctx.strokeStyle = BRAND.colors.primary; ctx.lineWidth = 5; ctx.lineCap = 'round';
    for (const s of [-1, 1]) { ctx.beginPath(); ctx.arc(760, 520, 50 + (POSE % 2) * 10, s > 0 ? -0.5 : Math.PI - 0.5, s > 0 ? 0.5 : Math.PI + 0.5); ctx.stroke(); } ctx.restore(); }
  // the message arrives, then the reply rises
  const inK = seg(t, 49.2, 49.9);
  const msgA = 1 - seg(t, 51.1, 51.4);
  if (inK > 0 && msgA > 0) {
    ctx.save(); ctx.globalAlpha = msgA;
    const s = lerp(1.2, 0.72, ease.out(inK));
    ctx.translate(lerp(-400, 1020, ease.out(inK)), lerp(380, 300, ease.out(inK))); ctx.scale(s, s);
    smsBubble(0, 0, ["Hi Jordan! We miss you", "at Sam's Studio. Want your", 'usual Thursday spot?']);
    ctx.restore();
  }
  const rk = seg(t, 51.3, 51.8), up = seg(t, 52.5, 53.3);
  if (rk > 0) {
    ctx.save(); ctx.translate(lerp(1000, 1500, ease.in(up)), lerp(330, 150, ease.in(up))); ctx.scale(pop(rk) * 0.8, pop(rk) * 0.8);
    smsBubble(0, 0, ['Yes please!', 'Thursday at 10 works.'], '#fffdf8', '#16303f', 480);
    ctx.restore();
  }
  grade({ warm: 0.12 });
  caption('Jordan gets a personal text — and replies.', t, 49.6, 53.2);
}
function shotInbox(t) {
  const cam = camPath([{ t: 53.6, x: TABLET.x, y: TABLET.y, z: TAB_Z }, { t: 57.4, x: TABLET.x + 8, y: TABLET.y + 6, z: TAB_Z * 1.1 }], t);
  const up = ease.io(seg(t, 55.4, 56.6));
  tabletShot(t, { view: 'inbox', nav: 'Inbox', title: 'Inbox', sms: 1, email: 1, reply: seg(t, 53.9, 54.4), booked: seg(t, 54.8, 55.4), jordan: lerp(38, 86, up) }, cam);
  if (up > 0 && up < 1) { const [rx, ry] = appToWorld(1480, 214); camera(cam.x, cam.y, cam.z); glow(rx, ry, 30, BRAND.colors.healthy, 0.6 * Math.sin(up * Math.PI)); }
  grade({ warm: 0.1, vignette: 0.4 });
  caption('Jordan books again. Relationship recovered.', t, 54.2, 57.4);
}

// ── G · The toolkit, shown as results (a shelf of dioramas) ──────────────────
const SHELF = [
  { name: 'Reviews & review requests', bg: '#f3dcd2', cap: 'Review requests turn great visits into 5-star reviews.' },
  { name: 'Loyalty & retention', bg: '#dce8d2', cap: 'Loyalty rewards give clients a reason to return.' },
  { name: 'Payments & invoicing', bg: '#d9e4ef', cap: 'Invoices sent. Payments collected.' },
  { name: 'Analytics & reporting', bg: '#e8def0', cap: 'Reports show retention climbing.' },
];
const SHELF_T0 = 57.4, SHELF_D = 2.75;
function shotShelf(t) {
  const f = (t - SHELF_T0) / SHELF_D;
  const i = clamp(Math.floor(f), 0, 3);
  const within = f - i;
  const move = i < 3 ? ease.io(seg(within, 0.8, 1)) : 0;
  const cx = (i + move) * 1100;
  camera(cx, 560, 1.0);
  cRect(-1400, -800, 6200, 2600, 0, '#3b2f28', { shadow: 0, texScale: 2.2 }); // workshop wall
  cRect(-1400, 900, 6200, 60, 10, '#7a5a40', { shadow: 18 }); // shelf
  SHELF.forEach((b, k) => {
    const x = k * 1100;
    const lt = t - (SHELF_T0 + k * SHELF_D);
    cRect(x - 480, 170, 960, 730, 36, shade(b.bg, -0.2), { shadow: 26 });
    cRect(x - 450, 200, 900, 670, 26, b.bg, { shadow: 0, texScale: 1.6 });
    cRect(x - 450, 760, 900, 110, 20, shade(b.bg, -0.08), { shadow: 6 });
    ctx.save(); ctx.beginPath(); ctx.roundRect(x - 450, 200, 900, 670, 26); ctx.clip();
    [dioramaReviews, dioramaLoyalty, dioramaPayments, dioramaAnalytics][k](x, lt);
    ctx.restore();
    glow(x, 200, 520, '#ffe2b0', 0.25);
    cRect(x - 250, 96, 500, 64, 20, '#efe3cf', { shadow: 10 });
    cText(b.name, x, 139, 30, '#4a3a2c', { align: 'center', weight: 900 });
  });
  grade({ warm: 0.1, vignette: 0.55 });
  SHELF.forEach((b, k) => caption(b.cap, t, SHELF_T0 + k * SHELF_D + 0.15, SHELF_T0 + (k + 1) * SHELF_D - 0.05, { y: H - 118 }));
}
function dioramaReviews(x, t) {
  person({ who: 'alex', x: x - 230, y: 880, s: 0.95, armR: { a: 0.7, e: 1.9 }, holdR: 'phone', phoneLit: t > 0.3, mood: t > 0.9 ? 'grin' : 'smile', look: [0.7, 0.3], blink: blinkAt(t, 11) });
  cRect(x + 60, 250, 340, 420, 24, '#fffdf8', { shadow: 14 });
  cText('Reviews', x + 230, 310, 36, '#4a3a2c', { align: 'center', weight: 900 });
  for (let r = 0; r < 2; r++) { cRect(x + 90, 340 + r * 70, 280, 56, 12, '#f6efe2', { shadow: 3 }); for (let q = 0; q < 5; q++) star(x + 118 + q * 30, 368 + r * 70, 11, '#f2b441', 0, { shadow: 2 }); }
  const reqK = pop(seg(t, 0.1, 0.5));
  if (reqK > 0 && t < 1.0) { ctx.save(); ctx.translate(x - 150, 330); ctx.scale(reqK * 0.55, reqK * 0.55); smsBubble(0, 0, ['How was your visit?', 'Leave a quick review ★'], '#fffdf8', '#16303f', 520); ctx.restore(); }
  for (let i = 0; i < 5; i++) {
    const k = seg(t, 0.9 + i * 0.16, 1.5 + i * 0.16);
    if (k <= 0) continue;
    const sx = lerp(x - 180, x + 110 + i * 60, ease.io(k)), sy = lerp(470, 410, ease.io(k)) - Math.sin(k * Math.PI) * 160;
    star(sx, sy, 28 * (0.6 + 0.4 * pop(k)), '#f2b441', k * 3);
  }
  const card = pop(seg(t, 1.9, 2.4));
  if (card > 0) { ctx.save(); ctx.translate(x + 230, 570); ctx.scale(card, card); cRect(-140, -50, 280, 100, 18, '#fbf2dc', { shadow: 6 }); cText('New 5-star review', 0, 10, 26, '#4a3a2c', { align: 'center', weight: 900 }); ctx.restore(); }
}
function dioramaLoyalty(x, t) {
  person({ who: 'morgan', x: x + 280, y: 880, s: 0.9, flip: true, mood: t > 1.9 ? 'grin' : 'smile', armR: t > 1.9 ? { a: 2.6, e: -0.2 } : { a: 0.2, e: 0.2 }, look: [-0.8, 0.2], blink: blinkAt(t, 13) });
  cRect(x - 400, 290, 560, 340, 30, '#fdf6ea', { shadow: 16 });
  cText("Sam's Studio · Loyalty", x - 120, 350, 30, '#b5533a', { align: 'center', weight: 900 });
  const n = 4 + Math.floor(clamp((t - 0.3) / 0.35, 0, 4));
  for (let i = 0; i < 8; i++) {
    const cx = x - 330 + (i % 4) * 140, cy = 430 + Math.floor(i / 4) * 120;
    cEll(cx, cy, 44, 44, '#efe5d3', { shadow: 2, tex: 0.3 });
    if (i < n) { const fresh = i >= 4 ? pop(clamp((t - 0.3 - (i - 4) * 0.35) / 0.2)) : 1; ctx.save(); ctx.translate(cx, cy); ctx.scale(fresh, fresh); heart(0, 0, 22, '#e0645a'); ctx.restore(); }
  }
  // stamp tool
  if (t > 0.2 && t < 1.8) { const k = ((t - 0.3) / 0.35) % 1; const i = Math.min(7, 4 + Math.floor((t - 0.3) / 0.35)); const cx = x - 330 + (i % 4) * 140, cy = 430 + Math.floor(i / 4) * 120; const lift = Math.abs(Math.sin(k * Math.PI)) * 90; cRect(cx - 34, cy - 170 - lift, 68, 110, 18, '#6b4a33', { shadow: 16 }); cRect(cx - 44, cy - 70 - lift, 88, 30, 10, '#2f3a3f', { shadow: 8 }); }
  const rib = pop(seg(t, 1.9, 2.4));
  if (rib > 0) { ctx.save(); ctx.translate(x - 120, 690); ctx.scale(rib, rib); cRect(-190, -40, 380, 80, 40, BRAND.colors.primary, { shadow: 10 }); cText('Reward unlocked!', 0, 12, 34, '#fffdf8', { align: 'center', weight: 900, emboss: false }); ctx.restore(); }
}
function dioramaPayments(x, t) {
  ctx.save(); ctx.translate(x - 90, 520); ctx.rotate(-0.04);
  cRect(-220, -290, 440, 560, 18, '#fffdf8', { shadow: 18 });
  cText('Invoice', -180, -220, 44, '#16303f', { weight: 900 });
  cText("Sam's Studio", -180, -176, 24, '#8a949a', { weight: 800 });
  [['Cut & style', '$65'], ['Treatment', '$20']].forEach(([a, b], i) => { cText(a, -180, -90 + i * 56, 28, '#40505a', { weight: 700 }); cText(b, 180, -90 + i * 56, 28, '#40505a', { align: 'right', weight: 800 }); });
  cRect(-180, 30, 360, 6, 3, '#e6e0d6', { shadow: 0 });
  cText('Total', -180, 90, 32, '#16303f', { weight: 900 }); cText('$85', 180, 90, 32, '#16303f', { align: 'right', weight: 900 });
  const k = seg(t, 1.1, 1.5);
  if (k > 0) {
    const s = lerp(2.2, 1, ease.out(k));
    ctx.save(); ctx.translate(0, 180); ctx.rotate(-0.18); ctx.scale(s, s); ctx.globalAlpha = clamp(k * 2);
    ctx.lineWidth = 10; ctx.strokeStyle = BRAND.colors.healthy; ctx.beginPath(); ctx.roundRect(-150, -56, 300, 112, 20); ctx.stroke();
    cText('PAID', 0, 30, 78, BRAND.colors.healthy, { align: 'center', weight: 900, emboss: false });
    ctx.restore();
  }
  ctx.restore();
  // card terminal & tapping card
  cRect(x + 200, 540, 170, 230, 30, '#3a3f48', { shadow: 16 });
  cRect(x + 222, 566, 126, 90, 12, t > 1.1 ? '#bff0c9' : '#9fb3b8', { shadow: 0, tex: 0.2 });
  if (t > 1.1) check(x + 285, 610, 50, '#2f8a4f', 0.2);
  const ck = seg(t, 0.2, 1.0);
  ctx.save(); ctx.translate(lerp(x + 520, x + 300, ease.out(ck)), lerp(420, 500, ease.out(ck)) - (t > 1.0 ? seg(t, 1.0, 1.6) * 60 : 0)); ctx.rotate(-0.3);
  cBlob(40, 40, 70, 56, CAST.priya.skin, { seed: 41, shadow: 12 });
  cRect(-80, -50, 160, 100, 14, '#2f6fb0', { shadow: 10 }); cRect(-56, -22, 36, 26, 6, '#e8c35a', { shadow: 0 });
  ctx.restore();
}
function dioramaAnalytics(x, t) {
  cRect(x - 400, 240, 800, 560, 24, '#fffdf8', { shadow: 16 });
  cText('Returning clients', x - 350, 310, 36, '#16303f', { weight: 900 });
  const hs = [120, 150, 170, 210, 250, 300];
  hs.forEach((h, i) => {
    const k = ease.back(seg(t, 0.2 + i * 0.15, 0.8 + i * 0.15));
    if (k <= 0) return;
    cRect(x - 330 + i * 110, 740 - h * k, 70, h * k, 14, i === 5 ? BRAND.colors.primary : mix(BRAND.colors.primary, '#ffffff', 0.45), { shadow: 6 });
  });
  const ak = pop(seg(t, 1.4, 1.9));
  if (ak > 0) { ctx.save(); ctx.translate(x + 280, 360); ctx.scale(ak, ak); arrowUp(0, 0, 50, BRAND.colors.healthy); ctx.restore(); }
  cRect(x - 350, 750, 700, 6, 3, '#e6e0d6', { shadow: 0 });
}

// ── H · The result ───────────────────────────────────────────────────────────
function overviewState(t) { return { view: 'overview', nav: 'Client Health', title: 'Overview', feed: clamp((t - 72.2) / 0.4, 0, 5) }; }
function shotResult(t) {
  const cam = camPath([
    { t: 68.4, x: 1900, y: 520, z: 0.62 },
    { t: 70.8, x: 1980, y: 520, z: 0.7 },
    { t: 72.4, x: TABLET.x, y: TABLET.y, z: TAB_Z, e: ease.io },
    { t: 75, x: TABLET.x + 4, y: TABLET.y + 2, z: TAB_Z * 1.04 },
  ], t);
  const board = BOARD_WHO.map((_, i) => ([0, 1, 3].includes(i) ? pop(seg(t, 68.9 + i * 0.25, 69.4 + i * 0.25)) : 1));
  if (cam.z > 4.2) {
    tabletShot(t, overviewState(t), cam, { board });
  } else {
    salonShot(t, cam, { light: 1, board, door: seg(t, 68.4, 68.8) * (1 - seg(t, 70.4, 70.8)), phoneLit: true, clock: t, tablet: (x, y, w, h) => appInRect(overviewState(t), x, y, w, h) }, {
      back: () => {
        person({ who: 'alex', x: 1400, y: 826, s: 0.95, seated: true, mood: 'grin', look: [0.6, -0.2], blink: blinkAt(t, 4) });
        person({ who: 'sam', x: 2050, y: 790, armR: { a: 0.3, e: 0.3 }, armL: { a: 2.3 + Math.sin(sm(t) * 12) * 0.2, e: -0.2 }, mood: 'grin', look: [-1, 0], blink: blinkAt(t, 1) });
        person({ who: 'priya', x: 3000, y: 830, s: 0.95, seated: true, mood: 'smile', look: [-0.8, 0], blink: blinkAt(t, 7) });
      },
      front: () => {
        const k = seg(t, 68.5, 70.6);
        person({ who: 'jordan', x: lerp(900, 1720, ease.out(k)), y: 890, walk: k < 1 ? sm(t) * 11 : null, bob: k < 1 ? Math.abs(Math.sin(sm(t) * 11)) * -8 : 0, armR: k >= 1 ? { a: 2.4 + Math.sin(sm(t) * 12) * 0.2, e: -0.2 } : { a: 0.3, e: 0.2 }, mood: 'grin', look: [1, 0], blink: blinkAt(t, 9) });
      },
    });
  }
  grade({ warm: 0.16 });
  caption('Clients come back. The day runs smoother.', t, 68.7, 71.4);
  caption("Who's healthy. Who's at risk. What needs attention.", t, 72.4, 75.0, { sub: "And what's already being done." });
}

// ── I · Real human help ──────────────────────────────────────────────────────
function finger(ax, ay, press = 0) {
  const [x, y] = appToWorld(ax, ay);
  ctx.save(); ctx.translate(x, y); const s = 0.06 * (1 - press * 0.1); ctx.scale(s, s); ctx.rotate(-0.5);
  cCap(0, 0, 0, 260, 44, CAST.sam.skin, { shadow: 18 });
  cBlob(-20, 330, 110, 90, CAST.sam.skin, { seed: 51, shadow: 18 });
  cEll(0, 10, 26, 22, shade(CAST.sam.skin, 0.25), { shadow: 0, tex: 0.3 });
  ctx.restore();
}
function helpState(t) {
  return {
    view: 'overview', nav: 'Client Health', title: 'Overview', feed: 5,
    helpHi: t > 77.5, helpPress: t > 77.5 && t < 77.8 ? 1 : 0,
    help: seg(t, 77.7, 78.0), repHi: t > 78.3,
    chat: seg(t, 78.6, 79.1), msgs: [seg(t, 79.0, 79.3), seg(t, 81.0, 81.3), 0], repTyping: t > 79.3,
  };
}
function shotHelp(t) {
  if (t < 76.8) {
    const cam = camPath([{ t: 75, x: 2090, y: 460, z: 1.85 }, { t: 76.8, x: 2110, y: 470, z: 2.0 }], t);
    salonShot(t, cam, { light: 1, phoneLit: false, tablet: (x, y, w, h) => appInRect(overviewState(80), x, y, w, h) }, {
      back: () => person({ who: 'sam', x: 2040, y: 790, armR: { a: 0.3, e: 0.3 }, armL: { a: 2.6, e: 1.4 }, mood: 'o', look: [1, 0.3], tilt: 0.12, blink: blinkAt(t, 1) }),
      front: () => qmark(2130, 260, 0.7, seg(t, 75.4, 75.8), 5),
    });
    grade({ warm: 0.14 });
    caption('Got a question?', t, 75.2, 76.8);
    return;
  }
  if (t < 81.8) {
    const cam = camPath([{ t: 76.8, x: TABLET.x, y: TABLET.y, z: TAB_Z }, { t: 81.8, x: TABLET.x + 20, y: TABLET.y, z: TAB_Z * 1.08 }], t);
    tabletShot(t, helpState(t), cam);
    camera(cam.x, cam.y, cam.z);
    const fm = seg(t, 76.9, 77.5), fm2 = seg(t, 77.9, 78.3), out = seg(t, 78.5, 78.9);
    if (out < 1) {
      let ax = lerp(1700, 1440, ease.io(fm)), ay = lerp(1150, 96, ease.io(fm));
      ax = lerp(ax, 1300, ease.io(fm2)); ay = lerp(ay, 186, ease.io(fm2));
      ay += ease.in(out) * 900;
      const press = (t > 77.5 && t < 77.8) || (t > 78.3 && t < 78.5) ? 1 : 0;
      finger(ax, ay + press * 6, press);
    }
    grade({ warm: 0.1, vignette: 0.4 });
    caption('One tap: Help → Contact a Representative.', t, 77.0, 79.4);
    caption('A real person answers — and walks Sam through it.', t, 79.6, 81.8);
    return;
  }
  // split screen: Sam & Dana, together
  shotSplit(t);
}
function shotSplit(t) {
  const k = ease.out(seg(t, 81.8, 82.4));
  screenSpace(); ctx.fillStyle = '#1b1612'; ctx.fillRect(0, 0, W, H);
  const pw = 900, ph = 800, gap = 40, y0 = 140;
  const panel = (x, fn) => {
    ctx.save(); screenSpace(); ctx.beginPath(); ctx.roundRect(x, y0, pw, ph, 40); ctx.clip();
    const tr = new DOMMatrix().translate(x + pw / 2, y0 + ph / 2);
    fn(tr); ctx.restore();
  };
  panel(W / 2 - gap / 2 - pw - (1 - k) * 200, (tr) => {
    ctx.setTransform(tr.scale(1.35).translate(-2070, -560)); CAMZ = 1.35;
    salonBack(t, { light: 1 });
    person({ who: 'sam', x: 2040, y: 790, armR: { a: 0.3, e: 0.3 }, armL: { a: 0.2, e: 0.2 }, mood: t > 83 ? 'grin' : 'smile', look: [1, 0.2], blink: blinkAt(t, 1) });
    salonDesk(t, { tablet: (x, y, w, h) => appInRect(helpState(83), x, y, w, h) });
    salonLights({ light: 1 });
  });
  panel(W / 2 + gap / 2 + (1 - k) * 200, (tr) => {
    ctx.setTransform(tr.scale(1.2).translate(-900, -540)); CAMZ = 1.2;
    supportDesk(t);
    person({ who: 'rep', x: 930, y: 900, armR: { a: 2.5 + Math.sin(sm(t) * 12) * 0.25, e: -0.3 }, armL: { a: 0.2, e: 0.3 }, mood: 'grin', look: [-0.6, 0], blink: blinkAt(t, 3) });
    cRect(420, 690, 1000, 40, 14, '#8a6a4a', { shadow: 18 });
    cRect(440, 726, 960, 200, 14, '#b8a48a', { shadow: 12 });
    cRect(560, 480, 300, 200, 18, '#2a2e36', { shadow: 16 }); cRect(575, 495, 270, 170, 10, BRAND.colors.screen, { shadow: 0 });
    cRect(575, 495, 50, 170, 8, mix(BRAND.colors.primary, '#fff', 0.7), { shadow: 0 });
    cRect(690, 680, 40, 20, 4, '#2a2e36', { shadow: 6 });
    cRect(1180, 630, 70, 70, 16, '#e7a3a0', { shadow: 10 });
  });
  screenSpace();
  const b = pop(seg(t, 82.3, 82.8));
  if (b > 0) { ctx.save(); ctx.translate(W / 2, 250); ctx.scale(b * 0.8, b * 0.8); smsBubble(0, 0, ["Hi Sam! Happy to help.", "I'll walk you through it."], mix(BRAND.colors.primary, '#ffffff', 0.85), '#16303f', 520); ctx.restore(); }
  grade({ warm: 0.14, vignette: 0.5 });
  caption('Never alone with the software.', t, 82.2, 84.2, { sub: 'Real representatives, ready to help.' });
}

// ── J · Ending ───────────────────────────────────────────────────────────────
function shotEnding(t) {
  const cam = camPath([{ t: 84.2, x: 560, y: 610, z: 1.7 }, { t: 88.2, x: 760, y: 360, z: 0.82, e: ease.out }], t);
  camera(cam.x, cam.y, cam.z);
  street(t, 1, {
    inside: (gx, gy, gw, gh) => {
      barberChairMini(gx + gw * 0.42, gy + gh);
      person({ who: 'jordan', x: gx + gw * 0.42, y: gy + gh - 22, s: 0.42, seated: true, mood: 'grin', noShadow: true });
      person({ who: 'sam', x: gx + gw * 0.62, y: gy + gh + 6, s: 0.44, flip: true, armR: { a: 1.9 + Math.sin(sm(t) * 12) * 0.1, e: 0.6 }, holdR: 'scissors', snip: Math.abs(Math.sin(sm(t) * 14)), look: [-1, -0.3], mood: 'grin', noShadow: true });
      // MsgHealth quietly at work on the counter
      glow(gx + gw * 0.86, gy + gh * 0.62, 70, BRAND.colors.primary, 0.5 + 0.2 * Math.sin(t * 2));
      cRect(gx + gw * 0.86 - 30, gy + gh * 0.62 - 20, 60, 40, 6, '#252a31', { shadow: 4 });
      cRect(gx + gw * 0.86 - 25, gy + gh * 0.62 - 15, 50, 30, 3, BRAND.colors.screen, { shadow: 0 });
      cRect(gx + gw * 0.86 - 25, gy + gh * 0.62 - 15, 10, 30, 2, BRAND.colors.primary, { shadow: 0 });
    },
  });
  grade({ warm: 0.18, vignette: 0.55 });
  const k = Math.min(seg(t, 84.8, 85.6), 1 - seg(t, 88.6, 89.3));
  if (k > 0) {
    screenSpace(); ctx.save(); ctx.globalAlpha = ease.out(k);
    ctx.font = `700 64px ${FONT.title}`; ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 30; ctx.fillStyle = '#fffaf2';
    ctx.fillText('Stop guessing when your customers', W / 2, 172 + (1 - k) * 12);
    ctx.fillText('are planning to leave.', W / 2, 252 + (1 - k) * 12);
    ctx.restore();
  }
}
function shotLogo(t) {
  screenSpace();
  const g = ctx.createRadialGradient(W / 2, H / 2 - 40, 50, W / 2, H / 2, W * 0.7);
  g.addColorStop(0, '#fbf6ec'); g.addColorStop(1, '#e8dcc8');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  cRect(-20, -20, W + 40, H + 40, 0, '#f4ecdf', { shadow: 0, tex: 0.9, texScale: 2, still: true, flat: false, light: 0.3, dark: 0.3 });
  glow(W / 2, H / 2 - 60, 600, BRAND.colors.primary, 0.12);
  // floating clay accents: hearts & message bubbles drifting in soft focus
  withLayer(1, () => {
    for (let i = 0; i < 7; i++) {
      const a = i * 0.9 + sm(t) * 0.15, r = 560 + (i % 3) * 90;
      const x = W / 2 + Math.cos(a) * r * 1.2, y = H / 2 + Math.sin(a) * r * 0.55;
      if (i % 2) heart(x, y, 26, mix(BRAND.colors.primary, '#ffffff', 0.35)); else cRect(x - 40, y - 26, 80, 52, 22, mix(BRAND.colors.primary, '#ffffff', 0.55), { shadow: 6 });
    }
  }, { blur: 6, alpha: seg(t, 89.4, 90.4) * 0.8 });
  const p = seg(t, 89.6, 90.5);
  if (p > 0) drawLogo(W / 2, H / 2 - 60, 1.25 * pop(p), { press: ease.elastic(p) });
  const tg = seg(t, 90.6, 91.2), url = seg(t, 91.2, 91.8);
  if (tg > 0) cText(BRAND.tagline, W / 2, H / 2 + 90 + (1 - ease.out(tg)) * 10, 48, BRAND.colors.ink, { align: 'center', weight: 800, alpha: tg, emboss: false });
  if (url > 0) {
    ctx.save(); ctx.globalAlpha = url;
    const w = textW(BRAND.url, 40, 900) + 80;
    cRect(W / 2 - w / 2, H / 2 + 150, w, 76, 38, BRAND.colors.primary, { shadow: 10 });
    cText(BRAND.url, W / 2, H / 2 + 202, 40, '#fffdf8', { align: 'center', weight: 900, emboss: false });
    ctx.restore();
  }
  grade({ warm: 0.06, vignette: 0.35 });
}

// ── master timeline ──────────────────────────────────────────────────────────
function drawFilm(t) {
  if (t < 6.0) crossfade(t, 5.4, 6.0, () => shotOpening(t), () => shotMontage(Math.max(t, 6)));
  else if (t < 16) shotMontage(t);
  else if (t < 19.5) crossfade(t, 16, 16.4, () => shotMontage(16), () => shotCalendar(t));
  else if (t < 23) shotPhone(t);
  else if (t < 26.4) shotWindow(t);
  else if (t < 28.6) shotBoard(t);
  else if (t < 32.4) shotConfused(t);
  else if (t < 36.6) shotArrive(t);
  else if (t < 45) shotHealth(t);
  else if (t < 48.8) crossfade(t, 45, 45.35, () => shotHealth(45), () => shotAutomation(t));
  else if (t < 49.3) whip(t, 48.8, 49.3, () => shotAutomation(48.8), () => shotJordan(49.3));
  else if (t < 53.3) shotJordan(t);
  else if (t < 53.8) whip(t, 53.3, 53.8, () => shotJordan(53.3), () => shotInbox(53.8));
  else if (t < SHELF_T0) shotInbox(t);
  else if (t < 68.4) crossfade(t, SHELF_T0, SHELF_T0 + 0.4, () => shotInbox(SHELF_T0), () => shotShelf(t));
  else if (t < 75) crossfade(t, 68.4, 68.8, () => shotShelf(68.4), () => shotResult(t));
  else if (t < 84.2) shotHelp(t);
  else if (t < 89.4) crossfade(t, 84.2, 84.8, () => shotHelp(84.2), () => shotEnding(t));
  else crossfade(t, 89.4, 89.9, () => shotEnding(89.4), () => shotLogo(t));
  letterbox(1);
  fadeBlack(1 - seg(t, 0, 1.2));
  fadeBlack(seg(t, DURATION - 0.6, DURATION));
}
