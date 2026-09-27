// MsgHealth · 30s vertical social ad (1080 × 1920)
// PATTERN INTERRUPT → PROBLEM → DISCOVERY → PRODUCT → RESULT → CTA
'use strict';

const DURATION = 30;

// Safe area for overlay text on TikTok / Reels / Shorts (platform UI covers the edges).
const SAFE = { x0: 90, x1: 990, y0: 300, y1: 1500 };

// ── helpers ──────────────────────────────────────────────────────────────────
const blinkAt = (t, seed = 0) => ((sm(t) + hash(seed) * 3) % 3.3 < 0.09 ? 1 : 0);
function handheld(t, amp) { // purposeful, small: breathing handheld drift
  return [amp * (Math.sin(t * 7.1) * 0.6 + Math.sin(t * 13.7 + 1) * 0.4), amp * (Math.sin(t * 6.3 + 2) * 0.6 + Math.sin(t * 11.3) * 0.4), amp * 0.0008 * Math.sin(t * 5.3)];
}
function applyCam(tx, ty, z, r = 0) { ctx.translate(W / 2 + tx, H / 2 + ty); ctx.rotate(r); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2); CAMZ = z; }
function salonBG(t, cam, st, blur) {
  withLayer(0, () => { camera(cam.x, cam.y, cam.z); salonBack(t, st); salonDesk(t, st); salonLights(st); }, { blur });
  screenSpace();
}
function wash(color, a, op = 'soft-light') { if (a <= 0) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = op; ctx.fillStyle = rgba(color, a); ctx.fillRect(0, 0, W, H); ctx.restore(); }
function faceLight(x, y, r, color, a) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); glow(x, y, r, color, a); ctx.restore(); }
function finish(o = {}) { grade({ warm: o.warm ?? 0.05, cool: o.cool ?? 0, dark: o.dark ?? 0, vignette: o.vignette ?? 0.32 }); }
// One major overlay message at a time, inside the safe area, logged for the audit.
function overlay(lines, t, a, b, y, o = {}) {
  const k = Math.min(seg(t, a, a + 0.25), 1 - seg(t, b - 0.2, b));
  if (k <= 0) return;
  screenSpace();
  const size = o.size ?? 58, lh = size * 1.18;
  ctx.save(); ctx.globalAlpha = ease.out(k);
  ctx.shadowColor = 'rgba(5,8,20,0.55)'; ctx.shadowBlur = 24;
  lines.forEach((l, i) => uText(l, W / 2, y + i * lh + (1 - ease.out(k)) * 14, size, o.weight ?? 700, o.color ?? '#FFFFFF', { align: 'center', kind: 'overlay' }));
  ctx.restore();
}

