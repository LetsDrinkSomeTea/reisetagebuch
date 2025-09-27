(function () {
  var navResizeHandlerRegistered = false;

  function initNavToggles() {
    var toggles = document.querySelectorAll('.nav-toggle');

    function refreshAncestorHeights(element) {
      var parent = element && element.parentElement;
      while (parent) {
        if (parent.classList && parent.classList.contains('nav-sublist') && parent.classList.contains('expanded')) {
          parent.style.maxHeight = parent.scrollHeight + 'px';
        }
        parent = parent.parentElement;
      }
    }

    function setExpandedState(toggle, target, expanded) {
      toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      target.classList.toggle('expanded', expanded);

      if (expanded) {
        target.style.maxHeight = target.scrollHeight + 'px';
      } else {
        target.style.maxHeight = '0px';
      }

      var icon = toggle.querySelector('.toggle-icon');
      if (icon) {
        icon.classList.toggle('expanded', expanded);
      }

      refreshAncestorHeights(target);
    }

    toggles.forEach(function (toggle) {
      var targetId = toggle.getAttribute('data-target');
      if (!targetId) return;
      var target = document.getElementById(targetId);
      if (!target) return;

      var isExpanded = toggle.getAttribute('aria-expanded') === 'true';
      setExpandedState(toggle, target, isExpanded);

      toggle.addEventListener('click', function () {
        var expanded = toggle.getAttribute('aria-expanded') === 'true';
        setExpandedState(toggle, target, !expanded);
      });
    });

    if (!navResizeHandlerRegistered) {
      window.addEventListener('resize', function () {
        document.querySelectorAll('.nav-sublist.expanded').forEach(function (list) {
          list.style.maxHeight = list.scrollHeight + 'px';
          // Ensure enclosing lists stay in sync when viewport height changes
          var parent = list.parentElement;
          while (parent) {
            if (parent.classList && parent.classList.contains('nav-sublist') && parent.classList.contains('expanded')) {
              parent.style.maxHeight = parent.scrollHeight + 'px';
            }
            parent = parent.parentElement;
          }
        });
      });
      navResizeHandlerRegistered = true;
    }
  }

  function initGalleries() {
    var galleries = document.querySelectorAll('[data-gallery]');
    galleries.forEach(function (gallery) {
      var links = Array.prototype.slice.call(gallery.querySelectorAll('.gallery__link'));
      if (!links.length) return;

      var items = links.map(function (link, index) {
        link.setAttribute('data-gallery-index', index);
        return {
          src: link.getAttribute('data-gallery-src') || link.getAttribute('href'),
          alt: link.getAttribute('data-gallery-alt') || '',
          title: link.getAttribute('data-gallery-title') || ''
        };
      });

      links.forEach(function (link, index) {
        link.addEventListener('click', function (event) {
          if (event) {
            event.preventDefault();
          }
          var openEvent = new CustomEvent('gallery:open', {
            detail: {
              items: items,
              index: index,
              trigger: link
            }
          });
          document.dispatchEvent(openEvent);
        });
      });
    });
  }

  function initSidebarToggle() {
    var toggle = document.querySelector('.sidebar-toggle');
    var sidebar = document.getElementById('site-sidebar');
    var overlay = document.querySelector('.sidebar-overlay');
    if (!toggle || !sidebar) return;

    var BREAKPOINT = 960;

    function setExpanded(expanded) {
      toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      toggle.setAttribute('aria-label', expanded ? 'Navigation schließen' : 'Navigation öffnen');
      if (overlay) {
        overlay.hidden = !expanded;
      }
      document.body.classList.toggle('sidebar-open', expanded);
    }

    function openSidebar() {
      setExpanded(true);
      if (sidebar) {
        var firstLink = sidebar.querySelector('a, button');
        if (firstLink) {
          firstLink.focus();
        }
      }
    }

    function closeSidebar(shouldFocus) {
      setExpanded(false);
      if (shouldFocus !== false) {
        toggle.focus();
      }
    }

    toggle.addEventListener('click', function () {
      var expanded = toggle.getAttribute('aria-expanded') === 'true';
      if (expanded) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });

    if (overlay) {
      overlay.addEventListener('click', function () {
        closeSidebar(false);
      });
    }

    sidebar.addEventListener('click', function (event) {
      if (document.body.classList.contains('sidebar-open') && event.target.closest('a')) {
        closeSidebar(false);
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && document.body.classList.contains('sidebar-open')) {
        closeSidebar();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > BREAKPOINT && document.body.classList.contains('sidebar-open')) {
        setExpanded(false);
      }
    });
  }

  function parseFilterValues(element, key) {
    var raw = element.getAttribute('data-' + key);
    if (!raw) return [];
    return raw
      .split(/\s+/)
      .map(function (value) {
        return value.trim();
      })
      .filter(Boolean);
  }

  function parseFilterLabels(element, key) {
    var raw = element.getAttribute('data-' + key + '-names');
    if (!raw) return [];
    return raw.split('|').map(function (value) {
      return value.trim();
    });
  }

  function buildFilterMetadata(items) {
    var labelMaps = {
      journey: {},
      country: {},
      city: {}
    };

    var records = items.map(function (element) {
      var record = {
        element: element,
        values: {}
      };

      ['journey', 'country', 'city'].forEach(function (key) {
        var values = parseFilterValues(element, key);
        var labels = parseFilterLabels(element, key);
        record.values[key] = values;

        values.forEach(function (value, index) {
          if (!value) return;
          if (!labelMaps[key][value]) {
            var label = labels[index] || labels[0] || value;
            labelMaps[key][value] = label;
          }
        });
      });

      return record;
    });

    return {
      items: records,
      labels: labelMaps
    };
  }

  function populateSelectOptions(select, optionMap) {
    while (select.options.length > 1) {
      select.remove(1);
    }

    var keys = Object.keys(optionMap);
    var collator = typeof Intl !== 'undefined' && Intl.Collator ? new Intl.Collator('de', { sensitivity: 'base' }) : null;

    keys.sort(function (a, b) {
      var labelA = optionMap[a];
      var labelB = optionMap[b];
      if (collator) {
        return collator.compare(labelA, labelB);
      }
      return labelA.localeCompare(labelB);
    });

    keys.forEach(function (key) {
      var option = document.createElement('option');
      option.value = key;
      option.textContent = optionMap[key];
      select.appendChild(option);
    });
  }

  function hideMinimalGroups(selects, labelMaps, bar) {
    var visibleGroupCount = 0;

    selects.forEach(function (select) {
      var key = select.getAttribute('data-filter');
      var group = select.closest('.filter-bar__group');
      if (!group) return;

      var optionCount = Object.keys(labelMaps[key] || {}).length;
      if (optionCount <= 1) {
        group.hidden = true;
        select.value = '';
      } else {
        group.hidden = false;
        visibleGroupCount += 1;
      }
    });

    if (visibleGroupCount === 0) {
      bar.hidden = true;
    }

    return visibleGroupCount;
  }

  function getActiveFilters(selects) {
    var filters = {};
    selects.forEach(function (select) {
      var key = select.getAttribute('data-filter');
      var value = select.value;
      if (key && value) {
        filters[key] = value;
      }
    });
    return filters;
  }

  function matchesFilters(record, filters, skipKey) {
    var keys = Object.keys(filters);
    if (!keys.length) return true;

    for (var i = 0; i < keys.length; i += 1) {
      var key = keys[i];
      if (key === skipKey) continue;
      var filterValue = filters[key];
      if (!filterValue) continue;
      var values = record.values[key] || [];
      if (values.indexOf(filterValue) === -1) {
        return false;
      }
    }

    return true;
  }

  function updateAvailableOptions(selects, items, activeFilters) {
    selects.forEach(function (select) {
      var key = select.getAttribute('data-filter');
      if (!key) return;

      var available = new Set();

      items.forEach(function (record) {
        if (!matchesFilters(record, activeFilters, key)) return;
        var values = record.values[key] || [];
        values.forEach(function (value) {
          if (value) {
            available.add(value);
          }
        });
      });

      Array.prototype.slice.call(select.options).forEach(function (option, index) {
        if (index === 0) return;
        var value = option.value;
        var isAvailable = available.has(value);
        option.disabled = !isAvailable;
        option.hidden = !isAvailable;
      });

      if (select.value && !available.has(select.value)) {
        select.value = '';
      }
    });
  }

  function filterItems(metadata, activeFilters) {
    var visibleCount = 0;
    metadata.items.forEach(function (record) {
      var isMatch = matchesFilters(record, activeFilters);
      record.element.classList.toggle('is-filtered-out', !isMatch);
      if (isMatch) {
        record.element.removeAttribute('hidden');
        visibleCount += 1;
      } else {
        record.element.setAttribute('hidden', '');
      }
    });
    return visibleCount;
  }

  function updateSections(target, collapseSelector) {
    if (!collapseSelector) return;
    var sections = target.querySelectorAll(collapseSelector);
    sections.forEach(function (section) {
      var hasVisibleItem = section.querySelector('[data-filter-item]:not([hidden])');
      if (hasVisibleItem) {
        section.removeAttribute('hidden');
        section.classList.remove('is-filter-empty');
      } else {
        section.setAttribute('hidden', '');
        section.classList.add('is-filter-empty');
      }
    });
  }

  function updateEmptyState(target, visibleCount) {
    var emptyIndicator = target.querySelector('[data-filter-empty]');
    if (!emptyIndicator) return;
    if (visibleCount > 0) {
      emptyIndicator.setAttribute('hidden', '');
    } else {
      emptyIndicator.removeAttribute('hidden');
    }
  }

  function updateResetButton(resetButton, activeFilters) {
    if (!resetButton) return;
    var hasFilters = Object.keys(activeFilters).length > 0;
    if (hasFilters) {
      resetButton.removeAttribute('hidden');
    } else {
      resetButton.setAttribute('hidden', '');
    }
  }

  function initFilters() {
    var bars = document.querySelectorAll('[data-filter-target]');
    if (!bars.length) return;

    Array.prototype.slice.call(bars).forEach(function (bar) {
      if (bar.hidden) return;

      var targetSelector = bar.getAttribute('data-filter-target');
      if (!targetSelector) return;

      var target = document.querySelector(targetSelector);
      if (!target) return;

      var rawItems = target.querySelectorAll('[data-filter-item]');
      if (!rawItems.length) {
        bar.hidden = true;
        return;
      }

      var selects = Array.prototype.slice.call(bar.querySelectorAll('select[data-filter]'));
      if (!selects.length) {
        bar.hidden = true;
        return;
      }

      var metadata = buildFilterMetadata(Array.prototype.slice.call(rawItems));

      selects.forEach(function (select) {
        var key = select.getAttribute('data-filter');
        if (!key) return;
        populateSelectOptions(select, metadata.labels[key] || {});
      });

      var visibleGroups = hideMinimalGroups(selects, metadata.labels, bar);
      if (!visibleGroups) {
        return;
      }

      var collapseSelector = bar.getAttribute('data-filter-collapse');
      var resetButton = bar.querySelector('[data-filter-reset]');

      function applyFilters() {
        var activeFilters = getActiveFilters(selects);
        updateAvailableOptions(selects, metadata.items, activeFilters);
        activeFilters = getActiveFilters(selects);
        var visibleCount = filterItems(metadata, activeFilters);
        updateSections(target, collapseSelector);
        updateEmptyState(target, visibleCount);
        updateResetButton(resetButton, activeFilters);
      }

      selects.forEach(function (select) {
        select.addEventListener('change', applyFilters);
      });

      if (resetButton) {
        resetButton.addEventListener('click', function () {
          selects.forEach(function (select) {
            select.value = '';
          });
          applyFilters();
        });
      }

      applyFilters();
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initNavToggles();
    initGalleries();
    initSidebarToggle();
    initFilters();
  });
})();
