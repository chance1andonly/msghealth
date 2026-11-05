// MsgHealth · "Two noons" · story-hook vertical ad (1080 × 1920, 30 fps), built on src/kit.js + src/story-kit.js.
// Real story: before standard time, every US town set its clocks by the sun, so one railway station could show several different
// times. The railroads switched to standard time on November 18, 1883 ("the day of two noons", when some clocks repeated noon).
// INVENTED (the absurd part): before that, everyone at the station was "right on time" ... for different trains.
// Pivot: your customers mix up their times too. MsgHealth: one booking calendar synced with Google Calendar, plus SMS & email reminders.
// Names, times and appointments in the product scenes are illustrative. Voiceover: assets/audio/railway (src/railway-vo.js).
'use strict';
const word = (l, k) => VO_AT[l] + VO_CLIPS[l].chunks[k][1];
const T = {
  prob: word(0, 1), sun: VO_AT[1], thesun: word(1, 1), several: VO_AT[2], diff: word(2, 1), picked: VO_AT[3], hoped: word(3, 1), fix: VO_AT[4], fixit: word(4, 1), noons: word(4, 2),
  before: VO_AT[5], right: word(5, 1), trains: VO_AT[6], pivot: VO_AT[7], mix: word(7, 1), brand: VO_AT[8], gcal: word(8, 1), remind: VO_AT[9], txt: word(9, 1), same: VO_AT[10], same2: word(10, 1),
  offer: VO_AT[11], end: VO_AT[12] - 0.1, url: VO_AT[12] + 0.1,
};
T.cal = T.brand + 1.0; T.cta = T.end + 1.25;
const DURATION = +(T.cta + 1.0).toFixed(2);
window.CUES = T; window.SFX = []; const cue = (t, kind, gain) => window.SFX.push({ t, kind, gain });
window.MUSIC = { bpm: 112, root: 48, brandAt: T.brand, mood: 'bouncy' };

