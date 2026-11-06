// MsgHealth · "It's time" · trend-based follower-growth video (1080 × 1920, 30 fps), built on kit.js + story-kit.js + trend-kit.js.
// Trend (researched Nov 6, 2026): the annual "It's time" holiday-season kickoff meme (the 2026 video dropped Nov 1-2) is peaking now and
// runs through December. This is NOT a product ad: it is relatable small-business content in the "defrost, it's time" format (original
// artwork and voice, no one's likeness or audio), a small watermark and a "follow" call to action. Voiceover: assets/audio/itstime.
'use strict';
const word = (l, k) => VO_AT[l] + VO_CLIPS[l].chunks[k][1];
const T = { l0: VO_AT[0], time: word(0, 1), l1: VO_AT[1], defrost: word(1, 1), l2: VO_AT[2], gift: word(2, 0) + 0.7, sat: word(2, 1), l3: VO_AT[3], need: word(3, 1), follow: VO_AT[4] };
const DURATION = +(VO_AT[4] + VO_CLIPS[4].dur + 1.2).toFixed(2);
window.CUES = T; window.SFX = []; const cue = (t, kind, gain) => window.SFX.push({ t, kind, gain });
window.MUSIC = { bpm: 112, root: 55, brandAt: 999, mood: 'bouncy' };
function snow(t, a = 0.8) { for (let i = 0; i < 70; i++) { const x = (hash(i) * 1200 + sine(t + i, 1.2, 30)) % 1100, y = ((hash(i + 7) * 2100 + t * (90 + hash(i + 3) * 120)) % 2000) - 40; circle(x, y, 3 + hash(i + 2) * 6, `rgba(255,255,255,${a})`); } }
function icy() { ctx.fillStyle = vgrad(0, H, '#a8d8ff', '#e8f6ff'); ctx.fillRect(0, 0, W, H); ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.fillRect(0, 1350, W, 570); }
function sceneFrozen(t) {
  icy(); snow(t); const lt = t - T.l0, melt = seg(t, T.l0 + 0.3, T.time), brk = t >= T.time;
  if (!brk) { buddy(CX, 1650, 760, 77, { eyes: undefined, shirt: '#8ea2b8', noShadow: false }); const bx = 250, by = 860, bw = 580, bh = 840;
    fillRR(bx, by, bw, bh, 40, 'rgba(160,215,255,0.55)'); strokeRR(bx, by, bw, bh, 40, 'rgba(255,255,255,0.9)', 8); fillRR(bx + 24, by + 24, 36, bh * 0.5, 18, 'rgba(255,255,255,0.45)');
    ctx.strokeStyle = 'rgba(255,255,255,0.95)'; ctx.lineWidth = 5; for (let i = 0; i < 6; i++) { const k = clamp(melt * 1.4 - i * 0.12); if (k > 0) { ctx.beginPath(); let x = bx + 80 + i * 90, y = by + 120 + (i % 2) * 260; ctx.moveTo(x, y); for (let j = 1; j <= 4; j++) { x += (hash(i * 5 + j) - 0.4) * 70; y += 70 * k; ctx.lineTo(x, y); } ctx.stroke(); } } }
  else { const k = t - T.time; for (let i = 0; i < 46; i++) { const a = hash(i) * Math.PI * 2, v = 380 + hash(i + 4) * 700, x = CX + Math.cos(a) * v * k, y = 1250 + Math.sin(a) * v * k * 0.8 + 900 * k * k, r = 18 + hash(i + 9) * 30; ctx.save(); ctx.translate(x, y); ctx.rotate(a + k * 6); poly([[-r, r * 0.6], [r, r * 0.4], [0, -r]], `rgba(190,230,255,${clamp(1 - k * 0.7)})`); ctx.restore(); }
    buddy(CX, 1650, 760, 77, { flex: ease.out(seg(t, T.time, T.time + 0.4)), smile: true, eyes: 'wide', shirt: '#8ea2b8' }); glow(CX, 1250, 700, '#ffffff', 0.5 * (1 - seg(t, T.time, T.time + 0.4))); }
  withFade(seg(t, 0.15, 0.5), () => text('SMALL BUSINESS', CX, 330, 100, 800, '#1b3a5a', 'center', -0.02)); const b = appear(t, T.time, 0.35); if (b > 0) xf(CX, 560, b, 0, () => text('IT\'S TIME.', CX, 520, 190, 800, '#fff', 'center', -0.03)); ctx.save(); ctx.globalAlpha = 0.0; ctx.restore(); watermark();
}
function sceneCalendar(t) {
  icy(); const p = ease.inOut(seg(t, T.l1 + 0.1, T.l1 + 1.4)); fillRR(80, 330, 920, 1060, 36, '#fff'); fillRR(80, 330, 920, 150, 36, '#e0392d'); text('NOVEMBER', CX, 405, 80, 800, '#fff', 'center', 0.12);
  const cols = ['#4f46e5', '#e0392d', '#f2b441', '#3dbb74', '#d9468a']; for (let r = 0; r < 5; r++) for (let c = 0; c < 6; c++) { const i = r * 6 + c, x = 120 + c * 143, y = 520 + r * 168; fillRR(x, y, 130, 150, 14, '#f1ece0'); const e = ease.out(seg(t, T.l1 + 0.5 + i * 0.04, T.l1 + 0.7 + i * 0.04)); if (e > 0 && hash(i + 3) > 0.25) { fillRR(x + 8, y + 10, 114, 56 * e, 10, cols[i % 5]); if (hash(i + 8) > 0.5) fillRR(x + 8, y + 76, 114, 56 * e, 10, cols[(i + 2) % 5]); } }
  ctx.save(); ctx.beginPath(); ctx.rect(80, 330, 920, 1060); ctx.clip(); ctx.fillStyle = 'rgba(170,220,255,0.82)'; const edge = 330 + 1060 * p; ctx.fillRect(80, edge, 920, 1400 - edge + 330); for (let i = 0; i < 9; i++) { const x = 110 + i * 100, dl = 60 + hash(i) * 120; fillRR(x, edge - dl * (1 - p) * 0.0, 40, dl + 10, 20, 'rgba(170,220,255,0.82)'); } ctx.restore(); snow(t, 0.5 * (1 - p));
  const b = appear(t, T.defrost, 0.35); if (b > 0) xf(CX, 1500, b, 0, () => banner('CALENDAR: DEFROSTING', CX, 270, 60, '#1b3a5a')); watermark();
}
function sceneFlood(t) {
  ctx.fillStyle = vgrad(0, H, '#ff9e7a', '#ffd6a5'); ctx.fillRect(0, 0, W, H); const lt = t - T.l2, n = Math.min(99, Math.floor(lt * 28));
  buddy(CX, 1650, 760, 21, { eyes: 'wide', mouth: 'open', shirt: '#6c8ebf' }); fillRR(430, 1010, 220, 120, 16, '#14161c'); fillRR(440, 1020, 200, 100, 10, '#a5a0ff'); circle(640, 1010, 52 + sine(t, 12, 3), '#e0392d'); text(n >= 99 ? '99+' : String(n), 640, 1012, n >= 99 ? 42 : 52, 800, '#fff', 'center');
  [['Saturday?', 0.2, 250, 620], ['Gift card?', 0.9, 780, 780], ['2pm free?', 1.4, 270, 960], ['Holiday hours?', 2.0, 700, 1120], ['Saturday??', 2.3, 250, 1240], ['Hello???', 2.8, 780, 560]].forEach(([s, d, x, y], i) => { const e = appear(t, T.l2 + d, 0.28); if (e > 0) xf(x, y, e, 0, () => speech(x, y - 60, [s], { size: 46 })); });

  const a = appear(t, T.l2 + 0.1, 0.3), g = appear(t, T.gift, 0.3), s = appear(t, T.sat, 0.3); xf(CX, 300, 1, 0, () => { if (s > 0) banner('SATURDAY', CX, 300, 90, '#b3261e'); else if (g > 0) banner('GIFT CARDS', CX, 300, 90, '#2f8a54'); else if (a > 0) banner('HOLIDAY BOOKINGS', CX, 300, 76, '#4f46e5'); }); watermark();
}
function sceneHydrate(t) {
  ctx.fillStyle = vgrad(0, H, '#8fd6f2', '#e6f6f2'); ctx.fillRect(0, 0, W, H); const lt = t - T.l3, k = ease.inOut(seg(t, T.l3 + 0.3, T.need + 0.6));
  const p = buddy(CX - 80, 1700, 800, 21, { flex: 0, shirt: '#6c8ebf', noShadow: false }); tiredEyes(CX - 80, 1700, 800, p.skin, 0.9); ctx.save(); ctx.translate(CX + 140, 1230 - k * 40); ctx.rotate(-0.5 * k); fillRR(-50, -190, 100, 260, 26, 'rgba(255,255,255,0.7)'); fillRR(-50, -190 + 260 * (1 - (0.9 - 0.7 * k)), 100, 260 * (0.9 - 0.7 * k), 22, '#4aa3df'); fillRR(-26, -240, 52, 60, 10, '#2a6bd9'); ctx.restore();
  const m = ease.out(seg(t, T.l3 + 0.2, T.need)); fillRR(60, 1380, 24, 0, 0, '#fff'); fillRR(900, 500, 80, 700, 40, 'rgba(255,255,255,0.45)'); fillRR(900, 1200 - 700 * m, 80, 700 * m, 40, '#4aa3df'); text('WATER', 940, 450, 28, 800, '#1b3a5a', 'center', 0.2);
  const b = appear(t, T.l3, 0.35); if (b > 0) xf(CX, 300, b, 0, () => banner('HYDRATE.', CX, 300, 120, '#1b3a5a')); watermark();
}
function sceneFollow(t) { icy(); snow(t); const a = appear(t, T.follow, 0.4); xf(CX, 700, a, 0, () => { text('FOLLOW', CX, 640, 230, 800, '#1b3a5a', 'center', -0.03); text('for survival tips', CX, 790, 60, 800, '#3a6a9a', 'center', -0.01); }); const e = appear(t, T.follow + 0.15, 0.4); if (e > 0) xf(CX, 1650, e, 0, () => { const p = buddy(CX, 1700, 600, 21, { flex: 1, smile: true, shirt: '#6c8ebf' }); heartShape(p.bx, p.by, 90, '#ff3b64'); }); watermark(1); }
const SCENES = [[0, T.l1, sceneFrozen], [T.l1, T.l2, sceneCalendar], [T.l2, T.l3, sceneFlood], [T.l3, T.follow, sceneHydrate], [T.follow, 999, sceneFollow]];
cue(0.2, 'swish', 0.6); cue(T.time, 'punch', 1.1); cue(T.time + 0.05, 'transition', 0.8); cue(T.l1, 'swish', 0.7); for (let i = 0; i < 10; i++) cue(T.defrost + 0.1 + i * 0.15, 'key', 0.35); for (let i = 0; i < 8; i++) cue(T.l2 + 0.2 + i * 0.35, 'notification', 0.5); cue(T.l3, 'swish', 0.7); cue(T.need, 'punch', 0.8); cue(T.follow, 'ding', 1);
boot({ duration: DURATION, scenes: SCENES, brandAt: 999, hideCaption: (t) => t >= T.follow - 0.05 }, 'itstime');
