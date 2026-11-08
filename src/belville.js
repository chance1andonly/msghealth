// MsgHealth · "The time lady" · story-hook vertical ad (1080 × 1920, 30 fps), built on src/kit.js + src/audit.js.
// Real story: from 1836 the Belville family sold the exact Greenwich time to Londoners, carrying a watch from the Observatory on a
// weekly route; Ruth Belville kept it going until 1940. Pivot: clients book you the same way, a time and someone showing up; forgotten
// bookings are empty chairs. MsgHealth handles bookings and reminders. Offer: free retention audit, comment KEEP. Voiceover: assets/audio/belville/.
'use strict';
const word = (l, k) => VO_AT[l] + VO_CLIPS[l].chunks[k][1];
const T = { obs: VO_AT[0], london: word(0, 2), sold: VO_AT[1], ruth: VO_AT[2], watch: word(2, 1), clients: word(2, 2), cent: VO_AT[3], over: word(3, 1), sched: VO_AT[4], book: VO_AT[5], forget: VO_AT[6], chair: word(6, 1),
  brand: VO_AT[7], rem: word(7, 1), show: VO_AT[8], ask: VO_AT[9], cmt: VO_AT[10], end: VO_AT[11] - 0.1, url: VO_AT[11] + 0.1 };
T.bk = T.brand + 1.4; T.cta = T.end + 1.25;
const DURATION = +(T.cta + 1.0).toFixed(2);
window.CUES = T; window.SFX = []; const cue = (t, kind, gain) => window.SFX.push({ t, kind, gain });
window.MUSIC = { bpm: 92, root: 45, brandAt: T.brand, mood: 'quirky', bed: false, fx: 0.5 };

function clockFace(x, y, r, h, m, col = '#fff', ink = '#2b2b30') { circle(x, y, r, col); ring(x, y, r, ink, r * 0.06); for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; line(x + Math.sin(a) * r * 0.84, y - Math.cos(a) * r * 0.84, x + Math.sin(a) * r * 0.94, y - Math.cos(a) * r * 0.94, ink, r * 0.04); }
  line(x, y, x + Math.sin(h) * r * 0.5, y - Math.cos(h) * r * 0.5, ink, r * 0.07); line(x, y, x + Math.sin(m) * r * 0.78, y - Math.cos(m) * r * 0.78, ink, r * 0.05); circle(x, y, r * 0.06, ink); }
