// MsgHealth · "One take" · a single continuous motion-graphics shot (1080 × 1920, 60 fps), no cuts.
// Every element grows out of the one before it:
//   title → particles → a dot → a heartbeat (ECG) → beads → a grid of customers → some go quiet → a radar sweep flags them →
//   one customer becomes a health-score ring → the ring opens into the client-health card → the at-risk row grows an
//   automation flow → the SMS step becomes a message → the reply becomes a calendar booking → the calendar splits into
//   reviews / loyalty / payments tiles → the tiles flatten into a line → the line beats again → the heartbeat redraws itself
//   as the MsgHealth logo → the underline becomes the "Comment KEEP" button → everything collapses back into the dot.
// HUD: "● TAKE 01" and "CUTS 0", like a camera take. Rendered with sub-frame motion blur (render mode only).
// Built on the primitives in src/kit.js (its boot() isn't used). Voiceover: src/onetake-vo.js, assets/audio/onetake/.
// Names, scores and prices on the product screens are illustrative.
'use strict';
const word = (l, k) => VO_AT[l] + VO_CLIPS[l].chunks[k][1];
const V = VO_AT;
const T = {
  title: V[0], title2: word(0, 1), collapse: V[1] - 0.15, dot: V[1] + 1.0, watch: V[2], pulse: word(2, 1), biz: V[3], cust: word(3, 1),
  quiet: V[4], leave: word(4, 1), brand: V[5], score: V[6], live: word(6, 1), slips: V[7], reach: word(7, 1),
  text: V[8], reply: V[8] + 0.62, booking: word(8, 2), tiles: V[9], same: word(9, 1), back: V[10], gaps: V[11], cuts: word(11, 2),
  keep: V[12], audit: word(12, 1), url: V[13],
};
T.dotEnd = T.collapse + 1.15;                 // particles finish converging into the dot
T.radar = T.brand; T.focus = T.brand + 0.85;  // radar sweep, then focus on Jordan
T.card = T.live + 0.05;                       // ring → client-health card
T.flat = T.back - 0.75;                       // tiles flatten into a line
T.logo = T.gaps + 0.05; T.logoDone = T.logo + 1.55; T.word = T.logoDone - 0.05;
T.end = V[13] + 1.55; T.endDone = T.end + 1.1;
const DURATION = +(T.endDone + 1.1).toFixed(2);
window.CUES = T; window.SFX = []; const cue = (t, kind, gain) => window.SFX.push({ t, kind, gain });
window.MUSIC = { bpm: 96, root: 45, brandAt: T.brand, mood: 'sneaky', bed: false, fx: 0.5 };

