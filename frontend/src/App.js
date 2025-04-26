import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Box } from '@mui/material';

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

// Components
import Layout from './components/shared/Layout';

// Actions
import { checkAuth } from './store/slices/authSlice';

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
      
      <Route path="/cv/edit/:id" element={
        isAuthenticated ? (
          <Layout>
            <CVEditorPage />
          </Layout>
        ) : (
          <Navigate to="/login" replace />
        )
      } />
      
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
  );
}

export default App;