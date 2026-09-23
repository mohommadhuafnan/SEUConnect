import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import {
  getHODDashboard,
  getHODRegistrations,
  signHODRegistration,
  batchSignHODRegistrations,
  getHODAttendance,
  getHODRepeatCandidates,
  getHODBoardPrep,
  getHODEscalations,
  createHODEscalation,
  getHODExamConsultations,
  submitHODExamConsultationFeedback,
  sendHODBulkNotification
} from '../controllers/hodController.js';

const router = express.Router();

router.use(protect);
router.use(authorize('hod', 'admin'));

router.get('/dashboard', getHODDashboard);
router.get('/registrations', getHODRegistrations);
router.post('/registrations/:id/sign', signHODRegistration);
router.post('/registrations/batch-sign', batchSignHODRegistrations);

router.get('/attendance', getHODAttendance);
router.get('/repeat-candidates', getHODRepeatCandidates);
router.get('/board-prep', getHODBoardPrep);

router.get('/escalations', getHODEscalations);
router.post('/escalate', createHODEscalation);

router.get('/exam-consultations', getHODExamConsultations);
router.post('/exam-consultations/:id/feedback', submitHODExamConsultationFeedback);

router.post('/bulk-notify', sendHODBulkNotification);

export default router;
