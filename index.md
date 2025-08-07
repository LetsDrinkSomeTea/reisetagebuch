---
layout: default
title: "Unser Reisetagebuch"
---

# 🌍 Willkommen zu unserem Reisetagebuch

Weil sich es einige gewünscht haben, hier ein kleiner Blog über "Unsere große Reise".

<!-- Check if any countries have content before showing the section -->

{% assign any_countries_with_content = false %}
{% for country in site.data.countries %}
{% assign country_key = country[0] %}
{% assign country_data = country[1] %}

{% for city in country_data.cities %}
{% assign city_key = city[0] %}
{% assign country_pages = site.pages | where: "country", country_key | where: "city", city_key %}
{% assign day_pages = country_pages | where: "layout", "day" %}

    {% if day_pages.size > 0 %}
      {% assign any_countries_with_content = true %}
      {% break %}
    {% endif %}

{% endfor %}

{% if any_countries_with_content %}
{% break %}
{% endif %}
{% endfor %}

{% if any_countries_with_content %}

## 🗺️ Unsere Reiseroute

<div class="countries-overview">
  {% for country in site.data.countries %}
    {% assign country_key = country[0] %}
    {% assign country_data = country[1] %}
    
    <!-- Check if this country has any cities with day entries -->
    {% assign country_has_content = false %}
    {% assign cities_with_content = "" %}
    
    {% for city in country_data.cities %}
      {% assign city_key = city[0] %}
      {% assign city_data = city[1] %}
      
      <!-- Check if this city has any day entries (tag-n.md files) -->
      {% assign country_pages = site.pages | where: "country", country_key | where: "city", city_key %}
      {% assign day_pages = country_pages | where: "layout", "day" %}
      
      {% if day_pages.size > 0 %}
        {% assign country_has_content = true %}
        {% assign cities_with_content = cities_with_content | append: city_key | append: "," %}
      {% endif %}
    {% endfor %}
    
    <!-- Only show country if it has content -->
    {% if country_has_content %}
      <div class="country-overview">
        <h3>
          <a href="{{ '/' | append: country_key | append: '/' | relative_url }}">
            {{ country_data.flag }} {{ country_data.name }} {{ country_data.emoji }}
          </a>
        </h3>
        
        <!-- Count total days and cities with content for this country -->
        {% assign country_pages = site.pages | where: "country", country_key %}
        {% assign country_day_pages = country_pages | where: "layout", "day" %}
        
        <!-- Count cities with actual content -->
        {% assign cities_with_day_pages = 0 %}
        {% for city in country_data.cities %}
          {% assign city_key = city[0] %}
          {% assign city_country_pages = site.pages | where: "country", country_key | where: "city", city_key %}
          {% assign city_day_pages = city_country_pages | where: "layout", "day" %}
          {% if city_day_pages.size > 0 %}
            {% assign cities_with_day_pages = cities_with_day_pages | plus: 1 %}
          {% endif %}
        {% endfor %}
        
        <div class="country-stats">
          <span class="cities-count">
            {{ cities_with_day_pages }} {% if cities_with_day_pages == 1 %}Stadt{% else %}Städte{% endif %}
          </span>
          {% if country_day_pages.size > 0 %}
            <span class="days-count">
              {{ country_day_pages.size }} {% if country_day_pages.size == 1 %}Tag{% else %}Tage{% endif %}
            </span>
          {% endif %}
        </div>
        
        <div class="cities-preview">
          {% assign cities_shown = 0 %}
          {% for city in country_data.cities %}
            {% assign city_key = city[0] %}
            {% assign city_data = city[1] %}
            
            <!-- Only show cities that have day entries -->
            {% assign city_country_pages = site.pages | where: "country", country_key | where: "city", city_key %}
            {% assign city_day_pages = city_country_pages | where: "layout", "day" %}
            
            {% if city_day_pages.size > 0 and cities_shown < 4 %}
              <span class="city-tag">{{ city_data.emoji }} {{ city_data.name }}</span>
              {% assign cities_shown = cities_shown | plus: 1 %}
            {% endif %}
          {% endfor %}
          
          {% if cities_with_day_pages > 4 %}
            <span class="more-cities">und {{ cities_with_day_pages | minus: 4 }} weitere...</span>
          {% endif %}
        </div>
      </div>
    {% endif %}
  {% endfor %}
</div>
{% endif %}

## 📖 Neueste Tagebucheinträge

{% assign all_day_pages = site.pages | where: "layout", "day" | sort: "date" | reverse %}

