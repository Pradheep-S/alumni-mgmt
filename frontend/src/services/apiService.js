import api from './api';

// User services
export const userService = {
  // Get all users (alumni directory)
  getUsers: (params = {}) => api.get('/users', { params }),
  
  // Get user by ID
  getUserById: (id) => api.get(`/users/${id}`),
  
  // Get mentors
  getMentors: (params = {}) => api.get('/users/mentors', { params }),
  
  // Update user profile
  updateProfile: (userData) => api.put('/auth/profile', userData),
  
  // Update user (admin only)
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  
  // Delete user (admin only)
  deleteUser: (id) => api.delete(`/users/${id}`),
  
  // Get user statistics (admin only)
  getUserStats: () => api.get('/users/admin/stats')
};

// Event services
export const eventService = {
  // Get all events
  getEvents: (params = {}) => api.get('/events', { params }),
  
  // Get event by ID
  getEventById: (id) => api.get(`/events/${id}`),
  
  // Create event (alumni and admin)
  createEvent: (eventData) => api.post('/events', eventData),
  
  // Update event (alumni and admin)
  updateEvent: (id, eventData) => api.put(`/events/${id}`, eventData),
  
  // Delete event (alumni and admin)
  deleteEvent: (id) => api.delete(`/events/${id}`),
  
  // RSVP to event
  rsvpEvent: (id) => api.post(`/events/${id}/rsvp`),
  
  // Cancel RSVP
  cancelRsvp: (id) => api.delete(`/events/${id}/rsvp`),
  
  // Add comment to event
  addComment: (id, comment) => api.post(`/events/${id}/comments`, { comment }),
  
  // Get event statistics (admin only)
  getEventStats: () => api.get('/events/admin/stats')
};

// Mentorship services
export const mentorshipService = {
  // Get mentorship requests
  getMentorshipRequests: (params = {}) => api.get('/mentorship', { params }),
  
  // Get mentorship request by ID
  getMentorshipRequestById: (id) => api.get(`/mentorship/${id}`),
  
  // Create mentorship request
  createMentorshipRequest: (requestData) => api.post('/mentorship', requestData),
  
  // Respond to mentorship request
  respondToRequest: (id, response) => api.put(`/mentorship/${id}/respond`, response),
  
  // Add follow-up note
  addFollowUpNote: (id, note) => api.post(`/mentorship/${id}/notes`, { note }),
  
  // Schedule meeting
  scheduleMeeting: (id, meetingData) => api.put(`/mentorship/${id}/schedule`, meetingData),
  
  // Complete mentorship
  completeMentorship: (id, rating) => api.put(`/mentorship/${id}/complete`, rating),
  
  // Get mentorship statistics (admin only)
  getMentorshipStats: () => api.get('/mentorship/admin/stats')
};