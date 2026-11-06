// MsgHealth · "Wow!" · story-hook vertical ad (1080 × 1920, 30 fps), built on src/kit.js + story-kit.js + soft-kit.js.
// Real story: on August 15, 1977 Ohio State's Big Ear radio telescope recorded a strong, 72-second signal from deep space. An
// astronomer circled the printout code (6EQUJ5) and wrote "Wow!". It has never been heard again.
// INVENTED (the absurd part): nobody wrote down what they changed, so it can't be repeated.
// Pivot: your business sends signals too (a spike in bookings, a dip in reviews). MsgHealth's reports show what's working and
// what isn't (revenue, bookings, reviews, who is about to leave). The product is a phone over the story's art, light UI.
// Chart values are illustrative. Voiceover: assets/audio/wowsig/vo-NN.wav (src/wowsig-vo.js).
'use strict';
const word = (l, k) => VO_AT[l] + VO_CLIPS[l].chunks[k][1];
const T = {
  space: word(0, 1), sec: VO_AT[1], circled: VO_AT[2], wow: word(2, 1), never: VO_AT[3], twist: VO_AT[4], changed: word(4, 1), pivot: VO_AT[5], spike: VO_AT[6], dip: word(6, 1),
  brand: VO_AT[7], shows: word(7, 1), repeatL: VO_AT[8], repeat: word(8, 1), offer: VO_AT[9], url: VO_AT[10],
};
const DURATION = +(T.url + 2.2).toFixed(2);
window.CUES = T; window.SFX = []; const cue = (t, kind, gain) => window.SFX.push({ t, kind, gain });
window.MUSIC = { bpm: 104, root: 46, brandAt: 999, mood: 'sneaky' };

