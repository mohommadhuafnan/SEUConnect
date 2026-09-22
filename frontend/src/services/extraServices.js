import api from './api';

export const formService = {
  getForms: (params) => api.get('/forms', params),
  getCategories: () => api.get('/forms/categories'),
  getFormById: (id) => api.get(`/forms/${id}`),
  createForm: (data) => api.post('/forms', data),
  updateForm: (id, data) => api.put(`/forms/${id}`, data),
  deleteForm: (id) => api.delete(`/forms/${id}`)
};

export const processService = {
  getProcesses: (params) => api.get('/processes', params),
  getProcessById: (id) => api.get(`/processes/${id}`),
  searchGuidance: (query) => api.get('/processes/guidance/search', { query }),
  createProcess: (data) => api.post('/processes', data),
  updateProcess: (id, data) => api.put(`/processes/${id}`, data),
  deleteProcess: (id) => api.delete(`/processes/${id}`)
};

export const aiService = {
  chat: (message) => api.post('/ai/chat', { message })
};
