import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import cvService from '../services/cvService';
import { useSelector } from 'react-redux';

const DirectCVCreate = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { subscription } = useSelector((state) => state.subscription);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [cv, setCv] = useState({
    title: 'My New CV',
    template: 'modern',
    personalInfo: {
      fullName: '',
      jobTitle: '',
      email: '',
      phone: '',
      location: '',
    },
    summary: 'A brief professional summary.'
  });
  
  useEffect(() => {
    // Pre-fill with user data if available
    if (user) {
      setCv(prev => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          fullName: user.name || '',
          email: user.email || '',
        }
      }));
    }
  }, [user]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCv(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setCv(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [name]: value
      }
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    // Check if we're on free plan and at the limit
    if (subscription === 'free') {
      try {
        const cvData = await cvService.getUserCVs();
        const cvCount = Array.isArray(cvData) ? cvData.length : 
                       (cvData && Array.isArray(cvData.cvs)) ? cvData.cvs.length : 0;
        
        if (cvCount >= 3) {
          setError('Free plan limit reached. Please upgrade to premium to create more CVs.');
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn("Could not check CV count:", err);
        // Continue anyway, the server will enforce limits
      }
    }
    
    try {
      // Make sure we have the correct user ID format
      let userId = null;
      
      // Try different possible locations for user ID
      if (user && user.id) {
        userId = user.id;
      } else if (user && user._id) {
        userId = user._id;
      } else if (user && typeof user === 'object') {
        // Look for an ID-like property
        const idProps = ['id', '_id', 'userId', 'user_id'];
        for (const prop of idProps) {
          if (user[prop]) {
            userId = user[prop];
            break;
          }
        }
      }
      
      if (!userId) {
        console.error("Could not determine user ID from user object:", user);
        setError("Missing user ID. Please try logging out and back in.");
        setLoading(false);
        return;
      }
      
      // Add user ID to the CV data
      const cvData = {
        ...cv,
        userId: userId,
        user: userId  // Include both formats to be safe
      };
      
      console.log('Submitting CV data:', cvData);
      
      // Directly call the API service
      const result = await cvService.createCV(cvData);
      
      console.log('CV created successfully:', result);
      setSuccess(true);
      
      // Navigate to the edit page after successful creation
      const cvId = result._id || (result.cv && result.cv._id);
      if (cvId) {
        setTimeout(() => {
          navigate(`/cv/edit/${cvId}`);
        }, 1500);
      } else {
        console.warn("Created CV but could not determine ID:", result);
        // Go back to dashboard since we don't have an ID to edit
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      }
    } catch (err) {
      console.error('Error creating CV:', err);
      
      // Check for specific errors
      if (err.message && err.message.includes('free plan limit')) {
        setError('You have reached your free plan limit. Please upgrade to premium to create more CVs.');
      } else {
        setError(err.message || 'Failed to create CV');
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Create New CV (Direct API)
      </Typography>
      
      <Card sx={{ mb: 3, bgcolor: 'rgba(0,0,0,0.02)' }}>
        <CardContent>
          <Typography variant="subtitle2">Debug Info:</Typography>
          <Divider sx={{ my: 1 }} />
          <Typography variant="body2">User ID: {user?.id || user?._id || 'Missing'}</Typography>
          <Typography variant="body2">Subscription: {subscription || 'Unknown'}</Typography>
          <Typography variant="body2">Auth Token: {localStorage.getItem('token') ? 'Present' : 'Missing'}</Typography>
          <Typography variant="body2">User object keys: {user ? Object.keys(user).join(', ') : 'No user'}</Typography>
        </CardContent>
      </Card>
      
      {subscription === 'free' && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Free plan users can create up to 3 CVs. Upgrade to premium for unlimited CVs.
        </Alert>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          CV created successfully! Redirecting...
        </Alert>
      )}
      
      <Paper elevation={2} sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="CV Title"
                name="title"
                value={cv.title}
                onChange={handleChange}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Template</InputLabel>
                <Select
                  name="template"
                  value={cv.template}
                  onChange={handleChange}
                  label="Template"
                  required
                >
                  <MenuItem value="modern">Modern</MenuItem>
                  <MenuItem value="classic">Classic</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Personal Information
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Full Name"
                name="fullName"
                value={cv.personalInfo.fullName}
                onChange={handlePersonalInfoChange}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Job Title"
                name="jobTitle"
                value={cv.personalInfo.jobTitle}
                onChange={handlePersonalInfoChange}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={cv.personalInfo.email}
                onChange={handlePersonalInfoChange}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={cv.personalInfo.phone}
                onChange={handlePersonalInfoChange}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={cv.personalInfo.location}
                onChange={handlePersonalInfoChange}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Summary
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Professional Summary"
                name="summary"
                value={cv.summary}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/dashboard')}
              >
                Cancel
              </Button>
              
              <Button
                type="submit"
                variant="contained"
                startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create CV'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default DirectCVCreate;