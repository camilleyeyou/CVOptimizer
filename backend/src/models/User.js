const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 8,
      select: false, // Don't return password in query results
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    subscription: {
      type: String,
      enum: ['free', 'premium', 'enterprise'],
      default: 'free',
    },
    subscriptionExpiry: {
      type: Date,
      default: null,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    emailVerificationToken: String,
    emailVerified: {
      type: Boolean,
      default: false,
    },
    createdCVs: {
      type: Number,
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for CVs
userSchema.virtual('cvs', {
  ref: 'CV',
  foreignField: 'user',
  localField: '_id',
});

// Pre-save middleware to hash password
userSchema.pre('save', async function (next) {
  // Only run this function if password was modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  
  next();
});

// Instance method to check if password is correct
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Check if user is on free plan and has reached CV limit
userSchema.methods.hasReachedFreeLimit = function () {
  return this.subscription === 'free' && this.createdCVs >= 2;
};

// Check if user's subscription has expired
userSchema.methods.hasActiveSubscription = function () {
  if (this.subscription === 'free') return true;
  return this.subscriptionExpiry && this.subscriptionExpiry > Date.now();
};

const User = mongoose.model('User', userSchema);

module.exports = User;