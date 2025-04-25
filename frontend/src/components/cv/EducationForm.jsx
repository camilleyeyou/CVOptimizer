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

const EducationForm = () => {
  const dispatch = useDispatch();
  const { currentCV } = useSelector((state) => state.cv);
  
  // State for education entries
  const [educationList, setEducationList] = useState([]);
  
  // State for dialog
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(-1);
  const [isCurrentlyStudying, setIsCurrentlyStudying] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    institution: '',
    degree: '',
    fieldOfStudy: '',
    location: '',
    startDate: '',
    endDate: '',
    description: '',
    gpa: '',
  });
  
  // Form validation errors
  const [errors, setErrors] = useState({});
  
  // Load existing education entries on component mount
  useEffect(() => {
    if (currentCV?.education) {
      setEducationList(currentCV.education);
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
  
  // Toggle currently studying
  const handleCurrentlyStudyingToggle = (e) => {
    setIsCurrentlyStudying(e.target.checked);
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
    
    if (!isNotEmpty(formData.institution)) {
      newErrors.institution = 'Institution name is required';
    }
    
    if (!isNotEmpty(formData.degree)) {
      newErrors.degree = 'Degree is required';
    }
    
    if (!isNotEmpty(formData.startDate)) {
      newErrors.startDate = 'Start date is required';
    } else if (!isNotFutureDate(formData.startDate)) {
      newErrors.startDate = 'Start date cannot be in the future';
    }
    
    if (!isCurrentlyStudying && !isNotEmpty(formData.endDate)) {
      newErrors.endDate = 'End date is required';
    } else if (!isCurrentlyStudying && !isNotFutureDate(formData.endDate)) {
      newErrors.endDate = 'End date cannot be in the future';
    } else if (!isCurrentlyStudying && !isEndDateAfterStartDate(formData.startDate, formData.endDate)) {
      newErrors.endDate = 'End date must be after start date';
    }
    
    if (formData.gpa && (isNaN(formData.gpa) || Number(formData.gpa) < 0 || Number(formData.gpa) > 4.0)) {
      newErrors.gpa = 'GPA must be a number between 0 and 4.0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle dialog open for new education entry
  const handleOpenDialog = () => {
    setEditIndex(-1);
    setFormData({
      institution: '',
      degree: '',
      fieldOfStudy: '',
      location: '',
      startDate: '',
      endDate: '',
      description: '',
      gpa: '',
    });
    setIsCurrentlyStudying(false);
    setOpen(true);
  };
  
  // Handle dialog open for editing existing education entry
  const handleEditDialog = (index) => {
    const education = educationList[index];
    setEditIndex(index);
    setFormData({
      institution: education.institution || '',
      degree: education.degree || '',
      fieldOfStudy: education.fieldOfStudy || '',
      location: education.location || '',
      startDate: education.startDate || '',
      endDate: education.endDate || '',
      description: education.description || '',
      gpa: education.gpa || '',
    });
    setIsCurrentlyStudying(!education.endDate);
    setOpen(true);
  };
  
  // Handle dialog close
  const handleCloseDialog = () => {
    setOpen(false);
  };
  
  // Handle save education
  const handleSaveEducation = () => {
    if (!validateForm()) {
      return;
    }
    
    const newEducation = {
      ...formData,
      endDate: isCurrentlyStudying ? null : formData.endDate,
    };
    
    let updatedEducation;
    
    if (editIndex >= 0) {
      // Edit existing education
      updatedEducation = [
        ...educationList.slice(0, editIndex),
        newEducation,
        ...educationList.slice(editIndex + 1),
      ];
    } else {
      // Add new education
      updatedEducation = [...educationList, newEducation];
    }
    
    // Sort by date (most recent first)
    updatedEducation.sort((a, b) => {
      const dateA = a.endDate || new Date().toISOString().slice(0, 10);
      const dateB = b.endDate || new Date().toISOString().slice(0, 10);
      return new Date(dateB) - new Date(dateA);
    });
    
    setEducationList(updatedEducation);
    handleCloseDialog();
    
    // Show success notification
    dispatch(showNotification({
      message: editIndex >= 0 ? 'Education updated successfully' : 'Education added successfully',
      type: 'success',
    }));
  };
  
  // Handle delete education
  const handleDeleteEducation = (index) => {
    const updatedEducation = [
      ...educationList.slice(0, index),
      ...educationList.slice(index + 1),
    ];
    setEducationList(updatedEducation);
    
    // Show success notification
    dispatch(showNotification({
      message: 'Education removed',
      type: 'success',
    }));
  };
  
  // Handle drag and drop reordering
  const handleDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    
    const items = Array.from(educationList);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setEducationList(items);
  };
  
  // Handle next step
  const handleNext = () => {
    // Save education to CV
    dispatch(
      setCurrentCV({
        ...currentCV,
        education: educationList,
      })
    );
    
    // Move to next step
    dispatch(nextStep());
  };
  
  // Handle previous step
  const handleBack = () => {
    // Save education to CV
    dispatch(
      setCurrentCV({
        ...currentCV,
        education: educationList,
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
            Education
          </Typography>
          <Tooltip title="Include your highest and most relevant degrees. For recent graduates, this section should come before work experience.">
            <IconButton size="small">
              <HelpIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        <Typography variant="body2" color="text.secondary" paragraph>
          Add your education history, starting with the most recent.
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        {/* Education List */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="education">
            {(provided) => (
              <Box
                {...provided.droppableProps}
                ref={provided.innerRef}
                sx={{ mb: 3 }}
              >
                {educationList.length === 0 ? (
                  <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4 }}>
                    No education added yet. Click "Add Education" to begin.
                  </Typography>
                ) : (
                  educationList.map((education, index) => (
                    <Draggable key={index} draggableId={`edu-${index}`} index={index}>
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
                              {education.degree}
                              {education.fieldOfStudy && ` in ${education.fieldOfStudy}`}
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary">
                              {education.institution}
                              {education.location && ` • ${education.location}`}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {formatMonthYear(education.startDate)} - {education.endDate ? formatMonthYear(education.endDate) : 'Present'}
                              {education.gpa && ` • GPA: ${education.gpa}`}
                            </Typography>
                            {education.description && (
                              <Typography variant="body2" sx={{ mt: 1 }}>
                                {education.description}
                              </Typography>
                            )}
                          </CardContent>
                          <CardActions sx={{ justifyContent: 'flex-end' }}>
                            <IconButton color="primary" onClick={() => handleEditDialog(index)}>
                              <EditIcon />
                            </IconButton>
                            <IconButton color="error" onClick={() => handleDeleteEducation(index)}>
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
            Add Education
          </Button>
        </Box>
      </Paper>
      
      {/* Dialog for adding/editing education */}
      <Dialog open={open} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editIndex >= 0 ? 'Edit Education' : 'Add Education'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Institution"
                name="institution"
                value={formData.institution}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.institution}
                helperText={errors.institution}
                placeholder="e.g., University of Technology"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Degree"
                name="degree"
                value={formData.degree}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.degree}
                helperText={errors.degree}
                placeholder="e.g., Bachelor of Science"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Field of Study"
                name="fieldOfStudy"
                value={formData.fieldOfStudy}
                onChange={handleChange}
                fullWidth
                placeholder="e.g., Computer Science"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                fullWidth
                placeholder="e.g., Boston, MA"
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
              <FormControlLabel
                control={
                  <Switch
                    checked={isCurrentlyStudying}
                    onChange={handleCurrentlyStudyingToggle}
                    color="primary"
                  />
                }
                label="I am currently studying here"
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
                required={!isCurrentlyStudying}
                disabled={isCurrentlyStudying}
                error={!!errors.endDate}
                helperText={isCurrentlyStudying ? 'Currently studying' : errors.endDate}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="GPA (optional)"
                name="gpa"
                value={formData.gpa}
                onChange={handleChange}
                fullWidth
                placeholder="e.g., 3.8"
                error={!!errors.gpa}
                helperText={errors.gpa || "Enter on a 4.0 scale if applicable"}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description (optional)"
                name="description"
                value={formData.description}
                onChange={handleChange}
                fullWidth
                multiline
                rows={4}
                placeholder="Include relevant coursework, honors, awards, or activities."
                helperText="Tip: Include relevant achievements or honors"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleSaveEducation}
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

export default EducationForm;