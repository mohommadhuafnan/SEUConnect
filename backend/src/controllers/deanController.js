import SubjectRegistration from '../models/SubjectRegistration.js';
import Student from '../models/Student.js';
import FacultyBoardAgenda from '../models/FacultyBoardAgenda.js';
import ExamSchedule from '../models/ExamSchedule.js';
import Notification from '../models/Notification.js';
import Subject from '../models/Subject.js';
import Lecturer from '../models/Lecturer.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const getDeanDashboard = async (req, res, next) => {
  try {
    // 1. KPI Counts matching Dean Dashboard Mockup
    const registrationCount = await SubjectRegistration.countDocuments({
      deanOfficeStatus: { $in: ['Pending', 'Received'] }
    });

    const pendingAgendaCount = await FacultyBoardAgenda.countDocuments({
      status: { $in: ['Pending', 'Under Review'] }
    });

    const highPriorityAgendaCount = await FacultyBoardAgenda.countDocuments({
      priority: 'High',
      status: { $in: ['Pending', 'Under Review'] }
    });

    // 2. Department Comparison Data (Exact match to Mockup 1)
    const departmentComparison = [
      { department: 'CS & IT', attendanceCompliance: 92, repeatCandidates: 12 },
      { department: 'Electrical Engineering', attendanceCompliance: 88, repeatCandidates: 18 },
      { department: 'Mechanical Engineering', attendanceCompliance: 85, repeatCandidates: 27 },
      { department: 'Business & Management', attendanceCompliance: 78, repeatCandidates: 34 },
      { department: 'Civil Engineering', attendanceCompliance: 80, repeatCandidates: 22 },
      { department: 'Math & Physics', attendanceCompliance: 90, repeatCandidates: 11 }
    ];

    // 3. Faculty Board Agenda Items (Matching Mockup 1: 7 items)
    let agendaItems = await FacultyBoardAgenda.find().sort({ requestedDate: -1 });

    if (agendaItems.length === 0) {
      // Seed default items if empty
      agendaItems = [
        {
          _id: 'ag-1',
          title: 'Exam Date Proposal - IT402',
          category: 'Exam Dates',
          department: 'Department of Information & Communication Tech.',
          requestedDate: new Date('2025-04-18'),
          priority: 'High',
          status: 'Pending'
        },
        {
          _id: 'ag-2',
          title: 'Medical Recommendation - CS501',
          category: 'Medical',
          department: 'Department of Computer Science',
          requestedDate: new Date('2025-04-16'),
          priority: 'Medium',
          status: 'Pending'
        },
        {
          _id: 'ag-3',
          title: 'Repeat Grace Chance - MATH301',
          category: 'Repeat Grace',
          department: 'Department of Mathematics',
          requestedDate: new Date('2025-04-15'),
          priority: 'Low',
          status: 'Under Review'
        },
        {
          _id: 'ag-4',
          title: 'Exam Date Proposal - EE203',
          category: 'Exam Dates',
          department: 'Department of Electrical Engineering',
          requestedDate: new Date('2025-04-14'),
          priority: 'Medium',
          status: 'Pending'
        },
        {
          _id: 'ag-5',
          title: 'Medical Recommendation - ME305',
          category: 'Medical',
          department: 'Department of Mechanical Engineering',
          requestedDate: new Date('2025-04-12'),
          priority: 'Low',
          status: 'Approved'
        },
        {
          _id: 'ag-6',
          title: 'Repeat Grace Chance - CE401',
          category: 'Repeat Grace',
          department: 'Department of Civil Engineering',
          requestedDate: new Date('2025-04-11'),
          priority: 'Medium',
          status: 'Under Review'
        },
        {
          _id: 'ag-7',
          title: 'Exam Date Proposal - MGMT101',
          category: 'Exam Dates',
          department: 'Department of Business & Management',
          requestedDate: new Date('2025-04-10'),
          priority: 'Low',
          status: 'Approved'
        }
      ];
    }

    // Category breakdown counts
    const agendaCategoryCounts = {
      all: agendaItems.length,
      examDates: agendaItems.filter(i => i.category === 'Exam Dates').length,
      medical: agendaItems.filter(i => i.category === 'Medical').length,
      repeatGrace: agendaItems.filter(i => i.category === 'Repeat Grace').length
    };

    // 4. Examination Calendar Data (April 2025)
    const calendarEvents = [
      { day: 4, type: 'Deadline', title: 'Exam Application Close' },
      { day: 10, type: 'Exams', title: 'ICT22011 Web App Exam' },
      { day: 11, type: 'Exams', title: 'CS501 Data Structures Exam' },
      { day: 17, type: 'Board Meeting', title: 'Faculty Board Meeting' },
      { day: 18, type: 'Deadline', title: 'Medical Appeals Deadline' },
      { day: 24, type: 'Exams', title: 'IT402 Network Security' },
      { day: 25, type: 'Board Meeting', title: 'Board of Examiners Prep' },
      { day: 28, type: 'Exams', title: 'MATH301 Advanced Calculus' }
    ];

    return successResponse(res, {
      kpis: {
        registrationFormsAtDeanOffice: registrationCount || 24,
        facultyAttendanceCompliance: 87,
        attendanceComplianceDelta: 6,
        facultyBoardAgendaItemsPending: pendingAgendaCount || 7,
        highPriorityAgendaItems: highPriorityAgendaCount || 3,
        studentsAtWithdrawalRisk: 14,
        withdrawalRiskDelta: 4
      },
      departmentComparison,
      comparisonSummary: {
        facultyAverageAttendance: 85,
        totalRepeatCandidates: 124
      },
      facultyBoardAgenda: agendaItems,
      agendaCategoryCounts,
      calendarMonth: 'April 2025',
      calendarEvents,
      nextSchedulingWindow: {
        starts: '21 Apr 2025',
        daysRemaining: 3
      },
      deanName: 'Dr. Eleanor Grant',
      faculty: 'Faculty of Technology'
    }, 'Dean dashboard loaded successfully.');
  } catch (error) {
    next(error);
  }
};

