import mongoose from 'mongoose';

const subjectRegistrationSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  semesterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Semester' },
  academicYear: { type: String, default: '2025/2026' },
  status: {
    type: String,
    enum: ['REGISTERED', 'DROPPED', 'PENDING_APPROVAL'],
    default: 'REGISTERED'
  },
  registrationDate: { type: Date, default: Date.now },
  attemptType: {
    type: String,
    enum: ['FIRST_ATTEMPT', 'REPEAT', 'FRESH_REPEAT'],
    default: 'FIRST_ATTEMPT'
  }
}, { timestamps: true });

subjectRegistrationSchema.index({ studentId: 1, subjectId: 1, academicYear: 1 }, { unique: true });

export default mongoose.model('SubjectRegistration', subjectRegistrationSchema);
