// MsgHealth · pixels (Million Dollar Homepage, Cyber Monday) · black/white story reel for src/hist.js (drawings use src/doc.js)
(() => {
  const SH = ['#ffffff', '#d0d0d0', '#a0a0a0', '#6e6e6e', '#454545'];
  const win = (x, y, w, h) => { fillRR(x, y, w, h, 22, '#111'); strokeRR(x, y, w, h, 22, D_W, 6); fillRR(x, y, w, 62, 22, D_L); [0, 1, 2].forEach((i) => circle(x + 40 + i * 40, y + 31, 11, '#000')); };
  const blocks = (x, y, w, h, cols, rows, k, seed = 3) => { // ad blocks filling a page; k = share filled
    const cw = w / cols, rh = h / rows; for (let r = 0; r < rows; r++) for (let q = 0; q < cols; q++) { const i = r * cols + q; if (hash(i * 3 + seed) > k) { fillRR(x + q * cw + 2, y + r * rh + 2, cw - 4, rh - 4, 3, '#1d1d1d'); continue; } fillRR(x + q * cw + 2, y + r * rh + 2, cw - 4, rh - 4, 3, SH[Math.floor(hash(i + seed * 11) * SH.length)]); if (hash(i + 71) > 0.55) fillRR(x + q * cw + cw * 0.22, y + r * rh + rh * 0.32, cw * 0.56, rh * 0.36, 3, '#000'); }
  };
  const chain = (x, y, s, broken) => { ctx.save(); ctx.translate(x, y); ctx.rotate(-0.6); const c = broken ? '#000' : D_W; if (!broken) { strokeRR(-s * 0.75, -s * 0.28, s * 0.85, s * 0.56, s * 0.28, c, s * 0.15); strokeRR(-s * 0.1, -s * 0.28, s * 0.85, s * 0.56, s * 0.28, c, s * 0.15); } else { strokeRR(-s * 0.95, -s * 0.28, s * 0.75, s * 0.56, s * 0.28, c, s * 0.15); strokeRR(s * 0.2, -s * 0.28, s * 0.75, s * 0.56, s * 0.28, c, s * 0.15); } ctx.restore(); };
  const hacker = (x, y, t) => { ctx.beginPath(); ctx.moveTo(x - 190, y + 150); ctx.quadraticCurveTo(x - 160, y - 190, x, y - 190); ctx.quadraticCurveTo(x + 160, y - 190, x + 190, y + 150); ctx.closePath(); ctx.fillStyle = '#4a4a4a'; ctx.fill(); ellipse(x, y - 40, 82, 100, '#000'); const g = Math.sin(t * 5) > -0.85 ? D_W : '#333'; fillRR(x - 55, y - 60, 40, 14, 6, g); fillRR(x + 15, y - 60, 40, 14, 6, g); };
  const bill = (x, y, w, rot) => { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); fillRR(-w / 2, -w * 0.27, w, w * 0.54, 8, D_L); circle(0, 0, w * 0.17, D_W); text('$', 0, 2, w * 0.28, 900, '#000', 'center'); ctx.restore(); };
  const S = [
    { type: 'art', sfx: [[3, 'punch', 0.26]], draw(t, a, c, L) {
      dHead('A TRUE STORY'); win(120, 400, 840, 620); blocks(145, 485, 790, 510, 14, 10, 0.45 + 0.55 * seg(t, 0, ch(L, 3)), 3);
      dBig('$1,000,000', 1155, t, -0.3, 200);
      dStamp('FOR DOTS', CX, 1315, t, ch(L, 3), 66, -0.04);
    } },
    { type: 'art', sfx: [[3, 'punch', 0.26]], draw(t, a, c, L) {
      dHead('ENGLAND · 2005');
      ctx.save(); ctx.translate(CX, 585 + Math.sin(t * 2.2) * 12); ctx.rotate(-0.05); fillRR(-260, -170, 520, 340, 14, D_W); text('STUDENT', 0, -80, 84, 900, '#000', 'center'); text('LOAN', 0, 10, 84, 900, '#000', 'center'); line(-190, 80, 190, 80, '#777', 8); line(-190, 118, 100, 118, '#777', 8); ctx.restore();
      line(0, 1300, W, 1300, D_D, 8); fillRR(470, 1155, 520, 28, 8, D_G); line(520, 1180, 520, 1298, D_G, 18); line(940, 1180, 940, 1298, D_G, 18);
      fillRR(640, 900, 290, 235, 26, D_L); fillRR(668, 928, 234, 175, 10, '#111'); fillRR(750, 1135, 70, 22, 4, D_G); blocks(690, 950, 190, 130, 5, 4, 0.15, 9);
      dMan(290, 1300, 410, D_W); line(330, 1060, 620, 1140 + Math.sin(t * 11) * 10, D_W, 26);
      for (let i = 0; i < 4; i++) { const p = (t * 0.9 + i / 4) % 1, x = i < 2 ? 190 - p * 60 - i * 20 : 390 + p * 60 + (i - 2) * 20, y = 920 + p * 130; ellipse(x, y, 10, 18, `rgba(255,255,255,${1 - p})`); }
      dStamp('HE’S 21', 830, 835, t, ch(L, 1), 62, 0.06, true);
    } },
    { type: 'art', sfx: [[2, 'pop', 0.25], [4, 'ding', 0.24]], draw(t, a, c, L) {
      dHead('THE PLAN');
      withFade(1 - dIn(t, ch(L, 2) - 0.1, 0.25), () => { win(160, 420, 760, 700); blocks(185, 505, 710, 590, 10, 8, 0.04, 5); text('UGLY.', CX, 800, 130, 900, D_W, 'center'); });
      const k = dIn(t, ch(L, 2) - 0.05, 0.3); withFade(k, () => { dBig('1,000,000', 490, t, ch(L, 2), 220); text('PIXELS', CX, 635, 54, 800, D_G, 'center', 0.2);
        for (let r = 0; r < 10; r++) for (let q = 0; q < 10; q++) fillRR(340 + q * 40, 710 + r * 40, 36, 36, 3, r === 4 && q === 4 && Math.sin(t * 8) > -0.3 ? D_W : '#3a3a3a'); });
      dStamp('$1 EACH', 280, 1180, t, ch(L, 3), 74, -0.06);
      dStamp('$100 MINIMUM', 660, 1300, t, ch(L, 4), 62, 0.04, true);
      withFade(dIn(t, ch(L, 4)), () => strokeRR(336, 706, 404, 404, 8, D_W, 8));
    } },
    { type: 'art', sfx: [[1, 'whoosh', 0.26], [3, 'punch', 0.28]], draw(t, a, c, L) {
      dHead('THE MONEY'); win(110, 410, 860, 610); blocks(135, 495, 810, 500, 18, 12, 0.2 + 0.8 * ease.out(seg(t, a, ch(L, 3))), 8);
      for (let i = 0; i < 10; i++) { const p = ((t * 0.5 + hash(i)) % 1); bill(70 + i * 105 + Math.sin(t * 2 + i) * 20, 1040 + p * 40 - 20, 84, Math.sin(t * 3 + i) * 0.5); }
      dBig('$1,037,100', 1200, t, ch(L, 3), 200);
      dStamp('SOLD', CX, 740, t, ch(L, 1), 130, -0.09);
    } },
    { type: 'art', sfx: [[2, 'ding', 0.26], [3, 'punch', 0.26]], draw(t, a, c, L) {
      dHead('THE LAST 1,000 PIXELS'); dBig('$38,100', 500, t, ch(L, 2), 240); withFade(dIn(t, ch(L, 2)), () => text('WINNING EBAY BID', CX, 650, 46, 800, D_G, 'center', 0.14));
      const mx = 460 + Math.sin(t * 1.7) * 26, my = 930 + Math.cos(t * 2.1) * 12;
      line(mx + 150, my + 150, mx + 320, my + 280, D_G, 56); circle(mx, my, 215, '#101010'); ring(mx, my, 215, D_W, 26);
      glow(mx, my, 110, '#ffffff', 0.35); fillRR(mx - 12, my - 12, 24, 24, 3, D_W);
      withFade(dIn(t, ch(L, 1)), () => { line(mx - 120, my - 105, mx - 34, my - 34, D_G, 8); poly([[mx - 20, my - 20], [mx - 62, my - 34], [mx - 34, my - 62]], D_G); text('IT’S THIS', mx - 40, my + 100, 40, 800, D_G, 'center', 0.12); });
      dStamp('A FUCKING SPECK', 450, 1305, t, ch(L, 3), 62, -0.04);
    } },
    { type: 'art', sfx: [[1, 'notification', 0.22], [3, 'punch', 0.28]], draw(t, a, c, L) {
      dHead('JANUARY 2006'); hacker(CX, 590, t);
      const k = dIn(t, a + 0.15); withFade(k, () => { fillRR(120, 790, 840, 480, 30, D_W); text('FROM: THE DARK GROUP', 170, 860, 42, 800, '#000', 'left', 0.04); line(170, 905, 910, 905, '#888', 6); });
      withFade(dIn(t, ch(L, 1)), () => text('PAY UP.', CX, 975, 82, 900, '#000', 'center'));
      const second = t >= ch(L, 3); if (t >= ch(L, 2) - 0.05) { const e = pop(t, second ? ch(L, 3) : ch(L, 2) - 0.05, 0.35); xf(CX, 1140, clamp(e), 0, () => text(second ? '$50,000' : '$5,000', CX, 1140, second ? 178 : 150, 900, '#000', 'center')); }
      dStamp('RANSOM', 830, 420, t, ch(L, 2), 54, 0.12);
    } },
    { type: 'art', sfx: [[1, 'punch', 0.26], [3, 'transitionHit', 0.22]], draw(t, a, c, L) {
      dHead('HE SAID NO');
      const off = t >= ch(L, 3), j = off ? shake(t, ch(L, 3), 18, 0.5) : 0;
      ctx.save(); ctx.translate(j, 0); win(230, 610, 620, 520);
      if (!off) blocks(255, 695, 570, 410, 12, 8, 1, 8); else { text('SITE', CX, 840, 130, 900, D_W, 'center'); text('OFFLINE', CX, 985, 130, 900, D_W, 'center'); [[330, 700, 400, 780, 360, 860], [760, 1105, 690, 1050, 720, 1010]].forEach(([a1, b1, a2, b2, a3, b3]) => { line(a1, b1, a2, b2, D_G, 7); line(a2, b2, a3, b3, D_G, 7); }); }
      ctx.restore();
      const s = dIn(t, ch(L, 2) - 0.1) ; if (s > 0) for (let i = 0; i < 18; i++) { const p = (t * 1.4 + hash(i)) % 1, side = i % 2 ? 1 : -1, y = 640 + hash(i + 3) * 470, x0 = side < 0 ? 10 : 1070, x1 = side < 0 ? 215 : 865, x = lerp(x0, x1, p); withFade(s, () => { line(x, y, x - side * -46, y, D_W, 8); poly([[x - side * 22, y], [x + side * 2, y - 16], [x + side * 2, y + 16]], D_W); }); }
      dStamp('NOT ONE CENT', CX, 470, t, ch(L, 1), 84, -0.05);
      dStamp('KNOCKED DOWN', CX, 1265, t, ch(L, 3), 74, 0.04, true);
    } },
    { type: 'art', sfx: [[3, 'punch', 0.28]], draw(t, a, c, L) {
      dHead('THE LINKS · 2017'); dBig('1 IN 5', 490, t, ch(L, 3) - 0.1, 240);
      for (let i = 0; i < 25; i++) { const q = i % 5, r = Math.floor(i / 5), x = 220 + q * 160, y = 720 + r * 118, e = pop(t, a + 0.05 + i * 0.025, 0.25); if (e <= 0) continue; const dead = (i % 5 === (r * 2 + 1) % 5) && t >= ch(L, 3) + r * 0.09;
        xf(x, y, clamp(e), 0, () => { fillRR(x - 70, y - 52, 140, 104, 12, dead ? D_W : '#222'); chain(x, y, 54, dead); if (dead) { line(x - 50, y + 36, x + 50, y - 36, '#000', 8); } }); }
      dStamp('DEAD AS SHIT', CX, 1315, t, ch(L, 4), 62, -0.04, true);
    } },
    { type: 'art', sfx: [[2, 'pop', 0.25], [3, 'punch', 0.26]], draw(t, a, c, L) {
      dHead('CYBER MONDAY · YOUR LIST');
      [['Ava', '3 weeks ago'], ['Marcus', '9 weeks ago'], ['Priya', '5 months ago'], ['Jordan', 'last spring']].forEach(([n, w], i) => { const k = dIn(t, a + 0.1 + i * 0.12), y = 400 + i * 200; if (k <= 0) return; const rot = i ? dIn(t, ch(L, 2) + (i - 1) * 0.35, 0.3) : 0;
        withFade(k, () => { fillRR(110, y, 860, 168, 24, rot > 0.5 ? '#2a2a2a' : 'rgba(255,255,255,0.1)'); strokeRR(110, y, 860, 168, 24, rot > 0.5 ? D_D : D_G, 4); dotPerson(205, y + 80, 100, rot > 0.5 ? D_D : D_W); text(n, 300, y + 62, 56, 800, rot > 0.5 ? D_G : D_W, 'left'); text('last visit: ' + w, 300, y + 120, 34, 600, D_G, 'left', 0); if (rot > 0) xf(855, y + 84, 0.6 + 0.4 * rot, 0, () => { fillRR(770, y + 40, 170, 88, 12, D_W); text('404', 855, y + 87, 58, 900, '#000', 'center'); }); }); });
      dStamp('SAME DAMN ROT', CX, 1290, t, ch(L, 3), 74, -0.04);
    } },
    { type: 'art', sfx: [[2, 'notification', 0.22]], draw: dHealth, rows: [['Ava', 94], ['Noor', 82], ['Marcus', 39], ['Jordan', 24]], msg: ['Marcus, been a minute.', 'Want your usual spot?'] },
  ];
  window.REEL = { name: 'pixels', who: 'Marcus', scenes: S };
})();
