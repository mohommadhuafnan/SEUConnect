import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  title: { type: String, required: true, trim: true },
  credits: { type: Number, required: true, min: 1, max: 8 },
  semester: { type: Number, required: true, min: 1, max: 8 },
  degreeProgramme: { type: String, enum: ['BICT', 'BBST', 'COMMON'], default: 'BICT' },
  department: { type: String, default: 'Department of Information and Communication Technology' },
  faculty: { type: String, default: 'Faculty of Technology' },
  theoryHours: { type: Number, default: 30 },
  practicalHours: { type: Number, default: 30 },
  isGPA: { type: Boolean, default: true },
  caWeightage: { type: Number, default: 40 },
  esaWeightage: { type: Number, default: 60 },
  lecturerInCharge: { type: mongoose.Schema.Types.ObjectId, ref: 'Lecturer' }
}, { timestamps: true });

export default mongoose.model('Subject', subjectSchema);
