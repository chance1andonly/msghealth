// MsgHealth · "His Thursdays" · retention explainer reel (1080 × 1920, 30 fps), built on kit.js + mg.js. Motion graphics only.
// Angle: about half of "ghosted" chairs are life changes (shifts, moves), not a competitor (Booksy). Fix: ask first, offer a new slot.
'use strict';
const END = VO_AT[5] - 0.1, DURATION = +Math.max(END + 2.4, lineEnd(5) + 1.1).toFixed(2);
window.CUES = { end: END }; window.SFX = []; const cue = (t, kind, gain) => window.SFX.push({ t, kind, gain });
window.MUSIC = { bpm: 92, root: 47, brandAt: END, mood: 'sneaky' };
const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
function week(t, o = {}) { // a week strip: Thursday highlighted; o.thu = 0 booked → 1 gone; o.sat = 0..1 new slot lands
  for (let i = 0; i < 7; i++) {
    const x = 90 + i * 130, e = pop(t, 0.2 + i * 0.04, 0.3); if (e <= 0) continue;
    xf(x + 55, 700, clamp(e), 0, () => {
      const thu = i === 3, sat = i === 5; card(x, 560, 110, 300, { fill: 'rgba(255,255,255,0.03)', r: 20, stroke: thu ? rgba(AMBER, 0.15 + 0.5 * (o.thu ?? 0)) : sat && (o.sat ?? 0) > 0 ? rgba(OK, 0.7) : 'rgba(255,255,255,0.1)' });
      text(DAYS[i], x + 55, 600, 30, 800, thu ? AMBER : MUTED, 'center');
      if (thu) { const g = o.thu ?? 0; if (g < 0.5) { fillRR(x + 10, 650, 90, 90, 14, rgba(C.primary, 0.9 * (1 - g * 2))); text('10:00', x + 55, 695, 24, 800, '#fff', 'center'); } else { text('7a–3p', x + 55, 695, 24, 800, AMBER, 'center'); text('SHIFT', x + 55, 730, 18, 800, AMBER, 'center', 0.1); } }
      if (sat && (o.sat ?? 0) > 0) { fillRR(x + 10, 650, 90, 90, 14, rgba(OK, 0.9 * ease.back(o.sat))); text('9:00', x + 55, 695, 24, 800, '#06210f', 'center'); }
    });
  }
}
function s0(t) { stage(t, 0.18); eyebrow('HIS REGULAR SLOT', 400, IN.mid); week(t, { thu: seg(t, wordAt(0, 1) - 0.3, wordAt(0, 1) + 0.4) }); withFade(seg(t, wordAt(0, 1) + 0.4, wordAt(0, 1) + 0.8), () => text('Not you. His schedule.', CX, 1020, 56, 800, '#fff', 'center', -0.02)); }
function s1(t) {
  const a = VO_AT[1]; stage(t, 0.16); eyebrow('WHY REGULARS GO QUIET', 330, IN.mid);
  [['New shift', 'Work moved his hours'], ['New place', 'Moved across town'], ['New routine', 'Life got busier']].forEach(([h, s], i) => { const e = pop(t, a + 0.15 + i * 0.5, 0.35); if (e <= 0) return; xf(CX, 600 + i * 190, clamp(e), 0, () => { card(110, 530 + i * 190, 860, 160, { r: 30 }); text(h, 170, 580 + i * 190, 42, 800, '#fff'); text(s, 170, 636 + i * 190, 28, 500, SOFT); tag(920, 610 + i * 190, 'LIFE', AMBER, false, 22); }); });
  withFade(seg(t, wordAt(1, 2) - 0.2, wordAt(1, 2) + 0.2), () => text('Not a rival shop.', CX, 1250, 50, 800, AMBER, 'center', -0.02));
}
function s2(t) {
  const a = VO_AT[2]; stage(t, 0.14); eyebrow('WHAT HE’S THINKING', 330, IN.mid);
  const e = ease.quint(seg(t, a, a + 0.4)); ctx.save(); ctx.globalAlpha = e; phone(220, 450, 640, 700, '#0d0d14', () => {
    fillRR(0, 0, 640, 100, 0, '#14141e'); text('New message', 320, 56, 28, 700, MUTED, 'center');
    const full = "Hey, you got anything this week?"; const typed = seg(t, a + 0.3, a + 1.3), del = seg(t, a + 1.7, a + 2.2);
    const n = Math.round(full.length * typed * (1 - del)); fillRR(30, 520, 580, 100, 50, 'rgba(255,255,255,0.08)'); text(full.slice(0, n) || ' ', 70, 570, 28, 500, '#fff');
    if (Math.sin(t * 10) > 0) fillRR(70 + tw(full.slice(0, n), 28, 500), 548, 3, 44, 1, '#fff');
  }); ctx.restore();
  withFade(seg(t, a + 2.2, a + 2.6), () => text('“Probably booked out.”', CX, 1280, 52, 800, RED, 'center', -0.02));
}
function s3(t) {
  const a = VO_AT[3]; stage(t, 0.14);
  phoneChat(t, a - 0.1, VO_AT[4] + 0.2, () => {
    msg(60, 170, 520, ['Did your schedule change?', "I've got Saturday", 'mornings open.'], true, 1, seg(t, a + 0.15, a + 3.0));
    msg(40, 440, 520, ['Yeah, new shift. Sat 9?'], false, seg(t, a + 3.6, a + 3.8), 1);
  });
}
function s4(t) { const a = VO_AT[4]; stage(t, 0.2); eyebrow('NEW TIME', 400, IN.mid); week(t, { thu: 1, sat: seg(t, a + 0.2, a + 0.7) }); withFade(seg(t, a + 0.9, a + 1.3), () => { chip('SAME BARBER', CX, 1020, OK, 1, 36); text('Same regular.', CX, 1130, 56, 800, '#fff', 'center'); }); }
const SC = [[0, VO_AT[1], s0], [VO_AT[1], VO_AT[2], s1], [VO_AT[2], VO_AT[3], s2], [VO_AT[3], VO_AT[4], s3], [VO_AT[4], END, s4], [END, 999, (t) => finale(t, END)]];
cue(VO_AT[3] + 3.6, 'notification', 0.3); cue(VO_AT[4] + 0.5, 'ding', 0.3); cue(END + 1.25, 'tap', 0.3);
boot({ duration: DURATION, scenes: SC, brandAt: END, hideCaption: (t) => t >= END + 0.6 }, 'shift');
