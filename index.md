---
layout: default
title: "Willkommen"
---

<article class="home-page">
  {% include page-header.html %}

  <!-- Journeys Overview -->
  <section class="journeys-overview">
    <h2>Reisen</h2>
    {% assign journeys = site.data.journeys %}
    <div class="grid grid--cities">
      {% for j in journeys %}
        {% assign j_key = j[0] %}
        {% assign j_data = j[1] %}
        {% assign j_pages = site.pages | where: "layout", "day" | where: "journey", j_key | sort: "date" %}
        {% assign j_count = j_pages.size %}
        {% assign first_page = j_pages | first %}
        {% assign last_page = j_pages | last %}
        {% if j_count > 0 %}
          <article class="card">
            <header>
              <h3>{{ j_data.icon }} {{ j_data.name }}</h3>
            </header>
            <div class="card-content">
              <p>
                {{ j_count }} {% if j_count == 1 %}Eintrag{% else %}Einträge{% endif %}
                {% if first_page and last_page %}<br>
                  {{ first_page.date | date: '%d.%m.%Y' }} – {{ last_page.date | date: '%d.%m.%Y' }}
                {% endif %}
              </p>
            </div>
            <footer>
              <a href="{{ '/journeys/' | append: j_key | append: '/' | relative_url }}">Zur Reise →</a>
            </footer>
          </article>
        {% endif %}
      {% endfor %}
    </div>
  </section>

  <!-- Places Overview -->
  <section class="places-overview">
    <h2>Besuchte Orte</h2>
    {% assign all_days = site.pages | where: "layout", "day" | where: "journey", "unsere-grosse-reise" %}
    {% for country in site.data.countries %}
      {% assign country_key = country[0] %}
      {% assign country_data = country[1] %}
      {%- assign cities_with_entries = 0 -%}
      {%- for city in country_data.cities -%}
        {%- assign city_key = city[0] -%}
        {%- assign city_days = all_days | where: "country", country_key | where: "city", city_key -%}
        {%- if city_days.size > 0 -%}
          {%- assign cities_with_entries = cities_with_entries | plus: 1 -%}
        {%- endif -%}
      {%- endfor -%}
      {% if cities_with_entries > 0 %}
        <h3>{{ country_data.flag }} {{ country_data.name }}</h3>
        <div class="grid grid--cities">
          {% for city in country_data.cities %}
            {% assign city_key = city[0] %}
            {% assign city_data = city[1] %}
            {% assign day_pages = all_days | where: "country", country_key | where: "city", city_key %}
            {% if day_pages.size > 0 %}
              {% assign city_pages = site.pages | where: "layout", "city" | where: "country", country_key | where: "city", city_key %}
              {% assign city_page = nil %}
              {% for p in city_pages %}
                {% if p.path contains 'places/' %}
                  {% assign city_page = p %}
                  {% break %}
                {% endif %}
              {% endfor %}
              {% unless city_page %}
                {% assign city_page = city_pages | first %}
              {% endunless %}
              {% include card.html type="city" item=city_page country_data=country_data city_data=city_data day_pages=day_pages %}
            {% endif %}
          {% endfor %}
        </div>
      {% endif %}
    {% endfor %}
  </section>

  <!-- Latest Entries -->
  <section class="latest-entries-overview">
    <h2>Neueste Einträge</h2>
    {% assign latest = site.pages | where: "layout", "day" | sort: "date" | reverse %}
    <div class="grid grid--days">
      {% for day_page in latest limit: 6 %}
        {% include card.html type="day" item=day_page %}
      {% endfor %}
    </div>
  </section>
</article>
