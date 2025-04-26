/**
 * Formats a date string to MM/YYYY format
 * @param {string} dateString - ISO date string (e.g., '2021-05-01')
 * @returns {string} Formatted date string (e.g., 'May 2021')
 */
export const formatMonthYear = (dateString) => {
    if (!dateString) return 'Present';
  
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
    }).format(date);
  };
  
  /**
   * Formats a date string to full date format
   * @param {string} dateString - ISO date string (e.g., '2021-05-01')
   * @returns {string} Formatted date string (e.g., 'May 1, 2021')
   */
  export const formatFullDate = (dateString) => {
    if (!dateString) return '';
  
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };
  
  /**
   * Converts a date object to ISO date string (YYYY-MM-DD)
   * @param {Date} date - Date object
   * @returns {string} ISO date string (e.g., '2021-05-01')
   */
  export const toISODateString = (date) => {
    if (!date) return '';
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  };