// ── cast staging ─────────────────────────────────────────────────────────────
const PH = { w: 50, h: 103.6 }; // phone (screen area matches 390×844 exactly: no warping)
function ownerHoldingPhone(t, x, y, s, expr, o = {}) {
  const ph = [8, 64]; // phone at chest height, in body units
  const vib = o.vib ? Math.sin(POSE * 2.9) * 1.6 : 0;
  puppet({ who: 'owner', x, y, s, expr, look: o.look ?? [0.05, 0.9], blink: o.blink ?? 0, tilt: o.tilt ?? 0, talk: o.talk ?? 0,
    armL: { to: [-100, 290], kind: 'rest' }, armR: { to: [ph[0] + 31, ph[1] + 36], kind: 'none' }, // wrist meets the palm
    after: () => heldPhone(PEOPLE.owner, ph[0] + vib, ph[1], PH.w, PH.h, -0.07, 'back', null, o.glow ?? 0) });
}
function closeUp(t, who, expr, o = {}) {
  puppet({ who, x: o.x ?? 540, y: o.y ?? 1520, s: o.s ?? 8.2, expr, look: o.look ?? [0, 0], blink: o.blink ?? blinkAt(t, 3), talk: o.talk ?? 0, tilt: o.tilt ?? 0, turn: o.turn ?? 0 });
}
function deskStage(t, o) { // owner seated at the front desk, monitor to the side (we see its back)
  const x = 440, y = 980, s = 3.0;
  cRect(x - 230, 700, 460, 700, 70, '#262B36', { shadow: 18, jit: 0.2 }); // chair back
  // forearms rest on the desk, pointing toward the lens (foreshortened)
  const body = { who: 'owner', x, y, s, expr: o.expr, look: o.look, blink: blinkAt(t, 5), tilt: o.tilt ?? 0,
    armR: { to: [86, 192], kind: 'mouse', angle: Math.PI / 2, l1: 150, l2: 34, bend: 1 }, armL: { to: [-86, 194], kind: 'rest', angle: Math.PI / 2, l1: 150, l2: 34, bend: -1 } };
  puppet({ ...body, noArms: true });
  const top = y + 196 * s; // desk surface at elbow height
  cRect(-40, top - 40, 1160, 80, 10, '#8A5A3A', { shadow: 16, jit: 0.1 });
  cRect(-40, top + 30, 1160, H - top, 16, o.day ? '#D9C3A3' : '#9E8E7A', { shadow: 18, jit: 0.1 });
  for (let i = 0; i < 3; i++) cRect(20 + i * 360, top + 90, 320, 380, 14, o.day ? '#CFB895' : '#948470', { shadow: 3, jit: 0.1, tex: 0.5 });
  if (o.phoneOnDesk) cRect(120, top - 28, 70, 30, 8, '#1C2130', { shadow: 6, jit: 0.1 });
  puppetArms(body);
  // monitor back (the screen faces the owner), off to the right
  cRect(1000, top - 190, 60, 160, 8, '#2B2F38', { shadow: 10, jit: 0.1 });
  cRect(940, top - 40, 180, 18, 6, '#2B2F38', { shadow: 10, jit: 0.1 });
  cRect(850, top - 560, 420, 380, 18, '#1D2029', { shadow: 18, jit: 0.1, gloss: 0.8 });
  if (!o.day) faceLight(820, 640, 420, '#8FA8FF', 0.3); // the screen lights the owner's face
}
// Over-the-shoulder on the owner's monitor. cx = monitor centre x. zoom pushes toward (fx,fy).
function monitorOTS(t, drawScreen, o) {
  const day = !!o.day;
  salonBG(t, { x: 2250, y: 380, z: 1.05 }, { light: day ? 1 : 0.42, phoneLit: false }, 14);
  if (!day) wash('#1B2A5A', 0.35, 'multiply');
  const z = o.zoom ?? 1, fx = o.fx ?? 540, fy = o.fy ?? 960;
  ctx.save();
  ctx.translate(540, 960); ctx.scale(z, z); ctx.translate(-fx, -fy); CAMZ = z;
  cRect(-400, 1330, 1900, 900, 10, day ? '#8A5A3A' : '#5B3F2C', { shadow: 0, jit: 0 }); // desk top
  cRect(o.cx - 330, 1400, 660, 90, 14, '#23262E', { shadow: 10, jit: 0.1 }); // keyboard
  monitor(o.cx, 980, 1180, drawScreen);
  if (!day) glow(o.cx, 980, 900, '#6D7CFF', 0.10);
  ctx.restore();
  // foreground shoulder: nearer the lens, so it moves faster and leaves the frame as we push in
  const zf = 1 + (z - 1) * 1.9;
  withLayer(1, () => {
    ctx.translate(540, 960); ctx.scale(zf, zf); ctx.translate(-540, -960);
    shoulderBack({ who: 'owner', x: 1010 + (zf - 1) * 260, y: 1800 + (zf - 1) * 420, s: 3.3 });
  }, { blur: 7 });
  screenSpace();
}
const OTS_SCALE = 1180 / 1600;
const otsPoint = (cx, u, v) => [cx - 590 + u * OTS_SCALE, 980 - 368.75 + v * OTS_SCALE];

