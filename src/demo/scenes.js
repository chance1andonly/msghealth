// ─────────────────────────────────────────────────────────────────────────────
// MsgHealth product demo — the edit (47 s, 16:9)
//
// Every scene draws from absolute film time t, so its beats line up with the
// voiceover windows in VOICEOVER.md. The SCENES table at the bottom is the cut list.
// ─────────────────────────────────────────────────────────────────────────────
'use strict';

// ── 01 · THE SILENCE (0–4.6) ─────────────────────────────────────────────────
// A message drops in with squash & stretch, gets delivered… and nobody replies.
const S1 = { base: 700, top: -80, r: 36, impacts: [1.0, 1.55, 1.98, 2.28, 2.48], peaks: [200, 95, 38, 12], str: [1, 0.7, 0.45, 0.25, 0.1] };
function ballH(t) {
  const im = S1.impacts;
  if (t < 0.3) return S1.base - S1.top;
  if (t < im[0]) { const u = prog(t, 0.3, im[0]); return (S1.base - S1.top) * (1 - u * u); }
  for (let k = 0; k < im.length - 1; k++) if (t < im[k + 1]) { const u = (t - im[k]) / (im[k + 1] - im[k]); return 4 * S1.peaks[k] * u * (1 - u); }
  return 0;
}
const ballX = (t) => tw(t, 0.3, 2.5, 560, 960, ease.outQuad);

function scene1(t) {
  ctx.fillStyle = C.ink; ctx.fillRect(0, 0, W, H);
  glow(960, 760, 900, C.indigo, 0.16);
  const { base, r } = S1;

  // the floor: draws out from the centre, ripples where the ball lands, then splits open
  const reach = 600 * ease.outExpo(prog(t, 0.05, 0.75));
  const gap = 240 * ease.outExpo(prog(t, 4.12, 4.45));
  const disp = (x) => {
    let d = 0;
    S1.impacts.forEach((ti, i) => {
      if (t < ti) return;
      const dt = t - ti;
      d += 16 * S1.str[i] * Math.exp(-dt * 7) * Math.sin(dt * 38) * Math.exp(-(((x - ballX(ti)) / 140) ** 2));
    });
    return d;
  };
  ctx.save(); ctx.strokeStyle = 'rgba(242,239,232,0.42)'; ctx.lineWidth = 2;
  [[960 - reach, 960 - gap / 2], [960 + gap / 2, 960 + reach]].forEach(([a, b]) => {
    if (b - a < 1) return;
    ctx.beginPath();
    for (let x = a; x <= b; x += 6) ctx.lineTo(x, base + disp(x));
    ctx.lineTo(b, base + disp(b)); ctx.stroke();
  });
  ctx.restore();

  // contact markers (frame numbers), as in an animator's timing chart
  S1.impacts.slice(0, 3).forEach((ti, i) => {
    const k = ease.outBack(prog(t, ti, ti + 0.25)) * (1 - prog(t, 2.9, 3.2));
    if (k <= 0) return;
    const x = ballX(ti);
    ctx.save(); ctx.translate(x, base + 24); ctx.rotate(Math.PI / 4); ctx.scale(k, k);
    ctx.fillStyle = C.lime; ctx.fillRect(-5, -5, 10, 10); ctx.restore();
    txt(`F.${String(Math.round(ti * FPS)).padStart(3, '0')}`, x, base + 56, { size: 13, fam: F.mono, ls: 1, color: 'rgba(242,239,232,0.5)', align: 'center', alpha: k });
  });

  // motion trail
  if (t < 2.7) for (let k = 1; k <= 18; k++) {
    const tk = t - k * 0.034;
    if (tk < 0.32 || tk > 2.5) continue;
    circle(ballX(tk), base - ballH(tk) - r, 3.4 * (1 - k / 21), rgba(C.indigoL, 0.55 * (1 - k / 19)));
  }

  // timing graph inset
  const ga = env(t, 0.35, 0.8, 2.75, 3.05);
  if (ga > 0) fade(ga, () => {
    const bx = 1480, by = 800, bw = 340, bh = 150;
    ctx.save(); ctx.strokeStyle = 'rgba(242,239,232,0.22)'; ctx.lineWidth = 1; ctx.strokeRect(bx, by, bw, bh); ctx.restore();
    txt('POSITION · Y', bx + 12, by + 22, { size: 12, fam: F.mono, ls: 1.5, color: 'rgba(242,239,232,0.55)' });
    txt('EASE · BOUNCE', bx + bw - 12, by + 22, { size: 12, fam: F.mono, ls: 1.5, color: 'rgba(242,239,232,0.35)', align: 'right' });
    const end = Math.min(t, 2.6), px = (u) => bx + 12 + ((u - 0.3) / 2.3) * (bw - 24), py = (u) => by + bh - 14 - (ballH(u) / (base - S1.top)) * (bh - 46);
    ctx.save(); ctx.beginPath();
    for (let u = 0.3; u <= end; u += 0.01) ctx.lineTo(px(u), py(u));
    ctx.strokeStyle = C.lime; ctx.lineWidth = 2; ctx.stroke(); ctx.restore();
    if (end > 0.3) circle(px(end), py(end), 4, C.coral);
  });

  // ball → message bubble
  const m = prog(t, 2.55, 2.95), mk = ease.outBack(m, 1.2);
  if (t < 2.55) {
    const h = ballH(t);
    const near = Math.min(...S1.impacts.map((ti) => Math.abs(t - ti)));
    const idx = S1.impacts.findIndex((ti) => Math.abs(t - ti) === near);
    const sq = near < 0.07 ? S1.str[idx] * (1 - near / 0.07) : 0;
    const v = Math.abs(ballH(t + 1 / 120) - ballH(t - 1 / 120)) * 60;
    const sy = (1 - 0.42 * sq) * (1 + clamp(v / 2600, 0, 0.28)), sx = 1 / sy;
    const x = ballX(t), y = base - h - r * sy;
    // contact shadow
    ctx.save(); ctx.beginPath(); ctx.ellipse(x, base + 2, r * 1.3 * (1 - clamp(h / 500) * 0.6), 6, 0, 0, 7);
    ctx.fillStyle = `rgba(0,0,0,${0.5 * (1 - clamp(h / 400))})`; ctx.fill(); ctx.restore();
    ctx.save(); ctx.shadowColor = rgba(C.indigoL, 0.7); ctx.shadowBlur = 40;
    ctx.beginPath(); ctx.ellipse(x, y, r * sx, r * sy, 0, 0, 7); ctx.fillStyle = C.indigoL; ctx.fill(); ctx.restore();
    return;
  }

  // the bubble falls through the split floor at the end
  const fall = prog(t, 4.15, 4.6), fy = 1500 * ease.inQuad(fall), rot = 0.5 * ease.inQuad(fall);
  const bw = lerp(72, 420, mk), bh = lerp(72, 100, mk), cx = 960, cy = lerp(base - r, base - 130, ease.outCubic(m)) + fy;
  const grey = prog(t, 3.95, 4.25);
  const fill = mix(C.indigoL, '#3a3858', grey);
  around(cx, cy, 1, () => {
    ctx.save(); ctx.shadowColor = rgba(C.indigoL, 0.55 * (1 - grey)); ctx.shadowBlur = 40;
    rrect(cx - bw / 2, cy - bh / 2, bw, bh, lerp(36, 30, mk)); ctx.fillStyle = fill; ctx.fill();
    // tail (outgoing: bottom-right)
    if (mk > 0.3) { ctx.beginPath(); const tx = cx + bw / 2 - 40; ctx.moveTo(tx - 14, cy + bh / 2 - 2); ctx.lineTo(tx + 22, cy + bh / 2 + 16 * clamp(mk)); ctx.lineTo(tx + 12, cy + bh / 2 - 2); ctx.fill(); }
    ctx.restore();
    txt('Same time next month?', cx, cy + 11, { size: 32, weight: 600, color: mix(C.white, '#b9b7cc', grey), align: 'center', alpha: prog(t, 2.78, 2.98) });
  }, rot);

  // status line under the bubble
  if (fall < 0.2) {
    const read = t > 3.95;
    const sa = prog(t, 3.0, 3.15) * (1 - prog(t, 4.1, 4.2));
    txt(read ? 'READ · NO REPLY' : 'DELIVERED ✓', cx + 210, base - 46, { size: 15, weight: 500, fam: F.mono, ls: 2, color: read ? C.coral : 'rgba(242,239,232,0.6)', align: 'right', alpha: sa });
  }
  // the reply that never comes: typing dots appear, then give up
  const ty = ease.outBack(prog(t, 3.15, 3.4)) * (1 - ease.inBack(prog(t, 3.75, 3.95)));
  if (ty > 0) around(690, base - 44, ty, () => {
    rrect(690 - 64, base - 44 - 32, 128, 64, 32); ctx.fillStyle = '#2a2944'; ctx.fill();
    [0, 1, 2].forEach((i) => circle(690 - 26 + i * 26, base - 44 - 6 * Math.max(0, Math.sin((t - 3.15) * 14 - i * 0.9)), 7, 'rgba(242,239,232,0.75)'));
  });
}

