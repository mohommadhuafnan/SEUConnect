import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { ENV } from '../config/env.js';

import User from '../models/User.js';
import Student from '../models/Student.js';
import Lecturer from '../models/Lecturer.js';
import Subject from '../models/Subject.js';
import Semester from '../models/Semester.js';
import SubjectRegistration from '../models/SubjectRegistration.js';
import Attendance from '../models/Attendance.js';
import MedicalRequest from '../models/MedicalRequest.js';
import Examination from '../models/Examination.js';
import ExamAttempt from '../models/ExamAttempt.js';
import Result from '../models/Result.js';
import AcademicRule from '../models/AcademicRule.js';
import Process from '../models/Process.js';
import FormDocument from '../models/FormDocument.js';
import Welfare from '../models/Welfare.js';
import Society from '../models/Society.js';
import Membership from '../models/Membership.js';
import Notification from '../models/Notification.js';
import Penalty from '../models/Penalty.js';
import FacultyBoardAgenda from '../models/FacultyBoardAgenda.js';
import ExamSchedule from '../models/ExamSchedule.js';
import { STUDENTS_DATA, formatStudentInfo } from './studentsData.js';

export const runSeed = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.log('[Seeding]: Connecting to database...');
      try {
        await mongoose.connect(ENV.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
      } catch (e) {
        console.warn(`[Seeding Warning]: Primary connection failed (${e.message}). Falling back to local MongoDB...`);
        await mongoose.connect('mongodb://127.0.0.1:27017/seuconnect', { serverSelectionTimeoutMS: 5000 });
      }
    }
    console.log('[Seeding]: Purging old collections...');

    await Promise.all([
      User.deleteMany({}),
      Student.deleteMany({}),
      Lecturer.deleteMany({}),
      Subject.deleteMany({}),
      Semester.deleteMany({}),
      SubjectRegistration.deleteMany({}),
      Attendance.deleteMany({}),
      MedicalRequest.deleteMany({}),
      Examination.deleteMany({}),
      ExamAttempt.deleteMany({}),
      Result.deleteMany({}),
      AcademicRule.deleteMany({}),
      Process.deleteMany({}),
      FormDocument.deleteMany({}),
      Welfare.deleteMany({}),
      Society.deleteMany({}),
      Membership.deleteMany({}),
      Notification.deleteMany({}),
      Penalty.deleteMany({}),
      FacultyBoardAgenda.deleteMany({}),
      ExamSchedule.deleteMany({})
    ]);

    const salt = await bcrypt.genSalt(10);
    const defaultPassword = await bcrypt.hash('password123', salt);

    console.log('[Seeding]: Creating Academic Rules...');
    await AcademicRule.create({
      ruleKey: 'SEUSL_FT_DEFAULT',
      attendanceMinimumPercent: 80,
      maximumCreditsPerSemester: 22,
      bictGraduationCredits: 130,
      bbstGraduationCredits: 120,
      gradeScale: [
        { grade: 'A+', minMark: 85, maxMark: 100, gradePoint: 4.00, passStatus: 'Pass' },
        { grade: 'A',  minMark: 80, maxMark: 84,  gradePoint: 4.00, passStatus: 'Pass' },
        { grade: 'A-', minMark: 75, maxMark: 79,  gradePoint: 3.70, passStatus: 'Pass' },
        { grade: 'B+', minMark: 70, maxMark: 74,  gradePoint: 3.30, passStatus: 'Pass' },
        { grade: 'B',  minMark: 65, maxMark: 69,  gradePoint: 3.00, passStatus: 'Pass' },
        { grade: 'B-', minMark: 60, maxMark: 64,  gradePoint: 2.70, passStatus: 'Pass' },
        { grade: 'C+', minMark: 55, maxMark: 59,  gradePoint: 2.30, passStatus: 'Pass' },
        { grade: 'C',  minMark: 50, maxMark: 54,  gradePoint: 2.00, passStatus: 'Pass' },
        { grade: 'C-', minMark: 45, maxMark: 49,  gradePoint: 1.70, passStatus: 'Conditional' },
        { grade: 'D',  minMark: 40, maxMark: 44,  gradePoint: 1.00, passStatus: 'Conditional' },
        { grade: 'E',  minMark: 0,  maxMark: 39,  gradePoint: 0.00, passStatus: 'Fail' }
      ],
      classRequirements: [
        { classTitle: 'First Class', minCGPA: 3.70, maxRepeatsAllowed: 0 },
        { classTitle: 'Second Class (Upper Division)', minCGPA: 3.30, maxRepeatsAllowed: 2 },
        { classTitle: 'Second Class (Lower Division)', minCGPA: 3.00, maxRepeatsAllowed: 4 },
        { classTitle: 'Pass', minCGPA: 2.00, maxRepeatsAllowed: 10 }
      ]
    });

    console.log('[Seeding]: Creating Semesters...');
    const semCurrent = await Semester.create({
      academicYear: '2025/2026',
      semesterNumber: 1,
      name: 'Academic Year 2025/2026 - Semester 1',
      isCurrent: true,
      registrationOpen: true,
      registrationDeadline: new Date('2026-10-31'),
      examRegistrationOpen: true,
      examRegistrationDeadline: new Date('2026-11-15'),
      startDate: new Date('2026-08-01'),
      endDate: new Date('2026-12-20')
    });

    console.log('[Seeding]: Creating Lecturers...');
    const userLecturer1 = await User.create({
      name: 'Dr. R. Ketheeswaran',
      email: 'rk@seu.ac.lk',
      passwordHash: defaultPassword,
      role: 'lecturer',
      status: 'active',
      phone: '+94 67 2255062',
      address: 'Staff Quarters, SEUSL, Oluvil'
    });

    const lecturer1 = await Lecturer.create({
      userId: userLecturer1._id,
      staffId: 'LEC-FT-001',
      designation: 'Senior Lecturer Gr. I & Head of Department',
      faculty: 'Faculty of Technology',
      department: 'Department of Information and Communication Technology',
      specialization: 'Software Architecture & Information Systems',
      officeLocation: 'Technology Building, Room 201'
    });

    const userLecturer2 = await User.create({
      name: 'Prof. A.M. Razmy',
      email: 'razmy@seu.ac.lk',
      passwordHash: defaultPassword,
      role: 'lecturer',
      status: 'active',
      phone: '+94 67 2255063',
      address: 'Staff Quarters, Oluvil'
    });

    const lecturer2 = await Lecturer.create({
      userId: userLecturer2._id,
      staffId: 'LEC-FT-002',
      designation: 'Professor in Computing',
      faculty: 'Faculty of Technology',
      department: 'Department of Information and Communication Technology',
      specialization: 'Artificial Intelligence & Data Analytics'
    });

    console.log('[Seeding]: Creating Admin...');
    await User.create({
      name: 'Faculty Systems Administrator',
      email: 'admin@seu.ac.lk',
      passwordHash: defaultPassword,
      role: 'admin',
      status: 'active',
      permissions: ['all', 'manage_users', 'manage_forms', 'manage_processes', 'approve_medicals', 'edit_rules'],
      phone: '+94 67 2255060',
      address: 'Dean Office, Faculty of Technology, SEUSL'
    });

    console.log('[Seeding]: Creating Dean of Faculty (Dr. Eleanor Grant)...');
    const userDean = await User.create({
      name: 'Dr. Eleanor Grant',
      email: 'dean@seu.ac.lk',
      passwordHash: defaultPassword,
      role: 'dean',
      status: 'active',
      permissions: ['all', 'faculty_dean', 'chair_faculty_board', 'manage_departments', 'approve_intakes'],
      phone: '+94 67 2255060',
      address: 'Dean Office, Faculty of Technology, SEUSL'
    });

    console.log('[Seeding]: Creating HOD of ICT (Dr. Amara Silva)...');
    const userHod = await User.create({
      name: 'Dr. Amara Silva',
      email: 'hod@seu.ac.lk',
      passwordHash: defaultPassword,
      role: 'hod',
      status: 'active',
      permissions: ['all', 'manage_department', 'sign_registrations', 'escalate_faculty_board'],
      phone: '+94 67 2255062',
      address: 'Department of ICT, Faculty of Technology, SEUSL'
    });

    const lecturerHod = await Lecturer.create({
      userId: userHod._id,
      staffId: 'HOD-FT-001',
      designation: 'Senior Lecturer Gr. I & Head of Department',
      faculty: 'Faculty of Technology',
      department: 'Department of Information and Communication Technology',
      specialization: 'Information Systems & Cloud Architecture',
      officeLocation: 'Technology Building, Room 202'
    });

    console.log('[Seeding]: Creating Subjects...');
    const subjects = await Subject.insertMany([
      // Year 1
      { code: 'ICT11012', title: 'Foundation of Information Technology', credits: 2, semester: 1, degreeProgramme: 'BICT', theoryHours: 30, practicalHours: 0, isGPA: true, lecturerInCharge: lecturer1._id },
      { code: 'ICT11023', title: 'Structured Programming Fundamentals', credits: 3, semester: 1, degreeProgramme: 'BICT', theoryHours: 30, practicalHours: 30, isGPA: true, lecturerInCharge: lecturer1._id },
      { code: 'ICT12013', title: 'Object Oriented Programming', credits: 3, semester: 2, degreeProgramme: 'BICT', theoryHours: 30, practicalHours: 30, isGPA: true, lecturerInCharge: lecturer1._id },
      { code: 'ICT12023', title: 'Mathematics for Computing', credits: 3, semester: 2, degreeProgramme: 'BICT', theoryHours: 45, practicalHours: 0, isGPA: true, lecturerInCharge: lecturer2._id },
      // Year 2
      { code: 'ICT21013', title: 'Data Structures and Algorithms', credits: 3, semester: 3, degreeProgramme: 'BICT', theoryHours: 30, practicalHours: 30, isGPA: true, lecturerInCharge: lecturer2._id },
      { code: 'ICT21023', title: 'Database Management Systems', credits: 3, semester: 3, degreeProgramme: 'BICT', theoryHours: 30, practicalHours: 30, isGPA: true, lecturerInCharge: lecturer1._id },
      { code: 'ICT21032', title: 'Computer Organization & Architecture', credits: 2, semester: 3, degreeProgramme: 'BICT', theoryHours: 30, practicalHours: 0, isGPA: true, lecturerInCharge: lecturer2._id },
      { code: 'ICT22013', title: 'Software Engineering & Design', credits: 3, semester: 4, degreeProgramme: 'BICT', theoryHours: 30, practicalHours: 30, isGPA: true, lecturerInCharge: lecturer1._id },
      { code: 'ICT22023', title: 'Operating Systems & System Admin', credits: 3, semester: 4, degreeProgramme: 'BICT', theoryHours: 30, practicalHours: 30, isGPA: true, lecturerInCharge: lecturer2._id },
      // Year 3 (Current Semester 5 for primary student)
      { code: 'ICT22011', title: 'Web Application Development', credits: 3, semester: 5, degreeProgramme: 'BICT', theoryHours: 30, practicalHours: 30, isGPA: true, lecturerInCharge: lecturer1._id },
      { code: 'ICT22043', title: 'Mobile Application Development', credits: 3, semester: 5, degreeProgramme: 'BICT', theoryHours: 30, practicalHours: 30, isGPA: true, lecturerInCharge: lecturer1._id },
      { code: 'ICT31013', title: 'Computer Networks & Security', credits: 3, semester: 5, degreeProgramme: 'BICT', theoryHours: 30, practicalHours: 30, isGPA: true, lecturerInCharge: lecturer2._id },
      { code: 'ICT31023', title: 'Enterprise Architecture & Cloud Systems', credits: 3, semester: 5, degreeProgramme: 'BICT', theoryHours: 30, practicalHours: 30, isGPA: true, lecturerInCharge: lecturer1._id },
      { code: 'ICT31032', title: 'Advanced Database Systems', credits: 3, semester: 5, degreeProgramme: 'BICT', theoryHours: 30, practicalHours: 30, isGPA: true, lecturerInCharge: lecturer1._id },
      { code: 'ICT31043', title: 'Human Computer Interaction (HCI)', credits: 3, semester: 5, degreeProgramme: 'BICT', theoryHours: 30, practicalHours: 15, isGPA: true, lecturerInCharge: lecturer2._id }
    ]);

    // Assign courses to Dr. R. Ketheeswaran
    lecturer1.assignedCourses = [subjects[9]._id, subjects[10]._id, subjects[12]._id, subjects[13]._id];
    await lecturer1.save();

    console.log('[Seeding]: Creating All 113 Official Faculty Students...');
    const studentDocs = [];
    const studentDocMap = new Map(); // sn -> student doc

    for (const raw of STUDENTS_DATA) {
      const info = formatStudentInfo(raw);
      const isPrimaryAfnan = raw.sn === 84;
      const isRepeatCandidate = raw.sn === 113;

      const user = await User.create({
        name: isPrimaryAfnan ? 'M.N.M. Afnan' : info.name,
        email: info.email,
        passwordHash: defaultPassword,
        role: 'student',
        status: 'active',
        phone: isPrimaryAfnan ? '+94 77 1234567' : `+94 77 ${String(1000000 + raw.sn).slice(1)}`,
        address: isPrimaryAfnan ? 'Technology Hostel, Faculty of Technology, SEUSL' : 'Faculty of Technology Hostel, SEUSL'
      });

      const student = await Student.create({
        userId: user._id,
        registrationNumber: info.regNo,
        indexNumber: info.indexNumber,
        degreeProgramme: 'BICT',
        academicYear: '2025/2026',
        currentSemester: info.semester,
        specialization: 'Software Systems',
        faculty: 'Faculty of Technology',
        department: 'Department of Information and Communication Technology',
        sgpa: isPrimaryAfnan ? 3.42 : isRepeatCandidate ? 2.15 : Number((3.10 + ((raw.sn % 15) * 0.05)).toFixed(2)),
        cgpa: isPrimaryAfnan ? 3.38 : isRepeatCandidate ? 2.10 : Number((3.05 + ((raw.sn % 15) * 0.05)).toFixed(2)),
        creditsCompleted: isPrimaryAfnan ? 78 : isRepeatCandidate ? 95 : 75,
        creditsRegistered: 18,
        degreeCreditsRequired: 130,
        examEligibility: (raw.sn === 112) ? 'Ineligible' : 'Eligible',
        currentClass: isPrimaryAfnan ? 'Second Class (Upper Division)' : 'General Degree'
      });

      studentDocMap.set(raw.sn, student);
      studentDocs.push(student);
    }

    const student1 = studentDocMap.get(84); // M.N.M. Afnan (SEU/IS/22/ICT/085)

    console.log('[Seeding]: Registering Semester 5 Courses for All Students & Pipelines...');
    const sem5Courses = [subjects[9], subjects[10], subjects[11], subjects[12], subjects[13], subjects[14]];

    // 1. For Afnan (sn: 84) - all 6 courses registered
    for (const sub of sem5Courses) {
      await SubjectRegistration.create({
        studentId: student1._id,
        subjectId: sub._id,
        semesterId: semCurrent._id,
        academicYear: '2025/2026',
        status: 'REGISTERED',
        teacherSignature: 'Signed',
        hodSignature: 'Signed',
        deanOfficeStatus: 'Approved',
        renewalPaymentStatus: 'Paid'
      });
    }

    // 2. For remaining students
    for (const raw of STUDENTS_DATA) {
      if (raw.sn === 84) continue;
      const st = studentDocMap.get(raw.sn);

      if (raw.sn === 113) {
        // Repeat candidate G.Sanojan - registers for repeat course ICT21013
        await SubjectRegistration.create({
          studentId: st._id,
          subjectId: subjects[4]._id, // ICT21013 Data Structures
          semesterId: semCurrent._id,
          academicYear: '2025/2026',
          status: 'REGISTERED',
          teacherSignature: 'Signed',
          hodSignature: 'Signed',
          deanOfficeStatus: 'Approved',
          renewalPaymentStatus: 'Paid',
          paymentVoucherRef: 'PIV-2026-REPEAT-064'
        });
        continue;
      }

      // For students sn 1 to 12 (HOD sign-off queue): 1 course is PENDING_APPROVAL with HOD signature Pending
      if (raw.sn >= 1 && raw.sn <= 12) {
        const queueCourseIndex = (raw.sn - 1) % sem5Courses.length;
        for (let cIdx = 0; cIdx < sem5Courses.length; cIdx++) {
          const sub = sem5Courses[cIdx];
          const isQueueCourse = cIdx === queueCourseIndex;
          await SubjectRegistration.create({
            studentId: st._id,
            subjectId: sub._id,
            semesterId: semCurrent._id,
            academicYear: '2025/2026',
            status: isQueueCourse ? 'PENDING_APPROVAL' : 'REGISTERED',
            teacherSignature: isQueueCourse ? (raw.sn % 2 === 0 ? 'Signed' : 'Missing') : 'Signed',
            teacherSignedAt: isQueueCourse && raw.sn % 2 === 0 ? new Date(Date.now() - 2 * 24 * 3600 * 1000) : null,
            hodSignature: isQueueCourse ? 'Pending' : 'Signed',
            deanOfficeStatus: isQueueCourse ? 'Pending' : 'Approved',
            renewalPaymentStatus: raw.sn % 3 === 0 ? 'Pending' : 'Paid',
            paymentVoucherRef: `PIV-2026-${1000 + raw.sn}`
          });
        }
      } else if (raw.sn >= 13 && raw.sn <= 24) {
        // Students 13 to 24 (Dean intake queue): 1 course is PENDING_APPROVAL with HOD Signed and Dean Pending
        const queueCourseIndex = (raw.sn - 13) % sem5Courses.length;
        for (let cIdx = 0; cIdx < sem5Courses.length; cIdx++) {
          const sub = sem5Courses[cIdx];
          const isQueueCourse = cIdx === queueCourseIndex;
          await SubjectRegistration.create({
            studentId: st._id,
            subjectId: sub._id,
            semesterId: semCurrent._id,
            academicYear: '2025/2026',
            status: isQueueCourse ? 'PENDING_APPROVAL' : 'REGISTERED',
            teacherSignature: 'Signed',
            teacherSignedAt: new Date(Date.now() - 5 * 24 * 3600 * 1000),
            hodSignature: 'Signed',
            hodSignedAt: new Date(Date.now() - 3 * 24 * 3600 * 1000),
            deanOfficeStatus: isQueueCourse ? ((raw.sn - 13) < 6 ? 'Received' : 'Pending') : 'Approved',
            renewalPaymentStatus: 'Paid',
            paymentVoucherRef: `PIV-2026-${2000 + raw.sn}`
          });
        }
      } else {
        // Regular enrolled students (25 to 112)
        for (const sub of sem5Courses) {
          await SubjectRegistration.create({
            studentId: st._id,
            subjectId: sub._id,
            semesterId: semCurrent._id,
            academicYear: '2025/2026',
            status: 'REGISTERED',
            teacherSignature: 'Signed',
            hodSignature: 'Signed',
            deanOfficeStatus: 'Approved',
            renewalPaymentStatus: 'Paid'
          });
        }
      }
    }

    console.log('[Seeding]: Creating Historical Examination Results for Afnan (Semesters 1-4)...');
    // Semester 1
    await Result.create([
      { studentId: student1._id, subjectId: subjects[0]._id, academicYear: '2023/2024', semester: 1, caMark: 36, esaMark: 48, finalMark: 84, grade: 'A', gradePoint: 4.00, qualityPoints: 8.00 },
      { studentId: student1._id, subjectId: subjects[1]._id, academicYear: '2023/2024', semester: 1, caMark: 34, esaMark: 42, finalMark: 76, grade: 'A-', gradePoint: 3.70, qualityPoints: 11.10 },
      // Semester 2
      { studentId: student1._id, subjectId: subjects[2]._id, academicYear: '2023/2024', semester: 2, caMark: 35, esaMark: 45, finalMark: 80, grade: 'A', gradePoint: 4.00, qualityPoints: 12.00 },
      { studentId: student1._id, subjectId: subjects[3]._id, academicYear: '2023/2024', semester: 2, caMark: 30, esaMark: 41, finalMark: 71, grade: 'B+', gradePoint: 3.30, qualityPoints: 9.90 },
      // Semester 3
      { studentId: student1._id, subjectId: subjects[4]._id, academicYear: '2024/2025', semester: 3, caMark: 36, esaMark: 46, finalMark: 82, grade: 'A', gradePoint: 4.00, qualityPoints: 12.00 },
      { studentId: student1._id, subjectId: subjects[5]._id, academicYear: '2024/2025', semester: 3, caMark: 33, esaMark: 43, finalMark: 76, grade: 'A-', gradePoint: 3.70, qualityPoints: 11.10 },
      { studentId: student1._id, subjectId: subjects[6]._id, academicYear: '2024/2025', semester: 3, caMark: 28, esaMark: 39, finalMark: 67, grade: 'B', gradePoint: 3.00, qualityPoints: 6.00 },
      // Semester 4
      { studentId: student1._id, subjectId: subjects[7]._id, academicYear: '2024/2025', semester: 4, caMark: 34, esaMark: 44, finalMark: 78, grade: 'A-', gradePoint: 3.70, qualityPoints: 11.10 },
      { studentId: student1._id, subjectId: subjects[8]._id, academicYear: '2024/2025', semester: 4, caMark: 32, esaMark: 40, finalMark: 72, grade: 'B+', gradePoint: 3.30, qualityPoints: 9.90 },
      // Semester 5 (Current CA marks in progress)
      { studentId: student1._id, subjectId: subjects[9]._id, academicYear: '2025/2026', semester: 5, caMark: 36, esaMark: 0, finalMark: 36, grade: 'Pending', gradePoint: 3.70, qualityPoints: 11.10 },
      { studentId: student1._id, subjectId: subjects[10]._id, academicYear: '2025/2026', semester: 5, caMark: 34, esaMark: 0, finalMark: 34, grade: 'Pending', gradePoint: 3.30, qualityPoints: 9.90 },
      { studentId: student1._id, subjectId: subjects[11]._id, academicYear: '2025/2026', semester: 5, caMark: 35, esaMark: 0, finalMark: 35, grade: 'Pending', gradePoint: 3.70, qualityPoints: 11.10 },
      { studentId: student1._id, subjectId: subjects[12]._id, academicYear: '2025/2026', semester: 5, caMark: 32, esaMark: 0, finalMark: 32, grade: 'Pending', gradePoint: 3.00, qualityPoints: 9.00 },
      { studentId: student1._id, subjectId: subjects[13]._id, academicYear: '2025/2026', semester: 5, caMark: 37, esaMark: 0, finalMark: 37, grade: 'Pending', gradePoint: 4.00, qualityPoints: 12.00 },
      { studentId: student1._id, subjectId: subjects[14]._id, academicYear: '2025/2026', semester: 5, caMark: 34, esaMark: 0, finalMark: 34, grade: 'Pending', gradePoint: 3.30, qualityPoints: 9.90 }
    ]);

    console.log('[Seeding]: Generating 14 Attendance Sessions for All 113 Students...');
    // 8 students below 80% cutoff:
    // sn: 2 (CHAMIKARA K.K.R.), sn: 11 (KAVISHKA S.V.A.S.), sn: 28 (KARANDANA K.L.H.G.),
    // sn: 47 (W.A.S.S. KALUWILA), sn: 66 (DIVEJIKAN Y.), sn: 80 (SABRA S.P.),
    // sn: 96 (THARUKA W.H.N.), sn: 112 (BANDARA LMRC)
    const below80Map = {
      2: [3, 7, 10, 13],        // absent 4 sessions -> 10/14 = 71%
      11: [2, 5, 8, 12],        // absent 4 sessions -> 10/14 = 71%
      28: [1, 4, 7, 9, 13],     // absent 5 sessions -> 9/14 = 64%
      47: [2, 6, 8, 11, 14],    // absent 5 sessions -> 9/14 = 64%
      66: [3, 5, 9, 12],        // absent 4 sessions -> 10/14 = 71%
      80: [4, 8, 11],           // absent 3 sessions -> 11/14 = 78%
      96: [1, 3, 6, 10, 13],    // absent 5 sessions -> 9/14 = 64%
      112: [2, 4, 7, 9, 11, 14] // absent 6 sessions -> 8/14 = 57%
    };

    for (let sessionNum = 1; sessionNum <= 14; sessionNum++) {
      const records = [];
      for (const raw of STUDENTS_DATA) {
        const st = studentDocMap.get(raw.sn);
        let isAbsent = false;

        if (raw.sn === 84) {
          // Afnan absent in sessions 4 and 9 = 12/14 (86%)
          isAbsent = sessionNum === 4 || sessionNum === 9;
        } else if (below80Map[raw.sn]) {
          isAbsent = below80Map[raw.sn].includes(sessionNum);
        } else {
          // Regular student: occasional absence
          isAbsent = (sessionNum === 5 && raw.sn % 7 === 0);
        }

        records.push({
          studentId: st._id,
          status: isAbsent ? 'Absent' : 'Present'
        });
      }

      await Attendance.create({
        subjectId: subjects[9]._id, // ICT22011 Web App Dev
        lecturerId: lecturer1._id,
        date: new Date(Date.now() - (15 - sessionNum) * 3 * 24 * 60 * 60 * 1000),
        session: sessionNum % 2 === 0 ? 'Practical' : 'Theory',
        hours: 2,
        topic: `Lecture Session ${sessionNum}: Advanced Full-Stack Architecture & State Management`,
        records
      });
    }

    console.log('[Seeding]: Creating Medical Requests...');
    await MedicalRequest.create([
      {
        requestId: 'MED-2026-0012',
        studentId: student1._id,
        submissionDate: new Date('2026-08-20'),
        academicYear: '2025/2026',
        semester: 5,
        leaveFrom: new Date('2026-08-15'),
        leaveTo: new Date('2026-08-18'),
        reason: 'Acute viral bronchitis under medical supervision',
        medicalCenterName: 'University Medical Center - SEUSL',
        certificateNumber: 'MC/UMC/2026/894',
        doctorName: 'Dr. S.M. Farook (Chief Medical Officer)',
        affectedSubjects: [{
          subjectId: subjects[9]._id,
          subjectCode: 'ICT22011',
          subjectTitle: 'Web Application Development',
          absentDates: [new Date('2026-08-16')]
        }],
        status: 'Approved',
        remarks: 'Valid UMC endorsement confirmed. Attendance credited as Excused_Medical.'
      },
      {
        requestId: 'MED-2026-0042',
        studentId: student1._id,
        submissionDate: new Date('2026-09-12'),
        academicYear: '2025/2026',
        semester: 5,
        leaveFrom: new Date('2026-09-08'),
        leaveTo: new Date('2026-09-10'),
        reason: 'Severe migraine and dehydration requiring clinical rest',
        medicalCenterName: 'District General Hospital, Kalmunai',
        certificateNumber: 'DGH/MED/4412',
        doctorName: 'Dr. K. Jayasuriya (DMO)',
        affectedSubjects: [{
          subjectId: subjects[10]._id,
          subjectCode: 'ICT22043',
          subjectTitle: 'Mobile Application Development',
          absentDates: [new Date('2026-09-09')]
        }],
        status: 'Under Review',
        remarks: 'Forwarded to Faculty Board for verification against hospital log.'
      }
    ]);

    console.log('[Seeding]: Creating Authentic Faculty Forms Extracted from Images...');
    // Form 1 from Image: Application for Examination (Continuous Assessment) (Repeat Candidates only)
    await FormDocument.create({
      formId: 'SEU-EX-CA-REP',
      name: 'Application for Examination (Continuous Assessment) (Repeat Candidates only)',
      officialTitle: 'SOUTH EASTERN UNIVERSITY OF SRI LANKA — EXAMINATION DIVISION: APPLICATION FOR EXAMINATION (Continuous Assessment) (Repeat Candidates only)',
      issuingDivision: 'Examination Division',
      category: 'Examination',
      description: 'Official application form for repeat candidates resitting Continuous Assessment (CA) components in Faculty of Technology degrees.',
      purpose: 'Enables repeat candidates to register for Continuous Assessment assessments, evaluations, or repeat quizzes/practicals for previously failed or upgraded courses.',
      whoShouldUse: 'Repeat undergraduate students (FAS, FE, FT) needing to improve or complete CA requirements.',
      whenToUse: 'Must be submitted during the repeat examination registration window announced by the Assistant Registrar (Examinations).',
      eligibility: 'Must have registered for the course previously and obtained a valid repeat eligibility permit.',
      requiredInformation: [
        'Name with initials (e.g. Mr. / Ms.)',
        'Registration No: SEU/IS/...',
        'Current Academic Year (e.g. 2025/2026)',
        'Faculty (FAS / FE / FT)',
        'Semester (I / II)',
        'Year of Examination (First / Second / Third / Fourth Year)',
        'Field of Specialization (if any)',
        'Present Address and Contact Mobile No',
        'List of Applied Subjects (Subject Code, Subject Title, Signature of Head of Department)'
      ],
      requiredDocuments: [
        'Duly completed Application Form (CAPITAL letters)',
        'Official People\'s Bank Pay In Voucher (PIV) showing repeat examination fee payment',
        'Recommendation and signature of the Head of Department'
      ],
      approvalRequirements: [
        'Signature of Head of Department',
        'Signature of Subject in charge (Part II)',
        'Endorsement and verification of Assistant Registrar (Examinations)'
      ],
      submissionLocation: 'Examination Division / Office of the Assistant Registrar, SEUSL',
      deadline: 'Strictly as published in the Examination Division circular (usually 2 weeks before exam commencement)',
      instructions: [
        'Complete the form in CAPITAL letters and tick the appropriate checkboxes.',
        'Use a separate form for each academic year if applying for subjects across multiple years.',
        'Obtain the signature of the Head of Department for each subject listed in Section 10.',
        'Ensure Part II is verified by the Subject In-Charge before submitting to the Assistant Registrar.',
        'Attach the pink customer copy of the Pay In Voucher (PIV) issued by People\'s Bank Addalaichenai.'
      ],
      printable: true,
      downloadable: true,
      version: '2026.1',
      availableToRoles: ['student', 'lecturer', 'admin'],
      status: 'Published',
      formFields: [
        { label: 'Full Name with Initials', name: 'nameWithInitials', type: 'text', required: true, placeholder: 'e.g. Mr. M.N.M. Afnan' },
        { label: 'Registration Number', name: 'registrationNo', type: 'text', required: true, placeholder: 'e.g. SEU/IS/FT/2022/ICT/085' },
        { label: 'Current Academic Year', name: 'academicYear', type: 'text', required: true, placeholder: 'e.g. 2025/2026' },
        { label: 'Faculty', name: 'faculty', type: 'select', required: true, options: ['FT (Faculty of Technology)', 'FE (Faculty of Engineering)', 'FAS (Faculty of Applied Sciences)'] },
        { label: 'Semester', name: 'semester', type: 'select', required: true, options: ['Semester I', 'Semester II'] },
        { label: 'Year of Examination', name: 'examYear', type: 'select', required: true, options: ['First Year', 'Second Year', 'Third Year', 'Fourth Year'] },
        { label: 'Field of Specialization', name: 'specialization', type: 'text', required: false, placeholder: 'e.g. Software Systems' },
        { label: 'Present Address', name: 'presentAddress', type: 'textarea', required: true },
        { label: 'Contact Mobile No', name: 'contactMobile', type: 'text', required: true, placeholder: '077xxxxxxx' }
      ]
    });

    // Form 2 from Scans: Medical Submission Form (Office of the Dean, Faculty of Technology - 2-Page Official Form)
    await FormDocument.create({
      formId: 'SEU-MED-ABSENT',
      name: 'Medical Submission Form',
      officialTitle: 'SOUTH EASTERN UNIVERSITY OF SRI LANKA — OFFICE OF THE DEAN, FACULTY OF TECHNOLOGY: MEDICAL SUBMISSION FORM',
      issuingDivision: 'Office of the Dean, Faculty of Technology',
      category: 'Medical / Attendance',
      description: 'Official 2-page unified Medical Submission Form (Front: Details of Applicant, Subject, Leave Dates, Reason for Absence, 8 Requested Subjects; Back: Office Use, Head of Department Recommendation, Dean\'s Office Forwarding).',
      purpose: 'Formal submission of medical leave and justification for absence with certified medical certificate to Dean\'s Office and Head of Department.',
      whoShouldUse: 'All students of Faculty of Technology (Fresh and Repeat candidates) absent due to illness across lectures, Continuous Assessment (CA), or End Semester Examinations.',
      whenToUse: 'Within two weeks of the illness or last examination date (or written notice within 48 hours to Senior Assistant Registrar if falling ill during examinations).',
      eligibility: 'Must be supported by a certified medical certificate from a qualified government medical officer or university medical center.',
      requiredInformation: [
        '1. Details of the Applicant: Name, Reg No, Index No, Candidate Type [Repeat/Fresh], Department, Postal Address',
        '2. Subject: Attendance for Lecture, End Semester Exam, Continuous Assessment (CA), or Other Specify',
        '3. Dates of Medical Leave (From date and To date)',
        '4. Reason for Absence Statement & Annexed Certified Medical Certificate',
        '5. Requested Subject/s (8-row table with S.No, Subject Code, Subject Name)',
        'Signature of the Student & Application Date',
        'Back Side (Page 2): Office Use Received Date & Remarks, HoD Recommendation & Signature, Dean\'s Office Forwarding'
      ],
      requiredDocuments: [
        'Original Certified Medical Certificate (from UMC SEUSL or Government Hospital DMO)',
        'Copy of notice sent to Senior Assistant Registrar within 48 hours (if exam absence)',
        'Completed 2-Page Medical Submission Form with Student Signature'
      ],
      approvalRequirements: [
        'Signature of the Student',
        'Recommendation and Signature of the Head of Department',
        'Dean\'s Office Receipt and Formal Endorsement'
      ],
      submissionLocation: 'Office of the Dean / Head of Department, Faculty of Technology, SEUSL',
      deadline: 'Within 2 weeks of the last exam date; written notice within 48 hours if during examinations',
      instructions: [
        'Section 1: Enter your full name, registration number, index number, repeat/fresh status, department, and postal address.',
        'Section 2: Tick the appropriate subject category (Lecture attendance, End Semester Examination, CA, or specify other).',
        'Section 3: Specify the exact leave dates (From and To).',
        'Section 4: Detail the medical reason and upload the certified medical certificate.',
        'Section 5: Enter the course code and title for all subjects requested (up to 8 rows).',
        'Upload your signature and click Submit & Generate Official Form.',
        'Download or print the generated official 2-page document containing Page 1 (Applicant Side) and Page 2 (Office Use & HoD/Dean endorsements).'
      ],
      printable: true,
      downloadable: true,
      status: 'Published'
    });


    // Form 3 from Image: Pay In Voucher (PIV)
    await FormDocument.create({
      formId: 'SEU-PIV-VOUCHER',
      name: 'Pay In Voucher (PIV)',
      officialTitle: 'SOUTH EASTERN UNIVERSITY OF SRI LANKA — PAY IN VOUCHER (PIV) [BURSAR\'S DEPT]',
      issuingDivision: 'Bursar\'s Department / People\'s Bank',
      category: 'Finance & Fees',
      description: 'Official SEUSL 3-part bank pay-in slip for all cash fee deposits to the university account at People\'s Bank.',
      purpose: 'Standard banking instrument used for paying registration, repeat examination, re-registration, convocation, or medical endorsement fees.',
      whoShouldUse: 'Any student or candidate required to remit academic, examination, or administrative fees to SEUSL.',
      whenToUse: 'Before submitting repeat exam forms, registration renewals, or convocation applications.',
      eligibility: 'All students and university candidates.',
      requiredInformation: [
        'Manager, People\'s Bank (Account No. 228 1001 9000 1704 People\'s Bank, Addalaichenai)',
        'Depositor Full Name and Address',
        'Registration No.',
        'Course of Study (e.g. BICT / BBST)',
        'Amount in figures and words',
        'Fee Category Breakdown (Registration Fee, Examination Fee, Convocation Fee, Re-registration Fee, Medical Fee)',
        'Signature of Depositor'
      ],
      requiredDocuments: [
        'Cash payment at People\'s Bank counter',
        'National Identity Card (NIC) / Student Record Book'
      ],
      approvalRequirements: [
        'Signature & Seal of People\'s Bank Branch Manager / Teller'
      ],
      submissionLocation: 'Any branch of People\'s Bank (Credited to A/C No: 228 1001 9000 1704, Addalaichenai Branch)',
      deadline: 'Must precede examination registration submission deadline',
      instructions: [
        'The fee should be paid in any branch of People\'s Bank by cash to the credit of South Eastern University of Sri Lanka (SEUSL), A/C No. 228 1001 9000 1704 People\'s Bank, Addalaichenai.',
        'Clearly tick the fee breakdown: 1. Registration Fee, 2. Examination Fee, 3. Convocation Fee, 4. Re-registration Fee, or 5. Medical Fee.',
        'Retain the Student Copy securely and attach the University Copy to your official application.'
      ],
      printable: true,
      downloadable: true,
      status: 'Published'
    });

    // Form 4 from Image: Medical Submission Form - Absent for Lectures - Department of ICT
    await FormDocument.create({
      formId: 'SEU-ICT-MED-LEC',
      name: 'Medical Submission Form - Absent for Lectures (Dept of ICT)',
      officialTitle: 'DEPARTMENT OF INFORMATION AND COMMUNICATION TECHNOLOGY — MEDICAL SUBMISSION FORM: ABSENT FOR LECTURES',
      issuingDivision: 'Department of ICT, Faculty of Technology',
      category: 'Medical / Attendance',
      description: 'Departmental medical submission form specifically customized for BICT students in the Department of ICT to document absence from lectures and practicals.',
      purpose: 'Ensures accurate calculation of Continuous Assessment attendance percentage for BICT students.',
      whoShouldUse: 'All BICT students registered for ICT modules in the Department of ICT.',
      whenToUse: 'Immediately upon resumption of classes following certified illness.',
      eligibility: 'Enrolled BICT students with valid supporting medical documentation.',
      requiredInformation: [
        'Name of the Student',
        'Admission Year',
        'Contact Number',
        'Year and Semester',
        'Medical Submission Date',
        'Medical Leave: From Date to To Date',
        'Specialization (e.g. Software Systems / Network Tech)',
        'Subject Code & Date Matrix',
        'Student Signature',
        'Signature of the Department Head'
      ],
      requiredDocuments: [
        'UMC / Hospital Medical Certificate',
        'Pay In Voucher (if late endorsement penalty applies)'
      ],
      approvalRequirements: [
        'Head of Department of ICT signature & official department seal'
      ],
      submissionLocation: 'Department of ICT Office, Technology Building',
      deadline: 'Within 7 calendar days after medical leave ends',
      instructions: [
        'Enter your Admission Year and current Year / Semester.',
        'List each Sub.Code in the matrix headers and indicate the dates absent.',
        'Affix your signature with date.',
        'Hand over the document to the Department of ICT clerical coordinator for recording into SEUConnect.'
      ],
      printable: true,
      downloadable: true,
      status: 'Published'
    });

    // Form 5 from Scans: Application for Examination (Examinations Division - 2-Page Official Form)
    await FormDocument.create({
      formId: 'SEU-EX-ESA-REP',
      name: 'Application for Examination',
      officialTitle: 'SOUTH EASTERN UNIVERSITY OF SRI LANKA — EXAMINATIONS DIVISION: APPLICATION FOR EXAMINATION',
      issuingDivision: 'Examinations Division',
      category: 'Examination',
      description: 'Official 2-page unified Examination Application Form (Page 1: Part I Candidate particulars 01-13, 12-row applied subjects schedule, attempt count; Page 2: 14 Fees paid, PIV voucher affix attachment box, candidate declaration & signature, Part II Subject In-charge & SAR verification, Part III Deputy Registrar/Exams approval).',
      purpose: 'Comprehensive university examination registration for Fresh and Repeat candidates for End Semester Examinations.',
      whoShouldUse: 'Undergraduate candidates (FT, FAS, FE, FMC, FIA, FAC) appearing for End Semester Examinations.',
      whenToUse: 'During the official examination registration period announced by the Examinations Division.',
      eligibility: 'Must be an enrolled student with requisite attendance and coursework completion.',
      requiredInformation: [
        '01. Name with initials (Mr. / Ms.) in BLOCK CAPITAL letters',
        '02. Registration No: SEU / IS / Faculty / Year / Index',
        '03. Current Batch intake academic year',
        '04. Faculty (FT / FE / FAS / FMC / FIA / FAC)',
        '05. Medium (English / Tamil)',
        '06. Semester (I / II)',
        '07. Applied for (Fresh / Repeat)',
        '08. Year of Examinations (First / Second / Third / Fourth Year)',
        '09. Field of Specialization',
        '10. Present Address',
        '11. Contact Mobile No',
        '12. Applied Subjects (12-row schedule with Subject Code and Subject Title)',
        '13. Repeat candidate completed attempts count',
        '14. Fees paid by Repeat Candidate (Rs. 100/subject or Rs. 400 for 4+ subjects)',
        'Affixed Copy of Pay In Voucher (PIV) bank payment proof',
        'Candidate Signature and Date',
        'Part II & Part III Official Verifications'
      ],
      requiredDocuments: [
        'Affixed copy of People\'s Bank Pay In Voucher (PIV) for repeat fees',
        'Completed 2-Page Application for Examination with Student Signature'
      ],
      approvalRequirements: [
        'Signature of Candidate',
        'Signature of Head of Department for applied subjects',
        'Signature of Subject in-charge and Senior Assistant Registrar (Part II)',
        'Approval of Deputy Registrar / Examinations (Part III)'
      ],
      submissionLocation: 'Examinations Division / Administrative Complex, SEUSL',
      deadline: 'Strictly as scheduled in the circular by the Deputy Registrar (Examinations)',
      instructions: [
        'Complete all fields in BLOCK CAPITAL letters and tick the appropriate checkboxes.',
        'Enter your registration number and current batch correctly.',
        'List all applied subjects in the 12-row table with exact Subject Code and Subject Title.',
        'For repeat candidates, calculate payment at Rs. 100/- per subject (or Rs. 400/- for 4 and more subjects).',
        'Attach/affix your Pay In Voucher (PIV) bank receipt in the designated box on Page 2.',
        'Upload your signature, submit, and print/download the official 2-page document.'
      ],
      printable: true,
      downloadable: true,
      status: 'Published'
    });


    // Form 6: Official Email Request Form (ICT Center)
    await FormDocument.create({
      formId: 'SEU-EMAIL-REQ',
      name: 'Official Email Request Form',
      officialTitle: 'SOUTH EASTERN UNIVERSITY OF SRI LANKA — OFFICIAL EMAIL REQUEST FORM',
      issuingDivision: 'ICT Center, SEUSL',
      category: 'Academic / Registration',
      description: 'Official institutional email account issuance form for students, lecturers, and faculty staff to obtain an @seu.ac.lk email address.',
      purpose: 'Acquiring an official institutional email ID for LMS access, academic communications, and university service access.',
      whoShouldUse: 'All students (undergraduates and postgraduates) and newly appointed faculty staff.',
      whenToUse: 'Upon initial enrollment or when requesting institutional email creation / reissue.',
      eligibility: 'Must be a registered student or staff member of South Eastern University of Sri Lanka.',
      requiredInformation: [
        'Full name, First name, Last name',
        'Designation and Student Registration Number',
        'Department / Unit / Center and Faculty',
        'Preferred Email ID (e.g. 22ict085@seu.ac.lk)',
        'Purpose of the Email',
        'WhatsApp Number for notification',
        'Present Personal Email ID (Gmail, Yahoo, etc.)',
        'Applicant Signature and Date'
      ],
      requiredDocuments: [
        'University Identity Card (copy) or Admission Offer Letter'
      ],
      approvalRequirements: [
        'Recommendation by Head of Department',
        'Approval by Dean of Faculty',
        'Approval by Vice Chancellor, SEUSL',
        'Issuance by Coordinator, ICT Center'
      ],
      submissionLocation: 'ICT Center / Department Office, SEUSL',
      deadline: 'Available year-round for new enrollments and academic sessions',
      instructions: [
        'Complete all applicant fields accurately in CAPITAL letters.',
        'Upload your signature or sign in the applicant signature box.',
        'Submit for Department Head and Dean endorsements.',
        'Account credentials will be dispatched via WhatsApp and present personal email.'
      ],
      printable: true,
      downloadable: true,
      status: 'Published'
    });

    // Form 7: Application for re-scrutinization of Marks & Grades
    await FormDocument.create({
      formId: 'SEU-EX-RESCRUTINY',
      name: 'Application for re-scrutinization of Marks & Grades',
      officialTitle: 'SOUTH EASTERN UNIVERSITY OF SRI LANKA — EXAMINATIONS DIVISION: Application for re-scrutinization of Marks & Grades',
      issuingDivision: 'Examinations Division',
      category: 'Examination',
      description: 'Official application for verification and re-scrutinization of examination marks and grades under Senate regulations (CC/No 078 of 09/04/2012).',
      purpose: 'Formal re-examination of marks, arithmetic recalculation, and grade verification by the Faculty Verification Board.',
      whoShouldUse: 'Students requesting verification of grades or marks for a completed course unit examination.',
      whenToUse: 'Within two weeks from the date of release of semester examination results.',
      eligibility: 'Must be an enrolled candidate who sat for the respective course unit examination.',
      requiredInformation: [
        'Candidate Name with Initials (Mr./Ms.)',
        'Registration Number (SEU/IS/...) and Index Number',
        'Subject/Course Year (1st, 2nd, 3rd, 4th) and Semester (I, II)',
        'Faculty (FT / FAS / FE / FMC / FIA / FAC)',
        'Contact Number and Email',
        'Name & Year of the Examination',
        'Subject/Course Code & Title',
        'Grade Received',
        'Amount Paid (Rs. 500 per subject/course)',
        'People\'s Bank Receipt Number and Date'
      ],
      requiredDocuments: [
        'Original People\'s Bank payment receipt (stapled to application)'
      ],
      approvalRequirements: [
        'Verification by Deputy Registrar (Examinations)',
        'Faculty Verification Board Committee Review and Signatures'
      ],
      submissionLocation: 'Examinations Division, Administrative Complex, SEUSL',
      deadline: 'Within 14 days of official results publication',
      instructions: [
        'Fill in CAPITAL letters and check appropriate boxes.',
        'Pay the required fee of Rs. 500/- per subject to People\'s Bank SEUSL Account.',
        'Attach original bank receipt and sign the candidate signature block.',
        'Submit directly to the Examination Division before the deadline.'
      ],
      printable: true,
      downloadable: true,
      status: 'Published'
    });

    console.log('[Seeding]: Creating Process Guidance Workflows ("What do you need to do?")...');
    await Process.create([
      {
        processId: 'PROC-CA-REPEAT',
        title: 'Continuous Assessment (CA) Repeat Registration',
        category: 'Examination',
        purpose: 'Guide students on resitting continuous assessments for failed or incomplete subjects.',
        whoCanUse: 'Undergraduate students with pending or failed CA marks.',
        eligibility: 'Must be an enrolled student with an active registration.',
        steps: [
          { stepNumber: 1, title: 'Obtain Form', description: 'Download or print the "Application for Examination (Continuous Assessment) (Repeat Candidates only)" form (SEU-EX-CA-REP).' },
          { stepNumber: 2, title: 'Pay Repeat Fee', description: 'Fill a People\'s Bank Pay In Voucher (PIV) (Account No: 228 1001 9000 1704, Addalaichenai) and pay the repeat fee (Rs. 100 per credit or as gazetted).' },
          { stepNumber: 3, title: 'Department Approval', description: 'Complete Section 10 with the subject codes and obtain the signature of the Head of Department.' },
          { stepNumber: 4, title: 'Submission', description: 'Submit the application along with the bank voucher to the Examination Division before the advertised closing date.' }
        ],
        requiredFormIds: ['SEU-EX-CA-REP', 'SEU-PIV-VOUCHER'],
        supportingDocuments: ['Paid Bank Pay In Voucher', 'Previous Semester Result Sheet'],
        approvals: ['Head of Department', 'Assistant Registrar (Examinations)'],
        submissionLocation: 'Examination Division / Faculty Academic Coordinator',
        deadlineInfo: 'Before the deadline announced by the Examination Division',
        nextAction: 'Monitor your examination registration tab in SEUConnect for Admission Card clearance.',
        keywords: ['repeat', 'ca', 'continuous assessment', 'resit', 'exam repeat', 'exam form']
      },
      {
        processId: 'PROC-MED-EXCUSE',
        title: 'Medical Excuse Submission for Missed Lectures',
        category: 'Medical / Attendance',
        purpose: 'Excuses absence from compulsory lectures and laboratories to protect exam eligibility.',
        whoCanUse: 'All students absent due to verified illness.',
        eligibility: 'Absence verified by a recognized government or university medical officer.',
        steps: [
          { stepNumber: 1, title: 'Acquire Medical Certificate', description: 'Obtain a valid medical certificate from the University Medical Center (UMC) or a Government Hospital DMO.' },
          { stepNumber: 2, title: 'Complete ICT Medical Form', description: 'Fill the "Medical Submission Form - Absent for Lectures (Dept of ICT)" or "Absent by Medical Form".' },
          { stepNumber: 3, title: 'Submit Online or in Person', description: 'Upload via SEUConnect Medical portal or hand in the physical copy to the Head of Department within 7 days.' },
          { stepNumber: 4, title: 'Attendance Credit', description: 'Once approved, your attendance standing will update to Excused_Medical on your student dashboard.' }
        ],
        requiredFormIds: ['SEU-ICT-MED-LEC', 'SEU-MED-ABSENT'],
        supportingDocuments: ['Original Medical Certificate', 'UMC Endorsement Stamp'],
        approvals: ['Head of Department', 'Faculty Board'],
        submissionLocation: 'Department of ICT Office / SEUConnect Online Medical Portal',
        deadlineInfo: 'Within 7 calendar days after medical leave expires',
        nextAction: 'Check the Medical Request tracker on your student dashboard for approval status.',
        keywords: ['medical', 'sick', 'absent', 'doctor', 'hospital', 'leave', 'attendance']
      },
      {
        processId: 'PROC-BANK-PAYMENT',
        title: 'University Fee Payment via People\'s Bank Pay In Voucher (PIV)',
        category: 'Finance & Fees',
        purpose: 'Step-by-step instructions for depositing university examination, registration, and welfare fees.',
        whoCanUse: 'All students and staff of SEUSL.',
        eligibility: 'Any formal fee remittance.',
        steps: [
          { stepNumber: 1, title: 'Obtain PIV Voucher', description: 'Download or print the SEUSL Pay In Voucher (PIV) or collect one at any People\'s Bank branch.' },
          { stepNumber: 2, title: 'Verify Bank Account', description: 'Confirm payee is: South Eastern University of Sri Lanka, Account No. 228 1001 9000 1704, People\'s Bank Addalaichenai.' },
          { stepNumber: 3, title: 'Cash Deposit', description: 'Deposit the required cash amount at any People\'s Bank branch counter across Sri Lanka.' },
          { stepNumber: 4, title: 'Retain Customer Copy', description: 'Retain your stamped customer receipt and submit the university copy to the relevant office.' }
        ],
        requiredFormIds: ['SEU-PIV-VOUCHER'],
        supportingDocuments: ['National Identity Card (NIC)', 'Student ID'],
        approvals: ['Bank Teller Stamp and Seal'],
        submissionLocation: 'Any branch of People\'s Bank',
        deadlineInfo: 'As stipulated per fee type',
        nextAction: 'Submit the stamped university copy to the Bursar / Examination Division.',
        keywords: ['payment', 'bank', 'piv', 'voucher', 'fee', 'account', 'peoples bank']
      },
      {
        processId: 'PROC-REG-ADD-DROP',
        title: 'Semester Subject Registration & Add/Drop Procedure',
        category: 'Academic',
        purpose: 'Register for compulsory and elective modules each semester within academic credit load limits.',
        whoCanUse: 'All undergraduate students.',
        eligibility: 'Must not exceed the maximum limit of 22 credits per semester.',
        steps: [
          { stepNumber: 1, title: 'Access Registration', description: 'Go to Student Services -> Semester & Subject Registration on SEUConnect.' },
          { stepNumber: 2, title: 'Select Courses', description: 'Select your degree modules. The system automatically enforces the 22-credit ceiling.' },
          { stepNumber: 3, title: 'Confirm & Submit', description: 'Click "Confirm Registration" to record your enrollments.' },
          { stepNumber: 4, title: 'Add/Drop Period', description: 'Add or drop elective modules within the first two weeks of the semester.' }
        ],
        requiredFormIds: [],
        supportingDocuments: ['Academic Advisor Consultation Record (if overloaded)'],
        approvals: ['Academic Advisor', 'Dean (if requesting credit overload > 22 cr)'],
        submissionLocation: 'SEUConnect Online Portal',
        deadlineInfo: 'Within 14 days of semester commencement',
        nextAction: 'Verify that your registered courses appear on your attendance list and timetable.',
        keywords: ['register', 'add drop', 'subject', 'credit', 'course registration', 'semester registration']
      }
    ]);

    console.log('[Seeding]: Creating Welfare Services & Scholarships...');
    await Welfare.create([
      {
        title: 'Mahapola Higher Education Scholarship',
        category: 'Scholarships',
        description: 'National merit and need-based scholarship disbursed monthly by the Mahapola Trust Fund.',
        eligibility: 'Enrolled internal undergraduates selected based on Z-score merit and parental income criteria.',
        benefits: 'Monthly stipend of Rs. 5,000 / Rs. 5,200 deposited into student bank accounts.',
        applicationDeadline: 'Announced annually by UGC & Student Affairs Division',
        contactOffice: 'Student Welfare & Accommodation Division, SEUSL',
        contactEmail: 'welfare@seu.ac.lk'
      },
      {
        title: 'University Bursary Financial Assistance',
        category: 'Financial Support',
        description: 'University financial grant scheme for undergraduates who do not receive Mahapola scholarships.',
        eligibility: 'Parental annual income below UGC threshold and absence of disciplinary penalties.',
        benefits: 'Monthly financial assistance throughout the academic session.',
        applicationDeadline: 'First semester of university admission',
        contactOffice: 'Student Welfare Division, Administrative Complex'
      },
      {
        title: 'Faculty Technology Hostel Accommodation',
        category: 'Accommodation',
        description: 'On-campus residential hostel facilities for Technology Faculty students with Wi-Fi and study halls.',
        eligibility: 'Registered full-time undergraduate students meeting residence distance requirements (> 40km).',
        benefits: 'Secure residential accommodation within campus perimeter.',
        applicationDeadline: 'Beginning of each academic year',
        contactOffice: 'Hostel Sub-warden Office, Faculty of Technology'
      },
      {
        title: 'Student Counselling & Mental Health Support',
        category: 'Counselling',
        description: 'Confidential psychological, academic stress, and mental well-being guidance by trained faculty counsellors.',
        eligibility: 'Free and accessible to all registered students without appointment restrictions.',
        benefits: 'Confidential 1-on-1 counseling sessions and academic stress management.',
        contactPerson: 'Dr. Faculty Senior Counsellor',
        contactOffice: 'Counselling Center, Student Health Complex'
      }
    ]);

    console.log('[Seeding]: Creating Societies & Clubs...');
    const soc1 = await Society.create({
      name: 'Information Technology Students Association (ITSA)',
      shortCode: 'ITSA',
      category: 'Technology',
      description: 'The premier student society of the Department of ICT, organizing hackathons, tech talks, and open-source bootcamps.',
      president: 'M.N.M. Afnan (22ICT085)',
      seniorTreasurer: 'Dr. R. Ketheeswaran',
      meetingSchedule: 'Every alternate Wednesday, 4:00 PM, Audi FT',
      activeProjects: ['SEU Hackathon 2026', 'Linux & Cloud Mentorship Programme', 'Girls in ICT Forum']
    });

    const soc2 = await Society.create({
      name: 'Technology Faculty Sports & Athletics Club',
      shortCode: 'TECH-SPORTS',
      category: 'Sports',
      description: 'Promoting university athletics, cricket, badminton, and inter-faculty tournament teams.',
      president: 'K. Kavishan',
      meetingSchedule: 'Every Tuesday, 5:00 PM, University Sports Ground',
      activeProjects: ['Inter-Faculty Sports Meet 2026', 'Faculty Cricket Championship']
    });

    await Membership.create([
      { studentId: student1._id, societyId: soc1._id, role: 'President', status: 'Active' },
      { studentId: student1._id, societyId: soc2._id, role: 'Member', status: 'Active' }
    ]);

    console.log('[Seeding]: Creating Notifications...');
    await Notification.create([
      {
        title: 'End Semester Examination Registration Notice',
        message: 'The repeat examination registration portal for Semester 1 & 2 is now open. Repeat candidates must submit their Pay In Voucher (PIV) and application form before the October 31 deadline.',
        type: 'Examination',
        priority: 'High',
        targetRole: 'STUDENT',
        targetProgramme: 'ALL'
      },
      {
        title: 'Continuous Assessment (CA) Marks Entry Open for Lecturers',
        message: 'All course coordinators in the Faculty of Technology are requested to finalize and upload continuous assessment marks for Semester 5 courses before the Faculty Board deadline.',
        type: 'Academic',
        priority: 'Urgent',
        targetRole: 'LECTURER'
      },
      {
        title: '80% Attendance Requirement Notice for ESA Eligibility',
        message: 'Students are reminded that maintaining 80% attendance in both Theory and Practical sessions is mandatory to obtain the admission card for the End Semester Examination.',
        type: 'Academic',
        priority: 'High',
        targetRole: 'STUDENT'
      },
      {
        title: 'Official Release of Faculty Forms on SEUConnect',
        message: 'Official Examination Repeat forms, Absent by Medical forms, and People\'s Bank Pay In Vouchers (PIV) are now available under "Faculty Forms & Instructions" with printable digital templates.',
        type: 'Forms',
        priority: 'Normal',
        targetRole: 'ALL'
      }
    ]);

    console.log('[Seeding]: Creating Scoped Penalties (Sample)...');
    await Penalty.create({
      studentId: studentDocs[1]._id,
      refNumber: 'DISC-FT-2026-03',
      description: 'Late submission of library reference materials beyond loan period.',
      relatedRule: 'Section 14.2: University Library Rules and Regulations',
      issuedDate: new Date('2026-09-01'),
      status: 'Resolved',
      requiredAction: 'Fine paid and book returned to Main Library desk.',
      authorizedBy: 'Assistant Librarian / Dean FT'
    });

    console.log('[Seeding]: Creating Exam Attempt History for Repeat Candidates...');
    const repeatStudent = studentDocMap.get(113); // G.Sanojan (SEU/IS/21/ICT/064)
    if (repeatStudent) {
      await ExamAttempt.create([
        { studentId: repeatStudent._id, subjectId: subjects[4]._id, attemptNumber: 1, academicYear: '2023/2024', semester: 3, gradeObtained: 'D+', isCurrentAttempt: false, remarks: 'Repeat eligible under university regulations' },
        { studentId: repeatStudent._id, subjectId: subjects[4]._id, attemptNumber: 2, academicYear: '2024/2025', semester: 3, gradeObtained: 'E', isCurrentAttempt: false, remarks: 'Medical appeal submitted' },
        { studentId: repeatStudent._id, subjectId: subjects[4]._id, attemptNumber: 3, academicYear: '2024/2025', semester: 4, gradeObtained: 'F', isCurrentAttempt: false, remarks: '3-Attempt ceiling reached' },
        { studentId: repeatStudent._id, subjectId: subjects[4]._id, attemptNumber: 4, academicYear: '2025/2026', semester: 5, gradeObtained: 'Pending', isCurrentAttempt: true, remarks: 'Faculty Board grace chance petition pending approval' }
      ]);
    }

    console.log('[Seeding]: Creating Faculty Board Agenda Items (7 items matching Dean Mockup)...');
    await FacultyBoardAgenda.create([
      {
        title: 'Exam Date Proposal - IT402',
        category: 'Exam Dates',
        department: 'Department of Information & Communication Tech.',
        requestedDate: new Date('2025-04-18'),
        priority: 'High',
        status: 'Pending',
        details: 'Proposed date: 24 April 2025, 09:00 AM in Technology Examination Hall A. HOD feedback received.'
      },
      {
        title: 'Medical Recommendation - SEU/IS/22/ICT/002 CHAMIKARA K.K.R.',
        category: 'Medical',
        department: 'Department of Information & Communication Tech.',
        requestedDate: new Date('2025-04-16'),
        priority: 'Medium',
        status: 'Pending',
        details: 'Hospitalization verification for student CHAMIKARA K.K.R. (SEU/IS/22/ICT/002) during CA evaluation period.'
      },
      {
        title: 'Repeat Grace Chance - SEU/IS/21/ICT/064 G.Sanojan',
        category: 'Repeat Grace',
        department: 'Department of Information & Communication Tech.',
        requestedDate: new Date('2025-04-15'),
        priority: 'High',
        status: 'Under Review',
        details: 'Fourth attempt appeal under Senate Regulation 4.3 for candidate G.Sanojan in ICT21013 Data Structures due to certified medical bereavement.'
      },
      {
        title: 'Exam Date Proposal - EE203',
        category: 'Exam Dates',
        department: 'Department of Electrical Engineering',
        requestedDate: new Date('2025-04-14'),
        priority: 'Medium',
        status: 'Pending',
        details: 'Draft date adjustment to avoid clash with inter-faculty engineering practicals.'
      },
      {
        title: 'Medical Recommendation - ME305',
        category: 'Medical',
        department: 'Department of Mechanical Engineering',
        requestedDate: new Date('2025-04-12'),
        priority: 'Low',
        status: 'Approved',
        details: 'Endorsed by CMO of University Medical Center. Attendance credit validated as Excused_Medical.'
      },
      {
        title: 'Repeat Grace Chance - CE401',
        category: 'Repeat Grace',
        department: 'Department of Civil Engineering',
        requestedDate: new Date('2025-04-11'),
        priority: 'Medium',
        status: 'Under Review',
        details: 'Final grace opportunity for candidate on medical grounds with valid hospital docket.'
      },
      {
        title: 'Exam Date Proposal - MGMT101',
        category: 'Exam Dates',
        department: 'Department of Business & Management',
        requestedDate: new Date('2025-04-10'),
        priority: 'Low',
        status: 'Approved',
        details: 'Common management paper scheduled for 28 April 2025 with Auditorium FT seating.'
      }
    ]);

    console.log('[Seeding]: Creating Examination Calendar Events for April 2025...');
    await ExamSchedule.create([
      {
        title: 'Exam Application Close',
        courseCode: 'ALL',
        department: 'Examination Division',
        date: new Date('2025-04-04'),
        session: 'Morning',
        venue: 'Examination Division Office',
        eventType: 'Deadline',
        status: 'Final'
      },
      {
        title: 'ICT22011 Web App Exam',
        courseCode: 'ICT22011',
        courseTitle: 'Web Application Development',
        department: 'Department of Information & Communication Tech.',
        date: new Date('2025-04-10'),
        session: 'Morning',
        venue: 'Technology Examination Hall A',
        eventType: 'Exams',
        status: 'Approved',
        hodStatus: 'Agreed'
      },
      {
        title: 'CS501 Data Structures Exam',
        courseCode: 'CS501',
        courseTitle: 'Data Structures and Algorithms',
        department: 'Department of Information & Communication Tech.',
        date: new Date('2025-04-11'),
        session: 'Morning',
        venue: 'Technology Examination Hall B',
        eventType: 'Exams',
        status: 'Approved',
        hodStatus: 'Agreed'
      },
      {
        title: 'Faculty Board Meeting',
        department: 'Dean Office',
        date: new Date('2025-04-17'),
        session: 'Morning',
        venue: 'Faculty Board Room',
        eventType: 'Board Meeting',
        status: 'Approved'
      },
      {
        title: 'Medical Appeals Deadline',
        department: 'Dean Office',
        date: new Date('2025-04-18'),
        session: 'Afternoon',
        venue: 'Office of the Dean',
        eventType: 'Deadline',
        status: 'Final'
      },
      {
        title: 'IT402 Network Security Exam',
        courseCode: 'IT402',
        courseTitle: 'Network Security & Architecture',
        department: 'Department of Information & Communication Tech.',
        date: new Date('2025-04-24'),
        session: 'Afternoon',
        venue: 'Technology Examination Hall A',
        eventType: 'Exams',
        status: 'Under Consultation',
        hodStatus: 'Pending Input'
      },
      {
        title: 'Board of Examiners Prep',
        department: 'Dean Office',
        date: new Date('2025-04-25'),
        session: 'Morning',
        venue: 'Dean Conference Room',
        eventType: 'Board Meeting',
        status: 'Approved'
      },
      {
        title: 'MATH301 Advanced Mathematics',
        courseCode: 'MATH301',
        courseTitle: 'Advanced Discrete Mathematics',
        department: 'Department of Mathematics',
        date: new Date('2025-04-28'),
        session: 'Morning',
        venue: 'Technology Examination Hall B',
        eventType: 'Exams',
        status: 'Approved'
      }
    ]);

    console.log('=======================================================');
    console.log(' SEUConnect DATABASE SEEDING COMPLETED SUCCESSFULLY!  ');
    console.log('=======================================================');
    console.log('Test Accounts created:');
    console.log('1. Student  : 22ict085@seu.ac.lk / password123 (M.N.M. Afnan, BICT, Sem 5)');
    console.log('2. Lecturer : rk@seu.ac.lk       / password123 (Dr. R. Ketheeswaran, Dept of ICT)');
    console.log('3. HOD      : hod@seu.ac.lk      / password123 (Dr. Amara Silva, HOD ICT)');
    console.log('4. Dean     : dean@seu.ac.lk     / password123 (Dr. Eleanor Grant, Dean FT)');
    console.log('5. Admin    : admin@seu.ac.lk    / password123 (Faculty Administrator)');
    console.log('Forms Seeded: 5 authentic SEUSL forms from uploaded scanned documents');
    console.log('=======================================================');

    return {
      success: true,
      message: 'SEUConnect database seeded successfully!',
      accounts: [
        { role: 'Student', email: '22ict085@seu.ac.lk', password: 'password123', name: 'M.N.M. Afnan' },
        { role: 'Lecturer', email: 'rk@seu.ac.lk', password: 'password123', name: 'Dr. R. Ketheeswaran' },
        { role: 'HOD', email: 'hod@seu.ac.lk', password: 'password123', name: 'Dr. Amara Silva' },
        { role: 'Dean', email: 'dean@seu.ac.lk', password: 'password123', name: 'Dr. Eleanor Grant' },
        { role: 'Admin', email: 'admin@seu.ac.lk', password: 'password123', name: 'Faculty Administrator' }
      ]
    };
  } catch (error) {
    console.error('[Seeding Error]:', error);
    throw error;
  }
};

// Check if running directly via node CLI
if (process.argv[1] && process.argv[1].endsWith('seedDatabase.js')) {
  runSeed()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
