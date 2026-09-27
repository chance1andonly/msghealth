// Shared helpers: tiny static server + headless browser pointed at the film.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.woff2': 'font/woff2', '.png': 'image/png', '.css': 'text/css' };

export function serve() {
  return new Promise((resolve) => {
    const srv = http.createServer((req, res) => {
      const p = path.join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname));
      if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
      res.writeHead(200, { 'content-type': TYPES[path.extname(p)] ?? 'application/octet-stream' });
      fs.createReadStream(p).pipe(res);
    });
    srv.listen(0, '127.0.0.1', () => resolve(srv));
  });
}

export async function openFilm(entry = process.env.ENTRY || 'index.html') {
  const srv = await serve();
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || undefined,
    args: ['--disable-gpu-vsync', '--force-color-profile=srgb'],
  });
  const vertical = /ad\.html$/.test(entry);
  const page = await browser.newPage({ viewport: vertical ? { width: 1080, height: 1920 } : { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  page.on('pageerror', (e) => console.error('page error:', e.message));
  await page.goto(`http://127.0.0.1:${srv.address().port}/${entry}?render`);
  await page.evaluate(() => window.ready);
  const duration = await page.evaluate(() => DURATION);
  // Render a frame and return it as an encoded image buffer.
  const frame = async (t, type = 'image/jpeg', q = 0.95) => {
    const b64 = await page.evaluate(([t, type, q]) => { window.renderFrame(t); return document.getElementById('c').toDataURL(type, q).split(',')[1]; }, [t, type, q]);
    return Buffer.from(b64, 'base64');
  };
  const close = async () => { await browser.close(); srv.close(); };
  return { page, frame, duration, close };
}
