// MsgHealth · "Project Pigeon" · story-hook vertical ad (1080 × 1920, 30 fps), built on src/kit.js + story-kit.js + soft-kit.js.
// Real story: in the 1940s the psychologist B. F. Skinner trained pigeons to peck at a picture of a target, to guide a missile
// ("Project Pigeon"). It worked in the lab, but the project was cancelled before it was ever used.
// INVENTED (the absurd part): nobody told the pigeons, and they are still pecking.
// Pivot: some work should just run itself. MsgHealth's workflow builder / Retention Autopilot follows up, sends reminders and wins
// customers back (SMS and email automations). The product is a phone over the story's art, light UI, no logo screen.
// Voiceover: assets/audio/pigeon/vo-NN.wav (src/pigeon-vo.js).
'use strict';
const word = (l, k) => VO_AT[l] + VO_CLIPS[l].chunks[k][1];
const T = {
  pigeons: word(0, 1), train: VO_AT[1], picture: word(1, 1), target: word(1, 2), worked: VO_AT[2], allday: word(2, 1), complained: word(2, 2), cancelled: VO_AT[3], told: VO_AT[4],
  pivot: VO_AT[5], runs: word(5, 1), brand: VO_AT[6], follows: word(6, 1), back: word(6, 2), once: VO_AT[7], never: word(7, 1), nopig: VO_AT[8], offer: VO_AT[9], url: VO_AT[10],
};
const DURATION = +(T.url + 2.2).toFixed(2);
window.CUES = T; window.SFX = []; const cue = (t, kind, gain) => window.SFX.push({ t, kind, gain });
window.MUSIC = { bpm: 116, root: 50, brandAt: 999, mood: 'quirky' };

