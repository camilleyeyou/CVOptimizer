import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useTheme,
  Alert,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  GetApp as DownloadIcon,
  Share as ShareIcon,
  Check as CheckIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Analytics as AnalyticsIcon,
  Lock as LockIcon,
} from '@mui/icons-material';

import { fetchCV, analyzeCV, generatePDF } from '../../store/slices/cvSlice';
import { showNotification } from '../../store/slices/uiSlice';

// Import CV template components
import ModernTemplate from '../components/cv/templates/ModernTemplate';
import ClassicTemplate from '../components/cv/templates/ClassicTemplate';

const CVPreview = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  
  const { currentCV, isLoading, analysis, pdfGenerating } = useSelector((state) => state.cv);
  const { user } = useSelector((state) => state.auth);
  
  const [jobDescription, setJobDescription] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  
  const isPremiumUser = user?.subscription === 'premium';
  
  useEffect(() => {
    if (id) {
      dispatch(fetchCV(id));
    }
  }, [dispatch, id]);
  
  const handleEdit = () => {
    navigate(`/cv/edit/${id}`);
  };
  
  const handleGoBack = () => {
    navigate('/dashboard');
  };
  
  const handleDownload = () => {
    dispatch(generatePDF(id))
      .unwrap()
      .then(() => {
        dispatch(showNotification({
          message: 'CV downloaded successfully',
          type: 'success',
        }));
      })
      .catch((error) => {
        dispatch(showNotification({
          message: 'Failed to download CV: ' + error.message,
          type: 'error',
        }));
      });
  };
  
  const handleShare = () => {
    // This would be implemented to create a shareable link in a real app
    dispatch(showNotification({
      message: 'Shareable link copied to clipboard',
      type: 'success',
    }));
  };
  
  const handleAnalyze = () => {
    if (!jobDescription.trim()) {
      dispatch(showNotification({
        message: 'Please enter a job description to analyze',
        type: 'warning',
      }));
      return;
    }
    
    setAnalyzing(true);
    dispatch(analyzeCV({ id, jobDescription }))
      .unwrap()
      .then(() => {
        setAnalyzing(false);
      })
      .catch((error) => {
        setAnalyzing(false);
        dispatch(showNotification({
          message: 'Analysis failed: ' + error.message,
          type: 'error',
        }));
      });
  };
  
  const renderTemplate = () => {
    if (!currentCV) return null;
    
    switch (currentCV.template) {
      case 'modern':
        return <ModernTemplate cv={currentCV} />;
      case 'classic':
        return <ClassicTemplate cv={currentCV} />;
      // Other templates would be implemented in a full app
      default:
        return <ModernTemplate cv={currentCV} />;
    }
  };
  
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (!currentCV) {
    return (
      <Container maxWidth="md">
        <Alert severity="error" sx={{ mt: 4 }}>
          CV not found. It may have been deleted or you don't have permission to view it.
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleGoBack}
          sx={{ mt: 2 }}
        >
          Back to Dashboard
        </Button>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg">
      <Grid container spacing={3} sx={{ mt: 1 }}>
        {/* CV Preview Panel */}
        <Grid item xs={12} md={8}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <IconButton onClick={handleGoBack} sx={{ mr: 1 }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5">
              {currentCV.title || 'CV Preview'}
            </Typography>
          </Box>
          
          <Paper 
            elevation={2} 
            sx={{ 
              p: 0, 
              mb: 3, 
              position: 'relative',
              height: '842px', // A4 height in pixels at 96 DPI
              width: '100%',
              maxWidth: '595px', // A4 width in pixels at 96 DPI
              mx: 'auto',
              overflowY: 'auto',
              backgroundColor: 'white',
              boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
            }}
          >
            {renderTemplate()}
            
            {/* Overlay for PDF generating state */}
            {pdfGenerating && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10,
                }}
              >
                <CircularProgress size={60} />
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Generating PDF...
                </Typography>
              </Box>
            )}
          </Paper>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={handleEdit}
            >
              Edit
            </Button>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={handleDownload}
              disabled={pdfGenerating}
            >
              Download PDF
            </Button>
            <Button
              variant="outlined"
              startIcon={<ShareIcon />}
              onClick={handleShare}
              disabled={!isPremiumUser}
            >
              {isPremiumUser ? 'Share' : 'Premium Only'}
            </Button>
          </Box>
        </Grid>
        
        {/* Analysis Panel */}
        <Grid item xs={12} md={4}>
          <Card variant="outlined" sx={{ mb: 3, backgroundColor: '#f9f9f9' }}>
            <Box sx={{ p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                <AnalyticsIcon sx={{ mr: 1 }} />
                ATS Optimization
              </Typography>
            </Box>
            
            {!isPremiumUser ? (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <LockIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="subtitle1" gutterBottom>
                  Premium Feature
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Upgrade to Premium to analyze your CV against job descriptions and optimize for Applicant Tracking Systems.
                </Typography>
                <Button 
                  variant="contained" 
                  color="secondary"
                  onClick={() => navigate('/subscription')}
                >
                  Upgrade Now
                </Button>
              </Box>
            ) : (
              <>
                <Box sx={{ p: 2 }}>
                  <Typography variant="body2" paragraph>
                    Paste a job description below to analyze how well your CV matches the requirements.
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={5}
                    placeholder="Paste job description here..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    variant="outlined"
                  />
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={handleAnalyze}
                    disabled={analyzing || !jobDescription.trim()}
                    sx={{ mt: 2 }}
                  >
                    {analyzing ? 'Analyzing...' : 'Analyze Match'}
                  </Button>
                </Box>
                
                {analysis && (
                  <Box sx={{ p: 2 }}>
                    <Divider sx={{ my: 2 }} />
                    
                    <Typography variant="subtitle1" gutterBottom>
                      Analysis Results
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" gutterBottom>
                        ATS Compatibility Score
                      </Typography>
                      <Box sx={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
                        <CircularProgress
                          variant="determinate"
                          value={analysis.atsScore}
                          size={60}
                          thickness={5}
                          sx={{
                            color: 
                              analysis.atsScore >= 80 
                                ? 'success.main' 
                                : analysis.atsScore >= 50 
                                ? 'warning.main' 
                                : 'error.main',
                          }}
                        />
                        <Box
                          sx={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Typography variant="subtitle2" component="div">
                            {analysis.atsScore}%
                          </Typography>
                        </Box>
                        
                        <Typography variant="body2" sx={{ ml: 2 }}>
                          {analysis.atsScore >= 80 
                            ? 'Excellent' 
                            : analysis.atsScore >= 60 
                            ? 'Good' 
                            : analysis.atsScore >= 40 
                            ? 'Average' 
                            : 'Needs Improvement'}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Typography variant="subtitle2" gutterBottom>
                      Missing Keywords
                    </Typography>
                    {analysis.missingKeywords && analysis.missingKeywords.length > 0 ? (
                      <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
                        {analysis.missingKeywords.map((keyword, index) => (
                          <Chip 
                            key={index} 
                            label={keyword} 
                            color="error" 
                            variant="outlined" 
                            size="small"
                            icon={<CancelIcon />}
                            sx={{ m: 0.5 }}
                          />
                        ))}
                      </Stack>
                    ) : (
                      <Typography variant="body2" color="success.main" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                        <CheckCircleIcon fontSize="small" sx={{ mr: 0.5 }} />
                        All important keywords are included!
                      </Typography>
                    )}
                    
                    <Typography variant="subtitle2" gutterBottom>
                      Matching Keywords
                    </Typography>
                    {analysis.matchingKeywords && analysis.matchingKeywords.length > 0 ? (
                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        {analysis.matchingKeywords.map((keyword, index) => (
                          <Chip 
                            key={index} 
                            label={keyword} 
                            color="success" 
                            variant="outlined" 
                            size="small"
                            icon={<CheckIcon />}
                            sx={{ m: 0.5 }}
                          />
                        ))}
                      </Stack>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No matching keywords found.
                      </Typography>
                    )}
                    
                    {analysis.suggestions && (
                      <>
                        <Typography variant="subtitle2" sx={{ mt: 2 }}>
                          Improvement Suggestions
                        </Typography>
                        <ul style={{ paddingLeft: '20px', margin: '8px 0' }}>
                          {analysis.suggestions.map((suggestion, index) => (
                            <li key={index}>
                              <Typography variant="body2">{suggestion}</Typography>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </Box>
                )}
              </>
            )}
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CVPreview;