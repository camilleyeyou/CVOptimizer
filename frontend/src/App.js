import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

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
import ProtectedRoute from './components/auth/ProtectedRoute';

// Actions
import { checkAuth } from './store/slices/authSlice';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

  // Check if user is authenticated on app load
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div className="loader"></div>
        <p>Loading CV Optimizer...</p>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" />} />
      <Route path="/register" element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/dashboard" />} />
      <Route path="/forgot-password" element={!isAuthenticated ? <ForgotPasswordPage /> : <Navigate to="/dashboard" />} />
      <Route path="/reset-password/:token" element={!isAuthenticated ? <ResetPasswordPage /> : <Navigate to="/dashboard" />} />
      
      {/* Protected routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Layout>
            <DashboardPage />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/cv/create" element={
        <ProtectedRoute>
          <Layout>
            <CVEditorPage />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/cv/edit/:id" element={
        <ProtectedRoute>
          <Layout>
            <CVEditorPage />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/cv/preview/:id" element={
        <ProtectedRoute>
          <Layout>
            <CVPreviewPage />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/settings" element={
        <ProtectedRoute>
          <Layout>
            <SettingsPage />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/subscription" element={
        <ProtectedRoute>
          <Layout>
            <SubscriptionPage />
          </Layout>
        </ProtectedRoute>
      } />
      
      {/* 404 Not Found */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;