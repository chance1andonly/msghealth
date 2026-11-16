// Free niche research for the reels-studio skill: a vidIQ-style outlier and trend report built only from
// official, free APIs. Runs in GitHub Actions every Monday (and on demand); writes posting/research.json.
//
//   node posting/research.mjs
//
// What it finds:
//   1. Outliers: reels from the accounts in watchlist.json that got far more views than that account usually gets
//      (views ÷ the account's median views). That's the signal that a topic or hook worked, not just a big audience.
//   2. Account benchmarks: followers, median views per reel, engagement and how often each account posts.
//   3. Hashtag top posts for the niche tags in watchlist.json.
//   4. New accounts to watch: professional accounts @-mentioned in the outliers' captions.
//   5. YouTube Shorts trends (optional): the most-viewed Shorts of the last 30 days for the niche search terms.
//   6. Your reels against the niche: your median views next to the watchlist's.
//
// Environment:
//   FB_TOKEN         a Facebook Page token for the Page linked to your Instagram (Business Discovery + hashtags). Required.
//   YOUTUBE_API_KEY  a free YouTube Data API key (optional, adds Shorts trends).
//   IG_TOKEN         your Instagram token (optional, adds your own numbers for comparison).
import fs from 'node:fs';
import path from 'node:path';

const FB = process.env.FB_API_BASE || 'https://graph.facebook.com/v23.0';
const IGB = process.env.IG_API_BASE || 'https://graph.facebook.com/v23.0';
const YT = process.env.YT_API_BASE || 'https://www.googleapis.com/youtube/v3';
const DIR = path.dirname(new URL(import.meta.url).pathname);
const OUT = path.join(DIR, 'research.json'), WATCH = path.join(DIR, 'watchlist.json');
const { YOUTUBE_API_KEY, IG_TOKEN } = process.env, FB_TOKEN = process.env.FB_TOKEN || IG_TOKEN;
const say = (...a) => console.log(...a);
const med = (a) => { const s = a.filter((x) => x != null).sort((x, y) => x - y); return s.length ? s[Math.floor((s.length - 1) / 2)] : 0; };
const days = (iso) => (Date.now() - Date.parse(iso)) / 864e5;

async function get(base, p, params, token) {
  const u = new URL(base + p); Object.entries({ ...params, ...(token ? { access_token: token } : {}) }).forEach(([k, v]) => u.searchParams.set(k, v));
  const r = await fetch(u); const j = await r.json().catch(() => ({}));
  if (!r.ok || j.error) throw new Error(j.error?.message || `HTTP ${r.status}`);
  return j;
}

// The Instagram business account behind the Page token.
async function myIgId() {
  const id = JSON.parse(fs.readFileSync(path.join(DIR, 'schedule.json'), 'utf8')).ig_user_id; if (!id) throw new Error('Set "ig_user_id" in posting/schedule.json');
  const j = await get(FB, `/${id}`, { fields: 'id,username' }, FB_TOKEN);
  return { id: j.id, username: j.username };
}

async function account(igId, username) {
  const f = `business_discovery.username(${username}){username,name,followers_count,media_count,biography,media.limit(50){id,caption,media_product_type,media_type,timestamp,like_count,comments_count,view_count,permalink}}`;
  const bd = (await get(FB, `/${igId}`, { fields: f }, FB_TOKEN)).business_discovery;
  const reels = (bd.media?.data || []).filter((m) => m.media_product_type === 'REELS' && days(m.timestamp) <= 120 && days(m.timestamp) >= 1);
  const base = med(reels.map((m) => m.view_count));
  const posts90 = reels.filter((m) => days(m.timestamp) <= 90).length;
  return {
    username: bd.username, name: bd.name, followers: bd.followers_count, bio: bd.biography,
    reels_last_120d: reels.length, posts_per_week: +(posts90 / 13).toFixed(1), median_views: base,
    engagement_rate: +(med(reels.map((m) => ((m.like_count || 0) + (m.comments_count || 0)) / Math.max(1, m.view_count || 1))) * 100).toFixed(2),
    reels: reels.map((m) => ({
      username: bd.username, permalink: m.permalink, posted: m.timestamp.slice(0, 10), age_days: Math.round(days(m.timestamp)),
      views: m.view_count ?? null, likes: m.like_count ?? null, comments: m.comments_count ?? null,
      outlier: base && m.view_count ? +(m.view_count / base).toFixed(1) : null, views_per_follower: bd.followers_count && m.view_count ? +(m.view_count / bd.followers_count).toFixed(2) : null,
      caption: (m.caption || '').replace(/\s+/g, ' ').slice(0, 300),
    })),
  };
}

async function hashtagTop(igId, tag) {
  const h = await get(FB, '/ig_hashtag_search', { user_id: igId, q: tag }, FB_TOKEN);
  const id = h.data?.[0]?.id; if (!id) return [];
  const r = await get(FB, `/${id}/top_media`, { user_id: igId, fields: 'id,caption,media_type,like_count,comments_count,permalink,timestamp', limit: '25' }, FB_TOKEN);
  return (r.data || []).filter((m) => m.media_type === 'VIDEO').map((m) => ({ tag, permalink: m.permalink, likes: m.like_count ?? null, comments: m.comments_count ?? null, posted: m.timestamp?.slice(0, 10), caption: (m.caption || '').replace(/\s+/g, ' ').slice(0, 300) }));
}

