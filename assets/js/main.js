document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation toggle
    const menuToggle = document.getElementById('mobileMenuToggle');
    const siteWrapper = document.querySelector('.site-wrapper');

    if (menuToggle && siteWrapper) {
        menuToggle.addEventListener('click', function() {
            siteWrapper.classList.toggle('mobile-menu-open');
            menuToggle.classList.toggle('menu-open');
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (siteWrapper && siteWrapper.classList.contains('mobile-menu-open') && !e.target.closest('.sidebar') && !e.target.closest('.mobile-menu-toggle')) {
            siteWrapper.classList.remove('mobile-menu-open');
            if (menuToggle) {
                menuToggle.classList.remove('menu-open');
            }
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Toggle country section
    window.toggleCountry = function(countryKey) {
        const countrySection = document.querySelector(`[data-country="${countryKey}"]`);
        const citiesList = countrySection.querySelector('.cities-list');
        const toggleIcon = countrySection.querySelector('.country-header .toggle-icon');
        
        if (citiesList.classList.contains('expanded')) {
            citiesList.classList.remove('expanded');
            toggleIcon.classList.remove('expanded');
        } else {
            citiesList.classList.add('expanded');
            toggleIcon.classList.add('expanded');
        }
    }

    // Toggle city section
    window.toggleCity = function(countryKey, cityKey) {
        const countrySection = document.querySelector(`[data-country="${countryKey}"]`);
        const citySection = countrySection.querySelector(`[data-city="${cityKey}"]`);
        const daysList = citySection.querySelector('.days-list');
        const toggleIcon = citySection.querySelector('.city-header .toggle-icon');
        
        if (daysList && daysList.classList.contains('expanded')) {
            daysList.classList.remove('expanded');
            if (toggleIcon) toggleIcon.classList.remove('expanded');
        } else if (daysList) {
            daysList.classList.add('expanded');
            if (toggleIcon) toggleIcon.classList.add('expanded');
        }
    }

    // Initialize navigation state based on current page
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.navigation a');
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath && currentPath.includes(linkPath) && linkPath !== '/') {
            link.classList.add('active');
        }
    });

    // Image Modal System
    let currentModal = null;
    let currentImageIndex = 0;
    let modalImages = [];

    // Create modal HTML structure
    function createModal() {
        const modal = document.createElement('div');
        modal.id = 'imageModal';
        modal.className = 'image-modal';
        modal.setAttribute('aria-hidden', 'true');
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-label', 'Bildansicht');
        
        modal.innerHTML = `
            <div class="modal-backdrop" aria-hidden="true"></div>
            <div class="modal-content" role="document">
                <button class="modal-close" aria-label="Schließen" type="button">&times;</button>
                <div class="modal-image-container">
                    <img class="modal-image" alt="" />
                    <button class="modal-nav modal-prev" aria-label="Vorheriges Bild" type="button">‹</button>
                    <button class="modal-nav modal-next" aria-label="Nächstes Bild" type="button">›</button>
                </div>
                <div class="modal-info">
                    <span class="modal-title"></span>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        return modal;
    }

    // Initialize modal
    function initModal() {
        if (!currentModal) {
            currentModal = createModal();
            
            // Event listeners
            const closeBtn = currentModal.querySelector('.modal-close');
            const backdrop = currentModal.querySelector('.modal-backdrop');
            const prevBtn = currentModal.querySelector('.modal-prev');
            const nextBtn = currentModal.querySelector('.modal-next');
            const modalImage = currentModal.querySelector('.modal-image');
            
            closeBtn.addEventListener('click', closeModal);
            backdrop.addEventListener('click', closeModal);
            prevBtn.addEventListener('click', showPrevImage);
            nextBtn.addEventListener('click', showNextImage);
            
            // Keyboard navigation
            document.addEventListener('keydown', handleKeydown);
            
            // Touch navigation for mobile
            let touchStartX = 0;
            modalImage.addEventListener('touchstart', (e) => {
                touchStartX = e.touches[0].clientX;
            });
            
            modalImage.addEventListener('touchend', (e) => {
                const touchEndX = e.changedTouches[0].clientX;
                const diff = touchStartX - touchEndX;
                
                if (Math.abs(diff) > 50) { // Minimum swipe distance
                    if (diff > 0) {
                        showNextImage();
                    } else {
                        showPrevImage();
                    }
                }
            });
        }
    }

    // Open modal with image
    function openModal(imageSrc, title, images, index) {
        initModal();
        
        modalImages = images;
        currentImageIndex = index;
        
        const modalImage = currentModal.querySelector('.modal-image');
        const modalTitle = currentModal.querySelector('.modal-title');
        
        modalImage.src = imageSrc;
        modalImage.alt = title;
        modalTitle.textContent = title;
        
        // Show/hide navigation buttons
        const prevBtn = currentModal.querySelector('.modal-prev');
        const nextBtn = currentModal.querySelector('.modal-next');
        
        prevBtn.style.display = images.length > 1 && index > 0 ? 'block' : 'none';
        nextBtn.style.display = images.length > 1 && index < images.length - 1 ? 'block' : 'none';
        
        // Show modal
        currentModal.setAttribute('aria-hidden', 'false');
        currentModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Focus management for accessibility
        setTimeout(() => {
            currentModal.querySelector('.modal-close').focus();
        }, 100);
    }

    // Close modal
    function closeModal() {
        if (currentModal) {
            currentModal.setAttribute('aria-hidden', 'true');
            currentModal.style.display = 'none';
            document.body.style.overflow = '';
        }
    }

    // Navigate to previous image
    function showPrevImage() {
        if (currentImageIndex > 0) {
            currentImageIndex--;
            const prevImage = modalImages[currentImageIndex];
            openModal(prevImage.src, prevImage.title, modalImages, currentImageIndex);
        }
    }

    // Navigate to next image
    function showNextImage() {
        if (currentImageIndex < modalImages.length - 1) {
            currentImageIndex++;
            const nextImage = modalImages[currentImageIndex];
            openModal(nextImage.src, nextImage.title, modalImages, currentImageIndex);
        }
    }

    // Handle keyboard navigation
    function handleKeydown(e) {
        if (currentModal && currentModal.style.display === 'flex') {
            switch(e.key) {
                case 'Escape':
                    closeModal();
                    break;
                case 'ArrowLeft':
                    showPrevImage();
                    break;
                case 'ArrowRight':
                    showNextImage();
                    break;
            }
        }
    }

    // Initialize gallery links
    function initGalleryLinks() {
        const galleryLinks = document.querySelectorAll('.gallery-link');
        
        galleryLinks.forEach((link, index) => {
            // Collect all images in this gallery
            const galleryContainer = link.closest('.city-image-gallery, .country-image-gallery, .gallery-all-images');
            const allLinks = galleryContainer ? galleryContainer.querySelectorAll('.gallery-link') : [link];
            
            const images = Array.from(allLinks).map((l, i) => ({
                src: l.href,
                title: l.getAttribute('data-modal-title') || l.title || l.querySelector('img').alt || `Bild ${i + 1}`,
                index: i
            }));
            
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const currentIndex = images.findIndex(img => img.src === this.href);
                const modalTitle = this.getAttribute('data-modal-title') || this.title;
                openModal(this.href, modalTitle, images, currentIndex);
            });
        });
    }

    // Initialize gallery when DOM is loaded
    initGalleryLinks();
    
    // Re-initialize when new content is loaded (for potential future AJAX content)
    window.reinitGallery = initGalleryLinks;
});
