#!/usr/bin/env python3
"""Reisetagebuch → druckfertiges PDF.

Liest die Jekyll-Datendateien (`_data/*.yml`) und die Tageseinträge einer Reise
(`journeys/<key>/tag-*.md`), erzeugt daraus eine Typst-Quelldatei und – wenn
Typst verfügbar ist – ein PDF.

Die Website wird dabei nicht berührt: es wird nur nach `book/out/` geschrieben.

Beispiele
---------
    python3 book/build.py skandinavien-interrail
    python3 book/build.py --all
    python3 book/build.py skandinavien-interrail --no-pdf

Typst wird bevorzugt als Kommandozeilenwerkzeug `typst` genutzt; alternativ
das PyPI-Paket `typst` (``pip install typst``). Ist keines vorhanden, wird nur
die `.typ`-Datei erzeugt.
"""

from __future__ import annotations

import argparse
import re
import shutil
import subprocess
import sys
from pathlib import Path

try:
    import yaml
except ImportError:  # pragma: no cover
    sys.exit("Fehlt: PyYAML  →  pip install pyyaml")

REPO = Path(__file__).resolve().parent.parent
DATA = REPO / "_data"
OUT = REPO / "book" / "out"
IMG_CACHE = OUT / ".imgcache"

# Zielauflösung der eingebetteten Bilder. Ein Bild über die volle Textbreite
# (~113 mm auf A5) braucht bei 300 dpi rund 1330 px – 1600 px lässt Reserve
# fürs Beschneiden und hält die PDF-Größe dennoch klein.
MAX_IMAGE_PX = 1600
JPEG_QUALITY = 82

MONTHS = [
    "", "Januar", "Februar", "März", "April", "Mai", "Juni",
    "Juli", "August", "September", "Oktober", "November", "Dezember",
]
WEEKDAYS = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"]


# ---------------------------------------------------------------------------
# Datendateien
# ---------------------------------------------------------------------------

def load_data():
    def y(name):
        with open(DATA / name, encoding="utf-8") as f:
            return yaml.safe_load(f) or {}
    return y("journeys.yml"), y("cities.yml"), y("countries.yml")


def parse_front_matter(text: str):
    """Trennt YAML-Frontmatter vom Markdown-Rumpf."""
    if not text.startswith("---"):
        return {}, text
    end = text.find("\n---", 3)
    if end == -1:
        return {}, text
    fm = yaml.safe_load(text[3:end]) or {}
    body = text[end + 4:]
    if body.startswith("\n"):
        body = body[1:]
    return fm, body


# ---------------------------------------------------------------------------
# Typst-Hilfen (Strings sicher als Typst-Literale ausgeben)
# ---------------------------------------------------------------------------

def tstr(s: str) -> str:
    """Ein Python-String als Typst-String-Literal (nur \\ und \" escapen)."""
    return '"' + s.replace("\\", "\\\\").replace('"', '\\"') + '"'


# Inline-Auszeichnungen: **fett**, _kursiv_, `code`
_INLINE = re.compile(r"\*\*(?P<b>.+?)\*\*|_(?P<i>[^_]+)_|`(?P<c>[^`]+)`")


def inline_parts(text: str) -> list[str]:
    """Wandelt eine Textzeile in eine Liste von Typst-Ausdrücken um."""
    parts: list[str] = []
    pos = 0
    for m in _INLINE.finditer(text):
        if m.start() > pos:
            parts.append(tstr(text[pos:m.start()]))
        if m.group("b") is not None:
            parts.append(f"strong({tstr(m.group('b'))})")
        elif m.group("i") is not None:
            parts.append(f"emph({tstr(m.group('i'))})")
        elif m.group("c") is not None:
            parts.append(f"raw({tstr(m.group('c'))})")
        pos = m.end()
    if pos < len(text):
        parts.append(tstr(text[pos:]))
    return parts or [tstr("")]


def inline_words(text: str) -> list[str]:
    """Wie `inline_parts`, aber wortweise – jedes Wort ein eigener Typst-
    Ausdruck (Formatierung bleibt pro Wort erhalten). Nötig, damit Layouts den
    Text um ein Bild herum an Wortgrenzen umbrechen können."""
    words: list[str] = []

    def emit(segment: str, wrap):
        for w in segment.split():
            words.append(wrap(w))

    pos = 0
    for m in _INLINE.finditer(text):
        if m.start() > pos:
            emit(text[pos:m.start()], lambda w: tstr(w))
        if m.group("b") is not None:
            emit(m.group("b"), lambda w: f"strong({tstr(w)})")
        elif m.group("i") is not None:
            emit(m.group("i"), lambda w: f"emph({tstr(w)})")
        elif m.group("c") is not None:
            emit(m.group("c"), lambda w: f"raw({tstr(w)})")
        pos = m.end()
    if pos < len(text):
        emit(text[pos:], lambda w: tstr(w))
    return words or [tstr("")]


