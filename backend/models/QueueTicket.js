'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class QueueTicket extends Model {
    static associate(models) {
      // Associations
      QueueTicket.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });
      QueueTicket.belongsTo(models.Service, {
        foreignKey: 'service_id',
        as: 'service'
      });
    }
  }

  QueueTicket.init({
    ticket_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'user_id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    service_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Services',
        key: 'service_id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    ticket_number: {
      type: DataTypes.STRING, // Kept as STRING for "ID-101" format
      allowNull: false
    },
    phone_number: { 
      type: DataTypes.STRING,
      allowNull: false
    },
    position: { 
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('Waiting', 'Serving', 'Completed', 'Cancelled'),
      defaultValue: 'Waiting',
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'QueueTicket',
    tableName: 'Queue_Tickets',
    underscored: true, // Converts createdAt to created_at automatically
    timestamps: true   // Using standard Sequelize timestamps for better tracking
  });

  return QueueTicket;
};