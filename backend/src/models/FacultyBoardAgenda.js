import mongoose from 'mongoose';

const facultyBoardAgendaSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  category: {
    type: String,
    enum: ['Exam Dates', 'Medical', 'Repeat Grace', 'Special Needs', 'Discipline'],
    required: true,
    default: 'Exam Dates'
  },
  department: {
    type: String,
    default: 'Department of Information & Communication Tech.'
  },
  requestedDate: { type: Date, default: Date.now },
  priority: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium'
  },
  status: {
    type: String,
    enum: ['Pending', 'Under Review', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  details: { type: String, default: '' },
  escalatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  studentRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  subjectRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
  boardDecision: { type: String, default: '' },
  decisionDate: { type: Date }
}, { timestamps: true });

export default mongoose.model('FacultyBoardAgenda', facultyBoardAgendaSchema);
