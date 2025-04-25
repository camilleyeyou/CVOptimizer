import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Radio,
  Divider,
} from '@mui/material';
import { setSelectedTemplate } from '../../store/slices/uiSlice';
import { ModernTemplate, ClassicTemplate } from './templates';

const TemplateSelection = () => {
  const dispatch = useDispatch();
  const { selectedTemplate } = useSelector((state) => state.ui);
  const { currentCV } = useSelector((state) => state.cv);

  const templates = [
    {
      id: 'modern',
      name: 'Modern',
      description: 'Clean, contemporary design with a focus on skills and achievements.',
      image: '/images/templates/modern-thumbnail.jpg', // Replace with actual path
    },
    {
      id: 'classic',
      name: 'Classic',
      description: 'Traditional layout that works well for conservative industries.',
      image: '/images/templates/classic-thumbnail.jpg', // Replace with actual path
    },
    {
      id: 'creative',
      name: 'Creative',
      description: 'Bold design for creative professionals looking to stand out.',
      image: '/images/templates/creative-thumbnail.jpg', // Replace with actual path
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'Elegant and sophisticated design for senior positions.',
      image: '/images/templates/professional-thumbnail.jpg', // Replace with actual path
    },
  ];

  const handleTemplateSelect = (templateId) => {
    dispatch(setSelectedTemplate(templateId));
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Choose a Template
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Select a template that best represents your professional style. You can change this later.
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {templates.map((template) => (
          <Grid item xs={12} sm={6} md={3} key={template.id}>
            <Card 
              sx={{ 
                height: '100%',
                boxShadow: selectedTemplate === template.id ? 
                  (theme) => `0 0 0 2px ${theme.palette.primary.main}` : 
                  undefined,
                position: 'relative',
              }}
            >
              <CardActionArea onClick={() => handleTemplateSelect(template.id)}>
                <CardMedia
                  component="div"
                  sx={{
                    height: 200,
                    backgroundColor: 'grey.200',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {/* Replace with actual template thumbnail images */}
                  <Typography variant="body2" color="text.secondary">
                    {template.name} Template Preview
                  </Typography>
                </CardMedia>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Radio
                      checked={selectedTemplate === template.id}
                      onChange={() => handleTemplateSelect(template.id)}
                      value={template.id}
                      name="template-radio-button"
                      sx={{ p: 0, mr: 1 }}
                    />
                    <Typography variant="h6" component="div">
                      {template.name}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {template.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ my: 4 }} />

      <Box>
        <Typography variant="h6" gutterBottom>
          Template Preview
        </Typography>
        <Box sx={{ 
          border: '1px solid', 
          borderColor: 'grey.300', 
          borderRadius: 1, 
          p: 2,
          height: 500,
          overflow: 'auto',
          backgroundColor: 'white'
        }}>
          {selectedTemplate === 'modern' ? (
            <ModernTemplate cv={currentCV} />
          ) : (
            <ClassicTemplate cv={currentCV} />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default TemplateSelection;