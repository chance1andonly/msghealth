// MsgHealth · "The ledger" · story-hook vertical ad (1080 × 1920, 30 fps), built on src/kit.js + src/story-kit.js.
// Real story: on the Micronesian island of Yap, large limestone discs ("rai" stones, the biggest over ten feet across) were
// shipped in by canoe from islands hundreds of miles away and used as money. They were too big to move, so a sale only changed
// who everyone agreed owned the stone, and a stone that sank at sea was still counted as owned.
// INVENTED (the absurd part): the island's whole ledger is "one very tired man" who hasn't had a day off.
// Pivot: your customers pay you too, and someone has to remember who paid. MsgHealth: invoicing, payment links and every
// payment tracked (Starter includes invoicing / payment links / POS). Then the 50%-off-first-month offer.
// Names, amounts and statuses in the product scenes are illustrative. Voiceover: assets/audio/yap/vo-NN.wav (src/yap-vo.js).
'use strict';
const word = (l, k) => VO_AT[l] + VO_CLIPS[l].chunks[k][1];
const T = {
  rock: word(0, 1), feet: VO_AT[1], tenft: word(1, 1), canoe: VO_AT[2], far: word(2, 1), sank: VO_AT[3], owned: word(3, 1), sold: VO_AT[4], announce: word(4, 1),
  nobank: VO_AT[5], remember: word(5, 1), ledger: VO_AT[6], man: word(6, 1), dayoff: VO_AT[7], years: word(7, 1), pay: VO_AT[8], rem: word(8, 1),
  brand: VO_AT[9], every: word(9, 1), invoice: VO_AT[10], link: word(10, 1), tracked: VO_AT[11], tired: word(11, 1), offer: VO_AT[12], end: VO_AT[13] - 0.1, url: VO_AT[13] + 0.1,
};
T.cta = T.end + 1.25;
const DURATION = +(T.cta + 1.0).toFixed(2);
window.CUES = T; window.SFX = []; const cue = (t, kind, gain) => window.SFX.push({ t, kind, gain });
window.MUSIC = { bpm: 100, root: 52, brandAt: T.brand, mood: 'quirky' };