function pigeon(x, y, s, t, o = {}) { // feet at (x, y)
  const d = o.dir ?? 1, pk = o.peck ? Math.max(0, Math.sin(t * (o.rate ?? 12) + (o.ph ?? 0))) : 0; shadow(x, y, 80 * s);
  ctx.save(); ctx.translate(x, y); ctx.scale(d * s, s);
  line(-14, -34, -14, 0, '#d98a8a', 8); line(20, -34, 20, 0, '#d98a8a', 8); line(-14, 0, -32, 2, '#d98a8a', 8); line(20, 0, 2, 2, '#d98a8a', 8);
  poly([[-60, -78], [-118, -50], [-60, -50]], '#6f7a8e'); ellipse(0, -76, 74, 48, '#8b95a8'); ellipse(-14, -80, 48, 28, '#6f7a8e'); ellipse(48, -100, 24, 36, '#7a98a0');
  circle(64 + pk * 16, -122 + pk * 38, 27, '#6f7a8e'); poly([[86 + pk * 16, -126 + pk * 38], [118 + pk * 16, -116 + pk * 38], [86 + pk * 16, -108 + pk * 38]], '#e8b87a'); circle(70 + pk * 16, -130 + pk * 38, 6, '#f08a2a'); circle(71 + pk * 16, -130 + pk * 38, 3, '#1b1f27');
  ctx.restore();
}
function sky(t) { backdrop(1250, '#9fc3e6', '#f1e9d8', '#8a9a5a', '#5f7340'); cloud(60 + (t * 12) % 200, 240, 0.9, 'rgba(255,255,255,0.9)'); cloud(680, 420, 0.7, 'rgba(255,255,255,0.8)'); }
function sceneMissile(t) {
  sky(t); const k = appear(t, 0.2, 0.45); withFade(seg(t, 0.1, 0.4), () => text('1940s', CX, 190, 150, 800, '#2a3a2a', 'center', -0.02));
  xf(CX, 1000, 0.7 + 0.3 * k, 0, () => { ctx.globalAlpha = k; shadow(CX, 1500, 420); fillRR(300, 1280, 40, 220, 6, '#5a4a3a'); fillRR(720, 1280, 40, 220, 6, '#5a4a3a'); fillRR(280, 1260, 520, 24, 6, '#3a2f26');
    fillRR(120, 1010, 760, 260, 40, '#c9d2c8'); poly([[880, 1010], [1040, 1140], [880, 1270]], '#d9462d'); fillRR(120, 1010, 760, 40, 20, '#9aa59a'); poly([[120, 1010], [60, 880], [220, 1010]], '#d9462d'); poly([[120, 1270], [60, 1400], [220, 1270]], '#d9462d');
    for (let i = 0; i < 4; i++) fillRR(300 + i * 120, 1060, 18, 170, 4, '#2a6bd9'); circle(930, 1135, 60, '#bfe3f5'); strokeRR(870, 1075, 120, 120, 60, '#3a4a5a', 8); ctx.save(); ctx.beginPath(); ctx.arc(930, 1135, 54, 0, 7); ctx.clip(); pigeon(930, 1195, 0.55, t, { peck: true, rate: 10 }); ctx.restore(); });
  const b = appear(t, T.pigeons, 0.35); if (b > 0) xf(CX, 560, b, 0, () => banner('PIGEON-GUIDED MISSILE', CX, 520, 66, '#2a3a2a', '#f2c84a'));
}
function lab() { ctx.fillStyle = '#e4e8e2'; ctx.fillRect(0, 0, W, 1250); ctx.fillStyle = '#a7aea0'; ctx.fillRect(0, 1250, W, 670); ctx.fillStyle = 'rgba(0,0,0,0.08)'; ctx.fillRect(0, 1250, W, 30); }
function targetScreen(x, y, w, h, lock, t) { fillRR(x - w / 2 - 14, y - 14, w + 28, h + 28, 24, '#3a4048'); fillRR(x - w / 2, y, w, h, 14, '#0d5a7a'); ctx.save(); rr(x - w / 2, y, w, h, 14); ctx.clip(); ctx.fillStyle = '#d9c28a'; ctx.fillRect(x - w / 2, y + h * 0.72, w, h * 0.28); fillRR(x - w * 0.25, y + h * 0.5, w * 0.5, h * 0.22, 6, '#4a5560'); poly([[x - w * 0.25, y + h * 0.5], [x - w * 0.12, y + h * 0.32], [x + w * 0.16, y + h * 0.32], [x + w * 0.25, y + h * 0.5]], '#5a6772'); fillRR(x - w * 0.02, y + h * 0.16, 14, h * 0.2, 4, '#3a4048');
  if (lock > 0) { const r = lerp(w * 0.45, w * 0.17, ease.out(lock)); ring(x, y + h * 0.5, r, '#e0392d', 6); line(x - r - 30, y + h * 0.5, x + r + 30, y + h * 0.5, '#e0392d', 4); line(x, y + h * 0.5 - r - 30, x, y + h * 0.5 + r + 30, '#e0392d', 4); } ctx.restore(); }
