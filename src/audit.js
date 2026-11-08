// Shared offer scenes for the story ads (wald, michelin, pudding, belville, plates): the free retention audit card (comment KEEP)
// and the end card. Loaded after src/kit.js; reads the ad's own global T (T.ask, T.cmt, T.end, T.cta, T.url).
'use strict';
// ═════════════ the offer: a free audit, comment KEEP ═════════════
function sceneAudit(t) {
  const at = T.ask; stage(t, 0.3);
  withFade(enter(t, at - 0.02, T.end, 0.15), () => {
    const k = pop(t, at, 0.35); xf(CX, 430, 0.6 + 0.4 * clamp(k), 0, () => { ctx.save(); ctx.globalAlpha = clamp(k * 1.4); tag(CX + 70, 330, 'FREE', GREEN, true, 30); text('Retention', CX, 470, 150, 800, '#fff', 'center', -0.04); text('audit', CX, 620, 150, 800, '#fff', 'center', -0.04); ctx.restore(); });
    withFade(seg(t, at + 0.3, at + 0.6), () => text('We’ll show you who’s going quiet', CX, 780, 38, 600, SOFT, 'center'));
    const bx = pop(t, T.cmt - 0.1, 0.3); if (bx > 0) xf(CX, 960, clamp(bx), 0, () => { fillRR(110, 900, 860, 120, 60, 'rgba(255,255,255,0.08)'); strokeRR(110, 900, 860, 120, 60, 'rgba(255,255,255,0.25)', 3);
      const typed = 'KEEP'.slice(0, Math.max(0, Math.floor((t - (T.cmt + 0.45)) / 0.11))); text(typed || 'Add a comment…', 160, 962, 42, typed ? 800 : 500, typed ? '#fff' : MUTED, 'left', 0);
      if (typed && Math.floor(t * 3) % 2 === 0) fillRR(160 + tw(typed, 42, 800, 0) + 6, 934, 4, 56, 2, IN.mid); circle(910, 960, 36, typed.length === 4 ? C.primary : 'rgba(255,255,255,0.12)'); text('↑', 910, 962, 40, 800, '#fff', 'center', 0); });
    const b = pop(t, T.cmt + 1.0, 0.35); if (b > 0) xf(CX, 1180, clamp(b), 0, () => { const lb = 'Comment “KEEP”', w = tw(lb, 48, 800) + 140; glow(CX, 1180, 380, C.primary, 0.4 + 0.12 * Math.sin(t * 4)); fillRR(CX - w / 2, 1120, w, 120, 60, C.primary); strokeRR(CX - w / 2, 1120, w, 120, 60, 'rgba(255,255,255,0.25)', 2); text(lb, CX, 1182, 48, 800, '#fff', 'center'); });
  });
}
function auditEnd(t, at, tapAt, urlAt) {
  const k = ease.quint(seg(t, at, at + 0.4)); stage(t, 0.18 + 0.2 * k);
  if (t < at + 0.3) glow(CX, 860, 800, C.primary, 0.45 * (1 - seg(t, at, at + 0.3)));
  xf(CX, 600, 1 + 0.2 * (1 - k), 0, () => { ctx.save(); ctx.globalAlpha = k; logoLockup(CX, 560, 96); text(BRAND.tagline, CX, 670, 32, 500, SOFT, 'center'); ctx.restore(); });
  const b = ease.back(seg(t, at + 0.35, at + 0.75)); if (b <= 0) return;
  const press = t > tapAt - 0.06 && t < tapAt + 0.16 ? 0.94 : 1, lb = 'Comment “KEEP”', bw = tw(lb, 46, 800) + 150, bh = 116, by = 790;
  ctx.save(); ctx.globalAlpha = clamp(b); ctx.translate(CX, by + bh / 2); ctx.scale(b * press, b * press); ctx.translate(-CX, -(by + bh / 2));
  glow(CX, by + bh / 2, 360, C.primary, 0.45 + 0.15 * Math.sin(t * 4)); fillRR(CX - bw / 2, by, bw, bh, bh / 2, C.primary); strokeRR(CX - bw / 2, by, bw, bh, bh / 2, 'rgba(255,255,255,0.25)', 2); text(lb, CX, by + bh / 2 + 2, 46, 800, '#fff', 'center'); ctx.restore();
  const o = ease.back(seg(t, at + 0.8, at + 1.1)); if (o > 0) { ctx.save(); ctx.globalAlpha = clamp(o); const s2 = 'FREE RETENTION AUDIT', w = tw(s2, 22, 800, 0.12) + 44; ctx.translate(CX, by + bh + 70); ctx.scale(o, o); fillRR(-w / 2, -26, w, 52, 12, rgba(GREEN, 0.18)); strokeRR(-w / 2, -26, w, 52, 12, rgba(GREEN, 0.6), 2); text(s2, 0, 1, 22, 800, '#9ff0c0', 'center', 0.12); ctx.restore(); }
  withFade(seg(t, urlAt, urlAt + 0.3), () => text(BRAND.url.toUpperCase(), CX, by + bh + 160, 28, 800, IN.mid, 'center', 0.18));
  if (HAND && t > tapAt - 0.7 && t < tapAt + 0.8) {
    const p = seg(t, tapAt - 0.7, tapAt - 0.05), q = seg(t, tapAt + 0.25, tapAt + 0.8), ax = CX + bw / 2 - 60;
    const hx = ax + (1 - ease.out(p)) * 220 + q * 160, hy = by + bh / 2 + 28 + (1 - ease.out(p)) * 300 + q * 240;
    ctx.save(); ctx.globalAlpha = clamp(p * 3) * (1 - q);
    if (t > tapAt && t < tapAt + 0.4) { const r = seg(t, tapAt, tapAt + 0.4); ctx.strokeStyle = rgba('#ffffff', 0.7 * (1 - r)); ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(hx, hy, 20 + r * 60, 0, Math.PI * 2); ctx.stroke(); }
    ctx.translate(hx, hy); ctx.rotate(-0.12); ctx.scale(0.5, 0.5); ctx.translate(-110.5, -117); ctx.drawImage(HAND, 0, 0); ctx.restore();
  }
}
