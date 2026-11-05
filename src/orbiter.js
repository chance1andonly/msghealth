// MsgHealth · "Ask Dave" · story-hook vertical ad (1080 × 1920, 30 fps), built on src/kit.js.
// Real story, nudged: in 1999 NASA lost the $125M Mars Climate Orbiter after one team used pounds and another metric.
// (The "ask Dave" sticky note is the absurd part.) Pivot: sometimes you just need a real person; MsgHealth puts one a
// tap away (Help → Contact a Representative). Then the 50%-off-first-month offer.
// Voiceover: assets/audio/orbiter/vo-NN.wav, timed by VO_AT in src/orbiter-vo.js.
'use strict';
const word = (l, k) => VO_AT[l] + VO_CLIPS[l].chunks[k][1];
const T = {
  lost: word(0, 1), worth: word(0, 3), fly: VO_AT[1], mars: word(1, 1), burn: VO_AT[2], math: word(2, 1), lb: VO_AT[3], metric: word(3, 1), assume: VO_AT[4], checked: word(4, 2),
  note: VO_AT[5], dave: word(5, 3), person: VO_AT[6], real: word(6, 1), brand: VO_AT[7], tap: VO_AT[8], contact: word(8, 1), human: word(8, 2), noguess: VO_AT[9], offer: VO_AT[10], end: VO_AT[11] - 0.1, url: VO_AT[11] + 0.1,
};
T.cta = T.end + 1.25;
const DURATION = +(T.cta + 1.0).toFixed(2);
window.CUES = T; window.SFX = []; const cue = (t, kind, gain) => window.SFX.push({ t, kind, gain });
window.MUSIC = { bpm: 92, root: 45, brandAt: T.brand, mood: 'sneaky' };

