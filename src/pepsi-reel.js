// MsgHealth · pepsi (the 1992 "349" bottle cap mix-up) · black/white documentary story reel for src/hist.js (drawings use src/doc.js)
(() => {
  // a generic crimped bottle cap with a number printed on it (no logo)
  const cap = (x, y, r, label, rot = 0, bright = true) => { ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
    ctx.beginPath(); for (let i = 0; i <= 42; i++) { const a = i / 42 * Math.PI * 2, q = i % 2 ? r : r * 0.89; i ? ctx.lineTo(Math.cos(a) * q, Math.sin(a) * q) : ctx.moveTo(Math.cos(a) * q, Math.sin(a) * q); } ctx.closePath(); ctx.fillStyle = bright ? D_L : '#555'; ctx.fill();
    circle(0, 0, r * 0.76, bright ? D_W : '#2c2c2c'); ring(0, 0, r * 0.66, bright ? '#000' : D_G, r * 0.035); if (label) text(label, 0, r * 0.02, r * (label.length > 2 ? 0.58 : 0.8), 900, bright ? '#000' : D_W, 'center', -0.02); ctx.restore(); };
  const bill = (x, y, s, rot = 0) => { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); fillRR(-90, -46, 180, 92, 8, '#8c8c8c'); strokeRR(-76, -34, 152, 68, 4, D_W, 4); circle(0, 0, 25, D_L); text('₱', 0, 3, 36, 900, '#000', 'center'); ctx.restore(); };
  const flame = (x, y, s, t, i = 0) => { const f = 1 + 0.18 * Math.sin(t * 13 + i * 2.1), w = Math.sin(t * 9 + i) * 14; ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    [[1, '#6a6a6a'], [0.7, D_L], [0.4, D_W]].forEach(([k, col]) => { ctx.beginPath(); ctx.moveTo(-60 * k, 0); ctx.quadraticCurveTo(-75 * k, -80 * k * f, w * k, -190 * k * f); ctx.quadraticCurveTo(10 * k, -90 * k, 40 * k, -120 * k * f); ctx.quadraticCurveTo(85 * k, -50 * k, 60 * k, 0); ctx.closePath(); ctx.fillStyle = col; ctx.fill(); }); ctx.restore(); };
  const truck = (x, y, s, rot = 0) => { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
    fillRR(-230, -230, 300, 180, 12, '#7a7a7a'); for (let i = 0; i < 5; i++) for (let j = 0; j < 3; j++) fillRR(-212 + i * 55, -214 + j * 52, 40, 40, 6, '#3a3a3a'); poly([[80, -50], [80, -190], [160, -190], [215, -120], [215, -50]], D_L); poly([[100, -170], [152, -170], [188, -122], [100, -122]], '#222'); fillRR(-240, -64, 465, 28, 8, D_D);
    [-165, -60, 150].forEach((wx) => { circle(wx, -34, 44, '#0d0d0d'); ring(wx, -34, 44, D_W, 7); circle(wx, -34, 14, D_G); }); ctx.restore(); };
  const phoneBox = (x, y) => { fillRR(x - 270, y - 420, 540, 840, 54, '#111'); strokeRR(x - 270, y - 420, 540, 840, 54, D_W, 7); fillRR(x - 80, y - 400, 160, 30, 15, '#000'); };
  const S = [
    { type: 'art', sfx: [[2, 'punch', 0.28]], draw(t, a, c, L) {
      dHead('PHILIPPINES · MAY 1992');
      const k = pop(t, a, 0.45), roll = String(100 + Math.floor(hash(Math.floor(t * 9)) * 899));
      for (let i = 0; i < 12; i++) { const x = 90 + hash(i + 3) * 900, y = 400 + ((hash(i + 21) * 900 + (t - a) * (90 + hash(i) * 90)) % 880); withFade(0.45, () => cap(x, y, 46, '', t * (hash(i) - 0.5) * 3, false)); }
      xf(CX, 820, 0.75 + 0.25 * clamp(k), 0, () => cap(CX, 820, 340, roll, Math.sin(t * 2) * 0.09));
      dStamp('WRONG NUMBER', CX, 1240, t, ch(L, 2), 94, -0.07, true);
    } },
    { type: 'art', sfx: [[2, 'ding', 0.25]], draw(t, a, c, L) {
      dHead('THE CONTEST'); glow(CX, 680, 420, '#ffffff', 0.18);
      cap(CX, 650 + Math.sin(t * 2.5) * 14, 220, '?', Math.sin(t * 1.4) * 0.12);
      const k = pop(t, ch(L, 2) - 0.1, 0.4); if (k > 0) xf(CX, 1010, clamp(k), 0, () => { text('₱1,000,000', CX, 1010, 170, 900, D_W, 'center', -0.04); });
      withFade(dIn(t, ch(L, 2)), () => { for (let i = 0; i < 7; i++) bill(170 + i * 124, 1230 + Math.sin(t * 3 + i) * 10, 0.9, (hash(i) - 0.5) * 0.5); });
    } },
    { type: 'art', sfx: [[2, 'transitionHit', 0.22]], draw(t, a, c, L) {
      dHead('THE EVENING NEWS');
      line(420, 420, 540, 520, D_G, 10); line(680, 410, 560, 520, D_G, 10); fillRR(110, 520, 860, 620, 46, '#3c3c3c'); strokeRR(110, 520, 860, 620, 46, D_W, 8); fillRR(160, 570, 760, 520, 30, '#0a0a0a'); fillRR(220, 1140, 60, 90, 10, D_D); fillRR(800, 1140, 60, 90, 10, D_D);
      const rev = ch(L, 2) - 0.08;
      if (t < rev) { dotPerson(CX, 760, 300, D_L); fillRR(300, 905, 480, 120, 14, D_G); text('TODAY’S WINNER', CX, 967, 44, 900, '#000', 'center', 0.06); }
      else { const k = pop(t, rev, 0.4); xf(CX, 830, clamp(k), 0, () => text('349', CX, 840, 360, 900, D_W, 'center', -0.05)); text('TODAY’S WINNER', CX, 1038, 40, 800, D_G, 'center', 0.14); }
      for (let y = 574; y < 1088; y += 12) line(165, y + (t * 40) % 12, 915, y + (t * 40) % 12, 'rgba(255,255,255,0.05)', 2, 'butt');
    } },
    { type: 'art', sfx: [[1, 'pop', 0.25], [3, 'punch', 0.28]], draw(t, a, c, L) {
      dHead('THE PROBLEM');
      for (let i = 0; i < 48; i++) { const r = Math.floor(i / 6), q = i % 6, at = a + 0.05 + Math.pow(i / 48, 0.6) * (ch(L, 3) - a - 0.1), k = pop(t, at, 0.25); if (k <= 0) continue; const x = 140 + q * 160 + (r % 2) * 14, y = 440 + r * 108; xf(x, y, clamp(k), 0, () => cap(x, y, 66, '349', (hash(i) - 0.5) * 0.5)); }
      dStamp('OH SHIT', CX, 860, t, ch(L, 3), 150, -0.09, true);
    } },
    { type: 'art', sfx: [[1, 'whoosh', 0.25]], draw(t, a, c, L) {
      dHead('THE LINE'); const k = seg(t, a, a + 1.5);
      for (let i = 0; i < 96; i++) { const r = Math.floor(i / 12), q = i % 12, at = a + hash(i + 1) * 1.2, e = dIn(t, at, 0.25); if (e <= 0) continue; withFade(e, () => dotPerson(95 + q * 81 + (r % 2) * 20, 760 + r * 74 + Math.sin(t * 2 + i) * 2, 62, r % 2 ? D_G : D_L)); if (i % 7 === 0) withFade(e, () => cap(95 + q * 81 + (r % 2) * 20 + 22, 718 + r * 74, 20, '', 0)); }
      const n = Math.round(480000 * ease.out(clamp(k * 1.6)) / 20000) * 20000; const str = n.toLocaleString() + '+', dw = tw('0', 170, 900, 0), ws = [...str].map((ch2) => (ch2 === ',' ? dw * 0.45 : dw)); let px = CX - ws.reduce((p, w) => p + w, 0) / 2; [...str].forEach((ch2, i) => { text(ch2, px + ws[i] / 2, 490, 170, 900, D_W, 'center', 0); px += ws[i]; }); text('CAME TO COLLECT', CX, 630, 52, 800, D_G, 'center', 0.12);
    } },
    { type: 'art', sfx: [[1, 'punch', 0.28]], draw(t, a, c, L) {
      dHead('PEPSI’S OFFER');
      text('YOU THOUGHT', CX, 450, 42, 800, D_G, 'center', 0.14); text('₱1,000,000', CX, 580, 150, 900, D_W, 'center', -0.04);
      const x = dIn(t, ch(L, 1) - 0.2, 0.25); if (x > 0) { line(150, 640, lerp(150, 930, x), 520, D_W, 22); }
      const k = pop(t, ch(L, 1), 0.4); if (k > 0) xf(CX, 960, clamp(k), 0, () => { fillRR(140, 760, 800, 420, 36, D_W); text('NOW', CX, 830, 44, 900, '#555', 'center', 0.2); text('₱500', CX, 965, 200, 900, '#000', 'center', -0.04); text('ABOUT $18', CX, 1110, 70, 900, '#000', 'center', 0.04); });
    } },
    { type: 'art', sfx: [[0, 'punch', 0.28], [1, 'punch', 0.28]], draw(t, a, c, L) {
      dHead('THE STREETS'); line(0, 1252, W, 1252, D_D, 8);
      const burn = dIn(t, ch(L, 1) - 0.1, 0.5);
      dDust(t, 100, 380, 880, 600, 40, 0.5 * burn, -90);
      withFade(burn, () => { flame(360, 990, 1.3, t, 1); flame(600, 960, 1.7, t, 2); flame(790, 1030, 1.0, t, 3); });
      truck(CX - 30, 1250, 1.6, -0.03 * burn); withFade(burn, () => { flame(230, 1240, 0.9, t, 5); flame(870, 1250, 0.75, t, 7); });
      for (let i = 0; i < 6; i++) dMan(80 + i * 190, 1385, 130, '#222', { arms: 'up', run: t * 10 + i });
      const k = pop(t, ch(L, 1), 0.4); if (k > 0) xf(CX, 530, clamp(k), 0, () => { text('30+', CX, 490, 230, 900, D_W, 'center', -0.04); text('TRUCKS WRECKED', CX, 650, 56, 900, D_W, 'center', 0.06); });
      else dStamp('LOST. THEIR. SHIT.', CX, 540, t, ch(L, 0), 80, -0.05);
    } },
    { type: 'art', sfx: [[2, 'transitionHit', 0.2]], draw(t, a, c, L) {
      dHead('IT GOT WORSE'); const k = dIn(t, a, 0.5);
      withFade(k, () => { [150, 345, 540, 735, 930].forEach((x, i) => { const on = t > ch(L, 1) - 0.1 + i * 0.16 ? 1 : 0.25; fillRR(x - 40, 1000, 80, 230, 14, '#9a9a9a'); line(x, 1000, x, 972, D_W, 6); withFade(on, () => { glow(x, 925, 120, '#ffffff', 0.25); flame(x, 970, 0.42, t * 0.6, i); }); }); line(70, 1236, 1010, 1236, D_D, 8); });
      const n = pop(t, ch(L, 2), 0.4); if (n > 0) xf(CX, 590, clamp(n), 0, () => { text('AT LEAST', CX, 420, 52, 800, D_G, 'center', 0.2); text('5', CX, 590, 300, 900, D_W, 'center'); text('PEOPLE DEAD', CX, 780, 66, 900, D_W, 'center', 0.04); });
    } },
    { type: 'art', sfx: [[2, 'punch', 0.25], [3, 'punch', 0.28]], draw(t, a, c, L) {
      dHead('THE SUPREME COURT');
      poly([[110, 660], [540, 400], [970, 660]], D_L); ring(CX, 575, 42, '#000', 8); fillRR(120, 665, 840, 50, 6, D_W); for (let i = 0; i < 6; i++) { const x = 175 + i * 146; fillRR(x - 34, 725, 68, 420, 8, '#a8a8a8'); [-14, 14].forEach((d) => line(x + d, 740, x + d, 1130, '#6a6a6a', 6)); fillRR(x - 46, 718, 92, 24, 6, D_W); } fillRR(100, 1148, 880, 40, 6, D_L); fillRR(60, 1192, 960, 44, 6, D_G);
      withFade(dIn(t, a) * (1 - dIn(t, ch(L, 1))), () => text('THOUSANDS SUED', CX, 1320, 64, 900, D_W, 'center', 0.06));
      dStamp('NOT OWED', CX, 920, t, ch(L, 3), 134, -0.1);
    } },
    { type: 'art', sfx: [[2, 'transitionHit', 0.22]], draw(t, a, c, L) {
      dHead('YOUR QUIET REGULARS'); phoneBox(CX, 810); circle(375, 500, 36, D_D); dotPerson(375, 496, 52, D_W); text('Marcus', 430, 503, 44, 800, D_W);
      withFade(dIn(t, a + 0.2), () => { fillRR(310, 580, 330, 96, 30, '#2e2e2e'); text('see you soon', 340, 630, 36, 600, D_L); text('7 WEEKS AGO', CX, 740, 30, 800, D_G, 'center', 0.14); });
      const k = pop(t, ch(L, 1), 0.4); if (k > 0) xf(CX, 960, clamp(k), 0, () => { ctx.save(); ctx.setLineDash([18, 16]); strokeRR(330, 820, 420, 280, 34, D_G, 5); ctx.restore(); text('nothing', CX, 925, 62, 800, D_G, 'center'); text('since', CX, 1005, 62, 800, D_G, 'center'); });
      dStamp('NOT SHIT', CX, 1150, t, ch(L, 2), 90, -0.06);
    } },
    { type: 'art', sfx: [[2, 'notification', 0.22]], draw: dHealth, rows: [['Ava', 94], ['Sam', 81], ['Marcus', 38], ['Priya', 24]], msg: ['Marcus, miss you in here.', 'Want Friday?'] },
  ];
  window.REEL = { name: 'pepsi', who: 'Marcus', scenes: S };
})();
