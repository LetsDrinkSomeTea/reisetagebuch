---
layout: default
title: "Besuchte Orte"
permalink: /besuchte-orte/
---

<article class="visited-places-page">
  {% include page-header.html %}

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
      <section class="country-places">
        <h2>{{ country_data.flag }} {{ country_data.name }}</h2>
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
      </section>
    {% endif %}
  {% endfor %}
</article>
