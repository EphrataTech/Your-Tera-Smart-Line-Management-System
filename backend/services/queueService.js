const { QueueTicket, Service, Sequelize } = require('../models');
const { Op } = Sequelize;

exports.joinQueue = async (user_id, service_id) => {
    // Check if the model is loaded to prevent the 'undefined' error
    if (!QueueTicket) {
        throw new Error("QueueTicket model not found in models/index.js");
    }

    const lastTicket = await QueueTicket.max('ticket_number', { 
        where: { service_id: service_id } 
    });

    return await QueueTicket.create({
        user_id,
        service_id,
        ticket_number: (lastTicket || 0) + 1,
        status: 'Waiting'
    });
};

exports.getActualWaitTime = async (ticketId) => {
    const ticket = await QueueTicket.findByPk(ticketId);
    if (!ticket) return 0;
    
    const diffInMs = new Date() - new Date(ticket.issued_at); // Use issued_at
    return Math.floor(diffInMs / 60000);
};

exports.getEstimatedWait = async (ticketId) => {
    const ticket = await QueueTicket.findByPk(ticketId, {
        include: [{ model: Service }]
    });
    
    if (!ticket) throw new Error("Ticket not found");

    const peopleAhead = await QueueTicket.count({
        where: { 
            service_id: ticket.service_id, 
            status: 'Waiting',
            ticket_number: { [Op.lt]: ticket.ticket_number } 
        }
    });

    const waitFactor = ticket.Service?.avg_wait_time || 15;
    return peopleAhead * waitFactor;
};