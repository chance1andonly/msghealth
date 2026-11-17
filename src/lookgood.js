// MsgHealth · "Looks great, man" · retention explainer reel (1080 × 1920, 30 fps), built on kit.js + mg.js. Motion graphics only.
// Angle: clients rarely complain, they just don't rebook (Booksy). Fix: a next-day "anything off?" text.
'use strict';
const END = VO_AT[5] - 0.1, DURATION = +Math.max(END + 2.4, lineEnd(5) + 1.1).toFixed(2);
window.CUES = { end: END }; window.SFX = []; const cue = (t, kind, gain) => window.SFX.push({ t, kind, gain });
window.MUSIC = { bpm: 90, root: 43, brandAt: END, mood: 'sneaky' };
function s0(t) {
  stage(t, 0.18);
  const e = pop(t, 0.35, 0.4); xf(CX, 640, clamp(e), 0, () => { card(110, 480, 860, 300, { r: 40 }); text('“Looks great, man.”', CX, 590, 64, 800, '#fff', 'center', -0.03); text('Paid · tipped · smiled', CX, 690, 32, 500, SOFT, 'center'); });
  const k = pop(t, wordAt(0, 1) - 0.1, 0.35);
  if (k > 0) xf(CX, 1000, clamp(k), 0, () => { card(110, 880, 860, 200, { fill: 'rgba(255,255,255,0.02)', stroke: 'rgba(255,111,138,0.5)', r: 40 }); text('Next booking', 170, 950, 34, 700, MUTED); text('—', 910, 950, 60, 800, RED, 'right'); text('nothing on the calendar', 170, 1020, 30, 500, RED); });
}
function s1(t) {
  const a = VO_AT[1]; stage(t, 0.14); eyebrow('WHAT CLIENTS SAY WHEN THEY’RE UNHAPPY', 330, IN.mid);
  const live = seg(t, a + 0.1, a + 1.2); ctx.save(); ctx.strokeStyle = C.primary; ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.beginPath();
  for (let x = 90; x <= 990; x += 6) { const u = (x - 90) / 900, amp = (u < 0.45 * live + 0.02 ? 1 : 0) * 120 * Math.sin(u * 30 + t * 6) * Math.sin(u * 9), y = 800 + (t > a + 1.2 ? 0 : amp * (1 - seg(t, a + 0.9, a + 1.4))); x === 90 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke(); ctx.restore();
  withFade(seg(t, a + 1.5, a + 1.9), () => { text('Nothing.', CX, 1010, 130, 800, '#fff', 'center', -0.04); text('That’s the complaint.', CX, 1120, 44, 600, RED, 'center'); });
}
function s2(t) {
  const a = VO_AT[2]; stage(t, 0.2); eyebrow('FIX IT WHILE THEY’RE STILL YOURS', 330, IN.mid);
  const p = ease.inOut(seg(t, a + 0.2, a + 2.4)); const cx = CX, cy = 800, r = 190;
  ring(cx, cy, r, 'rgba(255,255,255,0.12)', 22); ctx.save(); ctx.strokeStyle = C.primary; ctx.lineWidth = 22; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * p); ctx.stroke(); ctx.restore();
  text('24h', cx, cy - 10, 120, 800, '#fff', 'center', -0.04); text('after the cut', cx, cy + 90, 30, 600, SOFT, 'center');
  withFade(seg(t, a + 2.3, a + 2.7), () => text('Send one text.', CX, 1140, 70, 800, IN.mid, 'center'));
}
function s3(t) {
  const a = VO_AT[3]; stage(t, 0.14);
  phoneChat(t, a - 0.1, VO_AT[4] + 0.2, () => {
    msg(60, 170, 520, ['Anything off with the cut?', "I'll fix it free."], true, 1, seg(t, a + 0.2, a + 2.4));
    msg(40, 380, 520, ['Left side a little high', 'honestly.'], false, seg(t, a + 2.9, a + 3.1), 1);
    msg(60, 570, 520, ['Got you. Thursday 5:30?'], true, seg(t, a + 3.8, a + 4.0), 1);
  });
}
function s4(t) {
  const a = VO_AT[4]; stage(t, 0.2);
  const L = pop(t, a + 0.1, 0.35), R = pop(t, a + 1.2, 0.35);
  xf(300, 780, clamp(L), 0, () => { card(80, 540, 440, 500, { stroke: 'rgba(111,227,160,0.55)' }); text('ASKED', 300, 610, 34, 800, OK, 'center', 0.1); dotPerson(300, 770, 150, '#6fe3a0'); text('stays', 300, 930, 52, 800, '#fff', 'center'); });
  xf(780, 780, clamp(R), 0, () => { card(560, 540, 440, 500, { stroke: 'rgba(255,111,138,0.5)', fill: 'rgba(255,255,255,0.02)' }); text('NEVER ASKED', 780, 610, 34, 800, RED, 'center', 0.1); dotPerson(780, 770, 150, '#4a4a5e', 0.8); text('leaves', 780, 930, 52, 800, MUTED, 'center'); });
}
const SC = [[0, VO_AT[1], s0], [VO_AT[1], VO_AT[2], s1], [VO_AT[2], VO_AT[3], s2], [VO_AT[3], VO_AT[4], s3], [VO_AT[4], END, s4], [END, 999, (t) => finale(t, END)]];
cue(VO_AT[3] + 2.9, 'notification', 0.3); cue(VO_AT[3] + 3.8, 'tap', 0.3); cue(END + 1.25, 'tap', 0.3);
boot({ duration: DURATION, scenes: SC, brandAt: END, hideCaption: (t) => t >= END + 0.6 }, 'lookgood');
