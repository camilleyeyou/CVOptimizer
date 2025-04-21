const mongoose = require('mongoose');

const cvSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'CV must belong to a user'],
    },
    title: {
      type: String,
      required: [true, 'CV must have a title'],
      trim: true,
    },
    template: {
      type: String,
      required: [true, 'CV must use a template'],
      enum: [
        'modern',
        'classic',
        'minimal',
        'professional',
        'creative',
        'executive',
        'technical',
      ],
      default: 'modern',
    },
    personalInfo: {
      fullName: {
        type: String,
        required: [true, 'Please provide your full name'],
      },
      jobTitle: {
        type: String,
      },
      email: {
        type: String,
        required: [true, 'Please provide your email'],
      },
      phone: {
        type: String,
      },
      location: {
        type: String,
      },
      website: {
        type: String,
      },
      linkedin: {
        type: String,
      },
      github: {
        type: String,
      },
    },
    summary: {
      type: String,
    },
    workExperience: [
      {
        company: {
          type: String,
          required: true,
        },
        position: {
          type: String,
          required: true,
        },
        location: String,
        startDate: {
          type: Date,
          required: true,
        },
        endDate: Date,
        current: {
          type: Boolean,
          default: false,
        },
        description: {
          type: String,
        },
        achievements: [String],
      },
    ],
    education: [
      {
        institution: {
          type: String,
          required: true,
        },
        degree: {
          type: String,
          required: true,
        },
        field: String,
        location: String,
        startDate: {
          type: Date,
          required: true,
        },
        endDate: Date,
        current: {
          type: Boolean,
          default: false,
        },
        description: String,
        achievements: [String],
      },
    ],
    skills: [
      {
        name: {
          type: String,
          required: true,
        },
        level: {
          type: Number,
          min: 1,
          max: 5,
        },
        category: String,
      },
    ],
    languages: [
      {
        name: {
          type: String,
          required: true,
        },
        proficiency: {
          type: String,
          enum: [
            'Native',
            'Fluent',
            'Advanced',
            'Intermediate',
            'Basic',
          ],
        },
      },
    ],
    projects: [
      {
        title: {
          type: String,
          required: true,
        },
        description: String,
        technologies: [String],
        link: String,
        startDate: Date,
        endDate: Date,
        current: {
          type: Boolean,
          default: false,
        },
      },
    ],
    certifications: [
      {
        name: {
          type: String,
          required: true,
        },
        issuer: String,
        date: Date,
        expiryDate: Date,
        credentialID: String,
        url: String,
      },
    ],
    customSections: [
      {
        title: {
          type: String,
          required: true,
        },
        items: [
          {
            title: String,
            subtitle: String,
            date: Date,
            description: String,
            bullets: [String],
          },
        ],
      },
    ],
    references: [
      {
        name: {
          type: String,
        },
        company: String,
        position: String,
        email: String,
        phone: String,
        reference: String,
      },
    ],
    metadata: {
      atsScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },
      keywordMatches: [
        {
          keyword: String,
          count: Number,
          important: Boolean,
        },
      ],
      lastGeneratedPDF: Date,
      targetJobTitle: String,
      targetCompany: String,
      lastOptimized: Date,
    },
    privacy: {
      isPublic: {
        type: Boolean,
        default: false,
      },
      shareableLink: String,
      shareableUntil: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create a compound index for faster queries
cvSchema.index({ user: 1, createdAt: -1 });

// Pre-save middleware to format dates
cvSchema.pre('save', function (next) {
  // Any pre-save operations can go here
  next();
});

// Static method to check if user has reached CV limit
cvSchema.statics.countUserCVs = async function (userId) {
  const stats = await this.aggregate([
    {
      $match: { user: userId },
    },
    {
      $count: 'count',
    },
  ]);

  return stats.length > 0 ? stats[0].count : 0;
};

const CV = mongoose.model('CV', cvSchema);

module.exports = CV;