// MsgHealth · meux · black/white illustrated true story for src/hist.js (drawings use src/doc.js)
(() => {
  // wooden vat standing on (x, base). slip = how far the second hoop has dropped (0..1), shake in px
  const vat = (x, base, w, h, o = {}) => {
    const sx = x + (o.shake || 0), top = base - h, bulge = w * 0.1;
    const side = () => { ctx.beginPath(); ctx.moveTo(sx - w / 2, top); ctx.lineTo(sx + w / 2, top); ctx.quadraticCurveTo(sx + w / 2 + bulge, base - h / 2, sx + w / 2, base); ctx.lineTo(sx - w / 2, base); ctx.quadraticCurveTo(sx - w / 2 - bulge, base - h / 2, sx - w / 2, top); ctx.closePath(); };
    side(); ctx.fillStyle = '#9a9a9a'; ctx.fill();
    ctx.save(); side(); ctx.clip();
    for (let i = -5; i <= 5; i++) { const px = sx + i * w / 10; ctx.beginPath(); ctx.moveTo(px, top); ctx.quadraticCurveTo(px + i * bulge / 5, base - h / 2, px, base); ctx.strokeStyle = '#5a5a5a'; ctx.lineWidth = 5; ctx.stroke(); }
    ctx.restore();
    ellipse(sx, top, w / 2, w * 0.085, D_L); ellipse(sx, top, w / 2 - 26, w * 0.062, '#6a6a6a');
    [0.12, 0.38, 0.66, 0.9].forEach((f, i) => {
      const s = i === 1 ? (o.slip || 0) : 0, y = top + h * f + s * h * 0.17, b = bulge * Math.sin(Math.PI * f) * 0.9;
      ctx.save(); ctx.translate(sx, y); ctx.rotate(s * 0.13);
      ctx.beginPath(); ctx.moveTo(-w / 2 - b - 8, 0); ctx.quadraticCurveTo(0, w * 0.11, w / 2 + b + 8, 0); ctx.lineCap = 'round';
      ctx.strokeStyle = i === 1 && o.hot ? '#ffffff' : '#262626'; ctx.lineWidth = Math.max(10, w * 0.052); ctx.stroke(); ctx.restore();
    });
  };
  // a rolling wall of beer: crest along y, filled down to bottom
  const beer = (t, x0, x1, y, bottom, amp = 34) => {
    ctx.beginPath(); ctx.moveTo(x0, bottom); ctx.lineTo(x0, y);
    for (let x = x0; x <= x1; x += 20) ctx.lineTo(x, y + Math.sin(x / 70 + t * 7) * amp);
    ctx.lineTo(x1, bottom); ctx.closePath(); ctx.fillStyle = '#c4c4c4'; ctx.fill();
    for (let x = x0; x <= x1; x += 46) circle(x, y + Math.sin(x / 70 + t * 7) * amp, 26 + hash(x) * 16, D_W);
    for (let i = 0; i < 24; i++) { const px = x0 + hash(i) * (x1 - x0), py = y + 60 + hash(i + 40) * Math.max(0, bottom - y - 90); circle(px, py + Math.sin(t * 5 + i) * 8, 5 + hash(i + 8) * 9, 'rgba(255,255,255,0.55)'); }
  };
  const house = (x, base, w, h, tilt = 0) => { ctx.save(); ctx.translate(x, base); ctx.rotate(tilt); fillRR(-w / 2, -h, w, h, 4, '#3c3c3c'); poly([[-w / 2 - 16, -h], [0, -h - w * 0.42], [w / 2 + 16, -h]], '#5c5c5c'); [-0.24, 0.24].forEach((f) => [0.72, 0.36].forEach((g) => fillRR(f * w - 18, -h * g - 22, 36, 44, 4, '#d8d8d8'))); ctx.restore(); };
  const candle = (x, y, t) => { fillRR(x - 8, y - 56, 16, 56, 4, D_L); ellipse(x, y - 74 + Math.sin(t * 9 + x) * 3, 9, 18, D_W); circle(x, y - 74, 42, 'rgba(255,255,255,0.12)'); };

  const S = [
    { type: 'art', sfx: [[1, 'punch', 0.28]], draw(t, a, c, L) {
      dHead('LONDON, 1814');
      const burst = ch(L, 1) + 0.12, pre = t < burst ? seg(t, 0, burst) : 0, k = ease.out(seg(t, burst, burst + 0.5));
      ellipse(CX, 1285, 470, 52, 'rgba(255,255,255,0.14)');
      vat(CX, 1270, 600, 780, { shake: Math.sin(t * 46) * 11 * pre * pre, slip: 0.25 });
      if (t >= burst) {
        for (let i = 0; i < 46; i++) { const an = -Math.PI + hash(i) * Math.PI, d = k * (200 + hash(i + 11) * 420), f = (t - burst) * (t - burst) * 220; circle(CX + Math.cos(an) * d, 900 + Math.sin(an) * d * 0.8 + f, 14 + hash(i + 5) * 34, i % 3 ? D_W : '#c4c4c4'); }
        poly([[CX - 40, 700], [CX + 30, 840], [CX - 25, 930], [CX + 55, 1100], [CX - 5, 1230], [CX - 80, 1060], [CX - 20, 940], [CX - 95, 820]], D_W);
        beer(t, 0, W, 1330 - 190 * k, 1380, 26);
      }
      dMan(125, 1280, 200, D_L); dMan(960, 1280, 180, D_G);
      dStamp('8 DEAD', CX, 560, t, burst + 0.05, 130, -0.06);
    } },
    { type: 'art', sfx: [[0, 'swoosh', 0.2], [2, 'pop', 0.2]], draw(t, a, c, L) {
      dHead('THAT AFTERNOON');
      const sl = ease.in(seg(t, a + 0.25, a + 1.0));
      vat(CX - 90, 1270, 640, 800, { slip: sl, hot: true });
      const k = dIn(t, a + 1.0, 0.3); withFade(k, () => { line(900, 600, 770, 780, D_W, 9); poly([[742, 818], [752, 758], [800, 792]], D_W); text('HOOP', 900, 505, 52, 900, D_W, 'center', 0.04); text('SLIPPED', 900, 563, 52, 900, D_W, 'center', 0.04); });
      dMan(935, 1280, 330, D_L);
      dStamp('NOBODY CARED', CX - 85, 1075, t, ch(L, 2) + 0.05, 84, -0.05);
    } },
    { type: 'art', sfx: [[0, 'swoosh', 0.3]], draw(t, a, c, L) {
      dHead('THEN IT BURST');
      dBig('100,000+', 520, t, a + 0.05, 260); withFade(dIn(t, a + 0.3), () => text('GALLONS OF BEER', CX, 700, 56, 800, D_L, 'center', 0.06));
      const k = ease.inOut(seg(t, a + 0.2, a + 3.4)), edge = lerp(180, 1180, k);
      [[170, 220, 330], [420, 200, 260], [680, 230, 360], [920, 200, 290]].forEach(([x, w, h], i) => house(x, 1290, w, h, clamp((edge - x) / 400) * (i % 2 ? 0.13 : 0.08)));
      ctx.save(); ctx.beginPath(); ctx.rect(-40, 760, edge + 40, 620); ctx.clip(); beer(t, -40, edge + 40, 1080 - Math.sin(k * Math.PI) * 90, 1380, 44); ctx.restore();
      if (edge < W) for (let i = 0; i < 9; i++) circle(edge + Math.sin(t * 9 + i * 2) * 14, 1085 - Math.sin(k * Math.PI) * 90 + i * 36, 30 + hash(i + 21) * 26, D_W);
    } },
    { type: 'art', sfx: [[0, 'punch', 0.2]], draw(t, a, c, L) {
      dHead('IN THE CELLARS');
      dBig('8', 520, t, a + 0.03, 280); withFade(dIn(t, a + 0.25), () => text('PEOPLE KILLED', CX, 700, 56, 800, D_L, 'center', 0.06));
      line(40, 790, 1040, 790, D_G, 8); fillRR(120, 810, 840, 500, 14, '#161616'); strokeRR(120, 810, 840, 500, 14, D_G, 5);
      fillRR(430, 1170, 220, 22, 6, D_G); line(455, 1190, 455, 1290, D_G, 12); line(625, 1190, 625, 1290, D_G, 12);
      candle(480, 1170, t); candle(600, 1170, t);
      [[240, 300], [350, 270], [740, 285], [855, 310]].forEach(([x, h]) => dMan(x, 1295, h, D_L));
      const r = ease.in(seg(t, ch(L, 2) - 0.2, a + 3.2));
      if (r > 0) { ctx.save(); ctx.beginPath(); ctx.rect(122, 812, 836, 496); ctx.clip(); ctx.globalAlpha *= 0.86; beer(t, 100, 980, 1330 - 300 * r, 1330, 24); ctx.restore(); }
    } },
    { type: 'art', sfx: [[2, 'punch', 0.28]], draw(t, a, c, L) {
      dHead('THE VERDICT');
      poly([[140, 560], [CX, 395], [940, 560]], '#8a8a8a'); fillRR(150, 565, 780, 40, 6, D_L);
      for (let i = 0; i < 5; i++) { const x = 205 + i * 168; fillRR(x - 34, 620, 68, 380, 8, '#5c5c5c'); line(x - 12, 640, x - 12, 980, '#8c8c8c', 6); line(x + 12, 640, x + 12, 980, '#8c8c8c', 6); }
      fillRR(130, 1010, 820, 44, 6, D_L); fillRR(100, 1060, 880, 44, 6, D_G);
      dStamp('ACT OF GOD', CX, 800, t, a + 0.7, 118, -0.07);
      dStamp('BREWERY PAID $0', CX, 1230, t, ch(L, 2) - 0.05, 82, 0.04, true);
    } },
    { type: 'art', sfx: [[1, 'pop', 0.2]], draw(t, a, c, L) {
      dHead('THE WARNING');
      vat(CX, 1100, 420, 560, { slip: 1, hot: true });
      const k = pop(t, a + 0.15, 0.4); if (k > 0) ring(CX, 807, 285 * clamp(k, 0, 1.1) + Math.sin(t * 5) * 6, D_W, 10);
      dStamp('GOD DIDN’T DO IT', CX, 420 + 8, t, a + 0.05, 70, -0.04, true);
      dStamp('THE HOOP SLIPPED FIRST', CX, 1240, t, ch(L, 1) + 0.05, 62, 0.03);
    } },
    { type: 'art', sfx: [[1, 'pop', 0.2], [2, 'punch', 0.2]], draw(t, a, c, L) {
      dHead('YOUR REGULAR');
      const g = ch(L, 1), end = ch(L, 2);
      [['4', g + 0.05, 230], ['6', g + 0.85, 360], ['9', g + 1.4, 540]].forEach(([n, at, h], i) => {
        const k = ease.out(seg(t, at, at + 0.35)); if (k <= 0) return; const x = 250 + i * 290;
        fillRR(x - 105, 1210 - h * k, 210, h * k, 16, i === 2 ? D_W : D_G);
        withFade(k, () => { text(n, x, 1210 - h * k - 85, 130, 900, D_W, 'center', -0.03); text('WEEKS', x, 1262, 40, 800, D_L, 'center', 0.08); });
      });
      withFade(dIn(t, a) * (1 - dIn(t, g - 0.1, 0.25)), () => { dMan(CX, 1150, 600, D_L); text('?', CX, 450, 150, 900, D_W, 'center', 0); });
      withFade(dIn(t, g), () => text('BETWEEN CUTS', CX, 430, 56, 800, D_L, 'center', 0.06));
      dStamp('GONE', 300, 575, t, end + 0.05, 130, -0.09);
    } },
    { type: 'chat', msgs: [{ y: 170, out: true, lines: ['Been a while. Want your', 'usual spot this week?'], at: 0.4 }, { y: 420, out: false, lines: ['Damn, yes. Thursday?'], at: 3.4 }] },
  ];
  window.REEL = { name: 'meux', who: 'Marcus', scenes: S };
})();
