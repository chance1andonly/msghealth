// MsgHealth · "Wow!" v2 · "stay in the story" vertical ad (1080 × 1920, 30 fps), built on kit.js + story-kit.js + soft-kit.js.
// Same real story as wowsig.js (Aug 15, 1977: Ohio State's Big Ear telescope recorded a 72-second signal from deep space; an astronomer
// circled the printout code 6EQUJ5 and wrote "Wow!"; never heard again). INVENTED: nobody wrote down what they changed. Format change
// for retention: no pivot line and no product section. The product is a one-line joke ("Message Health's reports would have circled
// the spike for you, with a reason") with a small report card popping onto the telescope scene, and the story closes on one word:
// "Wow." Only ad element: a small end tag. Chart values are illustrative. Voiceover: assets/audio/wowsig2/vo-NN.wav.
'use strict';
const word = (l, k) => VO_AT[l] + VO_CLIPS[l].chunks[k][1];
const T = {
  space: word(0, 1), sec: VO_AT[1], circled: VO_AT[2], wow: word(2, 1), never: VO_AT[3], twist: VO_AT[4], changed: word(4, 1), gag: VO_AT[5], circ: word(5, 1), reason: word(5, 2), wow2: VO_AT[6],
};
T.tag = T.wow2 + 1.0;
const DURATION = +(VO_AT[6] + VO_CLIPS[6].dur + 2.4).toFixed(2);
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

function sceneGag(t) {
  night(t); telescope(t); const vals = [48, 52, 50, 55, 53, 58, 56, 62, 60, 96, 70, 64, 58, 66];
  cameo(t, T.gag + 0.3, 999, CX, 640, 800, 600, () => { ltext('Bookings · last 14 days', 36, 62, 28, 800); const p = seg(t, T.gag + 0.5, T.gag + 1.6);
    ctx.strokeStyle = '#4f46e5'; ctx.lineWidth = 6; ctx.lineJoin = 'round'; ctx.beginPath(); vals.forEach((v, i) => { if (i > p * (vals.length - 1)) return; const x = 50 + i * (700 / 13), y = 500 - v * 3.6; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.stroke();
    const sx = 50 + 9 * (700 / 13), sy = 500 - 96 * 3.6, c = seg(t, T.circ, T.circ + 0.6); if (c > 0) { ctx.strokeStyle = '#d6402f'; ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(sx, sy, 36, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * c); ctx.stroke(); }
    const w = pop(t, T.circ + 0.4, 0.3); if (w > 0) xf(sx + 110, sy - 24, clamp(w), 0, () => ltext('Wow!', sx + 110, sy - 24, 56, 800, '#d6402f', 'center'));
    const r = pop(t, T.reason, 0.35); if (r > 0) xf(400, 540, clamp(r), 0, () => { fillRR(36, 520, 728, 56, 28, rgba(LGREEN, 0.14)); ltext('Why: Friday campaign went out', 400, 549, 24, 800, LGREEN, 'center'); }); }, 0.015);
}
function sceneEnd(t) { night(t); telescope(t); for (let i = 0; i < 4; i++) ring(CX, 640, 80 + ((t * 160 + i * 90) % 360), `rgba(125,255,159,${0.5 * (1 - ((t * 160 + i * 90) % 360) / 360)})`, 6); star(CX, 640, 24, '#fff'); const a = appear(t, T.wow2, 0.3); if (a > 0) xf(CX, 380, a, 0, () => text('Wow.', CX, 360, 240, 800, '#7dff9f', 'center', -0.02)); endTag(t, T.tag); }
const SCENES = [[0, T.sec, sceneSky], [T.sec, T.circled, sceneSeconds], [T.circled, T.never, scenePrint], [T.never, T.twist, sceneNever], [T.twist, T.gag, sceneNotes], [T.gag, T.wow2, sceneGag], [T.wow2, 999, sceneEnd]];
cue(0.4, 'swish', 0.7); cue(T.space, 'punch', 0.9); cue(T.sec, 'swoosh', 0.8); cue(T.sec + 1.2, 'punch', 1); cue(T.circled, 'swish', 0.7); cue(T.circled + 0.6, 'tap', 0.9); cue(T.wow, 'ding', 1); cue(T.never, 'transition', 0.8); cue(T.twist, 'swish', 0.7); cue(T.changed, 'punch', 1);
cue(T.gag + 0.3, 'notification', 1); cue(T.circ + 0.2, 'tap', 0.9); cue(T.circ + 0.4, 'ding', 1); cue(T.reason, 'notification', 0.9); cue(T.wow2, 'punch', 1); cue(T.tag, 'tap', 0.8);
boot({ duration: DURATION, scenes: SCENES, brandAt: 999 }, 'wowsig2');
