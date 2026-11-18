// MsgHealth · "Five times" · retention explainer reel (1080 × 1920, 30 fps), built on kit.js + mg.js. Motion graphics only.
// Angle: a new client costs about 5x more than keeping one (Booksy); lapsed regulars are the cheapest chairs to fill. Fix: text the 90-days-out list.
'use strict'; window.CHAT_WHO = 'Dre';
const END = VO_AT[5] - 0.1, DURATION = +Math.max(END + 2.4, lineEnd(5) + 1.1).toFixed(2);
window.CUES = { end: END }; window.SFX = []; const cue = (t, kind, gain) => window.SFX.push({ t, kind, gain });
window.MUSIC = { bpm: 98, root: 43, brandAt: END, mood: 'sneaky' };
function s0(t) {
  stage(t, 0.18); eyebrow('WHAT A CLIENT COSTS', 330, IN.mid);
  const A = pop(t, 0.3, 0.35), B = pop(t, wordAt(0, 1) - 0.8, 0.35);
  xf(300, 900, clamp(B), 0, () => { text('OLD', 300, 430, 30, 800, OK, 'center', 0.1); fillRR(220, 1000, 160, 120, 14, OK); text('1x', 300, 1160, 50, 800, '#fff', 'center'); });
  xf(780, 900, clamp(A), 0, () => { text('NEW', 780, 430, 30, 800, RED, 'center', 0.1); for (let i = 0; i < 5; i++) { const e = ease.back(seg(t, 0.5 + i * 0.12, 0.8 + i * 0.12)); fillRR(700, 1000 - i * 124 * clamp(e), 160, 120 * clamp(e), 14, rgba('#ff6f8a', 0.9)); } text('5x', 780, 1160, 50, 800, '#fff', 'center'); });
}
function s1(t) {
  const a = VO_AT[1]; stage(t, 0.16); eyebrow('YOUR PHONE RIGHT NOW', 330, IN.mid);
  for (let i = 0; i < 40; i++) { const e = pop(t, a + 0.9 + i * 0.015, 0.25); if (e > 0) { const x = 150 + (i % 8) * 110, y = 560 + Math.floor(i / 8) * 130; dotPerson(x, y, 90 * clamp(e), i % 7 === 3 ? '#a5a0ff' : '#5f5a9a', 1); } }
  withFade(seg(t, a + 0.1, a + 0.4) * (1 - seg(t, a + 0.8, a + 1.0)), () => { text('posts · promos · cards', CX, 900, 52, 800, MUTED, 'center'); });
  withFade(seg(t, a + 2.0, a + 2.4), () => { headline('40 regulars', 1330, 1, 110, '#fff'); text('one text away', CX, 1420, 40, 700, IN.mid, 'center'); });
}
function s2(t) {
  const a = VO_AT[2]; stage(t, 0.14); eyebrow('SORTED BY LAST VISIT', 330, IN.mid);
  const rows = [['Dre', 94], ['Jamal', 101], ['Tay', 88], ['Chris', 120]];
  rows.forEach(([n, d], i) => { const e = pop(t, a + 0.2 + i * 0.25, 0.35); if (e <= 0) return; xf(CX, 560 + i * 170, clamp(e), 0, () => { card(110, 490 + i * 170, 860, 140, { r: 30 }); avatar(190, 560 + i * 170, 40, n[0], i % 2 ? '#e5803b' : C.primary); text(n, 260, 548 + i * 170, 38, 800, '#fff'); text('last cut', 260, 594 + i * 170, 24, 500, SOFT); tag(920, 560 + i * 170, d + ' DAYS', AMBER, false, 24); }); });
  withFade(seg(t, a + 2.6, a + 3.0), () => text('Cheapest chairs to fill.', CX, 1290, 54, 800, OK, 'center', -0.02));
}
function s3(t) {
  const a = VO_AT[3]; stage(t, 0.14);
  phoneChat(t, a - 0.1, VO_AT[4] + 0.2, () => {
    msg(60, 170, 520, ['Been a minute, Dre.', 'Got Thursday at six', 'if you want it.'], true, 1, seg(t, a + 0.15, a + 2.4));
    msg(40, 410, 520, ["Say less. I'll be there."], false, seg(t, a + 3.0, a + 3.2), 1);
  });
}
function s4(t) {
  const a = VO_AT[4]; stage(t, 0.2); eyebrow('THURSDAY 6:00', 400, IN.mid);
  const e = pop(t, a + 0.1, 0.35); xf(CX, 700, clamp(e), 0, () => { card(180, 540, 720, 320, { stroke: 'rgba(111,227,160,0.55)' }); text('Thursday', CX, 620, 34, 700, SOFT, 'center'); text('6:00 PM', CX, 720, 84, 800, '#fff', 'center', -0.03); chip('FILLED', CX, 810, OK, 1, 26); });
  withFade(seg(t, a + 0.7, a + 1.1), () => { text('$0', CX, 1090, 170, 800, '#fff', 'center', -0.04); text('ad spend', CX, 1180, 44, 700, IN.mid, 'center'); });
}
const SC = [[0, VO_AT[1], s0], [VO_AT[1], VO_AT[2], s1], [VO_AT[2], VO_AT[3], s2], [VO_AT[3], VO_AT[4], s3], [VO_AT[4], END, s4], [END, 999, (t) => finale(t, END)]];
cue(VO_AT[3] + 0.3, 'notification', 0.3); cue(VO_AT[3] + 3.0, 'ding', 0.3); cue(END + 1.25, 'tap', 0.3);
boot({ duration: DURATION, scenes: SC, brandAt: END, hideCaption: (t) => t >= END + 0.6 }, 'fivex');
