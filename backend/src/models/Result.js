import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  academicYear: { type: String, required: true },
  semester: { type: Number, required: true },
  caMark: { type: Number, min: 0, max: 100, default: 0 },
  esaMark: { type: Number, min: 0, max: 100, default: 0 },
  finalMark: { type: Number, min: 0, max: 100, default: 0 },
  grade: {
    type: String,
    enum: ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'E', 'Pending'],
    default: 'Pending'
  },
  gradePoint: { type: Number, default: 0 },
  qualityPoints: { type: Number, default: 0 },
  isRepeat: { type: Boolean, default: false },
  attemptNumber: { type: Number, default: 1 },
  published: { type: Boolean, default: true }
}, { timestamps: true });

resultSchema.index({ studentId: 1, subjectId: 1, semester: 1, attemptNumber: 1 });

export default mongoose.model('Result', resultSchema);
