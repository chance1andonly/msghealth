// MsgHealth · "See you next time" · retention explainer reel (1080 × 1920, 30 fps), built on kit.js + mg.js. Motion graphics only.
// Angle: about half of clients book one cut and never return (Squire); nobody asks for the next date. Fix: ask Saturday-or-Sunday in the chair, then text the confirmation.
'use strict'; window.CHAT_WHO = 'Dre';
const END = VO_AT[5] - 0.1, DURATION = +Math.max(END + 2.4, lineEnd(5) + 1.1).toFixed(2);
window.CUES = { end: END }; window.SFX = []; const cue = (t, kind, gain) => window.SFX.push({ t, kind, gain });
window.MUSIC = { bpm: 94, root: 45, brandAt: END, mood: 'sneaky' };
function s0(t) {
  stage(t, 0.18); eyebrow('HOW EVERY CUT ENDS', 330, IN.mid);
  const e = pop(t, 0.3, 0.4); xf(CX, 700, clamp(e), 0, () => { card(110, 580, 860, 240, { r: 40 }); text('“See you next time.”', CX, 700, 62, 800, '#fff', 'center', -0.03); });
  const s = seg(t, wordAt(0, 1) - 0.5, wordAt(0, 1) - 0.1); if (s > 0) line(190, 700, lerp(190, 890, s), 700, RED, 8);
  const k = pop(t, wordAt(0, 1), 0.35); if (k > 0) xf(CX, 1060, clamp(k), 0, () => { card(110, 930, 860, 260, { fill: 'rgba(255,255,255,0.02)', stroke: 'rgba(255,111,138,0.5)', r: 40 }); text('Next time =', 170, 1010, 34, 700, MUTED); text('no date. no time.', 170, 1100, 50, 800, RED); text('?', 880, 1090, 130, 800, RED, 'right'); });
}
function s1(t) {
  const a = VO_AT[1]; stage(t, 0.16); eyebrow('FIRST-TIME CLIENTS', 330, IN.mid);
  for (let i = 0; i < 10; i++) { const e = pop(t, a + 0.1 + i * 0.04, 0.3); if (e <= 0) continue; const gone = i >= 5 ? ease.inOut(seg(t, a + 1.3 + (i - 5) * 0.08, a + 1.7 + (i - 5) * 0.08)) : 0; dotPerson(190 + (i % 5) * 175, 640 + Math.floor(i / 5) * 190 + gone * 14, 130 * clamp(e), mix('#8f89ff', '#3a3a4c', gone), 1 - gone * 0.35); }
  headline('48%', 1130, pop(t, a + 1.0, 0.3), 200, '#fff');
  withFade(seg(t, a + 1.6, a + 2.0), () => text('book one cut. never return.', CX, 1250, 44, 700, RED, 'center'));
}
function s2(t) {
  const a = VO_AT[2]; stage(t, 0.2); eyebrow('ASK IN THE CHAIR', 330, IN.mid);
  const bad = pop(t, a + 0.4, 0.3), good = pop(t, a + 1.2, 0.35), cross = seg(t, a + 2.2, a + 2.5);
  xf(CX, 600, clamp(bad), 0, () => { card(130, 520, 820, 150, { fill: 'rgba(255,255,255,0.02)', stroke: 'rgba(255,111,138,0.4)' }); text('“Want to rebook?”', CX, 600, 46, 700, MUTED, 'center'); if (cross > 0) line(250, 600, lerp(250, 830, cross), 600, RED, 6); });
  xf(CX, 900, clamp(good), 0, () => { card(130, 740, 820, 140, { stroke: 'rgba(111,227,160,0.6)' }); text('“Saturday or Sunday?”', CX, 810, 54, 800, '#fff', 'center', -0.02); });
  [['SAT', 10], ['SUN', 12]].forEach(([d, h], i) => { const e = pop(t, a + 1.9 + i * 0.25, 0.35); if (e <= 0) return; xf(330 + i * 420, 1060, clamp(e), 0, () => { card(180 + i * 420 - 0, 960, 300, 220, { stroke: 'rgba(165,160,255,0.55)' }); text(d, 330 + i * 420, 1040, 40, 800, IN.mid, 'center', 0.08); text(h + ':00', 330 + i * 420, 1120, 60, 800, '#fff', 'center'); }); });
}
function s3(t) {
  const a = VO_AT[3]; stage(t, 0.14);
  phoneChat(t, a - 0.1, VO_AT[4] + 0.2, () => {
    msg(60, 170, 520, ["You're locked in:", 'Saturday 10:00.', 'See you then!'], true, 1, seg(t, a + 0.15, a + 2.0));
    msg(40, 400, 520, ['Bet. See you Saturday.'], false, seg(t, a + 2.5, a + 2.7), 1);
  });
}
function s4(t) {
  const a = VO_AT[4]; stage(t, 0.2); eyebrow('MAYBE  VS  DATE', 330, IN.mid);
  const L = pop(t, a + 0.1, 0.35), R = pop(t, a + 0.9, 0.35);
  xf(300, 800, clamp(L), 0, () => { card(80, 560, 440, 480, { fill: 'rgba(255,255,255,0.02)', stroke: 'rgba(255,111,138,0.5)' }); text('MAYBE', 300, 630, 34, 800, RED, 'center', 0.1); text('?', 300, 830, 200, 800, MUTED, 'center'); text('drifts', 300, 980, 46, 800, MUTED, 'center'); });
  xf(780, 800, clamp(R), 0, () => { card(560, 560, 440, 480, { stroke: 'rgba(111,227,160,0.6)' }); text('DATE', 780, 630, 34, 800, OK, 'center', 0.1); fillRR(640, 700, 280, 190, 24, OK); text('SAT', 780, 770, 34, 800, '#06210f', 'center', 0.08); text('10:00', 780, 840, 60, 800, '#06210f', 'center'); text('comes back', 780, 980, 46, 800, '#fff', 'center'); });
}
const SC = [[0, VO_AT[1], s0], [VO_AT[1], VO_AT[2], s1], [VO_AT[2], VO_AT[3], s2], [VO_AT[3], VO_AT[4], s3], [VO_AT[4], END, s4], [END, 999, (t) => finale(t, END)]];
cue(VO_AT[3] + 0.3, 'notification', 0.3); cue(VO_AT[3] + 2.5, 'tap', 0.3); cue(END + 1.25, 'tap', 0.3);
boot({ duration: DURATION, scenes: SC, brandAt: END, hideCaption: (t) => t >= END + 0.6 }, 'seenext');
