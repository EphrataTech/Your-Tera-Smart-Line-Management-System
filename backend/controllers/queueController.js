/**
 * Queue Controller - Handles HTTP requests for the ticketing system.
 * This file acts as the interface between the React frontend and your QueueService.
 */
const queueService = require('../services/queueService');

// 1. Join a Queue (Citizen action)
exports.join = async (req, res) => {
    try {
        /** * IMPORTANT: req.user.id is populated by your teammate's Auth Middleware.
         * The frontend must send 'serviceId' and 'officeId' in the JSON body.
         */
        const ticket = await queueService.joinQueue(
            req.user.id, 
            req.body.serviceId, 
            req.body.officeId
        );

        // Success: Send the ticket details back to React
        res.status(201).json({
            message: "Successfully joined the queue",
            ticket
        });
    } catch (error) {
        // Error handling: e.g., "Queue is full" or "Already in queue"
        res.status(400).json({ error: error.message });
    }
};

// 2. Get Live Status (Citizen action)
// The frontend will call this every 10 seconds to update the UI
exports.getTicketStatus = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const status = await queueService.getLiveStatus(ticketId);
        
        res.status(200).json(status);
    } catch (error) {
        res.status(404).json({ error: "Ticket not found" });
    }
};

// 3. Update Ticket Status (Admin action)
// Used when a staff member calls the "Next" person
exports.updateStatus = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const { status } = req.body; // e.g., 'served', 'skipped', 'delayed'

        const updatedTicket = await queueService.updateTicketStatus(ticketId, status);
        
        res.status(200).json({
            message: `Ticket marked as ${status}`,
            updatedTicket
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};