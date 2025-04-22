import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Typography,
  useTheme,
} from '@mui/material';
import {
  Save as SaveIcon,
  Preview as PreviewIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';

import { fetchCV, createCV, updateCV, setInitialCV } from '../../store/slices/cvSlice';
import { nextStep, prevStep, setCurrentStep } from '../../store/slices/uiSlice';

// Import form sections
import TemplateSelection from '../cv/TemplateSelection';
import PersonalInfoForm from '../cv/PersonalInfoForm';
import SummaryForm from '../cv/SummaryForm';
import WorkExperienceForm from '../cv/WorkExperienceForm';
import EducationForm from '../cv/EducationForm';
import SkillsForm from '../cv/SkillsForm';
import AdditionalSectionsForm from '../cv/AdditionalSectionsForm';

const CVEditor = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  
  const { currentCV, isLoading } = useSelector((state) => state.cv);
  const { currentStep } = useSelector((state) => state.ui);
  const { user } = useSelector((state) => state.auth);
  
  const [saved, setSaved] = useState(false);
  
  // Define steps for the stepper
  const steps = [
    'Choose Template',
    'Personal Info',
    'Professional Summary',
    'Work Experience',
    'Education',
    'Skills',
    'Additional Sections',
  ];
  
  // Load CV data if editing existing CV
  useEffect(() => {
    if (id) {
      dispatch(fetchCV(id));
    } else {
      // Initialize with default CV data for new CV
      const defaultCV = {
        title: 'Untitled CV',
        template: 'modern',
        personalInfo: {
          fullName: user?.name || '',
          jobTitle: '',
          email: user?.email || '',
          phone: '',
          location: '',
          website: '',
          linkedin: '',
          github: '',
        },
        summary: '',
        workExperience: [],
        education: [],
        skills: [],
        languages: [],
        projects: [],
        certifications: [],
        customSections: [],
        references: [],
        metadata: {
          atsScore: 0,
          keywordMatches: [],
        },
        privacy: {
          isPublic: false,
        },
      };
      dispatch(setInitialCV(defaultCV));
    }
    
    // Reset step when component mounts
    dispatch(setCurrentStep(0));
    
    // Cleanup
    return () => {
      // Clear current CV when component unmounts
      // This is commented out to prevent data loss if user navigates away accidentally
      // dispatch(clearCurrentCV());
    };
  }, [dispatch, id, user]);
  
  // Handle save CV
  const handleSaveCV = async () => {
    if (!currentCV) return;
    
    try {
      if (id) {
        await dispatch(updateCV({ id, cvData: currentCV })).unwrap();
      } else {
        const result = await dispatch(createCV(currentCV)).unwrap();
        navigate(`/cv/edit/${result.data._id}`);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Failed to save CV:', error);
    }
  };
  
  // Handle step navigation
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      dispatch(nextStep());
      handleSaveCV();
    }
  };
  
  const handleBack = () => {
    if (currentStep > 0) {
      dispatch(prevStep());
    }
  };
  
  const handlePreview = () => {
    if (id) {
      navigate(`/cv/preview/${id}`);
    } else {
      handleSaveCV();
      // Preview will be available after saving
    }
  };
  
  // Render form based on current step
  const renderStepContent = (step) => {
    if (!currentCV) return null;
    
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
        return null;
    }
  };
  
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Container maxWidth="lg">
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          mt: 4, 
          mb: 4, 
          borderRadius: 2,
          position: 'relative',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="h1">
            {id ? 'Edit CV' : 'Create New CV'}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<PreviewIcon />}
              onClick={handlePreview}
              disabled={!currentCV}
            >
              Preview
            </Button>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSaveCV}
              disabled={!currentCV}
              color={saved ? 'success' : 'primary'}
            >
              {saved ? 'Saved!' : 'Save'}
            </Button>
          </Box>
        </Box>
        
        <Stepper activeStep={currentStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        <Box sx={{ mt: 2, minHeight: '50vh' }}>
          {renderStepContent(currentStep)}
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            variant="outlined"
            onClick={handleBack}
            startIcon={<ArrowBackIcon />}
            disabled={currentStep === 0}
          >
            Back
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
            endIcon={<ArrowForwardIcon />}
            disabled={currentStep === steps.length - 1}
          >
            Next
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default CVEditor;