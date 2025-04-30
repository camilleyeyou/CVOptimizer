// services/PDFService.js - Enhanced with fallbacks
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
      console.log(`PDFService: Generating PDF for CV ${cvId}`);
      
      // Try multiple possible API endpoints
      const endpoints = [
        `/cv/${cvId}/download`,
        `/cv/${cvId}/pdf`,
        `/cv/download/${cvId}`,
        `/pdf/cv/${cvId}`
      ];
      
      let lastError = null;
      
      // Try each endpoint until one works
      for (const endpoint of endpoints) {
        try {
          console.log(`PDFService: Trying endpoint ${endpoint}`);
          
          // Make API request with proper response type for binary data
          const response = await api.get(endpoint, {
            responseType: 'blob', // Important: responseType must be 'blob' for binary data
            headers: {
              Accept: 'application/pdf',
            },
          });
          
          // Check if we got a valid PDF blob
          if (response.data && response.data.type && 
              (response.data.type === 'application/pdf' || 
               response.data.type.includes('pdf'))) {
            console.log(`PDFService: Successfully generated PDF using ${endpoint}`);
            return response.data;
          } else {
            console.warn(`PDFService: Received non-PDF response from ${endpoint}:`, response.data.type);
          }
        } catch (error) {
          console.warn(`PDFService: Endpoint ${endpoint} failed:`, error);
          lastError = error;
          // Continue to the next endpoint
        }
      }
      
      // If we get here, all endpoints failed
      console.error('PDFService: All PDF endpoints failed:', lastError);
      
      // Try client-side fallback
      return await this.generateClientSidePDF(cvId);
    } catch (error) {
      console.error('PDFService: PDF generation failed:', error);
      throw error;
    }
  }
  
  /**
   * Generate a PDF on the client side as a fallback
   * @param {string} cvId - The ID of the CV
   * @returns {Promise<Blob>} - A promise that resolves to a Blob containing the PDF
   */
  static async generateClientSidePDF(cvId) {
    try {
      console.log(`PDFService: Attempting client-side PDF generation for CV ${cvId}`);
      
      // Load html2pdf if not already loaded
      if (!window.html2pdf) {
        console.log("PDFService: Loading html2pdf.js library");
        await this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js');
      }
      
      // We need the CV data first
      console.log("PDFService: Fetching CV data for client-side PDF generation");
      const cvResponse = await api.get(`/cv/${cvId}`);
      const cvData = cvResponse.data;
      
      if (!cvData) {
        throw new Error('Failed to fetch CV data for PDF generation');
      }
      
      // Create a container to hold our CV HTML
      const container = document.createElement('div');
      container.id = 'pdf-container';
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '-9999px';
      document.body.appendChild(container);
      
      // Extract CV data
      const cv = cvData.cv || cvData; // Handle both possible formats
      
      // Generate HTML based on CV data
      container.innerHTML = this.generateCVHTML(cv);
      
      // Generate PDF with html2pdf
      const element = container.querySelector('.cv-container');
      const options = {
        margin: 10,
        filename: `CV-${cvId}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      
      // Generate and return the PDF as a blob
      const pdf = await window.html2pdf().from(element).set(options).outputPdf('blob');
      
      // Clean up
      document.body.removeChild(container);
      console.log("PDFService: Client-side PDF generation successful");
      
      return pdf;
    } catch (error) {
      console.error("PDFService: Client-side PDF generation failed:", error);
      throw new Error(`Failed to generate PDF: ${error.message}`);
    }
  }
  
  /**
   * Dynamically load a script
   * @param {string} src - URL of the script to load
   * @returns {Promise} - A promise that resolves when the script is loaded
   */
  static loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
      document.head.appendChild(script);
    });
  }
  
  /**
   * Generate HTML for a CV
   * @param {Object} cv - The CV data object
   * @returns {string} - HTML string
   */
  static generateCVHTML(cv) {
    // Extract data with fallbacks
    const personalInfo = cv.personalInfo || {};
    const name = personalInfo.name || personalInfo.fullName || 'Your Name';
    const title = personalInfo.title || personalInfo.jobTitle || 'Your Title';
    const email = personalInfo.email || '';
    const phone = personalInfo.phone || '';
    const location = personalInfo.address || personalInfo.location || '';
    const summary = cv.summary || '';
    
    // Handle different array structures
    const workExperience = Array.isArray(cv.workExperience) ? cv.workExperience : [];
    const education = Array.isArray(cv.education) ? cv.education : [];
    const skills = Array.isArray(cv.skills) ? cv.skills : [];
    
    // Generate HTML
    return `
      <div class="cv-container" style="padding: 30px; font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; background-color: white; color: #333;">
        <div class="cv-header" style="margin-bottom: 30px; border-bottom: 2px solid #0078d4; padding-bottom: 20px;">
          <h1 style="margin: 0; font-size: 28px; color: #0078d4;">${name}</h1>
          <p style="margin: 5px 0; font-size: 18px; color: #666;">${title}</p>
          <div style="margin-top: 10px; font-size: 14px;">
            ${email ? `<p style="margin: 2px 0;">📧 ${email}</p>` : ''}
            ${phone ? `<p style="margin: 2px 0;">📱 ${phone}</p>` : ''}
            ${location ? `<p style="margin: 2px 0;">📍 ${location}</p>` : ''}
          </div>
        </div>
        
        ${summary ? `
          <div class="cv-summary" style="margin-bottom: 25px;">
            <h2 style="font-size: 20px; color: #0078d4; margin-bottom: 10px;">Professional Summary</h2>
            <p style="margin: 0; line-height: 1.5;">${summary}</p>
          </div>
        ` : ''}
        
        ${workExperience.length > 0 ? `
          <div class="cv-work" style="margin-bottom: 25px;">
            <h2 style="font-size: 20px; color: #0078d4; margin-bottom: 15px;">Work Experience</h2>
            ${workExperience.map(job => `
              <div class="job" style="margin-bottom: 20px;">
                <h3 style="margin: 0; font-size: 18px;">${job.position || job.title || 'Position'} at ${job.company || 'Company'}</h3>
                <p style="margin: 5px 0; font-style: italic; color: #666;">${job.startDate || ''} - ${job.endDate || 'Present'}</p>
                <p style="margin: 5px 0; line-height: 1.4;">${job.description || ''}</p>
              </div>
            `).join('')}
          </div>
        ` : ''}
        
        ${education.length > 0 ? `
          <div class="cv-education" style="margin-bottom: 25px;">
            <h2 style="font-size: 20px; color: #0078d4; margin-bottom: 15px;">Education</h2>
            ${education.map(edu => `
              <div class="education" style="margin-bottom: 20px;">
                <h3 style="margin: 0; font-size: 18px;">${edu.degree || edu.qualification || 'Degree'}</h3>
                <p style="margin: 5px 0; font-weight: bold;">${edu.institution || edu.school || 'Institution'}</p>
                <p style="margin: 5px 0; font-style: italic; color: #666;">${edu.startDate || ''} - ${edu.endDate || 'Present'}</p>
                <p style="margin: 5px 0; line-height: 1.4;">${edu.description || ''}</p>
              </div>
            `).join('')}
          </div>
        ` : ''}
        
        ${skills.length > 0 ? `
          <div class="cv-skills" style="margin-bottom: 25px;">
            <h2 style="font-size: 20px; color: #0078d4; margin-bottom: 15px;">Skills</h2>
            <div style="display: flex; flex-wrap: wrap; gap: 10px;">
              ${skills.map(skill => `
                <div style="background-color: #f0f8ff; padding: 5px 10px; border-radius: 4px; font-size: 14px;">
                  ${typeof skill === 'string' ? skill : skill.name || skill.skill || ''}
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

  /**
   * Download a PDF file
   * @param {Blob} blob - The PDF blob
   * @param {string} filename - The filename for the downloaded file
   */
  static downloadPDF(blob, filename = 'resume.pdf') {
    try {
      console.log(`PDFService: Downloading PDF as ${filename}`);
      
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
      
      console.log("PDFService: PDF downloaded successfully");
      return true;
    } catch (error) {
      console.error("PDFService: PDF download failed:", error);
      throw new Error(`Failed to download PDF: ${error.message}`);
    }
  }
}

export default PDFService;