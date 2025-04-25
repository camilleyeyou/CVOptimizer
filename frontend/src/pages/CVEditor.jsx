import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Button,
  Divider,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Save as SaveIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';

// Import CV Form Components
import TemplateSelection from '../components/cv/TemplateSelection';
import PersonalInfoForm from '../components/cv/PersonalInfoForm';
import SummaryForm from '../components/cv/SummaryForm';
import WorkExperienceForm from '../components/cv/WorkExperienceForm';
import EducationForm from '../components/cv/EducationForm';
import SkillsForm from '../components/cv/SkillsForm';
import AdditionalSectionsForm from '../components/cv/AdditionalSectionsForm';

// Import Templates for Preview
import { ModernTemplate, ClassicTemplate } from '../components/cv/templates';

// Import Store Actions
import { fetchCV, createCV, updateCV, clearError, setCurrentCV } from '../store/slices/cvSlice';
import { setCurrentStep, showNotification } from '../store/slices/uiSlice';

const steps = [
  'Choose Template',
  'Personal Info',
  'Summary',
  'Work Experience',
  'Education',
  'Skills',
  'Additional Sections',
];

const CVEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentCV, isLoading, error } = useSelector((state) => state.cv);
  const { currentStep, selectedTemplate } = useSelector((state) => state.ui);
  
  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);
  
  const isNewCV = id === 'create';
  
  // Fetch CV data if editing an existing CV
  useEffect(() => {
    if (!isNewCV) {
      dispatch(fetchCV(id));
    } else {
      // Initialize a new CV
      dispatch(setCurrentCV({
        title: 'Untitled CV',
        template: selectedTemplate,
        personalInfo: {},
        summary: '',
        workExperience: [],
        education: [],
        skills: [],
        languages: [],
        certifications: [],
        projects: [],
        awards: [],
      }));
    }
  }, [dispatch, id, isNewCV, selectedTemplate]);
  
  // Handle step change
  const handleStepChange = (newStep) => {
    dispatch(setCurrentStep(newStep));
  };

  // Get current step content
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <TemplateSelection />;
      case 1:
        return <PersonalInfoForm />;
      case 2:
        return <SummaryForm />;
      case 3:
        return <WorkExperienceForm />;
      case 4:
        return <EducationForm />;
      case 5:
        return <SkillsForm />;
      case 6:
        return <AdditionalSectionsForm />;
      default:
        return 'Unknown step';
    }
  };

  // Handle save CV
  const handleSaveCV = async () => {
    try {
      if (isNewCV) {
        const result = await dispatch(createCV(currentCV)).unwrap();
        dispatch(showNotification({
          message: 'CV created successfully',
          type: 'success',
        }));
        navigate(`/cv/edit/${result.id}`);
      } else {
        await dispatch(updateCV(id, currentCV)).unwrap();
        dispatch(showNotification({
          message: 'CV updated successfully',
          type: 'success',
        }));
      }
    } catch (error) {
      dispatch(showNotification({
        message: `Error saving CV: ${error.message}`,
        type: 'error',
      }));
    }
  };

  // Handle preview toggle
  const togglePreview = () => {
    setIsPreviewOpen(!isPreviewOpen);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          {isNewCV ? 'Create New CV' : 'Edit CV'}
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<VisibilityIcon />}
            onClick={togglePreview}
            sx={{ mr: 2 }}
          >
            Preview
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSaveCV}
            disabled={isLoading}
          >
            Save CV
          </Button>
        </Box>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert 
          severity="error" 
          onClose={() => dispatch(clearError())}
          sx={{ mb: 3 }}
        >
          {error}
        </Alert>
      )}

      {/* CV Editor with Preview */}
      <Grid container spacing={3}>
        {/* Editor Section */}
        <Grid item xs={12} md={isPreviewOpen ? 6 : 12}>
          <Paper elevation={2} sx={{ p: 0, overflow: 'hidden' }}>
            {/* Stepper */}
            <Box sx={{ p: 3, backgroundColor: 'grey.50' }}>
              <Stepper activeStep={currentStep} alternativeLabel>
                {steps.map((label, index) => (
                  <Step key={label}>
                    <StepLabel 
                      onClick={() => handleStepChange(index)}
                      sx={{ cursor: 'pointer' }}
                    >
                      {label}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>
            
            <Divider />
            
            {/* Form Content */}
            <Box sx={{ p: 3 }}>
              {currentCV && getStepContent(currentStep)}
            </Box>
          </Paper>
        </Grid>

        {/* Preview Section */}
        {isPreviewOpen && currentCV && (
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, height: '100%', overflow: 'auto' }}>
              <Typography variant="h6" gutterBottom>
                CV Preview
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <Box sx={{ bgcolor: 'white', p: 3, border: '1px solid', borderColor: 'grey.300', borderRadius: 1 }}>
                {currentCV.template === 'modern' ? (
                  <ModernTemplate cv={currentCV} />
                ) : (
                  <ClassicTemplate cv={currentCV} />
                )}
              </Box>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default CVEditor;