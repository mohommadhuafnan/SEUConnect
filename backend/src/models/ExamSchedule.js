import mongoose from 'mongoose';

const examScheduleSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  courseCode: { type: String, default: '' },
  courseTitle: { type: String, default: '' },
  department: { type: String, default: 'Department of Information & Communication Tech.' },
  date: { type: Date, required: true },
  session: { type: String, enum: ['Morning', 'Afternoon'], default: 'Morning' },
  venue: { type: String, default: 'Technology Examination Hall A' },
  eventType: {
    type: String,
    enum: ['Exams', 'Board Meeting', 'Deadline'],
    default: 'Exams'
  },
  hodFeedback: { type: String, default: '' },
  hodStatus: {
    type: String,
    enum: ['Pending Input', 'Agreed', 'Revision Requested'],
    default: 'Pending Input'
  },
  status: {
    type: String,
    enum: ['Draft', 'Under Consultation', 'Approved', 'Final'],
    default: 'Draft'
  },
  schedulingWindowEnd: { type: Date }
}, { timestamps: true });

export default mongoose.model('ExamSchedule', examScheduleSchema);
