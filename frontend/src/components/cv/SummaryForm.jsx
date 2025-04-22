import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Chip,
  Stack,
  Alert,
  Tooltip,
  LinearProgress,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  Lightbulb as LightbulbIcon,
  AutoAwesome as AutoAwesomeIcon,
  ContentCopy as ContentCopyIcon,
} from '@mui/icons-material';

import { updateField } from '../../store/slices/cvSlice';

const SummaryForm = () => {
  const dispatch = useDispatch();
  const { currentCV } = useSelector((state) => state.cv);
  const { user } = useSelector((state) => state.auth);
  
  const [charCount, setCharCount] = useState(currentCV?.summary?.length || 0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const maxCharCount = 2000;
  const isPremiumUser = user?.subscription === 'premium';
  
  const handleChange = (event) => {
    const newValue = event.target.value;
    setCharCount(newValue.length);
    dispatch(updateField({ path: 'summary', value: newValue }));
  };
  
  // In a real app, this would connect to an AI service
  const generateSummary = () => {
    setIsGenerating(true);
    
    // Mock API call delay
    setTimeout(() => {
      const mockSuggestions = [
        "Experienced software engineer with 5+ years of expertise in building scalable web applications. Proficient in React, Node.js, and cloud technologies with a passion for creating intuitive user experiences.",
        "Results-driven software developer with a track record of delivering high-quality applications on time and under budget. Strong problem-solving skills and experience working in agile environments.",
        "Innovative full-stack developer specialized in modern JavaScript frameworks. Committed to writing clean, maintainable code and staying current with industry best practices."
      ];
      
      setSuggestions(mockSuggestions);
      setShowSuggestions(true);
      setIsGenerating(false);
    }, 2000);
  };
  
  const applySuggestion = (suggestion) => {
    dispatch(updateField({ path: 'summary', value: suggestion }));
    setCharCount(suggestion.length);
    setShowSuggestions(false);
  };
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Professional Summary
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Add a compelling professional summary to grab the employer's attention. This should highlight your key qualifications and career goals.
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper elevation={0} variant="outlined" sx={{ p: 3, mt: 2 }}>
            <TextField
              fullWidth
              multiline
              rows={8}
              label="Professional Summary"
              value={currentCV?.summary || ''}
              onChange={handleChange}
              placeholder="Write a compelling summary that highlights your key skills, experience, and what you can bring to the role."
              helperText={`${charCount}/${maxCharCount} characters`}
              inputProps={{ maxLength: maxCharCount }}
              sx={{ mb: 2 }}
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <LinearProgress 
                variant="determinate" 
                value={(charCount / maxCharCount) * 100} 
                sx={{ 
                  height: 8, 
                  borderRadius: 5, 
                  width: '60%',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: 
                      charCount < 100 
                        ? 'error.main' 
                        : charCount < 300 
                        ? 'warning.main' 
                        : 'success.main',
                  }
                }} 
              />
              
              <Tooltip title={isPremiumUser ? "Generate AI suggestions" : "Upgrade to Premium to use AI suggestions"}>
                <span>
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<AutoAwesomeIcon />}
                    onClick={generateSummary}
                    disabled={!isPremiumUser || isGenerating}
                    sx={{ ml: 2 }}
                  >
                    {isGenerating ? 'Generating...' : 'Generate Summary'}
                  </Button>
                </span>
              </Tooltip>
            </Box>
            
            {!isPremiumUser && (
              <Alert severity="info" sx={{ mt: 2 }}>
                Upgrade to Premium to access AI-powered summary suggestions and optimize your CV for ATS.
              </Alert>
            )}
          </Paper>
          
          {showSuggestions && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                AI-Generated Suggestions
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Choose one of the suggestions below or use them as inspiration for your own summary.
              </Typography>
              
              <Stack spacing={2}>
                {suggestions.map((suggestion, index) => (
                  <Card 
                    key={index} 
                    variant="outlined"
                    sx={{ 
                      cursor: 'pointer',
                      '&:hover': { boxShadow: 2 }
                    }}
                  >
                    <CardContent>
                      <Typography variant="body2" gutterBottom>
                        {suggestion}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                        <Button 
                          size="small" 
                          startIcon={<ContentCopyIcon />}
                          onClick={() => applySuggestion(suggestion)}
                        >
                          Use This
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </Box>
          )}
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ mt: 2, bgcolor: 'rgba(0, 0, 0, 0.02)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LightbulbIcon color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6">Writing Tips</Typography>
              </Box>
              
              <Typography variant="body2" paragraph>
                An effective professional summary should:
              </Typography>
              
              <Stack spacing={1}>
                <Chip 
                  label="Be concise (3-5 sentences)" 
                  variant="outlined" 
                  size="small" 
                  color="primary"
                />
                <Chip 
                  label="Highlight your most relevant skills" 
                  variant="outlined" 
                  size="small"
                  color="primary" 
                />
                <Chip 
                  label="Include years of experience" 
                  variant="outlined" 
                  size="small"
                  color="primary" 
                />
                <Chip 
                  label="Mention key achievements" 
                  variant="outlined" 
                  size="small" 
                  color="primary"
                />
                <Chip 
                  label="Tailor it to the job description" 
                  variant="outlined" 
                  size="small"
                  color="primary" 
                />
              </Stack>
              
              <Typography variant="body2" sx={{ mt: 3, fontStyle: 'italic' }}>
                Pro tip: Try to include keywords from the job description to help your CV pass through Applicant Tracking Systems (ATS).
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SummaryForm;