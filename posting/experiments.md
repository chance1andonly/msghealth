# Format experiments (started 2026-11-24)

Why: profile views fell about 30%, the whole platform is down (Reels reach about -35% YoY per Metricool), and our own data says volume is hurting: 3 posts/day median 129 views, 5/day median 28 (small sample, confounded by format and time). We stop guessing and run a ledger.

## What the 2026 research says (use as priors, not rules)
- Ranking leans on watch time, sends per reach, likes per reach; sends (DM shares) is the strongest reach signal. Originality is rewarded, reposts/AI-slop sameness is demoted.
- Topic dilution: a feed that jumps topics gets shown to colder audiences. Keep ONE promise (retention for barbers/stylists) but vary the FORMAT.
- Trial Reels (Graph API `trial_params`, graduation MANUAL or SS_PERFORMANCE) show a reel to non-followers first, so formats can be tested without hurting the main grid. Needs a professional account with 200+ followers. posting/ig.mjs already supports it: set `"trial": "MANUAL"` in schedule.json (falls back to a normal reel if refused).
- Best SaaS short-form pattern: a concrete problem the viewer feels, shown not told, with a comment-keyword CTA that delivers something (lead magnet) via DM automation. Founder/POV, screen-demo, and fast "before/after" formats outperform polished brand spots.

## Format matrix (each gets at least 3 reels before judging)
| ID | Format | Hook type |
|----|--------|-----------|
| F1 | Toy-world story (door kick, sheep) | absurd story, product reveal at end |
| F2 | True-story reel (Pentagon pizza style) | odd true scene + date/number |
| F3 | Screen demo: real MsgHealth texting a lapsed client | "Watch this client come back in 40s" |
| F4 | Talking POV/founder: one sentence on what stylists lose per ghosted client | direct number claim |
| F5 | Reaction/stitch of a viral barber reel with the retention angle | borrowed attention |
| F6 | Text-on-footage list ("3 texts that bring clients back") | utility, saveable |
| F7 | Poll/verdict: "Would you text this client? Y/N" | comments |

## Ledger (fill after 48h per reel; read posting/stats.json)
format | reel | views | sends/reach | likes/reach | follows | profile visits | verdict

## Decision rules
- WIN: above the account median views AND sends/reach or follows above median. REPLICATE: next 3 reels reuse the format with new content. Stop when two in a row fall below median; then kill it.
- KILL: 3 reels all below median. Log why in one line.
- Never judge before 48h. Always compare within the same posting-hour band.
- One variable per test: change format OR hook OR hour, not all.

## Parallel checks
1. Cadence A/B: 3/day for 7 days vs the 6/day we run now. Pick the better median views per post AND total profile visits.
2. Trial track: when the account is eligible, post each new format as a trial first (MANUAL graduation), graduate only winners.
3. Funnel: "Comment KEEP" must DM a real "retention audit" (comment-to-DM automation) or the CTA is dead. Check follows / profile visits conversion; bio must state the promise and link msghealth.net.
4. Paid: NO. Owner decision 2026-11-24: organic only.
5. Trial Reels: blocked, account has 9 followers (needs 200). Keep schedule.json trial null.
6. Cadence: owner said do whatever proves best; the optimizer (ig.mjs optimize) already compares posts/day groups, so leave per_day automatic.
7. Trendjacking (owner asked to study @robertmokeaveney): not yet studied, Instagram could not be read from here. Rule meanwhile: tie each reel to a trend from the last 7 days, hook in the first second, product reveal last.
8. Profile (9 followers, 9.6K views/30d, avatar still purple): bio should name who it is for (barbers and stylists) and what it does, not just the tagline.

## Ledger entries
2026-11-24 night | F1 toy-world (40-55, 16 reels posted 11-23/24) | none in top 15 (all under 150 views) | sends n/a | n/a | follows n/a (per-reel stats not in stats.json) | verdict: no win yet, kill after 3 below median per the rules; capped at 1 in 5
2026-11-24 night | F2 true-story, now black/white + cussing | 56 molasses, 57 Onoda, 58 original fiction queued (not posted yet) | judge after 48h | | | REPLICATE (prior F2 winners: 1,709 / 1,291 / 794)
2026-11-25 night | F2 true-story black/white: 56-60 queued, 61 formosus + 62 meux added | not posted yet, judge after 48h | | | REPLICATE (3 of next 3 reels reuse format, new stories); toy F1 still no win
2026-11-25 afternoon | F2 true-story (older, top 3) | 1,709 / 1,291 / 794 views | sends/reach 0.07% / 0.17% / 0% | follows n/a | still the only clear winner
2026-11-25 afternoon | F2 black/white: 56, 57, 60 posted today | not in top 15 yet (<150), under 12h old | sends n/a | follows n/a | do not judge before 48h
2026-11-25 afternoon | F1 toy-world (11-23 posts now over 48h) | none in top 15 (<150) | sends n/a | follows n/a | no win; account median per reel not available, stays capped at 1 in 5
2026-11-25 afternoon | F2-art (illustrated scenes) 63 erfurt, 64 whale, 65 headless queued | pending | | | TEST vs F2 text slams (56-62), same hour bands, judge after 48h
2026-11-26 night | F2 true-story older top 3 | 1,709 / 1,291 / 794 views | sends/reach 0.07% / 0.17% / 0% | follows n/a | still the only clear winner
2026-11-26 night | F1 toy-world 48-toy-funeral (first newly counted reel) | about 127 to 149 views (inferred from the 20:00 median) | sends n/a | follows n/a | under the 150 cut-off like the other 11-23 toy reels; stays capped at 1 in 5
2026-11-26 night | F2 black/white (56-62) and F2-art (63-65) | not counted yet (under 48h) | | | do not judge
2026-11-26 night | F2-art 66 marathon, 67 pepsi, 68 meat shower queued | pending | | | REPLICATE F2; art vs text-slam test continues, same hour bands
2026-11-26 afternoon | F2 true-story older top 3 | 1,709 / 1,291 / 794 views | sends/reach 0.07% / 0.17% / 0% | follows n/a | unchanged, still the only clear winner
2026-11-26 afternoon | F2 black/white and F2-art posted 11-25/26 (56-68) | not in top 15, which needs 150, and not yet counted (under 48h) | sends n/a | follows n/a | do not judge
2026-11-26 afternoon | F2-art holiday: 69 Black Friday, 70 Small Business Saturday, 71 Cyber Monday queued | pending | | | TEST holiday tie-in (one variable: topic is dated), judge 48h after each posts

