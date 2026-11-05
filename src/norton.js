// MsgHealth · "The Emperor" · story-hook vertical ad (1080 × 1920, 30 fps), built on src/kit.js + src/story-kit.js.
// Real story: in 1859 a failed San Francisco businessman, Joshua Norton, declared himself Emperor of the United States. He printed
// his own scrip, which local shops accepted; restaurants fed him, theaters kept him a seat, and tens of thousands came to his funeral.
// INVENTED (the absurd part): the Emperor's one demand was a stamp card.
// Pivot: your customers like rewards too. MsgHealth has loyalty & rewards built in (Starter). Then the sly savings bit, rebuilt from the
// "What it replaces" table on msghealth.net (screenshots supplied by the owner): Starter's nine lowest-priced standalone tools add up to
// $316/mo vs $50/mo (Pro $895 vs $109, Enterprise $1,511 vs $279). Footnote on screen: each tool's lowest published monthly plan,
// checked November 2026. Product names/amounts in the loyalty scene are illustrative. Voiceover: assets/audio/norton (src/norton-vo.js).
'use strict';
const word = (l, k) => VO_AT[l] + VO_CLIPS[l].chunks[k][1];
const T = {
  emp: word(0, 1), year: VO_AT[1], biz: word(1, 1), emperor: word(1, 2), money: VO_AT[2], shops: word(2, 1), rest: VO_AT[3], theater: word(3, 1), died: VO_AT[4], tens: word(4, 1),
  demand: VO_AT[5], stamp: word(5, 1), ten: VO_AT[6], rewards: word(6, 1), pivot: VO_AT[7], rew2: word(7, 1), brand: VO_AT[8], built: word(8, 1),
  nine: VO_AT[9], sep: VO_AT[10], three: word(10, 1), fifty: VO_AT[11], twice: word(11, 1), offer: VO_AT[12], end: VO_AT[13] - 0.1, url: VO_AT[13] + 0.1,
};
T.loy = T.brand + 1.1; T.cta = T.end + 1.25;
const DURATION = +(T.cta + 1.0).toFixed(2);
window.CUES = T; window.SFX = []; const cue = (t, kind, gain) => window.SFX.push({ t, kind, gain });
window.MUSIC = { bpm: 100, root: 50, brandAt: T.brand, mood: 'quirky' };

