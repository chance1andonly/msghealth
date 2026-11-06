// MsgHealth · "Project Pigeon" v2 · "stay in the story" vertical ad (1080 × 1920, 30 fps), built on kit.js + story-kit.js + soft-kit.js.
// Same real story as pigeon.js (1940s: Skinner trained pigeons to peck at a picture of a target to guide a missile; cancelled before
// use). INVENTED: nobody told the pigeons, and they are still pecking. Format change for retention: no pivot line and no product
// section. The product is a one-line joke inside the story ("these days, Message Health's workflow builder does the pecking, it
// doesn't need grain") with a small workflow card popping into the lab, then the story pays off ("the pigeons are still pecking").
// The only ad element is a small end tag. Card text is illustrative. Voiceover: assets/audio/pigeon2/vo-NN.wav.
'use strict';
const word = (l, k) => VO_AT[l] + VO_CLIPS[l].chunks[k][1];
const T = {
  pigeons: word(0, 1), train: VO_AT[1], picture: word(1, 1), target: word(1, 2), worked: VO_AT[2], allday: word(2, 1), complained: word(2, 2), cancelled: VO_AT[3], told: VO_AT[4],
  gag: VO_AT[5], builder: word(5, 1), grain: word(5, 2), still: VO_AT[6], stillw: word(6, 0),
};
T.tag = T.still + 1.0;
const DURATION = +(VO_AT[6] + VO_CLIPS[6].dur + 2.4).toFixed(2);
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

function sceneStill(t, quiet) {
  const lt = t - T.told, night = 0.5 + 0.5 * Math.sin(lt * 1.6); lab(); ctx.fillStyle = `rgba(14,18,40,${0.1 + 0.35 * night})`; ctx.fillRect(0, 0, W, H);
  targetScreen(CX, 280, 780, 500, 1, t); clockFace(900, 150, 80, lt * 3, lt * 36); pigeon(CX, 1640, 3.0, t, { peck: true, rate: 11 });
  if (!quiet) { const a = appear(t, T.told, 0.35); if (a > 0) xf(CX, 1030, a, 0, () => banner('NOBODY TOLD THEM', CX, 1000, 76, '#2a3a2a', '#f2c84a')); const b = appear(t, T.told + 1.2, 0.3); if (b > 0) xf(CX, 1130, b, 0, () => text('…still pecking', CX, 1120, 52, 800, 'rgba(30,40,30,0.75)', 'center', 0.02)); }
}
function sceneGag(t) {
  sceneStill(t, true); const on = t > T.builder + 0.6;
  cameo(t, T.gag + 0.3, 999, CX, 760, 720, 420, () => { ltext('Workflow builder', 36, 62, 32, 800); fillRR(560, 38, 96, 50, 25, on ? LGREEN : '#cfcfdc'); circle(on ? 632 : 584, 63, 19, '#fff');
    [['When', 'Customer is at risk', '#d6402f'], ['Send', 'SMS check-in', '#4f46e5'], ['Wait 2 days, then', 'Send email', '#4f46e5']].forEach(([a, b, c], i) => { const e = pop(t, T.gag + 0.7 + i * 0.4, 0.3), y = 120 + i * 96; if (e > 0) xf(360, y + 40, clamp(e), 0, () => { circle(66, y + 40, 24, c); ltext(String(i + 1), 66, y + 41, 24, 800, '#fff', 'center'); ltext(a, 110, y + 24, 18, 800, LMUTED); ltext(b, 110, y + 58, 28, 800); if (on) lcheck(650, y + 40, 16); }); }); }, 0.02);
  const g = appear(t, T.grain, 0.35); if (g > 0) xf(CX, 1180, g, 0, () => banner('NO GRAIN NEEDED', CX, 1100, 70, '#2a3a2a', '#f2c84a'));
}
function sceneEnd(t) { sceneStill(t - 0, true); const a = appear(t, T.still, 0.3); if (a > 0) xf(CX, 1040, a, 0, () => banner('STILL PECKING', CX, 1000, 80, '#2a3a2a', '#f2c84a')); endTag(t, T.tag); }
const SCENES = [[0, T.train, sceneMissile], [T.train, T.worked, sceneTrain], [T.worked, T.cancelled, sceneWorked], [T.cancelled, T.told, sceneCancelled], [T.told, T.gag, (t) => sceneStill(t, false)], [T.gag, T.still, sceneGag], [T.still, 999, sceneEnd]];
cue(0.4, 'swish', 0.7); cue(T.pigeons, 'punch', 1); cue(T.train, 'swoosh', 0.8); cue(T.picture, 'ding', 0.8); cue(T.target, 'punch', 1); for (let i = 0; i < 6; i++) cue(T.worked + i * 0.5, 'tap', 0.5); cue(T.complained, 'ding', 0.9);
cue(T.cancelled, 'swish', 0.7); cue(T.cancelled + 0.4, 'punch', 1.1); cue(T.told, 'punch', 0.9); cue(T.gag + 0.3, 'notification', 1); for (let i = 0; i < 3; i++) cue(T.gag + 0.7 + i * 0.4, 'key', 0.6); cue(T.builder + 0.6, 'ding', 1); cue(T.grain, 'punch', 0.9); cue(T.still, 'punch', 0.9); cue(T.tag, 'tap', 0.8);
boot({ duration: DURATION, scenes: SCENES, brandAt: 999 }, 'pigeon2');
