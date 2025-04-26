import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cvReducer from './slices/cvSlice';
import uiReducer from './slices/uiSlice';
import subscriptionReducer from './slices/subscriptionSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    cv: cvReducer,
    ui: uiReducer,
    subscription: subscriptionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;