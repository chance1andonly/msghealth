# Motion graphics prompt (adapted from prompt-motion.com)

Source: the "showreel" template at prompt-motion.com/templates/showreel. The original is a 1920x1080, 15 s, 120 BPM
HTML film that is a pure function of time. The rules below keep what makes it look professional and change what does
not suit a vertical, voiced, 25-45 s reel.

## What we keep
- Every frame is computed from time `t` only. No CSS animations, timers or carried state (our canvas scenes already do this).
- Spring and exponential easing. Motion blur grows with speed (3 sub-frames blended for fast moves).
- One typeface, at most 3 colors plus black and white, one camera language for the whole reel.
- Each scene transforms out of the previous one (shapes, type and color morph), so there are no hard cuts or crossfades.
- Review one frame per beat for clutter, overlap and readability before the full render.
- The final frame is the CTA and echoes the first frame.

## What we change
| Original | For our reels | Why |
|---|---|---|
| 1920x1080, 60 fps | 1080x1920, 30 fps | Reels are vertical; 30 fps is what the pipeline renders. |
| 120 BPM, a beat every 0.5 s | Cut points follow the voiceover lines (`scripts/vo/NAME.json`), not a beat | The voice is the clock. Each spoken line is one scene. |
| Hook is a flourish | Hook is the first spoken line plus one specific number or object on screen by 0.5 s | content-principles: the hook is the first loop. |
| Kick on every beat, hit on each scene change | Quiet sound effects only, nothing under the voice louder than -24 LUFS, no punch or boom | Standing preference: no punch sounds. |
| Riser into the final bar | Optional soft riser (`riser-1s-soft`) into the CTA only | Keeps it calm. |
| Holds under 0.5 s | A held number or word may stay 0.8-1.2 s so it can be read | Phone readability. Text min 64 px, safe area 120 px top and 260 px bottom. |
| 2D-to-3D moment, particle-free | Keep: no particle bursts, glows, lens flares, shake, RGB split, bouncy easing | Matches our "professional, no characters" rule. |
| Showreel of techniques | One technique per spoken line, chosen to show that line's idea (stat, versus, chat, weeks...) | Motion must explain the script, not decorate it. |

## Ready-to-paste prompt
> Make one self-contained HTML canvas film, 1080x1920, 30 fps, [DURATION] seconds, for the script in `scripts/vo/[NAME].json`.
> Every frame is a pure function of time. Spring and exponential easing only, with motion blur that rises with speed.
> One scene per spoken line, each transforming out of the last (shape, type and color morph; no cuts or fades).
> Use one typeface (Inter or Geist, bold weights), at most three colors plus black and white, and no characters or drawings.
> Show the single most specific number, name or object from each line, large, inside the safe area.
> No particle bursts, glows, lens flares, shake, RGB split, bouncy easing or generic gradients.
> The last scene is the CTA "Comment KEEP" and its final frame echoes the first.
> Export a contact sheet with one frame per spoken line and fix clutter, overlap and unreadable text before rendering.

## Sound effects
Library: `assets/sfx/` (199 CC0 sounds, `manifest.json` has each sound's `sync` second). Place a sound so its sync point lands on
the visual moment: `start = event_time - sync`. Defaults:
- text or card sliding in: `swish-soft`, `whoosh-fast-soft`, `swipe-fast-soft`
- number or item appearing: `pop-small-in`, `pop-medium-in`
- chat bubble: `notification-*` soft ones, `keyboard-*` for typing
- scene morph: `whoosh-medium-soft` at -22 dB under voice
- CTA: `riser-1s-soft` then a soft `shimmer`
Keep at most 1 sound per second and none on the hook line's first word.

## Not done
prompt-motion.com, Openverse and itch.io (Earshot) are blocked from this workspace's shell, so only the
showreel template could be read (through the page reader). Other entries need their prompt text pasted in.
