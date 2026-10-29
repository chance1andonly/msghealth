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

# "Every touch": 43-second explainer ad (16:9 and 9:16, 60 fps)

It starts as a quick explainer on how a phone's touchscreen works, then turns into a pitch: a lot of a business owner's
taps go to client admin, and MsgHealth can do that for them. The captions tell the whole story, so it works with the
sound off. Until MsgHealth is named, everything is slate with an electric-cyan accent. The brand indigo arrives with
the brand, at the top of a musical phrase (28.91 s).

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
  | Layers | 4.41 s |
  | Grid | 8.41 s |
  | Back to the phone | 18.91 s |
  | Card | 21.91 s |
  | MsgHealth (top of a phrase) | 28.91 s |
  | Lock screen | 35.41 s |
  | End card (on a bar line) | 38.91 s |

  The film ends at 42.91 s, after four seconds of end card and just before the clip's TikTok outro.
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
  | transition with a hit (`fx-transition-hit`) | the build into MsgHealth, landing on 28.91 s |
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
- **Clip overlay:** the guy throwing up the peace sign, cut out of the supplied clip, stands on the card from the MsgHealth hit
  (28.91 s).
  - The background and the second guy are removed. `assets/video/peace` holds 33 RGBA frames at 25 fps plus `audio.wav`.
  - He holds still for half a second (`CLIP.hold`), then plays at 60% speed (`CLIP.speed`). As he dashes off (1.0–1.43 s in) he
    blurs and fades into the card. Right after that, the rows turn "Automatic" and the time drops.
  - His sound starts with the dash. It's slowed to match (pitch kept) and sits muffled under the music.
  - The cut-out was made with Google's DeepLab v3 person segmentation (through MediaPipe), limited to his side of the frame
    and his hand, with jersey and background pixels dropped and the bottom edge feathered.
  - `CLIP` and `CLIP_FADE` in `src/screen.js` set the timing.
