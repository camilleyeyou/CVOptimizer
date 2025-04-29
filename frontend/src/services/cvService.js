// services/cvService.js
import api from './api';

const cvService = {
  /**
   * Get all CVs for the current user
   */
  async getUserCVs() {
    try {
      const response = await api.get('/cv');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  /**
   * Get a single CV by ID
   */
  async getCV(id) {
    try {
      const response = await api.get(`/cv/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  /**
   * Create a new CV
   */
  async createCV(cvData) {
    try {
      const response = await api.post('/cv', cvData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  /**
   * Update an existing CV
   */
  async updateCV(id, cvData) {
    try {
      const response = await api.put(`/cv/${id}`, cvData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  /**
   * Delete a CV
   */
  async deleteCV(id) {
    try {
      const response = await api.delete(`/cv/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  /**
   * Generate and download a PDF of a CV
   * This method now returns a blob that can be downloaded
   */
  async generatePDF(id) {
    try {
      const response = await api.get(`/cv/${id}/download`, {
        responseType: 'blob', // Critical for binary data
        headers: {
          Accept: 'application/pdf',
        },
      });
      
      return response.data; // Return the blob directly
    } catch (error) {
      throw this.handleError(error);
    }
  },

  /**
   * Download the generated PDF
   * New helper method to handle the actual download process
   */
  downloadPDF(blob, filename = 'resume.pdf') {
    // Create a URL for the blob
    const url = window.URL.createObjectURL(blob);
    
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    
    // Append to the document, click, and clean up
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    }, 100);
  },

  /**
   * Analyze a CV against a job description
   */
  async analyzeCV(id, jobDescription) {
    try {
      const response = await api.post(`/cv/${id}/analyze`, { jobDescription });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  /**
   * Handle API errors consistently
   */
  handleError(error) {
    console.error('API Error:', error);
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const message = error.response.data?.message || error.response.statusText || 'Server error';
      return new Error(message);
    } else if (error.request) {
      // The request was made but no response was received
      return new Error('No response from server. Please check your internet connection.');
    } else {
      // Something happened in setting up the request that triggered an Error
      return error;
    }
  },
};

export default cvService;