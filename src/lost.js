// MsgHealth · "Who left?" · direct-response vertical ad (1080 × 1920, 30 fps), built on src/kit.js.
// Hook: "How many regulars did you lose this month? You don't know." Then the product does the job in four beats:
// health scores, an alert the moment someone slips, an automatic text, a rebooking. Ends on the 50%-off-first-month offer.
// Voiceover: assets/audio/lost/vo-NN.wav, timed by VO_AT in src/lost-vo.js.
'use strict';
const word = (l, k) => VO_AT[l] + VO_CLIPS[l].chunks[k][1];
const T = {
  lose: word(0, 2), month: word(0, 2) + 0.7, dont: VO_AT[1], leaving: word(1, 2), brand: VO_AT[2], score: VO_AT[3], every: word(3, 1), flag: word(3, 2), slip: VO_AT[4], alert: word(4, 1),
  txt: VO_AT[5], auto: word(5, 1), again: VO_AT[6], offer: VO_AT[7], end: VO_AT[8] - 0.1, url: VO_AT[8] + 0.1,
};
T.tap = T.end + 1.25;
const DURATION = +(T.tap + 1.0).toFixed(2);
window.CUES = T; window.SFX = []; const cue = (t, kind, gain) => window.SFX.push({ t, kind, gain });
window.MUSIC = { bpm: 118, root: 45, brandAt: T.brand, mood: 'bouncy' };

