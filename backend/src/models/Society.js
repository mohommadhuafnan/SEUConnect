import mongoose from 'mongoose';

const societySchema = new mongoose.Schema({
  name: { type: String, required: true },
  shortCode: { type: String, required: true, uppercase: true }, // e.g. "ITSA", "TECH-CLUB"
  category: { type: String, enum: ['Academic', 'Technology', 'Cultural', 'Sports', 'Community'], default: 'Technology' },
  description: { type: String, required: true },
  president: { type: String },
  seniorTreasurer: { type: String }, // usually a faculty member
  logo: { type: String, default: '' },
  meetingSchedule: { type: String },
  activeProjects: [{ type: String }],
  membershipFee: { type: Number, default: 0 },
  status: { type: String, enum: ['Active', 'Recruiting', 'Inactive'], default: 'Active' }
}, { timestamps: true });

export default mongoose.model('Society', societySchema);
