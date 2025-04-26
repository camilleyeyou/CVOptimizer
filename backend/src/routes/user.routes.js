// backend/src/routes/user.routes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// @route   GET api/users/me/profile
// @desc    Get current user's profile
// @access  Private
router.get('/me/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ data: user });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   PUT api/users/me/profile
// @desc    Update user profile
// @access  Private
router.put('/me/profile', auth, async (req, res) => {
  try {
    const { name, email } = req.body;
    
    // Build user object
    const userFields = {};
    if (name) userFields.name = name;
    if (email) userFields.email = email;
    
    // Update user
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: userFields },
      { new: true }
    ).select('-password');
    
    res.json({ data: user });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   PUT api/users/me/password
// @desc    Update user password
// @access  Private
router.put('/me/password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Check if passwords are provided
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Please provide current and new passwords' });
    }
    
    // Get user
    const user = await User.findById(req.user.id).select('+password');
    
    // Check if current password is correct
    const isMatch = await user.correctPassword(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   DELETE api/users/me
// @desc    Delete user account
// @access  Private
router.delete('/me', auth, async (req, res) => {
  try {
    // Remove user and their CVs (in a real app, you might want to add confirmation or soft delete)
    await User.findByIdAndDelete(req.user.id);
    
    res.json({ message: 'User account deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;