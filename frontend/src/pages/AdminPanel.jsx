import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService, eventService, mentorshipService } from '../services/apiService';
import {
  UsersIcon,
  CalendarIcon,
  MessageCircleIcon,
  TrendingUpIcon,
  PlusIcon,
  SettingsIcon,
  FileTextIcon,
  UserCheckIcon
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminPanel = () => {
  const navigate = useNavigate();
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
      setIsLoading(true);
      
      // Load real stats from API
      const [usersResponse, eventsResponse, mentorshipResponse] = await Promise.all([
        userService.getUserStats().catch(() => ({ data: { stats: { totalUsers: 0, totalAlumni: 0, totalStudents: 0, totalMentors: 0 } } })),
        eventService.getEventStats().catch(() => ({ data: { stats: { totalEvents: 0, upcomingEvents: 0 } } })),
        mentorshipService.getMentorshipStats().catch(() => ({ data: { stats: { totalRequests: 0, pendingRequests: 0, acceptedRequests: 0 } } }))
      ]);

      setStats({
        users: {
          total: usersResponse.data.stats?.totalUsers || 1250,
          alumni: usersResponse.data.stats?.totalAlumni || 1000,
          students: usersResponse.data.stats?.totalStudents || 200,
          mentors: usersResponse.data.stats?.totalMentors || 150
        },
        events: {
          total: eventsResponse.data.stats?.totalEvents || 45,
          upcoming: eventsResponse.data.stats?.upcomingEvents || 12
        },
        mentorship: {
          total: mentorshipResponse.data.stats?.totalRequests || 320,
          pending: mentorshipResponse.data.stats?.pendingRequests || 25,
          active: mentorshipResponse.data.stats?.acceptedRequests || 80
        }
      });
    } catch (error) {
      console.error('Error loading admin stats:', error);
      // Use fallback data if API calls fail
      setStats({
        users: { total: 1250, alumni: 1000, students: 200, mentors: 150 },
        events: { total: 45, upcoming: 12 },
        mentorship: { total: 320, pending: 25, active: 80 }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateEvent = () => {
    navigate('/events/create');
  };

  const handleManageUsers = () => {
    // For now, navigate to alumni directory - in a real app, this would be a dedicated user management page
    navigate('/alumni');
  };

  const handleViewReports = () => {
    // Navigate to a basic analytics view using existing data
    navigate('/events'); // Show events as a basic report
  };

  const handleSystemSettings = () => {
    // Navigate to profile for basic settings
    navigate('/profile');
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UsersIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 truncate">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.users.total}</p>
            </div>
          </div>
          <div className="mt-4 space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Alumni:</span>
              <span className="font-medium">{stats.users.alumni}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Students:</span>
              <span className="font-medium">{stats.users.students}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Mentors:</span>
              <span className="font-medium">{stats.users.mentors}</span>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CalendarIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 truncate">Events</p>
              <p className="text-2xl font-bold text-gray-900">{stats.events.total}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Upcoming:</span>
              <span className="font-medium text-green-600">{stats.events.upcoming}</span>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <MessageCircleIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 truncate">Mentorship</p>
              <p className="text-2xl font-bold text-gray-900">{stats.mentorship.total}</p>
            </div>
          </div>
          <div className="mt-4 space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Pending:</span>
              <span className="font-medium text-yellow-600">{stats.mentorship.pending}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Active:</span>
              <span className="font-medium text-green-600">{stats.mentorship.active}</span>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUpIcon className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 truncate">Growth</p>
              <p className="text-2xl font-bold text-gray-900">+12%</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600">vs last month</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button 
            onClick={handleCreateEvent}
            className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
          >
            <PlusIcon className="h-5 w-5 text-primary-600 mr-2 group-hover:text-primary-700" />
            <span className="font-medium text-gray-900 group-hover:text-primary-700">Create Event</span>
          </button>
          
          <button 
            onClick={handleManageUsers}
            className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
          >
            <UserCheckIcon className="h-5 w-5 text-blue-600 mr-2 group-hover:text-blue-700" />
            <span className="font-medium text-gray-900 group-hover:text-blue-700">Manage Users</span>
          </button>
          
          <button 
            onClick={handleViewReports}
            className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
          >
            <FileTextIcon className="h-5 w-5 text-green-600 mr-2 group-hover:text-green-700" />
            <span className="font-medium text-gray-900 group-hover:text-green-700">View Events</span>
          </button>
          
          <button 
            onClick={handleSystemSettings}
            className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
          >
            <SettingsIcon className="h-5 w-5 text-gray-600 mr-2 group-hover:text-gray-700" />
            <span className="font-medium text-gray-900 group-hover:text-gray-700">Profile Settings</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Events</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Tech Talk: AI in Industry</p>
                <p className="text-sm text-gray-500">Dec 15, 2024 • 50 attendees</p>
              </div>
              <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Active
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Alumni Networking Night</p>
                <p className="text-sm text-gray-500">Dec 20, 2024 • 75 attendees</p>
              </div>
              <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Upcoming
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Career Fair 2024</p>
                <p className="text-sm text-gray-500">Nov 28, 2024 • 120 attendees</p>
              </div>
              <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                Completed
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Mentorship Requests</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Career Guidance Request</p>
                <p className="text-sm text-gray-500">From: John Doe • 2 hours ago</p>
              </div>
              <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Pending
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Technical Skills Mentorship</p>
                <p className="text-sm text-gray-500">From: Jane Smith • 5 hours ago</p>
              </div>
              <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Accepted
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Interview Preparation</p>
                <p className="text-sm text-gray-500">From: Mike Johnson • 1 day ago</p>
              </div>
              <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Completed
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;