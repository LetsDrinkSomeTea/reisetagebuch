---
layout: default
title: "Unser Reisetagebuch"
---

<div class="page-header">
  <h1>🌍 Willkommen!</h1>
  <p class="lead">Weil sich es einige (damit meine ich 2 Personen) gewünscht haben, hier ein kleiner Blog über: <br><strong> Unsere große Reise™</strong></p>
</div>

{% assign all_day_pages = site.pages | where: "layout", "day" %}

{% if all_day_pages.size > 0 %}

  <h2>📖 Neueste Einträge</h2>

  <div class="grid grid--entries">
    {% comment %} Build hierarchically sorted entries {% endcomment %}
    {% assign recent_entries = "" | split: "" %}
    
    {% comment %} Iterate through countries in order {% endcomment %}
    {% for country in site.data.countries %}
      {% assign country_key = country[0] %}
      {% assign country_data = country[1] %}
      
      {% comment %} Iterate through cities in order {% endcomment %}
      {% for city in country_data.cities %}
        {% assign city_key = city[0] %}
        
        {% comment %} Get all entries for this city and sort by day {% endcomment %}
        {% assign city_entries = all_day_pages | where: "country", country_key | where_exp: "item", "item.city contains city_key" | sort: "index" %}
        
        {% comment %} Add to recent entries list {% endcomment %}
        {% for entry in city_entries %}
          {% assign recent_entries = recent_entries | push: entry %}
        {% endfor %}
      {% endfor %}
    {% endfor %}
    
    {% comment %} Reverse for "recent first" display {% endcomment %}
    {% assign recent_entries = recent_entries | reverse %}
    
    {% for entry in recent_entries limit: 6 %}
      {% assign country_data = site.data.countries[entry.country] %}
      {% assign city_data = country_data.cities[entry.city] %}
      <article class="card card--entry">
        <header>
          <div class="entry-location">{{ country_data.flag }} {{ city_data.name }}, {{ country_data.name }}</div>
          <time datetime="{{ entry.date | date: '%Y-%m-%d' }}">{{ entry.date | date: '%d. %B %Y' }}</time>
        </header>
        <h4><a href="{{ entry.url | relative_url }}">{{ entry.title }}</a></h4>
        {% if entry.excerpt %}
          <p>{{ entry.excerpt | strip_html | truncate: 150 }}</p>
        {% endif %}
        <footer>
          <span class="badge badge--primary">Tag {{ entry.index }}</span>
          {% if entry.weather %}
            <span class="badge badge--weather">{{ entry.weather }}</span>
          {% endif %}
        </footer>
      </article>
    {% endfor %}
  </div>
  <h2>🗺️ Unsere Reiseroute</h2>

  <div class="grid grid--countries">
    {% for country in site.data.countries %}
      {% assign country_key = country[0] %}
      {% assign country_data = country[1] %}

      {% assign country_day_pages = all_day_pages | where: "country", country_key %}

      {% if country_day_pages.size > 0 %}
        <div class="card card--country">
          <h3>
            <a href="{{ '/places/' | append: country_key | append: '/' | relative_url }}">
              {{ country_data.flag }} {{ country_data.name }} {{ country_data.emoji }}
            </a>
          </h3>

          {% assign cities_with_content = "" | split: "," %}
        {% for day in country_day_pages %}
          {% for c in day.city %}
            {% unless cities_with_content contains c %}
              {% assign cities_with_content = cities_with_content | push: c %}
            {% endunless %}
          {% endfor %}
        {% endfor %}

          <div class="country-stats">
            <span>{{ cities_with_content.size }} {% if cities_with_content.size == 1 %}Stadt{% else %}Städte{% endif %}</span>
            <span>{{ country_day_pages.size }} {% if country_day_pages.size == 1 %}Eintrag{% else %}Einträge{% endif %}</span>
          </div>

          <div class="cities-preview">
            {% for city_key in cities_with_content limit: 8 %}
              {% assign city_data = country_data.cities[city_key] %}
              <span class="city-tag">{{ city_data.emoji }} {{ city_data.name }}</span>
            {% endfor %}
            {% if cities_with_content.size > 4 %}
              <span class="city-tag">&hellip;</span>
            {% endif %}
          </div>
        </div>
      {% endif %}
    {% endfor %}

  </div>
{% else %}

  <div class="no-entries">
    <p>🚀 Die Reise beginnt bald! Hier werden unsere Tagebucheinträge erscheinen, sobald das Abenteuer startet.</p>
  </div>

{% endif %}

### ℹ️ Über dieses Tagebuch

**Navigation:** Nutze die Seitenleiste, um zwischen den Ländern, Städten und einzelnen Tagen zu navigieren. Die Seite wird automatisch aktualisiert, sobald neue Einträge hinzugefügt werden.

**Bilder:** Jeden Tag gibt es ein "Bild des Tages", das wird auch auf der Seite der jeweiligen Stadt/des jeweiligen Landes angezeigt. Alle anderen Fotos werden nur auf der Seite des Tages oder in der [Galerie]({{ "galerie" | relative_url }}) angezeigt.

---

_Zuletzt aktualisiert: {{ "now" | date: "%d. %B %Y" }}_
