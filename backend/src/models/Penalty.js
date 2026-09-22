import mongoose from 'mongoose';

const penaltySchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  refNumber: { type: String, required: true }, // e.g. "DISC-FT-2026-03"
  description: { type: String, required: true },
  relatedRule: { type: String, required: true }, // e.g. "Section 14.2: Examination Code of Conduct"
  issuedDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['Active', 'Under Appeal', 'Resolved', 'Expired'], default: 'Active' },
  requiredAction: { type: String, default: 'Contact Student Affairs / Faculty Proctor' },
  authorizedBy: { type: String, default: 'Board of Discipline / Dean FT' },
  appealDeadline: { type: Date }
}, { timestamps: true });

export default mongoose.model('Penalty', penaltySchema);
