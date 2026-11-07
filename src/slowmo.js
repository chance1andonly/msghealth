// MsgHealth · "Slow-mo entrance" · trend-based follower-growth video (1080 × 1920, 30 fps), built on kit.js + story-kit.js + trend-kit.js.
// Trend (researched Nov 7, 2026; origin NOT confirmed, only secondary sources): the "Pray For Me" slow-motion entrance, where friends take
// turns making exaggerated cinematic entrances. This applies it to the 4:59 pm customer: three customers walk in at closing time in epic
// slow motion. No one's likeness or audio is used; add the trending sound at upload. The only product is a tiny cameo: the owner's tablet
// pings "booked for tomorrow" and the customers leave happy. No watermark, no pitch. Voiceover: assets/audio/slowmo.
'use strict';
const word = (l, k) => VO_AT[l] + VO_CLIPS[l].chunks[k][1];
const T = { l0: VO_AT[0], l1: VO_AT[1], door: VO_AT[2], c1: VO_AT[3], c2: VO_AT[4], c3: VO_AT[5], pray: VO_AT[6], end: VO_AT[7] };
const DURATION = +(VO_AT[7] + VO_CLIPS[7].dur + 1.0).toFixed(2);
window.CUES = T; window.SFX = []; const cue = (t, kind, gain) => window.SFX.push({ t, kind, gain });
window.MUSIC = { bpm: 70, root: 41, brandAt: 999, mood: 'sneaky' };
const slow = (k) => ease.inOut(clamp(k)); // slow-motion easing
function shop(t, doorOpen) {
  ctx.fillStyle = '#d9cdb4'; ctx.fillRect(-60, 0, W + 120, 1280); ctx.fillStyle = '#7a6a56'; ctx.fillRect(-60, 1280, W + 120, 700); ctx.fillStyle = 'rgba(0,0,0,0.12)'; ctx.fillRect(-60, 1280, W + 120, 26);
  fillRR(60, 300, 260, 340, 10, '#bfe0f5'); strokeRR(60, 300, 260, 340, 10, '#8a7a64', 10); fillRR(380, 200, 300, 110, 16, '#3a2f26'); text('OPEN', 530, 258, 64, 800, '#f2c84a', 'center', 0.1);
  const clk = clockFace(900, 260, 90, 4, 59 + (t > T.door ? 1 : 0)); // wall clock
  fillRR(800, 520, 260, 760, 10, '#5a4a3a'); fillRR(820, 540, 220, 720, 6, doorOpen > 0 ? '#fff6d8' : '#8fc3e8'); if (doorOpen > 0) glow(930, 900, 600, '#fff6d8', 0.7 * doorOpen);
}
function owner(t, o = {}) { const p = buddy(250, 1700, 760, 9, { shirt: '#8ea2b8', apron: true, smile: o.smile }); tiredEyes(250, 1700, 760, p.skin, o.shut ?? 0.6); fillRR(0, 1330, 560, 600, 0, '#4a3a2a'); fillRR(0, 1330, 560, 26, 0, '#6a5642'); if (!o.hideSign) { ctx.save(); ctx.translate(430, 1330); fillRR(-90, -64, 180, 64, 8, '#d9462d'); text('CLOSED', 0, -32, 34, 800, '#fff', 'center', 0.1); ctx.restore(); } return p; }
const FOLKS = [
  { name: 'THE QUICK-QUESTION GUY', shirt: '#e08a6d', seed: 31, prop: (x, y) => { fillRR(x + 80, y - 470, 70, 120, 8, '#14161c'); fillRR(x + 86, y - 462, 58, 100, 5, '#a5a0ff'); } },
  { name: 'THE COUPON LADY', shirt: '#d9468a', seed: 32, prop: (x, y) => { ctx.save(); ctx.translate(x + 110, y - 420); ctx.rotate(0.2); fillRR(-60, -40, 120, 80, 8, '#fff7a8'); text('20%', 0, 0, 30, 800, '#d9462d', 'center', 0); ctx.restore(); } },
  { name: 'THE "5 MINUTES" MAN', shirt: '#3a7a5a', seed: 33, prop: (x, y) => { fillRR(x + 60, y - 440, 130, 170, 8, '#c9a26a'); text('JUST', x + 125, y - 400, 24, 800, '#3a2a1a', 'center', 0.1); text('5 MIN', x + 125, y - 360, 34, 800, '#3a2a1a', 'center', 0); } },
];
function walker(i, t, at) { // slow-motion entrance from the door (x 930) to the counter area
  const k = slow(seg(t, at, at + 2.2)), x = lerp(960, [620, 750, 880][i], k), bob = Math.sin(seg(t, at, at + 2.2) * Math.PI * 4) * 10 * (1 - k * 0.3), f = FOLKS[i];
  if (t < at) return; ctx.save(); ctx.globalAlpha = clamp((t - at) / 0.2); const p = buddy(x, 1660 + bob, 700 - i * 20, f.seed, { shirt: f.shirt, eyes: 'wide', noShadow: false }); f.prop(x, 1660 + bob); ctx.restore();
  const flare = seg(t, at, at + 0.4) * (1 - seg(t, at + 0.4, at + 1.2)); if (flare > 0) glow(930, 900, 700, '#ffffff', 0.5 * flare);
}
function speedLines(t, a) { ctx.save(); ctx.globalAlpha = a; for (let i = 0; i < 26; i++) { const y = 200 + hash(i) * 1500, len = 200 + hash(i + 3) * 500, x = ((hash(i + 7) * 1400 - t * 900 * (0.5 + hash(i + 9))) % 1500 + 1500) % 1500 - 200; line(x, y, x + len, y, 'rgba(255,255,255,0.35)', 3 + hash(i + 2) * 4); } ctx.restore(); }
function barsBlur(t, on) { if (on <= 0) return; ctx.fillStyle = `rgba(0,0,0,${0.92 * on})`; ctx.fillRect(0, 0, W, 230 * on); ctx.fillRect(0, H - 230 * on, W, 230 * on); }
function scene(t) {
  const phase = t < T.door ? 0 : 1, open = seg(t, T.door - 0.3, T.door + 0.3), cin = seg(t, T.door - 0.4, T.door + 0.4);
  const z = 1 + 0.06 * clamp((t - T.door) / 8); ctx.save(); ctx.translate(CX, 1000); ctx.scale(z, z); ctx.translate(-CX, -1000);
  shop(t, open); owner(t, { shut: t > T.pray ? 0.2 : 0.6, hideSign: false });
  [2, 1, 0].forEach((i) => walker(i, t, [T.c1, T.c2, T.c3][i] - 0.5)); ctx.restore(); speedLines(t, 0.5 * cin * (t < T.pray ? 1 : 0)); barsBlur(t, cin * (t < T.pray - 0.2 ? 1 : 0.0));
  [[T.c1, 0], [T.c2, 1], [T.c3, 2]].forEach(([a, i]) => { const e = appear(t, a - 0.2, 0.3), out = t > (i < 2 ? [T.c2, T.c3][i] - 0.3 : T.pray - 0.3); if (e > 0 && !out) xf(CX, 400, e, 0, () => banner(FOLKS[i].name, CX, 420, 50, 'rgba(10,12,24,0.8)', '#fff')); });
  const c = appear(t, 0.2, 0.3); if (c > 0 && t < T.door) xf(CX, 400, c, 0, () => { fillRR(380, 330, 320, 120, 20, '#0c0f1a'); text('4:59 PM', CX, 392, 74, 800, '#ff8a7f', 'center', 0.02); });
  const pr = appear(t, T.pray, 0.3); if (pr > 0) { glow(250, 700, 500, '#fff6d8', 0.35 * pr); xf(250, 640, pr, 0, () => banner('PRAY FOR ME', 300, 400, 70, 'rgba(10,12,24,0.8)', '#fff')); }
  if (t > T.pray + 1.0) { const e = appear(t, T.pray + 1.0, 0.35); xf(560, 700, e, 0, () => cameo(t + 99, 0, 999, 700, 640, 560, 200, () => { fillRR(24, 28, 56, 56, 28, LGREEN); check(52, 57, 22, '#fff', 5); ltext('3 new bookings', 98, 52, 30, 800); ltext('all for tomorrow · 10:00', 98, 94, 22, 500, LMUTED); ltext('Closed on time ✓', 24, 156, 28, 800, LGREEN); }, 0.03)); }
}
function endCard(t) { ctx.fillStyle = vgrad(0, H, '#14182e', '#241a30'); ctx.fillRect(0, 0, W, H); const p = owner(t, { smile: true, shut: 0.2, hideSign: true }); [620, 750, 880].forEach((x, i) => { const f = FOLKS[i]; buddy(x, 1660, 620, f.seed, { shirt: f.shirt, smile: true }); lcheckMini(x, 880, 30); }); const a = appear(t, T.end, 0.4); xf(CX, 460, a, 0, () => { text('TAG THE OWNER', CX, 380, 110, 800, '#fff', 'center', -0.02); text('who\'s lived this', CX, 490, 48, 800, '#c9b6ff', 'center', 0.02); }); }
function lcheckMini(x, y, r) { circle(x, y, r, '#1f9d55'); check(x, y + 1, r, '#fff', Math.max(3, r * 0.22)); }
const SCENES = [[0, T.end, scene], [T.end, 999, endCard]];
cue(0.2, 'tap', 0.7); cue(T.l1, 'tap', 0.7); cue(T.door, 'transition', 1.0); cue(T.door + 0.1, 'punch', 1.2); [T.c1, T.c2, T.c3].forEach((a) => { cue(a - 0.5, 'swoosh', 0.8); cue(a - 0.2, 'punch', 1.0); cue(a, 'ding', 0.5); }); cue(T.pray, 'ding', 1); cue(T.pray + 1.0, 'notification', 1); cue(T.end, 'ding', 1);
boot({ duration: DURATION, scenes: SCENES, brandAt: 999, hideCaption: (t) => t >= T.end - 0.1 }, 'slowmo');
