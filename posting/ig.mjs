// Instagram auto-poster for MsgHealth reels. Runs in GitHub Actions (.github/workflows/instagram-autopost.yml).
// Uses the official Instagram API with Instagram Login (graph.instagram.com). No dependencies: Node 20+.
//
//   node posting/ig.mjs check            test the token and show the account and its publishing limit
//   node posting/ig.mjs post [--force]   post the next reel in posting/queue if a time slot is due (--force: post now)
//   node posting/ig.mjs optimize         pick the 3 best posting hours from your own reels' views; writes schedule.json + stats.json
//   node posting/ig.mjs refresh          refresh the 60-day token; writes the new one to $NEW_TOKEN_FILE
//
// Environment: IG_TOKEN (required), DRY_RUN=1 (log what would happen, change nothing).
// Queue: posting/queue/NAME.mp4 + NAME.txt (the caption). Files post in name order, then move to posting/posted/.
import fs from 'node:fs';
import path from 'node:path';

// New Meta apps get 'Unified login' tokens, which work on graph.facebook.com (not graph.instagram.com).
const API = process.env.IG_API_BASE || 'https://graph.facebook.com/v23.0'; // IG_API_BASE: only for local tests
const DIR = path.dirname(new URL(import.meta.url).pathname);
const QUEUE = path.join(DIR, 'queue'), POSTED = path.join(DIR, 'posted');
const SCHEDULE = path.join(DIR, 'schedule.json'), LOG = path.join(DIR, 'log.json'), STATS = path.join(DIR, 'stats.json');
const TOKEN = process.env.IG_TOKEN, DRY = process.env.DRY_RUN === '1';
const readJson = (f, d) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return d; } };
const writeJson = (f, o) => fs.writeFileSync(f, JSON.stringify(o, null, 2) + '\n');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const say = (...a) => console.log(new Date().toISOString().slice(11, 19), ...a);

async function api(method, p, params = {}) {
  const url = new URL(p.startsWith('http') ? p : API + p);
  const body = new URLSearchParams({ ...params, access_token: TOKEN });
  const res = method === 'GET' ? await fetch(url + (url.search ? '&' : '?') + body) : await fetch(url, { method, body });
  const j = await res.json().catch(() => ({}));
  if (!res.ok || j.error) { const e = new Error(`${method} ${url.pathname}: ${j.error?.message || res.status}`); e.data = j.error; throw e; }
  return j;
}

// Local date and hour in the schedule's time zone.
function localNow(tz) {
  const f = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hourCycle: 'h23' }).formatToParts(new Date()).map((p) => [p.type, p.value]));
  return { date: `${f.year}-${f.month}-${f.day}`, hour: +f.hour };
}
const hourIn = (iso, tz) => +new Intl.DateTimeFormat('en-US', { timeZone: tz, hour: '2-digit', hourCycle: 'h23' }).format(new Date(iso));

// The Instagram account is named by its ID in schedule.json (ig_user_id); the ID is not secret.
const igId = () => { const id = readJson(SCHEDULE, {}).ig_user_id; if (!id) throw new Error('Set "ig_user_id" in posting/schedule.json'); return String(id); };
async function me() { const id = igId(), r = await api('GET', `/${id}`, { fields: 'id,username' }); return { user_id: r.id, username: r.username, account_type: 'professional' }; }

async function check() {
  const m = await me(); say(`connected as @${m.username} (${m.account_type}), id ${m.user_id}`);
  const lim = await api('GET', `/${m.user_id}/content_publishing_limit`, { fields: 'quota_usage,config' }).catch((e) => ({ error: e.message }));
  say('publishing limit:', JSON.stringify(lim.data?.[0] || lim));
  say('queue:', fs.readdirSync(QUEUE).filter((f) => f.endsWith('.mp4')).length, 'reels waiting');
}

