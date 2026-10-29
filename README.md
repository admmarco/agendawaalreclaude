# Agenda Waalre — Claude-versie

Statische website voor nieuwe inwoners van Aalst en Waalre: wat is er deze week te doen, waar ontmoet je mensen, en hoe zit het dorp in elkaar. Nederlands en Engels (knop NL/EN rechtsboven, of `?lang=en`). Niet geïndexeerd (`robots.txt` en `noindex` op elke pagina).

## Pagina's

| Bestand | Inhoud |
|---|---|
| `index.html` | **Deze week**: activiteiten van vandaag, dit weekend of de komende 7 dagen, filter op soort; `?venue=<id>` toont één plek |
| `kaart.html` | **Kaart** (Leaflet + OpenStreetMap): ontmoetingsplekken, koffie & eten, rondleidingen, winkels. Ondersteunt `#venue-<id>`, `#horeca-<id>` en `?lat=..&lng=..&label=..` |
| `rondleidingen.html` | **Rondleidingen**: vier routes met kaart, stops en koffieadressen; `#erfgoed`, `#cultuur`, `#sport`, `#winkels`; afdrukbaar op A4 |
| `jaarkalender.html` | **Jaarkalender 2027** per maand, plus "Datum nog niet bekend" |

Code staat in `assets/`: `style.css` (gedeelde stijl), `common.js` (taal, kop/voet, datums) en per pagina `week.js`, `kaart.js`, `routes.js`, `jaar.js`. Geen build-stap nodig.

## Gegevens

- `data/events.json`, `venues.json`, `voorzieningen.json`, `organizations.json`, `bedrijven.json` en `SOURCE_COMMIT` komen ongewijzigd uit de repository agenda-Waalre.
- `data/claude/` bevat wat deze versie toevoegt: `coords.json` (coördinaten van locaties en voorzieningen), `horeca.json`, `rondleidingen.json` en `jaarkalender-2027.json`.

## Gegevens verversen

```bash
scripts/ververs-data.sh          # haalt de nieuwste data uit agenda-Waalre (vereist gh)
python3 scripts/coordinaten.py   # vult ontbrekende coördinaten aan in data/claude/coords.json
```

## Lokaal bekijken

De pagina's laden JSON via `fetch`, dus open ze via een webserver en niet als bestand:

```bash
python3 -m http.server 8000
# daarna http://localhost:8000
```

Op Vercel zorgt `vercel.json` (`cleanUrls`) ervoor dat `/kaart` ook werkt.
