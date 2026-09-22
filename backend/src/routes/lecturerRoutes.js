import express from 'express';
import {
  getLecturerDashboard,
  getLecturerCourses,
  getCourseStudents,
  saveAttendanceSession,
  updateCAMarks,
  updateESAMarks
} from '../controllers/lecturerController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('lecturer', 'admin'));

router.get('/dashboard', getLecturerDashboard);
router.get('/courses', getLecturerCourses);
router.get('/courses/:courseId/students', getCourseStudents);
router.post('/attendance', saveAttendanceSession);
router.post('/ca-marks', updateCAMarks);
router.post('/esa-marks', updateESAMarks);

export default router;
