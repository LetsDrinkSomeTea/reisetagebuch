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
          <option value="{{ city[0] }}" data-country="{{ country[0] }}">{{ city[1].name }}</option>
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
    {% assign city_names = "" %}
    {% for c in entry.city %}
      {% assign c_data = country_data.cities[c] %}
      {% assign city_names = city_names | append: c_data.name %}
      {% unless forloop.last %}{% assign city_names = city_names | append: ", " %}{% endunless %}
    {% endfor %}
    <article class="card card--entry" data-journey="{{ entry.journey }}" data-country="{{ entry.country }}" data-city="{{ entry.city | join: ',' }}" data-date="{{ entry.date | date: '%Y-%m-%d' }}">
      <header>
        <div class="entry-location">{{ country_data.flag }} {{ city_names }}, {{ country_data.name }}</div>
        <time datetime="{{ entry.date | date: '%Y-%m-%d' }}">{{ entry.date | date: '%d. %B %Y' }}</time>
      </header>
      <h4><a href="{{ entry.url | relative_url }}">{{ entry.title }}</a></h4>
    </article>
  {% endfor %}
</div>

<script>
document.addEventListener('DOMContentLoaded', () => {
  const filters = {
    journey: document.getElementById('filter-journey'),
    country: document.getElementById('filter-country'),
    city: document.getElementById('filter-city'),
    date: document.getElementById('filter-date')
  };

  const entries = Array.from(document.querySelectorAll('#entries .card'));
  const allCityOptions = Array.from(filters.city.querySelectorAll('option'));

  const updateCityOptions = () => {
    const c = filters.country.value;
    filters.city.innerHTML = '<option value="">Alle</option>';
    allCityOptions
      .filter(opt => !c || opt.dataset.country === c)
      .forEach(opt => filters.city.appendChild(opt.cloneNode(true)));
  };

  const applyFilters = () => {
    entries.forEach(card => {
      const visible = Object.entries(filters).every(([key, el]) => {
        if (!el.value) return true;
        if (key === 'city') return card.dataset.city.split(',').includes(el.value);
        return card.dataset[key] === el.value;
      });
      card.toggleAttribute('hidden', !visible);
    });
  };

  Object.values(filters).forEach(el => el.addEventListener('input', () => {
    if (el === filters.country) updateCityOptions();
    applyFilters();
  }));

  updateCityOptions();
  applyFilters();
});
</script>
