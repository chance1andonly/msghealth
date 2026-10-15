// Boot, frame dispatch and the in-browser player for demo.html.
'use strict';

function renderFrame(t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.filter = 'none';
  ctx.fillStyle = C.ink; ctx.fillRect(0, 0, W, H);
  drawFilm(clamp(t, 0, DURATION - 1 / FPS));
}

window.ready = (async () => {
  ctx = document.getElementById('c').getContext('2d');
  const faces = [['400', F.sans], ['500', F.sans], ['600', F.sans], ['700', F.sans], ['800', F.sans], ['900', F.sans],
    ['400', F.mono], ['500', F.mono], ['700', F.mono]].map(([w, f]) => document.fonts.load(`${w} 40px "${f}"`));
  faces.push(document.fonts.load(`italic 400 40px "${F.serif}"`));
  await Promise.all(faces);
  const img = await new Promise((res) => { const im = new Image(); im.onload = () => res(im); im.onerror = () => res(null); im.src = BRAND.logoFile; });
  if (img) makeLogos(img);
  makeGrain();
  if (location.search.includes('render')) document.body.classList.add('render');
  renderFrame(0);
  return true;
})();
window.renderFrame = renderFrame;
window.FPS = FPS;

// ── player ───────────────────────────────────────────────────────────────────
(() => {
  const btn = document.getElementById('play'), seek = document.getElementById('seek'), tm = document.getElementById('time');
  let playing = false, t0 = 0, start = 0, cur = 0;
  const show = (t) => { cur = t; renderFrame(t); seek.value = (t / DURATION) * 1000; tm.textContent = `${t.toFixed(1)}s / ${DURATION}s`; };
  const loop = (now) => {
    if (!playing) return;
    let t = t0 + (now - start) / 1000;
    if (t >= DURATION) { t = DURATION; playing = false; btn.textContent = 'Replay'; }
    show(Math.floor(t * FPS) / FPS);
    if (playing) requestAnimationFrame(loop);
  };
  btn.onclick = () => {
    if (playing) { playing = false; btn.textContent = 'Play'; return; }
    if (cur >= DURATION) cur = 0;
    playing = true; t0 = cur; start = performance.now(); btn.textContent = 'Pause'; requestAnimationFrame(loop);
  };
  seek.oninput = () => { playing = false; btn.textContent = 'Play'; show((seek.value / 1000) * DURATION); };
  window.ready.then(() => { const q = new URLSearchParams(location.search).get('t'); if (q) show(+q); });
})();
