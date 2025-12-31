'use strict';
const serviceService = require('../services/serviceService');

module.exports = {
    addService: async (req, res) => {
        try {
            const newService = await serviceService.createService(req.body);
            res.status(201).json(newService);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    listServices: async (req, res) => {
        try {
            const services = await serviceService.getAllServices();
            res.status(200).json(services);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};