# ---------------------------------------------------------------------------
# Markdown-Rumpf → Blockliste
# ---------------------------------------------------------------------------

IMG_RE = re.compile(r"^!\[[^\]]*\]\(([^)]+)\)\s*$")

try:
    from PIL import Image, ImageOps
    _HAVE_PIL = True
except ImportError:  # pragma: no cover
    _HAVE_PIL = False


def _resized(src: Path, journey: str, day: int, name: str) -> Path:
    """Erzeugt (gecacht) eine für den Druck herunterskalierte Kopie und gibt
    deren Pfad zurück. Ohne Pillow wird das Original verwendet."""
    if not _HAVE_PIL:
        return src
    dst = IMG_CACHE / journey / f"tag-{day}" / name
    if dst.is_file() and dst.stat().st_mtime >= src.stat().st_mtime:
        return dst
    dst.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(src) as im:
        im = ImageOps.exif_transpose(im)  # Kamera-Rotation berücksichtigen
        if im.mode not in ("RGB", "L"):
            im = im.convert("RGB")
        im.thumbnail((MAX_IMAGE_PX, MAX_IMAGE_PX), Image.LANCZOS)
        im.save(dst, "JPEG", quality=JPEG_QUALITY, optimize=True, progressive=True)
    return dst


def image_path(url: str, journey: str, day: int) -> str | None:
    """Extrahiert den Dateinamen aus einer (getemplateten) Bild-URL, erzeugt
    eine druckoptimierte Kopie und liefert einen absoluten (root-relativen)
    Typst-Pfad. Prüft, ob die Quelldatei existiert."""
    name = url.rstrip("/").split("/")[-1].strip()
    if not name or "{{" in name:
        return None
    rel = Path("journeys") / journey / f"tag-{day}" / name
    src = REPO / rel
    if not src.is_file():
        print(f"  ⚠ Bild fehlt: {rel}", file=sys.stderr)
        return None
    out = _resized(src, journey, day, name)
    return "/" + out.relative_to(REPO).as_posix()


def blocks_from_body(body: str, journey: str, day: int):
    """Zerlegt den Markdown-Rumpf in eine Liste typisierter Blöcke."""
    lines = body.replace("\r\n", "\n").split("\n")
    blocks = []
    i, n = 0, len(lines)

    while i < n:
        line = lines[i]
        stripped = line.strip()

        if stripped == "":
            i += 1
            continue

        # Überschrift
        if stripped.startswith("## "):
            blocks.append(("h2", inline_parts(stripped[3:].strip())))
            i += 1
            continue

        # Bild (evtl. mehrere aufeinanderfolgende → Gruppe)
        m = IMG_RE.match(line.strip())
        if m:
            group = []
            while i < n and IMG_RE.match(lines[i].strip()):
                p = image_path(IMG_RE.match(lines[i].strip()).group(1), journey, day)
                if p:
                    group.append(p)
                i += 1
                # Leerzeilen zwischen Bildern überspringen, aber weiter gruppieren
                while i < n and lines[i].strip() == "":
                    j = i
                    while j < n and lines[j].strip() == "":
                        j += 1
                    if j < n and IMG_RE.match(lines[j].strip()):
                        i = j
                    else:
                        break
            if group:
                blocks.append(("img", group))
            continue

        # Zitat
        if stripped.startswith(">"):
            buf = []
            while i < n and lines[i].strip().startswith(">"):
                buf.append(lines[i].strip()[1:].strip())
                i += 1
            parts = inline_parts(" ".join(buf))
            blocks.append(("quote", parts))
            continue

        # Liste
        if stripped.startswith("- "):
            items = []
            while i < n and lines[i].strip().startswith("- "):
                items.append(inline_parts(lines[i].strip()[2:].strip()))
                i += 1
            blocks.append(("list", items))
            continue

        # Absatz (bis Leerzeile oder Sonderblock). Weiche Zeilenumbrüche im
        # Quelltext werden zu Leerzeichen zusammengefasst (Fließsatz), damit
        # der Satz dicht läuft und um Bilder umbrochen werden kann.
        buf = []
        while i < n:
            cs = lines[i].strip()
            if cs == "" or cs.startswith(("## ", ">", "- ")) or IMG_RE.match(cs):
                break
            buf.append(cs)
            i += 1
        if buf:
            blocks.append(("para", inline_words(" ".join(buf))))

    return blocks