// Upload one reel: resumable upload of the file's bytes; if that host refuses, fall back to a public URL of the file.
async function publish(uid, file, caption, trial) {
  const base = { media_type: 'REELS', caption, share_to_feed: 'true' };
  if (trial) base.trial_params = JSON.stringify({ graduation_strategy: trial });
  let c;
  try {
    c = await api('POST', `/${uid}/media`, { ...base, upload_type: 'resumable' });
    const bytes = fs.readFileSync(file), uri = c.uri || `https://rupload.facebook.com/ig-api-upload/v23.0/${c.id}`;
    const r = await fetch(uri, { method: 'POST', headers: { Authorization: `OAuth ${TOKEN}`, offset: '0', file_size: String(bytes.length) }, body: bytes });
    const j = await r.json().catch(() => ({})); if (!r.ok || j.success === false) throw new Error('upload: ' + JSON.stringify(j));
    say('uploaded', (bytes.length / 1e6).toFixed(1), 'MB');
  } catch (e) {
    const pub = process.env.PUBLIC_BASE_URL; if (!pub) throw e;
    say('resumable upload failed, using the public file URL instead:', e.message);
    c = await api('POST', `/${uid}/media`, { ...base, video_url: `${pub}/${path.relative(path.dirname(DIR), file).split(path.sep).join('/')}` });
  }
  for (let i = 0; i < 60; i++) { // up to 10 minutes of processing
    const s = await api('GET', `/${c.id}`, { fields: 'status_code,status' }); say('processing:', s.status_code);
    if (s.status_code === 'FINISHED') break;
    if (s.status_code === 'ERROR' || s.status_code === 'EXPIRED') throw new Error('Instagram could not process the video: ' + (s.status || s.status_code));
    await sleep(10000);
  }
  return (await api('POST', `/${uid}/media_publish`, { creation_id: c.id })).id;
}

async function post(force) {
  const sch = readJson(SCHEDULE, {}), tz = sch.timezone || 'America/New_York', slots = (sch.slots || [8, 12, 20]).slice().sort((a, b) => a - b);
  const log = readJson(LOG, []), now = localNow(tz);
  // The slot that is due: the latest slot hour at or before now, not posted yet today, at most 2 hours late (cron can run late).
  const due = slots.filter((h) => h <= now.hour && now.hour - h < 2 && !log.some((l) => l.date === now.date && l.slot === h)).pop();
  if (due == null && !force) return say(`nothing due (${now.date} ${now.hour}:00 ${tz}; slots ${slots.join(', ')})`);
  const next = fs.readdirSync(QUEUE).filter((f) => f.endsWith('.mp4')).sort()[0];
  if (!next) { say('QUEUE EMPTY: add reels to posting/queue'); process.exitCode = 3; return; }
  const file = path.join(QUEUE, next), capFile = file.replace(/\.mp4$/, '.txt');
  const caption = fs.existsSync(capFile) ? fs.readFileSync(capFile, 'utf8').trim() : '';
  say(`posting ${next} for the ${due ?? 'manual'} slot as ${sch.trial ? 'a trial reel (' + sch.trial + ')' : 'a reel'}`);
  if (DRY) return say('DRY_RUN: stopping before upload. Caption:\n' + caption);
  const { user_id: uid } = await me(); let id, trial = sch.trial || null;
  try { id = await publish(uid, file, caption, trial); }
  catch (e) {
    if (!trial || !/trial/i.test(e.message + JSON.stringify(e.data || {}))) throw e;
    say('Instagram refused the trial setting, posting as a normal reel:', e.message); trial = null; id = await publish(uid, file, caption, null);
  }
  fs.mkdirSync(POSTED, { recursive: true }); fs.renameSync(file, path.join(POSTED, next)); if (fs.existsSync(capFile)) fs.renameSync(capFile, path.join(POSTED, path.basename(capFile)));
  log.push({ date: now.date, slot: due ?? null, hour: now.hour, file: next, media_id: id, trial, posted_at: new Date().toISOString() }); writeJson(LOG, log);
  say('published, media id', id);
}

