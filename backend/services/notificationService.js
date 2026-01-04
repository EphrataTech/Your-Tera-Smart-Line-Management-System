'use strict';
const axios = require('axios');
const { Notification } = require('../models');

/**
 * Combined Notification Service: 
 * 1. Logs to Database (In-app notifications)
 * 2. Sends SMS via Traccar Gateway
 */
class NotificationService {
    constructor() {
        this.traccarToken = 'cKPSK8W0Q3uNnWzGFnR11t:APA91bFzfnlnLXe1vuC_mI_XZuIn3dYrsKbcjENwbb31by4FJ2B_SuwvnNfZcKTIugZ8LzswYlY_tfHl41Hp9VYOCc28URi-f32wQfirZ8Ijt1-L0yXGtDs'; 
        this.traccarUrl = 'https://www.traccar.org/sms/'; 
    }

    /**
     * The Master Function: Logs to DB and then sends SMS
     */
    async notifyUser(user_id, phoneNumber, message, type = 'SMS') {
        // 1. Create record in Database first (from main)
        const dbNotification = await Notification.create({
            user_id: user_id,
            message: message,
            type: type, 
            status: 'Pending', 
            created_at: new Date() 
        });

        // 2. Try to send the actual SMS (from develop)
        const smsSuccess = await this.sendTicketSMS(phoneNumber, message);

        // 3. Update DB status based on SMS result
        if (smsSuccess) {
            await dbNotification.update({ status: 'Sent' });
        } else {
            await dbNotification.update({ status: 'Failed' });
        }

        return dbNotification;
    }

    /**
     * Internal: Traccar SMS Logic
     */
    async sendTicketSMS(phoneNumber, message) {
        try {
            console.log(`📡 Sending SMS to ${phoneNumber}...`);
            const response = await axios.post(this.traccarUrl, {
                to: phoneNumber,
                message: message
            }, {
                headers: {
                    'Authorization': this.traccarToken,
                    'Content-Type': 'application/json'
                }
            });

            return response.status === 200 || response.status === 201;
        } catch (error) {
            console.error('❌ Traccar Error:', error.message);
            return false;
        }
    }

    /**
     * Fetching for Frontend (from main)
     */
    async getUserNotifications(user_id) {
        return await Notification.findAll({
            where: { user_id },
            order: [['created_at', 'DESC']]
        });
    }

    async markAsRead(notification_id) {
        return await Notification.update(
            { status: 'Read' },
            { where: { notification_id } }
        );
    }
}

module.exports = new NotificationService();