{% if all_day_pages.size > 0 %}

  <div class="recent-entries">
    {% assign recent_entries = all_day_pages | limit: 6 %}
    
    {% for entry in recent_entries %}
      {% assign country_data = site.data.countries[entry.country] %}
      {% assign city_data = country_data.cities[entry.city] %}
      
      <article class="entry-preview">
        <header>
          <div class="entry-location">
            {{ country_data.flag }} {{ city_data.name }}, {{ country_data.name }}
          </div>
          <time datetime="{{ entry.date | date: '%Y-%m-%d' }}">
            {{ entry.date | date: '%d. %B %Y' }}
          </time>
        </header>
        
        <h4><a href="{{ entry.url | relative_url }}">{{ entry.title }}</a></h4>
        
        {% if entry.excerpt %}
          <p>{{ entry.excerpt | strip_html | truncate: 150 }}</p>
        {% endif %}
        
        <footer>
          <span class="day-badge">Tag {{ entry.day }}</span>
          {% if entry.weather %}
            <span class="weather-badge">{{ entry.weather }}</span>
          {% endif %}
        </footer>
      </article>
    {% endfor %}
  </div>
  
  {% if all_day_pages.size > 6 %}
    <div class="view-all">
      <p><em>{{ all_day_pages.size | minus: 6 }} weitere Einträge in den einzelnen Ländern und Städten...</em></p>
    </div>
  {% endif %}
{% else %}
  <div class="no-entries">
    <p>🚀 Die Reise beginnt bald! Hier werden unsere Tagebucheinträge erscheinen, sobald das Abenteuer startet.</p>
  </div>
{% endif %}

## ℹ️ Über dieses Tagebuch

**Navigation:** Nutzt die Seitenleiste, um zwischen den Ländern, Städten und einzelnen Tagen zu navigieren. Die Seite wird automatisch aktualisiert, sobald neue Einträge hinzugefügt werden.

---

_Zuletzt aktualisiert: {{ "now" | date: "%d. %B %Y" }}_

<style>
.countries-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.country-overview {
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: var(--shadow);
  
  h3 {
    margin-top: 0;
    margin-bottom: 1rem;
    
    a {
      text-decoration: none;
      color: var(--primary-color);
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
  
  .country-stats {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
    font-size: 0.9rem;
    
    span {
      background-color: var(--sidebar-bg);
      padding: 0.25rem 0.75rem;
      border-radius: 15px;
      color: var(--text-color);
      font-weight: 500;
    }
  }
  
  .cities-preview {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    
    .city-tag {
      font-size: 0.8rem;
      background-color: var(--secondary-color);
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: 12px;
    }
    
    .more-cities {
      font-size: 0.8rem;
      color: var(--text-light);
      font-style: italic;
    }
  }
}

.recent-entries {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.entry-preview {
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: var(--shadow);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  header {
    display: flex;
    justify-content: space-between;
    align-items: start;
    margin-bottom: 0.75rem;
    
    .entry-location {
      font-size: 0.9rem;
      color: var(--primary-color);
      font-weight: 500;
    }
    
    time {
      font-size: 0.8rem;
      color: var(--text-light);
    }
  }
  
  h4 {
    margin: 0 0 0.75rem 0;
    
    a {
      text-decoration: none;
      color: var(--text-color);
      
      &:hover {
        color: var(--primary-color);
      }
    }
  }
  
  p {
    color: var(--text-light);
    margin-bottom: 1rem;
    line-height: 1.5;
  }
  
  footer {
    display: flex;
    gap: 0.5rem;
    
    .day-badge,
    .weather-badge {
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
      border-radius: 12px;
      font-weight: 500;
    }
    
    .day-badge {
      background-color: var(--primary-color);
      color: white;
    }
    
    .weather-badge {
      background-color: var(--secondary-color);
      color: white;
    }
  }
}

.view-all {
  text-align: center;
  margin-top: 2rem;
  
  p {
    color: var(--text-light);
  }
}

.no-entries {
  text-align: center;
  padding: 3rem 1rem;
  background: var(--sidebar-bg);
  border-radius: 8px;
  margin: 2rem 0;
  
  p {
    font-size: 1.1rem;
    color: var(--text-light);
    margin: 0;
  }
}

@media (max-width: 768px) {
  .countries-overview,
  .recent-entries {
    grid-template-columns: 1fr;
  }
  
  .country-overview,
  .entry-preview {
    padding: 1rem;
  }
  
  .entry-preview header {
    flex-direction: column;
    align-items: start;
    gap: 0.25rem;
  }
}
</style>
