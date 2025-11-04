const User = require('../models/User');
const { validationResult } = require('express-validator');

// @desc    Get all users (alumni directory)
// @route   GET /api/users
// @access  Private
const getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    let filter = { isActive: true };

    // Search by name, department, or graduation year
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      filter.$or = [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { department: searchRegex },
        { 'currentJob.company': searchRegex }
      ];
    }

    // Filter by department
    if (req.query.department) {
      filter.department = new RegExp(req.query.department, 'i');
    }

    // Filter by graduation year
    if (req.query.graduationYear) {
      filter.graduationYear = parseInt(req.query.graduationYear);
    }

    // Filter by role
    if (req.query.role) {
      filter.role = req.query.role;
    }

    // Filter mentors only
    if (req.query.mentorsOnly === 'true') {
      filter.isMentor = true;
    }

    // Get users with pagination
    const users = await User.find(filter)
      .select('-password')
      .sort({ firstName: 1, lastName: 1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await User.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single user by ID
// @route   GET /api/users/:id
// @access  Private
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user (Admin only)
// @route   PUT /api/users/:id
// @access  Private (Admin)
const updateUser = async (req, res, next) => {
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

    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const fieldsToUpdate = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      role: req.body.role,
      phone: req.body.phone,
      graduationYear: req.body.graduationYear,
      department: req.body.department,
      currentJob: req.body.currentJob,
      bio: req.body.bio,
      linkedinProfile: req.body.linkedinProfile,
      isMentor: req.body.isMentor,
      mentorshipAreas: req.body.mentorshipAreas,
      isActive: req.body.isActive,
      profilePicture: req.body.profilePicture,
      additionalEmail: req.body.additionalEmail,
      emailVisibility: req.body.emailVisibility
    };

    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach(key => 
      fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      fieldsToUpdate,
      {
        new: true,
        runValidators: true
      }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user (Admin only)
// @route   DELETE /api/users/:id
// @access  Private (Admin)
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Soft delete - set isActive to false instead of removing
    await User.findByIdAndUpdate(req.params.id, { isActive: false });

    res.status(200).json({
      success: true,
      message: 'User deactivated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user statistics (Admin only)
// @route   GET /api/users/stats
// @access  Private (Admin)
const getUserStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ isActive: true });
    const totalAlumni = await User.countDocuments({ role: 'alumni', isActive: true });
    const totalStudents = await User.countDocuments({ role: 'student', isActive: true });
    const totalMentors = await User.countDocuments({ isMentor: true, isActive: true });
    
    // Get users by graduation year
    const usersByYear = await User.aggregate([
      { $match: { isActive: true, graduationYear: { $exists: true } } },
      { $group: { _id: '$graduationYear', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    // Get users by department
    const usersByDepartment = await User.aggregate([
      { $match: { isActive: true, department: { $exists: true, $ne: '' } } },
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalAlumni,
        totalStudents,
        totalMentors,
        usersByYear,
        usersByDepartment
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all mentors
// @route   GET /api/users/mentors
// @access  Private
const getMentors = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let filter = { 
      isMentor: true, 
      isActive: true 
    };

    // Filter by mentorship area
    if (req.query.area) {
      filter.mentorshipAreas = { $in: [new RegExp(req.query.area, 'i')] };
    }

    // Search mentors
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      filter.$or = [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { department: searchRegex },
        { 'currentJob.company': searchRegex },
        { mentorshipAreas: searchRegex }
      ];
    }

    const mentors = await User.find(filter)
      .select('-password')
      .sort({ firstName: 1, lastName: 1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: mentors.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      mentors
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserStats,
  getMentors
};