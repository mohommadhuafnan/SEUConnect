import mongoose from 'mongoose';

const formDocumentSchema = new mongoose.Schema({
  formId: { type: String, required: true, unique: true, uppercase: true }, // e.g. "SEU-EX-CA-REP"
  name: { type: String, required: true },
  officialTitle: { type: String, required: true },
  issuingDivision: { type: String, default: 'Examination Division' },
  category: {
    type: String,
    enum: [
      'Examination',
      'Medical / Attendance',
      'Finance & Fees',
      'Academic / Registration',
      'Student Welfare',
      'Leave / Permission',
      'Other Faculty Forms'
    ],
    default: 'Examination'
  },
  description: { type: String, required: true },
  purpose: { type: String, required: true },
  whoShouldUse: { type: String, required: true },
  whenToUse: { type: String, required: true },
  eligibility: { type: String, default: 'All eligible students in Faculty of Technology' },
  requiredInformation: [{ type: String }],
  requiredDocuments: [{ type: String }],
  approvalRequirements: [{ type: String }],
  submissionLocation: { type: String, required: true },
  deadline: { type: String, default: 'As announced by the Dean / Examination Division' },
  instructions: [{ type: String }],
  fileUrl: { type: String, default: '' },
  printable: { type: Boolean, default: true },
  downloadable: { type: Boolean, default: true },
  version: { type: String, default: '2026.1' },
  availableToRoles: [{ type: String, default: 'student' }],
  status: {
    type: String,
    enum: ['Published', 'Draft', 'Archived'],
    default: 'Published'
  },
  relatedProcessId: { type: String, default: '' },
  formFields: [{
    label: String,
    name: String,
    type: { type: String, default: 'text' },
    required: Boolean,
    options: [String],
    placeholder: String
  }]
}, { timestamps: true });

export default mongoose.model('FormDocument', formDocumentSchema);
