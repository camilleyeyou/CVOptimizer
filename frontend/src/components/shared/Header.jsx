import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  AccountCircle,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  Subscriptions as SubscriptionsIcon,
} from '@mui/icons-material';

import { clearCredentials } from '../../store/slices/authSlice';
import { toggleSidebar } from '../../store/slices/uiSlice';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const { user } = useSelector((state) => state.auth);
  const { sidebarOpen } = useSelector((state) => state.ui);
  
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleLogout = () => {
    handleClose();
    dispatch(clearCredentials());
    navigate('/login');
  };
  
  const handleProfile = () => {
    handleClose();
    navigate('/settings');
  };
  
  const handleSubscription = () => {
    handleClose();
    navigate('/subscription');
  };
  
  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };
  
  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: 'white',
        color: 'text.primary',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label={sidebarOpen ? "close drawer" : "open drawer"}
          edge="start"
          onClick={handleToggleSidebar}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Box
            component="img"
            src="/logo.png" // Replace with your actual logo
            alt="CV Optimizer"
            sx={{ 
              height: 40,
              width: 'auto',
              mr: 1,
              display: { xs: 'none', sm: 'block' }
            }}
          />
          CV Optimizer
        </Typography>
        
        {!isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button 
              color="inherit" 
              onClick={() => navigate('/dashboard')}
              sx={{ mx: 1 }}
            >
              Dashboard
            </Button>
            <Button 
              color="inherit" 
              onClick={() => navigate('/cv/create')}
              sx={{ mx: 1 }}
            >
              Create CV
            </Button>
          </Box>
        )}
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton 
            color="inherit"
            aria-label="notifications"
            sx={{ ml: 1 }}
          >
            <NotificationsIcon />
          </IconButton>
          
          <IconButton
            onClick={handleMenu}
            color="inherit"
            aria-label="account"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            sx={{ ml: 1 }}
          >
            {user?.name ? (
              <Avatar 
                sx={{ 
                  width: 32, 
                  height: 32,
                  backgroundColor: 'primary.main',
                  color: 'white',
                  fontSize: 16
                }}
              >
                {user.name.charAt(0).toUpperCase()}
              </Avatar>
            ) : (
              <AccountCircle />
            )}
          </IconButton>
          
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={open}
            onClose={handleClose}
          >
            {user && (
              <Box sx={{ px: 2, py: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  {user.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user.email}
                </Typography>
                <Typography variant="caption" color="primary">
                  {user.subscription === 'free' ? 'Free Plan' : 'Premium Plan'}
                </Typography>
              </Box>
            )}
            
            <Divider />
            
            <MenuItem onClick={handleProfile}>
              <SettingsIcon fontSize="small" sx={{ mr: 1 }} />
              Settings
            </MenuItem>
            
            <MenuItem onClick={handleSubscription}>
              <SubscriptionsIcon fontSize="small" sx={{ mr: 1 }} />
              Subscription
            </MenuItem>
            
            <Divider />
            
            <MenuItem onClick={handleLogout}>
              <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;