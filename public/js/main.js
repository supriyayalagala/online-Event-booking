const BRAND = 'TicketFlow';

/** Format amount as Indian Rupees (₹). Amounts in DB are stored in INR. */
function formatPrice(amount) {
    const n = Number(amount);
    if (Number.isNaN(n)) return '₹0.00';
    return '₹' + n.toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

const NAV_ITEMS = [
    { id: 'home', label: 'Home', href: '/' },
    {
        id: 'how-it-works',
        label: 'How It Works',
        href: '/how-it-works.html',
        children: [
            { label: 'Three simple steps', href: '/how-it-works.html' },
            { label: 'Create your event', href: '/create-event.html' },
            { label: 'Book a demo', href: '/book-demo.html' }
        ]
    },
    {
        id: 'features',
        label: 'Features',
        href: '/features.html',
        children: [
            { label: 'All features', href: '/features.html' },
            { label: 'Admin dashboard', href: '/admin.html' },
            { label: 'My bookings', href: '/my-bookings.html' },
            { label: 'Secure sign up', href: '/register.html' }
        ]
    },
    {
        id: 'events',
        label: 'Events',
        href: '/events.html',
        children: [
            { label: 'Browse all events', href: '/events.html' },
            { label: 'Weddings', href: '/events.html?category=Wedding' },
            { label: 'Birthdays', href: '/events.html?category=Birthday' },
            { label: 'Corporate', href: '/events.html?category=Corporate' },
            { label: 'Family functions', href: '/events.html?category=Mature/Family Function' }
        ]
    },
    { id: 'pricing', label: 'Pricing', href: '/pricing.html' },
    {
        id: 'use-cases',
        label: 'Use Cases',
        href: '/use-cases.html',
        children: [
            { label: 'All use cases', href: '/use-cases.html' },
            { label: 'Weddings', href: '/use-cases.html' },
            { label: 'Corporate', href: '/events.html?category=Corporate' }
        ]
    },
    {
        id: 'support',
        label: 'Support',
        href: '/book-demo.html',
        children: [
            { label: 'Book a demo', href: '/book-demo.html' },
            { label: 'Contact us', href: '/book-demo.html' },
            { label: 'Log in help', href: '/login.html' }
        ]
    }
];

function getUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
}

function getToken() {
    const user = getUser();
    return user ? user.token : null;
}

function logout() {
    localStorage.removeItem('user');
    window.location.href = '/login.html';
}

function logoHtml() {
    return `<a href="/" class="logo"><span class="logo-icon">TF</span><span class="logo-text">${BRAND}</span></a>`;
}

function renderNavItem(item, activePage) {
    const isActive = item.id === activePage;
    const hasChildren = item.children && item.children.length;

    if (!hasChildren) {
        return `<li class="nav-item${isActive ? ' active' : ''}">
            <a href="${item.href}" class="nav-top-link${isActive ? ' active' : ''}">${item.label}</a>
        </li>`;
    }

    const childLinks = item.children.map(c =>
        `<li class="nav-dropdown-item"><a href="${c.href}">${c.label}</a></li>`
    ).join('');

    return `<li class="nav-item has-dropdown${isActive ? ' active' : ''}" data-nav="${item.id}">
        <a href="${item.href}" class="nav-top-link${isActive ? ' active' : ''}" aria-haspopup="true" aria-expanded="false">
            <span class="nav-link-text">${item.label}</span>
            <span class="nav-chevron" aria-hidden="true">
                <svg width="11" height="7" viewBox="0 0 11 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1.5L5.5 5.5L10 1.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </span>
        </a>
        <div class="nav-dropdown-bridge" aria-hidden="true"></div>
        <ul class="nav-dropdown" role="menu">
            <li class="nav-dropdown-heading" role="presentation">${item.label}</li>
            ${childLinks}
        </ul>
    </li>`;
}

