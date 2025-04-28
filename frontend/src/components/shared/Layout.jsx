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
  useTheme,
  useMediaQuery,
  styled,
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

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
    [theme.breakpoints.down('sm')]: {
      marginLeft: 0,
      padding: theme.spacing(2),
    },
  }),
);

const Layout = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { sidebarOpen } = useSelector((state) => state.ui);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  const navItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'My CVs', icon: <DescriptionIcon />, path: '/cvs' },
    { text: 'Create CV', icon: <AddIcon />, path: '/cv/create' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
    { text: 'Subscription', icon: <SubscriptionsIcon />, path: '/subscription' },
  ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Header />
      
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            position: 'relative',
          },
        }}
        variant={isMobile ? 'temporary' : 'persistent'}
        anchor="left"
        open={sidebarOpen}
        onClose={() => dispatch(toggleSidebar())}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', height: '100%', display: 'flex', flexDirection: 'column' }}>
          <List sx={{ flexGrow: 1 }}>
            {navItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton 
                  onClick={() => {
                    navigate(item.path);
                    if (isMobile) dispatch(toggleSidebar());
                  }}
                  sx={{
                    '&.Mui-selected': {
                      backgroundColor: theme.palette.action.selected,
                    },
                  }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
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
                  <LogoutIcon color="error" />
                </ListItemIcon>
                <ListItemText primary="Logout" primaryTypographyProps={{ color: 'error' }} />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Main open={sidebarOpen && !isMobile}>
        <Toolbar />
        <Container 
          maxWidth="xl" 
          sx={{ 
            mb: 4,
            px: { xs: 0, sm: 2 },
            width: '100%',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minHeight: 'calc(100vh - 128px)'
          }}
        >
          <Box sx={{ flexGrow: 1 }}>
            {children}
          </Box>
          <Footer />
        </Container>
      </Main>

      <Notification />
      <ConfirmDialog />
    </Box>
  );
};

export default Layout;