// ── 02 · THE PROBLEM (4.6–9.0) ───────────────────────────────────────────────
function scene2(t) {
  ctx.fillStyle = C.cream; ctx.fillRect(0, 0, W, H);
  const out = prog(t, 8.35, 8.8);
  // set-up line, word by word
  const words = "they don't complain. they just".split(' ');
  const o1 = { size: 64, fam: F.serif, style: 'italic', color: C.text };
  const total = measure(words.join(' '), o1), sp = measure(' ', o1);
  let x = 960 - total / 2;
  words.forEach((w, i) => {
    const k = ease.outCubic(prog(t, 4.72 + i * 0.13, 5.1 + i * 0.13));
    txt(w, x, 330 + (1 - k) * 24, { ...o1, alpha: k * (1 - out) });
    x += measure(w, o1) + sp;
  });

  // LEAVE — rises in, then falls apart letter by letter
  const o = { size: 330, weight: 900, ls: -2, color: C.ink, gaps: { 4: 34 } }; // Inter kerns V–E into a touch at this size
  const word = 'LEAVE', ww = measure(word, o) + 34, x0 = 960 - ww / 2 - 30, by = 690;
  const order = [4, 1, 3, 0, 2];
  if (t < 6.4) riseText(word, x0, by, o, t, 5.35, 0.05, 0.62, 380);
  else eachLetter(word, x0, o, (ch, i, lx) => {
    const dt = t - (7.25 + order.indexOf(i) * 0.12);
    if (dt <= 0) return txt(ch, lx, by, o);
    const dir = i % 2 ? -1 : 1;
    ctx.save(); ctx.translate(lx + 90 + dir * 70 * dt, by - 120 + 2100 * dt * dt); ctx.rotate(dir * 2.4 * dt * dt + dir * 0.4 * dt);
    txt(ch, -90, 120, o); ctx.restore();
  });
  // the full stop: pops on, then rolls away
  const dk = ease.outBack(prog(t, 5.75, 6.05)), roll = ease.inCubic(prog(t, 7.05, 7.85));
  if (dk > 0) circle(x0 + ww + 46 + roll * 1100, by - 30 - (roll > 0.5 ? (roll - 0.5) * 900 * (roll - 0.5) : 0), 30 * dk, C.coral);
  // underline swipe in, retract out
  const ua = ease.outExpo(prog(t, 5.85, 6.35)), ub = ease.inOutCubic(prog(t, 7.85, 8.4));
  if (ua > ub) { ctx.fillStyle = C.indigo; ctx.fillRect(x0 + ww * ub, by + 36, ww * (ua - ub), 20); }
  // dictionary definition
  const dka = ease.outCubic(prog(t, 6.2, 6.6));
  txt('v. to stop coming back — without a word.', 960, by + 150 + (1 - dka) * 20, { size: 50, fam: F.serif, style: 'italic', color: C.muted, align: 'center', alpha: dka * (1 - out) });
}

// ── 03 · CHURN (9.0–13.2) ────────────────────────────────────────────────────
const GRID = { cols: 16, rows: 7, sp: 64, cx: 760, cy: 560 };
const gridPos = (i) => { const c = i % GRID.cols, r = Math.floor(i / GRID.cols); return [GRID.cx + (c - (GRID.cols - 1) / 2) * GRID.sp, GRID.cy + (r - (GRID.rows - 1) / 2) * GRID.sp]; };
const N_DOTS = GRID.cols * GRID.rows;
const CHURN = (() => { srand(42); const idx = [...Array(N_DOTS).keys()]; for (let i = idx.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; } return idx.slice(0, 27); })();
const churnAt = (i) => { const k = CHURN.indexOf(i); return k < 0 ? Infinity : 10.0 + k * 0.074; };

