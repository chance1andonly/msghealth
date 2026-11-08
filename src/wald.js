// MsgHealth · "Armor the engines" · story-hook vertical ad (1080 × 1920, 30 fps), built on src/kit.js.
// Real story, retold simply: in WWII the US military studied bullet holes in returning bombers; statistician Abraham Wald
// pointed out the holes showed where a plane could be hit and still fly home, so the armor belonged where the holes were NOT.
// Pivot: the customers you hear from are the bullet holes; the ones who quietly leave leave no marks. MsgHealth's health
// score flags who is going quiet, an automation wins them back. CTA: comment "KEEP" for a free retention audit (no price card).
// Voiceover: assets/audio/wald/vo-NN.wav (src/wald-vo.js). The people, names and numbers in the product scenes are illustrative.
'use strict';
const word = (l, k) => VO_AT[l] + VO_CLIPS[l].chunks[k][1];
const T = {
  s1: VO_AT[1], wings: VO_AT[1] + 0.1, body: VO_AT[1] + 1.0, eng: word(1, 1), s2: VO_AT[2], armor: word(2, 1), s3: VO_AT[3], no: word(3, 1), s4: VO_AT[4], never: word(4, 1),
  s5: VO_AT[5], s6: VO_AT[6], gone: word(6, 1), brand: VO_AT[7], quiet: word(7, 1), score: VO_AT[8], flag: word(8, 1), win: VO_AT[9], send: word(9, 1), ask: VO_AT[10], cmt: VO_AT[11], free: word(11, 1),
  end: VO_AT[12] - 0.1, url: VO_AT[12] + 0.1,
};
T.cta = T.end + 1.25;
const DURATION = +(T.cta + 1.0).toFixed(2);
window.CUES = T; window.SFX = []; const cue = (t, kind, gain) => window.SFX.push({ t, kind, gain });
window.MUSIC = { bpm: 96, root: 45, brandAt: T.brand, mood: 'sneaky' };

// ═════════════ the bomber (top-down, nose up, local origin = centre of the wings) ═════════════
const ENG = [[-300, -6], [-170, -35], [170, -35], [300, -6]]; // engine nacelle centres on the wing leading edge
const HOLES = {
  wingL: [[-430, 95], [-400, 75], [-380, 105], [-345, 128], [-285, 132], [-235, 142], [-205, 118], [-130, 150], [-100, 120], [-420, 60]],
  wingR: [[440, 85], [395, 100], [360, 70], [330, 125], [270, 138], [215, 125], [150, 150], [110, 115], [415, 60], [245, 100]],
  body: [[-30, -120], [25, -40], [-20, 60], [30, 150], [-15, 230], [20, 300], [-35, -210], [10, -200], [35, 10], [-28, 200]],
  tail: [[-120, 395], [-160, 400], [100, 390], [150, 405], [0, 380], [-10, 410]],
};
function drawPlane(col = '#76805a') {
  const dark = 'rgba(0,0,0,0.18)';
  [-1, 1].forEach((m) => {
    poly([[m * 60, -60], [m * 460, 30], [m * 460, 120], [m * 60, 170]], col); poly([[m * 60, 320], [m * 200, 380], [m * 200, 425], [m * 60, 405]], col);
    line(m * 80, 40, m * 440, 70, dark, 3); line(m * 80, 110, m * 440, 100, dark, 3);
  });
  fillRR(-62, -400, 124, 830, 60, col); fillRR(-8, 300, 16, 150, 6, 'rgba(0,0,0,0.2)'); ellipse(0, -290, 34, 52, '#a9c8da'); line(-62, 0, 62, 0, dark, 3); line(-62, 240, 62, 240, dark, 3);
  ENG.forEach(([x, ly]) => { fillRR(x - 30, ly - 70, 60, 170, 24, '#4a5238'); ellipse(x, ly - 72, 44, 9, 'rgba(255,255,255,0.4)'); });
}
function hole(x, y, a = 1) { circle(x, y, 17 * a, '#ff9a55'); circle(x, y, 11 * a, '#120e18'); }
function plane(x, y, s, fn, o = {}) { ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot ?? 0); ctx.scale(s, s); if (o.alpha !== undefined) ctx.globalAlpha *= o.alpha; drawPlane(o.col); if (fn) fn(); ctx.restore(); }
function nightSky(t) {
  ctx.fillStyle = vgrad(0, H, '#0f1930', '#2d4270'); ctx.fillRect(0, 0, W, H);
  for (let i = 0; i < 7; i++) { const y = ((i * 330 + t * 70) % 2300) - 250; cloud(((i * 397) % 900) - 40, y, 2.4 + (i % 3) * 0.5, 'rgba(255,255,255,0.07)'); }
}
function plate(x, y, w, h, k) { // steel armor plate, k = 0..1 slide-in
  if (k <= 0) return; ctx.save(); ctx.globalAlpha *= clamp(k * 2); ctx.translate(0, -(1 - ease.out(k)) * 160);
  fillRR(x, y, w, h, 18, '#aab1bd'); strokeRR(x, y, w, h, 18, '#e7ebf2', 4); [[x + 18, y + 18], [x + w - 18, y + 18], [x + 18, y + h - 18], [x + w - 18, y + h - 18]].forEach(([a, b]) => circle(a, b, 5, '#6c7380')); ctx.restore();
}
function holesIn(list, t, at, step, n = list.length) { list.slice(0, n).forEach(([x, y], i) => { const e = pop(t, at + i * step, 0.22); if (e > 0) hole(x, y, clamp(e)); }); }

