// src/components/debug/PDFDebug.jsx - Fixed ESLint warnings
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Button, 
  TextField, 
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import { useParams } from 'react-router-dom';
import PDFService from '../../services/PDFService';
import api from '../../services/api';

/**
 * Debug component for PDF generation
 * Add this to a route like /debug/pdf/:id for easy testing
 */
const PDFDebug = () => {
  const { id } = useParams();
  const [cvId, setCvId] = useState(id || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cvData, setCvData] = useState(null);
  const [logMessages, setLogMessages] = useState([]);
  
  // Add a log message
  const addLog = useCallback((message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogMessages(prev => [...prev, { message, type, timestamp }]);
  }, []);
  
  // Fetch CV data for inspection - wrapped in useCallback
  const fetchCVData = useCallback(async (id) => {
    if (!id) {
      setError('Please enter a CV ID');
      return;
    }
    
    setLoading(true);
    setError(null);
    setCvData(null);
    setLogMessages([]);
    
    try {
      addLog(`Fetching CV data for ID: ${id}`);
      
      // Try to get CV data from API
      const response = await api.get(`/cv/${id}`);
      addLog('API response received', 'success');
      
      // Extract CV data from different possible response formats
      let extractedData;
      if (response.data && response.data.cv) {
        // Format: { cv: {...} }
        extractedData = response.data.cv;
        addLog('CV data found in response.data.cv', 'info');
      } else if (response.data && (response.data._id || response.data.title)) {
        // Format: Direct CV object
        extractedData = response.data;
        addLog('CV data found directly in response.data', 'info');
      } else {
        throw new Error('Could not extract CV data from response');
      }
      
      setCvData(extractedData);
      addLog('CV data loaded successfully', 'success');
    } catch (error) {
      console.error('Error fetching CV data:', error);
      setError(error.message || 'Failed to fetch CV data');
      addLog(`Error: ${error.message || 'Unknown error'}`, 'error');
    } finally {
      setLoading(false);
    }
  }, [addLog]);
  
  // If ID is in URL params, load on mount
  useEffect(() => {
    if (id) {
      fetchCVData(id);
    }
  }, [id, fetchCVData]); // Fixed dependency array
  
  // Handle CV ID input change
  const handleIdChange = (e) => {
    setCvId(e.target.value);
  };
  
  // Handle fetch button click
  const handleFetch = () => {
    fetchCVData(cvId);
  };
  
  // Generate PDF from current CV data
  const handleGeneratePDF = async () => {
    if (!cvId) {
      setError('Please enter a CV ID');
      return;
    }
    
    setLoading(true);
    try {
      addLog(`Starting PDF generation for CV ID: ${cvId}`);
      
      // Generate PDF
      const pdfBlob = await PDFService.generatePDF(cvId);
      
      if (!pdfBlob) {
        throw new Error('No PDF data returned');
      }
      
      // Download the PDF
      PDFService.downloadPDF(pdfBlob, `CV-Debug-${cvId}.pdf`);
      
      addLog('PDF generated and downloaded successfully', 'success');
    } catch (error) {
      console.error('PDF generation error:', error);
      setError(error.message || 'Failed to generate PDF');
      addLog(`Error: ${error.message || 'Unknown error'}`, 'error');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        PDF Generation Debugger
      </Typography>
      
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          1. Enter CV ID and Fetch Data
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            label="CV ID"
            value={cvId}
            onChange={handleIdChange}
            fullWidth
            placeholder="Enter CV ID (e.g., 6811cd1eedbb7063fd9f063c)"
          />
          
          <Button
            variant="contained"
            onClick={handleFetch}
            disabled={loading || !cvId}
            sx={{ minWidth: 120 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Fetch Data'}
          </Button>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Paper>
      
      {cvData && (
        <>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              2. CV Data Preview
            </Typography>
            
            <Card variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  {cvData.title || 'Untitled CV'}
                </Typography>
                
                <Divider sx={{ my: 1 }} />
                
                <Typography variant="body2">
                  <strong>Template:</strong> {cvData.template || 'Not specified'}
                </Typography>
                
                <Typography variant="body2">
                  <strong>Name:</strong> {cvData.personalInfo?.fullName || cvData.personalInfo?.name || 'Not specified'}
                </Typography>
                
                <Typography variant="body2">
                  <strong>Job Title:</strong> {cvData.personalInfo?.jobTitle || cvData.personalInfo?.title || 'Not specified'}
                </Typography>
                
                <Typography variant="body2">
                  <strong>Summary length:</strong> {cvData.summary ? cvData.summary.length : 0} characters
                </Typography>
                
                <Typography variant="body2">
                  <strong>Work Experience:</strong> {Array.isArray(cvData.workExperience) ? cvData.workExperience.length : 0} items
                </Typography>
                
                <Typography variant="body2">
                  <strong>Education:</strong> {Array.isArray(cvData.education) ? cvData.education.length : 0} items
                </Typography>
                
                <Typography variant="body2">
                  <strong>Skills:</strong> {Array.isArray(cvData.skills) ? cvData.skills.length : 0} items
                </Typography>
              </CardContent>
            </Card>
            
            <Button
              variant="contained"
              onClick={handleGeneratePDF}
              disabled={loading}
              fullWidth
            >
              {loading ? <CircularProgress size={24} /> : 'Generate & Download PDF'}
            </Button>
          </Paper>
          
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              3. Complete CV Data Structure
            </Typography>
            
            <Box
              component="pre"
              sx={{
                p: 2,
                bgcolor: '#f5f5f5',
                borderRadius: 1,
                overflow: 'auto',
                maxHeight: 400,
                fontSize: '0.875rem',
              }}
            >
              {JSON.stringify(cvData, null, 2)}
            </Box>
          </Paper>
        </>
      )}
      
      {logMessages.length > 0 && (
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Logs
          </Typography>
          
          <Box
            sx={{
              p: 2,
              bgcolor: '#f5f5f5',
              borderRadius: 1,
              maxHeight: 300,
              overflow: 'auto',
              fontFamily: 'monospace',
              fontSize: '0.875rem',
            }}
          >
            {logMessages.map((log, index) => (
              <Box
                key={index}
                sx={{
                  color:
                    log.type === 'error' ? 'error.main' :
                    log.type === 'success' ? 'success.main' :
                    log.type === 'warning' ? 'warning.main' : 'inherit',
                  mb: 0.5,
                }}
              >
                [{log.timestamp}] {log.message}
              </Box>
            ))}
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default PDFDebug;