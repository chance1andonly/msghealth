// MsgHealth · "Bicep heart" · trend-based follower-growth video (1080 × 1920, 30 fps), built on kit.js + story-kit.js + trend-kit.js.
// Trend (researched Nov 6, 2026): the Bicep Heart flex took off in late October 2026 on TikTok and Reels (one report: ~71,000 TikTok
// videos in its first week); it works on any body type. This is NOT a product ad: it is relatable small-business content in that format
// ("bicep heart for customers who..."), a small watermark, and a "follow" call to action. The pose is approximated with a heart on the bicep.
// The trending sound is not included (licensed): add it at upload in Instagram, with the voiceover mixed low. Voiceover: assets/audio/bicep.
'use strict';
const word = (l, k) => VO_AT[l] + VO_CLIPS[l].chunks[k][1];
const T = { l0: VO_AT[0], f0: VO_AT[0] + 0.55, l1: VO_AT[1], f1: VO_AT[1] + 0.35, l2: VO_AT[2], f2: VO_AT[2] + 0.35, l3: VO_AT[3], f3: word(3, 0) + 0.5, follow: VO_AT[4] };
const DURATION = +(VO_AT[4] + VO_CLIPS[4].dur + 1.2).toFixed(2);
window.CUES = T; window.SFX = []; const cue = (t, kind, gain) => window.SFX.push({ t, kind, gain });
window.MUSIC = { bpm: 120, root: 53, brandAt: 999, mood: 'bouncy' };
const GIVEN = [T.f0, T.f1, T.f2, T.f3];
function counter(t) { const n = GIVEN.filter((g) => t >= g).length; fillRR(250, 200, 580, 84, 42, 'rgba(10,12,24,0.55)'); text('BICEP HEARTS GIVEN', 300, 242, 24, 800, 'rgba(255,255,255,0.8)', 'left', 0.1); text(String(n), 780, 244, 54, 800, '#ffb3c7', 'right', -0.02); }
function vignette(t, i, c0, c1, label, prop, o = {}) {
  const at = GIVEN[i], k = ease.out(seg(t, at - 0.2, at + 0.2)), pk = ease.back(seg(t, at, at + 0.4)), start = [T.l0, T.l1, T.l2, T.l3][i];
  ctx.fillStyle = vgrad(0, H, c0, c1); ctx.fillRect(0, 0, W, H); for (let r = 0; r < 14; r++) { const a = (r / 14) * Math.PI * 2; ctx.fillStyle = 'rgba(255,255,255,0.06)'; ctx.beginPath(); ctx.moveTo(CX, 1000); ctx.arc(CX, 1000, 1500, a, a + 0.22); ctx.fill(); }
  ctx.fillStyle = 'rgba(0,0,0,0.08)'; ctx.fillRect(0, 1300, W, 620);
  const sh = shake(t, at, 10, 0.3); ctx.save(); ctx.translate(sh, 0);
  const pose = buddy(CX - 20, 1700, 800, 40 + i * 7, { flex: k, smile: k > 0.5, eyes: 'wide', shirt: o.shirt, skin: o.skin, mouth: k > 0.5 ? undefined : 'open' }); if (o.tired) tiredEyes(CX - 20, 1700, 800, pose.skin, 0.9);
  if (pk > 0) { const hs = 125 * clamp(pk) * (1 + 0.06 * Math.sin(t * 8)); glow(pose.bx, pose.by, 300, '#ff5a7a', 0.45 * clamp(pk)); heartShape(pose.bx, pose.by, hs, '#ff3b64'); heartShape(pose.bx - hs * 0.2, pose.by - hs * 0.22, hs * 0.2, '#ffd1dc'); }
  ctx.restore(); sparkles(pose.bx, pose.by, t, at, 10, 200); prop(t, start, at);
  const b = appear(t, start + 0.05, 0.3); if (b > 0) xf(CX, 410, b, 0, () => banner(label, CX, 400, 54, 'rgba(10,12,24,0.7)', '#fff')); counter(t); watermark();
}
const bubbleAt = (t, at, x, y, lines, tail) => { const e = appear(t, at, 0.3); if (e > 0) xf(x, y, e, 0, () => speech(x, y - 80, lines, { size: 46, tail })); };
function sceneLate(t) { vignette(t, 0, '#ff9ec2', '#ffd6a5', 'WHO TEXT WHEN LATE', (t, s) => bubbleAt(t, s + 1.4, 300, 780, ['Running 5 min', 'late, sorry!'], [450, 1010])); }
function sceneReview(t) { vignette(t, 1, '#a5d8ff', '#d0bfff', 'WHO REVIEW UNPROMPTED', (t, s) => { for (let i = 0; i < 5; i++) { const e = appear(t, s + 0.2 + i * 0.12, 0.3); if (e > 0) xf(190 + i * 175, 640, e, 0, () => star(190 + i * 175, 640 + sine(t + i, 3, 8), 62, '#ffd23f')); } }, { shirt: '#6c8ebf' }); }
function sceneRebook(t) { vignette(t, 2, '#b2f2bb', '#ffec99', 'WHO REBOOK ON THE WAY OUT', (t, s) => { const e = appear(t, s + 0.4, 0.35); if (e > 0) xf(240, 740, e, 0, () => { fillRR(70, 560, 340, 340, 24, '#fff'); fillRR(70, 560, 340, 80, 24, '#e0392d'); text('NEXT', 240, 600, 40, 800, '#fff', 'center', 0.2); for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) fillRR(94 + c * 78, 668 + r * 72, 62, 56, 8, r === 1 && c === 2 ? '#3dbb74' : '#efeadc'); check(94 + 2 * 78 + 31, 668 + 72 + 30, 26, '#fff', 6); }); }, { shirt: '#e08a6d' }); }
function sceneYou(t) { vignette(t, 3, '#2a2f4a', '#4a3a6a', 'AND YOU', (t, s) => { const e = appear(t, s + 0.1, 0.35); if (e > 0) xf(CX, 640, e, 0, () => { fillRR(330, 540, 420, 130, 24, '#0c0f1a'); text('11:07 PM', CX, 603, 78, 800, '#ff8a7f', 'center', 0.02); }); const m = appear(t, s + 1.2, 0.3); if (m > 0) xf(220, 800, m, 0, () => speech(250, 720, ['Still on', 'my phone...'], { size: 42, tail: [430, 1000] })); }, { tired: true, shirt: '#8ea2b8' }); }
function sceneFollow(t) {
  ctx.fillStyle = vgrad(0, H, '#ffb3c7', '#ffd8a8'); ctx.fillRect(0, 0, W, H); ctx.fillStyle = 'rgba(0,0,0,0.07)'; ctx.fillRect(0, 1450, W, 470);
  [[170, 41, '#e08a6d'], [400, 48, '#6c8ebf'], [650, 55, '#e08a6d'], [880, 62, '#8ea2b8']].forEach(([x, s, c], i) => { const e = appear(t, T.follow + i * 0.1, 0.35); if (e > 0) xf(x, 1700, e, 0, () => { const p = buddy(x, 1700, 460, s, { flex: 1, smile: true, shirt: c }); heartShape(p.bx, p.by, 70, '#ff3b64'); }); });
  const a = appear(t, T.follow, 0.4); xf(CX, 600, a, 0, () => { text('FOLLOW', CX, 560, 220, 800, '#fff', 'center', -0.03); text('for more small business chaos', CX, 700, 54, 800, 'rgba(60,20,40,0.85)', 'center', -0.01); }); watermark(1);
}
const SCENES = [[0, T.l1, sceneLate], [T.l1, T.l2, sceneReview], [T.l2, T.l3, sceneRebook], [T.l3, T.follow, sceneYou], [T.follow, 999, sceneFollow]];
GIVEN.forEach((g) => { cue(g, 'punch', 0.9); cue(g + 0.05, 'ding', 0.9); }); cue(0.2, 'swish', 0.7); cue(T.l1, 'swish', 0.7); cue(T.l2, 'swish', 0.7); cue(T.l3, 'swish', 0.7); cue(T.follow, 'ding', 1); cue(T.follow + 0.2, 'tap', 0.7);
boot({ duration: DURATION, scenes: SCENES, brandAt: 999, hideCaption: (t) => t >= T.follow - 0.05 }, 'bicep');