function shadow(x, y, rx) { ellipse(x, y, rx, rx * 0.11, 'rgba(0,0,0,0.22)'); }
function space(t, seed = 0) { ctx.fillStyle = vgrad(0, H, '#050914', '#0d1a3a'); ctx.fillRect(0, 0, W, H); for (let i = 0; i < 70; i++) circle(hash(i + seed) * W, hash(i + 40 + seed) * H, 1 + hash(i + 9) * 2.4, `rgba(255,255,255,${0.4 + 0.5 * Math.abs(Math.sin(t * 1.3 + i))})`); }
function earth(x, y, r) { circle(x, y, r, '#2a6fd6'); ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.clip(); ellipse(x - r * 0.3, y - r * 0.2, r * 0.45, r * 0.3, '#3dbb74', 0.4); ellipse(x + r * 0.35, y + r * 0.3, r * 0.3, r * 0.2, '#3dbb74', -0.3); ellipse(x, y - r * 0.85, r * 0.5, r * 0.15, '#f4f8ff'); ctx.restore(); ring(x, y, r + 4, 'rgba(160,210,255,0.5)', 8); }
function marsPlanet(x, y, r) { circle(x, y, r, '#c1502e'); ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.clip(); circle(x - r * 0.3, y - r * 0.3, r * 0.2, '#a53f22'); circle(x + r * 0.35, y + r * 0.1, r * 0.14, '#a53f22'); circle(x - r * 0.1, y + r * 0.5, r * 0.18, '#d9683f'); ellipse(x, y - r * 0.92, r * 0.35, r * 0.1, '#f4e6dc'); ctx.restore(); }
function probe(x, y, s, rot = 0) { // flat orbiter: gold body, two solar panels, a dish
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  fillRR(-250, -34, 170, 68, 4, '#2a4a8a'); fillRR(80, -34, 170, 68, 4, '#2a4a8a'); for (let i = 1; i < 4; i++) { line(-250 + i * 42, -34, -250 + i * 42, 34, '#9fb7e8', 3); line(80 + i * 42, -34, 80 + i * 42, 34, '#9fb7e8', 3); }
  line(-80, 0, -50, 0, '#9aa1a8', 8); line(50, 0, 80, 0, '#9aa1a8', 8); fillRR(-50, -52, 100, 104, 10, '#e5b23a'); fillRR(-50, -52, 100, 22, 10, '#f5d46a'); line(0, -52, 0, -96, '#9aa1a8', 6); ellipse(0, -100, 38, 14, '#e8ecf3'); circle(0, 0, 14, '#1b1f27');
  ctx.restore();
}
function sceneProbe(t) {
  space(t); earth(160, 1480, 360); const k = ease.out(seg(t, 0.2, 1.4)), by = 760 + Math.sin(t * 1.6) * 14;
  xf(CX, by, 0.5 + 0.5 * k, 0, () => probe(CX, by, 1.3, Math.sin(t) * 0.04));
  const b = pop(t, T.worth, 0.35); if (b > 0) xf(CX, 1120, b, 0, () => { fillRR(160, 1050, 760, 140, 70, '#e5b23a'); text('$125,000,000', CX, 1121, 80, 800, '#1b1f27', 'center', -0.02); });
}
function sceneTrip(t) {
  space(t, 5); earth(40, 1500, 280); marsPlanet(1000, 360, 200);
  const k = ease.inOut(seg(t, T.fly, T.burn - 0.2)); const pts = []; for (let i = 0; i <= 40; i++) { const u = i / 40; pts.push([lerp(260, 820, u) + Math.sin(u * Math.PI) * -120, lerp(1350, 470, u) + Math.sin(u * Math.PI) * 60]); }
  ctx.fillStyle = 'rgba(255,255,255,0.5)'; pts.forEach(([x, y], i) => { if (i % 2 === 0) circle(x, y, 6, 'rgba(255,255,255,0.45)'); });
  const i = Math.min(39, Math.floor(k * 40)), p = pts[i], q = pts[Math.min(40, i + 1)]; probe(p[0], p[1], 0.55, Math.atan2(q[1] - p[1], q[0] - p[0]) * 0.5);
  const mo = Math.min(9, 1 + Math.floor(k * 9)); fillRR(250, 160, 580, 150, 40, 'rgba(255,255,255,0.1)'); text(`MONTH ${mo}`, CX, 236, 96, 800, '#fff', 'center', -0.01);
}
function sceneBurn(t) {
  space(t, 9); marsPlanet(CX, 1180, 520);
  const k = seg(t, T.burn, T.math + 1.2), x = lerp(120, 480, ease.in(k)), y = lerp(300, 760, ease.in(k)), boom = seg(t, T.math, T.math + 0.9);
  if (boom < 1) { glow(x, y, 220 * (0.4 + k), '#ff8a3a', 0.6 * (0.4 + k)); }
  if (boom < 0.02) probe(x, y, 0.9, 0.5); else { [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([dx, dy], i) => { const e = ease.out(boom); ctx.save(); ctx.globalAlpha = 1 - boom * 0.6; fillRR(x + dx * e * 260 - 40, y + dy * e * 200 - 30, 80, 60, 8, i % 2 ? '#e5b23a' : '#2a4a8a'); ctx.restore(); }); for (let i = 0; i < 12; i++) { const a = i * 0.52, d = boom * 320; circle(x + Math.cos(a) * d, y + Math.sin(a) * d, 26 * (1 - boom), i % 2 ? '#ffb347' : '#ff5a36'); } }
  const f = pop(t, T.math, 0.3); if (f > 0) xf(CX, 500, f, 0, () => { fillRR(140, 420, 800, 170, 34, '#fff'); text('MATH MISTAKE', CX, 506, 90, 800, '#b3261e', 'center', -0.01); });
}
function office(t) { ctx.fillStyle = '#dfe6ee'; ctx.fillRect(0, 0, W, 1380); ctx.fillStyle = '#9aa7b8'; ctx.fillRect(0, 1380, W, 540); ctx.fillStyle = '#86939f'; ctx.fillRect(0, 1380, W, 14); }
function whiteboard(x, y, w, h, lines) { fillRR(x, y, w, h, 10, '#f8fbff'); strokeRR(x, y, w, h, 10, '#8a97a8', 8); fillRR(x + 20, y + h, w - 40, 14, 6, '#8a97a8'); lines.forEach(([s, c, sz], i) => text(s, x + w / 2, y + 80 + i * 90, sz ?? 60, 800, c, 'center', 0)); }
function sceneTeams(t) {
  office(t); whiteboard(60, 330, 440, 380, [['TEAM A', '#3a4a6a', 40], ['lb·s', '#b3261e', 110]]); whiteboard(580, 330, 440, 380, [['TEAM B', '#3a4a6a', 40], ['N·s', '#2a6fd6', 110]]);
  person(290, 1440, 560, 6, { skin: '#d9a27a', shirt: '#c25a4a', pants: '#3d4a6a', glasses: true, dir: 1, arm: t > T.assume ? 'up' : 'down', wave: t, mouth: 'open' });
  person(790, 1440, 560, 14, { skin: '#c68a62', shirt: '#4a7fc2', pants: '#3d424f', dir: -1, arm: t > T.assume ? 'up' : 'down', wave: t + 1, mouth: 'open', hairStyle: 'none' });
  const a = pop(t, T.lb, 0.3), b = pop(t, T.metric, 0.3);
  if (a > 0 && t < T.assume) xf(290, 810, a, 0, () => { fillRR(160, 770, 260, 90, 45, '#fff'); text('"Pounds!"', 290, 816, 40, 800, '#b3261e', 'center'); }); if (b > 0 && t < T.assume) xf(790, 810, b, 0, () => { fillRR(660, 770, 260, 90, 45, '#fff'); text('"Metric!"', 790, 816, 40, 800, '#2a6fd6', 'center'); });
  [[290, 'I thought YOU checked'], [790, 'No, I thought YOU did']].forEach(([x, s], i) => { const k = pop(t, T.checked - 0.4 + i * 0.5, 0.3); if (t > T.assume && k > 0) xf(x, 810, k, 0, () => { fillRR(x - 190, 760, 380, 100, 36, '#fff'); text(s, x, 811, 28, 800, '#1b1f27', 'center'); }); });
}
function sceneNote(t) {
  ctx.fillStyle = '#0d1426'; ctx.fillRect(0, 0, W, H);
  for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++) { const x = 70 + c * 320, y = 200 + r * 280; fillRR(x, y, 290, 250, 12, '#1a2540'); fillRR(x + 12, y + 12, 266, 226, 6, '#0a0f1c'); text('NO SIGNAL', x + 145, y + 125, 38, 800, 'rgba(255,90,70,' + (0.5 + 0.4 * Math.sin(t * 5 + r * 2 + c)) + ')', 'center', 0.08); }
  ctx.fillStyle = '#2a3552'; ctx.fillRect(0, 1260, W, 660); ctx.fillStyle = '#35436a'; ctx.fillRect(0, 1260, W, 40); // the console desk
  fillRR(120, 1000, 300, 180, 10, '#1b1f27'); fillRR(136, 1014, 268, 140, 6, '#0b1220'); fillRR(250, 1180, 40, 80, 4, '#1b1f27'); text('ERR', 270, 1085, 50, 800, '#ff5a46', 'center'); // a dead monitor
  const n = pop(t, T.note, 0.45), wob = Math.sin(t * 1.4) * 0.02;
  xf(640, 1020, clamp(n), 0, () => { ctx.save(); ctx.translate(640, 1040); ctx.rotate(-0.06 + wob); ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 10; fillRR(-200, -200, 400, 400, 6, '#ffe45e'); ctx.shadowBlur = 0; ctx.shadowOffsetY = 0; fillRR(-200, -200, 400, 50, 6, '#f2d23a');
    const q = seg(t, T.dave - 0.5, T.dave + 0.5), s = 'ask Dave', k = Math.floor(s.length * q); text(s.slice(0, k), 0, 20, 96, 800, '#2a3a8a', 'center', 0); ctx.restore(); });
  fillRR(740, 1210, 200, 130, 14, '#6b4a34'); ellipse(840, 1210, 100, 22, '#8a5f3a'); // an abandoned mug on the console
}
function scenePerson(t) {
  office(t); person(CX - 40, 1450, 640, 9, { skin: '#d9a27a', shirt: '#6c8ebf', pants: '#3d424f', glasses: true, arm: 'phone', mouth: 'open', eyes: 'wide', dir: 1, bounce: t * 2 });
  const q = pop(t, T.person + 0.3, 0.35); if (q > 0) xf(CX, 560, q, 0, () => { fillRR(CX - 300, 380, 600, 220, 50, '#fff'); text('Who do I ask?', CX, 490, 84, 800, '#1b1f27', 'center', -0.01); poly([[CX - 30, 600], [CX + 30, 600], [CX - 20, 670]], '#fff'); });
}
// ═════════════ the product ═════════════
function sceneHelp(t) {
  stage(t, 0.22);
  withFade(enter(t, T.tap - 0.05, T.noguess, 0.2), () => {
    eyebrow('HUMAN SUPPORT', 300); const menu = t > T.tap + 0.9, chat = t > T.contact + 0.35;
    phone(210, 340, 660, 1090, '#f4f1ea', () => {
      if (!chat) {
        text('MsgHealth', 40, 108, 36, 800, '#1e1b4b', 'left');
        fillRR(40, 170, 580, 240, 26, '#fff'); text('Today', 70, 215, 22, 700, '#6b6a80', 'left', 0.1); text('4 appointments', 70, 270, 40, 800, '#1e1b4b', 'left'); text('2 clients need attention', 70, 330, 26, 500, '#6b6a80', 'left');
        const pr = 0.5 + 0.5 * Math.sin(t * 5); fillRR(460, 930, 160, 80, 40, C.primary); text('Help', 540, 971, 34, 800, '#fff', 'center'); if (!menu) ring(540, 970, 52 + pr * 8, rgba(C.primary, 0.5), 6);
        if (menu) { const m = ease.out(seg(t, T.tap + 0.9, T.tap + 1.25)); ctx.save(); ctx.translate(0, (1 - m) * 300); fillRR(30, 600, 600, 380, 34, '#fff'); strokeRR(30, 600, 600, 380, 34, '#e3e0f7', 3); text('How can we help?', 70, 660, 32, 800, '#1e1b4b', 'left');
          ['Help articles', 'Contact a Representative'].forEach((s, i) => { const y = 710 + i * 120, hot = i === 1; fillRR(60, y, 540, 96, 24, hot ? C.primary : '#f4f1ea'); text(s, 330, y + 49, 32, 800, hot ? '#fff' : '#1e1b4b', 'center'); }); ctx.restore(); }
      } else {
        fillRR(0, 80, 660, 110, 0, '#fff'); avatar(70, 135, 36, 'D', '#0ea5a4'); text('Dana', 128, 122, 32, 800, '#1e1b4b', 'left'); circle(142, 158, 7, GREEN); text('MsgHealth support · online', 158, 159, 22, 500, '#6b6a80', 'left');
        const m1 = pop(t, T.contact + 0.45, 0.3), m2 = pop(t, T.contact + 1.3, 0.3), m3 = pop(t, T.human, 0.3);
        const bub = (x, y, w, h, s, out, k) => { if (k <= 0) return; xf(x + w / 2, y + h / 2, clamp(k), 0, () => { fillRR(x, y, w, h, 28, out ? C.primary : '#fff'); if (!out) strokeRR(x, y, w, h, 28, '#e3e0f7', 2); s.forEach((l, i) => text(l, x + 28, y + 40 + i * 42, 28, 600, out ? '#fff' : '#1e1b4b', 'left')); }); };
        bub(40, 250, 470, 130, ['Hi! I\'m Dana, a real person.', 'How can I help?'], false, m1); bub(130, 420, 490, 90, ['Can you set up my booking page?'].map((s) => s), true, m2); bub(40, 550, 470, 90, ['Of course! Let\'s do it together.'], false, m3);
      }
    });
  });
}
function sceneNoNotes(t) {
  stage(t, 0.26);
  withFade(enter(t, T.noguess - 0.05, T.offer, 0.15), () => {
    const a = pop(t, T.noguess, 0.3), b = pop(t, T.noguess + 0.8, 0.3);
    xf(CX, 600, clamp(a), 0, () => text('NO GUESSING.', CX, 600, 104, 800, '#fff', 'center', -0.03));
    xf(CX, 900, clamp(b), 0, () => { ctx.save(); ctx.translate(CX, 900); ctx.rotate(-0.06); fillRR(-170, -170, 340, 340, 6, '#ffe45e'); text('ask Dave', 0, 10, 72, 800, '#2a3a8a', 'center', 0); ctx.restore(); ring(CX, 900, 250, RED, 22); line(CX - 176, 724, CX + 176, 1076, RED, 22); });
  });
}
const SCENES = [[0, T.fly, sceneProbe], [T.fly, T.burn, sceneTrip], [T.burn, T.lb, sceneBurn], [T.lb, T.note, sceneTeams], [T.note, T.person, sceneNote], [T.person, T.brand, scenePerson],
  [T.brand, T.tap, (t) => brandHit(t, T.brand, T.tap)], [T.tap, T.noguess, sceneHelp], [T.noguess, T.offer, sceneNoNotes], [T.offer, T.end, (t) => offerCard(t, T.offer, T.end)], [T.end, 999, (t) => endCard(t, T.end, T.cta, T.url)]];
