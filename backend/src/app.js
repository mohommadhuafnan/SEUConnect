import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/authRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import lecturerRoutes from './routes/lecturerRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import formRoutes from './routes/formRoutes.js';
import processRoutes from './routes/processRoutes.js';
import academicRoutes from './routes/academicRoutes.js';
import { welfareRouter, societyRouter, notificationRouter, aiRouter } from './routes/extraRoutes.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/lecturer', lecturerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/forms', formRoutes);
app.use('/api/processes', processRoutes);
app.use('/api/academic', academicRoutes);
app.use('/api/welfare', welfareRouter);
app.use('/api/societies', societyRouter);
app.use('/api/notifications', notificationRouter);
app.use('/api/ai', aiRouter);

// Root healthcheck
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    system: 'SEUConnect - Faculty of Technology',
    university: 'South Eastern University of Sri Lanka',
    timestamp: new Date()
  });
});

// Error handlers
app.use(notFound);
app.use(errorHandler);

export default app;
