const mongoose = require('mongoose');

const mentorshipRequestSchema = new mongoose.Schema({
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Mentor is required']
  },
  mentee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Mentee is required']
  },
  subject: {
    type: String,
    required: [true, 'Please provide a subject for the mentorship request'],
    trim: true,
    maxlength: [200, 'Subject cannot be more than 200 characters']
  },
  message: {
    type: String,
    required: [true, 'Please provide a message explaining your mentorship request'],
    trim: true,
    maxlength: [1000, 'Message cannot be more than 1000 characters']
  },
  mentorshipArea: {
    type: String,
    required: [true, 'Please specify the area of mentorship'],
    trim: true,
    enum: [
      'career-guidance',
      'technical-skills',
      'entrepreneurship',
      'interview-preparation',
      'networking',
      'industry-insights',
      'personal-development',
      'academic-guidance',
      'other'
    ]
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined', 'completed', 'cancelled'],
    default: 'pending'
  },
  requestedAt: {
    type: Date,
    default: Date.now
  },
  respondedAt: {
    type: Date
  },
  mentorResponse: {
    type: String,
    trim: true,
    maxlength: [500, 'Response cannot be more than 500 characters']
  },
  preferredMeetingType: {
    type: String,
    enum: ['video-call', 'phone-call', 'in-person', 'email', 'chat'],
    default: 'video-call'
  },
  preferredTimeSlots: [{
    day: {
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    },
    timeSlot: {
      type: String,
      enum: ['morning', 'afternoon', 'evening']
    }
  }],
  urgency: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  expectedDuration: {
    type: String,
    enum: ['30-minutes', '1-hour', '1-2-hours', 'multiple-sessions'],
    default: '1-hour'
  },
  followUpNotes: [{
    note: {
      type: String,
      required: true,
      trim: true,
      maxlength: [500, 'Note cannot be more than 500 characters']
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  scheduledMeeting: {
    dateTime: {
      type: Date
    },
    meetingLink: {
      type: String,
      trim: true
    },
    location: {
      type: String,
      trim: true
    },
    agenda: {
      type: String,
      trim: true,
      maxlength: [500, 'Agenda cannot be more than 500 characters']
    }
  },
  rating: {
    mentorRating: {
      type: Number,
      min: 1,
      max: 5
    },
    menteeRating: {
      type: Number,
      min: 1,
      max: 5
    },
    mentorFeedback: {
      type: String,
      trim: true,
      maxlength: [500, 'Feedback cannot be more than 500 characters']
    },
    menteeFeedback: {
      type: String,
      trim: true,
      maxlength: [500, 'Feedback cannot be more than 500 characters']
    }
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }]
}, {
  timestamps: true
});

// Compound index to prevent duplicate requests
mentorshipRequestSchema.index({ mentor: 1, mentee: 1, status: 1 });

// Index for better query performance
mentorshipRequestSchema.index({ mentor: 1, status: 1 });
mentorshipRequestSchema.index({ mentee: 1, status: 1 });
mentorshipRequestSchema.index({ mentorshipArea: 1 });
mentorshipRequestSchema.index({ requestedAt: -1 });

// Virtual for request duration
mentorshipRequestSchema.virtual('requestAge').get(function() {
  return Date.now() - this.requestedAt;
});

// Pre-save middleware to set respondedAt when status changes
mentorshipRequestSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status !== 'pending' && !this.respondedAt) {
    this.respondedAt = new Date();
  }
  next();
});

// Ensure virtual fields are serialized
mentorshipRequestSchema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('MentorshipRequest', mentorshipRequestSchema);