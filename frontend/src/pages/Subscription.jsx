import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Subscription = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Subscription
      </Typography>
      
      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography variant="h6" gutterBottom>
          Subscription Plans
        </Typography>
        <Typography variant="body1" align="center" sx={{ py: 5 }}>
          Subscription page (Placeholder)
        </Typography>
      </Paper>
    </Box>
  );
};

export default Subscription;