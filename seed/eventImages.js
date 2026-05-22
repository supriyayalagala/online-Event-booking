/**
 * Themed event images (Unsplash) — used by seed data and category rail fallbacks.
 * w=800&h=500 keeps a consistent banner aspect for cards and detail pages.
 */
const q = 'auto=format&fit=crop&w=800&h=500&q=80';

const EVENT_IMAGES = {
    weddingRoyal: `https://images.unsplash.com/photo-1519741497674-611481863552?${q}`,
    weddingBeach: `https://images.unsplash.com/photo-1583939003579-d81e1ae5f846?${q}`,
    weddingBarn: `https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?${q}`,
    weddingGarden: `https://images.unsplash.com/photo-1465492754090-a67e4776400e?${q}`,

    birthdayKids: `https://images.unsplash.com/photo-1530103862676-6d8b0c43a1b8?${q}`,
    birthdayTeen: `https://images.unsplash.com/photo-1492684223066-81342ee5ff30?${q}`,
    birthdayMilestone: `https://images.unsplash.com/photo-1478146059778-35e412a0b0e1?${q}`,

    corporateConference: `https://images.unsplash.com/photo-1540575467063-d7a2297a2b8c?${q}`,
    corporateRetreat: `https://images.unsplash.com/photo-1521737604893-dcc81b077127?${q}`,
    corporatePitch: `https://images.unsplash.com/photo-1556761175-b413da4baf72?${q}`,
    corporateNetworking: `https://images.unsplash.com/photo-1511574713402-22f2a4c2c8a8?${q}`,

    familyReunion: `https://images.unsplash.com/photo-1511895426328-dc8714191300?${q}`,
    familyAnniversary: `https://images.unsplash.com/photo-1522673606200-9adab763d79e?${q}`,
    familyFeast: `https://images.unsplash.com/photo-1544025162-d76694265947?${q}`,

    artExhibition: `https://images.unsplash.com/photo-1541961017774-22349e4a1262?${q}`,
    comedyShow: `https://images.unsplash.com/photo-1478737270-872c2d4f9a0d?${q}`,
    yogaWellness: `https://images.unsplash.com/photo-1544369667-0aa5a262b71d?${q}`,
    liveMusic: `https://images.unsplash.com/photo-1514525253161-7a46d19cd819?${q}`,
    streetFood: `https://images.unsplash.com/photo-1555939594-58d7cb561ad1?${q}`,
    kidsCarnival: `https://images.unsplash.com/photo-1503454537845-cef8a2b0c4c8?${q}`
};

const CATEGORY_IMAGES = {
    Wedding: EVENT_IMAGES.weddingBeach,
    Birthday: EVENT_IMAGES.birthdayKids,
    Corporate: EVENT_IMAGES.corporateConference,
    'Mature/Family Function': EVENT_IMAGES.familyReunion,
    Other: EVENT_IMAGES.artExhibition
};

module.exports = { EVENT_IMAGES, CATEGORY_IMAGES };
