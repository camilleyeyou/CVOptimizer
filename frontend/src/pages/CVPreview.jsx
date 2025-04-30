import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Container,
  Paper,
} from '@mui/material';
import {
  Edit as EditIcon,
  Download as DownloadIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';

// Import Templates
import { ModernTemplate, ClassicTemplate } from '../components/cv/templates';

// Import Store Actions
import { fetchCV, clearError } from '../store/slices/cvSlice';
import { showNotification } from '../store/slices/uiSlice';
import cvService from '../services/cvService';
import PDFService from '../services/PDFService';


const CVPreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const { currentCV, isLoading, error } = useSelector((state) => state.cv);
  // Add subscription from Redux state
  const { subscription } = useSelector((state) => state.subscription);
  
  const [isDownloading, setIsDownloading] = useState(false);
  const [hasRedirected, setHasRedirected] = useState(false);
  const [localCV, setLocalCV] = useState(null); // Add local state for CV data
  const [localLoading, setLocalLoading] = useState(false);
  
  // Immediate redirect for invalid IDs
  const redirectToDashboard = useCallback((reason) => {
    if (hasRedirected) return;
    
    console.warn(`Redirecting to dashboard: ${reason}`);
    setHasRedirected(true);
    
    dispatch(showNotification({
      message: reason,
      type: 'error',
    }));
    
    // Use setTimeout to avoid potential redirect loops
    setTimeout(() => {
      navigate('/dashboard', { replace: true });
    }, 100);
  }, [navigate, dispatch, hasRedirected]);

  // Check for invalid ID parameter immediately
  useEffect(() => {
    console.log("CVPreview - ID parameter:", id);
    console.log("CVPreview - Current URL:", location.pathname);
    
    if (!id || id === 'undefined' || id === 'null') {
      redirectToDashboard('Invalid CV ID parameter');
      return;
    }
    
    // Validate ID format (MongoDB ObjectId is 24 hex chars)
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    if (!isValidObjectId) {
      redirectToDashboard(`Invalid CV ID format: ${id}`);
      return;
    }
    
    // Proceed with fetching if ID is valid and we haven't already redirected
    if (!hasRedirected) {
      // Try direct API first
      const loadCV = async () => {
        try {
          setLocalLoading(true);
          console.log("Fetching CV with ID directly:", id);
          const cvData = await cvService.getCV(id);
          
          // Check if the response contains CV data with required fields
          if (cvData && cvData.cv) {
            // If response is { cv: {...actual CV data} } format
            setLocalCV(cvData.cv);
          } else if (cvData && (cvData.title || cvData._id)) {
            // If response is the direct CV object
            setLocalCV(cvData);
          } else {
            // Try Redux approach as fallback
            console.log("Direct API call didn't return expected CV structure, trying Redux");
            const result = await dispatch(fetchCV(id));
            
            if (result?.payload?.cv) {
              setLocalCV(result.payload.cv);
            } else if (result?.payload && (result.payload.title || result.payload._id)) {
              setLocalCV(result.payload);
            } else {
              // Neither approach worked
              redirectToDashboard('CV not found or has invalid format');
            }
          }
        } catch (error) {
          console.error("Error fetching CV:", error);
          redirectToDashboard(`Failed to load CV: ${error.message || 'Unknown error'}`);
        } finally {
          setLocalLoading(false);
        }
      };
      
      loadCV();
    }
  }, [id, dispatch, location.pathname, redirectToDashboard, hasRedirected]);

  // If redirecting or invalid ID, show minimal loading
  if (hasRedirected || !id || id === 'undefined' || id === 'null') {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <Alert severity="warning" sx={{ mb: 3 }}>
            Invalid CV ID. Redirecting to dashboard...
          </Alert>
          <CircularProgress size={24} />
        </Box>
      </Container>
    );
  }

  // Show loading indicator - use local loading state first, then check Redux
  const displayLoading = localLoading || (isLoading && !localCV);
  // Use local CV data first, then fall back to Redux
  const displayCV = localCV || currentCV;
  
  if (displayLoading || !displayCV) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
          <Typography mt={2}>Loading CV...</Typography>
        </Box>
      </Container>
    );
  }

  // Handle download CV as PDF
  const handleDownload = async () => {
    setIsDownloading(true);
    
    try {
      // Show a notification that we're generating the PDF
      dispatch(showNotification({
        message: 'Generating PDF, please wait...',
        type: 'info',
      }));
      
      console.log(`Attempting to generate PDF for CV with ID: ${id}`);
      
      // Generate the PDF
      const pdfBlob = await PDFService.generatePDF(id);
      
      if (!pdfBlob) {
        throw new Error('Failed to generate PDF: No data received');
      }
      
      // Download the generated PDF
      PDFService.downloadPDF(pdfBlob, `CV-${id}.pdf`);
      
      // Show success notification
      dispatch(showNotification({
        message: 'CV downloaded successfully',
        type: 'success',
      }));
    } catch (error) {
      console.error("Error downloading CV:", error);
      
      // Determine specific error message
      let errorMessage;
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.status === 404) {
          errorMessage = 'PDF generation service not found. The server may not support this feature.';
        } else if (error.response.status === 403) {
          errorMessage = 'Permission denied. You may need to upgrade your account to use this feature.';
        } else {
          errorMessage = `Server error (${error.response.status}). Please try again later.`;
        }
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = 'No response from server. Please check your internet connection.';
      } else {
        // Something happened in setting up the request
        errorMessage = error.message || 'Unknown error occurred';
      }
      
      // Show error notification
      dispatch(showNotification({
        message: `Error downloading CV: ${errorMessage}`,
        type: 'error',
      }));
      
      // Debug info in console - use a default value if subscription is undefined
      const userSubscription = subscription || 'unknown';
      console.group('PDF Generation Error Details');
      console.error('Error object:', error);
      console.error('CV ID:', id);
      console.error('User subscription:', userSubscription);
      console.groupEnd();
    } finally {
      setIsDownloading(false);
    }
  };

  // Handle edit CV
  const handleEdit = () => {
    navigate(`/cv/edit/${id}`);
  };

  // Handle back to dashboard
  const handleBack = () => {
    navigate('/dashboard');
  };

  // Debug the CV data structure
  console.log("CV Data being used for template:", displayCV);

  // Prepare data for the template with proper fallbacks
  const templateData = {
    personalInfo: {
      name: displayCV?.personalInfo?.name || displayCV?.personalInfo?.fullName || 'Your Name',
      title: displayCV?.personalInfo?.title || displayCV?.personalInfo?.jobTitle || 'Your Title',
      email: displayCV?.personalInfo?.email || '',
      phone: displayCV?.personalInfo?.phone || '',
      address: displayCV?.personalInfo?.address || displayCV?.personalInfo?.location || '',
      linkedin: displayCV?.personalInfo?.linkedin || '',
      website: displayCV?.personalInfo?.website || '',
    },
    summary: displayCV?.summary || '',
    workExperience: Array.isArray(displayCV?.workExperience) ? displayCV.workExperience : [],
    education: Array.isArray(displayCV?.education) ? displayCV.education : [],
    skills: Array.isArray(displayCV?.skills) ? displayCV.skills : [],
    languages: Array.isArray(displayCV?.languages) ? displayCV.languages : [],
    certifications: Array.isArray(displayCV?.certifications) ? displayCV.certifications : [],
    projects: Array.isArray(displayCV?.projects) ? displayCV.projects : [],
  };

  return (
    <Container maxWidth="lg">
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          {displayCV?.title || 'CV Preview'}
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{ mr: 2 }}
          >
            Back to Dashboard
          </Button>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={handleEdit}
            sx={{ mr: 2 }}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            startIcon={isDownloading ? <CircularProgress size={20} color="inherit" /> : <DownloadIcon />}
            onClick={handleDownload}
            disabled={isDownloading}
          >
            {isDownloading ? 'Downloading...' : 'Download PDF'}
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

      {/* Debug Info */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, bgcolor: 'rgba(0,0,0,0.02)' }}>
        <Typography variant="subtitle2">Debug Info:</Typography>
        <Typography variant="body2">CV ID: {id}</Typography>
        <Typography variant="body2">Template: {displayCV?.template || 'unknown'}</Typography>
        <Typography variant="body2">Data Source: {localCV ? 'Direct API' : 'Redux Store'}</Typography>
        <Typography variant="body2">Subscription: {subscription || 'unknown'}</Typography>
      </Paper>

      {/* CV Preview */}
      <Paper elevation={3} sx={{ p: 4, backgroundColor: 'white' }}>
        {displayCV?.template === 'classic' ? (
          <ClassicTemplate cv={templateData} />
        ) : (
          <ModernTemplate cv={templateData} />
        )}
      </Paper>
    </Container>
  );
};

export default CVPreview;