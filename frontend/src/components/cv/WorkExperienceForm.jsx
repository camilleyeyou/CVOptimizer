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
  IconButton,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIndicatorIcon,
  Help as HelpIcon,
} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { setCurrentCV } from '../../store/slices/cvSlice';
import { nextStep, prevStep, showNotification } from '../../store/slices/uiSlice';
import { isNotEmpty, isNotFutureDate, isEndDateAfterStartDate } from '../../utils/validators';
import { formatMonthYear } from '../../utils/dateFormatter';

const WorkExperienceForm = () => {
  const dispatch = useDispatch();
  const { currentCV } = useSelector((state) => state.cv);
  
  // State for work experiences
  const [workExperiences, setWorkExperiences] = useState([]);
  
  // State for dialog
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(-1);
  const [isCurrentJob, setIsCurrentJob] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    location: '',
    startDate: '',
    endDate: '',
    description: '',
  });
  
  // Form validation errors
  const [errors, setErrors] = useState({});
  
  // Load existing work experiences on component mount
  useEffect(() => {
    if (currentCV?.workExperience) {
      setWorkExperiences(currentCV.workExperience);
    }
  }, [currentCV]);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };
  
  // Toggle current job
  const handleCurrentJobToggle = (e) => {
    setIsCurrentJob(e.target.checked);
    if (e.target.checked) {
      setFormData({
        ...formData,
        endDate: '',
      });
    }
  };
  
  // Validate form fields
  const validateForm = () => {
    const newErrors = {};
    
    if (!isNotEmpty(formData.company)) {
      newErrors.company = 'Company name is required';
    }
    
    if (!isNotEmpty(formData.position)) {
      newErrors.position = 'Position is required';
    }
    
    if (!isNotEmpty(formData.startDate)) {
      newErrors.startDate = 'Start date is required';
    } else if (!isNotFutureDate(formData.startDate)) {
      newErrors.startDate = 'Start date cannot be in the future';
    }
    
    if (!isCurrentJob && !isNotEmpty(formData.endDate)) {
      newErrors.endDate = 'End date is required';
    } else if (!isCurrentJob && !isNotFutureDate(formData.endDate)) {
      newErrors.endDate = 'End date cannot be in the future';
    } else if (!isCurrentJob && !isEndDateAfterStartDate(formData.startDate, formData.endDate)) {
      newErrors.endDate = 'End date must be after start date';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle dialog open for new experience
  const handleOpenDialog = () => {
    setEditIndex(-1);
    setFormData({
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      description: '',
    });
    setIsCurrentJob(false);
    setOpen(true);
  };
  
  // Handle dialog open for editing existing experience
  const handleEditDialog = (index) => {
    const experience = workExperiences[index];
    setEditIndex(index);
    setFormData({
      company: experience.company || '',
      position: experience.position || '',
      location: experience.location || '',
      startDate: experience.startDate || '',
      endDate: experience.endDate || '',
      description: experience.description || '',
    });
    setIsCurrentJob(!experience.endDate);
    setOpen(true);
  };
  
  // Handle dialog close
  const handleCloseDialog = () => {
    setOpen(false);
  };
  
  // Handle save work experience
  const handleSaveExperience = () => {
    if (!validateForm()) {
      return;
    }
    
    const newExperience = {
      ...formData,
      endDate: isCurrentJob ? null : formData.endDate,
    };
    
    let updatedExperiences;
    
    if (editIndex >= 0) {
      // Edit existing experience
      updatedExperiences = [
        ...workExperiences.slice(0, editIndex),
        newExperience,
        ...workExperiences.slice(editIndex + 1),
      ];
    } else {
      // Add new experience
      updatedExperiences = [...workExperiences, newExperience];
    }
    
    // Sort by date (most recent first)
    updatedExperiences.sort((a, b) => {
      const dateA = a.endDate || new Date().toISOString().slice(0, 10);
      const dateB = b.endDate || new Date().toISOString().slice(0, 10);
      return new Date(dateB) - new Date(dateA);
    });
    
    setWorkExperiences(updatedExperiences);
    handleCloseDialog();
    
    // Show success notification
    dispatch(showNotification({
      message: editIndex >= 0 ? 'Work experience updated successfully' : 'Work experience added successfully',
      type: 'success',
    }));
  };
  
  // Handle delete work experience
  const handleDeleteExperience = (index) => {
    const updatedExperiences = [
      ...workExperiences.slice(0, index),
      ...workExperiences.slice(index + 1),
    ];
    setWorkExperiences(updatedExperiences);
    
    // Show success notification
    dispatch(showNotification({
      message: 'Work experience removed',
      type: 'success',
    }));
  };
  
  // Handle drag and drop reordering
  const handleDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    
    const items = Array.from(workExperiences);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setWorkExperiences(items);
  };
  
  // Handle next step
  const handleNext = () => {
    // Save work experiences to CV
    dispatch(
      setCurrentCV({
        ...currentCV,
        workExperience: workExperiences,
      })
    );
    
    // Move to next step
    dispatch(nextStep());
  };
  
  // Handle previous step
  const handleBack = () => {
    // Save work experiences to CV
    dispatch(
      setCurrentCV({
        ...currentCV,
        workExperience: workExperiences,
      })
    );
    
    // Move to previous step
    dispatch(prevStep());
  };
  
  return (
    <Box>
      <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography variant="h5" gutterBottom sx={{ mr: 1 }}>
            Work Experience
          </Typography>
          <Tooltip title="Start with your most recent position and include relevant experience. Focus on achievements and responsibilities.">
            <IconButton size="small">
              <HelpIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        <Typography variant="body2" color="text.secondary" paragraph>
          Add your work history, starting with the most recent position.
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        {/* Work Experience List */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="workExperiences">
            {(provided) => (
              <Box
                {...provided.droppableProps}
                ref={provided.innerRef}
                sx={{ mb: 3 }}
              >
                {workExperiences.length === 0 ? (
                  <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4 }}>
                    No work experience added yet. Click "Add Work Experience" to begin.
                  </Typography>
                ) : (
                  workExperiences.map((experience, index) => (
                    <Draggable key={index} draggableId={`exp-${index}`} index={index}>
                      {(provided) => (
                        <Card
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          sx={{ mb: 2, position: 'relative' }}
                        >
                          <Box
                            {...provided.dragHandleProps}
                            sx={{
                              position: 'absolute',
                              left: 0,
                              top: 0,
                              height: '100%',
                              width: '30px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'grab',
                              color: 'text.disabled',
                              '&:hover': { color: 'text.secondary' },
                            }}
                          >
                            <DragIndicatorIcon />
                          </Box>
                          <CardContent sx={{ pl: 4 }}>
                            <Typography variant="h6" component="div">
                              {experience.position}
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary">
                              {experience.company}
                              {experience.location && ` • ${experience.location}`}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {formatMonthYear(experience.startDate)} - {experience.endDate ? formatMonthYear(experience.endDate) : 'Present'}
                            </Typography>
                            {experience.description && (
                              <Typography variant="body2" sx={{ mt: 1 }}>
                                {experience.description}
                              </Typography>
                            )}
                          </CardContent>
                          <CardActions sx={{ justifyContent: 'flex-end' }}>
                            <IconButton color="primary" onClick={() => handleEditDialog(index)}>
                              <EditIcon />
                            </IconButton>
                            <IconButton color="error" onClick={() => handleDeleteExperience(index)}>
                              <DeleteIcon />
                            </IconButton>
                          </CardActions>
                        </Card>
                      )}
                    </Draggable>
                  ))
                )}
                {provided.placeholder}
              </Box>
            )}
          </Droppable>
        </DragDropContext>
        
        {/* Add Button */}
        <Box sx={{ textAlign: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
          >
            Add Work Experience
          </Button>
        </Box>
      </Paper>
      
      {/* Dialog for adding/editing work experience */}
      <Dialog open={open} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editIndex >= 0 ? 'Edit Work Experience' : 'Add Work Experience'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Position/Title"
                name="position"
                value={formData.position}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.position}
                helperText={errors.position}
                placeholder="e.g., Software Developer"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.company}
                helperText={errors.company}
                placeholder="e.g., Tech Solutions Inc."
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                fullWidth
                placeholder="e.g., New York, NY"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={isCurrentJob}
                    onChange={handleCurrentJobToggle}
                    color="primary"
                  />
                }
                label="This is my current job"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Start Date"
                name="startDate"
                type="month"
                value={formData.startDate}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.startDate}
                helperText={errors.startDate}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="End Date"
                name="endDate"
                type="month"
                value={formData.endDate}
                onChange={handleChange}
                fullWidth
                required={!isCurrentJob}
                disabled={isCurrentJob}
                error={!!errors.endDate}
                helperText={isCurrentJob ? 'Current position' : errors.endDate}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                fullWidth
                multiline
                rows={4}
                placeholder="Describe your responsibilities, achievements, and skills used. Use bullet points or paragraphs."
                helperText="Tip: Focus on achievements and quantifiable results"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleSaveExperience}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Navigation Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant="outlined"
          size="large"
          onClick={handleBack}
        >
          Back
        </Button>
        <Button
          variant="contained"
          size="large"
          onClick={handleNext}
        >
          Save & Continue
        </Button>
      </Box>
    </Box>
  );
};

export default WorkExperienceForm;