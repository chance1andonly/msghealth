// Paper cut-out finish for kit videos (used by the "Our story" video). Loaded after src/kit.js, before the video's script.
// Every filled shape drawn on the main canvas becomes a piece of hand-cut card, without touching the scene code:
//  · scissor cuts: curves, circles and rounded corners are cut as short straight snips with a little wobble
//  · a fold: one side of a crease turns away from the light, with a pale crease line
//  · boil: each piece sits a pixel or so off, re-posed 12 times a second (stop-motion "on twos")
//  · a lifted, directional drop shadow onto the layer below
//  · a pale cut edge just inside the outline (the paper's core catching the light)
// finishPaper(t) then lays paper fibre, crinkles, a warm grade, a vignette and film grain over the whole frame.
// Translucent fills (shading, blush, contact shadows, glows) and tiny dots stay flat, so they read as print, not card.
'use strict';
const PAPER = { pose: 0, call: 0, on: true, jit: 1.25, tex: null, pat: null, grain: [] };
const POSE_FPS = 12;
const poseTime = (t) => Math.floor(t * POSE_FPS + 1e-6) / POSE_FPS;
function paperFrame(t) { PAPER.pose = Math.floor(t * POSE_FPS + 1e-6); PAPER.call = 0; }

(() => {
  const P = CanvasRenderingContext2D.prototype, TAU = Math.PI * 2;
  const o = {}; ['beginPath', 'moveTo', 'lineTo', 'closePath', 'arc', 'ellipse', 'roundRect', 'rect', 'quadraticCurveTo', 'bezierCurveTo', 'fill', 'stroke'].forEach((k) => (o[k] = P[k]));
  let jx = 0, jy = 0, bb = [0, 0, 0, 0], m = null, sc = 1, id = 0, seg = 0, last = null, start = null;
  const on = (c) => PAPER.on && c === MAIN;
  const add = (x, y, r = 0) => { const X = m.a * x + m.c * y + m.e, Y = m.b * x + m.d * y + m.f, R = r * sc; if (X - R < bb[0]) bb[0] = X - R; if (Y - R < bb[1]) bb[1] = Y - R; if (X + R > bb[2]) bb[2] = X + R; if (Y + R > bb[3]) bb[3] = Y + R; };
  const wob = () => 1 + (hash(id * 3.1 + (seg++) * 1.7 + PAPER.pose * 0.31) - 0.5) * 0.045; // scissor wobble, re-cut each pose
  const segsFor = (rDev) => Math.max(9, Math.min(18, Math.round(rDev / 8)));
  const L = (c, x, y) => { o.lineTo.call(c, x, y); if (!start) start = [x, y]; last = [x, y]; add(x, y); };
  P.beginPath = function () {
    if (on(this)) { id = PAPER.call++; seg = 0; m = this.getTransform(); sc = Math.hypot(m.a, m.b) || 1; jx = ((hash(PAPER.pose * 13.1 + id * 7.7) - 0.5) * 2 * PAPER.jit) / sc; jy = ((hash(PAPER.pose * 5.3 + id * 3.9) - 0.5) * 2 * PAPER.jit) / sc; bb = [1e9, 1e9, -1e9, -1e9]; last = start = null; }
    return o.beginPath.call(this);
  };
  P.moveTo = function (x, y) { if (!on(this) || !m) return o.moveTo.call(this, x, y); x += jx; y += jy; o.moveTo.call(this, x, y); last = start = [x, y]; add(x, y); };
  P.lineTo = function (x, y) { if (!on(this) || !m) return o.lineTo.call(this, x, y); L(this, x + jx, y + jy); };
  P.closePath = function () { o.closePath.call(this); if (on(this)) last = start; };
  P.rect = function (x, y, w, h) { if (!on(this) || !m) return o.rect.call(this, x, y, w, h); x += jx; y += jy; o.rect.call(this, x, y, w, h); add(x, y); add(x + w, y + h); last = start = [x, y]; };
  // curves are cut as a few straight snips
  P.quadraticCurveTo = function (cx, cy, x, y) {
    if (!on(this) || !m || !last) return o.quadraticCurveTo.call(this, cx, cy, x, y);
    cx += jx; cy += jy; x += jx; y += jy; const [x0, y0] = last, n = Math.max(2, Math.min(6, Math.round(Math.hypot(x - x0, y - y0) * sc / 40)));
    for (let i = 1; i <= n; i++) { const t = i / n, u = 1 - t; L(this, u * u * x0 + 2 * u * t * cx + t * t * x, u * u * y0 + 2 * u * t * cy + t * t * y); }
  };
  P.bezierCurveTo = function (c1x, c1y, c2x, c2y, x, y) {
    if (!on(this) || !m || !last) return o.bezierCurveTo.call(this, c1x, c1y, c2x, c2y, x, y);
    c1x += jx; c1y += jy; c2x += jx; c2y += jy; x += jx; y += jy; const [x0, y0] = last, n = Math.max(3, Math.min(7, Math.round(Math.hypot(x - x0, y - y0) * sc / 36)));
    for (let i = 1; i <= n; i++) { const t = i / n, u = 1 - t; L(this, u * u * u * x0 + 3 * u * u * t * c1x + 3 * u * t * t * c2x + t * t * t * x, u * u * u * y0 + 3 * u * u * t * c1y + 3 * u * t * t * c2y + t * t * t * y); }
  };
  const sweepOf = (s, e, ccw) => { const d = e - s; if (!ccw) return d >= TAU ? TAU : ((d % TAU) + TAU) % TAU || (d ? TAU : 0); return -d >= TAU ? -TAU : -((((-d) % TAU) + TAU) % TAU || (d ? TAU : 0)); };
  P.arc = function (x, y, r, s, e, ccw = false) {
    if (!on(this) || !m) return o.arc.call(this, x, y, r, s, e, ccw);
    x += jx; y += jy; r = Math.abs(r);
    if (r * sc < 6) { add(x, y, r); o.arc.call(this, x, y, r, s, e, ccw); last = [x + Math.cos(e) * r, y + Math.sin(e) * r]; return; }
    const sw = sweepOf(s, e, ccw), full = Math.abs(sw) >= TAU - 1e-6, n = Math.max(2, Math.ceil(segsFor(r * sc) * Math.abs(sw) / TAU)), w0 = wob();
    for (let i = 0; i <= n; i++) { const a = s + (sw * i) / n, k = full && i === n ? w0 : i === 0 ? w0 : wob(); L(this, x + Math.cos(a) * r * k, y + Math.sin(a) * r * k); }
  };
  P.ellipse = function (x, y, rx, ry, rot, s, e, ccw = false) {
    if (!on(this) || !m) return o.ellipse.call(this, x, y, rx, ry, rot, s, e, ccw);
    x += jx; y += jy; rx = Math.abs(rx); ry = Math.abs(ry);
    if (Math.max(rx, ry) * sc < 6) { add(x, y, Math.max(rx, ry)); return o.ellipse.call(this, x, y, rx, ry, rot, s, e, ccw); }
    const sw = sweepOf(s, e, ccw), full = Math.abs(sw) >= TAU - 1e-6, n = Math.max(2, Math.ceil(segsFor(Math.max(rx, ry) * sc) * Math.abs(sw) / TAU)), cr = Math.cos(rot), sr = Math.sin(rot), w0 = wob();
    for (let i = 0; i <= n; i++) { const a = s + (sw * i) / n, k = full && i === n ? w0 : i === 0 ? w0 : wob(), px = Math.cos(a) * rx * k, py = Math.sin(a) * ry * k; L(this, x + cr * px - sr * py, y + sr * px + cr * py); }
  };
  P.roundRect = function (x, y, w, h, r) {
    if (!on(this) || !m) return o.roundRect.call(this, x, y, w, h, r);
    x += jx; y += jy; if (w < 0) { x += w; w = -w; } if (h < 0) { y += h; h = -h; }
    let rn = Array.isArray(r) ? (typeof r[0] === 'number' ? r[0] : 0) : (r || 0); rn = Math.min(rn, w / 2, h / 2);
    const cs = rn * sc < 3 ? [[x, y, 0, 0]] : [[x + rn, y + rn, Math.PI, 1.5 * Math.PI], [x + w - rn, y + rn, 1.5 * Math.PI, TAU], [x + w - rn, y + h - rn, 0, 0.5 * Math.PI], [x + rn, y + h - rn, 0.5 * Math.PI, Math.PI]];
    start = null;
    if (cs.length === 1) { o.moveTo.call(this, x, y); [[x + w, y], [x + w, y + h], [x, y + h]].forEach(([px, py]) => L(this, px, py)); add(x, y); }
    else { let first = true; for (const [cx, cy, a0, a1] of cs) for (let i = 0; i <= 2; i++) { const a = a0 + ((a1 - a0) * i) / 2, k = i === 1 ? 0.72 : 1, px = cx + Math.cos(a) * rn * k * (i === 1 ? wob() : 1), py = cy + Math.sin(a) * rn * k * (i === 1 ? wob() : 1); if (first) { o.moveTo.call(this, px, py); start = last = [px, py]; add(px, py); first = false; } else L(this, px, py); } }
    o.closePath.call(this); last = start;
  };
  const alphaOf = (s) => { if (typeof s !== 'string') return 1; const r = /rgba\([^)]*,\s*([\d.]+)\s*\)/.exec(s); return r ? +r[1] : 1; };
  P.fill = function (...a) {
    if (!on(this)) return o.fill.apply(this, a);
    const bw = bb[2] - bb[0], bh = bb[3] - bb[1], size = Math.min(bw, bh), solid = alphaOf(this.fillStyle) > 0.7 && this.globalAlpha > 0.5;
    if (!solid || size < 4 || this.globalCompositeOperation !== 'source-over') return o.fill.apply(this, a);
    const k = clamp(size / 70, 0.3, 1);
    this.save();
    if (this.shadowBlur === 0) { this.shadowColor = `rgba(35,22,14,${0.38 * k + 0.1})`; this.shadowBlur = 4 + 9 * k; this.shadowOffsetX = 1.5 + 2.5 * k; this.shadowOffsetY = 2 + 6 * k; }
    o.fill.apply(this, a);
    this.restore();
    if (size > 16) {
      this.save(); this.clip(...a); this.shadowColor = 'transparent';
      if (size > 34 && Math.max(bw, bh) < 1500) { // a fold: one side of the crease turns from the light
        this.setTransform(1, 0, 0, 1, 0, 0);
        const vert = bh > bw * 0.8 ? hash(id * 0.77) < 0.75 : hash(id * 0.77) < 0.25, u = 0.32 + hash(id * 1.31) * 0.36, v = 0.32 + hash(id * 2.17) * 0.36;
        const [x0, y0, x1, y1] = bb, p0 = vert ? [x0 + bw * u, y0 - 2] : [x0 - 2, y0 + bh * u], p1 = vert ? [x0 + bw * v, y1 + 2] : [x1 + 2, y0 + bh * v];
        o.beginPath.call(this); o.moveTo.call(this, p0[0], p0[1]); o.lineTo.call(this, p1[0], p1[1]); vert ? (o.lineTo.call(this, x1 + 2, y1 + 2), o.lineTo.call(this, x1 + 2, y0 - 2)) : (o.lineTo.call(this, x1 + 2, y1 + 2), o.lineTo.call(this, x0 - 2, y1 + 2)); o.closePath.call(this);
        this.fillStyle = 'rgba(30,18,8,0.1)'; o.fill.call(this);
        o.beginPath.call(this); o.moveTo.call(this, p0[0], p0[1]); o.lineTo.call(this, p1[0], p1[1]); this.strokeStyle = 'rgba(255,250,240,0.22)'; this.lineWidth = 1.6; o.stroke.call(this);
        this.setTransform(m);
      }
      this.restore();
      // pale cut edge, inside the outline only (the path is still the shape's)
      this.save(); this.clip(...a); this.shadowColor = 'transparent'; this.lineWidth = 2.6 / sc; this.strokeStyle = 'rgba(255,251,242,0.42)'; o.stroke.call(this); this.restore();
    }
  };
  P.stroke = function (...a) {
    if (!on(this)) return o.stroke.apply(this, a);
    const t = this.getTransform(), s = Math.hypot(t.a, t.b) || 1, w = this.lineWidth * s;
    if (this.shadowBlur > 0 || w < 3 || alphaOf(this.strokeStyle) < 0.7 || this.globalAlpha < 0.5) return o.stroke.apply(this, a);
    const k = clamp(w / 40, 0.3, 1);
    this.save(); this.lineJoin = 'miter'; this.shadowColor = `rgba(35,22,14,${0.34 * k + 0.08})`; this.shadowBlur = 3 + 6 * k; this.shadowOffsetX = 1 + 2 * k; this.shadowOffsetY = 2 + 4 * k; o.stroke.apply(this, a); this.restore();
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
  const wc = document.createElement('canvas'); wc.width = 540; wc.height = 960; const w = wc.getContext('2d'); // crinkles across the sheet
  w.fillStyle = '#808080'; w.fillRect(0, 0, 540, 960);
  for (let k = 0; k < 26; k++) { let x = rnd() * 540, y = rnd() * 960, a = rnd() * 6.28; const pts = [[x, y]]; for (let j = 0; j < 5; j++) { a += (rnd() - 0.5) * 0.9; const l = 30 + rnd() * 90; x += Math.cos(a) * l; y += Math.sin(a) * l; pts.push([x, y]); }
    [[1.2, 'rgba(255,255,255,0.32)', 0], [1.6, 'rgba(0,0,0,0.22)', 1.6]].forEach(([lw, col, off]) => { w.beginPath(); pts.forEach(([px, py], i) => (i ? w.lineTo(px + off, py + off) : w.moveTo(px + off, py + off))); w.strokeStyle = col; w.lineWidth = lw; w.stroke(); }); }
  for (let k = 0; k < 14; k++) { const x = rnd() * 540, y = rnd() * 960, r = 60 + rnd() * 140, g = w.createRadialGradient(x, y, 0, x, y, r), v = rnd() < 0.5 ? 0 : 255; g.addColorStop(0, `rgba(${v},${v},${v},0.08)`); g.addColorStop(1, `rgba(${v},${v},${v},0)`); w.fillStyle = g; w.fillRect(x - r, y - r, r * 2, r * 2); }
  PAPER.wrinkle = wc;
  for (let k = 0; k < 4; k++) { const g = document.createElement('canvas'); g.width = 540; g.height = 960; const gc = g.getContext('2d'), im = gc.createImageData(540, 960); for (let i = 0; i < im.data.length; i += 4) { const v = 128 + (rnd() - 0.5) * 90; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255; } gc.putImageData(im, 0, 0); PAPER.grain.push(g); }
}
// Whole-frame finish: paper fibre (soft-light), warm grade, vignette, grain.
function finishPaper(t) {
  const c = ctx; if (!PAPER.pat) makePaperTextures(c);
  PAPER.on = false; c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.shadowColor = 'transparent'; c.shadowBlur = 0;
  c.globalCompositeOperation = 'soft-light'; c.globalAlpha = 0.7; c.fillStyle = PAPER.pat; c.fillRect(0, 0, W, H); c.globalAlpha = 0.5; c.drawImage(PAPER.wrinkle, 0, 0, W, H);
  c.globalAlpha = 1; c.fillStyle = 'rgba(255,170,90,0.07)'; c.fillRect(0, 0, W, H);
  c.globalCompositeOperation = 'multiply'; const g = c.createRadialGradient(W / 2, H * 0.45, H * 0.32, W / 2, H * 0.45, H * 0.85); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(60,40,25,0.38)'); c.fillStyle = g; c.fillRect(0, 0, W, H);
  c.globalCompositeOperation = 'overlay'; c.globalAlpha = 0.06; c.drawImage(PAPER.grain[Math.floor(t * POSE_FPS + 1e-6) % 4], 0, 0, W, H);
  c.restore(); PAPER.on = true;
}