def reorder_blocks(blocks):
    """Ordnet Text/Bild leicht um, damit möglichst jedes Einzelbild direkt von
    einem Absatz gefolgt wird – so kann der Text im Magazin-Layout um das Bild
    fließen statt daneben Weißraum zu lassen. Steht ein Einzelbild sonst vor
    einer Überschrift, tauscht es mit dem vorangehenden Absatz den Platz."""
    out = []
    i, n = 0, len(blocks)
    while i < n:
        cur = blocks[i]
        nxt = blocks[i + 1] if i + 1 < n else None
        after = blocks[i + 2] if i + 2 < n else None
        is_single_img = nxt and nxt[0] == "img" and len(nxt[1]) == 1
        if (cur[0] == "para" and is_single_img
                and (after is None or after[0] != "para")):
            out.append(nxt)   # Bild zuerst …
            out.append(cur)   # … dann der Absatz (fließt nun ums Bild)
            i += 2
        else:
            out.append(cur)
            i += 1
    return out


def _join(parts) -> str:
    """Content-Ausdruck aus einer Teileliste (immer als Tuple → .join())."""
    return "(" + ", ".join(parts) + ",).join()"


def render_blocks(blocks) -> str:
    """Blockliste → Typst-Tuple, das die Vorlage (`day(blocks: ..)`) layoutet.

    Jeder Block ist ein Dictionary mit `kind` und den passenden Feldern. Die
    Struktur ist layout-unabhängig; erst die gewählte Vorlage entscheidet über
    die Anordnung von Text und Bildern."""
    entries = []
    for kind, payload in blocks:
        if kind == "h2":
            entries.append(f'(kind: "h2", body: {_join(payload)})')
        elif kind == "para":
            entries.append(f'(kind: "para", words: ({", ".join(payload)},))')
        elif kind == "img":
            main = "true" if (len(payload) == 1 and payload[0].endswith("/main.jpg")) else "false"
            paths = ", ".join(tstr(p) for p in payload)
            entries.append(f'(kind: "img", paths: ({paths},), main: {main})')
        elif kind == "quote":
            entries.append(f'(kind: "quote", body: {_join(payload)})')
        elif kind == "list":
            items = ", ".join(_join(it) for it in payload)
            entries.append(f'(kind: "list", items: ({items},))')
    return ",\n    ".join(entries)


# ---------------------------------------------------------------------------
# Reise zusammenbauen
# ---------------------------------------------------------------------------

def fmt_date(d) -> str:
    return f"{WEEKDAYS[d.weekday()]}, {d.day}. {MONTHS[d.month]} {d.year}"


def collect_days(journey_key: str):
    days = []
    jdir = REPO / "journeys" / journey_key
    for md in jdir.glob("tag-*.md"):
        text = md.read_text(encoding="utf-8")
        fm, body = parse_front_matter(text)
        if not fm.get("day"):
            continue
        days.append({"fm": fm, "body": body})
    days.sort(key=lambda d: int(d["fm"]["day"]))
    return days


def build_journey(journey_key: str, journeys, cities, countries, template: str) -> str | None:
    meta = journeys.get(journey_key, {})
    days = collect_days(journey_key)
    if not days:
        print(f"  ⚠ Keine Tageseinträge – übersprungen.", file=sys.stderr)
        return None

    # Aggregierte Angaben fürs Cover
    dates = [d["fm"]["date"] for d in days]
    first_d, last_d = dates[0], dates[-1]
    if first_d.month == last_d.month and first_d.year == last_d.year:
        date_range = f"{first_d.day}.–{last_d.day}. {MONTHS[last_d.month]} {last_d.year}"
    else:
        date_range = f"{first_d.day}. {MONTHS[first_d.month]} – {last_d.day}. {MONTHS[last_d.month]} {last_d.year}"

    seen_city, city_order = set(), []
    seen_country = set()
    photo_count = 0
    for d in days:
        for ck in (d["fm"].get("city") or []):
            if ck not in seen_city:
                seen_city.add(ck)
                city_order.append(ck)
            c = cities.get(ck, {})
            if c.get("country"):
                seen_country.add(c["country"])

    def city_name(ck):
        return cities.get(ck, {}).get("name", ck)

    cover_cities = " · ".join(city_name(ck) for ck in city_order)

    out = []
    out.append(f'#import "/book/templates/{template}.typ": *\n')
    out.append("#show: book.with(")
    out.append(f"  journey-name: {tstr(meta.get('name', journey_key))},")
    out.append(f"  description: {tstr(meta.get('description', ''))},")
    out.append(f"  icon: {tstr(meta.get('icon', '📖'))},")
    out.append(f"  date-range: {tstr(date_range)},")
    out.append(f"  cities: {tstr(cover_cities)},")

    # photo_count nach Blockaufbau; vorläufig Platzhalter, wird unten gesetzt.
    stats_idx = len(out)
    out.append("  STATS_PLACEHOLDER")
    out.append(")\n")

    # Tage, gruppiert nach Land (Kapitel)
    current_country = None
    for d in days:
        fm = d["fm"]
        day_no = int(fm["day"])
        city_keys = fm.get("city") or []
        primary_country = cities.get(city_keys[0], {}).get("country") if city_keys else None

        if primary_country != current_country:
            current_country = primary_country
            co = countries.get(primary_country, {}) if primary_country else {}
            out.append(
                f"#chapter(flag: {tstr(co.get('flag', ''))}, name: {tstr(co.get('name', primary_country or ''))})\n"
            )

        blocks = blocks_from_body(d["body"], journey_key, day_no)
        photo_count += sum(len(p) for k, p in blocks if k == "img")
        blocks = reorder_blocks(blocks)

        day_cities = " · ".join(city_name(ck) for ck in city_keys)
        out.append(
            f"#day(number: {day_no}, title: {tstr(fm.get('title', ''))}, "
            f"date: {tstr(fmt_date(fm['date']))}, weather: {tstr(fm.get('weather', ''))}, "
            f"cities: {tstr(day_cities)}, blocks: (\n    "
        )
        out.append(render_blocks(blocks))
        out.append("\n))\n")

    stats = (
        f"  stats: (days: {len(days)}, countries: {len(seen_country)}, "
        f"cities: {len(seen_city)}, photos: {photo_count}),"
    )
    out[stats_idx] = stats
    return "\n".join(out)