// ── SHOTS ────────────────────────────────────────────────────────────────────
// 0:00 – 0:03 · pattern interrupt
function sHookFace(t) { // phone buzzing in hand, three notifications, rising confusion
  const [hx, hy, hr] = handheld(t, 7);
  salonBG(t, { x: 1480, y: 440, z: 1.2 }, { light: 1 }, 11);
  const push = ease.in(seg(t, 0.55, 0.8));
  ctx.save(); applyCam(hx, hy, 1 + push * 0.22, hr);
  const e = t < 0.14 ? EXPR.neutral : t < 0.45 ? mixExpr('neutral', 'concerned', seg(t, 0.14, 0.4)) : mixExpr('concerned', 'confused', seg(t, 0.45, 0.7));
  const buzz = t > 0.1 && t < 0.3;
  ownerHoldingPhone(t, 540, 930, 4.3, e, { vib: buzz, glow: 0.8 });
  faceLight(560, 700, 330, '#9DB4FF', buzz ? 0.34 : 0.2);
  ctx.restore();
  finish({ warm: 0.06 });
}
function sHookPhone(t) { // rapid push into the phone: 3 → 2 → 1 → gone
  const [hx, hy, hr] = handheld(t, 5);
  salonBG(t, { x: 1600, y: 700, z: 1.5 }, { light: 1 }, 16);
  const k = ease.out(seg(t, 0.8, 1.2));
  const s = lerp(9.5, 22.5, k);
  const focus = lerp(0, 5.8, k); // clock stays whole at the top; notifications sit in the safe middle
  ctx.save(); applyCam(hx, hy, 1, hr);
  ctx.translate(540, 960 - focus * s); ctx.scale(s, s); CAMZ = s;
  const count = t < 1.25 ? 3 : t < 1.45 ? lerp(3, 2, seg(t, 1.25, 1.37)) : t < 1.65 ? lerp(2, 1, seg(t, 1.45, 1.57)) : lerp(1, 0, seg(t, 1.65, 1.77));
  heldPhone(PEOPLE.owner, 0, 0, PH.w, PH.h, 0, 'screen', (w, h) => phoneLock(w, h, { count }));
  ctx.restore();
  finish({ warm: 0.02 });
}
function sHookLine(t) { // "Wait… why are my customers leaving?"
  const [hx, hy, hr] = handheld(t, 3);
  salonBG(t, { x: 1480, y: 440, z: 1.3 }, { light: 1 }, 14);
  ctx.save(); applyCam(hx, hy, 1 + seg(t, 1.95, 3.4) * 0.04, hr);
  const talk = t > 2.02 && t < 3.3;
  closeUp(t, 'owner', mixExpr('confused', 'concerned', seg(t, 2.6, 3.2)), { look: [-0.25, -0.15], talk: talkOpen(talk), tilt: 0.03, y: 1560 });
  ctx.restore();
  finish({ warm: 0.05 });
}

// 0:03 – 0:07 · the invisible problem (after closing)
function sDeskEvening(t) {
  salonBG(t, { x: 2000, y: 430, z: 1.3 }, { light: 0.4 }, 10);
  wash('#1B2A5A', 0.4, 'multiply');
  ctx.save(); applyCam(0, 0, 1 + seg(t, 3.4, 4.5) * 0.04);
  deskStage(t, { expr: mixExpr('neutral', 'concerned', seg(t, 3.6, 4.4)), look: [0.8, 0.35] });
  ctx.restore();
  finish({ warm: 0, cool: 0.12 });
}
function sOldDashboard(t) {
  monitorOTS(t, () => oldDashboard({ scroll: ease.io(seg(t, 4.6, 6.2)) * 330, fade: seg(t, 5.3, 6.0) }), { cx: 540, zoom: 1 + seg(t, 4.5, 6.4) * 0.05 });
  finish({ warm: 0, cool: 0.1 });
  overlay(['The problem isn’t always obvious.'], t, 4.8, 6.35, 440, { size: 54 });
}
function sFrustrated(t) {
  salonBG(t, { x: 2000, y: 430, z: 1.4 }, { light: 0.4 }, 14);
  wash('#1B2A5A', 0.4, 'multiply');
  ctx.save(); applyCam(0, 0, 1 + seg(t, 6.4, 7) * 0.03);
  closeUp(t, 'owner', mixExpr('concerned', 'frustrated', seg(t, 6.4, 6.7)), { look: [0.3, 0.7], tilt: -0.03, y: 1560 + seg(t, 6.5, 6.9) * 12 });
  ctx.restore();
  faceLight(760, 760, 520, '#8FA8FF', 0.3);
  finish({ warm: 0, cool: 0.12 });
}

