#!/usr/bin/env bash
# Cover image for every reel in posting/queue: the frame where the hook is on screen and readable (default 2.6s in).
# Instagram's default is frame 0, which is nearly blank on these reels, so every thumbnail looked the same.
# Usage: scripts/make-covers.sh [NAME ...]   Optional per-reel time: posting/covers/times.json {"13-kongo": 2.8}
set -e
cd "$(dirname "$0")/.."; mkdir -p posting/covers
names=("$@"); [ ${#names[@]} -eq 0 ] && for f in posting/queue/*.mp4; do names+=("$(basename "$f" .mp4)"); done
for n in "${names[@]}"; do
  t=$(python3 -c "import json,os;p='posting/covers/times.json';print((json.load(open(p)) if os.path.exists(p) else {}).get('$n',2.6))")
  ffmpeg -loglevel error -y -ss "$t" -i "posting/queue/$n.mp4" -frames:v 1 -q:v 2 "posting/covers/$n.jpg"; echo "cover $n @ ${t}s"
done
