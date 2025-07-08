import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const appointmentAPI = {
  // Get all appointments
  getAll: () => api.get('/appointments'),
  
  // Create a new appointment
  create: (appointmentData) => api.post('/appointments', appointmentData),
  
  // Update appointment status
  updateStatus: (id, status) => api.put(`/appointments/${id}`, { status }),
  
  // Delete appointment
  delete: (id) => api.delete(`/appointments/${id}`),
  
  // Get statistics
  getStats: () => api.get('/stats'),
};

export default api;