function drawGrid(t, a = 1) {
  for (let i = 0; i < N_DOTS; i++) {
    const [x, y] = gridPos(i);
    const d = Math.hypot(x - GRID.cx, y - GRID.cy);
    const s = ease.outBack(prog(t, 9.05 + d * 0.0011, 9.45 + d * 0.0011));
    if (s <= 0) continue;
    const ct = churnAt(i), c = ct === Infinity ? 0 : prog(t, ct, ct + 0.35);
    if (c <= 0) { circle(x, y, 10 * s, rgba(C.indigoL, a)); continue; }
    // flash coral, then hollow out
    const flash = 1 - prog(t, ct + 0.05, ct + 0.3);
    fade(a, () => circle(x, y, lerp(10, 4, ease.outCubic(c)) * (1 + 0.5 * Math.sin(Math.PI * c)), mix(C.coral, '#3a3858', c)));
    ctx.save(); ctx.globalAlpha = a * 0.35 * c; ctx.beginPath(); ctx.arc(x, y, 10, 0, 7); ctx.strokeStyle = 'rgba(242,239,232,0.7)'; ctx.lineWidth = 1.5; ctx.stroke(); ctx.restore();
    if (flash > 0 && c < 1) circle(x, y, 10 + 18 * c, rgba(C.coral, 0.25 * flash * a));
  }
}
function scene3(t) {
  ctx.fillStyle = C.ink; ctx.fillRect(0, 0, W, H);
  glow(760, 560, 800, C.indigo, 0.12);
  const la = ease.outCubic(prog(t, 9.2, 9.6));
  const [gx0] = gridPos(0), [gx1] = gridPos(GRID.cols - 1), gy0 = gridPos(0)[1] - 50;
  txt('CLIENT LIST · 112 REGULARS', gx0 - 10, gy0, { size: 16, weight: 500, fam: F.mono, ls: 3, color: 'rgba(242,239,232,0.6)', alpha: la });
  txt('LAST 12 MONTHS', gx1 + 10, gy0, { size: 16, weight: 500, fam: F.mono, ls: 3, color: 'rgba(242,239,232,0.35)', align: 'right', alpha: la });
  drawGrid(t);
  // counter
  const n = CHURN.filter((i) => t >= churnAt(i) + 0.05).length;
  const ca = ease.outCubic(prog(t, 9.85, 10.15));
  txt(String(n), 1380, 590, { size: 230, weight: 900, ls: -8, color: C.coral, alpha: ca });
  txt('REGULARS GONE QUIET', 1388, 640, { size: 17, weight: 500, fam: F.mono, ls: 3, color: 'rgba(242,239,232,0.7)', alpha: ca });
  const ia = ease.outCubic(prog(t, 11.2, 11.6));
  txt('and no one said a word.', 1386, 712 + (1 - ia) * 16, { size: 46, fam: F.serif, style: 'italic', color: 'rgba(242,239,232,0.75)', alpha: ia });
}

// ── 04 · MEET MSGHEALTH (13.2–17.0) ──────────────────────────────────────────
function scene4(t) {
  ctx.fillStyle = C.ink; ctx.fillRect(0, 0, W, H);
  const hold = prog(t, 13.2, 13.45);
  // what's left of the previous scene
  fade(1 - hold, () => {
    for (const i of CHURN) {
      const [x, y] = gridPos(i);
      ctx.save(); ctx.globalAlpha *= 0.35; ctx.beginPath(); ctx.arc(x, y, 10, 0, 7); ctx.strokeStyle = 'rgba(242,239,232,0.7)'; ctx.lineWidth = 1.5; ctx.stroke(); ctx.restore();
      circle(x, y, 4, '#3a3858');
    }
    txt(String(CHURN.length), 1380, 590, { size: 230, weight: 900, ls: -8, color: C.coral });
    txt('REGULARS GONE QUIET', 1388, 640, { size: 17, weight: 500, fam: F.mono, ls: 3, color: 'rgba(242,239,232,0.7)' });
    txt('and no one said a word.', 1386, 712, { size: 46, fam: F.serif, style: 'italic', color: 'rgba(242,239,232,0.75)' });
  });
  // the healthy clients pull together into one mark
  const C0 = [960, 540];
  if (t < 13.85) for (let i = 0; i < N_DOTS; i++) {
    if (CHURN.includes(i)) continue;
    const [x, y] = gridPos(i), d = Math.hypot(x - C0[0], y - C0[1]);
    const u = ease.inOutCubic(prog(t, 13.18 + d * 0.00012, 13.82));
    circle(lerp(x, C0[0], u), lerp(y, C0[1], u), lerp(10, 7, u), C.indigoL);
  }

  // lockup timing
  const move = ease.inOutCubic(prog(t, 15.0, 15.6));
  const tile = lerp(320, 190, move);
  const wo = { size: 150, weight: 900, ls: -5, color: C.white };
  const wordW = measure('MsgHealth', wo), lockW = 190 + 48 + wordW + 46;
  const mx = lerp(960, 960 - lockW / 2 + 95, move), my = 520;
  // glow + orbit ring
  glow(mx, my, 700, C.indigo, 0.35 * prog(t, 13.7, 14.4));
  const ringK = ease.inOutCubic(prog(t, 14.1, 15.4));
  ring(960, 520, 430, 1.5, rgba(C.indigoL, 0.3), -Math.PI / 2 + t * 0.15, Math.PI * 2 * ringK, 'butt');

  const grow = ease.outBack(prog(t, 13.72, 14.12), 2);
  if (grow > 0) {
    const corner = lerp(0.5, 0.225, ease.inOutCubic(prog(t, 14.05, 14.5)));
    const size = tile * grow;
    // contour echoes while the shape morphs
    const ea = env(t, 14.05, 14.3, 14.7, 15.1);
    [1.1, 1.2, 1.3].forEach((s, i) => fade(ea * (0.5 - i * 0.14), () => {
      rrect(mx - size * s / 2, my - size * s / 2, size * s, size * s, size * s * corner);
      ctx.strokeStyle = C.indigoL; ctx.lineWidth = 1.5; ctx.stroke();
    }));
    rrect(mx - size / 2, my - size / 2, size, size, size * corner);
    ctx.fillStyle = C.indigo; ctx.fill();
    const lk = ease.outBack(prog(t, 14.35, 14.75), 2);
    if (lk > 0) around(mx, my, lk, () => logoMark(mx, my, size * 0.62));
    // bounding-box handles
    const ba = env(t, 14.1, 14.3, 14.85, 15.05);
    if (ba > 0) fade(ba, () => {
      const b = size / 2 + 22;
      ctx.save(); ctx.strokeStyle = C.lime; ctx.lineWidth = 1.5; ctx.strokeRect(mx - b, my - b, b * 2, b * 2);
      line(mx, my - b, mx, my - b - 34, C.lime, 1.5); circle(mx, my - b - 40, 6, C.lime);
      [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]].forEach(([u, v]) => {
        ctx.fillStyle = C.ink; ctx.fillRect(mx + u * b - 6, my + v * b - 6, 12, 12); ctx.strokeRect(mx + u * b - 6, my + v * b - 6, 12, 12);
      });
      ctx.restore();
      txt('Squircle 01', mx - b, my - b - 14, { size: 14, fam: F.mono, ls: 1, color: C.lime });
      txt('0°', mx + b, my - b - 14, { size: 14, fam: F.mono, color: C.lime, align: 'right' });
      const lbl = `${Math.round(size)} × ${Math.round(size)}`, lw = measure(lbl, { size: 14, fam: F.mono, weight: 700 }) + 20;
      ctx.fillStyle = C.lime; ctx.fillRect(mx - lw / 2, my + b + 12, lw, 26);
      txt(lbl, mx, my + b + 30, { size: 14, fam: F.mono, weight: 700, color: C.ink, align: 'center' });
    });
  }
  // wordmark
  if (t > 15.2) {
    const wx = mx + 95 + 48, wy = my + 54;
    riseText('MsgHealth', wx, wy, wo, t, 15.25, 0.03, 0.6, 170);
    const pk = ease.outBack(prog(t, 15.7, 15.95), 2.5);
    circle(wx + wordW + 30, wy - 14, 16 * pk, C.lime);
  }
  const ta = ease.outCubic(prog(t, 15.85, 16.3));
  txt('client health, made visible.', 960, 760 + (1 - ta) * 18, { size: 60, fam: F.serif, style: 'italic', color: '#c3c0ea', align: 'center', alpha: ta });

  // iris wipe into the product
  const wipe = ease.inOutCubic(prog(t, 16.62, 17.0));
  if (wipe > 0) circle(mx, my, 2300 * wipe, C.cream);
}

