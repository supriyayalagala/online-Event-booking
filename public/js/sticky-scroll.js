function escAttr(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;');
}

function stickyPanelImageUrl(event) {
    if (typeof suggestEventImage === 'function') {
        return suggestEventImage(event.category, event.title);
    }
    return event.imageUrl || '';
}

function renderStickyPanel(event, index) {
    const date = new Date(event.date).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
    const num = String(index + 1).padStart(2, '0');
    const desc = event.description.length > 200
        ? event.description.slice(0, 200) + '…'
        : event.description;
    const imageUrl = stickyPanelImageUrl(event);

    return `
        <article class="sticky-panel" data-index="${index}"
            data-id="${event._id}"
            data-title="${escAttr(event.title)}"
            data-desc="${escAttr(desc)}"
            data-date="${escAttr(date)}"
            data-location="${escAttr(event.location)}"
            data-price="${event.price}"
            data-seats="${event.availableSeats}"
            data-category="${escAttr(event.category)}">
            <div class="sticky-panel-inner">
                <div class="sticky-panel-img-wrap">
                    <img src="${escAttr(imageUrl)}" alt="${escAttr(event.title)}" loading="lazy" class="sticky-panel-img">
                    <div class="sticky-panel-overlay"></div>
                </div>
                <div class="sticky-panel-caption">
                    <span class="sticky-panel-num">${num}</span>
                    <span class="sticky-panel-cat">${event.category}</span>
                </div>
            </div>
        </article>
    `;
}

function updateStickySidebar(panel) {
    const data = {
        title: panel.dataset.title,
        description: panel.dataset.desc,
        date: panel.dataset.date,
        location: panel.dataset.location,
        price: panel.dataset.price,
        seats: panel.dataset.seats,
        id: panel.dataset.id
    };
    const index = parseInt(panel.dataset.index, 10);
    const total = document.querySelectorAll('.sticky-panel').length;

    const indexEl = document.getElementById('sticky-index');
    const totalEl = document.getElementById('sticky-total');
    const titleEl = document.getElementById('sticky-title');
    const metaEl = document.getElementById('sticky-meta');
    const descEl = document.getElementById('sticky-desc');
    const ctaEl = document.getElementById('sticky-cta');
    const progressEl = document.getElementById('sticky-progress');

    if (indexEl) indexEl.textContent = String(index + 1).padStart(2, '0');
    if (totalEl) totalEl.textContent = String(total).padStart(2, '0');
    if (titleEl) titleEl.textContent = data.title;
    if (metaEl) {
        metaEl.innerHTML = `
            <span>📅 ${data.date}</span>
            <span>📍 ${data.location}</span>
            <span>💰 ${typeof formatPrice === 'function' ? formatPrice(data.price) : '₹' + data.price} / guest</span>
            <span>🎫 ${data.seats} seats left</span>
        `;
    }
    if (descEl) {
        const short = data.description.length > 160
            ? data.description.slice(0, 160) + '…'
            : data.description;
        descEl.textContent = short;
    }
    if (ctaEl) {
        ctaEl.href = `/event-details.html?id=${data.id}`;
    }
    if (progressEl) {
        const pct = total > 1 ? ((index + 1) / total) * 100 : 100;
        progressEl.style.width = `${pct}%`;
    }
}

function initStickyScrollObserver() {
    const panels = document.querySelectorAll('.sticky-panel');
    if (!panels.length) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
        panels.forEach(p => p.classList.add('is-active'));
        if (panels[0]) updateStickySidebar(panels[0]);
        return;
    }

    panels.forEach((panel, i) => {
        panel.style.setProperty('--stack', i);
        panel.style.zIndex = 10 + i;
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const idx = parseInt(entry.target.dataset.index, 10);
                panels.forEach((p, i) => {
                    p.classList.remove('is-active', 'is-passed');
                    if (i < idx) p.classList.add('is-passed');
                });
                entry.target.classList.add('is-active');
                entry.target.style.zIndex = 100 + idx;
                updateStickySidebar(entry.target);
            }
        });
    }, {
        root: null,
        rootMargin: '-35% 0px -35% 0px',
        threshold: 0
    });

    panels.forEach(panel => observer.observe(panel));

    if (panels[0]) {
        panels[0].classList.add('is-active');
        updateStickySidebar(panels[0]);
    }

    initStickyParallax(panels);
}

function initStickyParallax(panels) {
    const onScroll = () => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        panels.forEach(panel => {
            if (!panel.classList.contains('is-active')) return;
            const media = panel.querySelector('.sticky-panel-video, .sticky-panel-img');
            if (!media) return;
            const rect = panel.getBoundingClientRect();
            const vh = window.innerHeight;
            const progress = 1 - (rect.top + rect.height / 2) / (vh + rect.height / 2);
            const clamped = Math.max(-0.15, Math.min(0.15, progress * 0.2 - 0.1));
            media.style.transform = `scale(1.05) translateY(${clamped * 80}px)`;
        });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

async function loadStickyScrollEvents(panelsId, options = {}) {
    const container = document.getElementById(panelsId);
    if (!container) return;

    const { limit = 6, keyword = '', category = '' } = options;

    try {
        let url = '/api/events?';
        if (keyword) url += `keyword=${encodeURIComponent(keyword)}&`;
        if (category) url += `category=${encodeURIComponent(category)}&`;

        const response = await fetch(url);
        const events = await response.json();
        const list = events.slice(0, limit);

        container.innerHTML = '';

        if (!list.length) {
            container.innerHTML = '<p class="sticky-scroll-empty">No events for scroll preview.</p>';
            return;
        }

        list.forEach((event, i) => {
            container.innerHTML += renderStickyPanel(event, i);
        });

        requestAnimationFrame(() => initStickyScrollObserver());
    } catch (e) {
        container.innerHTML = '<p class="sticky-scroll-empty error">Could not load scroll events.</p>';
    }
}
