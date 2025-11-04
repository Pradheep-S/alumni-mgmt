import { useState, useEffect } from 'react';
import { userService, eventService, mentorshipService } from '../services/apiService';

const AdminPanel = () => {
  const [stats, setStats] = useState({
    users: { total: 0, alumni: 0, students: 0, mentors: 0 },
    events: { total: 0, upcoming: 0 },
    mentorship: { total: 0, pending: 0, active: 0 }
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAdminStats();
  }, []);

  const loadAdminStats = async () => {
    try {
      // In a real implementation, you'd call admin-specific endpoints
      // For now, we'll simulate with dummy data
      setStats({
        users: { total: 1250, alumni: 1000, students: 200, mentors: 150 },
        events: { total: 45, upcoming: 12 },
        mentorship: { total: 320, pending: 25, active: 80 }
      });
    } catch (error) {
      console.error('Error loading admin stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="spinner mr-2"></div>
        <span>Loading admin dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage users, events, and system settings.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">User Statistics</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Users:</span>
              <span className="font-semibold">{stats.users.total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Alumni:</span>
              <span className="font-semibold">{stats.users.alumni}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Students:</span>
              <span className="font-semibold">{stats.users.students}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Mentors:</span>
              <span className="font-semibold">{stats.users.mentors}</span>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Event Statistics</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Events:</span>
              <span className="font-semibold">{stats.events.total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Upcoming:</span>
              <span className="font-semibold">{stats.events.upcoming}</span>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Mentorship Statistics</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Requests:</span>
              <span className="font-semibold">{stats.mentorship.total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pending:</span>
              <span className="font-semibold">{stats.mentorship.pending}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Active:</span>
              <span className="font-semibold">{stats.mentorship.active}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="btn-primary">Create Event</button>
          <button className="btn-secondary">Manage Users</button>
          <button className="btn-secondary">View Reports</button>
          <button className="btn-secondary">System Settings</button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;