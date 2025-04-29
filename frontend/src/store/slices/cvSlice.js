import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import cvService from '../../services/cvService';

const initialState = {
  cvs: [], // This is already correctly initialized as an array
  currentCV: null,
  isLoading: false,
  error: null,
};

const cvSlice = createSlice({
  name: 'cv',
  initialState,
  reducers: {
    setCVs: (state, action) => {
      // Ensure cvs is always an array even if the payload is invalid
      state.cvs = Array.isArray(action.payload) ? action.payload : [];
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
    // Ensure cvs is always an array even if the API returns something else
    dispatch(setCVs(Array.isArray(cvs) ? cvs : []));
    return cvs;
  } catch (error) {
    dispatch(setError(error.message));
    // Make sure to set an empty array on error
    dispatch(setCVs([]));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

// Thunk for fetching a specific CV
export const fetchCV = (id) => async (dispatch) => {
  // Make sure we don't try to fetch a CV with ID 'create'
  if (!id || id === 'create') {
    dispatch(setError("CV ID is undefined or missing"));
    return Promise.reject(new Error("CV ID is undefined or missing"));
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
export const createCV = createAsyncThunk(
  'cv/createCV',
  async (cvData, { rejectWithValue }) => {
    try {
      // Make sure the field names are correct for the API
      const formattedData = {
        ...cvData,
        personalInfo: {
          ...cvData.personalInfo,
          fullName: cvData.personalInfo.fullName || cvData.personalInfo.name || '',
          jobTitle: cvData.personalInfo.jobTitle || cvData.personalInfo.title || '',
          location: cvData.personalInfo.location || cvData.personalInfo.address || '',
        }
      };
      
      const response = await cvService.createCV(formattedData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create CV');
    }
  }
);

// Thunk for updating a CV
export const updateCV = createAsyncThunk(
  'cv/updateCV',
  async ({ id, cvData }, { rejectWithValue }) => {
    try {
      if (!id) {
        throw new Error('CV ID is undefined or missing');
      }
      
      // Make sure the field names are correct for the API
      const formattedData = {
        ...cvData,
        personalInfo: {
          ...cvData.personalInfo,
          fullName: cvData.personalInfo.fullName || cvData.personalInfo.name || '',
          jobTitle: cvData.personalInfo.jobTitle || cvData.personalInfo.title || '',
          location: cvData.personalInfo.location || cvData.personalInfo.address || '',
        }
      };
      
      const response = await cvService.updateCV(id, formattedData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update CV');
    }
  }
);

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
    // Ensure cvs is always an array
    dispatch(setCVs(Array.isArray(cvs) ? cvs : []));
    return true;
  } catch (error) {
    dispatch(setError(error.message));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

// Thunk for generating a PDF
export const generatePDF = createAsyncThunk(
  'cv/generatePDF',
  async (id, { rejectWithValue }) => {
    try {
      if (!id) {
        throw new Error("CV ID is undefined or missing");
      }
      
      await cvService.generatePDF(id);
      return true;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to generate PDF');
    }
  }
);

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