function sceneHook(t) {
  stage(t, 0.14);
  const heads = ['HOW MANY', 'REGULARS DID YOU', 'LOSE THIS MONTH?'];
  heads.forEach((s, i) => { const k = pop(t, 0.35 + i * 0.5, 0.3); if (k > 0) xf(CX, 330 + i * 100, k, 0, () => text(s, CX, 330 + i * 100, i === 2 ? 76 : 84, 800, i === 2 ? '#fff' : SOFT, 'center', -0.02)); });
  for (let i = 0; i < 12; i++) {
    const c = i % 4, r = Math.floor(i / 4), x = 210 + c * 220, y = 760 + r * 210, e = pop(t, 0.9 + i * 0.05, 0.3);
    const gone = seg(t, T.lose + (hash(i + 3) * 1.1), T.lose + 0.5 + hash(i + 3) * 1.1), g = i % 3 === 1 || i === 6 || i === 11; // the ones who leave
    const a = 1 - (g ? ease.in(gone) : 0) * 0.92;
    withFade(clamp(e) * a, () => { avatar(x, y, 70, g && gone > 0.3 ? '?' : NAMES[i % 10][0].slice(0, 2).toUpperCase(), g && gone > 0.3 ? '#555a66' : NAMES[i % 10][1]); });
  }
  const m = pop(t, T.month, 0.3); if (m > 0 && t < T.dont) xf(CX, 1345, m, 0, () => text('You have no idea.', CX, 1345, 54, 800, '#ffb0a8', 'center'));
  const d = pop(t, T.dont + 0.4, 0.3); if (d > 0) xf(CX, 1345, d, 0, () => { const s = '0 ALERTS · 0 WARNINGS', w = tw(s, 38, 800, 0.08) + 80; fillRR(CX - w / 2, 1300, w, 90, 45, rgba(RED, 0.16)); strokeRR(CX - w / 2, 1300, w, 90, 45, rgba(RED, 0.7), 3); text(s, CX, 1346, 38, 800, '#ff8a7f', 'center', 0.08); });
}
const ROWS = [['Ava R.', 92, 'Healthy'], ['Marcus T.', 85, 'Healthy'], ['Priya S.', 61, 'Needs attention'], ['Jordan K.', 78, 'Healthy']];
function ring(cx, cy, r, v, col) { ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.stroke(); ctx.strokeStyle = col; ctx.beginPath(); ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * v / 100); ctx.stroke(); }
function sceneHealth(t) {
  stage(t, 0.2);
  withFade(enter(t, T.score - 0.05, T.txt, 0.2), () => {
    eyebrow('CLIENT HEALTH', 330); const y0 = 380, rh = 150, flag = ease.out(seg(t, T.slip + 0.2, T.slip + 0.6)), alertK = pop(t, T.alert - 0.3, 0.35);
    card(CARD.x, y0, CARD.w, rh * 4 + 24);
    ROWS.forEach(([n, base, st], r) => {
      const e = ease.out(seg(t, T.score + 0.05 + r * 0.12, T.score + 0.45 + r * 0.12)), y = y0 + 12 + r * rh + rh / 2, jor = r === 3, sc = jor ? Math.round(lerp(78, 38, ease.inOut(seg(t, T.slip, T.slip + 0.7)))) : base;
      const col = sc <= 45 ? RED : sc <= 65 ? AMBER : GREEN;
      withFade(e, () => {
        if (r) { ctx.fillStyle = 'rgba(255,255,255,0.07)'; ctx.fillRect(CARD.x + 30, y - rh / 2, CARD.w - 60, 2); }
        if (jor && flag > 0) { fillRR(CARD.x + 12, y - rh / 2 + 6, CARD.w - 24, rh - 12, 18, rgba(RED, 0.1 * flag)); strokeRR(CARD.x + 12, y - rh / 2 + 6, CARD.w - 24, rh - 12, 18, rgba(RED, (0.5 + 0.3 * Math.sin(t * 9)) * flag), 3); }
        avatar(CARD.x + 72, y, 36, n.slice(0, 2).toUpperCase(), NAMES[r][1]); text(n, CARD.x + 128, y - 16, 32, 700, '#fff');
        if (jor && flag > 0.5) { tag(CARD.x + 128 + tw('AT RISK', 19, 800, 0.1) + 27, y + 24, 'AT RISK', RED, true, 19); } else { circle(CARD.x + 136, y + 24, 7, col); text(jor ? 'Healthy' : st, CARD.x + 152, y + 25, 24, 600, SOFT); }
        ring(CARD.x + CARD.w - 86, y, 42, sc, col); text(String(sc), CARD.x + CARD.w - 86, y + 1, 32, 800, '#fff', 'center', -0.02);
      });
    });
    if (alertK > 0) xf(CX, 200, alertK, 0, () => { fillRR(70, 90, 940, 150, 34, 'rgba(30,30,44,0.97)'); strokeRR(70, 90, 940, 150, 34, rgba(RED, 0.7), 3); if (LOGO) ctx.drawImage(LOGO, 100, 118, 90, 90); text('MsgHealth · now', 215, 140, 24, 700, MUTED, 'left'); text('Jordan K. is slipping', 215, 182, 38, 800, '#fff', 'left'); text('Visit overdue · no reply', 215, 218, 24, 500, SOFT, 'left'); });
  });
}
function sceneText(t) {
  stage(t, 0.22);
  withFade(enter(t, T.txt - 0.05, T.offer, 0.2), () => {
    eyebrow('AUTOMATIC WIN-BACK', 380); card(CARD.x, 430, CARD.w, 100, { r: 22 });
    let x = CARD.x + 28; text('When', x, 481, 26, 600, MUTED); x += tw('When', 26, 600) + 14;
    { const s = 'At risk', w = tw(s, 24, 700) + 36; fillRR(x, 456, w, 44, 22, rgba(RED, 0.16)); text(s, x + w / 2, 479, 24, 700, RED, 'center'); x += w + 18; } text('→', x, 480, 28, 700, MUTED); x += 46;
    { const s = 'Send SMS', w = tw(s, 24, 700) + 36; fillRR(x, 456, w, 44, 22, rgba(IN.mid, 0.18)); text(s, x + w / 2, 479, 24, 700, IN.hi, 'center'); }
    const on = ease.out(seg(t, T.txt + 0.05, T.txt + 0.3)), sx = CARD.x + CARD.w - 104; fillRR(sx, 458, 76, 40, 20, on > 0.5 ? C.primary : 'rgba(255,255,255,0.16)'); circle(sx + 20 + 36 * on, 478, 15, '#fff');
    const ty = 580, th = 760; card(CARD.x, ty, CARD.w, th); avatar(CARD.x + 66, ty + 62, 30, 'JK', NAMES[0][1]); text('Jordan K.', CARD.x + 112, ty + 62, 30, 700, '#fff');
    const sc = Math.round(lerp(38, 86, ease.out(seg(t, T.again + 0.8, T.again + 1.3)))), col = sc > 65 ? GREEN : RED; tag(CARD.x + CARD.w - 30, ty + 62, `HEALTH ${sc}`, col, false, 20);
    ctx.fillStyle = 'rgba(255,255,255,0.07)'; ctx.fillRect(CARD.x + 30, ty + 108, CARD.w - 60, 2);
    const m1 = pop(t, T.txt + 0.3, 0.35), h1 = bubble(CARD.x + 40, ty + 140 + (1 - clamp(m1)) * 26, CARD.w - 80, ['Hi Jordan, it\'s been a while!', 'Want your usual, Thursday at 10?'], true, clamp(m1));
    withFade(seg(t, T.txt + 0.7, T.txt + 1.0), () => text('Sent automatically · SMS', CARD.x + CARD.w - 40, ty + 140 + h1 + 28, 21, 600, IN.mid, 'right'));
    const m2 = pop(t, T.again - 0.1, 0.3), h2 = bubble(CARD.x + 40, ty + 140 + h1 + 80 + (1 - clamp(m2)) * 26, CARD.w - 80, ['Yes please! See you then.'], false, clamp(m2));
    const b = pop(t, T.again + 0.35, 0.35); if (b > 0) xf(CX, ty + 140 + h1 + 80 + h2 + 70, b, 0, () => { const s = 'Booked · Thu 10:00 AM', w = tw(s, 28, 700) + 100, by = ty + 140 + h1 + 80 + h2 + 36; fillRR(CX - w / 2, by, w, 64, 32, rgba(GREEN, 0.18)); strokeRR(CX - w / 2, by, w, 64, 32, rgba(GREEN, 0.6), 2); circle(CX - w / 2 + 38, by + 32, 15, GREEN); check(CX - w / 2 + 38, by + 33, 15, '#fff', 3.5); text(s, CX - w / 2 + 66, by + 33, 28, 700, '#fff', 'left'); });
  });
}
const SCENES = [[0, T.brand, sceneHook], [T.brand, T.score, (t) => brandHit(t, T.brand, T.score)], [T.score, T.txt, sceneHealth], [T.txt, T.offer, sceneText], [T.offer, T.end, (t) => offerCard(t, T.offer, T.end)], [T.end, 999, (t) => endCard(t, T.end, T.tap, T.url)]];
[0.35, 0.85, 1.35].forEach((t) => cue(t, 'punch', 0.7)); cue(T.lose, 'swoosh', 0.8); cue(T.dont + 0.4, 'notification', 0.8); cue(T.brand, 'transitionHit', 1);
[0, 1, 2, 3].forEach((i) => cue(T.score + 0.1 + i * 0.12, 'key', 0.6)); cue(T.slip + 0.5, 'ding', 0.9); cue(T.alert - 0.3, 'notification', 1); cue(T.txt + 0.1, 'tap', 0.8); cue(T.txt + 0.3, 'swish', 0.9); cue(T.again - 0.1, 'notification', 0.9); cue(T.again + 0.35, 'ding', 1);
cue(T.offer, 'punch', 1); cue(T.offer + 0.7, 'ding', 0.9); cue(T.end, 'swish', 0.8); cue(T.tap, 'tap', 1.2);
boot({ duration: DURATION, scenes: SCENES, brandAt: T.brand, hideCaption: (t) => t >= T.end - 0.1,
  after: (t) => { const f = 1 - seg(t, T.brand, T.brand + 0.12); if (t >= T.brand && f > 0) { ctx.fillStyle = rgba('#ffffff', 0.5 * f); ctx.fillRect(0, 0, W, H); } } }, 'lost');
