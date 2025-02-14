const express = require('express');
const router = express.Router();
const NotificationController = require('../controllers/notificationController');

router.get('/', NotificationController.getUserNotifications);
router.get('/unread-count', NotificationController.getUnreadCount);
router.put('/:notificationId/read', NotificationController.markAsRead);

module.exports = router; 