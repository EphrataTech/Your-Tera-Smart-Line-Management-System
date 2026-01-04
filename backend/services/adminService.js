'use strict';
const { QueueTicket, Service, User, sequelize } = require('../models');

class AdminService {
    // --- CORE QUEUE ACTIONS (from develop) ---

    async callNext(service_id) {
        const nextTicket = await QueueTicket.findOne({
            where: { service_id, status: 'Waiting' },
            order: [['ticket_id', 'ASC']]
        });

        if (!nextTicket) throw new Error('No customers waiting for this service.');

        nextTicket.status = 'Serving';
        await nextTicket.save();
        return nextTicket;
    }

    async completeTicket(ticket_id) {
        const ticket = await QueueTicket.findByPk(ticket_id);
        if (!ticket) throw new Error('Ticket not found.');
        ticket.status = 'Completed';
        await ticket.save();
        return ticket;
    }

    async cancelTicket(ticket_id) {
        const ticket = await QueueTicket.findByPk(ticket_id);
        if (!ticket) throw new Error('Ticket not found.');
        ticket.status = 'Cancelled';
        await ticket.save();
        return ticket;
    }

    // --- ADMIN DASHBOARD ACTIONS (from main) ---

    async getQueueAnalytics() {
        return await QueueTicket.findAll({
            attributes: [
                'status', 
                [sequelize.fn('COUNT', sequelize.col('ticket_id')), 'count']
            ],
            group: ['status'],
            raw: true 
        });
    }

    async getAllTickets() {
        return await QueueTicket.findAll({
            include: [
                { model: User, as: 'user', attributes: ['user_id', 'full_name', 'phone_number'] },
                { model: Service, as: 'service', attributes: ['service_id', 'service_name'] }
            ],
            order: [['created_at', 'DESC']]
        });
    }

    async getAllUsers() {
        return await User.findAll({ attributes: { exclude: ['password'] } });
    }

    async createNewService(serviceData) {
        return await Service.create(serviceData);
    }

    async resetQueueForDay(service_id) {
        const deletedCount = await QueueTicket.destroy({ 
            where: { service_id, status: 'Waiting' } 
        });
        return { message: `Successfully cleared ${deletedCount} waiting tickets.` };
    }
}

module.exports = new AdminService();