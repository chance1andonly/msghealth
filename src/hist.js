// MsgHealth · "history hook" retention reels (1080 × 1920, 30 fps), built on kit.js + mg.js. Motion graphics only, no characters.
// Each reel is a config in window.REEL (see src/<name>-reel.js): one scene per voiceover line 0..N-1, then the CTA line N.
// Scene types: stat, stack, quote, versus, split, people, frames, weeks, chat.
'use strict';
const R = window.REEL; window.CHAT_WHO = R.who || 'Marcus';
const N = R.scenes.length, END = VO_AT[N] - 0.1, DURATION = +Math.max(END + 2.4, lineEnd(N) + 1.1).toFixed(2);
window.CUES = { end: END }; window.SFX = []; const cue = (t, kind, gain) => window.SFX.push({ t, kind, gain });
window.MUSIC = { bpm: 90, root: 41, brandAt: END, mood: 'sneaky' };
const GOLD = '#f5d68a';
const fit = (s, size, maxW, w = 800) => Math.min(size, size * maxW / tw(s, size, w));
const ch = (l, k) => wordAt(l, Math.min(k, VO_CLIPS[l].chunks.length - 1)) - 0.05; // time of caption chunk k of line l
function env(x, y, w, h, col, a = 1) { // envelope
  ctx.save(); ctx.globalAlpha *= clamp(a); fillRR(x, y, w, h, 10, rgba(col, 0.16)); strokeRR(x, y, w, h, 10, rgba(col, 0.7), 3);
  ctx.beginPath(); ctx.moveTo(x + 6, y + 8); ctx.lineTo(x + w / 2, y + h * 0.58); ctx.lineTo(x + w - 6, y + 8); ctx.strokeStyle = rgba(col, 0.7); ctx.lineWidth = 3; ctx.stroke(); ctx.restore();
}
const SCENES = {
  stat(t, a, c) { // count-up number
    stage(t, 0.18); eyebrow(c.eyebrow, 330, IN.mid);
    const k = ease.out(seg(t, a + 0.12, a + 1.3)), e = pop(t, a + 0.05, 0.4), v = lerp(c.from || 0, c.to, k);
    const s = (c.pre || '') + (c.dec ? v.toFixed(c.dec) : Math.round(v).toLocaleString()) + (c.suffix || '');
    if (c.top) withFade(seg(t, a, a + 0.3), () => text(c.top, CX, 560, 46, 700, SOFT, 'center'));
    xf(CX, 780, clamp(e), 0, () => text(s, CX, 780, fit(s, 230, 900), 800, c.col || '#fff', 'center', -0.04));
    withFade(seg(t, a + 0.5, a + 0.9), () => text(c.unit, CX, 960, 58, 800, '#fff', 'center', -0.02));
    if (c.sub) withFade(seg(t, a + 1.0, a + 1.4), () => text(c.sub, CX, 1050, 36, 600, SOFT, 'center'));
    if (c.chip) { const p = pop(t, a + 1.3, 0.35); if (p > 0) xf(CX, 1190, clamp(p), 0, () => chip(c.chip, CX, 1190, GOLD, 1, 28)); }
  },
  stack(t, a, c) { // a wall of envelopes
    stage(t, 0.16); eyebrow(c.eyebrow, 330, IN.mid);
    for (let i = 0; i < 25; i++) { const r = Math.floor(i / 5), q = i % 5, e = pop(t, a + 0.1 + i * 0.045, 0.3); if (e > 0) xf(150 + q * 195 + 70, 520 + r * 130 + 42, clamp(e), 0, () => env(150 + q * 195, 520 + r * 130, 140, 84, i % 7 === 3 ? GOLD : IN.mid)); }
    const k = pop(t, a + 1.1, 0.4); if (k > 0) xf(CX, 1260, clamp(k), 0, () => { text(c.count, CX, 1260, fit(c.count, 150, 860), 800, '#fff', 'center', -0.04); text(c.unit, CX, 1370, 48, 700, GOLD, 'center'); });
    if (c.sub) withFade(seg(t, a + 1.7, a + 2.1), () => text(c.sub, CX, 1450, 32, 600, MUTED, 'center'));
  },
  quote(t, a, c) { // one big card
    stage(t, 0.16); eyebrow(c.eyebrow, 330, IN.mid);
    const e = pop(t, a + 0.15, 0.4); const lines = c.big, lh = c.size ? c.size * 1.1 : 92, size = c.size || 82, h = 220 + lines.length * lh + (c.sub ? 80 : 0), y0 = 800 - h / 2;
    xf(CX, 800, clamp(e), 0, () => { card(90, y0, 900, h, { r: 44, stroke: rgba(GOLD, 0.55) }); lines.forEach((l, i) => text(l, CX, y0 + 150 + i * lh, Math.min(size, fit(l, size, 800)), 800, i === lines.length - 1 && c.hl ? GOLD : '#fff', 'center', -0.03)); if (c.sub) text(c.sub, CX, y0 + 150 + lines.length * lh + 20, 32, 600, SOFT, 'center'); });
  },
  versus(t, a, c) { // two cards: muted vs green
    stage(t, 0.18); eyebrow(c.eyebrow, 330, IN.mid);
    const L = pop(t, a + 0.1, 0.35), Rr = pop(t, a + 1.2, 0.35);
    xf(300, 800, clamp(L), 0, () => { card(80, 560, 440, 480, { fill: 'rgba(255,255,255,0.02)', stroke: 'rgba(255,111,138,0.4)' }); text(c.l.title, 300, 630, 30, 800, MUTED, 'center', 0.1); text(c.l.big, 300, 790, fit(c.l.big, 96, 380), 800, MUTED, 'center', -0.03); (c.l.sub || []).forEach((s, i) => text(s, 300, 900 + i * 48, 34, 600, MUTED, 'center')); });
    xf(780, 800, clamp(Rr), 0, () => { card(560, 560, 440, 480, { stroke: 'rgba(111,227,160,0.6)' }); text(c.r.title, 780, 630, 30, 800, OK, 'center', 0.1); text(c.r.big, 780, 790, fit(c.r.big, 96, 380), 800, '#fff', 'center', -0.03); (c.r.sub || []).forEach((s, i) => text(s, 780, 900 + i * 48, 34, 600, OK, 'center')); });
  },
  split(t, a, c) { // two bars: share of A vs share of B
    stage(t, 0.16); eyebrow(c.eyebrow, 330, IN.mid);
    [[c.a, 560, a + 0.15], [c.b, 900, a + 1.3]].forEach(([r, y, at]) => {
      const k = ease.out(seg(t, at, at + 0.9)), p = pop(t, at - 0.1, 0.3); if (p <= 0) return;
      xf(CX, y + 90, clamp(p), 0, () => { text(r.label, 100, y, 30, 800, MUTED, 'left', 0.1); fillRR(100, y + 40, 880, 100, 24, 'rgba(255,255,255,0.06)'); fillRR(100, y + 40, Math.max(0, 880 * r.pct / 100 * k), 100, 24, r.col || GOLD); text(Math.round(r.pct * k) + '%', Math.max(100 + 880 * r.pct / 100 * k - 24, 250), y + 92, 60, 800, '#0b0b10', 'right'); if (r.note) text(r.note, 100, y + 190, 34, 600, SOFT, 'left'); });
    });
  },
  people(t, a, c) { // grid of client dots; some highlighted
    stage(t, 0.16); eyebrow(c.eyebrow, 330, IN.mid);
    const n = c.n || 10; for (let i = 0; i < n; i++) { const r = Math.floor(i / 5), q = i % 5, x = 190 + q * 175, y = 640 + r * 250, e = pop(t, a + 0.1 + i * 0.06, 0.3), hi = i < (c.hi || 2); if (e <= 0) continue; const on = hi && seg(t, a + (c.hiAt || 0.9), a + (c.hiAt || 0.9) + 0.4);
      xf(x, y, clamp(e), 0, () => { dotPerson(x, y, 150, hi && on > 0.5 ? GOLD : 'rgba(165,160,255,0.45)'); if (hi && on > 0.5 && c.mystery) text('?', x, y - 90, 54, 800, GOLD, 'center'); }); }
    if (c.label) withFade(seg(t, a + 1.2, a + 1.6), () => text(c.label, CX, 1260, 44, 800, '#fff', 'center', -0.02));
    if (c.sub) withFade(seg(t, a + 1.7, a + 2.1), () => text(c.sub, CX, 1340, 32, 600, SOFT, 'center'));
  },
  frames(t, a, c, L) { // labelled photo frames
    stage(t, 0.16); eyebrow(c.eyebrow, 330, IN.mid);
    c.items.forEach((s, i) => { const e = pop(t, ch(L, i), 0.4), x = 110 + i * 295; if (e <= 0) return;
      xf(x + 130, 820, clamp(e), 0, () => { card(x, 600, 260, 440, { r: 28, stroke: rgba(GOLD, 0.5), fill: 'rgba(255,255,255,0.05)' });
        fillRR(x + 20, 620, 220, 300, 16, vgrad(620, 920, 'rgba(245,214,138,0.28)', 'rgba(113,104,255,0.25)'));
        [[0, 0], [1, 0], [0, 1], [1, 1]].forEach(([qx, qy]) => { const cx = x + 36 + qx * 188, cy = 636 + qy * 268; line(cx, cy + (qy ? 0 : 20), cx, cy, GOLD, 4); line(cx, cy, cx + (qx ? -20 : 20), cy, GOLD, 4); });
        circle(x + 130, 770, 46, rgba(GOLD, 0.35)); text(s, x + 130, 980, 34, 800, GOLD, 'center', 0.08); }); });
  },
  weeks(t, a, c, L) { // six weeks; one highlighted
    stage(t, 0.16); eyebrow(c.eyebrow, 330, IN.mid);
    for (let i = 0; i < 6; i++) { const e = pop(t, a + 0.1 + i * 0.1, 0.3), x = 95 + i * 150, hit = i === 2, on = hit ? seg(t, ch(L, 1) - 0.1, ch(L, 1) + 0.3) : 0, fade = i > 2 ? 0.5 : 1; if (e <= 0) continue;
      xf(x + 65, 820, clamp(e), 0, () => { card(x, 700, 130, 240, { r: 22, fill: on > 0.5 ? rgba(OK, 0.18) : 'rgba(255,255,255,0.05)', stroke: on > 0.5 ? rgba(OK, 0.9) : 'rgba(255,255,255,0.12)', lw: on > 0.5 ? 4 : 2 }); text('WEEK', x + 65, 770, 22, 700, MUTED, 'center', 0.12); text(String(i + 1), x + 65, 850, 86, 800, on > 0.5 ? OK : `rgba(255,255,255,${0.9 * fade})`, 'center'); }); }
    const f = seg(t, ch(L, 0), ch(L, 0) + 0.6); if (f > 0) withFade(f, () => { line(95, 1010, 95 + 130 + 150 * 2, 1010, 'rgba(111,227,160,0.6)', 8); text('fresh', 95 + 215, 1062, 34, 700, OK, 'center'); line(95 + 450, 1010, 95 + 900 - 20, 1010, 'rgba(255,111,138,0.5)', 8); text('fading', 95 + 690, 1062, 34, 700, RED, 'center'); });
    const p = pop(t, ch(L, 1), 0.35); if (p > 0) xf(95 + 215 + 150 - 150, 640, clamp(p), 0, () => chip('TEXT HERE', 95 + 215, 640, OK, 1, 30));
  },
  chat(t, a, c, i) { // phone with a text thread
    stage(t, 0.14); const until = VO_AT[i + 1] + 0.2;
    phoneChat(t, a - 0.1, until, () => c.msgs.forEach((m, j) => msg(m.out ? 40 : 60, m.y, 520, m.lines, m.out, seg(t, a + m.at, a + m.at + 0.2), m.out ? seg(t, a + m.at + 0.1, a + m.at + 1.5) : 1)));
  },
};
const SC = R.scenes.map((c, i) => [i ? VO_AT[i] : 0, VO_AT[i + 1], (t) => SCENES[c.type](t, VO_AT[i], c, i)]);
SC.push([END, 999, (t) => finale(t, END)]);
R.scenes.forEach((c, i) => { if (c.type === 'chat') c.msgs.forEach((m) => cue(VO_AT[i] + m.at, 'notification', 0.22)); });
cue(END + 1.25, 'tap', 0.3);
boot({ duration: DURATION, scenes: SC, brandAt: END, hideCaption: (t) => t >= END + 0.6 }, R.name);
