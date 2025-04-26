import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Container,
  Toolbar,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Description as DescriptionIcon,
  Settings as SettingsIcon,
  Subscriptions as SubscriptionsIcon,
  Add as AddIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';

import Header from './Header';
import Footer from './Footer';
import Notification from './Notification';
import ConfirmDialog from './ConfirmDialog';

import { logoutUser } from '../../store/slices/authSlice';
import { toggleSidebar } from '../../store/slices/uiSlice';

// Drawer width
const drawerWidth = 240;

const Layout = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { sidebarOpen } = useSelector((state) => state.ui);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  // List of navigation items
  const navItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/dashboard',
    },
    {
      text: 'Create CV',
      icon: <AddIcon />,
      path: '/cv/create',
    },
    {
      text: 'Settings',
      icon: <SettingsIcon />,
      path: '/settings',
    },
    {
      text: 'Subscription',
      icon: <SubscriptionsIcon />,
      path: '/subscription',
    },
  ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      {/* Header */}
      <Header />

      {/* Sidebar / Drawer */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={sidebarOpen}
      >
        <Toolbar /> {/* Add space for the app bar */}
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {navItems.map((item) => (
              <ListItem
                key={item.text}
                disablePadding
              >
                <ListItemButton onClick={() => navigate(item.path)}>
                  <ListItemIcon>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: '100%',
          transition: (theme) => theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          marginLeft: `-${drawerWidth}px`,
          ...(sidebarOpen && {
            transition: (theme) => theme.transitions.create('margin', {
              easing: theme.transitions.easing.easeOut,
              duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
          }),
        }}
      >
        <Toolbar /> {/* Add space for the app bar */}
        <Container maxWidth="xl" sx={{ mb: 4 }}>{children}</Container>
        <Footer />
      </Box>
      
      {/* Global notification */}
      <Notification />
      
      {/* Global confirmation dialog */}
      <ConfirmDialog />
    </Box>
  );
};

export default Layout;