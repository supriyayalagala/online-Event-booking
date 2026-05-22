const mongoose = require('mongoose');

const demoRequestSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    company: { type: String, default: '' },
    eventType: { type: String, required: true },
    preferredDate: { type: Date },
    message: { type: String, default: '' },
    status: { type: String, enum: ['New', 'Contacted', 'Scheduled', 'Closed'], default: 'New' }
}, { timestamps: true });

module.exports = mongoose.model('DemoRequest', demoRequestSchema);