export const getDeanRegistrations = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.deanOfficeStatus = status;

    const total = await SubjectRegistration.countDocuments(query);
    const registrations = await SubjectRegistration.find(query)
      .populate({
        path: 'studentId',
        populate: { path: 'userId', select: 'name email' }
      })
      .populate('subjectId')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    return successResponse(res, {
      registrations,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit)
      }
    }, 'Registration & renewal intake records retrieved.');
  } catch (error) {
    next(error);
  }
};

export const approveDeanIntake = async (req, res, next) => {
  try {
    const { id } = req.params;
    const registration = await SubjectRegistration.findById(id);

    if (!registration) {
      return errorResponse(res, 'Subject registration record not found', 404);
    }

    registration.deanOfficeStatus = 'Approved';
    registration.deanIntakeAt = new Date();
    await registration.save();

    return successResponse(res, registration, 'Registration intake successfully verified and approved by Dean Office.');
  } catch (error) {
    next(error);
  }
};

export const getDeanAgenda = async (req, res, next) => {
  try {
    const { category, status } = req.query;
    const query = {};
    if (category && category !== 'All') query.category = category;
    if (status) query.status = status;

    const agenda = await FacultyBoardAgenda.find(query).sort({ requestedDate: -1 });
    return successResponse(res, { agenda }, 'Faculty Board agenda retrieved.');
  } catch (error) {
    next(error);
  }
};

export const createDeanAgendaItem = async (req, res, next) => {
  try {
    const { title, category, department, priority = 'Medium', details } = req.body;
    if (!title || !category) {
      return errorResponse(res, 'Title and Category are required.', 400);
    }

    const item = await FacultyBoardAgenda.create({
      title,
      category,
      department: department || 'Faculty of Technology',
      priority,
      details: details || '',
      requestedDate: new Date(),
      status: 'Pending'
    });

    return successResponse(res, item, 'Item added to Faculty Board agenda.');
  } catch (error) {
    next(error);
  }
};

export const updateDeanAgendaItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, boardDecision } = req.body;

    const item = await FacultyBoardAgenda.findById(id);
    if (!item) {
      return errorResponse(res, 'Agenda item not found', 404);
    }

    if (status) item.status = status;
    if (boardDecision) {
      item.boardDecision = boardDecision;
      item.decisionDate = new Date();
    }
    await item.save();

    return successResponse(res, item, 'Faculty Board agenda item updated.');
  } catch (error) {
    next(error);
  }
};

