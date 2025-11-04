const express = require('express');
const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserStats,
  getMentors
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { validateProfileUpdate } = require('../utils/validation');

const router = express.Router();

// All routes are protected
router.use(protect);

// Public user routes (for authenticated users)
router.get('/', getUsers);
router.get('/mentors', getMentors);
router.get('/:id', getUserById);

// Admin only routes
router.get('/admin/stats', authorize('admin'), getUserStats);
router.put('/:id', authorize('admin'), validateProfileUpdate, updateUser);
router.delete('/:id', authorize('admin'), deleteUser);

module.exports = router;