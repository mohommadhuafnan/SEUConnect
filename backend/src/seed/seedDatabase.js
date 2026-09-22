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

export const runSeed = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.log('[Seeding]: Connecting to database...');
      await mongoose.connect(ENV.MONGODB_URI);
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
      Penalty.deleteMany({})
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

    console.log('[Seeding]: Creating Primary Student (22ict085@seu.ac.lk)...');
    const userStudent1 = await User.create({
      name: 'M.N.M. Afnan',
      email: '22ict085@seu.ac.lk',
      passwordHash: defaultPassword,
      role: 'student',
      status: 'active',
      phone: '+94 77 1234567',
      address: 'Technology Hostel, Faculty of Technology, SEUSL'
    });

    const student1 = await Student.create({
      userId: userStudent1._id,
      registrationNumber: '22ICT085',
      indexNumber: 'ICT22085',
      degreeProgramme: 'BICT',
      academicYear: '2025/2026',
      currentSemester: 5,
      specialization: 'Software Systems',
      faculty: 'Faculty of Technology',
      department: 'Department of Information and Communication Technology',
      sgpa: 3.42,
      cgpa: 3.38,
      creditsCompleted: 78,
      creditsRegistered: 18,
      degreeCreditsRequired: 130,
      examEligibility: 'Eligible',
      currentClass: 'Second Class (Upper Division)'
    });

    // Create 9 additional students
    const sampleStudents = [
      { name: 'K.L. Fathima Nusra', email: '22ict012@seu.ac.lk', reg: '22ICT012', idx: 'ICT22012', sem: 5, prog: 'BICT' },
      { name: 'S. Thevakanthan', email: '22ict034@seu.ac.lk', reg: '22ICT034', idx: 'ICT22034', sem: 5, prog: 'BICT' },
      { name: 'A.H. Mohamed Rizwan', email: '22ict055@seu.ac.lk', reg: '22ICT055', idx: 'ICT22055', sem: 5, prog: 'BICT' },
      { name: 'P. Kavishan', email: '22ict067@seu.ac.lk', reg: '22ICT067', idx: 'ICT22067', sem: 5, prog: 'BICT' },
      { name: 'M.S. Akeel Ahamed', email: '23ict019@seu.ac.lk', reg: '23ICT019', idx: 'ICT23019', sem: 3, prog: 'BICT' },
      { name: 'N.V. Thashmila Dilshan', email: '23ict044@seu.ac.lk', reg: '23ICT044', idx: 'ICT23044', sem: 3, prog: 'BICT' },
      { name: 'R.M. Bandara', email: '22bst015@seu.ac.lk', reg: '22BST015', idx: 'BST22015', sem: 5, prog: 'BBST' },
      { name: 'H.M. Dilrukshi', email: '22bst032@seu.ac.lk', reg: '22BST032', idx: 'BST22032', sem: 5, prog: 'BBST' },
      { name: 'T. Janarthanan', email: '24ict008@seu.ac.lk', reg: '24ICT008', idx: 'ICT24008', sem: 1, prog: 'BICT' }
    ];

    const studentDocs = [student1];
    for (const s of sampleStudents) {
      const u = await User.create({
        name: s.name,
        email: s.email,
        passwordHash: defaultPassword,
        role: 'student',
        status: 'active'
      });
      const st = await Student.create({
        userId: u._id,
        registrationNumber: s.reg,
        indexNumber: s.idx,
        degreeProgramme: s.prog,
        academicYear: '2025/2026',
        currentSemester: s.sem,
        specialization: s.prog === 'BICT' ? 'Software Systems' : 'Bio-systems Technology',
        sgpa: 3.30,
        cgpa: 3.25,
        creditsCompleted: s.sem === 5 ? 75 : s.sem === 3 ? 42 : 16,
        creditsRegistered: 18,
        degreeCreditsRequired: s.prog === 'BBST' ? 120 : 130
      });
      studentDocs.push(st);
    }

    console.log('[Seeding]: Registering Semester 5 Courses for Afnan (18 credits)...');
    // Courses 9 to 14 (6 courses * 3 cr = 18 cr)
    const sem5Courses = [subjects[9], subjects[10], subjects[11], subjects[12], subjects[13], subjects[14]];
    for (const sub of sem5Courses) {
      await SubjectRegistration.create({
        studentId: student1._id,
        subjectId: sub._id,
        semesterId: semCurrent._id,
        status: 'REGISTERED'
      });

      // Also register for other sem 5 students
      for (let i = 1; i <= 4; i++) {
        await SubjectRegistration.create({
          studentId: studentDocs[i]._id,
          subjectId: sub._id,
          semesterId: semCurrent._id,
          status: 'REGISTERED'
        });
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

    console.log('[Seeding]: Generating Attendance Sessions (86% Afnan attendance)...');
    // Generate 14 past lectures for ICT22011 and other courses
    for (let i = 1; i <= 14; i++) {
      const isAbsent = i === 4 || i === 9; // 2 absences out of 14 = ~86% attendance
      await Attendance.create({
        subjectId: subjects[9]._id,
        lecturerId: lecturer1._id,
        date: new Date(Date.now() - (15 - i) * 3 * 24 * 60 * 60 * 1000),
        session: i % 2 === 0 ? 'Practical' : 'Theory',
        hours: 2,
        topic: `Lecture Session ${i}: Advanced Full-Stack Architecture & State Management`,
        records: [
          { studentId: student1._id, status: isAbsent ? 'Absent' : 'Present' },
          { studentId: studentDocs[1]._id, status: 'Present' },
          { studentId: studentDocs[2]._id, status: 'Present' }
        ]
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
      studentId: studentDocs[1]._id, // Not Afnan - strictly student 2 to demonstrate isolation!
      refNumber: 'DISC-FT-2026-03',
      description: 'Late submission of library reference materials beyond loan period.',
      relatedRule: 'Section 14.2: University Library Rules and Regulations',
      issuedDate: new Date('2026-09-01'),
      status: 'Resolved',
      requiredAction: 'Fine paid and book returned to Main Library desk.',
      authorizedBy: 'Assistant Librarian / Dean FT'
    });

    console.log('=======================================================');
    console.log(' SEUConnect DATABASE SEEDING COMPLETED SUCCESSFULLY!  ');
    console.log('=======================================================');
    console.log('Test Accounts created:');
    console.log('1. Student  : 22ict085@seu.ac.lk / password123 (M.N.M. Afnan, BICT, Sem 5)');
    console.log('2. Lecturer : rk@seu.ac.lk       / password123 (Dr. R. Ketheeswaran, Dept of ICT)');
    console.log('3. Admin    : admin@seu.ac.lk    / password123 (Faculty Administrator)');
    console.log('Forms Seeded: 5 authentic SEUSL forms from uploaded scanned documents');
    console.log('=======================================================');

    return {
      success: true,
      message: 'SEUConnect database seeded successfully!',
      accounts: [
        { role: 'Student', email: '22ict085@seu.ac.lk', password: 'password123', name: 'M.N.M. Afnan' },
        { role: 'Lecturer', email: 'rk@seu.ac.lk', password: 'password123', name: 'Dr. R. Ketheeswaran' },
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
