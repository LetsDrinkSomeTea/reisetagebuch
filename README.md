# 🌍 Reisetagebuch - Travel Journal

Willkommen zu unserem Reisetagebuch! Diese Jekyll-basierte Website dokumentiert unsere zweimonatige Reise durch Japan, Australien und Skandinavien.

## 🚀 Live Site

Die Website ist verfügbar unter: [https://pages.faigle.dev/reisetagebuch](https://pages.faigle.dev/reisetagebuch)

## 📁 Projektstruktur

```
reisetagebuch/
├── _config.yml              # Jekyll-Konfiguration
├── _data/
│   └── countries.yml        # Länder-Metadaten (Flaggen, Emojis, Städte)
├── _includes/
│   ├── navigation.html      # Dynamische Navigation
│   ├── gallery.html         # Einheitliches Galerie-System (alle Bereiche)
│   └── image-discovery.html # Zentralisierte Bilderkennung
├── _layouts/
│   ├── default.html         # Basis-Layout mit Sidebar
│   ├── country.html         # Länder-Übersichtsseite
│   ├── city.html            # Stadt-Übersichtsseite
│   ├── day.html             # Tägliche Tagebucheinträge
│   └── gallery.html         # Galerie-Seite
├── _sass/
│   └── main.scss            # SCSS-Styles
├── _templates/              # Vorlagen für neue Inhalte
│   ├── day-template.md
│   └── city-template.md
├── assets/css/
│   └── style.scss
├── japan/                  # Japan-Inhalte
│   ├── index.md            # Japan-Übersicht
│   └── tokyo/              # Tokyo-spezifische Inhalte
│       ├── index.md        # Tokyo-Übersicht
│       ├── tag-1/          # Tag 1 Bilder-Verzeichnis
│       │   ├── main.jpg    # Hauptbild (Bild des Tages)
│       │   ├── morning.jpg # Vormittag-Aktivität
│       │   ├── breakfast.jpg # Frühstück
│       │   ├── lunch.jpg   # Mittagessen
│       │   ├── afternoon.jpg # Nachmittag-Aktivität
│       │   ├── evening.jpg # Abend-Aktivität
│       │   └── dinner.jpg  # Abendessen
│       ├── tag-1.md        # Tag 1 Tagebucheintrag
│       ├── tag-2/          # Tag 2 Bilder-Verzeichnis
│       └── tag-2.md        # Tag 2 Tagebucheintrag
├── australien/             # (Struktur wie Japan)
├── skandinavien/           # (Struktur wie Japan)
└── index.md               # Homepage
```

## ✨ Features

### 🧭 Automatische Navigation

- Navigation wird automatisch basierend auf vorhandenen Dateien generiert
- Hierarchische Struktur: Länder → Städte → Tage
- Zeigt automatisch die Anzahl der Tagebucheinträge pro Stadt
- "Neueste Einträge" Sektion mit den letzten 5 Einträgen
- Dedizierte "Galerie" Link für alle Bilder

### 📸 Erweiterte Galerie-Funktionen

- **Popup-Modal System**: Bilder öffnen sich in Vollbild-Overlays
- **Hauptgalerie** (`/galerie/`): Zeigt alle Bilder aus allen Städten und Tagen
- **Stadt-Galerien**: Zeigen nur die "Bilder des Tages" pro Stadt
- **Länder-Galerien**: Zeigen alle "Bilder des Tages" eines Landes
- **Navigation im Modal**: Pfeiltasten und Touch-Gesten zum Durchblättern
- **Intelligente Bildorganisation**: 7 Bildkategorien pro Tag

### 📱 Responsive Design

- Mobile-first Design mit Touch-freundlicher Navigation
- Hamburger-Menü für mobile Geräte
- Optimiert für verschiedene Bildschirmgrößen

### 🎨 Modernes Layout

- Sauberes, lesbares Design mit Sidebar-Navigation
- Country-spezifische Emojis und Flaggen
- Card-basiertes Layout für Übersichten
- Breadcrumb-Navigation auf allen Seiten

### 🔄 GitHub Pages Integration

- Automatische Bereitstellung via GitHub Actions
- Optimiert für GitHub Pages (keine benutzerdefinierten Plugins)
- Automatische Builds bei Push auf main branch

## 📝 Content-Erstellung

### Neuen Tagebucheintrag hinzufügen

1. **Erstelle Bild-Verzeichnis**: `mkdir [country]/[city]/tag-[number]/`
2. **Füge Bilder hinzu** (optional, bis zu 7 Bilder):
   - `main.jpg` - Hauptbild (Bild des Tages)
   - `morning.jpg` - Vormittag-Aktivität
   - `breakfast.jpg` - Frühstück
   - `lunch.jpg` - Mittagessen
   - `afternoon.jpg` - Nachmittag-Aktivität
   - `evening.jpg` - Abend-Aktivität
   - `dinner.jpg` - Abendessen
3. **Kopiere Template**: `cp _templates/day-template.md [country]/[city]/tag-[number].md`
4. **Aktualisiere Front-Matter**:

```yaml
---
layout: day
title: "Tag 1 in Tokyo - Ankunft"
date: 2024-03-15
country: japan
city: tokyo
day: 1
weather: "Sonnig, 22°C"
---
```

### Neue Stadt hinzufügen

1. Kopiere `_templates/city-template.md`
2. Speichere als `[country]/[city]/index.md`
3. Erstelle einen Ordner für die Stadt: `[country]/[city]/`
4. Füge die Stadt zu `_data/countries.yml` hinzu:

```yaml
japan:
  cities:
    neue_stadt:
      name: "Neue Stadt"
      emoji: "🏙️"
```

### Neues Land hinzufügen

1. Erstelle einen neuen Ordner: `[country]/`
2. Erstelle `[country]/index.md` mit Layout: `country`
3. Füge das Land zu `_data/countries.yml` hinzu
4. Die Navigation wird automatisch aktualisiert

## 🛠️ Lokale Entwicklung

```bash
# Repository klonen
git clone https://github.com/letsdrinksometea/reisetagebuch.git
cd reisetagebuch

# Dependencies installieren
bundle install

# Lokalen Server starten
bundle exec jekyll serve

# Site ist verfügbar unter http://localhost:4000/reisetagebuch
```

## 🎛️ UI System (Dev Server)

- Design Tokens (CSS Vars): colors, spacing, radius, typography under `:root` in `assets/css/style.scss`.
- Components: `.card`, `.badge`, `.grid` (responsive), `.gallery__*`, `.modal__*`, `.breadcrumb`.
- Navigation: data-driven journeys and cities; only shows items with real day entries.
- Density: compact spacing default. Skip link and focus styles for a11y.
- Content rules: journeys/cities incrementally appear as new `journeys/<slug>/tag-<n>.md` are added; places are shown but empty cities are hidden.

### Token naming
- Prefer alias tokens moving forward: `--color-*`, `--spacing-*`, `--radius-*` (mapped internally to legacy variables for now).
- Examples: `--color-primary`, `--color-text`, `--spacing-3`, `--radius-md`.

## ✅ Lighthouse Checklist

- Build locally: `bundle exec jekyll serve --livereload` and open the local URL.
- Chrome DevTools → Lighthouse → categories: Performance, Accessibility, Best Practices, SEO.
- Targets
  - Performance ≥ 90 on broadband; CPU 4x slowdown may dip slightly.
  - Accessibility ≥ 95 (focus-visible, contrast, landmarks present).
  - Best Practices/SEO ≥ 90.
- Quick wins
  - Keep images ≤ 2 MB, serve correct dimensions, prefer modern formats if possible.
  - Ensure alt text for images in content; modal uses titles automatically.
  - Avoid large layout shifts: use provided gallery aspect-ratio containers.

## 📊 Konfiguration

### Länder-Metadaten (`_data/countries.yml`)

```yaml
japan:
  name: "Japan"
  flag: "🇯🇵"
  emoji: "🏯"
  cities:
    tokyo:
      name: "Tokyo"
      emoji: "🗼"
```

### Site-Konfiguration (`_config.yml`)

Wichtige Einstellungen:

- `baseurl: "/reisetagebuch"` - für GitHub Pages
- `url: "https://pages.faigle.dev"` - deine Domain
- `timezone: Europe/Berlin` - lokale Zeitzone

## 🚀 Deployment

Das Projekt wird automatisch über GitHub Actions bereitgestellt:

1. Push deine Änderungen auf `main` branch
2. GitHub Actions baut die Site automatisch
3. Die Site wird auf GitHub Pages veröffentlicht

## 📸 Galerie-System

### Bildorganisation

- **Verzeichnisstruktur**: `[country]/[city]/tag-[number]/[bildtyp].jpg`
- **7 Bildkategorien**: main, morning, breakfast, lunch, afternoon, evening, dinner
- **Automatische Erkennung**: System erkennt vorhandene Bilder automatisch
- **Flexibel**: Nicht alle Bildkategorien müssen verwendet werden

### Galerie-Typen

1. **Hauptgalerie** (`/galerie/`): Alle Bilder mit Stadt + Tag Information
2. **Stadt-Galerien**: Nur `main.jpg` Bilder einer Stadt
3. **Länder-Galerien**: Nur `main.jpg` Bilder eines Landes

### Modal-Features

- **Vollbild-Anzeige**: Bilder in originaler Größe
- **Keyboard Navigation**: ESC (schließen), ←/→ (vor/zurück)
- **Touch-Gesten**: Wischen für Navigation auf mobilen Geräten
- **Informationsanzeige**: Tag, Stadt, Land im Modal-Titel

## 📱 Browser-Support

- Chrome/Edge (modern versions)
- Firefox (modern versions)
- Safari (modern versions)
- Mobile browsers (iOS Safari, Chrome Mobile)
- **JavaScript erforderlich**: Für Modal-Galerie-Funktionen

## 🎯 SEO & Performance

- Semantic HTML structure
- Meta tags via `jekyll-seo-tag`
- Optimized images
- Fast loading times
- Mobile-friendly design

---

**Happy traveling and happy blogging! 🌟**