const GR = 1150;
const CLOCKS = [[10, 7], [10, 52], [11, 20], [9, 41]]; // four different "right" times
function platform(t, dusk = false) {
  backdrop(GR, dusk ? '#e9a46a' : '#a5d2ee', dusk ? '#f9e1bd' : '#f3eede', '#9a9080', '#6e6558'); cloud(80, 200, 0.9, 'rgba(255,255,255,0.9)');
  fillRR(-20, 430, W + 40, GR - 430, 0, '#c9b08a'); for (let i = 0; i < 12; i++) line(i * 100 + 20, 430, i * 100 + 20, GR, 'rgba(0,0,0,0.08)', 4);
  poly([[-20, 430], [W + 20, 430], [W, 340], [0, 340]], '#6b4a34'); fillRR(40, 640, 190, 300, 6, '#cfe7f3'); fillRR(850, 640, 190, 300, 6, '#cfe7f3'); fillRR(450, 700, 180, 450, 6, '#5a3a2a');
  fillRR(0, GR - 12, W, 22, 0, '#7a6a50');
}
function rails(y) { fillRR(0, y, W, 20, 0, '#4a3a2a'); for (let i = 0; i < 14; i++) fillRR(i * 90, y + 20, 56, 12, 2, '#6b4a34'); }
function train(x, y, s, col, dir = 1) { // body base at y, nose points in dir
  ctx.save(); ctx.translate(x, y); ctx.scale(dir * s, s); shadow(0, 14, 330);
  fillRR(-300, -150, 420, 120, 14, col); fillRR(-300, -50, 420, 28, 6, '#1b1f27'); fillRR(120, -190, 130, 160, 10, '#2a2f3a'); fillRR(110, -210, 150, 28, 8, '#1b1f27'); fillRR(-180, -260, 54, 120, 8, '#2a2f3a'); fillRR(-196, -276, 86, 24, 8, '#1b1f27'); poly([[250, -30], [330, 0], [250, 0]], '#7a1f2a');
  for (let i = 0; i < 3; i++) fillRR(-260 + i * 120, -125, 80, 60, 8, '#fbe9b0'); [-220, -80, 60, 180].forEach((wx) => { circle(wx, -8, 34, '#2a2f3a'); circle(wx, -8, 14, '#9a9aa6'); });
  ctx.restore();
}
function sceneHook(t) {
  platform(t); const k = appear(t, 0.3, 0.45); xf(CX, 600, 0.6 + 0.4 * k, 0, () => { ctx.globalAlpha = k; const m = (t * 7) % 60; clockFace(CX, 500, 250, 10, 7 + (t > T.prob ? Math.sin(t * 9) * 18 : 0)); });
  withFade(seg(t, 0.15, 0.5), () => { text('1883', CX, 150, 140, 800, '#3a2a1a', 'center', -0.02); });
  [[200, 400], [880, 430]].forEach(([x, h], i) => person(x, 1650, h, 90 + i, { arm: 'up', wave: t + i, mouth: 'open', dir: x < 540 ? 1 : -1, bounce: t * 3 + i }));
  const b = appear(t, T.prob, 0.35); if (b > 0) xf(CX, 960, b, 0, () => banner('TIME PROBLEM', CX, 960, 92, '#b3261e'));
}
function sceneSun(t) {
  backdrop(1100, '#7fc8ee', '#fdf0c8', '#8bbd6a', '#6a9a4a'); const k = appear(t, T.thesun - 0.2, 0.5), sx = lerp(180, 900, seg(t, T.sun, T.several)), sy = 420 - Math.sin(seg(t, T.sun, T.several) * Math.PI) * 140;
  glow(sx, sy, 380, '#fff4c0', 0.6); circle(sx, sy, 100, '#ffd45e'); for (let i = 0; i < 12; i++) { const a = i / 12 * 6.28 + t * 0.4; line(sx + Math.cos(a) * 130, sy + Math.sin(a) * 130, sx + Math.cos(a) * 180, sy + Math.sin(a) * 180, '#ffd45e', 10); }
  [[190, 1100, 0], [540, 1100, 1], [890, 1100, 2]].forEach(([x, y, i]) => { const e = appear(t, T.sun + 0.2 + i * 0.35, 0.4); if (e > 0) xf(x, y, e, 0, () => { shadow(x, y, 120); fillRR(x - 70, y - 330, 140, 330, 4, ['#c98f7a', '#8fa8b8', '#d9b86a'][i]); poly([[x - 85, y - 330], [x, y - 430], [x + 85, y - 330]], '#7a4a3a'); clockFace(x, y - 250, 48, [11, 12, 12][i] , [40, 5, 29][i], {}); fillRR(x - 24, y - 90, 48, 90, 4, '#5a3a2a'); }); });
  const b = appear(t, T.thesun, 0.35); if (b > 0) xf(CX, 840, b, 0, () => banner('TOWN TIME = SUN TIME', CX, 840, 66, '#8a5a1a'));
}
function sceneSeveral(t) {
  platform(t); const lt = t - T.several;
  CLOCKS.forEach(([h, m], i) => { const x = 160 + i * 250, e = appear(t, T.several + 0.15 + i * 0.3, 0.4); if (e > 0) xf(x, 560, e, 0, () => { line(x, 340, x, 440, '#4a3220', 8); clockFace(x, 540, 100, h, m); text(['LINE A', 'LINE B', 'LINE C', 'LINE D'][i], x, 690, 28, 800, '#3a2a1a', 'center', 0.1); }); });
  [[300, 420], [700, 460]].forEach(([x, h], i) => person(x, 1650, h, 100 + i, { arm: 'up', wave: t * 2 + i, eyes: 'wide', mouth: 'open', dir: x < 540 ? 1 : -1, bounce: t * 3 + i }));
  const b = appear(t, T.diff, 0.35); if (b > 0) xf(CX, 880, b, 0, () => banner('ONE STATION. 4 TIMES.', CX, 880, 70, '#b3261e'));
}
function scenePick(t) {
  platform(t);
  CLOCKS.forEach(([h, m], i) => { const x = 160 + i * 250; line(x, 340, x, 440, '#4a3220', 8); clockFace(x, 540, 100, h, m); });
  [0, 1, 2, 3].forEach((i) => { const x = 160 + i * 250; person(x, 1650, 420 + (i % 2) * 40, 110 + i, { arm: i === 1 || i === 2 ? 'up' : 'down', wave: t + i, bounce: t * 3 + i, dir: i < 2 ? 1 : -1 }); });
  const a = appear(t, T.picked + 0.4, 0.3), b = appear(t, T.picked + 1.1, 0.3), c = appear(t, T.hoped, 0.35);
  if (a > 0) xf(330, 900, a, 0, () => speech(300, 760, ['THIS ONE.'], { size: 54, tail: [410, 1190] })); if (b > 0) xf(660, 900, b, 0, () => speech(760, 880, ['NO, THIS ONE.'], { size: 54, tail: [660, 1190], bg: '#ffe0dc' })); if (c > 0) xf(CX, 1000, c, 0, () => banner('…AND HOPED.', CX, 1000, 80, '#2a3a5a'));
}
function sceneFix(t) {
  ctx.fillStyle = vgrad(0, H, '#2a3a5a', '#141c30'); ctx.fillRect(0, 0, W, H); glow(CX, 700, 700, '#8aa8ff', 0.2);
  const a = appear(t, T.fix - 0.1, 0.4); xf(CX, 520, 0.6 + 0.4 * a, 0, () => { ctx.globalAlpha = a; fillRR(190, 230, 700, 560, 24, '#fff'); fillRR(190, 230, 700, 130, 24, '#b3261e'); fillRR(190, 330, 700, 30, 0, '#b3261e'); text('NOVEMBER', CX, 295, 60, 800, '#fff', 'center', 0.12); text('18', CX, 560, 300, 800, '#1b1f27', 'center', -0.05); text('1883', CX, 730, 70, 800, '#6b6a80', 'center', 0.1); });
  const b = appear(t, T.fixit, 0.35); if (b > 0) xf(CX, 900, b, 0, () => { ctx.save(); ctx.translate(CX + 120, 830); ctx.rotate(-0.12); strokeRR(-250, -70, 500, 140, 16, '#3dbb74', 12); text('FIXED', 0, 4, 100, 800, '#3dbb74', 'center', 0.05); ctx.restore(); });
  const c = appear(t, T.noons, 0.4); if (c > 0) xf(CX, 1150, c, 0, () => { clockFace(CX - 220, 1170, 150, 12, 0); clockFace(CX + 220, 1170, 150, 12, 0); text('NOON', CX - 220, 1380, 44, 800, '#fff', 'center', 0.15); text('NOON AGAIN', CX + 220, 1380, 44, 800, '#f5d68a', 'center', 0.08); });
}
function sceneOnTime(t) {
  platform(t, true); rails(1000);
  [[170, 1010, '#3a6ea8'], [900, 1010, '#c0392b']].forEach(([x, y, c], i) => { const e = ease.out(seg(t, T.before, T.before + 0.7)); train(lerp(x < 500 ? -300 : 1400, x, e), y, 0.7, c, x < 500 ? 1 : -1); });
  [0, 1, 2].forEach((i) => { const x = 220 + i * 320; person(x, 1650, 440, 120 + i, { arm: 'phone', bounce: t * 3 + i, mouth: undefined, dir: i === 2 ? -1 : 1 }); const e = appear(t, T.right + i * 0.3, 0.3); if (e > 0) xf(x, 1000, e, 0, () => { fillRR(x - 138, 1060, 276, 84, 42, '#2f8a54'); circle(x - 88, 1102, 26, '#fff'); check(x - 88, 1103, 26, '#2f8a54', 6); text('ON TIME', x + 22, 1104, 40, 800, '#fff', 'center', 0.03); }); });
  const b = appear(t, T.before, 0.35); if (b > 0) xf(CX, 460, b, 0, () => banner('EVERYONE: ON TIME', CX, 460, 76, '#2a3a5a'));
}
function sceneTrains(t) {
  platform(t, true); rails(1060); rails(1280);
  const k = ease.in(seg(t, T.trains + 0.9, T.pivot)); train(lerp(300, 300 - 1200, k), 1060, 0.62, '#3a6ea8', 1); train(lerp(780, 780 + 1200, k), 1280, 0.62, '#c0392b', -1);
  [[250, 1640], [810, 1640]].forEach(([x, y], i) => person(x, y, 460, 130 + i, { arm: 'wave', wave: t * 2 + i, mouth: 'open', eyes: 'wide', dir: i ? -1 : 1, bounce: t * 3 }));
  const b = appear(t, T.trains, 0.4); if (b > 0) xf(CX, 480, b, 0, () => banner('DIFFERENT TRAINS', CX, 480, 98, '#b3261e', '#fff', -0.03));
  const c = appear(t, T.trains + 0.5, 0.3); if (c > 0) xf(CX, 640, c, 0, () => { text('✓ on time   ✗ right train', CX, 640, 44, 800, 'rgba(60,40,20,0.85)', 'center', 0.02); });
}
function scenePivot(t) {
  ctx.fillStyle = '#e9dfd0'; ctx.fillRect(0, 0, W, 1250); ctx.fillStyle = '#9a8a74'; ctx.fillRect(0, 1250, W, 670); fillRR(0, 1180, W, 70, 0, '#cbb99d'); fillRR(70, 260, 220, 300, 8, '#cfe7f3'); fillRR(790, 260, 220, 300, 8, '#cfe7f3');
  [[170, 'I SAID 3 PM!', 0.2], [540, 'WAIT, TODAY?', 0.9], [900, 'IT WAS 2!', 1.6]].forEach(([x, s, d], i) => { person(x, 1640, 460, 140 + i, { arm: 'phone', eyes: 'wide', mouth: 'open', dir: x < 540 ? 1 : -1, bounce: t * 3 + i, shirt: SHIRT[i + 4] }); const e = appear(t, T.pivot + d, 0.3); if (e > 0) xf(x, 900, e, 0, () => speech(x, 780 - (i % 2) * 120, [s], { size: 44, tail: [x, 1170] })); });
  const b = appear(t, T.mix, 0.35); if (b > 0) xf(CX, 420, b, 0, () => banner('MIXED-UP TIMES', CX, 420, 80, '#2a3a5a'));
}
// ═════════════ the product ═════════════
const APPTS = [[0, 1, 'Priya S.', 1], [1, 3, 'Marcus T.', 2], [2, 0, 'Ava R.', 3], [3, 2, 'Jordan K.', 0], [4, 4, 'Dana L.', 4], [1, 5, 'Lee M.', 6]];
function sceneCalendar(t) {
  stage(t, 0.22);
  withFade(enter(t, T.cal - 0.05, T.remind, 0.15), () => {
    eyebrow('BOOKING CALENDAR', 300); card(CARD.x, 350, CARD.w, 880); ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].forEach((d, i) => text(d, CARD.x + 130 + i * 150, 410, 26, 800, MUTED, 'center', 0.1));
    for (let r = 0; r < 6; r++) { ctx.fillStyle = 'rgba(255,255,255,0.06)'; ctx.fillRect(CARD.x + 30, 460 + r * 125, CARD.w - 60, 2); text(`${9 + r}:00`, CARD.x + 36, 490 + r * 125, 18, 700, DIM, 'left'); }
    APPTS.forEach(([d, r, n, ci], i) => { const e = pop(t, T.cal + 0.1 + i * 0.18, 0.3); if (e > 0) xf(CARD.x + 130 + d * 150, 520 + r * 125, clamp(e), 0, () => { const x = CARD.x + 60 + d * 150, y = 470 + r * 125; fillRR(x, y, 140, 108, 14, rgba(NAMES[ci][1], 0.85)); text(n, x + 70, y + 54, 24, 800, '#fff', 'center', 0); }); });
    const g = pop(t, T.gcal, 0.35); if (g > 0) xf(CX, 1310, clamp(g), 0, () => { const lb = 'Synced with Google Calendar', ww = tw(lb, 34, 800) + 110; fillRR(CX - ww / 2, 1262, ww, 92, 46, rgba(GREEN, 0.18)); strokeRR(CX - ww / 2, 1262, ww, 92, 46, GREEN, 3); circle(CX - ww / 2 + 52, 1308, 20, GREEN); check(CX - ww / 2 + 52, 1309, 20, '#fff', 4.5); text(lb, CX - ww / 2 + 90, 1309, 34, 800, '#fff', 'left'); });
  });
}
function sceneReminders(t) {
  stage(t, 0.22);
  withFade(enter(t, T.remind - 0.1, T.offer, 0.2), () => {
    eyebrow('SMS & EMAIL REMINDERS', 300); card(CARD.x, 350, CARD.w, 700);
    const a = ease.out(seg(t, T.remind, T.remind + 0.3)); withFade(a, () => { tag(CARD.x + CARD.w - 40, 410, 'SMS', IN.mid, false, 18); bubble(CARD.x + 40, 440, CARD.w - 80, ['Reminder: you\'re booked for', 'tomorrow at 10:00 am.'], false); });
    const e = pop(t, T.txt, 0.3); if (e > 0) xf(CX, 700, clamp(e), 0, () => { tag(CARD.x + CARD.w - 40, 620, 'EMAIL', AMBER, false, 18); bubble(CARD.x + 40, 650, CARD.w - 80, ['Same details, in your inbox.'], false); });
    const c = pop(t, T.txt + 0.9, 0.3); if (c > 0) xf(CX, 860, clamp(c), 0, () => bubble(CARD.x + 40, 800, CARD.w - 80, ['Confirmed ✓'], true));
    const s = pop(t, T.same, 0.35); if (s > 0) xf(CX, 1200, clamp(s), 0, () => { card(CARD.x, 1090, CARD.w, 330, { fill: rgba(GREEN, 0.08), stroke: rgba(GREEN, 0.5) }); text('TOMORROW · 10:00 AM', CX, 1140, 22, 800, '#9ff0c0', 'center', 0.2);
      [['Priya S.', 1], ['Marcus T.', 2], ['Ava R.', 3]].forEach(([n, ci], i) => { const x = CARD.x + 130 + i * 310, d = pop(t, T.same + 0.2 + i * 0.2, 0.3); if (d > 0) xf(x, 1250, clamp(d), 0, () => { avatar(x, 1230, 34, n.slice(0, 2).toUpperCase(), NAMES[ci][1]); text(n, x, 1290, 24, 800, '#fff', 'center'); tag(x + 66, 1340, '10:00', GREEN, false, 16); }); }); });
  });
}
const SCENES = [[0, T.sun, sceneHook], [T.sun, T.several, sceneSun], [T.several, T.picked, sceneSeveral], [T.picked, T.fix, scenePick], [T.fix, T.before, sceneFix], [T.before, T.trains, sceneOnTime], [T.trains, T.pivot, sceneTrains], [T.pivot, T.brand, scenePivot],
  [T.brand, T.cal, (t) => brandHit(t, T.brand, T.cal)], [T.cal, T.remind, sceneCalendar], [T.remind, T.offer, sceneReminders], [T.offer, T.end, (t) => offerCard(t, T.offer, T.end)], [T.end, 999, (t) => endCard(t, T.end, T.cta, T.url)]];
