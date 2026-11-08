// MsgHealth · "Copper money" · story-hook vertical ad (1080 × 1920, 30 fps), built on src/kit.js + src/audit.js.
// Real story: Sweden minted huge copper plate money from 1644 (the biggest weighed about 43 lb / 19.7 kg), so large payments needed a cart;
// in 1661 Stockholms Banco issued Europe's first banknotes. Pivot: getting paid shouldn't mean carrying anything, and chasing invoices
// is heavy too. MsgHealth sends the invoice and takes the payment from the chat. Offer: free retention audit, comment KEEP. Voiceover: assets/audio/plates/.
'use strict';
const word = (l, k) => VO_AT[l] + VO_CLIPS[l].chunks[k][1];
const T = { plates: word(0, 1), heavy: VO_AT[1], forty: word(1, 1), backs: VO_AT[2], onback: word(2, 1), cart: word(2, 2), note: VO_AT[3], bank: word(3, 1), inv: word(3, 2), paper: VO_AT[4], horse: word(4, 1), paid: VO_AT[5], chase: VO_AT[6],
  brand: VO_AT[7], pay: word(7, 1), same: VO_AT[8], ask: VO_AT[9], cmt: VO_AT[10], end: VO_AT[11] - 0.1, url: VO_AT[11] + 0.1 };
T.inv2 = T.brand + 1.4; T.cta = T.end + 1.25;
const DURATION = +(T.cta + 1.0).toFixed(2);
window.CUES = T; window.SFX = []; const cue = (t, kind, gain) => window.SFX.push({ t, kind, gain });
window.MUSIC = { bpm: 98, root: 47, brandAt: T.brand, mood: 'sneaky', bed: false, fx: 0.5 };

const GR = 1240;
function town(t) { ctx.fillStyle = vgrad(0, GR, '#cfe0ea', '#f2ead6'); ctx.fillRect(0, 0, W, GR); [[0, 560, 300, '#b5654a'], [300, 480, 320, '#d9b25a'], [620, 600, 260, '#8a9fb5'], [880, 520, 260, '#b5654a']].forEach(([x, y, w, c], i) => { fillRR(x, y, w, GR - y, 4, c); poly([[x - 6, y], [x + w / 2, y - 90], [x + w + 6, y]], '#6b4a34'); for (let r = 0; r < 3; r++) fillRR(x + 40, y + 60 + r * 130, 60, 80, 4, '#f4f1ea'), fillRR(x + w - 100, y + 60 + r * 130, 60, 80, 4, '#f4f1ea'); }); ctx.fillStyle = '#9a8a74'; ctx.fillRect(0, GR, W, H - GR); ctx.fillStyle = 'rgba(0,0,0,0.06)'; ctx.fillRect(0, GR, W, 120); }
function plateShape(x, y, w, h, rot = 0) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); fillRR(-w / 2, -h / 2, w, h, 12, '#b87333'); strokeRR(-w / 2, -h / 2, w, h, 12, '#8a5424', 8); fillRR(-w / 2 + 14, -h / 2 + 14, w - 28, h - 28, 6, 'rgba(255,220,170,0.18)'); circle(0, 0, h * 0.2, '#8a5424'); circle(0, 0, h * 0.14, '#cf8a4a'); [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b]) => circle(a * (w / 2 - 28), b * (h / 2 - 28), 8, '#8a5424')); ctx.restore(); }
function note(x, y, s, rot = 0) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); fillRR(-170, -90, 340, 180, 10, '#f4ecd2'); strokeRR(-170, -90, 340, 180, 10, '#7a6a3a', 5); strokeRR(-150, -70, 300, 140, 6, '#b5a46a', 3); text('BANCO', 0, -22, 50, 800, '#5a4a20', 'center', 0.1); text('★ ★ ★', 0, 34, 36, 800, '#b88a2a', 'center', 0.1); ctx.restore(); }
function wagon(x, y, s, t = 0, n = 6) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ellipse(60, 8, 280, 20, 'rgba(0,0,0,0.2)'); fillRR(-200, -170, 380, 110, 10, '#6b4a34'); for (let i = 0; i < n; i++) plateShape(-150 + i * 62, -200 - (i % 2) * 10, 70, 56, 0.05 * i); [-110, 110].forEach((wx) => { circle(wx, -30, 60, '#4a3220'); circle(wx, -30, 26, '#8a6a43'); for (let k = 0; k < 6; k++) line(wx, -30, wx + Math.cos(t * 3 + k * 1.05) * 56, -30 + Math.sin(t * 3 + k * 1.05) * 56, '#8a6a43', 5); });
  fillRR(180, -120, 120, 30, 8, '#6b4a34'); fillRR(300, -190, 190, 100, 40, '#8a6a43'); [320, 440].forEach((hx) => fillRR(hx, -100, 24, 100, 6, '#6b5333')); poly([[470, -190], [540, -160], [470, -140]], '#8a6a43'); ellipse(300, -190, 30, 50, '#6b4a34'); ctx.restore(); }
