const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide event title'],
    trim: true,
    maxlength: [200, 'Event title cannot be more than 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide event description'],
    trim: true,
    maxlength: [2000, 'Event description cannot be more than 2000 characters']
  },
  eventDate: {
    type: Date,
    required: [true, 'Please provide event date'],
    validate: {
      validator: function(value) {
        return value > new Date();
      },
      message: 'Event date must be in the future'
    }
  },
  eventTime: {
    type: String,
    required: [true, 'Please provide event time'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please provide valid time in HH:MM format']
  },
  location: {
    type: String,
    required: [true, 'Please provide event location'],
    trim: true,
    maxlength: [200, 'Location cannot be more than 200 characters']
  },
  eventType: {
    type: String,
    required: [true, 'Please specify event type'],
    enum: ['networking', 'seminar', 'workshop', 'reunion', 'career-fair', 'social', 'other'],
    default: 'networking'
  },
  maxAttendees: {
    type: Number,
    min: [1, 'Maximum attendees must be at least 1'],
    max: [10000, 'Maximum attendees cannot exceed 10000']
  },
  isVirtual: {
    type: Boolean,
    default: false
  },
  virtualLink: {
    type: String,
    trim: true,
    validate: {
      validator: function(value) {
        if (this.isVirtual && !value) {
          return false;
        }
        if (value && !value.match(/^https?:\/\/.+/)) {
          return false;
        }
        return true;
      },
      message: 'Virtual events must have a valid meeting link'
    }
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  attendees: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    registeredAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['registered', 'attended', 'cancelled'],
      default: 'registered'
    }
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: [500, 'Comment cannot be more than 500 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  imageUrl: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  registrationDeadline: {
    type: Date,
    validate: {
      validator: function(value) {
        if (value) {
          return value <= this.eventDate;
        }
        return true;
      },
      message: 'Registration deadline must be before event date'
    }
  }
}, {
  timestamps: true
});

// Virtual for attendee count
eventSchema.virtual('attendeeCount').get(function() {
  return this.attendees ? this.attendees.filter(a => a.status === 'registered').length : 0;
});

// Virtual for checking if registration is open
eventSchema.virtual('isRegistrationOpen').get(function() {
  const now = new Date();
  const deadline = this.registrationDeadline || this.eventDate;
  return this.isActive && now < deadline && (!this.maxAttendees || this.attendeeCount < this.maxAttendees);
});

// Ensure virtual fields are serialized
eventSchema.set('toJSON', {
  virtuals: true
});

// Index for better query performance
eventSchema.index({ eventDate: 1 });
eventSchema.index({ eventType: 1 });
eventSchema.index({ 'attendees.user': 1 });

module.exports = mongoose.model('Event', eventSchema);