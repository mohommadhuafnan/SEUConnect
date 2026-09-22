import mongoose from 'mongoose';

const processSchema = new mongoose.Schema({
  processId: { type: String, required: true, unique: true, uppercase: true }, // e.g. "PROC-MED-ABSENT"
  title: { type: String, required: true },
  category: { type: String, default: 'Academic' },
  purpose: { type: String, required: true },
  whoCanUse: { type: String, required: true },
  eligibility: { type: String, required: true },
  steps: [{
    stepNumber: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    actionRequired: { type: String }
  }],
  requiredFormIds: [{ type: String }], // references FormDocument.formId
  supportingDocuments: [{ type: String }],
  approvals: [{ type: String }],
  submissionLocation: { type: String, required: true },
  deadlineInfo: { type: String, required: true },
  nextAction: { type: String },
  contactOffice: { type: String, default: 'Office of the Dean, Faculty of Technology' },
  keywords: [{ type: String }],
  status: { type: String, enum: ['Active', 'Under Revision', 'Archived'], default: 'Active' }
}, { timestamps: true });

export default mongoose.model('Process', processSchema);