function sceneCopper(t) {
  town(t); text('1644', CX, 230, 160, 800, 'rgba(70,45,20,0.85)', 'center', -0.02);
  const k = pop(t, T.plates - 0.1, 0.45); xf(CX, 900, clamp(k), 0, () => { plateShape(CX, 900, 600, 420, Math.sin(t * 1.5) * 0.04); });
  person(180, 1500, 480, 24, { skin: '#d9a27a', shirt: '#7a3a2a', pants: '#3d3a30', hat: '#4a3220', arm: 'up', wave: t, eyes: 'wide', mouth: 'open' });
  person(900, 1500, 480, 64, { skin: '#c68a62', shirt: '#2a4a6a', pants: '#2c3340', dir: -1, eyes: 'wide' });
}
function sceneScale(t) {
  town(t); const k = pop(t, T.heavy, 0.4), sw = Math.sin(t * 4) * 0.02 * (1 - seg(t, T.forty, T.forty + 0.6));
  fillRR(CX - 30, 760, 60, 480, 6, '#4a3a2a'); fillRR(CX - 260, 1200, 520, 50, 10, '#4a3a2a'); ctx.save(); ctx.translate(CX, 780); ctx.rotate(0.12 * (1 - ease.out(seg(t, T.heavy + 0.2, T.heavy + 0.8))) - 0.12 + sw + 0.12 * ease.out(seg(t, T.heavy + 0.2, T.heavy + 0.8))); fillRR(-340, -14, 680, 28, 8, '#6b6a70'); line(-300, 0, -300, 160, '#6b6a70', 6); line(300, 0, 300, 160, '#6b6a70', 6); fillRR(-420, 160, 240, 24, 10, '#8a8a92'); fillRR(180, 160, 240, 24, 10, '#8a8a92'); xf(-300, 120, clamp(k), 0, () => plateShape(-300, 100, 200, 130, 0)); ctx.restore();
  const f = pop(t, T.forty - 0.05, 0.4); if (f > 0) xf(CX, 500, clamp(f), 0, () => { fillRR(220, 400, 640, 200, 30, '#1b1b20'); text('43 LB', CX, 504, 140, 800, '#7dffb0', 'center', -0.02); });
}
function sceneCarry(t) {
  town(t); const x = lerp(-250, 380, ease.out(seg(t, T.backs, T.onback + 1.4)));
  person(x, 1500, 520, 31, { skin: '#d9a27a', shirt: '#7a3a2a', pants: '#3d3a30', hat: '#4a3220', dir: 1, bounce: t * 6, mouth: 'open', eyes: 'wide' }); plateShape(x - 70, 1200, 260, 180, -0.5);
  const w = lerp(1500, 760, ease.out(seg(t, T.cart - 0.1, T.cart + 0.9))); wagon(w, 1500, 1.0, t, 6);
}
function sceneBank(t) {
  town(t); text('1661', CX, 230, 160, 800, 'rgba(70,45,20,0.85)', 'center', -0.02);
  fillRR(160, 560, 760, 700, 6, '#efe3c8'); poly([[130, 560], [CX, 380], [950, 560]], '#8a6a43'); for (let i = 0; i < 5; i++) fillRR(200 + i * 140, 620, 50, 560, 6, '#e2d3b0'); fillRR(440, 960, 200, 300, 6, '#6b4a34'); fillRR(300, 700, 480, 100, 10, '#1b1b20'); text('STOCKHOLMS BANCO', CX, 752, 38, 800, '#ffd84d', 'center', 0.08);
  const k = ease.inOut(seg(t, T.note, T.note + 1.4)); if (k > 0) note(lerp(CX, CX, k), lerp(900, 1200, ease.out(k)) - Math.sin(k * Math.PI) * 120, lerp(0.5, 1.1, k), Math.sin(k * 6) * 0.2);
}
function sceneNote(t) {
  ctx.fillStyle = '#efe0c0'; ctx.fillRect(0, 0, W, H); const k = pop(t, T.paper, 0.45); xf(CX, 760, clamp(k), 0, () => { glow(CX, 760, 520, '#fff2b0', 0.4); note(CX, 760, 2.4, Math.sin(t * 2) * 0.03); });
  const h = ease.in(seg(t, T.horse - 0.2, T.horse + 1.4)); wagon(lerp(780, 1700, h), 1500, 0.8, t, 6); text('PAPER', CX, 1130, 60, 800, '#5a4a20', 'center', 0.2);
}
function sceneLight(t) {
  ctx.fillStyle = vgrad(0, H, '#cfe0ea', '#f2ead6'); ctx.fillRect(0, 0, W, H); ctx.fillStyle = '#9a8a74'; ctx.fillRect(0, GR + 100, W, H); person(CX, 1500, 620, 18, { skin: '#d9a27a', shirt: '#6c8ebf', pants: '#3d424f', arm: 'wave', wave: t * 1.5, mouth: 'open', bounce: t * 4 });
  const s = pop(t, T.paid + 0.2, 0.4); if (s > 0) xf(CX, 560, clamp(s), 0, () => { text('♪', CX - 250, 700, 100, 800, '#6c8ebf', 'center', 0); text('NOTHING TO CARRY', CX, 560, 80, 800, '#1b2a4a', 'center', -0.02); });
}
function sceneHeavy(t) {
  ctx.fillStyle = '#e4d6bd'; ctx.fillRect(0, 0, W, 1250); ctx.fillStyle = '#8b7355'; ctx.fillRect(0, 1250, W, 670);
  const k = t - T.chase, n = Math.min(14, Math.floor(k * 5)); person(CX, 1500, 520, 18, { skin: '#d9a27a', shirt: '#6c8ebf', pants: '#3d424f', eyes: 'wide', mouth: 'open', bounce: t * 10, noShadow: false });
  for (let i = 0; i < n; i++) { const y = 1220 - i * 62, x = CX + Math.sin(i * 1.7) * 14 + Math.sin(t * 3 + i) * 3; fillRR(x - 170, y - 30, 340, 60, 4, '#fff'); strokeRR(x - 170, y - 30, 340, 60, 4, '#c9c3b5', 2); text('INVOICE', x - 145, y, 24, 800, '#6b6a80', 'left', 0.1); if (i % 3 === 0) text('OVERDUE', x + 145, y, 20, 800, '#b3261e', 'right', 0.1); }
}
function sceneInvoice(t) {
  stage(t, 0.22); eyebrow('INVOICES & PAYMENTS', 290); const paid = ease.out(seg(t, T.same + 0.9, T.same + 1.2)) > 0.5;
  card(CARD.x, 340, CARD.w, 300); text('Invoice #1042', CARD.x + 50, 410, 40, 800, '#fff', 'left'); text('Jordan K. · Haircut', CARD.x + 50, 460, 26, 500, SOFT, 'left'); text('$65.00', CARD.x + 50, 560, 80, 800, '#fff', 'left', -0.03);
  tag(CARD.x + CARD.w - 40, 410, paid ? 'PAID' : 'SENT', paid ? GREEN : AMBER, true, 26);
  const a = pop(t, T.pay + 0.0, 0.3), b = pop(t, T.same + 0.2, 0.3), c = pop(t, T.same + 0.9, 0.35);
  if (a > 0) xf(CX, 800, clamp(a), 0, () => bubble(140, 720, 800, ['Here’s your invoice, Jordan.', 'Pay in one tap.'], false)); if (b > 0) xf(CX, 1000, clamp(b), 0, () => { fillRR(190, 920, 700, 110, 55, C.primary); text('Pay now · $65.00', CX, 976, 40, 800, '#fff', 'center'); });
  if (c > 0) xf(CX, 1190, clamp(c), 0, () => { fillRR(190, 1100, 700, 150, 28, rgba(GREEN, 0.14)); strokeRR(190, 1100, 700, 150, 28, GREEN, 3); circle(270, 1175, 30, GREEN); check(270, 1176, 30, '#fff', 5); text('Payment received', 330, 1160, 36, 800, '#fff', 'left', 0); text('No chasing needed', 330, 1210, 26, 600, '#9ff0c0', 'left', 0); });
}
const SCENES = [[0, T.heavy, sceneCopper], [T.heavy, T.backs, sceneScale], [T.backs, T.note, sceneCarry], [T.note, T.paper, sceneBank], [T.paper, T.paid, sceneNote], [T.paid, T.chase, sceneLight], [T.chase, T.brand, sceneHeavy],
  [T.brand, T.inv2, (t) => brandHit(t, T.brand, T.inv2)], [T.inv2, T.ask, sceneInvoice], [T.ask, T.end, sceneAudit], [T.end, 999, (t) => auditEnd(t, T.end, T.cta, T.url)]];
