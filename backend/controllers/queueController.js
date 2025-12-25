const queueService = require('../services/queueService');

exports.joinQueue = async (req, res) => {
    try {
        const { user_id, service_id } = req.body;
        const ticket = await queueService.joinQueue(user_id, service_id);
        
        res.status(201).json({
            message: "Ticket created successfully!",
            data: ticket
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};