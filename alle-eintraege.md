---
layout: default
title: "Alle Einträge"
---

<div class="page-header">
  <h1>📚 Alle Einträge</h1>
  <p class="lead">Eine chronologische Übersicht aller Tagebucheinträge unserer Reise</p>
</div>

{% assign all_day_pages = site.pages | where: "layout", "day" %}

{% if all_day_pages.size > 0 %}

  <div class="grid grid--entries">
    {% comment %} Build hierarchically sorted entries in chronological order (first to last) {% endcomment %}
    {% assign sorted_entries = "" | split: "" %}
    
    {% comment %} Iterate through countries in order {% endcomment %}
    {% for country in site.data.countries %}
      {% assign country_key = country[0] %}
      {% assign country_data = country[1] %}
      
      {% comment %} Iterate through cities in order {% endcomment %}
      {% for city in country_data.cities %}
        {% assign city_key = city[0] %}
        
        {% comment %} Get all entries for this city and sort by day {% endcomment %}
        {% assign city_entries = all_day_pages | where: "country", country_key | where: "city", city_key | sort: "day" %}
        
        {% comment %} Add to sorted list {% endcomment %}
        {% for entry in city_entries %}
          {% assign sorted_entries = sorted_entries | push: entry %}
        {% endfor %}
      {% endfor %}
    {% endfor %}
    
    {% comment %} Display entries in chronological order (no reverse) {% endcomment %}
    {% for entry in sorted_entries %}
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
          <span class="badge badge--primary">Tag {{ entry.day }}</span>
          {% if entry.weather %}
            <span class="badge badge--weather">{{ entry.weather }}</span>
          {% endif %}
        </footer>
      </article>
    {% endfor %}
  </div>

{% else %}

  <div class="no-entries">
    <p>🚀 Noch keine Einträge vorhanden. Die ersten Tagebucheinträge erscheinen hier, sobald die Reise beginnt!</p>
  </div>

{% endif %}

---

**{{ sorted_entries.size }}** {% if sorted_entries.size == 1 %}Eintrag{% else %}Einträge{% endif %} insgesamt

_Zuletzt aktualisiert: {{ "now" | date: "%d. %B %Y" }}_