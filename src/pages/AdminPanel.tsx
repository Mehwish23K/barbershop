import React, { useEffect, useState } from 'react';
import { appointmentAPI } from '../services/api';
import { useSocket } from '../context/SocketContext';
import { Appointment, AppointmentStatus, StatsResponse } from '../types';

const AdminPanel: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState<StatsResponse>({ total: 0, pending: 0, confirmed: 0, completed: 0 });
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<AppointmentStatus | 'all'>('all');
  const { socket } = useSocket();

  useEffect(() => {
    loadAppointments();
    loadStats();
    
    // Join admin room for real-time updates
    if (socket) {
      socket.emit('join_admin');
      
      // Listen for real-time updates
      socket.on('new_appointment', (appointment: Appointment) => {
        setAppointments(prev => [appointment, ...prev]);
        loadStats(); // Refresh stats
      });
      
      socket.on('appointment_updated', ({ id, status }: { id: number; status: AppointmentStatus }) => {
        setAppointments(prev => 
          prev.map(apt => 
            apt.id === id ? { ...apt, status } : apt
          )
        );
        loadStats(); // Refresh stats
      });
      
      socket.on('appointment_deleted', ({ id }: { id: number }) => {
        setAppointments(prev => 
          prev.filter(apt => apt.id !== id)
        );
        loadStats(); // Refresh stats
      });
    }
    
    return () => {
      if (socket) {
        socket.off('new_appointment');
        socket.off('appointment_updated');
        socket.off('appointment_deleted');
      }
    };
  }, [socket]);

  const loadAppointments = async (): Promise<void> => {
    try {
      const response = await appointmentAPI.getAll();
      setAppointments(response.data.appointments);
    } catch (error) {
      console.error('Error loading appointments:', error);
    }
  };

  const loadStats = async (): Promise<void> => {
    try {
      const response = await appointmentAPI.getStats();
      setStats(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading stats:', error);
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (id: number, status: AppointmentStatus): Promise<void> => {
    try {
      await appointmentAPI.updateStatus(id, status);
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  const deleteAppointment = async (id: number): Promise<void> => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await appointmentAPI.delete(id);
      } catch (error) {
        console.error('Error deleting appointment:', error);
      }
    }
  };

  const filteredAppointments = appointments.filter(apt => {
    if (filter === 'all') return true;
    return apt.status === filter;
  });

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getStatusColor = (status: AppointmentStatus): string => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filterOptions: (AppointmentStatus | 'all')[] = ['all', 'pending', 'confirmed', 'completed', 'cancelled'];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-red-800">Loading admin panel...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-red-800 mb-2">Admin Panel</h1>
          <p className="text-gray-600">Manage barbershop appointments and view statistics</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Appointments</h3>
            <p className="text-3xl font-bold text-red-800">{stats.total || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Pending</h3>
            <p className="text-3xl font-bold text-yellow-600">{stats.pending || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Confirmed</h3>
            <p className="text-3xl font-bold text-green-600">{stats.confirmed || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Completed</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.completed || 0}</p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {filterOptions.map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium capitalize ${
                  filter === status 
                    ? 'bg-red-800 text-white' 
                    : 'bg-white text-gray-700 hover:bg-red-50'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Appointments Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              Appointments ({filteredAppointments.length})
            </h2>
          </div>
          
          {filteredAppointments.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No appointments found for the selected filter.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stylist
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAppointments.map((appointment) => (
                    <tr key={appointment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {appointment.email}
                          </div>
                          <div className="text-xs text-gray-500">
                            ID: {appointment.id}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {appointment.service}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {appointment.stylist}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(appointment.date)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {appointment.time}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {appointment.status === 'pending' && (
                            <button
                              onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                              className="text-green-600 hover:text-green-900"
                            >
                              Confirm
                            </button>
                          )}
                          {appointment.status === 'confirmed' && (
                            <button
                              onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Complete
                            </button>
                          )}
                          <button
                            onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                            className="text-yellow-600 hover:text-yellow-900"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => deleteAppointment(appointment.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;