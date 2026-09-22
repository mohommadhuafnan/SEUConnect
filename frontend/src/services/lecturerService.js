import api from './api';

export const lecturerService = {
  getDashboard: () => api.get('/lecturer/dashboard'),
  getCourses: () => api.get('/lecturer/courses'),
  getCourseStudents: (courseId) => api.get(`/lecturer/courses/${courseId}/students`),
  saveAttendance: (data) => api.post('/lecturer/attendance', data),
  saveCAMarks: (data) => api.post('/lecturer/ca-marks', data),
  saveESAMarks: (data) => api.post('/lecturer/esa-marks', data)
};

export default lecturerService;