const GR = 1000; // ground line of the island scenes (sand starts here)
function rai(x, y, r, hole = '#7fc3df') { // a rai stone, centre (x, y), radius r, standing on the ground at y + r
  shadow(x, y + r, r * 0.95); circle(x, y, r, '#cdc7b4'); circle(x, y, r * 0.93, '#d9d3c0');
  ctx.save(); ctx.beginPath(); ctx.arc(x, y, r * 0.93, 0, 7); ctx.clip();
  for (let i = 0; i < 46; i++) { const a = hash(i) * 6.28, d = Math.sqrt(hash(i + 50)) * r; ellipse(x + Math.cos(a) * d, y + Math.sin(a) * d, 3 + hash(i + 9) * 8, 2 + hash(i + 3) * 5, 'rgba(110,100,80,0.18)'); }
  ctx.fillStyle = 'rgba(0,0,0,0.10)'; ctx.beginPath(); ctx.arc(x + r * 0.2, y + r * 0.25, r * 1.1, 0, 7); ctx.arc(x, y, r * 0.93, 0, 7, true); ctx.fill('evenodd'); ctx.restore();
  circle(x, y, r * 0.17, '#8d8672'); circle(x, y, r * 0.14, hole);
}
function island(t, sunset = false) {
  backdrop(GR, sunset ? '#f7a15a' : '#7fd0f0', sunset ? '#fbe0a8' : '#dff4f1', '#efd9a2', '#d5b878');
  ctx.fillStyle = sunset ? '#c46a4a' : '#2fa6c4'; ctx.fillRect(0, 740, W, GR - 740); ctx.fillStyle = 'rgba(255,255,255,0.22)'; ctx.fillRect(0, 740, W, 6);
  for (let i = 0; i < 6; i++) ellipse(((i * 230 + t * 24) % 1300) - 100, 800 + (i % 3) * 60, 90, 6, 'rgba(255,255,255,0.3)');
  ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.fillRect(0, GR - 14, W, 14);
  palm(70, 1080, 520, t, 0.2); palm(1010, 1070, 460, t + 1, -0.2);
}
function sceneHook(t) {
  island(t); const k = appear(t, 0.3, 0.45);
  withFade(seg(t, 0.15, 0.5), () => { text('YAP', CX, 250, 230, 800, '#0d4d63', 'center', -0.02); text('A PACIFIC ISLAND', CX, 400, 36, 800, 'rgba(13,77,99,0.75)', 'center', 0.25); });
  xf(CX, 1630, 0.5 + 0.5 * k, 0, () => { ctx.globalAlpha = k; rai(CX, 1290, 340); });
  const m = appear(t, T.rock, 0.35); if (m > 0) xf(CX, 720, m, 0, () => banner('MONEY', CX, 720, 100, '#2f8a54', '#fff', -0.05));
}
function sceneScale(t) {
  island(t); const k = appear(t, T.feet - 0.1, 0.4);
  xf(660, 1660, 0.6 + 0.4 * k, 0, () => { ctx.globalAlpha = k; rai(660, 1270, 390); });
  person(170, 1660, 420, 21, { skin: '#c68a62', shirt: '#e08a6d', pants: '#575b4c', arm: 'up', wave: t, mouth: 'open', bounce: t * 5 });
  const a = seg(t, T.tenft - 0.2, T.tenft + 0.4); if (a > 0) withFade(a, () => { arrowH(270, 1050, 800, '#0d4d63', 8); }); const b = appear(t, T.tenft, 0.35); if (b > 0) xf(660, 730, b, 0, () => banner('OVER 10 FT ACROSS', 660, 730, 56, '#0d4d63'));
}
function sceneCanoe(t) {
  const lt = t - T.canoe; backdrop(720, '#8fd6f2', '#e6f6f2', '#2fa6c4', '#0f6a8a');
  circle(880, 300, 90, '#fff1b8'); cloud(80, 260, 0.9, 'rgba(255,255,255,0.95)'); ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.fillRect(0, 716, W, 6);
  for (let i = 0; i < 12; i++) { const y = 800 + i * 95, x = ((i * 310 + lt * (30 + i * 6)) % 1500) - 200; ellipse(x, y, 110 + i * 8, 7 + i * 0.7, 'rgba(255,255,255,0.22)'); }
  const cx = lerp(300, 640, seg(t, T.canoe, T.sank)), bob = sine(t, 3.2, 10), y = 1290 + bob; ctx.save(); ctx.translate(cx, y); ctx.rotate(sine(t, 2.4, 0.015)); ctx.translate(-cx, -y);
  line(cx + 190, y + 10, cx + 520, y + 70, '#6b4a34', 12); line(cx + 120, y + 30, cx + 460, y + 82, '#6b4a34', 12); ellipse(cx + 520, y + 90, 170, 26, '#a8743f'); ellipse(cx + 520, y + 80, 150, 12, '#c08a52');
  rai(cx, y - 210, 210, '#8fd6f2');
  person(cx - 290, y, 260, 31, { skin: '#c68a62', shirt: '#e0b84a', pants: '#575b4c', arm: 'wave', wave: t, noShadow: true }); person(cx + 270, y, 250, 32, { skin: '#a86c48', shirt: '#6c8ebf', pants: '#3d424f', dir: -1, arm: 'wave', wave: t + 1, noShadow: true });
  poly([[cx - 400, y - 14], [cx + 400, y - 14], [cx + 330, y + 100], [cx - 320, y + 100]], '#8a5a34'); fillRR(cx - 410, y - 24, 820, 24, 10, '#a8743f'); for (let i = 0; i < 7; i++) line(cx - 330 + i * 110, y, cx - 310 + i * 106, y + 96, 'rgba(0,0,0,0.15)', 4);
  ctx.restore(); ellipse(cx, y + 118, 430, 22, 'rgba(255,255,255,0.35)');
  const f = seg(t, T.far - 0.2, T.far + 0.8); if (f > 0) { ctx.save(); ctx.globalAlpha = clamp(f * 2); ctx.setLineDash([26, 22]); line(120, 600, lerp(120, 960, f), 600, '#0d4d63', 8, 'butt'); ctx.restore(); circle(120, 600, 16, '#0d4d63'); }
  const b = appear(t, T.far, 0.35); if (b > 0) xf(CX, 520, b, 0, () => banner('HUNDREDS OF MILES', CX, 520, 62, '#0d4d63'));
}
function sceneSank(t) {
  if (t >= T.owned - 0.05) { // underwater: the stone is still owned
    ctx.fillStyle = vgrad(0, H, '#2a98b8', '#0b2a44'); ctx.fillRect(0, 0, W, H); for (let i = 0; i < 5; i++) { const x = 80 + i * 240; poly([[x, 0], [x + 70, 0], [x + 220, 1500], [x + 60, 1500]], 'rgba(255,255,255,0.05)'); }
    ctx.fillStyle = vgrad(1620, H, '#cdb27a', '#a8905a'); ctx.fillRect(0, 1620, W, H - 1620); ctx.fillStyle = 'rgba(0,0,0,0.12)'; ctx.fillRect(0, 1620, W, 40);
    const k = appear(t, T.owned, 0.4); rai(CX, 1320, 300, '#2a98b8'); for (let i = 0; i < 14; i++) { const kk = ((t * 0.35 + hash(i)) % 1); circle(120 + hash(i + 4) * 840, 1600 - kk * 1500, 6 + hash(i + 8) * 14, `rgba(255,255,255,${0.35 * (1 - kk)})`); }
    [[140, 1000, 1], [880, 1000, -1]].forEach(([x, y, d], i) => { const fx = x + sine(t + i * 2, 1.3, 40); ellipse(fx, y, 56, 26, '#f2b441'); poly([[fx - d * 50, y], [fx - d * 84, y - 24], [fx - d * 84, y + 24]], '#f2b441'); circle(fx + d * 28, y - 6, 5, '#1b1f27'); });
    if (k > 0) xf(CX, 640, k, 0, () => { ctx.save(); ctx.translate(CX, 640); ctx.rotate(-0.06); fillRR(-470, -120, 940, 240, 30, 'rgba(255,255,255,0.12)'); strokeRR(-470, -120, 940, 240, 30, '#9ff0c0', 12); text('STILL OWNED', 0, 4, 112, 800, '#9ff0c0', 'center', 0); ctx.restore(); });
    return;
  }
  const lt = t - T.sank, fall = ease.in(seg(t, T.sank + 0.8, T.owned - 0.1)), flash = lt > 0.6 && lt < 0.75 ? 0.6 : 0;
  backdrop(780, '#2b3445', '#6a7688', '#1d5a78', '#0a2a40');
  for (let i = 0; i < 12; i++) { const y = 840 + i * 90, x = ((i * 310 + t * (60 + i * 8)) % 1500) - 200; ellipse(x, y, 130 + i * 8, 10 + i, 'rgba(255,255,255,0.2)'); }
  const cx = 520, y = 1290 + sine(t, 4, 24), tilt = sine(t, 2.2, 0.1) + fall * 0.25; ctx.save(); ctx.translate(cx, y); ctx.rotate(tilt); ctx.translate(-cx, -y);
  const sx = cx + fall * 200, sy = y - 210 + fall * 520; rai(sx, sy, 210, '#6a7688');
  person(cx - 290, y, 260, 31, { skin: '#c68a62', shirt: '#e0b84a', pants: '#575b4c', arm: 'up', wave: t * 2, mouth: 'open', eyes: 'wide', noShadow: true }); poly([[cx - 400, y - 14], [cx + 400, y - 14], [cx + 330, y + 100], [cx - 320, y + 100]], '#8a5a34'); fillRR(cx - 410, y - 24, 820, 24, 10, '#a8743f'); ctx.restore();
  ctx.strokeStyle = 'rgba(200,220,255,0.5)'; ctx.lineWidth = 3; for (let i = 0; i < 60; i++) { const x = (hash(i) * 1300 + t * 200) % 1200 - 60, yy = ((hash(i + 9) * 2000 + t * 1300) % 1900); ctx.beginPath(); ctx.moveTo(x, yy); ctx.lineTo(x - 20, yy + 70); ctx.stroke(); }
  if (flash) { ctx.fillStyle = `rgba(255,255,255,${flash})`; ctx.fillRect(0, 0, W, H); }
  const b = appear(t, T.sank, 0.3), c = appear(t, T.sank + 1.1, 0.3); if (c > 0) xf(CX, 380, c, 0, () => banner('SPLASH.', CX, 380, 120, '#b3261e')); else if (b > 0) xf(CX, 380, b, 0, () => banner('STORM!', CX, 380, 120, '#2a3a5a'));
}
function sceneSold(t) {
  island(t, true); rai(CX, 1130, 280); text('(stays put)', CX + 40, 1290, 44, 800, 'rgba(60,50,30,0.7)', 'center', 0.02);
  const sw = seg(t, T.announce, T.announce + 0.4); const fc = sw < 0.5 ? '#d9462d' : '#2a6bd9'; line(CX, 850, CX, 680, '#6b4a34', 10); poly([[CX, 680], [CX + 130 * (1 - Math.abs(sw - 0.5) * 0.6), 715 + sine(t, 6, 6)], [CX, 750]], fc);
  person(200, 1650, 470, 41, { skin: '#c68a62', shirt: '#e08a6d', pants: '#575b4c', arm: 'up', wave: t * 1.5, mouth: 'open', bounce: t * 4 }); person(880, 1650, 470, 42, { skin: '#8a5537', shirt: '#6c8ebf', pants: '#3d424f', dir: -1, bounce: t * 3 });
  const a = appear(t, T.announce, 0.3); if (a > 0) xf(300, 560, a, 0, () => speech(330, 440, ['IT\'S HIS NOW!'], { size: 62, tail: [210, 1170] }));
  const b = appear(t, T.sold + 0.3, 0.3); if (b > 0 && t < T.announce) xf(CX, 400, b, 0, () => banner('A SALE', CX, 400, 90, '#2f8a54'));
}
function sceneNoBank(t) {
  island(t, true); const a = appear(t, T.nobank + 0.15, 0.35), b = appear(t, T.nobank + 0.95, 0.35);
  xf(300, 700, a, 0, () => { shadow(300, 740, 150); fillRR(160, 560, 280, 180, 4, '#e9dfd0'); poly([[140, 560], [300, 470], [460, 560]], '#9a8a74'); for (let i = 0; i < 4; i++) fillRR(180 + i * 64, 590, 36, 130, 4, '#c9bfae'); fillRR(160, 735, 280, 14, 4, '#b5a98e'); const c = seg(t, T.nobank + 0.5, T.nobank + 0.7); if (c > 0) crossOut(300, 640, 120 * c); });
  xf(780, 640, b, 0, () => { ctx.save(); ctx.translate(780, 640); ctx.rotate(0.06); fillRR(-120, -170, 240, 340, 10, '#fff'); for (let i = 0; i < 6; i++) fillRR(-86, -130 + i * 38, 172 - (i % 3) * 36, 10, 4, '#b8b5aa'); fillRR(-86, 100, 172, 16, 4, '#3a2a1a'); const c = seg(t, T.nobank + 1.3, T.nobank + 1.5); if (c > 0) crossOut(0, 0, 130 * c); ctx.restore(); });
  [130, 330, 540, 750, 950].forEach((x, i) => { const dir = x < 540 ? 1 : -1; person(x, 1650, 420 + (i % 2) * 30, 50 + i, { skin: SKIN[2 + (i % 3)], dir: x === 540 ? 1 : dir, bounce: t * 3 + i, shirt: SHIRT[i + 3] });
    const r = appear(t, T.remember + i * 0.14, 0.3); if (r > 0) xf(x, 1000, r, 0, () => { thought(x, 1010, 95, 70, [x, 1180]); rai(x, 1008, 40); }); });
}
function ledgerMan(t, shut, bob = 0) { // seated behind a desk: figure first, desk in front
  ctx.fillStyle = '#e8d9b8'; ctx.fillRect(0, 0, W, 1300); ctx.fillStyle = 'rgba(0,0,0,0.06)'; ctx.fillRect(0, 1200, W, 100);
  fillRR(70, 260, 250, 380, 8, '#bfe0f5'); strokeRR(70, 260, 250, 380, 8, '#8a7a64', 10);
  const sk = '#d9a27a'; ctx.save(); ctx.translate(0, bob); person(540, 1590, 640, 6, { skin: sk, shirt: '#8ea2b8', pants: '#3d424f', noShadow: true, hairStyle: 'none', mouth: 'flat' }); tiredEyes(540, 1590, 640, sk, shut); ctx.restore();
  fillRR(0, 1300, W, 620, 0, '#7a5a3a'); fillRR(0, 1300, W, 30, 0, '#a07852'); ctx.fillStyle = 'rgba(0,0,0,0.12)'; ctx.fillRect(0, 1330, W, 14);
  fillRR(330, 1262, 420, 38, 6, '#8a2a2a'); fillRR(340, 1252, 400, 14, 4, '#f4efe0'); text('LEDGER', 540, 1282, 24, 800, '#f4efe0', 'center', 0.2); // the book lies flat on the desk top
  fillRR(820, 1240, 70, 60, 8, '#fff'); fillRR(886, 1255, 22, 30, 11, '#fff'); for (let i = 0; i < 3; i++) { const k = (t * 0.6 + i / 3) % 1; ellipse(855 + sine(t + i, 3, 8), 1225 - k * 60, 8, 14, `rgba(255,255,255,${0.4 * (1 - k)})`); }
}
function sceneLedger(t) {
  ledgerMan(t, 0.5 + 0.5 * Math.abs(Math.sin(t * 0.9)));
  const b = appear(t, T.ledger, 0.35); xf(CX, 200, b, 0, () => banner('THE LEDGER', CX, 200, 90, '#8a2a2a', '#fff', -0.03));
  const k = appear(t, T.man - 0.3, 0.4); if (k > 0) xf(CX, 640, k, 0, () => { thought(CX, 640, 360, 150, [CX, 930]); for (let i = 0; i < 8; i++) { const x = 270 + (i % 4) * 180, y = 590 + Math.floor(i / 4) * 100; rai(x, y + sine(t + i, 3, 3), 34); text(['Ana', 'Ben', 'Kai', 'Lu'][i % 4], x, y + 56, 22, 800, '#3a2a1a', 'center', 0); } });
  const z = seg(t, T.man + 0.2, T.man + 0.6); if (z > 0) ['Z', 'z', 'z'].forEach((s, i) => withFade(z, () => text(s, 700 + i * 50 + sine(t + i, 2, 10), 1000 - i * 50 - ((t * 20) % 40), 60 - i * 12, 800, '#6a5a8a', 'center', 0)));
}
function sceneDayOff(t) {
  ledgerMan(t, 1, sine(t, 2, 6) + 6); const b = appear(t, T.dayoff - 0.1, 0.35);
  xf(CX, 460, b, 0, () => { fillRR(190, 260, 700, 440, 18, '#fff'); fillRR(190, 260, 700, 80, 18, '#b3261e'); text('DAYS', CX, 302, 44, 800, '#fff', 'center', 0.3);
    for (let i = 0; i < 28; i++) { const x = 235 + (i % 7) * 88, y = 380 + Math.floor(i / 7) * 74; fillRR(x, y, 70, 58, 6, '#f1ece0'); const c = seg(t, T.dayoff + 0.1 + i * 0.05, T.dayoff + 0.25 + i * 0.05); if (c > 0) crossOut(x + 35, y + 29, 20 * c, '#b3261e', 6); } });
  const y = appear(t, T.years, 0.35); if (y > 0) xf(CX, 800, y, 0, () => banner('DAYS OFF: 0', CX, 800, 90, '#b3261e', '#fff', 0.03));
}
function scenePay(t) {
  ctx.fillStyle = '#e9dfd0'; ctx.fillRect(0, 0, W, 1250); fillRR(0, 1180, W, 70, 0, '#cbb99d'); fillRR(70, 250, 200, 300, 8, '#cfe7f3'); strokeRR(70, 250, 200, 300, 8, '#8a7a64', 8); fillRR(810, 250, 200, 300, 8, '#cfe7f3'); strokeRR(810, 250, 200, 300, 8, '#8a7a64', 8);
  person(540, 1580, 640, 9, { skin: '#d9a27a', shirt: '#6c8ebf', pants: '#3d424f', glasses: true, arm: 'wave', wave: t, mouth: 'open', eyes: 'wide', noShadow: true, bounce: t * 2 });
  fillRR(0, 1270, W, 650, 0, '#7a5a3a'); fillRR(0, 1270, W, 30, 0, '#a07852'); fillRR(160, 1190, 150, 80, 12, '#1b1f27'); fillRR(172, 1202, 126, 40, 6, '#a5a0ff'); fillRR(790, 1230, 130, 40, 8, '#8a6a3a');
  [['Did Priya pay?', 210, 700, 0.1], ['Jordan owes?', 860, 560, 0.5], ['Deposit??', 190, 1010, 0.9], ['Paid... maybe?', 860, 930, 1.3]].forEach(([s, x, y, d], i) => { const e = appear(t, T.pay + d, 0.3); if (e > 0) xf(x, y, e, 0, () => postit(x, y + sine(t + i, 2, 6), 210, s.split(' ').length > 2 ? [s.split(' ').slice(0, 2).join(' '), s.split(' ').slice(2).join(' ')] : [s], sine(i, 7, 0.08), ['#ffe27a', '#ffb3a7', '#b5e8c9', '#c7d7ff'][i])); });
}
// ═════════════ the product ═════════════
const PAYS = [['Priya S.', '$85', 'PAID', GREEN, 1], ['Marcus T.', '$120', 'PAID', GREEN, 2], ['Ava R.', '$60', 'SENT', AMBER, 3], ['Jordan K.', '$95', 'PAID', GREEN, 0], ['Dana L.', '$40', 'OVERDUE', RED, 4]];
function sceneInvoice(t) {
  stage(t, 0.22);
  withFade(enter(t, T.invoice - 0.1, T.tracked, 0.2), () => {
    eyebrow('INVOICING · PAYMENT LINKS', 300); card(CARD.x, 350, CARD.w, 640);
    text('Invoice', CARD.x + 44, 420, 40, 800, '#fff', 'left'); const sent = t > T.invoice + 0.9, paid = t > T.link + 1.0;
    tag(CARD.x + CARD.w - 44, 420, paid ? 'PAID' : sent ? 'SENT' : 'DRAFT', paid ? GREEN : sent ? IN.mid : MUTED, false, 20); text('Priya S.', CARD.x + 44, 476, 28, 600, SOFT, 'left');
    [['Consultation', '$40'], ['Treatment', '$60']].forEach(([n, a], i) => { const y = 560 + i * 90, e = ease.out(seg(t, T.invoice + i * 0.2, T.invoice + 0.3 + i * 0.2)); withFade(e, () => { ctx.fillStyle = 'rgba(255,255,255,0.08)'; ctx.fillRect(CARD.x + 44, y - 45, CARD.w - 88, 2); text(n, CARD.x + 44, y, 32, 600, '#fff', 'left'); text(a, CARD.x + CARD.w - 44, y, 32, 700, '#fff', 'right'); }); });
    ctx.fillStyle = 'rgba(255,255,255,0.08)'; ctx.fillRect(CARD.x + 44, 735, CARD.w - 88, 2); text('Total', CARD.x + 44, 790, 34, 800, '#fff', 'left'); text('$100', CARD.x + CARD.w - 44, 790, 44, 800, '#fff', 'right', -0.01);
    const press = t > T.invoice + 0.7 && t < T.invoice + 0.9 ? 0.95 : 1; xf(CX, 905, press, 0, () => { fillRR(CARD.x + 44, 850, CARD.w - 88, 100, 50, sent ? rgba(IN.mid, 0.25) : C.primary); text(sent ? 'Invoice sent ✓' : 'Send invoice', CX, 902, 34, 800, '#fff', 'center'); });
    const l = pop(t, T.link, 0.3); if (l > 0) xf(CX, 1150, clamp(l), 0, () => { bubble(CARD.x + 220, 1060, CARD.w - 220, ['Here\'s your payment link'], true); fillRR(CARD.x + 380, 1140, CARD.w - 380, 90, 45, '#fff'); text('Pay securely →', CARD.x + 380 + (CARD.w - 380) / 2, 1186, 32, 800, C.primary, 'center'); });
    const p = pop(t, T.link + 1.0, 0.35); if (p > 0) xf(CX, 1330, clamp(p), 0, () => { circle(CX - 190, 1330, 30, GREEN); check(CX - 190, 1331, 30, '#fff', 5); text('Payment received', CX - 140, 1331, 38, 800, '#fff', 'left'); });
  });
}
function scenePayments(t) {
  stage(t, 0.22);
  withFade(enter(t, T.tracked - 0.1, T.offer, 0.2), () => {
    eyebrow('PAYMENTS · INVOICES · POS', 300); card(CARD.x, 350, CARD.w, 860);
    PAYS.forEach(([n, a, st, col, ci], i) => { const y = 450 + i * 150, e = ease.out(seg(t, T.tracked + i * 0.12, T.tracked + 0.35 + i * 0.12)); withFade(e, () => { if (i) { ctx.fillStyle = 'rgba(255,255,255,0.07)'; ctx.fillRect(CARD.x + 30, y - 75, CARD.w - 60, 2); }
      avatar(CARD.x + 76, y, 38, n.slice(0, 2).toUpperCase(), NAMES[ci][1]); text(n, CARD.x + 136, y - 14, 30, 800, '#fff', 'left'); text(a, CARD.x + 136, y + 26, 26, 600, SOFT, 'left'); tag(CARD.x + CARD.w - 36, y, st, col, false, 20); }); });
    const k = pop(t, T.tired, 0.35); if (k > 0) xf(CX, 1330, clamp(k), 0, () => { card(CARD.x, 1250, CARD.w, 140, { fill: rgba(GREEN, 0.1), stroke: rgba(GREEN, 0.5) }); avatar(CARD.x + 90, 1320, 40, 'LK', '#6a5a8a'); text('Ledger keeper', CARD.x + 160, 1302, 32, 800, '#fff', 'left'); text('Retired from remembering', CARD.x + 160, 1342, 24, 500, SOFT, 'left'); tag(CARD.x + CARD.w - 36, 1320, 'ON VACATION', GREEN, false, 18); });
  });
}
const SCENES = [[0, T.feet, sceneHook], [T.feet, T.canoe, sceneScale], [T.canoe, T.sank, sceneCanoe], [T.sank, T.sold, sceneSank], [T.sold, T.nobank, sceneSold], [T.nobank, T.ledger, sceneNoBank], [T.ledger, T.dayoff, sceneLedger], [T.dayoff, T.pay, sceneDayOff], [T.pay, T.brand, scenePay],
  [T.brand, T.invoice, (t) => brandHit(t, T.brand, T.invoice)], [T.invoice, T.tracked, sceneInvoice], [T.tracked, T.offer, scenePayments], [T.offer, T.end, (t) => offerCard(t, T.offer, T.end)], [T.end, 999, (t) => endCard(t, T.end, T.cta, T.url)]];