// 0:07 – 0:11 · discovery
function healthState(t) {
  return {
    select: seg(t, 7.3, 7.6),
    score: lerp(84, 62, ease.io(seg(t, 7.8, 8.45))),
    badge: seg(t, 8.45, 8.75),
    pulse: t > 8.45 ? 1 - ((t - 8.45) % 0.9) / 0.9 : 0,
    why: seg(t, 11.15, 12.2),
  };
}
const MON_CX = 600;
const [PFX, PFY] = otsPoint(MON_CX, 1282, 540); // centre of Sarah's profile panel on screen
function sDiscovery(t) {
  const k = ease.io(seg(t, 7.35, 8.1));
  monitorOTS(t, () => mhHealth(healthState(t)), { cx: MON_CX, zoom: lerp(1, 1.5, k), fx: lerp(540, PFX, k), fy: lerp(960, PFY, k) });
  finish({ warm: 0.02, cool: 0.06 });
}
function sRealize(t) {
  salonBG(t, { x: 2000, y: 430, z: 1.4 }, { light: 0.4 }, 14);
  wash('#1B2A5A', 0.4, 'multiply');
  ctx.save(); applyCam(0, 0, 1 + ease.out(seg(t, 8.7, 9.5)) * 0.06);
  closeUp(t, 'owner', mixExpr('frustrated', 'realize', seg(t, 8.72, 8.95)), { look: [0.25, 0.2], y: 1560 });
  ctx.restore();
  faceLight(700, 760, 520, '#9BA6FF', 0.34);
  finish({ warm: 0, cool: 0.08 });
}
// the push from the physical monitor into the interface, then product macro shots
function productCam(t) {
  const z1 = lerp(1.5, 2.63, ease.io(seg(t, 9.55, 10.9)));
  const z2 = lerp(1, 1.04, ease.io(seg(t, 11, 12.9))) ;
  const [, cy] = otsPoint(MON_CX, 1282, 477); // composer, once scrolled into view
  return { zoom: z1 * z2, fx: PFX, fy: lerp(PFY, cy, ease.io(seg(t, 12.95, 13.5))) };
}
function sPush(t) {
  const st = healthState(t);
  if (t > 12.9) Object.assign(st, actState(t));
  monitorOTS(t, () => mhHealth(st), { cx: MON_CX, ...productCam(t) });
  finish({ warm: 0.02, cool: lerp(0.06, 0, seg(t, 9.6, 10.8)) });
}
function actState(t) {
  const msgLen = SMS_TEXT.join(' ').length;
  const cur = [[420, 1390], [436, 1212]];
  const mv = ease.io(seg(t, 14.15, 14.55));
  return {
    scroll: ease.io(seg(t, 12.95, 13.4)) * 700,
    typed: seg(t, 13.35, 14.2) * msgLen,
    press: t > 14.6 && t < 14.72 ? 1 : 0,
    sent: seg(t, 14.7, 14.8),
    cursor: t > 14.1 ? [lerp(cur[0][0], cur[1][0], mv), lerp(cur[0][1], cur[1][1], mv)] : null,
  };
}

