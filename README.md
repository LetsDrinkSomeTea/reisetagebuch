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
│   └── navigation.html      # Dynamische Navigation
├── _layouts/
│   ├── default.html         # Basis-Layout mit Sidebar
│   ├── country.html         # Länder-Übersichtsseite
│   ├── city.html           # Stadt-Übersichtsseite  
│   └── day.html            # Tägliche Tagebucheinträge
├── _sass/
│   └── main.scss           # SCSS-Styles
├── _templates/             # Vorlagen für neue Inhalte
│   ├── day-template.md
│   └── city-template.md
├── assets/css/
│   └── style.scss
├── japan/                  # Japan-Inhalte
│   ├── index.md            # Japan-Übersicht
│   └── tokyo/              # Tokyo-spezifische Inhalte
│       ├── index.md        # Tokyo-Übersicht
│       ├── tag-1.md        # Tag 1 in Tokyo
│       └── tag-2.md        # Tag 2 in Tokyo
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

1. Kopiere `_templates/day-template.md`
2. Benenne die Datei um: `[country]/[city]/tag-[number].md`
3. Fülle die Front-Matter-Daten aus:

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

## 📱 Browser-Support

- Chrome/Edge (modern versions)
- Firefox (modern versions)  
- Safari (modern versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🎯 SEO & Performance

- Semantic HTML structure
- Meta tags via `jekyll-seo-tag`
- Optimized images
- Fast loading times
- Mobile-friendly design

---

**Happy traveling and happy blogging! 🌟**