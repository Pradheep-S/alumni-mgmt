import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { eventService, userService, mentorshipService } from '../services/apiService';
import {
  UsersIcon,
  CalendarIcon,
  MessageCircleIcon,
  TrendingUpIcon,
  ClockIcon,
  MapPinIcon,
  UserPlusIcon,
  PlusIcon
} from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    upcomingEvents: 0,
    mentorshipRequests: 0,
    totalEvents: 0
  });
  const [recentEvents, setRecentEvents] = useState([]);
  const [recentMentorshipRequests, setRecentMentorshipRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showMentorForm, setShowMentorForm] = useState(false);
  const [mentorshipAreas, setMentorshipAreas] = useState([]);
  const [isBecomingMentor, setIsBecomingMentor] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Load stats and recent data in parallel
      const [eventsResponse, mentorshipResponse] = await Promise.all([
        eventService.getEvents({ limit: 5, upcoming: true }),
        mentorshipService.getMentorshipRequests({ limit: 5 })
      ]);

      setRecentEvents(eventsResponse.data.events || []);
      setRecentMentorshipRequests(mentorshipResponse.data.requests || []);

      // Calculate basic stats
      setStats({
        totalUsers: 0, // This would need a separate endpoint or be included in a dashboard stats endpoint
        upcomingEvents: eventsResponse.data.total || 0,
        mentorshipRequests: mentorshipResponse.data.total || 0,
        totalEvents: eventsResponse.data.total || 0
      });

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Error loading dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getMentorshipStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'declined': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleBecomeMentor = async () => {
    if (mentorshipAreas.length === 0) {
      toast.error('Please add at least one mentorship area');
      return;
    }

    try {
      setIsBecomingMentor(true);
      const response = await updateProfile({
        isMentor: true,
        mentorshipAreas: mentorshipAreas
      });

      if (response.success) {
        toast.success('You are now a mentor! Students can find you in the alumni directory.');
        setShowMentorForm(false);
      } else {
        toast.error(response.message || 'Failed to become a mentor');
      }
    } catch (error) {
      console.error('Error becoming mentor:', error);
      toast.error('Failed to become a mentor. Please try again.');
    } finally {
      setIsBecomingMentor(false);
    }
  };

  const addMentorshipArea = () => {
    setMentorshipAreas([...mentorshipAreas, '']);
  };

  const updateMentorshipArea = (index, value) => {
    const newAreas = [...mentorshipAreas];
    newAreas[index] = value;
    setMentorshipAreas(newAreas);
  };

  const removeMentorshipArea = (index) => {
    setMentorshipAreas(mentorshipAreas.filter((_, i) => i !== index));
  };

  const handleCreateEvent = () => {
    navigate('/events/create');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="spinner mr-2"></div>
        <span>Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-16 w-16 bg-primary-500 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-white">
                  {user?.firstName?.[0]?.toUpperCase()}{user?.lastName?.[0]?.toUpperCase()}
                </span>
              </div>
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-gray-900">
                {getGreeting()}, {user?.firstName}!
              </h1>
              <p className="text-gray-600">
                Welcome back to Alumni Connect. Here's what's happening in your network.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CalendarIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 truncate">Upcoming Events</p>
                <p className="text-2xl font-bold text-gray-900">{stats.upcomingEvents}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <MessageCircleIcon className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 truncate">Mentorship Requests</p>
                <p className="text-2xl font-bold text-gray-900">{stats.mentorshipRequests}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UsersIcon className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 truncate">Network Size</p>
                <p className="text-2xl font-bold text-gray-900">5,000+</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUpIcon className="h-8 w-8 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 truncate">Your Role</p>
                <p className="text-lg font-bold text-gray-900 capitalize">{user?.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg">
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/alumni"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <UsersIcon className="h-6 w-6 text-primary-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Browse Alumni</p>
                <p className="text-sm text-gray-500">Connect with fellow graduates</p>
              </div>
            </Link>

            <Link
              to="/events"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <CalendarIcon className="h-6 w-6 text-primary-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">View Events</p>
                <p className="text-sm text-gray-500">Join upcoming gatherings</p>
              </div>
            </Link>

            {/* Alumni-specific actions */}
            {user?.role === 'alumni' && (
              <>
                {!user?.isMentor ? (
                  <div 
                    onClick={() => setShowMentorForm(true)}
                    className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <MessageCircleIcon className="h-6 w-6 text-green-600 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">Become a Mentor</p>
                      <p className="text-sm text-gray-500">Share your expertise with students</p>
                    </div>
                  </div>
                ) : (
                  <Link
                    to="/mentorship"
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <MessageCircleIcon className="h-6 w-6 text-green-600 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">My Mentorship</p>
                      <p className="text-sm text-gray-500">Manage your mentorship requests</p>
                    </div>
                  </Link>
                )}

                <div 
                  onClick={handleCreateEvent}
                  className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <PlusIcon className="h-6 w-6 text-blue-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Create Event</p>
                    <p className="text-sm text-gray-500">Plan and organize gatherings</p>
                  </div>
                </div>
              </>
            )}

            {/* Student-specific actions */}
            {user?.role === 'student' && (
              <Link
                to="/alumni"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <MessageCircleIcon className="h-6 w-6 text-primary-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Find a Mentor</p>
                  <p className="text-sm text-gray-500">Get guidance from alumni mentors</p>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Events */}
        <div className="bg-white shadow rounded-lg">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Upcoming Events</h2>
              <Link to="/events" className="text-sm text-primary-600 hover:text-primary-500">
                View all
              </Link>
            </div>
          </div>
          <div className="p-6">
            {recentEvents.length > 0 ? (
              <div className="space-y-4">
                {recentEvents.slice(0, 3).map((event) => (
                  <div key={event._id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 bg-primary-100 rounded-lg flex items-center justify-center">
                        <CalendarIcon className="h-5 w-5 text-primary-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {event.title}
                      </p>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <ClockIcon className="h-3 w-3 mr-1" />
                        {formatDate(event.eventDate)} at {event.eventTime}
                      </div>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <MapPinIcon className="h-3 w-3 mr-1" />
                        {event.location}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No upcoming events</p>
            )}
          </div>
        </div>

        {/* Recent Mentorship Activity */}
        <div className="bg-white shadow rounded-lg">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Recent Mentorship Activity</h2>
              <Link to="/mentorship" className="text-sm text-primary-600 hover:text-primary-500">
                View all
              </Link>
            </div>
          </div>
          <div className="p-6">
            {recentMentorshipRequests.length > 0 ? (
              <div className="space-y-4">
                {recentMentorshipRequests.slice(0, 3).map((request) => (
                  <div key={request._id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <MessageCircleIcon className="h-5 w-5 text-green-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {request.subject}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {request.mentor?._id === user?.id ? 'From' : 'To'}: {' '}
                        {request.mentor?._id === user?.id 
                          ? `${request.mentee?.firstName} ${request.mentee?.lastName}`
                          : `${request.mentor?.firstName} ${request.mentor?.lastName}`
                        }
                      </p>
                      <div className="mt-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getMentorshipStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No recent mentorship activity</p>
            )}
          </div>
        </div>
      </div>

      {/* Profile Completion */}
      {(!user?.department || !user?.graduationYear || !user?.bio) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-center">
            <UserPlusIcon className="h-6 w-6 text-yellow-600 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-yellow-800">Complete Your Profile</h3>
              <p className="text-yellow-700 mt-1">
                Add more information to your profile to help other alumni find and connect with you.
              </p>
              <Link
                to="/profile"
                className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-yellow-800 bg-yellow-100 hover:bg-yellow-200 transition-colors"
              >
                Update Profile
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Become a Mentor Modal */}
      {showMentorForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Become a Mentor</h3>
            <p className="text-gray-600 mb-4">
              Share your expertise and help students succeed. Add the areas where you can provide mentorship.
            </p>
            
            <div className="space-y-3 mb-4">
              {mentorshipAreas.map((area, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={area}
                    onChange={(e) => updateMentorshipArea(index, e.target.value)}
                    placeholder="e.g., Software Development, Career Guidance"
                    className="flex-1 form-input"
                  />
                  <button
                    onClick={() => removeMentorshipArea(index)}
                    className="text-red-600 hover:text-red-500"
                  >
                    Remove
                  </button>
                </div>
              ))}
              
              <button
                onClick={addMentorshipArea}
                className="w-full p-2 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
              >
                + Add Mentorship Area
              </button>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowMentorForm(false);
                  setMentorshipAreas([]);
                }}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleBecomeMentor}
                disabled={isBecomingMentor || mentorshipAreas.length === 0}
                className="flex-1 btn-primary disabled:opacity-50"
              >
                {isBecomingMentor ? 'Becoming Mentor...' : 'Become a Mentor'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;