import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  lecturerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lecturer', required: true },
  date: { type: Date, required: true },
  session: { type: String, enum: ['Theory', 'Practical'], default: 'Theory' },
  hours: { type: Number, default: 2, min: 1, max: 6 },
  topic: { type: String, default: '' },
  records: [{
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    status: {
      type: String,
      enum: ['Present', 'Absent', 'Excused_Medical'],
      default: 'Present'
    }
  }]
}, { timestamps: true });

export default mongoose.model('Attendance', attendanceSchema);