// ── 05 · HEALTH SCORE (17.0–23.0) ────────────────────────────────────────────
const CLIENTS = [
  { n: 'Ava Martinez', i: 'AM', c: '#f59e7b', s: 92, v: 'Last visit · 9 days ago' },
  { n: 'Jordan Lee', i: 'JL', c: '#7c75ff', s: 78, v: 'Last visit · 41 days ago' },
  { n: 'Chris Patel', i: 'CP', c: '#5bc8a8', s: 85, v: 'Last visit · 16 days ago' },
  { n: 'Mia Thompson', i: 'MT', c: '#f2b441', s: 64, v: 'Last visit · 27 days ago' },
  { n: 'Noah Kim', i: 'NK', c: '#ec6fa8', s: 88, v: 'Last visit · 12 days ago' },
];
const jordanScore = (t) => (t < 28 ? Math.round(tw(t, 18.35, 19.85, 78, 38, ease.inOutCubic)) : Math.round(tw(t, 28.45, 29.3, 38, 86, ease.inOutCubic)));
function avatar(x, y, r, c, ini) { circle(x, y, r, c); txt(ini, x, y + r * 0.26, { size: r * 0.72, weight: 700, color: C.white, align: 'center' }); }
function pill(x, y, label, color, fg = C.white, a = 1, s = 1, dot = 0) {
  const o = { size: 19, weight: 800, ls: 1.5, color: fg };
  const w = measure(label, o) + 40 + (dot ? 22 : 0), h = 44;
  around(x + w / 2, y + h / 2, s, () => fade(a, () => {
    rrect(x, y, w, h, 22); ctx.fillStyle = color; ctx.fill();
    if (dot) { circle(x + 24, y + 22, 6, fg); circle(x + 24, y + 22, 6 + 6 * dot, rgba(C.white, 0.35 * (1 - dot))); }
    txt(label, x + 20 + (dot ? 22 : 0), y + 29, o);
  }));
  return w;
}
function scene5(t) {
  ctx.fillStyle = C.cream; ctx.fillRect(0, 0, W, H);
  const push = 1 + 0.035 * ease.inOutCubic(prog(t, 17.0, 23.0));
  const exit = ease.inExpo(prog(t, 22.55, 22.95));
  around(1100, 540, push, () => {
    ctx.save(); ctx.translate(-exit * 300, 0);
    const score = jordanScore(t);
    // ── list panel
    const la = ease.outExpo(prog(t, 17.0, 17.6));
    const X = 150, Y = 190 + (1 - la) * 90;
    fade(la, () => {
      card(X, Y, 760, 720, 30, C.white);
      txt('Client Health', X + 44, Y + 72, { size: 36, weight: 800, ls: -0.5, color: C.text });
      txt('112 clients · updated just now', X + 44, Y + 106, { size: 18, weight: 500, color: C.muted });
      CLIENTS.forEach((cl, i) => {
        const ra = ease.outCubic(prog(t, 17.2 + i * 0.07, 17.6 + i * 0.07));
        const ry = Y + 150 + i * 108 + (1 - ra) * 24;
        const s = i === 1 ? score : cl.s;
        fade(ra, () => {
          if (i === 1) {
            const sel = ease.outCubic(prog(t, 17.75, 18.05));
            fade(sel, () => { rrect(X + 20, ry, 720, 100, 18); ctx.fillStyle = rgba(C.indigo, 0.07); ctx.fill(); ctx.fillStyle = C.indigo; ctx.fillRect(X + 20, ry + 18, 5, 64); });
          } else if (i > 0) { ctx.fillStyle = '#efedf5'; ctx.fillRect(X + 44, ry - 4, 672, 1.5); }
          avatar(X + 82, ry + 50, 30, cl.c, cl.i);
          txt(cl.n, X + 130, ry + 44, { size: 26, weight: 700, color: C.text });
          txt(cl.v, X + 130, ry + 74, { size: 18, weight: 500, color: i === 1 && t > 19.2 ? C.risk : C.muted });
          rrect(X + 470, ry + 45, 180, 10, 5); ctx.fillStyle = '#eceaf3'; ctx.fill();
          const bw = 180 * (s / 100) * ease.outCubic(prog(t, 17.4 + i * 0.07, 18.1 + i * 0.07));
          rrect(X + 470, ry + 45, bw, 10, 5); ctx.fillStyle = scoreTint(s); ctx.fill();
          txt(String(s), X + 730, ry + 60, { size: 28, weight: 800, color: scoreTint(s), align: 'right' });
        });
      });
    });

    // ── detail panel
    const da = ease.outExpo(prog(t, 17.45, 18.05));
    const DX = 960 + (1 - da) * 120, DY = 190;
    fade(da, () => {
      card(DX, DY, 810, 720, 30, C.white);
      avatar(DX + 76, DY + 76, 36, '#7c75ff', 'JL');
      txt('Jordan Lee', DX + 128, DY + 70, { size: 34, weight: 800, ls: -0.5, color: C.text });
      txt('Regular since 2021 · Cut & colour', DX + 128, DY + 102, { size: 18, weight: 500, color: C.muted });
      // gauge
      const gx = DX + 240, gy = DY + 330;
      ring(gx, gy, 130, 26, '#eceaf3');
      ring(gx, gy, 130, 26, scoreTint(score), -Math.PI / 2, Math.PI * 2 * (score / 100) * ease.outCubic(prog(t, 17.7, 18.3)));
      txt(String(score), gx, gy + 30, { size: 92, weight: 900, ls: -3, color: C.text, align: 'center' });
      txt('HEALTH SCORE', gx, gy + 68, { size: 14, weight: 500, fam: F.mono, ls: 3, color: C.muted, align: 'center' });
      // status pill that flips as the score falls
      const st = scoreStatus(score);
      const flip = st === 'AT RISK' ? 19.62 : st === 'NEEDS ATTENTION' ? 18.95 : 17.9;
      const pk = ease.outBack(prog(t, flip, flip + 0.3), 2.6);
      pill(DX + 440, DY + 200, st, scoreColor(score), C.white, 1, lerp(0.6, 1, pk), st === 'AT RISK' ? ((t - 19.62) * 1.2) % 1 : 0);
      // churn signals
      const SIG = [['No visit in 41 days', 'USUALLY EVERY 4 WEEKS', 'clock'], ['2 messages unanswered', 'NO REPLY SINCE LAST VISIT', 'sms'], ['Spend down 60%', 'VS. PREVIOUS 3 MONTHS', 'down']];
      SIG.forEach(([a, b, ic], i) => {
        const k = ease.outCubic(prog(t, 20.05 + i * 0.36, 20.45 + i * 0.36));
        const sy = DY + 296 + i * 78;
        fade(k, () => {
          ctx.save(); ctx.translate((1 - k) * 30, 0);
          circle(DX + 462, sy, 21, rgba(C.risk, 0.13));
          icon(ic, DX + 462, sy, 26, C.risk, 9);
          txt(a, DX + 500, sy + 2, { size: 22, weight: 700, color: C.text });
          txt(b, DX + 500, sy + 28, { size: 12.5, weight: 500, fam: F.mono, ls: 1.5, color: C.muted });
          ctx.restore();
        });
      });
      // spend history
      const SP = [62, 70, 58, 74, 66, 72, 68, 60, 41, 22, 0, 0];
      txt('SPEND · LAST 12 MONTHS', DX + 60, DY + 560, { size: 13, weight: 500, fam: F.mono, ls: 2.5, color: C.muted });
      SP.forEach((v, i) => {
        const bx = DX + 60 + i * 58, base = DY + 668, h = 80 * (v / 74) * ease.outCubic(prog(t, 17.9 + i * 0.035, 18.4 + i * 0.035));
        if (v === 0) { ctx.save(); ctx.setLineDash([5, 5]); rrect(bx, base - 26, 40, 26, 6); ctx.strokeStyle = rgba(C.risk, 0.6 * prog(t, 18.3, 18.6)); ctx.lineWidth = 1.5; ctx.stroke(); ctx.restore(); return; }
        rrect(bx, base - h, 40, h, 6); ctx.fillStyle = i >= 8 ? mix(C.indigo, C.risk, prog(t, 18.6, 19.6)) : rgba(C.indigo, 0.85); ctx.fill();
      });
    });
    ctx.restore();
  });
  // slide-on of the next scene's field
  const wipe = ease.inOutCubic(prog(t, 22.6, 23.0));
  if (wipe > 0) { ctx.fillStyle = C.night; ctx.fillRect(W - W * wipe, 0, W * wipe + 2, H); }
}

