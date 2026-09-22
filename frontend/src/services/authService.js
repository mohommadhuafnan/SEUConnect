import api from './api';

export const authService = {
  login: async (email, password) => {
    return await api.post('/auth/login', { email, password });
  },
  getMe: async () => {
    return await api.get('/auth/me');
  },
  updateProfile: async (data) => {
    return await api.put('/auth/profile', data);
  },
  uploadProfileImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return await api.post('/auth/profile-image', formData);
  },
  removeProfileImage: async () => {
    return await api.delete('/auth/profile-image');
  }
};

export default authService;
