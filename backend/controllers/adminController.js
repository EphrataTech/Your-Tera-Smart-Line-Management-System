'use strict';
const adminService = require('../services/adminService');

module.exports = {
    callNext: async (req, res) => {
        try {
            const { service_id } = req.body;
            const ticket = await adminService.callNext(service_id);
            res.status(200).json({ message: "Next customer called", ticket });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    completeTicket: async (req, res) => {
        try {
            const { id } = req.params;
            const ticket = await adminService.completeTicket(id);
            res.status(200).json({ message: "Service completed", ticket });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
};