// ── 06 · AUTOMATIONS + OUTREACH (23.0–29.6) ──────────────────────────────────
const NODES = [
  { ic: 'alert', col: C.coral, step: 'TRIGGER', a: 'Client is at risk', b: 'Health score below 40' },
  { ic: 'sms', col: C.indigoL, step: 'STEP 1', a: 'Send a text', b: 'A personal check-in' },
  { ic: 'clock', col: C.attention, step: 'STEP 2', a: 'Wait 2 days', b: "If there's no reply" },
  { ic: 'mail', col: C.lime, step: 'STEP 3', a: 'Send an email', b: 'With a booking link' },
];
function dotField(a) {
  ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = 'rgba(139,133,255,0.16)';
  for (let x = 40; x < W; x += 48) for (let y = 36; y < H; y += 48) ctx.fillRect(x - 1.5, y - 1.5, 3, 3);
  ctx.restore();
}
function scene6(t) {
  ctx.fillStyle = C.night; ctx.fillRect(0, 0, W, H);
  dotField(1);
  glow(960, 600, 900, C.indigo, 0.25);
  const shrink = ease.inOutCubic(prog(t, 25.9, 26.55));
  const ha = ease.outCubic(prog(t, 23.1, 23.5)) * (1 - prog(t, 25.85, 26.15));
  txt('AUTOMATIONS · WIN-BACK FLOW', 200, 224, { size: 15, weight: 500, fam: F.mono, ls: 3, color: C.lime, alpha: ha });
  txt('Win-back, on autopilot.', 200, 296 + (1 - ha) * 20, { size: 60, weight: 800, ls: -1.5, color: C.white, alpha: ha });

  // flow: full size, then tucked up top while the phone takes the stage
  ctx.save();
  ctx.translate(lerp(0, 960 - 960 * 0.5, shrink), lerp(0, 152 - 480 * 0.5, shrink)); ctx.scale(lerp(1, 0.5, shrink), lerp(1, 0.5, shrink));
  const nx = (i) => 200 + i * 400, ny = 400;
  NODES.forEach((nd, i) => {
    const t0 = 23.45 + i * 0.36, k = ease.outBack(prog(t, t0, t0 + 0.42), 1.6);
    if (i > 0) { // connector from the previous card
      const c = ease.inOutCubic(prog(t, t0 - 0.2, t0 + 0.05)), x0 = nx(i - 1) + 320, x1 = x0 + 80 * c;
      if (c > 0) { line(x0 + 6, ny + 80, x1 - 6, ny + 80, '#5a55c9', 2.5); if (c > 0.9) { ctx.save(); ctx.fillStyle = '#5a55c9'; ctx.beginPath(); ctx.moveTo(x1 - 4, ny + 80); ctx.lineTo(x1 - 14, ny + 73); ctx.lineTo(x1 - 14, ny + 87); ctx.fill(); ctx.restore(); } }
    }
    if (k <= 0) return;
    const hot = i === 1 ? env(t, 25.62, 25.75, 26.6, 27) : 0;
    around(nx(i) + 160, ny + 80, lerp(0.85, 1, k), () => fade(clamp(k), () => {
      card(nx(i), ny, 320, 160, 24, '#1f1c4d', { stroke: hot ? mix('#3a36a0', C.lime, hot) : '#3a36a0', lw: 1.5 + hot, shadowColor: 'rgba(0,0,0,0.35)' });
      circle(nx(i) + 50, ny + 52, 26, nd.col);
      icon(nd.ic, nx(i) + 50, ny + 52, 30, i === 3 ? C.ink : C.white, 9);
      txt(nd.step, nx(i) + 92, ny + 58, { size: 13, weight: 500, fam: F.mono, ls: 2.5, color: '#a9a6d6' });
      txt(nd.a, nx(i) + 28, ny + 112, { size: 26, weight: 700, color: C.white });
      txt(nd.b, nx(i) + 28, ny + 142, { size: 18, weight: 500, color: '#a9a6d6' });
    }));
  });
  // toggle
  const tg = ease.outCubic(prog(t, 24.75, 25.0)) * (1 - shrink);
  fade(tg, () => {
    const on = ease.outBack(prog(t, 25.0, 25.25)), sx = 1720 - 84, sy = 618;
    txt('Automation', sx - 22, sy + 27, { size: 22, weight: 600, color: C.white, align: 'right' });
    rrect(sx, sy, 84, 44, 22); ctx.fillStyle = mix('#3a36a0', C.lime, clamp(on)); ctx.fill();
    circle(sx + 22 + 40 * on, sy + 22, 17, on > 0.5 ? C.ink : C.white);
    txt(on > 0.5 ? 'ON' : 'OFF', sx - 22, sy + 70, { size: 14, weight: 700, fam: F.mono, ls: 3, color: on > 0.5 ? C.lime : '#a9a6d6', align: 'right' });
  });
  // signal pulse from trigger to the text step
  const p = prog(t, 25.3, 25.7);
  if (p > 0 && p < 1) { const x = lerp(nx(0) + 320, nx(1), ease.inOutCubic(p)); glow(x, ny + 80, 40, C.lime, 0.8); circle(x, ny + 80, 7, C.lime); }
  ctx.restore();

  // ── the phone (Jordan's view)
  const ph = ease.outExpo(prog(t, 25.95, 26.65));
  if (ph <= 0) return;
  const px = 960, pw = 460, top = lerp(1120, 290, ph);
  card(px - pw / 2, top, pw, 920, 66, '#0d0c1f', { stroke: '#34317a', lw: 3, shadowColor: 'rgba(0,0,0,0.5)', blur: 80, dy: 30 });
  const sx = px - pw / 2 + 14, sw = pw - 28;
  rrect(sx, top + 14, sw, 900, 54); ctx.fillStyle = '#f7f6fb'; ctx.fill();
  rrect(px - 60, top + 30, 120, 30, 15); ctx.fillStyle = '#0d0c1f'; ctx.fill(); // camera island
  circle(px, top + 108, 30, C.indigo);
  txt('S', px, top + 118, { size: 26, weight: 800, color: C.white, align: 'center' });
  txt("Sam's Studio", px, top + 166, { size: 21, weight: 700, color: C.text, align: 'center' });
  ctx.fillStyle = '#e7e5ef'; ctx.fillRect(sx, top + 190, sw, 1.5);

  const bubble = (lines, out, y, t0, col, fg) => {
    const o = { size: 21, weight: 500, color: fg };
    const bw = Math.max(...lines.map((l) => measure(l, o))) + 40, bh = lines.length * 30 + 26;
    const bx = out ? sx + sw - 22 - bw : sx + 22;
    const k = ease.outBack(prog(t, t0, t0 + 0.32), 1.8);
    if (k <= 0) return;
    around(out ? bx + bw : bx, y + bh, k, () => {
      rrect(bx, y, bw, bh, 22); ctx.fillStyle = col; ctx.fill();
      lines.forEach((l, i) => txt(l, bx + 20, y + 28 + i * 30, { ...o, base: 'middle' }));
    });
  };
  // typing indicator before the first message
  const ty = ease.outBack(prog(t, 26.45, 26.6)) * (1 - prog(t, 26.82, 26.9));
  if (ty > 0) around(sx + 22, top + 290, ty, () => { rrect(sx + 22, top + 222, 96, 48, 22); ctx.fillStyle = '#e9e7f2'; ctx.fill(); [0, 1, 2].forEach((i) => circle(sx + 46 + i * 24, top + 246 - 4 * Math.max(0, Math.sin((t - 26.45) * 16 - i)), 5.5, '#9a98b0')); });
  bubble(["Hi Jordan! It's been a while.", 'Want your usual Thursday at 10?'], false, top + 222, 26.85, '#e9e7f2', C.text);
  bubble(['Yes please! See you Thursday.'], true, top + 342, 27.6, C.indigo, C.white);
  // booking confirmation
  const bk = ease.outBack(prog(t, 28.1, 28.45), 1.6);
  if (bk > 0) around(px, top + 470, bk, () => {
    card(sx + 22, top + 432, sw - 44, 96, 20, C.white, { stroke: '#e3e1ec', shadowColor: 'rgba(30,27,75,0.10)', blur: 24, dy: 8 });
    circle(sx + 68, top + 480, 22, C.healthy); icon('check', sx + 68, top + 480, 30, C.white, 11);
    txt('Booked · Thu 10:00 AM', sx + 104, top + 474, { size: 21, weight: 700, color: C.text });
    txt("Sam's Studio · Cut & colour", sx + 104, top + 502, { size: 16, weight: 500, color: C.muted });
  });

  // activity log (left) and Jordan's score (right)
  const LOG = [['10:02', 'TEXT SENT', 26.85], ['10:07', 'REPLY RECEIVED', 27.6], ['10:07', 'BOOKING CONFIRMED', 28.1]];
  LOG.forEach(([tm, s, t0], i) => {
    const k = ease.outCubic(prog(t, t0, t0 + 0.3));
    const y = 520 + i * 52;
    txt(`${tm}  ${s}`, 652 - (1 - k) * 20, y, { size: 16, weight: 500, fam: F.mono, ls: 1.5, color: 'rgba(242,239,232,0.75)', align: 'right', alpha: k });
    fade(k, () => icon('check', 678, y - 6, 26, C.lime, 11));
  });
  const sk = ease.outBack(prog(t, 28.3, 28.65), 1.6);
  if (sk > 0) around(1420, 560, lerp(0.8, 1, sk), () => fade(clamp(sk), () => {
    const s = jordanScore(t);
    card(1240, 452, 420, 216, 26, '#1f1c4d', { stroke: '#3a36a0', shadowColor: 'rgba(0,0,0,0.35)' });
    txt('JORDAN LEE', 1272, 500, { size: 14, weight: 500, fam: F.mono, ls: 3, color: '#a9a6d6' });
    ring(1330, 588, 52, 12, '#2e2a6b');
    ring(1330, 588, 52, 12, scoreTint(s), -Math.PI / 2, Math.PI * 2 * s / 100);
    txt(String(s), 1330, 603, { size: 40, weight: 900, ls: -1, color: C.white, align: 'center' });
    txt(scoreStatus(s), 1408, 580, { size: 22, weight: 800, ls: 1, color: scoreTint(s) });
    txt('HEALTH SCORE', 1408, 610, { size: 13, weight: 500, fam: F.mono, ls: 2.5, color: '#a9a6d6' });
    const up = ease.outBack(prog(t, 29.25, 29.5), 2);
    if (up > 0) around(1600, 500, up, () => txt('+48', 1628, 506, { size: 22, weight: 800, color: C.lime, align: 'right' }));
  }));
}

