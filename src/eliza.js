// MsgHealth · "Eliza" · story-hook vertical ad (1080 × 1920, 30 fps), built on src/kit.js + story-kit.js + soft-kit.js.
// Real story: in 1966 MIT's Joseph Weizenbaum built ELIZA, a program that mostly turned what you typed back into a question, and
// people confided in it; in the famous anecdote his secretary asked him to leave the room so she could talk to it privately.
// INVENTED (the absurd part): ELIZA never once offered to book you (it answers "can I book Thursday?" with a question).
// Pivot: your website visitors want answers now. MsgHealth's chat widget answers them on your site and every conversation lands in
// one inbox. The product is a phone over the story's art, light UI. Chat copy is illustrative. Voiceover: assets/audio/eliza.
'use strict';
const word = (l, k) => VO_AT[l] + VO_CLIPS[l].chunks[k][1];
const T = {
  secrets: word(0, 1), name: VO_AT[1], turned: VO_AT[2], question: word(2, 1), sec: VO_AT[3], leave: word(3, 1), flaw: VO_AT[4], book: word(4, 1), pivot: VO_AT[5], answers: word(5, 1),
  brand: VO_AT[6], site: word(6, 1), inbox: VO_AT[7], one: word(7, 1), proud: VO_AT[8], offer: VO_AT[9], url: VO_AT[10],
};
const DURATION = +(T.url + 2.2).toFixed(2);
window.CUES = T; window.SFX = []; const cue = (t, kind, gain) => window.SFX.push({ t, kind, gain });
window.MUSIC = { bpm: 106, root: 49, brandAt: 999, mood: 'sneaky' };

