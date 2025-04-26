import { createSlice } from '@reduxjs/toolkit';
import authService from '../../services/authService';

const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
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
    const token = localStorage.getItem('token');
        if (!token) {
      dispatch(clearCredentials());
      return;
    }
    
    dispatch(setLoading(true));
    
    try {
      const response = await authService.checkAuthStatus();
      
      dispatch(setCredentials({
        token,
        user: response.user
      }));
    } catch (error) {
      if (error.response && error.response.status === 401) {
        dispatch(clearCredentials());
      }
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
    dispatch(setError(error.message));
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
    dispatch(setError(error.message));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

// Thunk for logout
export const logoutUser = () => (dispatch) => {
  authService.logout();
  dispatch(clearCredentials());
};

// Thunk for password reset request
export const forgotPassword = (email) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await authService.forgotPassword(email);
    return response;
  } catch (error) {
    dispatch(setError(error.message));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};