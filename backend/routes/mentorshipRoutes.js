const express = require('express');
const {
  getMentorshipRequests,
  getMentorshipRequestById,
  createMentorshipRequest,
  respondToRequest,
  addFollowUpNote,
  scheduleMeeting,
  completeMentorship,
  getMentorshipStats
} = require('../controllers/mentorshipController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { validateMentorshipRequest } = require('../utils/validation');

const router = express.Router();

// All routes are protected
router.use(protect);

// General mentorship routes
router.get('/', getMentorshipRequests);
router.get('/:id', getMentorshipRequestById);
router.post('/', validateMentorshipRequest, createMentorshipRequest);
router.put('/:id/respond', respondToRequest);
router.post('/:id/notes', addFollowUpNote);
router.put('/:id/schedule', scheduleMeeting);
router.put('/:id/complete', completeMentorship);

// Admin only routes
router.get('/admin/stats', authorize('admin'), getMentorshipStats);

module.exports = router;