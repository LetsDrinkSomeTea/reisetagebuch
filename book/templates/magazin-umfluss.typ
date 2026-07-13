// Variante „Magazin – Umfluss"
//
// Wie „Magazin – Spalten", aber der Text fließt eng ums Bild: neben dem Bild
// beginnend und darunter über die volle Breite weiterlaufend. Umgesetzt mit
// eigener `measure`-basierter Funktion – kein externes Typst-Paket nötig.

#import "base.typ": *

// Setzt `words` (wortweise Content-Liste) um ein Bild herum.
#let wrap-around(path, words, ratio: 0.44, gap: 9pt, side: "right") = layout(sz => context {
  let iw = sz.width * ratio
  let ib = img-cell(path, w: iw)
  let ih = measure(ib).height
  let narrow = sz.width - iw - gap
  // Größtes k finden, sodass die ersten k Wörter neben das Bild passen.
  let lo = 0
  let hi = words.len()
  while lo < hi {
    let mid = calc.ceil((lo + hi) / 2)
    let h = measure(box(width: narrow, par(words.slice(0, mid).join([ ])))).height
    if h <= ih { lo = mid } else { hi = mid - 1 }
  }
  let k = lo
  let tb = box(width: narrow, par(words.slice(0, k).join([ ])))
  block(breakable: false, if side == "right" {
    grid(columns: (narrow, iw), column-gutter: gap, align: top, tb, ib)
  } else {
    grid(columns: (iw, narrow), column-gutter: gap, align: top, ib, tb)
  })
  if k < words.len() { par(words.slice(k).join([ ])) }
})

#let day(number: 0, title: "", date: "", weather: "", cities: "", blocks: ()) = {
  day-header(number, title, date, weather, cities)
  let i = 0
  let side = "right"
  while i < blocks.len() {
    let b = blocks.at(i)
    let pairable = (b.kind == "img" and not b.main and b.paths.len() == 1
      and i + 1 < blocks.len() and blocks.at(i + 1).kind == "para")
    if pairable {
      v(0.4em)
      wrap-around(b.paths.first(), blocks.at(i + 1).words, side: side)
      v(0.3em)
      side = if side == "right" { "left" } else { "right" }
      i += 2
    } else {
      render-block(b)
      i += 1
    }
  }
}
