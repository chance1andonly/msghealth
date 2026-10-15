// ─────────────────────────────────────────────────────────────────────────────
// MsgHealth product demo — FAST CUT (20.5 s, 16:9)
//
// Same story and shots as the 47 s demo, re-timed for attention: a new hook of
// one-word slams, then each shot from scenes.js played through a time remap
// (2–3× faster), so every cut lands in 0.35–3 s. The voiceover windows in
// VOICEOVER-FAST.md match the cut list at the bottom.
// ─────────────────────────────────────────────────────────────────────────────
'use strict';

// ── A · hook: one word per cut (0–1.4) ───────────────────────────────────────
const HOOK = [
  { w: 'Your', bg: C.cream, fg: C.ink, tone: 'light' },
  { w: 'customers', bg: C.indigo, fg: C.white, tone: 'dark' },
  { w: 'are', bg: C.lime, fg: C.ink, tone: 'light' },
  { w: 'leaving', bg: C.coral, fg: C.ink, tone: 'light', dot: C.lime },
];
const HOOK_D = 0.35;
const hookAt = (t) => clamp(Math.floor(t / HOOK_D), 0, HOOK.length - 1);
function hookSlams(t) {
  const i = hookAt(t), s = HOOK[i], lt = t - i * HOOK_D;
  ctx.fillStyle = s.bg; ctx.fillRect(0, 0, W, H);
  const k = ease.outExpo(prog(lt, 0, 0.16));
  const o = { size: 330, weight: 900, ls: -14, color: s.fg };
  const w = measure(s.w, o), size = Math.min(330, (330 * 1500) / w);
  const ow = measure(s.w, { ...o, size }), drift = -30 * lt;
  ctx.save();
  if (k < 1) ctx.filter = `blur(${(1 - k) * 16}px)`;
  around(960 + drift, 540, lerp(1.3, 1, k), () => {
    txt(s.w, 960 + drift - (s.dot ? 30 : 0), 540 + size * 0.36, { ...o, size, align: 'center', alpha: clamp(k * 1.8) });
    if (s.dot) circle(960 + drift - 30 + ow / 2 + 50, 540 + size * 0.36 - 32, 32 * ease.outBack(prog(lt, 0.08, 0.22), 2.5), s.dot);
  });
  ctx.restore();
}

// ── B · the quiet: delivered, read, no reply (1.4–2.4) ───────────────────────
function hookQuiet(t) {
  ctx.fillStyle = C.ink; ctx.fillRect(0, 0, W, H);
  glow(960, 560, 800, C.indigo, 0.18);
  const bk = ease.outBack(prog(t, 1.4, 1.58), 1.8), grey = prog(t, 2.0, 2.2);
  const bw = 440, bh = 100, cx = 960, cy = 420;
  if (bk > 0) around(cx + bw / 2, cy + bh / 2, bk, () => {
    ctx.save(); ctx.shadowColor = rgba(C.indigoL, 0.5 * (1 - grey)); ctx.shadowBlur = 40;
    rrect(cx - bw / 2, cy - bh / 2, bw, bh, 30); ctx.fillStyle = mix(C.indigoL, '#3a3858', grey); ctx.fill();
    ctx.beginPath(); const tx = cx + bw / 2 - 40; ctx.moveTo(tx - 14, cy + bh / 2 - 2); ctx.lineTo(tx + 22, cy + bh / 2 + 16); ctx.lineTo(tx + 12, cy + bh / 2 - 2); ctx.fill();
    ctx.restore();
    txt('Same time next month?', cx, cy + 11, { size: 32, weight: 600, color: mix(C.white, '#b9b7cc', grey), align: 'center' });
  });
  const read = t > 2.0;
  txt(read ? 'READ · NO REPLY' : 'DELIVERED ✓', cx + bw / 2, cy + bh / 2 + 44, { size: 15, weight: 500, fam: F.mono, ls: 2, color: read ? C.coral : 'rgba(242,239,232,0.6)', align: 'right', alpha: prog(t, 1.55, 1.62) });
  const ty = ease.outBack(prog(t, 1.6, 1.72)) * (1 - ease.inBack(prog(t, 1.86, 1.98)));
  if (ty > 0) around(cx - bw / 2 + 64, cy + 150, ty, () => {
    rrect(cx - bw / 2, cy + 118, 128, 64, 32); ctx.fillStyle = '#2a2944'; ctx.fill();
    [0, 1, 2].forEach((j) => circle(cx - bw / 2 + 38 + j * 26, cy + 150 - 6 * Math.max(0, Math.sin((t - 1.6) * 22 - j * 0.9)), 7, 'rgba(242,239,232,0.75)'));
  });
  const ia = ease.outCubic(prog(t, 1.75, 1.95));
  txt("…and they won't tell you why.", 960, 720 + (1 - ia) * 16, { size: 64, fam: F.serif, style: 'italic', color: 'rgba(242,239,232,0.85)', align: 'center', alpha: ia });
}

// ── cut list ─────────────────────────────────────────────────────────────────
// `src: [a, b]` replays that span of the 47 s film (scenes.js) squeezed into this cut.
const FAST = [
  { t0: 0, t1: 1.4, label: '01 — HOOK', draw: hookSlams, tone: (t) => HOOK[hookAt(t)].tone, vig: 0.25 },
  { t0: 1.4, t1: 2.4, label: '02 — THE SILENCE', draw: hookQuiet, tone: 'dark', vig: 0.55 },
  { t0: 2.4, t1: 4.2, scene: 2, src: [9.0, 13.2] },
  { t0: 4.2, t1: 5.8, scene: 3, src: [13.2, 17.0] },
  { t0: 5.8, t1: 8.8, scene: 4, src: [17.0, 23.0] },
  { t0: 8.8, t1: 11.8, scene: 5, src: [23.0, 29.6] },
  { t0: 11.8, t1: 14.8, scene: 6, src: [29.6, 35.0] },
  { t0: 14.8, t1: 16.3, scene: 7, src: [35.0, 39.6] },
  // the end card runs at 1.7× and then holds on the clicked button
  { t0: 16.3, t1: 20.5, scene: 8, src: [39.6, 39.6 + 4.2 * 1.7] },
];
const remap = (c, t) => lerp(c.src[0], c.src[1], (t - c.t0) / (c.t1 - c.t0));

function drawFast(t) {
  const c = FAST[Math.max(0, FAST.findIndex((x) => t < x.t1))];
  let tone, vig;
  ctx.save();
  if (c.src) {
    const tm = Math.min(remap(c, t), c.src[1] - 1e-4);
    SCENES[c.scene].draw(tm);
    tone = sceneTone(c.scene, tm); vig = SCENES[c.scene].vig;
  } else {
    c.draw(t);
    tone = typeof c.tone === 'function' ? c.tone(t) : c.tone; vig = c.vig;
  }
  ctx.restore();
  finish(t, vig);
  hud(tone);
}
window.DRAW = drawFast;
