/**
 * Test MongoDB Atlas connectivity (run after updating .env MONGO_URI).
 * Usage: node scripts/testAtlasConnection.js
 */
require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGO_URI;
if (!uri || uri.includes('127.0.0.1')) {
    console.error('Set MONGO_URI in .env to your Atlas connection string first.');
    process.exit(1);
}

mongoose
    .connect(uri)
    .then(() => {
        console.log('OK: Connected to MongoDB Atlas');
        console.log('Database:', mongoose.connection.name);
        return mongoose.disconnect();
    })
    .then(() => process.exit(0))
    .catch((err) => {
        console.error('Connection failed:', err.message);
        if (/TLSV1_ALERT_INTERNAL_ERROR|alert number 80/i.test(String(err))) {
            console.error('\nLikely fix: Atlas → Network Access → Add Current IP Address (or 0.0.0.0/0 for testing).');
            console.error('Also verify username/password and use authSource=admin in the URI.');
        }
        process.exit(1);
    });
