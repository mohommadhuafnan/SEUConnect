import express from 'express';
import {
  getSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
  getSemesters,
  createSemester,
  getExaminations
} from '../controllers/academicController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/subjects', getSubjects);
router.post('/subjects', authorize('admin', 'systemAdmin'), createSubject);
router.put('/subjects/:id', authorize('admin', 'systemAdmin'), updateSubject);
router.delete('/subjects/:id', authorize('admin', 'systemAdmin'), deleteSubject);

router.get('/semesters', getSemesters);
router.post('/semesters', authorize('admin', 'systemAdmin'), createSemester);

router.get('/examinations', getExaminations);

export default router;
