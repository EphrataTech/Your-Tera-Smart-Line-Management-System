'use strict';

const { Office } = require('../models');

module.exports = {
    getOffice: async (req, res) => {
        try {
            const offices = await Office.findAll();
            res.status(200).json(offices);
        } catch (error) { // Added (error) here
            res.status(500).json({ error: error.message });
        }
    },

    addOffice: async (req, res) => {
        try {
            // Check your Model! If your DB columns are 'office_name', 
            // make sure these match.
            const { office_name, location, type } = req.body; 
            
            const newOffice = await Office.create({ 
                office_name, 
                location, 
                type 
            });
            
            res.status(201).json(newOffice);
        } catch (error) { // Added (error) here
            res.status(500).json({ error: error.message });
        }
    }
};