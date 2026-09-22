import api from './api';

export const adminService = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: (params) => api.get('/admin/users', params),
  createUser: (data) => api.post('/admin/users', data),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getMedicalRequests: (status) => api.get('/admin/medical', status ? { status } : null),
  updateMedicalStatus: (id, data) => api.put(`/admin/medical/${id}`, data),
  getAcademicRules: () => api.get('/admin/academic-rules'),
  updateAcademicRules: (rules) => api.put('/admin/academic-rules', rules),
  getSubjects: () => api.get('/academic/subjects'),
  createSubject: (data) => api.post('/academic/subjects', data),
  updateSubject: (id, data) => api.put(`/academic/subjects/${id}`, data),
  deleteSubject: (id) => api.delete(`/academic/subjects/${id}`),
  getSemesters: () => api.get('/academic/semesters'),
  createSemester: (data) => api.post('/academic/semesters', data),
  createNotification: (data) => api.post('/notifications', data)
};

export default adminService;
