# Reisetagebuch als Buch (PDF)

Erzeugt aus den Reise-Einträgen (`journeys/<key>/tag-*.md` + `_data/*.yml`) ein
druckfertiges PDF – ein Band pro Reise, im A5-Format.

Die Website wird davon **nicht** berührt: `build.py` schreibt ausschließlich
nach `book/out/` (per `.gitignore` ignoriert), und `book/` ist in
`_config.yml` von der Jekyll-Verarbeitung ausgeschlossen.

## Nutzung

```bash
# Voraussetzungen (einmalig)
pip install pyyaml Pillow            # Pillow skaliert die Bilder für den Druck
#   sowie Typst: https://github.com/typst/typst  – oder  pip install typst

# Eine Reise bauen
python book/build.py skandinavien-interrail

# Alle Reisen
python book/build.py --all

# Nur die Typst-Quelle erzeugen (ohne PDF)
python book/build.py skandinavien-interrail --no-pdf
```

Ergebnis: `book/out/<reise>.pdf` (und die Zwischendatei `<reise>.typ`).

## Wie es funktioniert

| Datei          | Aufgabe                                                              |
| -------------- | ------------------------------------------------------------------- |
| `build.py`     | Liest Markdown + YAML, skaliert Bilder, erzeugt Typst und ruft es auf |
| `template.typ` | Das Layout (Titelseite, Inhaltsverzeichnis, Kapitel, Tagesseiten)   |

- **Kapitel** werden automatisch pro Land gebildet (Reihenfolge der Tage).
- **Bilder** werden für den Druck auf max. 1600 px herunterskaliert und in
  `book/out/.imgcache/` zwischengespeichert (Originale bleiben unangetastet).
  Ohne Pillow werden die Originale eingebettet – das PDF wird dann sehr groß.
- Aufeinanderfolgende Bilder werden zu einer Bildreihe zusammengefasst; das
  „Bild des Tages" (`main.jpg`) erscheint über die volle Textbreite.

## Anpassen

Schrift, Farben, Seitenformat und Ränder stehen oben in `template.typ`
(z. B. `accent`, `paper: "a5"`, `MAX_IMAGE_PX` in `build.py`).

## Automatischer Bau

`.github/workflows/book.yml` baut die PDFs bei jedem **Release** sowie manuell
(**Actions → Reisebuch (PDF) → Run workflow**, optional mit einem
Reise-Schlüssel). Das Ergebnis liegt als Workflow-**Artefakt** `reisebuch-pdf`
bereit und wird bei einem Release zusätzlich an die Release-Assets angehängt.

## Druck

Das A5-PDF lässt sich direkt bei Print-on-Demand-Diensten (z. B. BoD, epubli)
hochladen. Für echten Druck ggf. Beschnitt/Bundsteg mit dem Anbieter abklären.