const GR = 1150;
function street(t, dusk = false) {
  backdrop(GR, dusk ? '#f0b07a' : '#9fd0ee', dusk ? '#fbe6c0' : '#f3eede', '#a89c88', '#7d7260'); cloud(60, 220, 0.9, 'rgba(255,255,255,0.9)');
  ctx.fillStyle = '#b7c9a0'; ctx.beginPath(); ctx.moveTo(0, GR); ctx.quadraticCurveTo(300, 700, 700, GR); ctx.lineTo(0, GR); ctx.fill();
  const cols = ['#e7d3a8', '#c98f7a', '#8fa8b8', '#d9b86a', '#b8a0c0'];
  for (let i = 0; i < 5; i++) { const x = -20 + i * 220, top = 560 + (i % 3) * 70, w = 210; fillRR(x, top, w, GR - top, 3, cols[i]); poly([[x - 6, top], [x + w / 2, top - 70], [x + w + 6, top]], '#7a4a3a'); for (let r = 0; r < 3; r++) for (let c = 0; c < 2; c++) fillRR(x + 30 + c * 90, top + 40 + r * 120, 56, 80, 6, '#f2ead3'); fillRR(x + 74, GR - 110, 62, 110, 4, '#5a3a2a'); }
  ctx.fillStyle = 'rgba(0,0,0,0.08)'; ctx.fillRect(0, GR, W, 12);
}
function norton(x, y, h, t, o = {}) { // the Emperor: navy coat, gold epaulettes, plumed hat
  person(x, y, h, 3, { skin: '#e2b08a', shirt: '#22306a', pants: '#22306a', hat: '#22306a', arm: o.arm ?? 'down', wave: t, mouth: o.mouth, eyes: o.eyes, dir: o.dir ?? 1, bounce: o.bounce, noShadow: o.noShadow, hair: '#cfcfcf' });
  const w = h * 0.3, sy = y - h * 0.76, hr = h * 0.095, hy = y - h + hr;
  fillRR(x - w * 0.62, sy - h * 0.03, w * 0.3, h * 0.035, 3, '#f2c84a'); fillRR(x + w * 0.32, sy - h * 0.03, w * 0.3, h * 0.035, 3, '#f2c84a');
  fillRR(x - w * 0.1, sy + h * 0.02, w * 0.2, h * 0.012, 3, '#f2c84a'); for (let i = 0; i < 3; i++) circle(x, sy + h * (0.06 + i * 0.06), h * 0.008, '#f2c84a');
  ctx.strokeStyle = '#d9462d'; ctx.lineWidth = h * 0.014; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x - hr * 0.2, hy - hr * 1.5); ctx.quadraticCurveTo(x + hr * 0.2, hy - hr * 3, x + hr * 1.7, hy - hr * 2.3); ctx.stroke();
}
function sceneHook(t) {
  street(t); const k = appear(t, 0.2, 0.45); xf(CX, 1650, 0.7 + 0.3 * k, 0, () => { ctx.globalAlpha = k; norton(CX, 1650, 700, t, { arm: 'wave', mouth: 'open', bounce: t * 2 }); });
  withFade(seg(t, 0.15, 0.5), () => { text('SAN FRANCISCO', CX, 220, 90, 800, '#2a3a5a', 'center', -0.02); text('THE 1860s', CX, 330, 36, 800, 'rgba(42,58,90,0.7)', 'center', 0.3); });
  const b = appear(t, T.emp, 0.35); if (b > 0) xf(CX, 460, b, 0, () => banner('EMPEROR', CX, 460, 110, '#7a1f2a'));
}
function sceneDeclare(t) {
  ctx.fillStyle = vgrad(0, H, '#3a2a4a', '#1b1424'); ctx.fillRect(0, 0, W, H); glow(CX, 700, 700, '#ffd98a', 0.25);
  const s = appear(t, T.year - 0.1, 0.4); xf(CX, 640, 0.6 + 0.4 * s, 0, () => { ctx.globalAlpha = s; ctx.save(); ctx.translate(CX, 640); ctx.rotate(-0.02); fillRR(-400, -340, 800, 680, 18, '#f3e8cc'); fillRR(-440, -360, 60, 720, 30, '#d9c28a'); fillRR(380, -360, 60, 720, 30, '#d9c28a');
    text('PROCLAMATION', 0, -250, 70, 800, '#4a2a1a', 'center', 0.05); text('I, NORTON,', 0, -110, 76, 800, '#4a2a1a', 'center', 0); text('AM EMPEROR', 0, 0, 86, 800, '#7a1f2a', 'center', 0); text('OF THE UNITED STATES', 0, 100, 48, 800, '#4a2a1a', 'center', 0); line(-260, 200, 260, 200, '#b99a62', 4); ctx.restore(); });
  const b = appear(t, T.biz, 0.3); if (b > 0) xf(CX, 960, b, 0, () => { ctx.save(); ctx.translate(CX - 160, 870); ctx.rotate(-0.15); strokeRR(-300, -70, 600, 140, 14, '#e0392d', 10); text('FAILED BUSINESS', 0, 3, 64, 800, '#e0392d', 'center', 0.03); ctx.restore(); });
  const e = appear(t, T.emperor, 0.35); shadow(CX, 1650, 190); norton(CX, 1650, 520, t, { arm: 'up', mouth: 'open', noShadow: true, bounce: t * 2 });
  if (e > 0) xf(800, 1050, e, 0, () => banner('1859', 800, 1050, 90, '#7a1f2a', '#fff', 0.05));
}
function bill(x, y, rot, s = 1, label = 'IMPERIAL SCRIP') { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); fillRR(-210, -110, 420, 220, 12, '#cfe6c4'); strokeRR(-196, -96, 392, 192, 8, '#3a7a4a', 5); circle(0, 0, 62, 'rgba(58,122,74,0.25)'); text(label, 0, -50, 34, 800, '#2a5a3a', 'center', 0.08); text('NORTON', 0, 20, 52, 800, '#2a5a3a', 'center', 0.1); ctx.restore(); }
function sceneMoney(t) {
  street(t, true); const b = appear(t, T.money, 0.4); xf(CX, 560, 0.6 + 0.4 * b, 0, () => { ctx.globalAlpha = b; bill(CX - 190, 440, -0.1, 1.0); bill(CX + 190, 690, 0.12, 1.0); });
  const sx = 770; person(sx, 1560, 560, 12, { skin: '#c68a62', shirt: '#f4efe0', pants: '#4b5060', arm: 'wave', wave: t, mouth: 'open', noShadow: true, dir: -1 });
  fillRR(430, 1290, 700, 630, 0, '#7a5a3a'); fillRR(430, 1290, 700, 30, 0, '#a07852'); fillRR(560, 1200, 160, 90, 10, '#3a2a1a'); text('SHOP', 640, 1245, 36, 800, '#f2c84a', 'center', 0.2);
  norton(230, 1650, 520, t, { arm: 'up', mouth: 'open', bounce: t * 2 });
  const a = appear(t, T.shops, 0.35); if (a > 0) xf(CX, 900, a, 0, () => { fillRR(CX - 300, 810, 600, 130, 65, '#2f8a54'); circle(CX - 220, 875, 36, '#fff'); check(CX - 220, 876, 36, '#2f8a54', 7); text('ACCEPTED', CX + 40, 877, 70, 800, '#fff', 'center', 0.02); });
}
function sceneFed(t) {
  ctx.fillStyle = '#e8d6b8'; ctx.fillRect(0, 0, W, H); const a = appear(t, T.rest - 0.1, 0.4), b = appear(t, T.theater - 0.1, 0.4);
  xf(CX, 560, 0.7 + 0.3 * a, 0, () => { ctx.globalAlpha = a; fillRR(90, 170, 900, 640, 30, '#f6efe0'); strokeRR(90, 170, 900, 640, 30, '#8a6a3a', 10); fillRR(150, 640, 780, 22, 6, '#8a5f3a'); fillRR(190, 662, 30, 100, 4, '#8a5f3a'); fillRR(860, 662, 30, 100, 4, '#8a5f3a'); ellipse(540, 636, 190, 36, '#fff'); ellipse(540, 630, 140, 22, '#e9e2d0'); ellipse(540, 600, 90, 50, '#c9803a'); fillRR(280, 600, 22, 36, 4, '#d9d9d9'); fillRR(780, 600, 22, 36, 4, '#d9d9d9'); text('RESTAURANT', CX, 260, 84, 800, '#7a1f2a', 'center', 0.03); text('(dinner: handled)', CX, 360, 44, 800, '#6b4a34', 'center', 0); });
  xf(CX, 1150, 0.7 + 0.3 * b, 0, () => { ctx.globalAlpha = b; fillRR(90, 860, 900, 660, 30, '#7a1f2a'); for (let i = 0; i < 9; i++) fillRR(90 + i * 100, 860, 60, 660, 10, i % 2 ? '#8a2a35' : '#6a1822'); strokeRR(90, 860, 900, 660, 30, '#f2c84a', 10);
    fillRR(380, 1180, 320, 220, 24, '#b3261e'); fillRR(360, 1330, 360, 70, 16, '#8a1a1a'); fillRR(400, 1000, 280, 190, 20, '#c0392b'); fillRR(480, 940, 120, 60, 8, '#f6efe0'); text('RESERVED', CX, 970, 28, 800, '#7a1f2a', 'center', 0.12); text('THEATER', CX, 905, 70, 800, '#f2c84a', 'center', 0.05); });
}
function sceneFuneral(t) {
  street(t, true); const k = ease.out(seg(t, T.died - 0.1, T.tens + 0.8));
  for (let row = 0; row < 6; row++) for (let i = 0; i < 12; i++) { const y = 1250 + row * 100, h = 150 + row * 40, x = (i + (row % 2) * 0.5) * 100 + 20 - 80 * (1 - k); if (x > -80 && x < W + 80) person(x, y, h, 200 + i + row * 13, { shirt: ['#2a2a30', '#3a3a44', '#22262e'][(i + row) % 3], pants: '#1b1b20', skin: SKIN[(i + row) % 6], noShadow: true, bounce: t * 2 + i, hairStyle: undefined }); }
  const a = appear(t, T.died, 0.3), b = appear(t, T.tens, 0.35); if (a > 0) xf(CX, 400, a, 0, () => banner('1880', CX, 380, 90, '#1b1f27')); if (b > 0) xf(CX, 600, b, 0, () => banner('TENS OF THOUSANDS', CX, 560, 66, '#7a1f2a'));
}
function cafe() { ctx.fillStyle = '#efe0c4'; ctx.fillRect(0, 0, W, 1250); ctx.fillStyle = '#9a8a74'; ctx.fillRect(0, 1250, W, 670); fillRR(70, 260, 220, 300, 8, '#cfe7f3'); strokeRR(70, 260, 220, 300, 8, '#8a7a64', 8); fillRR(380, 200, 400, 120, 20, '#5a3a2a'); text('CAFÉ', 580, 262, 90, 800, '#f2c84a', 'center', 0.1); }
function stampCard(x, y, w, filled, t, at, rot = 0, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); fillRR(-w / 2, -w * 0.32, w, w * 0.64, 20, '#fff7e0'); strokeRR(-w / 2, -w * 0.32, w, w * 0.64, 20, '#c9803a', 8); text('STAMP CARD', 0, -w * 0.22, w * 0.085, 800, '#7a4a2a', 'center', 0.12);
  for (let i = 0; i < 10; i++) { const cx2 = -w * 0.34 + (i % 5) * w * 0.17, cy2 = -w * 0.04 + Math.floor(i / 5) * w * 0.17; circle(cx2, cy2, w * 0.065, '#f0e2c0'); if (i < filled) { const e = ease.back(seg(t, at + i * 0.12, at + 0.2 + i * 0.12)); if (e > 0) { circle(cx2, cy2, w * 0.058 * e, '#d9462d'); star(cx2, cy2, w * 0.04 * e, '#fff'); } } }
  ctx.restore();
}
function sceneDemand(t) {
  cafe(); const sx = 810; person(sx, 1560, 560, 12, { skin: '#c68a62', shirt: '#f4efe0', pants: '#4b5060', mouth: 'open', noShadow: true, dir: -1 }); fillRR(520, 1290, 600, 630, 0, '#7a5a3a'); fillRR(520, 1290, 600, 30, 0, '#a07852');
  norton(250, 1650, 600, t, { arm: 'up', mouth: 'open', bounce: t * 2 });
  const a = appear(t, T.demand, 0.35); if (a > 0) xf(CX, 560, a, 0, () => speech(CX - 40, 400, ['ONE DEMAND, MERCHANT:'], { size: 52, tail: [280, 1040] }));
  const b = appear(t, T.stamp, 0.45); if (b > 0) xf(CX, 800, b, 0, () => stampCard(CX + 60, 800, 620, 0, t, 99, -0.05));
}
function sceneStamps(t) {
  cafe(); stampCard(CX, 760, 760, 10, t, T.ten + 0.1, 0.03); const c = appear(t, T.ten + 1.0, 0.4);
  norton(250, 1650, 560, t, { arm: 'up', mouth: 'open', bounce: t * 3 });
  if (c > 0) xf(780, 1250, c, 0, () => { shadow(780, 1300, 120); fillRR(700, 1160, 150, 140, 18, '#fff'); fillRR(842, 1190, 44, 70, 22, '#fff'); ellipse(775, 1162, 75, 14, '#6b3f28'); for (let i = 0; i < 2; i++) { const k = (t * 0.6 + i / 2) % 1; ellipse(750 + i * 50 + sine(t + i, 3, 8), 1120 - k * 70, 9, 16, `rgba(255,255,255,${0.5 * (1 - k)})`); } fillRR(660, 1030, 230, 70, 35, '#2f8a54'); text('FREE', 775, 1067, 50, 800, '#fff', 'center', 0.08); });
  const r = appear(t, T.rewards, 0.35); if (r > 0) xf(CX, 120, r, 0, () => banner('EMPERORS LIKE REWARDS', CX, 110, 60, '#7a1f2a'));
}
function sceneLike(t) {
  ctx.fillStyle = '#e9dfd0'; ctx.fillRect(0, 0, W, 1250); ctx.fillStyle = '#9a8a74'; ctx.fillRect(0, 1250, W, 670); fillRR(0, 1180, W, 70, 0, '#cbb99d');
  [150, 400, 650, 900].forEach((x, i) => { person(x, 1640, 440 + (i % 2) * 40, 80 + i, { shirt: SHIRT[i + 2], skin: SKIN[i + 1], arm: i % 2 ? 'wave' : 'down', wave: t + i, bounce: t * 3 + i, dir: x < 540 ? 1 : -1 }); const e = appear(t, T.pivot + 0.3 + i * 0.25, 0.35); if (e > 0) xf(x, 1010, e, 0, () => { star(x, 1000 + sine(t + i, 3, 8), 90, '#f2c84a'); }); });
  const b = appear(t, T.rew2, 0.35); if (b > 0) xf(CX, 460, b, 0, () => banner('YOUR CUSTOMERS TOO', CX, 460, 76, '#2a3a5a'));
}
// ═════════════ the product ═════════════
const MEMBERS = [['Priya S.', 8, 1], ['Marcus T.', 10, 2], ['Ava R.', 4, 3], ['Jordan K.', 6, 0]];
function sceneLoyalty(t) {
  stage(t, 0.22);
  withFade(enter(t, T.loy - 0.05, T.nine, 0.15), () => {
    eyebrow('LOYALTY & REWARDS', 300); card(CARD.x, 350, CARD.w, 780);
    MEMBERS.forEach(([n, v, ci], i) => { const y = 470 + i * 170, e = ease.out(seg(t, T.loy + i * 0.1, T.loy + 0.3 + i * 0.1)); withFade(e, () => { if (i) { ctx.fillStyle = 'rgba(255,255,255,0.07)'; ctx.fillRect(CARD.x + 30, y - 85, CARD.w - 60, 2); }
      avatar(CARD.x + 76, y, 36, n.slice(0, 2).toUpperCase(), NAMES[ci][1]); text(n, CARD.x + 136, y - 16, 30, 800, '#fff', 'left');
      for (let d = 0; d < 10; d++) { const cx2 = CARD.x + 150 + d * 34, f = d < v && seg(t, T.loy + 0.3 + i * 0.1 + d * 0.04, T.loy + 0.45 + i * 0.1 + d * 0.04) > 0.5; circle(cx2, y + 28, 11, f ? C.primary : 'rgba(255,255,255,0.12)'); }
      if (v >= 10) tag(CARD.x + CARD.w - 36, y, 'REWARD READY', GREEN, false, 18); else text(`${v}/10`, CARD.x + CARD.w - 36, y, 30, 800, SOFT, 'right'); }); });
    const r = pop(t, T.loy + 0.9, 0.35); if (r > 0) xf(CX, 1260, clamp(r), 0, () => { const lb = 'Reward unlocked', ww = tw(lb, 36, 800) + 110; fillRR(CX - ww / 2, 1210, ww, 96, 48, rgba(IN.mid, 0.18)); strokeRR(CX - ww / 2, 1210, ww, 96, 48, IN.mid, 3); star(CX - ww / 2 + 56, 1258, 24, IN.mid); text(lb, CX - ww / 2 + 96, 1259, 36, 800, '#fff', 'left'); });
  });
}
const APPS = [['Booking & scheduling', 'Acuity Scheduling (Starter)', 20], ['SMS marketing & reminders', 'SimpleTexting (500 texts)', 39], ['Email broadcasts & newsletters', 'Mailchimp (Standard)', 20], ['Live chat widget', 'Tidio (Starter)', 29], ['Review requests & reputation', 'NiceJob (Reviews)', 75], ['Loyalty & rewards program', 'Loopy Loyalty (Starter)', 25], ['Invoicing & deposit protection', 'Square Invoices (Plus)', 20], ['Forms, surveys & intake', 'Jotform (Bronze)', 39], ['Job dispatch & scheduling', 'Jobber (Core)', 49]];
const JABS = ['9 logins.', '9 invoices.', '9 "we\'ve updated our terms" emails.', '1 password you will actually remember.'];
function sceneSavings(t) {
  stage(t, 0.2);
  const rowsOut = ease.in(seg(t, T.fifty - 0.15, T.fifty + 0.35));
  withFade(1 - rowsOut, () => {
    eyebrow('WHAT STARTER REPLACES', 290); card(CARD.x, 330, CARD.w, 940);
    let sum = 0; const struck = seg(t, T.sep, T.fifty);
    APPS.forEach(([n, app, p], i) => { const y = 400 + i * 98, e = ease.out(seg(t, T.nine + 0.1 + i * 0.16, T.nine + 0.4 + i * 0.16)), s = seg(t, T.sep + 0.05 + i * 0.13, T.sep + 0.2 + i * 0.13); if (s > 0.5) sum += p;
      withFade(e, () => { if (i) { ctx.fillStyle = 'rgba(255,255,255,0.06)'; ctx.fillRect(CARD.x + 30, y - 49, CARD.w - 60, 2); } text(n, CARD.x + 40, y - 14, 28, 700, s > 0 ? SOFT : '#fff', 'left'); text(app, CARD.x + 40, y + 20, 21, 500, MUTED, 'left'); text('$' + p + '/mo', CARD.x + CARD.w - 40, y, 30, 800, s > 0 ? '#ff8a7f' : '#fff', 'right');
        if (s > 0) line(CARD.x + 36, y - 14 + 0, CARD.x + 36 + lerp(0, tw(n, 28, 700), clamp(s)), y - 14, '#ff8a7f', 3); }); });
    const tot = pop(t, T.sep, 0.35); if (tot > 0) xf(CX, 1320, clamp(tot), 0, () => { text('SEPARATELY', CARD.x + 20, 1322, 26, 800, MUTED, 'left', 0.2); text('$' + (t < T.sep + 0.05 ? 0 : sum) + '/mo', CARD.x + CARD.w - 10, 1322, 76, 800, '#ff8a7f', 'right', -0.02); });
  });
  JABS.slice(0, 3).forEach((s, i) => { const at = T.sep + 0.4 + i * 0.7, e = enter(t, at, at + 0.7, 0.12); if (e > 0 && t < T.fifty - 0.1) withFade(e, () => xf(CX, 1380, 0.9 + 0.1 * clamp(pop(t, at, 0.2)), 0, () => { const w = tw(s, 34, 800) + 70; fillRR(CX - w / 2, 1352, w, 70, 35, rgba(AMBER, 0.15)); strokeRR(CX - w / 2, 1352, w, 70, 35, AMBER, 2); text(s, CX, 1388, 34, 800, '#ffe3a1', 'center', 0); })); });
  const c = seg(t, T.fifty + 0.3, T.fifty + 0.6); if (c > 0) withFade(c, () => {
    eyebrow('MSGHEALTH STARTER', 330); const k = pop(t, T.fifty + 0.3, 0.4);
    xf(CX, 560, clamp(0.7 + 0.3 * k), 0, () => { text('$316', CX - 250, 560, 110, 800, MUTED, 'center', -0.03); line(CX - 250 - tw('$316', 110, 800, -0.03) / 2, 560, CX - 250 + tw('$316', 110, 800, -0.03) / 2, 560, '#ff8a7f', 8); text('→', CX - 20, 560, 80, 700, MUTED, 'center'); text('$50', CX + 220, 560, 180, 800, '#9ff0c0', 'center', -0.03); text('/mo', CX + 220 + tw('$50', 180, 800, -0.03) / 2 + 60, 590, 40, 600, MUTED, 'left'); });
    const m = pop(t, T.twice - 0.1, 0.35); if (m > 0) xf(CX, 760, clamp(m), 0, () => { const lb = 'Math: checked. Twice.', ww = tw(lb, 36, 800) + 120; fillRR(CX - ww / 2, 710, ww, 96, 48, rgba(GREEN, 0.18)); strokeRR(CX - ww / 2, 710, ww, 96, 48, GREEN, 3); circle(CX - ww / 2 + 56, 758, 22, GREEN); check(CX - ww / 2 + 56, 759, 22, '#fff', 4.5); text(lb, CX - ww / 2 + 96, 759, 36, 800, '#fff', 'left'); });
    [['PRO', '$895', '$109'], ['ENTERPRISE', '$1,511', '$279']].forEach(([n, was, now], i) => { const e = pop(t, T.twice + 0.35 + i * 0.35, 0.3); if (e > 0) xf(CX, 930 + i * 130, clamp(e), 0, () => { const y = 880 + i * 130; card(CARD.x + 40, y, CARD.w - 80, 104, { r: 22 }); text(n, CARD.x + 80, y + 52, 30, 800, '#fff', 'left', 0.05); text(was + '/mo', CARD.x + 480, y + 52, 30, 600, MUTED, 'right', 0); line(CARD.x + 480 - tw(was + '/mo', 30, 600, 0), y + 52, CARD.x + 480, y + 52, '#ff8a7f', 3); text('→', CARD.x + 530, y + 52, 30, 700, MUTED, 'center'); text(now + '/mo', CARD.x + CARD.w - 80, y + 52, 40, 800, '#9ff0c0', 'right', -0.01); }); });
    text('Each tool\'s lowest published monthly plan, checked November 2026.', CX, 1580, 20, 600, MUTED, 'center', 0.01);
  });
}
const SCENES = [[0, T.year, sceneHook], [T.year, T.money, sceneDeclare], [T.money, T.rest, sceneMoney], [T.rest, T.died, sceneFed], [T.died, T.demand, sceneFuneral], [T.demand, T.ten, sceneDemand], [T.ten, T.pivot, sceneStamps], [T.pivot, T.brand, sceneLike],
  [T.brand, T.loy, (t) => brandHit(t, T.brand, T.loy)], [T.loy, T.nine, sceneLoyalty], [T.nine, T.offer, sceneSavings], [T.offer, T.end, (t) => offerCard(t, T.offer, T.end)], [T.end, 999, (t) => endCard(t, T.end, T.cta, T.url)]];
