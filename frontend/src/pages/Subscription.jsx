import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
  useTheme,
} from '@mui/material';
import {
  Check as CheckIcon,
  Close as CloseIcon,
  Star as StarIcon,
  Verified as VerifiedIcon,
} from '@mui/icons-material';

const SubscriptionPage = () => {
  const theme = useTheme();
  const { user } = useSelector((state) => state.auth);
  
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  
  const isPremiumUser = user?.subscription === 'premium';
  const currentSubscription = isPremiumUser ? 'premium' : 'free';
  
  // Plans data
  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Basic features for beginners',
      buttonText: currentSubscription === 'free' ? 'Current Plan' : 'Downgrade',
      buttonVariant: currentSubscription === 'free' ? 'outlined' : 'contained',
      buttonDisabled: currentSubscription === 'free',
      features: [
        { text: 'Create up to 2 CVs', available: true },
        { text: '2 Basic templates', available: true },
        { text: 'PDF export', available: true },
        { text: 'Basic CV editor', available: true },
        { text: 'ATS optimization', available: false },
        { text: 'AI content suggestions', available: false },
        { text: 'Premium templates', available: false },
        { text: 'CV sharing', available: false },
        { text: 'Priority support', available: false },
      ],
    },
    {
      id: 'monthly',
      name: 'Premium Monthly',
      price: '$9.99',
      period: 'per month',
      description: 'Everything you need for job hunting',
      buttonText: currentSubscription === 'premium' ? 'Current Plan' : 'Subscribe',
      buttonVariant: 'contained',
      buttonDisabled: currentSubscription === 'premium',
      features: [
        { text: 'Unlimited CVs', available: true },
        { text: 'All templates', available: true },
        { text: 'Multiple export formats', available: true },
        { text: 'Advanced CV editor', available: true },
        { text: 'ATS optimization', available: true },
        { text: 'AI content suggestions', available: true },
        { text: 'CV sharing', available: true },
        { text: 'Priority support', available: true },
        { text: 'Cancel anytime', available: true },
      ],
      highlighted: true,
    },
    {
      id: 'yearly',
      name: 'Premium Yearly',
      price: '$99.99',
      period: 'per year',
      description: 'Save 17% compared to monthly',
      buttonText: 'Subscribe',
      buttonVariant: 'contained',
      features: [
        { text: 'Unlimited CVs', available: true },
        { text: 'All templates', available: true },
        { text: 'Multiple export formats', available: true },
        { text: 'Advanced CV editor', available: true },
        { text: 'ATS optimization', available: true },
        { text: 'AI content suggestions', available: true },
        { text: 'CV sharing', available: true },
        { text: 'Priority support', available: true },
        { text: '2 months free', available: true },
      ],
    },
  ];
  
  const handleSubscription = (plan) => {
    setSelectedPlan(plan);
    setOpenDialog(true);
  };
  
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  
  const handleConfirmSubscription = () => {
    // This would connect to a payment processor in a real application
    console.log(`Processing subscription to ${selectedPlan.name}`);
    // After successful payment processing, update user subscription status
    
    // Show success message and close dialog
    setOpenDialog(false);
  };
  
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4 }}>
        Subscription
      </Typography>
      
      {/* Current Subscription Info */}
      <Paper variant="outlined" sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h6">
              Current Subscription
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {isPremiumUser ? 'Premium' : 'Free'} Plan
              </Typography>
              {isPremiumUser && (
                <Chip 
                  icon={<VerifiedIcon />} 
                  label="Active" 
                  color="success" 
                  size="small" 
                  sx={{ ml: 2 }} 
                />
              )}
            </Box>
          </Box>
          
          {isPremiumUser && (
            <Box>
              <Typography variant="body2" color="text.secondary">
                Next billing date
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {user.subscriptionExpiry ? formatDate(user.subscriptionExpiry) : 'N/A'}
              </Typography>
            </Box>
          )}
        </Box>
        
        {isPremiumUser ? (
          <Typography variant="body1">
            You have access to all premium features, including unlimited CVs, ATS optimization, AI content suggestions, and premium templates.
          </Typography>
        ) : (
          <Typography variant="body1">
            You're currently on the Free plan. Upgrade to Premium to unlock all features and create unlimited CVs.
          </Typography>
        )}
        
        {isPremiumUser && (
          <Button 
            variant="outlined" 
            color="error" 
            sx={{ mt: 2 }}
            onClick={() => handleSubscription(plans[0])}
          >
            Cancel Subscription
          </Button>
        )}
      </Paper>
      
      {/* Subscription Plans */}
      <Typography variant="h5" gutterBottom>
        Subscription Plans
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Choose the plan that works best for you.
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {plans.map((plan) => (
          <Grid item key={plan.id} xs={12} md={4}>
            <Card 
              variant={plan.highlighted ? 'elevation' : 'outlined'} 
              elevation={plan.highlighted ? 4 : 1}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                border: plan.highlighted ? `2px solid ${theme.palette.primary.main}` : undefined,
                transform: plan.highlighted ? 'scale(1.03)' : 'none',
                zIndex: plan.highlighted ? 1 : 'auto',
              }}
            >
              {plan.highlighted && (
                <Chip
                  icon={<StarIcon />}
                  label="Most Popular"
                  color="primary"
                  sx={{
                    position: 'absolute',
                    top: -12,
                    right: 20,
                  }}
                />
              )}
              
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: 600 }}>
                  {plan.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 1 }}>
                  <Typography variant="h4" component="span" sx={{ fontWeight: 700 }}>
                    {plan.price}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary" sx={{ ml: 1 }}>
                    {plan.period}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {plan.description}
                </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                <List dense sx={{ py: 0 }}>
                  {plan.features.map((feature, idx) => (
                    <ListItem key={idx} disablePadding sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        {feature.available ? (
                          <CheckIcon color="success" />
                        ) : (
                          <CloseIcon color="error" />
                        )}
                      </ListItemIcon>
                      <ListItemText 
                        primary={feature.text} 
                        primaryTypographyProps={{ 
                          variant: 'body2',
                          sx: { 
                            fontWeight: feature.available ? 400 : 300,
                            color: feature.available ? 'text.primary' : 'text.secondary'
                          } 
                        }} 
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
              
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  fullWidth
                  variant={plan.buttonVariant}
                  color="primary"
                  size="large"
                  disabled={plan.buttonDisabled}
                  onClick={() => handleSubscription(plan)}
                >
                  {plan.buttonText}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {/* FAQ Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" gutterBottom>
          Frequently Asked Questions
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              How do I cancel my subscription?
            </Typography>
            <Typography variant="body2" paragraph>
              You can cancel your subscription at any time from your account settings. Your Premium access will continue until the end of your billing period.
            </Typography>
            
            <Typography variant="subtitle1" gutterBottom>
              What happens to my CVs if I downgrade?
            </Typography>
            <Typography variant="body2" paragraph>
              You'll retain access to all your created CVs, but will be limited to editing only 2 of them. Premium templates will be locked, but your existing CVs using those templates will still be accessible.
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              Can I change my subscription plan?
            </Typography>
            <Typography variant="body2" paragraph>
              Yes, you can upgrade or downgrade your plan at any time. If you upgrade, the new plan will take effect immediately. If you downgrade, the change will take effect at the end of your current billing period.
            </Typography>
            
            <Typography variant="subtitle1" gutterBottom>
              Is there a free trial for Premium?
            </Typography>
            <Typography variant="body2" paragraph>
              We currently don't offer a free trial, but we have a 14-day money-back guarantee if you're not satisfied with the Premium features.
            </Typography>
          </Grid>
        </Grid>
      </Box>
      
      {/* Subscription Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedPlan?.id === 'free' 
            ? 'Cancel Premium Subscription' 
            : `Subscribe to ${selectedPlan?.name}`}
        </DialogTitle>
        <DialogContent>
          {selectedPlan?.id === 'free' ? (
            <>
              <Typography variant="body1" paragraph>
                Are you sure you want to cancel your Premium subscription?
              </Typography>
              <Typography variant="body2" paragraph>
                You'll retain access to premium features until the end of your current billing period. After that, your account will revert to the Free plan with limited features.
              </Typography>
              <Typography variant="body2" color="error">
                This action cannot be undone.
              </Typography>
            </>
          ) : (
            <>
              <Typography variant="body1" paragraph>
                You're about to subscribe to the {selectedPlan?.name} plan for {selectedPlan?.price} {selectedPlan?.period}.
              </Typography>
              <Box sx={{ my: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Plan Details:
                </Typography>
                <Typography variant="body2">
                  • {selectedPlan?.name}: {selectedPlan?.price} {selectedPlan?.period}
                </Typography>
                <Typography variant="body2">
                  • Billing starts today
                </Typography>
                <Typography variant="body2">
                  • Cancel anytime
                </Typography>
              </Box>
              <Typography variant="body2">
                By proceeding, you agree to our Terms of Service and authorize us to charge your payment method on a recurring basis.
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleConfirmSubscription} 
            variant="contained" 
            color={selectedPlan?.id === 'free' ? 'error' : 'primary'}
          >
            {selectedPlan?.id === 'free' ? 'Confirm Cancellation' : 'Confirm Subscription'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SubscriptionPage;