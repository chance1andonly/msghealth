# MsgHealth — Paper Cut-Out Product Film

A 94-second animated product demo for **MsgHealth** (msghealth.net), done in a stop-motion
cut-paper style. It's built as code: every character, set, prop and UI screen is drawn
procedurally on an HTML canvas as layered pieces of coloured card, with paper-fibre texture,
pale cut edges, tight layered shadows and hand-placed "boil" jitter (animated on twos at 12 poses/sec),
plus depth of field, film grain and a colour grade. There are no captions: the story is told visually.

- **Final video:** `dist/msghealth-demo.mp4` (1920×1080, 24 fps, H.264 + AAC)
- **Interactive player:** open `index.html` through any static server (e.g. `npx serve .`) to play and scrub

## Story & shot list

| Time | Beat | What the viewer sees |
|---|---|---|
| 0–6s | Meet Sam | Push-in on *Sam's Studio* at sunrise. Sam is cutting hair in the window. |
| 6–16s | The hustle | Cutting hair, walking to the desk, answering messages, a client paying by card, the wall of regulars. |
| 16–19.5s | A regular doesn't rebook | Monthly calendars: Jordan · 10:00 in Jan, Feb, Mar. April is empty. |
| 19.5–23s | Another stops replying | A text to Priya shows "Delivered", typing dots appear and vanish, then "3 days later…". |
| 23–26.4s | One goes elsewhere | Through the window, Morgan walks into the NEW SALON across the street. |
| 26.4–32.4s | No warning | Photos fall off the Regulars board. Sam holds a falling revenue chart, confused. The light cools and dims. |
| 32.4–36.6s | MsgHealth arrives | The tablet glows, the MsgHealth logo presses in, and the camera pushes into the screen. |
| 36.6–45s | Health scoring + churn risk | Jordan's health score drops from 78 to 38. The **At risk** flag goes up and the signals show: visit overdue, no reply. |
| 45–48.8s | Automations | A win-back automation builds: *When at risk → SMS → email → invite to book*. The switch turns on. |
| 48.8–53.3s | The real-world result | A whip pan to Jordan's couch. The text arrives, Jordan smiles and replies "Yes please! Thursday at 10 works." |
| 53.3–57.4s | Inbox + booking | The reply lands in the inbox, the booking is confirmed, and Jordan's score climbs to 86. |
| 57.4–68.4s | Toolkit shelf | Four clay dioramas: **Reviews & review requests**, **Loyalty & retention**, **Payments & invoicing**, **Analytics & reporting**. |
| 68.4–75s | The result | The studio is bright and full, clients are returning, and the board is restored. Overview: Healthy / Needs attention / At risk / Actions taken. |
| 75–84.2s | Human support | Sam has a question and taps **Help → Contact a Representative**. Dana answers and they appear side by side. |
| 84.2–94s | Ending | The studio at dusk: "Stop guessing when your customers are planning to leave." Then the logo, "Know your customers. Keep your customers." and msghealth.net. |

The film only shows features from the brief: client health scoring, churn-risk detection,
automatic outreach, SMS & email, booking and appointment management, reviews and review requests,
loyalty and retention, payments and invoicing, analytics and reporting, the inbox, automations and
contacting a representative. The people, the business and the numbers on screen are illustrative.

## Brand assets

- Logo mark: `assets/logo.png` (official, transparent PNG), paired with a "MsgHealth" wordmark
- Brand colour: `#4F46E5`, set in `src/brand.js` along with `primaryDark` and `ink`

After changing either one, re-render with `npm run render`. Captions can be turned back on with
`SHOW_CAPTIONS` in `src/clay.js`.

## Rendering

Requirements: Node 18+, Playwright's Chromium, and an `ffmpeg` build with libx264.

```bash
npm install
FFMPEG=/path/to/ffmpeg npm run render          # → dist/msghealth-demo.mp4
node scripts/snap.mjs out/ 12 40.5 88          # still frames for review
```

`WORKERS=n` sets how many browser pages render in parallel. Textures are seeded, so the output
is the same on every run.

## Code map

- `src/brand.js`: brand name, colours, tagline, URL and feature names
- `src/clay.js`: the paper material (texture, cut edges, layered shadows, boil), camera, layers and depth of field, grading, captions
- `src/characters.js`: the cast (Sam, Jordan, Priya, Alex, Morgan, Dana) and their faces, poses and props
- `src/sets.js`: the street, the salon interior, Jordan's living room and the support desk
- `src/app.js`: the MsgHealth interface in clay (Client Health, Automations, Inbox, Overview, Help)
- `src/scenes.js`: the shot list, blocking, camera moves and transitions
- `scripts/audio.mjs`: the original synthesised score and sound design, synced to picture
- `scripts/render.mjs`: frame capture → ffmpeg → MP4
