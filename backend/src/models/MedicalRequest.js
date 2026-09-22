import mongoose from 'mongoose';

const medicalRequestSchema = new mongoose.Schema({
  requestId: { type: String, required: true, unique: true, uppercase: true }, // e.g. "MED-2026-0042"
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  submissionDate: { type: Date, default: Date.now },
  academicYear: { type: String, default: '2025/2026' },
  semester: { type: Number, default: 5 },
  leaveFrom: { type: Date, required: true },
  leaveTo: { type: Date, required: true },
  reason: { type: String, required: true },
  medicalCenterName: { type: String, default: 'University Medical Center - SEUSL' },
  certificateNumber: { type: String, default: '' },
  doctorName: { type: String, default: '' },
  affectedSubjects: [{
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
    subjectCode: String,
    subjectTitle: String,
    absentDates: [Date]
  }],
  documentUrl: { type: String, default: '' },
  status: {
    type: String,
    enum: ['Submitted', 'Under Review', 'Approved', 'Rejected', 'Completed'],
    default: 'Submitted'
  },
  remarks: { type: String, default: '' },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reviewedAt: { type: Date }
}, { timestamps: true });

export default mongoose.model('MedicalRequest', medicalRequestSchema);
