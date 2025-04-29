import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Button,
  Grid,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Save as SaveIcon,
  Visibility as VisibilityIcon,
  KeyboardArrowLeft as KeyboardArrowLeftIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon,
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
import { showNotification, setCurrentStep } from '../store/slices/uiSlice';

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
  const location = useLocation();
  const dispatch = useDispatch();
  
  const { currentCV, isLoading, error } = useSelector((state) => state.cv);
  const { currentStep, selectedTemplate } = useSelector((state) => state.ui);
  const { user } = useSelector((state) => state.auth);
  
  const [isPreviewOpen ] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  
  // Check if we're on the create route by path
  const isNewCV = location.pathname === '/cv/create';
  
  console.log('Current path:', location.pathname);
  console.log('ID from params:', id);
  console.log('Is new CV?', isNewCV);
  console.log('Current CV:', currentCV);

  const handleStepChange = (step) => {
    dispatch(setCurrentStep(step));
  };

  // Fetch CV data if editing an existing CV
  useEffect(() => {
    if (initialLoad) {
      if (isNewCV) {
        console.log("Initializing new CV");
        // Initialize a new CV for creation with the correct field names
        dispatch(setCurrentCV({
          title: 'Untitled CV',
          template: selectedTemplate || 'modern',
          userId: user?.id,
          personalInfo: {
            fullName: 'Your Name',  // Using fullName for API compatibility
            jobTitle: 'Your Title', // Using jobTitle for API compatibility
            email: user?.email || 'email@example.com',
            phone: '(123) 456-7890',
            location: 'Your Location', // Using location for API compatibility
            linkedin: 'linkedin.com/in/yourprofile',
            website: 'yourwebsite.com',
          },
          summary: 'Your professional summary will appear here. Write a brief overview of your skills and experience.',
          workExperience: [],
          education: [],
          skills: [],
          languages: [],
          certifications: [],
          projects: [],
          customSections: [],
          references: [],
          metadata: {},
          privacy: { isPublic: false }
        }));
        setInitialLoad(false);
      } else if (id) {
        console.log("Fetching existing CV:", id);
        // Fetch existing CV
        const fetchCVData = async () => {
          try {
            await dispatch(fetchCV(id));
            setInitialLoad(false);
          } catch (err) {
            console.error("Error fetching CV:", err);
            dispatch(showNotification({
              message: `Failed to load CV: ${err.message || 'Unknown error'}`,
              type: 'error',
            }));
            navigate('/dashboard');
            setInitialLoad(false);
          }
        };
        
        fetchCVData();
      } else {
        console.error("No ID provided");
        dispatch(showNotification({
          message: 'Invalid CV ID',
          type: 'error',
        }));
        navigate('/dashboard');
        setInitialLoad(false);
      }
    }
  }, [dispatch, id, isNewCV, selectedTemplate, navigate, initialLoad, location.pathname, user]);

  // Get current step content
  const getStepContent = (step) => {
    if (!currentCV) return <CircularProgress />;
    
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
    if (!currentCV) return;
    
    setSaveLoading(true);
    
    try {
      console.log("Saving CV data:", JSON.stringify(currentCV, null, 2));
      
      // Make sure personalInfo has the correct field names expected by the API
      const cvToSave = {
        ...currentCV,
        personalInfo: {
          ...currentCV.personalInfo,
          fullName: currentCV.personalInfo.fullName || currentCV.personalInfo.name || 'Your Name',
          jobTitle: currentCV.personalInfo.jobTitle || currentCV.personalInfo.title || 'Your Title',
          location: currentCV.personalInfo.location || currentCV.personalInfo.address || 'Your Location',
        }
      };
      
      if (isNewCV) {
        try {
          const result = await dispatch(createCV(cvToSave)).unwrap();
          console.log("CV created successfully:", result);
          
          dispatch(showNotification({
            message: 'CV created successfully',
            type: 'success',
          }));
          
          if (result && result._id) {
            navigate(`/cv/edit/${result._id}`);
          } else {
            navigate('/dashboard');
          }
        } catch (err) {
          throw err; // Pass to outer catch block
        }
      } else {
        if (!id) {
          dispatch(showNotification({
            message: 'Invalid CV ID',
            type: 'error',
          }));
          setSaveLoading(false);
          return;
        }
        
        try {
          await dispatch(updateCV({id, cvData: cvToSave})).unwrap();
          console.log("CV updated successfully");
          
          dispatch(showNotification({
            message: 'CV updated successfully',
            type: 'success',
          }));
        } catch (err) {
          throw err; // Pass to outer catch block
        }
      }
    } catch (error) {
      console.error("Error saving CV:", error);
      let errorMessage = 'An unknown error occurred';
      
      if (typeof error === 'string') {
        errorMessage = error;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (error?.errors && Array.isArray(error.errors)) {
        errorMessage = error.errors.map(err => err.msg).join(', ');
      }
      
      dispatch(showNotification({
        message: `Error saving CV: ${errorMessage}`,
        type: 'error',
      }));
    } finally {
      setSaveLoading(false);
    }
  };

  // Handle preview toggle
  // const togglePreview = () => {
    // setIsPreviewOpen(!isPreviewOpen);
 // };

  // Handle preview click
  const handlePreview = () => {
    if (currentCV && currentCV._id) {
      navigate(`/cv/preview/${currentCV._id}`);
    } else {
      dispatch(showNotification({
        message: 'Please save the CV first before previewing it',
        type: 'warning',
      }));
    }
  };

  if (isLoading || initialLoad) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Check if currentCV is valid
  if (!currentCV) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', flexDirection: 'column' }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load CV data. Please try again.
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </Button>
      </Box>
    );
  }

  // Create a complete preview data object that doesn't rely on currentCV
  // Map API field names to template field names
  const previewData = {
    personalInfo: {
      name: currentCV?.personalInfo?.fullName || currentCV?.personalInfo?.name || 'Your Name',
      title: currentCV?.personalInfo?.jobTitle || currentCV?.personalInfo?.title || 'Your Title',
      email: currentCV?.personalInfo?.email || 'email@example.com',
      phone: currentCV?.personalInfo?.phone || '(123) 456-7890',
      address: currentCV?.personalInfo?.location || currentCV?.personalInfo?.address || 'Your Location',
      linkedin: currentCV?.personalInfo?.linkedin || 'linkedin.com/in/yourprofile',
      website: currentCV?.personalInfo?.website || 'yourwebsite.com',
    },
    summary: currentCV?.summary || 'Your professional summary will appear here.',
    workExperience: Array.isArray(currentCV?.workExperience) && currentCV.workExperience.length ? currentCV.workExperience : [
      {
        company: 'Example Company',
        position: 'Your Position',
        startDate: '2020-01',
        endDate: null,
        location: 'City, Country',
        description: 'Description of your responsibilities and achievements.',
      }
    ],
    education: Array.isArray(currentCV?.education) && currentCV.education.length ? currentCV.education : [
      {
        institution: 'University Name',
        degree: 'Your Degree',
        startDate: '2015-09',
        endDate: '2019-06',
        location: 'City, Country',
        description: 'Additional details about your education.',
      }
    ],
    skills: Array.isArray(currentCV?.skills) && currentCV.skills.length ? currentCV.skills : [
      { name: 'Skill 1', level: 'Expert' },
      { name: 'Skill 2', level: 'Advanced' },
      { name: 'Skill 3', level: 'Intermediate' },
    ],
    languages: Array.isArray(currentCV?.languages) && currentCV.languages.length ? currentCV.languages : [
      { name: 'English', level: 'Native' },
      { name: 'Spanish', level: 'Intermediate' },
    ],
    certifications: Array.isArray(currentCV?.certifications) && currentCV.certifications.length ? currentCV.certifications : [
      { name: 'Certification Name', issuer: 'Issuing Organization', date: '2022-01' },
    ],
    projects: Array.isArray(currentCV?.projects) && currentCV.projects.length ? currentCV.projects : [],
  };

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
            onClick={handlePreview}
            sx={{ mr: 2 }}
          >
            Preview
          </Button>
          <Button
            variant="contained"
            startIcon={saveLoading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
            onClick={handleSaveCV}
            disabled={isLoading || !currentCV || saveLoading}
          >
            {saveLoading ? 'Saving...' : 'Save CV'}
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
        <Grid sx={{ width: isPreviewOpen ? { xs: '100%', md: '50%' } : '100%' }}>
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
              {getStepContent(currentStep)}
            </Box>
            
            {/* Navigation Buttons */}
            {currentStep !== 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 3, bgcolor: 'grey.50' }}>
                <Button
                  variant="outlined"
                  startIcon={<KeyboardArrowLeftIcon />}
                  onClick={() => handleStepChange(currentStep - 1)}
                  disabled={currentStep === 0}
                >
                  Previous
                </Button>
                <Button
                  variant="contained"
                  endIcon={<KeyboardArrowRightIcon />}
                  onClick={() => handleStepChange(currentStep + 1)}
                  disabled={currentStep === steps.length - 1}
                >
                  Next
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Preview Section */}
        {isPreviewOpen && (
          <Grid sx={{ width: { xs: '100%', md: '50%' } }}>
            <Paper elevation={2} sx={{ p: 3, height: '100%', overflow: 'auto' }}>
              <Typography variant="h6" gutterBottom>
                CV Preview
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <Box sx={{ bgcolor: 'white', p: 3, border: '1px solid', borderColor: 'grey.300', borderRadius: 1 }}>
                {/* Use the complete preview data instead of relying on currentCV */}
                {(currentCV?.template === 'modern' || !currentCV?.template) ? (
                  <ModernTemplate cv={previewData} />
                ) : (
                  <ClassicTemplate cv={previewData} />
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