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
