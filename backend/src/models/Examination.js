import mongoose from 'mongoose';

const examinationSchema = new mongoose.Schema({
  examCode: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  academicYear: { type: String, required: true },
  semester: { type: Number, required: true },
  faculty: { type: String, default: 'Faculty of Technology' },
  startDate: { type: Date },
  endDate: { type: Date },
  registrationOpen: { type: Boolean, default: true },
  registrationDeadline: { type: Date },
  entryFormReleaseDate: { type: Date },
  admissionCardAvailable: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Examination', examinationSchema);