cue(0.35, 'swish', 0.7); cue(T.rock, 'punch', 0.9); cue(T.feet, 'swish', 0.7); cue(T.tenft, 'ding', 0.9); cue(T.canoe, 'swoosh', 0.7); cue(T.far, 'punch', 0.8); cue(T.sank, 'punch', 1); cue(T.sank + 1.0, 'swoosh', 0.8); cue(T.owned, 'ding', 1);
cue(T.sold, 'swish', 0.7); cue(T.announce, 'ding', 1); cue(T.nobank + 0.15, 'tap', 0.8); cue(T.nobank + 0.95, 'tap', 0.8); [0, 1, 2, 3, 4].forEach((i) => cue(T.remember + i * 0.14, 'notification', 0.4));
cue(T.ledger, 'punch', 0.9); cue(T.man, 'notification', 0.8); cue(T.dayoff, 'swish', 0.7); for (let i = 0; i < 8; i++) cue(T.dayoff + 0.1 + i * 0.2, 'tap', 0.4); cue(T.years, 'punch', 1);
[0.1, 0.5, 0.9, 1.3].forEach((d) => cue(T.pay + d, 'notification', 0.8)); cue(T.brand, 'transitionHit', 1); cue(T.invoice, 'key', 0.6); cue(T.invoice + 0.7, 'tap', 1); cue(T.link, 'notification', 1); cue(T.link + 1.0, 'ding', 1);
[0, 1, 2, 3, 4].forEach((i) => cue(T.tracked + i * 0.12, 'key', 0.5)); cue(T.tired, 'ding', 1); cue(T.offer, 'punch', 1); cue(T.offer + 0.7, 'ding', 0.9); cue(T.end, 'swish', 0.8); cue(T.cta, 'tap', 1.2);
boot({ duration: DURATION, scenes: SCENES, brandAt: T.brand, hideCaption: (t) => t >= T.end - 0.1,
  after: (t) => { const f = 1 - seg(t, T.brand, T.brand + 0.12); if (t >= T.brand && f > 0) { ctx.fillStyle = rgba('#ffffff', 0.5 * f); ctx.fillRect(0, 0, W, H); } } }, 'yap');