// 0:11 – 0:18 · MsgHealth takes action (identify → act → response)
function sSarahPhone(t) {
  withLayer(0, () => { camera(700, 430, 1.4); livingRoom(t); }, { blur: 14 });
  screenSpace(); wash('#FFD9A8', 0.12);
  const [hx, hy] = handheld(t, 3);
  ctx.save(); applyCam(hx, hy, 1 + seg(t, 15.1, 17) * 0.03);
  ctx.translate(560, 850); ctx.scale(15.5, 15.5); CAMZ = 15.5;
  const typed = seg(t, 15.6, 16.25) * REPLY_TEXT.length;
  heldPhone(PEOPLE.sarah, 0, 0, PH.w, PH.h, 0.02, 'screen', (w, h) => phoneThread(w, h, {
    inK: seg(t, 15.15, 15.4), typed, sent: seg(t, 16.3, 16.45), card: seg(t, 16.45, 16.65), booked: seg(t, 16.72, 16.8),
  }));
  ctx.restore();
  withLayer(1, () => shoulderBack({ who: 'sarah', x: 120, y: 2090, s: 4 }), { blur: 8 });
  screenSpace();
  finish({ warm: 0.08 });
}
function sBookingPing(t) { // the owner's phone, lying on the desk, lights up
  screenSpace();
  cRect(-20, -20, W + 40, H + 40, 0, '#6B4A33', { shadow: 0, jit: 0, texScale: 2 });
  for (let i = 0; i < 9; i++) { ctx.save(); ctx.globalAlpha = 0.18; ctx.fillStyle = i % 2 ? '#5A3C28' : '#7C5840'; ctx.fillRect(0, i * 220 + 40, W, 6); ctx.restore(); }
  const on = t > 17.03;
  ctx.save(); applyCam(0, 0, 1 + seg(t, 17, 17.5) * 0.04);
  ctx.translate(540, 900); ctx.rotate(-0.04); ctx.scale(16.5, 16.5); CAMZ = 16.5;
  const buzz = t > 17.03 && t < 17.25 ? Math.sin(POSE * 3.1) * 0.5 : 0;
  ctx.translate(buzz, 0);
  cRect(-PH.w / 2, -PH.h / 2, PH.w, PH.h, 8.5, '#11141C', { shadow: 10, jit: 0, gloss: 1.2 });
  ctx.save(); ctx.beginPath(); ctx.roundRect(-PH.w / 2 + 2, -PH.h / 2 + 2, PH.w - 4, PH.h - 4, 7); ctx.clip();
  ctx.translate(-PH.w / 2 + 2, -PH.h / 2 + 2);
  if (on) phoneBooking(PH.w - 4, PH.h - 4, { k: seg(t, 17.06, 17.26) }); else { ctx.fillStyle = '#05070C'; ctx.fillRect(0, 0, PH.w, PH.h); }
  ctx.restore();
  ctx.restore();
  if (on) faceLight(540, 900, 700, '#9DB4FF', 0.12);
  finish({ warm: 0.04 });
}
function sRelief(t) {
  salonBG(t, { x: 2000, y: 430, z: 1.4 }, { light: 0.45 }, 14);
  wash('#1B2A5A', 0.35, 'multiply');
  ctx.save(); applyCam(0, 0, 1 + seg(t, 17.5, 18) * 0.03);
  closeUp(t, 'owner', mixExpr('realize', 'relief', seg(t, 17.52, 17.8)), { look: [0.1, 0.8], y: 1560 + seg(t, 17.55, 17.9) * 10 });
  ctx.restore();
  faceLight(560, 1100, 520, '#9DB4FF', 0.28);
  finish({ warm: 0.02, cool: 0.06 });
}

