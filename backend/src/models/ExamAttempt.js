import mongoose from 'mongoose';

const examAttemptSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  examinationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Examination' },
  academicYear: { type: String, required: true },
  semester: { type: Number, required: true },
  attemptNumber: { type: Number, default: 1 },
  attemptType: {
    type: String,
    enum: ['Regular', 'Repeat_CA', 'Repeat_ESA', 'Fresh_Repeat'],
    default: 'Regular'
  },
  paymentVoucherNo: { type: String, default: '' }, // PIV reference if repeat
  paymentAmount: { type: Number, default: 0 },
  admissionCardStatus: {
    type: String,
    enum: ['Generated', 'Pending Approval', 'Blocked_Attendance'],
    default: 'Generated'
  },
  status: {
    type: String,
    enum: ['Registered', 'Attended', 'Absent_Medical', 'Completed'],
    default: 'Registered'
  }
}, { timestamps: true });

export default mongoose.model('ExamAttempt', examAttemptSchema);
