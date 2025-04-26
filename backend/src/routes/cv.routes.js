const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const CV = require('../models/CV');
const User = require('../models/User');

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
router.get('/:id', auth, async (req, res) => {
  try {
    const cv = await CV.findById(req.params.id);

    // Check if CV exists
    if (!cv) {
      return res.status(404).json({ message: 'CV not found' });
    }

    // Check if user owns the CV
    if (cv.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view this CV' });
    }

    res.json({ data: cv });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'CV not found' });
    }
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
      // Get the user to check subscription status
      const user = await User.findById(req.user.id);
      
      // Count user's CVs
      const cvCount = await CV.countUserCVs(req.user.id);
      user.createdCVs = cvCount;
      
      // Check if free user has reached limit
      if (user.subscription === 'free' && cvCount >= 2) {
        return res.status(403).json({ 
          message: 'Free plan limit reached. Upgrade to premium to create more CVs' 
        });
      }

      // Create new CV
      const newCV = new CV({
        ...req.body,
        user: req.user.id
      });

      // Save CV
      const cv = await newCV.save();
      
      // Increment user's CV count
      user.createdCVs += 1;
      await user.save();

      res.json({ data: cv });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server Error' });
    }
  }
);

// @route   PUT api/cv/:id
// @desc    Update a CV
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    let cv = await CV.findById(req.params.id);

    // Check if CV exists
    if (!cv) {
      return res.status(404).json({ message: 'CV not found' });
    }

    // Check if user owns the CV
    if (cv.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this CV' });
    }

    // Update CV fields
    const { 
      title, 
      template, 
      personalInfo, 
      summary, 
      workExperience, 
      education, 
      skills, 
      languages, 
      projects, 
      certifications, 
      customSections,
      references,
      metadata,
      privacy
    } = req.body;

    if (title) cv.title = title;
    if (template) cv.template = template;
    if (personalInfo) cv.personalInfo = personalInfo;
    if (summary !== undefined) cv.summary = summary;
    if (workExperience) cv.workExperience = workExperience;
    if (education) cv.education = education;
    if (skills) cv.skills = skills;
    if (languages) cv.languages = languages;
    if (projects) cv.projects = projects;
    if (certifications) cv.certifications = certifications;
    if (customSections) cv.customSections = customSections;
    if (references) cv.references = references;
    if (metadata) cv.metadata = metadata;
    if (privacy) cv.privacy = privacy;

    // Save updated CV
    await cv.save();

    res.json({ data: cv });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'CV not found' });
    }
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   DELETE api/cv/:id
// @desc    Delete a CV
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const cv = await CV.findById(req.params.id);

    // Check if CV exists
    if (!cv) {
      return res.status(404).json({ message: 'CV not found' });
    }

    // Check if user owns the CV
    if (cv.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this CV' });
    }

    // Delete CV
    await cv.remove();

    // Update user's CV count
    const user = await User.findById(req.user.id);
    user.createdCVs = await CV.countUserCVs(req.user.id);
    await user.save();

    res.json({ message: 'CV removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'CV not found' });
    }
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST api/cv/:id/analyze
// @desc    Analyze CV against a job description
// @access  Private
router.post('/:id/analyze', auth, async (req, res) => {
  try {
    const { jobDescription } = req.body;
    
    if (!jobDescription) {
      return res.status(400).json({ message: 'Job description is required' });
    }
    
    const cv = await CV.findById(req.params.id);
    
    // Check if CV exists
    if (!cv) {
      return res.status(404).json({ message: 'CV not found' });
    }
    
    // Check if user owns the CV
    if (cv.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to analyze this CV' });
    }
    
    // Check if user has premium subscription
    const user = await User.findById(req.user.id);
    if (user.subscription !== 'premium') {
      return res.status(403).json({ message: 'Premium subscription required for ATS analysis' });
    }
    
    // In a real app, this would connect to an AI service or algorithm
    // Here we'll simulate the analysis with mock data
    
    // Extract keywords from job description
    const keywords = extractKeywords(jobDescription);
    
    // Check CV content against keywords
    const analysis = analyzeCV(cv, keywords);
    
    // Update CV with analysis data
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
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'CV not found' });
    }
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET api/cv/:id/pdf
// @desc    Generate PDF for a CV
// @access  Private
router.get('/:id/pdf', auth, async (req, res) => {
  try {
    const cv = await CV.findById(req.params.id);
    
    // Check if CV exists
    if (!cv) {
      return res.status(404).json({ message: 'CV not found' });
    }
    
    // Check if user owns the CV
    if (cv.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to generate PDF for this CV' });
    }
    
    // In a real app, this would generate a PDF using a library like PDFKit or html-pdf
    // For now, we'll just update the lastGeneratedPDF timestamp
    
    cv.metadata.lastGeneratedPDF = Date.now();
    await cv.save();
    
    // Mock PDF generation (in a real app this would return the PDF file)
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="cv-${cv.title}.pdf"`);
    
    // This would be the PDF buffer in a real implementation
    res.send('Mock PDF content');
    
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'CV not found' });
    }
    res.status(500).json({ message: 'Server Error' });
  }
});

// Helper functions for CV analysis
function extractKeywords(jobDescription) {
  // In a real app, this would use NLP or AI to extract keywords
  // For demo purposes, we'll use a simple approach
  const commonJobKeywords = [
    'teamwork', 'leadership', 'communication', 'problem-solving', 
    'javascript', 'react', 'node.js', 'mongodb', 'web development',
    'project management', 'agile', 'scrum', 'analytical', 'detail-oriented'
  ];
  
  // Simulate finding keywords in the job description
  return commonJobKeywords.filter(keyword => 
    jobDescription.toLowerCase().includes(keyword.toLowerCase())
  );
}

function analyzeCV(cv, keywords) {
  // In a real app, this would be a sophisticated analysis
  // For demo purposes, we'll use a simple approach
  
  // Combine all text content from the CV
  let cvContent = '';
  cvContent += cv.summary || '';
  
  // Add work experience descriptions
  if (cv.workExperience && cv.workExperience.length > 0) {
    cv.workExperience.forEach(job => {
      cvContent += job.description || '';
      if (job.achievements && job.achievements.length > 0) {
        cvContent += job.achievements.join(' ');
      }
    });
  }
  
  // Add skills
  if (cv.skills && cv.skills.length > 0) {
    cvContent += cv.skills.map(skill => skill.name).join(' ');
  }
  
  // Lowercase content for case-insensitive matching
  cvContent = cvContent.toLowerCase();
  
  // Find matching keywords
  const matchingKeywords = keywords.filter(keyword => 
    cvContent.includes(keyword.toLowerCase())
  );
  
  // Find missing keywords
  const missingKeywords = keywords.filter(keyword => 
    !cvContent.includes(keyword.toLowerCase())
  );
  
  // Calculate ATS score (0-100)
  const atsScore = Math.min(100, Math.round((matchingKeywords.length / keywords.length) * 100));
  
  // Generate suggestions
  const suggestions = [];
  
  if (missingKeywords.length > 0) {
    suggestions.push(`Add these missing keywords to your CV: ${missingKeywords.join(', ')}`);
  }
  
  if (cv.summary && cv.summary.length < 100) {
    suggestions.push('Your professional summary is too short. Aim for at least 100 characters to highlight your key qualifications.');
  }
  
  if (!cv.workExperience || cv.workExperience.length === 0) {
    suggestions.push('Add work experience to improve your CV.');
  } else if (cv.workExperience.some(job => !job.achievements || job.achievements.length === 0)) {
    suggestions.push('Add achievements to your work experience to showcase results and impact.');
  }
  
  return {
    atsScore,
    matchingKeywords,
    missingKeywords,
    suggestions
  };
}

module.exports = router;