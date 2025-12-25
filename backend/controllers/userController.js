'use strict';
const { User, Accounts } = require('../models');

module.exports = {
    getProfile: async (req, res) => {
        try {
            const user = await User.findByPk(req.user.user_id, {
                include: [{
                    model: Accounts,
                    as: 'Account', 
                    attributes: ['email']
                }]
            });

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getAllUsers: async (req, res) => {
        try {
            const users = await User.findAll({
                include: [{
                    model: Accounts,
                    as: 'Account',
                    attributes: ['email']
                }]
            });
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};