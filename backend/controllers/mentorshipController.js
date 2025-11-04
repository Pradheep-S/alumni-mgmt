const MentorshipRequest = require('../models/MentorshipRequest');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// @desc    Get mentorship requests (for mentor or mentee)
// @route   GET /api/mentorship
// @access  Private
const getMentorshipRequests = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let filter = {};

    // Filter by role
    if (req.query.role === 'mentor') {
      filter.mentor = req.user.id;
    } else if (req.query.role === 'mentee') {
      filter.mentee = req.user.id;
    } else {
      // Admin can see all, regular users see their own
      if (req.user.role !== 'admin') {
        filter.$or = [
          { mentor: req.user.id },
          { mentee: req.user.id }
        ];
      }
    }

    // Filter by status
    if (req.query.status) {
      filter.status = req.query.status;
    }

    // Filter by mentorship area
    if (req.query.area) {
      filter.mentorshipArea = req.query.area;
    }

    const requests = await MentorshipRequest.find(filter)
      .populate('mentor', 'firstName lastName email graduationYear department currentJob profilePicture')
      .populate('mentee', 'firstName lastName email graduationYear department profilePicture')
      .populate('followUpNotes.addedBy', 'firstName lastName')
      .sort({ requestedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await MentorshipRequest.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: requests.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      requests
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single mentorship request
// @route   GET /api/mentorship/:id
// @access  Private
const getMentorshipRequestById = async (req, res, next) => {
  try {
    const request = await MentorshipRequest.findById(req.params.id)
      .populate('mentor', 'firstName lastName email graduationYear department currentJob profilePicture linkedinProfile mentorshipAreas')
      .populate('mentee', 'firstName lastName email graduationYear department profilePicture')
      .populate('followUpNotes.addedBy', 'firstName lastName profilePicture');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Mentorship request not found'
      });
    }

    // Check if user is involved in this request or is admin
    if (req.user.role !== 'admin' && 
        request.mentor._id.toString() !== req.user.id && 
        request.mentee._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this request'
      });
    }

    res.status(200).json({
      success: true,
      request
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create mentorship request
// @route   POST /api/mentorship
// @access  Private
const createMentorshipRequest = async (req, res, next) => {
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

    const { mentor: mentorId } = req.body;

    // Check if mentor exists and is a mentor
    const mentor = await User.findById(mentorId);
    if (!mentor || !mentor.isMentor || !mentor.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Invalid mentor or mentor is not available'
      });
    }

    // Check if user is trying to request themselves as mentor
    if (mentorId === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot request mentorship from yourself'
      });
    }

    // Check if there's already a pending request between these users
    const existingRequest = await MentorshipRequest.findOne({
      mentor: mentorId,
      mentee: req.user.id,
      status: 'pending'
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: 'You already have a pending request with this mentor'
      });
    }

    // Add mentee to request body
    req.body.mentee = req.user.id;

    const request = await MentorshipRequest.create(req.body);

    // Populate the request
    await request.populate([
      { path: 'mentor', select: 'firstName lastName email' },
      { path: 'mentee', select: 'firstName lastName email' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Mentorship request created successfully',
      request
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Respond to mentorship request (Accept/Decline)
// @route   PUT /api/mentorship/:id/respond
// @access  Private (Mentor only)
const respondToRequest = async (req, res, next) => {
  try {
    const { status, mentorResponse } = req.body;

    if (!['accepted', 'declined'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be either "accepted" or "declined"'
      });
    }

    const request = await MentorshipRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Mentorship request not found'
      });
    }

    // Check if user is the mentor for this request
    if (request.mentor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only the mentor can respond to this request'
      });
    }

    // Check if request is still pending
    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'This request has already been responded to'
      });
    }

    request.status = status;
    request.mentorResponse = mentorResponse;
    request.respondedAt = new Date();

    await request.save();

    await request.populate([
      { path: 'mentor', select: 'firstName lastName email' },
      { path: 'mentee', select: 'firstName lastName email' }
    ]);

    res.status(200).json({
      success: true,
      message: `Request ${status} successfully`,
      request
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add follow-up note
// @route   POST /api/mentorship/:id/notes
// @access  Private (Mentor or Mentee involved in the request)
const addFollowUpNote = async (req, res, next) => {
  try {
    const { note } = req.body;

    if (!note || note.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Note is required'
      });
    }

    const request = await MentorshipRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Mentorship request not found'
      });
    }

    // Check if user is involved in this request
    if (request.mentor.toString() !== req.user.id && 
        request.mentee.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add notes to this request'
      });
    }

    request.followUpNotes.push({
      note: note.trim(),
      addedBy: req.user.id
    });

    await request.save();

    // Populate the new note
    await request.populate('followUpNotes.addedBy', 'firstName lastName');

    const newNote = request.followUpNotes[request.followUpNotes.length - 1];

    res.status(201).json({
      success: true,
      message: 'Follow-up note added successfully',
      note: newNote
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Schedule meeting
// @route   PUT /api/mentorship/:id/schedule
// @access  Private (Mentor or Mentee involved in the request)
const scheduleMeeting = async (req, res, next) => {
  try {
    const { dateTime, meetingLink, location, agenda } = req.body;

    const request = await MentorshipRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Mentorship request not found'
      });
    }

    // Check if user is involved in this request
    if (request.mentor.toString() !== req.user.id && 
        request.mentee.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to schedule meeting for this request'
      });
    }

    // Check if request is accepted
    if (request.status !== 'accepted') {
      return res.status(400).json({
        success: false,
        message: 'Can only schedule meetings for accepted requests'
      });
    }

    request.scheduledMeeting = {
      dateTime: new Date(dateTime),
      meetingLink,
      location,
      agenda
    };

    await request.save();

    res.status(200).json({
      success: true,
      message: 'Meeting scheduled successfully',
      scheduledMeeting: request.scheduledMeeting
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Complete mentorship and add rating
// @route   PUT /api/mentorship/:id/complete
// @access  Private (Mentor or Mentee involved in the request)
const completeMentorship = async (req, res, next) => {
  try {
    const { rating, feedback } = req.body;

    const request = await MentorshipRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Mentorship request not found'
      });
    }

    // Check if user is involved in this request
    if (request.mentor.toString() !== req.user.id && 
        request.mentee.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to complete this request'
      });
    }

    // Check if request is accepted
    if (request.status !== 'accepted') {
      return res.status(400).json({
        success: false,
        message: 'Can only complete accepted requests'
      });
    }

    // Add rating and feedback based on user role
    if (request.mentor.toString() === req.user.id) {
      request.rating.mentorRating = rating;
      request.rating.mentorFeedback = feedback;
    } else {
      request.rating.menteeRating = rating;
      request.rating.menteeFeedback = feedback;
    }

    // If both parties have provided ratings, mark as completed
    if (request.rating.mentorRating && request.rating.menteeRating) {
      request.status = 'completed';
    }

    await request.save();

    res.status(200).json({
      success: true,
      message: 'Rating submitted successfully',
      request
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get mentorship statistics (Admin only)
// @route   GET /api/mentorship/admin/stats
// @access  Private (Admin)
const getMentorshipStats = async (req, res, next) => {
  try {
    const totalRequests = await MentorshipRequest.countDocuments();
    const pendingRequests = await MentorshipRequest.countDocuments({ status: 'pending' });
    const acceptedRequests = await MentorshipRequest.countDocuments({ status: 'accepted' });
    const completedRequests = await MentorshipRequest.countDocuments({ status: 'completed' });
    
    // Requests by area
    const requestsByArea = await MentorshipRequest.aggregate([
      { $group: { _id: '$mentorshipArea', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Average ratings
    const averageRatings = await MentorshipRequest.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: null,
          avgMentorRating: { $avg: '$rating.mentorRating' },
          avgMenteeRating: { $avg: '$rating.menteeRating' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalRequests,
        pendingRequests,
        acceptedRequests,
        completedRequests,
        requestsByArea,
        averageRatings: averageRatings[0] || { avgMentorRating: 0, avgMenteeRating: 0 }
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMentorshipRequests,
  getMentorshipRequestById,
  createMentorshipRequest,
  respondToRequest,
  addFollowUpNote,
  scheduleMeeting,
  completeMentorship,
  getMentorshipStats
};