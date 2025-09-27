(function () {
  function initNavToggles() {
    var toggles = document.querySelectorAll('.nav-toggle');
    toggles.forEach(function (toggle) {
      toggle.addEventListener('click', function () {
        var targetId = toggle.getAttribute('data-target');
        if (!targetId) return;
        var target = document.getElementById(targetId);
        if (!target) return;

        var expanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        target.classList.toggle('expanded', !expanded);

        var icon = toggle.querySelector('.toggle-icon');
        if (icon) {
          icon.classList.toggle('expanded', !expanded);
        }
      });
    });
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

  document.addEventListener('DOMContentLoaded', function () {
    initNavToggles();
    initGalleries();
    initSidebarToggle();
  });
})();
