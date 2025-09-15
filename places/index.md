---
layout: default
title: "Besuchte Orte"
permalink: /places/
---

{% assign entries = site.pages | where: "layout", "day" %}

<section class="countries">
  <h2>📍 Länder</h2>
  <ul>
    {% for country in site.data.countries %}
      {% assign country_key = country[0] %}
      {% assign country_data = country[1] %}
      {% assign country_entries = entries | where: "country", country_key %}
      {% if country_entries.size > 0 %}
        <li><a href="{{ '/places/' | append: country_key | append: '/' | relative_url }}">{{ country_data.flag }} {{ country_data.name }}</a></li>
      {% endif %}
    {% endfor %}
  </ul>
</section>

<section class="cities">
  <h2>🏙️ Städte</h2>
  <ul>
    {% for country in site.data.countries %}
      {% assign country_key = country[0] %}
      {% assign country_data = country[1] %}
      {% for city in country_data.cities %}
        {% assign city_key = city[0] %}
        {% assign city_entries = entries | where: "country", country_key | where_exp: "item", "item.city contains city_key" %}
        {% if city_entries.size > 0 %}
          <li><a href="{{ '/places/' | append: country_key | append: '/' | append: city_key | append: '/' | relative_url }}">{{ country_data.flag }} {{ city[1].name }}</a></li>
        {% endif %}
      {% endfor %}
    {% endfor %}
  </ul>
</section>
