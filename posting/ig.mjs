// Instagram auto-poster for MsgHealth reels. Runs in GitHub Actions (.github/workflows/instagram-autopost.yml).
// Uses the official Instagram API with Instagram Login (graph.instagram.com). No dependencies: Node 20+.
//
//   node posting/ig.mjs check            test the token and show the account and its publishing limit
//   node posting/ig.mjs post [--force]   post the next reel in posting/queue if a time slot is due (--force: post now)
//   node posting/ig.mjs next              show queue order and how fresh each approval is
//   node posting/ig.mjs prioritize A B    put the reels the validator chose first (posting/order.json)
//   node posting/ig.mjs approve NAME    mark a queued reel as reviewed (required before it can post)
//   node posting/ig.mjs optimize         pick the 3 best posting hours from your own reels' views; writes schedule.json + stats.json
//   node posting/ig.mjs refresh          refresh the 60-day token; writes the new one to $NEW_TOKEN_FILE
//
// Environment: IG_TOKEN (required), DRY_RUN=1 (log what would happen, change nothing).
// Queue: posting/queue/NAME.mp4 + NAME.txt (the caption). Files post in name order, then move to posting/posted/.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

// New Meta apps get 'Unified login' tokens, which work on graph.facebook.com (not graph.instagram.com).
const API = process.env.IG_API_BASE || 'https://graph.facebook.com/v23.0'; // IG_API_BASE: only for local tests
const DIR = path.dirname(new URL(import.meta.url).pathname);
const QUEUE = path.join(DIR, 'queue'), POSTED = path.join(DIR, 'posted');
const SCHEDULE = path.join(DIR, 'schedule.json'), LOG = path.join(DIR, 'log.json'), STATS = path.join(DIR, 'stats.json'), QA = path.join(DIR, 'qa.json');
const TOKEN = process.env.IG_TOKEN, DRY = process.env.DRY_RUN === '1';
const readJson = (f, d) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return d; } };
const writeJson = (f, o) => fs.writeFileSync(f, JSON.stringify(o, null, 2) + '\n');
// Review gate: a reel posts only if posting/qa.json holds an approval whose sha1 matches the file, so an edited or unreviewed reel never goes out.
const sha1 = (f) => crypto.createHash('sha1').update(fs.readFileSync(f)).digest('hex');
const approved = (name) => { const a = readJson(QA, {})[name]; return !!a && a.approved === true && a.sha1 === sha1(path.join(QUEUE, name)); };
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
  // Which permissions this token really carries, and whether one insights call works (shows why views are unavailable).
  const perms = await api('GET', '/me/permissions').then((r) => (r.data || []).map((x) => `${x.permission}:${x.status}`).join(', ')).catch((e) => 'unreadable (' + e.message.replace(/^GET [^:]+: /, '') + ')');
  say('token permissions:', perms);
  const last = await api('GET', `/${m.user_id}/media`, { fields: 'id,media_product_type', limit: 5 }).then((r) => (r.data || []).find((x) => x.media_product_type === 'REELS') || r.data?.[0]).catch(() => null);
  if (last) for (const metric of ['reach', 'views', 'saved']) { const r = await api('GET', `/${last.id}/insights`, { metric }).then((x) => 'ok ' + JSON.stringify(x.data?.[0]?.values?.[0]?.value)).catch((e) => 'FAILED ' + e.message.replace(/^GET [^:]+: /, '')); say(`insights test (${metric}):`, r); }
  { const q = fs.readdirSync(QUEUE).filter((f) => f.endsWith('.mp4')); say('queue:', q.length, 'reels waiting,', q.filter(approved).length, 'approved'); }
}

