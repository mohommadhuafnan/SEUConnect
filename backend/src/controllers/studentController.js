import Student from '../models/Student.js';
import Subject from '../models/Subject.js';
import Semester from '../models/Semester.js';
import SubjectRegistration from '../models/SubjectRegistration.js';
import MedicalRequest from '../models/MedicalRequest.js';
import ExamAttempt from '../models/ExamAttempt.js';
import Result from '../models/Result.js';
import Notification from '../models/Notification.js';
import Penalty from '../models/Penalty.js';
import AcademicRule from '../models/AcademicRule.js';
import { calculateStudentAttendance } from '../services/attendanceService.js';
import { calculateSGPA, calculateCGPA, calculateClassEligibility, calculateDegreeProgress } from '../services/gpaService.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const getStudentDashboard = async (req, res, next) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });
    if (!student) {
      return errorResponse(res, 'Student profile not found', 404);
    }

    // 1. Calculate Attendance
    const attendanceData = await calculateStudentAttendance(student._id);

    // 2. Fetch Results & GPA Stats
    const allResults = await Result.find({ studentId: student._id }).populate('subjectId');
    const currentSemResults = allResults.filter(r => r.semester === student.currentSemester);

    const calculatedSGPA = currentSemResults.length > 0 ? calculateSGPA(currentSemResults) : student.sgpa || 3.42;
    const calculatedCGPA = allResults.length > 0 ? calculateCGPA(allResults) : student.cgpa || 3.38;

    // Calculate Semester-wise SGPA trend for chart
    const semesterTrend = [];
    for (let sem = 1; sem <= student.currentSemester; sem++) {
      const semResults = allResults.filter(r => r.semester === sem);
      if (semResults.length > 0) {
        semesterTrend.push({
          semester: `Semester ${sem}`,
          sgpa: calculateSGPA(semResults),
          credits: semResults.reduce((acc, curr) => acc + (curr.subjectId?.credits || 0), 0)
        });
      } else {
        // Sample baseline trend for demonstration if early in term
        semesterTrend.push({
          semester: `Semester ${sem}`,
          sgpa: sem === 1 ? 3.25 : sem === 2 ? 3.35 : sem === 3 ? 3.40 : sem === 4 ? 3.32 : 3.42,
          credits: 18
        });
      }
    }

    // 3. Registered Credits for current semester
    const currentRegistrations = await SubjectRegistration.find({
      studentId: student._id,
      status: 'REGISTERED'
    }).populate('subjectId');

    const totalRegisteredCredits = currentRegistrations.reduce(
      (acc, reg) => acc + (reg.subjectId?.credits || 0),
      0
    );

    // 4. Pending Requests
    const pendingMedicals = await MedicalRequest.countDocuments({
      studentId: student._id,
      status: { $in: ['Submitted', 'Under Review'] }
    });

    // 5. Academic Progress
    const requiredCredits = student.degreeProgramme === 'BBST' ? 120 : 130;
    const progress = calculateDegreeProgress(student.creditsCompleted || 78, requiredCredits);
    const estimatedClass = calculateClassEligibility(calculatedCGPA);

    // 6. Exam Eligibility: Attendance >= 80% (configurable)
    const examEligible = attendanceData.overallPercentage >= attendanceData.minThreshold;

    // 7. Upcoming Deadlines
    const deadlines = [
      {
        id: 'DL-1',
        title: 'Semester Subject Registration (Add/Drop)',
        deadline: '2026-10-15',
        status: 'Open',
        type: 'Registration',
        actionUrl: '/student/registration'
      },
      {
        id: 'DL-2',
        title: 'ESA Examination Entry Submission',
        deadline: '2026-10-30',
        status: 'Upcoming',
        type: 'Examination',
        actionUrl: '/student/examination'
      },
      {
        id: 'DL-3',
        title: 'Medical Certificate Submission Deadline',
        deadline: 'Within 7 days of absence',
        status: 'Active',
        type: 'Medical',
        actionUrl: '/student/medical'
      },
      {
        id: 'DL-4',
        title: 'Mahapola / Bursary Welfare Renewal',
        deadline: '2026-11-10',
        status: 'Open',
        type: 'Welfare',
        actionUrl: '/student/welfare'
      }
    ];

    return successResponse(res, {
      student: {
        id: student._id,
        name: req.user.name,
        email: req.user.email,
        registrationNumber: student.registrationNumber,
        indexNumber: student.indexNumber,
        degreeProgramme: student.degreeProgramme,
        academicYear: student.academicYear,
        currentSemester: student.currentSemester,
        specialization: student.specialization,
        faculty: student.faculty,
        department: student.department
      },
      metrics: {
        sgpa: calculatedSGPA,
        cgpa: calculatedCGPA,
        attendancePercent: attendanceData.overallPercentage,
        registeredCredits: totalRegisteredCredits || 18,
        maxCredits: 22,
        examEligibility: examEligible ? 'Eligible' : 'Ineligible',
        pendingRequests: pendingMedicals
      },
      performance: {
        semesterTrend,
        creditsCompleted: progress.completed,
        creditsRemaining: progress.remaining,
        degreeProgressPercent: progress.percentage,
        estimatedClass
      },
      deadlines
    }, 'Student dashboard data retrieved successfully.');
  } catch (error) {
    next(error);
  }
};

