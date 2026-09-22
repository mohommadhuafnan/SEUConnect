import express from 'express';
import {
  getAdminDashboard,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getAllMedicalRequestsAdmin,
  updateMedicalStatus,
  getAcademicRules,
  updateAcademicRules
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin', 'systemAdmin', 'facultyAdmin'));

router.get('/dashboard', getAdminDashboard);
router.get('/users', getAllUsers);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

router.get('/medical', getAllMedicalRequestsAdmin);
router.put('/medical/:id', updateMedicalStatus);

router.get('/academic-rules', getAcademicRules);
router.put('/academic-rules', updateAcademicRules);

export default router;
