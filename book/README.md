# Reisetagebuch als Buch (PDF)

Erzeugt aus den Reise-Einträgen (`journeys/<key>/tag-*.md` + `_data/*.yml`) ein
druckfertiges, dicht gesetztes A5-Buch – ein Band pro Reise, in wählbaren
Layout-Varianten.

Die Website wird davon **nicht** berührt: `build.py` schreibt ausschließlich
nach `book/out/` (per `.gitignore` ignoriert), und `book/` ist in
`_config.yml` von der Jekyll-Verarbeitung ausgeschlossen.

## Nutzung

```bash
# Voraussetzungen (einmalig)
pip install pyyaml Pillow            # Pillow skaliert die Bilder für den Druck
#   sowie Typst: https://github.com/typst/typst  – oder  pip install typst

# Eine Reise bauen (Standard-Layout: magazin-umfluss)
python book/build.py skandinavien-interrail

# Layout wählen
python book/build.py skandinavien-interrail --template magazin-spalten
python book/build.py skandinavien-interrail --template album

# Alle Reisen / alle Layouts (zum Vergleich)
python book/build.py --all
python book/build.py skandinavien-interrail --all-templates

# Nur die Typst-Quelle erzeugen (ohne PDF)
python book/build.py skandinavien-interrail --no-pdf
```

Ergebnis: `book/out/<reise>.<layout>.pdf` (plus Zwischendatei `.typ`).

## Layout-Varianten

Alle Varianten sind bewusst dicht gesetzt (schmale Ränder, kleinere Schrift,
**fortlaufender** Textfluss – Tage beginnen nicht auf neuer Seite):

| Variante          | Charakter                                                        |
| ----------------- | ---------------------------------------------------------------- |
| `magazin-umfluss` | **Standard.** Text fließt eng um abwechselnd platzierte Bilder – neben und unter dem Bild. Wenig Weißraum, redaktioneller Look. |
| `magazin-spalten` | Bild in schmaler Spalte, zugehöriger Text strikt daneben. Ruhiger, klar gerastert. |
| `album`           | Verspielt: leicht gedrehte, überlappende Polaroid-Collagen; Text dicht dazwischen. |

## Wie es funktioniert

| Datei                       | Aufgabe                                                     |
| --------------------------- | ---------------------------------------------------------- |
| `build.py`                  | Liest Markdown + YAML, skaliert Bilder, ordnet Text/Bild leicht um und erzeugt/kompiliert Typst |
| `templates/base.typ`        | Gemeinsames Setup: Titelei, Inhalt, Kapitel-Bänder, Fonts  |
| `templates/<variante>.typ`  | Das jeweilige Tages-Layout (Text/Bild-Verzahnung)          |

- **Kapitel** entstehen automatisch pro Land (Reihenfolge der Tage).
- **Bilder** werden für den Druck auf max. 1600 px herunterskaliert und in
  `book/out/.imgcache/` zwischengespeichert (Originale bleiben unangetastet).
  Ohne Pillow werden die Originale eingebettet – das PDF wird dann sehr groß.
- Einzelbilder werden – wo möglich – mit dem angrenzenden Absatz gepaart
  (der Generator ordnet Text/Bild dafür leicht um), damit wenig Weißraum bleibt.
  Aufeinanderfolgende Bilder werden zu Reihen bzw. Collagen zusammengefasst;
  das „Bild des Tages" (`main.jpg`) erscheint groß.
- Der echte Text­umfluss (`magazin-umfluss`) ist paketfrei per `measure`
  umgesetzt – kein Download aus der Typst-Paketregistrierung nötig.

## Anpassen

Schrift, Farben, Ränder: oben in `templates/base.typ` (`accent`, `margin`,
`set text(...)`). Bildauflösung: `MAX_IMAGE_PX` / `JPEG_QUALITY` in `build.py`.

## Automatischer Bau

`.github/workflows/book.yml` baut die PDFs bei jedem **Release** sowie manuell
(**Actions → Reisebuch (PDF) → Run workflow**, optional mit Reise-Schlüssel und
Layout-Variante). Das Ergebnis liegt als Workflow-**Artefakt** `reisebuch-pdf`
bereit und wird bei einem Release zusätzlich an die Release-Assets angehängt.

## Druck

Das A5-PDF lässt sich direkt bei Print-on-Demand-Diensten (z. B. BoD, epubli)
hochladen. Für echten Druck ggf. Beschnitt/Bundsteg mit dem Anbieter abklären.
