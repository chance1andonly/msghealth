// MsgHealth · "The text" · direct-response vertical ad (1080 × 1920, 30 fps), built on src/kit.js.
// Hook: Priya used to come in every month; it's been seven weeks and she never cancelled. MsgHealth spots the drop and
// sends the text before she's gone; she taps yes and is booked. One text, one customer saved, then the 50% offer.
// Voiceover: assets/audio/text/vo-NN.wav, timed by VO_AT in src/text-vo.js.
'use strict';
const word = (l, k) => VO_AT[l] + VO_CLIPS[l].chunks[k][1];
const T = {
  every: word(0, 1), weeks: VO_AT[1], never: VO_AT[2], stopped: word(2, 1), brand: VO_AT[3], will: word(3, 1), spots: VO_AT[4], send: word(4, 1), gone: word(4, 2), yes: VO_AT[5], booked: word(5, 1),
  one: VO_AT[6], saved: word(6, 1), offer: VO_AT[7], end: VO_AT[8] - 0.1, url: VO_AT[8] + 0.1,
};
T.tap = T.end + 1.25;
const DURATION = +(T.tap + 1.0).toFixed(2);
window.CUES = T; window.SFX = []; const cue = (t, kind, gain) => window.SFX.push({ t, kind, gain });
window.MUSIC = { bpm: 100, root: 52, brandAt: T.brand, mood: 'quirky' };
const PRI = NAMES[1][1];

