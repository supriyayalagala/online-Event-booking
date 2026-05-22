/**
 * Short themed event clips (Pexels SD — reliable in browser).
 */
const px = (id) =>
    `https://videos.pexels.com/video-files/${id}/${id}-sd_640_360_30fps.mp4`;

/** Sticky home hero — local destination wedding (outdoor / scenic venue) */
const HERO_HOME_VIDEO = '/videos/hero-destination-wedding.mp4';
const HERO_HOME_VIDEO_HD = HERO_HOME_VIDEO;
const WEDDING_EVENT_VIDEO = '/videos/wedding-card.mp4';

const POOL = {
    wedding: WEDDING_EVENT_VIDEO,
    birthday: px(1093661),
    corporate: px(1093662),
    concert: px(1093663),
    comedy: px(1093664),
    food: px(1093665),
    family: px(1093666),
    wellness: px(1093667),
    general: px(3209833)
};

/** One clip per seeded event title */
const VIDEO_BY_TITLE = {
    'Sunset Acoustic Session': '',
    'Corporate Networking Mixer': '',
    'Stand-Up Comedy Night': '',
    'Garden Wedding Showcase': '',
    'Street Food Festival': '',
    'Kids Carnival & Birthday Fair': '',

    'Grand Royal Wedding': '',
    'Beachside Wedding Bliss': WEDDING_EVENT_VIDEO,
    'Rustic Barn Wedding': POOL.wedding,

    'Kids Fun Birthday Bash': POOL.birthday,
    'Sweet 16 Glow Party': POOL.birthday,
    'Elegant 50th Jubilee': POOL.birthday,

    'Annual Tech Summit 2026': POOL.corporate,
    'Executive Leadership Retreat': POOL.corporate,
    'Startup Pitch Night': POOL.corporate,

    'Annual Family Get-Together': POOL.family,
    'Golden Anniversary Celebration': POOL.family,
    'Thanksgiving Feast': POOL.family,

    'Local Art Exhibition': POOL.general,
    'Yoga and Wellness Retreat': ''
};

const CATEGORY_DEFAULT_VIDEO = {
    Wedding: POOL.wedding,
    Birthday: POOL.birthday,
    Corporate: POOL.corporate,
    'Mature/Family Function': POOL.family,
    Other: POOL.general
};

function resolveEventVideo(event) {
    if (!event) return CATEGORY_DEFAULT_VIDEO.Other;

    const title = (event.title || '').trim();
    if (title === 'Stand-Up Comedy Night' && /chicago/i.test(event.location || '')) {
        return POOL.comedy;
    }
    if (Object.prototype.hasOwnProperty.call(VIDEO_BY_TITLE, title)) {
        return VIDEO_BY_TITLE[title];
    }

    const t = title.toLowerCase();
    const cat = event.category || '';

    if (cat === 'Wedding') return POOL.wedding;
    if (cat === 'Birthday') return POOL.birthday;
    if (cat === 'Corporate') return POOL.corporate;
    if (cat === 'Mature/Family Function') return POOL.family;

    if (/comedy|stand|laugh|humor/i.test(t)) return POOL.comedy;
    if (/yoga|wellness|meditation|zen/i.test(t)) return POOL.wellness;
    if (/music|acoustic|concert|live|dj/i.test(t)) return POOL.concert;
    if (/food|festival|street|culinary/i.test(t)) return POOL.food;
    if (/wedding|bride|groom|ceremony/i.test(t)) return POOL.wedding;
    if (/birthday|party|carnival/i.test(t)) return POOL.birthday;
    if (/corporate|network|summit|conference|pitch/i.test(t)) return POOL.corporate;
    if (/family|anniversary|reunion|thanksgiving/i.test(t)) return POOL.family;

    return CATEGORY_DEFAULT_VIDEO[cat] || POOL.general;
}

module.exports = {
    POOL,
    HERO_HOME_VIDEO,
    HERO_HOME_VIDEO_HD,
    VIDEO_BY_TITLE,
    CATEGORY_DEFAULT_VIDEO,
    resolveEventVideo
};
