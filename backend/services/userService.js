const { User } = require('../models');

const getUserById = async (user_id) => {
    // Matches your DB: uses 'user_id'
    return await User.findByPk(user_id, {
        attributes: { exclude: ['password'] } 
    });
};

const updateUserSettings = async (user_id, updateData) => {
    // Matches your DB: uses 'user_id'
    return await User.update(updateData, { where: { user_id } });
};

module.exports = { getUserById, updateUserSettings };