cue(T.plates - 0.1, 'punch', 0.9); cue(T.heavy, 'swish', 0.7); cue(T.heavy + 0.4, 'tap', 0.9); cue(T.forty - 0.05, 'ding', 1); cue(T.backs, 'swish', 0.7); cue(T.cart, 'punch', 0.9); cue(T.note, 'swish', 0.8); cue(T.note + 1.4, 'ding', 0.9); cue(T.paper, 'punch', 1); cue(T.horse, 'swish', 0.8);
cue(T.paid, 'swish', 0.6); cue(T.paid + 0.2, 'ding', 0.8); cue(T.chase, 'transition', 0.7); for (let i = 0; i < 12; i++) cue(T.chase + i * 0.2, 'tap', 0.4); cue(T.brand, 'transitionHit', 1); cue(T.pay, 'notification', 0.9); cue(T.same + 0.2, 'tap', 0.9); cue(T.same + 0.9, 'ding', 1);
cue(T.ask, 'punch', 1); for (let i = 0; i < 4; i++) cue(T.cmt + 0.45 + i * 0.11, 'key', 0.6); cue(T.cmt + 1.0, 'ding', 0.9); cue(T.end, 'swish', 0.8); cue(T.cta, 'tap', 1.2);
boot({ duration: DURATION, scenes: SCENES, brandAt: T.brand, hideCaption: (t) => t >= T.end - 0.1,
  after: (t) => { const f = 1 - seg(t, T.brand, T.brand + 0.12); if (t >= T.brand && f > 0) { ctx.fillStyle = rgba('#ffffff', 0.5 * f); ctx.fillRect(0, 0, W, H); } } }, 'plates');
