// Variante „Album / Collage"
//
// Fotolastig und verspielt: aufeinanderfolgende Bilder werden zu leicht
// gedrehten, überlappenden Polaroid-Gruppen. Text bleibt Hauptinhalt und
// steht dicht dazwischen.

#import "base.typ": *

// Gedrehtes Polaroid ohne Einfluss auf den Textfluss (reflow: false).
#let po(p, w, ang) = rotate(ang, reflow: false, polaroid(p, w))

// Überlappende Collage für Bildgruppen.
#let collage(paths) = layout(sz => {
  let n = paths.len()
  let W = sz.width
  align(center, if n == 2 {
    stack(dir: ltr, spacing: -30pt,
      po(paths.at(0), W * 0.50, -3deg),
      po(paths.at(1), W * 0.50, 3deg))
  } else if n == 3 {
    stack(dir: ltr, spacing: -24pt,
      po(paths.at(0), W * 0.33, -4deg),
      po(paths.at(1), W * 0.33, 2deg),
      po(paths.at(2), W * 0.33, -2deg))
  } else {
    img-row(paths)
  })
})

#let day(number: 0, title: "", date: "", weather: "", cities: "", blocks: ()) = {
  day-header(number, title, date, weather, cities)
  let rot = 2deg
  for b in blocks {
    if b.kind == "img" {
      if b.main {
        block(above: 0.6em, below: 0.9em, breakable: false,
          align(center, polaroid(b.paths.first(), 68%)))
      } else if b.paths.len() == 1 {
        block(above: 0.6em, below: 0.9em, breakable: false,
          align(center, rotate(rot, reflow: false, polaroid(b.paths.first(), 52%))))
        rot = -rot
      } else {
        block(above: 0.8em, below: 1.0em, breakable: false, collage(b.paths))
      }
    } else {
      render-block(b)
    }
  }
}
