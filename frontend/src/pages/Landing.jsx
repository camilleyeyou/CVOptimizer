import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardActions,
  Divider,
  AppBar,
  Toolbar,
  useTheme,
  useMediaQuery,
  Stack,
} from '@mui/material';
import {
  Description as DescriptionIcon,
  Build as BuildIcon,
  Search as SearchIcon,
  EmojiEvents as EmojiEventsIcon,
  Check as CheckIcon,
} from '@mui/icons-material';

const LandingPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const features = [
    {
      icon: <DescriptionIcon fontSize="large" color="primary" />,
      title: 'Professional Templates',
      description: 'Choose from a variety of professionally designed templates to make your CV stand out.',
    },
    {
      icon: <BuildIcon fontSize="large" color="primary" />,
      title: 'ATS Optimization',
      description: 'Ensure your CV passes through Applicant Tracking Systems with our optimization tools.',
    },
    {
      icon: <SearchIcon fontSize="large" color="primary" />,
      title: 'Keyword Analysis',
      description: 'Get insights on the best keywords to include based on your target job descriptions.',
    },
    {
      icon: <EmojiEventsIcon fontSize="large" color="primary" />,
      title: 'AI Content Suggestions',
      description: 'Receive smart recommendations to improve your CV content and increase your chances of getting hired.',
    },
  ];

  const pricingPlans = [
    {
      title: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Basic features for beginners',
      features: [
        'Create up to 2 CVs',
        'Basic templates',
        'PDF export',
        'Limited ATS checks',
      ],
      buttonText: 'Start Free',
      buttonVariant: 'outlined',
    },
    {
      title: 'Premium',
      price: '$9.99',
      period: 'per month',
      description: 'Everything you need for job hunting',
      features: [
        'Unlimited CVs',
        'All templates',
        'Advanced ATS optimization',
        'Keyword analysis',
        'Content suggestions',
        'Multiple export formats',
        'Priority support',
      ],
      buttonText: 'Get Premium',
      buttonVariant: 'contained',
      highlighted: true,
    },
  ];

  return (
    <Box>
      {/* Navigation */}
      <AppBar position="static" color="transparent" elevation={0}>
        <Container>
          <Toolbar disableGutters>
            <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
              CVOptimizer
            </Typography>
            <Stack direction="row" spacing={2}>
              {isAuthenticated ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate('/dashboard')}
                >
                  Dashboard
                </Button>
              ) : (
                <>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => navigate('/login')}
                  >
                    Login
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/register')}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          pt: 8,
          pb: 6,
        }}
      >
        <Container maxWidth="sm">
          <Typography
            component="h1"
            variant="h2"
            align="center"
            color="text.primary"
            gutterBottom
            sx={{ fontWeight: 'bold' }}
          >
            Build a Winning CV
          </Typography>
          <Typography variant="h5" align="center" color="text.secondary" paragraph>
            Create professional, ATS-optimized resumes that land interviews. Our AI-powered platform
            helps you stand out from the competition and get noticed by recruiters.
          </Typography>
          <Stack
            sx={{ pt: 4 }}
            direction={isMobile ? 'column' : 'row'}
            spacing={2}
            justifyContent="center"
          >
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate(isAuthenticated ? '/cv/create' : '/register')}
            >
              Create Your CV Now
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => {
                const featuresSection = document.getElementById('features');
                featuresSection.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Learn More
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Features Section */}
      <Container sx={{ py: 8 }} id="features">
        <Typography
          component="h2"
          variant="h3"
          align="center"
          color="text.primary"
          gutterBottom
          sx={{ mb: 6, fontWeight: 'bold' }}
        >
          Key Features
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature) => (
            <Grid item key={feature.title} xs={12} sm={6} md={3}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 6,
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', pt: 4 }}>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography gutterBottom variant="h5" component="h3">
                    {feature.title}
                  </Typography>
                  <Typography>{feature.description}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Pricing Section */}
      <Box sx={{ bgcolor: 'background.paper', py: 8 }}>
        <Container>
          <Typography
            component="h2"
            variant="h3"
            align="center"
            color="text.primary"
            gutterBottom
            sx={{ mb: 6, fontWeight: 'bold' }}
          >
            Pricing Plans
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {pricingPlans.map((plan) => (
              <Grid
                item
                key={plan.title}
                xs={12}
                sm={6}
                md={4}
                sx={{
                  display: 'flex',
                }}
              >
                <Card
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    border: plan.highlighted ? `2px solid ${theme.palette.primary.main}` : 'none',
                    transform: plan.highlighted ? 'scale(1.05)' : 'none',
                    zIndex: plan.highlighted ? 1 : 'auto',
                    boxShadow: plan.highlighted ? 6 : 1,
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h4" component="h3">
                      {plan.title}
                    </Typography>
                    <Typography
                      component="h4"
                      variant="h3"
                      sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'baseline' }}
                    >
                      {plan.price}
                      <Typography
                        component="span"
                        variant="body1"
                        sx={{ ml: 1, color: 'text.secondary' }}
                      >
                        {plan.period}
                      </Typography>
                    </Typography>
                    <Typography color="text.secondary" sx={{ mb: 3 }}>
                      {plan.description}
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    {plan.features.map((feature) => (
                      <Box
                        key={feature}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          mb: 1,
                        }}
                      >
                        <CheckIcon color="primary" sx={{ mr: 1 }} />
                        <Typography variant="body2">{feature}</Typography>
                      </Box>
                    ))}
                  </CardContent>
                  <CardActions sx={{ p: 2 }}>
                    <Button
                      fullWidth
                      variant={plan.buttonVariant}
                      color="primary"
                      size="large"
                      onClick={() => navigate(isAuthenticated ? '/subscription' : '/register')}
                    >
                      {plan.buttonText}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Call to Action */}
      <Box sx={{ bgcolor: theme.palette.primary.main, color: 'white', py: 6 }}>
        <Container>
          <Grid container spacing={4} alignItems="center" justifyContent="space-between">
            <Grid item xs={12} md={7}>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                Ready to land your dream job?
              </Typography>
              <Typography variant="body1" paragraph>
                Join thousands of job seekers who've boosted their career opportunities with CVOptimizer.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                onClick={() => navigate(isAuthenticated ? '/cv/create' : '/register')}
                sx={{ px: 4, py: 1.5 }}
              >
                Get Started For Free
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: 'background.paper', py: 6 }}>
        <Container>
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} CVOptimizer. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;