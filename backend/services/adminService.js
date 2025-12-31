'use strict';
const { QueueTicket, sequelize } = require('../models');

class AdminService {
    /**
     * Staff calls the next person in line
     * Logic: Find the ticket with the lowest ID that is 'Waiting' for a specific service.
     */
    async callNext(service_id) {
        // Find the oldest waiting ticket for this service
        const nextTicket = await QueueTicket.findOne({
            where: { service_id, status: 'Waiting' },
            order: [['ticket_id', 'ASC']]
        });

        if (!nextTicket) {
            throw new Error('No customers waiting for this service.');
        }

        // Update status to 'Serving'
        nextTicket.status = 'Serving';
        await nextTicket.save();

        return nextTicket;
    }

    /**
     * Mark a ticket as completed once the service is done.
     */
    async completeTicket(ticket_id) {
        const ticket = await QueueTicket.findByPk(ticket_id);
        if (!ticket) throw new Error('Ticket not found.');

        ticket.status = 'Completed';
        await ticket.save();
        return ticket;
    }

    /**
     * If a customer doesn't show up, cancel the ticket.
     */
    async cancelTicket(ticket_id) {
        const ticket = await QueueTicket.findByPk(ticket_id);
        if (!ticket) throw new Error('Ticket not found.');

        ticket.status = 'Cancelled';
        await ticket.save();
        return ticket;
    }
}

module.exports = new AdminService();