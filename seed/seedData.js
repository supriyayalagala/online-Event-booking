const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Event = require('../models/Event');
const { resolveEventImage } = require('../utils/eventImageResolver');

dotenv.config();

/** Convert legacy USD amounts to INR (approx. â‚¹83 per $1) for seed data */
const inr = (usd) => Math.round(usd * 83);

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/event-booking')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

/** Dates relative to when seed runs â€” powers Today / Tomorrow / This Week filters */
const seedToday = new Date();
seedToday.setHours(12, 0, 0, 0);
const seedTomorrow = new Date(seedToday);
seedTomorrow.setDate(seedTomorrow.getDate() + 1);
const seedDayPlus3 = new Date(seedToday);
seedDayPlus3.setDate(seedDayPlus3.getDate() + 3);
const seedDayPlus5 = new Date(seedToday);
seedDayPlus5.setDate(seedDayPlus5.getDate() + 5);

const nearTermEvents = [
    {
        title: 'Sunset Acoustic Session',
        description: 'An intimate live music evening on the rooftop â€” limited seats, book today.',
        category: 'Other',
        price: inr(45),
        date: new Date(seedToday),
        time: '19:00',
        location: 'Skyline Terrace, Mumbai',
        imageUrl: '',
        capacity: 120,
        availableSeats: 85
    },
    {
        title: 'Corporate Networking Mixer',
        description: 'Meet founders and professionals over coffee and light bites.',
        category: 'Corporate',
        price: inr(25),
        date: new Date(seedToday),
        time: '17:30',
        location: 'Innovation Hub, Bengaluru',
        imageUrl: '',
        capacity: 80,
        availableSeats: 42
    },
    {
        title: 'Stand-Up Comedy Night',
        description: 'Top comedians perform an exclusive set â€” doors open at 7 PM.',
        category: 'Other',
        price: inr(35),
        date: new Date(seedTomorrow),
        time: '20:00',
        location: 'Laugh Factory, Delhi',
        imageUrl: '',
        capacity: 200,
        availableSeats: 156
    },
    {
        title: 'Garden Wedding Showcase',
        description: 'Tour venue packages and meet planners for your dream wedding tomorrow.',
        category: 'Wedding',
        price: inr(15),
        date: new Date(seedTomorrow),
        time: '11:00',
        location: 'Rosewood Gardens, Pune',
        imageUrl: '',
        capacity: 60,
        availableSeats: 28
    },
    {
        title: 'Street Food Festival',
        description: 'Sample dishes from 40+ vendors with live bands all weekend.',
        category: 'Other',
        price: inr(20),
        date: new Date(seedDayPlus3),
        time: '12:00',
        location: 'Marine Drive Grounds, Kochi',
        imageUrl: '',
        capacity: 500,
        availableSeats: 410
    },
    {
        title: 'Kids Carnival & Birthday Fair',
        description: 'Games, rides, and party packages for families this week.',
        category: 'Birthday',
        price: inr(18),
        date: new Date(seedDayPlus5),
        time: '10:00',
        location: 'Wonder Park, Hyderabad',
        imageUrl: '',
        capacity: 300,
        availableSeats: 220
    }
];

const users = [
    {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin'
    },
    {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'user'
    }
];

