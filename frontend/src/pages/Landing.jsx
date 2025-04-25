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
  Divider,
  AppBar,
  Toolbar,
  Stack,
} from '@mui/material';

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

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
            direction={{ xs: 'column', sm: 'row' }}
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
            >
              Learn More
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Features Section */}
      <Container sx={{ py: 8 }}>
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
          {Array.from(Array(4)).map((_, idx) => (
            <Grid item key={idx} xs={12} sm={6} md={3}>
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
                  <Typography gutterBottom variant="h5" component="h3">
                    Feature {idx + 1}
                  </Typography>
                  <Typography>
                    This is a media card. You can use this section to describe the content.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

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