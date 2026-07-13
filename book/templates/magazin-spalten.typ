// Variante „Magazin – Spalten"
//
// Einzelbilder wandern abwechselnd nach links/rechts in eine schmale Spalte,
// der zugehörige Absatz steht daneben. Kein externes Paket, sehr robust.
// Text läuft NICHT unter das Bild – wer das möchte, nimmt „magazin-umfluss".

#import "base.typ": *

#let day(number: 0, title: "", date: "", weather: "", cities: "", blocks: ()) = {
  day-header(number, title, date, weather, cities)
  let i = 0
  let side = "right"
  while i < blocks.len() {
    let b = blocks.at(i)
    let pairable = (b.kind == "img" and not b.main and b.paths.len() == 1
      and i + 1 < blocks.len() and blocks.at(i + 1).kind == "para")
    if pairable {
      let img = img-cell(b.paths.first())
      let txt = render-para(blocks.at(i + 1).words)
      v(0.4em)
      if side == "right" {
        grid(columns: (3.2fr, 2.8fr), column-gutter: 9pt, align: top, txt, img)
      } else {
        grid(columns: (2.8fr, 3.2fr), column-gutter: 9pt, align: top, img, txt)
      }
      v(0.5em)
      side = if side == "right" { "left" } else { "right" }
      i += 2
    } else {
      render-block(b)
      i += 1
    }
  }
}