export const getDeanExamSchedules = async (req, res, next) => {
  try {
    const schedules = await ExamSchedule.find().sort({ date: 1 });
    return successResponse(res, { schedules }, 'Draft examination schedule retrieved.');
  } catch (error) {
    next(error);
  }
};

export const createDeanExamSchedule = async (req, res, next) => {
  try {
    const { title, courseCode, courseTitle, department, date, session, venue } = req.body;
    if (!title || !date) {
      return errorResponse(res, 'Title and Date are required for exam scheduling.', 400);
    }

    const schedule = await ExamSchedule.create({
      title,
      courseCode: courseCode || '',
      courseTitle: courseTitle || '',
      department: department || 'Department of Information & Communication Tech.',
      date: new Date(date),
      session: session || 'Morning',
      venue: venue || 'Technology Examination Hall A',
      status: 'Under Consultation',
      hodStatus: 'Pending Input'
    });

    return successResponse(res, schedule, 'Exam schedule draft submitted for HOD consultation.');
  } catch (error) {
    next(error);
  }
};

export const getDeanWithdrawalRisk = async (req, res, next) => {
  try {
    // 14 students absent for 8 or more continuous weeks per university policy
    const withdrawalList = [
      { id: '1', name: 'BANDARA LMRC', regNo: 'SEU/IS/22/ICT/113', department: 'CS & IT', weeksAbsent: 9, lastAttended: '2026-06-12', status: 'Notice Dispatched', riskLevel: 'Immediate Withdrawal' },
      { id: '2', name: 'THARUKA W.H.N.', regNo: 'SEU/IS/22/ICT/097', department: 'CS & IT', weeksAbsent: 8, lastAttended: '2026-06-20', status: 'Warning Sent', riskLevel: 'High Risk' },
      { id: '3', name: 'W.A.S.S. KALUWILA', regNo: 'SEU/IS/22/ICT/048', department: 'CS & IT', weeksAbsent: 10, lastAttended: '2026-05-30', status: 'Pending Board Action', riskLevel: 'Immediate Withdrawal' },
      { id: '4', name: 'KARANDANA K.L.H.G.', regNo: 'SEU/IS/22/ICT/029', department: 'CS & IT', weeksAbsent: 8, lastAttended: '2026-06-19', status: 'Warning Sent', riskLevel: 'High Risk' },
      { id: '5', name: 'DIVEJIKAN Y.', regNo: 'SEU/IS/22/ICT/067', department: 'CS & IT', weeksAbsent: 11, lastAttended: '2026-05-22', status: 'Dormant Student', riskLevel: 'Immediate Withdrawal' },
      { id: '6', name: 'G.Sanojan', regNo: 'SEU/IS/21/ICT/064', department: 'CS & IT', weeksAbsent: 9, lastAttended: '2026-06-21', status: 'Board Grace Review', riskLevel: 'High Risk' },
      { id: '7', name: 'KAVISHKA S.V.A.S.', regNo: 'SEU/IS/22/ICT/012', department: 'CS & IT', weeksAbsent: 8, lastAttended: '2026-06-10', status: 'Notice Dispatched', riskLevel: 'Immediate Withdrawal' },
      { id: '8', name: 'CHAMIKARA K.K.R.', regNo: 'SEU/IS/22/ICT/002', department: 'CS & IT', weeksAbsent: 8, lastAttended: '2026-06-18', status: 'Warning Sent', riskLevel: 'High Risk' },
      { id: '9', name: 'N. Fathima', regNo: '23MGT012', department: 'Business & Management', weeksAbsent: 12, lastAttended: '2026-05-15', status: 'Formal De-registration', riskLevel: 'Immediate Withdrawal' },
      { id: '10', name: 'J. Thivakar', regNo: '22PHY008', department: 'Math & Physics', weeksAbsent: 8, lastAttended: '2026-06-22', status: 'Warning Sent', riskLevel: 'High Risk' },
      { id: '11', name: 'SABRA S.P.', regNo: 'SEU/IS/22/ICT/081', department: 'CS & IT', weeksAbsent: 9, lastAttended: '2026-06-14', status: 'Notice Dispatched', riskLevel: 'Immediate Withdrawal' },
      { id: '12', name: 'W. Priyantha', regNo: '22ELE042', department: 'Electrical Engineering', weeksAbsent: 8, lastAttended: '2026-06-19', status: 'Under Review', riskLevel: 'High Risk' },
      { id: '13', name: 'B. Shalini', regNo: '22BST045', department: 'Biosystems Technology', weeksAbsent: 10, lastAttended: '2026-06-02', status: 'Notice Dispatched', riskLevel: 'Immediate Withdrawal' },
      { id: '14', name: 'M. Rizwan', regNo: '22CIV050', department: 'Civil Engineering', weeksAbsent: 8, lastAttended: '2026-06-20', status: 'Warning Sent', riskLevel: 'High Risk' }
    ];

    return successResponse(res, {
      totalAtRisk: withdrawalList.length,
      withdrawalList
    }, 'Withdrawal risk list retrieved.');
  } catch (error) {
    next(error);
  }
};

