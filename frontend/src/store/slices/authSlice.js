import { createSlice } from '@reduxjs/toolkit';

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

// Thunk for checking auth state
export const checkAuth = () => async (dispatch) => {
  // Simulated auth check
  dispatch(setLoading(true));
  setTimeout(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // In a real app, you would validate the token with the server
      dispatch(setCredentials({ 
        token,
        user: {
          name: 'Test User',
          email: 'test@example.com',
          subscription: 'free'
        }
      }));
    }
    dispatch(setLoading(false));
  }, 1000);
};