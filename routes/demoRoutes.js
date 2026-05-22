const express = require('express');
const router = express.Router();
const { createDemoRequest, getDemoRequests, updateDemoStatus } = require('../controllers/demoController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', createDemoRequest);
router.get('/', protect, admin, getDemoRequests);
router.put('/:id/status', protect, admin, updateDemoStatus);

module.exports = router;
