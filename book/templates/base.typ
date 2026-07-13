// Gemeinsame Grundlage für alle Buch-Layouts.
//
// Jede Variante (magazin-spalten, magazin-umfluss, album …) importiert diese
// Datei mit `#import "base.typ": *`, übernimmt Titelei, Inhaltsverzeichnis,
// Kapitel-Bänder und die Inline-Bausteine – und definiert lediglich ihre
// eigene `day(...)`-Funktion (das Zusammenspiel von Text und Bildern).
//
// Alle Varianten sind bewusst DICHT gesetzt: schmale Ränder, kleinere Schrift,
// fortlaufender Textfluss (Tage beginnen nicht auf neuer Seite).

#let accent = rgb("#1a73e8")
#let accent-dark = rgb("#1557b0")
#let muted = rgb("#5f6368")
#let hairline = rgb("#dadce0")

// ---------------------------------------------------------------------------
// Bild-Bausteine
// ---------------------------------------------------------------------------

// Bildzelle mit runden Ecken + Haarlinie. `w` ist relative oder absolute Breite.
#let img-cell(p, w: 100%) = box(clip: true, radius: 3pt, stroke: 0.5pt + hairline, image(p, width: w))

// Polaroid-Rahmen (weißer Rand) – für das Album-Layout.
#let polaroid(p, w) = box(fill: white, inset: 5pt, radius: 2pt, stroke: 0.6pt + hairline, image(p, width: w))

// Bildreihe (mehrere Bilder nebeneinander), dicht gesetzt.
#let img-row(paths, gutter: 4pt) = {
  let n = paths.len()
  let cols = if n == 3 { 3 } else if n >= 4 { 2 } else { n }
  block(above: 0.5em, below: 0.6em, breakable: false,
    grid(columns: (1fr,) * cols, column-gutter: gutter, row-gutter: gutter,
      ..paths.map(p => img-cell(p))))
}

// ---------------------------------------------------------------------------
// Inline-Blöcke, die alle Varianten gleich rendern
// ---------------------------------------------------------------------------

#let render-h2(body) = block(above: 0.85em, below: 0.3em, sticky: true,
  text(size: 10.5pt, weight: "bold", fill: accent-dark, body))

#let render-quote(body) = block(above: 0.7em, below: 0.7em, width: 100%,
  inset: (left: 0.8em, top: 0.4em, bottom: 0.4em, right: 0.5em),
  stroke: (left: 2pt + accent), fill: luma(248),
  text(style: "italic", fill: muted, body))

#let render-list(items) = block(above: 0.4em, below: 0.5em, list(..items))

#let render-para(words) = par(words.join([ ]))

// ---------------------------------------------------------------------------
// Kapitel-Band (pro Land). Beginnt auf neuer Seite, aber kompakt als Band –
// die Tage fließen unmittelbar darunter weiter.
// ---------------------------------------------------------------------------