// Upload one reel: resumable upload of the file's bytes; if that host refuses, fall back to a public URL of the file.
// Cover image: posting/covers/NAME.jpg (made by scripts/make-covers.sh from the frame where the hook is readable), served from the repo.
// Without one, Instagram uses frame 0, which is nearly blank on every reel, so fall back to a frame 2.6s in.
let skipCover = false;
async function publish(uid, file, caption, trial) {
  try { return await publish0(uid, file, caption, trial); }
  catch (e) { if (!skipCover && /cover|thumb/i.test(e.message)) { skipCover = true; say('cover image was refused, retrying with a frame offset instead:', e.message); return publish0(uid, file, caption, trial); } throw e; }
}
async function publish0(uid, file, caption, trial) {
  const base = { media_type: 'REELS', caption, share_to_feed: 'true' };
  const cov = path.join(DIR, 'covers', path.basename(file, '.mp4') + '.jpg');
  const covUrl = `${process.env.PUBLIC_BASE_URL}/posting/covers/${path.basename(cov)}`;
  const covOk = !skipCover && process.env.PUBLIC_BASE_URL && fs.existsSync(cov) && await fetch(covUrl, { method: 'HEAD' }).then((r) => r.ok).catch(() => false); // only if the cover is already published in the repo
  if (covOk) base.cover_url = covUrl; else base.thumb_offset = '2600';
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

// node posting/ig.mjs approve NAME [note ...]: record that a reel passed review (stores the file's sha1)

// Next-reel choice. posting/order.json ({"order":["NAME.mp4",...]}) lets the validator put the best reel first; otherwise name order.
// A reel counts as FRESH when its approval (a review against the latest analytics) is at most FRESH_HOURS old; the poster prefers fresh reels
// and only falls back to a stale approved one (with a warning) so the channel never goes silent. Optional posting/queue/NAME.meta.json
// {"expires":"YYYY-MM-DD"} (the day AFTER the last day it may post) moves a time-sensitive reel to posting/held/ from that date on. {"not_before":"YYYY-MM-DD"} keeps a
// holiday reel in the queue, unposted, until that date in the schedule's time zone.
const FRESH_HOURS = +(process.env.FRESH_HOURS || 4);
const ORDER = path.join(DIR, 'order.json');
function ageHours(f) { const q = readJson(QA, {})[f]; return q && q.checked_at ? (Date.now() - Date.parse(q.checked_at)) / 3600000 : 1e9; }
const today = () => new Intl.DateTimeFormat('en-CA', { timeZone: readJson(SCHEDULE, {}).timezone || 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()); // YYYY-MM-DD in the schedule's time zone
function expired(f) { const m = path.join(QUEUE, f.replace(/\.mp4$/, '.meta.json')); const j = fs.existsSync(m) ? readJson(m, {}) : {}; return Boolean(j.expires) && today() >= j.expires; }
function early(f) { const m = path.join(QUEUE, f.replace(/\.mp4$/, '.meta.json')); const j = fs.existsSync(m) ? readJson(m, {}) : {}; return Boolean(j.not_before) && today() < j.not_before; }
function ordered(all) { const o = (readJson(ORDER, {}).order || []).filter((f) => all.includes(f)); return o.concat(all.filter((f) => !o.includes(f))); }
function pick(all) {
  const gone = all.filter(expired); // decided once: moving a reel also moves its meta file, so expired() would then say false
  gone.forEach((f) => { const H = path.join(DIR, 'held'); fs.mkdirSync(H, { recursive: true }); for (const e of ['.mp4', '.txt', '.meta.json']) { const a = path.join(QUEUE, f.replace(/\.mp4$/, e)); if (fs.existsSync(a)) fs.renameSync(a, path.join(H, path.basename(a))); } say(`expired, moved to held: ${f}`); });
  const live = ordered(all.filter((f) => !gone.includes(f) && !early(f))).filter(approved);
  const fresh = live.find((f) => ageHours(f) <= FRESH_HOURS);
  if (fresh) return fresh;
  if (live[0]) say(`WARNING: no reel was validated in the last ${FRESH_HOURS}h; posting ${live[0]} on its older approval (${ageHours(live[0]).toFixed(1)}h old)`);
  return live[0];
}
function nextCmd() { // shows what would post next and how fresh each approval is
  const all = fs.readdirSync(QUEUE).filter((f) => f.endsWith('.mp4')).sort(); const o = ordered(all);
  say('queue order (first posts next):'); o.forEach((f, i) => say(`${i + 1}. ${f}  ${approved(f) ? 'approved ' + ageHours(f).toFixed(1) + 'h ago' + (ageHours(f) <= FRESH_HOURS ? ' (fresh)' : ' (stale: re-validate)') : 'NOT approved'}${expired(f) ? '  EXPIRED' : ''}${early(f) ? '  WAITING (not_before)' : ''}`));
  const n = pick(all.slice()); say('next to post:', n || 'none');
}
function prioritize(first, more) { const names = [first, ...more].map((n) => (n.endsWith('.mp4') ? n : n + '.mp4')); for (const n of names) if (!fs.existsSync(path.join(QUEUE, n))) throw new Error('not in queue: ' + n); writeJson(ORDER, { order: names, set_at: new Date().toISOString() }); say('order set; posts first:', names.join(', ')); }
async function approve(name, note) {
  const f = path.join(QUEUE, name.endsWith('.mp4') ? name : name + '.mp4'); if (!fs.existsSync(f)) throw new Error('no such reel in the queue: ' + name);
  const cov = path.join(DIR, 'covers', path.basename(f, '.mp4') + '.jpg');
  if (!fs.existsSync(cov)) { try { execFileSync('bash', [path.join(DIR, '..', 'scripts', 'make-covers.sh'), path.basename(f, '.mp4')], { stdio: 'inherit' }); } catch (e) { say('could not make a cover (posts will use a frame offset):', e.message); } }
  const qa = readJson(QA, {}); qa[path.basename(f)] = { approved: true, sha1: sha1(f), checked_at: new Date().toISOString(), note: note || '' }; writeJson(QA, qa); say('approved', path.basename(f));
}
async function post(force) {
  const sch = readJson(SCHEDULE, {}), tz = sch.timezone || 'America/New_York', slots = (sch.slots || [8, 12, 20]).slice().sort((a, b) => a - b);
  const log = readJson(LOG, []), now = localNow(tz);
  // The slot that is due: the latest slot hour at or before now, not posted yet today, at most 2 hours late (cron can run late).
  const due = slots.filter((h) => h <= now.hour && now.hour - h < 2 && !log.some((l) => l.date === now.date && l.slot === h)).pop();
  if (due == null && !force) return say(`nothing due (${now.date} ${now.hour}:00 ${tz}; slots ${slots.join(', ')})`);
  const all = fs.readdirSync(QUEUE).filter((f) => f.endsWith('.mp4')).sort();
  if (!all.length) { say('QUEUE EMPTY: add reels to posting/queue'); process.exitCode = 3; return; }
  const held = all.filter((f) => !approved(f)); if (held.length) say(`held back, not reviewed yet: ${held.join(', ')}`);
  const next = pick(all);
  if (!next) { say('NOTHING APPROVED: every queued reel still needs its review (node posting/ig.mjs approve NAME)'); process.exitCode = 3; return; }
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
  log.push({ date: now.date, slot: due ?? null, hour: now.hour, file: next, media_id: id, trial, per_day: sch.per_day || slots.length, posted_at: new Date().toISOString() }); writeJson(LOG, log);
  say('published, media id', id);
}

async function optimize() {
  const sch = readJson(SCHEDULE, {}), tz = sch.timezone || 'America/New_York', { user_id: uid } = await me(), log = readJson(LOG, []);
  let media = [], next = `/${uid}/media`, params = { fields: 'id,timestamp,media_type,media_product_type,permalink,caption,like_count,comments_count', limit: '50' };
  while (next && media.length < 200) { const r = await api('GET', next, params); media.push(...(r.data || [])); next = r.paging?.next; params = {}; }
  const reels = media.filter((m) => m.media_product_type === 'REELS' && Date.now() - Date.parse(m.timestamp) > 2 * 864e5); // ignore reels under 2 days old
  const rows = []; let insErr = '', insOk = 0;
  for (const m of reels) {
    const ins = await api('GET', `/${m.id}/insights`, { metric: 'views,reach,saved,shares' }).catch((e) => { insErr ||= e.message; return null; });
    const v = ins ? Object.fromEntries(ins.data.map((d) => [d.name, d.values?.[0]?.value ?? d.total_value?.value ?? 0])) : {};
    if (ins) insOk++;
    rows.push({ id: m.id, permalink: m.permalink, hour: hourIn(m.timestamp, tz), posted: m.timestamp, views: v.views ?? null, reach: v.reach ?? null, saved: v.saved ?? null, shares: v.shares ?? null, likes: m.like_count || 0, comments: m.comments_count || 0, caption: (m.caption || '').slice(0, 80) });
  }
  // Score = views when Instagram shares insights with this token, otherwise likes + 2 x comments (always available).
  const metric = insOk ? 'views' : 'engagement';
  rows.forEach((r) => { r.score = metric === 'views' ? r.views || 0 : r.likes + 2 * r.comments; });
  say(`found ${media.length} posts, ${reels.length} reels old enough, ${insOk} with insights${insErr ? '; insights unavailable (' + insErr.replace(/^GET [^:]+: /, '') + '), scoring by likes + 2 x comments' : ''}`);
  const med = (a) => { const s = a.slice().sort((x, y) => x - y); return s.length ? s[Math.floor((s.length - 1) / 2)] : 0; };
  const byHour = {}; rows.forEach((r) => (byHour[r.hour] ||= []).push(r.score));
  const ranked = Object.entries(byHour).filter(([h, v]) => v.length >= 2 && h >= 6).map(([h, v]) => ({ hour: +h, reels: v.length, median_score: med(v) })).sort((a, b) => b.median_score - a.median_score);

  // How many posts a day? Hill-climb between 3 and 10 on total score per day (posts per day x median score per reel), using only
  // reels this autoposter posted, grouped by the per_day setting in force when they went out. Old log entries count as 3 a day.
  const posted = new Map(log.map((l) => [l.media_id, l.per_day || 3]));
  const groups = {}; rows.forEach((r) => { const d = posted.get(r.id); if (d) (groups[d] ||= []).push(r.score); });
  const cur = Math.min(10, Math.max(3, sch.per_day || 3)), MIN = 4, tested = Object.keys(groups).map(Number).filter((d) => groups[d].length >= MIN).sort((a, b) => a - b);
  const total = (d) => d * med(groups[d]), lower = tested.filter((d) => d < cur).pop();
  let perDay = cur, why = 'holding: not enough reels at this rate yet (need ' + MIN + ', have ' + (groups[cur]?.length || 0) + ')';
  if (tested.includes(cur)) {
    if (lower != null && (total(cur) < 0.9 * total(lower) || med(groups[cur]) < 0.5 * med(groups[lower]))) { perDay = lower; why = `back to ${lower} a day: ${cur} a day scored ${total(cur)} vs ${total(lower)} a day at ${lower}`; }
    else if (cur < 10) { perDay = Math.min(10, cur + (lower == null ? 2 : 1)); why = `trying ${perDay} a day: ${cur} a day is holding up (median ${med(groups[cur])} per reel)`; }
    else why = 'holding at 10 a day (the maximum)';
  }
  say('posts per day:', why);

  const n = perDay, gap = n > 4 ? 1 : 3;
  const defaults = n === 3 ? [8, 12, 20] : n === 10 ? [7, 9, 11, 12, 13, 15, 17, 19, 20, 21] : Array.from({ length: n }, (_, i) => Math.round(8 + (i * 12) / (n - 1)));
  // Only trust an hour that has at least 4 reels and beats the overall median; otherwise it is noise and the spread-out defaults fill in.
  const overall = med(rows.map((r) => r.score));
  const pick = []; for (const r of ranked) if (pick.length < n && r.reels >= 4 && r.median_score > overall && r.hour >= 7 && r.hour <= 21 && pick.every((h) => Math.abs(h - r.hour) >= gap)) pick.push(r.hour);
  for (const h of defaults) if (pick.length < n && !pick.includes(h) && pick.every((p) => Math.abs(p - h) >= 1)) pick.push(h);
  const slots = pick.sort((a, b) => a - b);
  writeJson(STATS, { updated: new Date().toISOString(), timezone: tz, metric, reels_analyzed: rows.length, by_hour: ranked, per_day_scores: Object.fromEntries(Object.entries(groups).map(([d, v]) => [d, { reels: v.length, median_score: med(v) }])), per_day_decision: why, top_reels: rows.slice().sort((a, b) => b.score - a.score).slice(0, 15) });
  say(`best hours by ${metric}: ${ranked.slice(0, 5).map((r) => `${r.hour}:00 (${r.median_score}, ${r.reels} reels)`).join(', ') || 'not enough data yet'}`);
  if (DRY) return say('DRY_RUN: would set per_day', perDay, 'slots', slots);
  writeJson(SCHEDULE, { ...sch, timezone: tz, per_day: perDay, slots, slots_updated: new Date().toISOString(), basis: ranked.length ? `median ${metric} of your own reels by posting hour` : 'defaults spread over the day (not enough data yet)' });
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

const [cmd, flag, ...rest] = process.argv.slice(2);
if (!TOKEN && !(cmd === 'post' && DRY) && !['approve', 'next', 'prioritize'].includes(cmd)) { console.error('IG_TOKEN is not set. Add it under Settings → Secrets and variables → Actions.'); process.exit(2); }
({ check, post: () => post(flag === '--force'), approve: () => approve(flag, rest.join(' ')), next: async () => nextCmd(), prioritize: async () => prioritize(flag, rest), optimize, refresh }[cmd] || (() => { console.error('usage: node posting/ig.mjs check|post [--force]|optimize|refresh'); process.exit(2); }))()
  .catch((e) => { console.error('ERROR', e.message, e.data ? JSON.stringify(e.data) : ''); process.exit(1); });
