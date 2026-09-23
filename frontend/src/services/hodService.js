import api from './api';

export const hodService = {
  getDashboard: () => api.get('/hod/dashboard'),
  getRegistrations: (params) => api.get('/hod/registrations', params),
  signRegistration: (id) => api.post(`/hod/registrations/${id}/sign`, {}),
  batchSignRegistrations: (ids) => api.post('/hod/registrations/batch-sign', { ids }),
  getAttendance: () => api.get('/hod/attendance'),
  getRepeatCandidates: () => api.get('/hod/repeat-candidates'),
  getBoardPrep: () => api.get('/hod/board-prep'),
  getEscalations: () => api.get('/hod/escalations'),
  createEscalation: (data) => api.post('/hod/escalate', data),
  getExamConsultations: () => api.get('/hod/exam-consultations'),
  submitExamFeedback: (id, data) => api.post(`/hod/exam-consultations/${id}/feedback`, data),
  sendBulkNotification: (data) => api.post('/hod/bulk-notify', data)
};

export default hodService;
