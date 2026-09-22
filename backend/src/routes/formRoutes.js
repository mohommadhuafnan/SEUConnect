import express from 'express';
import {
  getAllForms,
  getFormCategories,
  getFormById,
  createAdminForm,
  updateAdminForm,
  deleteAdminForm
} from '../controllers/formController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getAllForms);
router.get('/categories', getFormCategories);
router.get('/:id', getFormById);

// Admin-only management
router.post('/', authorize('admin', 'systemAdmin', 'facultyAdmin'), createAdminForm);
router.put('/:id', authorize('admin', 'systemAdmin', 'facultyAdmin'), updateAdminForm);
router.delete('/:id', authorize('admin', 'systemAdmin', 'facultyAdmin'), deleteAdminForm);

export default router;
