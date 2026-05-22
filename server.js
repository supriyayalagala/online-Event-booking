const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const demoRoutes = require('./routes/demoRoutes');

const app = express();

const dbCheck = (req, res, next) => {
    if (mongoose.connection.readyState === 1) return next();
    res.status(503).json({
        message: 'Database not connected. Start MongoDB, then refresh this page.'
    });
};

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/health', (req, res) => {
    res.json({
        ok: true,
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
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

// Database connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/event-booking';

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log('Open this URL in your browser (include the port number).');
});

mongoose.connect(MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => {
        console.error('MongoDB connection error:', err.message);
        console.error('The website will load, but login/events/booking need MongoDB running.');
        console.error('Install MongoDB or run: mongod (default port 27017)');
    });