const typed = (t, s, at, cps = 28) => s.slice(0, Math.max(0, Math.min(s.length, Math.floor((t - at) * cps))));
function crt(x, y, w, h, t, rows) { // rows: [[str, at, who]], who 'u' (visitor) or 'e' (ELIZA)
  fillRR(x - 26, y - 26, w + 52, h + 52, 36, '#c9c2b0'); fillRR(x, y, w, h, 22, '#0c2418'); glow(x + w / 2, y + h / 2, w * 0.7, '#3dff8a', 0.07);
  let yy = y + 70; rows.forEach(([s, at, who]) => { const str = typed(t, s, at); if (!str) return; const col = who === 'e' ? '#7dff9f' : '#d6f5e0'; text((who === 'e' ? '> ' : '  ') + str + (who === 'e' && str.length < s.length ? '▌' : ''), x + 36, yy, 38, 800, col, 'left', 0.04); yy += 82; });
  for (let i = 0; i < 40; i++) { ctx.fillStyle = 'rgba(0,0,0,0.12)'; ctx.fillRect(x, y + i * (h / 40), w, 2); }
}
function room(t) { ctx.fillStyle = '#d9d2c0'; ctx.fillRect(0, 0, W, 1250); for (let i = 0; i < 6; i++) fillRR(0, 160 + i * 150, W, 8, 0, 'rgba(0,0,0,0.06)'); ctx.fillStyle = '#8a8472'; ctx.fillRect(0, 1250, W, 670); ctx.fillStyle = 'rgba(0,0,0,0.1)'; ctx.fillRect(0, 1250, W, 30); }
function mainframe(x, y, w, h, t) { fillRR(x, y, w, h, 8, '#6a7a8a'); fillRR(x + 20, y + 20, w - 40, h * 0.38, 6, '#2a323c'); circle(x + w * 0.3, y + 20 + h * 0.19, h * 0.15, '#c9d2dc'); circle(x + w * 0.7, y + 20 + h * 0.19, h * 0.15, '#c9d2dc'); line(x + w * 0.3, y + 20 + h * 0.19, x + w * 0.3 + Math.cos(t * 4) * h * 0.13, y + 20 + h * 0.19 + Math.sin(t * 4) * h * 0.13, '#2a323c', 5); line(x + w * 0.7, y + 20 + h * 0.19, x + w * 0.7 + Math.cos(t * 4) * h * 0.13, y + 20 + h * 0.19 + Math.sin(t * 4) * h * 0.13, '#2a323c', 5); for (let i = 0; i < 12; i++) circle(x + 40 + (i % 6) * (w - 80) / 5, y + h * 0.62 + Math.floor(i / 6) * 50, 9, (Math.floor(t * 3) + i) % 3 ? '#f2c84a' : '#d9462d'); }
function sceneRoom(t) {
  room(t); withFade(seg(t, 0.1, 0.4), () => text('1966', CX, 170, 170, 800, '#3a3326', 'center', -0.03)); mainframe(40, 330, 300, 760, t); mainframe(700, 330, 300, 760, t);
  person(260, 1590, 560, 21, { skin: '#c68a62', shirt: '#9a4a6a', pants: '#3d424f', noShadow: true, mouth: 'open' }); fillRR(0, 1300, W, 620, 0, '#7a5a3a'); fillRR(0, 1300, W, 30, 0, '#a07852'); fillRR(560, 1100, 380, 200, 18, '#c9c2b0'); fillRR(590, 1126, 320, 150, 10, '#0c2418'); text('> HELLO', 600, 1200, 40, 800, '#7dff9f', 'left', 0.04);
  const a = appear(t, T.secrets, 0.35); if (a > 0) xf(CX, 560, a, 0, () => banner('SECRETS', CX, 520, 120, '#9a4a6a'));
}
function sceneTerminal(t) {
  ctx.fillStyle = vgrad(0, H, '#2a2f36', '#14181d'); ctx.fillRect(0, 0, W, H); const k = appear(t, T.name - 0.1, 0.4);
  xf(CX, 760, 0.8 + 0.2 * k, 0, () => { ctx.globalAlpha = k; crt(70, 380, 940, 520, t, [['HELLO. I AM ELIZA.', T.name + 0.2, 'e'], ['HOW ARE YOU FEELING?', T.name + 1.0, 'e']]); });
  const a = appear(t, T.name, 0.35); if (a > 0) xf(CX, 220, a, 0, () => banner('ELIZA', CX, 210, 140, '#7dff9f', '#0c2418'));
}
function sceneQuestion(t) {
  ctx.fillStyle = vgrad(0, H, '#2a2f36', '#14181d'); ctx.fillRect(0, 0, W, H); crt(70, 300, 940, 700, t, [['I HAD A BAD DAY.', T.turned + 0.1, 'u'], ['WHY DO YOU SAY YOU HAD A BAD DAY?', T.question - 0.2, 'e'], ['MY BOSS IS ANNOYING.', T.question + 1.4, 'u'], ['TELL ME MORE ABOUT YOUR BOSS.', T.question + 2.0, 'e']]);
  const b = appear(t, T.question, 0.35); if (b > 0) xf(CX, 1150, b, 0, () => banner('EVERYTHING BECOMES A QUESTION', CX, 1150, 46, '#0c2418', '#7dff9f'));
}
function sceneSecretary(t) {
  room(t); person(780, 1590, 560, 21, { skin: '#c68a62', shirt: '#9a4a6a', pants: '#3d424f', noShadow: true, mouth: 'open', dir: -1 }); fillRR(0, 1300, W, 620, 0, '#7a5a3a'); fillRR(0, 1300, W, 30, 0, '#a07852'); fillRR(120, 1090, 380, 210, 18, '#c9c2b0'); fillRR(150, 1116, 320, 160, 10, '#0c2418'); text('> ...', 170, 1196, 40, 800, '#7dff9f', 'left', 0.04);
  const k = seg(t, T.leave, T.leave + 1.4); person(lerp(330, -200, ease.in(k)), 1650, 520, 33, { skin: '#d9a27a', shirt: '#f4f4f4', pants: '#3d424f', glasses: true, arm: 'wave', wave: t * 2, dir: -1, bounce: t * 6 });
  const a = appear(t, T.leave - 0.5, 0.35); if (a > 0) xf(CX, 600, a, 0, () => speech(660, 520, ['COULD YOU', 'LEAVE THE ROOM?'], { size: 64, tail: [780, 1010] }));
}
function sceneBook(t) {
  ctx.fillStyle = vgrad(0, H, '#2a2f36', '#14181d'); ctx.fillRect(0, 0, W, H); crt(70, 300, 940, 600, t, [['CAN I BOOK THURSDAY?', T.flaw + 0.4, 'u'], ['WHY DO YOU WANT TO BOOK', T.flaw + 1.6, 'e'], ['THURSDAY?', T.flaw + 1.9, 'e']]);
  const b = appear(t, T.book, 0.35); if (b > 0) xf(CX, 1150, b, 0, () => { banner('NO BOOKING.', CX, 1150, 110, '#d9462d'); });
}
function scenePivot(t, frozen) {
  ctx.fillStyle = '#e9dfd0'; ctx.fillRect(0, 0, W, 1250); ctx.fillStyle = '#9a8a74'; ctx.fillRect(0, 1250, W, 670); fillRR(0, 1180, W, 70, 0, '#cbb99d'); fillRR(70, 260, 220, 300, 8, '#cfe7f3'); fillRR(790, 260, 220, 300, 8, '#cfe7f3');
  person(540, 1650, 600, 9, { skin: '#d9a27a', shirt: '#6c8ebf', pants: '#3d424f', arm: 'phone', glasses: true, bounce: t * 2 });
  [['Do you have Saturday?', 300, T.pivot + 0.1], ['Anyone there??', 780, T.pivot + 1.0], ['Hello?', 300, T.pivot + 1.8]].forEach(([s, x, at], i) => { const e = appear(t, at, 0.3); if (e > 0) xf(x, 700, e, 0, () => speech(x, 440 + i * 190, [s], { size: 44, tail: [x < 540 ? 440 : 640, 1050] })); });
  const b = appear(t, T.answers, 0.35); if (b > 0 && !frozen) xf(CX, 280, b, 0, () => banner('ANSWERS NOW.', CX, 200, 96, '#2a3a5a'));
}
function sitePhone(t) {
  fillRR(0, 0, 620, 120, 0, '#fff'); ltext('Sam\'s Studio', 30, 62, 32, 800); [0, 1, 2].forEach((i) => circle(540 + i * 0, 40 + i * 20, 5, LMUTED)); fillRR(30, 150, 560, 280, 24, '#e6e0f7'); ltext('Fresh cuts. Easy booking.', 310, 260, 34, 800, INK, 'center'); fillRR(190, 330, 240, 66, 33, '#4f46e5'); ltext('Book now', 310, 364, 26, 800, '#fff', 'center');
  [0, 1, 2].forEach((i) => fillRR(30 + i * 190, 470, 176, 150, 18, rgba(INK, 0.06)));
  const w = pop(t, T.site - 0.2, 0.35); if (w <= 0) return; xf(310, 780, clamp(w), 0, () => {
    lcard(30, 340, 560, 500, 28); fillRR(30, 340, 560, 84, 28, '#4f46e5'); ltext('Chat with us', 60, 384, 28, 800, '#fff'); circle(540, 384, 10, '#3dbb74');
    const a = ease.out(seg(t, T.site + 0.2, T.site + 0.5)); withFade(a, () => { fillRR(220, 450, 340, 72, 36, '#4f46e5'); ltext('Do you have Saturday?', 390, 487, 22, 700, '#fff', 'center'); });
    const b = ease.out(seg(t, T.site + 1.0, T.site + 1.3)); withFade(b, () => { fillRR(50, 548, 420, 120, 30, '#efeaf9'); ltext('Yes! 10:00 or 2:30.', 80, 586, 24, 800); ltext('Want me to book you in?', 80, 626, 22, 500, LMUTED); });
    const c = ease.out(seg(t, T.site + 1.9, T.site + 2.2)); withFade(c, () => { fillRR(330, 700, 230, 66, 33, '#4f46e5'); ltext('10:00 please', 445, 733, 22, 700, '#fff', 'center'); }); });
  const i = pop(t, T.inbox, 0.35); if (i > 0) xf(310, 880, clamp(i), 0, () => { lcard(30, 780, 560, 90, 24); lcheck(80, 825, 20); ltext('Saved to Inbox', 118, 812, 26, 800); ltext('Web chat · Priya S.', 118, 846, 20, 500, LMUTED); ltag(570, 825, 'ONE INBOX', '#4f46e5', 16); });
}
function sceneProud(t) { ctx.fillStyle = vgrad(0, H, '#2a2f36', '#14181d'); ctx.fillRect(0, 0, W, H); crt(70, 300, 940, 500, t, [['WHY DO YOU SAY MSGHEALTH', T.proud + 0.1, 'e'], ['IS BETTER AT THIS?', T.proud + 0.5, 'e']]); }
const SCENES = [[0, T.name, sceneRoom], [T.name, T.turned, sceneTerminal], [T.turned, T.sec, sceneQuestion], [T.sec, T.flaw, sceneSecretary], [T.flaw, T.pivot, sceneBook], [T.pivot, T.brand, (t) => scenePivot(t, false)],
  [T.brand, T.proud, (t) => { scenePivot(t, true); phoneOver(t, T.brand, T.proud, sitePhone); }], [T.proud, 999, (t) => { sceneProud(t); offerStrip(t, T.offer + 0.1); }]];
cue(0.4, 'swish', 0.7); cue(T.secrets, 'punch', 0.9); cue(T.name, 'ding', 0.9); cue(T.turned, 'swish', 0.7); cue(T.question, 'punch', 0.8); cue(T.sec, 'swish', 0.7); cue(T.leave - 0.5, 'notification', 0.9); cue(T.flaw, 'swish', 0.7); cue(T.book, 'punch', 1);
cue(T.pivot, 'swish', 0.7); [0.1, 1.0, 1.8].forEach((d) => cue(T.pivot + d, 'notification', 0.8)); cue(T.answers, 'punch', 0.9); cue(T.brand, 'swoosh', 0.7); cue(T.site - 0.2, 'swish', 0.7); [0.2, 1.0, 1.9].forEach((d) => cue(T.site + d, 'notification', 0.7)); cue(T.inbox, 'ding', 1); cue(T.offer + 0.1, 'ding', 0.9); cue(T.url, 'tap', 0.8);
boot({ duration: DURATION, scenes: SCENES, brandAt: 999 }, 'eliza');
