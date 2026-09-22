import Notification from '../models/Notification.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const getNotifications = async (req, res, next) => {
  try {
    const userRole = req.user.role.toUpperCase();
    const notifications = await Notification.find({
      $or: [
        { targetRole: 'ALL' },
        { targetRole: userRole }
      ]
    }).sort({ createdAt: -1 });

    const unreadCount = notifications.filter(
      n => !n.readBy.some(id => id.toString() === req.user._id.toString())
    ).length;

    const formatted = notifications.map(n => ({
      ...n.toObject(),
      isRead: n.readBy.some(id => id.toString() === req.user._id.toString())
    }));

    return successResponse(res, { notifications: formatted, unreadCount });
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findById(id);
    if (!notification) return errorResponse(res, 'Notification not found', 404);

    if (!notification.readBy.includes(req.user._id)) {
      notification.readBy.push(req.user._id);
      await notification.save();
    }

    return successResponse(res, {}, 'Notification marked as read.');
  } catch (error) {
    next(error);
  }
};

export const createNotification = async (req, res, next) => {
  try {
    const newNotification = await Notification.create(req.body);
    return successResponse(res, newNotification, 'Notification published successfully.', 201);
  } catch (error) {
    next(error);
  }
};
