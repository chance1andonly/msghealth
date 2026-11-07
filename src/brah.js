// MsgHealth · "What's up, brah" · trend-based follower-growth video (1080 × 1920, 30 fps), built on kit.js + story-kit.js + trend-kit.js.
// Trend (researched Nov 7, 2026): the Randy Marsh "What's up brah" squaring-up meme (a cutout of Randy squaring up to a villain while
// saying "what's up brah") surged on TikTok and Reels from early October 2026 and is still being posted in November. This uses the
// format with original characters (a small-business owner squaring up to the things that ruin a week). The only product is a tiny
// reminder-text cameo in the last fight. No watermark, no pitch, no brand name on screen or in the voice. Voiceover: assets/audio/brah.
'use strict';
const T = { l0: VO_AT[0], f: [1, 2, 3, 4, 5].map((i) => VO_AT[i]), end: VO_AT[6] };
const ST = T.f.map((f) => f - 1.0);
const DURATION = +(VO_AT[6] + VO_CLIPS[6].dur + 1.0).toFixed(2);
window.CUES = T; window.SFX = []; const cue = (t, kind, gain) => window.SFX.push({ t, kind, gain });
window.MUSIC = { bpm: 98, root: 45, brandAt: 999, mood: 'sneaky' };
const mirror = (x, fn) => { ctx.save(); ctx.translate(x, 0); ctx.scale(-1, 1); ctx.translate(-x, 0); fn(); ctx.restore(); };
function angryEyes(x, y, s) { [-1, 1].forEach((d) => { circle(x + d * 34 * s, y, 22 * s, '#fff'); circle(x + d * 34 * s - d * 4 * s, y + 4 * s, 10 * s, '#1b1f27'); line(x + d * 62 * s, y - 34 * s, x + d * 8 * s, y - 16 * s, '#1b1f27', 8 * s); }); }
function legs(x, y, s) { fillRR(x - 50 * s, y - 40 * s, 30 * s, 40 * s, 8 * s, '#2b2b30'); fillRR(x + 20 * s, y - 40 * s, 30 * s, 40 * s, 8 * s, '#2b2b30'); }
function ghost(x, y, s, t, o = {}) { // the no-show: a sheet ghost; o.solid turns it into a sheepish, confirmed customer
  const b = sine(t, 3, 14 * s), yy = y - 40 * s + b; shadow(x, y, 120 * s); ctx.save(); ctx.globalAlpha *= o.solid ? 1 : 0.9; ctx.fillStyle = o.solid ? '#fff' : '#f4f7ff';
  ctx.beginPath(); ctx.moveTo(x - 120 * s, yy); ctx.lineTo(x - 120 * s, yy - 230 * s); ctx.arc(x, yy - 230 * s, 120 * s, Math.PI, 0); ctx.lineTo(x + 120 * s, yy); for (let i = 0; i < 4; i++) ctx.quadraticCurveTo(x + 120 * s - (i * 2 + 1) * 30 * s, yy + 46 * s * (i % 2 ? -1 : 1) + 20 * s, x + 120 * s - (i + 1) * 60 * s, yy); ctx.fill(); ctx.restore();
  ellipse(x - 40 * s, yy - 250 * s, 17 * s, 30 * s, '#1b1f27'); ellipse(x + 40 * s, yy - 250 * s, 17 * s, 30 * s, '#1b1f27');
  if (o.solid) { ellipse(x - 70 * s, yy - 214 * s, 20 * s, 12 * s, 'rgba(255,120,150,0.55)'); ellipse(x + 70 * s, yy - 214 * s, 20 * s, 12 * s, 'rgba(255,120,150,0.55)'); ctx.strokeStyle = '#1b1f27'; ctx.lineWidth = 6 * s; ctx.beginPath(); ctx.arc(x, yy - 200 * s, 22 * s, 0.2, Math.PI - 0.2); ctx.stroke(); } else { ellipse(x, yy - 195 * s, 16 * s, 24 * s, '#1b1f27'); }
}
function calendarMonster(x, y, s, t) { legs(x, y, s); fillRR(x - 160 * s, y - 440 * s, 320 * s, 400 * s, 20 * s, '#fff'); fillRR(x - 160 * s, y - 440 * s, 320 * s, 90 * s, 20 * s, '#e0392d'); angryEyes(x, y - 395 * s, s); fillRR(x - 140 * s, y - 320 * s, 280 * s, 90 * s, 12 * s, '#4f46e5'); text('10:00 PRIYA', x, y - 275 * s, 34 * s, 800, '#fff', 'center', 0); fillRR(x - 120 * s, y - 250 * s, 280 * s, 90 * s, 12 * s, '#f2b441'); text('10:00 MARCUS', x + 20 * s, y - 205 * s, 34 * s, 800, '#3a2a1a', 'center', 0); }
function phoneMonster(x, y, s, t) { legs(x, y, s); fillRR(x - 130 * s, y - 520 * s, 260 * s, 480 * s, 36 * s, '#14161c'); fillRR(x - 112 * s, y - 500 * s, 224 * s, 440 * s, 24 * s, '#2a2f4a'); angryEyes(x, y - 340 * s, 1.3 * s); line(x - 50 * s, y - 230 * s, x + 50 * s, y - 250 * s, '#1b1f27', 10 * s); for (let i = 0; i < 3; i++) { const k = (t * 1.3 + i / 3) % 1; withFade(1 - k, () => { fillRR(x - 330 * s - k * 100, y - 480 * s + i * 110 * s, 150 * s, 62 * s, 31 * s, '#fff'); text('u open?', x - 255 * s - k * 100, y - 449 * s + i * 110 * s, 30 * s, 800, '#1b1f27', 'center', 0); }); } }
function invoiceMonster(x, y, s, t) { legs(x, y, s); ctx.save(); ctx.translate(x, y - 240 * s); ctx.rotate(sine(t, 4, 0.03)); fillRR(-150 * s, -200 * s, 300 * s, 400 * s, 10 * s, '#fffdf2'); for (let i = 0; i < 5; i++) fillRR(-110 * s, -20 * s + i * 34 * s, 220 * s - (i % 2) * 70 * s, 12 * s, 4, '#d8d2b8'); text('INVOICE', 0, -150 * s, 40 * s, 800, '#3a3226', 'center', 0.1); ctx.restore(); angryEyes(x, y - 400 * s, s); ctx.save(); ctx.translate(x + 30 * s, y - 220 * s); ctx.rotate(-0.25); strokeRR(-110 * s, -40 * s, 220 * s, 80 * s, 10 * s, '#d9462d', 8 * s); text('30 DAYS LATE', 0, 3 * s, 30 * s, 800, '#d9462d', 'center', 0.02); ctx.restore(); }
function rushMonster(x, y, s, t) { legs(x, y, s); fillRR(x - 150 * s, y - 440 * s, 300 * s, 400 * s, 50 * s, '#2f8a54'); for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; circle(x + Math.cos(a + t) * 190 * s, y - 250 * s + Math.sin(a + t) * 190 * s, 22 * s, '#fff'); } angryEyes(x, y - 340 * s, 1.2 * s); text('HOLIDAY', x, y - 220 * s, 46 * s, 800, '#fff', 'center', 0.1); text('RUSH', x, y - 168 * s, 60 * s, 800, '#ffd23f', 'center', 0.05); }
const VILLAINS = [['THE NO-SHOW', ghost, 1.0], ['THE DOUBLE BOOKING', calendarMonster, 1.0], ['THE 11 PM "u open?"', phoneMonster, 1.0], ['THE UNPAID INVOICE', invoiceMonster, 1.0], ['THE NO-SHOW (AGAIN)', ghost, 1.0]];
function fight(t, i) {
  const st = ST[i], f = T.f[i]; const zoom = 1 + 0.07 * (1 - seg(t, f, f + 0.35)) * (t >= f ? 1 : 0);
  ctx.save(); ctx.translate(CX, 1000); ctx.scale(zoom, zoom); ctx.translate(-CX, -1000); ctx.translate(shake(t, f, 14, 0.35), 0);
  ctx.fillStyle = vgrad(0, H, i === 4 ? '#3a2a6a' : '#7a1f2a', '#1b1220'); ctx.fillRect(-60, -60, W + 120, H + 120); for (let r = 0; r < 18; r++) { const a = (r / 18) * Math.PI * 2 + t * 0.15; ctx.fillStyle = 'rgba(255,255,255,0.05)'; ctx.beginPath(); ctx.moveTo(CX, 960); ctx.arc(CX, 960, 1500, a, a + 0.12); ctx.fill(); }
  ctx.fillStyle = 'rgba(0,0,0,0.28)'; ctx.fillRect(-60, 1640, W + 120, 400);
  const k = ease.out(seg(t, st, st + 0.35)), [name, drawV] = VILLAINS[i], vx = lerp(1400, 790, k), solid = i === 4 && t > f + 0.9;
  mirror(CX, () => {}); if (i === 4 || i === 0) drawV(vx, 1640, 1.5, t, { solid }); else drawV(vx, 1640, 1.4, t);
  const fl = i === 4 && t > f + 0.5 ? 1 : 0; buddy(280, 1700, 760, 9, { eyes: undefined, shirt: '#8ea2b8', apron: true }); tiredEyes(280, 1700, 760, SKIN[Math.floor(hash(9) * SKIN.length)], 0.55);
  ctx.restore();
  const b = appear(t, st + 0.12, 0.3); if (b > 0) xf(CX, 300, b, 0, () => banner(name, CX, 300, 56, 'rgba(10,12,24,0.78)', '#fff'));
  const sp = appear(t, f - 0.05, 0.25); if (sp > 0 && t < (ST[i + 1] ?? 999)) xf(300, 760, sp, 0, () => speech(300, 620, ['What\'s up, brah.'], { size: 54, tail: [300, 960] }));
  if (i === 4) { cameo(t, f + 0.45, f + 3.2, 760, 720, 520, 190, () => { fillRR(26, 28, 56, 56, 28, LGREEN); check(54, 57, 22, '#fff', 5); ltext('Reminder sent', 100, 52, 30, 800); ltext('Sat 10:00 am · tomorrow', 100, 94, 22, 500, LMUTED); ltext('Confirmed ✓', 26, 150, 28, 800, LGREEN); }, 0.03);
    const h = appear(t, f + 1.4, 0.3); if (h > 0) xf(800, 1100, h, 0, () => speech(800, 960, ['...hi.'], { size: 60, tail: [800, 1290] })); }
}
function intro(t) {
  ctx.fillStyle = vgrad(0, H, '#7a1f2a', '#1b1220'); ctx.fillRect(0, 0, W, H); ctx.fillStyle = 'rgba(0,0,0,0.28)'; ctx.fillRect(0, 1640, W, 400);
  buddy(280, 1700, 760, 9, { shirt: '#8ea2b8' }); tiredEyes(280, 1700, 760, SKIN[Math.floor(hash(9) * SKIN.length)], 0.55);
  VILLAINS.slice(0, 4).forEach(([n, d], i) => { const e = appear(t, 0.6 + i * 0.35, 0.35); if (e > 0) { ctx.save(); ctx.globalAlpha = 0.9; xf(760 + (i % 2) * 120, 1640, e, 0, () => d(560 + i * 130, 1640 - (i % 2) * 40, 0.5, t, {})); ctx.restore(); } });
  const a = appear(t, 0.1, 0.35); xf(CX, 400, a, 0, () => { text('ME VS.', CX, 330, 130, 800, '#fff', 'center', -0.02); text('THE THINGS THAT RUIN MY WEEK', CX, 450, 44, 800, '#ffb3b3', 'center', 0.04); });
}
function endCard(t) { ctx.fillStyle = vgrad(0, H, '#3a2a6a', '#1b1220'); ctx.fillRect(0, 0, W, H); buddy(300, 1700, 700, 9, { shirt: '#8ea2b8', flex: 0, smile: true }); ghost(780, 1640, 1.0, t, { solid: true }); const a = appear(t, T.end, 0.4); xf(CX, 520, a, 0, () => { text('TAG THEM', CX, 460, 150, 800, '#fff', 'center', -0.02); text('they know why', CX, 570, 48, 800, '#c9b6ff', 'center', 0.02); }); }
const SCENES = [[0, ST[0], intro], [ST[0], ST[1], (t) => fight(t, 0)], [ST[1], ST[2], (t) => fight(t, 1)], [ST[2], ST[3], (t) => fight(t, 2)], [ST[3], ST[4], (t) => fight(t, 3)], [ST[4], T.end, (t) => fight(t, 4)], [T.end, 999, endCard]];
cue(0.2, 'punch', 0.8); ST.forEach((s, i) => { cue(s + 0.1, 'swish', 0.7); cue(T.f[i], 'punch', 1); cue(T.f[i] + 0.05, 'transition', 0.5); }); cue(T.f[4] + 0.45, 'notification', 1); cue(T.f[4] + 1.4, 'ding', 0.8); cue(T.end, 'ding', 1);
boot({ duration: DURATION, scenes: SCENES, brandAt: 999, hideCaption: (t) => t >= T.end - 0.1 }, 'brah');
