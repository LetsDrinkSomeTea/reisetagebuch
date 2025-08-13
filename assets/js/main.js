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

    // Modular Image Modal System
    const ModalSystem = {
        modal: null,
        currentImageIndex: 0,
        modalImages: [],

        // Create and configure modal HTML structure
        createModal() {
            const modal = document.createElement('div');
            modal.id = 'imageModal';
            modal.className = 'modal';
            modal.setAttribute('aria-hidden', 'true');
            modal.setAttribute('role', 'dialog');
            modal.setAttribute('aria-label', 'Bildansicht');
            
            modal.innerHTML = `
                <div class="modal__backdrop" aria-hidden="true"></div>
                <div class="modal__content" role="document">
                    <button class="modal__close" aria-label="Schließen" type="button">&times;</button>
                    <div class="modal__image-container">
                        <img class="modal__image" alt="" />
                        <button class="modal__nav modal__nav--prev" aria-label="Vorheriges Bild" type="button">‹</button>
                        <button class="modal__nav modal__nav--next" aria-label="Nächstes Bild" type="button">›</button>
                    </div>
                    <div class="modal__info">
                        <span class="modal-title"></span>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            this.attachEventListeners(modal);
            return modal;
        },

        // Attach all event listeners to modal elements
        attachEventListeners(modal) {
            const closeBtn = modal.querySelector('.modal__close');
            const backdrop = modal.querySelector('.modal__backdrop');
            const prevBtn = modal.querySelector('.modal__nav--prev');
            const nextBtn = modal.querySelector('.modal__nav--next');
            const modalImage = modal.querySelector('.modal__image');
            
            closeBtn.addEventListener('click', () => this.closeModal());
            backdrop.addEventListener('click', () => this.closeModal());
            prevBtn.addEventListener('click', () => this.showPrevImage());
            nextBtn.addEventListener('click', () => this.showNextImage());
            
            // Keyboard navigation
            document.addEventListener('keydown', (e) => this.handleKeydown(e));
            
            // Touch navigation for mobile
            this.attachTouchHandlers(modalImage);
        },

        // Attach touch event handlers
        attachTouchHandlers(modalImage) {
            let touchStartX = 0;
            modalImage.addEventListener('touchstart', (e) => {
                touchStartX = e.touches[0].clientX;
            });
            
            modalImage.addEventListener('touchend', (e) => {
                const touchEndX = e.changedTouches[0].clientX;
                const diff = touchStartX - touchEndX;
                
                if (Math.abs(diff) > 50) { // Minimum swipe distance
                    if (diff > 0) {
                        this.showNextImage();
                    } else {
                        this.showPrevImage();
                    }
                }
            });
        },

        // Initialize modal if needed
        initModal() {
            if (!this.modal) {
                this.modal = this.createModal();
            }
        },

        // Open modal with image
        openModal(imageSrc, title, images, index) {
            this.initModal();
            
            this.modalImages = images;
            this.currentImageIndex = index;
            
            const modalImage = this.modal.querySelector('.modal__image');
            const modalTitle = this.modal.querySelector('.modal-title');
            
            modalImage.src = imageSrc;
            modalImage.alt = title;
            modalTitle.textContent = title;
            
            // Show/hide navigation buttons
            const prevBtn = this.modal.querySelector('.modal__nav--prev');
            const nextBtn = this.modal.querySelector('.modal__nav--next');
            
            prevBtn.style.display = images.length > 1 && index > 0 ? 'block' : 'none';
            nextBtn.style.display = images.length > 1 && index < images.length - 1 ? 'block' : 'none';
            
            // Show modal
            this.modal.setAttribute('aria-hidden', 'false');
            this.modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            
            // Focus management for accessibility
            setTimeout(() => {
                this.modal.querySelector('.modal__close').focus();
            }, 100);
        },

        // Close modal
        closeModal() {
            if (this.modal) {
                this.modal.setAttribute('aria-hidden', 'true');
                this.modal.style.display = 'none';
                document.body.style.overflow = '';
            }
        },

        // Navigate to previous image
        showPrevImage() {
            if (this.currentImageIndex > 0) {
                this.currentImageIndex--;
                const prevImage = this.modalImages[this.currentImageIndex];
                this.openModal(prevImage.src, prevImage.title, this.modalImages, this.currentImageIndex);
            }
        },

        // Navigate to next image
        showNextImage() {
            if (this.currentImageIndex < this.modalImages.length - 1) {
                this.currentImageIndex++;
                const nextImage = this.modalImages[this.currentImageIndex];
                this.openModal(nextImage.src, nextImage.title, this.modalImages, this.currentImageIndex);
            }
        },

        // Handle keyboard navigation
        handleKeydown(e) {
            if (this.modal && this.modal.style.display === 'flex') {
                switch(e.key) {
                    case 'Escape':
                        this.closeModal();
                        break;
                    case 'ArrowLeft':
                        this.showPrevImage();
                        break;
                    case 'ArrowRight':
                        this.showNextImage();
                        break;
                }
            }
        }
    };

    // Initialize gallery links
    function initGalleryLinks() {
        const galleryLinks = document.querySelectorAll('.gallery__link');
        
        galleryLinks.forEach((link, index) => {
            // Collect all images in this gallery
            const galleryContainer = link.closest('.gallery');
            const allLinks = galleryContainer ? galleryContainer.querySelectorAll('.gallery__link') : [link];
            
            const images = Array.from(allLinks).map((l, i) => ({
                src: l.href,
                title: l.getAttribute('data-modal-title') || l.title || l.querySelector('img').alt || `Bild ${i + 1}`,
                index: i
            }));
            
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const currentIndex = images.findIndex(img => img.src === this.href);
                const modalTitle = this.getAttribute('data-modal-title') || this.title;
                ModalSystem.openModal(this.href, modalTitle, images, currentIndex);
            });
        });
    }

    // Initialize gallery when DOM is loaded
    initGalleryLinks();
    
    // Re-initialize when new content is loaded (for potential future AJAX content)
    window.reinitGallery = initGalleryLinks;
});
