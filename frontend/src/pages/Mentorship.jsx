import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mentorshipService, userService } from '../services/apiService';
import {
  UsersIcon,
  MessageCircleIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  StarIcon,
  PlusIcon,
  FilterIcon,
  SearchIcon,
  MapPinIcon,
  VideoIcon,
  PhoneIcon,
  MailIcon,
  MessageSquareIcon
} from 'lucide-react';
import toast from 'react-hot-toast';

const Mentorship = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [requests, setRequests] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [showResponseForm, setShowResponseForm] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    area: '',
    search: ''
  });

  // Form states
  const [requestForm, setRequestForm] = useState({
    mentor: '',
    subject: '',
    message: '',
    mentorshipArea: 'career-guidance',
    preferredMeetingType: 'video-call',
    urgency: 'medium',
    expectedDuration: '1-hour',
    preferredTimeSlots: []
  });

  const [responseForm, setResponseForm] = useState({
    status: 'accepted',
    mentorResponse: ''
  });

  const mentorshipAreas = [
    { value: 'career-guidance', label: 'Career Guidance' },
    { value: 'technical-skills', label: 'Technical Skills' },
    { value: 'entrepreneurship', label: 'Entrepreneurship' },
    { value: 'interview-preparation', label: 'Interview Preparation' },
    { value: 'networking', label: 'Networking' },
    { value: 'industry-insights', label: 'Industry Insights' },
    { value: 'personal-development', label: 'Personal Development' },
    { value: 'academic-guidance', label: 'Academic Guidance' },
    { value: 'other', label: 'Other' }
  ];

  const meetingTypes = [
    { value: 'video-call', label: 'Video Call', icon: VideoIcon },
    { value: 'phone-call', label: 'Phone Call', icon: PhoneIcon },
    { value: 'in-person', label: 'In Person', icon: MapPinIcon },
    { value: 'email', label: 'Email', icon: MailIcon },
    { value: 'chat', label: 'Chat', icon: MessageSquareIcon }
  ];

  useEffect(() => {
    loadData();
  }, [activeTab, filters]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      if (activeTab === 'find-mentors') {
        const mentorsResponse = await userService.getMentors({
          search: filters.search,
          area: filters.area
        });
        setMentors(mentorsResponse.data.mentors || []);
      } else {
        const requestsResponse = await mentorshipService.getMentorshipRequests({
          status: filters.status,
          area: filters.area
        });
        setRequests(requestsResponse.data.requests || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    
    if (!requestForm.mentor || !requestForm.subject || !requestForm.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const response = await mentorshipService.createMentorshipRequest(requestForm);
      
      if (response.success) {
        toast.success('Mentorship request sent successfully!');
        setShowRequestForm(false);
        setRequestForm({
          mentor: '',
          subject: '',
          message: '',
          mentorshipArea: 'career-guidance',
          preferredMeetingType: 'video-call',
          urgency: 'medium',
          expectedDuration: '1-hour',
          preferredTimeSlots: []
        });
        setActiveTab('my-requests');
        loadData();
      }
    } catch (error) {
      console.error('Error creating request:', error);
      toast.error(error.response?.data?.message || 'Failed to create request');
    }
  };

  const handleRespondToRequest = async (requestId) => {
    try {
      const response = await mentorshipService.respondToRequest(requestId, responseForm);
      
      if (response.success) {
        toast.success(`Request ${responseForm.status} successfully!`);
        setShowResponseForm(null);
        setResponseForm({ status: 'accepted', mentorResponse: '' });
        loadData();
      }
    } catch (error) {
      console.error('Error responding to request:', error);
      toast.error(error.response?.data?.message || 'Failed to respond to request');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'declined': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="spinner mr-2"></div>
        <span>Loading mentorship data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900">Mentorship Center</h1>
        <p className="text-gray-600 mt-2">
          Connect with mentors, share knowledge, and grow together in our alumni community.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            
            {user?.role !== 'admin' && (
              <>
                <button
                  onClick={() => setActiveTab('find-mentors')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'find-mentors'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Find Mentors
                </button>
                
                <button
                  onClick={() => setActiveTab('my-requests')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'my-requests'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  My Requests
                </button>
                
                {user?.isMentor && (
                  <button
                    onClick={() => setActiveTab('mentor-requests')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'mentor-requests'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Mentor Requests
                  </button>
                )}
              </>
            )}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                  <div className="flex items-center">
                    <UsersIcon className="h-8 w-8 mr-3" />
                    <div>
                      <p className="text-sm opacity-90">Total Mentors</p>
                      <p className="text-2xl font-bold">{mentors.length || '150+'}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                  <div className="flex items-center">
                    <MessageCircleIcon className="h-8 w-8 mr-3" />
                    <div>
                      <p className="text-sm opacity-90">Active Sessions</p>
                      <p className="text-2xl font-bold">{requests.filter(r => r.status === 'accepted').length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                  <div className="flex items-center">
                    <CheckCircleIcon className="h-8 w-8 mr-3" />
                    <div>
                      <p className="text-sm opacity-90">Completed</p>
                      <p className="text-2xl font-bold">{requests.filter(r => r.status === 'completed').length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
                  <div className="flex items-center">
                    <ClockIcon className="h-8 w-8 mr-3" />
                    <div>
                      <p className="text-sm opacity-90">Pending</p>
                      <p className="text-2xl font-bold">{requests.filter(r => r.status === 'pending').length}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    <UsersIcon className="h-5 w-5 inline mr-2" />
                    Find a Mentor
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Browse our network of experienced alumni who are ready to share their knowledge and guide you in your career journey.
                  </p>
                  <button
                    onClick={() => setActiveTab('find-mentors')}
                    className="btn-primary"
                  >
                    Browse Mentors
                  </button>
                </div>

                {user?.role === 'alumni' && !user?.isMentor && (
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      <StarIcon className="h-5 w-5 inline mr-2" />
                      Become a Mentor
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Share your expertise and help students and fellow alumni grow. Make a meaningful impact in someone's career.
                    </p>
                    <Link to="/profile" className="btn-secondary">
                      Update Profile
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Find Mentors Tab */}
          {activeTab === 'find-mentors' && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex-1 min-w-0">
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search mentors..."
                      className="pl-10 form-input"
                      value={filters.search}
                      onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    />
                  </div>
                </div>
                
                <select
                  className="form-input w-auto"
                  value={filters.area}
                  onChange={(e) => setFilters({ ...filters, area: e.target.value })}
                >
                  <option value="">All Areas</option>
                  {mentorshipAreas.map(area => (
                    <option key={area.value} value={area.value}>
                      {area.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Mentors Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mentors.map((mentor) => (
                  <div key={mentor._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-16 w-16 bg-primary-500 rounded-full flex items-center justify-center">
                          <span className="text-lg font-bold text-white">
                            {mentor.firstName[0]}{mentor.lastName[0]}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {mentor.firstName} {mentor.lastName}
                        </h3>
                        <div className="flex items-center mt-1">
                          <StarIcon className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="text-sm text-yellow-600 font-medium">Mentor</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      {mentor.currentJob?.title && mentor.currentJob?.company && (
                        <p className="text-sm text-gray-600">
                          {mentor.currentJob.title} at {mentor.currentJob.company}
                        </p>
                      )}
                      
                      {mentor.graduationYear && mentor.department && (
                        <p className="text-sm text-gray-600">
                          Class of {mentor.graduationYear} • {mentor.department}
                        </p>
                      )}
                    </div>

                    {mentor.mentorshipAreas && mentor.mentorshipAreas.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-900 mb-2">Expertise:</p>
                        <div className="flex flex-wrap gap-1">
                          {mentor.mentorshipAreas.slice(0, 3).map((area, index) => (
                            <span
                              key={index}
                              className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                            >
                              {area}
                            </span>
                          ))}
                          {mentor.mentorshipAreas.length > 3 && (
                            <span className="text-xs text-gray-500">
                              +{mentor.mentorshipAreas.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="mt-4">
                      <button
                        onClick={() => {
                          setRequestForm({ ...requestForm, mentor: mentor._id });
                          setShowRequestForm(true);
                        }}
                        className="w-full btn-primary text-sm"
                      >
                        Request Mentorship
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {mentors.length === 0 && (
                <div className="text-center py-12">
                  <UsersIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No mentors found matching your criteria.</p>
                </div>
              )}
            </div>
          )}

          {/* My Requests Tab */}
          {activeTab === 'my-requests' && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="flex gap-4 items-center">
                <select
                  className="form-input w-auto"
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="declined">Declined</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {/* Requests List */}
              <div className="space-y-4">
                {requests.filter(req => req.mentee._id === user.id).map((request) => (
                  <div key={request._id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-medium text-gray-900">
                            {request.subject}
                          </h3>
                          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                            {request.status}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 mt-2">{request.message}</p>
                        
                        <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                          <span>To: {request.mentor.firstName} {request.mentor.lastName}</span>
                          <span>•</span>
                          <span>{formatDate(request.requestedAt)}</span>
                          <span>•</span>
                          <span className="capitalize">{request.mentorshipArea.replace('-', ' ')}</span>
                        </div>

                        {request.mentorResponse && (
                          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm font-medium text-gray-900 mb-1">Mentor Response:</p>
                            <p className="text-sm text-gray-600">{request.mentorResponse}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {requests.filter(req => req.mentee._id === user.id).length === 0 && (
                <div className="text-center py-12">
                  <MessageCircleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">You haven't made any mentorship requests yet.</p>
                  <button
                    onClick={() => setActiveTab('find-mentors')}
                    className="mt-4 btn-primary"
                  >
                    Find a Mentor
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mentor Requests Tab */}
          {activeTab === 'mentor-requests' && user?.isMentor && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="flex gap-4 items-center">
                <select
                  className="form-input w-auto"
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="declined">Declined</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {/* Requests List */}
              <div className="space-y-4">
                {requests.filter(req => req.mentor._id === user.id).map((request) => (
                  <div key={request._id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-medium text-gray-900">
                            {request.subject}
                          </h3>
                          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                            {request.status}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 mt-2">{request.message}</p>
                        
                        <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                          <span>From: {request.mentee.firstName} {request.mentee.lastName}</span>
                          <span>•</span>
                          <span>{formatDate(request.requestedAt)}</span>
                          <span>•</span>
                          <span className="capitalize">{request.mentorshipArea.replace('-', ' ')}</span>
                        </div>

                        <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                          <span>Preferred: {request.preferredMeetingType.replace('-', ' ')}</span>
                          <span>•</span>
                          <span>Duration: {request.expectedDuration}</span>
                          <span>•</span>
                          <span className="capitalize">Priority: {request.urgency}</span>
                        </div>
                      </div>

                      {request.status === 'pending' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setShowResponseForm(request._id)}
                            className="btn-primary text-sm"
                          >
                            Respond
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {requests.filter(req => req.mentor._id === user.id).length === 0 && (
                <div className="text-center py-12">
                  <MessageCircleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No mentorship requests yet.</p>
                  <p className="text-gray-400 text-sm mt-2">Students will be able to find and request mentorship from you.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Request Mentorship Modal */}
      {showRequestForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-screen overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Request Mentorship</h3>
            
            <form onSubmit={handleCreateRequest} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  value={requestForm.subject}
                  onChange={(e) => setRequestForm({ ...requestForm, subject: e.target.value })}
                  placeholder="Brief description of what you need help with"
                  className="form-input"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  value={requestForm.message}
                  onChange={(e) => setRequestForm({ ...requestForm, message: e.target.value })}
                  placeholder="Explain in detail what kind of mentorship you're looking for..."
                  rows={4}
                  className="form-input"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mentorship Area
                  </label>
                  <select
                    value={requestForm.mentorshipArea}
                    onChange={(e) => setRequestForm({ ...requestForm, mentorshipArea: e.target.value })}
                    className="form-input"
                  >
                    {mentorshipAreas.map(area => (
                      <option key={area.value} value={area.value}>
                        {area.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Meeting Type
                  </label>
                  <select
                    value={requestForm.preferredMeetingType}
                    onChange={(e) => setRequestForm({ ...requestForm, preferredMeetingType: e.target.value })}
                    className="form-input"
                  >
                    {meetingTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Urgency
                  </label>
                  <select
                    value={requestForm.urgency}
                    onChange={(e) => setRequestForm({ ...requestForm, urgency: e.target.value })}
                    className="form-input"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expected Duration
                  </label>
                  <select
                    value={requestForm.expectedDuration}
                    onChange={(e) => setRequestForm({ ...requestForm, expectedDuration: e.target.value })}
                    className="form-input"
                  >
                    <option value="30-minutes">30 minutes</option>
                    <option value="1-hour">1 hour</option>
                    <option value="1-2-hours">1-2 hours</option>
                    <option value="multiple-sessions">Multiple sessions</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowRequestForm(false);
                    setRequestForm({
                      mentor: '',
                      subject: '',
                      message: '',
                      mentorshipArea: 'career-guidance',
                      preferredMeetingType: 'video-call',
                      urgency: 'medium',
                      expectedDuration: '1-hour',
                      preferredTimeSlots: []
                    });
                  }}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary"
                >
                  Send Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Response Modal */}
      {showResponseForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Respond to Request</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Response
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="status"
                      value="accepted"
                      checked={responseForm.status === 'accepted'}
                      onChange={(e) => setResponseForm({ ...responseForm, status: e.target.value })}
                      className="mr-2"
                    />
                    Accept this request
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="status"
                      value="declined"
                      checked={responseForm.status === 'declined'}
                      onChange={(e) => setResponseForm({ ...responseForm, status: e.target.value })}
                      className="mr-2"
                    />
                    Decline this request
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message (Optional)
                </label>
                <textarea
                  value={responseForm.mentorResponse}
                  onChange={(e) => setResponseForm({ ...responseForm, mentorResponse: e.target.value })}
                  placeholder="Add a personal message..."
                  rows={3}
                  className="form-input"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowResponseForm(null);
                    setResponseForm({ status: 'accepted', mentorResponse: '' });
                  }}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleRespondToRequest(showResponseForm)}
                  className="flex-1 btn-primary"
                >
                  Send Response
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mentorship;