// MsgHealth · "How'd the interview go" · retention explainer reel (1080 × 1920, 30 fps), built on kit.js + mg.js. Motion graphics only.
// Angle: weak personal connection is a top reason clients don't return (Squire); remembering one detail beats a discount. Fix: save one detail per cut, text it 3 days later.
'use strict'; window.CHAT_WHO = 'Dre';
const END = VO_AT[5] - 0.1, DURATION = +Math.max(END + 2.4, lineEnd(5) + 1.1).toFixed(2);
window.CUES = { end: END }; window.SFX = []; const cue = (t, kind, gain) => window.SFX.push({ t, kind, gain });
window.MUSIC = { bpm: 90, root: 41, brandAt: END, mood: 'sneaky' };
function s0(t) {
  stage(t, 0.18); eyebrow('IN THE CHAIR, TUESDAY', 330, IN.mid);
  const e = pop(t, 0.3, 0.4); xf(CX, 640, clamp(e), 0, () => { card(110, 520, 860, 250, { r: 40 }); text('“I’ve got an interview Friday.”', CX, 640, 50, 800, '#fff', 'center', -0.02); text('Dre · fade + lineup', CX, 716, 28, 500, SOFT, 'center'); });
  const k = pop(t, wordAt(0, 1) - 0.1, 0.35); if (k > 0) xf(CX, 1000, clamp(k), 0, () => { card(110, 880, 860, 200, { fill: 'rgba(255,255,255,0.02)', stroke: 'rgba(255,111,138,0.5)', r: 40 }); text('Friday, after', 170, 950, 34, 700, MUTED); text('no message sent', 170, 1020, 40, 800, RED); });
}
function s1(t) {
  const a = VO_AT[1]; stage(t, 0.16); eyebrow('WHY HE COMES BACK', 330, IN.mid);
  const L = pop(t, a + 0.15, 0.35), R = pop(t, a + 1.5, 0.35);
  xf(300, 800, clamp(L), 0, () => { card(80, 560, 440, 480, { fill: 'rgba(255,255,255,0.02)' }); text('THE FADE', 300, 630, 34, 800, MUTED, 'center', 0.1); text('any shop', 300, 820, 56, 800, MUTED, 'center'); text('has one', 300, 890, 56, 800, MUTED, 'center'); });
  xf(780, 800, clamp(R), 0, () => { card(560, 560, 440, 480, { stroke: 'rgba(111,227,160,0.6)' }); text('BEING', 780, 630, 34, 800, OK, 'center', 0.1); text('REMEMBERED', 780, 680, 34, 800, OK, 'center', 0.1); circle(780, 830, 70, rgba(OK, 0.18)); check(780, 830, 44, OK, 9); text('only you', 780, 960, 46, 800, '#fff', 'center'); });
}
function s2(t) {
  const a = VO_AT[2]; stage(t, 0.14); eyebrow('ONE DETAIL PER CUT', 330, IN.mid);
  [['JOB', 'interview Friday'], ['KID', 'daughter’s recital'], ['TRIP', 'Miami in March']].forEach(([k, v], i) => { const e = pop(t, wordAt(2, 2) - 0.1 + i * 0.5 - (i ? 0 : 0.0), 0.35); if (e <= 0) return; xf(CX, 600 + i * 190, clamp(e), 0, () => { card(110, 530 + i * 190, 860, 160, { r: 30 }); text(v, 170, 600 + i * 190, 42, 800, '#fff'); tag(920, 610 + i * 190, k, C.primary === '#4f46e5' ? '#a5a0ff' : IN.mid, false, 24); }); });
  for (let i = 0; i < 3; i++) withFade(seg(t, a + 0.5 + i * 0.15, a + 0.9 + i * 0.15), () => card(110, 530 + i * 190, 860, 160, { r: 30, fill: 'rgba(255,255,255,0.015)', stroke: 'rgba(255,255,255,0.07)' }));
  const n = pop(t, a + 0.2, 0.35); if (n > 0) xf(CX, 460, clamp(n), 0, () => { chip('NOTE TO SELF', CX, 450, IN.mid, 1, 22); });
}
function s3(t) {
  const a = VO_AT[3]; stage(t, 0.14);
  phoneChat(t, a - 0.1, VO_AT[4] + 0.2, () => {
    msg(60, 170, 520, ["How'd the interview", 'go, Dre?'], true, 1, seg(t, a + 0.1, a + 1.9));
    msg(40, 340, 520, ['Got the job!', 'Need a touch up Friday.'], false, seg(t, a + 3.0, a + 3.2), 1);
    msg(60, 540, 520, ['Proud of you. 4:30?'], true, seg(t, a + 3.9, a + 4.1), 1);
  });
}
function s4(t) {
  const a = VO_AT[4]; stage(t, 0.2); eyebrow('DISCOUNT  VS  MEMORY', 330, IN.mid);
  const L = pop(t, a + 0.1, 0.35), R = pop(t, a + 1.1, 0.35);
  xf(300, 800, clamp(L), 0, () => { card(80, 560, 440, 480, { fill: 'rgba(255,255,255,0.02)', stroke: 'rgba(255,111,138,0.4)' }); text('10% OFF', 300, 760, 70, 800, MUTED, 'center'); text('any shop can', 300, 880, 38, 600, MUTED, 'center'); text('do this', 300, 930, 38, 600, MUTED, 'center'); });
  xf(780, 800, clamp(R), 0, () => { card(560, 560, 440, 480, { stroke: 'rgba(111,227,160,0.6)' }); text('“How’d it go?”', 780, 760, 52, 800, '#fff', 'center'); text('only you can', 780, 880, 38, 600, OK, 'center'); text('do this', 780, 930, 38, 600, OK, 'center'); });
}
const SC = [[0, VO_AT[1], s0], [VO_AT[1], VO_AT[2], s1], [VO_AT[2], VO_AT[3], s2], [VO_AT[3], VO_AT[4], s3], [VO_AT[4], END, s4], [END, 999, (t) => finale(t, END)]];
cue(VO_AT[3] + 0.3, 'notification', 0.3); cue(VO_AT[3] + 3.0, 'notification', 0.3); cue(END + 1.25, 'tap', 0.3);
boot({ duration: DURATION, scenes: SC, brandAt: END, hideCaption: (t) => t >= END + 0.6 }, 'interview');
