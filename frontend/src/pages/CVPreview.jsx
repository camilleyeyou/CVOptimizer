import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import {
  Edit as EditIcon,
  Download as DownloadIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';

// Import Templates
import { ModernTemplate, ClassicTemplate } from '../components/cv/templates';

// Import Store Actions
import { fetchCV, generatePDF, clearError } from '../store/slices/cvSlice';
import { showNotification } from '../store/slices/uiSlice';

const CVPreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentCV, isLoading, error } = useSelector((state) => state.cv);
  const [isDownloading, setIsDownloading] = React.useState(false);
  
  // Fetch CV data on mount
  useEffect(() => {
    dispatch(fetchCV(id));
  }, [dispatch, id]);
  
  // Handle download CV as PDF
  const handleDownload = async () => {
    setIsDownloading(true);
    
    try {
      await dispatch(generatePDF(id)).unwrap();
      dispatch(showNotification({
        message: 'CV downloaded successfully',
        type: 'success',
      }));
    } catch (error) {
      dispatch(showNotification({
        message: `Error downloading CV: ${error.message}`,
        type: 'error',
      }));
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

  if (isLoading || !currentCV) {
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
            startIcon={<DownloadIcon />}
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

      {/* CV Preview */}
      <Paper elevation={3} sx={{ p: 4, backgroundColor: 'white' }}>
        {currentCV && (
          currentCV.template === 'modern' ? (
            <ModernTemplate cv={currentCV} />
          ) : (
            <ClassicTemplate cv={currentCV} />
          )
        )}
      </Paper>
    </Box>
  );
};

export default CVPreview;