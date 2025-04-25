import React from 'react';
import { Box, Typography, Container, Link, Divider } from '@mui/material';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <Box component="footer" sx={{ mt: 'auto', py: 3, bgcolor: 'background.paper' }}>
      <Divider />
      <Container maxWidth="lg">
        <Box sx={{ py: 3, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: { xs: 2, md: 0 } }}>
            &copy; {currentYear} CV Optimizer. All rights reserved.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Link href="#" color="inherit" underline="hover">
              <Typography variant="body2" color="text.secondary">
                Terms
              </Typography>
            </Link>
            <Link href="#" color="inherit" underline="hover">
              <Typography variant="body2" color="text.secondary">
                Privacy
              </Typography>
            </Link>
            <Link href="#" color="inherit" underline="hover">
              <Typography variant="body2" color="text.secondary">
                Help
              </Typography>
            </Link>
            <Link href="#" color="inherit" underline="hover">
              <Typography variant="body2" color="text.secondary">
                Contact
              </Typography>
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;