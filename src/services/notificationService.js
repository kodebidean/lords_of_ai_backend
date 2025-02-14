const Notification = require('../models/Notification');
const EmailService = require('./emailService');
const logger = require('../utils/logger');

class NotificationService {
    static async createNotification(data) {
        try {
            const notification = await Notification.create({
                user_id: data.userId,
                type: data.type,
                title: data.title,
                message: data.message,
                related_id: data.relatedId,
                priority: data.priority || 'normal'
            });

            // Si el usuario tiene habilitadas las notificaciones por email
            if (data.sendEmail) {
                await EmailService.sendNotificationEmail(
                    data.userEmail,
                    data.title,
                    data.message
                );
            }

            // Si hay WebSocket conectado, enviar notificación en tiempo real
            if (global.io) {
                global.io.to(`user_${data.userId}`).emit('notification', notification);
            }

            return notification;
        } catch (error) {
            logger.error('Error en createNotification:', error);
            throw error;
        }
    }

    static async notifyModelUpdate(modelId, updateData) {
        try {
            // Obtener usuarios que siguen este modelo
            const followers = await ModelFollower.findByModel(modelId);

            for (const follower of followers) {
                await this.createNotification({
                    userId: follower.user_id,
                    type: 'model_update',
                    title: 'Actualización de Modelo',
                    message: `El modelo ${updateData.name} ha sido actualizado con nuevas características`,
                    relatedId: modelId,
                    sendEmail: follower.email_notifications,
                    userEmail: follower.email
                });
            }
        } catch (error) {
            logger.error('Error en notifyModelUpdate:', error);
            throw error;
        }
    }

    static async notifyNewBenchmark(modelId, benchmarkData) {
        try {
            const followers = await ModelFollower.findByModel(modelId);

            for (const follower of followers) {
                await this.createNotification({
                    userId: follower.user_id,
                    type: 'new_benchmark',
                    title: 'Nuevo Benchmark Disponible',
                    message: `Se han agregado nuevos resultados de benchmark para el modelo que sigues`,
                    relatedId: modelId,
                    priority: 'high',
                    sendEmail: follower.email_notifications,
                    userEmail: follower.email
                });
            }
        } catch (error) {
            logger.error('Error en notifyNewBenchmark:', error);
            throw error;
        }
    }
}

module.exports = NotificationService; 