- **Voiceover:** a male text-to-speech voice reads every caption, then "Get your hours back, with Message Health." on the end
  card.
  - The voice is Kokoro TTS (Apache-2.0, fine for commercial use), voice `am_michael`, at 1.08× speed. The lines are in
    `assets/audio/vo` (one WAV per line, plus `vo.json` with each line's start time).
  - Each line starts as its caption lands. A line that would run past its caption is sped up (to at most ×1.2, pitch kept),
    and if it still overruns, the next line waits a beat so two lines never overlap.
  - Spoken text differs from the screen where it reads better aloud, through the `vo` fields in `CAPS` (`src/screen.js`):
    "five hours", "Invisible wires. Every crossing holds an electric field.", "It scans for that over a hundred times a second.",
    "Message Health does all of that for you".
  - The music ducks about 8 dB under the voice and comes back between lines. The mix lands around -14 LUFS.
  - To regenerate:
    - Install the packages: `pip install kokoro-onnx soundfile`.
    - Download `kokoro-v1.0.onnx` and `voices-v1.0.bin` from the kokoro-onnx GitHub releases into a folder.
    - Run `KOKORO_DIR=that/folder node scripts/screen-vo.mjs`. `VOICE=am_fenrir` (or `am_puck`, `bm_george`, …) and `SPEED`
      change the read.
- Render: `npm run render:screen` and `npm run render:screen:9x16`. Stills (film time): `ENTRY=screen.html node scripts/snap.mjs out/ 12`

| Time | Caption | What's on screen |
|---|---|---|
| 0.0–4.4s | "You're on your phone 5 hours a day." / "Ever wonder how it knows where you touch?" | A finger taps and swipes a phone. Its Screen Time widget reads 5h 1m, with pickups counting up to 186. |
| 4.4–8.4s | "It's a stack of layers." / "The trick is the touch sensor." | The phone tilts and comes apart: cover glass, touch sensor, display. The sensor lights up. |
| 8.4–11.8s | "A grid of invisible wires. Every crossing holds an electric field." | Zoom into the sensor's diamond electrode grid. Drive pulses run along the rows and charge particles flow at every crossing. |
| 11.8–14.5s | "Your finger conducts. It pulls charge away." | A see-through finger presses down, and nearby charge streams up into it |
| 14.5–16.8s | "The phone scans for the drop over 100 times a second." | A scan line sweeps the grid ("shown slowed down"). The drained crossings light up and a crosshair locks on with a coordinate tag. |
| 16.8–18.9s | "That's your touch." | The crosshair follows the finger as it drags |
| 18.9–21.9s | "Run a business? A lot of those touches are for clients." | Back to the phone for a burst of taps |
| 21.9–28.9s | "Booking. Reminders. Rescheduling. Follow-ups." / "Over 2 hours a day, just keeping your calendar full." | Client admin per day: booking 45m, reminders & confirmations 30m, rescheduling & cancellations 25m, follow-ups & rebooking 20m, review requests 10m = 2h 10m |
| 28.9–35.4s | (MsgHealth logo) "It does all of that for you." / "That's 2 hours back. Every day." | The colour turns brand indigo. The peace-sign guy, cut out of the clip, stands on the card and fades into it as he dashes off, with his sound muffled under the music. From 30.6s each row flips to "Automatic", its bar drains, the total counts down to 0m and "2h 10m back" appears. |
| 35.4–38.9s | "Without lifting a finger." | The finger lifts off a lock screen as MsgHealth notifications land: reminders sent, a booking, a reschedule, a review request |
| 38.9–42.9s | — | Logo, "Get your hours back.", msghealth.net |

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

---

# "The canary": 36-second vertical ad (9:16, 30 fps)

A "did you know" short, in the format of the supplied reference ad: a flat-vector story told one caption at a time,
then a turn into the product. For 75 years coal miners took a canary to work. Deadly gas could build up with no smell
and no color, but the canary felt it first, and when it stopped singing the miners got out. Then: your customers go
quiet before they leave too. MsgHealth hears the silence.

- **Video:** `dist/msghealth-canary-9x16.mp4` (1080×1920, 30 fps, 36 s, for TikTok, Reels and Shorts)
- Source: `canary.html`, `src/canary.js` (the whole film), `src/canary-vo.js` (voiceover clip lengths and caption timing)
- Render: `npm run render:canary`. Text check: `npm run audit:canary` (0 issues). Stills: `ENTRY=canary.html node scripts/snap.mjs out/ 4.3 25.4`
- Look: act 1 is a flat cross-section of the ground (sky and winding tower, earth layers, the gallery with timber
  sets, lanterns and rails), with a camera that tilts down the shaft and pushes into the cage. The gas shows in green
  at first. On "no smell, no color" the fill drains away until only a shimmering dashed outline is left. Act 2 is black
  with a faint grid in the MsgHealth indigo. Captions are one phrase at a time in a black box. Accent words are canary
  yellow in the mine and indigo after the turn.
- **Voiceover:** synthesised with Kokoro TTS (voice `af_heart`, speed 1.08). Each line is its own clip,
  `assets/audio/canary/vo-NN.wav`. `VO_AT` in `src/canary.js` sets when each clip starts, and every story beat (`T`) is
  read off the voiceover, so picture, captions and sound stay locked to it. Caption chunk timings were found by
  aligning syllables to each clip's voiced frames, then checked by hand. Swap in a recorded read by replacing the clips
  and adjusting the offsets in `src/canary-vo.js`.
- **Sound** (`scripts/canary-audio.mjs`): a synthesised music-box ostinato that cuts dead on "stopped singing", the
  canary's chirps (they weaken as the gas reaches it), mine rumble, drips and footsteps, a heartbeat under "your
  customers go quiet", then a 112 BPM groove from the logo hit. The drums drop out under "Stop guessing" and come back
  for the end card. Effects come from `assets/audio/fx-*.wav`, placed from `window.SFX`. The score ducks under the
  voice. The mix lands around −15 LUFS.

| Time | Voiceover | What's on screen |
|---|---|---|
| 0–3.7s | "For 75 years, coal miners took a tiny bird to work." | Tilt down from the winding tower to the gallery. A miner walks in with a brass cage, then a push-in on it. |
| 3.9–4.6s | "A canary." | Close on the canary, singing. Notes float up. |
| 5.0–9.0s | "Deep underground, a deadly gas could build up, with no smell, and no color." | Pull back to the full depth. Green gas rolls in along the gallery, then fades to a dashed outline. |
| 9.2–10.7s | "But the canary felt it first." | The gas reaches the cage. The canary puffs up, its eyes close, and its notes falter. |
| 11.0–13.7s | "So when the canary stopped singing, the miners got out." | The song (and the music) stops. The last notes drop. The miner turns and runs for the shaft. |
| 14.0–15.1s | "Before it was too late." | A whip up to the surface. The miner holds the cage up and the canary perks back up. |
| 15.5–17.1s | "Your customers go quiet too." | CUSTOMER ACTIVITY: a year of visits and replies. Jordan's bars stop: "Quiet for 9 weeks". |
| 17.4–19.3s | "They stop booking. They stop replying." | JORDAN · THE SIGNS: "Usual 4-week booking: MISSED", "Your last 2 texts: NO REPLY". |
| 19.5–20.4s | "Then they're gone." | Jordan's avatar fades to an empty dashed outline. |
| 20.8–22.4s | "MsgHealth hears the silence." | The logo lands with a hit. Listening rings go out. |
| 22.6–25.8s | "It scores every customer's health, and flags who's at risk." | CLIENT HEALTH: scores count up (92, 85, 61, 38). Jordan is flagged AT RISK: "Visit overdue · 5 weeks", "No reply · 12 days". |
| 26.0–28.1s | "Then it texts them for you, before they leave." | AUTOMATIONS · WIN-BACK: "When At risk → Send SMS" switches on, and the text goes out: "Sent automatically · SMS · Delivered". |
| 28.4–29.3s | "And they book again." | "Yes please! See you then." Then "Booked · Thu 10:00 AM", and Jordan's health goes from 38 to 86. |
| 29.7–32.4s | "Stop guessing when your customers are planning to leave." | "Stop guessing." (struck out), then "Start knowing." |
| 32.6–36s | "MsgHealth dot net." | Logo, "Know your customers. Keep your customers.", a tap on "Try MsgHealth →", then msghealth.net. |

On the facts: British coal mines used canaries from the 1911 Coal Mines Act until they were phased out in 1986. Carbon
monoxide has no smell or color, and canaries show its effects well before people do. Miners watched for a bird in
distress ("stopped singing" is the popular shorthand). The customers, names and numbers are illustrative.

---

# "Pizza index": 38-second vertical ad (9:16, 30 fps)

A joke built on a real story, like the supplied reference: in 1990, the night before Iraq invaded Kuwait, late-night
pizza deliveries to the Pentagon spiked, and Washington has called it the Pentagon Pizza Index ever since. Act 1 plays
the story straight in flat vector, then pushes it further: a tower of boxes goes through the roof, a general eats under
a spinning siren, and a spy in a bush tails the delivery guy through binoculars. Then the punchline turns into the pitch:
"Your customers drop hints too. They just don't order pizza."

- **Video:** `dist/msghealth-pizza-9x16.mp4` (1080×1920, 30 fps, 37.8 s)
- Source: `pizza.html`, `src/pizza.js`, `src/pizza-vo.js` (voiceover clip lengths and caption timing). Act 2 uses the
  same MsgHealth screens as "The canary" with new copy.
- Render: `npm run render:pizza`. Text check: `npm run audit:pizza`. It reports one expected flag: the shop's "PIZZA"
  sign is cut off by the frame inside the zoomed binocular view (15.3–16.6 s).
- **Voiceover:** Kokoro TTS (`af_heart`, speed 1.08), one clip per line in `assets/audio/pizza/`, started at `VO_AT`
  in `src/pizza.js`. Every story beat (`T`) is read off the voiceover.
- **Sound** (`scripts/pizza-audio.mjs`): a synthesised pizzicato spy groove under act 1, delivery-car passes, box thocks
  that speed up and rise as the tower goes through the roof, a two-tone siren for the general, a rustling bush, a
  sad-trombone sting after "They just don't order pizza", then the MsgHealth groove from the logo hit. Its drums drop
  under "No binoculars required" and return for the end card. Effects come from `assets/audio/fx-*.wav`. The score
  ducks under the voice. The mix lands around −15 LUFS.

| Time | Voiceover | What's on screen |
|---|---|---|
| 0–3.4s | "In 1990, the night before Iraq invaded Kuwait," | The Pentagon from above at night, with a surveillance HUD ("WASHINGTON, D.C. · AUG 1, 1990 · 11:47 PM"). A pizza car pulls in. |
| 3.5–6.2s | "pizza deliveries to the Pentagon went through the roof." | More pizza cars arrive and the HUD's "PIZZA ORDERS" meter fills. A stack of boxes rises out of the courtyard and shoots up past the frame. |
| 6.6–9.9s | "Insiders even gave it a name. The Pentagon Pizza Index." | A chart card. The line is flat for weeks, then a pizza slice rides it up to "AUG 1". The title stamps in. |
| 10.3–12.6s | "Late-night pizza? Something big is coming." | Through a window: a general mid-slice, with a stack of boxes and a red phone. A siren starts spinning, his eyes go wide and the cheese drips. |
| 12.9–16.2s | "So now, some people watch pizza deliveries… very closely." | Outside the pizza shop, a spy rises out of a bush that creeps after the delivery guy. Then the binocular view: "PEPPERONI · LARGE", "CONFIRMED". |
| 16.6–18.3s | "Your customers drop hints too." | The binoculars iris out onto CUSTOMER ACTIVITY. Jordan's bars tail off. |
| 18.6–19.9s | "They just don't order pizza." | A pizza box drops onto the card and gets stamped "NO PIZZA DETECTED". Sad trombone. |
| 20.3–23.1s | "They book less. They reply slower. Then they're gone." | JORDAN · THE SIGNS: visits now every 9 weeks, replies after 3 days. Jordan fades to a dashed outline. |
| 23.5–25.5s | "MsgHealth reads the signs for you." | The logo lands with a hit. |
| 25.7–28.8s | "It scores every customer's health, and flags who's at risk." | CLIENT HEALTH: scores count up. Jordan is flagged AT RISK. |
| 29.1–31.9s | "Then it texts them, before they leave. And they book again." | An automatic win-back SMS, Jordan's reply, "Booked · Thu 10:00 AM", and health from 38 to 86. |
| 32.4–34.0s | "No binoculars required." | Binoculars, struck out. Then "Just MsgHealth." |
| 34.2–37.8s | "MsgHealth dot net." | End card: logo, tagline, a tap on "Try MsgHealth →", then msghealth.net. |

On the facts: the "Pizza Meter" story comes from Frank Meeks, who ran Domino's franchises in Washington. He told
reporters that late-night orders from the Pentagon and the White House jumped the night before Iraq invaded Kuwait on
August 2, 1990. "Pentagon Pizza Index" is the name the idea still goes by. The film shows no pizza brand, and the 11:47 PM
timestamp, the spy and the general are jokes. The customers, names and numbers are illustrative.

---

# "Uranus": 58-second vertical ad (9:16, 30 fps)

A "what if" science short in the format of the supplied reference (same Uranus laser hook): eight billion people aim
lasers at Uranus. The light takes almost three hours to get there, a single beam spreads to a spot twice as wide as the
Sun, so almost all of it misses, and any light coming back would need another three hours. Then the turn: six hours
round trip "is still faster than most businesses notice a regular has stopped coming." MsgHealth scores every customer,
flags who's at risk the moment they slip, and texts them so they book again.

- **Video:** `dist/msghealth-uranus-9x16.mp4` (1080×1920, 30 fps, 57.6 s)
- Source: `uranus.html`, `src/uranus.js`, `src/uranus-vo.js` (clip lengths, caption timing and the spoken text)
- Render: `npm run render:uranus`. Text check: `npm run audit:uranus` (0 issues).
- Look: act 1 is a flat-vector crowd at night. It opens tight on one guy's raised hand, his pointer clicks on, and the
  camera pulls back to the whole crowd as their beams come up. A big 3, 2, 1, then a green flash on "FIRE!". Then black
  space schematics, labelled like the reference: a big title top left, small tracked labels. The pivot keeps the clock
  spinning while it counts weeks since Jordan's last visit, and it turns red past six weeks. Act 2 uses the MsgHealth
  screens from "The canary" and "Pizza index", on black with a faint grid in brand indigo. Captions are bold white with
  a soft shadow and no box. Accent words are pale gold until the logo and indigo after it.
- **Voiceover:** Kokoro TTS, voice `am_michael` (a male narrator, like the reference), speed 1.1. "Uranus" is said as two words, "your anus" (the TTS is fed that spelling; captions still read Uranus). In line 14 the pause the TTS puts after "businesses" is cut out, so the line runs straight through. There's one clip per
  line in `assets/audio/uranus/`, and each starts at its time in `VO_AT`. Caption chunks were timed with
  `scripts/vo-align.py`, which spreads syllables over each clip's voiced span and snaps each boundary to the quietest
  nearby frame.
- **Sound** (`scripts/uranus-audio.mjs`): a low drone with a pulse and a rising swell into the countdown, a hit on each
  number, a boom and a spray of synthesised laser zaps on "FIRE!", a spacey pad with a sparse bell arpeggio, clock
  ticks (faster once they count weeks), a heartbeat under the lost customer, then the MsgHealth groove from the logo hit.
  The drums drop under "Stop guessing…" and come back for the URL. The mix lands around −16.5 LUFS.

| Time | Voiceover | What's on screen |
|---|---|---|
| 0–3.3s | "What if eight billion people aimed lasers at Uranus?" | Close on a raised hand. The pointer clicks on, then a pull back to the crowd as every beam comes up. |
| 3.6–7.0s | "Three. Two. One. Fire!" | A big 3, 2, 1. Green flash and shake, and the beams blaze. |
| 7.5–9.7s | "Billions of beams shoot into space." | 8 BILLION LASERS: Earth with a sheet of beams leaving it |
| 9.9–13.3s | "But it could take almost three hours, just to reach Uranus." | ≈3 HOURS: a green wedge crawls from a tiny Earth to Uranus |
| 13.6–19.1s | "And the beams keep spreading. By then, one laser could make a spot twice as wide as the Sun." | THE FOOTPRINT EXPANDS (0.9 mrad), then ≈2 SUNS WIDE: two suns inside one beam's spot |
| 19.4–22.7s | "Uranus is just fifty-one thousand kilometers wide." | URANUS DIAMETER counts up to 51,118 km |
| 22.9–25.0s | "So almost all that light misses." | ALMOST ALL MISSES: at the same scale, Uranus shrinks to a speck inside the green footprint |
| 25.4–31.6s | "But here's the weird part. Even if Uranus lit up, the light coming back would need another three hours." | Uranus lights up and a dot of light crawls back to Earth. "+≈3 HOURS" |
| 31.8–33.4s | "Six hours, round trip." | ≈6 HOURS: a clock spins through six hours |
| 33.7–37.9s | "Which is still faster than most businesses notice a regular has stopped coming." | MEANWHILE, AT YOUR SHOP: "3w 3d → 9w 0d since Jordan's last visit". Jordan's card turns red: "NOT BOOKED · NO REPLY" |
| 38.4–42.2s | "By the time they do, that customer is already booked somewhere else." | "→ booked somewhere else" (struck through), then a CUSTOMER LOST stamp |
| 42.8–48.1s | "MsgHealth scores every customer's health, and flags who's at risk the moment they slip." | The logo lands with a hit. CLIENT HEALTH: scores count up, Jordan slides from 78 to 38 and is flagged AT RISK ("Visit overdue · 2 weeks", "No reply") |
| 48.4–50.8s | "Then it texts them for you, so they book again." | AUTOMATIONS · WIN-BACK: an automatic SMS, "Yes please! See you then.", "Booked · Thu 10:00 AM", and health from 38 to 86 |
| 51.3–57.6s | "Stop guessing when your customers are planning to leave. MsgHealth dot net." | End card: logo, tagline, a tap on "Try MsgHealth →", "50% off your first month", msghealth.net |

On the facts: Earth–Uranus distance runs about 2.6–3.2 billion km, so light takes about 2.4–2.9 hours one way. At a
0.9 mrad full-angle divergence, which is typical of a cheap laser pointer, a beam that has travelled about 2.7–3 billion km is
about 2.4–2.7 million km wide. The Sun is about 1.39 million km across, so that's roughly two Suns. It's also about 50
times Uranus' diameter (51,118 km), which is why the "same scale" shot leaves Uranus as a speck. The return trip is the
same distance, so six hours is the round trip. The six-hours-versus-weeks line is a comparison, not a measured
statistic. The customers, names and numbers are illustrative. The "50% off your first month" offer is the one from the
"While you cut" end card, so confirm it's still running before you buy media.
