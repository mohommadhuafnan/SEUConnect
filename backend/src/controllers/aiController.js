import Process from '../models/Process.js';
import FormDocument from '../models/FormDocument.js';
import AcademicRule from '../models/AcademicRule.js';
import Student from '../models/Student.js';
import Lecturer from '../models/Lecturer.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const chatWithAI = async (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message) {
      return errorResponse(res, 'Please provide a message or question.', 400);
    }

    const user = req.user;
    const role = user.role;
    const cleanMsg = message.toLowerCase().trim();

    // Fetch university database context
    const rules = await AcademicRule.findOne({ ruleKey: 'SEUSL_FT_DEFAULT' }) || {
      attendanceMinimumPercent: 80,
      maximumCreditsPerSemester: 22,
      bictGraduationCredits: 130,
      bbstGraduationCredits: 120
    };

    const allForms = await FormDocument.find({ status: 'Published' }).select('formId name category submissionLocation');
    const allProcesses = await Process.find({ status: 'Active' }).select('processId title purpose steps requiredFormIds');

    // Rule-based grounded intelligence
    let answer = '';
    let relatedForms = [];
    let relatedProcesses = [];

    if (cleanMsg.includes('attendance') || cleanMsg.includes('80%') || cleanMsg.includes('eligib')) {
      answer = `Under Faculty of Technology academic regulations, students must maintain a minimum of ${rules.attendanceMinimumPercent}% attendance in both Theory and Practical sessions to be eligible for End Semester Examinations (ESA). If your attendance falls below ${rules.attendanceMinimumPercent}%, you will be marked 'Ineligible' and must submit a formal Medical Certificate / Absent Form to the Head of Department within 7 days.`;
      relatedForms = allForms.filter(f => f.category === 'Medical / Attendance');
      relatedProcesses = allProcesses.filter(p => p.title.toLowerCase().includes('medical') || p.title.toLowerCase().includes('attendance'));
    } else if (cleanMsg.includes('medical') || cleanMsg.includes('absent') || cleanMsg.includes('sick')) {
      answer = `To submit a medical excuse for missed lectures or examinations:\n1. Obtain the 'Medical Submission Form - Absent for Lectures (Dept of ICT)' or 'Absent by Medical Form'.\n2. Attach your original valid Medical Certificate endorsed by a recognized Government or University Medical Officer.\n3. Submit it to the Head of Department within 7 days from the end of the medical leave.\n4. Pay any required medical fee using the SEUSL Pay In Voucher (PIV) at People's Bank Addalaichenai Branch (A/C: 228 1001 9000 1704).`;
      relatedForms = allForms.filter(f => f.category === 'Medical / Attendance' || f.formId === 'SEU-PIV-VOUCHER');
      relatedProcesses = allProcesses.filter(p => p.title.toLowerCase().includes('medical'));
    } else if (cleanMsg.includes('repeat') || cleanMsg.includes('resit') || cleanMsg.includes('exam')) {
      answer = `For examination repeats:\n- Continuous Assessment Repeat: Complete the 'Application for Examination (Continuous Assessment) (Repeat Candidates only)' form and obtain Department Head signature.\n- End Semester Exam Repeat: Complete the 'Application for Examination (End Semester Examination) (Repeat Candidates only)' form.\n- Pay the exam repeat fee via People's Bank PIV voucher (Account No: 228 1001 9000 1704, Addalaichenai).\n- Submit the form along with the paid bank voucher to the Examination Division before the deadline.`;
      relatedForms = allForms.filter(f => f.category === 'Examination' || f.formId === 'SEU-PIV-VOUCHER');
      relatedProcesses = allProcesses.filter(p => p.title.toLowerCase().includes('examination') || p.title.toLowerCase().includes('repeat'));
    } else if (cleanMsg.includes('credit') || cleanMsg.includes('maximum') || cleanMsg.includes('load')) {
      answer = `Faculty of Technology regulations set a maximum credit limit of ${rules.maximumCreditsPerSemester} credits per semester. The degree completion requirements are:\n- BICT: ${rules.bictGraduationCredits} Total Credits\n- BBST: ${rules.bbstGraduationCredits} Total Credits\nIf you need to exceed ${rules.maximumCreditsPerSemester} credits, prior written approval from the Faculty Academic Committee and the Dean is mandatory.`;
      relatedProcesses = allProcesses.filter(p => p.title.toLowerCase().includes('registration'));
    } else if (cleanMsg.includes('gpa') || cleanMsg.includes('sgpa') || cleanMsg.includes('cgpa') || cleanMsg.includes('class')) {
      answer = `GPA in the Faculty of Technology is credit-weighted:\nSGPA = Σ(Credit × Grade Point) / Σ(Credit)\nGraduation Class Criteria:\n- First Class: CGPA ≥ 3.70\n- Second Upper: CGPA ≥ 3.30\n- Second Lower: CGPA ≥ 3.00\n- Pass: CGPA ≥ 2.00\nGrades range from A+ / A (4.00) down to E (0.00).`;
    } else if (cleanMsg.includes('form') || cleanMsg.includes('piv') || cleanMsg.includes('voucher') || cleanMsg.includes('bank')) {
      answer = `All official forms can be accessed from the 'Faculty Forms & Instructions' menu on your sidebar. For all university payments, use the SEUSL Pay In Voucher (PIV) payable to People's Bank, Addalaichenai Branch, Account No: 228 1001 9000 1704.`;
      relatedForms = allForms;
    } else if (role === 'lecturer' && (cleanMsg.includes('ca') || cleanMsg.includes('esa') || cleanMsg.includes('marks'))) {
      answer = `As an instructor, you can record session attendance and input Continuous Assessment (CA) and End Semester Examination (ESA) marks under 'My Courses' -> 'CA Marks' / 'ESA Marks'. Ensure marks are saved before the faculty board submission deadline.`;
    } else if (role === 'admin') {
      answer = `Administrative Console Notice: You have full authority to manage users, approve/reject medical requests, configure academic rules (credits, attendance threshold), publish forms, and broadcast faculty notifications.`;
    } else {
      // Find closest process match
      const matchedProc = allProcesses.find(p => p.keywords.some(k => cleanMsg.includes(k.toLowerCase())));
      if (matchedProc) {
        answer = `${matchedProc.title}: ${matchedProc.purpose}. Eligibility: ${matchedProc.eligibility}. Please review the step-by-step guidance in SEUConnect.`;
        relatedProcesses = [matchedProc];
      } else {
        answer = `I could not find a configured SEUConnect instruction for this request. Please verify with the relevant university office (Dean's Office / Examination Division / Head of Department).`;
      }
    }

    return successResponse(res, {
      role,
      user: user.name,
      reply: answer,
      relatedForms,
      relatedProcesses
    });
  } catch (error) {
    next(error);
  }
};
