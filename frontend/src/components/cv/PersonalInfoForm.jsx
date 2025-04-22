import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, 
  Grid, 
  TextField, 
  Typography, 
  Paper,
  InputAdornment,
  Divider
} from '@mui/material';
import { 
  Person as PersonIcon, 
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Language as WebsiteIcon,
  LinkedIn as LinkedInIcon,
  GitHub as GitHubIcon,
  Work as WorkIcon
} from '@mui/icons-material';

import { updateField } from '../../store/slices/cvSlice';

const PersonalInfoForm = () => {
  const dispatch = useDispatch();
  const { currentCV } = useSelector((state) => state.cv);
  
  const handleChange = (field) => (event) => {
    dispatch(updateField({ 
      path: `personalInfo.${field}`, 
      value: event.target.value 
    }));
  };
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Personal Information
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Add your contact details so employers can reach you.
      </Typography>
      
      <Paper elevation={0} variant="outlined" sx={{ p: 3, mt: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              required
              label="Full Name"
              value={currentCV?.personalInfo?.fullName || ''}
              onChange={handleChange('fullName')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Job Title"
              placeholder="e.g. Software Engineer"
              value={currentCV?.personalInfo?.jobTitle || ''}
              onChange={handleChange('jobTitle')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <WorkIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle2" sx={{ mt: 2, mb: 2 }}>
              Contact Information
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              required
              type="email"
              label="Email"
              value={currentCV?.personalInfo?.email || ''}
              onChange={handleChange('email')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Phone"
              placeholder="e.g. +1 (555) 123-4567"
              value={currentCV?.personalInfo?.phone || ''}
              onChange={handleChange('phone')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Location"
              placeholder="e.g. New York, NY"
              value={currentCV?.personalInfo?.location || ''}
              onChange={handleChange('location')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle2" sx={{ mt: 2, mb: 2 }}>
              Online Presence (Optional)
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Website"
              placeholder="e.g. https://yourwebsite.com"
              value={currentCV?.personalInfo?.website || ''}
              onChange={handleChange('website')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <WebsiteIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="LinkedIn"
              placeholder="e.g. linkedin.com/in/yourname"
              value={currentCV?.personalInfo?.linkedin || ''}
              onChange={handleChange('linkedin')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LinkedInIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="GitHub"
              placeholder="e.g. github.com/yourusername"
              value={currentCV?.personalInfo?.github || ''}
              onChange={handleChange('github')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <GitHubIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
      </Paper>
      
      <Box sx={{ mt: 3 }}>
        <Typography variant="body2" color="text.secondary">
          * Required fields
        </Typography>
      </Box>
    </Box>
  );
};

export default PersonalInfoForm;