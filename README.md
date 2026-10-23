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
node scripts/audit-text.mjs 0.25               # flag cropped or overlapping on-screen text
```

The text audit records the screen position of every string drawn and lists strings that the frame
or letterbox cuts off, or that overlap other text. Some flags are expected: text crossing the frame
edge during a camera move, and text hidden underneath an opaque panel or message bubble.

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

---

# 30-second vertical social ad (9:16)

A paid social ad for TikTok, Instagram Reels and YouTube Shorts, in a cut-paper style: characters and sets are layered pieces of card,
while the MsgHealth screens stay crisp so they're readable.
`dist/msghealth-ad-9x16.mp4` (1080×1920, 24 fps, 30 s). It has sound effects only (no music);
the voiceover is recorded separately (see below).

- Source: `ad.html`, `src/ad/people.js` (owner and customer), `src/ad/ui.js` (product screens), `src/ad/shots.js` (the edit)
- Sound: `scripts/ad-audio.mjs` writes `dist/ad-music-sfx.wav` (sound effects only)
- Render: `FFMPEG=/path/to/ffmpeg npm run render:ad`
- Text check: `npm run audit:ad` flags text that is cropped, overlapping, over a face, or outside the platform-safe area

Structure: pattern interrupt (0–3 s) → problem (3–7) → discovery (7–11) → product action (11–18) →
result (18–24) → payoff (24–27) → CTA (27–30). The MsgHealth logo first appears at 7 s.

## Voiceover script

Each line needs to fit its window. The two on-camera lines are lip-synced to the timings shown.

| # | Window | Speaker | Line |
|---|---|---|---|
| 1 | 0:01.95 – 0:03.40 | Owner, on camera (mouth moves 2.0–3.3 s) | "Wait… why are my customers leaving?" |
| 2 | 0:03.55 – 0:06.30 | Narrator | "The problem is, they usually don't tell you." |
| 3 | 0:08.95 – 0:11.30 | Narrator | "MsgHealth shows you who's at risk — before they're gone." |
| 4 | 0:13.05 – 0:15.50 | Narrator | "And helps you take action while you still can." |
| 5 | 0:24.35 – 0:25.45 | Sarah (customer), on camera (mouth moves 24.45–25.35 s) | "See you next month." |
| 6 | 0:27.15 – 0:29.85 | Narrator | "Stop guessing when your customers are planning to leave." |

Keep the delivery natural and conversational, as if one business owner were talking to another.
0:01.85–0:02.00 is deliberately silent, right before line 1.

---

# "While you cut": 27-second product film (9:16 and 16:9, 60 fps)

One Tuesday at a barbershop, told by the clock, in the MsgHealth brand indigo (#4F46E5) on black, cut to Pharrell Williams'
"Freedom". The hook is the day's result: "6 regulars rebooked. You sent 0 texts." It is already on screen at 0:00, so the
first frame works as the cover. Three booking notifications land while the intro plays muffled. The music opens up (2.8 s) as
the clock rolls back to 9:02 AM and walks through what MsgHealth did while the barber was cutting; 9:03 ticks over as the bass
comes in. The chorus drops (15.5 s) as the clock rolls to 7:00 PM and the week fills up. The end card holds while the last
verse ("…spirit use your wings") plays out.

Every change of hour is the clock rolling over. Both shots are faces of one 3D cube that turns a quarter, upward, like a digit
on a flip clock. It is rendered in WebGL with GPU motion blur, and each move travels one way and lands. Within a scene, a
changed digit rolls in place (9:02 → 9:03).

- **Video:** `dist/msghealth-promo.mp4` (1920×1080, 60 fps, 26.6 s), and the vertical cut `dist/msghealth-promo-9x16.mp4` (1080×1920, for TikTok, Reels and Shorts)
- 9:16: `promo-vertical.html` renders the same film natively at 1080×1920 (`npm run render:promo:9x16`). Each scene has its own framing
  (`FRAMING` in `src/promo.js`). Every moment of the day sits on one grid. In 16:9 the clock is on the left and the moment
  is on the right, both centred on the frame's middle line. In 9:16 the clock is on top with the moment a fixed gap below it.
  Every card shares the same inner padding.
- Source: `promo.html`, `src/promo.js`. The beat grid is `BEAT` / `B0` at the top (94.7 BPM, beat 0 at 0.30 s), and all timing is written in beats (`b(k)`).
- Music: `assets/audio/promo-track.m4a` is the supplied TikTok recording of "Freedom" from 25.25 s. The film ends at 51.85 s,
  after the last verse and before the next "Freedom" (and TikTok's outro at 52.3 s). Check you have the rights before running it as a paid ad.
- Sound: `scripts/promo-audio.mjs` places each effect so its attack (or peak) lands on its cue from `window.SFX`. A cue can carry
  its own `gain`. Sounds:
  - a soft swoosh as each notification lands, as the texts go out, and as Marcus replies
  - a click as the clock ticks over, as the booking confirms, on each star, and (quietly) on each booking added to the calendar
  - a whoosh at the fastest point of every roll, louder on the bass entry and the chorus drop
  - a snap and the peak of a metallic riser as MsgHealth lands on the end card

  The intro plays muffled until the first roll, and the music fades out over the last 0.5 s, in the gap after the verse.
- Sync: `src/promo-onsets.js` lists every hit in the track (`python3 scripts/promo-onsets.py` regenerates it). Entrances snap onto the nearest hit.
- Render: `npm run render:promo`
- On-screen "today" is Tuesday, October 20, 2026.

| Beats | Time | What's on screen | Transition in |
|---|---|---|---|
| 0–4 | 0–2.8s | "Tuesday, October 20 · 6 regulars rebooked. You sent 0 texts." Three booking notifications land on beats 1, 2 and 3; music muffled | — |
| 4–11 | 2.8–7.3s | **9:02 AM** "MsgHealth spots who's due back.": four regulars, Due / Overdue. The clock ticks to **9:03** as the bass comes in: "…and texts each one for you." Each turns "Text sent" | Clock roll, as the music opens up |
| 11–17 | 7.3–11.1s | **11:47 AM** "Marcus books himself in.": the morning's text, his reply, "Booked · Thu, Oct 22 · 2:00 PM" | Clock roll |
| 17–24 | 11.1–15.5s | **3:15 PM** "Jay leaves you five stars.": a star on each hit, then the review | Clock roll |
| 24–32 | 15.5–20.6s | **7:00 PM** MacBook, Home: the camera moves in on this week as six bookings land, then settles on "Booked this week: 6 new since this morning" | Clock roll, on the chorus drop |
| 32–36 | 20.6–23.1s | "You cut hair. MsgHealth fills the chair." | The laptop falls back into the dark |
| 36–end | 23.1–26.6s | Logo, msghealth.net, "Start now · 50% off your first month", over the last verse | Straight cut, with a snap |

---

# "Every touch": 38-second explainer ad (16:9 and 9:16, 60 fps)

It starts as a quick explainer on how a phone's touchscreen works, then turns into a pitch: a lot of a business owner's
taps go to client admin, and MsgHealth can do that for them. The captions tell the whole story, so it works with the
sound off. Until MsgHealth is named, everything is slate with an electric-cyan accent. The brand indigo arrives with
the brand, at the top of a musical phrase (24.91 s).

- **Video:** `dist/msghealth-screen.mp4` (1920×1080) and `dist/msghealth-screen-9x16.mp4` (1080×1920, for TikTok, Reels and Shorts)
- Source: `screen.html` / `screen-vertical.html`, `src/screen.js`. The short side is 1080 px in both formats. In 16:9 the captions
  sit on the left with the object on the right. In 9:16 the captions are at the top and the object is below them.
- Captions hang from a fixed first line, with the eyebrow a fixed distance above. Nothing jumps when a caption has more or
  fewer lines. Captions are drawn over the scenes, so a transition never moves them.
- Labels inside a scene leave before it transitions out. Transitions and card rows swap their text in sequence: the
  outgoing text is gone before the incoming text is readable.
- **Text check:** `ENTRY=screen.html node scripts/audit-text.mjs 0.05` (and `screen-vertical.html`) samples 20 frames a second.
  It reports any text that overlaps other text or is cropped by the frame. Both formats currently report 0 issues.
- **Music:** `assets/audio/screen-track.m4a` is the supplied "Timeless" instrumental (The Weeknd & Playboi Carti), cut from 16 s
  into the supplied clip, where the drop hits.
  - It runs at 120 BPM: a beat every 0.5 s, bars at 0.91 + 2k s, and the drum pattern restarts every 4 s (0.91 + 4k).
  - It is mastered loud (about -9.6 LUFS), so the mix turns it down 5 dB under the effects.
  - Check you have the rights before running it as a paid ad.
- **Timing:** the story is written on its own clock, and `RETIME` in `src/screen.js` maps it onto the music so that every cut
  lands on a beat:

  | Moment | Time |
  |---|---|
  | Layers | 3.91 s |
  | Grid | 6.91 s |
  | Back to the phone | 16.91 s |
  | Card | 19.41 s |
  | MsgHealth (top of a phrase) | 24.91 s |
  | Lock screen | 30.91 s |
  | End card (top of a phrase) | 32.91 s |

  The film ends at 36.91 s, as the next phrase comes round.
- **Sound effects** are cut from the supplied "sound effects you need as an editor" reel into `assets/audio/fx-*.wav`. The
  narrator's spoken labels are left out. `scripts/screen-audio.mjs` places them from `window.SFX`:

  | Effect | Where it plays |
  |---|---|
  | tap | every finger tap, and the finger pressing the grid |
  | phone-typing click (`fx-key`) | card rows appearing and turning "Automatic" |
  | swish | phone tipping back into layers |
  | transition | zoom into the grid and back out |
  | swoosh | cross-fades |
  | ding | the touch point locking on |
  | transition with a hit (`fx-transition-hit`) | the build into MsgHealth, landing on 24.91 s |
  | Shopify cash register (`fx-cash`) | "That's 2 hours back" |
  | phone notification | each lock-screen notification (the first is loudest) |
  | punch (`fx-punch`, kept from the first effects reel) | the logo landing on the end card |

  The reel's paper crumple and bang aren't used.

  Levels: the track is mastered loud (about -9.6 LUFS) and the reel is quiet, so the music drops about 7 dB and the effects come
  up about 8 dB (`MUSIC_GAIN` and `FX_GAIN`). The mix lands around -14.5 LUFS. `MUSIC_GAIN=0 node scripts/screen-audio.mjs out.wav`
  renders the effects alone, for checking levels.
- **Finger:** two cursor-style hands in `assets/img`. The pointing hand (`hand-tap.png`, click lines recoloured white for
  the dark screens) shows while the finger presses. The middle finger (`hand-hover.png`) shows while it hovers. Both were cut
  out of the supplied pictures, and `HANDS` in `src/screen.js` records where each fingertip sits.
- **"2 hours back" clip:** the supplied clip (`assets/video/peace`: 34 frames at 25 fps, plus `audio.wav`) pops up as an overlay on
  the card once "That's 2 hours back. Every day." has landed.
  - The music pauses on the beat at 28.91 s and only the clip's own sound plays (about 3 dB up to match the mix). No effects
    play over it.
  - The music then picks up from where it stopped. Everything after the clip comes 1.36 s later, so every later cut is
    still on the beat.
  - `PAUSE` in `src/screen.js` sets where the pause happens.
- Render: `npm run render:screen` and `npm run render:screen:9x16`. Stills (film time): `ENTRY=screen.html node scripts/snap.mjs out/ 12`

| Time | Caption | What's on screen |
|---|---|---|
| 0–3.9s | "You're on your phone 5 hours a day." / "Ever wonder how it knows where you touch?" | A finger taps and swipes a phone. Its Screen Time widget reads 5h 1m, with pickups counting up to 186. |
| 3.9–6.9s | "It's a stack of layers." / "The trick is the touch sensor." | The phone tilts and comes apart: cover glass, touch sensor, display. The sensor lights up. |
| 6.9–10.1s | "A grid of invisible wires. Every crossing holds an electric field." | Zoom into the sensor's diamond electrode grid. Drive pulses run along the rows and charge particles flow at every crossing. |
| 10.1–12.7s | "Your finger conducts. It pulls charge away." | A see-through finger presses down, and nearby charge streams up into it |
| 12.7–14.9s | "The phone scans for the drop over 100 times a second." | A scan line sweeps the grid ("shown slowed down"). The drained crossings light up and a crosshair locks on with a coordinate tag. |
| 14.9–16.9s | "That's your touch." | The crosshair follows the finger as it drags |
| 16.9–19.4s | "Run a business? A lot of those touches are for clients." | Back to the phone for a burst of taps |
| 19.4–24.9s | "Booking. Reminders. Rescheduling. Follow-ups." / "Over 2 hours a day, just keeping your calendar full." | Client admin per day: booking 45m, reminders & confirmations 30m, rescheduling & cancellations 25m, follow-ups & rebooking 20m, review requests 10m = 2h 10m |
| 24.9–32.3s | (MsgHealth logo) "It does all of that for you." / "That's 2 hours back. Every day." | The colour turns brand indigo. Each row flips to "Automatic", its bar drains, the total counts down to 0m and "2h 10m back" appears. At 28.9s the music pauses and the clip plays over the card with its own sound. |
| 32.3–34.3s | "Without lifting a finger." | The finger lifts off a lock screen as MsgHealth notifications land: reminders sent, a booking, a reschedule, a review request |
| 34.3–38.3s | — | Logo, "Get your hours back.", msghealth.net |

How a touchscreen works, as shown: a phone screen is a mutual-capacitance touchscreen. Under the cover glass sits a grid
of transparent electrodes. Drive lines run one way and sense lines run the other. A small signal on the drive lines sets up
an electric field at each crossing. A finger is conductive, so it draws some of that field away from the crossings beneath
it. The touch controller scans the grid many times a second (typically 60–240 Hz), finds the crossings whose signal dropped,
and takes their centre as the touch point.

Where the numbers come from:
- **5 hours a day, 186 pickups:** Reviews.org's 2025 survey of US smartphone users (about 5h 1m a day, 186 checks a day).
  Other 2025 estimates range from about 4 to 5.5 hours.
- **The client-admin day (2h 10m)** is an estimate for a typical appointment-based business, built from published benchmarks:
  - roughly 7 hours a week on scheduling;
  - about 45 minutes a day on reminder calls (a salon-software benchmark);
  - most cancellations arriving with under 24 hours' notice (Fresha);
  - administrative work taking about a third of an owner's ~45-hour week.

  Most of these figures come from booking-software vendors, so treat the split as illustrative. Every row is something
  MsgHealth automates: booking and appointment management, reminders, rescheduling, automatic SMS & email follow-ups,
  and review requests.
- The names in the notifications are made up.

### Optional voiceover

The captions can be read as a VO, line by line, in the windows given above. The pace is quick, so keep it tight and
conversational. Lift the energy at 24.9s, when MsgHealth arrives.
