import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cvs: [],
  currentCV: null,
  isLoading: false,
  error: null,
};

const cvSlice = createSlice({
  name: 'cv',
  initialState,
  reducers: {
    setCVs: (state, action) => {
      state.cvs = action.payload;
    },
    setCurrentCV: (state, action) => {
      state.currentCV = action.payload;
    },
    clearCurrentCV: (state) => {
      state.currentCV = null;
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
  setCVs,
  setCurrentCV,
  clearCurrentCV,
  setLoading,
  setError,
  clearError,
} = cvSlice.actions;

export default cvSlice.reducer;