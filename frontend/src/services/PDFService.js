// services/PDFService.js
import api from './api';

/**
 * Service for handling PDF generation and downloads
 */
class PDFService {
  /**
   * Generate and get a PDF for a CV
   * @param {string} cvId - The ID of the CV
   * @returns {Promise<Blob>} - A promise that resolves to a Blob containing the PDF
   */
  static async generatePDF(cvId) {
    try {
      // Make API request with proper response type for binary data
      const response = await api.get(`/cv/${cvId}/download`, {
        responseType: 'blob', // Important: responseType must be 'blob' for binary data
        headers: {
          Accept: 'application/pdf',
        },
      });

      // Return the blob directly
      return response.data;
    } catch (error) {
      console.error('PDF generation failed:', error);
      throw error;
    }
  }

  /**
   * Download a PDF file
   * @param {Blob} blob - The PDF blob
   * @param {string} filename - The filename for the downloaded file
   */
  static downloadPDF(blob, filename = 'resume.pdf') {
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
  }
}

export default PDFService;