import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography, CircularProgress } from '@mui/material';

// Pages
import LandingPage from './pages/Landing';
import LoginPage from './pages/Auth/Login';
import RegisterPage from './pages/Auth/Register';
import DashboardPage from './pages/Dashboard';
import CVEditorPage from './pages/CVEditor';
import CVPreviewPage from './pages/CVPreview';
import SettingsPage from './pages/Settings';
import SubscriptionPage from './pages/Subscription';
import NotFoundPage from './pages/NotFound';
import ForgotPasswordPage from './pages/Auth/ForgotPassword';
import ResetPasswordPage from './pages/Auth/ResetPassword';
import DirectCVCreatePage from './pages/DirectCVCreate';
import PDFTester from './components/debug/PDFTester';
import PDFDebug from './components/debug/PDFDebug';



// Components
import Layout from './components/shared/Layout';

// Actions
import { checkAuth } from './store/slices/authSlice';
import { showNotification } from './store/slices/uiSlice';

// RedirectWithNotification component
const RedirectWithNotification = ({ to, message }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Show notification
    dispatch(showNotification({
      message: message,
      type: 'warning',
    }));
    
    // Redirect after a short delay
    const timer = setTimeout(() => {
      navigate(to, { replace: true });
    }, 100);
    
    return () => clearTimeout(timer);
  }, [dispatch, navigate, to, message]);
  
  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column'
    }}>
      <CircularProgress size={24} />
      <Typography sx={{ mt: 2 }}>Redirecting...</Typography>
    </Box>
  );
};

// RouteLogger component
const RouteLogger = () => {
  const location = useLocation();
  
  useEffect(() => {
    console.log('Route changed to:', location.pathname);
    
    // Check for problematic routes
    if (location.pathname.includes('/undefined') || 
        location.pathname.includes('/null') ||
        location.pathname.endsWith('/preview') ||
        location.pathname.endsWith('/edit')) {
      console.error('WARNING: Potentially invalid route detected:', location.pathname);
    }
  }, [location]);
  
  return null; // This component doesn't render anything
};

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

  // Check if user is authenticated on app load - only once
  useEffect(() => {
    dispatch(checkAuth());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array to run only once

  if (isLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div className="loader"></div>
        <p>Loading CV Optimizer...</p>
      </Box>
    );
  }

  return (
    <>
      <RouteLogger />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" replace />} />
        <Route path="/register" element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/dashboard" replace />} />
        <Route path="/forgot-password" element={!isAuthenticated ? <ForgotPasswordPage /> : <Navigate to="/dashboard" replace />} />
        <Route path="/reset-password/:token" element={!isAuthenticated ? <ResetPasswordPage /> : <Navigate to="/dashboard" replace />} />
        
        {/* Protected routes */}
        <Route path="/dashboard" element={
          isAuthenticated ? (
            <Layout>
              <DashboardPage />
            </Layout>
          ) : (
            <Navigate to="/login" replace />
          )
        } />
        
        <Route path="/cv/create" element={
          isAuthenticated ? (
            <Layout>
              <CVEditorPage />
            </Layout>
          ) : (
            <Navigate to="/login" replace />
          )
        } />

        <Route path="/debug/pdf/:id?" element={<PDFDebug />} />

        
        <Route path="/cv/edit/:id" element={
          isAuthenticated ? (
            <Layout>
              <CVEditorPage />
            </Layout>
          ) : (
            <Navigate to="/login" replace />
          )
        } />
        
        {/* CV Preview Routes - Special handling for invalid IDs */}
        <Route path="/cv/preview/undefined" element={
          <RedirectWithNotification 
            to="/dashboard" 
            message="Cannot preview CV: No valid CV ID provided"
          />
        } />
        
        <Route path="/cv/preview/null" element={
          <RedirectWithNotification 
            to="/dashboard" 
            message="Cannot preview CV: No valid CV ID provided"
          />
        } />
        
        <Route path="/cv/preview/" element={
          <RedirectWithNotification 
            to="/dashboard" 
            message="Cannot preview CV: No CV ID provided"
          />
        } />

        <Route path="/cv/direct-create" element={
          isAuthenticated ? (
            <Layout>
              <DirectCVCreatePage />
            </Layout>
          ) : (
            <Navigate to="/login" replace />
          )
        } />

        <Route path="/pdf-test" element={<PDFTester />} />

        
        {/* Regular preview route with valid ID */}
        <Route path="/cv/preview/:id" element={
          isAuthenticated ? (
            <Layout>
              <CVPreviewPage />
            </Layout>
          ) : (
            <Navigate to="/login" replace />
          )
        } />
        
        <Route path="/settings" element={
          isAuthenticated ? (
            <Layout>
              <SettingsPage />
            </Layout>
          ) : (
            <Navigate to="/login" replace />
          )
        } />
        
        <Route path="/subscription" element={
          isAuthenticated ? (
            <Layout>
              <SubscriptionPage />
            </Layout>
          ) : (
            <Navigate to="/login" replace />
          )
        } />
        
        {/* 404 Not Found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;