const events = [
    // Wedding Events
    {
        title: 'Grand Royal Wedding',
        description: 'A beautiful grand royal wedding experience with catering and decorations included.',
        category: 'Wedding',
        price: inr(5000),
        date: new Date('2026-08-15'),
        time: '18:00',
        location: 'Grand Plaza Hotel, NY',
        imageUrl: '',
        capacity: 300,
        availableSeats: 300
    },
    {
        title: 'Beachside Wedding Bliss',
        description: 'A serene beachside wedding ceremony with ocean views and tropical drinks.',
        category: 'Wedding',
        price: inr(3500),
        date: new Date('2026-09-10'),
        time: '16:00',
        location: 'Malibu Beach Resort, CA',
        imageUrl: '',
        capacity: 150,
        availableSeats: 150
    },
    {
        title: 'Rustic Barn Wedding',
        description: 'Charming rustic wedding with a country style buffet and live acoustic band.',
        category: 'Wedding',
        price: inr(2500),
        date: new Date('2026-10-05'),
        time: '15:00',
        location: 'Green Acres Farm, TX',
        imageUrl: '',
        capacity: 200,
        availableSeats: 200
    },

    // Birthday Events
    {
        title: 'Kids Fun Birthday Bash',
        description: 'Exciting kids birthday party package with games, clown, and custom cake.',
        category: 'Birthday',
        price: inr(800),
        date: new Date('2026-06-20'),
        time: '14:00',
        location: 'FunZone Arena, LA',
        imageUrl: '',
        capacity: 50,
        availableSeats: 50
    },
    {
        title: 'Sweet 16 Glow Party',
        description: 'A neon-lit glow-in-the-dark dance party with DJ and mocktails.',
        category: 'Birthday',
        price: inr(1200),
        date: new Date('2026-07-15'),
        time: '19:00',
        location: 'Starlight Dance Hall, FL',
        imageUrl: '',
        capacity: 80,
        availableSeats: 80
    },
    {
        title: 'Elegant 50th Jubilee',
        description: 'A sophisticated evening of wine tasting, classical music, and fine dining.',
        category: 'Birthday',
        price: inr(2000),
        date: new Date('2026-11-22'),
        time: '20:00',
        location: 'The Vineyards, Napa Valley',
        imageUrl: '',
        capacity: 100,
        availableSeats: 100
    },

    // Corporate Events
    {
        title: 'Annual Tech Summit 2026',
        description: 'A grand tech conference featuring keynotes, networking, and product launches.',
        category: 'Corporate',
        price: inr(10000),
        date: new Date('2026-09-01'),
        time: '09:00',
        location: 'Silicon Valley Convention Center, CA',
        imageUrl: '',
        capacity: 1000,
        availableSeats: 1000
    },
    {
        title: 'Executive Leadership Retreat',
        description: 'A focused 2-day retreat for senior management with workshops and team building.',
        category: 'Corporate',
        price: inr(4500),
        date: new Date('2026-08-05'),
        time: '10:00',
        location: 'Mountain View Lodge, CO',
        imageUrl: '',
        capacity: 40,
        availableSeats: 40
    },
    {
        title: 'Startup Pitch Night',
        description: 'An engaging evening for entrepreneurs to pitch their ideas to angel investors.',
        category: 'Corporate',
        price: inr(500),
        date: new Date('2026-07-28'),
        time: '18:30',
        location: 'The Innovation Hub, Austin',
        imageUrl: '',
        capacity: 150,
        availableSeats: 150
    },

    // Mature/Family Function
    {
        title: 'Annual Family Get-Together',
        description: 'Spacious venue for family reunions and mature functions, includes buffet.',
        category: 'Mature/Family Function',
        price: inr(1500),
        date: new Date('2026-07-10'),
        time: '10:00',
        location: 'Sunshine Gardens, CA',
        imageUrl: '',
        capacity: 150,
        availableSeats: 150
    },
    {
        title: 'Golden Anniversary Celebration',
        description: 'Celebrate 50 years of marriage with elegance, soft music, and family portraits.',
        category: 'Mature/Family Function',
        price: inr(1800),
        date: new Date('2026-08-25'),
        time: '17:00',
        location: 'Heritage Manor, PA',
        imageUrl: '',
        capacity: 120,
        availableSeats: 120
    },
    {
        title: 'Thanksgiving Feast',
        description: 'A large hall rented out for an enormous extended family thanksgiving meal.',
        category: 'Mature/Family Function',
        price: inr(1200),
        date: new Date('2026-11-26'),
        time: '13:00',
        location: 'Oakwood Community Center, OH',
        imageUrl: '',
        capacity: 250,
        availableSeats: 250
    },

    // Other Events
    {
        title: 'Local Art Exhibition',
        description: 'A showcase of modern art from local up-and-coming artists.',
        category: 'Other',
        price: inr(200),
        date: new Date('2026-07-05'),
        time: '10:00',
        location: 'City Art Gallery, NY',
        imageUrl: '',
        capacity: 500,
        availableSeats: 500
    },
    {
        title: 'Stand-Up Comedy Night',
        description: 'A hilarious evening featuring top stand-up comedians from around the country.',
        category: 'Other',
        price: inr(300),
        date: new Date('2026-08-12'),
        time: '20:30',
        location: 'Laugh Factory, Chicago',
        imageUrl: '',
        capacity: 300,
        availableSeats: 300
    },
    {
        title: 'Yoga and Wellness Retreat',
        description: 'A relaxing weekend retreat focusing on meditation, yoga, and inner peace.',
        category: 'Other',
        price: inr(800),
        date: new Date('2026-09-18'),
        time: '08:00',
        location: 'Zen Retreat Center, Sedona',
        imageUrl: '',
        capacity: 60,
        availableSeats: 60
    }
];

const importData = async () => {
    try {
        await Event.deleteMany();
        const userCount = await User.countDocuments();
        if (userCount === 0) {
            await User.insertMany(users);
        }

        const allEvents = [...nearTermEvents, ...events].map((ev) => ({
            ...ev,
            imageUrl: resolveEventImage(ev)
        }));
        await Event.insertMany(allEvents);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
