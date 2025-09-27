---
layout: default
title: "Alle Einträge"
permalink: /alle-eintraege/
---

<article class="entries-page">
  {% include page-header.html %}

  <section class="days-overview">
    <h2>Tagebucheinträge</h2>
    <div class="filter-controls" id="entries-controls">
      <label>
        Reise:
        <select id="entriesFilterJourney">
          <option value="">Alle</option>
          {% for j in site.data.journeys %}
            <option value="{{ j[0] }}">{{ j[1].name }}</option>
          {% endfor %}
        </select>
      </label>
      <label>
        Land:
        <select id="entriesFilterCountry">
          <option value="">Alle</option>
          {% for c in site.data.countries %}
            <option value="{{ c[0] }}">{{ c[1].name }}</option>
          {% endfor %}
        </select>
      </label>
      <label>
        Stadt:
        <select id="entriesFilterCity">
          <option value="">Alle</option>
          {% for c in site.data.countries %}
            {% assign country_key = c[0] %}
            {% for city in c[1].cities %}
              <option value="{{ city[0] }}" data-country="{{ country_key }}">{{ city[1].name }}</option>
            {% endfor %}
          {% endfor %}
        </select>
      </label>
      <label>
        Sortierung:
        <select id="entriesSort">
          <option value="date-desc">Neueste zuerst</option>
          <option value="date-asc">Älteste zuerst</option>
        </select>
      </label>
    </div>
    {% assign entries = site.pages | where: "layout", "day" | sort: "date" | reverse %}
    {% if entries.size > 0 %}
      <div class="grid grid--days">
        {% for day_page in entries %}
          {% include card.html type="day" item=day_page %}
        {% endfor %}
      </div>
    {% else %}
      <p class="no-entries">Noch keine Tagebucheinträge vorhanden.</p>
    {% endif %}
  </section>
</article>
