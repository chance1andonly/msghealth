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
const hexMix = (a, b, k) => '#' + [16, 8, 0].map((sh) => Math.round(lerp((parseInt(a.slice(1), 16) >> sh) & 255, (parseInt(b.slice(1), 16) >> sh) & 255, k)).toString(16).padStart(2, '0')).join('');
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

// ── shared "grow from something" helpers ─────────────────────────────────────
function clipRect(r, fn) { ctx.save(); ctx.beginPath(); ctx.rect(...r); ctx.clip(); fn(); ctx.restore(); }
function clipCircle(x, y, r, fn) { if (r <= 0) return; ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.clip(); fn(); ctx.restore(); }
function clipOutside(x, y, r, fn) { ctx.save(); ctx.beginPath(); ctx.rect(-50, -50, W + 100, H + 100); ctx.arc(x, y, Math.max(0, r), 0, Math.PI * 2, true); ctx.clip('evenodd'); fn(); ctx.restore(); }
// a pill that grows out of an anchor point (ax, ay) into its final rect; its label is revealed inside it
function growPill(k, ax, ay, rect, fill, stroke, drawLabel) {
  if (k <= 0) return; const r = lr([ax, ay, 0, 0], rect, k), rad = Math.min(r[2], r[3]) / 2;
  fillRR(...r, rad, fill); if (stroke) strokeRR(...r, rad, stroke, 1.5); if (k > 0.35) clipRect(r, drawLabel);
}