cue(T.worth, 'ding', 0.9); cue(T.fly, 'swoosh', 0.8); cue(T.burn, 'swoosh', 0.9); cue(T.math, 'punch', 1); cue(T.lb, 'swish', 0.7); cue(T.lb + 0.1, 'tap', 0.7); cue(T.metric, 'tap', 0.7); cue(T.checked - 0.4, 'notification', 0.7); cue(T.checked + 0.1, 'notification', 0.7);
cue(T.note, 'punch', 0.9); for (let i = 0; i < 8; i++) cue(T.dave - 0.5 + i * 0.12, 'key', 0.4); cue(T.person + 0.3, 'swish', 0.7); cue(T.brand, 'transitionHit', 1); cue(T.tap + 0.7, 'tap', 1); cue(T.tap + 0.9, 'swish', 0.8); cue(T.contact, 'tap', 1); cue(T.contact + 0.45, 'notification', 0.9); cue(T.contact + 1.3, 'notification', 0.8); cue(T.human, 'notification', 1);
cue(T.noguess, 'punch', 1); cue(T.noguess + 0.8, 'punch', 1); cue(T.offer, 'punch', 1); cue(T.offer + 0.7, 'ding', 0.9); cue(T.end, 'swish', 0.8); cue(T.cta, 'tap', 1.2);
boot({ duration: DURATION, scenes: SCENES, brandAt: T.brand, hideCaption: (t) => t >= T.end - 0.1,
  after: (t) => { const f = 1 - seg(t, T.brand, T.brand + 0.12); if (t >= T.brand && f > 0) { ctx.fillStyle = rgba('#ffffff', 0.5 * f); ctx.fillRect(0, 0, W, H); } } }, 'orbiter');
