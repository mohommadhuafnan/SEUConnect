import mongoose from 'mongoose';

const welfareSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: {
    type: String,
    enum: ['Scholarships', 'Financial Support', 'Accommodation', 'Food & Canteen', 'Health', 'Counselling', 'Student Support'],
    required: true
  },
  description: { type: String, required: true },
  eligibility: { type: String, required: true },
  benefits: { type: String },
  applicationDeadline: { type: String },
  contactPerson: { type: String },
  contactEmail: { type: String },
  contactOffice: { type: String },
  requiredFormId: { type: String, default: '' },
  status: { type: String, enum: ['Active', 'Upcoming', 'Closed'], default: 'Active' }
}, { timestamps: true });

export default mongoose.model('Welfare', welfareSchema);
