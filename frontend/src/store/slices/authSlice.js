import { createSlice } from '@reduxjs/toolkit';
import authService from '../../services/authService';

const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem('token', action.payload.token);
    },
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setCredentials,
  clearCredentials,
  setLoading,
  setError,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;

// Thunk for checking auth status
export const checkAuth = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    // Get auth status from the backend
    const response = await authService.checkAuthStatus();
    
    if (response.user) {
      dispatch(setCredentials({
        token: localStorage.getItem('token'),
        user: response.user
      }));
    }
  } catch (error) {
    // If token is invalid, clear credentials
    dispatch(clearCredentials());
  } finally {
    dispatch(setLoading(false));
  }
};

// Thunk for login
export const loginUser = (email, password) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await authService.login(email, password);
    dispatch(setCredentials(response));
    return response;
  } catch (error) {
    dispatch(setError(error.message || 'Login failed'));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

// Thunk for registration
export const registerUser = (name, email, password) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await authService.register(name, email, password);
    dispatch(setCredentials(response));
    return response;
  } catch (error) {
    dispatch(setError(error.message || 'Registration failed'));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

// Thunk for logout
export const logoutUser = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    await authService.logout();
    dispatch(clearCredentials());
  } catch (error) {
    // Even if the logout request fails, clear the credentials locally
    dispatch(clearCredentials());
  } finally {
    dispatch(setLoading(false));
  }
};