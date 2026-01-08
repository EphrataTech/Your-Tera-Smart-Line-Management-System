'use strict';
const { Notification } = require('../models');
const mongoose = require('mongoose');
const emailService = require('./emailService');

/**
 * Email-based Notification Service
 */
class NotificationService {
    /**
     * The Master Function: Logs to DB and then sends Email
     */
    async notifyUser(user_id, email, message, type = 'Email', subject = 'Notification from Your Tera') {
        // Convert user_id to ObjectId if needed
        const userObjectId = mongoose.Types.ObjectId.isValid(user_id) 
            ? (typeof user_id === 'string' ? new mongoose.Types.ObjectId(user_id) : user_id)
            : user_id;

        // 1. Create record in Database first
        const dbNotification = new Notification({
            user_id: userObjectId,
            message: message,
            type: type, 
            status: 'Pending', 
            created_at: new Date() 
        });
        await dbNotification.save();

        // 2. Try to send the actual Email
        const emailSuccess = await this.sendNotificationEmail(email, message, subject);

        // 3. Update DB status based on Email result
        dbNotification.status = emailSuccess ? 'Sent' : 'Failed';
        await dbNotification.save();

        return dbNotification;
    }

    /**
     * Email sending for notifications
     */
    async sendNotificationEmail(email, message, subject = 'Notification from Your Tera') {
        try {
            console.log(`📧 Sending notification email to ${email}: ${message}`);
            
            // In development mode, just log the notification
            if (process.env.NODE_ENV === 'development') {
                console.log('📧 Email Mode: SIMULATION');
                console.log(`📬 Would send to: ${email}`);
                console.log(`📝 Subject: ${subject}`);
                console.log(`💬 Message: ${message}`);
                return true;
            }
            
            // Production: Send actual email
            await this.sendFormattedEmail(email, subject, message);
            console.log('✅ Notification email sent successfully');
            return true;
            
        } catch (error) {
            console.error('❌ Email notification error:', error.message);
            return false;
        }
    }

    /**
     * Send formatted notification email
     */
    async sendFormattedEmail(email, subject, message) {
        const emailContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #4A868C, #3D6E73); padding: 20px; border-radius: 8px 8px 0 0;">
                    <h1 style="color: white; margin: 0; text-align: center;">Your Tera</h1>
                    <p style="color: #E8F4F8; margin: 5px 0 0 0; text-align: center;">Smart Line Management System</p>
                </div>
                <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 8px 8px;">
                    <h2 style="color: #4A868C; margin-top: 0;">${subject}</h2>
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 6px; margin: 20px 0;">
                        <p style="margin: 0; color: #333; line-height: 1.6;">${message}</p>
                    </div>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                    <p style="color: #666; font-size: 14px; text-align: center; margin: 0;">
                        This is an automated notification from Your Tera Smart Line Management System.
                    </p>
                </div>
            </div>
        `;

        // Use the existing email service
        const nodemailer = require('nodemailer');
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/\s/g, '') : ''
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: subject,
            html: emailContent
        };

        return await transporter.sendMail(mailOptions);
    }

    /**
     * Fetching for Frontend
     */
    async getUserNotifications(user_id) {
        const userObjectId = mongoose.Types.ObjectId.isValid(user_id) 
            ? (typeof user_id === 'string' ? new mongoose.Types.ObjectId(user_id) : user_id)
            : user_id;

        return await Notification.find({ user_id: userObjectId })
            .sort({ created_at: -1 });
    }

    async markAsRead(notification_id) {
        if (!mongoose.Types.ObjectId.isValid(notification_id)) {
            throw new Error('Invalid notification ID format');
        }
        return await Notification.findByIdAndUpdate(
            notification_id,
            { status: 'Read' },
            { new: true }
        );
    }

    async createNotification(user_id, message, type = 'InApp') {
        const userObjectId = mongoose.Types.ObjectId.isValid(user_id) 
            ? (typeof user_id === 'string' ? new mongoose.Types.ObjectId(user_id) : user_id)
            : user_id;

        const notification = new Notification({
            user_id: userObjectId,
            message,
            type,
            status: 'Pending'
        });
        return await notification.save();
    }
}

module.exports = new NotificationService();
