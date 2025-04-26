import api from './api';

const cvService = {
  // Get all CVs for the current user
  getUserCVs: async () => {
    try {
      const response = await api.get('/cv');
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch CVs' };
    }
  },

  // Get a specific CV by ID
  getCV: async (id) => {
    try {
      const response = await api.get(`/cv/${id}`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch CV' };
    }
  },

  // Create a new CV
  createCV: async (cvData) => {
    try {
      const response = await api.post('/cv', cvData);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create CV' };
    }
  },

  // Update a CV
  updateCV: async (id, cvData) => {
    try {
      const response = await api.put(`/cv/${id}`, cvData);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update CV' };
    }
  },

  // Delete a CV
  deleteCV: async (id) => {
    try {
      const response = await api.delete(`/cv/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete CV' };
    }
  },

  // Analyze a CV with a job description
  analyzeCV: async (id, jobDescription) => {
    try {
      const response = await api.post(`/cv/${id}/analyze`, { jobDescription });
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to analyze CV' };
    }
  },

  // Generate PDF for a CV
  generatePDF: async (id) => {
    try {
      const response = await api.get(`/cv/${id}/pdf`, {
        responseType: 'blob',
      });
      
      // Create a blob URL for the PDF
      const url = window.URL.createObjectURL(new Blob([response.data]));
      
      // Get filename from headers if available
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'cv.pdf';
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch && filenameMatch.length === 2) {
          filename = filenameMatch[1];
        }
      }
      
      // Create a download link and trigger the download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      return true;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to generate PDF' };
    }
  },
};

export default cvService;