const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const connectDB = require('./db/connect');
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const demoRoutes = require('./routes/demoRoutes');

const app = express();

const dbCheck = async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        console.error('Database connection failed:', err.message);
        res.status(503).json({
            message: process.env.VERCEL
                ? 'Database not connected. Add MONGO_URI in Vercel Environment Variables and redeploy.'
                : 'Database not connected. Set MONGO_URI in .env or start MongoDB locally.'
        });
    }
};

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/health', async (req, res) => {
    try {
        await connectDB();
        res.json({ ok: true, database: 'connected' });
    } catch (err) {
        res.json({
            ok: false,
            database: 'disconnected',
            hint: process.env.VERCEL
                ? 'Set MONGO_URI in Vercel Environment Variables'
                : 'Set MONGO_URI in .env'
        });
    }
});

// Routes
app.use('/api/auth', dbCheck, authRoutes);
app.use('/api/events', dbCheck, eventRoutes);
app.use('/api/bookings', dbCheck, bookingRoutes);
app.use('/api/demos', dbCheck, demoRoutes);

// Fallback to index.html for frontend routing or just serve index
app.use((req, res) => {
    if (!req.url.startsWith('/api')) {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    } else {
        res.status(404).json({ message: 'API Route Not Found' });
    }
});

const PORT = process.env.PORT || 5000;

module.exports = app;

if (!process.env.VERCEL) {
    connectDB()
        .then(() => {
            app.listen(PORT, () => {
                console.log(`Server running at http://localhost:${PORT}`);
            });
            console.log('Connected to MongoDB');
        })
        .catch((err) => {
            console.error('MongoDB connection error:', err.message);
            app.listen(PORT, () => {
                console.log(`Server running at http://localhost:${PORT} (database offline)`);
            });
        });
}