// ── 07 · TOOLKIT (29.6–35.0) — hard-cut feature slams ────────────────────────
const SLAMS = [
  { w: 'Inbox', cap: 'every conversation, one place.', bg: C.indigo, fg: C.white, ac: C.lime, ic: 'chat', tone: 'dark' },
  { w: 'Bookings', cap: 'keep the calendar full.', bg: C.cream, fg: C.ink, ac: C.indigo, ic: 'calendar', tone: 'light' },
  { w: 'Reviews', cap: 'turn happy clients into five stars.', bg: C.lime, fg: C.ink, ac: C.ink, ic: 'star', tone: 'light' },
  { w: 'Loyalty', cap: 'reward the regulars.', bg: C.coral, fg: C.ink, ac: C.ink, ic: 'heart', tone: 'light' },
  { w: 'Payments', cap: 'get paid, without the chasing.', bg: C.ink, fg: C.white, ac: C.lime, ic: 'card', tone: 'dark' },
  { w: 'Reports', cap: "see what's working.", bg: C.pink, fg: C.ink, ac: C.ink, ic: 'bars', tone: 'light' },
];
const SLAM_T0 = 29.6, SLAM_D = 0.9;
const slamAt = (t) => clamp(Math.floor((t - SLAM_T0) / SLAM_D), 0, SLAMS.length - 1);
function scene7(t) {
  const i = slamAt(t), s = SLAMS[i], lt = t - (SLAM_T0 + i * SLAM_D);
  ctx.fillStyle = s.bg; ctx.fillRect(0, 0, W, H);
  const k = ease.outExpo(prog(lt, 0, 0.32));
  const drift = -18 * lt;
  // burst
  srand(100 + i);
  for (let j = 0; j < 14; j++) {
    const a = rnd() * Math.PI * 2, d = 260 + rnd() * 420, r = 4 + rnd() * 9;
    const p = ease.outExpo(prog(lt, 0.02, 0.7));
    circle(960 + Math.cos(a) * d * p * 1.2, 560 + Math.sin(a) * d * p * 0.7, r * (1 - prog(lt, 0.4, 0.85)), rgba(s.ac === C.ink ? C.ink : s.ac, 0.85));
  }
  const ik = ease.outBack(prog(lt, 0.04, 0.38), 2.2);
  if (ik > 0) around(960 + drift, 300, ik, () => icon(s.ic, 960 + drift, 300, 150, s.ac, 8));
  ctx.save();
  if (k < 1) ctx.filter = `blur(${(1 - k) * 14}px)`;
  around(960 + drift, 560, lerp(1.22, 1, k), () => txt(s.w, 960 + drift, 640, { size: 290, weight: 900, ls: -12, color: s.fg, align: 'center', alpha: clamp(k * 1.6) }));
  ctx.restore();
  const ca = ease.outCubic(prog(lt, 0.18, 0.42));
  txt(s.cap, 960 + drift * 0.6, 770 + (1 - ca) * 16, { size: 54, fam: F.serif, style: 'italic', color: s.fg, align: 'center', alpha: ca * 0.82 });
}

