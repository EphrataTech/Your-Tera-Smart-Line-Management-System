const adminService = require('../services/adminService');

const getAnalytics = async (req, res) => {
    try {
        const stats = await adminService.getQueueAnalytics();
        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Explicitly export the function so it isn't undefined in the router
module.exports = { 
    getAnalytics 
};