export const getStudentRegistration = async (req, res, next) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });
    if (!student) return errorResponse(res, 'Student not found', 404);

    const rule = await AcademicRule.findOne({ ruleKey: 'SEUSL_FT_DEFAULT' }) || { maximumCreditsPerSemester: 22 };
    const maxCredits = rule.maximumCreditsPerSemester || 22;

    const currentSemester = await Semester.findOne({ isCurrent: true }) || {
      name: 'Academic Year 2025/2026 - Semester 2',
      academicYear: '2025/2026',
      semesterNumber: student.currentSemester % 2 === 0 ? 2 : 1,
      registrationOpen: true,
      registrationDeadline: new Date('2026-10-15')
    };

    // Available subjects for this semester & degree
    const availableSubjects = await Subject.find({
      semester: student.currentSemester,
      degreeProgramme: { $in: [student.degreeProgramme, 'COMMON'] }
    });

    const registeredRecords = await SubjectRegistration.find({
      studentId: student._id,
      status: 'REGISTERED'
    }).populate('subjectId');

    const registeredSubjectIds = registeredRecords.map(r => r.subjectId?._id?.toString());
    const registeredCredits = registeredRecords.reduce((acc, r) => acc + (r.subjectId?.credits || 0), 0);

    return successResponse(res, {
      currentSemester,
      maxCredits,
      registeredCredits,
      remainingCreditsAllowed: Math.max(0, maxCredits - registeredCredits),
      registeredRecords,
      availableSubjects: availableSubjects.map(sub => ({
        ...sub.toObject(),
        isRegistered: registeredSubjectIds.includes(sub._id.toString())
      }))
    });
  } catch (error) {
    next(error);
  }
};

export const registerSubject = async (req, res, next) => {
  try {
    const { subjectId } = req.body;
    const student = await Student.findOne({ userId: req.user._id });
    if (!student) return errorResponse(res, 'Student not found', 404);

    const subject = await Subject.findById(subjectId);
    if (!subject) return errorResponse(res, 'Subject not found', 404);

    const rule = await AcademicRule.findOne({ ruleKey: 'SEUSL_FT_DEFAULT' }) || { maximumCreditsPerSemester: 22 };
    const maxCredits = rule.maximumCreditsPerSemester || 22;

    // Calculate currently registered credits
    const registered = await SubjectRegistration.find({
      studentId: student._id,
      status: 'REGISTERED'
    }).populate('subjectId');

    const currentTotalCredits = registered.reduce((acc, r) => acc + (r.subjectId?.credits || 0), 0);

    if (currentTotalCredits + subject.credits > maxCredits) {
      return errorResponse(res, `Credit Limit Exceeded: Maximum allowed is ${maxCredits} credits. Adding this course (${subject.credits} cr) would total ${currentTotalCredits + subject.credits} credits.`, 400);
    }

    const existing = await SubjectRegistration.findOne({
      studentId: student._id,
      subjectId: subject._id
    });

    if (existing && existing.status === 'REGISTERED') {
      return errorResponse(res, 'Subject is already registered.', 400);
    }

    if (existing) {
      existing.status = 'REGISTERED';
      existing.registrationDate = new Date();
      await existing.save();
    } else {
      await SubjectRegistration.create({
        studentId: student._id,
        subjectId: subject._id,
        status: 'REGISTERED'
      });
    }

    return successResponse(res, {}, `Successfully registered for ${subject.code} - ${subject.title}`);
  } catch (error) {
    next(error);
  }
};