// ── 08 · OVERVIEW (35.0–39.6) ────────────────────────────────────────────────
const SEG = [['HEALTHY', 76, C.ink], ['NEEDS ATTENTION', 24, C.indigo], ['AT RISK', 12, C.coral]];
function scene8(t) {
  ctx.fillStyle = C.lime; ctx.fillRect(0, 0, W, H);
  const cx = 610, cy = 560, R = 220, total = 112;
  const p = ease.inOutCubic(prog(t, 35.15, 36.4));
  let acc = 0;
  SEG.forEach(([, v, col]) => {
    const a0 = acc / total, a1 = (acc + v) / total; acc += v;
    const e = clamp((p - a0) / (a1 - a0));
    ring(cx, cy, R, 92, col, -Math.PI / 2 + a0 * Math.PI * 2 + 0.012, (a1 - a0) * Math.PI * 2 * e - 0.024, 'butt');
  });
  const pct = Math.round(68 * ease.outCubic(prog(t, 35.2, 36.3)));
  txt(`${pct}%`, cx, cy + 36, { size: 120, weight: 900, ls: -5, color: C.ink, align: 'center' });
  txt('HEALTHY', cx, cy + 84, { size: 16, weight: 500, fam: F.mono, ls: 4, color: C.ink, align: 'center', alpha: prog(t, 35.6, 35.9) });

  const ha = ease.outCubic(prog(t, 35.1, 35.5));
  txt('Your clients, at a glance.', 1040, 330 + (1 - ha) * 20, { size: 58, weight: 800, ls: -1.5, color: C.ink, alpha: ha });
  const rows = [...SEG, ['ACTIONS TAKEN', 31, null]];
  rows.forEach(([lbl, v, col], i) => {
    const k = ease.outCubic(prog(t, 35.4 + i * 0.12, 35.75 + i * 0.12)), y = 420 + i * 56;
    fade(k, () => {
      if (col) { ctx.fillStyle = col; ctx.fillRect(1040, y - 20, 22, 22); } else { ctx.save(); ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.strokeRect(1041, y - 19, 20, 20); ctx.restore(); }
      txt(lbl, 1084, y, { size: 20, weight: 500, fam: F.mono, ls: 2.5, color: C.ink });
      txt(String(Math.round(v * ease.outCubic(prog(t, 35.4 + i * 0.12, 36.5)))), 1600, y, { size: 22, weight: 700, fam: F.mono, color: C.ink, align: 'right' });
      ctx.fillStyle = rgba(C.ink, 0.15); ctx.fillRect(1040, y + 18, 560, 1.5);
    });
  });
  // returning clients trend
  const la = ease.outCubic(prog(t, 36.2, 36.5));
  txt('RETURNING CLIENTS · 6 MONTHS', 1040, 700, { size: 15, weight: 500, fam: F.mono, ls: 3, color: C.ink, alpha: la });
  const lp = ease.inOutCubic(prog(t, 36.4, 37.9));
  const fy = (u, off) => 900 - 40 - u * 120 - Math.sin(u * 9 + off) * 22 * (1 - u * 0.4);
  [[0.25, 1.8, 2], [1, 0, 4]].forEach(([a, off, lw]) => {
    ctx.save(); ctx.globalAlpha = a; ctx.beginPath();
    for (let u = 0; u <= lp; u += 0.005) ctx.lineTo(1040 + u * 560, fy(u, off) + (off ? 34 : 0));
    ctx.strokeStyle = C.ink; ctx.lineWidth = lw; ctx.lineJoin = 'round'; ctx.stroke(); ctx.restore();
  });
  if (lp > 0.02) { const ex = 1040 + lp * 560, ey = fy(lp, 0); circle(ex, ey, 9, C.coral); circle(ex, ey, 9 + 14 * ((t * 1.4) % 1), rgba(C.coral, 0.35 * (1 - ((t * 1.4) % 1)))); }
  txt('THIS MONTH', 1600, 760, { size: 13, weight: 700, fam: F.mono, ls: 2.5, color: C.ink, align: 'right', alpha: prog(t, 37.8, 38.1) });

  const wipe = ease.inOutCubic(prog(t, 39.25, 39.6));
  if (wipe > 0) circle(cx, cy, 2300 * wipe, C.ink);
}

