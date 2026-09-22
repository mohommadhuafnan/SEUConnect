import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: {
    type: String,
    enum: ['Academic', 'Examination', 'Registration', 'Forms', 'Welfare', 'System'],
    default: 'Academic'
  },
  priority: {
    type: String,
    enum: ['Low', 'Normal', 'High', 'Urgent'],
    default: 'Normal'
  },
  targetRole: {
    type: String,
    enum: ['ALL', 'STUDENT', 'LECTURER', 'ADMIN'],
    default: 'ALL'
  },
  targetProgramme: {
    type: String,
    enum: ['ALL', 'BICT', 'BBST'],
    default: 'ALL'
  },
  targetSemester: { type: Number, default: 0 }, // 0 = all semesters
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  actionUrl: { type: String, default: '' },
  expiresAt: { type: Date }
}, { timestamps: true });

export default mongoose.model('Notification', notificationSchema);
