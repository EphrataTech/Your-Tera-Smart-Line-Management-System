const { QueueTicket, sequelize } = require('../models'); 

const getQueueAnalytics = async () => {
    // Matches your DB: uses 'ticket_id' and 'status'
    return await QueueTicket.findAll({
        attributes: [
            'status', 
            [sequelize.fn('COUNT', sequelize.col('ticket_id')), 'count']
        ],
        group: ['status']
    });
};

const resetQueueForDay = async (service_id) => {
    // Matches your DB: uses 'service_id' and 'status'
    return await QueueTicket.destroy({ 
        where: { 
            service_id, 
            status: 'Waiting' 
        } 
    });
};

module.exports = { getQueueAnalytics, resetQueueForDay };