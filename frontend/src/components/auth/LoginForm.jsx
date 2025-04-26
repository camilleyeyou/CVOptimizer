import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { 
 Box, 
 TextField, 
 Button, 
 Typography,
 Grid, 
 Paper,
 Alert,
 CircularProgress
} from '@mui/material';
import { loginUser, clearError } from '../../store/slices/authSlice';

const LoginForm = () => {
 const dispatch = useDispatch();
 const navigate = useNavigate();
 
 const { isLoading, error } = useSelector((state) => state.auth);
 
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const [formError, setFormError] = useState('');
 
 const handleSubmit = async (e) => {
   e.preventDefault();
   setFormError('');
   
   // Basic validation
   if (!email || !password) {
     setFormError('Please enter both email and password');
     return;
   }
   
   try {
     // Dispatch the login thunk
     await dispatch(loginUser(email, password)).unwrap();
     
     // Navigate to dashboard after successful login
     navigate('/dashboard');
   } catch (error) {
     setFormError(error.message || 'Failed to login. Please try again.');
   }
 };
 
 return (
   <Paper elevation={3} sx={{ p: 4, maxWidth: 500, mx: 'auto', mt: 4 }}>
     <Typography variant="h5" component="h1" gutterBottom align="center">
       Log In to CV Optimizer
     </Typography>
     
     {(formError || error) && (
       <Alert 
         severity="error" 
         sx={{ mb: 2 }}
         onClose={() => {
           setFormError('');
           dispatch(clearError());
         }}
       >
         {formError || error}
       </Alert>
     )}
     
     <Box component="form" onSubmit={handleSubmit} noValidate>
       <TextField
         margin="normal"
         required
         fullWidth
         id="email"
         label="Email Address"
         name="email"
         autoComplete="email"
         value={email}
         onChange={(e) => setEmail(e.target.value)}
         autoFocus
       />
       <TextField
         margin="normal"
         required
         fullWidth
         name="password"
         label="Password"
         type="password"
         id="password"
         autoComplete="current-password"
         value={password}
         onChange={(e) => setPassword(e.target.value)}
       />
       <Button
         type="submit"
         fullWidth
         variant="contained"
         sx={{ mt: 3, mb: 2 }}
         disabled={isLoading}
       >
         {isLoading ? <CircularProgress size={24} /> : 'Sign In'}
       </Button>
       <Grid container justifyContent="space-between">
         <Grid>
           <Link to="/forgot-password" style={{ textDecoration: 'none' }}>
             <Typography variant="body2" color="primary">
               Forgot password?
             </Typography>
           </Link>
         </Grid>
         <Grid>
           <Link to="/register" style={{ textDecoration: 'none' }}>
             <Typography variant="body2" color="primary">
               Don't have an account? Sign Up
             </Typography>
           </Link>
         </Grid>
       </Grid>
     </Box>
   </Paper>
 );
};

export default LoginForm;