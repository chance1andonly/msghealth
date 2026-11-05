// MsgHealth · "One app" · direct-response vertical ad (1080 × 1920, 30 fps), built on src/kit.js.
// Hook: eight apps to keep your customers. MsgHealth puts client health, automations (SMS/email), bookings, inbox,
// payments & invoicing, reviews, loyalty and reports in one place, then the 50%-off-first-month offer.
// Voiceover: assets/audio/all/vo-NN.wav, timed by VO_AT in src/all-vo.js.
'use strict';
const word = (l, k) => VO_AT[l] + VO_CLIPS[l].chunks[k][1];
const T = {
  eight: word(1, 1), brand: VO_AT[2], grid: word(2, 1), health: word(3, 0), auto: word(3, 1), book: word(4, 0), inbox: word(4, 0) + 0.65, pay: word(4, 1), rev: word(5, 0), loy: word(5, 0) + 0.55, rep: word(5, 1),
  one: VO_AT[6], bill: word(6, 1), offer: VO_AT[7], end: VO_AT[8] - 0.1, url: VO_AT[8] + 0.1,
};
T.tap = T.end + 1.25;
const DURATION = +(T.tap + 1.0).toFixed(2);
window.CUES = T; window.SFX = []; const cue = (t, kind, gain) => window.SFX.push({ t, kind, gain });
window.MUSIC = { bpm: 124, root: 48, brandAt: T.brand, mood: 'bouncy' };

const APPS = [['CRM', '#e5803b'], ['SMS', '#3dbb74'], ['Cal', '#d9468a'], ['Mail', '#0ea5a4'], ['Pay', '#6c8ebf'], ['Stars', '#f2b441'], ['Perks', '#9b6bd9'], ['Stats', '#ec5f4f']];
function sceneChaos(t) {
  stage(t, 0.1);
  const conv = ease.in(seg(t, T.brand - 0.45, T.brand)), head = pop(t, 0.2, 0.3);
  xf(CX, 300, clamp(head), 0, () => { text('RUNNING A BUSINESS', CX, 290, 68, 800, '#fff', 'center', -0.02); text('IS HARD ENOUGH.', CX, 380, 68, 800, SOFT, 'center', -0.02); });
  APPS.forEach(([n, col], i) => {
    const e = pop(t, 0.9 + i * 0.1, 0.3), bx = 220 + (i % 3) * 320 + (i > 5 ? 160 : 0), by = 640 + Math.floor(i / 3) * 250, fx = Math.sin(t * 1.3 + i * 2) * 26, fy = Math.cos(t * 1.1 + i) * 22;
    const x = lerp(bx + fx, CX, conv), y = lerp(by + fy, 860, conv); if (e <= 0) return;
    xf(x, y, clamp(e) * (1 - conv * 0.9), 0, () => { fillRR(x - 80, y - 80, 160, 160, 36, col); text(n, x, y + 2, 40, 800, '#fff', 'center'); const bd = pop(t, T.eight - 0.1 + i * 0.12, 0.25); if (bd > 0) { circle(x + 70, y - 70, 24 * bd, RED); text(String(1 + (i * 3) % 9), x + 70, y - 69, 24 * bd, 800, '#fff', 'center'); } });
  });
  const c = pop(t, T.eight, 0.3); if (c > 0 && t < T.brand - 0.3) xf(CX, 1350, c, 0, () => text('8 APPS · 8 LOGINS · 8 BILLS', CX, 1350, 46, 800, '#ffb0a8', 'center', 0.02));
}
const FEATS = [['Client health', '86', T.health], ['Automations', 'SMS · Email', T.auto], ['Bookings', 'Thu 10:00', T.book], ['Inbox', '3 new', T.inbox], ['Payments', 'Paid ✓', T.pay], ['Reviews', '★ 4.9', T.rev], ['Loyalty', '100 pts', T.loy], ['Reports', 'Revenue ↑', T.rep]];
function sceneGrid(t) {
  stage(t, 0.2);
  withFade(enter(t, T.grid - 0.05, T.one, 0.2), () => {
    eyebrow('ALL IN ONE PLACE', 330); logoLockup(CX, 430, 54);
    FEATS.forEach(([n, v, at], i) => {
      const c = i % 2, r = Math.floor(i / 2), x = CARD.x + c * 450, y = 520 + r * 220, k = pop(t, at, 0.3), on = k > 0.1;
      fillRR(x, y, 430, 196, 28, on ? rgba(C.primary, 0.16) : 'rgba(255,255,255,0.04)'); strokeRR(x, y, 430, 196, 28, on ? rgba(IN.mid, 0.7) : 'rgba(255,255,255,0.1)', on ? 3 : 2);
      withFade(clamp(0.25 + k), () => { text(n.toUpperCase(), x + 30, y + 56, 22, 800, on ? IN.hi : MUTED, 'left', 0.14); xf(x + 30, y + 130, 0.8 + 0.2 * clamp(k), 0, () => text(v, x + 30, y + 128, 52, 800, '#fff', 'left', -0.02)); if (on) { circle(x + 388, y + 48, 18, GREEN); check(x + 388, y + 49, 18, '#fff', 3.5); } });
    });
  });
}
function sceneOne(t) {
  stage(t, 0.26);
  withFade(enter(t, T.one - 0.05, T.offer, 0.15), () => {
    const a = pop(t, T.one, 0.3), b = pop(t, T.bill, 0.3);
    xf(CX, 700, clamp(a), 0, () => text('ONE LOGIN.', CX, 700, 120, 800, '#fff', 'center', -0.03)); xf(CX, 860, clamp(b), 0, () => text('ONE BILL.', CX, 860, 120, 800, IN.mid, 'center', -0.03));
    withFade(seg(t, T.bill + 0.3, T.bill + 0.6), () => logoLockup(CX, 1060, 60));
  });
}
const SCENES = [[0, T.brand, sceneChaos], [T.brand, T.grid, (t) => brandHit(t, T.brand, T.grid)], [T.grid, T.one, sceneGrid], [T.one, T.offer, sceneOne], [T.offer, T.end, (t) => offerCard(t, T.offer, T.end)], [T.end, 999, (t) => endCard(t, T.end, T.tap, T.url)]];
cue(0.2, 'punch', 0.7); APPS.forEach((_, i) => cue(0.9 + i * 0.1, 'tap', 0.4)); cue(T.eight, 'notification', 0.9); cue(T.brand - 0.3, 'swoosh', 0.9); cue(T.brand, 'transitionHit', 1);
FEATS.forEach(([, , at]) => cue(at, 'key', 0.8)); cue(T.one, 'punch', 1); cue(T.bill, 'punch', 1); cue(T.offer, 'punch', 1); cue(T.offer + 0.7, 'ding', 0.9); cue(T.end, 'swish', 0.8); cue(T.tap, 'tap', 1.2);
boot({ duration: DURATION, scenes: SCENES, brandAt: T.brand, hideCaption: (t) => t >= T.end - 0.1,
  after: (t) => { const f = 1 - seg(t, T.brand, T.brand + 0.12); if (t >= T.brand && f > 0) { ctx.fillStyle = rgba('#ffffff', 0.5 * f); ctx.fillRect(0, 0, W, H); } } }, 'all');
