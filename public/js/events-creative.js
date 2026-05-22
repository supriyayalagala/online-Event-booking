const CATEGORY_STYLE = {
    Wedding: { emoji: '💒', label: 'Wedding', bg: '#dbeafe' },
    Birthday: { emoji: '🎂', label: 'Birthday', bg: '#fef3c7' },
    Corporate: { emoji: '🏢', label: 'Corporate', bg: '#e0e7ff' },
    'Mature/Family Function': { emoji: '👨‍👩‍👧‍👦', label: 'Family', bg: '#d1fae5' },
    Other: { emoji: '🎟️', label: 'Event', bg: '#f3f4f6' }
};

function formatEventDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatEventRange(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function getCategoryStyle(category) {
    return CATEGORY_STYLE[category] || CATEGORY_STYLE.Other;
}

function renderRailColumn(event, index, isActive) {
    const style = getCategoryStyle(event.category);
    return `
        <button type="button"
            class="events-rail-col${isActive ? ' active' : ''}"
            data-index="${index}"
            data-id="${event._id}"
            aria-label="View ${event.title}"
            aria-pressed="${isActive}">
            <span class="rail-flag" style="background:${style.bg}">${style.emoji}</span>
            <span class="rail-title-vertical">${event.title}</span>
        </button>
    `;
}

function setFeaturedEvent(event, index) {
    const spine = document.getElementById('creative-spine-label');
    const title = document.getElementById('creative-title');
    const meta = document.getElementById('creative-meta');
    const video = document.getElementById('creative-video');
    const img = document.getElementById('creative-img');
    const desc = document.getElementById('creative-desc');
    const cta = document.getElementById('creative-cta');

    if (spine) spine.textContent = event.title;
    if (title) title.textContent = event.title;
    if (meta) {
        meta.textContent = `${formatEventRange(event.date)} | ${event.time} · ${event.location}`;
    }
    if (video && typeof playFeaturedEventVideo === 'function') {
        if (img) img.style.display = 'none';
        video.style.display = 'block';
        playFeaturedEventVideo(video, event);
    } else if (img) {
        if (video) video.style.display = 'none';
        img.style.display = 'block';
        img.src = event.imageUrl;
        img.alt = event.title;
    }
    if (desc) desc.textContent = event.description;
    if (cta) cta.href = `/event-details.html?id=${event._id}`;

    document.querySelectorAll('.events-rail-col').forEach((col, i) => {
        const active = i === index;
        col.classList.toggle('active', active);
        col.setAttribute('aria-pressed', active);
    });

    const main = document.getElementById('events-creative-main');
    if (main) {
        main.classList.remove('swap-in');
        void main.offsetWidth;
        main.classList.add('swap-in');
    }
}

async function initEventsCreative(containerId, options = {}) {
    const section = document.getElementById(containerId);
    const track = document.getElementById('events-rail-track');
    if (!section || !track) return;

    const { keyword = '', category = '' } = options;

    try {
        let url = '/api/events?';
        if (keyword) url += `keyword=${encodeURIComponent(keyword)}&`;
        if (category) url += `category=${encodeURIComponent(category)}&`;

        const res = await fetch(url);
        const events = await res.json();

        if (!events.length) {
            section.classList.add('empty');
            track.innerHTML = '<p class="events-creative-empty">No events to display.</p>';
            return;
        }

        section.classList.remove('empty');
        track.innerHTML = '';

        events.forEach((event, i) => {
            track.innerHTML += renderRailColumn(event, i, i === 0);
        });

        setFeaturedEvent(events[0], 0);

        track.querySelectorAll('.events-rail-col').forEach(col => {
            col.addEventListener('click', () => {
                const idx = parseInt(col.dataset.index, 10);
                setFeaturedEvent(events[idx], idx);
            });
        });

        window._eventsCreativeList = events;
    } catch (e) {
        section.classList.add('empty');
        track.innerHTML = '<p class="events-creative-empty error">Could not load events.</p>';
    }
}
