const Booking = require('../models/Booking');
const Event = require('../models/Event');
const { resolveEventImage } = require('../utils/eventImageResolver');

function enrichBookingEvents(bookings) {
    const list = Array.isArray(bookings) ? bookings : [bookings];
    return list.map((b) => {
        const out = b.toObject ? b.toObject() : { ...b };
        if (out.event) {
            out.event.imageUrl = resolveEventImage(out.event);
        }
        return out;
    });
}

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
    try {
        const { eventId, guests } = req.body;

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        if (event.availableSeats < guests) {
            return res.status(400).json({ message: 'Not enough seats available' });
        }

        const existingBooking = await Booking.findOne({
            user: req.user._id,
            event: eventId,
            status: { $ne: 'Cancelled' }
        });

        if (existingBooking) {
            return res.status(400).json({
                message: 'You already have a booking for this event. Each account can book an event only once.',
                bookingId: existingBooking._id,
                status: existingBooking.status,
                paymentStatus: existingBooking.paymentStatus
            });
        }

        const totalPrice = event.price * guests;

        const booking = new Booking({
            user: req.user._id,
            event: eventId,
            guests,
            totalPrice
        });

        const createdBooking = await booking.save();

        // Update event available seats
        event.availableSeats -= guests;
        await event.save();

        res.status(201).json(createdBooking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged in user bookings
// @route   GET /api/bookings/mybookings
// @access  Private
const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id }).populate(
            'event',
            'title date time location imageUrl price category'
        );
        res.json(enrichBookingEvents(bookings));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private/Admin
const getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({}).populate('user', 'id name email').populate('event', 'title date');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private/Admin
const updateBookingStatus = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (booking) {
            booking.status = req.body.status || booking.status;
            booking.paymentStatus = req.body.paymentStatus || booking.paymentStatus;
            
            const updatedBooking = await booking.save();
            res.json(updatedBooking);
        } else {
            res.status(404).json({ message: 'Booking not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single booking (owner or admin)
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('event', 'title date time location imageUrl price category')
            .populate('user', 'name email');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        res.json(enrichBookingEvents(booking)[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Simulate payment (demo — not a real gateway)
// @route   POST /api/bookings/:id/pay
// @access  Private
const processPayment = async (req, res) => {
    try {
        const { method, upiId, bankName, accountNumber } = req.body;

        const booking = await Booking.findById(req.params.id).populate('event');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        if (booking.paymentStatus === 'Completed') {
            return res.status(400).json({ message: 'Payment already completed' });
        }

        if (booking.status === 'Cancelled') {
            return res.status(400).json({ message: 'Booking was cancelled' });
        }

        let success = false;
        let reason = '';

        if (method === 'qr') {
            success = true;
            reason = 'QR payment confirmed (simulated).';
        } else if (method === 'upi') {
            const id = (upiId || '').trim().toLowerCase();
            if (id.includes('@') && id.length >= 6 && !id.includes('fail')) {
                success = true;
                reason = 'UPI ID verified (simulated).';
            } else {
                reason = 'Invalid UPI ID. Use format: yourname@bank (avoid word "fail").';
            }
        } else if (method === 'netbanking') {
            const acct = (accountNumber || '').replace(/\s/g, '');
            const last = parseInt(acct.slice(-1), 10);
            if (bankName && acct.length >= 8 && !isNaN(last)) {
                if (last >= 5) {
                    success = true;
                    reason = 'Net banking transfer approved (simulated).';
                } else {
                    reason = 'Transfer declined — account ending digit must be 5–9 for demo success.';
                }
            } else {
                reason = 'Select a bank and enter at least 8-digit account number.';
            }
        } else {
            return res.status(400).json({ message: 'Invalid payment method' });
        }

        if (success) {
            booking.paymentStatus = 'Completed';
            booking.status = 'Confirmed';
        } else {
            booking.paymentStatus = 'Failed';
            booking.status = 'Cancelled';

            if (booking.event) {
                const event = await Event.findById(booking.event._id || booking.event);
                if (event) {
                    event.availableSeats += booking.guests;
                    await event.save();
                }
            }
        }

        await booking.save();

        res.json({
            success,
            paymentStatus: booking.paymentStatus,
            status: booking.status,
            message: reason
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Check if user already booked this event
// @route   GET /api/bookings/check/:eventId
// @access  Private
const checkEventBooking = async (req, res) => {
    try {
        const booking = await Booking.findOne({
            user: req.user._id,
            event: req.params.eventId,
            status: { $ne: 'Cancelled' }
        });

        if (!booking) {
            return res.json({ alreadyBooked: false });
        }

        res.json({
            alreadyBooked: true,
            bookingId: booking._id,
            status: booking.status,
            paymentStatus: booking.paymentStatus
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createBooking,
    getMyBookings,
    getBookings,
    getBookingById,
    updateBookingStatus,
    processPayment,
    checkEventBooking
};
