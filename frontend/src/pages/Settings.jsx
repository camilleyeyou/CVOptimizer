import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Settings = () => {
  return (
    <Box sx={{ 
        width: '100%', 
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Settings
      </Typography>
      
      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography variant="h6" gutterBottom>
          Account Settings
        </Typography>
        <Typography variant="body1" align="center" sx={{ py: 5 }}>
          Settings page (Placeholder)
        </Typography>
      </Paper>
    </Box>
  );
};

export default Settings;