import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

const CVPreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentCV, isLoading, error } = useSelector((state) => state.cv);
  
  const [isDownloading, setIsDownloading] = useState(false);
  const [loadAttempted, setLoadAttempted] = useState(false);
  
  // Debug log the id parameter and current CV
  console.log("CVPreview - ID parameter:", id);
  console.log("CVPreview - Current CV:", currentCV);
  
  // Immediate check for ID parameter
  useEffect(() => {
    if (!id) {
      console.error("No ID parameter in URL, redirecting to dashboard");
      dispatch(showNotification({
        message: 'Cannot view CV: Missing ID parameter',
        type: 'error',
      }));
      navigate('/dashboard');
    }
  }, [id, navigate, dispatch]);

  // Fetch CV data on mount if we have an ID
  useEffect(() => {
    if (!id) return; // Skip if no ID
    
    const loadCV = async () => {
      try {
        console.log("Fetching CV with ID:", id);
        await dispatch(fetchCV(id));
        console.log("CV fetch completed");
      } catch (error) {
        console.error("Error fetching CV:", error);
        dispatch(showNotification({
          message: `Failed to load CV: ${error.message || 'Unknown error'}`,
          type: 'error',
        }));
      } finally {
        setLoadAttempted(true);
      }
    };
    
    loadCV();
  }, [dispatch, id]);

  // Handle download CV as PDF
  const handleDownload = async () => {
    if (!id) {
      dispatch(showNotification({
        message: 'Cannot download CV: Missing ID',
        type: 'error',
      }));
      return;
    }
    
    setIsDownloading(true);
    
    try {
      console.log("Generating PDF for CV:", id);
      const pdfBlob = await cvService.generatePDF(id);
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(pdfBlob);
      
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = url;
      link.download = `CV-${id}.pdf`;
      
      // Append to the document, click, and clean up
      document.body.appendChild(link);
      link.click();
      
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
      }, 100);
      
      dispatch(showNotification({
        message: 'CV downloaded successfully',
        type: 'success',
      }));
    } catch (error) {
      console.error("Error downloading CV:", error);
      dispatch(showNotification({
        message: `Error downloading CV: ${error.message || 'Unknown error'}`,
        type: 'error',
      }));
    } finally {
      setIsDownloading(false);
    }
  };

  // Handle edit CV
  const handleEdit = () => {
    if (id) {
      navigate(`/cv/edit/${id}`);
    } else {
      navigate('/dashboard');
    }
  };

  // Handle back to dashboard
  const handleBack = () => {
    navigate('/dashboard');
  };

  // If no ID parameter, show error and redirect
  if (!id) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mb: 3 }}>
          Missing CV ID parameter
        </Alert>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
        >
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  // Show loading state
  if (isLoading || (!currentCV && !loadAttempted)) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
          <Typography mt={2}>Loading CV...</Typography>
        </Box>
      </Container>
    );
  }

  // Show error if CV not found
  if (!currentCV && loadAttempted) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mb: 3 }}>
          CV not found or you don't have permission to view it
        </Alert>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
        >
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  // Prepare data for the template with proper fallbacks
  const templateData = {
    personalInfo: {
      // Handle both naming conventions (API vs Template)
      name: currentCV?.personalInfo?.name || currentCV?.personalInfo?.fullName || 'Your Name',
      title: currentCV?.personalInfo?.title || currentCV?.personalInfo?.jobTitle || 'Your Title',
      email: currentCV?.personalInfo?.email || '',
      phone: currentCV?.personalInfo?.phone || '',
      address: currentCV?.personalInfo?.address || currentCV?.personalInfo?.location || '',
      linkedin: currentCV?.personalInfo?.linkedin || '',
      website: currentCV?.personalInfo?.website || '',
    },
    summary: currentCV?.summary || '',
    workExperience: Array.isArray(currentCV?.workExperience) ? currentCV.workExperience : [],
    education: Array.isArray(currentCV?.education) ? currentCV.education : [],
    skills: Array.isArray(currentCV?.skills) ? currentCV.skills : [],
    languages: Array.isArray(currentCV?.languages) ? currentCV.languages : [],
    certifications: Array.isArray(currentCV?.certifications) ? currentCV.certifications : [],
    projects: Array.isArray(currentCV?.projects) ? currentCV.projects : [],
  };

  // Determine which template to use
  const template = currentCV?.template || 'modern';

  return (
    <Container maxWidth="lg">
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          {currentCV?.title || 'CV Preview'}
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

      {/* Debug info - remove this in production */}
      <Box mb={3} p={2} bgcolor="rgba(0,0,0,0.05)" borderRadius={1}>
        <Typography variant="subtitle2">Debug Info:</Typography>
        <Typography variant="body2">CV ID: {id}</Typography>
        <Typography variant="body2">Template: {template}</Typography>
      </Box>

      {/* CV Preview */}
      <Paper elevation={3} sx={{ p: 4, backgroundColor: 'white' }}>
        {template === 'classic' ? (
          <ClassicTemplate cv={templateData} />
        ) : (
          <ModernTemplate cv={templateData} />
        )}
      </Paper>
    </Container>
  );
};

export default CVPreview;