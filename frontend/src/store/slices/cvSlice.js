import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// API URL from environment variables or default
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper function to set auth header
const setAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Async thunks
export const fetchCVs = createAsyncThunk('cv/fetchCVs', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_URL}/cv`, setAuthHeader());
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Failed to fetch CVs' });
  }
});

export const fetchCV = createAsyncThunk('cv/fetchCV', async (id, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_URL}/cv/${id}`, setAuthHeader());
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Failed to fetch CV' });
  }
});

export const createCV = createAsyncThunk(
  'cv/createCV',
  async (cvData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/cv`, cvData, setAuthHeader());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to create CV' });
    }
  }
);

export const updateCV = createAsyncThunk(
  'cv/updateCV',
  async ({ id, cvData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/cv/${id}`, cvData, setAuthHeader());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to update CV' });
    }
  }
);

export const deleteCV = createAsyncThunk('cv/deleteCV', async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`${API_URL}/cv/${id}`, setAuthHeader());
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Failed to delete CV' });
  }
});

export const analyzeCV = createAsyncThunk(
  'cv/analyzeCV',
  async ({ id, jobDescription }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/cv/${id}/analyze`,
        { jobDescription },
        setAuthHeader()
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to analyze CV' });
    }
  }
);

export const generatePDF = createAsyncThunk('cv/generatePDF', async (id, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_URL}/cv/${id}/pdf`, {
      ...setAuthHeader(),
      responseType: 'blob',
    });
    
    // Create a link and trigger download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'resume.pdf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Failed to generate PDF' });
  }
});

// Initial state
const initialState = {
  cvs: [],
  currentCV: null,
  isLoading: false,
  error: null,
  analysis: null,
  pdfGenerating: false,
};

// Slice
const cvSlice = createSlice({
  name: 'cv',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentCV: (state) => {
      state.currentCV = null;
    },
    setInitialCV: (state, action) => {
      state.currentCV = action.payload;
    },
    updateField: (state, action) => {
      const { path, value } = action.payload;
      const pathArray = path.split('.');
      
      let current = state.currentCV;
      for (let i = 0; i < pathArray.length - 1; i++) {
        current = current[pathArray[i]];
      }
      current[pathArray[pathArray.length - 1]] = value;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch CVs
      .addCase(fetchCVs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCVs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cvs = action.payload.data;
      })
      .addCase(fetchCVs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch CVs';
      })
      // Fetch CV
      .addCase(fetchCV.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCV.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentCV = action.payload.data;
      })
      .addCase(fetchCV.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch CV';
      })
      // Create CV
      .addCase(createCV.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createCV.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cvs = [...state.cvs, action.payload.data];
        state.currentCV = action.payload.data;
      })
      .addCase(createCV.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to create CV';
      })
      // Update CV
      .addCase(updateCV.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCV.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentCV = action.payload.data;
        state.cvs = state.cvs.map((cv) =>
          cv._id === action.payload.data._id ? action.payload.data : cv
        );
      })
      .addCase(updateCV.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to update CV';
      })
      // Delete CV
      .addCase(deleteCV.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteCV.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cvs = state.cvs.filter((cv) => cv._id !== action.payload);
        if (state.currentCV && state.currentCV._id === action.payload) {
          state.currentCV = null;
        }
      })
      .addCase(deleteCV.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to delete CV';
      })
      // Analyze CV
      .addCase(analyzeCV.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(analyzeCV.fulfilled, (state, action) => {
        state.isLoading = false;
        state.analysis = action.payload.data;
      })
      .addCase(analyzeCV.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to analyze CV';
      })
      // Generate PDF
      .addCase(generatePDF.pending, (state) => {
        state.pdfGenerating = true;
      })
      .addCase(generatePDF.fulfilled, (state) => {
        state.pdfGenerating = false;
      })
      .addCase(generatePDF.rejected, (state, action) => {
        state.pdfGenerating = false;
        state.error = action.payload?.message || 'Failed to generate PDF';
      });
  },
});

export const { clearError, clearCurrentCV, setInitialCV, updateField } = cvSlice.actions;

export default cvSlice.reducer;