function renderUtilityNav(user) {
    let accountHtml = `
        <li><a href="/login.html" class="nav-utility-link">Log in</a></li>
        <li><a href="/register.html" class="nav-utility-link nav-utility-signup">Sign up</a></li>
    `;

    if (user) {
        accountHtml = `
            <li class="nav-utility-user">Hi, ${user.name}</li>
            <li><a href="/my-bookings.html" class="nav-utility-link">My Bookings</a></li>
            ${user.role === 'admin' ? '<li><a href="/admin.html" class="nav-utility-link">Dashboard</a></li>' : ''}
            <li><button type="button" class="nav-utility-link nav-utility-btn" onclick="logout()">Logout</button></li>
        `;
    }

    return `
        <ul class="nav-utilities">
            <li>
                <button type="button" class="nav-icon-btn" id="search-open" aria-label="Search events">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                </button>
            </li>
            ${accountHtml}
            <li><a href="/book-demo.html" class="nav-utility-link">Contact Us</a></li>
        </ul>
    `;
}

function renderSiteNavbar(activePage = '') {
    const user = getUser();
    const navLinks = NAV_ITEMS.map(item => renderNavItem(item, activePage)).join('');

    return `
        ${logoHtml()}
        <button type="button" class="nav-toggle" id="nav-toggle" aria-label="Open menu">☰</button>
        <ul class="nav-center" id="nav-center">${navLinks}</ul>
        ${renderUtilityNav(user)}
    `;
}

function ensureSearchModal() {
    if (document.getElementById('search-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'search-modal';
    modal.className = 'search-modal';
    modal.innerHTML = `
        <div class="search-modal-backdrop" id="search-close"></div>
        <div class="search-modal-box" role="dialog" aria-label="Search events">
            <button type="button" class="search-modal-close" id="search-close-btn" aria-label="Close">×</button>
            <h3>Search events</h3>
            <form id="search-form">
                <input type="text" id="search-input" placeholder="Search by event name..." autofocus>
                <button type="submit" class="btn btn-primary">Search</button>
            </form>
        </div>
    `;
    document.body.appendChild(modal);

    const close = () => modal.classList.remove('open');
    document.getElementById('search-close').addEventListener('click', close);
    document.getElementById('search-close-btn').addEventListener('click', close);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') close();
    });

    document.getElementById('search-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const q = document.getElementById('search-input').value.trim();
        window.location.href = q
            ? `/events.html?keyword=${encodeURIComponent(q)}`
            : '/events.html';
    });
}

function initSearchModal() {
    ensureSearchModal();
    const openBtn = document.getElementById('search-open');
    const modal = document.getElementById('search-modal');
    if (!openBtn || !modal) return;

    openBtn.addEventListener('click', () => {
        modal.classList.add('open');
        const input = document.getElementById('search-input');
        if (input) {
            input.value = '';
            setTimeout(() => input.focus(), 100);
        }
    });
}

function setDropdownOpen(item, open) {
    const link = item.querySelector('.nav-top-link');
    item.classList.toggle('open', open);
    if (link) link.setAttribute('aria-expanded', open ? 'true' : 'false');
}

function initNavDropdowns() {
    const items = document.querySelectorAll('.nav-item.has-dropdown');

    items.forEach(item => {
        const link = item.querySelector('.nav-top-link');
        let closeTimer;

        const open = () => {
            clearTimeout(closeTimer);
            items.forEach(i => { if (i !== item) setDropdownOpen(i, false); });
            setDropdownOpen(item, true);
        };

        const scheduleClose = () => {
            closeTimer = setTimeout(() => setDropdownOpen(item, false), 120);
        };

        item.addEventListener('mouseenter', open);
        item.addEventListener('mouseleave', scheduleClose);

        link.addEventListener('click', (e) => {
            if (window.innerWidth <= 1024) {
                e.preventDefault();
                setDropdownOpen(item, !item.classList.contains('open'));
            }
        });

        link.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                if (window.innerWidth <= 1024) {
                    e.preventDefault();
                    setDropdownOpen(item, !item.classList.contains('open'));
                }
            }
            if (e.key === 'Escape') setDropdownOpen(item, false);
        });
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-item.has-dropdown')) {
            items.forEach(i => setDropdownOpen(i, false));
        }
    });
}

