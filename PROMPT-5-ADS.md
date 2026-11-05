# Prompt: generate 5 MsgHealth story-hook ads at once

You are working in the `msghealth` repo (procedural canvas ads, rendered with Playwright + ffmpeg, narrated with Kokoro TTS). Make **5 vertical ads (1080×1920, 30 fps, 35–45 s) in parallel**: write 5 voice specs, 5 scene files, then render all 5. Reuse `src/kit.js`, `scripts/ads-vo.py`, `scripts/ads-audio.mjs`, `scripts/render.mjs`; copy `src/bucket.js` / `src/crassus.js` as the structural model (the bucket ad is the favourite).

## 1. The format
- **Story hook, late reveal.** Open on a *true, little-known* story (not famous ones like Pepsi jet, Bitcoin pizza, Titanic). Add **one absurd twist** (mark it as invented in the file header). It must not feel like an ad until the pivot at ~65–75% of the runtime.
- **The twist and the product point are the same idea** (bucket: "left on read for 700 years" → one inbox). The feature should solve the exact thing the joke is about.
- **Beats:** hook (≤3 s) → 4–6 story scenes → absurd twist → pivot line ("Your customers X too") → `brandHit` → 2–3 product scenes using the real UI language → `offerCard` → `endCard`.
- One feature per ad; vary them across the 5: booking/calendar + reminders, inbox, client health scoring/churn flags, loyalty & rewards, reviews & requests, invoicing/payments, reports/analytics, human support (Help → Contact a Representative).
- Captions: black label, white caps, accent words in `*stars*` (gold before the brand, indigo after). Caption zone is y≈1430–1510: keep faces, feet, signs and key text out of it.

## 2. Facts you may use (never invent numbers)
- Brand: **MsgHealth** (on screen) — spoken **"Message Health"**. URL msghealth.net, spoken "Message Health dot net". Tagline "Know your customers. Keep your customers."
- Plans (monthly): Starter $50 (booking calendar + Google Calendar sync, client health scoring & churn-risk flags, SMS & email reminders 300/mo, invoicing/payment links/POS, broadcasts, loyalty & rewards, reviews & review requests, chat widget, AI command bar, basic analytics, no-show protection), Pro $109, Enterprise $279. **Annual: save 20%.**
- **Offer: 50% off the first month on monthly plans** → Starter $25, Pro $54.50, Enterprise $139.50. **Not valid on the Pay-Per-Use Wallet.** Don't claim it stacks with annual.
- On-screen scores, names and counts are illustrative; keep them plausible and never present them as real customer data. msghealth.net is blocked in the sandbox — use only the facts above.

## 3. Pronunciation (the voice reads the `say` text, captions show the display text)
- Write numbers and years out: "nineteen hundred and two", "thirteen twenty-five", "fifty percent", "twenty-five dollars".
- Respell what the voice gets wrong: Modena → **Modehna**; loyalty → **loyaltee**; "on read" → **"on red"**; QR → **"Q R"**; MsgHealth → **"Message Health"**.
- Before generating, print the phonemes for every line (`Kokoro.tokenizer.phonemize(text, 'en-us')`) and fix anything odd: place names, brand words, abbreviations, "read/lead" homographs, numbers, currency. Spell out symbols (¢, %, $) in `say`.
- Pick a voice per ad (`am_michael`, `am_adam`, `af_heart`), speed ~1.06; keep the pause gaps in the spec so punchlines breathe.

## 4. Design rules (foreground / background)
- **One ground line per scene.** Everything stands on it; people/animals/props scale with depth (lower on screen = larger). Add a contact shadow under every standing figure and prop (`person()` does; use `shadow()` for others).
- **Layering:** to seat or hide legs, draw the figure first, then the desk / table / couch / counter in front. Never let a person stand on a table. Objects "on" a surface must sit exactly on its top edge.
- **Fill the whole 1080×1920 canvas every scene** (sky, mid-ground, floor). Unpainted bands show the previous scene through.
- **Consistent scale:** a door ≈ 1.2× a person; a shed door ≥ the people queuing at it; a soldier ≈ 75% of a tank's height. Check props against people.
- **Nothing under the caption zone or on faces:** speech bubbles and labels go above heads; no text on top of text; signs inside the canvas (check the right edge).
- Avoid accidental faces (two windows + a door), floating props, hands holding nothing, and elements that overlap mid-transition. Keep one visual idea per scene and a pop-in (`pop()`/`ease.back`) per beat tied to the word it illustrates (`word(line, chunk)`).
- Product scenes use the dark UI helpers (`stage`, `card`, `tag`, `bubble`, `phone`); show real feature names from section 2.

## 5. Build and QA (do all 5 in parallel)
1. Write `scripts/vo/<name>.json` (lines with `say`, `caps`, `gap`) for each ad. Print phonemes, fix, then `python3 scripts/ads-vo.py <name> <kokoro.onnx> <voices.bin>` (model files come from the kokoro-onnx GitHub release).
2. Write `src/<name>.js` (timings from `VO_AT`/`word()`, `SCENES`, `cue()` sound effects, `boot()`); copy an existing `<name>.html`; add `<name>` to the regex in `scripts/lib.mjs` and `scripts/render.mjs` and a `render:<name>` script.
3. Review frames: `node scripts/snap` style contact sheets at the hook, each story beat, the twist, pivot, each product scene, offer and end card. Fix scale, layering, overlaps.
4. `ENTRY=<name>.html node scripts/audit-text.mjs 0.1` → no unintended overlaps. Render all 5: `ENTRY=<name>.html node scripts/render.mjs` (set `CHROMIUM_PATH=/opt/pw-browsers/chromium`).
5. Verify duration, audio levels, and that the offer card shows the real prices and the monthly-plans-only note. Commit and push to the working branch (no PR unless asked); deliver the 5 MP4s.

## 6. The five stories (replace freely — verify each fact before use)
| # | True story | Absurd twist | Feature |
|---|---|---|---|
| 1 | Yap's giant stone money: ownership tracked by memory, even for a stone lost at sea | the "ledger" is one very tired man | invoicing / payments, every payment tracked |
| 2 | The Pig War (1859): a shot pig nearly starts a war over a $ dispute | both sides wait for the other to reply first | one inbox / Contact a Representative |
| 3 | Emperor Norton (1860s San Francisco): a self-declared emperor whose own scrip local shops honoured | he demands a stamp card | loyalty & rewards |
| 4 | 1883: before standard time, one rail station could show several different times | everyone is "right on time" for a different train | booking calendar + reminders |
| 5 | The Pet Rock (1975): millions sold on word of mouth | the rocks never left a review | reviews & review requests |

Deliver: 5 voice specs, 5 scene files, 5 rendered MP4s in `dist/`, committed and pushed.
