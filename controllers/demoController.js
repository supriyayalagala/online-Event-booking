const DemoRequest = require('../models/DemoRequest');

const createDemoRequest = async (req, res) => {
    try {
        const demo = await DemoRequest.create(req.body);
        res.status(201).json(demo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getDemoRequests = async (req, res) => {
    try {
        const demos = await DemoRequest.find().sort({ createdAt: -1 });
        res.json(demos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateDemoStatus = async (req, res) => {
    try {
        const demo = await DemoRequest.findById(req.params.id);
        if (!demo) {
            return res.status(404).json({ message: 'Demo request not found' });
        }
        if (req.body.status) demo.status = req.body.status;
        await demo.save();
        res.json(demo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createDemoRequest, getDemoRequests, updateDemoStatus };
