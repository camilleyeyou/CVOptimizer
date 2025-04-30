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
  Card,
  CardContent,
  Divider,
} from '@mui/material';

import { Add as AddIcon } from '@mui/icons-material';
import CVCard from '../components/cv/CVCard';
import { fetchCVs, clearError, setCVs } from '../store/slices/cvSlice';
import { fetchSubscription } from '../store/slices/subscriptionSlice';
import { showNotification } from '../store/slices/uiSlice';
import cvService from '../services/cvService';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { cvs, isLoading, error } = useSelector((state) => state.cv);
  const { subscription } = useSelector((state) => state.subscription);
  const { user } = useSelector((state) => state.auth);
  
  const [dataLoaded, setDataLoaded] = useState(false);
  const [directCVs, setDirectCVs] = useState([]);
  const [useDirect, setUseDirect] = useState(false);
  const [loadAttempted, setLoadAttempted] = useState(false);
  
  // Debug logs
  useEffect(() => {
    console.log("Current user:", user);
    console.log("Current subscription:", subscription);
  }, [user, subscription]);
  
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
  
  // Direct fetch of CVs to bypass potential Redux issues
  const fetchCVsDirectly = async () => {
    try {
      console.log("Fetching CVs directly from API...");
      const data = await cvService.getUserCVs();
      console.log("Direct CV fetch result:", data);
      
      if (Array.isArray(data)) {
        setDirectCVs(data);
        setUseDirect(true);
        
        // Also update Redux for consistency
        dispatch(setCVs(data));
      } else if (data && typeof data === 'object') {
        // Handle case where API returns object with CVs in a property
        const possibleArrays = Object.values(data).filter(val => Array.isArray(val));
        if (possibleArrays.length > 0) {
          const largestArray = possibleArrays.reduce((a, b) => a.length > b.length ? a : b);
          console.log("Found CV array in response object:", largestArray);
          setDirectCVs(largestArray);
          setUseDirect(true);
          
          // Also update Redux for consistency
          dispatch(setCVs(largestArray));
        }
      }
    } catch (error) {
      console.error("Error fetching CVs directly:", error);
      dispatch(showNotification({
        message: `Error loading CVs: ${error.message}`,
        type: 'error',
      }));
    }
  };
  
  // Fetch CVs and subscription on component mount
  useEffect(() => {
    // IMPORTANT: This prevents infinite loops
    if (!loadAttempted) {
      const loadData = async () => {
        try {
          console.log("Fetching CVs...");
          const cvsResult = await dispatch(fetchCVs());
          console.log("CV fetch result:", cvsResult);
          
          // If Redux fetch doesn't give us CVs, try direct fetch
          if (!Array.isArray(cvs) || cvs.length === 0) {
            await fetchCVsDirectly();
          }
          
          console.log("Fetching subscription...");
          const subResult = await dispatch(fetchSubscription());
          console.log("Subscription fetch result:", subResult);
          
          setDataLoaded(true);
        } catch (error) {
          console.error("Error loading data:", error);
          
          // If Redux fetch fails, try direct fetch
          await fetchCVsDirectly();
          
          // Still mark as loaded even if there was an error
          setDataLoaded(true);
        } finally {
          setLoadAttempted(true);
        }
      };
      
      loadData();
    }
  }, [dispatch, loadAttempted]); // <-- REMOVED cvs from the dependency array

  const handleCreateCV = () => {
    // Add check for user data before navigating
    if (!user || !user.id) {
      dispatch(showNotification({
        message: 'Cannot create CV: User data is missing',
        type: 'error',
      }));
      return;
    }
    
    navigate('/cv/create');
  };
  
  const handleDirectCreateCV = () => {
    // Add check for user data before navigating
    if (!user || !user.id) {
      dispatch(showNotification({
        message: 'Cannot create CV: User data is missing',
        type: 'error',
      }));
      return;
    }
    
    navigate('/cv/direct-create');
  };

  // Use the direct CVs or the Redux CVs based on what's available
  const displayCVs = useDirect ? directCVs : cvs;
  const hasCVs = Array.isArray(displayCVs) && displayCVs.length > 0;
  
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
        <Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateCV}
            sx={{ mr: 2 }}
          >
            Create New CV
          </Button>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleDirectCreateCV}
          >
            Create CV (Direct API)
          </Button>
        </Box>
      </Box>

      {/* Debug Information */}
      <Card sx={{ mb: 3, bgcolor: 'rgba(0,0,0,0.02)' }}>
        <CardContent>
          <Typography variant="subtitle2">System Status:</Typography>
          <Divider sx={{ my: 1 }} />
          <Typography variant="body2">User Logged In: {user ? 'Yes' : 'No'}</Typography>
          <Typography variant="body2">User ID: {user?.id || 'Missing'}</Typography>
          <Typography variant="body2">Subscription: {subscription || 'Not loaded'}</Typography>
          <Typography variant="body2">CVs Loaded: {dataLoaded ? 'Yes' : 'No'}</Typography>
          <Typography variant="body2">Redux CV Count: {Array.isArray(cvs) ? cvs.length : 'Not an array'}</Typography>
          <Typography variant="body2">Direct CV Count: {directCVs.length}</Typography>
          <Typography variant="body2">Using: {useDirect ? 'Direct CVs' : 'Redux CVs'}</Typography>
          <Typography variant="body2">Load Attempted: {loadAttempted ? 'Yes' : 'No'}</Typography>
          
          <Box sx={{ mt: 2 }}>
            <Button 
              variant="outlined" 
              size="small" 
              onClick={fetchCVsDirectly}
              sx={{ mr: 1 }}
            >
              Reload CVs Directly
            </Button>
            <Button 
              variant="outlined" 
              size="small" 
              onClick={() => {
                dispatch(fetchCVs());
                setUseDirect(false);
              }}
            >
              Reload from Redux
            </Button>
          </Box>
        </CardContent>
      </Card>

      {subscription === 'free' && hasCVs && displayCVs.length >= 2 && (
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

      {isLoading && !dataLoaded ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : !hasCVs ? (
        <Paper elevation={2} sx={{ p: 4, textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            You haven't created any CVs yet
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Create your first CV to get started
          </Typography>
          <Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateCV}
              sx={{ mr: 2 }}
            >
              Create New CV
            </Button>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleDirectCreateCV}
            >
              Create CV (Direct API)
            </Button>
          </Box>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {displayCVs.map((cv, index) => {
            // Check for missing _id property
            if (!cv._id) {
              console.error(`CV at index ${index} is missing _id property:`, cv);
              return (
                <Grid item xs={12} sm={6} md={4} key={`missing-id-${index}`}>
                  <Alert severity="warning">
                    Invalid CV data (missing ID)
                  </Alert>
                </Grid>
              );
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