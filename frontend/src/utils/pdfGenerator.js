import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { formatMonthYear } from './dateFormatter';

/**
 * Generates a PDF from CV data
 * @param {object} cv - CV data
 * @param {string} template - Template name ('modern' or 'classic')
 * @returns {Blob} PDF file as Blob
 */
export const generatePDF = (cv, template = 'modern') => {
  // Create a new PDF document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });
  
  // Set default font
  const fontFamily = template === 'modern' ? 'helvetica' : 'times';
  doc.setFont(fontFamily);
  
  // Page dimensions
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - (margin * 2);
  
  // Current Y position
  let y = margin;
  
  // Helper function to add text with word wrap
  const addWrappedText = (text, x, y, maxWidth, fontSize, fontStyle = 'normal') => {
    doc.setFontSize(fontSize);
    doc.setFont(fontFamily, fontStyle);
    
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y);
    
    return y + (lines.length * (fontSize * 0.352778)); // Approximate line height
  };
  
  // Helper function to add a section header
  const addSectionHeader = (title) => {
    doc.setFont(fontFamily, 'bold');
    doc.setFontSize(12);
    
    if (template === 'modern') {
      doc.setTextColor(41, 98, 255); // Blue color for modern template
    } else {
      doc.setTextColor(0);
    }
    
    doc.text(title.toUpperCase(), margin, y);
    y += 5;
    
    // Add divider line
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    
    y += 5;
    doc.setTextColor(0);
  };
  
  // Add personal info header
  doc.setFont(fontFamily, 'bold');
  doc.setFontSize(18);
  const nameWidth = doc.getStringUnitWidth(cv.personalInfo.name) * 18 / doc.internal.scaleFactor;
  doc.text(cv.personalInfo.name, (pageWidth - nameWidth) / 2, y);
  y += 8;
  
  // Add job title
  if (cv.personalInfo.title) {
    doc.setFont(fontFamily, 'normal');
    doc.setFontSize(12);
    if (template === 'modern') {
      doc.setTextColor(41, 98, 255); // Blue color for modern template
    }
    const titleWidth = doc.getStringUnitWidth(cv.personalInfo.title) * 12 / doc.internal.scaleFactor;
    doc.text(cv.personalInfo.title, (pageWidth - titleWidth) / 2, y);
    doc.setTextColor(0);
    y += 8;
  }
  
  // Add contact info
  doc.setFontSize(9);
  doc.setFont(fontFamily, 'normal');
  
  let contactText = '';
  if (cv.personalInfo.address) contactText += cv.personalInfo.address;
  if (cv.personalInfo.phone) {
    if (contactText) contactText += ' • ';
    contactText += cv.personalInfo.phone;
  }
  if (cv.personalInfo.email) {
    if (contactText) contactText += ' • ';
    contactText += cv.personalInfo.email;
  }
  
  const contactWidth = doc.getStringUnitWidth(contactText) * 9 / doc.internal.scaleFactor;
  doc.text(contactText, (pageWidth - contactWidth) / 2, y);
  y += 5;
  
  // Add web presence
  let webText = '';
  if (cv.personalInfo.linkedin) webText += cv.personalInfo.linkedin;
  if (cv.personalInfo.website) {
    if (webText) webText += ' • ';
    webText += cv.personalInfo.website;
  }
  
  if (webText) {
    const webWidth = doc.getStringUnitWidth(webText) * 9 / doc.internal.scaleFactor;
    doc.text(webText, (pageWidth - webWidth) / 2, y);
    y += 10;
  } else {
    y += 5;
  }
  
  // Add professional summary if exists
  if (cv.summary) {
    addSectionHeader('Professional Summary');
    y = addWrappedText(cv.summary, margin, y, contentWidth, 10);
    y += 10;
  }
  
  // Add work experience if exists
  if (cv.workExperience && cv.workExperience.length > 0) {
    addSectionHeader('Work Experience');
    
    cv.workExperience.forEach((job, index) => {
      // Job title and company
      doc.setFont(fontFamily, 'bold');
      doc.setFontSize(11);
      doc.text(`${job.position}${job.company ? `, ${job.company}` : ''}`, margin, y);
      
      // Date range
      const dateRange = `${formatMonthYear(job.startDate)} - ${job.endDate ? formatMonthYear(job.endDate) : 'Present'}`;
      const dateWidth = doc.getStringUnitWidth(dateRange) * 10 / doc.internal.scaleFactor;
      
      doc.setFont(fontFamily, 'italic');
      doc.setFontSize(10);
      doc.text(dateRange, pageWidth - margin - dateWidth, y);
      
      y += 5;
      
      // Location if available
      if (job.location) {
        doc.setFont(fontFamily, 'normal');
        doc.setFontSize(10);
        doc.text(job.location, margin, y);
        y += 5;
      }
      
      // Job description if available
      if (job.description) {
        y = addWrappedText(job.description, margin, y, contentWidth, 10);
      }
      
      // Add spacing between jobs
      y += index < cv.workExperience.length - 1 ? 8 : 10;
    });
  }
  
  // Add education if exists
  if (cv.education && cv.education.length > 0) {
    addSectionHeader('Education');
    
    cv.education.forEach((edu, index) => {
      // Degree and institution
      doc.setFont(fontFamily, 'bold');
      doc.setFontSize(11);
      doc.text(`${edu.degree}${edu.institution ? `, ${edu.institution}` : ''}`, margin, y);
      
      // Date range
      const dateRange = `${formatMonthYear(edu.startDate)} - ${edu.endDate ? formatMonthYear(edu.endDate) : 'Present'}`;
      const dateWidth = doc.getStringUnitWidth(dateRange) * 10 / doc.internal.scaleFactor;
      
      doc.setFont(fontFamily, 'italic');
      doc.setFontSize(10);
      doc.text(dateRange, pageWidth - margin - dateWidth, y);
      
      y += 5;
      
      // Location if available
      if (edu.location) {
        doc.setFont(fontFamily, 'normal');
        doc.setFontSize(10);
        doc.text(edu.location, margin, y);
        y += 5;
      }
      
      // Education description if available
      if (edu.description) {
        y = addWrappedText(edu.description, margin, y, contentWidth, 10);
      }
      
      // Add spacing between education entries
      y += index < cv.education.length - 1 ? 8 : 10;
    });
  }
  
  // Add skills if exists
  if (cv.skills && cv.skills.length > 0) {
    addSectionHeader('Skills');
    
    if (template === 'modern') {
      // Modern template: skills in columns
      const skillsPerColumn = Math.ceil(cv.skills.length / 3);
      const columns = [];
      
      for (let i = 0; i < 3; i++) {
        const columnSkills = cv.skills.slice(i * skillsPerColumn, (i + 1) * skillsPerColumn);
        if (columnSkills.length > 0) {
          columns.push(columnSkills);
        }
      }
      
      const columnWidth = contentWidth / columns.length;
      let maxY = y;
      
      columns.forEach((column, colIndex) => {
        let columnY = y;
        
        column.forEach((skill) => {
          doc.setFont(fontFamily, 'normal');
          doc.setFontSize(10);
          
          let skillText = skill.name;
          if (skill.level) {
            skillText += ` (${skill.level})`;
          }
          
          columnY = addWrappedText(skillText, margin + (colIndex * columnWidth), columnY, columnWidth - 5, 10);
          columnY += 4;
        });
        
        maxY = Math.max(maxY, columnY);
      });
      
      y = maxY;
    } else {
      // Classic template: skills in a paragraph
      const skillsList = cv.skills.map(skill => skill.name).join(', ');
      y = addWrappedText(skillsList, margin, y, contentWidth, 10);
    }
    
    y += 10;
  }
  
  // Add certifications if exists
  if (cv.certifications && cv.certifications.length > 0) {
    addSectionHeader('Certifications');
    
    cv.certifications.forEach((cert, index) => {
      doc.setFont(fontFamily, 'normal');
      doc.setFontSize(10);
      
      let certText = cert.name;
      if (cert.issuer) {
        certText += `, ${cert.issuer}`;
      }
      if (cert.date) {
        certText += ` (${formatMonthYear(cert.date)})`;
      }
      
      y = addWrappedText(certText, margin, y, contentWidth, 10);
      
      // Add spacing between certifications
      y += index < cv.certifications.length - 1 ? 4 : 10;
    });
  }
  
  // Add languages if exists
  if (cv.languages && cv.languages.length > 0) {
    addSectionHeader('Languages');
    
    const languagesList = cv.languages.map(lang => `${lang.name} (${lang.level})`).join(', ');
    y = addWrappedText(languagesList, margin, y, contentWidth, 10);
  }
  
  // Save the PDF
  return doc.output('blob');
};

export default generatePDF;