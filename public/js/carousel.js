function renderCarouselEventCard(event) {
    if (typeof renderTicketEventCard === 'function') {
        return renderTicketEventCard(event);
    }
    const date = new Date(event.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
    return `
        <a href="/event-details.html?id=${event._id}" class="carousel-card">
            <div class="carousel-card-img-wrap">
                <img src="${event.imageUrl}" alt="${event.title}" loading="lazy">
            </div>
            <div class="carousel-card-body">
                <span class="carousel-card-tag">${event.category}</span>
                <h3 class="carousel-card-title">${event.title}</h3>
                <p class="carousel-card-meta">${date} · ${typeof formatPrice === 'function' ? formatPrice(event.price) : '₹' + event.price} per person</p>
            </div>
        </a>
    `;
}

const CAROUSEL_GAP_PX = 24;
const CAROUSEL_CARD_MIN_PX = 260;
const CAROUSEL_CARD_MAX_PX = 420;

function layoutCarouselCards(viewportId, trackId) {
    const viewport = document.getElementById(viewportId);
    const track = document.getElementById(trackId);
    if (!viewport || !track) return;

    const cards = track.querySelectorAll('.ticket-event-card, .carousel-card');
    const count = cards.length;
    if (!count) return;

    const gap = CAROUSEL_GAP_PX;
    const vw = viewport.clientWidth;
    const maxFit = Math.max(1, Math.floor((vw + gap) / (CAROUSEL_CARD_MIN_PX + gap)));
    const visible = Math.min(count, maxFit);
    let cardWidth = Math.floor((vw - gap * (visible - 1)) / visible);
    cardWidth = Math.min(CAROUSEL_CARD_MAX_PX, Math.max(CAROUSEL_CARD_MIN_PX, cardWidth));

    cards.forEach((card) => {
        card.style.flex = `0 0 ${cardWidth}px`;
        card.style.width = `${cardWidth}px`;
        card.style.maxWidth = `${cardWidth}px`;
    });

    if (count <= visible) {
        track.classList.add('carousel-track--fill');
        track.style.width = '100%';
        cards.forEach((card) => {
            card.style.flex = '1 1 0';
            card.style.width = 'auto';
            card.style.maxWidth = 'none';
            card.style.minWidth = `${CAROUSEL_CARD_MIN_PX}px`;
        });
    } else {
        track.classList.remove('carousel-track--fill');
        track.style.width = 'max-content';
    }

    return { cardWidth, needsScroll: count > visible };
}

function initHorizontalCarousel(viewportId, prevId, nextId, trackId) {
    const viewport = document.getElementById(viewportId);
    const track = document.getElementById(trackId);
    const prevBtn = document.getElementById(prevId);
    const nextBtn = document.getElementById(nextId);
    if (!viewport || !prevBtn || !nextBtn || !track) return;

    const getScrollStep = () => {
        const card = viewport.querySelector('.ticket-event-card') || viewport.querySelector('.carousel-card');
        if (!card) return 320;
        return card.offsetWidth + CAROUSEL_GAP_PX;
    };

    const updateArrows = () => updateCarouselArrows(viewportId, trackId, prevId, nextId);

    prevBtn.addEventListener('click', () => {
        viewport.scrollBy({ left: -getScrollStep(), behavior: 'smooth' });
    });

    nextBtn.addEventListener('click', () => {
        viewport.scrollBy({ left: getScrollStep(), behavior: 'smooth' });
    });

    viewport.addEventListener('scroll', () => {
        const maxScroll = viewport.scrollWidth - viewport.clientWidth - 2;
        prevBtn.disabled = viewport.scrollLeft <= 0;
        nextBtn.disabled = viewport.scrollLeft >= maxScroll;
        prevBtn.classList.toggle('disabled', prevBtn.disabled);
        nextBtn.classList.toggle('disabled', nextBtn.disabled);
    }, { passive: true });

    window.addEventListener('resize', updateArrows);
    updateArrows();
}

function startOfDay(date) {
    const d = new Date(date);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function filterEventsByDate(events, filter) {
    if (!filter || filter === 'all') return events;

    const today = startOfDay(new Date());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const weekEnd = new Date(today);
    weekEnd.setDate(weekEnd.getDate() + 7);

    return events.filter((event) => {
        const eventDay = startOfDay(event.date);
        if (filter === 'today') return eventDay.getTime() === today.getTime();
        if (filter === 'tomorrow') return eventDay.getTime() === tomorrow.getTime();
        if (filter === 'week') {
            return eventDay.getTime() >= today.getTime() && eventDay.getTime() < weekEnd.getTime();
        }
        return true;
    });
}

function renderEventsIntoCarousel(trackId, events, viewportId, prevId, nextId) {
    const track = document.getElementById(trackId);
    if (!track) return;

    track.innerHTML = '';

    if (!events.length) {
        track.innerHTML = '<p class="carousel-empty">No events for this period. Try another filter.</p>';
        if (viewportId && prevId && nextId) {
            updateCarouselArrows(viewportId, trackId, prevId, nextId);
        }
        return;
    }

    events.forEach((event) => {
        track.innerHTML += renderCarouselEventCard(event);
    });

    if (typeof initLazyEventVideos === 'function') {
        initLazyEventVideos(track);
    }

    if (viewportId && prevId && nextId) {
        requestAnimationFrame(() => updateCarouselArrows(viewportId, trackId, prevId, nextId));
    }
}

function updateCarouselArrows(viewportId, trackId, prevId, nextId) {
    layoutCarouselCards(viewportId, trackId);
    const viewport = document.getElementById(viewportId);
    const prevBtn = document.getElementById(prevId);
    const nextBtn = document.getElementById(nextId);
    if (!viewport || !prevBtn || !nextBtn) return;

    const maxScroll = viewport.scrollWidth - viewport.clientWidth - 2;
    const canScroll = maxScroll > 2;
    prevBtn.style.display = canScroll ? '' : 'none';
    nextBtn.style.display = canScroll ? '' : 'none';
    prevBtn.disabled = viewport.scrollLeft <= 0;
    nextBtn.disabled = viewport.scrollLeft >= maxScroll;
    prevBtn.classList.toggle('disabled', prevBtn.disabled);
    nextBtn.classList.toggle('disabled', nextBtn.disabled);
}

const _carouselInitDone = {};

async function initPopularEventsSection(config = {}) {
    const sectionEl =
        config.sectionEl ||
        document.querySelector('.popular-events-section');
    const trackId = config.trackId || 'home-carousel-track';
    const viewportId = config.viewportId || 'home-carousel-viewport';
    const prevId = config.prevId || 'home-carousel-prev';
    const nextId = config.nextId || 'home-carousel-next';
    const navRowId = config.navRowId || 'home-carousel-nav-row';
    const defaultFilter = config.defaultFilter || 'tomorrow';
    const { keyword = '', category = '' } = config;

    const track = document.getElementById(trackId);
    if (!track || !sectionEl) return;

    const navRow = document.getElementById(navRowId);

    if (!_carouselInitDone[viewportId]) {
        initHorizontalCarousel(viewportId, prevId, nextId, trackId);
        _carouselInitDone[viewportId] = true;
    }

    let allEvents = [];
    try {
        let url = '/api/events?';
        if (keyword) url += `keyword=${encodeURIComponent(keyword)}&`;
        if (category) url += `category=${encodeURIComponent(category)}&`;
        const response = await fetch(url);
        allEvents = await response.json();
    } catch (e) {
        track.innerHTML = '<p class="carousel-empty error">Could not load events.</p>';
        return;
    }

    sectionEl._popularEventsCache = allEvents;

    function applyFilter(filter) {
        const events = sectionEl._popularEventsCache || [];
        const pills = sectionEl.querySelectorAll('.popular-filter-pill');

        pills.forEach((btn) => {
            const isActive = btn.dataset.filter === filter;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });

        sectionEl._popularActiveFilter = filter;

        const filtered = filterEventsByDate(events, filter);
        const viewport = document.getElementById(viewportId);
        if (viewport) viewport.scrollLeft = 0;
        renderEventsIntoCarousel(trackId, filtered, viewportId, prevId, nextId);

        requestAnimationFrame(() => {
            const maxScroll =
                (viewport?.scrollWidth || 0) - (viewport?.clientWidth || 0) - 2;
            const canScroll = maxScroll > 2;
            if (navRow) navRow.style.display = canScroll ? 'flex' : 'none';
        });
    }

    sectionEl._popularApplyFilter = applyFilter;

    if (!sectionEl._popularFilterClickBound) {
        sectionEl.addEventListener('click', (e) => {
            const btn = e.target.closest('.popular-filter-pill');
            if (!btn || !sectionEl.contains(btn)) return;
            e.preventDefault();
            applyFilter(btn.dataset.filter);
        });
        sectionEl._popularFilterClickBound = true;
    }

    const active = sectionEl.querySelector('.popular-filter-pill.active');
    const filterToApply =
        sectionEl._popularActiveFilter ||
        (active ? active.dataset.filter : defaultFilter);
    applyFilter(filterToApply);
}

async function loadEventsCarousel(trackId, viewportId, prevId, nextId, options = {}) {
    const track = document.getElementById(trackId);
    if (!track) return [];

    const { keyword = '', category = '', limit = null } = options;

    try {
        let url = '/api/events?';
        if (keyword) url += `keyword=${encodeURIComponent(keyword)}&`;
        if (category) url += `category=${encodeURIComponent(category)}&`;

        const response = await fetch(url);
        const events = await response.json();
        let list = events;

        if (limit) list = events.slice(0, limit);

        track.innerHTML = '';

        if (!list.length) {
            track.innerHTML = '<p class="carousel-empty">No events to show right now.</p>';
            return [];
        }

        list.forEach(event => {
            track.innerHTML += renderCarouselEventCard(event);
        });

        if (viewportId && prevId && nextId) {
            if (!_carouselInitDone[viewportId]) {
                initHorizontalCarousel(viewportId, prevId, nextId, trackId);
                _carouselInitDone[viewportId] = true;
            } else {
                requestAnimationFrame(() => updateCarouselArrows(viewportId, trackId, prevId, nextId));
            }
        }

        return list;
    } catch (error) {
        track.innerHTML = '<p class="carousel-empty error">Could not load events.</p>';
        return [];
    }
}
