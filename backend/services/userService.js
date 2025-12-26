'use strict';
const { User } = require('../models');

module.exports = {
    // Used by GET /api/users/:id and GET /api/users/profile
    getUserById: async (user_id) => {
        return await User.findByPk(user_id, {
            // Explicitly list columns that exist in your DB
            attributes: ['user_id', 'username', 'email', 'role']
        });
    },

    // Used by GET /api/users/all
    getAllUsers: async () => {
        return await User.findAll({
            attributes: ['user_id', 'username', 'email', 'role']
        });
    },

    // Used by profile update routes
    updateUser: async (user_id, updateData) => {
        // Create a list of allowed fields based on your actual DB schema
        const allowedFields = ['email', 'username', 'role', 'password']; 
        
        // Filter the incoming updateData so it doesn't contain 'phone_number'
        const filteredData = Object.keys(updateData)
            .filter(key => allowedFields.includes(key))
            .reduce((obj, key) => {
                obj[key] = updateData[key];
                return obj;
            }, {});

        if (Object.keys(filteredData).length === 0) {
            throw new Error("No valid fields provided for update.");
        }

        return await User.update(filteredData, { 
            where: { user_id } 
        });
    }
};