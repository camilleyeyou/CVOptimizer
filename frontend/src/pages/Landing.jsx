import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  AppBar,
  Toolbar,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Description as DescriptionIcon,
  Speed as SpeedIcon,
  Psychology as PsychologyIcon,
  AdsClick as AdsClickIcon,
} from '@mui/icons-material';

const Landing = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { isAuthenticated } = useSelector((state) => state.auth);

  const features = [
    {
      title: 'Professional Templates',
      description: 'Choose from a variety of professionally designed templates that stand out to employers.',
      icon: <DescriptionIcon fontSize="large" color="primary" />,
    },
    {
      title: 'AI Optimization',
      description: 'Our AI analyzes your CV and suggests improvements to increase your chances of getting noticed.',
      icon: <PsychologyIcon fontSize="large" color="primary" />,
    },
    {
      title: 'Easy to Use',
      description: 'Intuitive interface that makes creating and updating your CV quick and effortless.',
      icon: <AdsClickIcon fontSize="large" color="primary" />,
    },
    {
      title: 'Fast Results',
      description: 'Generate a polished CV in minutes, not hours, and start applying for jobs right away.',
      icon: <SpeedIcon fontSize="large" color="primary" />,
    },
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            CV Optimizer
          </Typography>
          <Box>
            {isAuthenticated ? (
              <Button color="primary" variant="contained" onClick={() => navigate('/dashboard')}>
                Dashboard
              </Button>
            ) : (
              <>
                <Button color="inherit" onClick={() => navigate('/login')} sx={{ mr: 1 }}>
                  Login
                </Button>
                <Button color="primary" variant="contained" onClick={() => navigate('/register')}>
                  Sign Up
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box 
        sx={{ 
          bgcolor: 'primary.main', 
          color: 'white', 
          py: isMobile ? 6 : 10,
          textAlign: 'center'
        }}
      >
        <Container>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Create a Professional CV in Minutes
          </Typography>
          <Typography variant="h6" component="p" gutterBottom sx={{ mb: 4, maxWidth: 700, mx: 'auto' }}>
            Our AI-powered CV optimizer helps you create an impressive CV that gets you noticed by employers.
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            color="secondary"
            onClick={() => navigate(isAuthenticated ? '/dashboard' : '/register')}
            sx={{ px: 4, py: 1.5 }}
          >
            {isAuthenticated ? 'Go to Dashboard' : 'Get Started For Free'}
          </Button>
        </Container>
      </Box>

      {/* Features Section */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 6 }}>
          Why Choose CV Optimizer
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
                <Box sx={{ mb: 2 }}>
                  {feature.icon}
                </Box>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography gutterBottom variant="h6" component="div">
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Call to Action */}
      <Box sx={{ bgcolor: 'background.default', py: 8 }}>
        <Container>
          <Card sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h5" component="h3" gutterBottom>
              Ready to Create Your Professional CV?
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}>
              Join thousands of job seekers who have used CV Optimizer to create impressive CVs and advance their careers.
            </Typography>
            <Button 
              variant="contained" 
              size="large" 
              color="primary"
              onClick={() => navigate(isAuthenticated ? '/dashboard' : '/register')}
            >
              {isAuthenticated ? 'Go to Dashboard' : 'Get Started For Free'}
            </Button>
          </Card>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: 'background.paper', py: 6 }}>
        <Container>
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} CV Optimizer. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Landing;