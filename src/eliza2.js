// MsgHealth · "Eliza" v2 · "stay in the story" vertical ad (1080 × 1920, 30 fps), built on kit.js + story-kit.js + soft-kit.js.
// Same real story as eliza.js (1966: MIT's ELIZA turned what you typed into a question and people confided in it; in the famous
// anecdote its creator's secretary asked him to leave the room). INVENTED: ELIZA never once offered to book you. Format change for
// retention: no pivot line and no product section. The product is a one-line joke ("Message Health's chat widget would have just
// answered, then dropped it in your inbox") with a small chat card popping onto the terminal scene, and the story closes on ELIZA's
// own catchphrase. Only ad element: a small end tag. Chat copy is illustrative. Voiceover: assets/audio/eliza2/vo-NN.wav.
'use strict';
const word = (l, k) => VO_AT[l] + VO_CLIPS[l].chunks[k][1];
const T = {
  secrets: word(0, 1), name: VO_AT[1], turned: VO_AT[2], question: word(2, 1), sec: VO_AT[3], leave: word(3, 1), flaw: VO_AT[4], book: word(4, 1), gag: VO_AT[5], answered: word(5, 1), inbox: word(5, 2), last: VO_AT[6],
};
T.tag = T.last + 1.0;
const DURATION = +(VO_AT[6] + VO_CLIPS[6].dur + 2.4).toFixed(2);
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

function sceneGag(t) {
  ctx.fillStyle = vgrad(0, H, '#2a2f36', '#14181d'); ctx.fillRect(0, 0, W, H); crt(70, 1000, 940, 420, t, [['CAN I BOOK THURSDAY?', T.gag - 3, 'u'], ['WHY DO YOU WANT TO BOOK', T.gag - 2, 'e'], ['THURSDAY?', T.gag - 1.7, 'e']]);
  cameo(t, T.gag + 0.3, 999, CX, 560, 760, 560, () => { fillRR(0, 0, 760, 90, 30, '#4f46e5'); ltext('Chat with us', 36, 46, 28, 800, '#fff'); circle(700, 46, 10, '#3dbb74');
    const a = ease.out(seg(t, T.gag + 0.7, T.gag + 1.0)); withFade(a, () => { fillRR(380, 120, 340, 66, 33, '#4f46e5'); ltext('Do you have Saturday?', 550, 154, 22, 700, '#fff', 'center'); });
    const b = ease.out(seg(t, T.answered, T.answered + 0.3)); withFade(b, () => { fillRR(36, 214, 460, 116, 28, '#efeaf9'); ltext('Yes! 10:00 or 2:30.', 62, 252, 24, 800); ltext('Want me to book you in?', 62, 292, 22, 500, LMUTED); });
    const i = pop(t, T.inbox, 0.35); if (i > 0) xf(380, 440, clamp(i), 0, () => { lcard(36, 370, 688, 150, 24); lcheck(88, 428, 22); ltext('Saved to Inbox', 128, 416, 28, 800); ltext('Web chat · Priya S.', 128, 454, 21, 500, LMUTED); ltag(700, 424, 'ONE INBOX', '#4f46e5', 16); }); }, 0.015);
}
function sceneEnd(t) { ctx.fillStyle = vgrad(0, H, '#2a2f36', '#14181d'); ctx.fillRect(0, 0, W, H); crt(70, 420, 940, 520, t, [['AND HOW DOES THAT MAKE', T.last + 0.1, 'e'], ['YOU FEEL?', T.last + 0.7, 'e']]); endTag(t, T.tag); }
const SCENES = [[0, T.name, sceneRoom], [T.name, T.turned, sceneTerminal], [T.turned, T.sec, sceneQuestion], [T.sec, T.flaw, sceneSecretary], [T.flaw, T.gag, sceneBook], [T.gag, T.last, sceneGag], [T.last, 999, sceneEnd]];
cue(0.4, 'swish', 0.7); cue(T.secrets, 'punch', 0.9); cue(T.name, 'ding', 0.9); cue(T.turned, 'swish', 0.7); cue(T.question, 'punch', 0.8); cue(T.sec, 'swish', 0.7); cue(T.leave - 0.5, 'notification', 0.9); cue(T.flaw, 'swish', 0.7); cue(T.book, 'punch', 1);
cue(T.gag + 0.3, 'notification', 1); cue(T.gag + 0.7, 'notification', 0.7); cue(T.answered, 'notification', 0.8); cue(T.inbox, 'ding', 1); cue(T.last, 'punch', 0.8); cue(T.tag, 'tap', 0.8);
boot({ duration: DURATION, scenes: SCENES, brandAt: 999 }, 'eliza2');
