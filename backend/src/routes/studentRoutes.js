import express from 'express';
import {
  getStudentDashboard,
  getStudentRegistration,
  registerSubject,
  dropSubject,
  getStudentAttendance,
  getStudentMedicalRequests,
  submitMedicalRequest,
  getStudentExaminations,
  getStudentResults,
  getStudentGPAData,
  getStudentProgress,
  getStudentPenalties
} from '../controllers/studentController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('student', 'admin'));

router.get('/dashboard', getStudentDashboard);
router.get('/registration', getStudentRegistration);
router.post('/registration', registerSubject);
router.post('/registration/drop', dropSubject);
router.get('/attendance', getStudentAttendance);
router.get('/medical', getStudentMedicalRequests);
router.post('/medical', upload.single('document'), submitMedicalRequest);
router.get('/examination', getStudentExaminations);
router.get('/results', getStudentResults);
router.get('/gpa', getStudentGPAData);
router.get('/progress', getStudentProgress);
router.get('/penalties', getStudentPenalties);

export default router;
