import Lecturer from '../models/Lecturer.js';
import Subject from '../models/Subject.js';
import SubjectRegistration from '../models/SubjectRegistration.js';
import Attendance from '../models/Attendance.js';
import Result from '../models/Result.js';
import FormDocument from '../models/FormDocument.js';
import { calculateGradeFromMark } from '../utils/gradeCalculator.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const getLecturerDashboard = async (req, res, next) => {
  try {
    const lecturer = await Lecturer.findOne({ userId: req.user._id }).populate('assignedCourses');
    if (!lecturer) {
      return errorResponse(res, 'Lecturer profile not found', 404);
    }

    const courseIds = lecturer.assignedCourses.map(c => c._id);

    // Total unique students across assigned courses
    const studentRegistrations = await SubjectRegistration.find({
      subjectId: { $in: courseIds },
      status: 'REGISTERED'
    });
    const uniqueStudentIds = new Set(studentRegistrations.map(r => r.studentId.toString()));

    // Attendance sessions recorded in last 30 days
    const recentAttendance = await Attendance.find({
      subjectId: { $in: courseIds }
    }).sort({ date: -1 }).limit(5);

    // Pending CA marks count
    const pendingCACount = await Result.countDocuments({
      subjectId: { $in: courseIds },
      caMark: 0
    });

    return successResponse(res, {
      lecturer: {
        id: lecturer._id,
        name: req.user.name,
        email: req.user.email,
        staffId: lecturer.staffId,
        designation: lecturer.designation,
        department: lecturer.department,
        faculty: lecturer.faculty,
        specialization: lecturer.specialization,
        officeLocation: lecturer.officeLocation
      },
      metrics: {
        assignedCoursesCount: lecturer.assignedCourses.length,
        totalEnrolledStudents: uniqueStudentIds.size,
        attendancePendingCount: Math.max(0, lecturer.assignedCourses.length - recentAttendance.length),
        caPendingCount: pendingCACount > 0 ? 1 : 0,
        esaPendingCount: 1,
        unreadNotificationsCount: 3
      },
      courses: lecturer.assignedCourses.map(c => ({
        id: c._id,
        code: c.code,
        title: c.title,
        credits: c.credits,
        semester: c.semester,
        studentCount: studentRegistrations.filter(r => r.subjectId.toString() === c._id.toString()).length,
        caStatus: 'Active',
        esaStatus: 'Pending Final Submission',
        attendanceStatus: 'Up to date'
      }))
    });
  } catch (error) {
    next(error);
  }
};

export const getLecturerCourses = async (req, res, next) => {
  try {
    const lecturer = await Lecturer.findOne({ userId: req.user._id }).populate('assignedCourses');
    if (!lecturer) return errorResponse(res, 'Lecturer not found', 404);

    return successResponse(res, lecturer.assignedCourses);
  } catch (error) {
    next(error);
  }
};

export const getCourseStudents = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const lecturer = await Lecturer.findOne({ userId: req.user._id });
    if (!lecturer) return errorResponse(res, 'Lecturer not found', 404);

    // Verify course ownership
    const isAssigned = lecturer.assignedCourses.some(id => id.toString() === courseId);
    if (!isAssigned && req.user.role !== 'admin') {
      return errorResponse(res, 'Forbidden: You are not assigned as the instructor for this course.', 403);
    }

    const course = await Subject.findById(courseId);
    if (!course) return errorResponse(res, 'Course not found', 404);

    const registrations = await SubjectRegistration.find({
      subjectId: courseId,
      status: 'REGISTERED'
    }).populate({
      path: 'studentId',
      populate: { path: 'userId', select: 'name email' }
    });

    const results = await Result.find({ subjectId: courseId });

    const students = registrations.map(reg => {
      const student = reg.studentId;
      const resRecord = results.find(r => r.studentId.toString() === student._id.toString());
      return {
        id: student._id,
        registrationNumber: student.registrationNumber,
        indexNumber: student.indexNumber,
        name: student.userId?.name || 'Student',
        email: student.userId?.email || '',
        degreeProgramme: student.degreeProgramme,
        caMark: resRecord?.caMark ?? 0,
        esaMark: resRecord?.esaMark ?? 0,
        finalMark: resRecord?.finalMark ?? 0,
        grade: resRecord?.grade ?? 'Pending',
        attendancePercentage: 88 // Populated or computed
      };
    });

    return successResponse(res, {
      course: {
        id: course._id,
        code: course.code,
        title: course.title,
        credits: course.credits,
        semester: course.semester
      },
      students
    });
  } catch (error) {
    next(error);
  }
};

