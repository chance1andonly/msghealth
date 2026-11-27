// MsgHealth · "history hook" retention reels (1080 × 1920, 30 fps), built on kit.js + mg.js. Mostly motion graphics, with 'cast' scenes (animated people) in about 1 of 3 reels.
// Each reel is a config in window.REEL (see src/<name>-reel.js): one scene per voiceover line 0..N-1, then the CTA line N.
// Scene types: stat, stack, quote, versus, split, people, frames, weeks, chat, cast.
// cast: animated people in a shop or street set. {type:'cast', eyebrow, set:'shop'|'street'|'phone', cast:[{x, h, seed, o:{shirt,skin,hair,hat,arm,mouth,glasses,dir}, say:['line 1','line 2'], at:0.4, from:'left'|'right'|'up', walk:true}], chip:'47 DAYS', label, sub}
'use strict';
const R = window.REEL; window.CHAT_WHO = R.who || 'Marcus';
const N = R.scenes.length, END = VO_AT[N] - 0.1, DURATION = +Math.max(END + 2.4, lineEnd(N) + 1.1).toFixed(2);
window.CUES = { end: END }; window.SFX = []; const cue = (t, kind, gain) => window.SFX.push({ t, kind, gain });
window.MUSIC = { bpm: 90, root: 41, brandAt: END, mood: 'sneaky' };
const GOLD = '#ffffff';
// ── black & white theme (owner 2026-11-24): no purple, no gold ──
C.primary = '#3a3a3a'; IN.deep = '#888888'; IN.hi = '#dddddd';
function stage(t, glowA = 0.22) { // eslint-disable-line no-unused-vars
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(255,255,255,0.04)'; ctx.lineWidth = 1;
  ctx.beginPath(); for (let x = 0; x <= W; x += 60) { ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, H); } for (let y = 0; y <= H; y += 60) { ctx.moveTo(0, y + 0.5); ctx.lineTo(W, y + 0.5); } ctx.stroke();
  const g = ctx.createRadialGradient(CX, 800, 0, CX, 800, 760); g.addColorStop(0, `rgba(255,255,255,${glowA * 0.35})`); g.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const v = ctx.createLinearGradient(0, 0, 0, H); v.addColorStop(0, 'rgba(0,0,0,0.5)'); v.addColorStop(0.2, 'rgba(0,0,0,0)'); v.addColorStop(0.8, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,0.6)'); ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
}
function drawCaption(caps, t, hide) { // black label, white words, accent word inverted
  const c = caps.find((c) => t >= c.at && t < c.out);
  if (!c || (hide && hide(t, c))) return;
  let acc = false;
  const words = c.s.split(' ').map((w) => { if (w.startsWith('*')) acc = true; const o = { w: w.replace(/\*/g, '').toUpperCase(), acc }; if (/\*[.,?!…:"]*$/.test(w)) acc = false; return o; });
  const sp = tw(' ', CAP_SIZE, 800, 0); words.forEach((w) => (w.width = tw(w.w, CAP_SIZE, 800, 0.01)));
  const tot = words.reduce((p, w) => p + w.width, 0) + sp * (words.length - 1), k = ease.back(seg(t, c.at, c.at + 0.14)), sc = 0.9 + 0.1 * k;
  ctx.save(); ctx.translate(CX, CAP_Y); ctx.scale(sc, sc); ctx.translate(-CX, -CAP_Y);
  fillRR(CX - tot / 2 - 28, CAP_Y - 40, tot + 56, 80, 12, 'rgba(0,0,0,0.94)'); strokeRR(CX - tot / 2 - 28, CAP_Y - 40, tot + 56, 80, 12, 'rgba(255,255,255,0.35)', 2);
  let x = CX - tot / 2;
  words.forEach((w) => { if (w.acc) fillRR(x - 8, CAP_Y - 31, w.width + 16, 62, 8, '#fff'); text(w.w, x, CAP_Y + 2, CAP_SIZE, 800, w.acc ? '#000' : '#fff', 'left', 0.01); x += w.width + sp; });
  ctx.restore();
}
function finale(t, at) { // the toy end card: black, wordmark, tagline, url, then the KEEP line
  const k = ease.quint(seg(t, at, at + 0.4)); ctx.fillStyle = '#000'; ctx.fillRect(0, 0, 1080, 1920); ctx.save(); ctx.globalAlpha = k;
  text('MsgHealth', 540, 700, 130, 900, '#fff', 'center', 0); text('Know your customers. Keep your customers.', 540, 800, 36, 500, '#bbb', 'center', 0); ctx.fillStyle = '#fff'; ctx.fillRect(300, 880, 480, 4); text('MSGHEALTH.NET', 540, 960, 40, 800, '#fff', 'center', 0.12); ctx.restore();
  withFade(seg(t, at + 0.9, at + 1.2), () => { fillRR(120, 1090, 840, 130, 20, '#fff'); text((R.cta || ['Comment KEEP to get a full', 'retention audit.'])[0], 540, 1137, 44, 800, '#000', 'center', 0); text((R.cta || ['Comment KEEP to get a full', 'retention audit.'])[1], 540, 1189, 44, 800, '#000', 'center', 0); });
}
const fit = (s, size, maxW, w = 800) => Math.min(size, size * maxW / tw(s, size, w));
const ch = (l, k) => wordAt(l, Math.min(k, VO_CLIPS[l].chunks.length - 1)) - 0.05; // time of caption chunk k of line l
function env(x, y, w, h, col, a = 1) { // envelope
  ctx.save(); ctx.globalAlpha *= clamp(a); fillRR(x, y, w, h, 10, rgba(col, 0.16)); strokeRR(x, y, w, h, 10, rgba(col, 0.7), 3);
  ctx.beginPath(); ctx.moveTo(x + 6, y + 8); ctx.lineTo(x + w / 2, y + h * 0.58); ctx.lineTo(x + w - 6, y + 8); ctx.strokeStyle = rgba(col, 0.7); ctx.lineWidth = 3; ctx.stroke(); ctx.restore();
}
const tileDraw = (im, x, y, sz, mode, rad = 0.16) => { if (!im) return; ctx.save(); rr(x, y, sz, sz, sz * rad); ctx.clip(); const m = Math.min(im.width, im.height) * (im.zoom || 1), sx = (im.width - m) / 2, sy = (im.height - m) / 2;
      if (mode) { const g = document.createElement('canvas'); g.width = g.height = 256; const q = g.getContext('2d'); q.fillStyle = mode === 'bw' ? '#fff' : '#161616'; q.fillRect(0, 0, 256, 256); const k = document.createElement('canvas'); k.width = k.height = 176; const z = k.getContext('2d'); z.drawImage(im, 0, 0, 176, 176); z.globalCompositeOperation = 'source-in'; z.fillStyle = mode === 'bw' ? '#000' : '#fff'; z.fillRect(0, 0, 176, 176); q.drawImage(k, 40, 40); ctx.drawImage(g, x, y, sz, sz); } else ctx.drawImage(im, sx, sy, m, m, x, y, sz, sz);
      ctx.restore(); if (mode === 'wb') strokeRR(x, y, sz, sz, sz * rad, 'rgba(255,255,255,0.5)', 3); };
const SCENES = {
  art(t, a, c, L) { // illustrated documentary scene: c.draw(t, a, c, L) from the reel config (helpers in src/doc.js), slow push-in
    stage(t, c.glow ?? 0.16); const z = 1 + 0.035 * ease.out(seg(t, a, VO_AT[L + 1] + 0.2));
    ctx.save(); ctx.translate(CX, 800); ctx.scale(z, z); ctx.translate(-CX, -800); c.draw(t, a, c, L); ctx.restore();
  },
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
  slam(t, a, c, L) { // big white lines slam in one by one; optional big number
    stage(t, 0.14); eyebrow(c.eyebrow, 400, IN.mid);
    if (c.num) { const e = pop(t, a + 0.05, 0.4); xf(CX, 700, clamp(e), 0, () => text(c.num, CX, 700, fit(c.num, c.numSize || 260, 920), 900, '#fff', 'center', -0.04)); if (c.unit) withFade(seg(t, a + 0.4, a + 0.8), () => text(c.unit, CX, 700 + (c.numSize || 260) * 0.5 + 40, 54, 800, SOFT, 'center', 0.02)); }
    const sz = c.size || 104, gap = sz * 1.2, n = c.lines.length, y0 = c.num ? 1090 : 800 - (n - 1) * gap / 2;
    c.lines.forEach((l, i) => { const e = pop(t, a + (c.at ? c.at[i] : 0.2 + i * 0.7), 0.35); if (e <= 0) return; const hot = c.hot === i, y = y0 + i * gap; xf(CX, y, clamp(e), 0, () => { const fs = fit(l, sz, 880); if (hot) { const w = tw(l, fs, 900) + 48; fillRR(CX - w / 2, y - fs * 0.62, w, fs * 1.15, 10, '#fff'); } text(l, CX, y, fs, 900, hot ? '#000' : '#fff', 'center', -0.03); }); });
  },
  stack(t, a, c) { // a wall of envelopes
    stage(t, 0.16); eyebrow(c.eyebrow, 330, IN.mid);
    for (let i = 0; i < 25; i++) { const r = Math.floor(i / 5), q = i % 5, e = pop(t, a + 0.1 + i * 0.045, 0.3); if (e > 0) xf(150 + q * 195 + 70, 520 + r * 130 + 42, clamp(e), 0, () => env(150 + q * 195, 520 + r * 130, 140, 84, i % 7 === 3 ? GOLD : IN.mid)); }
    const k = pop(t, a + 1.1, 0.4); if (k > 0) xf(CX, 1260, clamp(k), 0, () => { text(c.count, CX, 1260, fit(c.count, 150, 860), 800, '#fff', 'center', -0.04); text(c.unit, CX, 1370, 48, 700, GOLD, 'center'); });
    if (c.sub) withFade(seg(t, a + 1.7, a + 2.1), () => text(c.sub, CX, 1450, 32, 600, MUTED, 'center'));
  },
  quote(t, a, c) { // one big card
    stage(t, 0.16); eyebrow(c.eyebrow, 330, IN.mid);
    const e = c.instant ? 1 : pop(t, a + 0.15, 0.4); const lines = c.big, lh = c.size ? c.size * 1.1 : 92, size = c.size || 82, h = 220 + lines.length * lh + (c.sub ? 80 : 0), y0 = 800 - h / 2;
    xf(CX, 800, clamp(e), 0, () => { card(90, y0, 900, h, { r: 44, stroke: rgba(GOLD, 0.55) }); lines.forEach((l, i) => text(l, CX, y0 + 150 + i * lh, Math.min(size, fit(l, size, 800)), 800, i === lines.length - 1 && c.hl ? GOLD : '#fff', 'center', -0.03)); if (c.sub) text(c.sub, CX, y0 + 150 + lines.length * lh + 20, 32, 600, SOFT, 'center'); });
  },
  versus(t, a, c) { // two cards: muted vs green
    stage(t, 0.18); eyebrow(c.eyebrow, 330, IN.mid);
    const L = pop(t, a + 0.1, 0.35), Rr = pop(t, a + 1.2, 0.35);
    xf(300, 800, clamp(L), 0, () => { card(80, 560, 440, 480, { fill: 'rgba(255,255,255,0.02)', stroke: 'rgba(255,111,138,0.4)' }); text(c.l.title, 300, 630, 30, 800, MUTED, 'center', 0.1); text(c.l.big, 300, 790, fit(c.l.big, 96, 380), 800, MUTED, 'center', -0.03); (c.l.sub || []).forEach((s, i) => text(s, 300, 900 + i * 48, 34, 600, MUTED, 'center')); });
    xf(780, 800, clamp(Rr), 0, () => { card(560, 560, 440, 480, { stroke: 'rgba(255,255,255,0.7)' }); text(c.r.title, 780, 630, 30, 800, '#ffffff', 'center', 0.1); text(c.r.big, 780, 790, fit(c.r.big, 96, 380), 800, '#fff', 'center', -0.03); (c.r.sub || []).forEach((s, i) => text(s, 780, 900 + i * 48, 34, 600, '#ffffff', 'center')); });
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
      xf(x, y, clamp(e), 0, () => { dotPerson(x, y, 150, hi && on > 0.5 ? GOLD : 'rgba(255,255,255,0.4)'); if (hi && on > 0.5 && c.mystery) text('?', x, y - 90, 54, 800, GOLD, 'center'); }); }
    if (c.label) withFade(seg(t, a + 1.2, a + 1.6), () => text(c.label, CX, 1260, 44, 800, '#fff', 'center', -0.02));
    if (c.sub) withFade(seg(t, a + 1.7, a + 2.1), () => text(c.sub, CX, 1340, 32, 600, SOFT, 'center'));
  },
  frames(t, a, c, L) { // labelled photo frames
    stage(t, 0.16); eyebrow(c.eyebrow, 330, IN.mid);
    c.items.forEach((s, i) => { const e = pop(t, ch(L, i), 0.4), x = 110 + i * 295; if (e <= 0) return;
      xf(x + 130, 820, clamp(e), 0, () => { card(x, 600, 260, 440, { r: 28, stroke: rgba(GOLD, 0.5), fill: 'rgba(255,255,255,0.05)' });
        fillRR(x + 20, 620, 220, 300, 16, vgrad(620, 920, 'rgba(255,255,255,0.2)', 'rgba(255,255,255,0.12)'));
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
  cast(t, a, c) { // animated people (kit.js person) with speech bubbles
    stage(t, 0.14); eyebrow(c.eyebrow, 330, IN.mid);
    const FY = 1390; // floor line, above the caption strip
    fillRR(0, FY, W, H - FY, 0, 'rgba(255,255,255,0.03)'); line(0, FY, W, FY, 'rgba(255,255,255,0.12)', 2);
    if (c.set === 'shop') { card(120, 460, 840, 860, { r: 36, fill: 'rgba(255,255,255,0.05)', stroke: rgba(IN.mid, 0.4), lw: 4 }); line(120, 860, 960, 860, 'rgba(255,255,255,0.05)', 2); }
    if (c.set === 'street') [200, 540, 880].forEach((x, i) => { fillRR(x - 70, 760 - i % 2 * 60, 140, 740 + i % 2 * 60, 8, 'rgba(255,255,255,0.04)'); });
    (c.cast || []).forEach((p, i) => {
      const at = a + (p.at ?? 0.2 + i * 0.35), e = ease.out(seg(t, at, at + 0.55)); if (e <= 0) return;
      const fx = p.from === 'right' ? 380 : p.from === 'left' ? -380 : 0, fy = p.from === 'up' ? -300 : 0, x = p.x + fx * (1 - e), y = FY + fy * (1 - e);
      ctx.save(); ctx.globalAlpha *= clamp(e * 1.6);
      person(x, y, p.h || 600, p.seed ?? i + 3, Object.assign({ bounce: p.walk && e < 1 ? t * 14 : t * 2 + i, wave: t - at, mouth: p.say && t > at + 0.5 && t < at + 3.2 ? (Math.sin(t * 11) > -0.2 ? 'open' : '') : '' }, p.o || {}));
      ctx.restore();
      if (p.say) { const b = seg(t, at + 0.5, at + 0.8); if (b > 0) xf(p.x, FY - (p.h || 600) - 70, clamp(b), 0, () => bubble(Math.max(40, Math.min(W - 560, p.x - 250)), FY - (p.h || 600) - 70 - p.say.length * 40 - 30, 520, p.say, !!p.out)); }
    });
    if (c.chip) { const q = pop(t, a + (c.chipAt ?? 1.2), 0.35); if (q > 0) xf(CX, 400, clamp(q), 0, () => chip(c.chip, CX, 400, c.chipCol || GOLD, 1, 30)); }
    if (c.label) withFade(seg(t, a + 1.4, a + 1.8), () => text(c.label, CX, 1700, fit(c.label, 56, 900), 800, '#fff', 'center', -0.02));
    if (c.sub) withFade(seg(t, a + 1.9, a + 2.3), () => text(c.sub, CX, 1775, 34, 600, SOFT, 'center'));
  },
  tier(t, a, c, L) { // tier list board: R.scenes of type 'tier' accumulate onto S..F rows; the current one pops; c.why = reason lines; c.img = logo key shown big beside the reasons; c.more = reasons only (no new item)
    stage(t, 0.14); eyebrow('THE KEEP-YOUR-CLIENTS TIER LIST', 330, IN.mid);
    const rows = ['S', 'A', 'B', 'C', 'D', 'F'], shade = { S: '#ffffff', A: '#d8d8d8', B: '#b0b0b0', C: '#8c8c8c', D: '#666666', F: '#444444' };
    const X0 = 60, BW = 960, RH = 120, Y0 = 400, LW = 120;
    const tile = tileDraw;
    const imgOf = (k) => (k === 'msg' ? { im: LOGO, white: true } : { im: (window.IMG || {})[k], white: false });
    const placed = R.scenes.map((sc, i) => [sc, i]).filter(([sc, i]) => sc.type === 'tier' && !sc.more && i <= L);
    rows.forEach((r, ri) => {
      const y = Y0 + ri * RH; card(X0, y, BW, RH - 10, { r: 14, fill: 'rgba(255,255,255,0.04)', stroke: 'rgba(255,255,255,0.1)' });
      fillRR(X0, y, LW, RH - 10, 14, shade[r]); text(r, X0 + LW / 2, y + (RH - 10) / 2 + 2, 76, 900, ri < 3 ? '#000' : '#fff', 'center', 0);
      const items = placed.filter(([sc]) => sc.row === r), n = items.length; if (!n) return;
      const slotW = (BW - LW - 30 - (n - 1) * 14) / n;
      items.forEach(([sc, i], k) => {
        const cur = i === L, e = cur ? pop(t, a + 0.1, 0.4) : 1; if (e <= 0) return;
        const x = X0 + LW + 15 + k * (slotW + 14), cy = y + (RH - 10) / 2, hot = sc.img === 'msg', lg = sc.logoPill ? imgOf(sc.img) : null;
        xf(x + slotW / 2, cy, clamp(e), 0, () => {
          fillRR(x, y + 12, slotW, RH - 34, 12, hot ? '#fff' : '#111'); strokeRR(x, y + 12, slotW, RH - 34, 12, cur ? '#fff' : 'rgba(255,255,255,0.35)', cur ? 4 : 2);
          if (lg && lg.im) { const ts = RH - 44; if (hot) { tile(lg.im, x + 24, cy - ts / 2 + 1, ts, 'bw'); text(sc.name, x + 24 + ts + (slotW - ts - 24) / 2, cy + 2, fit(sc.name, 44, slotW - ts - 60, 900), 900, '#000', 'center', 0); } else tile(lg.im, x + slotW / 2 - ts / 2, cy - ts / 2 + 1, ts, null); }
          else text(sc.name, x + slotW / 2, cy + 2, fit(sc.name, 44, slotW - 24, 900), 900, '#fff', 'center', 0);
        });
      });
    });
    const lines = c.why || [], big = c.img ? imgOf(c.img) : null, hasBig = !!(big && big.im), tx = hasBig ? 330 : CX, mw = hasBig ? 700 : 960, al = hasBig ? 'left' : 'center';
    if (hasBig) withFade(seg(t, a + 0.3, a + 0.6), () => tile(big.im, 70, 1195, 220, big.white ? 'wb' : null));
    lines.forEach((l, i) => withFade(seg(t, a + 0.45 + i * 0.25, a + 0.8 + i * 0.25), () => text(l, tx, 1215 + (hasBig ? 22 : 0) + i * 62, fit(l, i === 0 ? 42 : 32, mw), i === 0 ? 800 : 600, i === 0 ? '#fff' : SOFT, al, -0.01)));
  },
  board(t, a, c, L) { // template tier board (R.boardImg): logos only, no text. scenes of type 'board' accumulate onto rows; c.more = no new item (shows c.img big)
    stage(t, 0.1);
    const tp = (window.IMG || {}).tpl, BY = 330, K = W / 623, RY = { S: 9, A: 78, B: 148, C: 217, D: 286, E: 356, F: 426 };
    if (tp) ctx.drawImage(tp, 0, BY, W, tp.height * (W / tp.width));
    const imgOf = (k) => (k === 'msg' ? { im: LOGO, mode: 'wb' } : { im: (window.IMG || {})[k], mode: null });
    const placed = R.scenes.map((sc, i) => [sc, i]).filter(([sc, i]) => sc.type === 'board' && !sc.more && i <= L);
    const TS = 100;
    Object.keys(RY).forEach((r) => {
      const items = placed.filter(([sc]) => sc.row === r); items.forEach(([sc, i], k) => {
        const cur = i === L, e = cur ? pop(t, a + 0.1, 0.4) : 1; if (e <= 0) return;
        const x = 168 + k * (TS + 22), y = BY + RY[r] * K + (64 * K - TS) / 2, g = imgOf(sc.img);
        xf(x + TS / 2, y + TS / 2, clamp(e), 0, () => { const rd = sc.img === 'imsg' ? 0.2 : 0; tileDraw(g.im, x, y, TS, g.mode, rd); strokeRR(x, y, TS, TS, TS * rd, cur ? '#fff' : 'rgba(0,0,0,0.55)', cur ? 5 : 3); });
      });
    });
    const big = c.img ? imgOf(c.img) : null;
    if (big && big.im) withFade(seg(t, a + 0.25, a + 0.55), () => xf(CX, 1300, 1, 0, () => tileDraw(big.im, CX - 100, 1210, 200, big.mode, c.img === 'imsg' ? 0.2 : 0)));
  },
  chat(t, a, c, i) { // phone with a text thread
    stage(t, 0.14); const until = VO_AT[i + 1] + 0.2;
    phoneChat(t, a - 0.1, until, () => c.msgs.forEach((m, j) => msg(m.out ? 40 : 60, m.y, 520, m.lines, m.out, seg(t, a + m.at, a + m.at + 0.2), m.out ? seg(t, a + m.at + 0.1, a + m.at + 1.5) : 1)));
  },
};
const SC = R.scenes.map((c, i) => [i ? VO_AT[i] : 0, VO_AT[i + 1], (t) => SCENES[c.type](t, VO_AT[i], c, i)]);
SC.push([END, 999, (t) => finale(t, END)]);
if (!R.nosfx) R.scenes.forEach((c, i) => { if (c.type === 'chat') c.msgs.forEach((m) => cue(VO_AT[i] + m.at, 'notification', 0.22)); });
if (!R.nosfx) R.scenes.forEach((c, i) => (c.sfx || []).forEach(([k, kind, gain, d = 0]) => cue(ch(i, k) + 0.05 + d, kind, gain)));
// Drive SFX defaults (quiet): soft whoosh on each cut, thud on stat/versus reveals, hit on the opener, cash on the end card
if (!R.nosfx) R.scenes.forEach((c, i) => { if (i) cue(VO_AT[i] - 0.08, 'dwhooshsoft', 0.3); if (c.type === 'stat') cue(VO_AT[i] + 0.05, 'dimpact', 0.3); if (c.type === 'versus') cue(VO_AT[i] + 0.1, 'dthud', 0.3); if (c.type === 'tier') cue(VO_AT[i] + 0.12, c.row === 'S' ? 'dhit' : 'dthud', 0.3); });
if (!R.nosfx) { cue(0.12, 'dimpact2', 0.3); cue(END + 0.35, 'dcash', 0.25); cue(END + 1.25, 'tap', 0.3); }
boot({ duration: DURATION, scenes: SC, brandAt: END, hideCaption: (t) => t >= END, preload: async () => { window.IMG = {}; await Promise.all(Object.entries(R.imgs || {}).map(([k, src]) => new Promise((res) => { const im = new Image(); im.onload = () => { if (k === 'squire') im.zoom = 0.55; if (k === 'imsg') im.zoom = 0.88; window.IMG[k] = im; res(); }; im.onerror = res; im.src = src; }))); } }, R.name);
