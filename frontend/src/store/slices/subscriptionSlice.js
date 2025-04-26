import { createSlice } from '@reduxjs/toolkit';
import subscriptionService from '../../services/subscriptionService';

const initialState = {
  subscription: 'free',
  subscriptionExpiry: null,
  isLoading: false,
  error: null,
};

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    setSubscription: (state, action) => {
      state.subscription = action.payload.subscription;
      state.subscriptionExpiry = action.payload.subscriptionExpiry;
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
  setSubscription,
  setLoading,
  setError,
  clearError,
} = subscriptionSlice.actions;

export default subscriptionSlice.reducer;

// Thunk for fetching subscription details
export const fetchSubscription = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const data = await subscriptionService.getSubscription();
    dispatch(setSubscription(data));
    return data;
  } catch (error) {
    dispatch(setError(error.message));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

// Thunk for subscribing to a plan
export const subscribe = (plan) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await subscriptionService.subscribe(plan);
    dispatch(setSubscription(response.data));
    return response;
  } catch (error) {
    dispatch(setError(error.message));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

// Thunk for canceling subscription
export const cancelSubscription = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await subscriptionService.cancelSubscription();
    // Note: The subscription status might not change immediately
    return response;
  } catch (error) {
    dispatch(setError(error.message));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};