import Attendance from '../models/Attendance.js';
import AcademicRule from '../models/AcademicRule.js';

export const calculateStudentAttendance = async (studentId, semesterId = null) => {
  // Fetch active academic rule
  const rule = await AcademicRule.findOne({ ruleKey: 'SEUSL_FT_DEFAULT' }) || { attendanceMinimumPercent: 80 };
  const minThreshold = rule.attendanceMinimumPercent || 80;

  const attendanceRecords = await Attendance.find({
    'records.studentId': studentId
  }).populate('subjectId', 'code title credits semester');

  const subjectStatsMap = new Map();

  let totalSessions = 0;
  let totalAttended = 0;

  for (const session of attendanceRecords) {
    const sub = session.subjectId;
    if (!sub) continue;
    const subId = sub._id.toString();

    if (!subjectStatsMap.has(subId)) {
      subjectStatsMap.set(subId, {
        subjectId: subId,
        code: sub.code,
        title: sub.title,
        credits: sub.credits,
        semester: sub.semester,
        theoryTotal: 0,
        theoryAttended: 0,
        practicalTotal: 0,
        practicalAttended: 0,
        totalSessions: 0,
        attendedSessions: 0,
        excusedSessions: 0
      });
    }

    const stat = subjectStatsMap.get(subId);
    const myRecord = session.records.find(r => r.studentId.toString() === studentId.toString());

    if (!myRecord) continue;

    stat.totalSessions += 1;
    totalSessions += 1;

    if (session.session === 'Practical') {
      stat.practicalTotal += 1;
      if (myRecord.status === 'Present' || myRecord.status === 'Excused_Medical') {
        stat.practicalAttended += 1;
      }
    } else {
      stat.theoryTotal += 1;
      if (myRecord.status === 'Present' || myRecord.status === 'Excused_Medical') {
        stat.theoryAttended += 1;
      }
    }

    if (myRecord.status === 'Present' || myRecord.status === 'Excused_Medical') {
      stat.attendedSessions += 1;
      totalAttended += 1;
    }
    if (myRecord.status === 'Excused_Medical') {
      stat.excusedSessions += 1;
    }
  }

  const subjects = [];
  let eligibleForExam = true;

  for (const [_, stat] of subjectStatsMap.entries()) {
    const percentage = stat.totalSessions > 0 ? Math.round((stat.attendedSessions / stat.totalSessions) * 100) : 100;
    const isEligible = percentage >= minThreshold;
    if (!isEligible) eligibleForExam = false;

    subjects.push({
      ...stat,
      percentage,
      isEligible,
      status: isEligible ? 'Eligible' : 'Ineligible'
    });
  }

  const overallPercentage = totalSessions > 0 ? Math.round((totalAttended / totalSessions) * 100) : 100;

  return {
    overallPercentage,
    minThreshold,
    isOverallEligible: overallPercentage >= minThreshold,
    totalSessions,
    totalAttended,
    subjects
  };
};
