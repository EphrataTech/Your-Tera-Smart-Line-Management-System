'use strict';
const { Service } = require('../models');

module.exports = {
    createService: async (data) => {
        const { office_id, service_name, avg_wait_time } = data;
        return await Service.create({
            office_id,
            service_name,
            avg_wait_time
        });
    },

    getAllServices: async () => {
        // Only return active services
        return await Service.findAll({ where: { is_active: true } });
    },

    updateService: async (service_id, updateData) => {
        const service = await Service.findByPk(service_id);
        if (!service) throw new Error('Service not found');
        return await service.update(updateData);
    }
};