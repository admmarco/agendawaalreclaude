"""Vult data/claude/coords.json aan met coördinaten voor locaties en voorzieningen.

De bestanden uit agenda-Waalre blijven ongewijzigd; coördinaten staan apart,
gekoppeld op id (locaties) of naam (voorzieningen). Bestaande coördinaten worden
niet overschreven, zodat handmatige correcties blijven staan.
Bron: OpenStreetMap Nominatim (max. 1 verzoek per seconde).
"""
import json, os, time, urllib.parse, urllib.request

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "data")
OUT = os.path.join(ROOT, "claude", "coords.json")


def load(name):
    d = json.load(open(os.path.join(ROOT, name), encoding="utf-8"))
    return d if isinstance(d, list) else next(v for v in d.values() if isinstance(v, list))


def geocode(q):
    url = "https://nominatim.openstreetmap.org/search?" + urllib.parse.urlencode(
        {"format": "json", "limit": 1, "countrycodes": "nl", "q": q,
         "viewbox": "5.38,51.43,5.53,51.35", "bounded": 1})
    req = urllib.request.Request(url, headers={"User-Agent": "agendawaalre-claude"})
    r = json.load(urllib.request.urlopen(req, timeout=20))
    time.sleep(1.1)
    return (round(float(r[0]["lat"]), 6), round(float(r[0]["lon"]), 6)) if r else None


def main():
    coords = json.load(open(OUT, encoding="utf-8")) if os.path.exists(OUT) else {}
    todo = [("venue:" + v["id"], v.get("address"), v.get("postcode"), v["name"]) for v in load("venues.json")]
    todo += [("voorziening:" + v["name"], v.get("address"), None, v["name"]) for v in load("voorzieningen.json")]
    missing = []
    for key, addr, pc, name in todo:
        if key in coords or not addr:
            continue
        hit = geocode(f"{addr}, {pc or ''} Waalre") or geocode(f"{addr}, Waalre") or geocode(f"{name}, Waalre")
        if hit:
            coords[key] = {"lat": hit[0], "lng": hit[1], "bron": "OpenStreetMap"}
        else:
            missing.append(key)
        print(key, hit)
    json.dump(coords, open(OUT, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    if missing:
        print("Niet gevonden (handmatig toevoegen):", ", ".join(missing))


if __name__ == "__main__":
    main()