function dawn() { ctx.fillStyle = vgrad(0, 1200, '#f3d9b8', '#e8a56a'); ctx.fillRect(0, 0, W, 1200); ctx.fillStyle = '#7b8f5a'; ctx.fillRect(0, 1200, W, 720); ellipse(300, 1200, 700, 220, '#8da368'); }
function sceneObs(t) {
  dawn(); text('1836', CX, 230, 160, 800, 'rgba(70,40,20,0.85)', 'center', -0.02);
  fillRR(190, 740, 420, 460, 6, '#e9dcc3'); ctx.beginPath(); ctx.arc(400, 740, 190, Math.PI, 0); ctx.fillStyle = '#7b8aa0'; ctx.fill(); fillRR(385, 560, 30, 190, 4, '#2b2b30'); fillRR(380, 700, 40, 60, 4, '#1b1b20'); fillRR(250, 860, 100, 150, 4, '#6b4a34'); fillRR(450, 860, 100, 150, 4, '#6b4a34'); fillRR(340, 1040, 120, 160, 4, '#6b4a34');
  const ball = ease.out(seg(t, T.obs + 0.3, T.obs + 1.2)); circle(400, lerp(640, 520, 1 - ball), 36, '#e5484d'); clockFace(400, 920, 0, 0, 0);
  const l = pop(t, T.london - 0.1, 0.4); if (l > 0) xf(850, 900, clamp(l), 0, () => { [[760, 1180, 150], [880, 1120, 220], [980, 1170, 130]].forEach(([x, y, h]) => fillRR(x - 40, y - h, 80, h, 4, '#6e6a78')); [[760, 0.4], [880, 2.3], [980, 4.7]].forEach(([x, a], i) => { clockFace(x, 880 + i * 20, 40, a, a * 2.1); }); text('?', 870, 740, 120, 800, '#b3261e', 'center', 0); });
}
function watch(x, y, s, t) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); line(0, -230, 0, -300, '#c9a24a', 14); ring(0, -310, 34, '#c9a24a', 12); circle(0, 0, 210, '#e6c566'); ring(0, 0, 210, '#b88a2a', 10); clockFace(0, 0, 175, 5.2 + Math.sin(t) * 0.01, 0.9 + t * 0.3, '#fffaf0', '#3a2a14'); ctx.restore(); }
function sceneWatch(t) {
  dawn(); const k = pop(t, T.sold, 0.45); glow(CX, 760, 520, '#fff2b0', 0.45 * clamp(k)); xf(CX, 760, clamp(k), 0, () => watch(CX, 760, 1.5, t));
  const s = pop(t, T.sold + 0.5, 0.35); if (s > 0) xf(CX, 1260, clamp(s), 0, () => { const lb = 'THE EXACT TIME · FOR SALE', w = tw(lb, 34, 800, 0.1) + 80; fillRR(CX - w / 2, 1200, w, 100, 50, '#1b1b20'); text(lb, CX, 1252, 34, 800, '#ffd84d', 'center', 0.1); });
}
function sceneRoute(t) {
  ctx.fillStyle = '#efe0c0'; ctx.fillRect(0, 0, W, H); fillRR(90, 260, 900, 930, 20, '#f6ead0'); strokeRR(90, 260, 900, 930, 20, '#c9a56a', 8);
  const pts = [[220, 1040], [360, 760], [600, 860], [780, 520], [520, 400]], k = ease.inOut(seg(t, T.ruth, T.clients + 1.5)); ctx.save(); ctx.setLineDash([16, 18]); ctx.strokeStyle = '#b5654a'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(...pts[0]);
  pts.slice(1).forEach(([x, y], i) => { const a = clamp(k * 4 - i); const [px, py] = pts[i]; ctx.lineTo(px + (x - px) * a, py + (y - py) * a); }); ctx.stroke(); ctx.restore();
  circle(pts[0][0], pts[0][1], 40, '#7b8aa0'); text('GREENWICH', pts[0][0] + 20, pts[0][1] + 80, 24, 800, '#5a4a30', 'center', 0.1);
  pts.slice(1).forEach(([x, y], i) => { const e = pop(t, T.clients - 0.3 + i * 0.35, 0.3); if (e > 0) xf(x, y, clamp(e), 0, () => { circle(x, y - 20, 34, '#e5484d'); poly([[x - 20, y - 4], [x + 20, y - 4], [x, y + 34]], '#e5484d'); circle(x, y - 20, 12, '#fff'); }); });
  person(lerp(-150, 1230, seg(t, T.ruth, T.cent)), 1560, 420, 29, { skin: '#d9a27a', shirt: '#5a3a6a', pants: '#4a3a5a', hat: '#3a2a4a', arm: 'phone', bounce: t * 7, noShadow: false });
  const w = pop(t, T.watch, 0.3); if (w > 0) xf(CX, 1300, clamp(w), 0, () => text('RUTH BELVILLE', 330, 1300, 40, 800, '#5a4a30', 'center', 0.1));
}
function sceneCentury(t) {
  ctx.fillStyle = vgrad(0, H, '#2a2438', '#4a3a5a'); ctx.fillRect(0, 0, W, H);
  const k = ease.inOut(seg(t, T.cent + 0.2, T.over + 1.0)), y = Math.round(lerp(1836, 1940, k)); text(String(y), CX, 640, 260, 800, '#fff', 'center', -0.04);
  const o = pop(t, T.over, 0.4); if (o > 0) xf(CX, 960, clamp(o), 0, () => { text('100+ YEARS', CX, 960, 120, 800, '#ffd84d', 'center', -0.02); text('SAME ROUTE · SAME WATCH', CX, 1070, 34, 800, SOFT, 'center', 0.15); });
  clockFace(CX, 340, 90, y / 40, y / 3);
}
function sceneWeek(t) {
  ctx.fillStyle = '#efe0c0'; ctx.fillRect(0, 0, W, H); const d = ['MON', 'TUE', 'WED', 'THU', 'FRI']; card(70, 330, 940, 800, { fill: '#f6ead0', stroke: '#c9a56a', lw: 6 });
  d.forEach((s, i) => text(s, 150 + i * 195, 400, 30, 800, '#5a4a30', 'center', 0.12)); for (let r = 0; r < 3; r++) { for (let i = 0; i < 5; i++) { const e = pop(t, T.sched + 0.2 + (r * 5 + i) * 0.12, 0.25), x = 150 + i * 195, y = 510 + r * 190; ring(x, y, 52, '#c9a56a', 5); if (e > 0) xf(x, y, clamp(e), 0, () => { circle(x, y, 48, GREEN); check(x, y + 1, 40, '#fff', 8); }); } }
}
function sceneCal(t) {
  ctx.fillStyle = vgrad(0, H, '#0f1930', '#2d4270'); ctx.fillRect(0, 0, W, H);
  phone(250, 240, 580, 1000, '#f4f1ea', () => { fillRR(0, 0, 580, 130, 0, '#fff'); text('Thursday', 40, 75, 40, 800, '#1e1b4b', 'left'); [['9:00', '', 0], ['10:00', 'Jordan K. · Cut', 1], ['11:30', 'Priya S. · Colour', 2], ['1:00', 'Marcus T. · Cut', 3], ['2:30', '', 0], ['4:00', 'Ava R. · Trim', 4]].forEach(([tm, s, id], i) => { const y = 190 + i * 130; text(tm, 40, y + 40, 26, 700, '#6b6a80', 'left'); ctx.fillStyle = 'rgba(0,0,0,0.08)'; ctx.fillRect(130, y + 90, 420, 2); if (s) { const e = pop(t, T.book + 0.2 + id * 0.25, 0.3); if (e > 0) xf(340, y + 40, clamp(e), 0, () => { fillRR(130, y, 420, 84, 16, C.primary); text(s, 156, y + 44, 28, 800, '#fff', 'left'); }); } }); });
}
function sceneChair(t) {
  ctx.fillStyle = '#e4d6bd'; ctx.fillRect(0, 0, W, 1250); ctx.fillStyle = '#8b7355'; ctx.fillRect(0, 1250, W, 670); fillRR(150, 260, 280, 220, 8, '#cfe7f3'); strokeRR(150, 260, 280, 220, 8, '#6b5a44', 10);
  const k = t - T.forget; clockFace(800, 420, 110, 5.24, 0.0 + k * 0.05); text('10:00', 800, 590, 46, 800, '#5a4a30', 'center', 0.05);
  fillRR(440, 1000, 160, 40, 10, '#2b2b30'); fillRR(500, 1040, 40, 170, 6, '#6b6a70'); ellipse(520, 1220, 150, 26, '#2b2b30'); fillRR(380, 760, 280, 260, 40, '#b3261e'); fillRR(400, 960, 240, 70, 16, '#8f1b14'); fillRR(340, 1000, 60, 18, 8, '#6b6a70');
  person(850, 1500, 560, 15, { skin: '#d9a27a', shirt: '#2a4a8a', pants: '#2c3340', dir: -1, eyes: 'wide', bounce: t * 3 });
  const s = pop(t, T.chair - 0.1, 0.35); if (s > 0) xf(380, 700, clamp(s), 0, () => { ctx.save(); ctx.translate(380, 700); ctx.rotate(-0.12); fillRR(-210, -70, 420, 140, 22, '#fff'); strokeRR(-210, -70, 420, 140, 22, '#b3261e', 8); text('NO-SHOW', 0, 4, 78, 800, '#b3261e', 'center', 0); ctx.restore(); });
}
function sceneBook(t) {
  stage(t, 0.22); eyebrow('BOOKINGS & REMINDERS', 290); card(CARD.x, 340, CARD.w, 220); avatar(CARD.x + 80, 450, 40, 'JO', C.primary); text('Jordan K. · Cut', CARD.x + 140, 435, 36, 800, '#fff', 'left'); text('Thu 10:00 · Sam’s Studio', CARD.x + 140, 482, 26, 500, SOFT, 'left'); tag(CARD.x + CARD.w - 36, 395, 'BOOKED', IN.mid, false, 20);
  const a = pop(t, T.rem + 0.1, 0.3), b = pop(t, T.show + 0.4, 0.3), c = pop(t, T.show + 1.2, 0.3);
  if (a > 0) xf(CX, 700, clamp(a), 0, () => bubble(140, 620, 800, ['Reminder: Thursday 10:00 at', 'Sam’s Studio. See you then!'], false));
  if (b > 0) xf(CX, 900, clamp(b), 0, () => bubble(140, 850, 800, ['See you then!'], true));
  if (c > 0) xf(CX, 1090, clamp(c), 0, () => { fillRR(190, 1010, 700, 150, 28, rgba(GREEN, 0.14)); strokeRR(190, 1010, 700, 150, 28, GREEN, 3); circle(270, 1085, 30, GREEN); check(270, 1086, 30, '#fff', 5); text('Confirmed · chair filled', 330, 1070, 36, 800, '#fff', 'left', 0); text('Thu 10:00', 330, 1120, 26, 600, '#9ff0c0', 'left', 0); });
}
const SCENES = [[0, T.sold, sceneObs], [T.sold, T.ruth, sceneWatch], [T.ruth, T.cent, sceneRoute], [T.cent, T.sched, sceneCentury], [T.sched, T.book, sceneWeek], [T.book, T.forget, sceneCal], [T.forget, T.brand, sceneChair],
  [T.brand, T.bk, (t) => brandHit(t, T.brand, T.bk)], [T.bk, T.ask, sceneBook], [T.ask, T.end, sceneAudit], [T.end, 999, (t) => auditEnd(t, T.end, T.cta, T.url)]];