// 0:18 – 0:24 · transformation: the dashboard becomes the business's operating screen
function sCalmDesk(t) {
  salonBG(t, { x: 2000, y: 430, z: 1.3 }, { light: 1, phoneLit: false }, 10);
  ctx.save(); applyCam(0, 0, 1 + seg(t, 18, 18.7) * 0.03);
  deskStage(t, { expr: EXPR.calm, look: [0.8, 0.3], day: true, phoneOnDesk: true });
  ctx.restore();
  finish({ warm: 0.08 });
}
function homeState(t) {
  return { a1: seg(t, 19.6, 20.3), a2: seg(t, 20.0, 20.7), b1: seg(t, 21.2, 22.0), b2: seg(t, 21.7, 22.3), c1: seg(t, 22.9, 23.4), c2: seg(t, 23.2, 23.95) };
}
function sDashboard(t) {
  // 18.7–19.4: OTS push into column A; then glide A → B → C
  const f = 1.75;
  const colX = [540, 960, 1380];
  const gx = t < 21 ? colX[0] : t < 22.5 ? lerp(colX[0], colX[1], ease.io(seg(t, 20.75, 21.15))) : lerp(colX[1], colX[2], ease.io(seg(t, 22.35, 22.75)));
  const [ux, uy] = [gx, 540];
  const k = ease.io(seg(t, 18.7, 19.4));
  // camera zoom relative to the OTS monitor (1180px wide ⇒ 0.7375 px/unit)
  const [px, py] = otsPoint(540, ux, uy);
  const zoom = lerp(1, f / OTS_SCALE, k);
  const fx = lerp(540, px, k), fy = lerp(960, py, k);
  if (k < 1) {
    monitorOTS(t, () => mhHome(homeState(t)), { cx: 540, day: true, zoom, fx, fy });
  } else {
    screenSpace(); ctx.fillStyle = UIC.bg; ctx.fillRect(0, 0, W, H);
    ctx.save(); ctx.translate(540, 960); ctx.scale(f, f); ctx.translate(-ux, -uy); CAMZ = f;
    const cols = t < 20.75 ? [0] : t < 21.15 ? [0, 1] : t < 22.35 ? [1] : t < 22.75 ? [1, 2] : [2];
    mhHome({ ...homeState(t), cols, shell: false });
    ctx.restore();
  }
  finish({ warm: 0.02, vignette: 0.18 });
}

// 0:24 – 0:27 · emotional payoff
function sPayoff(t) {
  const cam = { x: 980, y: 560, z: 1.4 };
  withLayer(0, () => { camera(cam.x, cam.y, cam.z); salonBack(t, { light: 1, door: 1 }); salonLights({ light: 1 }); }, { blur: 3 });
  screenSpace();
  ctx.save(); applyCam(0, 0, 1 + seg(t, 24, 25.9) * 0.02);
  // Sarah in the open doorway (midground), turning back to wave
  const talk = t > 24.45 && t < 25.35;
  standing({ who: 'sarah', x: 520, y: 1830, s: 1.18, expr: mixExpr('calm', 'warm', seg(t, 24.2, 24.5)), look: [0.8, 0], turn: 0.4, talk: talkOpen(talk), blink: blinkAt(t, 8),
    armL: { to: [-150, -40], kind: 'wave', bend: -1, angle: -Math.PI / 2 - 0.15 + Math.sin(sm(t) * 11) * 0.12 }, armR: { to: [70, 300], kind: 'rest' } });
  // owner in the foreground, turned toward her
  puppet({ who: 'owner', x: 860, y: 1560, s: 4.6, expr: mixExpr('calm', 'warm', seg(t, 24.6, 25.1)), look: [-0.95, -0.1], turn: -0.5, blink: blinkAt(t, 2), tilt: t > 25.3 && t < 25.6 ? 0.04 : 0,
    armL: { to: [-100, 290], kind: 'rest' }, armR: { to: [100, 290], kind: 'rest' } });
  ctx.restore();
  finish({ warm: 0.1 });
}
function sPayoffUI(t) {
  screenSpace();
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, UIC.navy); g.addColorStop(1, UIC.navy2);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  glow(540, 1150, 700, '#4F46E5', 0.22); glow(760, 1300, 420, '#06B6D4', 0.08);
  // Sarah's card, healthy again
  const up = ease.io(seg(t, 25.95, 26.55)), sc = lerp(62, 91, up);
  const k = ease.out(seg(t, 25.9, 26.15));
  ctx.save(); ctx.globalAlpha *= 1 - seg(t, 26.9, 27.05);
  ctx.translate(540, 1180 + (1 - k) * 30); ctx.scale(1.55, 1.55); CAMZ = 1.55;
  uRect(-280, -170, 560, 340, 28, '#FFFFFF', { shadow: 30, shadowA: 0.35 });
  uAvatar(-210, -100, 34, 'SK', '#F97316');
  uText('Sarah K.', -160, -104, 30, 700, UIC.text); uText('Customer Health', -160, -70, 19, 500, UIC.muted);
  uRing(170, -86, 46, sc, scoreCol(sc), { width: 10, fs: 0.66 });
  uPill(-250, 12, scoreLbl(sc), scoreSoft(sc), scoreCol(sc), 20, { dot: true });
  uRect(-250, 62, 500, 76, 14, '#F8FAFC');
  uIcon('calendar', -216, 100, 26, UIC.primary, 2.2);
  uText('Next visit booked', -186, 94, 20, 600, UIC.text); uText('Thursday · 10:00 AM', -186, 122, 18, 400, UIC.muted);
  uIcon('check', 214, 100, 26, UIC.healthy, 2.6);
  ctx.restore();
  overlay(['Know who’s at risk', 'before they leave.'], t, 26.05, 26.95, 560, { size: 66 });
  finish({ warm: 0, vignette: 0.25 });
}

