const Notification = require('../models/Notification');
const logger = require('../utils/logger');

class NotificationController {
    static async getUserNotifications(req, res) {
        try {
            const { page = 1, limit = 10 } = req.query;
            const userId = req.user.id;

            const notifications = await Notification.findByUser(userId, {
                page: parseInt(page),
                limit: parseInt(limit)
            });

            res.json({
                success: true,
                data: notifications
            });
        } catch (error) {
            logger.error('Error en getUserNotifications:', error);
            res.status(500).json({
                success: false,
                error: 'Error al obtener notificaciones'
            });
        }
    }

    static async markAsRead(req, res) {
        try {
            const { notificationId } = req.params;
            const userId = req.user.id;

            await Notification.markAsRead(notificationId, userId);

            res.json({
                success: true,
                message: 'Notificación marcada como leída'
            });
        } catch (error) {
            logger.error('Error en markAsRead:', error);
            res.status(500).json({
                success: false,
                error: 'Error al marcar notificación como leída'
            });
        }
    }

    static async getUnreadCount(req, res) {
        try {
            const userId = req.user.id;
            const count = await Notification.getUnreadCount(userId);

            res.json({
                success: true,
                data: { count }
            });
        } catch (error) {
            logger.error('Error en getUnreadCount:', error);
            res.status(500).json({
                success: false,
                error: 'Error al obtener conteo de notificaciones'
            });
        }
    }
}

module.exports = NotificationController; 