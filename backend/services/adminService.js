const { QueueTicket, sequelize } = require('../models'); 

/**
 * Expected Functionality: Aggregate data for admin dashboards.
 * Similar to how sessionService might count active users.
 */
const getQueueAnalytics = async () => {
    try {
        return await QueueTicket.findAll({
            attributes: [
                'status', 
                [sequelize.fn('COUNT', sequelize.col('ticket_id')), 'count']
            ],
            group: ['status'],
            // Ensures we get raw data back for the controller to format
            raw: true 
        });
    } catch (error) {
        throw new Error('Failed to fetch queue analytics: ' + error.message);
    }
};

/**
 * Expected Functionality: Maintenance task to clear out old tickets.
 * This is a "destructive" action, so it requires a specific service method.
 */
const resetQueueForDay = async (service_id) => {
    if (!service_id) {
        throw new Error('Service ID is required to reset the queue.');
    }

    try {
        // Matches your DB: uses 'service_id' and 'status'
        const deletedCount = await QueueTicket.destroy({ 
            where: { 
                service_id, 
                status: 'Waiting' 
            } 
        });

        return { message: `Successfully cleared ${deletedCount} waiting tickets.` };
    } catch (error) {
        throw new Error('Error resetting queue: ' + error.message);
    }
};
const deleteSpecificTicket = async (service_id, ticket_id) => {
    try {
        const deletedCount = await QueueTicket.destroy({ 
            where: { 
                service_id: service_id, 
                ticket_id: ticket_id 
            } 
        });

        if (deletedCount === 0) {
            throw new Error('Ticket not found in this service.');
        }

        return { message: `Ticket ${ticket_id} in service ${service_id} deleted successfully.` };
    } catch (error) {
        throw new Error('Error deleting ticket: ' + error.message);
    }
};

// Add it to your exports
module.exports = { getQueueAnalytics, resetQueueForDay, deleteSpecificTicket };