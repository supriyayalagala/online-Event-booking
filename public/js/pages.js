function selectPricingPlan(plan) {
    document.querySelectorAll('.pricing-card-selectable').forEach(card => {
        const isActive = card.dataset.plan === plan;
        card.classList.toggle('featured', isActive);
        card.setAttribute('aria-pressed', isActive);
        const cta = card.querySelector('.pricing-cta');
        if (cta) {
            cta.classList.toggle('btn-primary', isActive);
            cta.classList.toggle('btn-outline', !isActive);
        }
    });
}

function initPricingCards() {
    const cards = document.querySelectorAll('.pricing-card-selectable');
    if (!cards.length) return;
    cards.forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('.pricing-cta')) return;
            selectPricingPlan(card.dataset.plan);
        });
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                selectPricingPlan(card.dataset.plan);
            }
        });
    });
}

function initPage() {
    const page = document.body.dataset.page || '';
    initNavbar(page);
    renderFooter();
    initStepCards();
    initFeatureCards();
    initPricingCards();

    const homeTrack = document.getElementById('home-carousel-track');
    if (homeTrack && document.querySelector('.popular-events-section')) {
        initPopularEventsSection({
            sectionEl: document.querySelector('.popular-events-section'),
            trackId: 'home-carousel-track',
            viewportId: 'home-carousel-viewport',
            prevId: 'home-carousel-prev',
            nextId: 'home-carousel-next',
            navRowId: 'home-carousel-nav-row'
        });
    } else if (homeTrack) {
        loadEventsCarousel(
            'home-carousel-track',
            'home-carousel-viewport',
            'home-carousel-prev',
            'home-carousel-next',
            { limit: 12 }
        );
    }

    const homeSticky = document.getElementById('home-sticky-scroll');
    if (homeSticky) {
        loadStickyScrollEvents('sticky-scroll-panels', { limit: 4 });
    }

    if (typeof initLazyEventVideos === 'function') {
        initLazyEventVideos();
    }
}

document.addEventListener('DOMContentLoaded', initPage);
