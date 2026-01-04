'use strict';
const { QueueTicket, User, Service, sequelize } = require('../models');
const { Op } = require('sequelize');
const notificationService = require('./notificationService');

class QueueService {
    // 1. Join Queue (With Smart Ticket Numbering & SMS)
    async joinQueue(userId, serviceId, phoneNumber) {
        // Check for active tickets
        const existingTicket = await QueueTicket.findOne({
            where: { user_id: userId, service_id: serviceId, status: ['Waiting', 'Serving'] }
        });
        if (existingTicket) throw new Error('You are already in this queue.');

        const service = await Service.findByPk(serviceId);
        if (!service) throw new Error('Service not found.');

        // Calculate Position
        const peopleAhead = await QueueTicket.count({
            where: { service_id: serviceId, status: 'Waiting' }
        });
        const nextPosition = peopleAhead + 1;

        // Generate Ticket Number (Prefix-100+Pos)
        const prefix = service.service_name ? service.service_name.substring(0, 2).toUpperCase() : 'TK';
        const ticketNumber = `${prefix}-${100 + nextPosition}`;
        const estimatedWaitTime = peopleAhead * (service.avg_wait_time || 15);

        // Create Ticket
        const ticket = await QueueTicket.create({
            user_id: userId,
            service_id: serviceId,
            ticket_number: ticketNumber,
            phone_number: phoneNumber,
            position: nextPosition,
            status: 'Waiting'
        });

        // Notify User
        await notificationService.notifyUser(
            userId, 
            phoneNumber, 
            `Smart Line: Ticket ${ticketNumber}. ${peopleAhead} ahead. Est. wait: ${estimatedWaitTime} mins.`
        );

        return ticket;
    }

    // 2. Update Status (With "Turn Notification" and "5-Back Notification")
    async updateTicketStatus(ticketId, newStatus) {
        const ticket = await QueueTicket.findByPk(ticketId, {
            include: [{ model: User, as: 'user' }]
        });
        if (!ticket) throw new Error('Ticket not found');

        ticket.status = newStatus;
        await ticket.save();

        if (newStatus === 'Serving') {
            // Notify the person currently called
            await notificationService.notifyUser(
                ticket.user_id,
                ticket.phone_number,
                `Smart Line: It is your turn! Please proceed to the counter for ${ticket.ticket_number}.`
            );

            // Notify the person 5 spots behind (Position Shift Detector)
            const targetPosition = ticket.position + 5;
            const personFiveBack = await QueueTicket.findOne({
                where: { position: targetPosition, service_id: ticket.service_id, status: 'Waiting' }
            });

            if (personFiveBack) {
                await notificationService.notifyUser(
                    personFiveBack.user_id,
                    personFiveBack.phone_number,
                    `Smart Line: Reminder! Only 5 people ahead. Please head to the office now.`
                );
            }
        }
        return ticket;
    }

    // 3. Cancel Ticket (User side)
    async cancelTicket(ticketId, userId) {
        const ticket = await QueueTicket.findOne({ where: { ticket_id: ticketId, user_id: userId } });
        if (!ticket) throw new Error('Ticket not found or unauthorized');

        ticket.status = 'Cancelled';
        await ticket.save();

        await notificationService.notifyUser(userId, ticket.phone_number, `Your ticket ${ticket.ticket_number} has been cancelled.`);
        return { message: "Ticket cancelled successfully." };
    }

    // 4. Get Live Status for Frontend
    async getLiveStatus(ticketId) {
        const ticket = await QueueTicket.findByPk(ticketId);
        if (!ticket || ticket.status !== 'Waiting') return { status: 'Served' };

        const peopleAhead = await QueueTicket.count({
            where: {
                service_id: ticket.service_id,
                status: 'Waiting',
                position: { [Op.lt]: ticket.position }
            }
        });

        const service = await Service.findByPk(ticket.service_id);
        const waitTime = service ? service.avg_wait_time : 15;

        return {
            ticketNumber: ticket.ticket_number,
            position: peopleAhead + 1,
            estimatedWaitTime: peopleAhead * waitTime
        };
    }

    // 5. Get My Active Tickets (For User Dashboard)
    async getMyActiveTickets(userId) {
        return await QueueTicket.findAll({
            where: { user_id: userId, status: ['Waiting', 'Serving'] },
            include: [{ model: Service, as: 'service', attributes: ['service_name'] }],
            order: [['created_at', 'DESC']]
        });
    }
}

module.exports = new QueueService();