// ── 1 · the dot → a caret that types the title → particles → the dot ────────
const TITLE = [['Try', 'to', 'spot'], ['a', 'single', 'cut'], ['in', 'this', 'video.']], TSIZE = 104;
let GLYPHS = null, CKEYS = null;
function layoutTitle() {
  GLYPHS = []; font(TSIZE, 700, -0.035);
  TITLE.forEach((ln, li) => { const wFull = ctx.measureText(ln.join(' ')).width; let x = CX - wFull / 2; const y = 700 + li * 124;
    ln.forEach((wd, wi) => { const wordAt = li < 2 ? T.title + (li * 3 + wi) * 0.17 : T.title2 + wi * 0.16; [...wd].forEach((ch, ci) => { const cw = ctx.measureText(ch).width; GLYPHS.push({ ch, x: x + cw / 2, l: x, r: x + cw, y, li, acc: wd === 'cut', at: wordAt + ci * 0.03 }); x += cw; }); x += ctx.measureText(' ').width; }); });
  // caret keyframes: it sits after the last typed glyph, and slides to the next line before typing it
  CKEYS = [{ t: 0.42, x: GLYPHS[0].l - 12, y: GLYPHS[0].y }];
  GLYPHS.forEach((g, i) => { const last = CKEYS[CKEYS.length - 1];
    if (i && GLYPHS[i - 1].li !== g.li) { CKEYS.push({ t: g.at - 0.2, x: last.x, y: last.y }, { t: g.at - 0.02, x: g.l - 12, y: g.y }); }
    else CKEYS.push({ t: g.at, x: last.x, y: last.y });
    CKEYS.push({ t: g.at + 0.05, x: g.r + 12, y: g.y }); });
}
function caretAt(t) { if (t <= CKEYS[0].t) return [CKEYS[0].x, CKEYS[0].y]; for (let i = 1; i < CKEYS.length; i++) { const a = CKEYS[i - 1], b = CKEYS[i]; if (t < b.t) { const k = ease.inOut(seg(t, a.t, b.t)); return [lerp(a.x, b.x, k), lerp(a.y, b.y, k)]; } } const e = CKEYS[CKEYS.length - 1]; return [e.x, e.y]; }
const HERO_END = () => T.collapse + 0.95; // after this the dot is the ECG pen
function hero(t) { // frame 0 starts on this dot: it becomes the caret, types the title, then becomes the dot again
  if (t >= HERO_END()) return; if (!GLYPHS) layoutTitle();
  const mi = K(t, 0.15, 0.42), mo = K(t, T.collapse + 0.1, HERO_END());
  const typed = caretAt(Math.min(t, T.collapse + 0.1)); let [x, y] = mi < 1 ? [lerp(CX, typed[0], mi), lerp(SY, typed[1], mi)] : typed; x = lerp(x, CX, mo); y = lerp(y, SY, mo);
  const w = lerp(lerp(30, 8, mi), 30, mo), h = lerp(lerp(30, 100, mi), 30, mo), done = GLYPHS[GLYPHS.length - 1].at + 0.1;
  const soft = t > done && mo <= 0 ? 0.55 + 0.45 * (0.5 + 0.5 * Math.cos((t - done) * 6)) : 1; // a soft pulse, never a hard blink
  glow(x, y, 90, '#ffffff', 0.22); ctx.save(); ctx.globalAlpha *= soft; fillRR(x - w / 2, y - h / 2, w, h, Math.min(w, h) / 2, mi > 0.5 && mo < 0.5 ? ACC : '#fff'); ctx.restore();
}
function sceneTitle(t) {
  if (t > T.dotEnd + 0.05) return; if (!GLYPHS) layoutTitle();
  GLYPHS.forEach((g, i) => {
    const a = K(t, g.at, g.at + 0.14, ease.out); if (a <= 0) return;
    // collapse: each glyph spirals into the dot, outer glyphs a touch later
    const d = Math.hypot(g.x - CX, g.y - SY), st = T.collapse + d / 2400 + hash(i) * 0.12, c = K(t, st, st + 0.8, (u) => u * u * (3 - 2 * u));
    const ang = Math.atan2(g.y - SY, g.x - CX) + c * c * 2.4, rad = d * (1 - ease.in(c));
    // typing: the glyph grows out of the caret (from its left edge)
    const gx = lerp(g.l, g.x, a), s0 = lerp(0.15, 1, a);
    const x = c > 0 ? CX + Math.cos(ang) * rad : gx, y = c > 0 ? SY + Math.sin(ang) * rad : g.y;
    const s = s0 * (1 - 0.92 * ease.in(c));
    ctx.save(); ctx.translate(x, y); ctx.rotate(c * (hash(i + 3) - 0.5) * 4); ctx.scale(s, s); ctx.globalAlpha = 1 - seg(c, 0.85, 1);
    text(g.ch, 0, 0, TSIZE, 700, g.acc ? ACC : INK, 'center', -0.035); ctx.restore();
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
// After "your customers" the pen leaves the line, reels it in, and walks along the first row of the grid, leaving a dot at each seat.
const COLX = (c) => CX + (c - 2) * 178, ROW0Y = SY - 1.5 * 178;
const DEP = (c) => T.cust + 0.4 + (4 - c) * 0.17; // when the pen reaches column c of the first row
const PEN0 = () => [penX1(T.cust), SY + ecgY(E1, T.cust)];
function penPos(t) {
  if (t <= T.cust) return [penX1(t), SY + ecgY(E1, t)];
  const p0 = PEN0();
  if (t < DEP(4)) { const k = ease.inOut(seg(t, T.cust, DEP(4))); return [lerp(p0[0], COLX(4), k), lerp(p0[1], ROW0Y, k) - Math.sin(k * Math.PI) * 90]; }
  for (let c = 3; c >= 0; c--) if (t < DEP(c)) { const k = ease.inOut(seg(t, DEP(c + 1), DEP(c))); return [lerp(COLX(c + 1), COLX(c), k), ROW0Y - Math.sin(k * Math.PI) * 26]; }
  return [COLX(0), ROW0Y];
}
function sceneDot(t) {
  if (t < HERO_END() || t > DEP(0)) return;
  const [px, py] = penPos(t);
  const breathe = t < T.pulse ? 1 + 0.12 * Math.sin((t - HERO_END()) * 4) * seg(t, HERO_END(), HERO_END() + 0.4) : 1;
  if (t > E1.start && t <= T.cust) { const gr = ctx.createLinearGradient(40, 0, px, 0); gr.addColorStop(0, rgba('#ffffff', 0)); gr.addColorStop(0.3, rgba('#ffffff', 0.85)); gr.addColorStop(1, '#ffffff'); traceECG(t, E1, px, 40, gr, 5, 1); }
  if (t > T.cust) { // the line is reeled into the pen as it leaves: the frozen trace plus a tail to the pen, eaten from the far end
    const p0 = PEN0(), pts = []; for (let x = 40; x <= p0[0]; x += 4) pts.push([x, SY + ecgY(E1, T.cust - (p0[0] - x) / E1.speed)]); pts.push(p0, [px, py]);
    const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    const s0 = L[L.length - 1] * K(t, T.cust, DEP(3), ease.in);
    ctx.save(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 5; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.shadowColor = '#fff'; ctx.shadowBlur = 18; ctx.beginPath(); let on = false;
    pts.forEach((p, i) => { if (L[i] < s0) return; on ? ctx.lineTo(...p) : (i > 0 ? (ctx.moveTo(...lr(pts[i - 1], p, (s0 - L[i - 1]) / Math.max(1e-6, L[i] - L[i - 1]))), ctx.lineTo(...p)) : ctx.moveTo(...p)); on = true; }); ctx.stroke(); ctx.restore();
  }
  glow(px, py, 90, '#ffffff', 0.25); circle(px, py, 15 * breathe, '#fff');
  if (t > E1.start && t < T.cust) { const ph = ((t - E1.start) * BEAT) % 1; const k = seg(ph, 0.34, 0.9); ring(px, py, 15 + k * 70, rgba('#ffffff', 0.45 * (1 - k)), 3); }
}

// ── 3 · beads → customers → the quiet ones → Jordan ──────────────────────────
const CUST = [];
const PAL = ['#6d66ff', '#e5568f', '#f08a3c', '#14b8a6', '#3b82f6', '#a855f7', '#22c55e', '#eab308'];
const INIT = ['PR', 'MT', 'AV', 'DL', 'SK', 'NO', 'EL', 'JO', 'RA', 'LI', 'KM', 'TS', 'BE', 'CH', 'ZA', 'OM', 'IV', 'HU', 'FE', 'GA'];
const QUIET = [4, 7, 13, 16], JORDAN = 7;
for (let i = 0; i < 20; i++) { const c = i % 5, r = Math.floor(i / 5); CUST.push({ i, x: CX + (c - 2) * 178, y: SY + (r - 1.5) * 178, col: PAL[i % PAL.length], ini: INIT[i] }); }
const RADAR_C = [CUST[JORDAN].x, CUST[JORDAN].y + 28], RADAR_MAX = 1300;
function custBase(t, c) {
  // first row: left behind by the pen; rows below: each drips out of the dot above it
  const col = c.i % 5, rw = Math.floor(c.i / 5); let x = c.x, y = c.y, r, f, show = true, neck = null;
  if (rw === 0) { const d = DEP(col); show = t >= d; const g = seg(t, d, d + 0.35); f = g; r = lerp(15, 50, ease.back(g)); }
  else {
    const ds = DEP(col) + 0.22 + (rw - 1) * 0.26, py = c.y - 178, st = seg(t, ds, ds + 0.14), fall = seg(t, ds + 0.14, ds + 0.34), land = seg(t, ds + 0.34, ds + 0.62);
    show = t >= ds; f = land;
    if (fall <= 0) { y = py + 40 + 46 * ease.out(st); r = lerp(4, 15, st); neck = { x, y0: py + 30, y1: y, w: lerp(6, 11, st) }; } // a bead swells out of the bottom of the dot above
    else if (land <= 0) { y = lerp(py + 86, c.y, ease.in(fall)); r = lerp(15, 13, fall); neck = { x, y0: py + 30 + 56 * fall, y1: y, w: 11 * (1 - fall) }; } // it lets go and falls, the neck snapping back
    else { r = lerp(13, 50, ease.back(land)); y = c.y + 6 * (1 - ease.out(land)); }
  }
  if (!show) r = 0;
  const isQ = QUIET.includes(c.i), q = isQ ? K(t, T.quiet + QUIET.indexOf(c.i) * 0.14, T.quiet + 0.6 + QUIET.indexOf(c.i) * 0.14) : 0, lv = isQ ? K(t, T.leave, T.leave + 1.0) : 0;
  if (isQ) { y += 10 * q + 18 * lv; x += (c.x < CX ? -1 : c.x > CX ? 1 : 0) * 14 * lv; }
  return { x, y, r, f, q, lv, show, neck };
}
function custState(t, c) {
  const s = custBase(t, c), fo = K(t, T.focus, T.focus + 0.95); s.fo = fo; s.a = 1;
  const jb = custBase(t, CUST[JORDAN]), jx = lerp(jb.x, CX, fo), jy = lerp(jb.y, SY - 40, fo);
  if (c.i === JORDAN) { s.x = jx; s.y = jy; s.r = lerp(s.r, 160, fo); }
  else { // everyone else is pulled into Jordan (nearest first) and becomes part of the score
    const d = Math.hypot(c.x - CUST[JORDAN].x, c.y - CUST[JORDAN].y), st = T.focus - 0.1 + d / 900 * 0.3, ab = K(t, st, st + 0.85, ease.inOut);
    s.x = lerp(s.x, jx, ab); s.y = lerp(s.y, jy, ab); s.r *= 1 - 0.85 * ab; s.a = 1 - seg(ab, 0.85, 1); s.ab = ab;
  }
  return s;
}
const radarHitAt = (c) => T.radar + (Math.hypot(c.x - RADAR_C[0], c.y - RADAR_C[1]) - 60) / RADAR_MAX * 0.9;
function sceneCustomers(t) {
  if (t < T.cust || t > T.card + 1.2) return;
  // the radar grows out of Jordan's dashed outline
  const rk = K(t, T.radar, T.radar + 0.9, ease.out), radarR = lerp(60, RADAR_MAX, rk), radarOn = t > T.radar && t < T.radar + 1.1;
  if (radarOn) { const ra = 1 - seg(t, T.radar + 0.6, T.radar + 1.05); ctx.save(); ctx.globalAlpha = ra; ring(RADAR_C[0], RADAR_C[1], radarR, rgba(ACC, 0.75), 3); const gr = ctx.createRadialGradient(RADAR_C[0], RADAR_C[1], Math.max(0, radarR - 160), RADAR_C[0], RADAR_C[1], radarR); gr.addColorStop(0, rgba(ACC, 0)); gr.addColorStop(1, rgba(ACC, 0.16)); ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(RADAR_C[0], RADAR_C[1], radarR, 0, 7); ctx.fill(); ctx.restore(); }
  CUST.forEach((c) => {
    const s = custState(t, c); if (s.a <= 0.01 || !s.show) return;
    if (s.neck && s.neck.w > 0.3) { const n = s.neck; ctx.save(); ctx.strokeStyle = '#fff'; ctx.lineCap = 'round'; ctx.lineWidth = n.w; ctx.beginPath(); ctx.moveTo(n.x, n.y0); ctx.lineTo(n.x, n.y1); ctx.stroke(); ctx.restore(); }
    const isQ = QUIET.includes(c.i), col = isQ ? hexMix(c.col, '#34323f', s.q) : c.col, hk = isQ ? ease.back(clamp((t - radarHitAt(c)) / 0.3)) : 0;
    ctx.save(); ctx.globalAlpha *= s.a * (isQ ? 1 - 0.35 * s.lv * (1 - s.fo) : 1);
    if (c.i === JORDAN && s.fo > 0) { scoreRing(t, s, hk); ctx.restore(); return; }
    if (s.f > 0.9) { const ph = ((t * 0.8 + hash(c.i) * 3) % 1.6) / 1.6, al = (1 - s.q) * (1 - ph) * 0.35 * (1 - (s.ab || 0)); if (al > 0.01) ring(s.x, s.y, s.r + ph * 26, rgba(c.col, al), 2.5); }
    if (s.f < 1) glow(s.x, s.y, s.r * 3, '#ffffff', 0.25 * (1 - s.f));
    if (s.ab > 0) glow(s.x, s.y, s.r * 2.5, c.col, 0.4 * s.ab);
    circle(s.x, s.y, s.r, s.f < 0.5 ? mix('#ffffff', col, s.f * 2) : col);
    if (s.f > 0.6) { ctx.save(); ctx.globalAlpha *= seg(s.f, 0.6, 1) * (isQ ? 1 - 0.5 * s.q : 1) * (1 - (s.ab || 0)); text(c.ini, s.x, s.y + 1, s.r * 0.66, 700, '#fff', 'center', 0); ctx.restore(); }
    if (isQ && s.lv > 0 && hk < 1) { ctx.save(); ctx.setLineDash([8, 9]); ctx.lineDashOffset = -t * 20; ring(s.x, s.y, s.r + 10, rgba('#ffffff', 0.35 * s.lv * (1 - hk)), 2); ctx.restore(); }
    if (hk > 0) { ring(s.x, s.y, s.r + 10, rgba(RD, Math.min(1, hk)), 4); const bx = s.x + (s.r + 10) * 0.7071, by = s.y - (s.r + 10) * 0.7071; circle(bx, by, 13 * hk, RD); text('!', bx, by + 1, 18 * hk, 800, '#fff', 'center', 0); } // the badge grows out of the red ring
    ctx.restore();
  });
  // Jordan's note grows out of the bottom of the avatar and slides back into it at the focus
  const jl = K(t, T.leave + 0.25, T.leave + 0.65, ease.out) * (1 - K(t, T.focus - 0.35, T.focus, ease.in));
  if (jl > 0) { const s = custBase(t, CUST[JORDAN]), lb = 'LAST VISIT 41 DAYS AGO', w = monoW(lb, 20) + 36; growPill(jl, s.x, s.y + s.r, [s.x - w / 2, s.y + 70, w, 40], 'rgba(12,11,17,0.9)', rgba(RD, 0.5), () => mono(lb, s.x, s.y + 91, 20, '#ffb1aa', 'center')); }
}

// ── 4 · Jordan's score ring → the client-health card ─────────────────────────
const CARD0 = [110, 500, 860, 690], ROWY = (i) => 640 + i * 118, RING1 = [880, 640, 34];
const ROWS = [['Jordan K.', 'Cut & colour · since 2023', 38, JORDAN], ['Priya S.', 'Colour · every 6 weeks', 84, 0], ['Marcus T.', 'Cut · every 4 weeks', 77, 1], ['Ava R.', 'Trim · monthly', 58, 2], ['Dana L.', 'Cut · every 3 weeks', 92, 3]];
function ringGeom(t) {
  const s = custState(t, CUST[JORDAN]), m = K(t, T.card, T.card + 0.95);
  return { x: lerp(s.x, RING1[0], m), y: lerp(s.y, RING1[1], m), r: lerp(s.r + 10 * (1 - s.fo), RING1[2], m), lw: lerp(lerp(4, 20, s.fo), 7, m), m, fo: s.fo };
}
function scoreRing(t, s, hk = 1) { // Jordan's red radar ring thickens into the score ring; the initials roll out, the score rolls in
  const g = ringGeom(t); if (g.m > 0) return;
  const fill = K(t, T.score + 0.1, T.score + 1.2, ease.out), roll = K(t, T.score - 0.1, T.score + 0.35, ease.inOut), inner = g.r - g.lw / 2 - 2;
  circle(g.x, g.y, inner, mix('#34323f', '#17141f', s.fo));
  clipCircle(g.x, g.y, inner, () => {
    text('JO', g.x, g.y + 1 - roll * inner * 1.3, Math.max(20, g.r * 0.62), 700, rgba('#ffffff', 0.5), 'center', 0);
    if (roll > 0) { const v = Math.round(38 * fill), dy = (1 - roll) * inner * 1.4; ctx.save(); ctx.shadowColor = RD; ctx.shadowBlur = 30 * fill; text(String(v), g.x, g.y - 6 + dy, 118, 800, '#fff', 'center', -0.04); ctx.restore(); mono('HEALTH SCORE', g.x, g.y + 70 + dy, 20, rgba('#ffffff', 0.55), 'center'); }
  });
  ring(g.x, g.y, g.r, rgba(RD, 1 - 0.88 * fill), g.lw); // the red ring dims into the track…
  arcRing(g.x, g.y, g.r, g.lw, 0.38 * fill, RD, 'rgba(0,0,0,0)'); // …while the score arc grows over it
  const b = (1 - s.fo) * hk; if (b > 0.02) { const bx = g.x + g.r * 0.7071, by = g.y - g.r * 0.7071; circle(bx, by, 13 * b, RD); }
}
const RISK_W = () => tw('AT RISK', 19, 800, 0.1) + 19 * 1.4;
function sceneCard(t) {
  if (t < T.card || t > T.tiles + 0.02) return;
  const g = ringGeom(t), m = g.m;
  // the card grows out of the ring: same centre, circle → rounded rect
  const ro = g.r + g.lw / 2 + 2, from = [g.x - ro, g.y - ro, ro * 2, ro * 2], fold = K(t, T.reach - 0.05, T.reach + 0.6), cal = K(t, T.booking, T.booking + 0.8);
  let rect = lr(lr(from, CARD0, m), [110, 380, 860, 160], fold); rect = lr(rect, CALR, cal);
  const rad = Math.min(lerp(ro, 28, ease.out(m)), rect[2] / 2, rect[3] / 2); // starts as the ring's own circle, so nothing is cut
  panel(...rect, rad, clamp(m * 3));
  const shift = lerp(0, 460 - ROWY(0), fold), ry0 = m < 1 ? g.y : ROWY(0) + shift;
  // everything inside is revealed by a circle that grows out of the ring, clipped to the panel; the calendar later wipes it out the same way
  const revR = lerp(0, 1100, K(t, T.card + 0.25, T.card + 1.05, ease.in)), calR = calRevealR(t);
  ctx.save(); ctx.beginPath(); ctx.roundRect(...rect, rad); ctx.clip();
  clipOutside(BLOCK_C[0], BLOCK_C[1], calR, () => {
    clipCircle(g.x, ry0, revR, () => {
      const hy = 560 + shift - 90 * fold; text('Client health', 160, hy, 34, 700, INK, 'left'); const lp = 0.5 + 0.5 * Math.sin(t * 5); circle(830, hy, 7, rgba(GRN, 0.5 + 0.5 * lp)); mono('LIVE', 848, hy + 1, 20, GRN, 'left', 700); ctx.fillStyle = LINE; ctx.fillRect(140, hy + 36, 800, 2);
      for (let i = 4; i >= 0; i--) row(t, i, shift);
    });
  });
  ctx.restore();
  // Jordan's ring travels into row 1 (it never disappears), drawn on top and never clipped by the card
  if (m > 0) clipOutside(BLOCK_C[0], BLOCK_C[1], calR, () => { if (m < 1) circle(g.x, ry0, g.r - g.lw / 2 - 2, '#17141f'); arcRing(g.x, ry0, g.r, g.lw, 0.38, RD); text('38', g.x, ry0 + (m < 1 ? lerp(-6, 1, m) : 1), lerp(118, 24, m), 800, INK, 'center', 0); });
}
function row(t, i, shift) {
  const [n, sub, sc, ci] = ROWS[i];
  const open = i === 0 ? 1 : K(t, T.card + 0.55 + i * 0.08, T.card + 1.0 + i * 0.08, ease.out), close = i === 0 ? 0 : K(t, T.reach - 0.05 + (4 - i) * 0.04, T.reach + 0.35 + (4 - i) * 0.04);
  if (open <= 0 || close >= 1) return; const y = lerp(ROWY(0), ROWY(i), open * (1 - close)) + shift; // rows slide out from under row 1, and back under it
  ctx.save();
  fillRR(124, y - 54, 832, 108, 20, '#1c1a23'); // opaque (panel colour) so a row hides the ones still tucked under it
  if (i === 0) { const tint = K(t, T.slips, T.slips + 0.6, ease.in); if (tint > 0) clipCircle(880, y, tint * 900, () => { fillRR(124, y - 54, 832, 108, 20, rgba(RD, 0.10)); strokeRR(124, y - 54, 832, 108, 20, rgba(RD, 0.45), 2); }); }
  avatar(196, y, 36, i === 0 ? 'JO' : n.slice(0, 2).toUpperCase(), i === 0 ? '#34323f' : PAL[(ci + 1) % PAL.length]);
  text(n, 252, y - 16, 32, 700, INK, 'left');
  const sw = i === 0 ? K(t, T.slips + 0.15, T.slips + 0.5) : 0; // the sub-line rolls over to the warning
  clipRect([240, y + 2, 520, 42], () => { text(sub, 252, y + 22 - sw * 40, 23, 500, DIMI, 'left'); if (sw > 0) text('No reply · visit overdue', 252, y + 62 - sw * 40, 23, 500, '#ffb1aa', 'left'); });
  if (i === 0) { const rk = K(t, T.slips + 0.1, T.slips + 0.5, ease.out), w = RISK_W(), right = 880 - 34 - 16; growPill(rk, right, y, [right - w, y - 17, w, 34], RD, null, () => text('AT RISK', right - w / 2, y + 1, 19, 800, '#fff', 'center', 0.1)); }
  if (i > 0 && open > 0.25) { const f = K(t, T.card + 0.75 + i * 0.08, T.card + 1.5 + i * 0.08, ease.out); arcRing(880, y, 34, 7, sc / 100 * f, scoreCol(sc)); text(String(Math.round(sc * f)), 880, y + 1, 24, 800, INK, 'center', 0); }
  ctx.restore();
}

// ── 5 · the automation flow grows out of the AT RISK tag → message → reply → booking ─
const NODES = [['Send a text', 700], ['Email if no reply', 880], ['Offer a booking', 1060]];
const OUT_RECT = [300, 590, 640, 170], IN_RECT = [140, 800, 560, 110], BLOCK = [656, 699, 138, 112], BLOCK_C = [725, 755];
let FLOWP = null;
function flowPath() { // from the bottom of the AT RISK tag, down, curving to the centre line, down through the nodes
  if (FLOWP) return FLOWP; const w = RISK_W(), tx = 880 - 34 - 16 - w / 2, pts = [];
  for (let y = 478; y <= 540; y += 4) pts.push([tx, y]);
  for (let k = 1; k <= 40; k++) { const u = k / 40, a = 1 - u; pts.push([a * a * a * tx + 3 * a * a * u * tx + 3 * a * u * u * CX + u * u * u * CX, a * a * a * 540 + 3 * a * a * u * 600 + 3 * a * u * u * 580 + u * u * u * 650]); }
  for (let y = 654; y <= 1130; y += 4) pts.push([CX, y]);
  const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  return (FLOWP = { pts, L, total: L[L.length - 1], at: (y) => { const i = pts.findIndex((p, j) => j > 50 && p[1] >= y); return i < 0 ? L[L.length - 1] : L[i]; } });
}
function strokeSub(P, s0, s1) { ctx.beginPath(); let on = false; for (let i = 0; i < P.pts.length; i++) { if (P.L[i] < s0 || P.L[i] > s1) continue; on ? ctx.lineTo(...P.pts[i]) : ctx.moveTo(...P.pts[i]); on = true; } ctx.stroke(); }
function pointAt(P, s) { const i = Math.max(0, P.L.findIndex((l) => l >= s)); return P.pts[i] || P.pts[P.pts.length - 1]; }
function sceneFlow(t) {
  if (t < T.reach + 0.5 || t > T.tiles + 0.6) return;
  const P = flowPath(), draw = K(t, T.reach + 0.6, T.reach + 1.9, (u) => u), ret = K(t, T.text - 0.05, T.text + 0.4, ease.inOut), out = K(t, T.text, T.text + 0.45);
  const n1 = P.at(NODES[0][1]), s1 = lerp(draw * P.total, n1, ret), s0 = lerp(0, n1, ret); // after the text goes out, the line retracts into node 01
  ctx.save(); ctx.strokeStyle = rgba(ACC, 0.85); ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.shadowColor = ACC; ctx.shadowBlur = 16; if (s1 > s0 + 1) strokeSub(P, s0, s1); ctx.restore();
  if (draw > 0 && draw < 1 && ret <= 0) { const [x, y] = pointAt(P, s1); glow(x, y, 50, ACC, 0.5); circle(x, y, 9, '#fff'); }
  // the label is wiped out of the spine
  const lw = monoW('WIN-BACK AUTOMATION', 18, 700), lk = clamp((draw * P.total - P.at(790)) / 160) * (1 - ret);
  if (lk > 0) clipRect([CX - 40 - lw * lk, 770, lw * lk + 2, 40], () => mono('WIN-BACK AUTOMATION', CX - 40, 791, 18, rgba(ACC, 0.95), 'right', 700));
  NODES.forEach(([s, y], i) => { // each node grows sideways out of the spine as the pen reaches it (and shrinks back into it)
    let k = ease.out(clamp((draw * P.total - P.at(y) + 10) / 90)); if (i > 0) k *= 1 - ret; if (k <= 0 || (i === 0 && out > 0)) return;
    const r = [CX - 210 * k, y - 42, 420 * k, 84]; panel(...r, 42, 1, rgba(ACC, 0.35)); if (k > 0.5) clipRect(r, () => { circle(CX - 166, y, 20, rgba(ACC, 0.22)); mono(String(i + 1).padStart(2, '0'), CX - 166, y + 1, 18, ACC, 'center', 700); text(s, CX - 130, y + 1, 30, 600, INK, 'left'); });
  });
  // node 01 becomes the outgoing text (typed in), which later folds into the booking
  const bk = K(t, T.booking + 0.1, T.booking + 0.8);
  if (out > 0) {
    const r = lr(lr([CX - 210, NODES[0][1] - 42, 420, 84], OUT_RECT, out), BLOCK, bk);
    ctx.save(); ctx.globalAlpha *= 1 - seg(bk, 0.75, 1); fillRR(...r, lerp(lerp(42, 34, out), 14, bk), mix('#1c1a26', '#5b54f0', Math.max(out, bk)));
    { const nf = 1 - seg(out, 0, 0.45); if (nf > 0) clipRect(r, () => { ctx.save(); ctx.globalAlpha *= nf; strokeRR(...r, 42, rgba('#ffffff', 0.12), 2); circle(CX - 166, NODES[0][1], 20, rgba(ACC, 0.22)); mono('01', CX - 166, NODES[0][1] + 1, 18, ACC, 'center', 700); text(NODES[0][0], CX - 130, NODES[0][1] + 1, 30, 600, INK, 'left'); ctx.restore(); }); } // node 01's label hands over to the message
    if (bk < 0.3) clipRect(r, () => { const msg = ['Hey Jordan, we miss you! Want', 'your usual, Thursday at 10?'], n = Math.floor(seg(t, T.text + 0.3, T.text + 1.0) * 56); let left = n; msg.forEach((ln, j) => { const s = ln.slice(0, Math.max(0, left)); left -= ln.length; text(s, r[0] + 36, r[1] + 58 + j * 48, 31, 500, '#fff', 'left'); }); });
    const dk = seg(t, T.text + 0.9, T.text + 1.2) * (1 - bk * 3); if (dk > 0) { const mw = monoW('SMS · DELIVERED', 17); clipRect([r[0] + r[2] - 24 - mw * dk, r[1] + r[3] + 8, mw * dk, 36], () => mono('SMS · DELIVERED', r[0] + r[2] - 24, r[1] + r[3] + 26, 17, rgba('#ffffff', 0.5), 'right')); }
    ctx.restore();
  }
  // the reply grows out of Jordan's avatar in the header, then becomes the calendar block
  const rp = K(t, T.reply, T.reply + 0.5, ease.inOut);
  if (rp > 0) {
    const r0 = lr([160, 424, 72, 72], IN_RECT, rp), r = lr(r0, BLOCK, bk), rad = lerp(lerp(36, 30, rp), 14, bk), shrink = K(t, T.tiles - 0.15, T.tiles + 0.2, ease.in);
    const rr2 = lr(r, [BLOCK_C[0] - 10, BLOCK_C[1] - 10, 20, 20], shrink); if (shrink >= 1) return;
    ctx.save(); fillRR(...rr2, lerp(rad, 10, shrink), mix(hexMix('#34323f', '#26232f', seg(rp, 0, 0.6)), '#5b54f0', bk));
    if (bk < 0.5) clipRect(rr2, () => { const s = 'Yes please! Thursday works.'; text(s.slice(0, Math.floor(seg(t, T.reply + 0.35, T.reply + 0.8) * s.length)), r[0] + 32, r[1] + r[3] / 2 + 1, 31, 500, '#fff', 'left'); });
    else if (shrink < 0.5) clipRect(rr2, () => { text('Jordan', r[0] + 14, r[1] + 34, 22, 700, '#fff', 'left', 0); mono('10:00', r[0] + 14, r[1] + 66, 16, rgba('#ffffff', 0.7), 'left'); });
    const c = ease.back(seg(t, T.booking + 0.75, T.booking + 1.05)) * (1 - shrink); if (c > 0) { circle(r[0] + r[2] - 8, r[1] + 8, 18 * c, GRN); check(r[0] + r[2] - 8, r[1] + 9, 18 * c, '#fff', 3.5); } // grows out of the block's corner
    ctx.restore();
  }
}
// the calendar is revealed by a circle growing out of the booking block (and wipes the chat header away)
const calRevealR = (t) => lerp(0, 1500, K(t, T.booking + 0.5, T.booking + 1.3, ease.in));
const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI'], HOURS = ['9', '10', '11', '12', '1'];
const BUSY = [[0, 0], [0, 2], [1, 1], [1, 3], [2, 0], [2, 4], [3, 3], [4, 1], [4, 2], [3, 0]];
function sceneChatCal(t) {
  if (t < T.booking + 0.5 || t > T.tiles + 0.8) return;
  const R = calRevealR(t), gone = K(t, T.tiles - 0.05, T.tiles + 0.35); if (R <= 0) return;
  ctx.save(); ctx.globalAlpha *= 1 - gone;
  clipCircle(BLOCK_C[0], BLOCK_C[1], R, () => {
    text('This week', 160, 450, 34, 700, INK, 'left');
    DAYS.forEach((d, i) => mono(d, 200 + i * 150 + 75, 540, 18, DIMI, 'center', 700));
    HOURS.forEach((h, j) => { mono(h.padStart(2, '0'), 172, 575 + j * 120 + 22, 16, DIMI, 'center'); ctx.fillStyle = 'rgba(255,255,255,0.06)'; ctx.fillRect(200, 575 + j * 120, 750, 1.5); });
    for (let i = 0; i <= 5; i++) { ctx.fillStyle = 'rgba(255,255,255,0.05)'; ctx.fillRect(200 + i * 150, 575, 1.5, 600); }
    BUSY.forEach(([c, r]) => fillRR(206 + c * 150, 579 + r * 120, 138, 112, 14, 'rgba(255,255,255,0.07)'));
  });
  // the "booked" chip grows out of the block's check badge and settles in the header
  const ch = K(t, T.booking + 1.0, T.booking + 1.45, ease.inOut);
  if (ch > 0) { const w = tw('THU 10:00 BOOKED', 17, 800, 0.1) + 17 * 1.4, r = lr([BLOCK[0] + BLOCK[2] - 26, BLOCK[1] - 10, 36, 36], [930 - w, 450 - 15, w, 30], ch); fillRR(...r, 15, rgba(GRN, lerp(1, 0.14, ch))); strokeRR(...r, 15, rgba(GRN, 0.45), 1.5); if (ch > 0.6) clipRect(r, () => text('THU 10:00 BOOKED', 930 - w / 2, 451, 17, 800, GRN, 'center', 0.1)); }
  ctx.restore();
}

// ── 6 · calendar → reviews / loyalty / payments → one card → a line ─────────
const CALR = [110, 380, 860, 820];
const TILE_FROM = [[110, 380, 860, 280], [110, 660, 430, 540], [540, 660, 430, 540]], TILE_TO = [[110, 380, 860, 250], [110, 660, 420, 540], [550, 660, 420, 540]];
function tileRects(t) {
  const sp = K(t, T.tiles - 0.1, T.tiles + 0.6), join = K(t, T.same, T.same + 0.7), flat = K(t, T.flat, T.flat + 0.7, ease.inOut);
  return TILE_FROM.map((f, i) => lr(lr(lr(f, TILE_TO[i], sp), f, join), [110, SY - 2, 860, 4], flat));
}
const SEED_COL = ['#ffb400', ACC, GRN];
function seedTargets(rs) { return [[rs[0][0] + 80, rs[0][1] + 140], [rs[1][0] + rs[1][2] / 2, rs[1][1] + 138], [rs[2][0] + 52, rs[2][1] + 200]]; }
function sceneTiles(t) {
  if (t < T.tiles - 0.1 || t > T.back + 0.5) return;
  const rs = tileRects(t), join = K(t, T.same, T.same + 0.7), flat = K(t, T.flat, T.flat + 0.7);
  if (flat > 0.98) return;
  { const one = seg(join, 0.6, 0.95); if (one > 0) panel(...lr(CALR, [110, SY - 2, 860, 4], flat), lerp(28, 2, flat), one, rgba(ACC, 0.2 * (1 - flat))); if (join < 0.999) rs.forEach((r) => panel(...r, 28, 1 - seg(join, 0.8, 1), rgba(ACC, 0.2 * seg(join, 0.1, 0.9)))); } // the three tiles melt into one card
  // the booking block (now a dot) splits into three seeds, one per tile
  const sk = K(t, T.tiles + 0.2, T.tiles + 0.6, ease.inOut), tg = seedTargets(rs);
  if (sk > 0 && sk < 1) tg.forEach(([x, y], i) => { const px = lerp(BLOCK_C[0], x, sk), py = lerp(BLOCK_C[1], y, sk) - Math.sin(sk * Math.PI) * 80; glow(px, py, 40, SEED_COL[i], 0.6); circle(px, py, 10, SEED_COL[i]); });
  const cont = 1 - seg(flat, 0, 0.35); if (cont <= 0) return;
  ctx.save(); ctx.globalAlpha *= cont;
  if (flat > 0) { const h = lerp(820, 4, flat); ctx.translate(0, lerp(790, SY, flat)); ctx.scale(1, Math.max(0.01, h / 820)); ctx.translate(0, -790); } // squash with the panel, like a CRT switching off
  const A = T.tiles + 0.6; // seeds land
  const label = (s, r) => { const w = monoW(s, 18, 700), k = K(t, T.tiles + 0.3, T.tiles + 0.7, ease.out); clipRect([r[0], r[1] + 30, 40 + w * k, 40], () => mono(s, r[0] + 40, r[1] + 50, 18, DIMI, 'left', 700)); }; // wiped out of the tile edge
  // reviews: the seed becomes star 1, the other stars slide out of it, the rating is wiped out of star 5
  const [rx, ry, rw] = rs[0]; label('REVIEWS', rs[0]);
  const s1 = ease.back(seg(t, A, A + 0.25)); if (s1 > 0) { for (let i = 4; i >= 1; i--) { const k = K(t, A + 0.15 + i * 0.07, A + 0.45 + i * 0.07, ease.out); if (k > 0) star(lerp(rx + 80, rx + 80 + i * 92, k), ry + 140, 40, '#ffb400'); } star(rx + 80, ry + 140, lerp(10, 40, s1), '#ffb400'); }
  const rv = K(t, A + 0.6, A + 0.95, ease.out); if (rv > 0) clipRect([rx + 480, ry, (rw - 480) * rv, 250], () => { text('4.9', rx + rw - 60, ry + 128, 64, 800, INK, 'right', -0.03); text('Jordan left 5 stars', rx + rw - 60, ry + 180, 24, 500, DIMI, 'right'); });
  // loyalty: the seed lands on top of the ring and draws it; the points roll up inside it; the reward grows out of its base
  const [lx, ly, lw] = rs[1], cx = lx + lw / 2, cy = ly + 250; label('LOYALTY', rs[1]);
  const tr = K(t, A, A + 0.35, ease.inOut), lp = K(t, A + 0.3, A + 1.1, ease.out);
  if (tr > 0) { ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, 112, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * tr); ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 16; ctx.stroke(); ctx.restore(); arcRing(cx, cy, 112, 16, lerp(0, lerp(0.86, 1, seg(lp, 0.55, 1)), seg(lp, 0, 0.55)), lp > 0.98 ? GRN : ACC, 'rgba(0,0,0,0)');
    const ru = K(t, A + 0.2, A + 0.55, ease.out); clipCircle(cx, cy, 96, () => { text(String(Math.round(lerp(0, 500, lp))), cx, cy - 10 + (1 - ru) * 110, 60, 800, INK, 'center', -0.03); mono('/ 500 PTS', cx, cy + 40 + (1 - ru) * 110, 18, DIMI, 'center'); }); }
  const rk = K(t, A + 1.0, A + 1.3, ease.out), rwid = tw('REWARD UNLOCKED', 18, 800, 0.1) + 18 * 1.4; growPill(rk, cx, cy + 120, [cx - rwid / 2, ly + 440 - 16, rwid, 32], rgba(GRN, 0.14), rgba(GRN, 0.45), () => text('REWARD UNLOCKED', cx, ly + 441, 18, 800, GRN, 'center', 0.1));
  // payments: the seed is the caret that types the amount; "Paid" grows out of the amount
  const [px, py] = rs[2]; label('PAYMENTS', rs[2]);
  const amt = '$65.00', ty = seg(t, A, A + 0.45), n = Math.ceil(ty * amt.length);
  if (ty > 0) { const s = amt.slice(0, n); text(s, px + 40, py + 200, 76, 800, INK, 'left', -0.03); if (ty < 1) { const cxp = px + 40 + tw(s, 76, 800, -0.03) + 10; fillRR(cxp, py + 165, 7, 70, 3.5, GRN); } }
  const sb = K(t, A + 0.4, A + 0.75, ease.out); if (sb > 0) clipRect([px + 40, py + 240, 300 * sb, 44], () => text('Jordan · cut & colour', px + 40, py + 262, 24, 500, DIMI, 'left'));
  const pd = K(t, A + 0.8, A + 1.15, ease.out); growPill(pd, px + 40, py + 236, [px + 40, py + 405, 170, 70], rgba(GRN, 0.16), GRN, () => { circle(px + 80, py + 440, 16, GRN); check(px + 80, py + 441, 16, '#fff', 3.5); text('Paid', px + 108, py + 441, 30, 700, '#c6f6d8', 'left', 0); });
  ctx.restore();
}

// ── 7 · the pulse comes back → the logo ──────────────────────────────────────
const LOGO_S = 1.08, LOGO_C = [CX, 730];
// The logo's centre-line (512-unit box of assets/logo.png): a closed loop for the left shape, one path for the right.
// Every pixel of the logo lies within 34 units of it, so a stroke of this path 76 units wide, used as a mask over the real
// logo image, reveals the whole logo exactly — the line "inflates" into the true shape, no approximation is left on screen.
const LP = { L: [[100, 75], [233, 236], [99, 403], [100, 75]], R: [[245, 311], [398, 100], [401, 363], [394, 423], [309, 299]] };
function resample(pts, n) { const seglen = []; let tot = 0; for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seglen.push(d); tot += d; } const out = []; for (let k = 0; k < n; k++) { let d = (k / (n - 1)) * tot, i = 0; while (i < seglen.length - 1 && d > seglen[i]) { d -= seglen[i]; i++; } const f = seglen[i] ? d / seglen[i] : 0; out.push([lerp(pts[i][0], pts[i + 1][0], f), lerp(pts[i][1], pts[i + 1][1], f)]); } return out; }
const NL = 160, NR = 160, MASK_W = 76;
const LPX = ([x, y]) => [LOGO_C[0] + (x - 256) * LOGO_S, LOGO_C[1] + (y - 256) * LOGO_S];
const TGT = [...resample(LP.L, NL), ...resample(LP.R, NR)].map(LPX);
const penX2 = 970;
let SRC = null; // the heartbeat at the moment it starts to form the logo, resampled evenly along its length
function srcTrace() { if (SRC) return SRC; const pts = []; for (let x = 110; x <= 970; x += 2) { const ts = T.logo - (penX2 - x) / E2.speed; pts.push([x, SY + ecgY(E2, ts)]); } return (SRC = resample(pts, NL + NR)); }
let MASK = null;
function sceneLine(t) {
  if (t < T.back - 0.2 || t > T.logoDone + 0.05) return;
  const m = K(t, T.logo, T.logo + 1.0, (u) => u);
  if (m <= 0) {
    // the flattened card is now the baseline; the pen grows out of its right end and the pulse comes back
    const gr = ctx.createLinearGradient(110, 0, 970, 0); gr.addColorStop(0, rgba(GRN, 0.15)); gr.addColorStop(0.5, rgba(GRN, 0.9)); gr.addColorStop(1, GRN);
    traceECG(t, E2, penX2, 110, gr, 5, 1, true); const py = SY + ecgY(E2, t), pk = ease.back(seg(t, T.back - 0.15, T.back + 0.2)); glow(penX2, py, 80, GRN, 0.35 * pk); circle(penX2, py, 12 * pk, '#eafff2');
    // Jordan's score rises out of the line, climbs back, then sinks back into it
    // Jordan's score ring buds off the pen, floats up, climbs from 38 to 86, then returns into the pen before the logo
    const out = K(t, T.back + 0.1, T.back + 0.75, ease.inOut) * (1 - K(t, T.logo - 0.65, T.logo - 0.08, ease.inOut));
    if (out > 0) {
      const up = K(t, T.back + 0.7, T.back + 1.9, ease.out), v = Math.round(lerp(38, 86, up)), col = scoreCol(v);
      const x = lerp(penX2, CX, out), y = lerp(py, 560, out) - Math.sin(out * Math.PI) * 70, r = lerp(12 * pk, 130, out), lw = lerp(3, 16, out);
      if (out < 0.25) { ctx.save(); ctx.strokeStyle = '#eafff2'; ctx.lineWidth = lerp(12, 0, out * 4); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(penX2, py); ctx.lineTo(x, y); ctx.stroke(); ctx.restore(); } // the bud's neck
      circle(x, y, r, '#17141f'); ring(x, y, r, rgba('#ffffff', 0.08 * out), lw); arcRing(x, y, r, lw, (v / 100) * seg(out, 0.4, 1), col, 'rgba(0,0,0,0)'); glow(x, y, r * 1.8, col, 0.18 * out);
      const nr = K(t, T.back + 0.5, T.back + 0.85, ease.out) * (1 - K(t, T.logo - 0.95, T.logo - 0.7, ease.in));
      if (nr > 0) clipCircle(x, y, r - lw / 2 - 2, () => { ctx.save(); ctx.shadowColor = col; ctx.shadowBlur = 30; text(String(v), x, y + 4 + (1 - nr) * r * 1.5, 96, 800, col, 'center', -0.04); ctx.restore(); });
      const lk = K(t, T.back + 0.8, T.back + 1.15, ease.out) * (1 - K(t, T.logo - 1.2, T.logo - 0.95, ease.in)), lb = 'JORDAN · HEALTH SCORE', lwid = monoW(lb, 20) + 40;
      growPill(lk, x, y + r, [x - lwid / 2, y + r + 26, lwid, 40], 'rgba(12,11,17,0.9)', rgba(col, 0.5), () => mono(lb, x, y + r + 47, 20, DIMI, 'center')); // the label grows out of the bottom of the ring
    }
    return;
  }
  // 1) the line glides into the logo's centre-line, sweeping left to right (smootherstep per point, staggered along the line)
  const src = srcTrace(), sm = (u) => u * u * u * (u * (u * 6 - 15) + 10), N = NL + NR;
  const P = src.map((p, k) => { const st = (k / N) * 0.5, f = sm(clamp((m - st) / 0.5)); return [lerp(p[0], TGT[k][0], f), lerp(p[1], TGT[k][1], f)]; }); // the line peels off left to right and winds into the logo
  const inf = K(t, T.logo + 0.85, T.logoDone, ease.inOut), col = hexMix(GRN, '#8f88ff', clamp(m * 1.4));
  // 2) then it inflates: a widening stroke of the centre-line masks the real logo image
  if (inf > 0 && LOGO) {
    if (!MASK) { MASK = document.createElement('canvas'); MASK.width = W; MASK.height = H; }
    const mc = MASK.getContext('2d'); mc.setTransform(1, 0, 0, 1, 0, 0); mc.globalCompositeOperation = 'source-over'; mc.clearRect(0, 0, W, H);
    mc.strokeStyle = '#fff'; mc.lineWidth = lerp(6, MASK_W, inf) * LOGO_S; mc.lineJoin = 'round'; mc.lineCap = 'round';
    [TGT.slice(0, NL), TGT.slice(NL)].forEach((seg2) => { mc.beginPath(); seg2.forEach(([x, y], i) => (i ? mc.lineTo(x, y) : mc.moveTo(x, y))); mc.stroke(); });
    mc.globalCompositeOperation = 'source-in'; const sz = 512 * LOGO_S; mc.drawImage(LOGO, LOGO_C[0] - sz / 2, LOGO_C[1] - sz / 2, sz, sz);
    ctx.save(); ctx.shadowColor = rgba(ACC2, 0.6); ctx.shadowBlur = 24 * inf; ctx.drawImage(MASK, 0, 0); ctx.restore(); // drawn under the same camera transform as everything else
  }
  const la = 1 - seg(inf, 0.15, 0.6); if (la <= 0) return;
  ctx.save(); ctx.globalAlpha *= la; ctx.strokeStyle = col; ctx.lineWidth = lerp(5, 8, clamp(m * 1.5)); ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.shadowColor = col; ctx.shadowBlur = 24;
  const path = (a2, b2) => { ctx.beginPath(); P.slice(a2, b2).forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke(); };
  path(0, NL); path(NL, N);
  { const pr = 12 * (1 - seg(m, 0.55, 1)); if (pr > 0.3) { glow(...P[N - 1], 70, col, 0.3); circle(...P[N - 1], pr, '#eef'); } } // the pen rides the end of the line in
  const bridge = 1 - seg(m, 0.25, 0.75); if (bridge > 0) { ctx.globalAlpha *= bridge; ctx.beginPath(); ctx.moveTo(...P[NL - 1]); ctx.lineTo(...P[NL]); ctx.stroke(); } // the bit of line between the two shapes lets go
  ctx.restore();
}
const DROP = LPX([392, 412]); // the bottom of the logo's right stroke
function sceneLogo(t) {
  if (t < T.word || t > T.endDone) return;
  const sz = 512 * LOGO_S, png = t >= T.logoDone; // before this, sceneLine's mask shows the same image
  const pulse = 1 + 0.025 * Math.exp(-(t - T.logoDone) * 5) * Math.sin((t - T.logoDone) * 30) * (t > T.logoDone ? 1 : 0);
  if (png) { glow(LOGO_C[0], LOGO_C[1], 420, ACC2, 0.22 * ease.out(seg(t, T.logoDone, T.logoDone + 0.6))); ctx.save(); ctx.shadowColor = rgba(ACC2, 0.6); ctx.shadowBlur = 24; xf(LOGO_C[0], LOGO_C[1], pulse, 0, () => { if (LOGO) ctx.drawImage(LOGO, LOGO_C[0] - sz / 2, LOGO_C[1] - sz / 2, sz, sz); }); ctx.restore(); }
  // a drop falls from the logo, lands, and spreads into the underline; the wordmark rises out of the underline
  const wm = 'MsgHealth', size = 120; font(size, 800, -0.04); const total = ctx.measureText(wm).width, ux = CX - total / 2, UY = 1128;
  const fall = seg(t, T.word, T.word + 0.32), spread = K(t, T.word + 0.3, T.word + 0.7, ease.out), b = K(t, T.keep - 0.1, T.keep + 0.5, ease.inOut);
  if (fall > 0 && spread <= 0) { const y = lerp(DROP[1], UY + 3.5, ease.in(fall)); circle(DROP[0], y, 9, ACC2); glow(DROP[0], y, 40, ACC2, 0.4); }
  let x = ux; const yb = 1060;
  for (let i = 0; i < wm.length; i++) { font(size, 800, -0.04); const cw = ctx.measureText(wm[i]).width, k = ease.out(seg(t, T.word + 0.5 + i * 0.045, T.word + 0.85 + i * 0.045)); if (k > 0) clipRect([0, yb - 110, W, UY - 4 - (yb - 110)], () => text(wm[i], x + cw / 2, yb + (1 - k) * 140, size, 800, INK, 'center', -0.04)); x += cw; }
  if (spread > 0) {
    const ul = lr([DROP[0] - 9, UY, 18, 7], [ux, UY, total, 7], spread), r = lr(ul, [230, 1150, 620, 116], b); // the underline becomes the button
    ctx.save(); if (b > 0.3) { ctx.shadowColor = ACC2; ctx.shadowBlur = 50 * b; } fillRR(...r, lerp(3.5, 58, b), mix('#6d66ff', '#4f46e5', b)); ctx.restore();
    const tk = K(t, T.keep + 0.25, T.keep + 0.65, ease.out); if (tk > 0) clipRect([CX - 310 * tk, 1150, 620 * tk, 116], () => text('Comment “KEEP”', CX, 1150 + 59, 46, 800, '#fff', 'center'));
  }
  // the offer tag grows out of the bottom of the button, then shrinks into the caret that types the URL
  const s = 'FREE RETENTION AUDIT', w = monoW(s, 22, 700) + 50, tagR = [CX - w / 2, 1290, w, 46], g = K(t, T.audit, T.audit + 0.4, ease.out), toC = K(t, T.url - 0.35, T.url - 0.02, ease.inOut);
  const url = 'msghealth.net', uw = monoW(url, 42, 700, 0.02), ux0 = CX - uw / 2, ty = seg(t, T.url, T.url + 0.7), typed = url.slice(0, Math.ceil(url.length * ty)), cx = ux0 + monoW(typed, 42, 700, 0.02) + 6;
  if (g > 0 && toC < 1) { const r = lr(lr([CX - 3, 1266, 6, 6], tagR, g), [ux0 - 4, 1294, 6, 44], toC); fillRR(...r, Math.min(r[2], r[3]) / 2, mix('#16302a', ACC, toC)); strokeRR(...r, Math.min(r[2], r[3]) / 2, rgba(GRN, 0.6 * (1 - toC)), 1.5); if (g > 0.4 && toC < 0.3) clipRect(r, () => mono(s, CX, 1314, 22, '#bdf5d3', 'center', 700)); }
  if (toC >= 1) { mono(typed, ux0, 1316, 42, ACC, 'left', 700, 0.02); const soft = ty < 1 ? 1 : 0.55 + 0.45 * (0.5 + 0.5 * Math.cos((t - T.url - 0.7) * 6)); ctx.save(); ctx.globalAlpha *= soft; fillRR(cx, 1294, 6, 44, 3, ACC); ctx.restore(); }
}

// ── 8 · HUD + captions ───────────────────────────────────────────────────────
function hud(t) {
  const a = 0.75;
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
  const end = K(t, T.end, T.endDone - 0.15, (u) => u * u * u), drift = 0; // no idle drift: canvas text snaps to whole pixels, so a slow drift made type jitter by 1px
  const s = (1 + push) * (1 - end) + 0.0001;
  ctx.save(); ctx.translate(CX, SY + drift * (1 - end)); ctx.scale(s, s); ctx.translate(-CX, -SY); ctx.globalAlpha = 1 - seg(end, 0.7, 1); fn(); ctx.restore();
  if (t > T.endDone - 0.35) { const k = ease.back(seg(t, T.endDone - 0.35, T.endDone + 0.05)); glow(CX, SY, 110, '#ffffff', 0.3 * k); circle(CX, SY, 15 * k * (1 + 0.1 * Math.sin((t - T.endDone) * 4)), '#fff'); }
}
function scene(t) {
  background(t);
  world(t, () => { sceneTitle(t); hero(t); sceneDot(t); sceneCustomers(t); sceneCard(t); sceneTiles(t); sceneChatCal(t); sceneFlow(t); sceneLine(t); sceneLogo(t); });
  grain(t);
}

// ── sound ────────────────────────────────────────────────────────────────────
cue(0.15, 'swoosh', 0.4); [0, 1, 2, 3, 4, 5].forEach((k) => cue(T.title + k * 0.17, 'key', 0.3)); [0, 1, 2].forEach((k) => cue(T.title2 + k * 0.16, 'key', 0.3)); cue(T.collapse + 0.1, 'whoosh', 0.9); cue(T.dotEnd - 0.05, 'snap', 0.6);
for (let b = 0; b < 12; b++) { const at = E1.start + (b + 0.345) / BEAT; if (at < T.cust) cue(at, 'beep', 0.55); }
cue(T.cust, 'swoosh', 0.6); for (let c = 4; c >= 0; c--) { cue(DEP(c), 'tap', 0.45); for (let r = 1; r < 4; r++) cue(DEP(c) + 0.22 + (r - 1) * 0.26 + 0.34, 'tap', 0.2); } cue(T.quiet + 0.1, 'swish', 0.4);
cue(T.radar, 'transition', 0.7); QUIET.forEach((q) => cue(radarHitAt(CUST[q]), 'ding', 0.45)); cue(T.focus, 'whoosh', 0.7);
for (let i = 0; i < 6; i++) cue(T.score + 0.12 + i * 0.16, 'key', 0.45); cue(T.card, 'swoosh', 0.7); for (let i = 1; i < 5; i++) cue(T.card + 0.55 + i * 0.08, 'tap', 0.35);
cue(T.slips + 0.1, 'punch', 0.6); cue(T.reach, 'swoosh', 0.6); [0.5, 0.75, 1.0].forEach((f) => cue(T.reach + 0.6 + 1.3 * f - 0.05, 'tap', 0.55));
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
