const { resolveEventVideo } = require('./eventVideoResolver');

/**
 * Themed cover images for every event — used by API responses and seed data.
 * Uses loremflickr (Unsplash IDs in this env return 404).
 */
const LF = (tags, lock) => `https://loremflickr.com/800/500/${tags}?lock=${lock}`;

/** Local themed stills (loremflickr tags are unreliable for some events) */
const CORPORATE_NETWORKING_IMAGE = '/images/corporate-networking.jpg';
const STANDUP_COMEDY_IMAGE = '/images/standup-comedy.jpg';
const GARDEN_WEDDING_IMAGE = '/images/garden-wedding.jpg';
const STREET_FOOD_IMAGE = '/images/street-food-festival.jpg';
const KIDS_CARNIVAL_IMAGE = '/images/kids-carnival.jpg';
const YOGA_WELLNESS_IMAGE = '/images/yoga-wellness.jpg';
const GRAND_ROYAL_WEDDING_IMAGE = '/images/grand-royal-wedding.jpg';
const CATEGORY_WEDDING_IMAGE = '/images/category-wedding.jpg';
const CATEGORY_BIRTHDAY_IMAGE = '/images/category-birthday.jpg';
const CATEGORY_CORPORATE_IMAGE = '/images/category-corporate.jpg';
const CATEGORY_FAMILY_IMAGE = '/images/category-family.jpg';
const CATEGORY_MORE_EVENTS_IMAGE = '/images/category-more-events.jpg';

/** One unique image per seeded event title */
const IMAGE_BY_TITLE = {
    'Sunset Acoustic Session': LF('sunset,acoustic,guitar', 1501),
    'Corporate Networking Mixer': CORPORATE_NETWORKING_IMAGE,
    'Stand-Up Comedy Night': STANDUP_COMEDY_IMAGE,
    'Garden Wedding Showcase': GARDEN_WEDDING_IMAGE,
    'Street Food Festival': STREET_FOOD_IMAGE,
    'Kids Carnival & Birthday Fair': KIDS_CARNIVAL_IMAGE,

    'Grand Royal Wedding': GRAND_ROYAL_WEDDING_IMAGE,
    'Beachside Wedding Bliss': LF('wedding,ceremony', 108),
    'Rustic Barn Wedding': LF('barn,wedding', 109),

    'Kids Fun Birthday Bash': LF('birthday,party', 110),
    'Sweet 16 Glow Party': LF('party,neon', 111),
    'Elegant 50th Jubilee': LF('birthday,elegant', 112),

    'Annual Tech Summit 2026': LF('conference,technology', 113),
    'Executive Leadership Retreat': LF('mountain,retreat', 114),
    'Startup Pitch Night': LF('startup,presentation', 115),

    'Annual Family Get-Together': LF('family,reunion', 116),
    'Golden Anniversary Celebration': LF('anniversary,couple', 117),
    'Thanksgiving Feast': LF('thanksgiving,dinner', 118),

    'Local Art Exhibition': LF('art,gallery', 119),
    'Yoga and Wellness Retreat': YOGA_WELLNESS_IMAGE
};

const CATEGORY_DEFAULT = {
    Wedding: CATEGORY_WEDDING_IMAGE,
    Birthday: CATEGORY_BIRTHDAY_IMAGE,
    Corporate: CATEGORY_CORPORATE_IMAGE,
    'Mature/Family Function': CATEGORY_FAMILY_IMAGE,
    Other: CATEGORY_MORE_EVENTS_IMAGE
};

