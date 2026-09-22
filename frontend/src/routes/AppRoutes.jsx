import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { ProtectedRoute, StudentRoute, LecturerRoute, AdminRoute } from './Guards';
import StudentLayout from '../layouts/StudentLayout';
import LecturerLayout from '../layouts/LecturerLayout';
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