cue(0.3, 'swish', 0.6); cue(T.obs + 0.3, 'tap', 0.7); cue(T.london, 'punch', 0.9); cue(T.sold, 'ding', 1); cue(T.ruth, 'swish', 0.7); for (let i = 0; i < 4; i++) cue(T.clients - 0.3 + i * 0.35, 'tap', 0.7); cue(T.cent + 0.2, 'transition', 0.7); cue(T.over, 'punch', 1);
cue(T.sched, 'swish', 0.6); for (let i = 0; i < 15; i += 2) cue(T.sched + 0.2 + i * 0.12, 'tap', 0.4); cue(T.book, 'swish', 0.7); for (let i = 0; i < 5; i++) cue(T.book + 0.2 + i * 0.25, 'key', 0.5); cue(T.forget, 'transition', 0.7); cue(T.chair - 0.1, 'punch', 1);
cue(T.brand, 'transitionHit', 1); cue(T.rem + 0.1, 'notification', 0.9); cue(T.show + 0.4, 'notification', 0.9); cue(T.show + 1.2, 'ding', 1); cue(T.ask, 'punch', 1); for (let i = 0; i < 4; i++) cue(T.cmt + 0.45 + i * 0.11, 'key', 0.6); cue(T.cmt + 1.0, 'ding', 0.9); cue(T.end, 'swish', 0.8); cue(T.cta, 'tap', 1.2);
boot({ duration: DURATION, scenes: SCENES, brandAt: T.brand, hideCaption: (t) => t >= T.end - 0.1,
  after: (t) => { const f = 1 - seg(t, T.brand, T.brand + 0.12); if (t >= T.brand && f > 0) { ctx.fillStyle = rgba('#ffffff', 0.5 * f); ctx.fillRect(0, 0, W, H); } } }, 'belville');
