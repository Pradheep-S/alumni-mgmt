const { body } = require('express-validator');

// Validation rules for user registration
const validateRegister = [
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  body('role')
    .optional()
    .isIn(['admin', 'alumni', 'student'])
    .withMessage('Role must be admin, alumni, or student'),
  
  body('phone')
    .optional()
    .matches(/^\+?[\d\s-()]+$/)
    .withMessage('Please provide a valid phone number'),
  
  body('graduationYear')
    .optional()
    .isInt({ min: 1950, max: new Date().getFullYear() + 10 })
    .withMessage('Please provide a valid graduation year'),
  
  body('department')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Department name cannot be more than 100 characters'),
  
  body('linkedinProfile')
    .optional()
    .isURL()
    .withMessage('Please provide a valid LinkedIn URL')
    .matches(/^https?:\/\/(www\.)?linkedin\.com\/in\/[\w-]+\/?$/)
    .withMessage('Please provide a valid LinkedIn profile URL'),
  
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Bio cannot be more than 500 characters'),
  
  body('isMentor')
    .optional()
    .isBoolean()
    .withMessage('isMentor must be a boolean value'),
  
  body('mentorshipAreas')
    .optional()
    .isArray()
    .withMessage('Mentorship areas must be an array'),
  
  body('mentorshipAreas.*')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Each mentorship area must be between 1 and 100 characters')
];

// Validation rules for user login
const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Validation rules for profile update
const validateProfileUpdate = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  
  body('phone')
    .optional()
    .matches(/^\+?[\d\s-()]+$/)
    .withMessage('Please provide a valid phone number'),
  
  body('graduationYear')
    .optional()
    .isInt({ min: 1950, max: new Date().getFullYear() + 10 })
    .withMessage('Please provide a valid graduation year'),
  
  body('department')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Department name cannot be more than 100 characters'),
  
  body('linkedinProfile')
    .optional()
    .isURL()
    .withMessage('Please provide a valid LinkedIn URL')
    .matches(/^https?:\/\/(www\.)?linkedin\.com\/in\/[\w-]+\/?$/)
    .withMessage('Please provide a valid LinkedIn profile URL'),
  
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Bio cannot be more than 500 characters'),
  
  body('isMentor')
    .optional()
    .isBoolean()
    .withMessage('isMentor must be a boolean value'),
  
  body('mentorshipAreas')
    .optional()
    .isArray()
    .withMessage('Mentorship areas must be an array'),
  
  body('mentorshipAreas.*')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Each mentorship area must be between 1 and 100 characters')
];

// Validation rules for password change
const validatePasswordChange = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number')
];

// Validation rules for event creation and update
const validateEvent = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Event title is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Event title must be between 3 and 200 characters'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Event description is required')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Event description must be between 10 and 2000 characters'),
  
  body('eventDate')
    .isISO8601()
    .withMessage('Please provide a valid event date')
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error('Event date must be in the future');
      }
      return true;
    }),
  
  body('eventTime')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Please provide valid time in HH:MM format'),
  
  body('location')
    .trim()
    .notEmpty()
    .withMessage('Event location is required')
    .isLength({ max: 200 })
    .withMessage('Location cannot be more than 200 characters'),
  
  body('eventType')
    .isIn(['networking', 'seminar', 'workshop', 'reunion', 'career-fair', 'social', 'other'])
    .withMessage('Please provide a valid event type'),
  
  body('maxAttendees')
    .optional()
    .isInt({ min: 1, max: 10000 })
    .withMessage('Maximum attendees must be between 1 and 10000'),
  
  body('isVirtual')
    .optional()
    .isBoolean()
    .withMessage('isVirtual must be a boolean value'),
  
  body('virtualLink')
    .optional()
    .custom((value, { req }) => {
      if (req.body.isVirtual && !value) {
        throw new Error('Virtual events must have a meeting link');
      }
      if (value && !value.match(/^https?:\/\/.+/)) {
        throw new Error('Please provide a valid virtual meeting link');
      }
      return true;
    }),
  
  body('registrationDeadline')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid registration deadline')
    .custom((value, { req }) => {
      if (value && new Date(value) > new Date(req.body.eventDate)) {
        throw new Error('Registration deadline must be before event date');
      }
      return true;
    }),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  
  body('tags.*')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Each tag must be between 1 and 50 characters')
];

// Validation rules for mentorship request
const validateMentorshipRequest = [
  body('mentor')
    .isMongoId()
    .withMessage('Please provide a valid mentor ID'),
  
  body('subject')
    .trim()
    .notEmpty()
    .withMessage('Subject is required')
    .isLength({ min: 5, max: 200 })
    .withMessage('Subject must be between 5 and 200 characters'),
  
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ min: 20, max: 1000 })
    .withMessage('Message must be between 20 and 1000 characters'),
  
  body('mentorshipArea')
    .isIn([
      'career-guidance',
      'technical-skills',
      'entrepreneurship',
      'interview-preparation',
      'networking',
      'industry-insights',
      'personal-development',
      'academic-guidance',
      'other'
    ])
    .withMessage('Please provide a valid mentorship area'),
  
  body('preferredMeetingType')
    .optional()
    .isIn(['video-call', 'phone-call', 'in-person', 'email', 'chat'])
    .withMessage('Please provide a valid meeting type'),
  
  body('urgency')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Please provide a valid urgency level'),
  
  body('expectedDuration')
    .optional()
    .isIn(['30-minutes', '1-hour', '1-2-hours', 'multiple-sessions'])
    .withMessage('Please provide a valid expected duration'),
  
  body('preferredTimeSlots')
    .optional()
    .isArray()
    .withMessage('Preferred time slots must be an array'),
  
  body('preferredTimeSlots.*.day')
    .optional()
    .isIn(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'])
    .withMessage('Please provide valid days'),
  
  body('preferredTimeSlots.*.timeSlot')
    .optional()
    .isIn(['morning', 'afternoon', 'evening'])
    .withMessage('Please provide valid time slots')
];

module.exports = {
  validateRegister,
  validateLogin,
  validateProfileUpdate,
  validatePasswordChange,
  validateEvent,
  validateMentorshipRequest
};