// ── 09 · CALL TO ACTION (39.6–47.0) ──────────────────────────────────────────
function cursor(x, y, s) {
  around(x, y, s, () => {
    ctx.save(); ctx.translate(x, y); ctx.beginPath();
    ctx.moveTo(0, 0); ctx.lineTo(0, 40); ctx.lineTo(10, 31); ctx.lineTo(17, 46); ctx.lineTo(24, 43); ctx.lineTo(17, 28); ctx.lineTo(30, 28); ctx.closePath();
    ctx.fillStyle = C.white; ctx.strokeStyle = C.ink; ctx.lineWidth = 2.5; ctx.lineJoin = 'round';
    ctx.shadowColor = 'rgba(0,0,0,0.4)'; ctx.shadowBlur = 12; ctx.shadowOffsetY = 4; ctx.fill(); ctx.shadowColor = 'transparent'; ctx.stroke(); ctx.restore();
  });
}
function scene9(t) {
  ctx.fillStyle = C.ink; ctx.fillRect(0, 0, W, H);
  glow(1180, 420, 820, C.indigo, 0.3);
  glow(760, 760, 600, C.coral, 0.08);
  ring(960, 540, 470, 1.5, rgba(C.coral, 0.3), t * 0.12, Math.PI * 2 * ease.inOutCubic(prog(t, 39.6, 41.2)), 'butt');
  ring(960, 540, 500, 1, rgba(C.indigoL, 0.22), -t * 0.08, Math.PI * 1.2 * ease.inOutCubic(prog(t, 40.0, 41.6)), 'butt');

  // "Stop guessing."
  const away = ease.inOutCubic(prog(t, 41.3, 41.75));
  if (away < 1) fade(1 - away, () => {
    ctx.save(); ctx.translate(0, -70 * away);
    const o = { size: 200, weight: 900, ls: -8, color: C.white };
    const w1 = measure('Stop', o), sp = 54, w2 = measure('guessing', o), x0 = 960 - (w1 + sp + w2 + 50) / 2;
    riseText('Stop', x0, 610, o, t, 39.7, 0.04, 0.6);
    riseText('guessing', x0 + w1 + sp, 610, o, t, 39.95, 0.035, 0.6);
    const pk = ease.outBack(prog(t, 40.45, 40.7), 2.5);
    circle(x0 + w1 + sp + w2 + 30, 610 - 22, 22 * pk, C.lime);
    ctx.restore();
  });

  // lockup
  const lo = { size: 120, weight: 900, ls: -4, color: C.white };
  const ww = measure('MsgHealth', lo), lw = 150 + 40 + ww + 40, lx = 960 - lw / 2;
  const tk = ease.outBack(prog(t, 41.55, 41.95), 1.8);
  if (tk > 0) around(lx + 75, 420, tk, () => logoTile(lx + 75, 420, 150, clamp(tk)));
  if (t > 41.6) {
    riseText('MsgHealth', lx + 190, 463, lo, t, 41.65, 0.03, 0.55, 140);
    circle(lx + 190 + ww + 26, 463 - 12, 13 * ease.outBack(prog(t, 42.05, 42.3), 2.5), C.lime);
  }
  const ta = ease.outCubic(prog(t, 42.1, 42.55));
  txt(BRAND.tagline, 960, 572 + (1 - ta) * 16, { size: 52, fam: F.serif, style: 'italic', color: '#c9c6ee', align: 'center', alpha: ta });

  // button
  const bk = ease.outBack(prog(t, 42.6, 43.0), 1.8);
  const press = 1 - 0.05 * Math.sin(Math.PI * prog(t, 43.95, 44.2));
  if (bk > 0) {
    const bo = { size: 36, weight: 800, ls: -0.3, color: C.ink };
    const bw = measure(BRAND.cta, bo) + 150, bh = 104, bx = 960 - bw / 2, by = 656;
    around(960, by + bh / 2, lerp(0.7, 1, bk) * press, () => fade(clamp(bk * 1.5), () => {
      glow(960, by + bh / 2, 360, C.lime, 0.16 + 0.08 * Math.sin(t * 3));
      rrect(bx, by, bw, bh, bh / 2); ctx.fillStyle = C.lime; ctx.fill();
      // shine sweep after the click
      const sh = prog(t, 44.15, 44.75);
      if (sh > 0 && sh < 1) {
        ctx.save(); rrect(bx, by, bw, bh, bh / 2); ctx.clip();
        const sx = lerp(bx - 120, bx + bw + 120, ease.inOutCubic(sh));
        const g = ctx.createLinearGradient(sx - 80, 0, sx + 80, 0);
        g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.5, 'rgba(255,255,255,0.65)'); g.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = g; ctx.fillRect(bx, by, bw, bh); ctx.restore();
      }
      txt(BRAND.cta, bx + 56, by + 65, bo);
      const nudge = t > 44.6 ? 6 * Math.max(0, Math.sin((t - 44.6) * 5)) : 0;
      icon('arrow', bx + bw - 66 + nudge, by + bh / 2, 46, C.ink, 10);
    }));
    // ripple from the click
    const rp = prog(t, 43.95, 44.7);
    if (rp > 0 && rp < 1) { ctx.save(); rrect(bx - 30 * rp, by - 30 * rp, bw + 60 * rp, bh + 60 * rp, (bh + 60 * rp) / 2); ctx.strokeStyle = rgba(C.lime, 0.6 * (1 - rp)); ctx.lineWidth = 3; ctx.stroke(); ctx.restore(); }
  }
  const ua = ease.outCubic(prog(t, 42.85, 43.25));
  txt(BRAND.url.toUpperCase(), 960, 828, { size: 24, weight: 500, fam: F.mono, ls: 8, color: 'rgba(242,239,232,0.8)', align: 'center', alpha: ua });

  // cursor glides in, clicks, steps away
  const ck = ease.inOutCubic(prog(t, 43.1, 43.9)), cout = ease.inOutCubic(prog(t, 44.8, 45.5));
  if (ck > 0 && cout < 1) {
    const x = lerp(lerp(1520, 1050, ck), 1640, cout), y = lerp(lerp(1010, 712, ck), 1120, cout);
    cursor(x, y, 1 - 0.12 * Math.sin(Math.PI * prog(t, 43.92, 44.15)));
  }
}

// ── cut list ─────────────────────────────────────────────────────────────────
const SCENES = [
  { t0: 0, t1: 4.6, label: '01 — THE SILENCE', tone: 'dark', vig: 0.55, draw: scene1 },
  { t0: 4.6, t1: 9.0, label: '02 — THE PROBLEM', tone: 'light', vig: 0.2, draw: scene2 },
  { t0: 9.0, t1: 13.2, label: '03 — CHURN', tone: 'dark', vig: 0.55, draw: scene3 },
  { t0: 13.2, t1: 17.0, label: '04 — MEET MSGHEALTH', tone: 'dark', vig: 0.55, draw: scene4 },
  { t0: 17.0, t1: 23.0, label: '05 — CLIENT HEALTH', tone: 'light', vig: 0.16, draw: scene5 },
  { t0: 23.0, t1: 29.6, label: '06 — AUTOMATIONS', tone: 'dark', vig: 0.5, draw: scene6 },
  { t0: 29.6, t1: 35.0, label: '07 — TOOLKIT', tone: (t) => SLAMS[slamAt(t)].tone, vig: 0.3, draw: scene7 },
  { t0: 35.0, t1: 39.6, label: '08 — OVERVIEW', tone: 'light', vig: 0.22, draw: scene8 },
  { t0: 39.6, t1: 47.0, label: '09 — GET STARTED', tone: 'dark', vig: 0.4, draw: scene9 },
];

// Frame tone for scene i at film time t: the wipes at the end of scenes 4, 5 and 8
// hand the frame over to the next scene's tone before the cut.
function sceneTone(i, t) {
  const s = SCENES[i];
  let tone = typeof s.tone === 'function' ? s.tone(t) : s.tone;
  if (i === 3 && t > 16.85) tone = 'light';
  if ((i === 4 && t > 22.85) || (i === 7 && t >= 39.4)) tone = 'dark';
  return tone;
}

function drawFilm(t) {
  const i = Math.max(0, SCENES.findIndex((s) => t < s.t1));
  const s = SCENES[i];
  ctx.save(); s.draw(t); ctx.restore();
  finish(t, s.vig);
  hud(sceneTone(i, t));
}