function resolveEventImage(event) {
    if (!event) return CATEGORY_DEFAULT.Other;

    const title = (event.title || '').trim();
    if (title === 'Stand-Up Comedy Night' && /chicago/i.test(event.location || '')) {
        return STANDUP_COMEDY_IMAGE;
    }
    if (IMAGE_BY_TITLE[title]) return IMAGE_BY_TITLE[title];

    const t = title.toLowerCase();
    const cat = event.category || '';

    if (cat === 'Wedding') {
        if (/beach|ocean|seaside|malibu|coast/i.test(t)) return IMAGE_BY_TITLE['Beachside Wedding Bliss'];
        if (/barn|rustic|farm|country/i.test(t)) return IMAGE_BY_TITLE['Rustic Barn Wedding'];
        if (/garden|rose|outdoor/i.test(t)) return IMAGE_BY_TITLE['Garden Wedding Showcase'];
        return IMAGE_BY_TITLE['Grand Royal Wedding'];
    }

    if (cat === 'Birthday') {
        if (/kid|child|carnival|fun|bash/i.test(t)) return IMAGE_BY_TITLE['Kids Fun Birthday Bash'];
        if (/16|glow|neon|sweet|teen|party/i.test(t)) return IMAGE_BY_TITLE['Sweet 16 Glow Party'];
        if (/50|jubilee|elegant|milestone/i.test(t)) return IMAGE_BY_TITLE['Elegant 50th Jubilee'];
        return IMAGE_BY_TITLE['Kids Carnival & Birthday Fair'];
    }

    if (cat === 'Corporate') {
        if (/retreat|leadership|executive|mountain/i.test(t)) return IMAGE_BY_TITLE['Executive Leadership Retreat'];
        if (/pitch|startup|investor/i.test(t)) return IMAGE_BY_TITLE['Startup Pitch Night'];
        if (/network|mixer|meet/i.test(t)) return IMAGE_BY_TITLE['Corporate Networking Mixer'];
        if (/tech|summit|conference/i.test(t)) return IMAGE_BY_TITLE['Annual Tech Summit 2026'];
        return CATEGORY_DEFAULT.Corporate;
    }

    if (cat === 'Mature/Family Function') {
        if (/anniversary|golden|50/i.test(t)) return IMAGE_BY_TITLE['Golden Anniversary Celebration'];
        if (/thanksgiving|feast|dinner|meal/i.test(t)) return IMAGE_BY_TITLE['Thanksgiving Feast'];
        return IMAGE_BY_TITLE['Annual Family Get-Together'];
    }

    if (/comedy|stand|laugh|humor/i.test(t)) return IMAGE_BY_TITLE['Stand-Up Comedy Night'];
    if (/yoga|wellness|meditation|zen/i.test(t)) return IMAGE_BY_TITLE['Yoga and Wellness Retreat'];
    if (/music|acoustic|concert|live|dj/i.test(t)) return IMAGE_BY_TITLE['Sunset Acoustic Session'];
    if (/food|festival|street|culinary/i.test(t)) return IMAGE_BY_TITLE['Street Food Festival'];
    if (/art|exhibition|gallery|museum/i.test(t)) return IMAGE_BY_TITLE['Local Art Exhibition'];

    return CATEGORY_DEFAULT[cat] || CATEGORY_DEFAULT.Other;
}

/** Attach themed image to one event or array (mutates plain objects) */
function withEventImages(data) {
    if (Array.isArray(data)) {
        return data.map((ev) => {
            const o = ev.toObject ? ev.toObject() : { ...ev };
            o.imageUrl = resolveEventImage(o);
            o.videoUrl = resolveEventVideo(o);
            return o;
        });
    }
    const o = data.toObject ? data.toObject() : { ...data };
    o.imageUrl = resolveEventImage(o);
    o.videoUrl = resolveEventVideo(o);
    return o;
}

module.exports = {
    IMAGE_BY_TITLE,
    CATEGORY_DEFAULT,
    CORPORATE_NETWORKING_IMAGE,
    STANDUP_COMEDY_IMAGE,
    GARDEN_WEDDING_IMAGE,
    STREET_FOOD_IMAGE,
    KIDS_CARNIVAL_IMAGE,
    YOGA_WELLNESS_IMAGE,
    resolveEventImage,
    resolveEventVideo,
    withEventImages
};
