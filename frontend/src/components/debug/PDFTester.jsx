// src/components/debug/PDFTester.jsx
import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  TextField, 
  CircularProgress, 
  Paper,
  Alert
} from '@mui/material';
import { Download as DownloadIcon } from '@mui/icons-material';
import PDFService from '../../services/PDFService';

/**
 * A debug component to test PDF generation without navigating through the app
 */
const PDFTester = () => {
  const [cvId, setCvId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [logMessages, setLogMessages] = useState([]);
  
  // Add a log message
  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogMessages(prev => [...prev, { message, type, timestamp }]);
  };
  
  // Handle ID input change
  const handleIdChange = (e) => {
    setCvId(e.target.value);
  };
  
  // Test PDF generation
  const handleTestPDF = async () => {
    if (!cvId) {
      setError('Please enter a CV ID');
      return;
    }
    
    // Clear previous states
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    setLogMessages([]);
    
    try {
      addLog(`Starting PDF generation for CV ID: ${cvId}`);
      
      // Save original console methods
      const originalConsoleLog = console.log;
      const originalConsoleError = console.error;
      const originalConsoleWarn = console.warn;
      
      // Override console methods to capture logs
      console.log = (...args) => {
        originalConsoleLog(...args);
        addLog(args.join(' '), 'info');
      };
      
      console.error = (...args) => {
        originalConsoleError(...args);
        addLog(args.join(' '), 'error');
      };
      
      console.warn = (...args) => {
        originalConsoleWarn(...args);
        addLog(args.join(' '), 'warning');
      };
      
      // Generate PDF
      const pdfBlob = await PDFService.generatePDF(cvId);
      
      // Restore console methods
      console.log = originalConsoleLog;
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
      
      if (!pdfBlob) {
        throw new Error('No PDF data returned');
      }
      
      // Download the PDF
      PDFService.downloadPDF(pdfBlob, `CV-Test-${cvId}.pdf`);
      
      setSuccess(true);
      addLog('PDF generated and downloaded successfully!', 'success');
    } catch (error) {
      console.error('PDF Test Error:', error);
      setError(error.message || 'Unknown error');
      addLog(`Error: ${error.message || 'Unknown error'}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: 'auto', my: 4 }}>
      <Typography variant="h5" gutterBottom>
        PDF Generation Tester
      </Typography>
      
      <Typography variant="body2" color="text.secondary" paragraph>
        This is a debug tool to test PDF generation directly with a CV ID.
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          PDF generated successfully!
        </Alert>
      )}
      
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="CV ID"
          variant="outlined"
          value={cvId}
          onChange={handleIdChange}
          placeholder="Enter CV ID (e.g., 6811cd1eedbb7063fd9f063c)"
          sx={{ mb: 2 }}
        />
        
        <Button
          variant="contained"
          startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <DownloadIcon />}
          onClick={handleTestPDF}
          disabled={isLoading || !cvId}
          fullWidth
        >
          {isLoading ? 'Generating...' : 'Test PDF Generation'}
        </Button>
      </Box>
      
      {logMessages.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Log Messages:
          </Typography>
          
          <Box 
            sx={{ 
              maxHeight: 300, 
              overflowY: 'auto', 
              p: 2, 
              bgcolor: 'black', 
              color: 'white',
              fontFamily: 'monospace',
              fontSize: 12,
              borderRadius: 1
            }}
          >
            {logMessages.map((log, index) => (
              <Box 
                key={index} 
                sx={{ 
                  mb: 0.5, 
                  color: log.type === 'error' ? 'error.light' : 
                         log.type === 'warning' ? 'warning.light' : 
                         log.type === 'success' ? 'success.light' : 'inherit'
                }}
              >
                [{log.timestamp}] {log.message}
              </Box>
            ))}
          </Box>
        </Box>
      )}
      
      <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #eee' }}>
        <Typography variant="caption" display="block" color="text.secondary">
          This component is for debugging purposes only. Access it via /pdf-test in your app.
        </Typography>
      </Box>
    </Paper>
  );
};

export default PDFTester;