---
layout: default
title: "Alle Einträge"
permalink: /alle-eintraege/
---

<div class="page-header">
  <h1>📚 Alle Einträge</h1>
  <p class="lead">Eine chronologische Übersicht aller Tagebucheinträge unserer Reise</p>
</div>

<div class="filters">
  <label>Reise:
    <select id="filter-journey">
      <option value="">Alle</option>
      {% for j in site.data.journeys %}
        <option value="{{ j[0] }}">{{ j[1].name }}</option>
      {% endfor %}
    </select>
  </label>
  <label>Land:
    <select id="filter-country">
      <option value="">Alle</option>
      {% for country in site.data.countries %}
        <option value="{{ country[0] }}">{{ country[1].name }}</option>
      {% endfor %}
    </select>
  </label>
  <label>Stadt:
    <select id="filter-city">
      <option value="">Alle</option>
      {% for country in site.data.countries %}
        {% for city in country[1].cities %}
          <option value="{{ city[0] }}">{{ city[1].name }}</option>
        {% endfor %}
      {% endfor %}
    </select>
  </label>
  <label>Datum:
    <input type="date" id="filter-date">
  </label>
</div>

<div class="grid grid--entries" id="entries">
  {% assign entries = site.pages | where: "layout", "day" | sort: "date" %}
  {% for entry in entries %}
    {% assign country_data = site.data.countries[entry.country] %}
    {% assign first_city = entry.city | first %}
    {% assign city_data = country_data.cities[first_city] %}
    <article class="card card--entry" data-journey="{{ entry.journey }}" data-country="{{ entry.country }}" data-city="{{ first_city }}" data-date="{{ entry.date | date: '%Y-%m-%d' }}">
      <header>
        <div class="entry-location">{{ country_data.flag }} {{ city_data.name }}, {{ country_data.name }}</div>
        <time datetime="{{ entry.date | date: '%Y-%m-%d' }}">{{ entry.date | date: '%d. %B %Y' }}</time>
      </header>
      <h4><a href="{{ entry.url | relative_url }}">{{ entry.title }}</a></h4>
      <footer>
        <span class="badge badge--primary">Tag {{ entry.index }}</span>
      </footer>
    </article>
  {% endfor %}
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
  const journey = document.getElementById('filter-journey');
  const country = document.getElementById('filter-country');
  const city = document.getElementById('filter-city');
  const date = document.getElementById('filter-date');
  const entries = document.querySelectorAll('#entries .card');

  function applyFilters() {
    entries.forEach(e => {
      const matchJourney = !journey.value || e.dataset.journey === journey.value;
      const matchCountry = !country.value || e.dataset.country === country.value;
      const matchCity = !city.value || e.dataset.city === city.value;
      const matchDate = !date.value || e.dataset.date === date.value;
      if (matchJourney && matchCountry && matchCity && matchDate) {
        e.style.display = '';
      } else {
        e.style.display = 'none';
      }
    });
  }
  [journey, country, city, date].forEach(el => el.addEventListener('change', applyFilters));
});
</script>
