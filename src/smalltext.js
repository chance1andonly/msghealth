// MsgHealth · "Small text" · trend-based follower-growth video (1080 × 1920, 30 fps), built on kit.js + story-kit.js + trend-kit.js.
// Trend (researched Nov 6, 2026): "small text zoom" appears in Later's Oct 30, 2026 Reels roundup: small on-screen text carrying a big
// emotional message (the sources describe it loosely, so this is an interpretation). This is NOT a product ad: a quiet, relatable moment
// for small-business owners, a small watermark and a "follow" call to action. The usual big captions are off; the text is the content.
// Voiceover is soft and slow. Voiceover: assets/audio/smalltext.
'use strict';
const T = { l0: VO_AT[0], l1: VO_AT[1], l2: VO_AT[2], l3: VO_AT[3] };
const DURATION = +(VO_AT[3] + VO_CLIPS[3].dur + 1.6).toFixed(2);
window.CUES = T; window.SFX = []; const cue = (t, kind, gain) => window.SFX.push({ t, kind, gain });
window.MUSIC = { bpm: 72, root: 50, brandAt: 999, mood: 'sneaky' };
const plain = (s) => s.replace(/\*/g, '');
function scene(t) {
  const z = 1 + 0.12 * (t / DURATION); ctx.save(); ctx.translate(CX, 1000); ctx.scale(z, z); ctx.translate(-CX, -1000);
  ctx.fillStyle = vgrad(0, H, '#14182e', '#241a30'); ctx.fillRect(-80, -80, W + 160, H + 160); ctx.fillStyle = '#2a2236'; ctx.fillRect(-80, 1280, W + 160, 700); ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fillRect(-80, 1280, W + 160, 24);
  for (let i = 0; i < 14; i++) { const x = hash(i) * 1100, y = 300 + hash(i + 5) * 900, r = 40 + hash(i + 2) * 90; glow(x, y, r * 2, i % 2 ? '#ffb86a' : '#ff8aa8', 0.10); }
  fillRR(90, 300, 330, 480, 12, '#0e1a30'); strokeRR(90, 300, 330, 480, 12, '#3a3f58', 10); fillRR(150, 520, 210, 90, 14, '#2a0f1a'); text('CLOSED', 255, 566, 46, 800, '#ff6f8a', 'center', 0.12); glow(255, 566, 190, '#ff3b64', 0.3 + 0.1 * Math.sin(t * 3));
  glow(820, 560, 420, '#ffcf8a', 0.28); fillRR(790, 560, 60, 520, 8, '#3a2f46'); poly([[740, 560], [900, 560], [860, 450], [780, 450]], '#e8b86a');
  const p = buddy(CX + 60, 1660, 780, 9, { shirt: '#8ea2b8', noShadow: false }); tiredEyes(CX + 60, 1660, 780, p.skin, 0.7);
  fillRR(0, 1290, W, 700, 0, '#3a2f46'); fillRR(0, 1290, W, 26, 0, '#5a4a66'); fillRR(620, 1272, 150, 20, 5, '#14161c'); // phone lying face down on the counter
  for (let i = 0; i < 30; i++) { const x = (hash(i) * 1200 + t * 8 * (1 + hash(i + 3))) % 1100, y = 200 + hash(i + 9) * 1100 + sine(t + i, 0.8, 18); circle(x, y, 1.5 + hash(i + 4) * 2.5, 'rgba(255,230,190,0.5)'); }
  ctx.restore();
}
function words(t) {
  const lines = [[T.l0, T.l1], [T.l1, T.l2], [T.l2, T.l3], [T.l3, 999]];
  lines.forEach(([a, b], i) => { const e = enter(t, a, b, 0.55) ; if (e <= 0) return; const rows = VO_CLIPS[i].chunks.map(([s]) => plain(s)); withFade(e, () => { const y0 = 1440 - (rows.length - 1) * 26; rows.forEach((r, k) => text(r, CX, y0 + k * 52, 36, 600, 'rgba(255,255,255,0.92)', 'center', 0.02)); }); });
  withFade(seg(t, T.l3 + 0.6, T.l3 + 1.2), () => heartShape(CX, 1560, 40, '#ff6f8a'));
}
const SCENES = [[0, 999, (t) => { scene(t); words(t); watermark(0.7); }]];
cue(T.l0, 'tap', 0.4); cue(T.l1, 'tap', 0.4); cue(T.l2, 'tap', 0.4); cue(T.l3, 'ding', 0.6);
boot({ duration: DURATION, scenes: SCENES, brandAt: 999, hideCaption: () => true }, 'smalltext');
