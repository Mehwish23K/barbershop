// Appointment related types
export interface Appointment {
  id: number;
  stylist: string;
  service: string;
  date: string;
  time: string;
  email: string;
  created_at: string;
  status: AppointmentStatus;
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface CreateAppointmentData {
  stylist: string;
  service: string;
  date: string;
  time: string;
  email: string;
}

// API Response types
export interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface AppointmentsResponse {
  appointments: Appointment[];
}

export interface StatsResponse {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
}

export interface CreateAppointmentResponse {
  success: boolean;
  message: string;
  appointment: Appointment;
}

// Socket event types
export interface SocketEvents {
  // Client to server events
  join_admin: () => void;
  
  // Server to client events
  new_appointment: (appointment: Appointment) => void;
  appointment_updated: (data: { id: number; status: AppointmentStatus }) => void;
  appointment_deleted: (data: { id: number }) => void;
}

// Component prop types
export interface SocketContextType {
  socket: any | null; // Socket.IO client instance
  connected: boolean;
}

// Form types
export interface BookingFormData {
  stylist: string;
  service: string;
  date: string;
  time: string;
  email: string;
}