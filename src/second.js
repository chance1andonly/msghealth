// MsgHealth · "Cut two" · retention explainer reel (1080 × 1920, 30 fps), built on kit.js + mg.js. Motion graphics only.
// Angle: nearly 7 in 10 first-time clients never book a second visit (industry estimate, Booksy). Fix: one text the day after cut one.
'use strict';
const END = VO_AT[5] - 0.1, DURATION = +Math.max(END + 2.4, lineEnd(5) + 1.1).toFixed(2);
window.CUES = { end: END }; window.SFX = []; const cue = (t, kind, gain) => window.SFX.push({ t, kind, gain });
window.MUSIC = { bpm: 96, root: 45, brandAt: END, mood: 'sneaky' };
const GX = (i) => 190 + (i % 5) * 175, GY = (i, base) => base + Math.floor(i / 5) * 190;
function crowd(t, base, size, lose, keep) { // 10 first-timers; the ones past `keep` go grey at time `lose`
  for (let i = 0; i < 10; i++) {
    const e = pop(t, 0.35 + i * 0.05, 0.3), gone = i >= 3 ? ease.inOut(seg(t, lose + (i - 3) * 0.07, lose + (i - 3) * 0.07 + 0.4)) : 0;
    if (e <= 0) continue; const y = GY(i, base) + gone * 14;
    dotPerson(GX(i), y, size * clamp(e), mix(keep, '#3a3a4c', gone), 1 - gone * 0.35);
  }
}
function s0(t) {
  stage(t, 0.18); eyebrow('FIRST-TIME CLIENTS', 330, IN.mid);
  crowd(t, 700, 130, wordAt(0, 1) - 0.6, '#8f89ff');
  headline('7 in 10', 1130, pop(t, wordAt(0, 0) + 0.1, 0.3), 190, '#fff');
  withFade(seg(t, wordAt(0, 1) - 0.5, wordAt(0, 1) - 0.1), () => text('never book cut two', CX, 1260, 46, 700, RED, 'center', -0.01));
}
function s1(t) {
  const a = VO_AT[1]; stage(t, 0.16); eyebrow('WHAT HAPPENED', 330, IN.mid);
  const e1 = pop(t, a + 0.1, 0.35), e2 = pop(t, a + 0.35, 0.35);
  xf(CX, 600, clamp(e1), 0, () => { card(130, 520, 820, 160); text('Cut #1', 190, 580, 40, 800, '#fff'); text('Saturday · fade + beard', 190, 636, 28, 500, SOFT); tag(890, 600, 'DONE', OK, false, 24); });
  xf(CX, 800, clamp(e2), 0, () => { card(130, 720, 820, 160, { fill: 'rgba(255,255,255,0.02)', stroke: 'rgba(255,111,138,0.5)' }); text('Cut #2', 190, 780, 40, 800, MUTED); text('Never booked', 190, 836, 28, 500, RED); });
  withFade(seg(t, a + 1.0, a + 1.35), () => { chip('COMPLAINTS: 0', CX, 1040, OK, 1, 30); text('Silence. Just gone.', CX, 1140, 48, 700, '#fff', 'center'); });
}
function s2(t) {
  const a = VO_AT[2]; stage(t, 0.2); eyebrow('THE FIX', 330, IN.mid);
  const x0 = 200, x1 = 880, p = ease.inOut(seg(t, a + 0.3, a + 1.6));
  line(x0, 760, x1, 760, 'rgba(255,255,255,0.15)', 8); line(x0, 760, lerp(x0, x1, p), 760, C.primary, 8);
  circle(x0, 760, 34, OK); check(x0, 760, 26, '#06210f', 6); text('Cut #1', x0, 840, 28, 700, '#fff', 'center');
  const e = pop(t, a + 1.5, 0.35); if (e > 0) { glow(x1, 760, 160, C.primary, 0.5 * clamp(e)); circle(x1, 760, 44 * clamp(e), C.primary); text('✉', x1, 762, 40, 700, '#fff', 'center'); text('Day after', x1, 840, 28, 700, IN.mid, 'center'); }
  withFade(seg(t, a + 1.6, a + 2.0), () => text('One text.', CX, 1060, 110, 800, '#fff', 'center', -0.04));
}
function s3(t) {
  const a = VO_AT[3];
  stage(t, 0.14);
  phoneChat(t, a - 0.1, VO_AT[4] + 0.2, () => {
    const p = seg(t, a + 0.15, a + 3.2);
    msg(60, 170, 520, ["Hey Marcus, how's the fade", 'holding up? Want your next', 'one on the books?'], true, 1, p);
    msg(40, 410, 520, ["It's sharp! Saturday at 10?"], false, seg(t, a + 3.4, a + 3.6), 1);
    withFade(seg(t, a + 3.7, a + 3.9), () => { text('Booked · Sat 10:00', 320, 560, 30, 800, OK, 'center'); });
  });
  if (t > a + 3.4 && t < a + 3.45) cue(0, 'tap', 0);
}
function s4(t) {
  const a = VO_AT[4]; stage(t, 0.2); eyebrow('STRANGER → REGULAR', 330, IN.mid);
  [0, 1, 2].forEach((i) => { const e = pop(t, a + 0.25 + i * 0.3, 0.35); if (e <= 0) return; xf(250 + i * 290, 760, clamp(e), 0, () => { circle(250 + i * 290, 700, 90, rgba(C.primary, 0.2)); strokeRR(160 + i * 290, 610, 180, 180, 90, rgba(C.primary, 0.6), 3); dotPerson(250 + i * 290, 710, 110, '#a5a0ff'); text('Cut #' + (i + 2), 250 + i * 290, 850, 28, 800, '#fff', 'center'); }); });
  withFade(seg(t, a + 1.3, a + 1.7), () => { chip('REGULAR', CX, 1020, OK, 1, 40); });
}
const SC = [[0, VO_AT[1], s0], [VO_AT[1], VO_AT[2], s1], [VO_AT[2], VO_AT[3], s2], [VO_AT[3], VO_AT[4], s3], [VO_AT[4], END, s4], [END, 999, (t) => finale(t, END)]];
cue(VO_AT[2] + 1.5, 'notification', 0.3); cue(VO_AT[3] + 3.4, 'tap', 0.3); cue(END + 1.25, 'tap', 0.3);
boot({ duration: DURATION, scenes: SC, brandAt: END, hideCaption: (t) => t >= END + 0.6 }, 'second');
