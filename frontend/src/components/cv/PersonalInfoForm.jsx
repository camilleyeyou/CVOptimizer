import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
 Box,
 Typography,
 TextField,
 Button,
 Paper,
 Grid,
 Divider,
} from '@mui/material';
import { setCurrentCV } from '../../store/slices/cvSlice';
import { nextStep } from '../../store/slices/uiSlice';

const PersonalInfoForm = () => {
 const dispatch = useDispatch();
 const { currentCV } = useSelector((state) => state.cv);
 
 // Initialize form state from currentCV or empty values
 const [formData, setFormData] = useState({
   name: '',
   title: '',
   email: '',
   phone: '',
   address: '',
   linkedin: '',
   website: '',
 });

 // Update form data when currentCV changes
 useEffect(() => {
   if (currentCV?.personalInfo) {
     setFormData(currentCV.personalInfo);
   }
 }, [currentCV]);

 const handleChange = (e) => {
   const { name, value } = e.target;
   setFormData({
     ...formData,
     [name]: value,
   });
 };

 const handleSubmit = (e) => {
   e.preventDefault();
   
   // Update CV in store
   dispatch(
     setCurrentCV({
       ...currentCV,
       personalInfo: formData,
     })
   );
   
   // Move to next step
   dispatch(nextStep());
 };

 return (
   <Box component="form" onSubmit={handleSubmit} noValidate>
     <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
       <Typography variant="h5" gutterBottom>
         Personal Information
       </Typography>
       <Typography variant="body2" color="text.secondary" paragraph>
         Provide your contact details so employers can easily reach you.
       </Typography>
       <Divider sx={{ mb: 3 }} />

       <Grid container spacing={3}>
         <Grid sx={{ width: { xs: '100%', sm: '50%' } }}>
           <TextField
             required
             fullWidth
             label="Full Name"
             name="name"
             value={formData.name}
             onChange={handleChange}
             placeholder="e.g., John Doe"
           />
         </Grid>
         <Grid sx={{ width: { xs: '100%', md: '50%' } }}>
           <TextField
             fullWidth
             label="Professional Title"
             name="title"
             value={formData.title}
             onChange={handleChange}
             placeholder="e.g., Senior Software Developer"
           />
         </Grid>
         <Grid sx={{ width: { xs: '100%', md: '50%' } }}>
           <TextField
             required
             fullWidth
             label="Email"
             name="email"
             type="email"
             value={formData.email}
             onChange={handleChange}
             placeholder="e.g., john.doe@example.com"
           />
         </Grid>
         <Grid sx={{ width: { xs: '100%', md: '50%' } }}>
           <TextField
             fullWidth
             label="Phone Number"
             name="phone"
             value={formData.phone}
             onChange={handleChange}
             placeholder="e.g., +1 (555) 123-4567"
           />
         </Grid>
         <Grid sx={{ width: { xs: '100%', md: '50%' } }}>
           <TextField
             fullWidth
             label="Address"
             name="address"
             value={formData.address}
             onChange={handleChange}
             placeholder="e.g., New York, NY"
             helperText="City and state/country are sufficient. No need for full address."
           />
         </Grid>
         <Grid sx={{ width: { xs: '100%', md: '50%' } }}>
           <TextField
             fullWidth
             label="LinkedIn Profile"
             name="linkedin"
             value={formData.linkedin}
             onChange={handleChange}
             placeholder="e.g., linkedin.com/in/johndoe"
           />
         </Grid>
         <Grid sx={{ width: { xs: '100%', md: '50%' } }}>
           <TextField
             fullWidth
             label="Personal Website"
             name="website"
             value={formData.website}
             onChange={handleChange}
             placeholder="e.g., johndoe.com"
           />
         </Grid>
       </Grid>
     </Paper>

     <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
       <Button
         type="submit"
         variant="contained"
         size="large"
       >
         Save & Continue
       </Button>
     </Box>
   </Box>
 );
};

export default PersonalInfoForm;