function sceneTrain(t) {
  lab(); const p = appear(t, T.picture - 0.2, 0.4), lk = seg(t, T.target - 0.1, T.target + 0.5); xf(CX, 560, 0.8 + 0.2 * p, 0, () => { ctx.globalAlpha = p; targetScreen(CX, 280, 800, 560, lk, t); });
  [[200, 0], [500, 1.1], [790, 2.2]].forEach(([x, ph], i) => pigeon(x, 1640, 1.6, t, { peck: t > T.train + 0.5, ph, rate: 11 + i }));
  person(950, 1650, 400, 31, { skin: '#d9a27a', shirt: '#f4f4f4', pants: '#3d424f', glasses: true, arm: 'phone', dir: -1 });
  const b = appear(t, T.train, 0.35); if (b > 0) xf(CX, 130, b, 0, () => banner('TRAINED TO PECK', CX, 130, 76, '#2a3a2a', '#f2c84a')); const c = appear(t, T.target, 0.3); if (c > 0) xf(CX, 1020, c, 0, () => banner('TARGET LOCKED', CX, 1000, 66, '#b3261e'));
}
function sceneWorked(t) {
  lab(); const lt = t - T.worked, n = Math.floor(clamp(lt / 3.5) * 9840 + (lt > 0 ? lt * 211 : 0));
  targetScreen(CX, 230, 800, 480, 1, t); [90, 270, 450, 630, 810, 990].forEach((x, i) => pigeon(x, 1560 + (i % 2) * 90, 1.3 + (i % 2) * 0.2, t, { peck: true, ph: i * 0.9, rate: 15 + i % 3 * 2 }));
  fillRR(250, 780, 580, 170, 30, '#14161c'); text('PECKS', CX, 822, 30, 800, '#8a93a0', 'center', 0.3); text(String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','), CX, 897, 92, 800, '#9ff0c0', 'center', -0.01);
  const b = appear(t, T.complained, 0.35); if (b > 0) xf(CX, 1090, b, 0, () => banner('COMPLAINTS: 0', CX, 1090, 80, '#2f8a54'));
}
function sceneCancelled(t) {
  ctx.fillStyle = '#7a6a4a'; ctx.fillRect(0, 0, W, H); ctx.fillStyle = '#6a5a3c'; ctx.fillRect(0, 1250, W, 670);
  const k = appear(t, T.cancelled - 0.2, 0.4); xf(CX, 800, 0.8 + 0.2 * k, 0, () => { ctx.globalAlpha = k; ctx.save(); ctx.translate(CX, 800); ctx.rotate(-0.03); ctx.shadowColor = 'rgba(0,0,0,0.4)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 18; fillRR(-380, -420, 760, 840, 12, '#f4efe0'); ctx.shadowColor = 'transparent'; text('PROJECT', 0, -340, 80, 800, '#3a3226', 'center', 0.12); text('PIGEON', 0, -210, 150, 800, '#3a3226', 'center', 0.04);
    for (let i = 0; i < 6; i++) fillRR(-300, -90 + i * 52, 600 - (i % 3) * 120, 14, 4, '#c9c0a8'); ctx.restore(); });
  const s = pop(t, T.cancelled + 0.4, 0.25); if (s > 0) xf(CX, 880, clamp(s), 0, () => { ctx.save(); ctx.translate(CX + shake(t, T.cancelled + 0.4, 10), 940); ctx.rotate(-0.18); strokeRR(-340, -110, 680, 220, 18, '#d9462d', 18); text('CANCELLED', 0, 6, 120, 800, '#d9462d', 'center', 0.02); ctx.restore(); });
}
function sceneStill(t) {
  const lt = t - T.told, night = 0.5 + 0.5 * Math.sin(lt * 1.6); lab(); ctx.fillStyle = `rgba(14,18,40,${0.1 + 0.35 * night})`; ctx.fillRect(0, 0, W, H);
  targetScreen(CX, 280, 780, 500, 1, t); clockFace(900, 150, 80, lt * 3, lt * 36); pigeon(CX, 1640, 3.0, t, { peck: true, rate: 11 });
  const a = appear(t, T.told, 0.35); if (a > 0) xf(CX, 1030, a, 0, () => banner('NOBODY TOLD THEM', CX, 1000, 76, '#2a3a2a', '#f2c84a'));
  const b = appear(t, T.told + 1.2, 0.3); if (b > 0) xf(CX, 1130, b, 0, () => text('…still pecking', CX, 1120, 52, 800, 'rgba(30,40,30,0.75)', 'center', 0.02));
}
function sceneChores(t, frozen) {
  ctx.fillStyle = '#e9dfd0'; ctx.fillRect(0, 0, W, 1250); ctx.fillStyle = '#9a8a74'; ctx.fillRect(0, 1250, W, 670); fillRR(0, 1180, W, 70, 0, '#cbb99d'); fillRR(70, 240, 220, 300, 8, '#cfe7f3'); strokeRR(70, 240, 220, 300, 8, '#8a7a64', 8);
  person(540, 1570, 620, 9, { skin: '#d9a27a', shirt: '#6c8ebf', pants: '#3d424f', glasses: true, arm: 'up', wave: t * 2, eyes: 'wide', mouth: 'open', noShadow: true }); fillRR(0, 1280, W, 640, 0, '#7a5a3a'); fillRR(0, 1280, W, 30, 0, '#a07852');
  const gone = frozen ? 1 : seg(t, T.runs, T.runs + 0.8);
  [['Follow up with', 'Priya', 180, 640, '#ffe27a'], ['Send the', 'reminders', 880, 560, '#ffb3a7'], ['Win back', 'Jordan', 170, 900, '#b5e8c9'], ['Rebook', 'Ava?', 890, 880, '#c7d7ff']].forEach(([a, b, x, y, c], i) => { const e = appear(t, T.pivot + 0.1 + i * 0.3, 0.3) * (1 - gone); if (e > 0.01) xf(x, y - gone * 300, e, 0, () => postit(x, y + sine(t + i, 2, 6), 220, [a, b], sine(i, 7, 0.08), c)); });
  const b = appear(t, T.runs, 0.35); if (b > 0 && !frozen) xf(CX, 350, b, 0, () => banner('RUN ITSELF.', CX, 380, 100, '#2a3a5a'));
}
const STEPS = [['When', 'Customer is at risk', '#d6402f'], ['Send', 'SMS check-in', '#4f46e5'], ['Wait', '2 days', '#6b6a80'], ['Send', 'Email with booking link', '#4f46e5'], ['Invite', 'to book a time', '#1f9d55']];
function flowPhone(t) {
  lcard(20, 20, 580, 110, 24); ltext('Retention Autopilot', 50, 62, 30, 800); const on = t > T.once + 0.3; fillRR(480, 48, 96, 52, 26, on ? LGREEN : '#cfcfdc'); circle(on ? 550 : 506, 74, 20, '#fff'); ltext(on ? 'Running' : 'Paused', 50, 100, 20, 700, on ? LGREEN : LMUTED);
  STEPS.forEach(([a, b, c], i) => { const at = i < 3 ? T.follows + i * 0.45 - 0.5 : T.back + (i - 3) * 0.55 - 0.1, e = pop(t, Math.max(T.brand + 0.4 + i * 0.12, at), 0.3), y = 190 + i * 140; if (i) { const l = seg(t, T.brand + 0.4 + i * 0.12, T.brand + 0.7 + i * 0.12); if (l > 0) line(100, y - 40, 100, y - 40 + 40 * l, LLINE, 6); }
    if (e > 0) xf(310, y + 40, clamp(e), 0, () => { lcard(20, y, 580, 100, 22); circle(80, y + 50, 28, c); ltext(String(i + 1), 80, y + 51, 26, 800, '#fff', 'center'); ltext(a, 128, y + 34, 18, 800, LMUTED); ltext(b, 128, y + 68, 28, 800); if (on) lcheck(556, y + 50, 18); }); });
  const r = pop(t, T.never, 0.35); if (r > 0) xf(310, 880, clamp(r), 0, () => { fillRR(110, 830, 400, 60, 30, rgba(LGREEN, 0.14)); ltext('Runs on its own, 24/7', 310, 861, 24, 800, LGREEN, 'center'); });
}
const SCENES = [[0, T.train, sceneMissile], [T.train, T.worked, sceneTrain], [T.worked, T.cancelled, sceneWorked], [T.cancelled, T.told, sceneCancelled], [T.told, T.pivot, sceneStill], [T.pivot, T.brand, (t) => sceneChores(t, false)],
  [T.brand, T.offer, (t) => { sceneChores(t, true); phoneOver(t, T.brand, T.offer, flowPhone); }], [T.offer, 999, (t) => { sceneStill(t - 3 + (t < 0 ? 0 : 0)); const a = appear(t, T.nopig, 0.3); offerStrip(t, T.offer + 0.1); }]];
cue(0.4, 'swish', 0.7); cue(T.pigeons, 'punch', 1); cue(T.train, 'swoosh', 0.8); cue(T.picture, 'ding', 0.8); cue(T.target, 'punch', 1); for (let i = 0; i < 6; i++) cue(T.worked + i * 0.5, 'tap', 0.5); cue(T.complained, 'ding', 0.9);
cue(T.cancelled, 'swish', 0.7); cue(T.cancelled + 0.4, 'punch', 1.1); cue(T.told, 'punch', 0.9); cue(T.pivot, 'swish', 0.7); for (let i = 0; i < 4; i++) cue(T.pivot + 0.1 + i * 0.3, 'notification', 0.6); cue(T.runs, 'swoosh', 0.9);
cue(T.brand, 'swoosh', 0.7); for (let i = 0; i < 5; i++) cue(T.brand + 0.4 + i * 0.2, 'key', 0.5); cue(T.once + 0.3, 'ding', 1); cue(T.offer + 0.1, 'ding', 0.9); cue(T.url, 'tap', 0.8);
boot({ duration: DURATION, scenes: SCENES, brandAt: 999 }, 'pigeon');
