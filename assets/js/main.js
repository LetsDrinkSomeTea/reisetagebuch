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
});
