import api from './api';

const cvService = {
  getUserCVs: async () => {
    try {
      const response = await api.get('/cvs');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch CVs' };
    }
  },

  getCV: async (id) => {
    try {
      const response = await api.get(`/cvs/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch CV' };
    }
  },

  createCV: async (cvData) => {
    try {
      const response = await api.post('/cvs', cvData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create CV' };
    }
  },

  updateCV: async (id, cvData) => {
    try {
      const response = await api.put(`/cvs/${id}`, cvData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update CV' };
    }
  },

  deleteCV: async (id) => {
    try {
      const response = await api.delete(`/cvs/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete CV' };
    }
  },

  duplicateCV: async (id) => {
    try {
      const response = await api.post(`/cvs/${id}/duplicate`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to duplicate CV' };
    }
  },

  generatePDF: async (id) => {
    try {
      const response = await api.get(`/cvs/${id}/pdf`, {
        responseType: 'blob',
      });
      
      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Get filename from header if available, otherwise use default
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'cv.pdf';
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch.length === 2) {
          filename = filenameMatch[1];
        }
      }
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return true;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to generate PDF' };
    }
  },
};

export default cvService;