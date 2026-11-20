// node motion/shoot.mjs sting 1.0,2.2,... [outdir]   -> stills; or  node motion/shoot.mjs sting all  -> mp4 frames via ffmpeg
import { chromium } from 'playwright';
import path from 'node:path'; import fs from 'node:fs';
const [name, times, out = '/tmp/motion-stills'] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/google-chrome', args: ['--no-sandbox'] });
const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await p.goto('file://' + path.resolve('motion', name + '.html'));
await p.waitForFunction('window.READY');
for (const t of times.split(',')) { await p.evaluate((t) => seek(t), +t); await p.screenshot({ path: path.join(out, `${name}-${(+t).toFixed(2)}.png`) }); }
await b.close();
