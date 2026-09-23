import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { ProtectedRoute, StudentRoute, LecturerRoute, HODRoute, DeanRoute, AdminRoute } from './Guards';
import StudentLayout from '../layouts/StudentLayout';
import LecturerLayout from '../layouts/LecturerLayout';
import HODLayout from '../layouts/HODLayout';
import DeanLayout from '../layouts/DeanLayout';
import AdminLayout from '../layouts/AdminLayout';

import Login from '../pages/Login';
import { Unauthorized, NotFound } from '../pages/StaticPages';

// Student Pages
import StudentDashboard from '../pages/student/Dashboard';
import StudentProfile from '../pages/student/Profile';
import StudentRegistration from '../pages/student/Registration';
import StudentAttendance from '../pages/student/Attendance';
import StudentMedical from '../pages/student/Medical';
import StudentExamination from '../pages/student/Examination';
import StudentResults from '../pages/student/Results';
import StudentGPA from '../pages/student/GPA';
import StudentProgress from '../pages/student/Progress';
import StudentForms from '../pages/student/Forms';
import StudentFormDetail from '../pages/student/FormDetail';
import StudentProcesses from '../pages/student/Processes';
import StudentProcessDetail from '../pages/student/ProcessDetail';
import StudentWelfare from '../pages/student/Welfare';
import StudentSocieties from '../pages/student/Societies';
import { StudentNotifications, StudentPenalties } from '../pages/student/NotifsAndPenalties';

// Lecturer Pages
import LecturerDashboard from '../pages/lecturer/Dashboard';
import { LecturerCourses, LecturerCourseDetails } from '../pages/lecturer/CoursePages';
import LecturerAttendance from '../pages/lecturer/Attendance';
import LecturerCAMarks from '../pages/lecturer/CAMarks';
import { LecturerESAMarks, LecturerProfile } from '../pages/lecturer/ESAMarksAndProfile';

// HOD Pages
import HODDashboard from '../pages/hod/HODDashboard';
import HODRegistrations from '../pages/hod/HODRegistrations';
import HODAttendance from '../pages/hod/HODAttendance';
import HODExaminations from '../pages/hod/HODExaminations';
import HODFacultyBoard from '../pages/hod/HODFacultyBoard';

// Dean Pages
import DeanDashboard from '../pages/dean/DeanDashboard';
import DeanRegistrations from '../pages/dean/DeanRegistrations';
import DeanAgenda from '../pages/dean/DeanAgenda';
import DeanExaminations from '../pages/dean/DeanExaminations';
import DeanWithdrawalRisk from '../pages/dean/DeanWithdrawalRisk';
import DeanDepartments from '../pages/dean/DeanDepartments';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import { AdminUsers } from '../pages/admin/Users';
import { AdminSubjects, AdminMedicalRequests, AdminSettings } from '../pages/admin/SubjectsAndSettings';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Root strictly loads login page directly per instructions: NO marketing/landing page */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Authenticated Student Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<StudentRoute />}>
          <Route path="/student" element={<StudentLayout />}>
            <Route index element={<Navigate to="/student/dashboard" replace />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="profile" element={<StudentProfile />} />
            <Route path="registration" element={<StudentRegistration />} />
            <Route path="attendance" element={<StudentAttendance />} />
            <Route path="medical" element={<StudentMedical />} />
            <Route path="examination" element={<StudentExamination />} />
            <Route path="results" element={<StudentResults />} />
            <Route path="gpa" element={<StudentGPA />} />
            <Route path="progress" element={<StudentProgress />} />
            <Route path="forms" element={<StudentForms />} />
            <Route path="forms/:id" element={<StudentFormDetail />} />
            <Route path="processes" element={<StudentProcesses />} />
            <Route path="processes/:id" element={<StudentProcessDetail />} />
            <Route path="welfare" element={<StudentWelfare />} />
            <Route path="societies" element={<StudentSocieties />} />
            <Route path="notifications" element={<StudentNotifications />} />
            <Route path="penalties" element={<StudentPenalties />} />
          </Route>
        </Route>

        {/* Authenticated Lecturer Routes */}
        <Route element={<LecturerRoute />}>
          <Route path="/lecturer" element={<LecturerLayout />}>
            <Route index element={<Navigate to="/lecturer/dashboard" replace />} />
            <Route path="dashboard" element={<LecturerDashboard />} />
            <Route path="courses" element={<LecturerCourses />} />
            <Route path="courses/:id" element={<LecturerCourseDetails />} />
            <Route path="attendance" element={<LecturerAttendance />} />
            <Route path="students" element={<LecturerCourses />} />
            <Route path="ca-marks" element={<LecturerCAMarks />} />
            <Route path="esa-marks" element={<LecturerESAMarks />} />
            <Route path="forms" element={<StudentForms />} />
            <Route path="profile" element={<LecturerProfile />} />
          </Route>
        </Route>

        {/* Authenticated HOD Routes */}
        <Route element={<HODRoute />}>
          <Route path="/hod" element={<HODLayout />}>
            <Route index element={<Navigate to="/hod/dashboard" replace />} />
            <Route path="dashboard" element={<HODDashboard />} />
            <Route path="registrations" element={<HODRegistrations />} />
            <Route path="attendance" element={<HODAttendance />} />
            <Route path="examinations" element={<HODExaminations />} />
            <Route path="board-prep" element={<HODExaminations />} />
            <Route path="escalations" element={<HODFacultyBoard />} />
          </Route>
        </Route>

        {/* Authenticated Dean Routes */}
        <Route element={<DeanRoute />}>
          <Route path="/dean" element={<DeanLayout />}>
            <Route index element={<Navigate to="/dean/dashboard" replace />} />
            <Route path="dashboard" element={<DeanDashboard />} />
            <Route path="registrations" element={<DeanRegistrations />} />
            <Route path="agenda" element={<DeanAgenda />} />
            <Route path="examinations" element={<DeanExaminations />} />
            <Route path="withdrawal-risk" element={<DeanWithdrawalRisk />} />
            <Route path="departments" element={<DeanDepartments />} />
          </Route>
        </Route>

        {/* Authenticated Admin Routes */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="subjects" element={<AdminSubjects />} />
            <Route path="medical" element={<AdminMedicalRequests />} />
            <Route path="processes" element={<StudentProcesses />} />
            <Route path="forms" element={<StudentForms />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Route>
      </Route>

      {/* Catch-all 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
