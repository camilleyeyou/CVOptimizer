import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Paper,
  Grid,
  Alert,
} from '@mui/material';

import { Add as AddIcon } from '@mui/icons-material';
import CVCard from '../components/cv/CVCard';
import { fetchCVs, clearError } from '../store/slices/cvSlice';
import { fetchSubscription } from '../store/slices/subscriptionSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { cvs, isLoading, error } = useSelector((state) => state.cv);
  const { subscription } = useSelector((state) => state.subscription);
  const [dataLoaded, setDataLoaded] = useState(false);
  
  // Debug the CVs structure
  useEffect(() => {
    if (Array.isArray(cvs)) {
      console.log(`Dashboard has ${cvs.length} CVs:`, cvs);
      // Check if all CVs have _id property
      const missingIds = cvs.filter(cv => !cv._id);
      if (missingIds.length > 0) {
        console.error(`Found ${missingIds.length} CVs without _id property:`, missingIds);
      }
    } else {
      console.error("CVs is not an array:", cvs);
    }
  }, [cvs]);
  
  // Fetch CVs and subscription on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        await dispatch(fetchCVs());
        await dispatch(fetchSubscription());
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setDataLoaded(true);
      }
    };
    
    loadData();
  }, [dispatch]);

  const handleCreateCV = () => {
    navigate('/cv/create');
  };

  // Show loading indicator while data is being fetched
  if (isLoading && !dataLoaded) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          My CVs
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateCV}
        >
          Create New CV
        </Button>
      </Box>

      {subscription === 'free' && Array.isArray(cvs) && cvs.length >= 2 && (
        <Alert 
          severity="info" 
          sx={{ mb: 3 }}
        >
          You've reached the limit for free accounts. Upgrade to premium to create more CVs.
        </Alert>
      )}

      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          onClose={() => dispatch(clearError())}
        >
          {error}
        </Alert>
      )}

      {/* Debug information */}
      <Box mb={2} py={1} px={2} bgcolor="rgba(0, 0, 0, 0.05)" borderRadius={1}>
        <Typography variant="subtitle2">Debug Info:</Typography>
        <Typography variant="body2">CVs count: {Array.isArray(cvs) ? cvs.length : 'Not an array'}</Typography>
        <Typography variant="body2">Loading: {isLoading ? 'Yes' : 'No'}</Typography>
        <Typography variant="body2">Data loaded: {dataLoaded ? 'Yes' : 'No'}</Typography>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : !Array.isArray(cvs) ? (
        <Paper elevation={2} sx={{ p: 4, textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" color="error">
            Error loading CVs
          </Typography>
          <Button
            variant="contained"
            onClick={() => dispatch(fetchCVs())}
            sx={{ mt: 2 }}
          >
            Retry
          </Button>
        </Paper>
      ) : cvs.length === 0 ? (
        <Paper elevation={2} sx={{ p: 4, textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            You haven't created any CVs yet
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Create your first CV to get started
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateCV}
          >
            Create CV
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {cvs.map((cv, index) => {
            // Check for missing _id property
            if (!cv._id) {
              console.error(`CV at index ${index} is missing _id property:`, cv);
              return null; // Skip rendering this CV
            }
            
            return (
              <Grid item xs={12} sm={6} md={4} key={cv._id}>
                <CVCard cv={cv} />
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
};

export default Dashboard;