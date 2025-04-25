import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Button,
  CircularProgress,
  Paper,
  Alert,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import CVCard from '../components/cv/CVCard';
import { fetchCVs, clearError } from '../store/slices/cvSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cvs, isLoading, error } = useSelector((state) => state.cv);
  const { user } = useSelector((state) => state.auth);

  // Fetch CVs on component mount
  useEffect(() => {
    dispatch(fetchCVs());
  }, [dispatch]);

  const handleCreateCV = () => {
    navigate('/cv/create');
  };

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

      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          onClose={() => dispatch(clearError())}
        >
          {error}
        </Alert>
      )}

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
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
          {cvs.map((cv) => (
            <Grid item xs={12} sm={6} md={4} key={cv.id}>
              <CVCard cv={cv} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Dashboard;