# ---------------------------------------------------------------------------
# Typst-Aufruf
# ---------------------------------------------------------------------------

def compile_pdf(typ_path: Path, pdf_path: Path) -> bool:
    cli = shutil.which("typst")
    if cli:
        print(f"  → typst compile ({cli})")
        subprocess.run(
            [cli, "compile", "--root", str(REPO), str(typ_path), str(pdf_path)],
            check=True,
        )
        return True
    try:
        import typst  # type: ignore
        print("  → typst (Python-Paket)")
        typst.compile(str(typ_path), output=str(pdf_path), root=str(REPO))
        return True
    except ImportError:
        print("  ⚠ Kein Typst gefunden – nur .typ erzeugt. "
              "Installiere Typst (https://typst.app) oder `pip install typst`.",
              file=sys.stderr)
        return False


# ---------------------------------------------------------------------------

def available_templates() -> list[str]:
    tdir = REPO / "book" / "templates"
    return sorted(p.stem for p in tdir.glob("*.typ") if not p.stem.startswith(("base", "_")))


DEFAULT_TEMPLATE = "magazin-umfluss"


def main():
    templates = available_templates()
    ap = argparse.ArgumentParser(description="Reisetagebuch als PDF-Buch bauen.")
    ap.add_argument("journeys", nargs="*", help="Reise-Schlüssel (z. B. skandinavien-interrail)")
    ap.add_argument("--all", action="store_true", help="Alle Reisen bauen")
    ap.add_argument("--no-pdf", action="store_true", help="Nur .typ erzeugen, nicht kompilieren")
    ap.add_argument("--template", "-t", default=DEFAULT_TEMPLATE, choices=templates,
                    help=f"Layout-Variante (Standard: {DEFAULT_TEMPLATE})")
    ap.add_argument("--all-templates", action="store_true",
                    help="Jede Reise in allen Layout-Varianten bauen (zum Vergleich)")
    args = ap.parse_args()

    journeys, cities, countries = load_data()

    keys = list(journeys) if args.all else args.journeys
    if not keys:
        ap.error("Bitte mindestens einen Reise-Schlüssel angeben oder --all nutzen.\n"
                 f"Verfügbar: {', '.join(journeys)}")

    templ_keys = templates if args.all_templates else [args.template]

    OUT.mkdir(parents=True, exist_ok=True)
    rc = 0
    for key in keys:
        if key not in journeys:
            print(f"Unbekannte Reise: {key} (verfügbar: {', '.join(journeys)})", file=sys.stderr)
            rc = 1
            continue
        for template in templ_keys:
            print(f"● {key}  [{template}]")
            typ = build_journey(key, journeys, cities, countries, template)
            if typ is None:
                break
            stem = f"{key}.{template}"
            typ_path = OUT / f"{stem}.typ"
            typ_path.write_text(typ, encoding="utf-8")
            print(f"  ✓ {typ_path.relative_to(REPO)}")
            if not args.no_pdf:
                pdf_path = OUT / f"{stem}.pdf"
                if compile_pdf(typ_path, pdf_path):
                    print(f"  ✓ {pdf_path.relative_to(REPO)}")
    sys.exit(rc)


if __name__ == "__main__":
    main()