const GRN = '#7dff9f';
function night(t) { backdrop(1250, '#0b1030', '#25305a', '#16301f', '#0c1c13'); for (let i = 0; i < 90; i++) { const tw2 = 0.4 + 0.6 * Math.abs(Math.sin(t * 1.5 + i)); circle(hash(i) * W, hash(i + 7) * 1150, 1.5 + hash(i + 3) * 2.5, `rgba(255,255,255,${tw2 * 0.85})`); } circle(900, 260, 70, '#f3eed0'); circle(925, 245, 62, '#0f1535'); }
function telescope(t) { shadow(CX, 1500, 440, 'rgba(0,0,0,0.4)'); poly([[60, 1350], [1020, 1350], [900, 1100], [190, 1100]], '#9aa6b4'); poly([[190, 1100], [900, 1100], [880, 1120], [210, 1120]], '#c9d2dc'); for (let i = 0; i < 9; i++) line(60 + i * 106, 1350, 190 + i * 79, 1100, 'rgba(0,0,0,0.12)', 4); fillRR(CX - 24, 1350, 48, 150, 6, '#6a7480'); fillRR(160, 1090, 18, 260, 4, '#6a7480'); fillRR(900, 1090, 18, 260, 4, '#6a7480'); fillRR(CX - 14, 880, 28, 230, 4, '#6a7480'); circle(CX, 868, 28, '#d9462d'); }
function sceneSky(t) {
  night(t); telescope(t); const k = seg(t, T.space - 0.2, T.space + 0.9); for (let i = 0; i < 4; i++) { const r = 80 + ((t * 160 + i * 90) % 360); if (k > 0) ring(CX, 640, r, `rgba(125,255,159,${0.5 * (1 - (r - 80) / 360) * k})`, 6); } star(CX, 640, 24, '#fff');
  withFade(seg(t, 0.1, 0.4), () => text('1977', CX, 200, 190, 800, '#e8ecff', 'center', -0.03)); const b = appear(t, T.space, 0.35); if (b > 0) xf(CX, 400, b, 0, () => banner('DEEP SPACE', CX, 400, 96, '#25305a', '#7dff9f'));
}
function chartPanel(t, at, spike = true) {
  ctx.fillStyle = vgrad(0, H, '#0b1030', '#16183a'); ctx.fillRect(0, 0, W, H); fillRR(60, 560, 960, 640, 24, '#0c1f18'); strokeRR(60, 560, 960, 640, 24, '#3a4a60', 8); for (let i = 1; i < 6; i++) line(100, 560 + i * 100, 980, 560 + i * 100, 'rgba(125,255,159,0.12)', 2);
  const n = 60; ctx.strokeStyle = GRN; ctx.lineWidth = 6; ctx.lineJoin = 'round'; ctx.beginPath(); const p = seg(t, at, at + 2.4); for (let i = 0; i <= n * p; i++) { const x = 100 + i * (880 / n), sp = spike && i >= 28 && i <= 34 ? Math.sin((i - 28) / 6 * Math.PI) * 330 : 0, y = 1100 - 90 - hash(i) * 40 - sp; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke();
}
function sceneSeconds(t) { chartPanel(t, T.sec); const n = Math.round(clamp((t - T.sec) / 2.2) * 72); text(String(n), CX, 330, 300, 800, '#e8ecff', 'center', -0.04); text('SECONDS', CX, 480, 60, 800, GRN, 'center', 0.3); }
function scenePrint(t) {
  ctx.fillStyle = '#2a3a30'; ctx.fillRect(0, 0, W, H); const k = appear(t, T.circled - 0.1, 0.45);
  xf(CX, 760, 0.8 + 0.2 * k, 0, () => { ctx.globalAlpha = k; ctx.save(); ctx.translate(CX, 800); ctx.rotate(-0.04); ctx.shadowColor = 'rgba(0,0,0,0.4)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 18; fillRR(-440, -560, 880, 1120, 10, '#f1f4e6'); ctx.shadowColor = 'transparent';
    for (let r = 0; r < 12; r++) { if (r % 2 === 0) fillRR(-440, -520 + r * 90, 880, 90, 0, 'rgba(160,210,160,0.25)'); const s = r === 5 ? '1  2  6EQUJ5  1  1' : Array.from({ length: 6 }, (_, i) => '0123456789ABCDEFGHJKLMNPQRSTUV'[Math.floor(hash(r * 9 + i) * 30)] + ' ' + Math.floor(hash(r + i * 3) * 9)).join('   '); text(s, -380, -474 + r * 90, 36, 700, '#2a3a30', 'left', 0.06); }
    const c = seg(t, T.circled + 0.2, T.circled + 0.9); if (c > 0) { ctx.strokeStyle = '#d9462d'; ctx.lineWidth = 9; ctx.beginPath(); ctx.ellipse(-110, -24, 250 * 0.9, 56, -0.05, -Math.PI * 0.6, -Math.PI * 0.6 + Math.PI * 2.2 * c); ctx.stroke(); }
    const w = appear(t, T.wow, 0.3); if (w > 0) xf(250, 100, w, 0, () => text('Wow!', 250, 70, 130, 800, '#d9462d', 'center', 0)); ctx.restore(); });
}
function sceneNever(t) {
  chartPanel(t, T.never - 2.6, false); ctx.fillStyle = 'rgba(11,16,48,0.0)'; const yr = 1977 + Math.floor(seg(t, T.never, T.twist) * 48); text(String(yr), CX, 330, 230, 800, '#e8ecff', 'center', -0.03); const b = appear(t, T.never + 0.2, 0.35); if (b > 0) xf(CX, 460, b, 0, () => banner('SIGNAL: NONE', CX, 470, 84, '#b3261e'));
}
function sceneNotes(t) {
  ctx.fillStyle = '#d9d2c0'; ctx.fillRect(0, 0, W, 1250); ctx.fillStyle = '#8a8472'; ctx.fillRect(0, 1250, W, 670); person(300, 1590, 600, 35, { skin: '#d9a27a', shirt: '#f4f4f4', pants: '#3d424f', glasses: true, noShadow: true, mouth: 'open', eyes: 'wide' });
  fillRR(0, 1300, W, 620, 0, '#7a5a3a'); fillRR(0, 1300, W, 30, 0, '#a07852'); ctx.save(); ctx.translate(700, 1290); ctx.rotate(-0.05); fillRR(-220, -250, 440, 250, 8, '#fffdf2'); for (let i = 0; i < 5; i++) line(-190, -200 + i * 40, 190, -200 + i * 40, '#d8d2b8', 4); text('???', 0, -110, 110, 800, 'rgba(179,38,30,0.55)', 'center'); ctx.restore();
  const a = appear(t, T.twist + 0.2, 0.3); if (a > 0) xf(520, 700, a, 0, () => speech(480, 520, ['WHAT DID WE', 'CHANGE?'], { size: 60, tail: [330, 970] })); const b = appear(t, T.changed, 0.35); if (b > 0) xf(CX, 260, b, 0, () => banner('NO NOTES.', CX, 260, 110, '#3a3326'));
}
function sceneShop(t, frozen) {
  ctx.fillStyle = '#e9dfd0'; ctx.fillRect(0, 0, W, 1250); ctx.fillStyle = '#9a8a74'; ctx.fillRect(0, 1250, W, 670); fillRR(0, 1180, W, 70, 0, '#cbb99d');
  fillRR(150, 240, 780, 520, 20, '#fff'); strokeRR(150, 240, 780, 520, 20, '#8a7a64', 12); ctx.strokeStyle = '#4f46e5'; ctx.lineWidth = 10; ctx.lineJoin = 'round'; ctx.beginPath(); [60, 90, 70, 100, 85, 330, 120, 100, 160, 90, 40, 60].forEach((v, i) => { const x = 210 + i * 62, y = 700 - v * 1.3; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.stroke();
  person(540, 1570, 620, 9, { skin: '#d9a27a', shirt: '#6c8ebf', pants: '#3d424f', glasses: true, arm: 'phone', noShadow: true, dir: -1 }); fillRR(0, 1290, W, 630, 0, '#7a5a3a'); fillRR(0, 1290, W, 30, 0, '#a07852');
  const a = appear(t, T.spike, 0.3), b = appear(t, T.dip, 0.3); if (a > 0) xf(520, 380, a, 0, () => { ctx.save(); ctx.translate(670, 400); ctx.rotate(-0.1); banner('SPIKE', 0, 0, 56, '#2f8a54'); ctx.restore(); }); if (b > 0) xf(840, 640, b, 0, () => banner('DIP', 840, 640, 56, '#b3261e'));
  const c = appear(t, T.pivot, 0.35); if (c > 0 && !frozen && t < T.spike) xf(CX, 880, c, 0, () => banner('SIGNALS', CX, 900, 100, '#2a3a5a'));
}
function repPhone(t) {
  [['Bookings', '+18%', LGREEN], ['Reviews', '+6', LGREEN], ['At risk', '-3', LGREEN]].forEach(([n, d, c], i) => { const e = pop(t, T.brand + 0.4 + i * 0.12, 0.3); if (e > 0) xf(110 + i * 200, 70, clamp(e), 0, () => { lcard(20 + i * 196, 24, 184, 110, 18); ltext(n, 112 + i * 196, 56, 18, 700, LMUTED, 'center'); ltext(d, 112 + i * 196, 100, 38, 800, c, 'center'); }); });
  lcard(20, 160, 580, 560, 24); ltext('Bookings · last 14 days', 48, 206, 24, 800); const p = seg(t, T.shows - 0.3, T.shows + 1.4); const vals = [48, 52, 50, 55, 53, 58, 56, 62, 60, 96, 70, 64, 58, 66];
  ctx.strokeStyle = '#4f46e5'; ctx.lineWidth = 6; ctx.lineJoin = 'round'; ctx.beginPath(); vals.forEach((v, i) => { if (i > p * (vals.length - 1)) return; const x = 50 + i * (500 / 13), y = 670 - v * 3.7; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.stroke();
  const sx = 50 + 9 * (500 / 13), sy = 670 - 96 * 3.7; const c = seg(t, T.repeatL + 0.2, T.repeatL + 0.8); if (c > 0) { ctx.strokeStyle = '#d6402f'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(sx, sy, 34, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * c); ctx.stroke(); }
  const w = pop(t, T.repeatL + 0.5, 0.3); if (w > 0) xf(sx + 120, sy - 30, clamp(w), 0, () => ltext('Wow!', sx + 110, sy - 30, 54, 800, '#d6402f', 'center'));
  const n = pop(t, T.repeat, 0.35); if (n > 0) xf(310, 640, clamp(n), 0, () => { lcard(20, 740, 580, 120, 24); fillRR(48, 770, 8, 60, 4, LGREEN); ltext('What worked: Friday campaign', 76, 794, 24, 800); ltext('Do it again next week', 76, 832, 22, 500, LMUTED); ltag(572, 800, 'REPEAT', LGREEN, 16); });
}
function sceneClose(t) { night(t); telescope(t); for (let i = 0; i < 4; i++) ring(CX, 640, 80 + ((t * 160 + i * 90) % 360), `rgba(125,255,159,${0.5 * (1 - ((t * 160 + i * 90) % 360) / 360)})`, 6); star(CX, 640, 24, '#fff'); const a = appear(t, T.offer, 0.3); text('Wow!', CX, 360, 190, 800, '#7dff9f', 'center', -0.02); }
const SCENES = [[0, T.sec, sceneSky], [T.sec, T.circled, sceneSeconds], [T.circled, T.never, scenePrint], [T.never, T.twist, sceneNever], [T.twist, T.pivot, sceneNotes], [T.pivot, T.brand, (t) => sceneShop(t, false)],
  [T.brand, T.offer, (t) => { sceneShop(t, true); phoneOver(t, T.brand, T.offer, repPhone); }], [T.offer, 999, (t) => { sceneClose(t); offerStrip(t, T.offer + 0.1); }]];
cue(0.4, 'swish', 0.7); cue(T.space, 'punch', 0.9); cue(T.sec, 'swoosh', 0.8); cue(T.sec + 1.2, 'punch', 1); cue(T.circled, 'swish', 0.7); cue(T.circled + 0.6, 'tap', 0.9); cue(T.wow, 'ding', 1); cue(T.never, 'transition', 0.8); cue(T.twist, 'swish', 0.7); cue(T.changed, 'punch', 1);
cue(T.pivot, 'swish', 0.7); cue(T.spike, 'ding', 0.9); cue(T.dip, 'tap', 0.9); cue(T.brand, 'swoosh', 0.7); for (let i = 0; i < 3; i++) cue(T.brand + 0.4 + i * 0.12, 'key', 0.5); cue(T.repeatL + 0.2, 'tap', 0.9); cue(T.repeatL + 0.5, 'ding', 1); cue(T.repeat, 'notification', 0.9); cue(T.offer + 0.1, 'ding', 0.9); cue(T.url, 'tap', 0.8);
boot({ duration: DURATION, scenes: SCENES, brandAt: 999 }, 'wowsig');