async function shorts(term) {
  const after = new Date(Date.now() - 30 * 864e5).toISOString();
  const s = await get(YT, '/search', { part: 'snippet', q: term, type: 'video', videoDuration: 'short', order: 'viewCount', publishedAfter: after, maxResults: '15', relevanceLanguage: 'en', regionCode: 'US', key: YOUTUBE_API_KEY });
  const ids = (s.items || []).map((i) => i.id.videoId).join(','); if (!ids) return [];
  const v = await get(YT, '/videos', { part: 'statistics,snippet,contentDetails', id: ids, key: YOUTUBE_API_KEY });
  return v.items.map((i) => ({ term, title: i.snippet.title, channel: i.snippet.channelTitle, url: `https://youtube.com/shorts/${i.id}`, posted: i.snippet.publishedAt.slice(0, 10), views: +i.statistics.viewCount || 0, likes: +i.statistics.likeCount || 0, comments: +i.statistics.commentCount || 0 }));
}

async function mine() {
  const id = JSON.parse(fs.readFileSync(path.join(DIR, 'schedule.json'), 'utf8')).ig_user_id, m = { user_id: id, username: (await get(IGB, `/${id}`, { fields: 'username' }, IG_TOKEN)).username };
  const media = (await get(IGB, `/${m.user_id}/media`, { fields: 'id,timestamp,media_product_type', limit: '30' }, IG_TOKEN)).data.filter((x) => x.media_product_type === 'REELS' && days(x.timestamp) >= 1);
  const views = [];
  for (const x of media) { const ins = await get(IGB, `/${x.id}/insights`, { metric: 'views' }, IG_TOKEN).catch(() => null); if (ins) views.push(ins.data[0]?.values?.[0]?.value ?? ins.data[0]?.total_value?.value ?? 0); }
  return { username: m.username, reels: views.length, median_views: med(views) };
}

async function main() {
  if (!FB_TOKEN) { console.error('FB_TOKEN is not set. See posting/README.md → Free niche research.'); process.exit(2); }
  const w = JSON.parse(fs.readFileSync(WATCH, 'utf8')), report = { updated: new Date().toISOString(), errors: [] };
  const me = await myIgId(); say(`researching as @${me.username}`);

  const accounts = [];
  for (const u of w.accounts) { try { accounts.push(await account(me.id, u)); say(`  @${u}: ${accounts.at(-1).reels_last_120d} reels, median ${accounts.at(-1).median_views} views`); } catch (e) { report.errors.push(`@${u}: ${e.message}`); say(`  @${u}: skipped (${e.message})`); } }
  const all = accounts.flatMap((a) => a.reels);
  // Outliers: at least 3x the account's usual views, ranked by that multiple, recent first on ties.
  report.outliers = all.filter((r) => r.outlier >= 3).sort((a, b) => b.outlier - a.outlier || a.age_days - b.age_days).slice(0, 30);
  report.most_viewed = all.slice().sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 15);
  report.accounts = accounts.map(({ reels, ...a }) => a).sort((a, b) => b.median_views - a.median_views);

  // Professional accounts mentioned in outlier captions that aren't on the watchlist yet.
  const seen = new Set(w.accounts.map((u) => u.toLowerCase())), cand = new Map();
  report.outliers.forEach((r) => (r.caption.match(/@([a-z0-9._]{2,30})/gi) || []).forEach((h) => { const u = h.slice(1).replace(/\.$/, '').toLowerCase(); if (!seen.has(u)) cand.set(u, (cand.get(u) || 0) + 1); }));
  report.suggested_accounts = [];
  for (const [u] of [...cand].sort((a, b) => b[1] - a[1]).slice(0, 10)) { try { const a = await account(me.id, u); report.suggested_accounts.push({ username: a.username, followers: a.followers, median_views: a.median_views, bio: (a.bio || '').slice(0, 120) }); } catch { /* personal or private account */ } }

  report.hashtags = [];
  for (const t of w.hashtags || []) { try { report.hashtags.push(...(await hashtagTop(me.id, t))); } catch (e) { report.errors.push(`#${t}: ${e.message}`); } }
  report.hashtags.sort((a, b) => (b.likes || 0) + 3 * (b.comments || 0) - ((a.likes || 0) + 3 * (a.comments || 0)));

  if (YOUTUBE_API_KEY) { report.youtube_shorts = []; for (const t of w.youtube_terms || []) { try { report.youtube_shorts.push(...(await shorts(t))); } catch (e) { report.errors.push(`YouTube "${t}": ${e.message}`); } } report.youtube_shorts.sort((a, b) => b.views - a.views); }

  if (IG_TOKEN) { try { const m = await mine(); report.you = { ...m, niche_median_views: med(accounts.map((a) => a.median_views)) }; } catch (e) { report.errors.push(`your account: ${e.message}`); } }

  fs.writeFileSync(OUT, JSON.stringify(report, null, 2) + '\n');
  say(`\n${report.outliers.length} outliers, ${report.hashtags.length} hashtag posts, ${report.suggested_accounts.length} suggested accounts${report.youtube_shorts ? `, ${report.youtube_shorts.length} Shorts` : ''}.`);
  report.outliers.slice(0, 5).forEach((r) => say(`  ${r.outlier}x  @${r.username}  ${r.views} views  ${r.caption.slice(0, 70)}`));
  if (report.errors.length) say('\nskipped:\n  ' + report.errors.join('\n  '));
}
main().catch((e) => { console.error('ERROR', e.message); process.exit(1); });