function scenePriya(t) {
  stage(t, 0.16);
  card(CARD.x, 330, CARD.w, 420); avatar(CARD.x + 100, 450, 64, 'PS', PRI);
  text('Priya S.', CARD.x + 200, 430, 56, 800, '#fff', 'left'); text('Regular · monthly cut', CARD.x + 200, 490, 28, 500, SOFT, 'left');
  const wk = Math.round(lerp(0, 7, ease.out(seg(t, T.weeks, T.weeks + 1.1)))), late = t > T.weeks;
  text(late ? `${wk} WEEKS` : 'EVERY MONTH', CX, 640, 70, 800, late ? RED : '#9ff0c0', 'center', -0.01); text(late ? 'SINCE HER LAST VISIT' : 'LIKE CLOCKWORK', CX, 706, 22, 800, MUTED, 'center', 0.22);
  // the calendar strip: ticks, then an empty month
  ['JAN', 'FEB', 'MAR', 'APR', 'MAY'].forEach((m, i) => { const x = CARD.x + 20 + i * 176, miss = i >= 3, e = pop(t, 0.5 + i * 0.35, 0.3); if (e <= 0) return;
    xf(x + 78, 900, clamp(e), 0, () => { fillRR(x, 800, 156, 200, 24, miss ? 'rgba(236,95,79,0.08)' : 'rgba(255,255,255,0.05)'); strokeRR(x, 800, 156, 200, 24, miss ? rgba(RED, i === 3 ? 0.7 : 0.4) : 'rgba(255,255,255,0.14)', 2); text(m, x + 78, 840, 26, 800, miss ? '#ff8a7f' : SOFT, 'center', 0.1);
      if (!miss) { circle(x + 78, 920, 34, GREEN); check(x + 78, 922, 34, '#fff', 6); } else text('—', x + 78, 922, 56, 800, 'rgba(255,255,255,0.3)', 'center'); }); });
  const nv = pop(t, T.never, 0.3); if (nv > 0) xf(CX, 1150, nv, 0, () => { fillRR(CARD.x, 1090, CARD.w, 160, 28, 'rgba(255,255,255,0.05)'); text('Cancelled?', CARD.x + 40, 1140, 30, 600, MUTED, 'left'); text('Never.', CARD.x + CARD.w - 40, 1140, 38, 800, '#fff', 'right'); text('Last message', CARD.x + 40, 1202, 30, 600, MUTED, 'left'); text('Delivered · no reply', CARD.x + CARD.w - 40, 1202, 34, 800, '#ff8a7f', 'right'); });
  const st = pop(t, T.stopped, 0.3); if (st > 0) xf(CX, 560, st, 0, () => { ctx.save(); ctx.translate(CX + 290, 470); ctx.rotate(0.12); fillRR(-170, -44, 340, 88, 12, 'rgba(8,8,12,0.9)'); strokeRR(-170, -44, 340, 88, 12, RED, 6); text('JUST STOPPED', 0, 3, 40, 800, RED, 'center', 0.06); ctx.restore(); });
}
function sceneSend(t) {
  stage(t, 0.22);
  withFade(enter(t, T.spots - 0.05, T.one, 0.2), () => {
    const dr = ease.inOut(seg(t, T.spots, T.spots + 0.7)), sc = Math.round(lerp(72, 38, dr));
    eyebrow('MSGHEALTH · AUTOMATIC WIN-BACK', 330); card(CARD.x, 380, CARD.w, 160);
    avatar(CARD.x + 76, 460, 40, 'PS', PRI); text('Priya S.', CARD.x + 140, 442, 36, 700, '#fff', 'left'); const back = t > T.yes + 0.6; tag(CARD.x + CARD.w - 36, 442, back ? 'BACK' : sc <= 45 ? 'AT RISK' : 'SLIPPING', back ? GREEN : sc <= 45 ? RED : AMBER, true, 20); text(back ? 'Health 86' : `Health ${back ? 86 : sc}`, CARD.x + 140, 490, 26, 600, SOFT, 'left');
    const ty = 580, th = 830; card(CARD.x, ty, CARD.w, th); text('SMS · SENT AUTOMATICALLY', CX, ty + 50, 20, 800, IN.mid, 'center', 0.2); ctx.fillStyle = 'rgba(255,255,255,0.07)'; ctx.fillRect(CARD.x + 30, ty + 90, CARD.w - 60, 2);
    const m1 = pop(t, T.send, 0.35), h1 = bubble(CARD.x + 40, ty + 120 + (1 - clamp(m1)) * 26, CARD.w - 80, ['Hi Priya, it\'s been a while!', 'Want your usual, Thursday at 10?', 'Reply YES to book.'], true, clamp(m1));
    const m2 = pop(t, T.yes + 0.3, 0.3), h2 = bubble(CARD.x + 40, ty + 120 + h1 + 50 + (1 - clamp(m2)) * 26, CARD.w - 80, ['YES!'], false, clamp(m2));
    const b = pop(t, T.booked, 0.35); if (b > 0) xf(CX, ty + 120 + h1 + 50 + h2 + 90, b, 0, () => { const s = 'Booked · Thu 10:00 AM', w = tw(s, 30, 800) + 110, by = ty + 120 + h1 + 50 + h2 + 40; fillRR(CX - w / 2, by, w, 72, 36, rgba(GREEN, 0.2)); strokeRR(CX - w / 2, by, w, 72, 36, GREEN, 3); circle(CX - w / 2 + 44, by + 36, 18, GREEN); check(CX - w / 2 + 44, by + 37, 18, '#fff', 4); text(s, CX - w / 2 + 76, by + 37, 30, 800, '#fff', 'left'); });
  });
}
function sceneSaved(t) {
  stage(t, 0.28);
  withFade(enter(t, T.one - 0.05, T.offer, 0.15), () => {
    const a = pop(t, T.one, 0.3), b = pop(t, T.saved, 0.3);
    xf(CX, 640, clamp(a), 0, () => { text('1 TEXT', CX, 640, 150, 800, '#fff', 'center', -0.03); });
    xf(CX, 840, clamp(b), 0, () => { text('1 CUSTOMER', CX, 820, 96, 800, IN.mid, 'center', -0.03); text('SAVED', CX, 930, 96, 800, '#9ff0c0', 'center', -0.03); });
    avatar(CX, 1120, 60, 'PS', PRI, clamp(b)); if (b > 0.5) { circle(CX + 48, 1160, 24, GREEN); check(CX + 48, 1161, 24, '#fff', 4.5); }
  });
}
const SCENES = [[0, T.brand, scenePriya], [T.brand, T.spots, (t) => brandHit(t, T.brand, T.spots)], [T.spots, T.one, sceneSend], [T.one, T.offer, sceneSaved], [T.offer, T.end, (t) => offerCard(t, T.offer, T.end)], [T.end, 999, (t) => endCard(t, T.end, T.tap, T.url)]];
for (let i = 0; i < 5; i++) cue(0.5 + i * 0.35, 'tap', 0.5); cue(T.weeks, 'notification', 0.9); cue(T.never, 'swish', 0.8); cue(T.stopped, 'punch', 1); cue(T.brand, 'transitionHit', 1);
cue(T.spots, 'swish', 0.8); cue(T.spots + 0.7, 'ding', 0.8); cue(T.send, 'notification', 1); cue(T.yes + 0.3, 'notification', 0.9); cue(T.booked, 'ding', 1); cue(T.one, 'punch', 1); cue(T.saved, 'punch', 1);
cue(T.offer, 'punch', 1); cue(T.offer + 0.7, 'ding', 0.9); cue(T.end, 'swish', 0.8); cue(T.tap, 'tap', 1.2);
boot({ duration: DURATION, scenes: SCENES, brandAt: T.brand, hideCaption: (t) => t >= T.end - 0.1,
  after: (t) => { const f = 1 - seg(t, T.brand, T.brand + 0.12); if (t >= T.brand && f > 0) { ctx.fillStyle = rgba('#ffffff', 0.5 * f); ctx.fillRect(0, 0, W, H); } } }, 'text');
