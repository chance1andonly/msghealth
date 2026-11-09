// Paper cut-out finish for kit videos (used by the "Our story" video). Loaded after src/kit.js, before the video's script.
// Every filled shape drawn on the main canvas becomes a piece of hand-cut card, without touching the scene code:
//  · boil: each piece sits a pixel or so off, re-posed 12 times a second (stop-motion "on twos")
//  · a tight, directional drop shadow onto the layer below
//  · a pale cut edge just inside the outline (the paper's core catching the light)
// finishPaper(t) then lays paper fibre, a warm grade, a vignette and film grain over the whole frame.
// Translucent fills (shading, blush, contact shadows, glows) and tiny dots stay flat, so they read as print, not card.
'use strict';
const PAPER = { pose: 0, call: 0, on: true, jit: 1.25, tex: null, pat: null, grain: [] };
const POSE_FPS = 12;
const poseTime = (t) => Math.floor(t * POSE_FPS + 1e-6) / POSE_FPS;
function paperFrame(t) { PAPER.pose = Math.floor(t * POSE_FPS + 1e-6); PAPER.call = 0; }

(() => {
  const P = CanvasRenderingContext2D.prototype;
  const o = {}; ['beginPath', 'moveTo', 'lineTo', 'arc', 'ellipse', 'roundRect', 'rect', 'quadraticCurveTo', 'bezierCurveTo', 'fill', 'stroke'].forEach((k) => (o[k] = P[k]));
  let jx = 0, jy = 0, bb = [0, 0, 0, 0], m = null;
  const on = (c) => PAPER.on && c === MAIN;
  const add = (x, y, r = 0) => { const X = m.a * x + m.c * y + m.e, Y = m.b * x + m.d * y + m.f, R = r * Math.hypot(m.a, m.b); if (X - R < bb[0]) bb[0] = X - R; if (Y - R < bb[1]) bb[1] = Y - R; if (X + R > bb[2]) bb[2] = X + R; if (Y + R > bb[3]) bb[3] = Y + R; };
  P.beginPath = function () {
    if (on(this)) { const id = PAPER.call++; m = this.getTransform(); const s = Math.hypot(m.a, m.b) || 1; jx = ((hash(PAPER.pose * 13.1 + id * 7.7) - 0.5) * 2 * PAPER.jit) / s; jy = ((hash(PAPER.pose * 5.3 + id * 3.9) - 0.5) * 2 * PAPER.jit) / s; bb = [1e9, 1e9, -1e9, -1e9]; }
    return o.beginPath.call(this);
  };
  const wrap = (name, pts, rIdx) => { P[name] = function (...a) {
    if (!on(this) || !m) return o[name].apply(this, a);
    for (const i of pts) { a[i] += jx; a[i + 1] += jy; }
    for (const i of pts) add(a[i], a[i + 1], rIdx != null ? Math.abs(a[rIdx]) + (name === 'ellipse' ? Math.abs(a[3]) : 0) : 0);
    if (name === 'roundRect' || name === 'rect') add(a[0] + a[2], a[1] + a[3]);
    return o[name].apply(this, a);
  }; };
  wrap('moveTo', [0]); wrap('lineTo', [0]); wrap('arc', [0], 2); wrap('ellipse', [0], 2); wrap('roundRect', [0]); wrap('rect', [0]);
  wrap('quadraticCurveTo', [0, 2]); wrap('bezierCurveTo', [0, 2, 4]);
  const alphaOf = (s) => { if (typeof s !== 'string') return 1; const r = /rgba\([^)]*,\s*([\d.]+)\s*\)/.exec(s); return r ? +r[1] : 1; };
  P.fill = function (...a) {
    if (!on(this)) return o.fill.apply(this, a);
    const size = Math.min(bb[2] - bb[0], bb[3] - bb[1]), solid = alphaOf(this.fillStyle) > 0.7 && this.globalAlpha > 0.5;
    if (!solid || size < 4 || this.globalCompositeOperation !== 'source-over') return o.fill.apply(this, a);
    const k = clamp(size / 70, 0.3, 1);
    this.save();
    if (this.shadowBlur === 0) { this.shadowColor = `rgba(40,28,20,${0.34 * k + 0.08})`; this.shadowBlur = 3 + 5 * k; this.shadowOffsetX = 1 + 1.5 * k; this.shadowOffsetY = 1.5 + 3.5 * k; }
    o.fill.apply(this, a);
    this.restore();
    if (size > 16) { // pale cut edge, inside the outline only
      const s = Math.hypot(m.a, m.b) || 1;
      this.save(); this.clip(...a); this.shadowColor = 'transparent'; this.lineWidth = 2.6 / s; this.strokeStyle = 'rgba(255,251,242,0.42)'; o.stroke.call(this); this.restore();
    }
  };
  P.stroke = function (...a) {
    if (!on(this)) return o.stroke.apply(this, a);
    const s = Math.hypot(this.getTransform().a, this.getTransform().b) || 1, w = this.lineWidth * s;
    if (this.shadowBlur > 0 || w < 3 || alphaOf(this.strokeStyle) < 0.7 || this.globalAlpha < 0.5) return o.stroke.apply(this, a);
    const k = clamp(w / 40, 0.3, 1);
    this.save(); this.shadowColor = `rgba(40,28,20,${0.3 * k + 0.08})`; this.shadowBlur = 2 + 4 * k; this.shadowOffsetX = 1 + k; this.shadowOffsetY = 1.5 + 2.5 * k; o.stroke.apply(this, a); this.restore();
  };
})();