// scene 0 · "In World War Two, they studied bullet holes in returning bombers"
function sceneHook(t) {
  nightSky(t); text('1943', CX, 250, 170, 800, 'rgba(255,255,255,0.88)', 'center', -0.02);
  const sh = shake(t, VO_AT[0] + 1.0, 6, 1.4);
  plane(CX + sh, 1000 + Math.sin(t * 2) * 10, 0.95);
  const k = word(0, 1) - 0.1;
  for (let i = 0; i < 9; i++) { const at = k + i * 0.11, e = seg(t, at, at + 0.2); if (e > 0 && e < 1) { const a = i % 2 ? 1 : -1, y = 600 + i * 70; line(a > 0 ? 1100 : -20, y - 120, CX + a * (260 - i * 18), y + 200 - i * 40, rgba('#ffd27a', 0.7 * (1 - e)), 5); } }
}
// scene 1 · holes on the wings and body, almost none on the engines
function sceneHoles(t) {
  nightSky(t); const s = 1.0, sh = shake(t, T.s1, 5, 0.6);
  plane(CX + sh, 940, s, () => {
    holesIn(HOLES.wingL, t, T.wings, 0.07, 10); holesIn(HOLES.wingR, t, T.wings + 0.05, 0.07, 10); holesIn(HOLES.body, t, T.body, 0.06); holesIn(HOLES.tail, t, T.body + 0.1, 0.07);
    const e = pop(t, T.eng - 0.2, 0.3); if (e > 0) { hole(-300, 12, clamp(e)); ENG.forEach(([x, ly], i) => { const p = 0.5 + 0.5 * Math.sin(t * 5 + i); ctx.save(); ctx.globalAlpha = clamp(e); strokeRR(x - 40, ly - 80, 80, 190, 28, rgba('#9ff0c0', 0.7 + 0.3 * p), 6); ctx.restore(); }); }
  });
  withFade(seg(t, T.eng, T.eng + 0.3), () => { tag(CX + 190, 1385, 'ENGINES · ALMOST NONE', GREEN, false, 26); });
}
// scene 2 · the generals want armor where the holes are
function generals(t, at) {
  [[190, 1, 41], [400, -1, 77]].forEach(([x, d, id], i) => { const e = ease.out(seg(t, at - 0.2 + i * 0.1, at + 0.4)); if (e <= 0) return; ctx.save(); ctx.globalAlpha *= e; person(x, 1410, 400, id, { skin: i ? '#c68a62' : '#d9a27a', shirt: '#5f6f3a', pants: '#3f4533', hat: '#4b5632', dir: d, arm: i ? 'down' : 'up', wave: t * 1.5, mouth: 'open', bounce: t * 6 + i }); ctx.restore(); });
}
function sceneArmor(t) {
  nightSky(t);
  plane(CX, 640, 0.78, () => {
    [HOLES.wingL, HOLES.wingR, HOLES.body, HOLES.tail].forEach((l) => l.forEach(([x, y]) => hole(x, y)));
  });
  ctx.save(); ctx.translate(CX, 640); ctx.scale(0.78, 0.78);
  const k = (n) => seg(t, T.armor + n * 0.18, T.armor + 0.5 + n * 0.18);
  plate(-455, 40, 370, 140, k(0)); plate(85, 40, 370, 140, k(1)); plate(-52, -250, 104, 580, k(2)); plate(-190, 365, 380, 70, k(3));
  ctx.restore();
  generals(t, T.s2);
  const b = pop(t, T.armor - 0.15, 0.3); if (b > 0) xf(740, 1060, clamp(b), 0, () => { fillRR(540, 990, 440, 130, 34, '#fff'); text('ARMOR HERE!', 760, 1056, 54, 800, '#1b1f27', 'center', -0.01); });
}
// scene 3 · Abraham Wald says no
function sceneWald(t) {
  ctx.fillStyle = '#e4d9c6'; ctx.fillRect(0, 0, W, H); fillRR(60, 170, 960, 760, 18, '#6b4a34'); fillRR(84, 194, 912, 712, 8, '#2d4a3c');
  ctx.fillStyle = '#7a5a3a'; ctx.fillRect(0, 1380, W, 540); ctx.fillStyle = 'rgba(0,0,0,0.10)'; ctx.fillRect(0, 1380, W, 18);
  plane(700, 560, 0.42, null, { col: 'rgba(255,255,255,0.2)' });
  const e = ease.out(seg(t, T.no + 0.3, T.no + 0.9)); if (e > 0) { ctx.save(); ctx.globalAlpha *= e; ENG.forEach(([x, ly]) => ring(700 + x * 0.42, 560 + (ly + 15) * 0.42, 52 * (1.4 - 0.4 * e), '#9ff0c0', 7)); ctx.restore(); }
  withFade(seg(t, T.s3, T.s3 + 0.3), () => { const s = 'ABRAHAM WALD · MATHEMATICIAN', w = tw(s, 28, 800, 0.1) + 60; fillRR(CX - w / 2, 96, w, 60, 30, '#1b1f27'); text(s, CX, 128, 28, 800, '#fff', 'center', 0.1); });
  const pw = ease.out(seg(t, T.s3 - 0.1, T.s3 + 0.4)); ctx.save(); ctx.globalAlpha *= pw;
  person(290, 1480, 560, 12, { skin: '#d9a27a', shirt: '#8ea2b8', pants: '#3d424f', glasses: true, arm: 'up', wave: t * 1.3, mouth: 'open', bounce: t * 5 }); ctx.restore();
  const b = pop(t, T.no - 0.1, 0.3); if (b > 0) xf(780, 1130, clamp(b), 0, () => { fillRR(540, 1020, 400, 220, 40, '#fff'); text('NO.', 740, 1136, 150, 800, '#b3261e', 'center', -0.02); });
}
// scene 4 · armor the engines; the planes hit there never came back
function sceneEngines(t) {
  nightSky(t); const e = seg(t, T.s4, T.s4 + 0.5), g = ease.inOut(seg(t, T.never - 0.1, T.never + 0.5));
  plane(CX, 760, 0.9, () => {
    [HOLES.wingL, HOLES.wingR, HOLES.body, HOLES.tail].forEach((l) => l.forEach(([x, y]) => hole(x, y)));
    ENG.forEach(([x, ly], i) => { const k = ease.out(seg(t, T.s4 + 0.05 + i * 0.12, T.s4 + 0.4 + i * 0.12)); if (k > 0) { ctx.save(); ctx.globalAlpha *= k; glow(x, ly + 15, 150, '#7dffb0', 0.5); fillRR(x - 42, ly - 82, 84, 190, 26, '#aab1bd'); strokeRR(x - 42, ly - 82, 84, 190, 26, '#9ff0c0', 6); ctx.restore(); } });
  }, { alpha: 1 - 0.7 * g });
  withFade(e * (1 - g), () => text('ARMOR THE ENGINES', CX, 1280, 64, 800, '#9ff0c0', 'center', 0.02));
  [[200, 0.0, -0.4], [520, 0.25, 0.3], [820, 0.1, 0.6], [380, 0.45, -0.7], [700, 0.6, 0.2]].forEach(([x, d, r], i) => {
    const k = seg(t, T.never + d, T.never + d + 2.2); if (k <= 0) return; const y = lerp(-220, 1500, ease.in(k * 0.85 + 0.15 * k));
    for (let j = 0; j < 7; j++) circle(x + Math.sin(j + t * 3) * 14 + r * j * 12, y - 90 - j * 46, 20 + j * 7, `rgba(190,200,215,${0.28 * (1 - j / 7) * (1 - k * 0.5)})`);
    plane(x, y, 0.3, () => { ENG.forEach(([ex, ly]) => { hole(ex, ly + 10); }); }, { rot: r + k * r * 2.5, alpha: 1 - seg(k, 0.7, 1) });
  });
}
// scene 5-6 · the loud customers are the bullet holes; the quiet ones leave without a trace
const GRID = []; for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) GRID.push([190 + c * 350, 440 + r * 260, r * 3 + c]);
const LOUD = { 1: ['Late again!!', 0.25], 5: ['Wrong charge?!', 0.65], 9: ['No reply??', 1.05] };
function sceneSilent(t) {
  ctx.fillStyle = vgrad(0, H, '#0f1930', '#2d4270'); ctx.fillRect(0, 0, W, H);
  const gone = seg(t, T.s6, T.s6 + 0.1);
  withFade(1, () => text(gone > 0 ? 'THE QUIET ONES' : 'THE LOUD ONES', CX, 250, 34, 800, gone > 0 ? ACCENT : IN.mid, 'center', 0.22));
  GRID.forEach(([x, y, i]) => {
    const e = ease.out(seg(t, T.s5 + i * 0.04, T.s5 + 0.3 + i * 0.04)), loud = LOUD[i], ghost = !loud ? ease.out(seg(t, T.s6 + 0.1 + (i % 6) * 0.14, T.s6 + 0.5 + (i % 6) * 0.14)) : 0;
    if (e <= 0) return; const col = NAMES[i % NAMES.length][1], nm = NAMES[i % NAMES.length][0];
    ctx.save(); ctx.globalAlpha *= e * (1 - 0.88 * ghost); avatar(x, y, 70, nm.slice(0, 2).toUpperCase(), col); ctx.restore();
    if (ghost > 0) { ctx.save(); ctx.setLineDash([10, 12]); ring(x, y, 78, rgba('#ffffff', 0.45 * ghost), 3); ctx.restore(); }
    if (loud) { const b = pop(t, T.s5 + loud[1] + 0.2, 0.3); if (b > 0) xf(x, y - 120, clamp(b), 0, () => { const w = tw(loud[0], 32, 800) + 56; fillRR(x - w / 2 - 30, y - 168, w, 76, 36, '#fff'); text(loud[0], x - 30, y - 128, 32, 800, '#b3261e', 'center'); }); }
  });
  withFade(seg(t, T.gone + 0.2, T.gone + 0.5), () => text('NO COMPLAINT. NO GOODBYE.', CX, 1370, 40, 800, '#fff', 'center', 0.02));
}
// ═════════════ the product ═════════════
const CLIENTS = [['Priya S.', 82, 82, 1], ['Marcus T.', 74, 74, 2], ['Jordan K.', 78, 38, 0], ['Ava R.', 69, 69, 3], ['Dana L.', 71, 44, 5]];
const scoreCol = (v) => (v >= 66 ? GREEN : v >= 50 ? AMBER : RED);
function sceneHealth(t) {
  const t0 = T.quiet; stage(t, 0.2); eyebrow('CLIENT HEALTH', 300);
  card(CARD.x, 350, CARD.w, 880);
  const fl = ease.inOut(seg(t, T.flag, T.flag + 0.9));
  CLIENTS.forEach(([n, a, b, ci], i) => {
    const e = ease.out(seg(t, t0 + i * 0.12, t0 + 0.4 + i * 0.12)), y = 440 + i * 160; if (e <= 0) return; const risk = a !== b, v = Math.round(lerp(a, b, risk ? fl : 0)), flagged = risk && fl > 0.6;
    withFade(e, () => {
      if (i) { ctx.fillStyle = 'rgba(255,255,255,0.07)'; ctx.fillRect(CARD.x + 30, y - 80, CARD.w - 60, 2); }
      avatar(CARD.x + 76, y, 38, n.slice(0, 2).toUpperCase(), NAMES[ci][1]); text(n, CARD.x + 136, y - 16, 32, 800, '#fff', 'left');
      text(flagged ? 'Visit overdue · No reply' : 'Active', CARD.x + 136, y + 24, 24, 500, flagged ? '#ffb3aa' : SOFT, 'left');
      const sc = pop(t, T.score + i * 0.1, 0.3); if (sc > 0) xf(CARD.x + CARD.w - 90, y, clamp(sc), 0, () => { circle(CARD.x + CARD.w - 90, y, 46, rgba(scoreCol(v), 0.18)); ring(CARD.x + CARD.w - 90, y, 46, scoreCol(v), 5); text(String(v), CARD.x + CARD.w - 90, y + 2, 38, 800, '#fff', 'center', 0); });
      if (flagged) tag(CARD.x + CARD.w - 160, y - 18, 'AT RISK', RED, true, 18);
    });
  });
  const z = seg(t, T.flag + 0.8, T.flag + 1.1); withFade(z, () => { const s = '2 AT RISK · FLAGGED EARLY', w = tw(s, 28, 800, 0.1) + 80; fillRR(CX - w / 2, 1290, w, 80, 40, rgba(RED, 0.2)); strokeRR(CX - w / 2, 1290, w, 80, 40, RED, 3); text(s, CX, 1331, 28, 800, '#ffb3aa', 'center', 0.1); });
}
function sceneWin(t) {
  stage(t, 0.22); const t0 = T.win; eyebrow('AUTOMATION · WIN-BACK', 290);
  [['At risk', RED, 0], ['SMS', IN.mid, 0.2], ['Email', IN.mid, 0.4], ['Book', GREEN, 0.6]].forEach(([s, col, d], i) => { const e = pop(t, t0 + d, 0.28); if (e <= 0) return; const x = 95 + i * 240; xf(x + 90, 380, clamp(e), 0, () => { fillRR(x, 340, 180, 84, 42, rgba(col, 0.18)); strokeRR(x, 340, 180, 84, 42, col, 3); text(s, x + 90, 383, 30, 800, '#fff', 'center', 0); }); if (i < 3 && e > 0.5) text('›', x + 210, 382, 44, 800, MUTED, 'center'); });
  const b1 = pop(t, T.send, 0.3), b2 = pop(t, T.send + 0.7, 0.3), bk = pop(t, T.send + 1.3, 0.3);
  card(CARD.x, 500, CARD.w, 700);
  if (b1 > 0) xf(CX, 640, clamp(b1), 0, () => bubble(140, 560, 800, ['Hi Jordan, it’s been a while!', 'Want your usual Thursday at 10?'], false));
  if (b2 > 0) xf(CX, 840, clamp(b2), 0, () => bubble(140, 790, 800, ['Yes please! Thursday at 10 works.'], true));
  if (bk > 0) xf(CX, 1060, clamp(bk), 0, () => { fillRR(190, 980, 700, 150, 28, rgba(GREEN, 0.14)); strokeRR(190, 980, 700, 150, 28, GREEN, 3); circle(270, 1055, 30, GREEN); check(270, 1056, 30, '#fff', 5); text('Booked · Thu 10:00', 330, 1040, 36, 800, '#fff', 'left', 0); text('Health score 38 → 86', 330, 1090, 26, 600, '#9ff0c0', 'left', 0); });
}
// ═════════════ the offer: a free audit, comment KEEP ═════════════
function sceneAudit(t) {
  const at = T.ask; stage(t, 0.3);
  withFade(enter(t, at - 0.02, T.end, 0.15), () => {
    const k = pop(t, at, 0.35); xf(CX, 430, 0.6 + 0.4 * clamp(k), 0, () => { ctx.save(); ctx.globalAlpha = clamp(k * 1.4); tag(CX + 70, 330, 'FREE', GREEN, true, 30); text('Retention', CX, 470, 150, 800, '#fff', 'center', -0.04); text('audit', CX, 620, 150, 800, '#fff', 'center', -0.04); ctx.restore(); });
    withFade(seg(t, at + 0.3, at + 0.6), () => text('We’ll show you who’s going quiet', CX, 780, 38, 600, SOFT, 'center'));
    const bx = pop(t, T.cmt - 0.1, 0.3); if (bx > 0) xf(CX, 960, clamp(bx), 0, () => { fillRR(110, 900, 860, 120, 60, 'rgba(255,255,255,0.08)'); strokeRR(110, 900, 860, 120, 60, 'rgba(255,255,255,0.25)', 3);
      const typed = 'KEEP'.slice(0, Math.max(0, Math.floor((t - (T.cmt + 0.45)) / 0.11))); text(typed || 'Add a comment…', 160, 962, 42, typed ? 800 : 500, typed ? '#fff' : MUTED, 'left', 0);
      if (typed && Math.floor(t * 3) % 2 === 0) fillRR(160 + tw(typed, 42, 800, 0) + 6, 934, 4, 56, 2, IN.mid); circle(910, 960, 36, typed.length === 4 ? C.primary : 'rgba(255,255,255,0.12)'); text('↑', 910, 962, 40, 800, '#fff', 'center', 0); });
    const b = pop(t, T.cmt + 1.0, 0.35); if (b > 0) xf(CX, 1180, clamp(b), 0, () => { const lb = 'Comment “KEEP”', w = tw(lb, 48, 800) + 140; glow(CX, 1180, 380, C.primary, 0.4 + 0.12 * Math.sin(t * 4)); fillRR(CX - w / 2, 1120, w, 120, 60, C.primary); strokeRR(CX - w / 2, 1120, w, 120, 60, 'rgba(255,255,255,0.25)', 2); text(lb, CX, 1182, 48, 800, '#fff', 'center'); });
  });
}
function auditEnd(t, at, tapAt, urlAt) {
  const k = ease.quint(seg(t, at, at + 0.4)); stage(t, 0.18 + 0.2 * k);
  if (t < at + 0.3) glow(CX, 860, 800, C.primary, 0.45 * (1 - seg(t, at, at + 0.3)));
  xf(CX, 600, 1 + 0.2 * (1 - k), 0, () => { ctx.save(); ctx.globalAlpha = k; logoLockup(CX, 560, 96); text(BRAND.tagline, CX, 670, 32, 500, SOFT, 'center'); ctx.restore(); });
  const b = ease.back(seg(t, at + 0.35, at + 0.75)); if (b <= 0) return;
  const press = t > tapAt - 0.06 && t < tapAt + 0.16 ? 0.94 : 1, lb = 'Comment “KEEP”', bw = tw(lb, 46, 800) + 150, bh = 116, by = 790;
  ctx.save(); ctx.globalAlpha = clamp(b); ctx.translate(CX, by + bh / 2); ctx.scale(b * press, b * press); ctx.translate(-CX, -(by + bh / 2));
  glow(CX, by + bh / 2, 360, C.primary, 0.45 + 0.15 * Math.sin(t * 4)); fillRR(CX - bw / 2, by, bw, bh, bh / 2, C.primary); strokeRR(CX - bw / 2, by, bw, bh, bh / 2, 'rgba(255,255,255,0.25)', 2); text(lb, CX, by + bh / 2 + 2, 46, 800, '#fff', 'center'); ctx.restore();
  const o = ease.back(seg(t, at + 0.8, at + 1.1)); if (o > 0) { ctx.save(); ctx.globalAlpha = clamp(o); const s2 = 'FREE RETENTION AUDIT', w = tw(s2, 22, 800, 0.12) + 44; ctx.translate(CX, by + bh + 70); ctx.scale(o, o); fillRR(-w / 2, -26, w, 52, 12, rgba(GREEN, 0.18)); strokeRR(-w / 2, -26, w, 52, 12, rgba(GREEN, 0.6), 2); text(s2, 0, 1, 22, 800, '#9ff0c0', 'center', 0.12); ctx.restore(); }
  withFade(seg(t, urlAt, urlAt + 0.3), () => text(BRAND.url.toUpperCase(), CX, by + bh + 160, 28, 800, IN.mid, 'center', 0.18));
  if (HAND && t > tapAt - 0.7 && t < tapAt + 0.8) {
    const p = seg(t, tapAt - 0.7, tapAt - 0.05), q = seg(t, tapAt + 0.25, tapAt + 0.8), ax = CX + bw / 2 - 60;
    const hx = ax + (1 - ease.out(p)) * 220 + q * 160, hy = by + bh / 2 + 28 + (1 - ease.out(p)) * 300 + q * 240;
    ctx.save(); ctx.globalAlpha = clamp(p * 3) * (1 - q);
    if (t > tapAt && t < tapAt + 0.4) { const r = seg(t, tapAt, tapAt + 0.4); ctx.strokeStyle = rgba('#ffffff', 0.7 * (1 - r)); ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(hx, hy, 20 + r * 60, 0, Math.PI * 2); ctx.stroke(); }
    ctx.translate(hx, hy); ctx.rotate(-0.12); ctx.scale(0.5, 0.5); ctx.translate(-110.5, -117); ctx.drawImage(HAND, 0, 0); ctx.restore();
  }
}
const SCENES = [[0, T.s1, sceneHook], [T.s1, T.s2, sceneHoles], [T.s2, T.s3, sceneArmor], [T.s3, T.s4, sceneWald], [T.s4, T.s5, sceneEngines], [T.s5, T.brand, sceneSilent],
  [T.brand, T.quiet, (t) => brandHit(t, T.brand, T.quiet)], [T.quiet, T.win, sceneHealth], [T.win, T.ask, sceneWin], [T.ask, T.end, sceneAudit], [T.end, 999, (t) => auditEnd(t, T.end, T.cta, T.url)]];
