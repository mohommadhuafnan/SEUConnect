import express from 'express';
import { getWelfareServices, createWelfareService } from '../controllers/welfareController.js';
import { getSocieties, requestMembership, createSociety } from '../controllers/societyController.js';
import { getNotifications, markAsRead, createNotification } from '../controllers/notificationController.js';
import { chatWithAI } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

export const welfareRouter = express.Router();
welfareRouter.use(protect);
welfareRouter.get('/', getWelfareServices);
welfareRouter.post('/', authorize('admin', 'systemAdmin'), createWelfareService);

export const societyRouter = express.Router();
societyRouter.use(protect);
societyRouter.get('/', getSocieties);
societyRouter.post('/membership', requestMembership);
societyRouter.post('/', authorize('admin', 'systemAdmin'), createSociety);

export const notificationRouter = express.Router();
notificationRouter.use(protect);
notificationRouter.get('/', getNotifications);
notificationRouter.put('/:id/read', markAsRead);
notificationRouter.post('/', authorize('admin', 'systemAdmin'), createNotification);

export const aiRouter = express.Router();
aiRouter.use(protect);
aiRouter.post('/chat', chatWithAI);