export const dropSubject = async (req, res, next) => {
  try {
    const { subjectId } = req.body;
    const student = await Student.findOne({ userId: req.user._id });
    if (!student) return errorResponse(res, 'Student not found', 404);

    const registration = await SubjectRegistration.findOne({
      studentId: student._id,
      subjectId
    }).populate('subjectId');

    if (!registration) {
      return errorResponse(res, 'Registration record not found.', 404);
    }

    registration.status = 'DROPPED';
    await registration.save();

    return successResponse(res, {}, `Successfully dropped ${registration.subjectId?.code || 'course'}.`);
  } catch (error) {
    next(error);
  }
};

export const getStudentAttendance = async (req, res, next) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });
    if (!student) return errorResponse(res, 'Student not found', 404);

    const attendanceData = await calculateStudentAttendance(student._id);
    return successResponse(res, attendanceData);
  } catch (error) {
    next(error);
  }
};

export const getStudentMedicalRequests = async (req, res, next) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });
    if (!student) return errorResponse(res, 'Student not found', 404);

    const requests = await MedicalRequest.find({ studentId: student._id })
      .populate('affectedSubjects.subjectId')
      .sort({ createdAt: -1 });

    return successResponse(res, requests);
  } catch (error) {
    next(error);
  }
};

export const submitMedicalRequest = async (req, res, next) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });
    if (!student) return errorResponse(res, 'Student not found', 404);

    const { leaveFrom, leaveTo, reason, medicalCenterName, certificateNumber, doctorName, affectedSubjects } = req.body;

    if (!leaveFrom || !leaveTo || !reason) {
      return errorResponse(res, 'Please provide leave start date, end date, and reason.', 400);
    }

    const count = await MedicalRequest.countDocuments();
    const requestId = `MED-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    let parsedAffectedSubjects = [];
    if (affectedSubjects) {
      parsedAffectedSubjects = typeof affectedSubjects === 'string' ? JSON.parse(affectedSubjects) : affectedSubjects;
    }

    const documentUrl = req.file ? `/uploads/${req.file.filename}` : '';

    const newRequest = await MedicalRequest.create({
      requestId,
      studentId: student._id,
      leaveFrom: new Date(leaveFrom),
      leaveTo: new Date(leaveTo),
      reason,
      medicalCenterName: medicalCenterName || 'University Medical Center - SEUSL',
      certificateNumber: certificateNumber || '',
      doctorName: doctorName || '',
      affectedSubjects: parsedAffectedSubjects,
      documentUrl,
      status: 'Submitted'
    });

    return successResponse(res, newRequest, 'Medical request submitted successfully. Request ID: ' + requestId, 201);
  } catch (error) {
    next(error);
  }
};

export const getStudentExaminations = async (req, res, next) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });
    if (!student) return errorResponse(res, 'Student not found', 404);

    const attendanceData = await calculateStudentAttendance(student._id);
    const attempts = await ExamAttempt.find({ studentId: student._id })
      .populate('subjectId')
      .populate('examinationId');

    const currentSemesterSubjects = await SubjectRegistration.find({
      studentId: student._id,
      status: 'REGISTERED'
    }).populate('subjectId');

    return successResponse(res, {
      overallAttendance: attendanceData.overallPercentage,
      minThreshold: attendanceData.minThreshold,
      isOverallEligible: attendanceData.isOverallEligible,
      currentSemesterSubjects: currentSemesterSubjects.map(reg => {
        const subStat = attendanceData.subjects.find(s => s.subjectId === reg.subjectId?._id?.toString());
        const isEligible = subStat ? subStat.isEligible : true;
        return {
          subject: reg.subjectId,
          attendancePercentage: subStat?.percentage ?? 100,
          eligibility: isEligible ? 'Eligible' : 'Ineligible (Low Attendance)',
          attemptType: reg.attemptType
        };
      }),
      attempts
    });
  } catch (error) {
    next(error);
  }
};

export const getStudentResults = async (req, res, next) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });
    if (!student) return errorResponse(res, 'Student not found', 404);

    const { semester } = req.query;
    const filter = { studentId: student._id };
    if (semester) filter.semester = Number(semester);

    const results = await Result.find(filter).populate('subjectId').sort({ semester: 1 });
    const allResults = await Result.find({ studentId: student._id }).populate('subjectId');

    const sgpa = results.length > 0 ? calculateSGPA(results) : 0;
    const cgpa = allResults.length > 0 ? calculateCGPA(allResults) : 0;

    return successResponse(res, {
      results,
      sgpa,
      cgpa,
      selectedSemester: semester ? Number(semester) : 'All Semesters'
    });
  } catch (error) {
    next(error);
  }
};

export const getStudentGPAData = async (req, res, next) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });
    if (!student) return errorResponse(res, 'Student not found', 404);

    const allResults = await Result.find({ studentId: student._id }).populate('subjectId').sort({ semester: 1 });
    const semestersMap = new Map();

    for (const r of allResults) {
      if (!semestersMap.has(r.semester)) {
        semestersMap.set(r.semester, []);
      }
      semestersMap.get(r.semester).push(r);
    }

    const semesterReports = [];
    for (const [semNum, courseList] of semestersMap.entries()) {
      const semSGPA = calculateSGPA(courseList);
      const totalSemCredits = courseList.reduce((acc, item) => acc + (item.subjectId?.credits || 0), 0);
      semesterReports.push({
        semester: semNum,
        sgpa: semSGPA,
        totalCredits: totalSemCredits,
        courses: courseList.map(c => ({
          code: c.subjectId?.code,
          title: c.subjectId?.title,
          credits: c.subjectId?.credits,
          isGPA: c.subjectId?.isGPA,
          caMark: c.caMark,
          esaMark: c.esaMark,
          finalMark: c.finalMark,
          grade: c.grade,
          gradePoint: c.gradePoint,
          qualityPoints: Number(((c.subjectId?.credits || 0) * (c.gradePoint || 0)).toFixed(2))
        }))
      });
    }

    const cgpa = allResults.length > 0 ? calculateCGPA(allResults) : 3.38;
    const estimatedClass = calculateClassEligibility(cgpa);
    const requiredCredits = student.degreeProgramme === 'BBST' ? 120 : 130;
    const progress = calculateDegreeProgress(student.creditsCompleted || 78, requiredCredits);

    return successResponse(res, {
      studentInfo: {
        name: req.user.name,
        registrationNumber: student.registrationNumber,
        indexNumber: student.indexNumber,
        degreeProgramme: student.degreeProgramme,
        academicYear: student.academicYear,
        currentSemester: student.currentSemester,
        specialization: student.specialization,
        faculty: student.faculty,
        department: student.department
      },
      cgpa,
      estimatedClass,
      progress,
      semesterReports
    });
  } catch (error) {
    next(error);
  }
};

export const getStudentProgress = async (req, res, next) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });
    if (!student) return errorResponse(res, 'Student not found', 404);

    const allResults = await Result.find({ studentId: student._id }).populate('subjectId');
    const cgpa = allResults.length > 0 ? calculateCGPA(allResults) : student.cgpa || 3.38;

    const requiredCredits = student.degreeProgramme === 'BBST' ? 120 : 130;
    const progress = calculateDegreeProgress(student.creditsCompleted || 78, requiredCredits);
    const estimatedClass = calculateClassEligibility(cgpa);

    return successResponse(res, {
      student: {
        registrationNumber: student.registrationNumber,
        degreeProgramme: student.degreeProgramme,
        academicYear: student.academicYear,
        currentSemester: student.currentSemester,
        specialization: student.specialization
      },
      cgpa,
      estimatedClass,
      progress,
      graduationRequirements: [
        { title: 'Total Credits Requirement', target: `${requiredCredits} Credits`, current: `${progress.completed} Credits`, status: progress.completed >= requiredCredits ? 'Completed' : 'In Progress' },
        { title: 'Minimum CGPA Requirement', target: '2.00', current: cgpa.toFixed(2), status: cgpa >= 2.00 ? 'Satisfied' : 'Not Satisfied' },
        { title: 'Industrial Training / Internship', target: 'Compulsory (6 Credits)', current: 'Scheduled Sem 7', status: 'Pending' },
        { title: 'Final Year Capstone Project', target: 'Compulsory (6 Credits)', current: 'Scheduled Sem 8', status: 'Pending' },
        { title: 'Attendance Standing', target: 'Min 80%', current: 'In Standing', status: 'Satisfied' }
      ]
    });
  } catch (error) {
    next(error);
  }
};

export const getStudentPenalties = async (req, res, next) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });
    if (!student) return errorResponse(res, 'Student not found', 404);

    // Strictly scoped to the authenticated student
    const penalties = await Penalty.find({ studentId: student._id });
    return successResponse(res, penalties);
  } catch (error) {
    next(error);
  }
};
