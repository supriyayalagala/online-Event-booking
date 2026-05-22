const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true, enum: ['Wedding', 'Birthday', 'Corporate', 'Mature/Family Function', 'Other'] },
    price: { type: Number, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    imageUrl: { type: String, required: true },
    capacity: { type: Number, required: true },
    availableSeats: { type: Number, required: true }
}, { timestamps: true });

// Pre-save to set availableSeats equal to capacity on creation if not set
eventSchema.pre('save', function () {
    if (this.isNew && this.availableSeats === undefined) {
        this.availableSeats = this.capacity;
    }
});

module.exports = mongoose.model('Event', eventSchema);
