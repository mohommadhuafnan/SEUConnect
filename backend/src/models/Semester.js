import mongoose from 'mongoose';

const semesterSchema = new mongoose.Schema({
  academicYear: { type: String, required: true }, // e.g. "2025/2026"
  semesterNumber: { type: Number, required: true, min: 1, max: 2 },
  name: { type: String, required: true },
  isCurrent: { type: Boolean, default: true },
  registrationOpen: { type: Boolean, default: true },
  registrationDeadline: { type: Date },
  examRegistrationOpen: { type: Boolean, default: true },
  examRegistrationDeadline: { type: Date },
  startDate: { type: Date },
  endDate: { type: Date }
}, { timestamps: true });

export default mongoose.model('Semester', semesterSchema);
