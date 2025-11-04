const Event = require('../models/Event');
const { validationResult } = require('express-validator');

// @desc    Get all events
// @route   GET /api/events
// @access  Private
const getEvents = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    let filter = { isActive: true };

    // Filter by event type
    if (req.query.eventType) {
      filter.eventType = req.query.eventType;
    }

    // Filter by date range
    if (req.query.fromDate || req.query.toDate) {
      filter.eventDate = {};
      if (req.query.fromDate) {
        filter.eventDate.$gte = new Date(req.query.fromDate);
      }
      if (req.query.toDate) {
        filter.eventDate.$lte = new Date(req.query.toDate);
      }
    }

    // Show upcoming events only by default
    if (req.query.upcoming !== 'false') {
      filter.eventDate = { ...filter.eventDate, $gte: new Date() };
    }

    // Search events
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      filter.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { location: searchRegex },
        { tags: searchRegex }
      ];
    }

    // Sort by event date (ascending for upcoming, descending for past)
    const sortOrder = req.query.upcoming !== 'false' ? 1 : -1;

    const events = await Event.find(filter)
      .populate('organizer', 'firstName lastName email role')
      .populate('attendees.user', 'firstName lastName email role')
      .populate('comments.user', 'firstName lastName')
      .sort({ eventDate: sortOrder })
      .skip(skip)
      .limit(limit);

    const total = await Event.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: events.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      events
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Private
const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'firstName lastName email role')
      .populate('attendees.user', 'firstName lastName email role graduationYear department')
      .populate('comments.user', 'firstName lastName profilePicture');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.status(200).json({
      success: true,
      event
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new event
// @route   POST /api/events
// @access  Private (Admin)
const createEvent = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Add organizer to request body
    req.body.organizer = req.user.id;

    const event = await Event.create(req.body);

    // Populate organizer details
    await event.populate('organizer', 'firstName lastName email role');

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      event
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private (Admin or Event Organizer)
const updateEvent = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user is admin or event organizer
    if (req.user.role !== 'admin' && event.organizer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this event'
      });
    }

    event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('organizer', 'firstName lastName email role');

    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      event
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private (Admin or Event Organizer)
const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user is admin or event organizer
    if (req.user.role !== 'admin' && event.organizer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this event'
      });
    }

    // Soft delete
    await Event.findByIdAndUpdate(req.params.id, { isActive: false });

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    RSVP to event
// @route   POST /api/events/:id/rsvp
// @access  Private
const rsvpEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if registration is open
    if (!event.isRegistrationOpen) {
      return res.status(400).json({
        success: false,
        message: 'Registration is closed for this event'
      });
    }

    // Check if user already registered
    const existingAttendee = event.attendees.find(
      attendee => attendee.user.toString() === req.user.id
    );

    if (existingAttendee) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered for this event'
      });
    }

    // Check if event is full
    if (event.maxAttendees && event.attendeeCount >= event.maxAttendees) {
      return res.status(400).json({
        success: false,
        message: 'Event is full'
      });
    }

    // Add user to attendees
    event.attendees.push({
      user: req.user.id,
      status: 'registered'
    });

    await event.save();

    res.status(200).json({
      success: true,
      message: 'Successfully registered for event'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel RSVP for event
// @route   DELETE /api/events/:id/rsvp
// @access  Private
const cancelRsvp = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Find and remove user from attendees
    const attendeeIndex = event.attendees.findIndex(
      attendee => attendee.user.toString() === req.user.id
    );

    if (attendeeIndex === -1) {
      return res.status(400).json({
        success: false,
        message: 'You are not registered for this event'
      });
    }

    event.attendees.splice(attendeeIndex, 1);
    await event.save();

    res.status(200).json({
      success: true,
      message: 'Successfully cancelled registration'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add comment to event
// @route   POST /api/events/:id/comments
// @access  Private
const addComment = async (req, res, next) => {
  try {
    const { comment } = req.body;

    if (!comment || comment.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Comment is required'
      });
    }

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    event.comments.push({
      user: req.user.id,
      comment: comment.trim()
    });

    await event.save();

    // Populate the new comment
    await event.populate('comments.user', 'firstName lastName profilePicture');

    const newComment = event.comments[event.comments.length - 1];

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      comment: newComment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get event statistics (Admin only)
// @route   GET /api/events/admin/stats
// @access  Private (Admin)
const getEventStats = async (req, res, next) => {
  try {
    const totalEvents = await Event.countDocuments({ isActive: true });
    const upcomingEvents = await Event.countDocuments({ 
      isActive: true, 
      eventDate: { $gte: new Date() } 
    });
    
    // Events by type
    const eventsByType = await Event.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$eventType', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Total attendees
    const totalAttendees = await Event.aggregate([
      { $match: { isActive: true } },
      { $unwind: '$attendees' },
      { $group: { _id: null, total: { $sum: 1 } } }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalEvents,
        upcomingEvents,
        eventsByType,
        totalAttendees: totalAttendees[0]?.total || 0
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  rsvpEvent,
  cancelRsvp,
  addComment,
  getEventStats
};