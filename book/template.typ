// Reisetagebuch — Typst-Buchvorlage
//
// Diese Datei definiert das Layout für die gedruckte Ausgabe einer Reise.
// Sie wird von `build.py` nicht verändert – der Generator erzeugt lediglich
// eine `.typ`-Datei, die diese Vorlage importiert und die Inhaltsfunktionen
// (`chapter`, `day`, `para`, `imrow`, …) aufruft.
//
// Farben orientieren sich an der Website (Primärfarbe #1a73e8).

#let accent = rgb("#1a73e8")
#let accent-dark = rgb("#1557b0")
#let muted = rgb("#5f6368")
#let hairline = rgb("#dadce0")

// ---------------------------------------------------------------------------
// Inline-Bausteine für den Fließtext
// ---------------------------------------------------------------------------

// Ein Absatz. Bekommt beliebig viele Teile (Strings oder Inline-Content wie
// `strong(..)`, `emph(..)`, `raw(..)`, `linebreak()`) und fügt sie zusammen.
// Strings werden von Typst wörtlich gesetzt – dadurch braucht der Generator
// keine Markup-Zeichen zu escapen.
#let para(..parts) = par(parts.pos().join())

// Abschnittsüberschrift innerhalb eines Tages (z. B. "🌅 Vormittag").
// Bewusst KEINE echte Heading, damit sie nicht im Inhaltsverzeichnis landet.
#let h2(..parts) = block(
  above: 1.15em,
  below: 0.55em,
  breakable: false,
  text(size: 11pt, weight: "bold", fill: accent-dark, parts.pos().join()),
)

// Aufzählung. `items` ist ein Array aus Content (je Punkt ein Eintrag).
#let ulist(items) = list(..items)

// Zitatblock ("> …" im Markdown). Linke Akzentlinie, kursiv.
#let quote-block(..parts) = block(
  above: 1em,
  below: 1em,
  width: 100%,
  inset: (left: 1em, top: 0.6em, bottom: 0.6em, right: 0.6em),
  stroke: (left: 2pt + accent),
  fill: luma(248),
  text(style: "italic", fill: muted, parts.pos().join()),
)

// Bildreihe. Ein bis mehrere Bildpfade werden als Raster gesetzt.
// - 1 Bild:  einspaltig, mittig
// - 2 Bilder: nebeneinander
// - 3 Bilder: drei Spalten
// - 4+:       zwei Spalten (umbrechend)
// `full` erzwingt volle Textbreite (für das "Bild des Tages").
#let imrow(..paths, full: false) = {
  let ps = paths.pos()
  let n = ps.len()
  let cell(p) = box(clip: true, radius: 3pt, stroke: 0.5pt + hairline, image(p, width: 100%))
  block(above: 0.9em, below: 0.9em, breakable: false, {
    if n == 1 {
      // Einzelbild – volle Breite beim Tagesbild, sonst etwas eingerückt.
      align(center, box(width: if full { 100% } else { 82% }, cell(ps.at(0))))
    } else {
      let cols = if n == 3 { 3 } else { 2 }
      grid(
        columns: (1fr,) * cols,
        column-gutter: 5pt,
        row-gutter: 5pt,
        ..ps.map(cell),
      )
    }
  })
}

// ---------------------------------------------------------------------------
// Struktur: Kapitel (Land) und Tage
// ---------------------------------------------------------------------------

// Kapitel-Öffner pro Land. Große Flagge + Name, beginnt auf neuer Seite.
#let chapter(flag: "", name: "", subtitle: "") = {
  pagebreak(weak: true)
  // Als echte Level-1-Heading, damit sie im Inhaltsverzeichnis und in der
  // Kopfzeile auftaucht. Der eigentliche visuelle Aufbau folgt darunter.
  [
    #heading(level: 1, outlined: true, bookmarked: true)[#name]
  ]
  v(2fr)
  align(center)[
    #text(size: 60pt)[#flag]
    #v(0.6em)
    #text(size: 26pt, weight: "bold", fill: accent-dark)[#name]
    #if subtitle != "" [
      #v(0.4em)
      #text(size: 12pt, fill: muted, style: "italic")[#subtitle]
    ]
  ]
  v(3fr)
  pagebreak(weak: true)
}

