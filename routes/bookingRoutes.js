const express = require('express');
const router = express.Router();
const {
    createBooking,
    getMyBookings,
    getBookings,
    getBookingById,
    updateBookingStatus,
    processPayment,
    checkEventBooking
} = require('../controllers/bookingController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, createBooking)
    .get(protect, admin, getBookings);

router.route('/mybookings')
    .get(protect, getMyBookings);

router.get('/check/:eventId', protect, checkEventBooking);

router.route('/:id/pay')
    .post(protect, processPayment);

router.route('/:id')
    .get(protect, getBookingById);

router.route('/:id/status')
    .put(protect, admin, updateBookingStatus);

module.exports = router;
