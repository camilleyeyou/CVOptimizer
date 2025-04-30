import api from './api';

const cvService = {
  /**
   * Get all CVs for the current user
   */
  async getUserCVs() {
    try {
      console.log("cvService: Fetching all user CVs");
      const token = localStorage.getItem('token');
      console.log("Auth token present:", !!token);
      
      const response = await api.get('/cv');
      console.log("getUserCVs response:", response.data);
      
      // Check different possible response structures
      if (Array.isArray(response.data)) {
        // Response is directly an array of CVs
        return response.data;
      } else if (response.data && Array.isArray(response.data.cvs)) {
        // Response has cvs property that is an array
        return response.data.cvs;
      } else if (response.data && typeof response.data === 'object') {
        // Try to find an array in the response
        const possibleArrays = Object.values(response.data).filter(val => Array.isArray(val));
        if (possibleArrays.length > 0) {
          // Return the largest array found (most likely to be the CVs)
          return possibleArrays.reduce((largest, current) => 
            current.length > largest.length ? current : largest
          );
        }
      }
      
      // If we couldn't find CVs in the format we expect, return empty array
      console.warn("Could not find CVs in expected format. Raw response:", response.data);
      return [];
    } catch (error) {
      console.error("cvService getUserCVs error:", error);
      throw this.handleError(error);
    }
  },

  /**
   * Get a single CV by ID
   */
  async getCV(id) {
    try {
      console.log(`cvService: Fetching CV with ID ${id}`);
      const response = await api.get(`/cv/${id}`);
      console.log("getCV response:", response.data);
      
      // Handle different response structures
      if (response.data && (response.data.title || response.data._id)) {
        // Direct CV object format
        return response.data;
      } else if (response.data && response.data.cv && (response.data.cv.title || response.data.cv._id)) {
        // Nested CV object format
        return response.data;
      } else if (response.data && typeof response.data === 'object') {
        // Try to find the CV object in the response
        const possibleCV = Object.values(response.data).find(val => 
          val && typeof val === 'object' && (val.title || val._id)
        );
        
        if (possibleCV) {
          return { cv: possibleCV };
        }
      }
      
      // If we get here, we couldn't extract a CV object
      console.warn(`No valid CV found in response for ID ${id}:`, response.data);
      throw new Error('CV not found or has invalid format');
    } catch (error) {
      console.error(`cvService getCV error for ID ${id}:`, error);
      throw this.handleError(error);
    }
  },

  /**
   * Create a new CV
   */
  async createCV(cvData) {
    try {
      console.log("cvService: Creating new CV with data:", JSON.stringify(cvData, null, 2));
      
      // Ensure the userId field is set
      if (!cvData.userId && cvData.user) {
        cvData.userId = cvData.user;
      }
      
      const response = await api.post('/cv', cvData);
      console.log("CV created successfully:", response.data);
      
      // Handle different response structures
      if (response.data && response.data._id) {
        return response.data;
      } else if (response.data && response.data.cv && response.data.cv._id) {
        return response.data.cv;
      }
      
      return response.data;
    } catch (error) {
      console.error("cvService createCV error:", error);
      const parsedError = this.handleError(error);
      console.error("Parsed error:", parsedError);
      throw parsedError;
    }
  },

  /**
   * Update an existing CV
   */
  async updateCV(id, cvData) {
    try {
      console.log(`cvService: Updating CV ${id} with data:`, JSON.stringify(cvData, null, 2));
      
      // Ensure we're sending the ID consistently
      if (!cvData._id) {
        cvData._id = id;
      }
      
      const response = await api.put(`/cv/${id}`, cvData);
      console.log("CV updated successfully:", response.data);
      
      // Handle different response structures
      if (response.data && response.data._id) {
        return response.data;
      } else if (response.data && response.data.cv && response.data.cv._id) {
        return response.data.cv;
      }
      
      return response.data;
    } catch (error) {
      console.error(`cvService updateCV error for ID ${id}:`, error);
      throw this.handleError(error);
    }
  },

  /**
   * Delete a CV
   */
  async deleteCV(id) {
    try {
      console.log(`cvService: Deleting CV ${id}`);
      const response = await api.delete(`/cv/${id}`);
      console.log("CV deleted successfully");
      return response.data;
    } catch (error) {
      console.error(`cvService deleteCV error for ID ${id}:`, error);
      throw this.handleError(error);
    }
  },

  /**
   * Generate and download a PDF of a CV
   */
  async generatePDF(id) {
    try {
      console.log(`cvService: Generating PDF for CV ${id}`);
      const response = await api.get(`/cv/${id}/download`, {
        responseType: 'blob',
        headers: {
          Accept: 'application/pdf',
        },
      });
      console.log("PDF generated successfully");
      return response.data;
    } catch (error) {
      console.error(`cvService generatePDF error for ID ${id}:`, error);
      throw this.handleError(error);
    }
  },

  /**
   * Download the generated PDF
   */
  downloadPDF(blob, filename = 'resume.pdf') {
    try {
      console.log(`cvService: Downloading PDF as ${filename}`);
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
      
      console.log("PDF downloaded successfully");
    } catch (error) {
      console.error("cvService downloadPDF error:", error);
      throw new Error(`Failed to download PDF: ${error.message}`);
    }
  },

  /**
   * Analyze a CV against a job description
   */
  async analyzeCV(id, jobDescription) {
    try {
      console.log(`cvService: Analyzing CV ${id}`);
      const response = await api.post(`/cv/${id}/analyze`, { jobDescription });
      console.log("CV analyzed successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error(`cvService analyzeCV error for ID ${id}:`, error);
      throw this.handleError(error);
    }
  },

  /**
   * Handle API errors consistently
   */
  handleError(error) {
    console.error('API Error details:', error);
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response error data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
      
      // Check for free plan limit error
      if (error.response.status === 403 && 
          error.response.data?.message?.includes('free plan limit')) {
        return new Error('Free plan limit reached. Upgrade to premium to create more CVs');
      }
      
      const message = error.response.data?.message || error.response.statusText || 'Server error';
      return new Error(message);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Request was made but no response received:', error.request);
      return new Error('No response from server. Please check your internet connection.');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error in request setup:', error.message);
      return error;
    }
  },
};

export default cvService;