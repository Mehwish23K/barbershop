import axios, { AxiosResponse } from 'axios';
import { 
  Appointment, 
  CreateAppointmentData, 
  AppointmentsResponse, 
  StatsResponse, 
  CreateAppointmentResponse,
  AppointmentStatus
} from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const appointmentAPI = {
  // Get all appointments
  getAll: (): Promise<AxiosResponse<AppointmentsResponse>> => 
    api.get<AppointmentsResponse>('/appointments'),
  
  // Create a new appointment
  create: (appointmentData: CreateAppointmentData): Promise<AxiosResponse<CreateAppointmentResponse>> => 
    api.post<CreateAppointmentResponse>('/appointments', appointmentData),
  
  // Update appointment status
  updateStatus: (id: number, status: AppointmentStatus): Promise<AxiosResponse<{ success: boolean; message: string }>> => 
    api.put<{ success: boolean; message: string }>(`/appointments/${id}`, { status }),
  
  // Delete appointment
  delete: (id: number): Promise<AxiosResponse<{ success: boolean; message: string }>> => 
    api.delete<{ success: boolean; message: string }>(`/appointments/${id}`),
  
  // Get statistics
  getStats: (): Promise<AxiosResponse<StatsResponse>> => 
    api.get<StatsResponse>('/stats'),
};

export default api;