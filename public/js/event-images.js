/**
 * Client-side themed images (mirrors utils/eventImageResolver.js).
 */
const LF = (tags, lock) => `https://loremflickr.com/800/500/${tags}?lock=${lock}`;

const EVENT_IMAGES = {
    weddingRoyal: '/images/grand-royal-wedding.jpg',
    weddingBeach: LF('beach,wedding', 108),
    weddingBarn: LF('barn,wedding', 109),
    weddingGarden: '/images/garden-wedding.jpg',
    birthdayKids: LF('birthday,party', 110),
    birthdayTeen: LF('party,neon', 111),
    birthdayMilestone: LF('birthday,elegant', 112),
    corporateConference: LF('conference,technology', 113),
    corporateRetreat: LF('mountain,retreat', 114),
    corporatePitch: LF('startup,presentation', 115),
    corporateNetworking: '/images/corporate-networking.jpg',
    familyReunion: LF('family,reunion', 116),
    familyAnniversary: LF('anniversary,couple', 117),
    familyFeast: LF('thanksgiving,dinner', 118),
    artExhibition: LF('art,gallery', 119),
    comedyShow: '/images/standup-comedy.jpg',
    comedyChicago: LF('comedy,microphone', 121),
    yogaWellness: '/images/yoga-wellness.jpg',
    liveMusic: LF('sunset,acoustic,guitar', 1501),
    streetFood: '/images/street-food-festival.jpg',
    kidsCarnival: '/images/kids-carnival.jpg'
};

const CATEGORY_DEFAULT_IMAGES = {
    Wedding: '/images/category-wedding.jpg',
    Birthday: '/images/category-birthday.jpg',
    Corporate: '/images/category-corporate.jpg',
    'Mature/Family Function': '/images/category-family.jpg',
    Other: '/images/category-more-events.jpg'
};

const IMAGE_BY_TITLE = {
    'Sunset Acoustic Session': EVENT_IMAGES.liveMusic,
    'Corporate Networking Mixer': EVENT_IMAGES.corporateNetworking,
    'Stand-Up Comedy Night': EVENT_IMAGES.comedyShow,
    'Garden Wedding Showcase': EVENT_IMAGES.weddingGarden,
    'Street Food Festival': EVENT_IMAGES.streetFood,
    'Kids Carnival & Birthday Fair': EVENT_IMAGES.kidsCarnival,
    'Grand Royal Wedding': EVENT_IMAGES.weddingRoyal,
    'Beachside Wedding Bliss': EVENT_IMAGES.weddingBeach,
    'Rustic Barn Wedding': EVENT_IMAGES.weddingBarn,
    'Kids Fun Birthday Bash': EVENT_IMAGES.birthdayKids,
    'Sweet 16 Glow Party': EVENT_IMAGES.birthdayTeen,
    'Elegant 50th Jubilee': EVENT_IMAGES.birthdayMilestone,
    'Annual Tech Summit 2026': EVENT_IMAGES.corporateConference,
    'Executive Leadership Retreat': EVENT_IMAGES.corporateRetreat,
    'Startup Pitch Night': EVENT_IMAGES.corporatePitch,
    'Annual Family Get-Together': EVENT_IMAGES.familyReunion,
    'Golden Anniversary Celebration': EVENT_IMAGES.familyAnniversary,
    'Thanksgiving Feast': EVENT_IMAGES.familyFeast,
    'Local Art Exhibition': EVENT_IMAGES.artExhibition,
    'Yoga and Wellness Retreat': EVENT_IMAGES.yogaWellness
};

function suggestEventImage(category, title = '') {
    const t = title.trim();
    if (t === 'Stand-Up Comedy Night') return EVENT_IMAGES.comedyShow;
    if (IMAGE_BY_TITLE[t]) return IMAGE_BY_TITLE[t];

    const lower = t.toLowerCase();
    if (category === 'Wedding') {
        if (/beach|ocean|seaside|malibu|coast/i.test(lower)) return EVENT_IMAGES.weddingBeach;
        if (/barn|rustic|farm/i.test(lower)) return EVENT_IMAGES.weddingBarn;
        if (/garden|rose/i.test(lower)) return EVENT_IMAGES.weddingGarden;
        return EVENT_IMAGES.weddingRoyal;
    }
    if (category === 'Birthday') {
        if (/kid|child|carnival/i.test(lower)) return EVENT_IMAGES.birthdayKids;
        if (/16|glow|neon|sweet/i.test(lower)) return EVENT_IMAGES.birthdayTeen;
        return EVENT_IMAGES.birthdayMilestone;
    }
    if (category === 'Corporate') {
        if (/retreat|leadership/i.test(lower)) return EVENT_IMAGES.corporateRetreat;
        if (/pitch|startup/i.test(lower)) return EVENT_IMAGES.corporatePitch;
        if (/network|mixer/i.test(lower)) return EVENT_IMAGES.corporateNetworking;
        return EVENT_IMAGES.corporateConference;
    }
    if (category === 'Mature/Family Function') {
        if (/anniversary|golden/i.test(lower)) return EVENT_IMAGES.familyAnniversary;
        if (/thanksgiving|feast/i.test(lower)) return EVENT_IMAGES.familyFeast;
        return EVENT_IMAGES.familyReunion;
    }
    if (/comedy|stand/i.test(lower)) return EVENT_IMAGES.comedyShow;
    if (/yoga|wellness/i.test(lower)) return EVENT_IMAGES.yogaWellness;
    if (/music|acoustic|concert/i.test(lower)) return EVENT_IMAGES.liveMusic;
    if (/food|festival/i.test(lower)) return EVENT_IMAGES.streetFood;
    if (/art|exhibition/i.test(lower)) return EVENT_IMAGES.artExhibition;
    return CATEGORY_DEFAULT_IMAGES[category] || EVENT_IMAGES.artExhibition;
}
