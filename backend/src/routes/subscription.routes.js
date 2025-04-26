const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// @route   GET api/subscriptions
// @desc    Get user subscription details
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('subscription subscriptionExpiry');
    
    res.json({
      data: {
        subscription: user.subscription,
        subscriptionExpiry: user.subscriptionExpiry
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST api/subscriptions/subscribe
// @desc    Subscribe to premium plan
// @access  Private
router.post('/subscribe', auth, async (req, res) => {
  try {
    const { plan } = req.body;
    
    if (!plan || !['monthly', 'yearly'].includes(plan)) {
      return res.status(400).json({ message: 'Invalid subscription plan' });
    }
    
    const user = await User.findById(req.user.id);
    
    // Set subscription type
    user.subscription = 'premium';
    
    // Set expiry date
    const now = new Date();
    if (plan === 'monthly') {
      // Add 1 month
      user.subscriptionExpiry = new Date(now.setMonth(now.getMonth() + 1));
    } else {
      // Add 1 year
      user.subscriptionExpiry = new Date(now.setFullYear(now.getFullYear() + 1));
    }
    
    await user.save();
    
    res.json({
      data: {
        subscription: user.subscription,
        subscriptionExpiry: user.subscriptionExpiry
      },
      message: `Successfully subscribed to Premium (${plan})`
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST api/subscriptions/cancel
// @desc    Cancel premium subscription
// @access  Private
router.post('/cancel', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // If user is not premium, return error
    if (user.subscription !== 'premium') {
      return res.status(400).json({ message: 'No active subscription to cancel' });
    }
    
    // Note: In a real app, we wouldn't immediately downgrade the user
    // Instead, we'd let them keep premium until their billing period ends
    // For demo purposes, we'll keep the subscription expiry date
    
    res.json({
      data: {
        subscription: user.subscription,
        subscriptionExpiry: user.subscriptionExpiry
      },
      message: 'Subscription will be canceled at the end of the billing period'
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST api/subscriptions/webhook
// @desc    Handle subscription webhook events (from payment provider)
// @access  Public (but would use API key verification in production)
router.post('/webhook', async (req, res) => {
  try {
    // In a real app, this would verify the request is from your payment provider
    // and handle different event types (payment succeeded, failed, subscription canceled, etc.)
    
    const { event, userId, subscription } = req.body;
    
    // Process different webhook events
    switch (event) {
      case 'subscription_created':
        // Update user subscription
        await User.findByIdAndUpdate(userId, {
          subscription: 'premium',
          subscriptionExpiry: new Date(subscription.currentPeriodEnd)
        });
        break;
        
      case 'subscription_updated':
        // Update subscription details
        await User.findByIdAndUpdate(userId, {
          subscriptionExpiry: new Date(subscription.currentPeriodEnd)
        });
        break;
        
      case 'subscription_canceled':
        // When subscription actually ends (after current period)
        await User.findByIdAndUpdate(userId, {
          subscription: 'free',
          subscriptionExpiry: null
        });
        break;
        
      case 'payment_failed':
        // Handle failed payment - could send email notification, etc.
        break;
        
      default:
        // Unhandled event
        console.log(`Unhandled webhook event: ${event}`);
    }
    
    // Return 200 success to acknowledge receipt
    res.status(200).json({ received: true });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;