function initNavbar(activePage = '') {
    const nav = document.getElementById('navbar');
    if (!nav) return;

    nav.className = 'navbar navbar-tcs';
    nav.innerHTML = renderSiteNavbar(activePage);

    const toggle = document.getElementById('nav-toggle');
    const center = document.getElementById('nav-center');
    if (toggle && center) {
        toggle.addEventListener('click', () => {
            center.classList.toggle('open');
            nav.classList.toggle('menu-open');
        });
    }

    initSearchModal();
    initNavDropdowns();
}

function renderFooter() {
    const footer = document.getElementById('site-footer');
    if (!footer) return;

    footer.innerHTML = `
        <div class="footer-grid">
            <div>
                <h4>${BRAND}</h4>
                <p class="footer-tagline">Smart event management &amp; online ticketing for organizers.</p>
                <a href="/">Home</a>
                <a href="/events.html">Browse Events</a>
            </div>
            <div>
                <h4>Platform</h4>
                <a href="/how-it-works.html">How It Works</a>
                <a href="/features.html">Features</a>
                <a href="/pricing.html">Pricing</a>
                <a href="/use-cases.html">Use Cases</a>
            </div>
            <div>
                <h4>Support</h4>
                <a href="/book-demo.html">Book a Demo</a>
                <a href="/login.html">Log in</a>
                <a href="/register.html">Sign up</a>
            </div>
            <div>
                <h4>Organizers</h4>
                <a href="/create-event.html">Create Event</a>
                <a href="/admin.html">Admin Dashboard</a>
            </div>
        </div>
        <p class="footer-bottom">&copy; 2026 ${BRAND}. All rights reserved.</p>
    `;
}

function escHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

const TICKET_ICON_LOCATION = `<svg class="ticket-event-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>`;
const TICKET_ICON_CALENDAR = `<svg class="ticket-event-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>`;
const TICKET_ICON_SHARE = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.59 13.51 6.83 3.98M15.41 6.51l-6.82 3.98"/></svg>`;