// Seeded textures (every render worker makes identical ones): paper tooth + fibres, and four film-grain frames.
function makePaperTextures(c) {
  let sd = 1234567; const rnd = () => ((sd = (sd * 16807) % 2147483647) / 2147483647);
  const tc = document.createElement('canvas'); tc.width = tc.height = 512; const t = tc.getContext('2d');
  t.fillStyle = '#808080'; t.fillRect(0, 0, 512, 512);
  const img = t.getImageData(0, 0, 512, 512); for (let i = 0; i < img.data.length; i += 4) { const v = 128 + (rnd() - 0.5) * 22; img.data[i] = img.data[i + 1] = img.data[i + 2] = v; } t.putImageData(img, 0, 0);
  for (let k = 0; k < 60; k++) { const x = rnd() * 512, y = rnd() * 512, r = 20 + rnd() * 70, g = t.createRadialGradient(x, y, 0, x, y, r), v = rnd() < 0.5 ? 0 : 255; g.addColorStop(0, `rgba(${v},${v},${v},0.07)`); g.addColorStop(1, `rgba(${v},${v},${v},0)`); t.fillStyle = g; t.fillRect(x - r, y - r, r * 2, r * 2); }
  for (let k = 0; k < 1100; k++) { const x = rnd() * 512, y = rnd() * 512, a = rnd() * 6.28, l = 4 + rnd() * 18; t.beginPath(); t.moveTo(x, y); t.quadraticCurveTo(x + Math.cos(a + 0.6) * l * 0.5, y + Math.sin(a + 0.6) * l * 0.5, x + Math.cos(a) * l, y + Math.sin(a) * l); t.strokeStyle = rnd() < 0.5 ? 'rgba(255,255,255,0.24)' : 'rgba(40,40,40,0.15)'; t.lineWidth = 0.6 + rnd() * 0.7; t.stroke(); }
  PAPER.tex = tc; PAPER.pat = c.createPattern(tc, 'repeat');
  for (let k = 0; k < 4; k++) { const g = document.createElement('canvas'); g.width = 540; g.height = 960; const gc = g.getContext('2d'), im = gc.createImageData(540, 960); for (let i = 0; i < im.data.length; i += 4) { const v = 128 + (rnd() - 0.5) * 90; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255; } gc.putImageData(im, 0, 0); PAPER.grain.push(g); }
}
// Whole-frame finish: paper fibre (soft-light), warm grade, vignette, grain.
function finishPaper(t) {
  const c = ctx; if (!PAPER.pat) makePaperTextures(c);
  PAPER.on = false; c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.shadowColor = 'transparent'; c.shadowBlur = 0;
  c.globalCompositeOperation = 'soft-light'; c.globalAlpha = 0.6; c.fillStyle = PAPER.pat; c.fillRect(0, 0, W, H);
  c.globalAlpha = 1; c.fillStyle = 'rgba(255,170,90,0.07)'; c.fillRect(0, 0, W, H);
  c.globalCompositeOperation = 'multiply'; const g = c.createRadialGradient(W / 2, H * 0.45, H * 0.32, W / 2, H * 0.45, H * 0.85); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(60,40,25,0.38)'); c.fillStyle = g; c.fillRect(0, 0, W, H);
  c.globalCompositeOperation = 'overlay'; c.globalAlpha = 0.06; c.drawImage(PAPER.grain[Math.floor(t * POSE_FPS + 1e-6) % 4], 0, 0, W, H);
  c.restore(); PAPER.on = true;
}
