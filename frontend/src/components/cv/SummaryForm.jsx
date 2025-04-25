import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  Grid,
  Tooltip,
  IconButton,
} from '@mui/material';
import { Help as HelpIcon } from '@mui/icons-material';
import { setCurrentCV } from '../../store/slices/cvSlice';
import { nextStep, prevStep } from '../../store/slices/uiSlice';

const SummaryForm = () => {
  const dispatch = useDispatch();
  const { currentCV } = useSelector((state) => state.cv);
  
  // Initialize form state from currentCV or empty values
  const [summary, setSummary] = useState('');

  // Update form data when currentCV changes
  useEffect(() => {
    if (currentCV?.summary) {
      setSummary(currentCV.summary);
    }
  }, [currentCV]);

  const handleChange = (e) => {
    setSummary(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Update CV in store
    dispatch(
      setCurrentCV({
        ...currentCV,
        summary,
      })
    );
    
    // Move to next step
    dispatch(nextStep());
  };

  const handleBack = () => {
    dispatch(prevStep());
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography variant="h5" gutterBottom sx={{ mr: 1 }}>
            Professional Summary
          </Typography>
          <Tooltip title="A strong summary highlights your most relevant skills and experience in 3-5 sentences. Think of it as your elevator pitch.">
            <IconButton size="small">
              <HelpIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        <Typography variant="body2" color="text.secondary" paragraph>
          Write a compelling summary that highlights your key skills and experience.
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <TextField
          fullWidth
          multiline
          rows={6}
          label="Professional Summary"
          placeholder="e.g., Experienced software developer with 5+ years of expertise in building web applications with React and Node.js. Strong focus on code quality and performance optimization. Passionate about creating user-friendly interfaces and mentoring junior developers."
          value={summary}
          onChange={handleChange}
          helperText={`${summary.length}/400 characters (recommended: 150-300)`}
        />

        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Tips for an Effective Summary
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" component="div">
                <ul>
                  <li>Keep it concise (3-5 sentences)</li>
                  <li>Highlight your years of experience</li>
                  <li>Mention your key skills and specialties</li>
                </ul>
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" component="div">
                <ul>
                  <li>Include relevant achievements</li>
                  <li>Tailor it to the job you're applying for</li>
                  <li>Avoid using first-person pronouns (I, me, my)</li>
                </ul>
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant="outlined"
          size="large"
          onClick={handleBack}
        >
          Back
        </Button>
        <Button
          type="submit"
          variant="contained"
          size="large"
        >
          Save & Continue
        </Button>
      </Box>
    </Box>
  );
};

export default SummaryForm;