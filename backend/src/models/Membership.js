import mongoose from 'mongoose';

const membershipSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  societyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Society', required: true },
  role: { type: String, enum: ['Member', 'Committee Member', 'Secretary', 'Treasurer', 'President'], default: 'Member' },
  status: { type: String, enum: ['Active', 'Pending', 'Rejected'], default: 'Active' },
  joinDate: { type: Date, default: Date.now }
}, { timestamps: true });

membershipSchema.index({ studentId: 1, societyId: 1 }, { unique: true });

export default mongoose.model('Membership', membershipSchema);
