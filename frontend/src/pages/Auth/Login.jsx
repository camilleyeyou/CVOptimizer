import React from 'react';
import { Box, Typography, Container, Paper } from '@mui/material';
import LoginForm from '../../components/auth/LoginForm';

const Login = () => {
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
        <LoginForm />
      </Box>
    </Container>
  );
};

export default Login;