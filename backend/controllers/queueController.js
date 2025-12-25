'use strict';
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
const { where } = require('sequelize');
const { QueueTicket, User, Service } = require('../models');

module.exports = {

    //Logic for a user to join a queue

    joinQueue: async (req, res) => {
        try {
            const { service_id } = req.body;
            const user_id = req.user.user_id;

            //check if the service exist
            const service = await Service.findByPk(service_id);
            if(!service) return res.status(404).json({ message: "Service not found" });

            //Generate sequential ticket number
            const todayCount = await QueueTicket.count({ where: { service_id} });
            const ticket_number = `T-${100 + todayCount + 1}`;

            const ticket = await QueueTicket.create({
                user_id,
                service_id,
                ticket_number,
                status: 'waiting'
            });

            res.status(201).json({
                message: "Ticket issued successfully",
                ticket
            });

        }catch (error){
            res.status(500).json({ message: error.message });
        }

    },

    getOfficeQueue: async (req, res) => { 
        try {
            const { serviceId } = req.params;
            const tickets = await QueueTicket.findAll({
                where: { 
                    service_id: serviceId,
                    status: ['Waiting', 'Serving'] 
                },
                include: [{ 
                    model: User,
                     as: 'user', 
                     attributes: ['phone_number', 'role'] }],
                order: [['issued_at', 'ASC']]
            });
            res.status(200).json(tickets); 
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    updateTicketStatus: async (req, res) => {
        try {
            const { ticketId } = req.params;
            const { status } = req.body;

            const ticket = await QueueTicket.findByPk(ticketId);
            if(!ticket) return res.status(404).json({ message: "Ticket not found "});

            ticket.status = status;
            await ticket.save();

            res.status(200).json({ message: `Ticket status updated to ${status}`, ticket });
        }catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}
