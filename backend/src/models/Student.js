import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  registrationNumber: { type: String, required: true, unique: true, uppercase: true, trim: true },
  indexNumber: { type: String, required: true, unique: true, uppercase: true, trim: true },
  degreeProgramme: { type: String, enum: ['BICT', 'BBST'], default: 'BICT' },
  academicYear: { type: String, default: '2025/2026' },
  currentSemester: { type: Number, default: 5 },
  specialization: { type: String, default: 'Software Systems' },
  faculty: { type: String, default: 'Faculty of Technology' },
  department: { type: String, default: 'Department of Information and Communication Technology' },
  sgpa: { type: Number, default: 0 },
  cgpa: { type: Number, default: 0 },
  creditsCompleted: { type: Number, default: 0 },
  creditsRegistered: { type: Number, default: 0 },
  degreeCreditsRequired: { type: Number, default: 130 },
  examEligibility: { type: String, enum: ['Eligible', 'Conditional', 'Ineligible'], default: 'Eligible' },
  currentClass: { type: String, default: 'Second Class (Upper Division)' }
}, { timestamps: true });

export default mongoose.model('Student', studentSchema);
