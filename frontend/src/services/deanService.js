import api from './api';

export const deanService = {
  getDashboard: () => api.get('/dean/dashboard'),
  getRegistrations: (params) => api.get('/dean/registrations', params),
  approveIntake: (id) => api.post(`/dean/registrations/${id}/intake`, {}),
  getAgenda: (params) => api.get('/dean/agenda', params),
  createAgendaItem: (data) => api.post('/dean/agenda', data),
  updateAgendaItem: (id, data) => api.patch(`/dean/agenda/${id}`, data),
  getExamSchedules: () => api.get('/dean/exam-schedules'),
  createExamSchedule: (data) => api.post('/dean/exam-schedules', data),
  getWithdrawalRisk: () => api.get('/dean/withdrawal-risk'),
  getBoardOfExaminers: () => api.get('/dean/board-of-examiners'),
  getStaffDirectory: () => api.get('/dean/staff-directory'),
  publishAnnouncement: (data) => api.post('/dean/announcements', data)
};

export default deanService;