cue(0.35, 'swish', 0.7); cue(T.prob, 'punch', 1); cue(T.sun, 'swoosh', 0.7); [0, 1, 2].forEach((i) => cue(T.sun + 0.2 + i * 0.35, 'tap', 0.6)); cue(T.thesun, 'punch', 0.9); cue(T.several, 'swish', 0.7); [0, 1, 2, 3].forEach((i) => cue(T.several + 0.15 + i * 0.3, 'ding', 0.5)); cue(T.diff, 'punch', 1);
cue(T.picked + 0.4, 'tap', 0.8); cue(T.picked + 1.1, 'tap', 0.8); cue(T.hoped, 'punch', 0.9); cue(T.fix, 'swish', 0.8); cue(T.fixit, 'ding', 1); cue(T.noons, 'ding', 1); cue(T.before, 'swoosh', 0.8); [0, 1, 2].forEach((i) => cue(T.right + i * 0.3, 'ding', 0.6));
cue(T.trains, 'punch', 1); cue(T.trains + 0.9, 'transition', 0.8); [0.2, 0.9, 1.6].forEach((d) => cue(T.pivot + d, 'notification', 0.8)); cue(T.brand, 'transitionHit', 1);
for (let i = 0; i < 6; i++) cue(T.cal + 0.1 + i * 0.18, 'key', 0.5); cue(T.gcal, 'ding', 1); cue(T.remind, 'notification', 1); cue(T.txt, 'notification', 0.9); cue(T.txt + 0.9, 'swish', 0.8); cue(T.same, 'ding', 1); [0, 1, 2].forEach((i) => cue(T.same + 0.2 + i * 0.2, 'key', 0.5));
cue(T.offer, 'punch', 1); cue(T.offer + 0.7, 'ding', 0.9); cue(T.end, 'swish', 0.8); cue(T.cta, 'tap', 1.2);
boot({ duration: DURATION, scenes: SCENES, brandAt: T.brand, hideCaption: (t) => t >= T.end - 0.1,
  after: (t) => { const f = 1 - seg(t, T.brand, T.brand + 0.12); if (t >= T.brand && f > 0) { ctx.fillStyle = rgba('#ffffff', 0.5 * f); ctx.fillRect(0, 0, W, H); } } }, 'railway');
