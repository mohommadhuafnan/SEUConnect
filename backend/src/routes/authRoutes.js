import express from 'express';
import { login, getMe, updateProfile, uploadProfileImage, removeProfileImage } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.post('/profile-image', protect, upload.single('image'), uploadProfileImage);
router.delete('/profile-image', protect, removeProfileImage);

export default router;
