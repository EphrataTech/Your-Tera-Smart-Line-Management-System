const adminService = require('../services/adminService');

// Make sure the name 'deleteServiceTickets' matches EXACTLY what you call in the route
exports.deleteServiceTickets = async (req, res) => {
    try {
        const { service_id } = req.params;
        const result = await adminService.resetQueueForDay(service_id); 
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteTicket = async (req, res) => {
    try {
        const { service_id, ticket_id } = req.params; // Extracts both from the URL
        const result = await adminService.deleteSpecificTicket(service_id, ticket_id);
        res.status(200).json(result);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

// Also ensure your analytics function is exported
exports.getAnalytics = async (req, res) => {
    try {
        const stats = await adminService.getQueueAnalytics();
        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
