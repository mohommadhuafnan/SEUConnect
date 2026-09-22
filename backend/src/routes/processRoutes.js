import express from 'express';
import {
  getAllProcesses,
  getProcessById,
  searchGuidance,
  createAdminProcess,
  updateAdminProcess,
  deleteAdminProcess
} from '../controllers/processController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getAllProcesses);
router.get('/guidance/search', searchGuidance);
router.get('/:id', getProcessById);

// Admin-only management
router.post('/', authorize('admin', 'systemAdmin', 'facultyAdmin'), createAdminProcess);
router.put('/:id', authorize('admin', 'systemAdmin', 'facultyAdmin'), updateAdminProcess);
router.delete('/:id', authorize('admin', 'systemAdmin', 'facultyAdmin'), deleteAdminProcess);

export default router;
