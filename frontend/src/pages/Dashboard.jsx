import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Description as DescriptionIcon,
  FilterList as FilterListIcon,
  Sort as SortIcon,
} from '@mui/icons-material';

import { fetchCVs, deleteCV } from '../../store/slices/cvSlice';
import { showConfirmDialog } from '../../store/slices/uiSlice';

const Dashboard = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cvs, isLoading } = useSelector((state) => state.cv);
  const { user } = useSelector((state) => state.auth);
  
  // Local state for menu handling
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCVId, setSelectedCVId] = useState(null);
  
  useEffect(() => {
    dispatch(fetchCVs());
  }, [dispatch]);
  
  const handleMenuClick = (event, cvId) => {
    setAnchorEl(event.currentTarget);
    setSelectedCVId(cvId);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCVId(null);
  };
  
  const handleCreateCV = () => {
    navigate('/cv/create');
  };
  
  const handleEditCV = () => {
    navigate(`/cv/edit/${selectedCVId}`);
    handleMenuClose();
  };
  
  const handlePreviewCV = () => {
    navigate(`/cv/preview/${selectedCVId}`);
    handleMenuClose();
  };
  
  const handleDeleteCV = () => {
    dispatch(
      showConfirmDialog({
        title: 'Delete CV',
        content: 'Are you sure you want to delete this CV? This action cannot be undone.',
        confirmText: 'Delete',
        cancelText: 'Cancel',
        onConfirm: () => {
          dispatch(deleteCV(selectedCVId));
        },
      })
    );
    handleMenuClose();
  };
  
  const hasReachedFreeLimit = user?.subscription === 'free' && cvs?.length >= 2;
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            My CVs
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleCreateCV}
              disabled={hasReachedFreeLimit}
            >
              Create New CV
            </Button>
          </Box>
        </Box>
        
        {hasReachedFreeLimit && (
          <Card sx={{ mb: 4, bgcolor: alpha(theme.palette.warning.main, 0.1), border: `1px solid ${theme.palette.warning.main}` }}>
            <CardContent>
              <Typography variant="h6" color="warning.main" gutterBottom>
                Free Plan Limit Reached
              </Typography>
              <Typography variant="body2">
                You've reached the limit of 2 CVs for the free plan. Upgrade to Premium to create unlimited CVs and unlock all features.
              </Typography>
            </CardContent>
            <CardActions>
              <Button 
                variant="contained" 
                color="warning" 
                onClick={() => navigate('/subscription')}
              >
                Upgrade Now
              </Button>
            </CardActions>
          </Card>
        )}
        
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : cvs?.length > 0 ? (
          <Grid container spacing={3}>
            {cvs.map((cv) => (
              <Grid item key={cv._id} xs={12} sm={6} md={4}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.shadows[6],
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" component="h2" noWrap sx={{ maxWidth: '80%' }}>
                        {cv.title}
                      </Typography>
                      <IconButton
                        aria-label="CV options"
                        onClick={(e) => handleMenuClick(e, cv._id)}
                        size="small"
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {new Date(cv.updatedAt).toLocaleDateString()}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Template: {cv.template.charAt(0).toUpperCase() + cv.template.slice(1)}
                      </Typography>
                    </Box>
                    
                    {cv.metadata?.atsScore > 0 && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Tooltip title="ATS Compatibility Score">
                          <Box
                            sx={{
                              position: 'relative',
                              display: 'inline-flex',
                              mr: 1,
                            }}
                          >
                            <CircularProgress
                              variant="determinate"
                              value={cv.metadata.atsScore}
                              size={24}
                              thickness={4}
                              sx={{
                                color: 
                                  cv.metadata.atsScore >= 80 
                                    ? 'success.main' 
                                    : cv.metadata.atsScore >= 50 
                                    ? 'warning.main' 
                                    : 'error.main',
                              }}
                            />
                            <Box
                              sx={{
                                top: 0,
                                left: 0,
                                bottom: 0,
                                right: 0,
                                position: 'absolute',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <Typography
                                variant="caption"
                                component="div"
                                color="text.secondary"
                                sx={{ fontSize: '0.6rem' }}
                              >
                                {cv.metadata.atsScore}
                              </Typography>
                            </Box>
                          </Box>
                        </Tooltip>
                        <Typography variant="body2" color="text.secondary">
                          ATS Score
                        </Typography>
                      </Box>
                    )}
                    
                    <Divider sx={{ my: 1.5 }} />
                    
                    <Typography variant="body2" noWrap>
                      {cv.personalInfo.fullName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {cv.personalInfo.jobTitle || 'No job title'}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button 
                      size="small" 
                      onClick={() => {
                        navigate(`/cv/edit/${cv._id}`);
                      }}
                    >
                      Edit
                    </Button>
                    <Button 
                      size="small" 
                      onClick={() => {
                        navigate(`/cv/preview/${cv._id}`);
                      }}
                    >
                      Preview
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Card sx={{ textAlign: 'center', py: 6 }}>
            <CardContent>
              <DescriptionIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                No CVs Yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Create your first CV to get started on your job search journey
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleCreateCV}
              >
                Create Your First CV
              </Button>
            </CardContent>
          </Card>
        )}
      </Box>
      
      {/* CV options menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleEditCV}>Edit</MenuItem>
        <MenuItem onClick={handlePreviewCV}>Preview</MenuItem>
        <Divider />
        <MenuItem onClick={handleDeleteCV} sx={{ color: 'error.main' }}>
          Delete
        </MenuItem>
      </Menu>
    </Container>
  );
};

export default Dashboard;