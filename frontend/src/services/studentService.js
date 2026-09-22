import api from './api';

export const studentService = {
  getDashboard: () => api.get('/student/dashboard'),
  getRegistration: () => api.get('/student/registration'),
  registerSubject: (subjectId) => api.post('/student/registration', { subjectId }),
  dropSubject: (subjectId) => api.post('/student/registration/drop', { subjectId }),
  getAttendance: () => api.get('/student/attendance'),
  getMedicalRequests: () => api.get('/student/medical'),
  submitMedicalRequest: (formData) => api.post('/student/medical', formData),
  getExaminations: () => api.get('/student/examination'),
  getResults: (semester) => api.get('/student/results', semester ? { semester } : null),
  getGPAData: () => api.get('/student/gpa'),
  getProgress: () => api.get('/student/progress'),
  getPenalties: () => api.get('/student/penalties'),
  getWelfare: (category) => api.get('/welfare', category ? { category } : null),
  getSocieties: () => api.get('/societies'),
  joinSociety: (societyId) => api.post('/societies/membership', { societyId }),
  getNotifications: () => api.get('/notifications'),
  markNotificationRead: (id) => api.put(`/notifications/${id}/read`, {})
};

export default studentService;