function renderTicketEventCard(event) {
    const date = new Date(event.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
    const time = event.time ? String(event.time) : '';
    const dateLine = time ? `${date} | ${time}` : date;
    const price = formatPrice(event.price);
    const detailsUrl = `/event-details.html?id=${event._id}`;
    const title = escHtml(event.title);
    const location = escHtml(event.location);

    return `
        <article class="ticket-event-card">
            <a href="${detailsUrl}" class="ticket-event-card-img-link">
                ${typeof renderEventCardMedia === 'function'
                    ? renderEventCardMedia(event, { imgClass: 'ticket-event-card-img', wrapClass: 'event-media-wrap ticket-event-card-media' })
                    : `<img src="${escHtml(event.imageUrl)}" alt="${title}" class="ticket-event-card-img" loading="lazy">`}
            </a>
            <div class="ticket-event-card-body">
                <div class="ticket-event-card-head">
                    <a href="${detailsUrl}" class="ticket-event-card-title-link">
                        <h3 class="ticket-event-card-title">${title}</h3>
                    </a>
                    <div class="ticket-event-share-wrap">
                        <button type="button" class="ticket-event-share" data-share-url="${detailsUrl}" data-share-title="${title}" aria-label="Share ${title}" aria-expanded="false" aria-haspopup="true">
                            ${TICKET_ICON_SHARE}
                        </button>
                        <div class="ticket-share-menu" role="menu" hidden>
                            <p class="ticket-share-menu-label">Share via</p>
                            <div class="ticket-share-icons" role="group"></div>
                        </div>
                    </div>
                </div>
                <p class="ticket-event-meta">${TICKET_ICON_LOCATION}<span>${location}</span></p>
                <p class="ticket-event-meta">${TICKET_ICON_CALENDAR}<span>${escHtml(dateLine)}</span></p>
                <div class="ticket-event-footer">
                    <a href="${detailsUrl}" class="ticket-event-book">Book Now</a>
                    <p class="ticket-event-price">From <span class="ticket-event-price-value">${price}</span></p>
                </div>
            </div>
        </article>
    `;
}

function renderEventCard(event) {
    return renderTicketEventCard(event);
}

const TICKET_SHARE_NETWORKS = [
    {
        id: 'whatsapp',
        label: 'WhatsApp',
        className: 'ticket-share-whatsapp',
        icon: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>`,
        getUrl: (url, title) =>
            `https://wa.me/?text=${encodeURIComponent(`Check out ${title}! ${url}`)}`
    },
    {
        id: 'linkedin',
        label: 'LinkedIn',
        className: 'ticket-share-linkedin',
        icon: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 4.126 0 2.062 2.062 0 0 1-2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,
        getUrl: (url) =>
            `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    },
    {
        id: 'facebook',
        label: 'Facebook',
        className: 'ticket-share-facebook',
        icon: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`,
        getUrl: (url) =>
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    },
    {
        id: 'twitter',
        label: 'X',
        className: 'ticket-share-twitter',
        icon: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
        getUrl: (url, title) =>
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`
    },
    {
        id: 'email',
        label: 'Email',
        className: 'ticket-share-email',
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 6.48a2 2 0 0 1-2.06 0L2 7"/></svg>`,
        getUrl: (url, title) =>
            `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Check out this event: ${url}`)}`
    }
];

function buildShareMenuIcons(menu, fullUrl, title) {
    const iconsEl = menu.querySelector('.ticket-share-icons');
    if (!iconsEl || iconsEl.dataset.built === '1') return;

    let html = '';
    TICKET_SHARE_NETWORKS.forEach((net) => {
        const href = net.getUrl(fullUrl, title);
        html += `
            <a href="${href}" class="ticket-share-link ${net.className}" target="_blank" rel="noopener noreferrer" role="menuitem" title="Share on ${net.label}" aria-label="Share on ${net.label}">
                ${net.icon}
                <span>${net.label}</span>
            </a>
        `;
    });
    html += `
        <button type="button" class="ticket-share-link ticket-share-copy" role="menuitem" title="Copy link" aria-label="Copy link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            <span>Copy link</span>
        </button>
    `;
    iconsEl.innerHTML = html;
    iconsEl.dataset.built = '1';

    iconsEl.querySelector('.ticket-share-copy')?.addEventListener('click', async (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        try {
            await navigator.clipboard.writeText(fullUrl);
            const span = ev.currentTarget.querySelector('span');
            if (span) {
                const orig = span.textContent;
                span.textContent = 'Copied!';
                setTimeout(() => { span.textContent = orig; }, 2000);
            }
        } catch (_) {
            window.prompt('Copy event link:', fullUrl);
        }
    });
}

function closeAllShareMenus() {
    document.querySelectorAll('.ticket-share-menu').forEach((menu) => {
        menu.hidden = true;
    });
    document.querySelectorAll('.ticket-event-share[aria-expanded="true"]').forEach((btn) => {
        btn.setAttribute('aria-expanded', 'false');
    });
}

function positionShareMenu(btn, menu) {
    const rect = btn.getBoundingClientRect();
    const menuWidth = 220;
    let left = rect.right - menuWidth;
    if (left < 8) left = 8;
    if (left + menuWidth > window.innerWidth - 8) {
        left = window.innerWidth - menuWidth - 8;
    }
    let top = rect.bottom + 6;
    menu.style.position = 'fixed';
    menu.style.top = `${top}px`;
    menu.style.left = `${left}px`;
    menu.style.right = 'auto';
    menu.style.zIndex = '10000';

    requestAnimationFrame(() => {
        const menuRect = menu.getBoundingClientRect();
        if (menuRect.bottom > window.innerHeight - 8) {
            top = rect.top - menuRect.height - 6;
            menu.style.top = `${Math.max(8, top)}px`;
        }
    });
}

function initEventCardShare() {
    document.addEventListener('click', (e) => {
        const copyBtn = e.target.closest('.ticket-share-copy');
        if (copyBtn) {
            e.stopPropagation();
            return;
        }

        const socialLink = e.target.closest('.ticket-share-link:not(.ticket-share-copy)');
        if (socialLink) {
            closeAllShareMenus();
            return;
        }

        const btn = e.target.closest('.ticket-event-share');
        if (btn) {
            e.preventDefault();
            e.stopPropagation();
            const wrap = btn.closest('.ticket-event-share-wrap');
            const menu = wrap?.querySelector('.ticket-share-menu');
            if (!menu) return;

            const isOpen = !menu.hidden;
            closeAllShareMenus();
            if (isOpen) return;

            const fullUrl = window.location.origin + btn.dataset.shareUrl;
            const title = btn.dataset.shareTitle || 'Event';
            buildShareMenuIcons(menu, fullUrl, title);
            menu.hidden = false;
            btn.setAttribute('aria-expanded', 'true');
            positionShareMenu(btn, menu);
            return;
        }

        if (!e.target.closest('.ticket-share-menu')) {
            closeAllShareMenus();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeAllShareMenus();
    });

    window.addEventListener('resize', closeAllShareMenus);
    window.addEventListener('scroll', closeAllShareMenus, true);
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', initEventCardShare);
}

function getManageBookingsUrl() {
    const user = getUser();
    if (!user) return '/login.html?redirect=' + encodeURIComponent('/my-bookings.html');
    if (user.role === 'admin') return '/admin.html#bookings';
    return '/my-bookings.html';
}

function getAdminDashboardUrl() {
    const user = getUser();
    if (!user) return '/login.html?redirect=' + encodeURIComponent('/admin.html');
    if (user.role === 'admin') return '/admin.html';
    return '/my-bookings.html';
}

function getPaymentTrackingUrl() {
    return getManageBookingsUrl();
}

function getGuestManagementUrl() {
    const user = getUser();
    if (!user) return '/login.html?redirect=' + encodeURIComponent('/create-event.html');
    if (user.role === 'admin') return '/create-event.html';
    return '/book-demo.html';
}

function initStepCards() {
    const manageCard = document.getElementById('step-manage-bookings');
    if (!manageCard) return;
    manageCard.href = getManageBookingsUrl();
    const user = getUser();
    const action = manageCard.querySelector('.step-action');
    if (!action) return;
    if (!user) action.textContent = 'Log in to manage →';
    else if (user.role === 'admin') action.textContent = 'Open dashboard →';
    else action.textContent = 'View my bookings →';
}

function initFeatureCards() {
    const user = getUser();
    const adminCard = document.getElementById('feature-admin');
    if (adminCard) {
        adminCard.href = getAdminDashboardUrl();
        const action = adminCard.querySelector('.feature-action');
        if (action) {
            if (!user) action.textContent = 'Log in as admin →';
            else if (user.role === 'admin') action.textContent = 'Open dashboard →';
            else action.textContent = 'View my bookings →';
        }
    }
    const paymentsCard = document.getElementById('feature-payments');
    if (paymentsCard) {
        paymentsCard.href = getPaymentTrackingUrl();
        const action = paymentsCard.querySelector('.feature-action');
        if (action) {
            if (!user) action.textContent = 'Log in to track →';
            else if (user.role === 'admin') action.textContent = 'Manage payments →';
            else action.textContent = 'View my bookings →';
        }
    }
    const guestsCard = document.getElementById('feature-guests');
    if (guestsCard) {
        guestsCard.href = getGuestManagementUrl();
        const action = guestsCard.querySelector('.feature-action');
        if (action) {
            if (!user) action.textContent = 'Log in to manage →';
            else if (user.role === 'admin') action.textContent = 'Create event →';
            else action.textContent = 'Book a demo →';
        }
    }
}

async function loadFeaturedEvents(containerId, limit = 3) {
    const container = document.getElementById(containerId);
    if (!container) return;
    try {
        const response = await fetch('/api/events');
        const events = await response.json();
        container.innerHTML = '';
        if (!events.length) {
            container.innerHTML = '<p class="empty-msg">No events yet. Check back soon!</p>';
            return;
        }
        events.slice(0, limit).forEach(event => {
            container.innerHTML += renderEventCard(event);
        });
    } catch (error) {
        container.innerHTML = '<p class="empty-msg error">Failed to load events.</p>';
    }
}
