import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import {
  getDeanDashboard,
  getDeanRegistrations,
  approveDeanIntake,
  getDeanAgenda,
  createDeanAgendaItem,
  updateDeanAgendaItem,
  getDeanExamSchedules,
  createDeanExamSchedule,
  getDeanWithdrawalRisk,
  getDeanBoardOfExaminers,
  getDeanStaffDirectory,
  publishDeanAnnouncement
} from '../controllers/deanController.js';

const router = express.Router();

router.use(protect);
router.use(authorize('dean', 'admin'));

router.get('/dashboard', getDeanDashboard);

router.get('/registrations', getDeanRegistrations);
router.post('/registrations/:id/intake', approveDeanIntake);

router.get('/agenda', getDeanAgenda);
router.post('/agenda', createDeanAgendaItem);
router.patch('/agenda/:id', updateDeanAgendaItem);

router.get('/exam-schedules', getDeanExamSchedules);
router.post('/exam-schedules', createDeanExamSchedule);

router.get('/withdrawal-risk', getDeanWithdrawalRisk);
router.get('/board-of-examiners', getDeanBoardOfExaminers);
router.get('/staff-directory', getDeanStaffDirectory);

router.post('/announcements', publishDeanAnnouncement);

export default router;
