const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const CV = require('../models/CV');
const User = require('../models/User');

// Middleware to validate ObjectId
const validateObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid CV ID format' });
  }
  next();
};

// @route   GET api/cv
// @desc    Get all user's CVs
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const cvs = await CV.find({ user: req.user.id }).sort({ updatedAt: -1 });
    res.json({ data: cvs });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET api/cv/:id
// @desc    Get a specific CV
// @access  Private
router.get('/:id', [auth, validateObjectId], async (req, res) => {
  try {
    const cv = await CV.findById(req.params.id);

    if (!cv) {
      return res.status(404).json({ message: 'CV not found' });
    }

    if (cv.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view this CV' });
    }

    res.json({ data: cv });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST api/cv
// @desc    Create a new CV
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('template', 'Template is required').not().isEmpty(),
      check('personalInfo.fullName', 'Full name is required').not().isEmpty(),
      check('personalInfo.email', 'Email is required').isEmail()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id);
      const cvCount = await CV.countDocuments({ user: req.user.id });
      
      if (user.subscription === 'free' && cvCount >= 2) {
        return res.status(403).json({ 
          message: 'Free plan limit reached. Upgrade to premium to create more CVs' 
        });
      }

      const newCV = new CV({
        ...req.body,
        user: req.user.id
      });

      const cv = await newCV.save();
      
      // Ensure we have a valid _id before responding
      if (!cv._id) {
        throw new Error('Failed to generate CV ID');
      }

      res.json({ 
        success: true,
        data: cv,
        id: cv._id // Explicitly include ID
      });
      
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ 
        success: false,
        message: 'Failed to create CV',
        error: err.message 
      });
    }
  }
);

// @route   PUT api/cv/:id
// @desc    Update a CV
// @access  Private
router.put('/:id', [auth, validateObjectId], async (req, res) => {
  try {
    let cv = await CV.findById(req.params.id);

    if (!cv) {
      return res.status(404).json({ message: 'CV not found' });
    }

    if (cv.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this CV' });
    }

    // Create update object with only provided fields
    const updateFields = {};
    const allowedFields = [
      'title', 'template', 'personalInfo', 'summary', 
      'workExperience', 'education', 'skills', 'languages',
      'projects', 'certifications', 'customSections',
      'references', 'metadata', 'privacy'
    ];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateFields[field] = req.body[field];
      }
    });

    cv = await CV.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    res.json({ data: cv });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   DELETE api/cv/:id
// @desc    Delete a CV
// @access  Private
router.delete('/:id', [auth, validateObjectId], async (req, res) => {
  try {
    const cv = await CV.findById(req.params.id);

    if (!cv) {
      return res.status(404).json({ message: 'CV not found' });
    }

    if (cv.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this CV' });
    }

    await cv.deleteOne();

    res.json({ message: 'CV removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST api/cv/:id/analyze
// @desc    Analyze CV against a job description
// @access  Private
router.post('/:id/analyze', [auth, validateObjectId], async (req, res) => {
  try {
    const { jobDescription } = req.body;
    
    if (!jobDescription) {
      return res.status(400).json({ message: 'Job description is required' });
    }
    
    const cv = await CV.findById(req.params.id);
    
    if (!cv) {
      return res.status(404).json({ message: 'CV not found' });
    }
    
    if (cv.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to analyze this CV' });
    }
    
    const user = await User.findById(req.user.id);
    if (user.subscription !== 'premium') {
      return res.status(403).json({ message: 'Premium subscription required for ATS analysis' });
    }
    
    // Analysis logic remains the same
    const keywords = extractKeywords(jobDescription);
    const analysis = analyzeCV(cv, keywords);
    
    cv.metadata = cv.metadata || {};
    cv.metadata.atsScore = analysis.atsScore;
    cv.metadata.keywordMatches = analysis.matchingKeywords.map(keyword => ({
      keyword,
      count: 1,
      important: true
    }));
    cv.metadata.lastOptimized = Date.now();
    
    await cv.save();
    
    res.json({ 
      data: {
        atsScore: analysis.atsScore,
        matchingKeywords: analysis.matchingKeywords,
        missingKeywords: analysis.missingKeywords,
        suggestions: analysis.suggestions
      } 
    });
    
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Helper functions remain the same
function extractKeywords(jobDescription) {
  // ... existing implementation ...
}

function analyzeCV(cv, keywords) {
  // ... existing implementation ...
}

module.exports = router;