// MsgHealth · erfurt · black/white documentary story reel for src/hist.js (drawings use src/doc.js)
(() => {
  // cross-section of the hall: upper floor, lower floor, cesspit. u/l = how far each floor has collapsed (time since break).
  const hall = (t, u, l) => {
    strokeRR(120, 450, 840, 700, 6, D_G, 8); poly([[100, 450], [540, 365], [980, 450]], D_D);
    [220, 460, 700].forEach((x) => { fillRR(x, 495, 80, 105, 40, D_K); strokeRR(x, 495, 80, 105, 40, D_D, 4); });
    fillRR(126, 1150, 828, 220, 8, '#101010'); strokeRR(120, 1150, 840, 226, 8, D_D, 6);
    const floor = (y, dt) => {
      if (dt <= 0) { fillRR(124, y, 832, 26, 4, D_L); for (let x = 180; x < 956; x += 96) line(x, y + 3, x, y + 23, D_D, 3); return; }
      const k = ease.out(clamp(dt / 0.55)), drop = Math.min(520, 380 * dt * dt);
      [[124, 1, 0], [540, -1, 1]].forEach(([x, dir]) => { ctx.save(); const px = dir > 0 ? x : x + 416; ctx.translate(px, y + 13 + drop * 0.25); ctx.rotate(dir * k * 0.75); fillRR(dir > 0 ? 0 : -416, -13, 330 + 86 * (1 - k), 26, 4, D_G); ctx.restore(); });
    };
    ctx.save(); ctx.beginPath(); ctx.rect(122, 452, 836, 920); ctx.clip(); floor(760, u); floor(1000, l); ctx.restore();
    const man = (i, x, base, dtBreak, king) => {
      const dt = Math.max(0, dtBreak - hash(i + 2) * 0.22), y = Math.min(1325 + hash(i) * 35, base + 560 * dt * dt);
      dMan(x, dt > 0 ? y : base - Math.abs(Math.sin(t * 3 + i * 1.7)) * 5, 165, king ? D_W : D_L, { crown: king, arms: dt > 0 ? 'up' : 'down', rot: dt > 0 ? (hash(i + 5) - 0.5) * 2.6 * clamp(dt * 1.4) : 0, run: dt > 0 ? t * 9 : 0 });
    };
    [190, 285, 375, 470, 580, 680, 775, 875].forEach((x, i) => man(i, x + (u > 0 ? (540 - x) * 0.25 * clamp(u) : 0), 760, u, i === 6));
    [260, 420, 640, 820].forEach((x, i) => man(i + 11, x, 1000, l, false));
    // the pit surface, drawn over whoever fell in
    ctx.beginPath(); ctx.moveTo(126, 1374); for (let x = 126; x <= 954; x += 12) ctx.lineTo(x, 1270 + Math.sin(x * 0.03 + t * 3) * (l > 0.35 ? 16 : 6)); ctx.lineTo(954, 1374); ctx.closePath(); ctx.fillStyle = '#3c3c3c'; ctx.fill();
    text('CESSPIT', CX, 1335, 40, 900, D_W, 'center', 0.3);
    if (u > 0) dDust(t, 150, 600, 780, 600, 34, clamp(u * 2) * 0.8, 60);
  };
  const S = [
    { type: 'art', sfx: [[2, 'punch', 0.6]], draw(t, a, c, L) {
      dHead('ERFURT, GERMANY · JULY 1184'); const br = ch(L, 2) - 0.15; hall(t, t - br, t - br - 0.45);
    } },
    { type: 'art', sfx: [[2, 'pop', 0.5]], draw(t, a, c, L) {
      dHead('THE MEETING'); const k = dIn(t, a);
      withFade(k, () => dMan(290, 840, 400, D_W, { crown: true }));
      const n = pop(t, ch(L, 0), 0.4); if (n > 0) xf(740, 580, clamp(n), 0, () => text('18', 740, 580, 300, 900, D_W, 'center', -0.04)); withFade(dIn(t, ch(L, 0) + 0.2), () => text('THE KING\'S AGE', 740, 770, 36, 800, D_G, 'center', 0.1));
      const m = dIn(t, ch(L, 1), 0.4); withFade(m, () => line(120, 920, 960, 920, D_D, 4));
      withFade(m, () => { dMan(250 + 40 * (1 - m), 1260, 270, D_L); dMan(830 - 40 * (1 - m), 1260, 270, D_L); text('ARCHBISHOP', 250, 1320, 32, 800, D_W, 'center', 0.1); text('LANDGRAVE', 830, 1320, 32, 800, D_W, 'center', 0.1); });
      dStamp('ONE FEUD', CX, 1110, t, ch(L, 2), 58);
    } },
    { type: 'art', sfx: [[2, 'transitionHit', 0.35]], draw(t, a, c, L) {
      dHead('UNDER THEIR FEET');
      for (let i = 0; i < 7; i++) { const x = 150 + i * 130, b = Math.sin(t * 2.4 + i) * 6; line(x, 430, x - 8, 700 + b, D_G, 38); line(x + 52, 430, x + 62, 712, D_G, 38); fillRR(x - 40, 696 + b, 66, 28, 12, D_L); fillRR(x + 40, 698, 66, 28, 12, D_L); }
      const sag = 26 * ease.inOut(seg(t, ch(L, 2), ch(L, 2) + 0.7));
      [740, 930, 1120].forEach((y, j) => {
        ctx.beginPath(); ctx.moveTo(60, y); ctx.quadraticCurveTo(CX, y + sag * (3 - j) * 0.8, 1020, y); ctx.lineTo(1020, y + 130); ctx.quadraticCurveTo(CX, y + 130 + sag * (3 - j) * 0.8, 60, y + 130); ctx.closePath(); ctx.fillStyle = ['#4e4e4e', '#383838', '#262626'][j]; ctx.fill(); ctx.strokeStyle = D_G; ctx.lineWidth = 3; ctx.stroke();
        for (let g = 0; g < 4; g++) { ctx.beginPath(); ctx.moveTo(80, y + 24 + g * 28); ctx.bezierCurveTo(360, y + 8 + g * 30 + sag, 700, y + 48 + g * 24 + sag, 1000, y + 24 + g * 28); ctx.strokeStyle = 'rgba(255,255,255,0.14)'; ctx.stroke(); }
      });
      const k = ease.out(seg(t, ch(L, 1), ch(L, 2) + 0.7));
      [[[540, 742], [505, 800], [565, 840], [500, 910], [548, 985], [470, 1050], [510, 1130]], [[300, 745], [340, 805], [285, 860], [320, 930]], [[820, 745], [780, 815], [845, 880], [790, 950], [820, 1010]]].forEach((p) => {
        const n = k * (p.length - 1); ctx.beginPath(); ctx.moveTo(...p[0]); for (let i = 1; i < p.length && i - 1 < n; i++) { const f = clamp(n - i + 1); ctx.lineTo(lerp(p[i - 1][0], p[i][0], f), lerp(p[i - 1][1], p[i][1], f)); } ctx.strokeStyle = D_W; ctx.lineWidth = 9; ctx.stroke(); });
      dDust(t, 200, 1250, 680, 130, 22, k * 0.8, 40);
      dStamp('ROTTEN', CX, 1010, t, ch(L, 2), 120, -0.08);
    } },
    { type: 'art', sfx: [[0, 'whoosh', 0.8], [1, 'punch', 0.6], [2, 'transitionHit', 0.45]], draw(t, a, c, L) {
      dHead('THE COLLAPSE'); hall(t, t - a + 0.12, t - ch(L, 1));
    } },
    { type: 'art', sfx: [[1, 'punch', 0.4], [2, 'punch', 0.4]], draw(t, a, c, L) {
      dHead('THE DAMAGE'); withFade(dIn(t, a), () => text('ABOUT', CX, 430, 52, 800, D_G, 'center', 0.2));
      dBig('60', 590, t, a + 0.1, 300); withFade(dIn(t, a + 0.35), () => text('NOBLES DEAD', CX, 780, 66, 900, D_W, 'center', 0.04));
      for (let i = 0; i < 60; i++) { const r = Math.floor(i / 12), q = i % 12, k = dIn(t, a + 0.2 + i * 0.012, 0.25), gone = dIn(t, a + 1.0 + hash(i + 8) * 2.4, 0.5); if (k <= 0) continue; withFade(k * (1 - 0.72 * gone), () => dotPerson(122 + q * 76, 890 + r * 96, 78, D_W)); }
      dStamp('CRUSHED', 350, 990, t, ch(L, 1), 62, -0.07); dStamp('SUFFOCATED IN SHIT', 560, 1190, t, ch(L, 2), 62, 0.05);
    } },
    { type: 'art', sfx: [[2, 'swoosh', 0.7]], draw(t, a, c, L) {
      dHead('MEANWHILE, THE KING');
      ctx.strokeStyle = D_D; ctx.lineWidth = 4; for (let r = 0; r < 12; r++) for (let q = -1; q < 6; q++) ctx.strokeRect(q * 200 + (r % 2) * 100, 390 + r * 82, 200, 82);
      ctx.beginPath(); ctx.moveTo(300, 1040); ctx.lineTo(300, 680); ctx.arc(540, 680, 240, Math.PI, 0); ctx.lineTo(780, 1040); ctx.closePath(); ctx.fillStyle = '#000'; ctx.fill(); ctx.strokeStyle = D_L; ctx.lineWidth = 14; ctx.stroke();
      const sw = Math.sin(t * 5) * 14;
      fillRR(280, 1030, 520, 44, 8, D_L);
      circle(540, 705, 62, D_W); poly([[480, 662], [470, 566], [510, 612], [540, 552], [570, 612], [610, 566], [600, 662]], D_W);
      fillRR(470, 780, 140, 250, 54, D_W); line(485, 820, 345, 760, D_W, 38); line(595, 820, 735, 760, D_W, 38); line(505, 1035, 490 + sw, 1180, D_W, 44); line(575, 1035, 590 - sw, 1180, D_W, 44);
      circle(518, 700, 8, '#000'); circle(562, 700, 8, '#000'); ellipse(540, 738, 14, 18, '#000');
      const k = ease.out(seg(t, ch(L, 2) - 0.1, ch(L, 2) + 0.9)), ly = lerp(1500, 1090, k);
      ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, 1380); ctx.clip(); line(720, ly + 400, 850, ly - 60, D_L, 18); line(850, ly + 420, 960, ly - 40, D_L, 18); for (let i = 0; i < 6; i++) line(735 + 130 * (1 - i / 6) - 8, ly + i * 70, 860 + 110 * (1 - i / 6) - 10, ly + 18 + i * 70, D_L, 12); ctx.restore();
    } },
    { type: 'art', sfx: [[1, 'swoosh', 0.6], [2, 'punch', 0.5]], draw(t, a, c, L) {
      dHead('AFTERWARDS');
      const pull = ease.inOut(seg(t, ch(L, 0), ch(L, 2) - 0.1)), y = lerp(1260, 800, pull), sway = Math.sin(t * 3) * 16 * (1 - pull);
      line(330, 390, 330 + sway, y - 270, D_G, 10); dMan(330 + sway, y, 270, D_L, { arms: 'up', run: t * 2 });
      fillRR(120, 1150, 840, 226, 8, '#101010'); ctx.beginPath(); ctx.moveTo(126, 1374); for (let x = 126; x <= 954; x += 12) ctx.lineTo(x, 1220 + Math.sin(x * 0.03 + t * 3) * 8); ctx.lineTo(954, 1374); ctx.closePath(); ctx.fillStyle = '#3c3c3c'; ctx.fill();
      const go = seg(t, ch(L, 2), ch(L, 2) + 1.6), kx = 640 + 330 * go;
      withFade(1 - seg(go, 0.75, 1), () => dMan(kx, 900, 300, D_W, { crown: true, run: go > 0 ? t * 9 : 0 }));
      withFade(dIn(t, a), () => line(520, 912, 980, 912, D_D, 8));
      dStamp('FEUD: UNSETTLED', CX, 1050, t, ch(L, 2) + 0.25, 76, -0.05);
    } },
    { type: 'art', sfx: [[1, 'transitionHit', 0.3]], draw(t, a, c, L) {
      dHead('YOUR CLIENT BOOK');
      ['AVA', 'MARCUS', 'PRIYA', 'JORDAN', 'SAM', 'DANA'].forEach((n, i) => {
        const k = dIn(t, a + i * 0.07), y = 400 + i * 158, bad = i === 1 || i === 4, on = bad ? ease.out(seg(t, ch(L, 1), ch(L, 1) + 0.6)) : 0;
        withFade(k, () => { ctx.save(); ctx.translate(CX, y + 60); ctx.rotate(on * (i === 1 ? 0.045 : -0.05)); ctx.translate(-CX, -y - 60 + on * 14);
          fillRR(110, y, 860, 124, 10, '#3a3a3a'); strokeRR(110, y, 860, 124, 10, D_G, 3); [30, 62, 94].forEach((g) => line(130, y + g, 950, y + g + 6, 'rgba(255,255,255,0.1)', 3));
          circle(150, y + 62, 8, D_L); circle(930, y + 62, 8, D_L); text(n, 210, y + 66, 56, 900, D_W, 'left', 0.08);
          if (on > 0) { const p = [[640, y], [600, y + 34], [668, y + 60], [610, y + 90], [650, y + 124]]; ctx.beginPath(); ctx.moveTo(...p[0]); p.slice(1, 1 + Math.ceil(on * 4)).forEach((q) => ctx.lineTo(...q)); ctx.strokeStyle = D_W; ctx.lineWidth = 8; ctx.stroke(); }
          ctx.restore(); });
        if (bad) dStamp('?', 830, y + 62, t, ch(L, 2) + (i === 4 ? 0.2 : 0), 70, i === 1 ? -0.08 : 0.08);
      });
    } },
    { type: 'art', sfx: [[2, 'notification', 0.25]], draw: dHealth, msg: ['Been a while.', 'Want your usual spot?'] },
  ];
  window.REEL = { name: 'erfurt', who: 'Marcus', scenes: S };
})();
