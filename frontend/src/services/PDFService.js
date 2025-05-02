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
      console.log(`PDFService: Starting PDF generation for CV ${cvId}`);
      
      // First try the server-side PDF generation
      try {
        console.log(`PDFService: Trying server-side PDF generation`);
        const response = await api.get(`/cv/${cvId}/download`, {
          responseType: 'blob',
          headers: {
            Accept: 'application/pdf',
          },
        });
        
        // Check if we got a valid PDF blob
        if (response.data && response.data.type && 
            (response.data.type === 'application/pdf' || 
             response.data.type.includes('pdf'))) {
          console.log(`PDFService: Server-side PDF generation successful`);
          return response.data;
        } else {
          // If response is not a PDF, throw error to trigger fallback
          console.warn(`PDFService: Server response not a valid PDF:`, response.data?.type);
          throw new Error('Invalid PDF response from server');
        }
      } catch (error) {
        console.warn(`PDFService: Server-side PDF generation failed:`, error);
        console.log(`PDFService: Falling back to client-side PDF generation`);
        
        // Fetch CV data for client-side generation
        const cvData = await this.fetchCVData(cvId);
        if (!cvData) {
          throw new Error('Could not fetch CV data for PDF generation');
        }
        
        // Generate PDF client-side
        return await this.generateClientSidePDF(cvData, cvId);
      }
    } catch (error) {
      console.error('PDFService: PDF generation failed:', error);
      throw error;
    }
  }
  
  /**
   * Fetch CV data for use in PDF generation
   * @param {string} cvId - The ID of the CV
   * @returns {Promise<Object>} - A promise that resolves to CV data
   */
  static async fetchCVData(cvId) {
    try {
      console.log(`PDFService: Fetching CV data for ${cvId}`);
      const response = await api.get(`/cv/${cvId}`);
      
      console.log(`PDFService: CV data response:`, response.data);
      
      // Handle different response structures
      if (response.data && response.data.cv) {
        // Format: { cv: {...} }
        return response.data.cv;
      } else if (response.data && (response.data._id || response.data.title)) {
        // Format: Direct CV object
        return response.data;
      } else {
        throw new Error('Invalid CV data structure');
      }
    } catch (error) {
      console.error(`PDFService: Error fetching CV data:`, error);
      throw error;
    }
  }
  
  /**
   * Generate a PDF on the client side as a fallback
   * @param {Object} cvData - The CV data object
   * @param {string} cvId - The CV ID
   * @returns {Promise<Blob>} - A promise that resolves to a Blob containing the PDF
   */
  static async generateClientSidePDF(cvData, cvId) {
    try {
      console.log(`PDFService: Starting client-side PDF generation`);
      console.log(`PDFService: CV data for PDF:`, cvData);
      
      // Load html2pdf if not already loaded
      if (!window.html2pdf) {
        console.log("PDFService: Loading html2pdf.js library");
        await this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js');
      }
      
      // Create a container to hold our CV HTML
      const container = document.createElement('div');
      container.id = 'pdf-container';
      container.style.position = 'fixed';
      container.style.left = '-9999px';
      container.style.width = '800px';  // Set fixed width for PDF
      document.body.appendChild(container);
      
      // Generate HTML based on CV data
      console.log("PDFService: Generating HTML for PDF");
      container.innerHTML = this.generateCVHTML(cvData);
      
      // Add any required styles for PDF
      const styleElement = document.createElement('style');
      styleElement.textContent = `
        #pdf-container * {
          font-family: Arial, sans-serif;
        }
        #pdf-container h1, #pdf-container h2, #pdf-container h3 {
          margin-top: 10px;
          margin-bottom: 5px;
        }
        #pdf-container p {
          margin: 5px 0;
        }
      `;
      container.appendChild(styleElement);
      
      // Generate PDF with html2pdf
      console.log("PDFService: Creating PDF from HTML");
      const element = container.querySelector('.cv-container');
      const options = {
        margin: [15, 15],
        filename: `CV-${cvId}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: true },
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
    console.log("PDFService: Processing CV data for HTML generation");
    
    // Extract data with proper structure handling and fallbacks
    const personalInfo = cv.personalInfo || {};
    const name = personalInfo.name || personalInfo.fullName || 'Your Name';
    const title = personalInfo.title || personalInfo.jobTitle || 'Your Title';
    const email = personalInfo.email || '';
    const phone = personalInfo.phone || '';
    const location = personalInfo.address || personalInfo.location || '';
    const linkedin = personalInfo.linkedin || '';
    const website = personalInfo.website || '';
    
    const summary = cv.summary || '';
    
    // Work Experience - handle different possible formats
    let workExperience = [];
    if (Array.isArray(cv.workExperience)) {
      workExperience = cv.workExperience;
    } else if (cv.work && Array.isArray(cv.work)) {
      workExperience = cv.work;
    } else if (cv.experience && Array.isArray(cv.experience)) {
      workExperience = cv.experience;
    }
    
    // Education
    let education = [];
    if (Array.isArray(cv.education)) {
      education = cv.education;
    } else if (cv.educations && Array.isArray(cv.educations)) {
      education = cv.educations;
    }
    
    // Skills
    let skills = [];
    if (Array.isArray(cv.skills)) {
      skills = cv.skills;
    } else if (cv.skill && Array.isArray(cv.skill)) {
      skills = cv.skill;
    } else if (typeof cv.skills === 'string') {
      // Handle case where skills might be a comma-separated string
      skills = cv.skills.split(',').map(s => s.trim());
    }
    
    // Languages
    let languages = [];
    if (Array.isArray(cv.languages)) {
      languages = cv.languages;
    } else if (cv.language && Array.isArray(cv.language)) {
      languages = cv.language;
    }
    
    // Certifications
    let certifications = [];
    if (Array.isArray(cv.certifications)) {
      certifications = cv.certifications;
    } else if (cv.certification && Array.isArray(cv.certification)) {
      certifications = cv.certification;
    }
    
    console.log("PDFService: Generating HTML with the following data:");
    console.log(`Name: ${name}, Title: ${title}`);
    console.log(`Work Experience: ${workExperience.length} items`);
    console.log(`Education: ${education.length} items`);
    console.log(`Skills: ${skills.length} items`);
    
    // Create HTML with proper structure
    return `
      <div class="cv-container" style="padding: 30px; font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; background-color: white; color: #333;">
        <div class="cv-header" style="margin-bottom: 30px; border-bottom: 2px solid #0078d4; padding-bottom: 20px;">
          <h1 style="margin: 0; font-size: 28px; color: #0078d4;">${name}</h1>
          <p style="margin: 5px 0; font-size: 18px; color: #666;">${title}</p>
          <div style="margin-top: 10px; font-size: 14px;">
            ${email ? `<p style="margin: 2px 0;">📧 ${email}</p>` : ''}
            ${phone ? `<p style="margin: 2px 0;">📱 ${phone}</p>` : ''}
            ${location ? `<p style="margin: 2px 0;">📍 ${location}</p>` : ''}
            ${linkedin ? `<p style="margin: 2px 0;">🔗 ${linkedin}</p>` : ''}
            ${website ? `<p style="margin: 2px 0;">🌐 ${website}</p>` : ''}
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
                <h3 style="margin: 0; font-size: 18px;">${job.position || job.title || job.role || 'Position'} at ${job.company || job.employer || job.organization || 'Company'}</h3>
                <p style="margin: 5px 0; font-style: italic; color: #666;">${job.startDate || job.from || ''} - ${job.endDate || job.to || job.current ? 'Present' : ''}</p>
                <p style="margin: 5px 0; line-height: 1.4;">${job.description || job.responsibilities || job.details || ''}</p>
              </div>
            `).join('')}
          </div>
        ` : ''}
        
        ${education.length > 0 ? `
          <div class="cv-education" style="margin-bottom: 25px;">
            <h2 style="font-size: 20px; color: #0078d4; margin-bottom: 15px;">Education</h2>
            ${education.map(edu => `
              <div class="education" style="margin-bottom: 20px;">
                <h3 style="margin: 0; font-size: 18px;">${edu.degree || edu.qualification || edu.program || edu.title || 'Degree'}</h3>
                <p style="margin: 5px 0; font-weight: bold;">${edu.institution || edu.school || edu.university || edu.college || 'Institution'}</p>
                <p style="margin: 5px 0; font-style: italic; color: #666;">${edu.startDate || edu.from || ''} - ${edu.endDate || edu.to || (edu.current ? 'Present' : '')}</p>
                <p style="margin: 5px 0; line-height: 1.4;">${edu.description || edu.details || ''}</p>
              </div>
            `).join('')}
          </div>
        ` : ''}
        
        ${skills.length > 0 ? `
          <div class="cv-skills" style="margin-bottom: 25px;">
            <h2 style="font-size: 20px; color: #0078d4; margin-bottom: 15px;">Skills</h2>
            <div style="display: flex; flex-wrap: wrap; gap: 10px;">
              ${skills.map(skill => {
                // Handle different skill formats
                const skillName = typeof skill === 'string' ? skill : (skill.name || skill.skill || 'Skill');
                return `
                  <div style="background-color: #f0f8ff; padding: 5px 10px; border-radius: 4px; font-size: 14px;">
                    ${skillName}
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        ` : ''}
        
        ${languages.length > 0 ? `
          <div class="cv-languages" style="margin-bottom: 25px;">
            <h2 style="font-size: 20px; color: #0078d4; margin-bottom: 15px;">Languages</h2>
            <ul style="margin: 0; padding-left: 20px;">
              ${languages.map(lang => {
                // Handle different language formats
                const langName = typeof lang === 'string' ? lang : (lang.name || lang.language || 'Language');
                const langLevel = typeof lang === 'string' ? '' : (lang.level || lang.proficiency || '');
                return `
                  <li style="margin-bottom: 5px;">
                    <strong>${langName}</strong>
                    ${langLevel ? ` - ${langLevel}` : ''}
                  </li>
                `;
              }).join('')}
            </ul>
          </div>
        ` : ''}
        
        ${certifications.length > 0 ? `
          <div class="cv-certifications" style="margin-bottom: 25px;">
            <h2 style="font-size: 20px; color: #0078d4; margin-bottom: 15px;">Certifications</h2>
            <ul style="margin: 0; padding-left: 20px;">
              ${certifications.map(cert => {
                // Handle different certification formats
                const certName = typeof cert === 'string' ? cert : (cert.name || cert.title || 'Certification');
                const certIssuer = typeof cert === 'string' ? '' : (cert.issuer || cert.organization || '');
                const certDate = typeof cert === 'string' ? '' : (cert.date || cert.year || '');
                return `
                  <li style="margin-bottom: 10px;">
                    <strong>${certName}</strong>
                    ${certIssuer ? ` - ${certIssuer}` : ''}
                    ${certDate ? ` (${certDate})` : ''}
                  </li>
                `;
              }).join('')}
            </ul>
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