// ── look ─────────────────────────────────────────────────────────────────────
const BG = '#0c0b11', INK = '#f4f3f8', DIMI = 'rgba(244,243,248,0.42)', LINE = 'rgba(255,255,255,0.10)', PANEL = 'rgba(255,255,255,0.035)';
const ACC = '#8f88ff', ACC2 = '#6d66ff', GRN = '#3ddc84', RD = '#ff5a4f', AMB = '#f5b544';
const MONO = 'JetBrains Mono';
const SY = 900; // vertical centre of the stage
const K = (t, a, b, e = ease.inOut) => e(seg(t, a, b));
function mono(s, x, y, size, col, align = 'left', weight = 500, track = 0.08) { ctx.font = `${weight} ${size}px '${MONO}'`; ctx.letterSpacing = `${(size * track).toFixed(2)}px`; ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.fillStyle = col; ctx.fillText(s, x, y); }
function monoW(s, size, weight = 500, track = 0.08) { ctx.font = `${weight} ${size}px '${MONO}'`; ctx.letterSpacing = `${(size * track).toFixed(2)}px`; return ctx.measureText(s).width; }
function lr(a, b, k) { return a.map((v, i) => lerp(v, b[i], k)); } // lerp arrays (rects)
function panel(x, y, w, h, r = 28, a = 1, glowCol = null) {
  ctx.save(); ctx.globalAlpha *= a;
  if (glowCol) { ctx.shadowColor = glowCol; ctx.shadowBlur = 40; }
  fillRR(x, y, w, h, Math.min(r, h / 2, w / 2), '#15131c'); ctx.shadowBlur = 0;
  fillRR(x, y, w, h, Math.min(r, h / 2, w / 2), PANEL); strokeRR(x, y, w, h, Math.min(r, h / 2, w / 2), LINE, 2);
  ctx.restore();
}
function arcRing(x, y, r, lw, frac, col, track = 'rgba(255,255,255,0.08)') {
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.strokeStyle = track; ctx.lineWidth = lw; ctx.stroke();
  if (frac > 0.001) { ctx.beginPath(); ctx.arc(x, y, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * frac); ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.stroke(); }
}
const scoreCol = (v) => (v >= 66 ? GRN : v >= 50 ? AMB : RD);
let GRAIN = null;
function background(t) {
  ctx.fillStyle = BG; ctx.fillRect(0, 0, W, H);
  const g = ctx.createRadialGradient(CX, SY - 60, 40, CX, SY, 1250); g.addColorStop(0, 'rgba(60,52,110,0.30)'); g.addColorStop(0.45, 'rgba(25,22,40,0.18)'); g.addColorStop(1, 'rgba(0,0,0,0.55)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}
function grain(t) { if (!GRAIN) return; const f = Math.floor(t * 30); ctx.save(); ctx.globalAlpha = 0.07; ctx.globalCompositeOperation = 'overlay'; const ox = (hash(f) * 256) | 0, oy = (hash(f + 7) * 256) | 0; for (let x = -ox; x < W; x += 256) for (let y = -oy; y < H; y += 256) ctx.drawImage(GRAIN, x, y); ctx.restore(); }

// ── 1 · title → particles → dot ──────────────────────────────────────────────
const TITLE = [['Try', 'to', 'spot'], ['a', 'single', 'cut'], ['in', 'this', 'video.']];
let GLYPHS = null; // [{ch, x, y, line, wi, accent}]
function layoutTitle() {
  GLYPHS = []; const size = 104; font(size, 700, -0.035);
  TITLE.forEach((ln, li) => { const full = ln.join(' '), wFull = ctx.measureText(full).width; let x = CX - wFull / 2; const y = 700 + li * 124;
    ln.forEach((wd, wi) => { for (const ch of wd) { const cw = ctx.measureText(ch).width; GLYPHS.push({ ch, x: x + cw / 2, y, li, wi, acc: wd === 'cut' }); x += cw; } x += ctx.measureText(' ').width; }); });
}
function sceneTitle(t) {
  if (t > T.dotEnd + 0.05) return; if (!GLYPHS) layoutTitle();
  const size = 104;
  GLYPHS.forEach((g, i) => {
    const wordAt = g.li < 2 ? T.title + (g.li * 3 + g.wi) * 0.17 : T.title2 + g.wi * 0.16;
    const a = K(t, wordAt, wordAt + 0.4, ease.out); if (a <= 0) return;
    // collapse: each glyph spirals into the dot, outer glyphs a touch later
    const d = Math.hypot(g.x - CX, g.y - SY), st = T.collapse + d / 2400 + hash(i) * 0.12, c = K(t, st, st + 0.8, (u) => u * u * (3 - 2 * u));
    const ang = Math.atan2(g.y - SY, g.x - CX) + c * c * 2.4, rad = d * (1 - ease.in(c));
    const x = c > 0 ? CX + Math.cos(ang) * rad : g.x, y = c > 0 ? SY + Math.sin(ang) * rad : g.y + (1 - a) * 40;
    const s = 1 - 0.92 * ease.in(c);
    ctx.save(); ctx.translate(x, y); ctx.rotate(c * (hash(i + 3) - 0.5) * 4); ctx.scale(s, s); ctx.globalAlpha = a * (1 - seg(c, 0.85, 1));
    if (a < 1) ctx.filter = `blur(${((1 - a) * 10).toFixed(1)}px)`;
    text(g.ch, 0, 0, size, 700, g.acc ? ACC : INK, 'center', -0.035); ctx.filter = 'none'; ctx.restore();
  });
}

// ── 2 · the dot and the heartbeat ────────────────────────────────────────────
const g1 = (u, m, s) => Math.exp(-((u - m) * (u - m)) / (2 * s * s));
function ecg(u) { u = ((u % 1) + 1) % 1; return -0.10 * g1(u, 0.16, 0.03) + 0.13 * g1(u, 0.31, 0.010) - 1.0 * g1(u, 0.345, 0.011) + 0.34 * g1(u, 0.385, 0.012) - 0.24 * g1(u, 0.6, 0.045); }
const BEAT = 1.3; // beats per second
const E1 = { start: T.pulse - 0.28, speed: 430, amp: 150 }, E2 = { start: T.back - 0.1, speed: 430, amp: 170 };
const penX1 = (t) => lerp(CX, 760, K(t, T.pulse - 0.3, T.pulse + 0.7));
function ecgY(E, ts) { if (ts < E.start) return 0; const ramp = clamp((ts - E.start) * 3); return ecg((ts - E.start) * BEAT) * E.amp * ramp; }
function traceECG(t, E, penX, x0, col, lw, alpha, flatBefore = false) {
  ctx.save(); ctx.globalAlpha *= alpha; ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.shadowColor = col; ctx.shadowBlur = 18;
  ctx.beginPath(); let on = false;
  for (let x = penX; x >= x0; x -= 3) { const ts = t - (penX - x) / E.speed; if (ts < E.start && !flatBefore) break; const y = SY + ecgY(E, ts); on ? ctx.lineTo(x, y) : ctx.moveTo(x, y); on = true; }
  ctx.stroke(); ctx.restore();
}
function sceneDot(t) {
  if (t < T.collapse + 0.55 || t > T.cust + 0.6) return;
  const appear = K(t, T.collapse + 0.55, T.dotEnd, ease.out);
  const px = penX1(t), py = SY + ecgY(E1, t);
  const breathe = t < T.pulse ? 1 + 0.12 * Math.sin((t - T.dotEnd) * 4) * seg(t, T.dotEnd, T.dotEnd + 0.4) : 1;
  // the trace behind the pen; it fades at the left edge and dissolves into beads when the customers arrive
  if (t > E1.start) { const fade = 1 - seg(t, T.cust, T.cust + 0.35); ctx.save(); const gr = ctx.createLinearGradient(40, 0, px, 0); gr.addColorStop(0, rgba('#ffffff', 0)); gr.addColorStop(0.3, rgba('#ffffff', 0.85)); gr.addColorStop(1, '#ffffff'); traceECG(t, E1, px, 40, gr, 5, fade); ctx.restore(); }
  if (t < T.cust) { // the pen
    const r = 15 * appear * breathe; glow(px, py, 90, '#ffffff', 0.25 * appear); circle(px, py, r, '#fff');
    if (t > T.pulse - 0.3) { const ph = ((t - E1.start) * BEAT) % 1; const k = seg(ph, 0.34, 0.9); if (t > E1.start) ring(px, py, 15 + k * 70, rgba('#ffffff', 0.45 * (1 - k)), 3); }
  }
}

// ── 3 · beads → customers ────────────────────────────────────────────────────
const CUST = []; // grid of 20 customers
const PAL = ['#6d66ff', '#e5568f', '#f08a3c', '#14b8a6', '#3b82f6', '#a855f7', '#22c55e', '#eab308'];
const INIT = ['PR', 'MT', 'AV', 'DL', 'SK', 'NO', 'EL', 'JO', 'RA', 'LI', 'KM', 'TS', 'BE', 'CH', 'ZA', 'OM', 'IV', 'HU', 'FE', 'GA'];
const QUIET = [4, 7, 13, 16], JORDAN = 7;
for (let i = 0; i < 20; i++) { const c = i % 5, r = Math.floor(i / 5); CUST.push({ i, x: CX + (c - 2) * 178, y: SY + (r - 1.5) * 178, col: PAL[i % PAL.length], ini: INIT[i] }); }
const BEADX = Array.from({ length: 20 }, (_, k) => lerp(120, 740, k / 19)); // bead sample positions on the trace
const ORDER = (() => { const cols = [...Array(20).keys()].filter((i) => i !== JORDAN).sort((a, b) => (a % 5) - (b % 5) || Math.floor(a / 5) - Math.floor(b / 5)); return cols; })();
function beadSource(i) { // where customer i comes from on the trace (frozen at T.cust)
  if (i === JORDAN) return [penX1(T.cust), SY + ecgY(E1, T.cust)];
  const k = ORDER.indexOf(i), x = BEADX[Math.min(18, k)], ts = T.cust - (penX1(T.cust) - x) / E1.speed; return [x, SY + ecgY(E1, ts)];
}
function custState(t, c) {
  const k = c.i === JORDAN ? 0 : ORDER.indexOf(c.i), st = T.cust + k * 0.022, f = K(t, st, st + 0.85, ease.inOut);
  const [sx, sy] = beadSource(c.i); const arc = Math.sin(f * Math.PI) * (c.y < SY ? -60 : 60);
  let x = lerp(sx, c.x, f), y = lerp(sy, c.y, f) + arc, r = lerp(6, 50, ease.out(f)), a = 1;
  const isQ = QUIET.includes(c.i), q = isQ ? K(t, T.quiet + QUIET.indexOf(c.i) * 0.14, T.quiet + 0.6 + QUIET.indexOf(c.i) * 0.14) : 0, lv = isQ ? K(t, T.leave, T.leave + 1.0) : 0;
  if (isQ) { y += 10 * q + 18 * lv; x += (c.x < CX ? -1 : c.x > CX ? 1 : 0) * 14 * lv; }
  // focus: everyone but Jordan drifts out and fades; Jordan grows into the score ring
  const fo = K(t, T.focus, T.focus + 0.95);
  if (c.i !== JORDAN) { x = lerp(x, CX + (x - CX) * 1.35, fo); y = lerp(y, SY + (y - SY) * 1.35, fo); a = 1 - fo; r *= 1 - 0.3 * fo; }
  else { x = lerp(x, CX, fo); y = lerp(y, SY - 40, fo); r = lerp(r, 160, fo); }
  return { x, y, r, f, q, lv, a, fo };
}
function sceneCustomers(t) {
  if (t < T.cust || t > T.card + 1.2) return;
  const radarR = lerp(0, 1150, K(t, T.radar, T.radar + 0.9, ease.out)), radarOn = t > T.radar && t < T.radar + 1.1;
  if (radarOn) { const ra = 1 - seg(t, T.radar + 0.6, T.radar + 1.05); ctx.save(); ctx.globalAlpha = ra; ring(CX, SY, radarR, rgba(ACC, 0.7), 3); const gr = ctx.createRadialGradient(CX, SY, Math.max(0, radarR - 140), CX, SY, radarR); gr.addColorStop(0, rgba(ACC, 0)); gr.addColorStop(1, rgba(ACC, 0.16)); ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(CX, SY, radarR, 0, 7); ctx.fill(); ctx.restore(); }
  CUST.forEach((c) => {
    const s = custState(t, c); if (s.a <= 0.01 || s.f <= 0) return;
    const isQ = QUIET.includes(c.i), col = isQ ? mix(c.col, '#34323f', s.q) : c.col, hit = radarOn || t > T.radar ? Math.hypot(c.x - CX, c.y - SY) < radarR : false;
    ctx.save(); ctx.globalAlpha *= s.a * (isQ ? 1 - 0.35 * s.lv : 1);
    if (c.i === JORDAN && s.fo > 0) { scoreRing(t, s); ctx.restore(); return; }
    // heartbeat ring on the living ones
    if (s.f > 0.9) { const ph = ((t * 0.8 + hash(c.i) * 3) % 1.6) / 1.6, al = (1 - s.q) * (1 - ph) * 0.35; if (al > 0.01) ring(s.x, s.y, s.r + ph * 26, rgba(c.col, al), 2.5); }
    if (s.f < 1) glow(s.x, s.y, s.r * 3, '#ffffff', 0.25 * (1 - s.f));
    circle(s.x, s.y, s.r, s.f < 0.5 ? mix('#ffffff', col, s.f * 2) : col);
    if (s.f > 0.6) { ctx.save(); ctx.globalAlpha *= seg(s.f, 0.6, 1) * (isQ ? 1 - 0.5 * s.q : 1); text(c.ini, s.x, s.y + 1, s.r * 0.66, 700, '#fff', 'center', 0); ctx.restore(); }
    if (isQ && s.lv > 0) { ctx.save(); ctx.setLineDash([8, 9]); ctx.lineDashOffset = -t * 20; ring(s.x, s.y, s.r + 10, rgba('#ffffff', 0.35 * s.lv), 2); ctx.restore(); }
    if (isQ && hit) { const h = ease.back(clamp((t - (T.radar + Math.hypot(c.x - CX, c.y - SY) / 1150 * 0.9)) / 0.3)); ring(s.x, s.y, s.r + 10, rgba(RD, h), 4); circle(s.x + s.r * 0.75, s.y - s.r * 0.75, 13 * h, RD); text('!', s.x + s.r * 0.75, s.y - s.r * 0.75 + 1, 18 * h, 800, '#fff', 'center', 0); }
    ctx.restore();
  });
  // Jordan's note, before the focus
  const j = CUST[JORDAN], jl = K(t, T.leave + 0.25, T.leave + 0.6, ease.out) * (1 - K(t, T.focus - 0.1, T.focus + 0.3));
  if (jl > 0) { const s = custState(t, j); ctx.save(); ctx.globalAlpha = jl; const lb = 'LAST VISIT 41 DAYS AGO'; const w = monoW(lb, 20) + 36; fillRR(s.x - w / 2, s.y + 70, w, 40, 20, 'rgba(12,11,17,0.85)'); strokeRR(s.x - w / 2, s.y + 70, w, 40, 20, rgba(RD, 0.5), 1.5); mono(lb, s.x, s.y + 91, 20, '#ffb1aa', 'center'); ctx.restore(); }
}

// ── 4 · Jordan's score ring → the client-health card ─────────────────────────
const CARD0 = [110, 500, 860, 690], ROWY = (i) => 640 + i * 118, RING1 = [880, 640, 34];
const ROWS = [['Jordan K.', 'Cut & colour · since 2023', 38, JORDAN], ['Priya S.', 'Colour · every 6 weeks', 84, 0], ['Marcus T.', 'Cut · every 4 weeks', 77, 1], ['Ava R.', 'Trim · monthly', 58, 2], ['Dana L.', 'Cut · every 3 weeks', 92, 3]];
function ringGeom(t) { // the score ring centre/radius/line width across the focus and the card morph
  const s = custState(t, CUST[JORDAN]), m = K(t, T.card, T.card + 0.95);
  return { x: lerp(s.x, RING1[0], m), y: lerp(s.y, RING1[1], m), r: lerp(s.r, RING1[2], m), lw: lerp(lerp(6, 20, s.fo), 7, m), m };
}
function scoreRing(t, s) {
  const g = ringGeom(t), fill = K(t, T.score + 0.1, T.score + 1.2, ease.out), v = Math.round(38 * fill);
  if (g.m <= 0) {
    const ini = 1 - seg(s.fo, 0.2, 0.6); circle(g.x, g.y, g.r - g.lw / 2 - 2, mix('#34323f', '#17141f', s.fo));
    if (ini > 0) { ctx.save(); ctx.globalAlpha *= ini; text('JO', g.x, g.y + 1, g.r * 0.62, 700, '#fff', 'center', 0); ctx.restore(); }
    arcRing(g.x, g.y, g.r, g.lw, 0.38 * fill, RD, rgba('#ffffff', 0.08 * s.fo + 0.0));
    if (s.fo > 0.5 && fill <= 0) ring(g.x, g.y, g.r, rgba(RD, s.fo), g.lw * 0.4);
    const n = seg(t, T.score, T.score + 0.3); if (n > 0) { ctx.save(); ctx.globalAlpha *= n; ctx.shadowColor = RD; ctx.shadowBlur = 30 * fill; text(String(v), g.x, g.y - 6, 118, 800, '#fff', 'center', -0.04); ctx.restore(); mono('HEALTH SCORE', g.x, g.y + 70, 20, rgba('#ffffff', 0.55 * n), 'center'); }
  }
}
function sceneCard(t) {
  if (t < T.card || t > T.tiles + 0.02) return;
  const g = ringGeom(t), m = g.m;
  // the card grows out of the ring: same centre, circle → rounded rect
  const from = [g.x - g.r, g.y - g.r, g.r * 2, g.r * 2];
  const fold = K(t, T.reach - 0.05, T.reach + 0.6), toChat = [110, 380, 860, 160];
  const cal = K(t, T.booking, T.booking + 0.8);
  let rect = lr(lr(from, CARD0, m), toChat, fold); rect = lr(rect, CALR, cal);
  panel(...rect, lerp(g.r, 28, m), clamp(m * 3));
  const shift = lerp(0, 460 - ROWY(0), fold); // rows ride up as the card folds to the chat header
  // Jordan's ring travels into row 1 (it never disappears)
  { const yy = m < 1 ? g.y : ROWY(0) + shift; ctx.save(); ctx.globalAlpha *= 1 - cal; if (m < 1) circle(g.x, yy, g.r - g.lw / 2 - 2, '#17141f'); arcRing(g.x, yy, g.r, g.lw, 0.38, RD); text('38', g.x, yy + (m < 1 ? lerp(-6, 1, m) : 1), lerp(118, 24, m), 800, INK, 'center', 0); ctx.restore(); }
  const inside = seg(m, 0.55, 1);
  if (inside <= 0) return;
  ctx.save(); ctx.globalAlpha *= inside;
  withFade(1 - fold, () => { text('Client health', 160, 560, 34, 700, INK, 'left'); const lp = 0.5 + 0.5 * Math.sin(t * 5); circle(830, 560, 7, rgba(GRN, 0.5 + 0.5 * lp)); mono('LIVE', 848, 561, 20, GRN, 'left', 700); ctx.fillStyle = LINE; ctx.fillRect(140, 596, 800, 2); });
  ROWS.forEach(([n, sub, sc, ci], i) => {
    const open = i === 0 ? 1 : K(t, T.card + 0.55 + i * 0.08, T.card + 1.0 + i * 0.08, ease.out), close = i === 0 ? 0 : K(t, T.reach - 0.05 + (4 - i) * 0.04, T.reach + 0.35 + (4 - i) * 0.04);
    if (open <= 0 || close >= 1) return; const y = lerp(ROWY(0), ROWY(i), open * (1 - close)) + shift;
    ctx.save(); ctx.globalAlpha *= (i === 0 ? 1 : open * (1 - close)) * (1 - cal);
    if (i === 0) { const risk = K(t, T.slips, T.slips + 0.4); if (risk > 0) { fillRR(124, y - 54, 832, 108, 20, rgba(RD, 0.10 * risk)); strokeRR(124, y - 54, 832, 108, 20, rgba(RD, 0.45 * risk), 2); } }
    avatar(196, y, 36, i === 0 ? 'JO' : n.slice(0, 2).toUpperCase(), i === 0 ? CUST[JORDAN].col : PAL[(ci + 1) % PAL.length]);
    text(n, 252, y - 16, 32, 700, INK, 'left');
    const risk = i === 0 ? K(t, T.slips + 0.1, T.slips + 0.5) : 0; const subS = risk > 0.5 ? 'No reply · visit overdue' : sub;
    text(subS, 252, y + 22, 23, 500, risk > 0.5 ? '#ffb1aa' : DIMI, 'left');
    if (i === 0 && risk > 0) { ctx.save(); ctx.globalAlpha *= risk; xf(700, y, ease.back(risk), 0, () => tag(790, y, 'AT RISK', RD, true, 19)); ctx.restore(); }
    if (i > 0) { const f = K(t, T.card + 0.75 + i * 0.08, T.card + 1.5 + i * 0.08, ease.out); arcRing(880, y, 34, 7, sc / 100 * f, scoreCol(sc)); text(String(Math.round(sc * f)), 880, y + 1, 24, 800, INK, 'center', 0); }
    ctx.restore();
  });
  ctx.restore();
}
// the ring before the card exists (focus → score)
function sceneRingOnly(t) { if (t < T.card || t > T.card + 1) return; const g = ringGeom(t); if (g.m >= 1) return; }

// ── 5 · the automation flow → message → reply → booking ──────────────────────
const NODES = [['Send a text', 700], ['Email if no reply', 880], ['Offer a booking', 1060]];
const SMS_RECT = [330, 660, 420, 84], OUT_RECT = [300, 590, 640, 170], IN_RECT = [140, 800, 560, 110], BLOCK = [656, 699, 138, 112];
function sceneFlow(t) {
  if (t < T.reach || t > T.tiles + 0.6) return;
  const draw = K(t, T.reach + 0.35, T.reach + 1.7, (u) => u), out = K(t, T.text, T.text + 0.45);
  const y0 = 540, y1 = lerp(y0, 1060, draw);
  ctx.save(); ctx.globalAlpha *= 1 - out;
  ctx.strokeStyle = rgba(ACC, 0.8); ctx.lineWidth = 4; ctx.shadowColor = ACC; ctx.shadowBlur = 16; ctx.beginPath(); ctx.moveTo(CX, y0); ctx.lineTo(CX, y1); ctx.stroke(); ctx.shadowBlur = 0;
  if (draw > 0 && draw < 1) circle(CX, y1, 9, '#fff');
  mono('WIN-BACK AUTOMATION', CX + 40, 590, 18, rgba(ACC, 0.9 * seg(draw, 0, 0.1)), 'left', 700);
  NODES.forEach(([s, y], i) => { const k = ease.back(clamp((y1 - y + 30) / 60)); if (k <= 0 || (i === 0 && out > 0)) return; xf(CX, y, k, 0, () => { panel(CX - 210, y - 42, 420, 84, 42, 1, rgba(ACC, 0.35)); circle(CX - 166, y, 20, rgba(ACC, 0.22)); mono(String(i + 1).padStart(2, '0'), CX - 166, y + 1, 18, ACC, 'center', 700); text(s, CX - 130, y + 1, 30, 600, INK, 'left'); }); });
  ctx.restore();
  // node 01 becomes the outgoing text
  if (out > 0) {
    const b = K(t, T.booking, T.booking + 0.5), r = lr(SMS_RECT, OUT_RECT, out);
    ctx.save(); ctx.globalAlpha *= 1 - b; fillRR(...r, lerp(42, 34, out), mix('#1c1a26', '#5b54f0', out)); ctx.globalAlpha *= seg(out, 0.5, 1);
    text('Hey Jordan, we miss you! Want', r[0] + 36, r[1] + 58, 31, 500, '#fff', 'left'); text('your usual, Thursday at 10?', r[0] + 36, r[1] + 106, 31, 500, '#fff', 'left'); mono('SMS · DELIVERED', r[0] + r[2] - 24, r[1] + r[3] + 26, 17, rgba('#ffffff', 0.45), 'right'); ctx.restore();
  }
  // the reply, which then becomes the calendar block
  const rp = K(t, T.reply, T.reply + 0.45, ease.out);
  if (rp > 0) { const bk = K(t, T.booking + 0.1, T.booking + 0.8), r = lr(lr([140, 855, 40, 0], IN_RECT, rp), BLOCK, bk);
    ctx.save(); ctx.globalAlpha *= 1 - seg(t, T.tiles + 0.1, T.tiles + 0.5); fillRR(...r, lerp(30, 14, bk), mix('#26232f', '#5b54f0', bk));
    if (bk < 0.5) { ctx.globalAlpha *= seg(rp, 0.5, 1) * (1 - bk * 2); text('Yes please! Thursday works.', r[0] + 32, r[1] + r[3] / 2 + 1, 31, 500, '#fff', 'left'); }
    else { ctx.globalAlpha *= (bk - 0.5) * 2; text('Jordan', r[0] + 14, r[1] + 34, 22, 700, '#fff', 'left', 0); mono('10:00', r[0] + 14, r[1] + 66, 16, rgba('#ffffff', 0.7), 'left'); const c = ease.back(seg(t, T.booking + 0.75, T.booking + 1.05)); if (c > 0) { circle(r[0] + r[2] - 8, r[1] + 8, 18 * c, GRN); check(r[0] + r[2] - 8, r[1] + 9, 18 * c, '#fff', 3.5); } }
    ctx.restore(); }
}
// the chat header (the folded card) and the calendar around the booking
const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI'], HOURS = ['9', '10', '11', '12', '1'];
const BUSY = [[0, 0], [0, 2], [1, 1], [1, 3], [2, 0], [2, 4], [3, 3], [4, 1], [4, 2], [3, 0]];
function sceneChatCal(t) {
  if (t < T.reach + 0.4 || t > T.tiles + 0.8) return;
  const hdr = K(t, T.reach + 0.35, T.reach + 0.7) * (1 - K(t, T.booking, T.booking + 0.35)), cal = K(t, T.booking + 0.15, T.booking + 0.8), gone = K(t, T.tiles - 0.05, T.tiles + 0.35);
  if (cal <= 0) return;
  ctx.save(); ctx.globalAlpha *= cal * (1 - gone);
  text('This week', 160, 450, 34, 700, INK, 'left'); const ch = ease.back(seg(t, T.booking + 0.9, T.booking + 1.2)); if (ch > 0) xf(860, 450, ch, 0, () => tag(930, 450, 'THU 10:00 BOOKED', GRN, false, 17));
  DAYS.forEach((d, i) => mono(d, 200 + i * 150 + 75, 540, 18, DIMI, 'center', 700));
  HOURS.forEach((h, j) => { mono(h.padStart(2, '0'), 172, 575 + j * 120 + 22, 16, DIMI, 'center'); ctx.fillStyle = 'rgba(255,255,255,0.06)'; ctx.fillRect(200, 575 + j * 120, 750, 1.5); });
  for (let i = 0; i <= 5; i++) { ctx.fillStyle = 'rgba(255,255,255,0.05)'; ctx.fillRect(200 + i * 150, 575, 1.5, 600); }
  BUSY.forEach(([c, r], k) => { const e = ease.out(seg(t, T.booking + 0.3 + k * 0.05, T.booking + 0.7 + k * 0.05)); if (e <= 0) return; ctx.save(); ctx.globalAlpha *= e; fillRR(206 + c * 150, 579 + r * 120, 138, 112, 14, 'rgba(255,255,255,0.07)'); ctx.restore(); });
  ctx.restore();
}

// ── 6 · calendar → reviews / loyalty / payments → one card → a line ─────────
const CALR = [110, 380, 860, 820];
const TILE_FROM = [[110, 380, 860, 280], [110, 660, 430, 540], [540, 660, 430, 540]], TILE_TO = [[110, 380, 860, 250], [110, 660, 420, 540], [550, 660, 420, 540]];
function tileRects(t) {
  const sp = K(t, T.tiles, T.tiles + 0.7), join = K(t, T.same, T.same + 0.7), flat = K(t, T.flat, T.flat + 0.7, ease.inOut);
  return TILE_FROM.map((f, i) => lr(lr(lr(f, TILE_TO[i], sp), f, join), [110, SY - 2, 860, 4], flat));
}
function sceneTiles(t) {
  if (t < T.tiles || t > T.back + 0.5) return;
  const rs = tileRects(t), join = K(t, T.same, T.same + 0.7), flat = K(t, T.flat, T.flat + 0.7), cont = 1 - seg(flat, 0, 0.35);
  if (flat > 0.98) return;
  if (join >= 0.999) panel(...lr(CALR, [110, SY - 2, 860, 4], flat), lerp(28, 2, flat), 1, rgba(ACC, 0.25 * (1 - flat))); else rs.forEach((r) => panel(...r, lerp(28, 2, flat), 1, join > 0.5 ? rgba(ACC, 0.2) : null));
  if (cont <= 0) return; ctx.save(); ctx.globalAlpha *= cont;
  if (flat > 0) { const h = lerp(820, 4, flat); ctx.translate(0, lerp(790, SY, flat)); ctx.scale(1, Math.max(0.01, h / 820)); ctx.translate(0, -790); } // squash with the panel, like a CRT switching off
  // reviews
  const [rx, ry, rw] = rs[0]; mono('REVIEWS', rx + 40, ry + 50, 18, DIMI, 'left', 700);
  for (let i = 0; i < 5; i++) { const e = ease.back(seg(t, T.tiles + 0.25 + i * 0.1, T.tiles + 0.55 + i * 0.1)); star(rx + 80 + i * 92, ry + 140, 40 * e, '#ffb400'); }
  const rv = seg(t, T.tiles + 0.8, T.tiles + 1.1); withFade(rv, () => { text('4.9', rx + rw - 60, ry + 128, 64, 800, INK, 'right', -0.03); text('Jordan left 5 stars', rx + rw - 60, ry + 180, 24, 500, DIMI, 'right'); });
  // loyalty
  const [lx, ly, lw] = rs[1], lp = K(t, T.tiles + 0.75, T.tiles + 1.6, ease.out); mono('LOYALTY', lx + 40, ly + 50, 18, DIMI, 'left', 700);
  withFade(seg(t, T.tiles + 0.6, T.tiles + 0.9), () => { arcRing(lx + lw / 2, ly + 250, 112, 16, lerp(0.86, 1, lp), lp > 0.98 ? GRN : ACC); text(String(Math.round(lerp(430, 500, lp))), lx + lw / 2, ly + 240, 60, 800, INK, 'center', -0.03); mono('/ 500 PTS', lx + lw / 2, ly + 290, 18, DIMI, 'center'); });
  const rw2 = ease.back(seg(t, T.tiles + 1.6, T.tiles + 1.9)); if (rw2 > 0) xf(lx + lw / 2, ly + 440, rw2, 0, () => tag(lx + lw / 2 + 140, ly + 440, 'REWARD UNLOCKED', GRN, false, 18));
  // payments
  const [px, py, pw] = rs[2]; mono('PAYMENTS', px + 40, py + 50, 18, DIMI, 'left', 700);
  withFade(seg(t, T.tiles + 1.2, T.tiles + 1.5), () => { text('$65.00', px + 40, py + 200, 76, 800, INK, 'left', -0.03); text('Jordan · cut & colour', px + 40, py + 262, 24, 500, DIMI, 'left'); });
  const pd = ease.back(seg(t, T.tiles + 1.55, T.tiles + 1.85)); if (pd > 0) xf(px + 120, py + 440, pd, 0, () => { fillRR(px + 40, py + 405, 170, 70, 35, rgba(GRN, 0.16)); strokeRR(px + 40, py + 405, 170, 70, 35, GRN, 2); circle(px + 80, py + 440, 16, GRN); check(px + 80, py + 441, 16, '#fff', 3.5); text('Paid', px + 108, py + 441, 30, 700, '#c6f6d8', 'left', 0); });
  ctx.restore();
}

// ── 7 · the pulse comes back → the logo ──────────────────────────────────────
const LOGO_S = 1.08, LOGO_C = [CX, 730];
const LP = { L: [[101, 82], [236, 251], [100, 389], [101, 82]], R: [[252, 301], [397, 105], [399, 410], [326, 328]] }; // stroke trace of assets/logo.png (512-unit box)
function resample(pts, n) { const seglen = []; let tot = 0; for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seglen.push(d); tot += d; } const out = []; for (let k = 0; k < n; k++) { let d = (k / (n - 1)) * tot, i = 0; while (i < seglen.length - 1 && d > seglen[i]) { d -= seglen[i]; i++; } const f = seglen[i] ? d / seglen[i] : 0; out.push([lerp(pts[i][0], pts[i + 1][0], f), lerp(pts[i][1], pts[i + 1][1], f)]); } return out; }
const NL = 120, NR = 120;
const TGT = [...resample(LP.L, NL), ...resample(LP.R, NR)].map(([x, y]) => [LOGO_C[0] + (x - 256) * LOGO_S, LOGO_C[1] + (y - 256) * LOGO_S]);
const penX2 = 970;
function srcTrace(t) { const pts = []; for (let k = 0; k < NL + NR; k++) { const x = lerp(110, 970, k / (NL + NR - 1)); const ts = t - (penX2 - x) / E2.speed; pts.push([x, SY + ecgY(E2, ts)]); } return pts; }
function sceneLine(t) {
  if (t < T.back - 0.2 || t > T.logoDone + 0.4) return;
  const m = K(t, T.logo, T.logoDone - 0.1, ease.inOut), colA = mix(GRN, ACC2, m);
  if (m <= 0) {
    // the flattened card is now the baseline; the pulse enters from the right
    ctx.save(); ctx.shadowColor = GRN; ctx.shadowBlur = 20; const gr = ctx.createLinearGradient(110, 0, 970, 0); gr.addColorStop(0, rgba(GRN, 0.15)); gr.addColorStop(0.5, rgba(GRN, 0.9)); gr.addColorStop(1, GRN);
    traceECG(t, E2, penX2, 110, gr, 5, 1, true); ctx.restore(); const py = SY + ecgY(E2, t); glow(penX2, py, 80, GRN, 0.35); circle(penX2, py, 12, '#eafff2');
    // Jordan's score climbs back
    const up = K(t, T.back + 0.2, T.back + 1.8, ease.out), v = Math.round(lerp(38, 86, up)); ctx.save(); ctx.globalAlpha = seg(t, T.back, T.back + 0.3) * (1 - seg(t, T.logo - 0.25, T.logo)); ctx.shadowColor = scoreCol(v); ctx.shadowBlur = 40; text(String(v), CX, 560, 170, 800, scoreCol(v), 'center', -0.04); ctx.shadowBlur = 0; mono('JORDAN · HEALTH SCORE', CX, 670, 22, DIMI, 'center'); ctx.restore();
    return;
  }
  const src = srcTrace(T.logo), lw = lerp(5, 62.3 * LOGO_S, ease.in(m)), fadeOut = seg(t, T.logoDone - 0.25, T.logoDone + 0.1);
  const P = src.map((p, k) => { const st = (k / src.length) * 0.25, f = ease.inOut(clamp((m - st) / 0.75)); return [lerp(p[0], TGT[k][0], f), lerp(p[1], TGT[k][1], f)]; });
  ctx.save(); ctx.globalAlpha *= 1 - fadeOut; ctx.strokeStyle = colA; ctx.lineWidth = lw; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.shadowColor = colA; ctx.shadowBlur = 30;
  const path = (a, b) => { ctx.beginPath(); P.slice(a, b).forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke(); };
  path(0, NL); path(NL, NL + NR);
  if (m < 0.6) { ctx.globalAlpha *= 1 - m / 0.6; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(...P[NL - 1]); ctx.lineTo(...P[NL]); ctx.stroke(); }
  ctx.restore();
}
function sceneLogo(t) {
  if (t < T.logoDone - 0.3 || t > T.endDone) return;
  const a = seg(t, T.logoDone - 0.3, T.logoDone + 0.1), sz = 512 * LOGO_S;
  const pulse = 1 + 0.025 * Math.exp(-(t - T.logoDone) * 5) * Math.sin((t - T.logoDone) * 30) * (t > T.logoDone ? 1 : 0);
  ctx.save(); ctx.globalAlpha *= a; glow(LOGO_C[0], LOGO_C[1], 420, ACC2, 0.35); xf(LOGO_C[0], LOGO_C[1], pulse, 0, () => { if (LOGO) ctx.drawImage(LOGO, LOGO_C[0] - sz / 2, LOGO_C[1] - sz / 2, sz, sz); }); ctx.restore();
  // the wordmark rises letter by letter, then its underline draws
  const wm = 'MsgHealth', size = 120; font(size, 800, -0.04); const total = ctx.measureText(wm).width; let x = CX - total / 2; const y = 1060;
  for (let i = 0; i < wm.length; i++) { const ch = wm[i]; font(size, 800, -0.04); const cw = ctx.measureText(ch).width; const k = ease.out(seg(t, T.word + i * 0.045, T.word + 0.35 + i * 0.045)); if (k > 0) { ctx.save(); ctx.globalAlpha *= k; ctx.save(); ctx.beginPath(); ctx.rect(0, y - 90, W, 150); ctx.clip(); text(ch, x + cw / 2, y + (1 - k) * 110, size, 800, INK, 'center', -0.04); ctx.restore(); ctx.restore(); } x += cw; }
  const ul = ease.inOut(seg(t, T.word + 0.55, T.word + 1.0)), ux = CX - total / 2, uw = total * ul;
  // the underline becomes the button
  const b = K(t, T.keep - 0.1, T.keep + 0.5, ease.inOut), r = lr([ux, 1132, Math.max(uw, 0.1), 7], [230, 1150, 620, 116], b);
  if (ul > 0) { ctx.save(); if (b > 0.3) { ctx.shadowColor = ACC2; ctx.shadowBlur = 50 * b; } fillRR(...r, lerp(3.5, 58, b), mix('#6d66ff', '#4f46e5', b)); ctx.restore(); }
  if (b > 0.5) { ctx.save(); ctx.globalAlpha *= (b - 0.5) * 2; text('Comment “KEEP”', CX, 1150 + 59, 46, 800, '#fff', 'center'); ctx.restore(); }
  const tg = ease.back(seg(t, T.audit, T.audit + 0.35)) * (1 - seg(t, T.url - 0.1, T.url + 0.2)); if (tg > 0) xf(CX, 1312, tg, 0, () => { const s = 'FREE RETENTION AUDIT', w = monoW(s, 22, 700) + 50; fillRR(CX - w / 2, 1290, w, 46, 23, rgba(GRN, 0.14)); strokeRR(CX - w / 2, 1290, w, 46, 23, rgba(GRN, 0.6), 1.5); mono(s, CX, 1314, 22, '#bdf5d3', 'center', 700); });
  const u = seg(t, T.url, T.url + 0.7); if (u > 0) { const s = 'msghealth.net', n = Math.ceil(s.length * u); mono(s.slice(0, n) + (u < 1 || Math.floor(t * 3) % 2 ? '' : '_'), CX, 1316, 42, ACC, 'center', 700, 0.02); }
}

// ── 8 · HUD + captions ───────────────────────────────────────────────────────
function hud(t) {
  const a = 0.75 * seg(t, 0, 0.4);
  ctx.save(); ctx.globalAlpha = a; const blink = Math.floor(t * 1.6) % 2 === 0 ? 1 : 0.35;
  circle(76, 112, 9, rgba('#ff4d4d', blink)); mono('TAKE 01', 98, 113, 24, INK, 'left', 700);
  const flash = t > T.cuts ? Math.max(seg(t, T.cuts, T.cuts + 0.2) * (1 - seg(t, T.cuts + 0.9, T.cuts + 1.6)), seg(t, T.endDone, T.endDone + 0.3)) : 0;
  const cw = monoW('CUTS 0', 24, 700); if (flash > 0) { fillRR(W - 76 - cw - 20, 92, cw + 40, 42, 21, rgba(ACC, 0.22 * flash)); }
  mono('CUTS', W - 76 - monoW('0', 24, 700) - 14, 113, 24, INK, 'right', 700); mono('0', W - 76, 113, 24, flash > 0 ? mix('#f4f3f8', ACC, flash) : INK, 'right', 700);
  const fr = Math.floor(t * 60), tc = `00:00:${String(Math.floor(t)).padStart(2, '0')}:${String(fr % 60).padStart(2, '0')}`; mono(tc, CX, 113, 20, DIMI, 'center');
  ctx.fillStyle = 'rgba(255,255,255,0.08)'; ctx.fillRect(76, 150, W - 152, 2); ctx.fillStyle = rgba(ACC, 0.7); ctx.fillRect(76, 150, (W - 152) * clamp(t / DURATION), 2);
  ctx.restore();
}
const CAPS = []; VO_CLIPS.forEach((clip, i) => clip.chunks.forEach(([s, off], k) => { const at = VO_AT[i] + off, nx = k + 1 < clip.chunks.length ? VO_AT[i] + clip.chunks[k + 1][1] : VO_AT[i] + clip.dur + 0.35; CAPS.push({ at: at - 0.05, out: Math.min(nx - 0.03, i + 1 < VO_AT.length ? VO_AT[i + 1] - 0.05 : 1e9), s }); }));
function captions(t) {
  if (t > T.end - 0.05) return; const c = CAPS.find((c) => t >= c.at && t < c.out); if (!c) return;
  const size = 50; let acc = false; const words = c.s.split(' ').map((w) => { if (w.startsWith('*')) acc = true; const o = { w: w.replace(/\*/g, ''), acc }; if (/\*[.,?!…:]*$/.test(w)) acc = false; return o; });
  const sp = tw(' ', size, 600, -0.01); words.forEach((w) => (w.width = tw(w.w, size, 600, -0.01))); const tot = words.reduce((p, w) => p + w.width, 0) + sp * (words.length - 1);
  let x = CX - tot / 2; const y = 1440, out = seg(t, c.out - 0.12, c.out);
  words.forEach((w, i) => { const k = ease.out(seg(t, c.at + i * 0.05, c.at + 0.28 + i * 0.05)); ctx.save(); ctx.globalAlpha = k * (1 - out); if (k < 1) ctx.filter = `blur(${((1 - k) * 6).toFixed(1)}px)`; ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 18; text(w.w, x, y + (1 - k) * 18, size, 600, w.acc ? ACC : INK, 'left', -0.01); ctx.restore(); x += w.width + sp; });
}

// ── 9 · the end: everything collapses back into the dot ─────────────────────
function world(t, fn) { // camera: gentle push-ins; the final collapse scales the whole world into the centre
  const push = 0.1 * K(t, T.dotEnd, T.pulse, ease.inOut) * (1 - K(t, T.pulse + 0.2, T.pulse + 1.4)) + 0.05 * K(t, T.focus, T.focus + 1) * (1 - K(t, T.card, T.card + 1));
  const end = K(t, T.end, T.endDone - 0.15, (u) => u * u * u), drift = Math.sin(t * 0.6) * 5;
  const s = (1 + push) * (1 - end) + 0.0001;
  ctx.save(); ctx.translate(CX, SY + drift * (1 - end)); ctx.scale(s, s); ctx.translate(-CX, -SY); ctx.globalAlpha = 1 - seg(end, 0.7, 1); fn(); ctx.restore();
  if (t > T.endDone - 0.35) { const k = ease.back(seg(t, T.endDone - 0.35, T.endDone + 0.05)); glow(CX, SY, 110, '#ffffff', 0.3 * k); circle(CX, SY, 15 * k * (1 + 0.1 * Math.sin((t - T.endDone) * 4)), '#fff'); }
}
function scene(t) {
  background(t);
  world(t, () => { sceneTitle(t); sceneDot(t); sceneCustomers(t); sceneCard(t); sceneFlow(t); sceneChatCal(t); sceneTiles(t); sceneLine(t); sceneLogo(t); });
  grain(t);
}

// ── sound ────────────────────────────────────────────────────────────────────
cue(T.title, 'swoosh', 0.5); cue(T.title2 + 0.3, 'tap', 0.5); cue(T.collapse + 0.1, 'whoosh', 0.9); cue(T.dotEnd - 0.05, 'snap', 0.6);
for (let b = 0; b < 12; b++) { const at = E1.start + (b + 0.345) / BEAT; if (at < T.cust) cue(at, 'beep', 0.55); }
cue(T.cust, 'whoosh', 0.8); for (let i = 0; i < 6; i++) cue(T.cust + 0.5 + i * 0.07, 'tap', 0.3); cue(T.quiet + 0.1, 'swish', 0.4);
cue(T.radar, 'transition', 0.7); QUIET.forEach((q, i) => cue(T.radar + Math.hypot(CUST[q].x - CX, CUST[q].y - SY) / 1150 * 0.9, 'ding', 0.45)); cue(T.focus, 'whoosh', 0.7);
for (let i = 0; i < 6; i++) cue(T.score + 0.12 + i * 0.16, 'key', 0.45); cue(T.card, 'swoosh', 0.7); for (let i = 1; i < 5; i++) cue(T.card + 0.55 + i * 0.08, 'tap', 0.35);
cue(T.slips + 0.1, 'punch', 0.6); cue(T.reach, 'swoosh', 0.6); NODES.forEach((n, i) => cue(T.reach + 0.35 + 1.35 * (n[1] - 540) / 520, 'tap', 0.55));
cue(T.text, 'notification', 0.7); cue(T.reply, 'notification', 0.7); cue(T.booking + 0.1, 'swoosh', 0.6); cue(T.booking + 0.78, 'ding', 0.7);
cue(T.tiles, 'whoosh', 0.6); for (let i = 0; i < 5; i++) cue(T.tiles + 0.25 + i * 0.1, 'tap', 0.35); cue(T.tiles + 1.6, 'ding', 0.6);
cue(T.same, 'swoosh', 0.5); cue(T.flat, 'whoosh', 0.7);
for (let b = 0; b < 8; b++) { const at = E2.start + (b + 0.345) / BEAT + 0; if (at < T.logo) cue(at + 0, 'beep', 0.55); }
cue(T.logo - 1.55, 'riser', 0.6); cue(T.logoDone - 0.1, 'transitionHit', 0.9); for (let i = 0; i < 9; i++) cue(T.word + i * 0.045, 'key', 0.25);
cue(T.keep, 'swoosh', 0.6); cue(T.audit, 'tap', 0.6); for (let i = 0; i < 13; i++) cue(T.url + i * 0.054, 'key', 0.3); cue(T.end, 'whoosh', 0.8); cue(T.endDone - 0.1, 'snap', 0.6);

// ── boot: renderFrame (with sub-frame motion blur when rendering), ready, player ─
(() => {
  window.DURATION = DURATION;
  window.VO = VO_AT.map((at, i) => ({ at, file: `assets/audio/onetake/vo-${String(i).padStart(2, '0')}.wav`, dur: VO_CLIPS[i].dur }));
  const RENDER = location.search.includes('render'); let OFF = null, OCTX = null;
  const SAMPLES = 3, SHUTTER = 0.5 / 60;
  const reset = (c) => { c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.filter = 'none'; c.globalCompositeOperation = 'source-over'; c.shadowBlur = 0; c.shadowColor = 'transparent'; c.lineCap = 'butt'; c.lineJoin = 'miter'; c.setLineDash([]); };
  window.renderFrame = (t) => {
    if (!RENDER || !OFF) { ctx = MAIN; reset(ctx); scene(t); }
    else {
      for (let k = 0; k < SAMPLES; k++) { ctx = OCTX; reset(ctx); scene(t + (k / (SAMPLES - 1) - 0.5) * SHUTTER); reset(MAIN); MAIN.globalAlpha = 1 / (k + 1); MAIN.drawImage(OFF, 0, 0); }
      ctx = MAIN; reset(ctx);
    }
    ctx = MAIN; reset(ctx); captions(t); reset(ctx); hud(t);
  };
  {
    const fill = CanvasRenderingContext2D.prototype.fillText; // text audit hook (scripts/audit-text.mjs)
    CanvasRenderingContext2D.prototype.fillText = function (str, x, y, ...rest) {
      if (window.TEXT_LOG && this === MAIN) { const T2 = this.getTransform(), m = this.measureText(str); const pts = [[x - m.actualBoundingBoxLeft, y - m.actualBoundingBoxAscent], [x + m.actualBoundingBoxRight, y + m.actualBoundingBoxDescent]].flatMap(([px, py], i, a) => [[px, py], [a[1 - i][0], py]]).map(([px, py]) => [T2.a * px + T2.c * py + T2.e, T2.b * px + T2.d * py + T2.f]); const xs = pts.map((q) => q[0]), ys = pts.map((q) => q[1]); window.TEXT_LOG.push({ str, x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys), a: this.globalAlpha, layer: 'main' }); }
      return fill.call(this, str, x, y, ...rest);
    };
  }
  window.ready = (async () => {
    MAIN = document.getElementById('c').getContext('2d'); ctx = MAIN;
    await Promise.all(['500', '600', '700', '800'].map((w) => document.fonts.load(`${w} 40px ${FONT}`))); await Promise.all(['500', '700'].map((w) => document.fonts.load(`${w} 40px '${MONO}'`)));
    LOGO = await new Promise((res) => { const im = new Image(); im.onload = () => res(im); im.onerror = () => res(null); im.src = BRAND.logoFile; });
    GRAIN = document.createElement('canvas'); GRAIN.width = GRAIN.height = 256; { const g = GRAIN.getContext('2d'), d = g.createImageData(256, 256); for (let i = 0; i < d.data.length; i += 4) { const v = Math.random() * 255; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; } g.putImageData(d, 0, 0); }
    if (RENDER) { document.body.classList.add('render'); OFF = document.createElement('canvas'); OFF.width = W; OFF.height = H; OCTX = OFF.getContext('2d'); }
    window.renderFrame(0); return true;
  })();
  (() => { // player
    const btn = document.getElementById('play'), seek = document.getElementById('seek'), tm = document.getElementById('time'); if (!btn) return;
    const clips = window.VO.map((v) => Object.assign(new Audio(v.file), { preload: 'auto' })); let playing = false, cur = 0, t0 = 0; const started = new Set();
    const show = (t) => { cur = t; window.renderFrame(t); seek.value = (t / DURATION) * 1000; tm.textContent = `${t.toFixed(1)}s / ${DURATION.toFixed(1)}s`; };
    const stopAll = () => { clips.forEach((c) => c.pause()); started.clear(); };
    const loop = () => { if (!playing) return; const t = (performance.now() - t0) / 1000; if (t >= DURATION) { playing = false; stopAll(); btn.textContent = 'Replay'; show(DURATION); return; }
      window.VO.forEach((v, i) => { if (t >= v.at && t < v.at + v.dur && !started.has(i)) { started.add(i); clips[i].currentTime = t - v.at; clips[i].play(); } }); show(t); requestAnimationFrame(loop); };
    btn.onclick = () => { if (playing) { playing = false; stopAll(); btn.textContent = 'Play'; return; } if (cur >= DURATION) cur = 0; t0 = performance.now() - cur * 1000; playing = true; btn.textContent = 'Pause'; requestAnimationFrame(loop); };
    seek.oninput = () => { playing = false; stopAll(); btn.textContent = 'Play'; show((seek.value / 1000) * DURATION); };
    window.ready.then(() => { const q = new URLSearchParams(location.search).get('t'); if (q) show(+q); });
  })();
})();
