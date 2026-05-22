/**
 * Home page category rail (indiaeve-style circles).
 * Loads events from API and builds one tile per category with a sample image.
 */

const CATEGORY_ORDER = [
    'Wedding',
    'Birthday',
    'Corporate',
    'Mature/Family Function',
    'Other'
];

const CATEGORY_LABELS = {
    Wedding: 'Wedding',
    Birthday: 'Birthday',
    Corporate: 'Corporate',
    'Mature/Family Function': 'Family',
    Other: 'More Events'
};

/** Local themed avatars — always used for category circles (not random API samples) */
const CATEGORY_RAIL_IMAGES = {
    Wedding: '/images/category-wedding.jpg',
    Birthday: '/images/category-birthday.jpg',
    Corporate: '/images/category-corporate.jpg',
    'Mature/Family Function': '/images/category-family.jpg',
    Other: '/images/category-more-events.jpg'
};

function escAttr(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;');
}

function buildCategoryMap(events) {
    const map = {};
    events.forEach((event) => {
        const cat = event.category || 'Other';
        if (!map[cat]) {
            map[cat] = {
                count: 0,
                imageUrl: event.imageUrl,
                videoUrl: event.videoUrl
            };
        }
        map[cat].count += 1;
        if (!map[cat].imageUrl && event.imageUrl) {
            map[cat].imageUrl = event.imageUrl;
        }
        if (!map[cat].videoUrl && event.videoUrl) {
            map[cat].videoUrl = event.videoUrl;
        }
    });
    return map;
}

function renderCategoryItem(categoryKey, data) {
    const label = CATEGORY_LABELS[categoryKey] || categoryKey;
    const image =
        CATEGORY_RAIL_IMAGES[categoryKey] || CATEGORY_RAIL_IMAGES.Other;
    const count = data?.count || 0;
    const href = `/events.html?category=${encodeURIComponent(categoryKey)}`;

    const avatarMedia = `<img src="${escAttr(image)}" alt="${escAttr(label)} events" loading="lazy" width="92" height="108">`;

    return `
        <a href="${href}" class="category-rail-item" title="${escAttr(label)} — ${count} event${count === 1 ? '' : 's'}">
            <span class="category-rail-avatar">
                ${avatarMedia}
            </span>
            <span class="category-rail-label">${label}</span>
            ${count > 0 ? `<span class="category-rail-count">${count} event${count === 1 ? '' : 's'}</span>` : ''}
        </a>
    `;
}

async function initHomeCategoryRail(trackId = 'home-category-rail') {
    const track = document.getElementById(trackId);
    if (!track) return;

    try {
        const res = await fetch('/api/events');
        const events = await res.json();
        const byCategory = buildCategoryMap(events);

        const categories = CATEGORY_ORDER.filter(
            (key) => byCategory[key] || events.some((e) => e.category === key)
        );

        const keys =
            categories.length > 0
                ? categories
                : CATEGORY_ORDER.filter((key) => byCategory[key]);

        if (!keys.length) {
            track.innerHTML =
                '<p class="category-rail-empty">No events yet. <a href="/create-event.html">Create an event</a></p>';
            return;
        }

        track.innerHTML = keys
            .map((key) => renderCategoryItem(key, byCategory[key]))
            .join('');
    } catch (e) {
        track.innerHTML =
            '<p class="category-rail-empty">Could not load categories. <a href="/events.html">Browse events</a></p>';
    }
}
