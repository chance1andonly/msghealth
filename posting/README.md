# Instagram autopost

Posts the next reel in `queue/` to Instagram 3 times a day as a **trial reel**: it goes to non-followers first, and Instagram moves it to your main page by itself if it performs well. It runs in GitHub Actions (`.github/workflows/instagram-autopost.yml`), so nothing needs to be open on your phone or laptop.

- **When:** the 3 hours in `schedule.json` (Eastern time). Every Monday it re-picks them: it looks at the views of every reel you've posted, groups them by the hour they went up, and keeps the 3 best hours at least 3 hours apart. Until there's enough data it uses 8 AM, 12 PM and 8 PM.
- **What:** files in `queue/` post in name order. Each reel is `NAME.mp4` plus `NAME.txt` with its caption. After posting, both move to `posted/` and the post is added to `log.json`.
- **Your numbers:** `stats.json` (updated Mondays) has views, reach, saves and shares for your top reels and the best posting hours. That's what Claude reads when planning new reels.

## One-time setup (about 20 minutes)

1. **Make a Meta app.** Go to developers.facebook.com → My Apps → Create app. Choose the use case to manage messaging and content on Instagram.
2. **Add your Instagram account.** In the app, open Instagram → API setup with Instagram login. Under "Generate access tokens", tap **Add account** and log in to your professional Instagram account. If it asks for a tester invite, accept it in Instagram: Settings → Website permissions → Apps and websites → Tester invites.
3. **Allow publishing and insights.** Make sure `instagram_business_basic`, `instagram_business_content_publish` and `instagram_business_manage_insights` are on. Then tap **Generate token** and copy it.
4. **Save the token in GitHub.** In this repo: Settings → Secrets and variables → Actions → New repository secret. Name it `IG_TOKEN` and paste the token.
5. **(Optional) Keep the token alive forever.** Tokens last 60 days. The Monday run refreshes it, and to save the new one it needs a GitHub token. Create a fine-grained personal access token for this repo with **Secrets: read and write**, then save it as a secret named `GH_PAT`. Without it, you'll need to repeat steps 3–4 every 60 days.
6. **Test it.** Actions tab → Instagram autopost → Run workflow → `check`. It should print your username. To post the next reel immediately, run it with `post`.

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

### Setup (about 10 minutes, once)

1. **Link a Facebook Page to your Instagram.** Business Discovery needs one. In the Facebook app: your Page → Settings → Linked accounts → Instagram. Any Page you own works, even a bare one.
2. **Get a Page token.**
   - In your Meta app, add the product **Facebook Login for Business**.
   - Open the [Graph API Explorer](https://developers.facebook.com/tools/explorer/) and pick your app.
   - Add the permissions `instagram_basic`, `pages_show_list`, `pages_read_engagement` and `business_management`, then tap **Generate Access Token**.
   - Tap the ⓘ next to the token → **Open in Access Token Tool** → **Extend Access Token**, and copy the long-lived token.
   - Back in the Explorer, paste it and run `me/accounts`. Copy the `access_token` of your Page. A Page token made this way doesn't expire.
3. **Save it in GitHub** as a repository secret named `FB_TOKEN`.
4. **(Optional) YouTube Shorts trends.**
   - In [Google Cloud console](https://console.cloud.google.com/), create a project and enable **YouTube Data API v3**.
   - Go to Credentials → Create credentials → API key.
   - Save the key as a secret named `YOUTUBE_API_KEY`. The free quota (10,000 units a day) is far more than a weekly run uses.
5. **Test it:** Actions → Instagram autopost → Run workflow → `research`.

Edit `watchlist.json` to change who you benchmark against. Only public professional accounts can be read. Personal or private ones are skipped and listed under `errors`.
