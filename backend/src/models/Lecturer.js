import mongoose from 'mongoose';

const lecturerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  staffId: { type: String, required: true, unique: true, uppercase: true, trim: true },
  designation: { type: String, default: 'Senior Lecturer' },
  faculty: { type: String, default: 'Faculty of Technology' },
  department: { type: String, default: 'Department of Information and Communication Technology' },
  specialization: { type: String, default: 'Software Engineering & Data Systems' },
  officeLocation: { type: String, default: 'Technology Building, Room 204' },
  assignedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }]
}, { timestamps: true });

export default mongoose.model('Lecturer', lecturerSchema);
