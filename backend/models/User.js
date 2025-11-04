const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please provide first name'],
    trim: true,
    maxlength: [50, 'First name cannot be more than 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Please provide last name'],
    trim: true,
    maxlength: [50, 'Last name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  additionalEmail: {
    type: String,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  emailVisibility: {
    primaryEmail: {
      type: Boolean,
      default: false
    },
    additionalEmail: {
      type: Boolean,
      default: false
    }
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['admin', 'alumni', 'student'],
    default: 'alumni'
  },
  phone: {
    type: String,
    trim: true,
    match: [/^\+?[\d\s-()]+$/, 'Please provide a valid phone number']
  },
  graduationYear: {
    type: Number,
    min: [1950, 'Graduation year must be after 1950'],
    max: [new Date().getFullYear() + 10, 'Invalid graduation year']
  },
  department: {
    type: String,
    trim: true,
    maxlength: [100, 'Department name cannot be more than 100 characters']
  },
  currentJob: {
    title: {
      type: String,
      trim: true,
      maxlength: [100, 'Job title cannot be more than 100 characters']
    },
    company: {
      type: String,
      trim: true,
      maxlength: [100, 'Company name cannot be more than 100 characters']
    },
    location: {
      type: String,
      trim: true,
      maxlength: [100, 'Location cannot be more than 100 characters']
    }
  },
  bio: {
    type: String,
    trim: true,
    maxlength: [500, 'Bio cannot be more than 500 characters']
  },
  linkedinProfile: {
    type: String,
    trim: true,
    match: [/^https?:\/\/(www\.)?linkedin\.com\/in\/[\w-]+\/?$/, 'Please provide a valid LinkedIn URL']
  },
  isMentor: {
    type: Boolean,
    default: false
  },
  mentorshipAreas: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  profilePicture: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Encrypt password using bcrypt
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
userSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Get user's full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Ensure virtual fields are serialized
userSchema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('User', userSchema);