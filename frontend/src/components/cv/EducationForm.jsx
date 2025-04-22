import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Card,
  CardContent,
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
  Stack
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  School as SchoolIcon
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';

import { updateField } from '../../store/slices/cvSlice';

const EducationForm = () => {
  const dispatch = useDispatch();
  const { currentCV } = useSelector((state) => state.cv);
  
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(-1);
  const [validationErrors, setValidationErrors] = useState({});
  
  // Form state
  const [formData, setFormData] = useState({
    institution: '',
    degree: '',
    field: '',
    location: '',
    startDate: null,
    endDate: null,
    current: false,
    description: '',
    achievements: [],
  });
  
  const education = currentCV?.education || [];
  
  const handleOpenDialog = (index = -1) => {
    if (index >= 0) {
      // Edit existing entry
      const educationItem = education[index];
      setFormData({
        ...educationItem,
        startDate: educationItem.startDate ? new Date(educationItem.startDate) : null,
        endDate: educationItem.endDate ? new Date(educationItem.endDate) : null,
      });
      setEditIndex(index);
    } else {
      // New entry
      setFormData({
        institution: '',
        degree: '',
        field: '',
        location: '',
        startDate: null,
        endDate: null,
        current: false,
        description: '',
        achievements: [],
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
  
  const handleCurrentChange = (event) => {
    const isCurrent = event.target.checked;
    setFormData({
      ...formData,
      current: isCurrent,
      endDate: isCurrent ? null : formData.endDate,
    });
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!formData.institution.trim()) {
      errors.institution = 'Institution name is required';
    }
    
    if (!formData.degree.trim()) {
      errors.degree = 'Degree is required';
    }
    
    if (!formData.startDate) {
      errors.startDate = 'Start date is required';
    }
    
    if (!formData.current && !formData.endDate) {
      errors.endDate = 'End date is required for completed education';
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
    
    const educationEntry = { ...formData };
    
    let updatedEducation;
    
    if (editIndex >= 0) {
      // Update existing entry
      updatedEducation = [
        ...education.slice(0, editIndex),
        educationEntry,
        ...education.slice(editIndex + 1),
      ];
    } else {
      // Add new entry
      updatedEducation = [...education, educationEntry];
    }
    
    dispatch(updateField({ path: 'education', value: updatedEducation }));
    handleClose();
  };
  
  const handleDelete = (index) => {
    const updatedEducation = education.filter((_, i) => i !== index);
    dispatch(updateField({ path: 'education', value: updatedEducation }));
  };
  
  const handleMoveUp = (index) => {
    if (index === 0) return;
    
    const updatedEducation = [...education];
    const temp = updatedEducation[index];
    updatedEducation[index] = updatedEducation[index - 1];
    updatedEducation[index - 1] = temp;
    
    dispatch(updateField({ path: 'education', value: updatedEducation }));
  };
  
  const handleMoveDown = (index) => {
    if (index === education.length - 1) return;
    
    const updatedEducation = [...education];
    const temp = updatedEducation[index];
    updatedEducation[index] = updatedEducation[index + 1];
    updatedEducation[index + 1] = temp;
    
    dispatch(updateField({ path: 'education', value: updatedEducation }));
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
          Education
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Education
        </Button>
      </Box>
      
      <Typography variant="body2" color="text.secondary" paragraph>
        Add your educational background, starting with your most recent or highest qualification.
      </Typography>
      
      {education.length === 0 ? (
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
            No education added yet.
          </Typography>
          <Button
            variant="text"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{ mt: 1 }}
          >
            Add your education
          </Button>
        </Paper>
      ) : (
        <Stack spacing={2} sx={{ mt: 2 }}>
          {education.map((edu, index) => (
            <Card key={index} variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="h6">{edu.degree}</Typography>
                    <Typography variant="subtitle1">
                      {edu.institution}
                      {edu.field && `, ${edu.field}`}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {edu.location && `${edu.location} | `}
                      {formatDateRange(edu.startDate, edu.endDate, edu.current)}
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
                      disabled={index === education.length - 1}
                    >
                      <ArrowDownwardIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
                
                {edu.description && (
                  <Typography variant="body2" paragraph sx={{ mt: 2 }}>
                    {edu.description}
                  </Typography>
                )}
                
                {edu.achievements && edu.achievements.length > 0 && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Achievements:
                    </Typography>
                    <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                      {edu.achievements.map((achievement, i) => (
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
      
      {/* Add/Edit Education Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {editIndex >= 0 ? 'Edit Education' : 'Add Education'}
        </DialogTitle>
        
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Institution"
                required
                value={formData.institution}
                onChange={handleChange('institution')}
                error={!!validationErrors.institution}
                helperText={validationErrors.institution}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Degree"
                required
                placeholder="e.g. Bachelor of Science, High School Diploma"
                value={formData.degree}
                onChange={handleChange('degree')}
                error={!!validationErrors.degree}
                helperText={validationErrors.degree}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Field of Study"
                placeholder="e.g. Computer Science"
                value={formData.field}
                onChange={handleChange('field')}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
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
                    onChange={handleCurrentChange}
                  />
                }
                label="I am currently studying here"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                placeholder="Describe your studies, thesis, or notable coursework (optional)"
                value={formData.description}
                onChange={handleChange('description')}
              />
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

export default EducationForm;