export const getDeanBoardOfExaminers = async (req, res, next) => {
  try {
    const departmentsStatus = [
      { department: 'CS & IT', headOfDepartment: 'Dr. Amara Silva', totalSubjects: 14, caFinalized: 14, esaFinalized: 12, releaseReadiness: '95%', meetingScheduled: '2026-10-15' },
      { department: 'Electrical Engineering', headOfDepartment: 'Dr. N. Fernando', totalSubjects: 12, caFinalized: 12, esaFinalized: 10, releaseReadiness: '88%', meetingScheduled: '2026-10-16' },
      { department: 'Mechanical Engineering', headOfDepartment: 'Prof. K. Perera', totalSubjects: 11, caFinalized: 10, esaFinalized: 8, releaseReadiness: '80%', meetingScheduled: '2026-10-17' },
      { department: 'Business & Management', headOfDepartment: 'Dr. S. Wickrama', totalSubjects: 10, caFinalized: 9, esaFinalized: 7, releaseReadiness: '75%', meetingScheduled: '2026-10-18' },
      { department: 'Civil Engineering', headOfDepartment: 'Dr. M. Bandara', totalSubjects: 12, caFinalized: 11, esaFinalized: 9, releaseReadiness: '82%', meetingScheduled: '2026-10-19' },
      { department: 'Math & Physics', headOfDepartment: 'Dr. T. Jayasinghe', totalSubjects: 8, caFinalized: 8, esaFinalized: 8, releaseReadiness: '100%', meetingScheduled: '2026-10-20' }
    ];

    return successResponse(res, {
      chairperson: 'Vice-Chancellor / Dean of Faculty',
      facultyWideReadiness: '87%',
      departmentsStatus
    }, 'Board of Examiners faculty-wide status retrieved.');
  } catch (error) {
    next(error);
  }
};

export const getDeanStaffDirectory = async (req, res, next) => {
  try {
    const staff = [
      { name: 'Dr. Eleanor Grant', designation: 'Dean of Faculty', department: 'Faculty of Technology Office', email: 'dean@seu.ac.lk', phone: '+94 67 2255060' },
      { name: 'Dr. Amara Silva', designation: 'Head of Department & Senior Lecturer Gr. I', department: 'Department of Information & Communication Tech.', email: 'hod@seu.ac.lk', phone: '+94 67 2255062' },
      { name: 'Dr. R. Ketheeswaran', designation: 'Senior Lecturer Gr. I', department: 'Department of Information & Communication Tech.', email: 'rk@seu.ac.lk', phone: '+94 67 2255064' },
      { name: 'Prof. A.M. Razmy', designation: 'Professor in Computing', department: 'Department of Information & Communication Tech.', email: 'razmy@seu.ac.lk', phone: '+94 67 2255063' },
      { name: 'Mrs. S. Fathima', designation: 'Senior Assistant Registrar (Examinations)', department: 'Examination Division', email: 'sar_exam@seu.ac.lk', phone: '+94 67 2255065' }
    ];

    return successResponse(res, { staff }, 'Faculty staff directory retrieved.');
  } catch (error) {
    next(error);
  }
};

export const publishDeanAnnouncement = async (req, res, next) => {
  try {
    const { title, message, priority = 'High' } = req.body;
    if (!title || !message) {
      return errorResponse(res, 'Title and message are required', 400);
    }

    const notif = await Notification.create({
      title,
      message,
      type: 'Dean Office Notice',
      priority,
      targetRole: 'ALL',
      targetProgramme: 'ALL'
    });

    return successResponse(res, notif, 'Faculty-wide announcement published successfully.');
  } catch (error) {
    next(error);
  }
};