// Ein Tageseintrag. `body` ist der zusammengesetzte Inhalt (Absätze, Bilder …).
#let day(number: 0, title: "", date: "", weather: "", cities: "", body) = {
  pagebreak(weak: true)
  // Level-2-Heading für Inhaltsverzeichnis & Kopfzeile.
  heading(level: 2, outlined: true, bookmarked: true)[Tag #number — #title]
  // Sichtbare Metazeile.
  block(below: 1.1em, {
    let bits = ()
    if date != "" { bits.push(date) }
    if cities != "" { bits.push(cities) }
    if weather != "" { bits.push(weather) }
    text(size: 8.5pt, fill: muted, tracking: 0.02em, bits.join("  ·  "))
    v(0.3em)
    line(length: 100%, stroke: 0.5pt + hairline)
  })
  body
}

// ---------------------------------------------------------------------------
// Titelei, Inhaltsverzeichnis und Dokument-Setup
// ---------------------------------------------------------------------------

#let cover(journey-name: "", description: "", icon: "", date-range: "", cities: "", stats: (:)) = {
  set page(header: none, footer: none, numbering: none)
  v(1fr)
  align(center)[
    #text(size: 72pt)[#icon]
    #v(0.8em)
    #text(size: 30pt, weight: "bold", fill: accent-dark)[#journey-name]
    #if description != "" [
      #v(0.6em)
      #block(width: 80%, text(size: 13pt, style: "italic", fill: muted)[#description])
    ]
    #v(1.2em)
    #line(length: 40%, stroke: 0.75pt + accent)
    #v(1.2em)
    #if date-range != "" [ #text(size: 12pt)[#date-range] \ ]
    #if cities != "" [
      #v(0.4em)
      #block(width: 82%, text(size: 10.5pt, fill: muted)[#cities])
    ]
  ]
  v(1fr)
  // Kleine Statistikzeile am Fuß des Covers.
  align(center)[
    #let cells = ()
    #let add(v, l) = if v != none [ #box[#text(size: 15pt, weight: "bold", fill: accent-dark)[#v] #linebreak() #text(size: 8pt, fill: muted)[#l]] ]
    #stack(
      dir: ltr,
      spacing: 1.6em,
      ..(
        add(stats.at("days", default: none), "Tage"),
        add(stats.at("countries", default: none), "Länder"),
        add(stats.at("cities", default: none), "Städte"),
        add(stats.at("photos", default: none), "Fotos"),
      ).filter(x => x != none),
    )
  ]
  v(0.6em)
  pagebreak()
}

// Haupt-Dokumentfunktion. Wird mit `#show: book.with(...)` angewendet.
#let book(
  journey-name: "",
  description: "",
  icon: "",
  date-range: "",
  cities: "",
  stats: (:),
  body,
) = {
  set document(title: journey-name, author: "Julian und Friends")

  set page(
    paper: "a5",
    margin: (inside: 20mm, outside: 15mm, top: 20mm, bottom: 20mm),
    numbering: "1",
    number-align: center + bottom,
    // Laufende Kopfzeile: außen das aktuelle Kapitel (Land), innen der Reisename.
    header: context {
      let page-no = counter(page).get().first()
      // Auf Kapitel-Öffnerseiten keine Kopfzeile.
      let here-chapters = query(heading.where(level: 1).after(here()))
      let chapters = query(heading.where(level: 1).before(here()))
      let current = if chapters.len() > 0 { chapters.last().body } else { [] }
      set text(size: 8pt, fill: muted)
      grid(
        columns: (1fr, 1fr),
        align: (left, right),
        emph(journey-name),
        current,
      )
      v(-0.6em)
      line(length: 100%, stroke: 0.4pt + hairline)
    },
  )

  set text(font: ("Libertinus Serif",), size: 10.5pt, lang: "de", region: "DE", hyphenate: true)
  set par(justify: true, leading: 0.62em, spacing: 0.9em)
  set list(indent: 0.6em, spacing: 0.6em)

  // Überschriften-Stile
  show heading.where(level: 1): it => none  // visuell übernimmt `chapter()`
  show heading.where(level: 2): it => block(
    above: 0em, below: 0.4em,
    text(size: 17pt, weight: "bold", fill: accent-dark, it.body),
  )

  // Titelseite
  cover(
    journey-name: journey-name,
    description: description,
    icon: icon,
    date-range: date-range,
    cities: cities,
    stats: stats,
  )

  // Inhaltsverzeichnis
  {
    set page(header: none)
    show outline.entry.where(level: 1): it => {
      v(0.6em, weak: true)
      strong(it)
    }
    outline(title: [Inhalt], depth: 2, indent: 1.2em)
  }
  pagebreak()

  counter(page).update(1)
  body
}
