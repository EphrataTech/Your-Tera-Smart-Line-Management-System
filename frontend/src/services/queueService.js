import api from './api';

export const queueService = {
  getQueue: () => api.get('/queue'),
  joinQueue: (data) => api.post('/queue/join', data),
  leaveQueue: (id) => api.delete(`/queue/${id}`),
};