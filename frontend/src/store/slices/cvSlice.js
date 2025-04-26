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
    const cvs = await cvService.getUserCVs();
    dispatch(setCVs(cvs));
    return cvs;
  } catch (error) {
    dispatch(setError(error.message));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

// Thunk for fetching a specific CV
export const fetchCV = (id) => async (dispatch) => {
  // Add validation to prevent API calls with undefined ID
  if (!id) {
    const errorMsg = "CV ID is undefined or missing";
    dispatch(setError(errorMsg));
    return Promise.reject(new Error(errorMsg));
  }
  
  dispatch(setLoading(true));
  try {
    const cv = await cvService.getCV(id);
    dispatch(setCurrentCV(cv));
    return cv;
  } catch (error) {
    dispatch(setError(error.message));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

// Thunk for creating a CV
export const createCV = (cvData) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const newCV = await cvService.createCV(cvData);
    dispatch(setCurrentCV(newCV));
    return newCV;
  } catch (error) {
    dispatch(setError(error.message));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

// Thunk for updating a CV
export const updateCV = (id, cvData) => async (dispatch) => {
  // Add validation to prevent API calls with undefined ID
  if (!id) {
    const errorMsg = "CV ID is undefined or missing";
    dispatch(setError(errorMsg));
    return Promise.reject(new Error(errorMsg));
  }
  
  dispatch(setLoading(true));
  try {
    const updatedCV = await cvService.updateCV(id, cvData);
    dispatch(setCurrentCV(updatedCV));
    return updatedCV;
  } catch (error) {
    dispatch(setError(error.message));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

// Thunk for deleting a CV
export const deleteCV = (id) => async (dispatch) => {
  // Add validation to prevent API calls with undefined ID
  if (!id) {
    const errorMsg = "CV ID is undefined or missing";
    dispatch(setError(errorMsg));
    return Promise.reject(new Error(errorMsg));
  }
  
  dispatch(setLoading(true));
  try {
    await cvService.deleteCV(id);
    // After deletion, fetch the updated list of CVs
    const cvs = await cvService.getUserCVs();
    dispatch(setCVs(cvs));
    return true;
  } catch (error) {
    dispatch(setError(error.message));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

// Thunk for generating a PDF
export const generatePDF = (id) => async (dispatch) => {
  // Add validation to prevent API calls with undefined ID
  if (!id) {
    const errorMsg = "CV ID is undefined or missing";
    dispatch(setError(errorMsg));
    return Promise.reject(new Error(errorMsg));
  }
  
  dispatch(setLoading(true));
  try {
    await cvService.generatePDF(id);
    return true;
  } catch (error) {
    dispatch(setError(error.message));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

// Thunk for analyzing a CV
export const analyzeCV = (id, jobDescription) => async (dispatch) => {
  // Add validation to prevent API calls with undefined ID
  if (!id) {
    const errorMsg = "CV ID is undefined or missing";
    dispatch(setError(errorMsg));
    return Promise.reject(new Error(errorMsg));
  }
  
  dispatch(setLoading(true));
  try {
    const analysis = await cvService.analyzeCV(id, jobDescription);
    // Optionally update the current CV with analysis results
    const updatedCV = await cvService.getCV(id);
    dispatch(setCurrentCV(updatedCV));
    return analysis;
  } catch (error) {
    dispatch(setError(error.message));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};