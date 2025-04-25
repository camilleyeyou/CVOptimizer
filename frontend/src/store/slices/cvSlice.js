import { createSlice } from '@reduxjs/toolkit';
import cvService from '../../services/cvService';

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

// Thunk for fetching all CVs
export const fetchCVs = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const data = await cvService.getUserCVs();
    dispatch(setCVs(data));
    return data;
  } catch (error) {
    dispatch(setError(error.message || 'Failed to fetch CVs'));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

// Thunk for fetching a single CV
export const fetchCV = (id) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const data = await cvService.getCV(id);
    dispatch(setCurrentCV(data));
    return data;
  } catch (error) {
    dispatch(setError(error.message || 'Failed to fetch CV'));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

// Thunk for creating a new CV
export const createCV = (cvData) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const data = await cvService.createCV(cvData);
    dispatch(fetchCVs()); // Refresh the list of CVs
    return data;
  } catch (error) {
    dispatch(setError(error.message || 'Failed to create CV'));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

// Thunk for updating a CV
export const updateCV = (id, cvData) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const data = await cvService.updateCV(id, cvData);
    dispatch(setCurrentCV(data));
    dispatch(fetchCVs()); // Refresh the list of CVs
    return data;
  } catch (error) {
    dispatch(setError(error.message || 'Failed to update CV'));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

// Thunk for deleting a CV
export const deleteCV = (id) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    await cvService.deleteCV(id);
    dispatch(fetchCVs()); // Refresh the list of CVs
    return true;
  } catch (error) {
    dispatch(setError(error.message || 'Failed to delete CV'));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

// Thunk for duplicating a CV
export const duplicateCV = (id) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    await cvService.duplicateCV(id);
    dispatch(fetchCVs()); // Refresh the list of CVs
    return true;
  } catch (error) {
    dispatch(setError(error.message || 'Failed to duplicate CV'));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

// Thunk for generating a PDF
export const generatePDF = (id) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    await cvService.generatePDF(id);
    return true;
  } catch (error) {
    dispatch(setError(error.message || 'Failed to generate PDF'));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};