#!/usr/bin/env bash
# Haalt de nieuwste gegevens op uit de (privé) repository agenda-Waalre.
# Alleen lezen: agenda-Waalre wordt nooit aangepast.
# Gebruik: scripts/ververs-data.sh   (vereist: gh, ingelogd als eigenaar)
set -euo pipefail
cd "$(dirname "$0")/../data"
GH="${GH:-gh}"
command -v "$GH" >/dev/null || GH="$HOME/.local/bin/gh"
REPO="admmarco/agenda-Waalre"
for f in events venues organizations voorzieningen bedrijven; do
  "$GH" api -H "Accept: application/vnd.github.raw" "repos/$REPO/contents/data/$f.json" > "$f.json.tmp"
  python3 -c "import json,sys; json.load(open(sys.argv[1]))" "$f.json.tmp"
  mv "$f.json.tmp" "$f.json"
done
"$GH" api "repos/$REPO/commits/main" --jq '.sha[0:7]' > SOURCE_COMMIT
echo "Bijgewerkt naar agenda-Waalre commit $(cat SOURCE_COMMIT)."
echo "Nieuwe locaties zonder coördinaten? Draai: python3 scripts/coordinaten.py"