// 0:27 – 0:30 · CTA end frame
function sCTA(t) {
  screenSpace();
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#070B1C'); g.addColorStop(1, '#11183A');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  glow(540 + Math.sin(t * 0.8) * 60, 760, 760, '#4F46E5', 0.2); glow(300, 1400, 500, '#06B6D4', 0.07);
  const ap = (a, d = 0.35) => ease.out(seg(t, a, a + d));
  const k1 = ap(27.1), k2 = ap(27.45), k3 = ap(27.65), k4 = ap(27.85);
  ctx.save(); ctx.globalAlpha = k1;
  ['STOP GUESSING WHEN', 'CUSTOMERS ARE PLANNING', 'TO LEAVE.'].forEach((l, i) => uText(l, 540, 560 + i * 80 + (1 - k1) * 18, 62, 800, '#FFFFFF', { align: 'center', kind: 'overlay', ls: -0.5 }));
  ctx.restore();
  ctx.save(); ctx.globalAlpha = k2;
  const ww = uW('MsgHealth', 56, 700), total = 96 + 24 + ww, x0 = 540 - total / 2;
  uLogo(x0 + 48, 960, 64, { tile: true });
  uText('MsgHealth', x0 + 96 + 24, 980, 56, 700, '#FFFFFF', { kind: 'overlay' });
  ctx.restore();
  ctx.save(); ctx.globalAlpha = k3; uText('msghealth.net', 540, 1080, 38, 500, '#A5B4FC', { align: 'center', kind: 'overlay' }); ctx.restore();
  ctx.save(); ctx.globalAlpha = k4;
  ctx.translate(540, 1240); const pk = 1 + (t > 29.1 && t < 29.4 ? Math.sin(seg(t, 29.1, 29.4) * Math.PI) * 0.03 : 0); ctx.scale(pk, pk);
  uRect(-270, -56, 540, 112, 56, BRAND.colors.primary, { shadow: 30, shadowA: 0.45 });
  uText('See How It Works', 0, 14, 40, 600, '#FFFFFF', { align: 'center', kind: 'overlay' });
  ctx.restore();
  finish({ warm: 0, vignette: 0.2 });
}

// ── master timeline (hard cuts in the problem; smooth moves once MsgHealth appears) ──
const SHOTS = [
  [0.0, sHookFace], [0.8, sHookPhone], [1.95, sHookLine],
  [3.4, sDeskEvening], [4.5, sOldDashboard], [6.4, sFrustrated],
  [7.0, sDiscovery], [8.7, sRealize], [9.5, sPush],
  [15.1, sSarahPhone], [17.0, sBookingPing], [17.5, sRelief],
  [18.0, sCalmDesk], [18.7, sDashboard],
  [24.0, sPayoff], [25.9, sPayoffUI], [27.0, sCTA],
];
function drawFilm(t) {
  let fn = SHOTS[0][1];
  for (const [a, f] of SHOTS) if (t >= a) fn = f;
  fn(t);
  // the CTA fades in over the payoff card (card and message are already gone)
  if (t >= 26.95 && t < 27.2) { const k = seg(t, 26.95, 27.2); withLayer(4, () => { screenSpace(); sCTA(t); }, { alpha: k }); }
}
