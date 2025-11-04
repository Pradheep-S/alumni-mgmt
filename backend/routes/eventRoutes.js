const express = require('express');
const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  rsvpEvent,
  cancelRsvp,
  addComment,
  getEventStats
} = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { validateEvent } = require('../utils/validation');

const router = express.Router();

// All routes are protected
router.use(protect);

// Public event routes (for authenticated users)
router.get('/', getEvents);
router.get('/:id', getEventById);
router.post('/:id/rsvp', rsvpEvent);
router.delete('/:id/rsvp', cancelRsvp);
router.post('/:id/comments', addComment);

// Admin only routes
router.get('/admin/stats', authorize('admin'), getEventStats);

// Alumni and Admin can create, update, delete events
router.post('/', authorize('admin', 'alumni'), validateEvent, createEvent);
router.put('/:id', authorize('admin', 'alumni'), validateEvent, updateEvent);
router.delete('/:id', authorize('admin', 'alumni'), deleteEvent);

module.exports = router;