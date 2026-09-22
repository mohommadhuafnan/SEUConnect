import mongoose from 'mongoose';

const academicRuleSchema = new mongoose.Schema({
  ruleKey: { type: String, required: true, unique: true, default: 'SEUSL_FT_DEFAULT' },
  attendanceMinimumPercent: { type: Number, default: 80 },
  maximumCreditsPerSemester: { type: Number, default: 22 },
  bictGraduationCredits: { type: Number, default: 130 },
  bbstGraduationCredits: { type: Number, default: 120 },
  gradeScale: [{
    grade: String,
    minMark: Number,
    maxMark: Number,
    gradePoint: Number,
    passStatus: String
  }],
  classRequirements: [{
    classTitle: String,
    minCGPA: Number,
    maxRepeatsAllowed: Number
  }]
}, { timestamps: true });

export default mongoose.model('AcademicRule', academicRuleSchema);