#let chapter(flag: "", name: "") = {
  pagebreak(weak: true)
  // Unsichtbare Überschrift nur für Inhaltsverzeichnis, Lesezeichen, Kopfzeile.
  heading(level: 1, outlined: true, bookmarked: true)[#name]
  block(width: 100%, above: 0em, below: 0.9em, breakable: false,
    box(fill: accent, inset: (x: 11pt, y: 8pt), radius: 4pt, width: 100%,
      text(fill: white, size: 15pt, weight: "bold")[#flag ~ #name]))
}

// Kopf eines Tages – wird von jeder Variante zu Beginn von `day(..)` genutzt.
#let day-header(number, title, date, weather, cities) = block(sticky: true,
  above: 1.1em, below: 0.45em, {
  heading(level: 2, outlined: true, bookmarked: true)[Tag #number — #title]
  let bits = ()
  if date != "" { bits.push(date) }
  if cities != "" { bits.push(cities) }
  if weather != "" { bits.push(weather) }
  text(size: 8pt, fill: muted, tracking: 0.02em, bits.join("  ·  "))
  v(2pt)
  line(length: 100%, stroke: 0.5pt + hairline)
})

// ---------------------------------------------------------------------------
// Titelseite
// ---------------------------------------------------------------------------

#let cover(journey-name: "", description: "", icon: "", date-range: "", cities: "", stats: (:)) = {
  set page(header: none, footer: none, numbering: none)
  v(1fr)
  align(center)[
    #text(size: 64pt)[#icon]
    #v(0.7em)
    #text(size: 28pt, weight: "bold", fill: accent-dark)[#journey-name]
    #if description != "" [
      #v(0.5em)
      #block(width: 80%, text(size: 12pt, style: "italic", fill: muted)[#description])
    ]
    #v(1.0em)
    #line(length: 38%, stroke: 0.75pt + accent)
    #v(1.0em)
    #if date-range != "" [ #text(size: 11.5pt)[#date-range] \ ]
    #if cities != "" [
      #v(0.4em)
      #block(width: 82%, text(size: 10pt, fill: muted)[#cities])
    ]
  ]
  v(1fr)
  align(center)[
    #let add(v, l) = if v != none [ #box[#align(center)[#text(size: 15pt, weight: "bold", fill: accent-dark)[#v] #linebreak() #text(size: 8pt, fill: muted)[#l]]] ]
    #stack(dir: ltr, spacing: 1.5em,
      ..(
        add(stats.at("days", default: none), "Tage"),
        add(stats.at("countries", default: none), "Länder"),
        add(stats.at("cities", default: none), "Städte"),
        add(stats.at("photos", default: none), "Fotos"),
      ).filter(x => x != none))
  ]
  v(0.5em)
  pagebreak()
}

// ---------------------------------------------------------------------------
// Dokument-Setup (gemeinsam). `render-day` ist die variantenspezifische
// Funktion, die eine Blockliste eines Tages layoutet.
// ---------------------------------------------------------------------------

#let book-doc(
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
    margin: (inside: 14mm, outside: 11mm, top: 12mm, bottom: 13mm),
    numbering: "1",
    number-align: center + bottom,
    header: context {
      let chapters = query(heading.where(level: 1).before(here()))
      let current = if chapters.len() > 0 { chapters.last().body } else { [] }
      set text(size: 7.5pt, fill: muted)
      grid(columns: (1fr, 1fr), align: (left, right), emph(journey-name), current)
      v(-0.5em)
      line(length: 100%, stroke: 0.4pt + hairline)
    },
  )

  set text(font: ("Libertinus Serif",), size: 9.7pt, lang: "de", region: "DE", hyphenate: true)
  set par(justify: true, leading: 0.55em, spacing: 0.58em)
  set list(indent: 0.5em, spacing: 0.45em, marker: text(fill: accent, [•]))

  show heading.where(level: 1): it => none
  show heading.where(level: 2): it => block(below: 3pt,
    text(size: 13pt, weight: "bold", fill: accent-dark, it.body))

  cover(journey-name: journey-name, description: description, icon: icon,
    date-range: date-range, cities: cities, stats: stats)

  {
    set page(header: none)
    show outline.entry.where(level: 1): it => { v(0.5em, weak: true); strong(it) }
    outline(title: [Inhalt], depth: 2, indent: 1.1em)
  }
  pagebreak()
  counter(page).update(1)
  body
}

// Alle Varianten benutzen dasselbe Dokument-Setup; nur `day(..)` unterscheidet
// sich und wird in der jeweiligen Variantendatei definiert.
#let book = book-doc

// Standard-Blockschleife (ohne Text/Bild-Verzahnung). Varianten können sie
// als Rückfall für einzelne Blockarten wiederverwenden.
#let render-block(b) = {
  if b.kind == "h2" { render-h2(b.body) }
  else if b.kind == "para" { render-para(b.words) }
  else if b.kind == "quote" { render-quote(b.body) }
  else if b.kind == "list" { render-list(b.items) }
  else if b.kind == "img" {
    if b.main { block(above: 0.6em, below: 0.7em, align(center, img-cell(b.paths.first(), w: 82%))) }
    else if b.paths.len() == 1 { block(above: 0.5em, below: 0.6em, align(center, img-cell(b.paths.first(), w: 60%))) }
    else { img-row(b.paths) }
  }
}
