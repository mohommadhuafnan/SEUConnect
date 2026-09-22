import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  firebaseUid: { type: String, default: null },
  role: {
    type: String,
    enum: ['student', 'lecturer', 'admin', 'academicAdvisor', 'examinationOfficer', 'facultyAdmin', 'systemAdmin'],
    default: 'student',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  permissions: [{ type: String }],
  profileImage: { type: String, default: '' },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  lastLogin: { type: Date, default: null }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
