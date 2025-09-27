(function () {
  var modal;
  var imageElement;
  var titleElement;
  var closeButtons;
  var prevButton;
  var nextButton;
  var focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  var focusableElements = [];
  var firstFocusable;
  var lastFocusable;
  var currentIndex = -1;
  var items = [];
  var activeTrigger = null;

  function openModal(index) {
    if (!modal || !items.length) return;
    currentIndex = index;
    updateModalContent();
    modal.hidden = false;
    modal.classList.add('is-visible');
    modal.setAttribute('aria-hidden', 'false');
    firstFocusable = focusableElements[0];
    lastFocusable = focusableElements[focusableElements.length - 1];
    if (firstFocusable) {
      firstFocusable.focus();
    }
    document.body.classList.add('modal-open');
  }

  function closeModal() {
    if (!modal) return;
    modal.hidden = true;
    modal.classList.remove('is-visible');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    if (activeTrigger && typeof activeTrigger.focus === 'function') {
      activeTrigger.focus();
    }
    activeTrigger = null;
  }

  function updateModalContent() {
    if (!items[currentIndex]) return;
    var item = items[currentIndex];
    imageElement.src = item.src;
    imageElement.alt = item.alt;
    imageElement.title = item.title || '';
    titleElement.textContent = item.title || '';
    prevButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex === items.length - 1;
  }

  function showPrev() {
    if (currentIndex > 0) {
      currentIndex -= 1;
      updateModalContent();
    }
  }

  function showNext() {
    if (currentIndex < items.length - 1) {
      currentIndex += 1;
      updateModalContent();
    }
  }

  function onKeyDown(event) {
    if (!modal || modal.hidden) return;
    if (event.key === 'Escape') {
      closeModal();
    } else if (event.key === 'ArrowLeft') {
      showPrev();
    } else if (event.key === 'ArrowRight') {
      showNext();
    } else if (event.key === 'Tab') {
      if (focusableElements.length === 0) return;
      if (event.shiftKey) {
        if (document.activeElement === firstFocusable) {
          event.preventDefault();
          lastFocusable.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          event.preventDefault();
          firstFocusable.focus();
        }
      }
    }
  }

  function bindGestures(dialog) {
    var startX = 0;
    var endX = 0;

    dialog.addEventListener('touchstart', function (event) {
      startX = event.changedTouches[0].screenX;
    });

    dialog.addEventListener('touchend', function (event) {
      endX = event.changedTouches[0].screenX;
      var diff = endX - startX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          showPrev();
        } else {
          showNext();
        }
      }
    });
  }

  function setItems(galleryItems) {
    items = galleryItems;
  }

  function initModal() {
    modal = document.querySelector('[data-modal="gallery"]');
    if (!modal) return;
    imageElement = modal.querySelector('.gallery-modal__image');
    titleElement = modal.querySelector('#gallery-modal-title');
    closeButtons = modal.querySelectorAll('[data-modal-close]');
    prevButton = modal.querySelector('[data-modal-prev]');
    nextButton = modal.querySelector('[data-modal-next]');
    focusableElements = Array.prototype.slice.call(modal.querySelectorAll(focusableSelectors));

    closeButtons.forEach(function (btn) {
      btn.addEventListener('click', closeModal);
    });

    prevButton.addEventListener('click', showPrev);
    nextButton.addEventListener('click', showNext);

    bindGestures(modal.querySelector('.gallery-modal__dialog'));

    document.addEventListener('keydown', onKeyDown);
  }

  document.addEventListener('gallery:open', function (event) {
    if (!modal) {
      initModal();
    }
    if (!modal) return;
    setItems(event.detail.items || []);
    activeTrigger = event.detail.trigger || null;
    if (!items.length) return;
    openModal(event.detail.index || 0);
  });

  document.addEventListener('readystatechange', function () {
    if (document.readyState === 'interactive') {
      initModal();
    }
  });
})();