cue(0.35, 'swish', 0.7); cue(T.emp, 'punch', 0.9); cue(T.year, 'swoosh', 0.8); cue(T.biz, 'punch', 1); cue(T.emperor, 'ding', 1); cue(T.money, 'swish', 0.8); cue(T.shops, 'ding', 1); cue(T.rest, 'tap', 0.8); cue(T.theater, 'tap', 0.8);
cue(T.died, 'swoosh', 0.7); cue(T.tens, 'punch', 1); cue(T.demand, 'notification', 0.9); cue(T.stamp, 'punch', 1); for (let i = 0; i < 10; i++) cue(T.ten + 0.1 + i * 0.12, 'tap', 0.4); cue(T.ten + 1.0, 'ding', 1); cue(T.rewards, 'punch', 0.9);
[0, 1, 2, 3].forEach((i) => cue(T.pivot + 0.3 + i * 0.25, 'ding', 0.5)); cue(T.brand, 'transitionHit', 1); for (let i = 0; i < 4; i++) cue(T.loy + i * 0.1, 'key', 0.5); cue(T.loy + 0.9, 'ding', 1);
for (let i = 0; i < 9; i++) cue(T.nine + 0.1 + i * 0.16, 'key', 0.45); cue(T.sep, 'punch', 1); for (let i = 0; i < 9; i++) cue(T.sep + 0.05 + i * 0.13, 'tap', 0.4); [0, 1, 2].forEach((i) => cue(T.sep + 0.4 + i * 0.7, 'notification', 0.7));
cue(T.fifty + 0.3, 'punch', 1); cue(T.fifty + 0.4, 'ding', 1); cue(T.twice - 0.1, 'ding', 1); cue(T.twice + 0.35, 'key', 0.7); cue(T.twice + 0.7, 'key', 0.7); cue(T.offer, 'punch', 1); cue(T.offer + 0.7, 'ding', 0.9); cue(T.end, 'swish', 0.8); cue(T.cta, 'tap', 1.2);
boot({ duration: DURATION, scenes: SCENES, brandAt: T.brand, hideCaption: (t) => t >= T.end - 0.1,
  after: (t) => { const f = 1 - seg(t, T.brand, T.brand + 0.12); if (t >= T.brand && f > 0) { ctx.fillStyle = rgba('#ffffff', 0.5 * f); ctx.fillRect(0, 0, W, H); } } }, 'norton');