export const saveAttendanceSession = async (req, res, next) => {
  try {
    const { subjectId, date, session, hours, topic, records } = req.body;
    const lecturer = await Lecturer.findOne({ userId: req.user._id });
    if (!lecturer) return errorResponse(res, 'Lecturer not found', 404);

    // Verify course assignment
    const isAssigned = lecturer.assignedCourses.some(id => id.toString() === subjectId);
    if (!isAssigned && req.user.role !== 'admin') {
      return errorResponse(res, 'You are not authorized to record attendance for this course.', 403);
    }

    const newAttendance = await Attendance.create({
      subjectId,
      lecturerId: lecturer._id,
      date: new Date(date),
      session: session || 'Theory',
      hours: Number(hours) || 2,
      topic: topic || '',
      records: records || []
    });

    return successResponse(res, newAttendance, 'Attendance marked successfully.');
  } catch (error) {
    next(error);
  }
};

export const updateCAMarks = async (req, res, next) => {
  try {
    const { courseId, marksList } = req.body;
    const lecturer = await Lecturer.findOne({ userId: req.user._id });
    if (!lecturer) return errorResponse(res, 'Lecturer not found', 404);

    const isAssigned = lecturer.assignedCourses.some(id => id.toString() === courseId);
    if (!isAssigned && req.user.role !== 'admin') {
      return errorResponse(res, 'Unauthorized to modify marks for this course.', 403);
    }

    const course = await Subject.findById(courseId);
    if (!course) return errorResponse(res, 'Subject not found', 404);

    for (const item of marksList) {
      const studentId = item.studentId;
      const caMark = Math.min(100, Math.max(0, Number(item.caMark) || 0));

      let result = await Result.findOne({ studentId, subjectId: courseId });
      if (result) {
        result.caMark = caMark;
        const total = (caMark * (course.caWeightage / 100)) + (result.esaMark * (course.esaWeightage / 100));
        result.finalMark = Math.round(total);
        const gradeInfo = calculateGradeFromMark(result.finalMark);
        result.grade = gradeInfo.grade;
        result.gradePoint = gradeInfo.gradePoint;
        result.qualityPoints = Number((course.credits * gradeInfo.gradePoint).toFixed(2));
        await result.save();
      } else {
        const gradeInfo = calculateGradeFromMark(caMark);
        await Result.create({
          studentId,
          subjectId: courseId,
          academicYear: '2025/2026',
          semester: course.semester,
          caMark,
          esaMark: 0,
          finalMark: Math.round(caMark * (course.caWeightage / 100)),
          grade: gradeInfo.grade,
          gradePoint: gradeInfo.gradePoint,
          qualityPoints: Number((course.credits * gradeInfo.gradePoint).toFixed(2))
        });
      }
    }

    return successResponse(res, {}, 'Continuous Assessment marks saved successfully.');
  } catch (error) {
    next(error);
  }
};

export const updateESAMarks = async (req, res, next) => {
  try {
    const { courseId, marksList } = req.body;
    const lecturer = await Lecturer.findOne({ userId: req.user._id });
    if (!lecturer) return errorResponse(res, 'Lecturer not found', 404);

    const isAssigned = lecturer.assignedCourses.some(id => id.toString() === courseId);
    if (!isAssigned && req.user.role !== 'admin') {
      return errorResponse(res, 'Unauthorized to modify marks for this course.', 403);
    }

    const course = await Subject.findById(courseId);
    if (!course) return errorResponse(res, 'Subject not found', 404);

    for (const item of marksList) {
      const studentId = item.studentId;
      const esaMark = Math.min(100, Math.max(0, Number(item.esaMark) || 0));

      let result = await Result.findOne({ studentId, subjectId: courseId });
      if (result) {
        result.esaMark = esaMark;
        const total = (result.caMark * (course.caWeightage / 100)) + (esaMark * (course.esaWeightage / 100));
        result.finalMark = Math.round(total);
        const gradeInfo = calculateGradeFromMark(result.finalMark);
        result.grade = gradeInfo.grade;
        result.gradePoint = gradeInfo.gradePoint;
        result.qualityPoints = Number((course.credits * gradeInfo.gradePoint).toFixed(2));
        await result.save();
      }
    }

    return successResponse(res, {}, 'End Semester Examination marks saved successfully.');
  } catch (error) {
    next(error);
  }
};
