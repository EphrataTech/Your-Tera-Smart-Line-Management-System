'use strict';
module.exports = (sequelize, DataTypes) => {
    const QueueTicket = sequelize.define('QueueTicket', {
        ticket_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'ticket_id'
        },
        user_id: {
            type: DataTypes.INTEGER,
            field: 'user_id'
        },
        service_id: {
            type: DataTypes.INTEGER,
            field: 'service_id'
        },
        ticket_number: {
            type: DataTypes.INTEGER,
            field: 'ticket_number'
        },
        status: {
            type: DataTypes.ENUM('Waiting', 'Serving', 'Completed', 'Cancelled'),
            defaultValue: 'Waiting'
        }
    }, {
        tableName: 'Queue_Tickets',
        timestamps: false, 
        underscored: true 
    });

    return QueueTicket;
};