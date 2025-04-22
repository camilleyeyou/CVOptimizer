import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Grid,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { Check as CheckIcon, Lock as LockIcon } from '@mui/icons-material';

import { updateField } from '../../store/slices/cvSlice';
import { setSelectedTemplate } from '../../store/slices/uiSlice';

const TemplateSelection = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { currentCV } = useSelector((state) => state.cv);
  const { selectedTemplate } = useSelector((state) => state.ui);
  const { user } = useSelector((state) => state.auth);
  
  const isPremiumUser = user?.subscription === 'premium';
  
  const handleTemplateChange = (template) => {
    // Only allow premium templates for premium users
    if (template !== 'modern' && template !== 'classic' && !isPremiumUser) {
      return;
    }
    
    dispatch(setSelectedTemplate(template));
    dispatch(updateField({ path: 'template', value: template }));
  };
  
  const handleTitleChange = (e) => {
    dispatch(updateField({ path: 'title', value: e.target.value }));
  };
  
  // Template options
  const templates = [
    {
      id: 'modern',
      name: 'Modern',
      image: '/template-modern.png', // This would be an actual image in a real app
      description: 'Clean and professional design with a modern touch.',
      isPremium: false,
    },
    {
      id: 'classic',
      name: 'Classic',
      image: '/template-classic.png',
      description: 'Traditional layout suitable for conservative industries.',
      isPremium: false,
    },
    {
      id: 'minimal',
      name: 'Minimal',
      image: '/template-minimal.png',
      description: 'Elegant minimalist design focusing on content.',
      isPremium: true,
    },
    {
      id: 'professional',
      name: 'Professional',
      image: '/template-professional.png',
      description: 'Sophisticated design for executive and senior positions.',
      isPremium: true,
    },
    {
      id: 'creative',
      name: 'Creative',
      image: '/template-creative.png',
      description: 'Unique design for creative industries and designers.',
      isPremium: true,
    },
    {
      id: 'technical',
      name: 'Technical',
      image: '/template-technical.png',
      description: 'Optimized for technical roles and IT professionals.',
      isPremium: true,
    },
  ];
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Name Your CV
      </Typography>
      <TextField
        fullWidth
        label="CV Title"
        variant="outlined"
        margin="normal"
        value={currentCV?.title || ''}
        onChange={handleTitleChange}
        helperText="Give your CV a name so you can identify it later"
        sx={{ mb: 4, maxWidth: '500px' }}
      />
      
      <Typography variant="h6" gutterBottom>
        Choose a Template
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Select a template that best fits your industry and personal style.
        {!isPremiumUser && (
          <> Premium templates require a <b>Premium</b> subscription.</>
        )}
      </Typography>
      
      <Grid container spacing={3} sx={{ mt: 1 }}>
        {templates.map((template) => {
          const isSelected = currentCV?.template === template.id;
          const isDisabled = template.isPremium && !isPremiumUser;
          
          return (
            <Grid item xs={12} sm={6} md={4} key={template.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  position: 'relative',
                  opacity: isDisabled ? 0.7 : 1,
                  boxShadow: isSelected 
                    ? `0 0 0 2px ${theme.palette.primary.main}`
                    : theme.shadows[1],
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: isDisabled ? 'none' : 'translateY(-4px)',
                    boxShadow: isDisabled 
                      ? theme.shadows[1]
                      : isSelected 
                      ? `0 4px 10px rgba(0,0,0,0.15), 0 0 0 2px ${theme.palette.primary.main}`
                      : theme.shadows[4],
                  },
                }}
              >
                <CardActionArea 
                  onClick={() => handleTemplateChange(template.id)}
                  disabled={isDisabled}
                  sx={{ height: '100%' }}
                >
                  {/* Template preview image */}
                  <CardMedia
                    component="div"
                    sx={{
                      height: 200,
                      backgroundColor: '#f5f5f5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {/* This would be a real image in a production app */}
                    <Typography variant="body2" color="text.secondary">
                      {template.name} Template Preview
                    </Typography>
                  </CardMedia>
                  
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6" component="div">
                        {template.name}
                      </Typography>
                      
                      {template.isPremium && (
                        <Chip 
                          size="small" 
                          label="Premium" 
                          color="secondary"
                        />
                      )}
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {template.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
                
                {isSelected && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      bgcolor: 'primary.main',
                      color: 'white',
                      borderRadius: '50%',
                      width: 32,
                      height: 32,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <CheckIcon fontSize="small" />
                  </Box>
                )}
                
                {isDisabled && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      bgcolor: 'rgba(0, 0, 0, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Box
                      sx={{
                        bgcolor: 'rgba(0, 0, 0, 0.5)',
                        color: 'white',
                        borderRadius: '50%',
                        width: 48,
                        height: 48,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <LockIcon />
                    </Box>
                  </Box>
                )}
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default TemplateSelection;