# Instagram autopost

Posts the next reel in `queue/` to Instagram 3 times a day as a **trial reel**: it goes to non-followers first, and Instagram moves it to your main page by itself if it performs well. It runs in GitHub Actions (`.github/workflows/instagram-autopost.yml`), so nothing needs to be open on your phone or laptop.

- **When:** the 3 hours in `schedule.json` (Eastern time). Every Monday it re-picks them: it looks at the views of every reel you've posted, groups them by the hour they went up, and keeps the 3 best hours at least 3 hours apart. Until there's enough data it uses 8 AM, 12 PM and 8 PM.
- **What:** files in `queue/` post in name order. Each reel is `NAME.mp4` plus `NAME.txt` with its caption. After posting, both move to `posted/` and the post is added to `log.json`.
- **Your numbers:** `stats.json` (updated Mondays) has views, reach, saves and shares for your top reels and the best posting hours. That's what Claude reads when planning new reels.

## One-time setup (Meta's new "Unified login" flow)

1. **Meta app:** developers.facebook.com → Create app → use case "Manage messaging & content on Instagram", with a business portfolio attached (App settings → Basic).
2. **Instagram tester:** App roles → Roles → Add people → Instagram Tester, then accept the invite in Instagram (Settings → Website permissions → Apps and websites → Tester invites).
3. **Configuration:** Instagram use case → API setup with Unified login → Step 1 → Create configuration. General login, User access token, permissions `instagram_basic`, `instagram_content_publish`, `instagram_manage_insights`, `pages_show_list`, `pages_read_engagement`, `business_management`.
4. **Token:** same page → Generate access tokens → Add account → Generate token (with the configuration selected). Copy it; it's shown once.
5. **Save it in GitHub:** Settings → Secrets and variables → Actions → New repository secret named `IG_TOKEN`.
6. **Your account ID** goes in `schedule.json` as `ig_user_id` (it isn't secret).
7. **Test:** Actions → Instagram autopost → Run workflow → `check`. It should print your username.

Tokens from this flow expire. To renew them automatically, save two more secrets, `FB_APP_ID` and `FB_APP_SECRET` (App settings → Basic), and the Monday run extends the token. To save the new token it also needs `GH_PAT`: a fine-grained GitHub token for this repo with Secrets read/write. Without these, repeat steps 4–5 when `check` starts failing.

## Adding reels

Put `NN-name.mp4` and `NN-name.txt` into `queue/`, commit, and push (or upload them in the GitHub web app). Name them so they sort in the order you want. Instagram's limits: MP4, H.264, AAC audio at 128 kbps or less, 3 s to 15 min. The reels from `scripts/render.mjs` meet them after:

```
ffmpeg -i dist/msghealth-NAME-9x16.mp4 -c:v copy -c:a aac -b:a 128k -movflags +faststart posting/queue/NN-NAME.mp4
```

If the queue runs out, the run at the next posting time fails, and GitHub emails you.

## Changing things

- Different times: edit `slots` in `schedule.json` (24-hour clock). Monday's run will replace them unless you remove the `optimize` line from the workflow.
- Normal reels instead of trials: set `"trial": null`. `"MANUAL"` makes trials that only move to your main page when you choose in the app.

## Free niche research (vidIQ-style, $0)

`research.mjs` runs every Monday after the schedule update (or on demand: Run workflow → `research`) and writes `research.json`, which the reels-studio skill reads first:

- **Outliers:** reels from accounts in `watchlist.json` that got at least 3× that account's usual views. These show which topics and hooks broke out, not just who has a big audience. This is what vidIQ calls outliers.
- **Account benchmarks:** followers, median views per reel, engagement and posts per week.
- **Hashtag top posts** for the niche tags in `watchlist.json`.
- **Suggested accounts:** professional accounts @-mentioned in the outliers, to add to the watchlist.
- **YouTube Shorts trends** (optional): the most-viewed Shorts of the last 30 days for your search terms.
- **You vs the niche:** your median views next to the watchlist's.

It uses only Meta's official API (Business Discovery and hashtag search) and Google's YouTube Data API, both free.

### Setup

It uses the same `IG_TOKEN` and the `ig_user_id` in `schedule.json`; no extra token or Facebook Page is needed. Optional: a free YouTube Data API v3 key (Google Cloud console → Credentials → API key) saved as the secret `YOUTUBE_API_KEY` adds the Shorts trends. Then run Actions → Instagram autopost → Run workflow → `research`.

Edit `watchlist.json` to change who you benchmark against. Only public professional accounts can be read. Personal or private ones are skipped and listed under `errors`.