async function optimize() {
  const sch = readJson(SCHEDULE, {}), tz = sch.timezone || 'America/New_York', { user_id: uid } = await me();
  let media = [], next = `/${uid}/media`, params = { fields: 'id,timestamp,media_type,media_product_type,permalink,caption', limit: '50' };
  while (next && media.length < 200) { const r = await api('GET', next, params); media.push(...(r.data || [])); next = r.paging?.next; params = {}; }
  const reels = media.filter((m) => m.media_product_type === 'REELS' && Date.now() - Date.parse(m.timestamp) > 2 * 864e5); // ignore reels under 2 days old
  const rows = [];
  for (const m of reels) {
    const ins = await api('GET', `/${m.id}/insights`, { metric: 'views,reach,saved,shares' }).catch(() => null); if (!ins) continue;
    const v = Object.fromEntries(ins.data.map((d) => [d.name, d.values?.[0]?.value ?? d.total_value?.value ?? 0]));
    rows.push({ id: m.id, permalink: m.permalink, hour: hourIn(m.timestamp, tz), posted: m.timestamp, views: v.views || 0, reach: v.reach || 0, saved: v.saved || 0, shares: v.shares || 0, caption: (m.caption || '').slice(0, 80) });
  }
  const med = (a) => { const s = a.slice().sort((x, y) => x - y); return s.length ? s[Math.floor((s.length - 1) / 2)] : 0; };
  const byHour = {}; rows.forEach((r) => (byHour[r.hour] ||= []).push(r.views));
  const ranked = Object.entries(byHour).filter(([h, v]) => v.length >= 2 && h >= 6).map(([h, v]) => ({ hour: +h, reels: v.length, median_views: med(v) })).sort((a, b) => b.median_views - a.median_views);
  // Take the best hours (7am-9pm only), spaced apart, up to per_day; fill any gap with evenly spread default hours.
  const n = sch.per_day || (sch.slots || []).length || 3, gap = n > 4 ? 1 : 3;
  const defaults = n === 10 ? [7, 9, 11, 12, 13, 15, 17, 19, 20, 21] : Array.from({ length: n }, (_, i) => Math.round(7 + (i * 14) / Math.max(1, n - 1)));
  const pick = []; for (const r of ranked) if (pick.length < n && r.hour >= 7 && r.hour <= 21 && pick.every((h) => Math.abs(h - r.hour) >= gap)) pick.push(r.hour);
  for (const h of defaults) if (pick.length < n && !pick.includes(h) && pick.every((p) => Math.abs(p - h) >= Math.min(gap, 1))) pick.push(h);
  const slots = pick.sort((a, b) => a - b);
  writeJson(STATS, { updated: new Date().toISOString(), timezone: tz, reels_analyzed: rows.length, by_hour: ranked, top_reels: rows.sort((a, b) => b.views - a.views).slice(0, 15) });
  say(`analyzed ${rows.length} reels; best hours: ${ranked.slice(0, 5).map((r) => `${r.hour}:00 (${r.median_views} views, ${r.reels} reels)`).join(', ') || 'not enough data yet'}`);
  if (DRY) return say('DRY_RUN: would set slots', slots);
  writeJson(SCHEDULE, { ...sch, timezone: tz, slots, slots_updated: new Date().toISOString(), basis: ranked.length ? 'median views of your own reels by posting hour' : 'defaults (not enough data yet)' });
  say('posting slots now', slots.map((h) => `${h}:00`).join(', '), tz);
}

async function refresh() {
  const { FB_APP_ID: id, FB_APP_SECRET: secret } = process.env;
  if (!id || !secret) { say('token refresh skipped: add FB_APP_ID and FB_APP_SECRET secrets to enable it (see posting/README.md)'); return; }
  const r = await api('GET', '/oauth/access_token', { grant_type: 'fb_exchange_token', client_id: id, client_secret: secret, fb_exchange_token: TOKEN });
  if (!r.access_token) throw new Error('token refresh failed');
  say(`token extended, valid for about ${Math.round((r.expires_in || 5184000) / 86400)} days`);
  if (process.env.NEW_TOKEN_FILE) fs.writeFileSync(process.env.NEW_TOKEN_FILE, r.access_token);
}

const [cmd, flag] = process.argv.slice(2);
if (!TOKEN && !(cmd === 'post' && DRY)) { console.error('IG_TOKEN is not set. Add it under Settings → Secrets and variables → Actions.'); process.exit(2); }
({ check, post: () => post(flag === '--force'), optimize, refresh }[cmd] || (() => { console.error('usage: node posting/ig.mjs check|post [--force]|optimize|refresh'); process.exit(2); }))()
  .catch((e) => { console.error('ERROR', e.message, e.data ? JSON.stringify(e.data) : ''); process.exit(1); });
