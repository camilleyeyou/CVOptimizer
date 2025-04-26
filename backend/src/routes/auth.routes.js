const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

// Environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// @route   POST api/auth/register
// @desc    Register a user
// @access  Public
router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 8 or more characters').isLength({ min: 8 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      // Check if user already exists
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Create new user
      user = new User({
        name,
        email,
        password,
        subscription: 'free',
        emailVerified: false,
        createdCVs: 0
      });

      // Hash password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      // Save user to database
      await user.save();

      // Create JWT payload
      const payload = {
        user: {
          id: user.id
        }
      };

      // Sign and return JWT
      jwt.sign(
        payload,
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN },
        (err, token) => {
          if (err) throw err;
          res.json({ 
            token,
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              subscription: user.subscription,
              subscriptionExpiry: user.subscriptionExpiry,
              createdCVs: user.createdCVs
            }
          });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server Error' });
    }
  }
);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Check if user exists
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Create JWT payload
      const payload = {
        user: {
          id: user.id
        }
      };

      // Sign and return JWT
      jwt.sign(
        payload,
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN },
        (err, token) => {
          if (err) throw err;
          res.json({ 
            token,
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              subscription: user.subscription,
              subscriptionExpiry: user.subscriptionExpiry,
              createdCVs: user.createdCVs
            }
          });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server Error' });
    }
  }
);

// @route   GET api/auth/me
// @desc    Get logged in user
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    // Get user without password
    const user = await User.findById(req.user.id).select('-password');
    res.json({ 
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        subscription: user.subscription,
        subscriptionExpiry: user.subscriptionExpiry,
        createdCVs: user.createdCVs
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST api/auth/forgot-password
// @desc    Send password reset email
// @access  Public
router.post(
  '/forgot-password',
  [check('email', 'Please include a valid email').isEmail()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        // For security reasons, don't tell the client that the email doesn't exist
        return res.json({ message: 'If this email exists, a password reset link will be sent' });
      }

      // Generate password reset token
      const resetToken = crypto.randomBytes(20).toString('hex');
      user.passwordResetToken = resetToken;
      user.passwordResetExpires = Date.now() + 3600000; // 1 hour
      await user.save();

      // In a real app, send an email with the reset token
      // For this demo, we'll just return the token
      res.json({
        message: 'If this email exists, a password reset link will be sent',
        resetToken: resetToken // Remove this in production!
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server Error' });
    }
  }
);

module.exports = router;