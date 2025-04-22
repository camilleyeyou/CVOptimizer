import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  Paper,
  Switch,
  TextField,
  Typography,
  Stack,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  AutoAwesome as AutoAwesomeIcon,
  FormatListBulleted as BulletListIcon,
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';

import { updateField } from '../../store/slices/cvSlice';

const WorkExperienceForm = () => {
  const dispatch = useDispatch();
  const { currentCV } = useSelector((state) => state.cv);
  const { user } = useSelector((state) => state.auth);
  
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(-1);
  const [validationErrors, setValidationErrors] = useState({});
  
  // Form state
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    location: '',
    startDate: null,
    endDate: null,
    current: false,
    description: '',
    achievements: [''],
  });
  
  const isPremiumUser = user?.subscription === 'premium';
  const workExperience = currentCV?.workExperience || [];
  
  const handleOpenDialog = (index = -1) => {
    if (index >= 0) {
      // Edit existing entry
      const experience = workExperience[index];
      setFormData({
        ...experience,
        startDate: experience.startDate ? new Date(experience.startDate) : null,
        endDate: experience.endDate ? new Date(experience.endDate) : null,
      });
      setEditIndex(index);
    } else {
      // New entry
      setFormData({
        company: '',
        position: '',
        location: '',
        startDate: null,
        endDate: null,
        current: false,
        description: '',
        achievements: [''],
      });
      setEditIndex(-1);
    }
    setValidationErrors({});
    setOpen(true);
  };
  
  const handleClose = () => {
    setOpen(false);
  };
  
  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
    
    // Clear validation error when field is edited
    if (validationErrors[field]) {
      setValidationErrors({
        ...validationErrors,
        [field]: null,
      });
    }
  };
  
  const handleDateChange = (field) => (date) => {
    setFormData({
      ...formData,
      [field]: date,
    });
    
    if (validationErrors[field]) {
      setValidationErrors({
        ...validationErrors,
        [field]: null,
      });
    }
  };
  
  const handleCurrentJobChange = (event) => {
    const isCurrent = event.target.checked;
    setFormData({
      ...formData,
      current: isCurrent,
      endDate: isCurrent ? null : formData.endDate,
    });
  };
  
  const handleAchievementChange = (index) => (event) => {
    const newAchievements = [...formData.achievements];
    newAchievements[index] = event.target.value;
    setFormData({
      ...formData,
      achievements: newAchievements,
    });
  };
  
  const handleAddAchievement = () => {
    setFormData({
      ...formData,
      achievements: [...formData.achievements, ''],
    });
  };
  
  const handleRemoveAchievement = (index) => {
    const newAchievements = formData.achievements.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      achievements: newAchievements.length > 0 ? newAchievements : [''],
    });
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!formData.company.trim()) {
      errors.company = 'Company name is required';
    }
    
    if (!formData.position.trim()) {
      errors.position = 'Position is required';
    }
    
    if (!formData.startDate) {
      errors.startDate = 'Start date is required';
    }
    
    if (!formData.current && !formData.endDate) {
      errors.endDate = 'End date is required for past positions';
    }
    
    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      errors.endDate = 'End date must be after start date';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSave = () => {
    if (!validateForm()) {
      return;
    }
    
    // Filter out empty achievements
    const filteredAchievements = formData.achievements.filter(achievement => achievement.trim() !== '');
    
    const experienceEntry = {
      ...formData,
      achievements: filteredAchievements,
    };
    
    let updatedExperience;
    
    if (editIndex >= 0) {
      // Update existing entry
      updatedExperience = [
        ...workExperience.slice(0, editIndex),
        experienceEntry,
        ...workExperience.slice(editIndex + 1),
      ];
    } else {
      // Add new entry
      updatedExperience = [...workExperience, experienceEntry];
    }
    
    dispatch(updateField({ path: 'workExperience', value: updatedExperience }));
    handleClose();
  };
  
  const handleDelete = (index) => {
    const updatedExperience = workExperience.filter((_, i) => i !== index);
    dispatch(updateField({ path: 'workExperience', value: updatedExperience }));
  };
  
  const handleMoveUp = (index) => {
    if (index === 0) return;
    
    const updatedExperience = [...workExperience];
    const temp = updatedExperience[index];
    updatedExperience[index] = updatedExperience[index - 1];
    updatedExperience[index - 1] = temp;
    
    dispatch(updateField({ path: 'workExperience', value: updatedExperience }));
  };
  
  const handleMoveDown = (index) => {
    if (index === workExperience.length - 1) return;
    
    const updatedExperience = [...workExperience];
    const temp = updatedExperience[index];
    updatedExperience[index] = updatedExperience[index + 1];
    updatedExperience[index + 1] = temp;
    
    dispatch(updateField({ path: 'workExperience', value: updatedExperience }));
  };
  
  // Mock function for AI suggestions (would connect to backend in real app)
  const generateAchievements = () => {
    if (!formData.description || !isPremiumUser) return;
    
    // Mock delay
    setTimeout(() => {
      const mockSuggestions = [
        "Increased website performance by 40% through code optimization and implementing best practices",
        "Led a team of 5 developers to deliver project milestones consistently ahead of schedule",
        "Reduced bug reports by 30% by implementing comprehensive unit testing",
        "Collaborated with UX team to redesign the checkout process, resulting in a 15% conversion increase"
      ];
      
      setFormData({
        ...formData,
        achievements: [...formData.achievements.filter(a => a.trim() !== ''), ...mockSuggestions],
      });
    }, 1000);
  };
  
  const formatDateRange = (startDate, endDate, current) => {
    const start = startDate ? format(new Date(startDate), 'MMM yyyy') : '';
    if (current) {
      return `${start} - Present`;
    }
    const end = endDate ? format(new Date(endDate), 'MMM yyyy') : '';
    return `${start} - ${end}`;
  };
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Work Experience
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Experience
        </Button>
      </Box>
      
      <Typography variant="body2" color="text.secondary" paragraph>
        Add your work history, starting with your most recent position. Focus on achievements and responsibilities relevant to the job you're applying for.
      </Typography>
      
      {workExperience.length === 0 ? (
        <Paper 
          elevation={0} 
          variant="outlined" 
          sx={{ 
            p: 3, 
            mt: 2, 
            textAlign: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.02)'
          }}
        >
          <Typography variant="body1" color="text.secondary">
            No work experience added yet.
          </Typography>
          <Button
            variant="text"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{ mt: 1 }}
          >
            Add your first experience
          </Button>
        </Paper>
      ) : (
        <Stack spacing={2} sx={{ mt: 2 }}>
          {workExperience.map((experience, index) => (
            <Card key={index} variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="h6">{experience.position}</Typography>
                    <Typography variant="subtitle1">{experience.company}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {experience.location && `${experience.location} | `}
                      {formatDateRange(experience.startDate, experience.endDate, experience.current)}
                    </Typography>
                  </Box>
                  <Box>
                    <IconButton size="small" onClick={() => handleOpenDialog(index)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(index)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                    >
                      <ArrowUpwardIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      onClick={() => handleMoveDown(index)}
                      disabled={index === workExperience.length - 1}
                    >
                      <ArrowDownwardIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
                
                {experience.description && (
                  <Typography variant="body2" paragraph sx={{ mt: 2 }}>
                    {experience.description}
                  </Typography>
                )}
                
                {experience.achievements && experience.achievements.length > 0 && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Key Achievements:
                    </Typography>
                    <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                      {experience.achievements.map((achievement, i) => (
                        <li key={i}>
                          <Typography variant="body2">{achievement}</Typography>
                        </li>
                      ))}
                    </ul>
                  </Box>
                )}
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
      
      {/* Add/Edit Experience Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {editIndex >= 0 ? 'Edit Work Experience' : 'Add Work Experience'}
        </DialogTitle>
        
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Company"
                required
                value={formData.company}
                onChange={handleChange('company')}
                error={!!validationErrors.company}
                helperText={validationErrors.company}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Position"
                required
                value={formData.position}
                onChange={handleChange('position')}
                error={!!validationErrors.position}
                helperText={validationErrors.position}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Location"
                placeholder="City, Country (optional)"
                value={formData.location}
                onChange={handleChange('location')}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Start Date *"
                  value={formData.startDate}
                  onChange={handleDateChange('startDate')}
                  views={['year', 'month']}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!validationErrors.startDate,
                      helperText: validationErrors.startDate,
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="End Date"
                  value={formData.endDate}
                  onChange={handleDateChange('endDate')}
                  disabled={formData.current}
                  views={['year', 'month']}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!validationErrors.endDate,
                      helperText: validationErrors.endDate,
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.current}
                    onChange={handleCurrentJobChange}
                  />
                }
                label="I currently work here"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                placeholder="Briefly describe your role and responsibilities"
                value={formData.description}
                onChange={handleChange('description')}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle1">
                  Key Achievements
                </Typography>
                <Box>
                  {isPremiumUser && (
                    <Tooltip title="Generate achievement suggestions based on your description">
                      <Button
                        size="small"
                        startIcon={<AutoAwesomeIcon />}
                        onClick={generateAchievements}
                        disabled={!formData.description}
                        sx={{ mr: 1 }}
                      >
                        Generate
                      </Button>
                    </Tooltip>
                  )}
                  <Button
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={handleAddAchievement}
                  >
                    Add
                  </Button>
                </Box>
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                <BulletListIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                Use bullet points to highlight specific accomplishments and results
              </Typography>
              
              <Stack spacing={2}>
                {formData.achievements.map((achievement, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                    <TextField
                      fullWidth
                      multiline
                      maxRows={2}
                      placeholder={`Achievement ${index + 1}`}
                      value={achievement}
                      onChange={handleAchievementChange(index)}
                      InputProps={{
                        startAdornment: (
                          <Box component="span" sx={{ mr: 1 }}>•</Box>
                        ),
                      }}
                    />
                    <IconButton 
                      size="small" 
                      onClick={() => handleRemoveAchievement(index)}
                      disabled={formData.achievements.length === 1}
                      sx={{ ml: 1 }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Stack>
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WorkExperienceForm;