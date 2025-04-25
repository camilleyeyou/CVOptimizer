import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import RegisterForm from '../../components/auth/RegisterForm';

const Register = () => {
  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h4" sx={{ mb: 4 }}>
          CV Optimizer
        </Typography>
        <RegisterForm />
      </Box>
    </Container>
  );
};

export default Register;