cue(0.3, 'swish', 0.6); for (let i = 0; i < 5; i++) cue(word(0, 1) + i * 0.2, 'tap', 0.6); cue(T.s1, 'swish', 0.7); for (let i = 0; i < 12; i++) cue(T.wings + i * 0.14, 'tap', 0.45); cue(T.eng, 'ding', 0.8);
cue(T.s2, 'swish', 0.7); for (let i = 0; i < 4; i++) cue(T.armor + i * 0.18, 'punch', 0.7); cue(T.s3, 'swish', 0.7); cue(T.no, 'punch', 1); cue(T.no + 0.3, 'ding', 0.7);
for (let i = 0; i < 4; i++) cue(T.s4 + 0.05 + i * 0.12, 'punch', 0.6); cue(T.never, 'transition', 0.8); cue(T.s5, 'swish', 0.6); [0.45, 0.85, 1.25].forEach((d) => cue(T.s5 + d, 'notification', 0.7)); cue(T.s6, 'transition', 0.7); cue(T.gone + 0.2, 'punch', 0.8);
cue(T.brand, 'transitionHit', 1); for (let i = 0; i < 5; i++) cue(T.quiet + i * 0.12, 'key', 0.5); cue(T.flag, 'punch', 0.9); cue(T.flag + 0.2, 'notification', 0.8);
for (let i = 0; i < 4; i++) cue(T.win + i * 0.2, 'tap', 0.6); cue(T.send, 'swoosh', 0.8); cue(T.send + 0.7, 'notification', 0.9); cue(T.send + 1.3, 'ding', 1);
cue(T.ask, 'punch', 1); for (let i = 0; i < 4; i++) cue(T.cmt + 0.45 + i * 0.11, 'key', 0.6); cue(T.cmt + 1.0, 'ding', 0.9); cue(T.end, 'swish', 0.8); cue(T.cta, 'tap', 1.2);
boot({ duration: DURATION, scenes: SCENES, brandAt: T.brand, hideCaption: (t) => t >= T.end - 0.1,
  after: (t) => { const f = 1 - seg(t, T.brand, T.brand + 0.12); if (t >= T.brand && f > 0) { ctx.fillStyle = rgba('#ffffff', 0.5 * f); ctx.fillRect(0, 0, W, H); } } }, 'wald');
